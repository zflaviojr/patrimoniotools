import express from 'express';
import AuthController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas (não precisam de autenticação)

// POST /api/auth/login - Fazer login
router.post('/login', AuthController.loginValidation, AuthController.login);

// POST /api/auth/register - Registrar novo usuário (opcional, se quiser permitir novos registros)
// router.post('/register', AuthController.registerValidation, AuthController.register);

// Rotas protegidas (precisam de autenticação)

// GET /api/auth/validate - Validar token
router.get('/validate', authenticateToken, AuthController.validate);

// POST /api/auth/logout - Fazer logout
router.post('/logout', authenticateToken, AuthController.logout);

// GET /api/auth/me - Obter dados do usuário atual
router.get('/me', authenticateToken, AuthController.getCurrentUser);

// POST /api/auth/change-password - Alterar senha
router.post('/change-password', authenticateToken, AuthController.changePassword);

export default router;