# Funcionalidades do Projeto

Este documento lista as principais funcionalidades implementadas no sistema de gerenciamento de testes.

## 1. Gestão de Usuários
- [x] **Criação de Usuário:** Registro de novos usuários com nome de usuário, e-mail e senha segura.
- [x] **Hasing de Senha:** Proteção de senhas utilizando o algoritmo `bcryptjs`.
- [x] **Validação de E-mail Único:** Impede a criação de múltiplos usuários com o mesmo e-mail.

## 2. Gestão de Cenários de Teste
- [x] **Cadastro de Cenário de Teste:** Definição de novos cenários com nome, descrição detalhada e prioridade.
- [x] **Status Automático:** Novos cenários são criados com status inicial como `Pending`.
- [x] **Vínculo com Criador:** Cada cenário é associado obrigatoriamente a um usuário cadastrado.

## 3. Gestão de Resultados de Execução
- [x] **Registro de Resultado:** Armazenamento dos resultados após a execução de testes.
- [x] **Status de Execução:** Suporte para os estados `Success`, `Failure` e `Skipped`.
- [x] **Medição de Performance:** Registro do tempo de execução em milissegundos (`durationMs`).
- [x] **Log de Execução:** Armazenamento de logs detalhados para depuração de falhas.
- [x] **Vínculo com Executor:** Registro do usuário que realizou a execução do teste.

## 4. Arquitetura e Padrões
- [x] **Clean Architecture:** Separação clara entre domínio, casos de uso e infraestrutura.
- [x] **Injeção de Dependência:** Utilização do `tsyringe` para desacoplamento de classes.
- [x] **Tratamento de Erros:** Middleware global para captura e padronização de erros (`AppError`).
