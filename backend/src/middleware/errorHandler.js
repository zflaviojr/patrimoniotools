// Classes de erro personalizadas
export class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Recurso não encontrado') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  constructor(message = 'Conflito de dados') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Acesso não autorizado') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Acesso proibido') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

// Middleware de tratamento de erros
export const errorHandler = (err, req, res, next) => {
  console.error('Erro capturado:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  // Erro de validação
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  // Erro de recurso não encontrado
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Erro de conflito (ex: matrícula duplicada)
  if (err instanceof ConflictError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Erro de autorização
  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Erro de acesso proibido
  if (err instanceof ForbiddenError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Erro de constraint única do PostgreSQL
  if (err.code === '23505') {
    let message = 'Dados duplicados';
    
    if (err.constraint === 'uk_matricula') {
      message = 'Matrícula já cadastrada';
    } else if (err.constraint === 'users_username_key') {
      message = 'Nome de usuário já existe';
    }
    
    return res.status(409).json({
      success: false,
      message
    });
  }

  // Erro de conexão com banco
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Serviço temporariamente indisponível'
    });
  }

  // Erro interno do servidor
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
};

// Middleware para rotas não encontradas
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.url} não encontrada`
  });
};