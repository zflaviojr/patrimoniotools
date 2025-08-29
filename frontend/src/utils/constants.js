// Constantes da aplicação

// URLs e endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VALIDATE: '/auth/validate',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  RESPONSAVEIS: {
    BASE: '/responsaveis',
    BY_ID: (id) => `/responsaveis/${id}`,
    BY_MATRICULA: (matricula) => `/responsaveis/matricula/${matricula}`,
    SEARCH_BY_NOME: (nome) => `/responsaveis/search/${nome}`,
    STATS: '/responsaveis/stats'
  }
};

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 20, 50],
  MAX_LIMIT: 100
};

// Limites de validação
export const VALIDATION_LIMITS = {
  NOME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 255
  },
  MATRICULA: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50
  },
  PERMISSAO: {
    MIN: 0,
    MAX: 10
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  EMAIL: {
    MAX_LENGTH: 254
  }
};

// Mensagens do sistema
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login realizado com sucesso!',
    LOGOUT: 'Logout realizado com sucesso!',
    RESPONSAVEL_CREATED: 'Responsável criado com sucesso!',
    RESPONSAVEL_UPDATED: 'Responsável atualizado com sucesso!',
    RESPONSAVEL_DELETED: 'Responsável excluído com sucesso!',
    DATA_SAVED: 'Dados salvos com sucesso!',
    OPERATION_COMPLETED: 'Operação realizada com sucesso!'
  },
  ERROR: {
    NETWORK: 'Erro de conexão. Verifique sua internet.',
    UNAUTHORIZED: 'Acesso não autorizado. Faça login novamente.',
    FORBIDDEN: 'Você não tem permissão para realizar esta ação.',
    NOT_FOUND: 'Recurso não encontrado.',
    VALIDATION: 'Dados inválidos. Verifique os campos.',
    SERVER: 'Erro interno do servidor. Tente novamente.',
    UNKNOWN: 'Erro desconhecido. Tente novamente.',
    RESPONSAVEL_NOT_FOUND: 'Responsável não encontrado.',
    MATRICULA_DUPLICATE: 'Esta matrícula já está cadastrada.',
    OPERATION_FAILED: 'Falha na operação. Tente novamente.'
  },
  WARNING: {
    UNSAVED_CHANGES: 'Você tem alterações não salvas. Deseja continuar?',
    DELETE_CONFIRMATION: 'Esta ação não pode ser desfeita.',
    LOGOUT_CONFIRMATION: 'Deseja realmente sair do sistema?'
  },
  INFO: {
    LOADING: 'Carregando...',
    SEARCHING: 'Buscando...',
    SAVING: 'Salvando...',
    DELETING: 'Excluindo...',
    NO_DATA: 'Nenhum dado encontrado.',
    EMPTY_SEARCH: 'Nenhum resultado encontrado para sua busca.',
    WELCOME: 'Bem-vindo ao sistema!'
  }
};

// Configurações de toast
export const TOAST_CONFIG = {
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000
  },
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }
};

// Status de loading
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Configurações de localStorage
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  PREFERENCES: 'preferences',
  LAST_VISIT: 'lastVisit'
};

// Expressões regulares
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MATRICULA: /^[A-Z0-9._-]+$/,
  NOME: /^[a-zA-ZÀ-ÿ\s.-]+$/,
  USERNAME: /^[a-zA-Z0-9._-]+$/,
  PASSWORD_STRENGTH: {
    HAS_LETTER: /[a-zA-Z]/,
    HAS_NUMBER: /[0-9]/,
    HAS_SPECIAL: /[!@#$%^&*(),.?":{}|<>]/,
    HAS_UPPERCASE: /[A-Z]/,
    HAS_LOWERCASE: /[a-z]/
  }
};

// Configurações de permissões
export const PERMISSIONS = {
  RESPONSAVEIS: {
    VIEW: 'responsaveis:view',
    CREATE: 'responsaveis:create',
    EDIT: 'responsaveis:edit',
    DELETE: 'responsaveis:delete'
  },
  ADMIN: {
    FULL_ACCESS: 'admin:full'
  }
};

// Configurações de módulos
export const MODULES = {
  RESPONSAVEIS: {
    ID: 'responsaveis',
    NAME: 'Responsáveis',
    PATH: '/responsaveis',
    ENABLED: true
  },
  PATRIMONIO: {
    ID: 'patrimonio',
    NAME: 'Patrimônio',
    PATH: '/patrimonio',
    ENABLED: false
  },
  RELATORIOS: {
    ID: 'relatorios',
    NAME: 'Relatórios',
    PATH: '/relatorios',
    ENABLED: false
  },
  CONFIGURACOES: {
    ID: 'configuracoes',
    NAME: 'Configurações',
    PATH: '/configuracoes',
    ENABLED: false
  }
};

// Configurações de tema
export const THEME = {
  COLORS: {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info'
  },
  SIZES: {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    XLARGE: 'xlarge'
  }
};

// Configurações de desenvolvimento
export const DEV_CONFIG = {
  ENABLE_LOGS: import.meta.env.DEV,
  ENABLE_DEBUG: import.meta.env.DEV,
  API_TIMEOUT: 10000
};

// Configurações de formatação
export const FORMAT = {
  DATE: {
    SHORT: 'dd/MM/yyyy',
    LONG: 'dd/MM/yyyy HH:mm:ss',
    TIME: 'HH:mm'
  },
  CURRENCY: {
    LOCALE: 'pt-BR',
    CURRENCY: 'BRL'
  }
};

// Configurações de debounce
export const DEBOUNCE = {
  SEARCH: 300,
  VALIDATION: 500,
  SAVE: 1000
};