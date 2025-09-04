import api from './api';

class UserService {
  // Listar todos os usuários
  static async getUsers(params = {}) {
    console.error('UserService: getUsers chamado com params:', params);
    const { page = 1, limit = 10, search = '' } = params;
    
    // Certificar-se de que os parâmetros estão corretos
    const config = {
      params: {
        page: parseInt(page),
        limit: parseInt(limit),
        search: search.toString()
      }
    };
    
    console.error('UserService: Config para API:', config);
    const response = await api.get('/users', config);
    console.error('UserService: Resposta da API:', JSON.stringify(response, null, 2));
    
    // Garantir que a resposta tenha o formato esperado
    if (response && response.success) {
      console.error('UserService: Resposta válida da API');
      // Verificar se é o novo formato (com users e pagination)
      if (response.data && Array.isArray(response.data.users)) {
        console.error('UserService: Formato novo detectado');
        return response;
      }
      // Se for o formato antigo (apenas array), converter para o novo formato
      else if (Array.isArray(response.data)) {
        console.error('UserService: Formato antigo detectado, convertendo');
        return {
          success: true,
          data: {
            users: response.data,
            pagination: {
              page: 1,
              limit: response.data.length,
              total: response.data.length,
              totalPages: 1
            }
          }
        };
      }
      // Se response.data for um objeto com users e pagination
      else if (response.data && typeof response.data === 'object' && response.data.users) {
        console.error('UserService: Formato objeto com users detectado');
        return {
          success: true,
          data: {
            users: Array.isArray(response.data.users) ? response.data.users : [],
            pagination: response.data.pagination || {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0
            }
          }
        };
      }
    }
    
    // Verificar se a resposta tem o formato aninhado (data.data)
    if (response && response.data && response.data.success) {
      console.error('UserService: Formato aninhado detectado');
      const innerData = response.data.data;
      if (innerData && Array.isArray(innerData.users)) {
        console.error('UserService: Formato aninhado válido detectado');
        return {
          success: true,
          data: {
            users: innerData.users,
            pagination: innerData.pagination || {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0
            }
          }
        };
      }
    }
    
    // Retorno padrão em caso de erro ou formato inesperado
    console.error('UserService: Retornando dados padrão');
    return {
      success: true,
      data: {
        users: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      }
    };
  }

  // Buscar usuário por ID
  static async getUserById(id) {
    console.error('UserService: getUserById chamado com id:', id);
    return await api.get(`/users/${id}`);
  }

  // Criar novo usuário
  static async createUser(userData) {
    console.error('UserService: createUser chamado com userData:', userData);
    return await api.post('/users', userData);
  }

  // Atualizar usuário
  static async updateUser(id, userData) {
    console.error('UserService: updateUser chamado com:', { id, userData });
    return await api.put(`/users/${id}`, userData);
  }

  // Excluir usuário
  static async deleteUser(id) {
    console.error('UserService: deleteUser chamado com id:', id);
    return await api.delete(`/users/${id}`);
  }

  // Atualizar perfil do usuário
  static async updateProfile(id, profileData) {
    console.error('UserService: updateProfile chamado com:', { id, profileData });
    return await api.put(`/users/profile/${id}`, profileData);
  }
}

export default UserService;