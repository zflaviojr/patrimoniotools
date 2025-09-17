-- Script para adicionar tabelas e campos de segurança ao banco de dados existente
-- Execute este script no PostgreSQL para implementar a política de segurança

-- Adicionar campos de política de senhas à tabela de usuários
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_last_changed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS password_expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '90 days';

-- Criar tabela de histórico de senhas
CREATE TABLE IF NOT EXISTS password_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índice para melhorar performance na busca por histórico de senhas
CREATE INDEX IF NOT EXISTS idx_password_history_user_id 
ON password_history(user_id);

-- Criar tabela de tentativas de login
CREATE TABLE IF NOT EXISTS login_attempts (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  success BOOLEAN NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  locked_until TIMESTAMP NULL
);

-- Criar índices para melhorar performance nas buscas de tentativas de login
CREATE INDEX IF NOT EXISTS idx_login_attempts_username 
ON login_attempts(username);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip 
ON login_attempts(ip_address);

CREATE INDEX IF NOT EXISTS idx_login_attempts_locked_until 
ON login_attempts(locked_until) 
WHERE locked_until IS NOT NULL;

-- Criar tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhorar performance nas buscas de logs de auditoria
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id 
ON audit_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action 
ON audit_logs(action);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
ON audit_logs(created_at);

-- Atualizar usuários existentes para definir datas de senha
UPDATE users 
SET password_last_changed = created_at, 
    password_expires_at = created_at + INTERVAL '90 days'
WHERE password_last_changed IS NULL;

-- Verificar estrutura das tabelas criadas
SELECT 'Tabelas de segurança criadas/atualizadas com sucesso!' as status;

-- Mostrar informações sobre as tabelas criadas
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('users', 'password_history', 'login_attempts', 'audit_logs')
AND column_name IN ('password_last_changed', 'password_expires_at', 'user_id', 'password_hash', 'username', 'ip_address', 'success', 'attempted_at', 'locked_until', 'action', 'details')
ORDER BY table_name, ordinal_position;