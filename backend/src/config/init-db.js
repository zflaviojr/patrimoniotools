import { query } from './database.js';

// Script para criar tabelas do banco de dados
const createTables = async () => {
  try {
    console.log('Iniciando criação das tabelas...');

    // Criar tabela de responsáveis (já deve existir)
    await query(`
      CREATE TABLE IF NOT EXISTS public.tblresponsavel (
        id SERIAL PRIMARY KEY,
        matricula VARCHAR NOT NULL,
        permissao INTEGER NULL,
        nome VARCHAR NULL,
        CONSTRAINT uk_matricula UNIQUE (matricula)
      );
    `);

    // Criar tabela de usuários para autenticação
    await query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Inserir usuário padrão se não existir
    const existingUser = await query('SELECT id FROM users WHERE username = $1', ['admin']);
    
    if (existingUser.rows.length === 0) {
      // Hash da senha 'admin123' usando bcrypt
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('admin123', 10);
      
      await query(`
        INSERT INTO users (username, password, email, telefone) 
        VALUES ($1, $2, $3, $4)
      `, ['admin', hashedPassword, 'admin@sistema.com', '(83) 2101-1000']);
      
      console.log('Usuário admin criado com sucesso!');
      console.log('Login: admin | Senha: admin123');
    }

    console.log('Tabelas criadas com sucesso!');
    
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    throw error;
  }
};

// Verificar se o banco está funcionando
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time');
    console.log('Conexão com banco testada:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return false;
  }
};

export { createTables, testConnection };