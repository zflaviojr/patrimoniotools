import React, { useState, useEffect, useMemo } from 'react';
import { Button, Input, ConfirmModal, Loading } from '../common';
import UserCard from './UserCard';
import UserForm from './UserForm';
import UserViewModal from './UserViewModal'; // Importar o novo componente

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
  console.error('UserList: Props recebidas:', {
    users: JSON.stringify(users, null, 2),
    loading,
    pagination: JSON.stringify(pagination, null, 2)
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null); // Estado para usuário sendo visualizado
  const [deletingUser, setDeletingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoizar usuários válidos para evitar re-renderizações desnecessárias
  const validUsers = useMemo(() => {
    console.error('UserList: Calculando validUsers com users:', JSON.stringify(users, null, 2));
    const result = Array.isArray(users) ? users : [];
    console.error('UserList: validUsers calculado:', JSON.stringify(result, null, 2));
    return result;
  }, [users]);

  // Verificar dados de usuários recebidos
  useEffect(() => {
    console.error('UserList: useEffect executado com validUsers:', JSON.stringify(validUsers, null, 2));
  }, [validUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.error('UserList: Handle search chamado com:', searchTerm);
    onSearch(searchTerm);
  };

  const handleCreateUser = () => {
    console.error('UserList: Handle create user chamado');
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user) => {
    console.error('UserList: Handle edit user chamado com:', JSON.stringify(user, null, 2));
    // Verificar se o usuário é válido antes de abrir o formulário
    if (!user || typeof user !== 'object') {
      console.error('Tentativa de editar usuário inválido:', user);
      return;
    }
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleViewUser = (user) => {
    console.error('UserList: Handle view user chamado com:', JSON.stringify(user, null, 2));
    // Verificar se o usuário é válido antes de abrir o modal de visualização
    if (!user || typeof user !== 'object') {
      console.error('Tentativa de visualizar usuário inválido:', user);
      return;
    }
    setViewingUser(user);
  };

  const handleDeleteUser = (user) => {
    console.error('UserList: Handle delete user chamado com:', JSON.stringify(user, null, 2));
    // Verificar se o usuário é válido antes de abrir o modal de confirmação
    if (!user || typeof user !== 'object') {
      console.error('Tentativa de excluir usuário inválido:', user);
      return;
    }
    setDeletingUser(user);
  };

  const handleFormSubmit = async (userData) => {
    console.error('=== INICIANDO HANDLE FORM SUBMIT ===');
    console.error('UserList: Handle form submit chamado com:', JSON.stringify(userData, null, 2));
    setIsSubmitting(true);
    try {
      let result;
      
      if (editingUser) {
        console.error('UserList: Chamando onUpdateUser para editar usuário');
        result = await onUpdateUser(editingUser.id, userData);
      } else {
        console.error('UserList: Chamando onCreateUser para criar usuário');
        result = await onCreateUser(userData);
      }

      console.error('UserList: Resultado do form submit:', JSON.stringify(result, null, 2));
      // Verificar se a operação foi bem-sucedida (seguindo o mesmo padrão do UserProfile)
      if (result && (result.success === true || (result.data && !result.error))) {
        console.error('UserList: Operação bem-sucedida, fechando modal');
        setIsFormOpen(false);
        setEditingUser(null);
      } else {
        // Se houve erro, manter o formulário aberto
        console.error('UserList: Erro no form submit:', result);
        // A mensagem de erro já foi mostrada pelo hook useUsers
      }
    } catch (error) {
      console.error('=== ERRO INESPERADO NO FORM SUBMIT ===');
      console.error('Erro inesperado ao submeter formulário:', error);
    } finally {
      console.error('=== FINALIZANDO HANDLE FORM SUBMIT ===');
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    console.error('=== INICIANDO CONFIRM DELETE ===');
    console.error('UserList: Confirm delete chamado com:', JSON.stringify(deletingUser, null, 2));
    if (deletingUser) {
      setIsSubmitting(true);
      try {
        console.error('UserList: Chamando onDeleteUser');
        const result = await onDeleteUser(deletingUser.id);
        console.error('UserList: Resultado do delete:', JSON.stringify(result, null, 2));
        // Verificar se a operação foi bem-sucedida (seguindo o mesmo padrão do UserProfile)
        if (result && (result.success === true || (result.data && !result.error))) {
          console.error('UserList: Delete bem-sucedido, fechando modal');
          setDeletingUser(null);
        } else {
          // Se houve erro, manter o modal aberto
          console.error('UserList: Erro no delete:', result);
          // A mensagem de erro já foi mostrada pelo hook useUsers
        }
      } catch (error) {
        console.error('=== ERRO INESPERADO NO DELETE ===');
        console.error('Erro inesperado ao excluir usuário:', error);
      } finally {
        console.error('=== FINALIZANDO CONFIRM DELETE ===');
        setIsSubmitting(false);
      }
    }
  };

  const renderPagination = () => {
    console.error('UserList: Render pagination chamado com:', JSON.stringify(pagination, null, 2));
    // Verificar se pagination é um objeto válido
    if (!pagination || typeof pagination !== 'object' || pagination.totalPages <= 1) return null;

    const pages = [];
    const currentPage = pagination.page || 1;
    const totalPages = pagination.totalPages || 1;
    
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
          Mostrando {((currentPage - 1) * (pagination.limit || 10)) + 1} a{' '}
          {Math.min(currentPage * (pagination.limit || 10), pagination.total || 0)} de{' '}
          {pagination.total || 0} usuários
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

  console.error('Usuários válidos para renderização:', JSON.stringify(validUsers, null, 2));

  // Adicionar verificação adicional para garantir que os usuários estão sendo processados corretamente
  const hasUsers = validUsers && Array.isArray(validUsers) && validUsers.length > 0;
  console.error('UserList: hasUsers:', hasUsers);

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
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : hasUsers ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {validUsers.map((user, index) => {
            // Verificar se o usuário é válido antes de renderizar
            if (!user || typeof user !== 'object') {
              console.error('Usuário inválido encontrado na lista:', user);
              return null;
            }
            
            console.error('Renderizando UserCard para user:', JSON.stringify(user, null, 2));
            
            // Garantir que o usuário tenha um ID único
            const key = user.id ? user.id : `user-${index}`;
            
            return (
              <UserCard
                key={key}
                user={user}
                onEdit={(user) => {
                  console.error('UserList: Passando user para handleEditUser:', user);
                  handleEditUser(user);
                }}
                onView={(user) => {
                  console.error('UserList: Passando user para handleViewUser:', user);
                  handleViewUser(user);
                }}
                onDelete={(user) => {
                  console.error('UserList: Passando user para handleDeleteUser:', user);
                  handleDeleteUser(user);
                }}
                loading={loading || isSubmitting}
              />
            );
          })}
        </div>
      ) : (
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

      {/* Modal de visualização */}
      {viewingUser && (
        <UserViewModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
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