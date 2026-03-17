import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateTestResultUseCase } from "../../domain/useCases/CreateTestResultUseCase"

/**
 * Controlador responsável por lidar com as requisições HTTP para resultados de teste.
 */
export class TestResultController {
    /**
     * Endpoint para criação de um novo resultado de teste via POST.
     * @param request - Requisição Express com scenarioId, resultStatus, durationMs, logs e executedByUserId no corpo.
     * @param response - Resposta JSON com o resultado criado e status 201.
     */
    async create(request: Request, response: Response): Promise<Response> {
        const { scenarioId, resultStatus, durationMs, logs, executedByUserId } = request.body
        
        const createTestResultUseCase = container.resolve(CreateTestResultUseCase)
        
        const result = await createTestResultUseCase.execute({
            scenarioId,
            resultStatus,
            durationMs,
            logs,
            executedByUserId
        })
        
        return response.status(201).json(result)
    }
}
