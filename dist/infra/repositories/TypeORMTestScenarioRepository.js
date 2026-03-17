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
exports.TypeORMTestScenarioRepository = void 0;
const tsyringe_1 = require("tsyringe");
const data_source_1 = require("../../data-source");
const TestScenario_1 = require("../database/entities/TestScenario");
const TestScenario_2 = require("../../domain/entities/TestScenario");
let TypeORMTestScenarioRepository = class TypeORMTestScenarioRepository {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(TestScenario_1.TestScenario);
    }
    async findById(id) {
        const scenario = await this.repository.findOne({ where: { id } });
        return scenario ? this.toDomain(scenario) : undefined;
    }
    async findAll() {
        const scenarios = await this.repository.find();
        return scenarios.map(s => this.toDomain(s));
    }
    async save(testScenario) {
        const typeOrmScenario = this.toTypeORM(testScenario);
        const savedScenario = await this.repository.save(typeOrmScenario);
        return this.toDomain(savedScenario);
    }
    toDomain(typeOrmScenario) {
        const scenario = new TestScenario_2.TestScenario();
        Object.assign(scenario, typeOrmScenario);
        return scenario;
    }
    toTypeORM(domainTestScenario) {
        const scenario = new TestScenario_1.TestScenario();
        Object.assign(scenario, domainTestScenario);
        return scenario;
    }
};
exports.TypeORMTestScenarioRepository = TypeORMTestScenarioRepository;
exports.TypeORMTestScenarioRepository = TypeORMTestScenarioRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], TypeORMTestScenarioRepository);
