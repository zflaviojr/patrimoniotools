-- Script de migração para mover tabelas para o schema 'tools'
-- Execute este script no PostgreSQL para mover tabelas existentes

-- Criar schema tools se não existir
CREATE SCHEMA IF NOT EXISTS tools;

-- Mover tabelas para o schema tools (exceto tblresponsavel e tbldescricao)
ALTER TABLE IF EXISTS users SET SCHEMA tools;
ALTER TABLE IF EXISTS password_history SET SCHEMA tools;
ALTER TABLE IF EXISTS login_attempts SET SCHEMA tools;
ALTER TABLE IF EXISTS audit_logs SET SCHEMA tools;

-- Verificar se as tabelas foram movidas corretamente
SELECT 'Tabelas movidas para o schema tools com sucesso!' as status;

-- Listar tabelas no schema tools
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema = 'tools'
ORDER BY table_name;

-- Listar tabelas no schema public (deve incluir tblresponsavel e tbldescricao)
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('tblresponsavel', 'tbldescricao')
ORDER BY table_name;