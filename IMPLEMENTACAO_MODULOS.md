# Implementação do Sistema de Módulos (Suites)

Baseado na sua arquitetura em camadas (Delivery, Domain, Infra) com TSyringe e TypeORM, aqui está o desenho da implementação abordando a persistência, os casos de uso, e a estratégia de testes para a hierarquia de Projetos > Módulos > Casos de Teste.

## 1. Modelagem do Banco de Dados (TypeORM - Camada `Infra`)

Para gerenciar a árvore de forma flexível e permitir a ordenação visual (drag and drop), o padrão **Adjacency List** junto a uma coluna `position` (inteiro) é essencial.

### Entidade `Project`
```typescript
// src/infra/database/entities/Project.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Module } from "./Module";

@Entity("projects")
export class Project {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @OneToMany(() => Module, module => module.project)
    modules: Module[];
}
```

### Entidade `Module` (Árvore de Pastas)
Aqui configuramos o auto-relacionamento.
```typescript
// src/infra/database/entities/Module.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Project } from "./Project";

@Entity("modules")
export class Module {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ type: "int", default: 0 })
    position: number; // Define a ordem na UI

    // Pertence a um projeto
    @ManyToOne(() => Project, project => project.modules, { onDelete: "CASCADE" })
    @JoinColumn({ name: "project_id" })
    project: Project;

    // Auto-relacionamento: Adjacency List
    @ManyToOne(() => Module, module => module.children, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "parent_id" })
    parent: Module; // Se NULL, é um módulo raiz

    @OneToMany(() => Module, module => module.parent)
    children: Module[];
}
```

## 2. Lógica de Negócio (Camada `Domain`)

A principal complexidade é carregar a **Árvore (Tree)** de forma performática. Não devemos fazer um `SELECT` no banco para cada sub-módulo. Fazemos um único `SELECT` da lista plana (ordenada por `position`) e montamos a árvore estruturada na memória (O(N) performance).

### A Interface do Repositório
```typescript
// src/domain/repositories/IModuleRepository.ts
import { Module } from "../entities/Module";

export interface IModuleRepository {
  create(data: Partial<Module>): Promise<Module>;
  findByProjectId(projectId: string): Promise<Module[]>; // Retorna a lista plana
  updateParentAndPosition(id: string, parentId: string | null, position: number): Promise<void>;
}
```

### O Caso de Uso: Recuperar a Árvore do Projeto
```typescript
// src/domain/useCases/GetProjectModulesTreeUseCase.ts
import { inject, injectable } from "tsyringe";
import { IModuleRepository } from "../repositories/IModuleRepository";

@injectable()
export class GetProjectModulesTreeUseCase {
  constructor(
    @inject("ModuleRepository")
    private moduleRepository: IModuleRepository
  ) {}

  async execute(projectId: string) {
    // 1. Busca todos os módulos (Flat List), O repositório já deve trazer com "ORDER BY position ASC"
    const modules = await this.moduleRepository.findByProjectId(projectId);

    // 2. Transforma em Árvore usando um Map (O(n) ao invés de recursividade lenta)
    const map = new Map<string, any>();
    const tree: any[] = [];

    // Inicializa o Map e garante o array de children vazio
    modules.forEach(mod => {
      // Ignorando entidades TypeORM complexas, convertendo via plain object
      map.set(mod.id, { ...mod, children: [] });
    });

    // Monta a estrutura pai-filho
    modules.forEach(mod => {
      const node = map.get(mod.id);
      
      // parent_id no TypeORM pode precisar de eager load ou vir apenas o ID no select
      const parentId = mod.parent ? mod.parent.id : (mod as any).parent_id;

      if (parentId) {
        const parentNode = map.get(parentId);
        if (parentNode) {
          parentNode.children.push(node);
        }
      } else {
        tree.push(node); // É raiz
      }
    });

    return tree;
  }
}
```

## 3. Entrada de Dados (Camada `Delivery` / Controllers)

### `ModuleController`
```typescript
// src/delivery/controllers/ModuleController.ts
import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetProjectModulesTreeUseCase } from "../../domain/useCases/GetProjectModulesTreeUseCase";

export class ModuleController {
  
  async getTree(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params;
    
    // Resolve o useCase com injeção de dependência TSyringe
    const getProjectModulesTreeUseCase = container.resolve(GetProjectModulesTreeUseCase);
    
    const tree = await getProjectModulesTreeUseCase.execute(projectId);

    return res.json(tree);
  }

}
```

## 4. Estratégia de Testes

Os testes são focados para garantir que a transformação de **Pla** para **Árvore** funcione em qualquer nível de profundidade e a API retorne os status code corretos.

### Testes Unitários de Domínio (Jest)
Mockamos o acesso a dados para testar pilar mente a lógica de negócio do UseCase de forma veloz.

```typescript
// src/domain/useCases/GetProjectModulesTreeUseCase.spec.ts
import { GetProjectModulesTreeUseCase } from "./GetProjectModulesTreeUseCase";

describe("GetProjectModulesTreeUseCase", () => {
  it("deve montar uma arvore estruturada a partir de uma lista plana", async () => {
    // Lista Plana simulando retorno do banco
    const mockRepo = {
      findByProjectId: jest.fn().mockResolvedValue([
        { id: "1", parent_id: null, name: "Login", position: 0 },
        { id: "2", parent_id: "1", name: "Sucesso", position: 0 }, // Filho de Login
        { id: "3", parent_id: "1", name: "Falha", position: 1 },   // Filho de Login
        { id: "4", parent_id: null, name: "Pagamentos", position: 1 }, 
      ])
    };

    const useCase = new GetProjectModulesTreeUseCase(mockRepo as any);
    const result = await useCase.execute("project-id");

    // Validações
    expect(result).toHaveLength(2); // Duas raizes (Login e Pagamentos)
    
    const loginModule = result.find(r => r.id === "1");
    expect(loginModule.children).toHaveLength(2); // Duas subpastas
    expect(loginModule.children[0].name).toBe("Sucesso");
    expect(loginModule.children[1].name).toBe("Falha");

    const pagamentosModule = result.find(r => r.id === "4");
    expect(pagamentosModule.children).toHaveLength(0); // Vazio
  });
});
```

### Testes de Integração E2E (Jest + Supertest)
Para testar o pipe HTTP, desde a Rota `delivery` batendo até o Banco `infra`. Usa-se um banco SQLite em memória (`:memory:`) ou uma database exclusiva para teste (`my_qa_db_test`).

```typescript
// tests/integration/modules.test.ts
import request from "supertest";
import { app } from "../../src/app"; // Export do Express app

describe("Module Integration Tests", () => {
  beforeAll(async () => {
     // Cria conexão typeorm com banco de testes
  });

  it("GET /projects/:projectId/modules/tree - deve retornar 200 junto da arvore JSON", async () => {
     // Setup: Inserir projeto ficticio no bd
     // Setup: Inserir lista de modulos "A -> B -> C"
     
     const response = await request(app).get(`/projects/123-uuid/modules/tree`);
     
     expect(response.status).toBe(200);
     expect(response.body).toBeInstanceOf(Array);
     expect(response.body[0]).toHaveProperty("children");
  });
});
```

### Resumo do Fluxo Drag And Drop na Vida Real
Quando o Front-end arrastar a "Pasta B" para dentro da "Pasta A", ele fará uma requisição:
`PATCH /modules/:id/move` `{ "parentId": "id-da-pasta-A", "position": 0 }`.
O seu `MoveModuleUseCase` no Back-end vai:
1. Atualizar o `parent_id` do módulo para o novo pai.
2. Atualizar a posição (index numérico).
3. Efetivar as alterações nos módulos "irmãos" que perderam espaço.
