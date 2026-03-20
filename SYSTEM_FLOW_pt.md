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

-----------------------------------------------------------------------

# Documentação do Fluxo do Sistema

## 1. Introdução

Este documento descreve a arquitetura de alto nível e o fluxo de usuário do aplicativo QA, um frontend baseado em React construído com Vite. O aplicativo parece funcionar como um protótipo de UI de alta fidelidade, apresentando um painel para métricas de Garantia de Qualidade e gerenciamento de cenários de teste.

## 2. Arquitetura Geral

O aplicativo é estruturado como um Single Page Application (SPA) usando React. As principais decisões arquitetônicas incluem:

-   **Framework de Frontend:** React
-   **Ferramenta de Build:** Vite
-   **Roteamento:** `react-router-dom` para navegação no lado do cliente.
-   **Estilização:** Provavelmente usa uma abordagem de estilização baseada em componentes, com um diretório `src/app/components/ui` dedicado para elementos de UI reutilizáveis.

O ponto de entrada do aplicativo é `src/app/App.tsx`, que configura o roteador e o layout principal do aplicativo.

## 3. Componentes Centrais

### 3.1. `App.tsx`

-   **Função:** O componente raiz do aplicativo. É responsável por configurar o `RouterProvider` do `react-router-dom` e definir a estrutura geral do aplicativo, como cabeçalhos, rodapés ou áreas de conteúdo principal que persistem entre as rotas.
-   **Funcionalidade Principal:** Inicializa o sistema de roteamento com base na configuração fornecida em `routes.ts`.

### 3.2. `routes.ts`

-   **Função:** Configuração centralizada para todas as rotas do aplicativo. Ele mapeia caminhos de URL para seus respectivos componentes React (`pages`).
-   **Funcionalidade Principal:** Define a estrutura de navegação, incluindo rotas públicas (Login, Signup) e rotas protegidas (QADashboard, TestScenarios). Ele usa `createBrowserRouter` para gerenciar o histórico do navegador e a navegação.

### 3.3. `LoginPage.tsx`

-   **Função:** Lida com a autenticação do usuário.
-   **Funcionalidade Principal:** Apresenta um formulário de login onde os usuários podem inserir credenciais. Inclui validação no lado do cliente para os campos do formulário. A implementação atual usa autenticação simulada com credenciais codificadas, redirecionando os usuários para o painel após o "login" bem-sucedido.
-   **Dependências:** Usa `useForm` para gerenciamento de formulários e `useNavigate` para navegação programática após a autenticação.

### 3.4. `SignupPage.tsx`

-   **Função:** Gerencia o registro de usuários.
-   **Funcionalidade Principal:** Fornece um formulário de registro com campos como nome de usuário, e-mail e senha. Também inclui validação, notavelmente para confirmação de senha. O processo de criação de conta é atualmente simulado.
-   **Dependências:** Depende de `useForm` para manipulação de formulários.

### 3.5. `QADashboard.tsx`

-   **Função:** A página de destino principal após um usuário fazer login, atuando como um contêiner para vários widgets e informações relacionadas à QA.
-   **Funcionalidade Principal:** Compõe vários componentes menores (`KPICards`, `ActivityFeed`, etc.) para exibir uma visão geral das métricas e atividades de QA.
-   **Observações:** Como um protótipo, os dados exibidos neste painel e seus subcomponentes (como `KPICards`) estão atualmente codificados.

### 3.6. `QANavbar.tsx`

-   **Função:** A barra de navegação principal para a seção de QA do aplicativo.
-   **Funcionalidade Principal:** Fornece links de navegação para diferentes partes do painel de QA e, potencialmente, exibe informações específicas do usuário.
-   **Observações:** As informações do usuário exibidas (por exemplo, avatar do usuário, nome) são codificadas, consistente com a natureza de protótipo do aplicativo.

### 3.7. `KPICards.tsx`

-   **Função:** Exibe Indicadores Chave de Desempenho relevantes para a Garantia de Qualidade.
-   **Funcionalidade Principal:** Renderiza um conjunto de cartões, cada um representando uma métrica específica (por exemplo, taxa de sucesso, testes ativos).
-   **Observações:** Os dados usados para preencher esses cartões são codificados.

### 3.8. `src/app/components/qa/`

-   **Função:** Contém componentes especializados específicos para o domínio de QA, como `ActivityFeed.tsx`, `NewScenarioDrawer.tsx`, `RichTexxtEditor.tsx`, `SuccessRateChart.tsx` e `TestScenariosTable.tsx`.
-   **Funcionalidade Principal:** Esses componentes fornecem coletivamente as visualizações detalhadas e os elementos interativos para gerenciar processos de QA, testes e relatórios. Uma investigação mais aprofundada é necessária para detalhar cada um.

### 3.9. `src/app/components/ui/`

-   **Função:** Uma coleção de componentes de UI genéricos e reutilizáveis (por exemplo, `button.tsx`, `input.tsx`, `card.tsx`, `dialog.tsx`).
-   **Funcionalidade Principal:** Esses componentes formam o sistema de design do aplicativo, garantindo consistência e acelerando o desenvolvimento da UI. Eles são blocos de construção fundamentais usados em várias páginas e componentes específicos de recursos.

## 4. Fluxo do Aplicativo

A jornada típica do usuário através do aplicativo é a seguinte:

1.  **Acesso Inicial:** Os usuários normalmente chegam à rota `/login`, onde `LoginPage.tsx` é renderizado.
2.  **Autenticação:** Os usuários fornecem credenciais. Para este protótipo, qualquer entrada simulará um login bem-sucedido.
3.  **Redirecionamento para o Painel:** Após o login simulado bem-sucedido, o usuário é redirecionado para o painel `/qa`, renderizado por `QADashboard.tsx`.
4.  **Interação com o Painel:** No painel, os usuários podem visualizar métricas de QA via `KPICards`, navegar usando `QANavbar` e interagir com outros componentes específicos de QA (por exemplo, `TestScenariosTable`, `ActivityFeed`).
5.  **Cadastro:** Alternativamente, novos usuários podem navegar para a rota `/signup` para criar uma conta via `SignupPage.tsx`. Este processo também é simulado.

## 5. Limitações/Observações Atuais

-   **Natureza do Protótipo:** O aplicativo é claramente um protótipo de UI. Muitos componentes, incluindo `QANavbar` e `KPICards`, usam dados codificados em vez de buscá-los de uma API de backend.
-   **Autenticação Simulada:** Tanto `LoginPage.tsx` quanto `SignupPage.tsx` implementam processos de autenticação e registro simulados, o que significa que nenhuma conta de usuário real é gerenciada ou persistida.
-   **Discrepância de Roteamento:** O `LoginPage` atualmente redireciona para `/dashboard` após o login bem-sucedido, mas a rota definida em `routes.ts` para o painel de QA é `/qa`. Essa discrepância deve ser alinhada para consistência.
-   **Nenhuma Integração de Backend:** Não há integração aparente com uma API de backend para persistência de dados, carregamento de conteúdo dinâmico ou gerenciamento real de usuários.

## 6. Considerações sobre Banco de Dados (Hipótese)

Embora o protótipo atual não possua integração com um backend ou banco de dados real, se houvesse a necessidade de persistência de dados, as seguintes tabelas e seus campos seriam prováveis, com base na funcionalidade atual e esperada:

### 6.1. Tabela `Usuarios` (Users)

Para gerenciar o acesso e perfis de usuário.

-   `id` (PK, UUID/INT): Identificador único do usuário.
-   `nome_usuario` (VARCHAR): Nome de usuário para login.
-   `email` (VARCHAR): Endereço de e-mail do usuário, também pode ser usado para login.
-   `senha_hash` (VARCHAR): Hash seguro da senha do usuário.
-   `data_criacao` (TIMESTAMP): Data e hora de criação do registro do usuário.
-   `ultimo_login` (TIMESTAMP): Data e hora do último login do usuário.

### 6.2. Tabela `CenariosDeTeste` (TestScenarios)

Para armazenar informações sobre os cenários de teste de QA.

-   `id` (PK, UUID/INT): Identificador único do cenário de teste.
-   `nome` (VARCHAR): Nome ou título do cenário de teste.
-   `descricao` (TEXT): Descrição detalhada do cenário de teste.
-   `status` (ENUM/VARCHAR): Status atual do cenário (e.g., 'Pendente', 'Em Execução', 'Concluído', 'Falha').
-   `prioridade` (ENUM/INT): Nível de prioridade do cenário.
-   `data_criacao` (TIMESTAMP): Data e hora de criação do cenário.
-   `ultima_atualizacao` (TIMESTAMP): Data e hora da última modificação.
-   `criado_por_usuario_id` (FK para `Usuarios.id`): Usuário que criou o cenário.

### 6.3. Tabela `ResultadosDeTeste` (TestResults)

Para armazenar os resultados de execuções de testes, que podem ser referenciados pelos `KPICards`.

-   `id` (PK, UUID/INT): Identificador único do resultado do teste.
-   `cenario_id` (FK para `CenariosDeTeste.id`): Cenário de teste ao qual o resultado pertence.
-   `data_execucao` (TIMESTAMP): Data e hora da execução do teste.
-   `status_resultado` (ENUM/VARCHAR): Resultado final (e.g., 'Sucesso', 'Falha', 'Ignorado').
-   `duracao_ms` (INT): Duração da execução do teste em milissegundos.
-   `logs` (TEXT): Logs ou detalhes adicionais da execução do teste.
-   `executado_por_usuario_id` (FK para `Usuarios.id`): Usuário que executou o teste.

Esta seção é meramente especulativa e baseada nas funcionalidades inferidas do frontend.
