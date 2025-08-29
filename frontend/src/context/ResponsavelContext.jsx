import React, { createContext, useContext, useReducer } from 'react';
import { responsavelService } from '../services/responsavelService.js';
import { getErrorMessage } from '../services/api.js';

// Estado inicial
const initialState = {
  responsaveis: [],
  selectedResponsavel: null,
  loading: false,
  error: null,
  searchResults: [],
  searchLoading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  stats: {
    total: 0,
  },
};

// Tipos de ações
const RESPONSAVEL_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Listagem
  SET_RESPONSAVEIS: 'SET_RESPONSAVEIS',
  SET_PAGINATION: 'SET_PAGINATION',
  
  // Responsável individual
  SET_SELECTED_RESPONSAVEL: 'SET_SELECTED_RESPONSAVEL',
  ADD_RESPONSAVEL: 'ADD_RESPONSAVEL',
  UPDATE_RESPONSAVEL: 'UPDATE_RESPONSAVEL',
  REMOVE_RESPONSAVEL: 'REMOVE_RESPONSAVEL',
  
  // Busca
  SET_SEARCH_LOADING: 'SET_SEARCH_LOADING',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  
  // Estatísticas
  SET_STATS: 'SET_STATS',
};

// Reducer
const responsavelReducer = (state, action) => {
  switch (action.type) {
    case RESPONSAVEL_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case RESPONSAVEL_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case RESPONSAVEL_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case RESPONSAVEL_ACTIONS.SET_RESPONSAVEIS:
      return { 
        ...state, 
        responsaveis: action.payload, 
        loading: false, 
        error: null 
      };
    
    case RESPONSAVEL_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: action.payload };
    
    case RESPONSAVEL_ACTIONS.SET_SELECTED_RESPONSAVEL:
      return { ...state, selectedResponsavel: action.payload };
    
    case RESPONSAVEL_ACTIONS.ADD_RESPONSAVEL:
      return { 
        ...state, 
        responsaveis: [action.payload, ...state.responsaveis],
        stats: { ...state.stats, total: state.stats.total + 1 }
      };
    
    case RESPONSAVEL_ACTIONS.UPDATE_RESPONSAVEL:
      return {
        ...state,
        responsaveis: state.responsaveis.map(resp =>
          resp.id === action.payload.id ? action.payload : resp
        ),
        selectedResponsavel: state.selectedResponsavel?.id === action.payload.id 
          ? action.payload 
          : state.selectedResponsavel
      };
    
    case RESPONSAVEL_ACTIONS.REMOVE_RESPONSAVEL:
      return {
        ...state,
        responsaveis: state.responsaveis.filter(resp => resp.id !== action.payload),
        selectedResponsavel: state.selectedResponsavel?.id === action.payload 
          ? null 
          : state.selectedResponsavel,
        stats: { ...state.stats, total: Math.max(0, state.stats.total - 1) }
      };
    
    case RESPONSAVEL_ACTIONS.SET_SEARCH_LOADING:
      return { ...state, searchLoading: action.payload };
    
    case RESPONSAVEL_ACTIONS.SET_SEARCH_RESULTS:
      return { 
        ...state, 
        searchResults: action.payload, 
        searchLoading: false 
      };
    
    case RESPONSAVEL_ACTIONS.CLEAR_SEARCH:
      return { 
        ...state, 
        searchResults: [], 
        searchLoading: false 
      };
    
    case RESPONSAVEL_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    
    default:
      return state;
  }
};

// Criar contexto
const ResponsavelContext = createContext();

// Provider do contexto
export const ResponsavelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(responsavelReducer, initialState);

  // Listar responsáveis
  const fetchResponsaveis = async (params = {}) => {
    dispatch({ type: RESPONSAVEL_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await responsavelService.getAll(params);
      
      dispatch({ 
        type: RESPONSAVEL_ACTIONS.SET_RESPONSAVEIS, 
        payload: response.data 
      });
      
      if (response.pagination) {
        dispatch({ 
          type: RESPONSAVEL_ACTIONS.SET_PAGINATION, 
          payload: response.pagination 
        });
      }
      
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: RESPONSAVEL_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Buscar responsável por ID
  const fetchResponsavelById = async (id) => {
    dispatch({ type: RESPONSAVEL_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const responsavel = await responsavelService.getById(id);
      dispatch({ 
        type: RESPONSAVEL_ACTIONS.SET_SELECTED_RESPONSAVEL, 
        payload: responsavel 
      });
      dispatch({ type: RESPONSAVEL_ACTIONS.SET_LOADING, payload: false });
      return responsavel;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: RESPONSAVEL_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Buscar por matrícula
  const searchByMatricula = async (matricula) => {
    dispatch({ type: RESPONSAVEL_ACTIONS.SET_SEARCH_LOADING, payload: true });
    
    try {
      const responsavel = await responsavelService.getByMatricula(matricula);
      dispatch({ 
        type: RESPONSAVEL_ACTIONS.SET_SEARCH_RESULTS, 
        payload: [responsavel] 
      });
      return responsavel;
    } catch (error) {
      dispatch({ 
        type: RESPONSAVEL_ACTIONS.SET_SEARCH_RESULTS, 
        payload: [] 
      });
      
      if (error.response?.status !== 404) {
        const errorMessage = getErrorMessage(error);
        dispatch({ type: RESPONSAVEL_ACTIONS.SET_ERROR, payload: errorMessage });
      }
      
      throw error;
    }
  };

  // Buscar por nome
  const searchByNome = async (nome) => {
    dispatch({ type: RESPONSAVEL_ACTIONS.SET_SEARCH_LOADING, payload: true });
    
    try {
      const responsaveis = await responsavelService.searchByNome(nome);
      dispatch({ 
        type: RESPONSAVEL_ACTIONS.SET_SEARCH_RESULTS, 
        payload: responsaveis 
      });
      return responsaveis;
    } catch (error) {
      dispatch({ 
        type: RESPONSAVEL_ACTIONS.SET_SEARCH_RESULTS, 
        payload: [] 
      });
      
      const errorMessage = getErrorMessage(error);
      dispatch({ type: RESPONSAVEL_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Criar responsável
  const createResponsavel = async (responsavelData) => {
    dispatch({ type: RESPONSAVEL_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const responsavel = await responsavelService.create(responsavelData);
      dispatch({ 
        type: RESPONSAVEL_ACTIONS.ADD_RESPONSAVEL, 
        payload: responsavel 
      });
      dispatch({ type: RESPONSAVEL_ACTIONS.SET_LOADING, payload: false });
      return responsavel;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: RESPONSAVEL_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Atualizar responsável
  const updateResponsavel = async (id, responsavelData) => {
    dispatch({ type: RESPONSAVEL_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const responsavel = await responsavelService.update(id, responsavelData);
      dispatch({ 
        type: RESPONSAVEL_ACTIONS.UPDATE_RESPONSAVEL, 
        payload: responsavel 
      });
      dispatch({ type: RESPONSAVEL_ACTIONS.SET_LOADING, payload: false });
      return responsavel;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: RESPONSAVEL_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Excluir responsável
  const deleteResponsavel = async (id) => {
    dispatch({ type: RESPONSAVEL_ACTIONS.SET_LOADING, payload: true });
    
    try {
      await responsavelService.delete(id);
      dispatch({ 
        type: RESPONSAVEL_ACTIONS.REMOVE_RESPONSAVEL, 
        payload: id 
      });
      dispatch({ type: RESPONSAVEL_ACTIONS.SET_LOADING, payload: false });
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: RESPONSAVEL_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Obter estatísticas
  const fetchStats = async () => {
    try {
      const stats = await responsavelService.getStats();
      dispatch({ type: RESPONSAVEL_ACTIONS.SET_STATS, payload: stats });
      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  // Limpar busca
  const clearSearch = () => {
    dispatch({ type: RESPONSAVEL_ACTIONS.CLEAR_SEARCH });
  };

  // Limpar erro
  const clearError = () => {
    dispatch({ type: RESPONSAVEL_ACTIONS.CLEAR_ERROR });
  };

  // Selecionar responsável
  const selectResponsavel = (responsavel) => {
    dispatch({ 
      type: RESPONSAVEL_ACTIONS.SET_SELECTED_RESPONSAVEL, 
      payload: responsavel 
    });
  };

  // Valor do contexto
  const value = {
    ...state,
    
    // Ações
    fetchResponsaveis,
    fetchResponsavelById,
    searchByMatricula,
    searchByNome,
    createResponsavel,
    updateResponsavel,
    deleteResponsavel,
    fetchStats,
    clearSearch,
    clearError,
    selectResponsavel,
  };

  return (
    <ResponsavelContext.Provider value={value}>
      {children}
    </ResponsavelContext.Provider>
  );
};

// Hook para usar o contexto
export const useResponsaveis = () => {
  const context = useContext(ResponsavelContext);
  
  if (!context) {
    throw new Error('useResponsaveis deve ser usado dentro de um ResponsavelProvider');
  }
  
  return context;
};

export default ResponsavelContext;