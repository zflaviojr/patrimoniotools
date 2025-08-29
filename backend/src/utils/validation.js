import { validationResult } from 'express-validator';

// Função para verificar se há erros de validação
export const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }
  
  next();
};

// Validações personalizadas
export const isValidMatricula = (matricula) => {
  // Matrícula deve ter pelo menos 1 caractere e no máximo 50
  // Pode conter letras maiúsculas, números e alguns caracteres especiais
  const regex = /^[A-Z0-9.-_]+$/;
  return matricula && matricula.length >= 1 && matricula.length <= 50 && regex.test(matricula);
};

export const isValidNome = (nome) => {
  // Nome deve ter pelo menos 2 caracteres e no máximo 255
  // Pode conter letras, números, espaços e alguns caracteres especiais
  return nome && nome.trim().length >= 2 && nome.length <= 255;
};

export const isValidPermissao = (permissao) => {
  // Permissão deve ser um número entre 0 e 10, ou null/undefined
  if (permissao === null || permissao === undefined) {
    return true;
  }
  
  const num = parseInt(permissao);
  return !isNaN(num) && num >= 0 && num <= 10;
};

// Sanitizar strings
export const sanitizeString = (str) => {
  if (typeof str !== 'string') {
    return str;
  }
  
  return str.trim().replace(/\\s+/g, ' ');
};

// Sanitizar matrícula (converter para maiúscula)
export const sanitizeMatricula = (matricula) => {
  if (typeof matricula !== 'string') {
    return matricula;
  }
  
  return matricula.trim().toUpperCase();
};