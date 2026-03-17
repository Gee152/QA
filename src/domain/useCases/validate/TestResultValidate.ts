import { ICreateTestResultRequest } from "../CreateTestResultUseCase"
import { ICreateTestResultUseCaseValidate } from "./ITestResultValidate"
import { checkStringEmpty, checkNumberEmpty, checkNumberRange, checkEnumValue, checkUUID } from "../../../shared/utils/validate"

const VALID_RESULT_STATUSES = ['Success', 'Failure', 'Skipped'] as const

export class CreateTestResultUseCaseValidate implements ICreateTestResultUseCaseValidate {
    createTestResult(req: ICreateTestResultRequest): string | null {
        if (checkStringEmpty(req.scenarioId)) return "O ID do cenário não pode ser vazio."

        if (checkUUID(req.scenarioId)) return "O ID do cenário não é um UUID válido."

        if (checkStringEmpty(req.resultStatus)) return "O status do resultado não pode ser vazio."

        if (checkEnumValue(req.resultStatus, [...VALID_RESULT_STATUSES])) {
            return "O status deve ser 'Success', 'Failure' ou 'Skipped'."
        }

        if (checkNumberEmpty(req.durationMs)) return "A duração não pode ser vazia."

        if (checkNumberRange(req.durationMs, 0, Number.MAX_SAFE_INTEGER)) return "A duração deve ser um valor positivo em milissegundos."

        if (checkStringEmpty(req.logs)) return "Os logs não podem ser vazios."

        if (checkStringEmpty(req.executedByUserId)) return "O ID do usuário executor não pode ser vazio."

        if (checkUUID(req.executedByUserId)) return "O ID do usuário executor não é um UUID válido."

        return null
    }
}
