import User from './src/models/User.js';

const testPagination = async () => {
  try {
    console.log('Testando paginação de usuários...');
    
    const result = await User.findAllWithPagination(1, 10, '');
    
    console.log('Resultado da paginação:');
    console.log('- Usuários encontrados:', result.users.length);
    console.log('- Paginação:', result.pagination);
    
    console.log('\nLista de usuários:');
    result.users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`);
    });
  } catch (error) {
    console.error('Erro ao testar paginação:', error);
  }
};

testPagination();