import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

class PasswordHistory {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.password_hash = data.password_hash;
    this.created_at = data.created_at;
  }

  // Adicionar senha ao histórico
  static async addPassword(userId, password) {
    try {
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await query(
        `INSERT INTO password_history (user_id, password_hash, created_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP) 
         RETURNING *`,
        [userId, hashedPassword]
      );
      
      return new PasswordHistory(result.rows[0]);
    } catch (error) {
      console.error('Erro ao adicionar senha ao histórico:', error);
      throw error;
    }
  }

  // Verificar se a senha foi usada recentemente
  static async isPasswordReused(userId, password, maxHistory = 5) {
    try {
      // Obter as últimas senhas do histórico
      const result = await query(
        `SELECT password_hash FROM password_history 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2`,
        [userId, maxHistory]
      );
      
      // Verificar se a senha corresponde a alguma do histórico
      for (const row of result.rows) {
        if (await bcrypt.compare(password, row.password_hash)) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar reutilização de senha:', error);
      throw error;
    }
  }

  // Limpar histórico antigo (mantém apenas as últimas N senhas)
  static async cleanupHistory(userId, maxHistory = 5) {
    try {
      await query(
        `DELETE FROM password_history 
         WHERE id IN (
           SELECT id FROM password_history 
           WHERE user_id = $1 
           ORDER BY created_at DESC 
           OFFSET $2
         )`,
        [userId, maxHistory]
      );
    } catch (error) {
      console.error('Erro ao limpar histórico de senhas:', error);
      throw error;
    }
  }
}

export default PasswordHistory;