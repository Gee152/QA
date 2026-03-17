import {
    ICreateUserRequest,
    IUpdateUserRequest,
    IAuthenticateUserRequest
} from "../UserUseCase"
import {
    ICreateUserUseCaseValidate,
    IGetUserUseCaseValidate,
    IUpdateUserUseCaseValidate,
    IDeleteUserUseCaseValidate,
    IAuthenticateUserUseCaseValidate
} from "./IUserValidate"
import { checkStringEmpty, checkEmail, checkUUID } from "../../../shared/utils/validate"

export class CreateUserUseCaseValidate implements ICreateUserUseCaseValidate {
    createUser(req: ICreateUserRequest): string | null {
        if (checkStringEmpty(req.username)) return "O nome de usuário não pode ser vazio."
        if (checkStringEmpty(req.email)) return "O e-mail não pode ser vazio."
        if (checkEmail(req.email)) return "O e-mail informado não é válido."
        if (checkStringEmpty(req.password)) return "A senha não pode ser vazia."
        if (req.password.length < 6) return "A senha deve ter pelo menos 6 caracteres."
        return null
    }
}

export class GetUserUseCaseValidate implements IGetUserUseCaseValidate {
    getUser(id: string): string | null {
        if (checkStringEmpty(id)) return "O ID do usuário não pode ser vazio."
        if (checkUUID(id)) return "O ID do usuário não é um UUID válido."
        return null
    }
}

export class UpdateUserUseCaseValidate implements IUpdateUserUseCaseValidate {
    updateUser(req: IUpdateUserRequest): string | null {
        if (checkStringEmpty(req.id)) return "O ID do usuário não pode ser vazio."
        if (checkUUID(req.id)) return "O ID do usuário não é um UUID válido."
        if (!req.username && !req.email) return "Informe ao menos um campo para atualizar: username ou email."
        if (req.email !== undefined && checkEmail(req.email)) return "O e-mail informado não é válido."
        return null
    }
}

export class DeleteUserUseCaseValidate implements IDeleteUserUseCaseValidate {
    deleteUser(id: string): string | null {
        if (checkStringEmpty(id)) return "O ID do usuário não pode ser vazio."
        if (checkUUID(id)) return "O ID do usuário não é um UUID válido."
        return null
    }
}

export class AuthenticateUserUseCaseValidate implements IAuthenticateUserUseCaseValidate {
    authenticate(req: IAuthenticateUserRequest): string | null {
        if (checkStringEmpty(req.email)) return "O e-mail não pode ser vazio."
        if (checkEmail(req.email)) return "O e-mail informado não é válido."
        if (checkStringEmpty(req.password)) return "A senha não pode ser vazia."
        return null
    }
}
