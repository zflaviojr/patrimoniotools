import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Buscar usuário por username
  static async findByUsername(username) {
    try {
      const result = await query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      
      return result.rows[0] ? new User(result.rows[0]) : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por username:', error);
      throw error;
    }
  }

  // Buscar usuário por ID
  static async findById(id) {
    try {
      const result = await query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      
      return result.rows[0] ? new User(result.rows[0]) : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }

  // Criar novo usuário
  static async create(userData) {
    try {
      const { username, password, email } = userData;
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await query(
        `INSERT INTO users (username, password, email, created_at, updated_at) 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
         RETURNING *`,
        [username, hashedPassword, email]
      );
      
      const user = new User(result.rows[0]);
      // Não retornar a senha
      delete user.password;
      return user;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Verificar senha
  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      return false;
    }
  }

  // Atualizar senha
  async updatePassword(newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await query(
        'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [hashedPassword, this.id]
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  }

  // Converter para objeto sem senha
  toSafeObject() {
    const userObj = { ...this };
    delete userObj.password;
    return userObj;
  }

  // Listar todos os usuários (sem senhas)
  static async findAll() {
    try {
      const result = await query(
        'SELECT id, username, email, created_at, updated_at FROM users ORDER BY username'
      );
      
      return result.rows.map(row => new User(row));
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }
}

export default User;