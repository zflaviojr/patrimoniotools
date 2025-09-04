# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Não publicado]

### Corrigido
- Problema na exibição dos cards de usuários cadastrados
- Correção da verificação de estrutura de dados no serviço de usuários
- Remoção do frame de debug da API que foi utilizado para testes
- Problema de loop infinito na listagem de usuários no frontend
- Problema de exibição da lista de usuários no frontend
- Tratamento de dados de usuários no hook useUsers
- Validação de dados no componente UserCard
- Formatação de datas no componente UserCard
- Tratamento de dados no componente UserList
- Retorno de dados no formato correto no backend (UserController)
- Estrutura de dados no serviço de usuários (UserService)
- Formatação de dados de usuários no backend para garantir compatibilidade com o frontend
- Problemas de autenticação com tokens expirados

## [1.0.0] - 2024-05-15

### Adicionado
- Sistema de gerenciamento de responsáveis
- Sistema de autenticação de usuários
- CRUD de responsáveis
- CRUD de usuários
- Interface administrativa
- Validações de formulários
- Tratamento de erros
- Sistema de notificações (toasts)
- Paginação de listagens
- Busca por responsáveis
- Perfil de usuário
- Alteração de senha
- Design responsivo

### Alterado
- Melhorias na interface do usuário
- Otimizações de performance
- Atualizações de segurança

### Corrigido
- Diversos bugs relacionados a validações
- Problemas de exibição em dispositivos móveis
- Erros de tratamento de dados