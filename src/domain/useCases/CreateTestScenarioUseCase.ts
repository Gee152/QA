import { inject, injectable } from "tsyringe"
import { TestScenario } from "../entities/TestScenario"
import { ITestScenarioRepository } from "../repositories/ITestScenarioRepository"
import { IUserRepository } from "../repositories/IUserRepository"
import { AppError } from "../../shared/errors/AppError"
import { CreateTestScenarioUseCaseValidate } from "./validate/TestScenarioValidate"

export interface ICreateTestScenarioRequest {
    name: string
    description: string
    priority: number
    createdByUserId: string
}

/**
 * Caso de uso responsável pela criação de novos cenários de teste.
 * Valida a existência do usuário criador antes da persistência.
 */
@injectable()
export class CreateTestScenarioUseCase {
    constructor(
        @inject("TestScenarioRepository")
        private testScenarioRepository: ITestScenarioRepository,
        @inject("UserRepository")
        private userRepository: IUserRepository
    ) { }

    /**
     * Executa a criação de um cenário de teste.
     * @param name - Nome do cenário.
     * @param description - Descrição detalhada.
     * @param priority - Prioridade do teste.
     * @param createdByUserId - ID do usuário responsável pela criação.
     * @returns O cenário de teste criado.
     * @throws AppError se o usuário criador não for encontrado.
     */
    async execute({ name, description, priority, createdByUserId }: ICreateTestScenarioRequest): Promise<TestScenario> {
        const validate = new CreateTestScenarioUseCaseValidate()
        const validationError = validate.createTestScenario({ name, description, priority, createdByUserId })
        if (validationError) throw new AppError(validationError, 400)

        const user = await this.userRepository.findById(createdByUserId)

        if (!user) {
            throw new AppError("User not found", 404)
        }

        const testScenario = new TestScenario()
        testScenario.name = name
        testScenario.description = description
        testScenario.priority = priority
        testScenario.createdByUserId = createdByUserId
        testScenario.status = "Pending"

        return this.testScenarioRepository.save(testScenario)
    }
}
