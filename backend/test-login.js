import axios from 'axios';

// Testar login com credenciais inválidas
const testLogin = async () => {
  try {
    console.log('Testando login com credenciais inválidas...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin',
      password: 'senhaerrada'
    });
    
    console.log('Resposta de sucesso:', response.data);
  } catch (error) {
    console.log('Erro no login:');
    console.log('Status:', error.response?.status);
    console.log('Dados:', error.response?.data);
  }
  
  try {
    console.log('\nTestando login com usuário inexistente...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'usuarioinexistente',
      password: 'qualquersenha'
    });
    
    console.log('Resposta de sucesso:', response.data);
  } catch (error) {
    console.log('Erro no login:');
    console.log('Status:', error.response?.status);
    console.log('Dados:', error.response?.data);
  }
  
  try {
    console.log('\nTestando login com credenciais corretas...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login bem-sucedido!');
    console.log('Token:', response.data.data?.token);
  } catch (error) {
    console.log('Erro no login:');
    console.log('Status:', error.response?.status);
    console.log('Dados:', error.response?.data);
  }
};

testLogin();