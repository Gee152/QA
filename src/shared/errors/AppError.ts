/**
 * Classe de erro customizada para o domínio da aplicação.
 * Utilizada para lançar exceções controladas com mensagens e códigos HTTP específicos.
 */
export class AppError {
    public readonly message: string
    public readonly statusCode: number

    constructor(message: string, statusCode = 400) {
        this.message = message
        this.statusCode = statusCode
    }
}
