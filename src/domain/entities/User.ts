/**
 * Entidade que representa um usuário no sistema.
 * Responsável por armazenar as informações de identificação e autenticação.
 */
export class User {
    id: string
    username: string
    email: string
    passwordHash: string
    createdAt: Date
    updatedAt: Date
}
