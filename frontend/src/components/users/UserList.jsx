import React, { useState } from 'react';
import { Button, Input, ConfirmModal, Loading } from '../common';
import UserCard from './UserCard';
import UserForm from './UserForm';

const UserList = ({ 
  users = [], 
  loading = false, 
  pagination = {}, 
  onCreateUser, 
  onUpdateUser, 
  onDeleteUser, 
  onPageChange, 
  onSearch 
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (user) => {
    setDeletingUser(user);
  };

  const handleFormSubmit = async (userData) => {
    setIsSubmitting(true);
    try {
      let result;
      
      if (editingUser) {
        result = await onUpdateUser(editingUser.id, userData);
      } else {
        result = await onCreateUser(userData);
      }

      // Se o resultado foi bem-sucedido, fechar o modal
      if (result && result.success === true) {
        setIsFormOpen(false);
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Erro inesperado ao submeter formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deletingUser) {
      setIsSubmitting(true);
      try {
        await onDeleteUser(deletingUser.id);
        setDeletingUser(null);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;
    
    // Mostrar até 5 páginas
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6 px-4">
        <div className="text-sm text-gray-700">
          Mostrando {((currentPage - 1) * pagination.limit) + 1} a{' '}
          {Math.min(currentPage * pagination.limit, pagination.total)} de{' '}
          {pagination.total} usuários
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1 || loading}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Anterior
          </Button>
          
          {pages.map(page => (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={loading}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages || loading}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Próxima
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com busca e botão de criar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gerenciar Usuários
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie os usuários do sistema
          </p>
        </div>
        
        <Button
          onClick={handleCreateUser}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          Novo Usuário
        </Button>
      </div>

      {/* Busca */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar por username ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          disabled={loading}
        >
          Buscar
        </Button>
      </form>

      {/* Lista de usuários */}
      {loading && users.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H3C1.9 1 1 1.9 1 3V21C1 22.1 1.9 23 3 23H21C22.1 23 23 22.1 23 21V9H21Z"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum usuário encontrado
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro usuário'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              loading={loading || isSubmitting}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      {renderPagination()}

      {/* Modal de formulário */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg bg-white rounded-md shadow-lg">
            <UserForm
              onSubmit={handleFormSubmit}
              user={editingUser}
              loading={isSubmitting}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingUser(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={confirmDelete}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir o usuário "${deletingUser?.username}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        loading={isSubmitting}
        variant="danger"
      />
    </div>
  );
};

export default UserList;