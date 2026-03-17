import { ICreateTestScenarioRequest } from "../CreateTestScenarioUseCase"

/**
 * Interface de validação para o caso de uso de criação de cenário de teste.
 */
export interface ICreateTestScenarioUseCaseValidate {
    createTestScenario(req: ICreateTestScenarioRequest): string | null
}
