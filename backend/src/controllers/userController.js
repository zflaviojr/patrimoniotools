import UserService from '../services/userService.js';

class UserController {
  // GET /api/users - Listar todos os usuários
  static async getAllUsers(req, res, next) {
    try {
      const { page, limit, search } = req.query;
      
      const result = await UserService.getAllUsers(page, limit, search);
      
      // Garantir que o resultado tenha o formato correto
      if (result && result.success) {
        // Verificar se data é um objeto com users e pagination
        if (result.data && Array.isArray(result.data.users)) {
          // Novo formato - objeto com users e pagination
          return res.status(200).json({
            success: true,
            data: {
              users: result.data.users,
              pagination: result.data.pagination || {
                page: 1,
                limit: result.data.users.length,
                total: result.data.users.length,
                totalPages: 1
              }
            }
          });
        } else if (Array.isArray(result.data)) {
          // Formato antigo - apenas array de usuários
          // Converter para o novo formato para manter consistência
          return res.status(200).json({
            success: true,
            data: {
              users: result.data,
              pagination: {
                page: 1,
                limit: result.data.length,
                total: result.data.length,
                totalPages: 1
              }
            }
          });
        }
      }
      
      // Formato padrão se não houver dados válidos
      return res.status(200).json({
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
      });
    } catch (error) {
      console.error('Erro no controller ao listar usuários:', error);
      if (error.success === false) {
        return res.status(400).json(error);
      }
      next(error);
    }
  }

  // GET /api/users/:id - Buscar usuário por ID
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      
      const result = await UserService.getUserById(id);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao buscar usuário:', error);
      if (error.success === false) {
        return res.status(error.message === 'Usuário não encontrado' ? 404 : 400).json(error);
      }
      next(error);
    }
  }

  // POST /api/users - Criar novo usuário
  static async createUser(req, res, next) {
    try {
      const userData = req.body;
      
      const result = await UserService.createUser(userData);
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Erro no controller ao criar usuário:', error);
      if (error.success === false) {
        return res.status(400).json(error);
      }
      next(error);
    }
  }

  // PUT /api/users/:id - Atualizar usuário
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      const result = await UserService.updateUser(id, userData);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao atualizar usuário:', error);
      if (error.success === false) {
        return res.status(error.message === 'Usuário não encontrado' ? 404 : 400).json(error);
      }
      next(error);
    }
  }

  // DELETE /api/users/:id - Excluir usuário
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      
      const result = await UserService.deleteUser(id);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao excluir usuário:', error);
      if (error.success === false) {
        return res.status(error.message === 'Usuário não encontrado' ? 404 : 400).json(error);
      }
      next(error);
    }
  }

  // PUT /api/users/profile/:id - Atualizar perfil do usuário
  static async updateProfile(req, res, next) {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      const result = await UserService.updateProfile(id, userData);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao atualizar perfil:', error);
      if (error.success === false) {
        return res.status(error.message === 'Usuário não encontrado' ? 404 : 400).json(error);
      }
      next(error);
    }
  }
}

export default UserController;