import React, { useEffect, useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import UserList from './UserList';
import { Loading } from '../common';

const UserManagement = () => {
  const {
    users,
    loading,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    changePage
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');

  // Carregar usuários na inicialização - apenas uma vez
  useEffect(() => {
    console.error('UserManagement: Iniciando fetchUsers');
    fetchUsers(1, '');
  }, []); // Remover fetchUsers das dependências para evitar loop

  const handleSearch = (search) => {
    console.error('UserManagement: Handle search chamado com:', search);
    setSearchTerm(search);
    fetchUsers(1, search);
  };

  const handlePageChange = (page) => {
    console.error('UserManagement: Handle page change chamado com:', page);
    changePage(page);
  };

  const handleCreateUser = async (userData) => {
    console.error('UserManagement: Handle create user chamado com:', JSON.stringify(userData, null, 2));
    return await createUser(userData);
  };

  const handleUpdateUser = async (id, userData) => {
    console.error('UserManagement: Handle update user chamado com:', id, JSON.stringify(userData, null, 2));
    return await updateUser(id, userData);
  };

  const handleDeleteUser = async (id) => {
    console.error('UserManagement: Handle delete user chamado com:', id);
    return await deleteUser(id);
  };

  // Log antes de passar os dados para UserList
  console.error('UserManagement: Passando props para UserList:', {
    users: JSON.stringify(users, null, 2),
    loading,
    pagination: JSON.stringify(pagination, null, 2)
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserList
        users={users} // Garantir que users seja passado diretamente
        loading={loading}
        pagination={pagination}
        onCreateUser={handleCreateUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default UserManagement;