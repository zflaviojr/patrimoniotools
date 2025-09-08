import Descricao from '../models/Descricao.js';
import { ValidationError, NotFoundError, ConflictError } from '../middleware/errorHandler.js';
import { isValidDescricao, isValidVidaUtil, isValidSubcontaSiafi } from '../utils/validation.js';

class DescricaoService {
  // Listar todas as descrições
  static async getAllDescricoes() {
    try {
      const descricoes = await Descricao.findAll();
      return descricoes;
    } catch (error) {
      console.error('Erro ao listar descrições:', error);
      throw error;
    }
  }

  // Buscar descrição por ID
  static async getDescricaoById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new ValidationError('ID inválido');
      }

      const descricao = await Descricao.findById(id);
      
      if (!descricao) {
        throw new NotFoundError('Descrição não encontrada');
      }
      
      return descricao;
    } catch (error) {
      console.error('Erro ao buscar descrição por ID:', error);
      throw error;
    }
  }

  // Buscar descrição por código
  static async getDescricaoByCodigo(codigo) {
    try {
      if (!codigo) {
        throw new ValidationError('Código é obrigatório');
      }

      const descricao = await Descricao.findByCodigo(codigo);
      
      if (!descricao) {
        throw new NotFoundError('Descrição com este código não encontrada');
      }
      
      return descricao;
    } catch (error) {
      console.error('Erro ao buscar descrição por código:', error);
      throw error;
    }
  }

  // Criar nova descrição
  static async createDescricao(data) {
    try {
      const { descricao, subcontasiafi, vidautil, useradd } = data;

      // Validar dados obrigatórios
      if (!descricao) {
        throw new ValidationError('Descrição é obrigatória');
      }

      // Validar formato dos dados
      if (!isValidDescricao(descricao)) {
        throw new ValidationError('Descrição deve ter entre 2 e 255 caracteres');
      }

      if (subcontasiafi !== undefined && subcontasiafi !== null && !isValidSubcontaSiafi(subcontasiafi)) {
        throw new ValidationError('Subconta SIAFI deve ter formato válido');
      }

      if (vidautil !== undefined && vidautil !== null && !isValidVidaUtil(vidautil)) {
        throw new ValidationError('Vida útil deve ser um número entre 0 e 100');
      }

      // Criar descrição
      const descricaoObj = await Descricao.create({
        descricao,
        subcontasiafi,
        vidautil,
        useradd
      });

      return descricaoObj;
    } catch (error) {
      console.error('Erro ao criar descrição:', error);
      throw error;
    }
  }

  // Atualizar descrição
  static async updateDescricao(id, data) {
    try {
      if (!id || isNaN(id)) {
        throw new ValidationError('ID inválido');
      }

      const { descricao, subcontasiafi, vidautil, useradd } = data;

      // Buscar descrição existente
      const descricaoObj = await Descricao.findById(id);
      if (!descricaoObj) {
        throw new NotFoundError('Descrição não encontrada');
      }

      // Validar dados se fornecidos
      if (descricao !== undefined && !isValidDescricao(descricao)) {
        throw new ValidationError('Descrição deve ter entre 2 e 255 caracteres');
      }

      if (subcontasiafi !== undefined && subcontasiafi !== null && !isValidSubcontaSiafi(subcontasiafi)) {
        throw new ValidationError('Subconta SIAFI deve ter formato válido');
      }

      if (vidautil !== undefined && vidautil !== null && !isValidVidaUtil(vidautil)) {
        throw new ValidationError('Vida útil deve ser um número entre 0 e 100');
      }

      // Atualizar apenas os campos fornecidos
      const updateData = {
        descricao: descricao !== undefined ? descricao : descricaoObj.descricao,
        subcontasiafi: subcontasiafi !== undefined ? subcontasiafi : descricaoObj.subcontasiafi,
        vidautil: vidautil !== undefined ? vidautil : descricaoObj.vidautil,
        useradd: useradd !== undefined ? useradd : descricaoObj.useradd
      };

      const updatedDescricao = await descricaoObj.update(updateData);
      return updatedDescricao;
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error);
      throw error;
    }
  }

  // Excluir descrição
  static async deleteDescricao(id) {
    try {
      if (!id || isNaN(id)) {
        throw new ValidationError('ID inválido');
      }

      const descricao = await Descricao.findById(id);
      if (!descricao) {
        throw new NotFoundError('Descrição não encontrada');
      }

      await descricao.delete();
      return { message: 'Descrição excluída com sucesso' };
    } catch (error) {
      console.error('Erro ao excluir descrição:', error);
      throw error;
    }
  }

  // Buscar descrições por termo (pesquisa)
  static async searchDescricoesByTermo(termo) {
    try {
      if (!termo || termo.trim().length < 2) {
        throw new ValidationError('Termo de busca deve ter pelo menos 2 caracteres');
      }

      const descricoes = await Descricao.findByDescricao(termo.trim());
      return descricoes;
    } catch (error) {
      console.error('Erro ao buscar descrições por termo:', error);
      throw error;
    }
  }

  // Listar descrições com paginação
  static async getDescricoesWithPagination(page = 1, limit = 10, search = '') {
    try {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      if (isNaN(pageNum) || pageNum < 1) {
        throw new ValidationError('Página deve ser um número maior que 0');
      }

      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new ValidationError('Limite deve ser um número entre 1 e 100');
      }

      const result = await Descricao.findWithPagination(pageNum, limitNum, search);
      return result;
    } catch (error) {
      console.error('Erro ao buscar descrições com paginação:', error);
      throw error;
    }
  }

  // Obter estatísticas das descrições
  static async getDescricoesStats() {
    try {
      const total = await Descricao.count();
      
      return {
        total,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }
}

export default DescricaoService;