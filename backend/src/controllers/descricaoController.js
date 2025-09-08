import DescricaoService from '../services/descricaoService.js';
import { body, param, query } from 'express-validator';
import { checkValidationErrors } from '../utils/validation.js';

class DescricaoController {
  // Validações para criar descrição
  static createValidation = [
    body('descricao')
      .notEmpty()
      .withMessage('Descrição é obrigatória')
      .isLength({ min: 2, max: 255 })
      .withMessage('Descrição deve ter entre 2 e 255 caracteres')
      .trim(),
    body('subcontasiafi')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Subconta SIAFI deve ter no máximo 50 caracteres')
      .trim(),
    body('vidautil')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Vida útil deve ser um número entre 0 e 100'),
    body('useradd')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Usuário deve ter no máximo 50 caracteres')
      .trim(),
    checkValidationErrors
  ];

  // Validações para atualizar descrição
  static updateValidation = [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número válido'),
    body('descricao')
      .optional()
      .isLength({ min: 2, max: 255 })
      .withMessage('Descrição deve ter entre 2 e 255 caracteres')
      .trim(),
    body('subcontasiafi')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Subconta SIAFI deve ter no máximo 50 caracteres')
      .trim(),
    body('vidautil')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Vida útil deve ser um número entre 0 e 100'),
    body('useradd')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Usuário deve ter no máximo 50 caracteres')
      .trim(),
    checkValidationErrors
  ];

  // Validação para buscar por ID
  static idValidation = [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número válido'),
    checkValidationErrors
  ];

  // Validação para buscar por código
  static codigoValidation = [
    param('codigo')
      .notEmpty()
      .withMessage('Código é obrigatório')
      .isLength({ min: 1, max: 50 })
      .withMessage('Código deve ter entre 1 e 50 caracteres'),
    checkValidationErrors
  ];

  // GET /api/descricoes - Listar todas as descrições
  static async getAll(req, res, next) {
    try {
      const { page, limit, search } = req.query;
      
      // Se há parâmetros de paginação, usar paginação
      if (page || limit) {
        const result = await DescricaoService.getDescricoesWithPagination(page, limit, search);
        return res.json({
          success: true,
          data: result.descricoes,
          pagination: result.pagination,
          message: 'Descrições listadas com sucesso'
        });
      }
      
      // Caso contrário, retornar todas
      const descricoes = await DescricaoService.getAllDescricoes();
      
      res.json({
        success: true,
        data: descricoes,
        total: descricoes.length,
        message: 'Descrições listadas com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/descricoes/:id - Buscar descrição por ID
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const descricao = await DescricaoService.getDescricaoById(id);
      
      res.json({
        success: true,
        data: descricao,
        message: 'Descrição encontrada'
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/descricoes/codigo/:codigo - Buscar por código
  static async getByCodigo(req, res, next) {
    try {
      const { codigo } = req.params;
      const descricao = await DescricaoService.getDescricaoByCodigo(codigo);
      
      res.json({
        success: true,
        data: descricao,
        message: 'Descrição encontrada'
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/descricoes - Criar nova descrição
  static async create(req, res, next) {
    try {
      const descricaoData = req.body;
      const descricao = await DescricaoService.createDescricao(descricaoData);
      
      res.status(201).json({
        success: true,
        data: descricao,
        message: 'Descrição criada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/descricoes/:id - Atualizar descrição
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const descricao = await DescricaoService.updateDescricao(id, updateData);
      
      res.json({
        success: true,
        data: descricao,
        message: 'Descrição atualizada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/descricoes/:id - Excluir descrição
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await DescricaoService.deleteDescricao(id);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/descricoes/search/:termo - Buscar descrições por termo
  static async searchByTermo(req, res, next) {
    try {
      const { termo } = req.params;
      const descricoes = await DescricaoService.searchDescricoesByTermo(termo);
      
      res.json({
        success: true,
        data: descricoes,
        total: descricoes.length,
        message: 'Busca realizada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/descricoes/stats - Obter estatísticas
  static async getStats(req, res, next) {
    try {
      const stats = await DescricaoService.getDescricoesStats();
      
      res.json({
        success: true,
        data: stats,
        message: 'Estatísticas obtidas com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default DescricaoController;