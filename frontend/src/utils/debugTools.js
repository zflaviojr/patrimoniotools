/**
 * Ferramentas de debug para o sistema PatrimonioTools
 */

import axios from 'axios';

/**
 * Testa diretamente a comunicação com o backend, sem passar pelos serviços
 * @returns {Promise<Object>} Resultado do teste
 */
export const testBackendConnection = async () => {
  try {
    console.log('=== TESTE DE CONEXÃO COM BACKEND ===');
    
    // Verificar token
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    console.log('Token disponível:', !!token);
    console.log('Token length:', token?.length);
    console.log('Usuário logado:', user?.username);
    
    if (!token) {
      return { 
        success: false, 
        message: 'Nenhum token encontrado! Faça login novamente.'
      };
    }
    
    // Teste de health check (não requer autenticação)
    try {
      console.log('Testando health check...');
      const healthResponse = await axios.get('http://localhost:3001/health');
      console.log('Health check OK:', healthResponse.data);
    } catch (error) {
      console.error('Erro no health check:', error);
      return { 
        success: false, 
        message: 'Servidor backend não está respondendo. Verifique se o backend está rodando.'
      };
    }
    
    // Teste da API de usuários (requer autenticação)
    try {
      console.log('Testando API de usuários...');
      const usersResponse = await axios.get('http://localhost:3001/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta da API de usuários:', usersResponse.data);
      
      if (usersResponse.data && usersResponse.data.success === true) {
        return {
          success: true,
          message: `Teste bem-sucedido! ${usersResponse.data.data?.length || 0} usuários encontrados.`,
          data: usersResponse.data
        };
      } else {
        return {
          success: false,
          message: 'Resposta do servidor não está no formato esperado.',
          data: usersResponse.data
        };
      }
    } catch (error) {
      console.error('Erro ao acessar API de usuários:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Token expirado ou inválido. Faça login novamente.',
          error
        };
      } else if (error.response?.status === 403) {
        return {
          success: false,
          message: 'Você não tem permissão para acessar a lista de usuários. Apenas administradores podem acessar.',
          error
        };
      } else {
        return {
          success: false,
          message: `Erro ao acessar API: ${error.message}`,
          error
        };
      }
    }
  } catch (error) {
    console.error('Erro geral no teste:', error);
    return {
      success: false,
      message: `Erro geral: ${error.message}`,
      error
    };
  }
};