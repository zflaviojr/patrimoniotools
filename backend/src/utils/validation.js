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

// Validação de telefone brasileiro
export const isValidTelefone = (telefone) => {
  // Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return !telefone || regex.test(telefone);
};

// Validação de email
export const isValidEmail = (email) => {
  // Email é opcional, mas se fornecido deve ter formato válido
  if (!email) return true;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de username
export const isValidUsername = (username) => {
  // Username deve ter entre 3 e 50 caracteres, apenas letras, números, underscore, ponto e hífen
  const regex = /^[a-zA-Z0-9_.-]+$/;
  return username && username.length >= 3 && username.length <= 50 && regex.test(username);
};

// Validação de senha
export const isValidPassword = (password) => {
  // Senha deve ter pelo menos 6 caracteres
  return password && password.length >= 6;
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

// Sanitizar telefone (remover espaços e caracteres especiais)
export const sanitizeTelefone = (telefone) => {
  if (typeof telefone !== 'string') {
    return telefone;
  }
  
  return telefone.trim();
};

// Formatar telefone para o padrão brasileiro
export const formatTelefone = (telefone) => {
  if (!telefone) return telefone;
  
  // Remove tudo que não é número
  const numbers = telefone.replace(/\D/g, '');
  
  // Aplica máscara baseada no tamanho
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
};