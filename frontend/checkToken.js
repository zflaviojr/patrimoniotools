// Script para verificar se o token está sendo armazenado corretamente
console.log('Verificando token no localStorage...');
const token = localStorage.getItem('token');
console.log('Token encontrado:', token);

// Verificar se há usuários no localStorage
const users = localStorage.getItem('users');
console.log('Usuários no localStorage:', users);

// Verificar headers da API
console.log('API Base URL:', import.meta.env.VITE_API_URL);