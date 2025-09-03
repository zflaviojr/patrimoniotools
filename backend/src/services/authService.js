import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { UnauthorizedError, ValidationError } from '../middleware/errorHandler.js';

class AuthService {
  // Fazer login
  static async login(username, password) {
    try {
      // Validar entrada
      if (!username || !password) {
        throw new ValidationError('Username e senha são obrigatórios');
      }

      // Buscar usuário
      const user = await User.findByUsername(username.trim());
      
      if (!user) {
        throw new UnauthorizedError('Credenciais inválidas');
      }

      // Verificar senha
      const isValidPassword = await user.verifyPassword(password);
      
      if (!isValidPassword) {
        throw new UnauthorizedError('Credenciais inválidas');
      }

      // Gerar token
      const token = generateToken({
        userId: user.id,
        username: user.username
      });

      // Retornar dados do usuário e token
      return {
        user: user.toSafeObject(),
        token,
        expiresIn: '24h'
      };
      
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // Registrar novo usuário
  static async register(userData) {
    try {
      const { username, password, email } = userData;
      
      // Validar dados
      if (!username || !password) {
        throw new ValidationError('Username e senha são obrigatórios');
      }
      
      if (password.length < 6) {
        throw new ValidationError('Senha deve ter pelo menos 6 caracteres');
      }
      
      if (username.length < 3) {
        throw new ValidationError('Username deve ter pelo menos 3 caracteres');
      }

      // Verificar se usuário já existe
      const existingUser = await User.findByUsername(username.trim());
      
      if (existingUser) {
        throw new ValidationError('Nome de usuário já existe');
      }

      // Criar usuário
      const user = await User.create({
        username: username.trim(),
        password,
        email: email?.trim() || null,
        telefone: userData.telefone || null
      });

      // Gerar token
      const token = generateToken({
        userId: user.id,
        username: user.username
      });

      return {
        user,
        token,
        expiresIn: '24h'
      };
      
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  // Validar token (usado para verificar se usuário ainda está autenticado)
  static async validateToken(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new UnauthorizedError('Usuário não encontrado');
      }
      
      return user.toSafeObject();
      
    } catch (error) {
      console.error('Erro na validação do token:', error);
      throw error;
    }
  }

  // Alterar senha
  static async changePassword(userId, oldPassword, newPassword) {
    try {
      // Validar entrada
      if (!oldPassword || !newPassword) {
        throw new ValidationError('Senhas são obrigatórias');
      }
      
      if (newPassword.length < 6) {
        throw new ValidationError('Nova senha deve ter pelo menos 6 caracteres');
      }

      // Buscar usuário
      const user = await User.findById(userId);
      
      if (!user) {
        throw new UnauthorizedError('Usuário não encontrado');
      }

      // Verificar senha atual
      const isValidPassword = await user.verifyPassword(oldPassword);
      
      if (!isValidPassword) {
        throw new UnauthorizedError('Senha atual incorreta');
      }

      // Atualizar senha
      await user.updatePassword(newPassword);
      
      return { message: 'Senha alterada com sucesso' };
      
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  }

  // Atualizar perfil do usuário
  static async updateProfile(userId, profileData) {
    try {
      // Buscar usuário
      const user = await User.findById(userId);
      
      if (!user) {
        throw new UnauthorizedError('Usuário não encontrado');
      }

      // Atualizar perfil
      const updatedUser = await user.updateProfile(profileData);
      
      return {
        message: 'Perfil atualizado com sucesso',
        data: { user: updatedUser }
      };
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }
}

export default AuthService;