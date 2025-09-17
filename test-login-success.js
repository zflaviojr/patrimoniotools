const axios = require('axios');

// Testar login com credenciais válidas
async function testLoginSuccess() {
  try {
    console.log('Testando login com credenciais válidas...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'testuser',
      password: 'admin123'
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

testLoginSuccess();