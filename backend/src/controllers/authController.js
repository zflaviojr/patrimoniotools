import AuthService from '../services/authService.js';
import { body } from 'express-validator';
import { checkValidationErrors } from '../utils/validation.js';

class AuthController {
  // Validações para login
  static loginValidation = [
    body('username')
      .notEmpty()
      .withMessage('Username é obrigatório')
      .trim(),
    body('password')
      .notEmpty()
      .withMessage('Senha é obrigatória'),
    checkValidationErrors
  ];

  // Validações para registro
  static registerValidation = [
    body('username')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username deve ter entre 3 e 50 caracteres')
      .matches(/^[a-zA-Z0-9_.-]+$/)
      .withMessage('Username pode conter apenas letras, números, pontos, traços e sublinhados')
      .trim(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter pelo menos 6 caracteres'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email deve ter formato válido')
      .normalizeEmail(),
    checkValidationErrors
  ];

  // POST /api/auth/login
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      
      const result = await AuthService.login(username, password);
      
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });
      
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/register
  static async register(req, res, next) {
    try {
      const userData = req.body;
      
      const result = await AuthService.register(userData);
      
      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: result
      });
      
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/validate
  static async validate(req, res, next) {
    try {
      // O middleware de autenticação já verificou o token
      // e adicionou o usuário ao request
      const user = await AuthService.validateToken(req.user.id);
      
      res.json({
        success: true,
        message: 'Token válido',
        data: { user }
      });
      
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/logout
  static async logout(req, res, next) {
    try {
      // Para JWT, o logout é feito no frontend removendo o token
      // No backend, apenas confirmamos o logout
      res.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
      
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/change-password
  static async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual e nova senha são obrigatórias'
        });
      }
      
      const result = await AuthService.changePassword(userId, oldPassword, newPassword);
      
      res.json({
        success: true,
        message: result.message
      });
      
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/me
  static async getCurrentUser(req, res, next) {
    try {
      res.json({
        success: true,
        data: { user: req.user }
      });
      
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;