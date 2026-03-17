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
exports.TypeORMTestResultRepository = void 0;
const tsyringe_1 = require("tsyringe");
const data_source_1 = require("../../data-source");
const TestResult_1 = require("../database/entities/TestResult");
const TestResult_2 = require("../../domain/entities/TestResult");
let TypeORMTestResultRepository = class TypeORMTestResultRepository {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(TestResult_1.TestResult);
    }
    async findById(id) {
        const result = await this.repository.findOne({ where: { id } });
        return result ? this.toDomain(result) : undefined;
    }
    async findAllByScenarioId(scenarioId) {
        const results = await this.repository.find({ where: { scenarioId } });
        return results.map(r => this.toDomain(r));
    }
    async save(testResult) {
        const typeOrmResult = this.toTypeORM(testResult);
        const savedResult = await this.repository.save(typeOrmResult);
        return this.toDomain(savedResult);
    }
    toDomain(typeOrmResult) {
        const result = new TestResult_2.TestResult();
        Object.assign(result, typeOrmResult);
        return result;
    }
    toTypeORM(domainTestResult) {
        const result = new TestResult_1.TestResult();
        Object.assign(result, domainTestResult);
        return result;
    }
};
exports.TypeORMTestResultRepository = TypeORMTestResultRepository;
exports.TypeORMTestResultRepository = TypeORMTestResultRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], TypeORMTestResultRepository);
