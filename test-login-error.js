const axios = require('axios');

// Testar login com credenciais inválidas
async function testLoginError() {
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
}

testLoginError();