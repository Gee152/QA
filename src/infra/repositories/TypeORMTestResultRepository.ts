import { injectable } from "tsyringe"
import { Repository } from "typeorm"
import { AppDataSource } from "../../data-source"
import { TestResult as TypeORMTestResult } from "../database/entities/TestResult"
import { TestResult as DomainTestResult } from "../../domain/entities/TestResult"
import { ITestResultRepository } from "../../domain/repositories/ITestResultRepository"

/**
 * Implementação do repositório de resultados de teste utilizando TypeORM.
 * Armazena e recupera históricos de execuções de teste do banco de dados.
 */
@injectable()
export class TypeORMTestResultRepository implements ITestResultRepository {
    private repository: Repository<TypeORMTestResult>

    constructor() {
        this.repository = AppDataSource.getRepository(TypeORMTestResult)
    }

    async findById(id: string): Promise<DomainTestResult | undefined> {
        const result = await this.repository.findOne({ where: { id } })
        return result ? this.toDomain(result) : undefined
    }

    async findAllByScenarioId(scenarioId: string): Promise<DomainTestResult[]> {
        const results = await this.repository.find({ where: { scenarioId } })
        return results.map(r => this.toDomain(r))
    }

    async save(testResult: DomainTestResult): Promise<DomainTestResult> {
        const typeOrmResult = this.toTypeORM(testResult)
        const savedResult = await this.repository.save(typeOrmResult)
        return this.toDomain(savedResult)
    }

    private toDomain(typeOrmResult: TypeORMTestResult): DomainTestResult {
        const result = new DomainTestResult()
        Object.assign(result, typeOrmResult)
        return result
    }

    private toTypeORM(domainTestResult: DomainTestResult): TypeORMTestResult {
        const result = new TypeORMTestResult()
        Object.assign(result, domainTestResult)
        return result
    }
}
