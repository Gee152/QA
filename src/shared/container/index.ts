import { container } from "tsyringe"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { TypeORMUserRepository } from "../../infra/repositories/TypeORMUserRepository"
import { ITestScenarioRepository } from "../../domain/repositories/ITestScenarioRepository"
import { TypeORMTestScenarioRepository } from "../../infra/repositories/TypeORMTestScenarioRepository"
import { ITestResultRepository } from "../../domain/repositories/ITestResultRepository"
import { TypeORMTestResultRepository } from "../../infra/repositories/TypeORMTestResultRepository"
import { IModuleRepository } from "../../domain/repositories/IModuleRepository"
import { TypeORMModuleRepository } from "../../infra/repositories/TypeORMModuleRepository"

import { CreateUserUseCase, GetUserUseCase, ListUsersUseCase, UpdateUserUseCase, DeleteUserUseCase, AuthenticateUserUseCase } from "../../domain/useCases/UserUseCase"

container.registerSingleton<IUserRepository>("UserRepository", TypeORMUserRepository)
container.registerSingleton<ITestScenarioRepository>("TestScenarioRepository", TypeORMTestScenarioRepository)
container.registerSingleton<ITestResultRepository>("TestResultRepository", TypeORMTestResultRepository)
container.registerSingleton<IModuleRepository>("ModuleRepository", TypeORMModuleRepository)

container.registerSingleton<CreateUserUseCase>(CreateUserUseCase)
container.registerSingleton<GetUserUseCase>(GetUserUseCase)
container.registerSingleton<ListUsersUseCase>(ListUsersUseCase)
container.registerSingleton<UpdateUserUseCase>(UpdateUserUseCase)
container.registerSingleton<DeleteUserUseCase>(DeleteUserUseCase)
container.registerSingleton<AuthenticateUserUseCase>(AuthenticateUserUseCase)
