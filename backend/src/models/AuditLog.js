import { query } from '../config/database.js';

class AuditLog {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.action = data.action;
    this.details = data.details;
    this.ip_address = data.ip_address;
    this.created_at = data.created_at;
  }

  // Registrar um evento de auditoria
  static async logEvent(userId, action, details = null, ipAddress = null) {
    try {
      const result = await query(
        `INSERT INTO tools.audit_logs (user_id, action, details, ip_address, created_at) 
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
         RETURNING *`,
        [userId, action, details, ipAddress]
      );
      
      return new AuditLog(result.rows[0]);
    } catch (error) {
      console.error('Erro ao registrar evento de auditoria:', error);
      throw error;
    }
  }

  // Obter logs de auditoria com filtros
  static async getLogs(filters = {}, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      let queryText = 'SELECT * FROM tools.audit_logs ';
      let whereClause = [];
      let params = [];
      
      // Aplicar filtros
      if (filters.userId) {
        whereClause.push(`user_id = $${params.length + 1}`);
        params.push(filters.userId);
      }
      
      if (filters.action) {
        whereClause.push(`action = $${params.length + 1}`);
        params.push(filters.action);
      }
      
      if (filters.ipAddress) {
        whereClause.push(`ip_address = $${params.length + 1}`);
        params.push(filters.ipAddress);
      }
      
      if (filters.startDate) {
        whereClause.push(`created_at >= $${params.length + 1}`);
        params.push(filters.startDate);
      }
      
      if (filters.endDate) {
        whereClause.push(`created_at <= $${params.length + 1}`);
        params.push(filters.endDate);
      }
      
      if (whereClause.length > 0) {
        queryText += 'WHERE ' + whereClause.join(' AND ') + ' ';
      }
      
      queryText += `ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
      
      const result = await query(queryText, params);
      
      return result.rows.map(row => new AuditLog(row));
    } catch (error) {
      console.error('Erro ao obter logs de auditoria:', error);
      throw error;
    }
  }

  // Limpar logs antigos (mantém logs por 180 dias por padrão)
  static async cleanupOldLogs(daysToKeep = 180) {
    try {
      const result = await query(
        `DELETE FROM tools.audit_logs 
         WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '${daysToKeep} days'`
      );
      
      return result.rowCount;
    } catch (error) {
      console.error('Erro ao limpar logs antigos:', error);
      throw error;
    }
  }
}

export default AuditLog;