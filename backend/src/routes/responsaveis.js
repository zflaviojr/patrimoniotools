import express from 'express';
import ResponsavelController from '../controllers/responsavelController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas de responsáveis precisam de autenticação
router.use(authenticateToken);

// GET /api/responsaveis/stats - Estatísticas (deve vir antes de /:id)
router.get('/stats', ResponsavelController.getStats);

// GET /api/responsaveis/matricula/:matricula - Buscar por matrícula
router.get(
  '/matricula/:matricula', 
  ResponsavelController.matriculaValidation,
  ResponsavelController.getByMatricula
);

// GET /api/responsaveis/search/:nome - Buscar por nome
router.get('/search/:nome', ResponsavelController.searchByNome);

// GET /api/responsaveis - Listar todos (com suporte a paginação)
router.get('/', ResponsavelController.getAll);

// GET /api/responsaveis/:id - Buscar por ID
router.get(
  '/:id',
  ResponsavelController.idValidation,
  ResponsavelController.getById
);

// POST /api/responsaveis - Criar novo responsável
router.post(
  '/',
  ResponsavelController.createValidation,
  ResponsavelController.create
);

// PUT /api/responsaveis/:id - Atualizar responsável
router.put(
  '/:id',
  ResponsavelController.updateValidation,
  ResponsavelController.update
);

// DELETE /api/responsaveis/:id - Excluir responsável
router.delete(
  '/:id',
  ResponsavelController.idValidation,
  ResponsavelController.delete
);

export default router;