import PasswordHistory from '../models/PasswordHistory.js';

class PasswordPolicyService {
  // Validar política de senha
  static validatePassword(password) {
    const errors = [];
    
    // Comprimento mínimo de 8 caracteres
    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres');
    }
    
    // Deve conter pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }
    
    // Deve conter pelo menos uma letra minúscula
    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula');
    }
    
    // Deve conter pelo menos um número
    if (!/[0-9]/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    }
    
    // Deve conter pelo menos um caractere especial
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial (!@#$%^&*)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Verificar se a senha expirou (90 dias por padrão)
  static isPasswordExpired(user) {
    if (!user.password_last_changed) {
      return true; // Se não tem data, considerar expirada
    }
    
    const lastChanged = new Date(user.password_last_changed);
    const now = new Date();
    const diffTime = Math.abs(now - lastChanged);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 90;
  }

  // Adicionar senha ao histórico
  static async addToPasswordHistory(userId, password) {
    try {
      // Adicionar senha ao histórico
      await PasswordHistory.addPassword(userId, password);
      
      // Limpar histórico antigo (manter apenas as últimas 5 senhas)
      await PasswordHistory.cleanupHistory(userId, 5);
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar senha ao histórico:', error);
      throw error;
    }
  }

  // Verificar se a senha foi reutilizada
  static async isPasswordReused(userId, password) {
    try {
      return await PasswordHistory.isPasswordReused(userId, password, 5);
    } catch (error) {
      console.error('Erro ao verificar reutilização de senha:', error);
      throw error;
    }
  }
}

export default PasswordPolicyService;