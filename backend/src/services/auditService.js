import AuditLog from '../models/AuditLog.js';

class AuditService {
  // Registrar evento de auditoria
  static async logEvent(userId, action, details = null, ipAddress = null) {
    try {
      return await AuditLog.logEvent(userId, action, details, ipAddress);
    } catch (error) {
      console.error('Erro ao registrar evento de auditoria:', error);
      throw error;
    }
  }

  // Obter logs de auditoria
  static async getLogs(filters = {}, page = 1, limit = 20) {
    try {
      return await AuditLog.getLogs(filters, page, limit);
    } catch (error) {
      console.error('Erro ao obter logs de auditoria:', error);
      throw error;
    }
  }

  // Limpar logs antigos
  static async cleanupOldLogs(daysToKeep = 180) {
    try {
      return await AuditLog.cleanupOldLogs(daysToKeep);
    } catch (error) {
      console.error('Erro ao limpar logs antigos:', error);
      throw error;
    }
  }
}

export default AuditService;