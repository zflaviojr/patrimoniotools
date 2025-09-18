import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { UnauthorizedError, ValidationError } from '../middleware/errorHandler.js';
import LoginAttemptService from './loginAttemptService.js';
import PasswordPolicyService from './passwordPolicyService.js';
import AuditService from './auditService.js';

class AuthService {
  // Fazer login
  static async login(username, password, ipAddress = null) {
    try {
      // Validar entrada
      if (!username || !password) {
        throw new ValidationError('Username e senha são obrigatórios');
      }

      // Verificar se a conta está bloqueada
      const isLocked = await LoginAttemptService.isLocked(username, ipAddress);
      
      if (isLocked) {
        // Registrar tentativa de login bloqueada
        await LoginAttemptService.recordAttempt(username, ipAddress, false);
        await AuditService.logEvent(null, 'LOGIN_BLOCKED', `Tentativa de login bloqueada para usuário: ${username}`, ipAddress);
        
        throw new UnauthorizedError('Conta temporariamente bloqueada. Tente novamente mais tarde.');
      }

      // Buscar usuário
      const user = await User.findByUsername(username.trim());
      
      if (!user) {
        // Registrar tentativa falha
        await LoginAttemptService.recordAttempt(username, ipAddress, false);
        await AuditService.logEvent(null, 'LOGIN_FAILED', `Tentativa de login falhou para usuário inexistente: ${username}`, ipAddress);
        
        // Obter tentativas restantes para retornar na resposta
        const remainingAttempts = await LoginAttemptService.getRemainingAttempts(username, ipAddress);
        
        const error = new UnauthorizedError('Credenciais inválidas');
        error.remainingAttempts = remainingAttempts;
        throw error;
      }

      // Verificar senha
      const isValidPassword = await user.verifyPassword(password);
      console.log(`Senha válida: ${isValidPassword}`);
      
      // Registrar tentativa
      await LoginAttemptService.recordAttempt(username, ipAddress, isValidPassword);
      
      if (!isValidPassword) {
        // Verificar tentativas restantes
        const remainingAttempts = await LoginAttemptService.getRemainingAttempts(username, ipAddress);
        
        // Se for a última tentativa, bloquear a conta
        if (remainingAttempts <= 0) {
          await LoginAttemptService.lockAccount(username, ipAddress);
          await AuditService.logEvent(user.id, 'ACCOUNT_LOCKED', `Conta bloqueada após múltiplas tentativas falhas: ${username}`, ipAddress);
          
          // Informar ao usuário que a conta foi bloqueada
          throw new UnauthorizedError('Conta temporariamente bloqueada devido a múltiplas tentativas falhas. Tente novamente mais tarde.');
        }
        
        await AuditService.logEvent(user.id, 'LOGIN_FAILED', `Tentativa de login falhou para usuário: ${username}`, ipAddress);
        
        // Adicionar informações sobre tentativas restantes ao erro
        const error = new UnauthorizedError('Credenciais inválidas');
        error.remainingAttempts = remainingAttempts;
        throw error;
      }

      // Verificar se a senha expirou
      if (PasswordPolicyService.isPasswordExpired(user)) {
        await AuditService.logEvent(user.id, 'LOGIN_PASSWORD_EXPIRED', `Login com senha expirada para usuário: ${username}`, ipAddress);
        throw new UnauthorizedError('Senha expirada. Por favor, altere sua senha.');
      }

      // Gerar token
      const token = generateToken({
        userId: user.id,
        username: user.username
      });

      // Registrar login bem-sucedido
      await AuditService.logEvent(user.id, 'LOGIN_SUCCESS', `Login bem-sucedido para usuário: ${username}`, ipAddress);

      // Retornar dados do usuário e token
      return {
        user: user.toSafeObject(),
        token,
        expiresIn: '24h'
      };
      
    } catch (error) {
      console.error('Erro no serviço de login:', error);
      throw error;
    }
  }

  // Registrar novo usuário
  static async register(userData, ipAddress = null) {
    try {
      const { username, password, email } = userData;
      
      // Validar dados
      if (!username || !password) {
        throw new ValidationError('Username e senha são obrigatórios');
      }
      
      // Validar política de senha
      const validation = PasswordPolicyService.validatePassword(password);
      if (!validation.isValid) {
        throw new ValidationError('Senha não atende aos requisitos de segurança', validation.errors);
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

      // Adicionar senha ao histórico
      await PasswordPolicyService.addToPasswordHistory(user.id, password);

      // Registrar evento de auditoria
      await AuditService.logEvent(user.id, 'USER_REGISTERED', `Novo usuário registrado: ${username}`, ipAddress);

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
      
      // Verificar se a senha expirou
      if (PasswordPolicyService.isPasswordExpired(user)) {
        throw new UnauthorizedError('Senha expirada. Por favor, altere sua senha.');
      }
      
      return user.toSafeObject();
      
    } catch (error) {
      console.error('Erro na validação do token:', error);
      throw error;
    }
  }

  // Alterar senha
  static async changePassword(userId, oldPassword, newPassword, ipAddress = null) {
    try {
      // Validar entrada
      if (!oldPassword || !newPassword) {
        throw new ValidationError('Senhas são obrigatórias');
      }
      
      // Validar política de nova senha
      const validation = PasswordPolicyService.validatePassword(newPassword);
      if (!validation.isValid) {
        throw new ValidationError('Nova senha não atende aos requisitos de segurança', validation.errors);
      }

      // Verificar se a senha foi reutilizada
      const isReused = await PasswordPolicyService.isPasswordReused(userId, newPassword);
      if (isReused) {
        throw new ValidationError('Não é permitido reutilizar as últimas 5 senhas');
      }

      // Buscar usuário
      const user = await User.findById(userId);
      
      if (!user) {
        throw new UnauthorizedError('Usuário não encontrado');
      }

      // Verificar senha atual
      const isValidPassword = await user.verifyPassword(oldPassword);
      
      if (!isValidPassword) {
        await AuditService.logEvent(userId, 'PASSWORD_CHANGE_FAILED', 'Tentativa de alteração de senha com senha atual incorreta', ipAddress);
        throw new UnauthorizedError('Senha atual incorreta');
      }

      // Atualizar senha
      await user.updatePassword(newPassword);
      
      // Adicionar nova senha ao histórico
      await PasswordPolicyService.addToPasswordHistory(userId, newPassword);
      
      // Registrar evento de auditoria
      await AuditService.logEvent(userId, 'PASSWORD_CHANGED', 'Senha alterada com sucesso', ipAddress);
      
      return { message: 'Senha alterada com sucesso' };
      
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  }

  // Atualizar perfil do usuário
  static async updateProfile(userId, profileData, ipAddress = null) {
    try {
      // Buscar usuário
      const user = await User.findById(userId);
      
      if (!user) {
        throw new UnauthorizedError('Usuário não encontrado');
      }

      // Atualizar perfil
      const updatedUser = await user.updateProfile(profileData);
      
      // Registrar evento de auditoria
      await AuditService.logEvent(userId, 'PROFILE_UPDATED', 'Perfil atualizado com sucesso', ipAddress);
      
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