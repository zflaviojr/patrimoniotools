import api from './api';

class UserService {
  // Listar todos os usuários
  static async getUsers(params = {}) {
    const { page = 1, limit = 10, search = '' } = params;
    return await api.get('/users', { params: { page, limit, search } });
  }

  // Buscar usuário por ID
  static async getUserById(id) {
    return await api.get(`/users/${id}`);
  }

  // Criar novo usuário
  static async createUser(userData) {
    return await api.post('/users', userData);
  }

  // Atualizar usuário
  static async updateUser(id, userData) {
    return await api.put(`/users/${id}`, userData);
  }

  // Excluir usuário
  static async deleteUser(id) {
    return await api.delete(`/users/${id}`);
  }

  // Atualizar perfil do usuário
  static async updateProfile(id, profileData) {
    return await api.put(`/users/profile/${id}`, profileData);
  }
}

export default UserService;