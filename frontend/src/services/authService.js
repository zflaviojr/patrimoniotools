import { api, setAuthToken, getErrorMessage } from './api.js';

export const authService = {
  // Fazer login
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.success && response.data.token) {
        // Armazenar token e dados do usuário
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Configurar token no axios
        setAuthToken(response.data.token);
        
        return response.data;
      }
      
      throw new Error(response.message || 'Erro no login');
    } catch (error) {
      console.error('Erro no serviço de login:', error);
      // Tratar erros específicos de segurança
      if (error.response && error.response.status === 423) {
        const lockedError = new Error('Conta temporariamente bloqueada. Tente novamente mais tarde.');
        lockedError.response = error.response;
        throw lockedError;
      }
      
      // Tratar outros erros de resposta
      if (error.response && error.response.data && error.response.data.message) {
        // Criar um erro customizado que inclui informações extras
        const customError = new Error(error.response.data.message);
        customError.response = error.response;
        throw customError;
      }
      
      throw error;
    }
  },

  // Fazer logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Mesmo se der erro na API, fazer logout local
      console.warn('Erro ao fazer logout na API:', error);
    } finally {
      // Limpar dados locais
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthToken(null);
    }
  },

  // Validar token
  async validateToken() {
    try {
      const response = await api.get('/auth/validate');
      
      if (response.success) {
        return response.data.user;
      }
      
      throw new Error('Token inválido');
    } catch (error) {
      // Se token inválido, fazer logout local
      this.logout();
      throw error;
    }
  },

  // Obter usuário atual do localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erro ao obter usuário do localStorage:', error);
      return null;
    }
  },

  // Obter token do localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Verificar se usuário está autenticado
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Alterar senha
  async changePassword(passwords) {
    try {
      const response = await api.post('/auth/change-password', passwords);
      return response;
    } catch (error) {
      // Tratar erros específicos de política de senhas
      if (error.response && error.response.data && error.response.data.errors) {
        const policyErrors = error.response.data.errors;
        throw new Error(`Erro na política de senhas: ${policyErrors.join(', ')}`);
      }
      
      // Tratar erro de reutilização de senha
      if (error.response && error.response.data && error.response.data.message && 
          error.response.data.message.includes('reutilizar')) {
        throw new Error('Não é permitido reutilizar as últimas 5 senhas');
      }
      
      // Tratar outros erros de resposta
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  },

  // Obter dados do usuário atual da API
  async getCurrentUserFromAPI() {
    try {
      const response = await api.get('/auth/me');
      
      if (response.success) {
        // Atualizar dados no localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      
      throw new Error('Erro ao obter dados do usuário');
    } catch (error) {
      throw error;
    }
  },

  // Atualizar perfil do usuário
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      if (response.success) {
        // Atualizar dados no localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response;
      }
      
      throw new Error(response.message || 'Erro ao atualizar perfil');
    } catch (error) {
      // Tratar erros de resposta
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  },

  // Inicializar autenticação ao carregar a aplicação
  async initializeAuth() {
    const token = this.getToken();
    
    if (token) {
      setAuthToken(token);
      
      try {
        // Validar token com a API
        const user = await this.validateToken();
        return user;
      } catch (error) {
        // Se token inválido, fazer logout
        this.logout();
        return null;
      }
    }
    
    return null;
  }
};