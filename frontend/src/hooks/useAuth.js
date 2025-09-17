import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

// Hook para gerenciar autenticação com navegação
export const useAuthNavigation = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  // Redirecionar para login se não autenticado
  const requireAuth = () => {
    if (!auth.isAuthenticated && !auth.loading) {
      navigate('/login');
    }
  };

  // Redirecionar para dashboard se já autenticado
  const redirectIfAuthenticated = () => {
    if (auth.isAuthenticated && !auth.loading) {
      navigate('/dashboard');
    }
  };

  return {
    ...auth,
    requireAuth,
    redirectIfAuthenticated,
  };
};

// Hook para proteger rotas
export const useProtectedRoute = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      navigate('/login');
    }
  }, [auth.isAuthenticated, auth.loading, navigate]);

  return auth;
};

// Hook para redirecionar usuários autenticados
export const useGuestRoute = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loading && auth.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [auth.isAuthenticated, auth.loading, navigate]);

  return auth;
};

// Hook para gerenciar login com feedback
export const useLogin = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [remainingAttempts, setRemainingAttempts] = useState(null);

  const handleLogin = useCallback(async (credentials, options = {}) => {
    try {
      await auth.login(credentials);
      
      // Redirecionar após login bem-sucedido
      const redirectTo = options.redirectTo || '/dashboard';
      navigate(redirectTo);
      
      // Resetar tentativas restantes após login bem-sucedido
      setRemainingAttempts(null);
      
      return true;
    } catch (error) {
      console.error('Erro no login (hook useLogin):', error);
      
      // Verificar se o erro contém informações sobre tentativas restantes
      if (error.response && error.response.data && error.response.data.remainingAttempts !== undefined) {
        setRemainingAttempts(error.response.data.remainingAttempts);
      } else {
        // Se não houver informações de tentativas, resetar
        setRemainingAttempts(null);
      }
      
      // Não estamos ocultando o erro aqui, ele será tratado pelo contexto
      throw error;
    }
  }, [auth, navigate]);

  // Função para limpar as tentativas restantes
  const clearRemainingAttempts = useCallback(() => {
    setRemainingAttempts(null);
  }, []);

  return {
    ...auth,
    handleLogin,
    remainingAttempts,
    setRemainingAttempts: clearRemainingAttempts,
  };
};

// Hook para gerenciar logout
export const useLogout = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, redirecionar para login
      navigate('/login');
    }
  };

  return {
    ...auth,
    handleLogout,
  };
};

// Hook para verificar permissões (futuro uso)
export const usePermissions = () => {
  const auth = useAuth();

  const hasPermission = (permission) => {
    if (!auth.user) return false;
    
    // Implementar lógica de permissões baseada no usuário
    // Por enquanto, retornar true para usuários autenticados
    return auth.isAuthenticated;
  };

  const isAdmin = () => {
    if (!auth.user) return false;
    
    // Implementar verificação de admin
    // Por exemplo, verificar role ou permissão específica
    return auth.user.role === 'admin';
  };

  return {
    ...auth,
    hasPermission,
    isAdmin,
  };
};