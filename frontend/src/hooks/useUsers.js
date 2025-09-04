import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
  
  // Ref para controlar se o componente está montado
  const isMountedRef = useRef(false);
  
  // Memoizar o limite para evitar recriação desnecessária
  const paginationLimit = useMemo(() => pagination.limit, [pagination.limit]);
  
  // Inicializar o ref quando o componente montar
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Buscar usuários com paginação
  const fetchUsers = useCallback(async (page = 1, search = '') => {
    console.error('useUsers: fetchUsers chamado com:', { page, search, isMounted: isMountedRef.current });
    
    if (!isMountedRef.current) {
      console.error('useUsers: Componente não montado, retornando');
      return;
    }
    
    setLoading(true);
    try {
      console.error('Buscando usuários com parâmetros:', { page, limit: paginationLimit, search });
      
      const response = await UserService.getUsers({
        page,
        limit: paginationLimit,
        search
      });

      console.error('Resposta da API de usuários:', JSON.stringify(response, null, 2));

      // Verificar se a resposta tem o formato esperado
      if (response && response.success && isMountedRef.current) {
        console.error('useUsers: Resposta válida da API, atualizando estado');
        // Verificar a estrutura da resposta
        console.error('useUsers: Estrutura da resposta:', {
          hasData: !!response.data,
          dataType: typeof response.data,
          hasUsers: !!(response.data && response.data.users),
          usersType: response.data && response.data.users ? typeof response.data.users : 'undefined',
          usersArray: Array.isArray(response.data && response.data.users ? response.data.users : null),
          hasPagination: !!(response.data && response.data.pagination),
          paginationType: response.data && response.data.pagination ? typeof response.data.pagination : 'undefined'
        });
        
        const usersData = response.data && Array.isArray(response.data.users) ? response.data.users : [];
        const paginationData = response.data && response.data.pagination ? response.data.pagination : {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        };
        
        console.error('useUsers: Dados a serem definidos:', { usersData, paginationData });
        setUsers(usersData);
        setPagination(paginationData);
      } else if (isMountedRef.current) {
        console.error('Erro na resposta da API:', response);
        showToast('Erro ao carregar usuários', 'error');
        setUsers([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        });
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Erro ao buscar usuários:', error);
        showToast('Erro ao carregar usuários', 'error');
        setUsers([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [paginationLimit, showToast]);

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
    console.error('useUsers: createUser chamado com:', userData);
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
    console.error('useUsers: updateUser chamado com:', { id, userData });
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
    console.error('useUsers: deleteUser chamado com:', id);
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
    console.error('useUsers: updateProfile chamado com:', { id, profileData });
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
    console.error('useUsers: changePage chamado com:', newPage);
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  }, [fetchUsers, pagination.totalPages]);

  // Alterar limite por página
  const changeLimit = useCallback((newLimit) => {
    console.error('useUsers: changeLimit chamado com:', newLimit);
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchUsers(1);
  }, [fetchUsers]);

  // Log do estado atual
  useEffect(() => {
    console.error('useUsers: Estado atualizado:', { users, loading, pagination });
  }, [users, loading, pagination]);

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