import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService.js';

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Tipos de ações
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload.error,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading,
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
};

// Criar contexto
const AuthContext = createContext();

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inicializar autenticação ao carregar a aplicação
  useEffect(() => {
    const initAuth = async () => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { loading: true } });
      
      try {
        const user = await authService.initializeAuth();
        
        if (user) {
          dispatch({ 
            type: AUTH_ACTIONS.SET_USER, 
            payload: { user } 
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      } finally {
        // Garantir que o loading seja removido
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { loading: false } });
      }
    };

    initAuth();
  }, []);

  // Função de login
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const data = await authService.login(credentials);
      
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_SUCCESS, 
        payload: { user: data.user } 
      });
      
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
      
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_FAILURE, 
        payload: { error: errorMessage } 
      });
      
      throw error;
    }
  };

  // Função de logout
  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { loading: true } });
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Atualizar dados do usuário
  const updateUser = async (newUserData = null) => {
    try {
      if (newUserData) {
        // Se dados foram fornecidos, apenas atualizar o contexto
        dispatch({ 
          type: AUTH_ACTIONS.SET_USER, 
          payload: { user: newUserData } 
        });
        return newUserData;
      } else {
        // Se não, buscar da API
        const user = await authService.getCurrentUserFromAPI();
        dispatch({ 
          type: AUTH_ACTIONS.SET_USER, 
          payload: { user } 
        });
        return user;
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  };

  // Alterar senha
  const changePassword = async (passwords) => {
    try {
      return await authService.changePassword(passwords);
    } catch (error) {
      throw error;
    }
  };

  // Limpar erro
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Valor do contexto
  const value = {
    ...state,
    login,
    logout,
    updateUser,
    changePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

export default AuthContext;