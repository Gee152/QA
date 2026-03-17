# Documentação Funcional do Projeto

Este documento descreve as funcionalidades e a estrutura funcional do sistema de gerenciamento de testes.

## 1. Visão Geral
O sistema foi projetado para gerenciar cenários de teste e seus respectivos resultados de execução, associando-os a usuários responsáveis. Segue os princípios da Clean Architecture, separando responsabilidades entre entidades de domínio, casos de uso e entrega via API.

## 2. Funcionalidades Principais

### 2.1 Gestão de Usuários
*   **Criação de Usuário:** Permite o cadastro de novos usuários com nome, e-mail e senha.
    *   **Regras de Negócio:**
        *   O e-mail deve ser único no sistema.
        *   A senha é armazenada de forma segura utilizando hashing.

### 2.2 Gestão de Cenários de Teste
*   **Cadastro de Cenário:** Permite definir novos casos de teste com metadados detalhados.
    *   **Dados:** Nome, descrição, prioridade e status inicial (Pending).
    *   **Regras de Negócio:**
        *   Cada cenário deve obrigatoriamente estar vinculado a um usuário criador.

### 2.3 Registro de Resultados de Teste
*   **Registro de Execução:** Permite salvar o resultado após a execução de um cenário.
    *   **Dados:** ID do cenário, status (Success, Failure, Skipped), duração em milissegundos e logs detalhados.
    *   **Regras de Negócio:**
        *   O registro deve referenciar um cenário existente.
        *   O executor deve ser um usuário cadastrado.

## 3. Arquitetura Funcional

### 3.1 Entidades (Domain Entities)
As entidades representam os objetos de negócio core do sistema:
*   **User:** Armazena dados de autenticação e identificação.
*   **TestScenario:** Define o que deve ser testado.
*   **TestResult:** Registra a evidência de uma execução de teste.

### 3.2 Casos de Uso (Use Cases)
Contêm a lógica de negócio orquestrada:
*   `CreateUserUseCase`: Valida e persiste novos usuários.
*   `CreateTestScenarioUseCase`: Cria novos cenários vinculados a usuários.
*   `CreateTestResultUseCase`: Registra os resultados garantindo a integridade referencial.

### 3.3 Interface de Entrega (Controllers/Routes)
Exposição das funcionalidades via API REST:
*   `POST /users`: Criação de usuário.
*   `POST /scenarios`: Criação de cenário de teste.
*   `POST /results`: Registro de resultado de execução.

## 4. Tecnologias Utilizadas
*   **Node.js & TypeScript:** Linguagem e runtime.
*   **Express:** Framework web.
*   **TypeORM:** ORM para persistência de dados.
*   **TSyringe:** Injeção de dependência.
*   **BcryptJS:** Hashing de senhas.

## 5. Guia de Testes (API Endpoints - Postman)

Esta seção detalha os endpoints disponíveis para testes via Postman ou ferramentas similares.
**Base URL:** `http://localhost:3000` (ou conforme configurado no `.env`)

### 5.1 Autenticação e Usuários

#### **Criar Usuário (Registro)**
*   **Método:** `POST`
*   **Endpoint:** `/users`
*   **Autenticação:** Nenhuma
*   **Corpo (JSON):**
```json
{
  "username": "gabriel_qa",
  "email": "gabriel@example.com",
  "password": "senha_segura123"
}
```

#### **Login (Autenticação)**
*   **Método:** `POST`
*   **Endpoint:** `/users/session`
*   **Autenticação:** Nenhuma
*   **Corpo (JSON):**
```json
{
  "email": "gabriel@example.com",
  "password": "senha_segura123"
}
```
*   **Nota:** Retorna um `token` JWT que deve ser usado como `Bearer Token` nas rotas protegidas.

#### **Listar Usuários**
*   **Método:** `GET`
*   **Endpoint:** `/users`
*   **Autenticação:** `Bearer Token`

#### **Obter Detalhes do Usuário**
*   **Método:** `GET`
*   **Endpoint:** `/users/:id`
*   **Autenticação:** `Bearer Token`

#### **Atualizar Usuário**
*   **Método:** `PUT`
*   **Endpoint:** `/users/:id`
*   **Autenticação:** `Bearer Token`
*   **Corpo (JSON):**
```json
{
  "username": "gabriel_novo_nome",
  "email": "novo_email@example.com"
}
```

#### **Deletar Usuário**
*   **Método:** `DELETE`
*   **Endpoint:** `/users/:id`
*   **Autenticação:** `Bearer Token`

---

### 5.2 Cenários e Resultados

#### **Criar Cenário de Teste**
*   **Método:** `POST`
*   **Endpoint:** `/scenarios`
*   **Autenticação:** Nenhuma (Atualmente pública)
*   **Corpo (JSON):**
```json
{
  "name": "Login com Sucesso",
  "description": "Verifica se o usuário consegue logar com credenciais válidas.",
  "priority": 1,
  "createdByUserId": "UUID-DO-USUARIO"
}
```

#### **Registrar Resultado de Teste**
*   **Método:** `POST`
*   **Endpoint:** `/results`
*   **Autenticação:** Nenhuma (Atualmente pública)
*   **Corpo (JSON):**
```json
{
  "scenarioId": "UUID-DO-CENARIO",
  "resultStatus": "Success",
  "durationMs": 1500,
  "logs": "Passo 1: Abrir página... Passo 2: Digitar credenciais... OK",
  "executedByUserId": "UUID-DO-USUARIO"
}
```
*   **Status permitidos:** `Success`, `Failure`, `Skipped`.

---

### 5.3 Projetos e Módulos

#### **Obter Árvore de Módulos do Projeto**
*   **Método:** `GET`
*   **Endpoint:** `/projects/:projectId/modules/tree`
*   **Autenticação:** Nenhuma
*   **Corpo (JSON):** (Embora seja GET, o controlador atual espera o `projectId` no corpo ou parâmetro. Verifique a implementação)
```json
{
  "projectId": "UUID-DO-PROJETO"
}
```
