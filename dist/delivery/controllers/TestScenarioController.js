"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestScenarioController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateTestScenarioUseCase_1 = require("../../domain/useCases/CreateTestScenarioUseCase");
class TestScenarioController {
    async create(request, response) {
        const { name, description, priority, createdByUserId } = request.body;
        const createTestScenarioUseCase = tsyringe_1.container.resolve(CreateTestScenarioUseCase_1.CreateTestScenarioUseCase);
        const scenario = await createTestScenarioUseCase.execute({
            name,
            description,
            priority,
            createdByUserId
        });
        return response.status(201).json(scenario);
    }
}
exports.TestScenarioController = TestScenarioController;
