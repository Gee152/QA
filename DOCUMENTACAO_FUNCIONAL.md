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
