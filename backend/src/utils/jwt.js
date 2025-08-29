import jwt from 'jsonwebtoken';
import config from '../config/environment.js';

// Gerar token JWT
export const generateToken = (payload) => {
  try {
    return jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    throw new Error('Erro interno do servidor');
  }
};

// Verificar token JWT
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw new Error('Erro ao verificar token');
  }
};

// Extrair token do header Authorization
export const extractToken = (authHeader) => {
  if (!authHeader) {
    return null;
  }
  
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

// Decodificar token sem verificar (para debug)
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};