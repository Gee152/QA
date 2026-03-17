import { User } from "../entities/User"

export interface IUserRepository {
    findById(id: string): Promise<User | undefined>
    findAll(): Promise<User[]>
    findByEmail(email: string): Promise<User | undefined>
    save(user: User): Promise<User>
    update(id: string, data: { username?: string; email?: string }): Promise<User | undefined>
    delete(id: string): Promise<void>
}
