import { inject, injectable } from "tsyringe"
import { TestResult } from "../entities/TestResult"
import { ITestResultRepository } from "../repositories/ITestResultRepository"
import { ITestScenarioRepository } from "../repositories/ITestScenarioRepository"
import { IUserRepository } from "../repositories/IUserRepository"
import { AppError } from "../../shared/errors/AppError"
import { CreateTestResultUseCaseValidate } from "./validate/TestResultValidate"

export interface ICreateTestResultRequest {
    scenarioId: string
    resultStatus: 'Success' | 'Failure' | 'Skipped'
    durationMs: number
    logs: string
    executedByUserId: string
}

/**
 * Caso de uso responsável pelo registro de resultados de execuções de teste.
 * Garante a integridade entre o resultado, o cenário e o usuário que executou.
 */
@injectable()
export class CreateTestResultUseCase {
    constructor(
        @inject("TestResultRepository")
        private testResultRepository: ITestResultRepository,
        @inject("TestScenarioRepository")
        private testScenarioRepository: ITestScenarioRepository,
        @inject("UserRepository")
        private userRepository: IUserRepository
    ) { }

    /**
     * Executa o registro de um resultado de teste.
     * @param scenarioId - ID do cenário de teste executado.
     * @param resultStatus - Status final (Sucesso, Falha, Ignorado).
     * @param durationMs - Tempo total da execução em milissegundos.
     * @param logs - Saída detalhada da execução.
     * @param executedByUserId - ID do usuário que realizou o teste.
     * @returns O resultado do teste registrado.
     * @throws AppError se o usuário ou o cenário não forem encontrados.
     */
    async execute({ scenarioId, resultStatus, durationMs, logs, executedByUserId }: ICreateTestResultRequest): Promise<TestResult> {
        const validate = new CreateTestResultUseCaseValidate()
        const validationError = validate.createTestResult({ scenarioId, resultStatus, durationMs, logs, executedByUserId })
        if (validationError) throw new AppError(validationError, 400)

        const user = await this.userRepository.findById(executedByUserId)
        if (!user) {
            throw new AppError("User not found", 404)
        }

        const scenario = await this.testScenarioRepository.findById(scenarioId)
        if (!scenario) {
            throw new AppError("Scenario not found", 404)
        }

        const testResult = new TestResult()
        testResult.scenarioId = scenarioId
        testResult.resultStatus = resultStatus
        testResult.durationMs = durationMs
        testResult.logs = logs
        testResult.executedByUserId = executedByUserId

        return this.testResultRepository.save(testResult)
    }
}
