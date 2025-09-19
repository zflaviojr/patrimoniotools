import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const checkUsers = async () => {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'patrimonio',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('Conectado ao PostgreSQL');

    const result = await client.query('SELECT * FROM tools.users;');
    console.log('Usuários encontrados:', result.rows);
  } catch (err) {
    console.error('Erro ao conectar ou consultar:', err);
  } finally {
    await client.end();
  }
};

checkUsers();