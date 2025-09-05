import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Estado inicial
const initialState = {
  toasts: []
};

// Tipos de ação
const TOAST_ACTIONS = {
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  CLEAR_ALL: 'CLEAR_ALL'
};

// Reducer
const toastReducer = (state, action) => {
  switch (action.type) {
    case TOAST_ACTIONS.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    
    case TOAST_ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    
    case TOAST_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        toasts: []
      };
    
    default:
      return state;
  }
};

// Contexto
const ToastContext = createContext();

// Provider
export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  // Adicionar toast
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };

    dispatch({
      type: TOAST_ACTIONS.ADD_TOAST,
      payload: newToast
    });

    // Auto remover após duração especificada
    if (newToast.duration > 0) {
      setTimeout(() => {
        dispatch({
          type: TOAST_ACTIONS.REMOVE_TOAST,
          payload: id
        });
      }, newToast.duration);
    }

    return id;
  }, []);

  // Remover toast
  const removeToast = useCallback((id) => {
    dispatch({
      type: TOAST_ACTIONS.REMOVE_TOAST,
      payload: id
    });
  }, []);

  // Limpar todos
  const clearAll = useCallback(() => {
    dispatch({
      type: TOAST_ACTIONS.CLEAR_ALL
    });
  }, []);

  // Métodos de conveniência
  const toast = {
    success: (message, options = {}) => addToast({ 
      type: 'success', 
      message, 
      duration: 6000,
      ...options 
    }),
    error: (message, options = {}) => addToast({ 
      type: 'error', 
      message, 
      title: options.title || 'Erro!', // Título padrão para erros
      duration: 10000, // Reduzido para 10 segundos
      ...options 
    }),
    warning: (message, options = {}) => addToast({ 
      type: 'warning', 
      message, 
      duration: 8000,
      ...options 
    }),
    info: (message, options = {}) => addToast({ 
      type: 'info', 
      message, 
      duration: 6000,
      ...options 
    })
  };

  // Função showToast para compatibilidade com código existente
  const showToast = (message, type = 'info', options = {}) => {
    console.error('ToastContext: showToast chamado com:', { message, type, options });
    switch (type) {
      case 'success':
        console.error('ToastContext: Mostrando toast de sucesso');
        toast.success(message, options);
        break;
      case 'error':
        console.error('ToastContext: Mostrando toast de erro');
        toast.error(message, options);
        break;
      case 'warning':
        console.error('ToastContext: Mostrando toast de aviso');
        toast.warning(message, options);
        break;
      default:
        console.error('ToastContext: Mostrando toast de informação');
        toast.info(message, options);
    }
  };

  const value = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearAll,
    toast,
    showToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Hook para usar o contexto
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};

// Componente Toast individual
const Toast = ({ toast, onRemove }) => {
  const icons = {
    success: (
      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    info: (
      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const bgColors = {
    success: 'bg-green-50 border-green-400',
    error: 'bg-red-50 border-red-500',
    warning: 'bg-yellow-50 border-yellow-400',
    info: 'bg-blue-50 border-blue-400'
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  };

  return (
    <div className={`
      w-full max-w-xl min-w-80 bg-white shadow-lg rounded-lg border-l-4 
      ${bgColors[toast.type]} 
      transform transition-all duration-300 ease-in-out
    `}>
      <div className="px-6 py-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            {icons[toast.type]}
          </div>
          <div className="ml-3 w-0 flex-1">
            {toast.title && (
              <h4 className={`text-sm font-bold ${textColors[toast.type]} mb-1`}>
                {toast.title}
              </h4>
            )}
            <p className={`text-sm font-medium ${textColors[toast.type]}`}>
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={() => onRemove(toast.id)}
              className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Container para todos os toasts
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none p-4 flex flex-col items-end justify-start space-y-2">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className="pointer-events-auto transform transition-all duration-300 ease-in-out"
        >
          <Toast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContext;