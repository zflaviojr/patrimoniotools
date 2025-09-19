import { query } from '../config/database.js';
import { sanitizeString } from '../utils/validation.js';

class Descricao {
  constructor(data) {
    this.id = data.id;
    this.descricao = data.descricao;
    this.subcontasiafi = data.subcontasiafi;
    this.vidautil = data.vidautil;
    this.codigo = data.codigo;
    this.useradd = data.useradd;
    this.deletado = data.deletado;
  }

  // Buscar todas as descrições
  static async findAll() {
    try {
      const result = await query('SELECT * FROM tbldescricao WHERE deletado = 0 ORDER BY descricao');
      return result.rows.map(row => new Descricao(row));
    } catch (error) {
      console.error('Erro ao buscar descrições:', error);
      throw error;
    }
  }

  // Buscar descrição por ID
  static async findById(id) {
    try {
      const result = await query('SELECT * FROM tbldescricao WHERE id = $1 AND deletado = 0', [id]);
      return result.rows[0] ? new Descricao(result.rows[0]) : null;
    } catch (error) {
      console.error('Erro ao buscar descrição por ID:', error);
      throw error;
    }
  }

  // Buscar descrição por código
  static async findByCodigo(codigo) {
    try {
      const result = await query('SELECT * FROM tbldescricao WHERE codigo = $1 AND deletado = 0', [codigo]);
      return result.rows[0] ? new Descricao(result.rows[0]) : null;
    } catch (error) {
      console.error('Erro ao buscar descrição por código:', error);
      throw error;
    }
  }

  // Buscar descrições com filtro por descrição
  static async findByDescricao(descricao) {
    try {
      const searchTerm = `%${descricao.toLowerCase()}%`;
      const result = await query(
        'SELECT * FROM tbldescricao WHERE LOWER(descricao) LIKE $1 AND deletado = 0 ORDER BY descricao',
        [searchTerm]
      );
      return result.rows.map(row => new Descricao(row));
    } catch (error) {
      console.error('Erro ao buscar descrições por descrição:', error);
      throw error;
    }
  }

  // Criar nova descrição
  static async create(data) {
    try {
      const { descricao, subcontasiafi, vidautil, useradd } = data;
      
      const sanitizedDescricao = sanitizeString(descricao);
      
      const result = await query(
        `INSERT INTO tbldescricao (descricao, subcontasiafi, vidautil, useradd, deletado) 
         VALUES (upper($1), $2, $3, $4, 0) 
         RETURNING *`,
        [sanitizedDescricao, subcontasiafi || null, vidautil || null, useradd || null]
      );
      
      return new Descricao(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar descrição:', error);
      throw error;
    }
  }

  // Atualizar descrição
  async update(data) {
    try {
      const { descricao, subcontasiafi, vidautil, useradd } = data;
      
      const sanitizedDescricao = sanitizeString(descricao);
      
      const result = await query(
        `UPDATE tbldescricao 
         SET descricao = upper($1), subcontasiafi = $2, vidautil = $3, useradd = $4 
         WHERE id = $5 
         RETURNING *`,
        [sanitizedDescricao, subcontasiafi || null, vidautil || null, useradd || null, this.id]
      );
      
      if (result.rows[0]) {
        Object.assign(this, result.rows[0]);
      }
      
      return this;
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error);
      throw error;
    }
  }

  // Excluir descrição (soft delete)
  async delete() {
    try {
      const result = await query(
        'UPDATE tbldescricao SET deletado = 1 WHERE id = $1 RETURNING *',
        [this.id]
      );
      
      if (result.rows[0]) {
        Object.assign(this, result.rows[0]);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir descrição:', error);
      throw error;
    }
  }

  // Verificar se código já existe (excluindo o próprio registro)
  static async isCodigoUnique(codigo, excludeId = null) {
    try {
      let queryText = 'SELECT id FROM tbldescricao WHERE codigo = $1 AND deletado = 0';
      let params = [codigo];
      
      if (excludeId) {
        queryText += ' AND id != $2';
        params.push(excludeId);
      }
      
      const result = await query(queryText, params);
      return result.rows.length === 0;
    } catch (error) {
      console.error('Erro ao verificar unicidade do código:', error);
      throw error;
    }
  }

  // Contar total de descrições
  static async count() {
    try {
      const result = await query('SELECT COUNT(*) as total FROM tbldescricao WHERE deletado = 0');
      return parseInt(result.rows[0].total);
    } catch (error) {
      console.error('Erro ao contar descrições:', error);
      throw error;
    }
  }

  // Buscar descrições com paginação
  static async findWithPagination(page = 1, limit = 10, search = '', sortBy = 'codigo', sortOrder = 'DESC') {
    try {
      const offset = (page - 1) * limit;
      
      // Validar parâmetros de ordenação
      const validSortFields = ['id', 'codigo', 'descricao', 'subcontasiafi', 'vidautil', 'useradd'];
      const validSortOrders = ['ASC', 'DESC'];
      
      if (!validSortFields.includes(sortBy)) {
        sortBy = 'codigo'; // Valor padrão
      }
      
      if (!validSortOrders.includes(sortOrder.toUpperCase())) {
        sortOrder = 'DESC'; // Valor padrão
      }
      
      let queryText = 'SELECT * FROM tbldescricao WHERE deletado = 0';
      let countText = 'SELECT COUNT(*) as total FROM tbldescricao WHERE deletado = 0';
      let queryParams = [];
      let countParams = [];
      
      if (search) {
        const searchTerm = `%${search.toLowerCase()}%`;
        queryText += ' AND (LOWER(descricao) LIKE $1 OR CAST(codigo AS VARCHAR) LIKE $1)';
        countText += ' AND (LOWER(descricao) LIKE $1 OR CAST(codigo AS VARCHAR) LIKE $1)';
        queryParams.push(searchTerm);
        countParams.push(searchTerm);
      }
      
      // Adicionar ordenação
      queryText += ` ORDER BY ${sortBy} ${sortOrder} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(limit, offset);
      
      console.log('queryText', queryText);
      console.log('queryParams', queryParams);
      const [descricoesResult, countResult] = await Promise.all([
        query(queryText, queryParams),
        query(countText, countParams)
      ]);
      
      const descricoes = descricoesResult.rows.map(row => new Descricao(row));
      const total = parseInt(countResult.rows[0].total);
      
      return {
        descricoes,
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
      console.error('Erro ao buscar descrições com paginação:', error);
      throw error;
    }
  }

  // Converter para objeto simples
  toJSON() {
    return {
      id: this.id,
      descricao: this.descricao,
      subcontasiafi: this.subcontasiafi,
      vidautil: this.vidautil,
      codigo: this.codigo,
      useradd: this.useradd,
      deletado: this.deletado
    };
  }
}

export default Descricao;