<h1 align="center">Hexagonal Architecture API</h1>

<p align="center">
  <a><img alt="nodejs" src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"></a>
  <a><img alt="typescript" src="https://img.shields.io/badge/typescript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"></a>
  <a><img alt="pnpm" src="https://img.shields.io/badge/pnpm-33333D?style=for-the-badge&logo=pnpm&logoColor=white"></a>
  <a><img alt="vitest" src="https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white"></a>
  <a><img alt="sqlite" src="https://img.shields.io/badge/sqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white"></a>
</p>

<p align="center">Uma API construída com Arquitetura Hexagonal utilizando o módulo HTTP nativo do Node.js</p>

## 📜 Sumário

- [📋 Sobre o Projeto](#-sobre-o-projeto)
- [📦 Pré-requisitos](#-pré-requisitos)
- [🔧 Como Configurar e Rodar o Projeto](#-como-configurar-e-rodar-o-projeto)
- [📊 Modelo ERD das Entidades do Banco](#-modelo-erd-das-entidades-do-banco)
- [🔌 Endpoints da Aplicação](#-endpoints-da-aplicação)
- [🏗️ Arquitetura Hexagonal](#️-arquitetura-hexagonal)
- [🧪 Testes](#-testes)
  - [Testes Unitários](#testes-unitários)
  - [Testes de Integração](#testes-de-integração)
  - [Testes de Ponta a Ponta (E2E)](#testes-de-fim-a-fim-e2e)
- [👤 Autor](#-autor)
- [📄 Licença](#-licença)

## 📋 Sobre o Projeto

Este projeto visa demonstrar a aplicação prática dos conceitos e princípios da Arquitetura Hexagonal (Port and Adapters), dando destaque a uma base de código flexível, fácil de testar e simples de manter. Para alcançar esse objetivo foi desenvolvida uma API com TypeScript. Além disso, o projeto conta com uma biblioteca interna enxuta que abstrai a lógica do módulo HTTP nativo do NodeJS, sendo ela inspirada nos frameworks [Express](https://github.com/expressjs/express) e [Fastify](https://github.com/fastify/fastify).

> [!WARNING]
>
> A biblioteca desenvolvida neste projeto não é robusta o suficiente para ambientes de produção. Ela foi criada com fins educativos. Para aplicações em produção, recomenda-se o uso de soluções mais maduras.

## 📦 Pré-requisitos

Antes de começar, verifique se você possui as seguintes ferramentas:

- Runtime **[Node.js](https://nodejs.org/)** v20.9.0 ou acima
- Gerenciador de pacotes **[pnpm](https://pnpm.io/installation#using-npm)**
- _Um editor de código de sua preferência (recomendado: VSCode)_

## 🔧 Como Configurar e Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto:

1. **Clone o repositório:**

```bash
git clone https://github.com/laurindosamuel/hexagonal-architecture-api.git
```

2. **Instale as dependências:**

```bash
cd hexagonal-architecture-api
pnpm install
```

3. **Configure as variáveis de ambiente**


## 👤 Autor

Feito por [laurindosamuel](https://github.com/laurindosamuel). Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato!

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
