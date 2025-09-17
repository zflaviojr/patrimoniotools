const axios = require('axios');

// Testar login com credenciais inválidas
async function testLogin() {
  try {
    console.log('Testando login com credenciais inválidas...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'usuario_invalido',
      password: 'senha_invalida'
    });
    
    console.log('Resposta inesperada:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados da resposta:', error.response.data);
    } else {
      console.log('Erro:', error.message);
    }
  }
  
  try {
    console.log('\nTestando login com credenciais válidas...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin',
      password: 'admin123' // Senha incorreta
    });
    
    console.log('Resposta inesperada:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados da resposta:', error.response.data);
    } else {
      console.log('Erro:', error.message);
    }
  }
  
  try {
    console.log('\nTestando login com credenciais corretas...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin',
      password: 'admin' // Senha correta
    });
    
    console.log('Login bem-sucedido!');
    console.log('Token:', response.data.data.token);
  } catch (error) {
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados da resposta:', error.response.data);
    } else {
      console.log('Erro:', error.message);
    }
  }
}

testLogin();