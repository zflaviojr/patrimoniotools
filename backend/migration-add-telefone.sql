-- Script de migração para adicionar campo telefone na tabela users
-- Execute este script no PostgreSQL para adicionar o campo telefone

-- Adicionar campo telefone na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);

-- Atualizar usuário admin existente com telefone padrão
UPDATE users SET telefone = '(83) 2101-1000' WHERE username = 'admin' AND telefone IS NULL;

-- Verificar se a migração foi aplicada com sucesso
SELECT 'Migração aplicada com sucesso!' as status;
SELECT username, email, telefone FROM users;