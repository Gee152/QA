import { Request, Response } from "express"
import { container } from "tsyringe"
import { UserUseCase } from "../../domain/useCases/UserUseCase"

/**
 * Controlador responsável por gerenciar todas as requisições HTTP do recurso User.
 * Utiliza o UserUseCase unificado para gerenciar listagem, criação, atualização e exclusões.
 */
export class UserController {
    /**
     * POST /users
     * Cria um novo usuário. Retorna o usuário sem passwordHash.
     */
    async create(request: Request, response: Response): Promise<Response> {
        const { username, email, password } = request.body
        const useCase = container.resolve(UserUseCase)
        const user = await useCase.create({ username, email, password })
        const { passwordHash, ...safeUser } = user as any
        return response.status(201).json(safeUser)
    }

    /**
     * POST /users/session
     * Autentica o usuário com email + senha e retorna um JWT.
     */
    async authenticate(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body
        const useCase = container.resolve(UserUseCase)
        const result = await useCase.authenticate({ email, password })
        return response.status(200).json(result)
    }

    /**
     * GET /users
     * Lista todos os usuários (requer token JWT).
     */
    async list(request: Request, response: Response): Promise<Response> {
        const useCase = container.resolve(UserUseCase)
        const users = await useCase.list()
        return response.status(200).json(users)
    }

    /**
     * GET /users/:id
     * Busca um usuário pelo ID (requer token JWT).
     */
    async get(request: Request, response: Response): Promise<Response> {
        const { id } = request.params as { id: string }
        const useCase = container.resolve(UserUseCase)
        const user = await useCase.get({ id })
        return response.status(200).json(user)
    }

    /**
     * PUT /users/:id
     * Atualiza username e/ou email de um usuário (requer token JWT).
     */
    async update(request: Request, response: Response): Promise<Response> {
        const { id } = request.params as { id: string }
        const { username, email } = request.body
        const useCase = container.resolve(UserUseCase)
        const user = await useCase.update({ id, username, email })
        return response.status(200).json(user)
    }

    /**
     * DELETE /users/:id
     * Remove permanentemente um usuário pelo ID (requer token JWT).
     */
    async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params as { id: string }
        const useCase = container.resolve(UserUseCase)
        await useCase.delete({ id })
        return response.status(204).send()
    }
}
