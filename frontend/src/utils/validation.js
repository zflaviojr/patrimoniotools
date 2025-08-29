// Utilitários de validação para o frontend

// Validação de nome
export const validateNome = (nome) => {
  const errors = [];
  
  if (!nome || typeof nome !== 'string') {
    errors.push('Nome é obrigatório');
    return errors;
  }
  
  const trimmedNome = nome.trim();
  
  if (trimmedNome.length === 0) {
    errors.push('Nome é obrigatório');
  } else if (trimmedNome.length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  } else if (trimmedNome.length > 255) {
    errors.push('Nome deve ter no máximo 255 caracteres');
  }
  
  // Verificar se contém apenas caracteres válidos (letras, espaços, acentos)
  const nomeRegex = /^[a-zA-ZÀ-ÿ\s.-]+$/;
  if (!nomeRegex.test(trimmedNome)) {
    errors.push('Nome deve conter apenas letras, espaços, pontos e hífens');
  }
  
  // Verificar se não são apenas espaços
  if (!/[a-zA-ZÀ-ÿ]/.test(trimmedNome)) {
    errors.push('Nome deve conter pelo menos uma letra');
  }
  
  return errors;
};

// Validação de matrícula
export const validateMatricula = (matricula) => {
  const errors = [];
  
  if (!matricula || typeof matricula !== 'string') {
    errors.push('Matrícula é obrigatória');
    return errors;
  }
  
  const trimmedMatricula = matricula.trim().toUpperCase();
  
  if (trimmedMatricula.length === 0) {
    errors.push('Matrícula é obrigatória');
  } else if (trimmedMatricula.length < 1) {
    errors.push('Matrícula deve ter pelo menos 1 caractere');
  } else if (trimmedMatricula.length > 50) {
    errors.push('Matrícula deve ter no máximo 50 caracteres');
  }
  
  // Verificar formato (letras maiúsculas, números, pontos, traços, sublinhados)
  const matriculaRegex = /^[A-Z0-9._-]+$/;
  if (!matriculaRegex.test(trimmedMatricula)) {
    errors.push('Matrícula deve conter apenas letras maiúsculas, números, pontos, traços e sublinhados');
  }
  
  // Verificar se não é apenas caracteres especiais
  if (!/[A-Z0-9]/.test(trimmedMatricula)) {
    errors.push('Matrícula deve conter pelo menos uma letra ou número');
  }
  
  return errors;
};

// Validação de permissão
export const validatePermissao = (permissao) => {
  const errors = [];
  
  // Permissão é opcional
  if (permissao === null || permissao === undefined || permissao === '') {
    return errors;
  }
  
  const numPermissao = parseInt(permissao);
  
  if (isNaN(numPermissao)) {
    errors.push('Permissão deve ser um número');
  } else if (numPermissao < 0) {
    errors.push('Permissão deve ser maior ou igual a 0');
  } else if (numPermissao > 10) {
    errors.push('Permissão deve ser menor ou igual a 10');
  }
  
  return errors;
};

// Validação de email
export const validateEmail = (email) => {
  const errors = [];
  
  if (!email || typeof email !== 'string') {
    return errors; // Email é opcional na maioria dos casos
  }
  
  const trimmedEmail = email.trim();
  
  if (trimmedEmail.length === 0) {
    return errors; // Email vazio é válido se opcional
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    errors.push('Email deve ter um formato válido');
  }
  
  if (trimmedEmail.length > 254) {
    errors.push('Email deve ter no máximo 254 caracteres');
  }
  
  return errors;
};

// Validação de senha
export const validatePassword = (password, minLength = 6) => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Senha é obrigatória');
    return errors;
  }
  
  if (password.length < minLength) {
    errors.push(`Senha deve ter pelo menos ${minLength} caracteres`);
  }
  
  if (password.length > 128) {
    errors.push('Senha deve ter no máximo 128 caracteres');
  }
  
  // Verificar se contém pelo menos uma letra e um número (opcional)
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasLetter) {
    errors.push('Senha deve conter pelo menos uma letra');
  }
  
  if (!hasNumber) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  return errors;
};

// Validação de username
export const validateUsername = (username) => {
  const errors = [];
  
  if (!username || typeof username !== 'string') {
    errors.push('Nome de usuário é obrigatório');
    return errors;
  }
  
  const trimmedUsername = username.trim();
  
  if (trimmedUsername.length === 0) {
    errors.push('Nome de usuário é obrigatório');
  } else if (trimmedUsername.length < 3) {
    errors.push('Nome de usuário deve ter pelo menos 3 caracteres');
  } else if (trimmedUsername.length > 50) {
    errors.push('Nome de usuário deve ter no máximo 50 caracteres');
  }
  
  // Verificar formato (letras, números, pontos, traços, sublinhados)
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;
  if (!usernameRegex.test(trimmedUsername)) {
    errors.push('Nome de usuário deve conter apenas letras, números, pontos, traços e sublinhados');
  }
  
  // Deve começar com letra ou número
  if (!/^[a-zA-Z0-9]/.test(trimmedUsername)) {
    errors.push('Nome de usuário deve começar com uma letra ou número');
  }
  
  return errors;
};

// Validação completa de responsável
export const validateResponsavel = (data) => {
  const errors = {};
  
  const nomeErrors = validateNome(data.nome);
  if (nomeErrors.length > 0) {
    errors.nome = nomeErrors[0]; // Mostrar apenas o primeiro erro
  }
  
  const matriculaErrors = validateMatricula(data.matricula);
  if (matriculaErrors.length > 0) {
    errors.matricula = matriculaErrors[0];
  }
  
  const permissaoErrors = validatePermissao(data.permissao);
  if (permissaoErrors.length > 0) {
    errors.permissao = permissaoErrors[0];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validação de login
export const validateLogin = (data) => {
  const errors = {};
  
  const usernameErrors = validateUsername(data.username);
  if (usernameErrors.length > 0) {
    errors.username = usernameErrors[0];
  }
  
  const passwordErrors = validatePassword(data.password);
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors[0];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitização de dados
export const sanitizeResponsavel = (data) => {
  return {
    nome: data.nome ? data.nome.trim() : '',
    matricula: data.matricula ? data.matricula.trim().toUpperCase() : '',
    permissao: data.permissao === '' || data.permissao === null || data.permissao === undefined 
      ? null 
      : parseInt(data.permissao)
  };
};

// Utilitário para formatar erros de API
export const formatApiErrors = (apiError) => {
  if (typeof apiError === 'string') {
    return apiError;
  }
  
  if (apiError.response?.data?.errors && Array.isArray(apiError.response.data.errors)) {
    return apiError.response.data.errors
      .map(error => error.msg || error.message || error)
      .join(', ');
  }
  
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }
  
  if (apiError.message) {
    return apiError.message;
  }
  
  return 'Erro desconhecido';
};

// Debounce para validações em tempo real
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};