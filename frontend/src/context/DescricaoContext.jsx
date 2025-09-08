import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { descricaoService } from '../services/descricaoService.js';
import { getErrorMessage } from '../services/api.js';

// Estado inicial
const initialState = {
  descricoes: [],
  selectedDescricao: null,
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
const DESCRICAO_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Listagem
  SET_DESCRICOES: 'SET_DESCRICOES',
  SET_PAGINATION: 'SET_PAGINATION',
  
  // Descrição individual
  SET_SELECTED_DESCRICAO: 'SET_SELECTED_DESCRICAO',
  ADD_DESCRICAO: 'ADD_DESCRICAO',
  UPDATE_DESCRICAO: 'UPDATE_DESCRICAO',
  REMOVE_DESCRICAO: 'REMOVE_DESCRICAO',
  
  // Busca
  SET_SEARCH_LOADING: 'SET_SEARCH_LOADING',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  
  // Estatísticas
  SET_STATS: 'SET_STATS',
};

// Reducer
const descricaoReducer = (state, action) => {
  switch (action.type) {
    case DESCRICAO_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case DESCRICAO_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case DESCRICAO_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case DESCRICAO_ACTIONS.SET_DESCRICOES:
      return { 
        ...state, 
        descricoes: action.payload, 
        loading: false, 
        error: null 
      };
    
    case DESCRICAO_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: action.payload };
    
    case DESCRICAO_ACTIONS.SET_SELECTED_DESCRICAO:
      return { ...state, selectedDescricao: action.payload };
    
    case DESCRICAO_ACTIONS.ADD_DESCRICAO:
      return { 
        ...state, 
        descricoes: [action.payload, ...state.descricoes],
        stats: { ...state.stats, total: state.stats.total + 1 }
      };
    
    case DESCRICAO_ACTIONS.UPDATE_DESCRICAO:
      return {
        ...state,
        descricoes: state.descricoes.map(desc =>
          desc.id === action.payload.id ? action.payload : desc
        ),
        selectedDescricao: state.selectedDescricao?.id === action.payload.id 
          ? action.payload 
          : state.selectedDescricao
      };
    
    case DESCRICAO_ACTIONS.REMOVE_DESCRICAO:
      return {
        ...state,
        descricoes: state.descricoes.filter(desc => desc.id !== action.payload),
        selectedDescricao: state.selectedDescricao?.id === action.payload 
          ? null 
          : state.selectedDescricao,
        stats: { ...state.stats, total: Math.max(0, state.stats.total - 1) }
      };
    
    case DESCRICAO_ACTIONS.SET_SEARCH_LOADING:
      return { ...state, searchLoading: action.payload };
    
    case DESCRICAO_ACTIONS.SET_SEARCH_RESULTS:
      return { 
        ...state, 
        searchResults: action.payload, 
        searchLoading: false 
      };
    
    case DESCRICAO_ACTIONS.CLEAR_SEARCH:
      return { 
        ...state, 
        searchResults: [], 
        searchLoading: false 
      };
    
    case DESCRICAO_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    
    default:
      return state;
  }
};

// Criar contexto
const DescricaoContext = createContext();

// Provider do contexto
export const DescricaoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(descricaoReducer, initialState);

  // Listar descrições - usando useCallback para evitar recriação desnecessária
  const fetchDescricoes = useCallback(async (params = {}) => {
    dispatch({ type: DESCRICAO_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await descricaoService.getAll(params);
      
      dispatch({ 
        type: DESCRICAO_ACTIONS.SET_DESCRICOES, 
        payload: response.data 
      });
      
      if (response.pagination) {
        dispatch({ 
          type: DESCRICAO_ACTIONS.SET_PAGINATION, 
          payload: response.pagination 
        });
      }
      
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: DESCRICAO_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  }, []);

  // Buscar descrição por ID - usando useCallback para evitar recriação desnecessária
  const fetchDescricaoById = useCallback(async (id) => {
    dispatch({ type: DESCRICAO_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const descricao = await descricaoService.getById(id);
      dispatch({ 
        type: DESCRICAO_ACTIONS.SET_SELECTED_DESCRICAO, 
        payload: descricao 
      });
      dispatch({ type: DESCRICAO_ACTIONS.SET_LOADING, payload: false });
      return descricao;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: DESCRICAO_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  }, []);

  // Buscar por código - usando useCallback para evitar recriação desnecessária
  const searchByCodigo = useCallback(async (codigo) => {
    dispatch({ type: DESCRICAO_ACTIONS.SET_SEARCH_LOADING, payload: true });
    
    try {
      const descricao = await descricaoService.getByCodigo(codigo);
      dispatch({ 
        type: DESCRICAO_ACTIONS.SET_SEARCH_RESULTS, 
        payload: [descricao] 
      });
      return descricao;
    } catch (error) {
      dispatch({ 
        type: DESCRICAO_ACTIONS.SET_SEARCH_RESULTS, 
        payload: [] 
      });
      
      if (error.response?.status !== 404) {
        const errorMessage = getErrorMessage(error);
        dispatch({ type: DESCRICAO_ACTIONS.SET_ERROR, payload: errorMessage });
      }
      
      throw error;
    }
  }, []);

  // Buscar por termo - usando useCallback para evitar recriação desnecessária
  const searchByTermo = useCallback(async (termo) => {
    dispatch({ type: DESCRICAO_ACTIONS.SET_SEARCH_LOADING, payload: true });
    
    try {
      const descricoes = await descricaoService.searchByTermo(termo);
      dispatch({ 
        type: DESCRICAO_ACTIONS.SET_SEARCH_RESULTS, 
        payload: descricoes 
      });
      return descricoes;
    } catch (error) {
      dispatch({ 
        type: DESCRICAO_ACTIONS.SET_SEARCH_RESULTS, 
        payload: [] 
      });
      
      const errorMessage = getErrorMessage(error);
      dispatch({ type: DESCRICAO_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  }, []);

  // Criar descrição - usando useCallback para evitar recriação desnecessária
  const createDescricao = useCallback(async (descricaoData) => {
    dispatch({ type: DESCRICAO_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const descricao = await descricaoService.create(descricaoData);
      dispatch({ 
        type: DESCRICAO_ACTIONS.ADD_DESCRICAO, 
        payload: descricao 
      });
      dispatch({ type: DESCRICAO_ACTIONS.SET_LOADING, payload: false });
      return descricao;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: DESCRICAO_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  }, []);

  // Atualizar descrição - usando useCallback para evitar recriação desnecessária
  const updateDescricao = useCallback(async (id, descricaoData) => {
    dispatch({ type: DESCRICAO_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const descricao = await descricaoService.update(id, descricaoData);
      dispatch({ 
        type: DESCRICAO_ACTIONS.UPDATE_DESCRICAO, 
        payload: descricao 
      });
      dispatch({ type: DESCRICAO_ACTIONS.SET_LOADING, payload: false });
      return descricao;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: DESCRICAO_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  }, []);

  // Excluir descrição - usando useCallback para evitar recriação desnecessária
  const deleteDescricao = useCallback(async (id) => {
    dispatch({ type: DESCRICAO_ACTIONS.SET_LOADING, payload: true });
    
    try {
      await descricaoService.delete(id);
      dispatch({ 
        type: DESCRICAO_ACTIONS.REMOVE_DESCRICAO, 
        payload: id 
      });
      dispatch({ type: DESCRICAO_ACTIONS.SET_LOADING, payload: false });
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: DESCRICAO_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  }, []);

  // Obter estatísticas - usando useCallback para evitar recriação desnecessária
  const fetchStats = useCallback(async () => {
    try {
      const stats = await descricaoService.getStats();
      dispatch({ type: DESCRICAO_ACTIONS.SET_STATS, payload: stats });
      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  }, []);

  // Limpar busca
  const clearSearch = useCallback(() => {
    dispatch({ type: DESCRICAO_ACTIONS.CLEAR_SEARCH });
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    dispatch({ type: DESCRICAO_ACTIONS.CLEAR_ERROR });
  }, []);

  // Selecionar descrição
  const selectDescricao = useCallback((descricao) => {
    dispatch({ 
      type: DESCRICAO_ACTIONS.SET_SELECTED_DESCRICAO, 
      payload: descricao 
    });
  }, []);

  // Valor do contexto - usando useMemo para evitar recriação desnecessária
  const value = useMemo(() => ({
    ...state,
    
    // Ações
    fetchDescricoes,
    fetchDescricaoById,
    searchByCodigo,
    searchByTermo,
    createDescricao,
    updateDescricao,
    deleteDescricao,
    fetchStats,
    clearSearch,
    clearError,
    selectDescricao,
  }), [
    state,
    fetchDescricoes,
    fetchDescricaoById,
    searchByCodigo,
    searchByTermo,
    createDescricao,
    updateDescricao,
    deleteDescricao,
    fetchStats,
    clearSearch,
    clearError,
    selectDescricao,
  ]);

  return (
    <DescricaoContext.Provider value={value}>
      {children}
    </DescricaoContext.Provider>
  );
};

// Hook para usar o contexto
export const useDescricoes = () => {
  const context = useContext(DescricaoContext);
  
  if (!context) {
    throw new Error('useDescricoes deve ser usado dentro de um DescricaoProvider');
  }
  
  return context;
};

export default DescricaoContext;