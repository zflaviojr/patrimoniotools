# Changelog

## [1.3.0] - 2025-09-18

### Adicionado

- Reorganização do banco de dados com novo schema 'tools'
- Banco de dados:
  - Criação do schema 'tools' para organizar tabelas do sistema
  - Movimentação das tabelas de sistema para o schema 'tools':
    - `users` - tabela de usuários do sistema
    - `password_history` - histórico de senhas dos usuários
    - `login_attempts` - registro de tentativas de login
    - `audit_logs` - logs de auditoria do sistema
  - Tabelas mantidas no schema 'public':
    - `tblresponsavel` - tabela de responsáveis
    - `tbldescricao` - tabela de descrições
  - Scripts de migração:
    - [migration-move-to-tools-schema.sql](backend/migration-move-to-tools-schema.sql) para mover tabelas existentes
- Backend:
  - Atualização de todos os modelos para referenciar tabelas no novo schema:
    - [User.js](backend/src/models/User.js) - acesso à tabela tools.users
    - [PasswordHistory.js](backend/src/models/PasswordHistory.js) - acesso à tabela tools.password_history
    - [LoginAttempt.js](backend/src/models/LoginAttempt.js) - acesso à tabela tools.login_attempts
    - [AuditLog.js](backend/src/models/AuditLog.js) - acesso à tabela tools.audit_logs
  - Atualização dos scripts de inicialização:
    - [init-db.js](backend/src/config/init-db.js) - criação de tabelas no schema correto
    - [init-security-tables.js](backend/src/config/init-security-tables.js) - criação de tabelas de segurança no schema tools
  - Atualização dos scripts SQL:
    - [database-setup.sql](backend/database-setup.sql) - criação de tabelas no schema tools
    - [security-setup.sql](backend/security-setup.sql) - criação de tabelas de segurança no schema tools
    - [migration-add-telefone.sql](backend/migration-add-telefone.sql) - atualização da tabela tools.users
- Scripts utilitários:
  - Atualização de scripts de verificação para acessar tabelas no novo schema:
    - [check-users.js](backend/check-users.js)
    - [check-test-user.js](check-test-user.js)
    - [check_users.js](check_users.js)

### Modificado

- Atualização de todas as referências a tabelas no código para usar o schema 'tools'
- Reorganização da estrutura do banco de dados para melhorar a manutenção e separação de conceitos

## [1.2.0] - 2025-09-11

### Adicionado

- Implementação completa da política de segurança de senhas e proteção contra acessos não autorizados
- Banco de dados:
  - Novas tabelas de segurança:
    - `password_history` para armazenar histórico de senhas
    - `login_attempts` para rastrear tentativas de login
    - `audit_logs` para registrar eventos de auditoria
  - Campos adicionais na tabela `users`:
    - `password_last_changed` para rastrear quando a senha foi alterada
    - `password_expires_at` para definir data de expiração da senha
- Backend:
  - Modelos:
    - [PasswordHistory.js](backend/src/models/PasswordHistory.js) para gerenciar histórico de senhas
    - [LoginAttempt.js](backend/src/models/LoginAttempt.js) para controlar tentativas de login
    - [AuditLog.js](backend/src/models/AuditLog.js) para registrar eventos de auditoria
  - Serviços:
    - [passwordPolicyService.js](backend/src/services/passwordPolicyService.js) com lógica de política de senhas
    - [loginAttemptService.js](backend/src/services/loginAttemptService.js) para controle de tentativas
    - [auditService.js](backend/src/services/auditService.js) para registro de auditoria
  - Middlewares:
    - [security.js](backend/src/middleware/security.js) com middlewares de segurança
    - Validação de política de senhas, reutilização e tentativas de login
  - Atualização do modelo [User.js](backend/src/models/User.js) para incluir campos de segurança
  - Atualização do serviço [authService.js](backend/src/services/authService.js) para integrar políticas de segurança
  - Atualização do controlador [authController.js](backend/src/controllers/authController.js) para validar senhas
  - Atualização das rotas [auth.js](backend/src/routes/auth.js) para incluir middlewares de segurança
  - Atualização do middleware [errorHandler.js](backend/src/middleware/errorHandler.js) para novos tipos de erro
- Frontend:
  - Componentes:
    - [PasswordPolicyIndicator.jsx](frontend/src/components/auth/PasswordPolicyIndicator.jsx) para exibir requisitos de senha
    - [LoginAttemptCounter.jsx](frontend/src/components/auth/LoginAttemptCounter.jsx) para mostrar tentativas restantes
  - Atualização do formulário [LoginForm.jsx](frontend/src/components/auth/LoginForm.jsx) para integrar componentes de segurança
  - Atualização do modal [ChangePasswordModal.jsx](frontend/src/components/users/ChangePasswordModal.jsx) para validar política de senhas
  - Atualização do serviço [authService.js](frontend/src/services/authService.js) para tratar erros de segurança
- Scripts:
  - [security-setup.sql](backend/security-setup.sql) para criar/atualizar tabelas de segurança
  - [init-security-tables.js](backend/src/config/init-security-tables.js) para inicializar tabelas de segurança
  - [test-security.js](backend/test-security.js) para testar funcionalidades de segurança
- Funcionalidades de segurança:
  - Política de senhas fortes (mínimo 8 caracteres, maiúscula, minúscula, número, caractere especial)
  - Prevenção de reutilização das últimas 5 senhas
  - Expiração de senhas a cada 90 dias
  - Bloqueio temporário após 5 tentativas falhas de login
  - Registro completo de tentativas de login, acessos e ações sensíveis
  - Auditoria de eventos de segurança

### Modificado

- Atualização do script de inicialização do banco de dados [init-db.js](backend/src/config/init-db.js) para incluir tabelas de segurança
- Atualização do utilitário de validações para incluir validações de política de senhas

## [1.1.0] - 2025-09-05

### Adicionado

- Implementação completa do CRUD para a entidade "Descrição"
- Banco de dados:
  - Tabela `tbldescricao` com campos: id, descricao, subcontasiafi, vidautil, codigo, useradd, deletado
  - Generator automático para o campo `codigo` usando sequences do PostgreSQL
  - Trigger para preencher automaticamente o código ao inserir novos registros
- Backend:
  - Modelo [Descricao.js](backend/src/models/Descricao.js) com métodos para CRUD e buscas
  - Serviço [descricaoService.js](backend/src/services/descricaoService.js) com lógica de negócio e validações
  - Controlador [descricaoController.js](backend/src/controllers/descricaoController.js) com endpoints da API
  - Rotas [descricoes.js](backend/src/routes/descricoes.js) para acesso aos endpoints
  - Validações adicionais para os campos da entidade Descrição
- Frontend:
  - Serviço [descricaoService.js](frontend/src/services/descricaoService.js) para comunicação com a API
  - Contexto [DescricaoContext.jsx](frontend/src/context/DescricaoContext.jsx) para gerenciamento de estado
  - Hooks [useDescricoes.js](frontend/src/hooks/useDescricoes.js) para lógica de componentes
  - Componentes:
    - [DescricaoForm.jsx](frontend/src/components/descricoes/DescricaoForm.jsx) - Formulário de criação/edição
    - [DescricaoList.jsx](frontend/src/components/descricoes/DescricaoList.jsx) - Lista principal
    - [DescricaoTableList.jsx](frontend/src/components/descricoes/DescricaoTableList.jsx) - Tabela de registros
    - [DescricaoSearch.jsx](frontend/src/components/descricoes/DescricaoSearch.jsx) - Componente de busca
  - Página [Descricoes.jsx](frontend/src/pages/Descricoes.jsx) para acesso ao módulo
  - Integração no menu principal através do [ModuleSelector.jsx](frontend/src/components/layout/ModuleSelector.jsx)
  - Rota adicionada no [App.jsx](frontend/src/App.jsx)
- Testes:
  - Script de teste [test-descricao.js](backend/test-descricao.js) para verificar funcionalidades

### Modificado

- Atualização do script de inicialização do banco de dados [database-setup.sql](backend/database-setup.sql) para incluir a tabela de descrições e dados de teste
- Atualização do arquivo principal do backend [index.js](backend/src/index.js) para incluir as novas rotas
- Atualização do utilitário de validações [validation.js](backend/src/utils/validation.js) para incluir validações específicas da entidade Descrição

## [1.0.0] - 2025-09-12

### Added
- Sistema de autenticação com JWT
- CRUD de responsáveis
- CRUD de descrições
- CRUD de usuários (apenas admin)
- Sistema de auditoria
- Política de senhas
- Proteção contra tentativas de login falhas
- Bloqueio temporário de contas após múltiplas tentativas falhas

### Changed
- Melhorias na interface do usuário
- Atualização das dependências
- Aprimoramento da segurança
- Correção de erros de exibição de mensagens na tela de login

### Removed
- Componente LoginAttemptCounter.jsx que exibia tentativas restantes de forma incorreta

## [0.2.0] - 2025-09-10

### Added
- Funcionalidade de mudança de senha
- Validação de política de senhas
- Histórico de senhas para evitar reutilização
- Expiração de senhas (90 dias)
- Sistema de tentativas de login
- Bloqueio temporário de contas

### Changed
- Aprimoramento da segurança do sistema
- Melhorias na interface do usuário
- Otimização do código

## [0.1.0] - 2025-09-08

### Added
- Projeto inicial
- Estrutura básica do frontend (React + Vite)
- Estrutura básica do backend (Node.js + Express)
- Conexão com PostgreSQL
- CRUD básico de responsáveis
- Sistema de autenticação básico