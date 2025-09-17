const axios = require('axios');

// Testar bloqueio de conta após múltiplas tentativas falhas
async function testAccountLock() {
  console.log('Testando bloqueio de conta após múltiplas tentativas falhas...');
  
  // Tentar fazer login 5 vezes com credenciais inválidas
  for (let i = 1; i <= 5; i++) {
    try {
      console.log(`\nTentativa ${i}:`);
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username: 'testuser',
        password: 'senha_errada'
      });
      
      console.log('Resposta inesperada:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Mensagem:', error.response.data.message);
      } else {
        console.log('Erro:', error.message);
      }
    }
  }
  
  // Tentar fazer login com credenciais corretas após bloqueio
  try {
    console.log('\nTentando login com credenciais corretas após bloqueio:');
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'testuser',
      password: 'admin123'
    });
    
    console.log('Login bem-sucedido (não esperado):', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Mensagem:', error.response.data.message);
    } else {
      console.log('Erro:', error.message);
    }
  }
}

testAccountLock();