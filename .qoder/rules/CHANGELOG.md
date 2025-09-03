# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-01-09

### Added
- Implementação do Header com logo oficial da UFCG
- Implementação do Footer com informações institucionais
- Layout wrapper para consistência visual
- Sistema de cores institucional UFCG no Tailwind
- Links para redes sociais oficiais da UFCG

### Changed
- Atualização dos links das redes sociais no Footer para URLs oficiais corretas
- Facebook: https://www.facebook.com/UFCGOficial/
- Instagram: https://www.instagram.com/ufcg_oficial/
- Twitter: https://twitter.com/UFCG_Oficial
- YouTube: https://www.youtube.com/@Conex%C3%A3oUFCG
- Ajuste das dimensões da logo da UFCG para h-20 w-20
- Ajuste da altura do header para h-24
- Esquema de cores para ufcg-institutional (#1e40af)

### Fixed
- Correção de caracteres de escape desnecessários em JSX
- Correção de problemas de compilação no Layout.jsx
- Correção de erro de sintaxe no ModuleSelector.jsx
- Correção da ordem de @import no index.css (deve vir antes das diretivas @tailwind)
- Correção de importação do useAuth no ModuleSelector.jsx (importar do AuthContext em vez de hooks)
- Correção de importação do authService no UserProfile.jsx (mudança para importação nomeada)
- Uniformização do grid de cards entre UserCard e ResponsavelCard (md:grid-cols-2 lg:grid-cols-3)
- Alteração do UserForm de modal para card centralizado, seguindo mesmo padrão do ResponsavelForm
- Atualização das propriedades do UserForm para não usar mais Modal, implementando wrapper simples
- Reversão das alterações relacionadas ao tratamento de erros e feedback no frontend para módulo de usuários
- Remoção das funções de notificação personalizadas e fallbacks
- Simplificação do hook useUsers para implementação mais direta
- Remoção dos logs de debug excessivos
- Reversão das correções de dependências de useCallback
- Remoção da padronização de respostas da API
- Remoção do sistema de fallback com alerts
- Reversão da correção da função showToast no ToastContext