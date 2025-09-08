import { api } from './api.js';

export const responsavelService = {
  // Listar todos os responsáveis
  async getAll(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Adicionar parâmetros de consulta
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy); // Adicionar parâmetro de ordenação
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder); // Adicionar ordem de ordenação
      
      const queryString = queryParams.toString();
      const url = `/responsaveis${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Buscar responsável por ID
  async getById(id) {
    try {
      const response = await api.get(`/responsaveis/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar responsável por matrícula
  async getByMatricula(matricula) {
    try {
      const response = await api.get(`/responsaveis/matricula/${matricula}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Criar novo responsável
  async create(responsavelData) {
    try {
      const response = await api.post('/responsaveis', responsavelData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar responsável
  async update(id, responsavelData) {
    try {
      const response = await api.put(`/responsaveis/${id}`, responsavelData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Excluir responsável
  async delete(id) {
    try {
      const response = await api.delete(`/responsaveis/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Buscar responsáveis por nome
  async searchByNome(nome) {
    try {
      const response = await api.get(`/responsaveis/search/${nome}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obter estatísticas
  async getStats() {
    try {
      const response = await api.get('/responsaveis/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validar se matrícula é única
  async validateMatricula(matricula, excludeId = null) {
    try {
      // Tentar buscar por matrícula
      const response = await this.getByMatricula(matricula);
      
      // Se encontrou e não é o mesmo ID (para edição), matrícula não é única
      if (response && (!excludeId || response.id !== parseInt(excludeId))) {
        return false;
      }
      
      return true;
    } catch (error) {
      // Se retornou 404, matrícula é única
      if (error.response?.status === 404) {
        return true;
      }
      throw error;
    }
  }
};