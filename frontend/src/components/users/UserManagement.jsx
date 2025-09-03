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

  // Carregar usuários na inicialização
  useEffect(() => {
    fetchUsers(1, '');
  }, []);

  const handleSearch = (search) => {
    setSearchTerm(search);
    fetchUsers(1, search);
  };

  const handlePageChange = (page) => {
    changePage(page);
  };

  const handleCreateUser = async (userData) => {
    return await createUser(userData);
  };

  const handleUpdateUser = async (id, userData) => {
    return await updateUser(id, userData);
  };

  const handleDeleteUser = async (id) => {
    return await deleteUser(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserList
        users={users}
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