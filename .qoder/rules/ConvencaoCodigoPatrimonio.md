---
trigger: manual
---

Guia de Desenvolvimento Web Simples com React (Frontend) e Node.js (Backend)

1. Estrutura de Pastas

Frontend (React):
- src/
  - components/ → Componentes reutilizáveis
  - pages/ → Páginas principais
  - services/ → Chamadas de API
  - styles/ → Arquivos de estilo
  - App.jsx → Componente raiz
  - index.jsx → Ponto de entrada

Backend (Node.js + Express):
- src/
  - routes/ → Definição das rotas
  - controllers/ → Lógica das rotas
  - models/ → Modelos de dados (se usar banco)
  - config/ → Configurações gerais
  - index.js → Ponto de entrada do servidor

2. Padrões de Código

Frontend:
- Use bibliotecas como TailwindCSS
- Usar componentes funcionais com React Hooks
- Preferir JavaScript simples (TypeScript opcional)
- Nome de componentes em PascalCase
- Separar lógica de estilo e funcionalidade
- Usar CSS Modules ou arquivos .css separados

Backend:
- Usar JavaScript com Express
- Organizar rotas e lógica em arquivos separados
- Usar middlewares simples para autenticação e erros
- Evitar complexidade desnecessária

3. Comunicação entre Frontend e Backend

- Usar fetch ou Axios para chamadas HTTP
- Criar funções em /services para cada endpoint
- Backend deve responder com JSON padronizado:
  {
    success: true,
    data: ...,
    message: "Mensagem opcional"
  }

4. Estilo e Interface

- Usar CSS simples com biblioteca leve Tailwind
- Garantir responsividade básica (mobile e desktop)
- Componentes devem ser reutilizáveis quando possível

5. Segurança Básica

Frontend:
- Nunca expor dados sensíveis no código
- Usar variáveis de ambiente (.env)

Backend:
- Usar CORS para permitir acesso do frontend
- Validar dados recebidos
- Proteger rotas com autenticação simples (JWT opcional)

6. Banco de Dados (opcional)

- Usar PostgreSQL com biblioteca como Sequelize
- Criar modelos simples para cada entidade
- Separar lógica de acesso ao banco em /models ou /services

7. Testes (opcional)

- Testes básicos com Jest
- Testar funcionalidades principais e rotas

8. Deploy

Frontend:
- Deploy (quando solicitado) em Vercel ou Netlify

Backend:
- Usar variáveis de ambiente para configuração

9. Documentação

- Criar README.md com instruções de uso
- Comentar trechos importantes do código
- Manter organização e clareza nos nomes

10. Convenções Gerais

- Código limpo e legível
- Nomes claros para funções, variáveis e arquivos
- Evitar duplicação de lógica
- Priorizar simplicidade e funcionalidade

