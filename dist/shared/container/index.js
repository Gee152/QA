"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const TypeORMUserRepository_1 = require("../../infra/repositories/TypeORMUserRepository");
const TypeORMTestScenarioRepository_1 = require("../../infra/repositories/TypeORMTestScenarioRepository");
const TypeORMTestResultRepository_1 = require("../../infra/repositories/TypeORMTestResultRepository");
tsyringe_1.container.registerSingleton("UserRepository", TypeORMUserRepository_1.TypeORMUserRepository);
tsyringe_1.container.registerSingleton("TestScenarioRepository", TypeORMTestScenarioRepository_1.TypeORMTestScenarioRepository);
tsyringe_1.container.registerSingleton("TestResultRepository", TypeORMTestResultRepository_1.TypeORMTestResultRepository);
