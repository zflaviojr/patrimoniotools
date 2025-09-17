import LoginAttempt from '../models/LoginAttempt.js';

class LoginAttemptService {
  // Registrar tentativa de login
  static async recordAttempt(username, ip, success) {
    try {
      return await LoginAttempt.recordAttempt(username, ip, success);
    } catch (error) {
      console.error('Erro ao registrar tentativa de login:', error);
      throw error;
    }
  }

  // Verificar se a conta está bloqueada
  static async isLocked(username, ip) {
    try {
      return await LoginAttempt.isLocked(username, ip);
    } catch (error) {
      console.error('Erro ao verificar bloqueio:', error);
      throw error;
    }
  }

  // Obter tentativas restantes
  static async getRemainingAttempts(username, ip, maxAttempts = 5) {
    try {
      return await LoginAttempt.getRemainingAttempts(username, ip, maxAttempts);
    } catch (error) {
      console.error('Erro ao obter tentativas restantes:', error);
      throw error;
    }
  }

  // Bloquear conta
  static async lockAccount(username, ip, lockDurationMinutes = 15) {
    try {
      return await LoginAttempt.lockAccount(username, ip, lockDurationMinutes);
    } catch (error) {
      console.error('Erro ao bloquear conta:', error);
      throw error;
    }
  }

  // Obter tentativas recentes para auditoria
  static async getRecentAttempts(username, limit = 10) {
    try {
      return await LoginAttempt.getRecentAttempts(username, limit);
    } catch (error) {
      console.error('Erro ao obter tentativas recentes:', error);
      throw error;
    }
  }
}

export default LoginAttemptService;