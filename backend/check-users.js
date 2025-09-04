import { query } from './src/config/database.js';

const checkUsers = async () => {
  try {
    console.log('Verificando usuários no banco de dados...');
    
    const result = await query('SELECT * FROM users');
    
    console.log('Total de usuários encontrados:', result.rows.length);
    console.log('Usuários:');
    result.rows.forEach(user => {
      console.log('- ID:', user.id, '| Username:', user.username, '| Email:', user.email);
    });
    
    // Verificar se há usuários com username 'admin'
    const adminResult = await query('SELECT * FROM users WHERE username = $1', ['admin']);
    console.log('\nUsuário admin:');
    if (adminResult.rows.length > 0) {
      console.log('- Encontrado:', adminResult.rows[0]);
    } else {
      console.log('- Não encontrado');
    }
  } catch (error) {
    console.error('Erro ao verificar usuários:', error);
  }
};

checkUsers();