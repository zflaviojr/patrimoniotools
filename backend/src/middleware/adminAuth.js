import User from '../models/User.js';

// Middleware para verificar se o usuário é administrador
export const requireAdmin = async (req, res, next) => {
  try {
    // Verificar se usuário está autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação requerido'
      });
    }
    
    // Verificar se é admin (por enquanto, verificar username)
    // Em uma implementação futura, poderia ter um campo 'role' na tabela users
    if (req.user.username !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: permissões de administrador requeridas'
      });
    }
    
    next();
  } catch (error) {
    console.error('Erro no middleware de admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se o usuário pode gerenciar outros usuários
export const canManageUsers = async (req, res, next) => {
  try {
    // Por enquanto, apenas admin pode gerenciar usuários
    // No futuro pode ser expandido para outros roles
    return requireAdmin(req, res, next);
  } catch (error) {
    console.error('Erro no middleware de gerenciamento de usuários:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se usuário pode editar o perfil especificado
export const canEditProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    // Usuário pode editar seu próprio perfil ou admin pode editar qualquer perfil
    if (req.user.id.toString() === userId || req.user.username === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: você só pode editar seu próprio perfil'
      });
    }
  } catch (error) {
    console.error('Erro no middleware de edição de perfil:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};