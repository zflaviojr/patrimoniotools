import UserController from './src/controllers/userController.js';

// Simular objeto de requisição
const mockReq = {
  query: {
    page: '1',
    limit: '10',
    search: ''
  }
};

// Simular objeto de resposta
const mockRes = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    this.data = data;
    console.log(`Status: ${this.statusCode}`);
    console.log('Dados retornados:');
    console.log(JSON.stringify(data, null, 2));
    return this;
  }
};

// Simular função next
const mockNext = function(error) {
  console.error('Erro no next:', error);
};

const testUserController = async () => {
  try {
    console.log('Testando controller de usuários...');
    
    await UserController.getAllUsers(mockReq, mockRes, mockNext);
    
    console.log('\nTeste concluído.');
  } catch (error) {
    console.error('Erro ao testar controller de usuários:', error);
  }
};

testUserController();