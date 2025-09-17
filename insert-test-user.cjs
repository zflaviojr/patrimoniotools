const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'patrimonio',
  user: 'postgres',
  password: '160298'
});

const password = bcrypt.hashSync('admin123', 10);

pool.query(
  "INSERT INTO users (username, password, email, telefone) VALUES ('testuser', $1, 'testuser@example.com', '(11) 99999-9999') ON CONFLICT (username) DO UPDATE SET password = $1, email = 'testuser@example.com', telefone = '(11) 99999-9999'",
  [password]
)
.then(() => console.log('Usuário testuser criado/atualizado com sucesso'))
.catch(console.error)
.finally(() => pool.end());