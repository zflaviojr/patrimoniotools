import express from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin, canEditProfile } from '../middleware/adminAuth.js';
import { checkValidationErrors } from '../utils/validation.js';

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authenticateToken);

// Validações para criação de usuário
const createUserValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username deve ter entre 3 e 50 caracteres')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Username deve conter apenas letras, números, underscore, ponto e hífen'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email deve ter formato válido'),
  body('telefone')
    .optional()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'),
  checkValidationErrors
];

// Validações para atualização de usuário
const updateUserValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username deve ter entre 3 e 50 caracteres')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Username deve conter apenas letras, números, underscore, ponto e hífen'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email deve ter formato válido'),
  body('telefone')
    .optional()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'),
  checkValidationErrors
];

// Validações para atualização de perfil
const updateProfileValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email deve ter formato válido'),
  body('telefone')
    .optional()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'),
  checkValidationErrors
];

// Rotas para gerenciamento de usuários (apenas admin)
router.get('/', requireAdmin, UserController.getAllUsers);
router.get('/:id', requireAdmin, UserController.getUserById);
router.post('/', requireAdmin, createUserValidation, UserController.createUser);
router.put('/:id', requireAdmin, updateUserValidation, UserController.updateUser);
router.delete('/:id', requireAdmin, UserController.deleteUser);

// Rota para atualização de perfil (usuário próprio ou admin)
router.put('/profile/:id', canEditProfile, updateProfileValidation, UserController.updateProfile);

export default router;