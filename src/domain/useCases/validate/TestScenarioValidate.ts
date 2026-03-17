import { ICreateTestScenarioRequest } from "../CreateTestScenarioUseCase"
import { ICreateTestScenarioUseCaseValidate } from "./ITestScenarioValidate"
import { checkStringEmpty, checkNumberEmpty, checkNumberRange, checkUUID } from "../../../shared/utils/validate"

export class CreateTestScenarioUseCaseValidate implements ICreateTestScenarioUseCaseValidate {
    createTestScenario(req: ICreateTestScenarioRequest): string | null {
        if (checkStringEmpty(req.name)) return "O nome do cenário não pode ser vazio."

        if (checkStringEmpty(req.description)) return "A descrição do cenário não pode ser vazia."

        if (checkNumberEmpty(req.priority)) return "A prioridade não pode ser vazia."

        if (checkNumberRange(req.priority, 1, 5)) return "A prioridade deve ser um valor entre 1 e 5."

        if (checkStringEmpty(req.createdByUserId)) return "O ID do usuário criador não pode ser vazio."

        if (checkUUID(req.createdByUserId)) return "O ID do usuário criador não é um UUID válido."

        return null
    }
}
