import axios from 'axios';

// Configuração base da API
console.error('Import.meta.env:', import.meta.env);
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
console.error('API: Base URL configurada:', API_BASE_URL);

// Criar instância do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para adicionar token nas requisições
apiClient.interceptors.request.use(
  (config) => {
    console.error('API: Interceptor de request chamado com config:', config);
    const token = localStorage.getItem('token');
    console.error('API: Token encontrado no localStorage:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.error('API: Config final:', config);
    return config;
  },
  (error) => {
    console.error('API: Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
apiClient.interceptors.response.use(
  (response) => {
    console.error('API: Interceptor de response chamado com response:', response);
    return response;
  },
  (error) => {
    console.error('API: Erro no interceptor de response:', error);
    // Se token expirou ou é inválido, fazer logout
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirecionar para login se não estiver já na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Função para obter mensagem de erro padronizada
export const getErrorMessage = (error) => {
  if (error.response) {
    // Erro de resposta do servidor
    return error.response.data?.message || 
           error.response.data?.error || 
           `Erro ${error.response.status}: ${error.response.statusText}`;
  } else if (error.request) {
    // Erro de rede (sem resposta do servidor)
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  } else {
    // Erro na configuração da requisição
    return error.message || 'Erro desconhecido ao fazer requisição.';
  }
};

// Funções auxiliares para fazer requisições
export const api = {
  // GET request
  get: async (url, config = {}) => {
    console.error('API: GET chamado com:', { url, config });
    try {
      const response = await apiClient.get(url, config);
      console.error('API: GET response:', JSON.stringify(response, null, 2));
      return response.data;
    } catch (error) {
      console.error('API: Erro no GET:', error);
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    console.error('API: POST chamado com:', { url, data, config });
    try {
      const response = await apiClient.post(url, data, config);
      console.error('API: POST response:', JSON.stringify(response, null, 2));
      return response.data;
    } catch (error) {
      console.error('API: Erro no POST:', error);
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    console.error('API: PUT chamado com:', { url, data, config });
    try {
      const response = await apiClient.put(url, data, config);
      console.error('API: PUT response:', JSON.stringify(response, null, 2));
      return response.data;
    } catch (error) {
      console.error('API: Erro no PUT:', error);
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    console.error('API: DELETE chamado com:', { url, config });
    try {
      const response = await apiClient.delete(url, config);
      console.error('API: DELETE response:', JSON.stringify(response, null, 2));
      return response.data;
    } catch (error) {
      console.error('API: Erro no DELETE:', error);
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    console.error('API: PATCH chamado com:', { url, data, config });
    try {
      const response = await apiClient.patch(url, data, config);
      console.error('API: PATCH response:', JSON.stringify(response, null, 2));
      return response.data;
    } catch (error) {
      console.error('API: Erro no PATCH:', error);
      throw error;
    }
  }
};

// Função para configurar o token manualmente
export const setAuthToken = (token) => {
  console.error('API: setAuthToken chamado com token:', token);
  if (token) {
    apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete apiClient.defaults.headers.Authorization;
    localStorage.removeItem('token');
  }
};

export default apiClient;