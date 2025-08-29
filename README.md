# Sistema de Gestão de Responsáveis

Sistema web full-stack para gerenciamento de responsáveis com funcionalidades CRUD completas. O sistema permite o cadastro, consulta, alteração e exclusão de responsáveis, além de autenticação e controle de acesso.

## Tecnologias

### Frontend
- React 18+ com Vite
- Tailwind CSS
- Axios (API calls)
- React Router (navegação)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (autenticação)
- bcryptjs (criptografia de senhas)

## Estrutura do Projeto

```
PatrimonioTools/
├── frontend/           # Aplicação React
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/      # Páginas principais
│   │   ├── services/   # Chamadas de API
│   │   └── styles/     # Arquivos de estilo
│   └── package.json
├── backend/            # API Node.js
│   ├── src/
│   │   ├── controllers/ # Lógica das rotas
│   │   ├── routes/     # Definição das rotas
│   │   ├── models/     # Modelos de dados
│   │   ├── config/     # Configurações
│   │   └── middleware/ # Middlewares
│   └── package.json
└── README.md
```

## Funcionalidades

### Autenticação
- Login de usuários
- Controle de acesso com JWT
- Rotas protegidas

### Gestão de Responsáveis
- Listar todos os responsáveis
- Cadastrar novo responsável
- Editar responsável existente
- Excluir responsável
- Buscar por matrícula
- Validação de matrícula única

### Interface
- Design responsivo (mobile e desktop)
- Interface em cards
- Dashboard com seletor de módulos

## Banco de Dados

### Tabela: tblresponsavel
```sql
CREATE TABLE public.tblresponsavel (
	id serial4 NOT NULL,
	matricula varchar NOT NULL,
	permissao int4 NULL,
	nome varchar NULL,
	CONSTRAINT pkidreponsavel PRIMARY KEY (id),
	CONSTRAINT uk_matricula UNIQUE (matricula)
);
```

## Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Configuração

### Variáveis de Ambiente (Backend)
Criar arquivo `.env` na pasta backend:
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=patrimonio
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=seu_jwt_secret
```

### Variáveis de Ambiente (Frontend)
Criar arquivo `.env` na pasta frontend:
```
VITE_API_URL=http://localhost:3001/api
```

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/logout` - Logout do usuário
- `GET /api/auth/validate` - Validar token

### Responsáveis
- `GET /api/responsaveis` - Listar todos os responsáveis
- `GET /api/responsaveis/:id` - Buscar responsável por ID
- `GET /api/responsaveis/matricula/:matricula` - Buscar por matrícula
- `POST /api/responsaveis` - Criar novo responsável
- `PUT /api/responsaveis/:id` - Atualizar responsável
- `DELETE /api/responsaveis/:id` - Excluir responsável

## Desenvolvido seguindo as convenções do PatrimonioTools