// Script para testar a API de usuários
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Fazer login para obter o token
const login = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login response:', response.data);
    return response.data.data.token;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    return null;
  }
};

// Buscar usuários
const fetchUsers = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Users response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch users error:', error.response?.data || error.message);
    return null;
  }
};

// Executar os testes
const runTests = async () => {
  console.log('Iniciando testes da API...');
  
  // Login
  const token = await login();
  if (!token) {
    console.log('Falha no login, encerrando testes.');
    return;
  }
  
  console.log('Token obtido:', token);
  
  // Buscar usuários
  const usersResponse = await fetchUsers(token);
  if (!usersResponse) {
    console.log('Falha ao buscar usuários, encerrando testes.');
    return;
  }
  
  console.log('Testes concluídos com sucesso!');
};

runTests();