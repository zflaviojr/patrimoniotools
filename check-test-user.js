import { query } from './backend/src/config/database.js';

async function checkTestUser() {
  try {
    const result = await query('SELECT * FROM users WHERE username = $1', ['testuser']);
    console.log('Usuário testuser:', result.rows);
  } catch (error) {
    console.error('Erro ao verificar usuário testuser:', error);
  }
}

checkTestUser();