"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResultController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateTestResultUseCase_1 = require("../../domain/useCases/CreateTestResultUseCase");
class TestResultController {
    async create(request, response) {
        const { scenarioId, resultStatus, durationMs, logs, executedByUserId } = request.body;
        const createTestResultUseCase = tsyringe_1.container.resolve(CreateTestResultUseCase_1.CreateTestResultUseCase);
        const result = await createTestResultUseCase.execute({
            scenarioId,
            resultStatus,
            durationMs,
            logs,
            executedByUserId
        });
        return response.status(201).json(result);
    }
}
exports.TestResultController = TestResultController;
