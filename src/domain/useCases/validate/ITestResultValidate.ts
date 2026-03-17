import { ICreateTestResultRequest } from "../CreateTestResultUseCase"

/**
 * Interface de validação para o caso de uso de criação de resultado de teste.
 */
export interface ICreateTestResultUseCaseValidate {
    createTestResult(req: ICreateTestResultRequest): string | null
}
