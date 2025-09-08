# Changelog

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

## [1.0.0] - 2025-09-01

### Adicionado

- Versão inicial do sistema com CRUD completo para a entidade "Responsável"
- Autenticação JWT e controle de acesso
- Interface administrativa responsiva com React
- Backend em Node.js com Express
- Banco de dados PostgreSQL