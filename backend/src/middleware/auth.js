import { verifyToken, extractToken } from '../utils/jwt.js';
import User from '../models/User.js';

// Middleware para verificar autenticação
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso requerido'
      });
    }

    // Verificar e decodificar token
    const decoded = verifyToken(token);
    
    // Buscar usuário no banco
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    // Adicionar usuário ao request
    req.user = user.toSafeObject();
    next();
    
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error.message === 'Token expirado') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Faça login novamente.'
      });
    }
    
    if (error.message === 'Token inválido') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware opcional para autenticação (não falha se não houver token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);
    
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = user.toSafeObject();
      }
    }
    
    next();
  } catch (error) {
    // Em caso de erro, apenas continue sem autenticação
    next();
  }
};