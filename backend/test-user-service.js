import UserService from './src/services/userService.js';

const testUserService = async () => {
  try {
    console.log('Testando serviço de usuários...');
    
    const result = await UserService.getAllUsers(1, 10, '');
    
    console.log('Resultado do serviço:');
    console.log('- Success:', result.success);
    console.log('- Data:', result.data);
    
    if (result.data && result.data.users) {
      console.log('\nLista de usuários:');
      result.data.users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`);
      });
    }
  } catch (error) {
    console.error('Erro ao testar serviço de usuários:', error);
  }
};

testUserService();