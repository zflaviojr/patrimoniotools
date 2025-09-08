import express from 'express';
import DescricaoController from '../controllers/descricaoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas de descrições precisam de autenticação
router.use(authenticateToken);

// GET /api/descricoes/stats - Estatísticas (deve vir antes de /:id)
router.get('/stats', DescricaoController.getStats);

// GET /api/descricoes/codigo/:codigo - Buscar por código
router.get(
  '/codigo/:codigo', 
  DescricaoController.codigoValidation,
  DescricaoController.getByCodigo
);

// GET /api/descricoes/search/:termo - Buscar por termo
router.get('/search/:termo', DescricaoController.searchByTermo);

// GET /api/descricoes - Listar todas (com suporte a paginação)
router.get('/', DescricaoController.getAll);

// GET /api/descricoes/:id - Buscar por ID
router.get(
  '/:id',
  DescricaoController.idValidation,
  DescricaoController.getById
);

// POST /api/descricoes - Criar nova descrição
router.post(
  '/',
  DescricaoController.createValidation,
  DescricaoController.create
);

// PUT /api/descricoes/:id - Atualizar descrição
router.put(
  '/:id',
  DescricaoController.updateValidation,
  DescricaoController.update
);

// DELETE /api/descricoes/:id - Excluir descrição
router.delete(
  '/:id',
  DescricaoController.idValidation,
  DescricaoController.delete
);

export default router;