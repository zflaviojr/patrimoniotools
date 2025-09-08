import { query } from '../config/database.js';
import { sanitizeString, sanitizeMatricula } from '../utils/validation.js';

class Responsavel {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.matricula = data.matricula;
    this.permissao = data.permissao;
  }

  // Buscar todos os responsáveis
  static async findAll() {
    try {
      const result = await query('SELECT * FROM tblresponsavel ORDER BY nome');
      return result.rows.map(row => new Responsavel(row));
    } catch (error) {
      console.error('Erro ao buscar responsáveis:', error);
      throw error;
    }
  }

  // Buscar responsável por ID
  static async findById(id) {
    try {
      const result = await query('SELECT * FROM tblresponsavel WHERE id = $1', [id]);
      return result.rows[0] ? new Responsavel(result.rows[0]) : null;
    } catch (error) {
      console.error('Erro ao buscar responsável por ID:', error);
      throw error;
    }
  }

  // Buscar responsável por matrícula
  static async findByMatricula(matricula) {
    try {
      const sanitizedMatricula = sanitizeMatricula(matricula);
      const result = await query('SELECT * FROM tblresponsavel WHERE matricula = $1', [sanitizedMatricula]);
      return result.rows[0] ? new Responsavel(result.rows[0]) : null;
    } catch (error) {
      console.error('Erro ao buscar responsável por matrícula:', error);
      throw error;
    }
  }

  // Buscar responsáveis com filtro por nome
  static async findByNome(nome) {
    try {
      const searchTerm = `%${nome.toLowerCase()}%`;
      const result = await query(
        'SELECT * FROM tblresponsavel WHERE LOWER(nome) LIKE $1 ORDER BY nome',
        [searchTerm]
      );
      return result.rows.map(row => new Responsavel(row));
    } catch (error) {
      console.error('Erro ao buscar responsáveis por nome:', error);
      throw error;
    }
  }

  // Criar novo responsável
  static async create(data) {
    try {
      const { nome, matricula, permissao } = data;
      
      const sanitizedNome = sanitizeString(nome);
      const sanitizedMatricula = sanitizeMatricula(matricula);
      
      const result = await query(
        `INSERT INTO tblresponsavel (nome, matricula, permissao) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [sanitizedNome, sanitizedMatricula, permissao || null]
      );
      
      return new Responsavel(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar responsável:', error);
      throw error;
    }
  }

  // Atualizar responsável
  async update(data) {
    try {
      const { nome, matricula, permissao } = data;
      
      const sanitizedNome = sanitizeString(nome);
      const sanitizedMatricula = sanitizeMatricula(matricula);
      
      const result = await query(
        `UPDATE tblresponsavel 
         SET nome = $1, matricula = $2, permissao = $3 
         WHERE id = $4 
         RETURNING *`,
        [sanitizedNome, sanitizedMatricula, permissao || null, this.id]
      );
      
      if (result.rows[0]) {
        Object.assign(this, result.rows[0]);
      }
      
      return this;
    } catch (error) {
      console.error('Erro ao atualizar responsável:', error);
      throw error;
    }
  }

  // Excluir responsável
  async delete() {
    try {
      await query('DELETE FROM tblresponsavel WHERE id = $1', [this.id]);
      return true;
    } catch (error) {
      console.error('Erro ao excluir responsável:', error);
      throw error;
    }
  }

  // Verificar se matrícula já existe (excluindo o próprio registro)
  static async isMatriculaUnique(matricula, excludeId = null) {
    try {
      const sanitizedMatricula = sanitizeMatricula(matricula);
      
      let queryText = 'SELECT id FROM tblresponsavel WHERE matricula = $1';
      let params = [sanitizedMatricula];
      
      if (excludeId) {
        queryText += ' AND id != $2';
        params.push(excludeId);
      }
      
      const result = await query(queryText, params);
      return result.rows.length === 0;
    } catch (error) {
      console.error('Erro ao verificar unicidade da matrícula:', error);
      throw error;
    }
  }

  // Contar total de responsáveis
  static async count() {
    try {
      const result = await query('SELECT COUNT(*) as total FROM tblresponsavel');
      return parseInt(result.rows[0].total);
    } catch (error) {
      console.error('Erro ao contar responsáveis:', error);
      throw error;
    }
  }

  // Buscar responsáveis com paginação
  static async findWithPagination(page = 1, limit = 10, search = '', sortBy = 'nome', sortOrder = 'ASC') {
    try {
      const offset = (page - 1) * limit;
      
      // Validar parâmetros de ordenação
      const validSortFields = ['id', 'nome', 'matricula', 'permissao'];
      const validSortOrders = ['ASC', 'DESC'];
      
      if (!validSortFields.includes(sortBy)) {
        sortBy = 'nome'; // Valor padrão
      }
      
      if (!validSortOrders.includes(sortOrder.toUpperCase())) {
        sortOrder = 'ASC'; // Valor padrão
      }
      
      let queryText = 'SELECT * FROM tblresponsavel';
      let countText = 'SELECT COUNT(*) as total FROM tblresponsavel';
      let queryParams = [];
      let countParams = [];
      
      if (search) {
        const searchTerm = `%${search.toLowerCase()}%`;
        queryText += ' WHERE LOWER(nome) LIKE $1 OR LOWER(matricula) LIKE $1';
        countText += ' WHERE LOWER(nome) LIKE $1 OR LOWER(matricula) LIKE $1';
        queryParams.push(searchTerm);
        countParams.push(searchTerm);
      }
      
      // Adicionar ordenação
      queryText += ` ORDER BY ${sortBy} ${sortOrder} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(limit, offset);
      
      const [responsaveisResult, countResult] = await Promise.all([
        query(queryText, queryParams),
        query(countText, countParams)
      ]);
      
      const responsaveis = responsaveisResult.rows.map(row => new Responsavel(row));
      const total = parseInt(countResult.rows[0].total);
      
      return {
        responsaveis,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Erro ao buscar responsáveis com paginação:', error);
      throw error;
    }
  }

  // Converter para objeto simples
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      matricula: this.matricula,
      permissao: this.permissao
    };
  }
}

export default Responsavel;