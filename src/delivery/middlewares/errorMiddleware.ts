import { NextFunction, Request, Response } from "express"
import { AppError } from "../../shared/errors/AppError"

/**
 * Middleware de erro global para o Express.
 * Captura exceções da aplicação e as transforma em respostas HTTP padronizadas.
 * Diferencia entre erros controlados (AppError) e erros internos não previstos.
 */
export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message
        })
    }

    return res.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`
    })
}
