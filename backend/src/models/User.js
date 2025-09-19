import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.telefone = data.telefone;
    this.password = data.password;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    // Campos adicionados para política de senhas
    this.password_last_changed = data.password_last_changed;
    this.password_expires_at = data.password_expires_at;
  }

  // Buscar usuário por username
  static async findByUsername(username) {
    try {
      const result = await query(
        'SELECT * FROM tools.users WHERE username = $1',
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
        'SELECT * FROM tools.users WHERE id = $1',
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
      const { username, password, email, telefone } = userData;
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Calcular data de expiração (90 dias)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 90);
      
      const result = await query(
        `INSERT INTO tools.users (username, password, email, telefone, created_at, updated_at, password_last_changed, password_expires_at) 
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $5) 
         RETURNING *`,
        [username, hashedPassword, email, telefone, expiresAt]
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
      console.log('Verificando senha...');
      console.log('Senha fornecida:', password);
      console.log('Hash armazenado:', this.password);
      
      // Verificar se os parâmetros são válidos
      if (!password || !this.password) {
        console.log('Senha ou hash inválidos');
        return false;
      }
      
      const result = await bcrypt.compare(password, this.password);
      console.log('Resultado da comparação:', result);
      return result;
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      return false;
    }
  }

  // Atualizar senha
  async updatePassword(newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Calcular data de expiração (90 dias)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 90);
      
      await query(
        'UPDATE tools.users SET password = $1, updated_at = CURRENT_TIMESTAMP, password_last_changed = CURRENT_TIMESTAMP, password_expires_at = $2 WHERE id = $3',
        [hashedPassword, expiresAt, this.id]
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
        'SELECT id, username, email, telefone, created_at, updated_at, password_last_changed, password_expires_at FROM tools.users ORDER BY username'
      );
      
      return result.rows.map(row => new User(row));
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  // Listar usuários com paginação e busca
  static async findAllWithPagination(page = 1, limit = 10, search = '') {
    try {
      const offset = (page - 1) * limit;
      let query_text = `
        SELECT id, username, email, telefone, created_at, updated_at, password_last_changed, password_expires_at
        FROM tools.users 
      `;
      let countQuery = 'SELECT COUNT(*) FROM tools.users ';
      let params = [];
      let countParams = [];
      
      if (search) {
        query_text += 'WHERE username ILIKE $1 OR email ILIKE $1 ';
        countQuery += 'WHERE username ILIKE $1 OR email ILIKE $1';
        params.push(`%${search}%`);
        countParams.push(`%${search}%`);
      }
      
      query_text += 'ORDER BY username LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);
      
      const [result, countResult] = await Promise.all([
        query(query_text, params),
        query(countQuery, countParams)
      ]);
      
      const total = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(total / limit);
      
      return {
        users: result.rows.map(row => new User(row)),
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      console.error('Erro ao listar usuários com paginação:', error);
      throw error;
    }
  }

  // Atualizar usuário por ID
  static async updateById(id, userData) {
    try {
      const { username, email, telefone, password } = userData;
      let queryText = 'UPDATE tools.users SET ';
      let params = [];
      let updates = [];
      
      if (username !== undefined) {
        updates.push(`username = $${params.length + 1}`);
        params.push(username);
      }
      
      if (email !== undefined) {
        updates.push(`email = $${params.length + 1}`);
        params.push(email);
      }
      
      if (telefone !== undefined) {
        updates.push(`telefone = $${params.length + 1}`);
        params.push(telefone);
      }
      
      if (password !== undefined) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.push(`password = $${params.length + 1}`);
        params.push(hashedPassword);
        
        // Atualizar também as datas de senha
        updates.push(`password_last_changed = CURRENT_TIMESTAMP`);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 90);
        updates.push(`password_expires_at = $${params.length + 1}`);
        params.push(expiresAt);
      }
      
      if (updates.length === 0) {
        throw new Error('Nenhum campo para atualizar');
      }
      
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      queryText += updates.join(', ');
      queryText += ` WHERE id = $${params.length + 1} RETURNING id, username, email, telefone, created_at, updated_at, password_last_changed, password_expires_at`;
      params.push(id);
      
      const result = await query(queryText, params);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new User(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Excluir usuário por ID
  static async deleteById(id) {
    try {
      const result = await query(
        'DELETE FROM tools.users WHERE id = $1 RETURNING id',
        [id]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw error;
    }
  }

  // Atualizar perfil do usuário atual
  async updateProfile(userData) {
    try {
      const { email, telefone } = userData;
      let queryText = 'UPDATE tools.users SET ';
      let params = [];
      let updates = [];
      
      if (email !== undefined) {
        updates.push(`email = $${params.length + 1}`);
        params.push(email);
      }
      
      if (telefone !== undefined) {
        updates.push(`telefone = $${params.length + 1}`);
        params.push(telefone);
      }
      
      if (updates.length === 0) {
        throw new Error('Nenhum campo para atualizar');
      }
      
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      queryText += updates.join(', ');
      queryText += ` WHERE id = $${params.length + 1} RETURNING id, username, email, telefone, created_at, updated_at, password_last_changed, password_expires_at`;
      params.push(this.id);
      
      const result = await query(queryText, params);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      // Atualizar os dados do objeto atual
      const updatedUser = result.rows[0];
      this.email = updatedUser.email;
      this.telefone = updatedUser.telefone;
      this.updated_at = updatedUser.updated_at;
      this.password_last_changed = updatedUser.password_last_changed;
      this.password_expires_at = updatedUser.password_expires_at;
      
      return this.toSafeObject();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }
}

export default User;