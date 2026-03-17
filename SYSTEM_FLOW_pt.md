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
