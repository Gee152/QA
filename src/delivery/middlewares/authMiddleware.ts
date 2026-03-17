import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import { AppError } from "../../shared/errors/AppError"

interface IJWTPayload {
    id: string
    username: string
    email: string
    iat: number
    exp: number
}

/**
 * Middleware de autenticação JWT.
 * Valida o Bearer token do header Authorization e injeta o payload em req.user.
 * Retorna 401 se o token estiver ausente, inválido ou expirado.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        throw new AppError("Token não informado.", 401)
    }

    const [scheme, token] = authHeader.split(" ")

    if (scheme !== "Bearer" || !token) {
        throw new AppError("Formato de token inválido. Use: Bearer <token>", 401)
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new AppError("Configuração de token ausente no servidor.", 500)
    }

    try {
        const payload = verify(token, secret) as IJWTPayload
        req.user = { id: payload.id, username: payload.username, email: payload.email }
        next()
    } catch {
        throw new AppError("Token inválido ou expirado.", 401)
    }
}
