import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateTestScenarioUseCase } from "../../domain/useCases/CreateTestScenarioUseCase"

/**
 * Controlador responsável por lidar com as requisições HTTP para cenários de teste.
 */
export class TestScenarioController {
    /**
     * Endpoint para criação de um novo cenário de teste via POST.
     * @param request - Requisição Express com name, description, priority e createdByUserId no corpo.
     * @param response - Resposta JSON com o cenário criado e status 201.
     */
    async create(request: Request, response: Response): Promise<Response> {
        const { name, description, priority, createdByUserId } = request.body
        
        const createTestScenarioUseCase = container.resolve(CreateTestScenarioUseCase)
        
        const scenario = await createTestScenarioUseCase.execute({
            name,
            description,
            priority,
            createdByUserId
        })
        
        return response.status(201).json(scenario)
    }
}
