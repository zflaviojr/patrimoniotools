import LoginAttemptService from '../services/loginAttemptService.js';
import PasswordPolicyService from '../services/passwordPolicyService.js';
import AuditService from '../services/auditService.js';

// Middleware para verificar tentativas de login
export const loginAttemptMiddleware = async (req, res, next) => {
  try {
    const { username } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    
    if (!username) {
      return next();
    }
    
    // Verificar se a conta está bloqueada
    const isLocked = await LoginAttemptService.isLocked(username, ip);
    
    if (isLocked) {
      // Registrar evento de auditoria
      await AuditService.logEvent(null, 'LOGIN_BLOCKED', `Tentativa de login bloqueada para usuário: ${username}`, ip);
      
      return res.status(423).json({
        success: false,
        message: 'Conta temporariamente bloqueada. Tente novamente mais tarde.'
      });
    }
    
    // Adicionar informações ao request para uso posterior
    req.loginContext = {
      username,
      ip
    };
    
    next();
  } catch (error) {
    console.error('Erro no middleware de tentativas de login:', error);
    next();
  }
};

// Middleware para validar política de senhas
export const passwordPolicyMiddleware = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return next();
    }
    
    // Validar política de senha
    const validation = PasswordPolicyService.validatePassword(password);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Senha não atende aos requisitos de segurança',
        errors: validation.errors
      });
    }
    
    next();
  } catch (error) {
    console.error('Erro no middleware de política de senhas:', error);
    next();
  }
};

// Middleware para verificar reutilização de senhas
export const passwordReuseMiddleware = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user?.id;
    
    if (!newPassword || !userId) {
      return next();
    }
    
    // Verificar se a senha foi reutilizada
    const isReused = await PasswordPolicyService.isPasswordReused(userId, newPassword);
    
    if (isReused) {
      return res.status(400).json({
        success: false,
        message: 'Não é permitido reutilizar as últimas 5 senhas'
      });
    }
    
    next();
  } catch (error) {
    console.error('Erro no middleware de reutilização de senhas:', error);
    next();
  }
};