import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

// Testar a verificação de senha
const testPasswordVerification = async () => {
  try {
    console.log('Testando verificação de senha...');
    
    // Dados fornecidos
    const password = 'admin123';
    const hashedPassword = '$2b$10$rOJl9Z8Q9ZQZQ9Z8Q9ZQZQ9Z8Q9ZQZQ9Z8Q9ZQZQ9Z8Q9ZQZQ9Z8Qu';
    
    console.log('Senha:', password);
    console.log('Hash armazenado:', hashedPassword);
    
    // Testar com bcrypt diretamente
    console.log('\n--- Testando com bcrypt diretamente ---');
    const directCompare = await bcrypt.compare(password, hashedPassword);
    console.log('Comparação direta com bcrypt:', directCompare);
    
    // Testar com o método do modelo User
    console.log('\n--- Testando com método do modelo User ---');
    const user = new User({
      id: 1,
      username: 'admin',
      password: hashedPassword,
      email: 'admin@sistema.com',
      telefone: '(83) 2101-1000'
    });
    
    const modelCompare = await user.verifyPassword(password);
    console.log('Comparação com método do modelo:', modelCompare);
    
    // Testar com um usuário real do banco
    console.log('\n--- Testando com usuário do banco ---');
    const dbUser = await User.findByUsername('admin');
    if (dbUser) {
      console.log('Usuário encontrado no banco:', dbUser.username);
      console.log('Senha do usuário:', dbUser.password);
      const dbCompare = await dbUser.verifyPassword(password);
      console.log('Comparação com usuário do banco:', dbCompare);
    } else {
      console.log('Usuário admin não encontrado no banco');
    }
    
  } catch (error) {
    console.error('Erro no teste:', error);
  }
};

// Executar o teste
testPasswordVerification();