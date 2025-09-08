import { api } from './api.js';

export const descricaoService = {
  // Listar todas as descrições
  async getAll(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Adicionar parâmetros de consulta
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      
      const queryString = queryParams.toString();
      const url = `/descricoes${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Buscar descrição por ID
  async getById(id) {
    try {
      const response = await api.get(`/descricoes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar descrição por código
  async getByCodigo(codigo) {
    try {
      const response = await api.get(`/descricoes/codigo/${codigo}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Criar nova descrição
  async create(descricaoData) {
    try {
      const response = await api.post('/descricoes', descricaoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar descrição
  async update(id, descricaoData) {
    try {
      const response = await api.put(`/descricoes/${id}`, descricaoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Excluir descrição
  async delete(id) {
    try {
      const response = await api.delete(`/descricoes/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Buscar descrições por termo
  async searchByTermo(termo) {
    try {
      const response = await api.get(`/descricoes/search/${termo}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obter estatísticas
  async getStats() {
    try {
      const response = await api.get('/descricoes/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};