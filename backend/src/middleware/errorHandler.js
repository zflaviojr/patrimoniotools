// Classes de erro personalizadas
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400);
    this.details = details;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message) {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

export class LockedError extends AppError {
  constructor(message) {
    super(message, 423); // 423 Locked
  }
}

// Middleware para rotas não encontradas
export const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Rota não encontrada: ${req.originalUrl}`);
  next(error);
};

// Middleware de tratamento de erros
export const errorHandler = (err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  // Erro de validação do Express Validator
  if (err.errors) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: err.errors.map(e => e.msg)
    });
  }
  
  // Erros personalizados
  if (err instanceof AppError) {
    // Erro de validação com detalhes
    if (err instanceof ValidationError && err.details) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.details
      });
    }
    
    // Preparar resposta base
    const response = {
      success: false,
      message: err.message
    };
    
    // Adicionar informações extras se disponíveis
    if (err.remainingAttempts !== undefined) {
      response.remainingAttempts = err.remainingAttempts;
    }
    
    return res.status(err.statusCode).json(response);
  }
  
  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }
  
  // Erro de conexão com banco de dados
  if (err.name === 'ConnectionError' || err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      message: 'Serviço temporariamente indisponível'
    });
  }
  
  // Erro de constraint do banco de dados
  if (err.code === '23505') { // Unique constraint violation
    return res.status(409).json({
      success: false,
      message: 'Registro já existe'
    });
  }
  
  // Erro padrão
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
};

// Middleware para capturar erros assíncronos
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};