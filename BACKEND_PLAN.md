# Plano de Construção do Backend

Este documento descreve um plano de construção para o backend do sistema, seguindo princípios SOLID e uma arquitetura em camadas (Delivery, Domain, Infra), utilizando TypeORM com PostgreSQL como banco de dados.

## 1. Estrutura e Princípios de Arquitetura

Adotaremos uma arquitetura limpa (Clean Architecture) ou onion architecture, que naturalmente se alinha com os princípios SOLID, dividindo o código em camadas distintas com responsabilidades bem definidas.

### 1.1. Princípios SOLID Aplicados

-   **SRP (Single Responsibility Principle):** Cada classe ou módulo terá uma única responsabilidade.
-   **OCP (Open/Closed Principle):** Entidades de software (classes, módulos, funções, etc.) devem ser abertas para extensão, mas fechadas para modificação.
-   **LSP (Liskov Substitution Principle):** Objetos em um programa devem ser substituíveis por instâncias de seus subtipos sem alterar a correção do programa.
-   **ISP (Interface Segregation Principle):** Clientes não devem ser forçados a depender de interfaces que não usam.
-   **DIP (Dependency Inversion Principle):** Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações. Abstrações não devem depender de detalhes. Detalhes devem depender de abstrações.

### 1.2. Camadas da Arquitetura

A estrutura do projeto será dividida nas seguintes camadas principais:

-   **Delivery (Entrega):** Responsável por lidar com a entrada e saída de dados da aplicação. Contém rotas, controladores e qualquer lógica de serialização/desserialização de dados para o cliente. É a camada mais externa.
    -   **Exemplos:** `routes`, `controllers`, `middlewares`, `DTOs` (Data Transfer Objects).
-   **Domain (Domínio):** O coração da aplicação, contendo a lógica de negócio principal. É completamente independente de tecnologias externas (frameworks, bancos de dados). Define as entidades (modelos de dados), use cases (casos de uso/lógica de negócio) e interfaces de repositórios.
    -   **Exemplos:** `entities`, `useCases`, `repositories` (interfaces).
-   **Infra (Infraestrutura):** Responsável por conectar o Domain com o mundo exterior. Contém as implementações dos repositórios (utilizando TypeORM), configuração do banco de dados, mapeamento de dados entre o Domain e o ORM, e qualquer integração com serviços externos.
    -   **Exemplos:** `database` (TypeORM configs, entities, migrations), `repositories` (implementações TypeORM), `http` (clientes para APIs externas), `services` (envio de e-mail, etc.).
-   **Shared (Compartilhado):** Módulos com funcionalidades comuns que podem ser usadas por qualquer camada, como utilitários, tratamento de erros globais, tipos genéricos, etc.
    -   **Exemplos:** `utils`, `errors`, `types`, `config`.

## 2. Etapas de Construção do Backend

### Passo 1: Configuração Inicial do Projeto

1.  **Inicialização do Projeto Node.js:**
    ```bash
    mkdir my-backend && cd my-backend
    npm init -y
    ```
2.  **Instalação de Dependências Essenciais:**
    *   **Servidor Web:** `express`, `@types/express`
    *   **ORM:** `typeorm`, `pg` (driver PostgreSQL)
    *   **Ferramentas de Desenvolvimento:** `typescript`, `ts-node-dev` (para hot-reloading), `@types/node`
    *   **Validação:** `class-validator`, `class-transformer`
    *   **Autenticação (Exemplo):** `jsonwebtoken`, `bcryptjs`, `@types/jsonwebtoken`, `@types/bcryptjs`
    *   **Configuração de Ambiente:** `dotenv`
    ```bash
    npm install express typeorm pg reflect-metadata
    npm install -D typescript ts-node-dev @types/express @types/node
    npm install class-validator class-transformer
    npm install jsonwebtoken bcryptjs
    npm install dotenv
    ```
3.  **Configuração do TypeScript:** `npx tsc --init` (ajustar `tsconfig.json` para `rootDir`, `outDir`, `experimentalDecorators`, `emitDecoratorMetadata`).
4.  **Configuração do `package.json`:** Adicionar scripts para `start`, `dev`, `typeorm` (para migrations).

### Passo 2: Configuração do Banco de Dados com PostgreSQL e TypeORM

1.  **Criação do Banco de Dados PostgreSQL:** Certificar-se de que um servidor PostgreSQL esteja em execução e um banco de dados (`my_qa_db`) tenha sido criado.
2.  **Configuração do TypeORM:**
    *   Criar `ormconfig.ts` (ou similar) na camada `infra/database/` com as configurações de conexão (host, porta, usuário, senha, banco de dados, entidades a serem carregadas, migrations).
    *   Usar variáveis de ambiente para credenciais sensíveis (`.env`).
3.  **Definição das Entidades do Domain (Modelos):**
    *   Baseado no protótipo frontend, as entidades principais seriam `User`, `TestScenario` e `TestResult`.
    *   **`src/domain/entities/User.ts`:**
        ```typescript
        // Exemplo:
        export class User {
            id: string;
            username: string;
            email: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
            // ... outros campos
        }
        ```
    *   **`src/domain/entities/TestScenario.ts`:**
        ```typescript
        // Exemplo:
        export class TestScenario {
            id: string;
            name: string;
            description: string;
            status: 'Pending' | 'InProgress' | 'Completed' | 'Failed';
            priority: number;
            createdAt: Date;
            updatedAt: Date;
            createdByUserId: string; // FK para User
            // ... outros campos
        }
        ```
    *   **`src/domain/entities/TestResult.ts`:**
        ```typescript
        // Exemplo:
        export class TestResult {
            id: string;
            scenarioId: string; // FK para TestScenario
            executionDate: Date;
            resultStatus: 'Success' | 'Failure' | 'Skipped';
            durationMs: number;
            logs: string;
            executedByUserId: string; // FK para User
            // ... outros campos
        }
        ```
4.  **Mapeamento das Entidades TypeORM:**
    *   Criar as classes de entidade TypeORM correspondentes em `src/infra/database/entities/` com `@Entity()`, `@Column()`, `@PrimaryColumn()`, `@CreateDateColumn()`, `@UpdateDateColumn()`, `@OneToMany()`, `@ManyToOne()`, etc.
    *   Garantir a correspondência entre as entidades do Domain e as entidades do TypeORM.
5.  **Migrations:**
    *   Configurar TypeORM CLI para gerar e executar migrations.
    *   Criar a migration inicial para as tabelas `users`, `test_scenarios`, `test_results`.

### Passo 3: Implementação da Camada Domain (Lógica de Negócio)

1.  **Interfaces de Repositório:**
    *   Definir interfaces na camada `src/domain/repositories/` para cada entidade, especificando os métodos CRUD e consultas específicas de domínio.
    *   **Exemplo:** `src/domain/repositories/IUserRepository.ts`
        ```typescript
        export interface IUserRepository {
            findById(id: string): Promise<User | undefined>;
            findByEmail(email: string): Promise<User | undefined>;
            save(user: User): Promise<User>;
            // ...
        }
        ```
2.  **Use Cases (Casos de Uso):**
    *   Implementar a lógica de negócio em `src/domain/useCases/`. Cada Use Case deve ter uma única responsabilidade (ex: `CreateUserUseCase`, `AuthenticateUserUseCase`, `CreateTestScenarioUseCase`).
    *   Eles orquestram as interações com os repositórios e outras entidades do Domain.
    *   **Exemplo:** `src/domain/useCases/CreateUserUseCase.ts`
        ```typescript
        import { IUserRepository } from '../repositories/IUserRepository';
        import { User } from '../entities/User';

        export class CreateUserUseCase {
            constructor(private userRepository: IUserRepository) {}

            async execute(userData: Partial<User>): Promise<User> {
                // Lógica de negócio, validações de domínio
                const user = new User();
                Object.assign(user, userData);
                user.passwordHash = /* hash da senha */;
                return this.userRepository.save(user);
            }
        }
        ```

### Passo 4: Implementação da Camada Infraestrutura

1.  **Implementações de Repositório:**
    *   Na camada `src/infra/repositories/`, implementar as interfaces de repositório definidas no Domain, utilizando TypeORM.
    *   **Exemplo:** `src/infra/repositories/TypeORMUserRepository.ts`
        ```typescript
        import { Repository } from 'typeorm';
        import { User as TypeORMUser } from '../database/entities/User'; // Entidade TypeORM
        import { User } from '../../domain/entities/User'; // Entidade Domain
        import { IUserRepository } from '../../domain/repositories/IUserRepository';

        export class TypeORMUserRepository implements IUserRepository {
            private ormRepository: Repository<TypeORMUser>;

            constructor(ormRepository: Repository<TypeORMUser>) {
                this.ormRepository = ormRepository;
            }

            async findById(id: string): Promise<User | undefined> {
                const typeOrmUser = await this.ormRepository.findOne({ where: { id } });
                return typeOrmUser ? this.mapToDomain(typeOrmUser) : undefined;
            }

            async save(user: User): Promise<User> {
                const typeOrmUser = this.mapToTypeORM(user);
                const savedTypeOrmUser = await this.ormRepository.save(typeOrmUser);
                return this.mapToDomain(savedTypeOrmUser);
            }

            private mapToDomain(typeOrmUser: TypeORMUser): User {
                const user = new User();
                Object.assign(user, typeOrmUser);
                return user;
            }

            private mapToTypeORM(user: User): TypeORMUser {
                const typeOrmUser = new TypeORMUser();
                Object.assign(typeOrmUser, user);
                return typeOrmUser;
            }
            // ...
        }
        ```
2.  **Mapeamento de Dados (Transformers):**
    *   Lógica para transformar dados entre as entidades do Domain e as entidades do TypeORM (se necessário, especialmente em casos de Domain Model mais ricos ou diferenças de nomenclatura). Isso pode ser feito dentro das implementações do repositório ou em módulos `src/infra/mappers/`.
3.  **Configuração de Conexão com o Banco de Dados:**
    *   `src/infra/database/index.ts`: Lógica para inicializar a conexão com o TypeORM.

### Passo 5: Implementação da Camada Delivery

1.  **Controladores (Controllers):**
    *   Em `src/delivery/controllers/`, criar controladores para cada recurso (ex: `UserController`, `TestScenarioController`).
    *   Responsáveis por:
        *   Receber requisições HTTP.
        *   Validar dados de entrada (`DTOs` com `class-validator`).
        *   Chamar os `useCases` apropriados da camada Domain.
        *   Tratar os resultados dos `useCases`.
        *   Formatar a resposta HTTP (status code, body).
    *   **Exemplo:** `src/delivery/controllers/UserController.ts`
        ```typescript
        import { Request, Response } from 'express';
        import { CreateUserUseCase } from '../../domain/useCases/CreateUserUseCase';
        import { validate } from 'class-validator';
        import { CreateUserDTO } from '../dtos/CreateUserDTO'; // DTO de validação

        export class UserController {
            constructor(private createUserUseCase: CreateUserUseCase) {}

            async create(req: Request, res: Response): Promise<Response> {
                const createUserDTO = new CreateUserDTO();
                Object.assign(createUserDTO, req.body);

                const errors = await validate(createUserDTO);
                if (errors.length > 0) {
                    return res.status(400).json(errors); // Erro de validação
                }

                try {
                    const user = await this.createUserUseCase.execute(createUserDTO);
                    return res.status(201).json(user);
                } catch (error: any) {
                    // Tratar erros específicos do domínio
                    return res.status(500).json({ message: error.message });
                }
            }
        }
        ```
2.  **DTOs (Data Transfer Objects):**
    *   Em `src/delivery/dtos/`, definir classes para validar e tipar os dados que entram e saem dos controladores.
    *   Usar `@IsString()`, `@IsEmail()`, `@MinLength()`, etc., do `class-validator`.
3.  **Rotas (Routes):**
    *   Em `src/delivery/routes/`, definir as rotas da API usando `express.Router`.
    *   Associar as rotas aos métodos dos controladores.
    *   **Exemplo:** `src/delivery/routes/user.routes.ts`
        ```typescript
        import { Router } from 'express';
        import { UserController } from '../controllers/UserController';
        // Importar instâncias dos use cases e repositórios via injeção de dependência

        const userRouter = Router();
        const userController = new UserController(/* injetar use case */);

        userRouter.post('/', userController.create.bind(userController)); // .bind para manter o contexto do 'this'

        export { userRouter };
        ```
4.  **Middlewares:**
    *   Autenticação (JWT), autorização, tratamento de erros globais.

### Passo 6: Injeção de Dependência

1.  **Containers de Injeção de Dependência:** Utilizar um container de DI (ex: `tsyringe`, ou um simples gerenciador de instâncias) para gerenciar a criação e injeção de dependências entre as camadas. Isso garante que a camada Delivery chame os Use Cases do Domain, que por sua vez usam as implementações de repositório da Infra, sem que as camadas superiores saibam dos detalhes de implementação das camadas inferiores.
    *   O `server.ts` ou `app.ts` será o ponto de "composição" onde as dependências são resolvidas e injetadas.

### Passo 7: Testes Unitários

1.  **Framework de Testes:** `jest` ou `vitest`
    ```bash
    npm install -D jest @types/jest ts-jest
    # ou
    npm install -D vitest @vitest/coverage-c8
    ```
2.  **Estratégia de Testes:**
    *   **Domain:** Foco principal nos `useCases` e `entities`. Mockar completamente os repositórios (interfaces). Testar a lógica de negócio isoladamente.
    *   **Infra:** Testar as implementações dos repositórios (TypeORM), garantindo que interagem corretamente com o ORM. Pode envolver testes de integração mais leves com um banco de dados em memória ou de teste.
    *   **Delivery:** Testar os controladores e rotas. Mockar os `useCases`. Usar `supertest` para testar as rotas HTTP.

### Passo 8: Tratamento de Erros

1.  **Classes de Erro Personalizadas:** Definir classes de erro em `src/shared/errors/` para erros específicos do domínio (ex: `UserNotFoundException`, `InvalidCredentialsException`).
2.  **Middleware de Erros Global:** Criar um middleware no `delivery` para interceptar erros e retornar respostas HTTP padronizadas.

### Passo 9: Autenticação e Autorização

1.  **Autenticação (JWT):**
    *   No `LoginUseCase`, gerar um token JWT após a autenticação bem-sucedida.
    *   Criar um middleware de autenticação (`src/delivery/middlewares/ensureAuthenticated.ts`) para validar tokens JWT em rotas protegidas.
2.  **Autorização (RBAC/ACL):**
    *   Se houver diferentes níveis de usuário, implementar lógica de autorização nos `useCases` ou em middlewares específicos.

## 7. O que foi esquecido? (e adicionado ao contexto)

-   **Validação Detalhada:** A implementação de `class-validator` nos DTOs é crucial para garantir a integridade dos dados na entrada.
-   **Configuração de Ambiente:** Uso do `dotenv` para gerenciar variáveis de ambiente (credenciais de BD, segredos JWT, etc.) de forma segura.
-   **Logging:** Um sistema de logging adequado (ex: `winston`, `pino`) para monitorar a aplicação em produção.
-   **Documentação da API:** Ferramentas como Swagger/OpenAPI para documentar os endpoints do backend, facilitando o consumo pelo frontend e por outros serviços.
-   **Caching:** Para endpoints de leitura intensiva, considerar estratégias de caching para melhorar a performance.
-   **Rate Limiting:** Implementar limites de taxa para proteger a API contra ataques de força bruta ou uso excessivo.
-   **Segurança (OWASP Top 10):** Revisar continuamente as práticas de segurança para mitigar vulnerabilidades comuns (SQL Injection, XSS, etc.). O uso de ORM (TypeORM) já ajuda contra SQL Injection.
-   **Dockerização:** Criar um `Dockerfile` e `docker-compose.yml` para facilitar o ambiente de desenvolvimento e a implantação em produção, incluindo o PostgreSQL.
-   **CI/CD:** Pipelines de Integração Contínua/Entrega Contínua para automatizar testes e implantação.

Este plano fornece um roteiro robusto para o desenvolvimento do backend, garantindo escalabilidade, manutenibilidade e aderência a boas práticas de engenharia de software.