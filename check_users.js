const { Client } = require('pg');

// Configurações do banco de dados
const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'patrimonio',
  user: 'postgres',
  password: '160298',
});

async function checkUsers() {
  try {
    // Conectar ao banco de dados
    await client.connect();
    console.log('Conectado ao banco de dados com sucesso!');
    
    // Consultar usuários
    const result = await client.query('SELECT * FROM users;');
    console.log('Usuários encontrados:', result.rows);
    console.log('Total de usuários:', result.rows.length);
    
    // Fechar conexão
    await client.end();
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

checkUsers();