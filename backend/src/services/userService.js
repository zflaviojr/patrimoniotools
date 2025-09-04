import User from '../models/User.js';
import { 
  isValidUsername, 
  isValidEmail, 
  isValidTelefone, 
  isValidPassword,
  sanitizeString,
  sanitizeTelefone,
  formatTelefone
} from '../utils/validation.js';

class UserService {
  // Listar todos os usuários com paginação
  static async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      // Validar parâmetros
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
      const searchTerm = sanitizeString(search || '');

      const result = await User.findAllWithPagination(pageNum, limitNum, searchTerm);
      
      // Garantir que o resultado tenha o formato correto
      return {
        success: true,
        data: {
          users: Array.isArray(result.users) ? result.users.map(user => user.toSafeObject()) : [],
          pagination: result.pagination || {
            page: pageNum,
            limit: limitNum,
            total: Array.isArray(result.users) ? result.users.length : 0,
            totalPages: 1
          }
        }
      };
    } catch (error) {
      console.error('Erro no service ao listar usuários:', error);
      throw {
        success: false,
        message: 'Erro interno ao listar usuários',
        error: error.message
      };
    }
  }

  // Buscar usuário por ID
  static async getUserById(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw {
          success: false,
          message: 'ID do usuário inválido'
        };
      }

      const user = await User.findById(parseInt(id));
      
      if (!user) {
        throw {
          success: false,
          message: 'Usuário não encontrado'
        };
      }

      return {
        success: true,
        data: user.toSafeObject()
      };
    } catch (error) {
      console.error('Erro no service ao buscar usuário:', error);
      if (error.success === false) {
        throw error;
      }
      throw {
        success: false,
        message: 'Erro interno ao buscar usuário',
        error: error.message
      };
    }
  }

  // Criar novo usuário
  static async createUser(userData) {
    try {
      const { username, password, email, telefone } = userData;

      // Validações
      if (!isValidUsername(username)) {
        throw {
          success: false,
          message: 'Username deve ter entre 3 e 50 caracteres, apenas letras, números, underscore, ponto e hífen'
        };
      }

      if (!isValidPassword(password)) {
        throw {
          success: false,
          message: 'Senha deve ter pelo menos 6 caracteres'
        };
      }

      if (!isValidEmail(email)) {
        throw {
          success: false,
          message: 'Email inválido'
        };
      }

      if (!isValidTelefone(telefone)) {
        throw {
          success: false,
          message: 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'
        };
      }

      // Verificar se username já existe
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        throw {
          success: false,
          message: 'Username já está em uso'
        };
      }

      // Sanitizar e formatar dados
      const cleanData = {
        username: sanitizeString(username),
        password: password,
        email: email ? sanitizeString(email) : null,
        telefone: telefone ? formatTelefone(sanitizeTelefone(telefone)) : null
      };

      const user = await User.create(cleanData);

      return {
        success: true,
        message: 'Usuário criado com sucesso',
        data: { user: user.toSafeObject() }
      };
    } catch (error) {
      console.error('Erro no service ao criar usuário:', error);
      if (error.success === false) {
        throw error;
      }
      throw {
        success: false,
        message: 'Erro interno ao criar usuário',
        error: error.message
      };
    }
  }

  // Atualizar usuário
  static async updateUser(id, userData) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw {
          success: false,
          message: 'ID do usuário inválido'
        };
      }

      const { username, email, telefone, password } = userData;

      // Validações dos campos que foram fornecidos
      if (username !== undefined && !isValidUsername(username)) {
        throw {
          success: false,
          message: 'Username deve ter entre 3 e 50 caracteres, apenas letras, números, underscore, ponto e hífen'
        };
      }

      if (password !== undefined && !isValidPassword(password)) {
        throw {
          success: false,
          message: 'Senha deve ter pelo menos 6 caracteres'
        };
      }

      if (email !== undefined && !isValidEmail(email)) {
        throw {
          success: false,
          message: 'Email inválido'
        };
      }

      if (telefone !== undefined && !isValidTelefone(telefone)) {
        throw {
          success: false,
          message: 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'
        };
      }

      // Verificar se username já existe (se está sendo alterado)
      if (username !== undefined) {
        const existingUser = await User.findByUsername(username);
        if (existingUser && existingUser.id !== parseInt(id)) {
          throw {
            success: false,
            message: 'Username já está em uso por outro usuário'
          };
        }
      }

      // Sanitizar e formatar dados
      const cleanData = {};
      if (username !== undefined) cleanData.username = sanitizeString(username);
      if (email !== undefined) cleanData.email = email ? sanitizeString(email) : null;
      if (telefone !== undefined) cleanData.telefone = telefone ? formatTelefone(sanitizeTelefone(telefone)) : null;
      if (password !== undefined) cleanData.password = password;

      const user = await User.updateById(parseInt(id), cleanData);

      if (!user) {
        throw {
          success: false,
          message: 'Usuário não encontrado'
        };
      }

      return {
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: { user: user.toSafeObject() }
      };
    } catch (error) {
      console.error('Erro no service ao atualizar usuário:', error);
      if (error.success === false) {
        throw error;
      }
      throw {
        success: false,
        message: 'Erro interno ao atualizar usuário',
        error: error.message
      };
    }
  }

  // Excluir usuário
  static async deleteUser(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw {
          success: false,
          message: 'ID do usuário inválido'
        };
      }

      // Verificar se o usuário existe
      const user = await User.findById(parseInt(id));
      if (!user) {
        throw {
          success: false,
          message: 'Usuário não encontrado'
        };
      }

      // Não permitir excluir o admin principal
      if (user.username === 'admin') {
        throw {
          success: false,
          message: 'Não é possível excluir o usuário administrador principal'
        };
      }

      const deleted = await User.deleteById(parseInt(id));

      if (!deleted) {
        throw {
          success: false,
          message: 'Erro ao excluir usuário'
        };
      }

      return {
        success: true,
        message: 'Usuário excluído com sucesso'
      };
    } catch (error) {
      console.error('Erro no service ao excluir usuário:', error);
      if (error.success === false) {
        throw error;
      }
      throw {
        success: false,
        message: 'Erro interno ao excluir usuário',
        error: error.message
      };
    }
  }

  // Atualizar perfil do usuário atual
  static async updateProfile(userId, userData) {
    try {
      if (!userId || isNaN(parseInt(userId))) {
        throw {
          success: false,
          message: 'ID do usuário inválido'
        };
      }

      const { email, telefone } = userData;

      // Validações
      if (email !== undefined && !isValidEmail(email)) {
        throw {
          success: false,
          message: 'Email inválido'
        };
      }

      if (telefone !== undefined && !isValidTelefone(telefone)) {
        throw {
          success: false,
          message: 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'
        };
      }

      // Buscar usuário
      const user = await User.findById(parseInt(userId));
      if (!user) {
        throw {
          success: false,
          message: 'Usuário não encontrado'
        };
      }

      // Sanitizar e formatar dados
      const cleanData = {};
      if (email !== undefined) cleanData.email = email ? sanitizeString(email) : null;
      if (telefone !== undefined) cleanData.telefone = telefone ? formatTelefone(sanitizeTelefone(telefone)) : null;

      const updatedUser = await user.updateProfile(cleanData);

      return {
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: { user: updatedUser }
      };
    } catch (error) {
      console.error('Erro no service ao atualizar perfil:', error);
      if (error.success === false) {
        throw error;
      }
      throw {
        success: false,
        message: 'Erro interno ao atualizar perfil',
        error: error.message
      };
    }
  }
}

export default UserService;