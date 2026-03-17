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
exports.CreateTestScenarioUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const TestScenario_1 = require("../entities/TestScenario");
const AppError_1 = require("../../shared/errors/AppError");
let CreateTestScenarioUseCase = class CreateTestScenarioUseCase {
    constructor(testScenarioRepository, userRepository) {
        this.testScenarioRepository = testScenarioRepository;
        this.userRepository = userRepository;
    }
    async execute({ name, description, priority, createdByUserId }) {
        const user = await this.userRepository.findById(createdByUserId);
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        const testScenario = new TestScenario_1.TestScenario();
        testScenario.name = name;
        testScenario.description = description;
        testScenario.priority = priority;
        testScenario.createdByUserId = createdByUserId;
        testScenario.status = "Pending";
        return this.testScenarioRepository.save(testScenario);
    }
};
exports.CreateTestScenarioUseCase = CreateTestScenarioUseCase;
exports.CreateTestScenarioUseCase = CreateTestScenarioUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("TestScenarioRepository")),
    __param(1, (0, tsyringe_1.inject)("UserRepository")),
    __metadata("design:paramtypes", [Object, Object])
], CreateTestScenarioUseCase);
