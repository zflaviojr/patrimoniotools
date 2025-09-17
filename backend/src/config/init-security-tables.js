import { query } from './database.js';

// Script para criar tabelas de segurança
const createSecurityTables = async () => {
  try {
    // Adicionar colunas à tabela de usuários
    console.log('Atualizando tabela de usuários...');
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password_last_changed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS password_expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '90 days'
    `);
    
    // Criar tabela de histórico de senhas
    console.log('Criando tabela de histórico de senhas...');
    await query(`
      CREATE TABLE IF NOT EXISTS password_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Criar índice para melhorar performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_password_history_user_id 
      ON password_history(user_id)
    `);
    
    // Criar tabela de tentativas de login
    console.log('Criando tabela de tentativas de login...');
    await query(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        success BOOLEAN NOT NULL,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        locked_until TIMESTAMP NULL
      )
    `);
    
    // Criar índices para melhorar performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_login_attempts_username 
      ON login_attempts(username)
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_login_attempts_ip 
      ON login_attempts(ip_address)
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_login_attempts_locked_until 
      ON login_attempts(locked_until) 
      WHERE locked_until IS NOT NULL
    `);
    
    // Criar tabela de logs de auditoria
    console.log('Criando tabela de logs de auditoria...');
    await query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Criar índices para melhorar performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id 
      ON audit_logs(user_id)
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action 
      ON audit_logs(action)
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
      ON audit_logs(created_at)
    `);
    
    console.log('Tabelas de segurança criadas/atualizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar/atualizar tabelas de segurança:', error);
    throw error;
  }
};

// Executar script se este arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createSecurityTables()
    .then(() => {
      console.log('Script concluído com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erro ao executar script:', error);
      process.exit(1);
    });
}

export default createSecurityTables;