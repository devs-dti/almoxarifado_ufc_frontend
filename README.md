# 🦷 Sistema de Almoxarifado – Clínica Odontológica UFC (Frontend)

Frontend desenvolvido em **Next.js (TypeScript)** para o **Sistema de Almoxarifado** da **Clínica de Odontologia da Universidade Federal do Ceará (UFC)**.  
O sistema visa otimizar o controle de **materiais odontológicos**, **entradas e saídas de estoque**, **perfis de usuários** e **relatórios administrativos**, integrando-se a um **backend em Java (Spring Boot)**.

---

## 🚀 Visão Geral

Este repositório contém a interface web do sistema, construída com **Next.js 15 (App Router)** e conectada ao backend Java via **API RESTful**.

O objetivo é proporcionar uma experiência rápida, segura e intuitiva aos usuários (professores, técnicos e alunos), permitindo:

- Gerenciamento de materiais e insumos odontológicos;
- Controle de entradas e saídas do almoxarifado;
- Registro de movimentações e histórico;
- Relatórios e indicadores de consumo por período e setor.

---

## 🧱 Tecnologias Principais

| Categoria                   | Tecnologia                                                                     | Descrição                                 |
| --------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- |
| **Framework**               | [Next.js 15](https://nextjs.org/)                                              | Framework React com SSR, SSG e API Routes |
| **Linguagem**               | [TypeScript](https://www.typescriptlang.org/)                                  | Tipagem estática e segura                 |
| **UI**                      | [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/) | Estilo moderno e consistente              |
| **Formulários**             | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)      | Manipulação e validação de formulários    |
| **Gerenciamento de Estado** | [Zustand](https://zustand-demo.pmnd.rs/)                                       | Gerenciamento de estado global simples    |
| **Requisições HTTP**        | [Axios](https://axios-http.com/)                                               | Comunicação com o backend Java            |
| **Autenticação**            | JWT + Context API                                                              | Controle de acesso com token JWT          |
| **Gráficos e Relatórios**   | [Recharts](https://recharts.org/)                                              | Visualização de dados e relatórios        |
| **Empacotamento e Build**   | [Next Build / Docker](https://nextjs.org/docs/deployment)                      | Ambiente de produção institucional        |
| **Infraestrutura**          | Docker + Nginx                                                                 | Deploy institucional e seguro             |

---

## 🔄 Integração com o Backend Java

O frontend consome as rotas REST expostas pelo backend em **Spring Boot**.  
A comunicação ocorre via **HTTP (JSON)** com autenticação **JWT**.

### Exemplo de fluxo

```bash
POST /api/auth/login     → Retorna token JWT
GET  /api/materials      → Lista de materiais
POST /api/materials      → Cria novo material
PUT  /api/materials/:id  → Atualiza material
DELETE /api/materials/:id → Remove material
```

### Configuração de proxy (em next.config.mjs)

```bash
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // backend Java local
      },
    ]
  },
}

export default nextConfig
```

Isso permite desenvolver o frontend em localhost:3000 sem problemas de CORS.

## 🧩 Estrutura de Pastas

```bash
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── materiais/
│   │   │   └── page.tsx
│   │   ├── entradas/
│   │   │   └── page.tsx
│   │   └── saidas/
│   │       └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── api/
│       └── mock/ (rotas de teste se necessário)
├── components/      # Componentes reutilizáveis
├── hooks/           # Hooks customizados
├── lib/             # Utilitários e configs globais
├── services/        # Comunicação com backend (Axios)
│   ├── api.ts
│   ├── auth.ts
│   ├── materiais.ts
│   ├── entradas.ts
│   └── saidas.ts
├── store/           # Zustand (estado global)
├── types/           # Tipos e interfaces
└── utils/           # Funções auxiliares
```

## ⚙️ Instalação e Execução

### 🔧 Pré-requisitos

- Node.js 18+

- NPM ou Yarn

- Backend Java rodando localmente (porta 8080)

- PostgreSQL (para o backend)

### 🛠️ Instalação

```bash
# Clonar o repositório
git clone https://github.com/ufc-odontologia/almoxarifado-frontend.git

# Entrar na pasta
cd almoxarifado-frontend

# Instalar dependências
npm install
```

### ▶️ Execução

```
# Modo desenvolvimento
npm run dev
# Acesse em http://localhost:3000
```

## 🐳 Deploy com Docker (Ambiente Institucional UFC)

## 🧠 Padrões e Boas Práticas

- Código padronizado com ESLint + Prettier

- Commits no formato Conventional Commits

- Cada feature vinculada a um RF

- Componentes reutilizáveis

- Camadas separadas (serviço / UI)

- Validação tipada com Zod

## 📊 Telas Principais (RFs)

- RF01 - Login → Autenticação JWT
- RF02 - Indicadores de estoque
- RF03 - Materiais → CRUD de materiais
- RF04 - Entradas → Registro de entrada
- RF05 - Saídas → Registro de saída
- RF06 - Relatórios → Exportação de dados
