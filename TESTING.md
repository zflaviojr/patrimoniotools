# Instruções para Execução e Teste

## Pré-requisitos

### Software Necessário
- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

## Configuração do Banco de Dados

### 1. Criar Banco PostgreSQL
```sql
-- Conectar no PostgreSQL como superuser e executar:
CREATE DATABASE patrimonio;
CREATE USER patrimonio_user WITH PASSWORD 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON DATABASE patrimonio TO patrimonio_user;
```

### 2. Executar Script de Inicialização
```bash
# Navegar para a pasta backend
cd backend

# Executar script SQL (ajustar conexão conforme necessário)
psql -h localhost -U patrimonio_user -d patrimonio -f database-setup.sql
```

### 3. Configurar Variáveis de Ambiente

#### Backend (.env)
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar arquivo .env com suas configurações:
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=patrimonio
DB_USER=patrimonio_user
DB_PASSWORD=sua_senha_aqui
JWT_SECRET=sua_chave_jwt_secreta_muito_segura
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```bash
# Na pasta frontend, o arquivo .env já está configurado:
VITE_API_URL=http://localhost:3001/api
```

## Execução da Aplicação

### 1. Iniciar Backend
```bash
# Navegar para pasta backend
cd backend

# Instalar dependências (se ainda não instalado)
npm install

# Iniciar servidor em modo desenvolvimento
npm run dev
```

O backend estará disponível em: http://localhost:3001

### 2. Iniciar Frontend
```bash
# Em outro terminal, navegar para pasta frontend
cd frontend

# Instalar dependências (se ainda não instalado)
npm install

# Iniciar aplicação em modo desenvolvimento
npm run dev
```

O frontend estará disponível em: http://localhost:5173

## Teste da Aplicação

### 1. Dados de Acesso Padrão
- **Usuário:** admin
- **Senha:** admin123

### 2. Dados de Teste
O script de inicialização cria 10 responsáveis de exemplo para testar as funcionalidades.

### 3. Funcionalidades para Testar

#### Autenticação
- [ ] Login com credenciais corretas
- [ ] Rejeição de credenciais incorretas
- [ ] Logout
- [ ] Redirecionamento automático quando não autenticado

#### Dashboard
- [ ] Visualização do dashboard após login
- [ ] Navegação para módulo de responsáveis
- [ ] Cards responsivos

#### Módulo Responsáveis

##### Lista
- [ ] Visualizar lista de responsáveis
- [ ] Paginação (teste com diferentes tamanhos de página)
- [ ] Busca por nome/matrícula
- [ ] Ordenação

##### CRUD
- [ ] Criar novo responsável
- [ ] Editar responsável existente
- [ ] Excluir responsável (com confirmação)
- [ ] Visualizar detalhes

##### Busca
- [ ] Busca por matrícula exata
- [ ] Busca por nome (parcial)
- [ ] Tratamento quando não encontrado

##### Validações
- [ ] Campos obrigatórios
- [ ] Matrícula única
- [ ] Formato da matrícula
- [ ] Intervalo de permissão (0-10)

## Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/validate` - Validar token
- `POST /api/auth/logout` - Logout

### Responsáveis
- `GET /api/responsaveis` - Listar (suporta paginação)
- `GET /api/responsaveis/:id` - Buscar por ID
- `GET /api/responsaveis/matricula/:matricula` - Buscar por matrícula
- `POST /api/responsaveis` - Criar
- `PUT /api/responsaveis/:id` - Atualizar
- `DELETE /api/responsaveis/:id` - Excluir

### Health Check
- `GET /health` - Verificar se API está funcionando

## Resolução de Problemas

### Erro de Conexão com Banco
1. Verificar se PostgreSQL está rodando
2. Confirmar credenciais no .env
3. Verificar se banco 'patrimonio' existe
4. Verificar permissões do usuário

### Erro de CORS
1. Verificar FRONTEND_URL no .env do backend
2. Confirmar que frontend está rodando na porta 5173

### Erro de JWT
1. Gerar nova JWT_SECRET segura
2. Verificar se secret não contém caracteres especiais

### Erro de Dependências
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## Estrutura de Testes

### Frontend
- Componentes renderizam corretamente
- Formulários validam dados
- Navegação funciona
- Estados de loading/erro

### Backend  
- Endpoints respondem corretamente
- Validações funcionam
- Autenticação JWT
- Operações de banco de dados

### Integração
- Comunicação frontend-backend
- Fluxo completo de dados
- Tratamento de erros
- Performance básica