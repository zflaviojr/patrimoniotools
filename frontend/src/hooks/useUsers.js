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
      // Verificar se a resposta tem o formato esperado
      // A resposta pode estar aninhada em response.data ou ser direta
      const success = response && (response.success === true || (response.data && response.data.success === true));
      
      if (success) {
        showToast(response.message || response.data?.message || 'Usuário criado com sucesso!', 'success');
        await fetchUsers(pagination.page);
        return { success: true, data: response.data };
      } else {
        const errorMessage = response?.message || response?.data?.message || 'Erro ao criar usuário';
        showToast(errorMessage, 'error');
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar usuário';
      showToast(errorMessage, 'error');
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, showToast]);

  // Atualizar usuário
  const updateUser = useCallback(async (id, userData) => {
    console.error('=== INICIANDO UPDATE USER ===');
    console.error('useUsers: updateUser chamado com:', { id, userData });
    setLoading(true);
    try {
      const response = await UserService.updateUser(id, userData);
      console.error('useUsers: Resposta bruta do backend:', JSON.stringify(response, null, 2));
      
      // Verificar se a resposta tem o formato esperado
      // A resposta pode estar aninhada em response.data ou ser direta
      const success = response && (response.success === true || (response.data && response.data.success === true));
      
      if (success) {
        console.error('useUsers: SUCESSO - response.success é true');
        showToast(response.message || response.data?.message || 'Usuário atualizado com sucesso!', 'success');
        await fetchUsers(pagination.page);
        console.error('=== FINALIZANDO UPDATE USER COM SUCESSO ===');
        return response; // Retornar a resposta completa como no authService
      } else {
        // Se a resposta não tem success: true, tratar como erro
        console.error('useUsers: FALHA - response.success é false ou undefined');
        const errorMessage = response?.message || response?.data?.message || 'Erro ao atualizar usuário';
        showToast(errorMessage, 'error');
        console.error('=== FINALIZANDO UPDATE USER COM ERRO ===');
        return response; // Retornar a resposta completa mesmo em caso de erro
      }
    } catch (error) {
      console.error('=== ERRO NO UPDATE USER ===');
      console.error('Erro ao atualizar usuário:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao atualizar usuário';
      showToast(errorMessage, 'error');
      console.error('=== FINALIZANDO UPDATE USER COM EXCEPTION ===');
      // Retornar um objeto de erro padronizado
      return { 
        success: false, 
        message: errorMessage,
        error: error
      };
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, pagination.page, showToast]);

  // Excluir usuário
  const deleteUser = useCallback(async (id) => {
    console.error('=== INICIANDO DELETE USER ===');
    console.error('useUsers: deleteUser chamado com:', id);
    setLoading(true);
    try {
      const response = await UserService.deleteUser(id);
      console.error('useUsers: Resposta bruta do backend:', JSON.stringify(response, null, 2));
      
      // Verificar se a resposta tem o formato esperado
      // A resposta pode estar aninhada em response.data ou ser direta
      const success = response && (response.success === true || (response.data && response.data.success === true));
      
      if (success) {
        console.error('useUsers: SUCESSO - response.success é true');
        showToast(response.message || response.data?.message || 'Usuário excluído com sucesso', 'success');
        await fetchUsers(pagination.page);
        console.error('=== FINALIZANDO DELETE USER COM SUCESSO ===');
        return response; // Retornar a resposta completa como no authService
      } else {
        // Se a resposta não tem success: true, tratar como erro
        console.error('useUsers: FALHA - response.success é false ou undefined');
        const errorMessage = response?.message || response?.data?.message || 'Erro ao excluir usuário';
        showToast(errorMessage, 'error');
        console.error('=== FINALIZANDO DELETE USER COM ERRO ===');
        return response; // Retornar a resposta completa mesmo em caso de erro
      }
    } catch (error) {
      console.error('=== ERRO NO DELETE USER ===');
      console.error('Erro ao excluir usuário:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao excluir usuário';
      showToast(errorMessage, 'error');
      console.error('=== FINALIZANDO DELETE USER COM EXCEPTION ===');
      // Retornar um objeto de erro padronizado
      return { 
        success: false, 
        message: errorMessage,
        error: error
      };
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
      // Verificar se a resposta tem o formato esperado
      // A resposta pode estar aninhada em response.data ou ser direta
      const success = response && (response.success === true || (response.data && response.data.success === true));
      
      if (success) {
        showToast(response.message || response.data?.message || 'Perfil atualizado com sucesso', 'success');
        return { success: true, data: response.data };
      } else {
        const errorMessage = response?.message || response?.data?.message || 'Erro ao atualizar perfil';
        showToast(errorMessage, 'error');
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao atualizar perfil';
      showToast(errorMessage, 'error');
      return { success: false, message: errorMessage };
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