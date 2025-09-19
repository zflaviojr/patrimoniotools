import { query } from './src/config/database.js';

const checkUsers = async () => {
  try {
    console.log('Verificando usuários no banco de dados...');
    
    // Listar todos os usuários
    const result = await query('SELECT * FROM tools.users');
    console.log(`Encontrados ${result.rows.length} usuários:`);
    console.log(result.rows);
    
    // Verificar usuário admin específico
    const adminResult = await query('SELECT * FROM tools.users WHERE username = $1', ['admin']);
    if (adminResult.rows.length > 0) {
      console.log('Usuário admin encontrado:');
      console.log(adminResult.rows[0]);
    } else {
      console.log('Usuário admin não encontrado');
    }
  } catch (error) {
    console.error('Erro ao verificar usuários:', error);
  }
};

checkUsers();