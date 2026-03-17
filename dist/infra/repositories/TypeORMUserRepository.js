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
exports.TypeORMUserRepository = void 0;
const tsyringe_1 = require("tsyringe");
const data_source_1 = require("../../data-source");
const User_1 = require("../database/entities/User");
const User_2 = require("../../domain/entities/User");
let TypeORMUserRepository = class TypeORMUserRepository {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async findById(id) {
        const user = await this.repository.findOne({ where: { id } });
        return user ? this.toDomain(user) : undefined;
    }
    async findByEmail(email) {
        const user = await this.repository.findOne({ where: { email } });
        return user ? this.toDomain(user) : undefined;
    }
    async save(user) {
        const typeOrmUser = this.toTypeORM(user);
        const savedUser = await this.repository.save(typeOrmUser);
        return this.toDomain(savedUser);
    }
    toDomain(typeOrmUser) {
        const user = new User_2.User();
        Object.assign(user, typeOrmUser);
        return user;
    }
    toTypeORM(domainUser) {
        const user = new User_1.User();
        Object.assign(user, domainUser);
        return user;
    }
};
exports.TypeORMUserRepository = TypeORMUserRepository;
exports.TypeORMUserRepository = TypeORMUserRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], TypeORMUserRepository);
