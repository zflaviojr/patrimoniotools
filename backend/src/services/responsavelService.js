import Responsavel from '../models/Responsavel.js';
import { ValidationError, NotFoundError, ConflictError } from '../middleware/errorHandler.js';
import { isValidNome, isValidMatricula, isValidPermissao } from '../utils/validation.js';

class ResponsavelService {
  // Listar todos os responsáveis
  static async getAllResponsaveis() {
    try {
      const responsaveis = await Responsavel.findAll();
      return responsaveis;
    } catch (error) {
      console.error('Erro ao listar responsáveis:', error);
      throw error;
    }
  }

  // Buscar responsável por ID
  static async getResponsavelById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new ValidationError('ID inválido');
      }

      const responsavel = await Responsavel.findById(id);
      
      if (!responsavel) {
        throw new NotFoundError('Responsável não encontrado');
      }
      
      return responsavel;
    } catch (error) {
      console.error('Erro ao buscar responsável por ID:', error);
      throw error;
    }
  }

  // Buscar responsável por matrícula
  static async getResponsavelByMatricula(matricula) {
    try {
      if (!matricula) {
        throw new ValidationError('Matrícula é obrigatória');
      }

      if (!isValidMatricula(matricula)) {
        throw new ValidationError('Matrícula deve conter apenas letras maiúsculas, números e caracteres especiais permitidos');
      }

      const responsavel = await Responsavel.findByMatricula(matricula);
      
      if (!responsavel) {
        throw new NotFoundError('Responsável com esta matrícula não encontrado');
      }
      
      return responsavel;
    } catch (error) {
      console.error('Erro ao buscar responsável por matrícula:', error);
      throw error;
    }
  }

  // Criar novo responsável
  static async createResponsavel(data) {
    try {
      const { nome, matricula, permissao } = data;

      // Validar dados obrigatórios
      if (!nome || !matricula) {
        throw new ValidationError('Nome e matrícula são obrigatórios');
      }

      // Validar formato dos dados
      if (!isValidNome(nome)) {
        throw new ValidationError('Nome deve ter entre 2 e 255 caracteres');
      }

      if (!isValidMatricula(matricula)) {
        throw new ValidationError('Matrícula deve conter apenas letras maiúsculas, números e caracteres especiais permitidos');
      }

      if (permissao !== null && permissao !== undefined && !isValidPermissao(permissao)) {
        throw new ValidationError('Permissão deve ser um número entre 0 e 10');
      }

      // Verificar se matrícula já existe
      const isUnique = await Responsavel.isMatriculaUnique(matricula);
      if (!isUnique) {
        throw new ConflictError('Matrícula já cadastrada');
      }

      // Criar responsável
      const responsavel = await Responsavel.create({
        nome,
        matricula,
        permissao
      });

      return responsavel;
    } catch (error) {
      console.error('Erro ao criar responsável:', error);
      throw error;
    }
  }

  // Atualizar responsável
  static async updateResponsavel(id, data) {
    try {
      if (!id || isNaN(id)) {
        throw new ValidationError('ID inválido');
      }

      const { nome, matricula, permissao } = data;

      // Buscar responsável existente
      const responsavel = await Responsavel.findById(id);
      if (!responsavel) {
        throw new NotFoundError('Responsável não encontrado');
      }

      // Validar dados se fornecidos
      if (nome !== undefined && !isValidNome(nome)) {
        throw new ValidationError('Nome deve ter entre 2 e 255 caracteres');
      }

      if (matricula !== undefined && !isValidMatricula(matricula)) {
        throw new ValidationError('Matrícula deve conter apenas letras maiúsculas, números e caracteres especiais permitidos');
      }

      if (permissao !== null && permissao !== undefined && !isValidPermissao(permissao)) {
        throw new ValidationError('Permissão deve ser um número entre 0 e 10');
      }

      // Verificar unicidade da matrícula se foi alterada
      if (matricula && matricula !== responsavel.matricula) {
        const isUnique = await Responsavel.isMatriculaUnique(matricula, id);
        if (!isUnique) {
          throw new ConflictError('Matrícula já cadastrada');
        }
      }

      // Atualizar apenas os campos fornecidos
      const updateData = {
        nome: nome !== undefined ? nome : responsavel.nome,
        matricula: matricula !== undefined ? matricula : responsavel.matricula,
        permissao: permissao !== undefined ? permissao : responsavel.permissao
      };

      const updatedResponsavel = await responsavel.update(updateData);
      return updatedResponsavel;
    } catch (error) {
      console.error('Erro ao atualizar responsável:', error);
      throw error;
    }
  }

  // Excluir responsável
  static async deleteResponsavel(id) {
    try {
      if (!id || isNaN(id)) {
        throw new ValidationError('ID inválido');
      }

      const responsavel = await Responsavel.findById(id);
      if (!responsavel) {
        throw new NotFoundError('Responsável não encontrado');
      }

      await responsavel.delete();
      return { message: 'Responsável excluído com sucesso' };
    } catch (error) {
      console.error('Erro ao excluir responsável:', error);
      throw error;
    }
  }

  // Buscar responsáveis por nome (pesquisa)
  static async searchResponsaveisByNome(nome) {
    try {
      if (!nome || nome.trim().length < 2) {
        throw new ValidationError('Termo de busca deve ter pelo menos 2 caracteres');
      }

      const responsaveis = await Responsavel.findByNome(nome.trim());
      return responsaveis;
    } catch (error) {
      console.error('Erro ao buscar responsáveis por nome:', error);
      throw error;
    }
  }

  // Listar responsáveis com paginação
  static async getResponsaveisWithPagination(page = 1, limit = 10, search = '', sortBy = 'nome', sortOrder = 'ASC') {
    try {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      if (isNaN(pageNum) || pageNum < 1) {
        throw new ValidationError('Página deve ser um número maior que 0');
      }

      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new ValidationError('Limite deve ser um número entre 1 e 100');
      }

      const result = await Responsavel.findWithPagination(pageNum, limitNum, search, sortBy, sortOrder);
      return result;
    } catch (error) {
      console.error('Erro ao buscar responsáveis com paginação:', error);
      throw error;
    }
  }

  // Obter estatísticas dos responsáveis
  static async getResponsaveisStats() {
    try {
      const total = await Responsavel.count();
      
      // Aqui você pode adicionar mais estatísticas se necessário
      return {
        total,
        // Exemplo: totalAtivos, totalInativos, etc.
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }
}

export default ResponsavelService;