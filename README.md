# Saurus Retaguarda App

![badge_de_status](https://img.shields.io/badge/STATUS-FINALIZADO-blue)

Este projeto consiste em uma aplicação web de retaguarda desenvolvida como parte de um desafio técnico. A plataforma foi projetada para simular um sistema de gerenciamento de pedidos, permitindo a visualização, seleção e processamento de pagamentos de pedidos pendentes. A arquitetura da aplicação foi concebida para ser modular e escalável, utilizando as melhores práticas do ecossistema ReactJS.

---

## 💻 Stack Tecnológico

- **Frontend**:
    - **React**: Biblioteca principal para a construção da interface de usuário.
    - **React Router DOM**: Gerenciamento de navegação e rotas dinâmicas.
- **Gerenciamento de Estado**:
    - **React Context API**: Utilizada para prover o estado de autenticação globalmente, simplificando o controle de acesso às rotas privadas.
- **Estilização**:
    - **CSS Puro**: A abordagem de estilização foi baseada em CSS puro e classes, garantindo alto desempenho e compatibilidade.
- **Ferramentas de Desenvolvimento**:
    - **Vite**: Ambiente de desenvolvimento e bundler para uma experiência de desenvolvimento rápida e otimizada.

---

## ✨ Principais Funcionalidades

A aplicação oferece as seguintes funcionalidades, que demonstram o fluxo completo de gerenciamento de pedidos e pagamento:

- **Autenticação**:
    - **Login**: Autenticação de usuário e senha para acesso seguro.
    - **Rotas Privadas**: Utilização de `PrivateRoute` para proteger as rotas sensíveis, redirecionando o usuário não autenticado para a página de login.
- **Gerenciamento de Pedidos**:
    - **Listagem Paginada**: Exibição de pedidos pendentes com paginação.
    - **Filtragem**: Funcionalidade de busca dinâmica por CNPJ, nome e código do pedido para otimizar a experiência do usuário.
    - **Seleção Múltipla**: Permite ao usuário selecionar um ou mais pedidos, consolidando o valor total para pagamento.
    - **Edição em Tempo Real**: Um modal de edição permite a atualização da descrição de um pedido, simulando a interação com um backend.
- **Processamento de Pagamentos**:
    - **Múltiplos Métodos**: Opções de pagamento via Cartão de Crédito/Débito, PIX (chave) e PIX (Link Copia e Cola).
    - **Simulação de API**: A lógica de pagamento é abstraída em uma função `sendPaymentReturn`, que simula a comunicação com uma API externa para processamento e retorno do status.
- **Status da Transação**:
    - **Feedback Visual**: Após o pagamento, uma tela de status é exibida, com feedback visual (spinner, checkmark) para indicar se a transação está pendente, foi aprovada ou se houve erro.

---

## 🛠️ Instalação e Execução

Para configurar e executar o projeto localmente, siga os passos abaixo:

### Pré-requisitos

Certifique-se de que o **Node.js** e o **npm** (ou yarn) estejam instalados em sua máquina.

### Guia de Execução

1. **Clone o repositório**:
   ```bash
   git clone [URL_DO_SEU_REPOSITORIO]

2. **Navegue até o diretório do projeto:**:
   ```bash
   cd nome-do-seu-projeto

3. **Instale as dependências:**:
   ```bash
   npm install

4. **Inicie o servidor de desenvolvimento:**:
   ```bash
   npm run dev

A aplicação será iniciada e estará disponível em http://localhost:5173.


### 📂 Estrutura do Projeto

A estrutura de diretórios foi desenhada para separar as responsabilidades e facilitar a manutenção e o crescimento da base de código.

* **`public/`**: Contém arquivos estáticos que não são processados pelo Vite, como o `index.html` e o `react.svg`.
* **`src/`**: Diretório principal onde o código-fonte da aplicação reside.
* **`src/api/`**: Responsável por agrupar a lógica e as funções relacionadas a chamadas de API.
* **`src/assets/`**: Pasta para armazenar ativos reutilizáveis, como imagens, ícones e fontes.
* **`src/components/`**: Contém os componentes de UI reutilizáveis da aplicação. Cada componente pode ter seu próprio diretório com seus arquivos `css` e `jsx`.
* **`src/context/`**: Gerencia o estado global da aplicação usando o Context API do React.
* **`src/pages/`**: Agrupa os componentes que representam as páginas ou rotas da aplicação, como `Login`, `Orders`, etc.
* **`App.jsx`**: Componente raiz da aplicação, onde a lógica de roteamento e a estrutura principal são definidas.
* **`index.css`**: Arquivo para estilos CSS globais.
* **`main.jsx`**: Ponto de entrada da aplicação, onde o componente `App` é renderizado.
* **`.gitignore`**: Define arquivos e diretórios que devem ser ignorados pelo Git.
* **`index.html`**: O arquivo HTML principal que serve como o ponto de entrada da aplicação.
* **`package-lock.json`**: Garante que as dependências do projeto permaneçam as mesmas em diferentes ambientes.
* **`package.json`**: Lista as dependências do projeto e scripts de execução.
* **`vite.config.js`**: Arquivo de configuração do Vite.

Agradecimento
Obrigado por dedicar seu tempo para analisar este projeto. Estou à disposição para quaisquer dúvidas ou feedback.
