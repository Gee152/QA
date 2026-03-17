import {
    ICreateUserRequest,
    IGetUserRequest,
    IUpdateUserRequest,
    IDeleteUserRequest,
    IAuthenticateUserRequest
} from "../UserUseCase"

export interface ICreateUserUseCaseValidate {
    createUser(req: ICreateUserRequest): string | null
}

export interface IGetUserUseCaseValidate {
    getUser(id: string): string | null
}

export interface IUpdateUserUseCaseValidate {
    updateUser(req: IUpdateUserRequest): string | null
}

export interface IDeleteUserUseCaseValidate {
    deleteUser(id: string): string | null
}

export interface IAuthenticateUserUseCaseValidate {
    authenticate(req: IAuthenticateUserRequest): string | null
}
