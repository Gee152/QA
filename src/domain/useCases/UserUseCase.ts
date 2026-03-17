import { inject, injectable } from "tsyringe"
import { User } from "../entities/User"
import { IUserRepository } from "../repositories/IUserRepository"
import { AppError } from "../../shared/errors/AppError"
import { hash, compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import {
    CreateUserUseCaseValidate,
    GetUserUseCaseValidate,
    UpdateUserUseCaseValidate,
    DeleteUserUseCaseValidate,
    AuthenticateUserUseCaseValidate
} from "./validate/UserValidate"

export interface ICreateUserRequest {
    username: string
    email: string
    password: string
}

export interface IGetUserRequest {
    id: string
}

export interface IUpdateUserRequest {
    id: string
    username?: string
    email?: string
}

export interface IDeleteUserRequest {
    id: string
}

export interface IAuthenticateUserRequest {
    email: string
    password: string
}

export interface IAuthenticateUserResponse {
    token: string
    user: {
        id: string
        username: string
        email: string
    }
}

/**
 * Caso de uso unificado que agrupa todas as lógicas de negócio relacionadas ao Usuário.
 */
@injectable()
export class UserUseCase {
    constructor(
        @inject("UserRepository")
        private userRepository: IUserRepository
    ) { }

    /**
     * POST /users
     */
    async create({ username, email, password }: ICreateUserRequest): Promise<User> {
        const validate = new CreateUserUseCaseValidate()
        const validationError = validate.createUser({ username, email, password })
        if (validationError) throw new AppError(validationError, 400)

        const userAlreadyExists = await this.userRepository.findByEmail(email)
        if (userAlreadyExists) {
            throw new AppError("User already exists")
        }

        const passwordHash = await hash(password, 8)

        const user = new User()
        user.username = username
        user.email = email
        user.passwordHash = passwordHash

        return this.userRepository.save(user)
    }

    /**
     * GET /users/:id
     */
    async get({ id }: IGetUserRequest): Promise<Omit<User, "passwordHash">> {
        const validate = new GetUserUseCaseValidate()
        const validationError = validate.getUser(id)
        if (validationError) throw new AppError(validationError, 400)

        const user = await this.userRepository.findById(id)
        if (!user) throw new AppError("Usuário não encontrado.", 404)

        const { passwordHash, ...safeUser } = user
        return safeUser
    }

    /**
     * GET /users
     */
    async list(): Promise<Omit<User, "passwordHash">[]> {
        const users = await this.userRepository.findAll()
        return users.map(({ passwordHash, ...safe }) => safe)
    }

    /**
     * PUT /users/:id
     */
    async update({ id, username, email }: IUpdateUserRequest): Promise<Omit<User, "passwordHash">> {
        const validate = new UpdateUserUseCaseValidate()
        const validationError = validate.updateUser({ id, username, email })
        if (validationError) throw new AppError(validationError, 400)

        const user = await this.userRepository.findById(id)
        if (!user) throw new AppError("Usuário não encontrado.", 404)

        if (email && email !== user.email) {
            const emailInUse = await this.userRepository.findByEmail(email)
            if (emailInUse) throw new AppError("E-mail já está em uso.", 409)
        }

        const updated = await this.userRepository.update(id, { username, email })
        if (!updated) throw new AppError("Falha ao atualizar usuário.", 500)

        const { passwordHash, ...safeUser } = updated
        return safeUser
    }

    /**
     * DELETE /users/:id
     */
    async delete({ id }: IDeleteUserRequest): Promise<void> {
        const validate = new DeleteUserUseCaseValidate()
        const validationError = validate.deleteUser(id)
        if (validationError) throw new AppError(validationError, 400)

        const user = await this.userRepository.findById(id)
        if (!user) throw new AppError("Usuário não encontrado.", 404)

        await this.userRepository.delete(id)
    }

    /**
     * POST /users/session
     */
    async authenticate({ email, password }: IAuthenticateUserRequest): Promise<IAuthenticateUserResponse> {
        const validate = new AuthenticateUserUseCaseValidate()
        const validationError = validate.authenticate({ email, password })
        if (validationError) throw new AppError(validationError, 400)

        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new AppError("E-mail ou senha inválidos.", 401)

        const passwordMatch = await compare(password, user.passwordHash)
        if (!passwordMatch) throw new AppError("E-mail ou senha inválidos.", 401)

        const secret = process.env.JWT_SECRET
        if (!secret) throw new AppError("Configuração de token ausente.", 500)

        const token = sign(
            { id: user.id, username: user.username, email: user.email },
            secret,
            { expiresIn: process.env.JWT_EXPIRES_IN ? String(process.env.JWT_EXPIRES_IN) : "1d" } as any
        )

        return {
            token,
            user: { id: user.id, username: user.username, email: user.email }
        }
    }
}
