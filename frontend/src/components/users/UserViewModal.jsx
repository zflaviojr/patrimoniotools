import React from 'react';
import { Button, Card } from '../common';

const UserViewModal = ({ user, onClose }) => {
  if (!user) return null;

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

  const isAdmin = user.username === 'admin';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-lg bg-white rounded-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Detalhes do Usuário
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Username</h4>
              <p className="mt-1 text-sm text-gray-900 flex items-center">
                {user.username}
                {isAdmin && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Admin
                  </span>
                )}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="mt-1 text-sm text-gray-900">
                {user.email || 'Não informado'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
              <p className="mt-1 text-sm text-gray-900">
                {user.telefone || 'Não informado'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Data de Criação</h4>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(user.created_at)}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Última Atualização</h4>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(user.updated_at)}
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserViewModal;