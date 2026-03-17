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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResult = void 0;
const typeorm_1 = require("typeorm");
const TestScenario_1 = require("./TestScenario");
const User_1 = require("./User");
let TestResult = class TestResult {
};
exports.TestResult = TestResult;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TestResult.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TestResult.prototype, "scenarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TestScenario_1.TestScenario),
    (0, typeorm_1.JoinColumn)({ name: "scenarioId" }),
    __metadata("design:type", TestScenario_1.TestScenario)
], TestResult.prototype, "scenario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TestResult.prototype, "executionDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TestResult.prototype, "resultStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], TestResult.prototype, "durationMs", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], TestResult.prototype, "logs", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TestResult.prototype, "executedByUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: "executedByUserId" }),
    __metadata("design:type", User_1.User)
], TestResult.prototype, "executedByUser", void 0);
exports.TestResult = TestResult = __decorate([
    (0, typeorm_1.Entity)("test_results")
], TestResult);
