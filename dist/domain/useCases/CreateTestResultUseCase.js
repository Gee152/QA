"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTestResultUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const TestResult_1 = require("../entities/TestResult");
const AppError_1 = require("../../shared/errors/AppError");
let CreateTestResultUseCase = class CreateTestResultUseCase {
    constructor(testResultRepository, testScenarioRepository, userRepository) {
        this.testResultRepository = testResultRepository;
        this.testScenarioRepository = testScenarioRepository;
        this.userRepository = userRepository;
    }
    async execute({ scenarioId, resultStatus, durationMs, logs, executedByUserId }) {
        const user = await this.userRepository.findById(executedByUserId);
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        const scenario = await this.testScenarioRepository.findById(scenarioId);
        if (!scenario) {
            throw new AppError_1.AppError("Scenario not found", 404);
        }
        const testResult = new TestResult_1.TestResult();
        testResult.scenarioId = scenarioId;
        testResult.resultStatus = resultStatus;
        testResult.durationMs = durationMs;
        testResult.logs = logs;
        testResult.executedByUserId = executedByUserId;
        return this.testResultRepository.save(testResult);
    }
};
exports.CreateTestResultUseCase = CreateTestResultUseCase;
exports.CreateTestResultUseCase = CreateTestResultUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("TestResultRepository")),
    __param(1, (0, tsyringe_1.inject)("TestScenarioRepository")),
    __param(2, (0, tsyringe_1.inject)("UserRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateTestResultUseCase);
