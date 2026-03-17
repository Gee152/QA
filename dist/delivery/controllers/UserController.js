"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateUserUseCase_1 = require("../../domain/useCases/CreateUserUseCase");
class UserController {
    async create(request, response) {
        const { username, email, password } = request.body;
        const createUserUseCase = tsyringe_1.container.resolve(CreateUserUseCase_1.CreateUserUseCase);
        const user = await createUserUseCase.execute({
            username,
            email,
            password
        });
        return response.status(201).json(user);
    }
}
exports.UserController = UserController;
