import { query } from '../config/database.js';

class LoginAttempt {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.ip_address = data.ip_address;
    this.success = data.success;
    this.attempted_at = data.attempted_at;
    this.locked_until = data.locked_until;
  }

  // Registrar uma tentativa de login
  static async recordAttempt(username, ip, success) {
    try {
      const result = await query(
        `INSERT INTO login_attempts (username, ip_address, success, attempted_at) 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
         RETURNING *`,
        [username, ip, success]
      );
      
      return new LoginAttempt(result.rows[0]);
    } catch (error) {
      console.error('Erro ao registrar tentativa de login:', error);
      throw error;
    }
  }

  // Verificar se a conta está bloqueada
  static async isLocked(username, ip) {
    try {
      const result = await query(
        `SELECT locked_until FROM login_attempts 
         WHERE username = $1 AND ip_address = $2 AND locked_until IS NOT NULL 
         AND locked_until > CURRENT_TIMESTAMP
         ORDER BY attempted_at DESC 
         LIMIT 1`,
        [username, ip]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar bloqueio:', error);
      throw error;
    }
  }

  // Obter o número de tentativas restantes antes do bloqueio
  static async getRemainingAttempts(username, ip, maxAttempts = 5) {
    try {
      // Contar tentativas falhas consecutivas
      const result = await query(
        `WITH recent_attempts AS (
           SELECT success, attempted_at,
                  ROW_NUMBER() OVER (ORDER BY attempted_at DESC) as rn
           FROM login_attempts 
           WHERE username = $1 AND ip_address = $2
         ),
         consecutive_failures AS (
           SELECT COUNT(*) as failure_count
           FROM recent_attempts
           WHERE rn <= (SELECT COALESCE(MIN(rn), 999) 
                       FROM recent_attempts 
                       WHERE success = true)
         )
         SELECT GREATEST(0, $3 - COALESCE(failure_count, 0)) as remaining_attempts
         FROM consecutive_failures`,
        [username, ip, maxAttempts]
      );
      
      return result.rows[0] ? parseInt(result.rows[0].remaining_attempts) : maxAttempts;
    } catch (error) {
      console.error('Erro ao obter tentativas restantes:', error);
      throw error;
    }
  }

  // Bloquear conta temporariamente
  static async lockAccount(username, ip, lockDurationMinutes = 15) {
    try {
      const result = await query(
        `UPDATE login_attempts 
         SET locked_until = CURRENT_TIMESTAMP + INTERVAL '${lockDurationMinutes} minutes'
         WHERE username = $1 AND ip_address = $2
         RETURNING *`,
        [username, ip]
      );
      
      return result.rows.length > 0 ? new LoginAttempt(result.rows[0]) : null;
    } catch (error) {
      console.error('Erro ao bloquear conta:', error);
      throw error;
    }
  }

  // Obter tentativas recentes para auditoria
  static async getRecentAttempts(username, limit = 10) {
    try {
      const result = await query(
        `SELECT * FROM login_attempts 
         WHERE username = $1 
         ORDER BY attempted_at DESC 
         LIMIT $2`,
        [username, limit]
      );
      
      return result.rows.map(row => new LoginAttempt(row));
    } catch (error) {
      console.error('Erro ao obter tentativas recentes:', error);
      throw error;
    }
  }
}

export default LoginAttempt;