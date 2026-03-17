import { injectable } from "tsyringe"
import { Repository } from "typeorm"
import { AppDataSource } from "../../data-source"
import { TestScenario as TypeORMTestScenario } from "../database/entities/TestScenario"
import { TestScenario as DomainTestScenario } from "../../domain/entities/TestScenario"
import { ITestScenarioRepository } from "../../domain/repositories/ITestScenarioRepository"

/**
 * Implementação do repositório de cenários de teste utilizando TypeORM.
 * Gerencia a persistência de definições de casos de teste.
 */
@injectable()
export class TypeORMTestScenarioRepository implements ITestScenarioRepository {
    private repository: Repository<TypeORMTestScenario>

    constructor() {
        this.repository = AppDataSource.getRepository(TypeORMTestScenario)
    }

    async findById(id: string): Promise<DomainTestScenario | undefined> {
        const scenario = await this.repository.findOne({ where: { id } })
        return scenario ? this.toDomain(scenario) : undefined
    }

    async findAll(): Promise<DomainTestScenario[]> {
        const scenarios = await this.repository.find()
        return scenarios.map(s => this.toDomain(s))
    }

    async save(testScenario: DomainTestScenario): Promise<DomainTestScenario> {
        const typeOrmScenario = this.toTypeORM(testScenario)
        const savedScenario = await this.repository.save(typeOrmScenario)
        return this.toDomain(savedScenario)
    }

    private toDomain(typeOrmScenario: TypeORMTestScenario): DomainTestScenario {
        const scenario = new DomainTestScenario()
        Object.assign(scenario, typeOrmScenario)
        return scenario
    }

    private toTypeORM(domainTestScenario: DomainTestScenario): TypeORMTestScenario {
        const scenario = new TypeORMTestScenario()
        Object.assign(scenario, domainTestScenario)
        return scenario
    }
}
