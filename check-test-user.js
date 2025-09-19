import { query } from './backend/src/config/database.js';

const checkTestUser = async () => {
  try {
    console.log('Verificando usuário de teste...');
    
    const result = await query('SELECT * FROM tools.users WHERE username = $1', ['testuser']);
    
    if (result.rows.length > 0) {
      console.log('Usuário de teste encontrado:');
      console.log(result.rows[0]);
    } else {
      console.log('Usuário de teste não encontrado');
    }
  } catch (error) {
    console.error('Erro ao verificar usuário de teste:', error);
  }
};

checkTestUser();