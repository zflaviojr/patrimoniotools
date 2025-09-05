import React from 'react';
import { Card } from '../common';

const UserCard = ({ 
  user = {}, // Fornecer um objeto vazio como fallback
  onEdit, 
  onDelete, 
  onView, // Nova prop para visualização
  loading = false 
}) => {
  // Verificar se o objeto user existe e é válido
  if (!user || typeof user !== 'object') {
    console.error('UserCard recebeu dados inválidos:', user);
    return (
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="text-red-500">
          Erro: Dados de usuário inválidos
        </div>
      </Card>
    );
  }

  console.error('UserCard: Recebendo user:', JSON.stringify(user, null, 2));
  console.error('UserCard: Loading state:', loading);

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  // Verificar se username existe
  const username = user.username || 'Usuário sem nome';
  const isAdmin = username === 'admin';

  console.error('UserCard: Renderizando botões, loading:', loading);

  const actions = (
    <div className="flex space-x-1">
      {onView && (
        <button
          onClick={() => onView(user)}
          disabled={loading}
          className="p-1 text-gray-400 hover:text-primary-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Visualizar usuário"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      )}
      
      {onEdit && (
        <button
          onClick={() => onEdit(user)}
          disabled={loading}
          className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Editar usuário"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}
      
      {onDelete && !isAdmin && (
        <button
          onClick={() => onDelete(user)}
          disabled={loading}
          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Excluir usuário"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <Card 
      className="p-4 hover:shadow-lg transition-shadow"
      actions={actions}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {username}
            </h3>
            {isAdmin && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Admin
              </span>
            )}
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg 
                className="w-4 h-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 015 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" 
                />
              </svg>
              {user.email || 'Email não informado'}
            </div>
            
            <div className="flex items-center gap-2">
              <svg 
                className="w-4 h-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                />
              </svg>
              {user.telefone || 'Telefone não informado'}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <svg 
                className="w-3 h-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              Criado em {formatDate(user.created_at)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;