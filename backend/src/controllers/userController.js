import UserService from '../services/userService.js';

class UserController {
  // GET /api/users - Listar todos os usuários
  static async getAllUsers(req, res, next) {
    try {
      const { page, limit, search } = req.query;
      
      const result = await UserService.getAllUsers(page, limit, search);
      
      res.status(200).json(result);
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