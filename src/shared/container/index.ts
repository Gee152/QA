import { container } from "tsyringe"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { TypeORMUserRepository } from "../../infra/repositories/TypeORMUserRepository"
import { ITestScenarioRepository } from "../../domain/repositories/ITestScenarioRepository"
import { TypeORMTestScenarioRepository } from "../../infra/repositories/TypeORMTestScenarioRepository"
import { ITestResultRepository } from "../../domain/repositories/ITestResultRepository"
import { TypeORMTestResultRepository } from "../../infra/repositories/TypeORMTestResultRepository"

container.registerSingleton<IUserRepository>(
    "UserRepository",
    TypeORMUserRepository
)

container.registerSingleton<ITestScenarioRepository>(
    "TestScenarioRepository",
    TypeORMTestScenarioRepository
)

container.registerSingleton<ITestResultRepository>(
    "TestResultRepository",
    TypeORMTestResultRepository
)
