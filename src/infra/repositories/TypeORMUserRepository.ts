import { injectable } from "tsyringe"
import { Repository } from "typeorm"
import { AppDataSource } from "../../data-source"
import { User as TypeORMUser } from "../database/entities/User"
import { User as DomainUser } from "../../domain/entities/User"
import { IUserRepository } from "../../domain/repositories/IUserRepository"

/**
 * Implementação do repositório de usuários utilizando TypeORM.
 */
@injectable()
export class TypeORMUserRepository implements IUserRepository {
    private repository: Repository<TypeORMUser>

    constructor() {
        this.repository = AppDataSource.getRepository(TypeORMUser)
    }

    async findById(id: string): Promise<DomainUser | undefined> {
        const user = await this.repository.findOne({ where: { id } })
        return user ? this.toDomain(user) : undefined
    }

    async findAll(): Promise<DomainUser[]> {
        const users = await this.repository.find()
        return users.map(u => this.toDomain(u))
    }

    async findByEmail(email: string): Promise<DomainUser | undefined> {
        const user = await this.repository.findOne({ where: { email } })
        return user ? this.toDomain(user) : undefined
    }

    async save(user: DomainUser): Promise<DomainUser> {
        const typeOrmUser = this.toTypeORM(user)
        const savedUser = await this.repository.save(typeOrmUser)
        return this.toDomain(savedUser)
    }

    async update(id: string, data: { username?: string; email?: string }): Promise<DomainUser | undefined> {
        await this.repository.update(id, data)
        return this.findById(id)
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id)
    }

    private toDomain(typeOrmUser: TypeORMUser): DomainUser {
        const user = new DomainUser()
        Object.assign(user, typeOrmUser)
        return user
    }

    private toTypeORM(domainUser: DomainUser): TypeORMUser {
        const user = new TypeORMUser()
        Object.assign(user, domainUser)
        return user
    }
}
