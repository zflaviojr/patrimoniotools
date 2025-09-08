import ResponsavelService from '../services/responsavelService.js';
import { body, param, query } from 'express-validator';
import { checkValidationErrors } from '../utils/validation.js';

class ResponsavelController {
  // Validações para criar responsável
  static createValidation = [
    body('nome')
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 255 })
      .withMessage('Nome deve ter entre 2 e 255 caracteres')
      .trim(),
    body('matricula')
      .notEmpty()
      .withMessage('Matrícula é obrigatória')
      .isLength({ min: 1, max: 50 })
      .withMessage('Matrícula deve ter entre 1 e 50 caracteres')
      .matches(/^[A-Z0-9.-_]+$/i)
      .withMessage('Matrícula deve conter apenas letras, números, pontos, traços e sublinhados')
      .trim(),
    body('permissao')
      .optional()
      .isInt({ min: 0, max: 10 })
      .withMessage('Permissão deve ser um número entre 0 e 10'),
    checkValidationErrors
  ];

  // Validações para atualizar responsável
  static updateValidation = [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número válido'),
    body('nome')
      .optional()
      .isLength({ min: 2, max: 255 })
      .withMessage('Nome deve ter entre 2 e 255 caracteres')
      .trim(),
    body('matricula')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('Matrícula deve ter entre 1 e 50 caracteres')
      .matches(/^[A-Z0-9.-_]+$/i)
      .withMessage('Matrícula deve conter apenas letras, números, pontos, traços e sublinhados')
      .trim(),
    body('permissao')
      .optional()
      .isInt({ min: 0, max: 10 })
      .withMessage('Permissão deve ser um número entre 0 e 10'),
    checkValidationErrors
  ];

  // Validação para buscar por ID
  static idValidation = [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número válido'),
    checkValidationErrors
  ];

  // Validação para buscar por matrícula
  static matriculaValidation = [
    param('matricula')
      .notEmpty()
      .withMessage('Matrícula é obrigatória')
      .isLength({ min: 1, max: 50 })
      .withMessage('Matrícula deve ter entre 1 e 50 caracteres'),
    checkValidationErrors
  ];

  // GET /api/responsaveis - Listar todos os responsáveis
  static async getAll(req, res, next) {
    try {
      const { page, limit, search, sortBy, sortOrder } = req.query;
      
      // Se há parâmetros de paginação, usar paginação
      if (page || limit) {
        const result = await ResponsavelService.getResponsaveisWithPagination(page, limit, search, sortBy, sortOrder);
        return res.json({
          success: true,
          data: result.responsaveis,
          pagination: result.pagination,
          message: 'Responsáveis listados com sucesso'
        });
      }
      
      // Caso contrário, retornar todos
      const responsaveis = await ResponsavelService.getAllResponsaveis();
      
      res.json({
        success: true,
        data: responsaveis,
        total: responsaveis.length,
        message: 'Responsáveis listados com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/responsaveis/:id - Buscar responsável por ID
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const responsavel = await ResponsavelService.getResponsavelById(id);
      
      res.json({
        success: true,
        data: responsavel,
        message: 'Responsável encontrado'
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/responsaveis/matricula/:matricula - Buscar por matrícula
  static async getByMatricula(req, res, next) {
    try {
      const { matricula } = req.params;
      const responsavel = await ResponsavelService.getResponsavelByMatricula(matricula);
      
      res.json({
        success: true,
        data: responsavel,
        message: 'Responsável encontrado'
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/responsaveis - Criar novo responsável
  static async create(req, res, next) {
    try {
      const responsavelData = req.body;
      const responsavel = await ResponsavelService.createResponsavel(responsavelData);
      
      res.status(201).json({
        success: true,
        data: responsavel,
        message: 'Responsável criado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/responsaveis/:id - Atualizar responsável
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const responsavel = await ResponsavelService.updateResponsavel(id, updateData);
      
      res.json({
        success: true,
        data: responsavel,
        message: 'Responsável atualizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/responsaveis/:id - Excluir responsável
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await ResponsavelService.deleteResponsavel(id);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/responsaveis/search/:nome - Buscar responsáveis por nome
  static async searchByNome(req, res, next) {
    try {
      const { nome } = req.params;
      const responsaveis = await ResponsavelService.searchResponsaveisByNome(nome);
      
      res.json({
        success: true,
        data: responsaveis,
        total: responsaveis.length,
        message: 'Busca realizada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/responsaveis/stats - Obter estatísticas
  static async getStats(req, res, next) {
    try {
      const stats = await ResponsavelService.getResponsaveisStats();
      
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

export default ResponsavelController;