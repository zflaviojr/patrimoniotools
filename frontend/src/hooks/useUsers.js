import { useState, useCallback } from 'react';
import UserService from '../services/userService';
import { useToast } from '../context/ToastContext';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const { showToast } = useToast();

  // Buscar usuários com paginação
  const fetchUsers = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await UserService.getUsers({
        page,
        limit: pagination.limit,
        search
      });

      if (response && response.success) {
        setUsers(response.data || []);
        setPagination(response.pagination || { 
          page, 
          limit: pagination.limit, 
          total: 0,
          totalPages: 0 
        });
      } else {
        showToast('Erro ao carregar usuários', 'error');
        setUsers([]);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      showToast('Erro ao carregar usuários', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, showToast]);

  // Buscar usuário por ID
  const getUserById = useCallback(async (id) => {
    try {
      const response = await UserService.getUserById(id);
      if (response.success) {
        return response.data;
      } else {
        showToast(response.message || 'Erro ao buscar usuário', 'error');
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      showToast('Erro ao buscar usuário', 'error');
      return null;
    }
  }, [showToast]);

  // Criar novo usuário
  const createUser = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await UserService.createUser(userData);
      if (response.success) {
        showToast(response.message || 'Usuário criado com sucesso!', 'success');
        await fetchUsers(pagination.page);
        return { success: true, data: response.data };
      } else {
        showToast(response.message || 'Erro ao criar usuário', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      showToast(error.response?.data?.message || error.message || 'Erro ao criar usuário', 'error');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, showToast]);

  // Atualizar usuário
  const updateUser = useCallback(async (id, userData) => {
    setLoading(true);
    try {
      const response = await UserService.updateUser(id, userData);
      if (response.success) {
        showToast(response.message || 'Usuário atualizado com sucesso!', 'success');
        await fetchUsers(pagination.page);
        return { success: true, data: response.data };
      } else {
        showToast(response.message || 'Erro ao atualizar usuário', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      showToast(error.response?.data?.message || error.message || 'Erro ao atualizar usuário', 'error');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, showToast]);

  // Excluir usuário
  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await UserService.deleteUser(id);
      if (response.success) {
        showToast(response.message || 'Usuário excluído com sucesso', 'success');
        await fetchUsers(pagination.page);
        return { success: true };
      } else {
        showToast(response.message || 'Erro ao excluir usuário', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      showToast(error.response?.data?.message || error.message || 'Erro ao excluir usuário', 'error');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, showToast]);

  // Atualizar perfil
  const updateProfile = useCallback(async (id, profileData) => {
    setLoading(true);
    try {
      const response = await UserService.updateProfile(id, profileData);
      if (response.success) {
        showToast(response.message || 'Perfil atualizado com sucesso', 'success');
        return { success: true, data: response.data };
      } else {
        showToast(response.message || 'Erro ao atualizar perfil', 'error');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showToast(error.response?.data?.message || error.message || 'Erro ao atualizar perfil', 'error');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Alterar página
  const changePage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  }, [fetchUsers, pagination.totalPages]);

  // Alterar limite por página
  const changeLimit = useCallback((newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchUsers(1);
  }, [fetchUsers]);

  return {
    users,
    loading,
    pagination,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateProfile,
    changePage,
    changeLimit
  };
};