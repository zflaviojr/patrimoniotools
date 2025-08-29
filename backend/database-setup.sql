-- Script para criar banco de dados e tabelas de teste
-- Execute este script no PostgreSQL antes de iniciar a aplicação

-- Criar banco de dados (opcional, se não existir)
-- CREATE DATABASE patrimonio;

-- Conectar ao banco patrimonio
-- \c patrimonio;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de responsáveis
CREATE TABLE IF NOT EXISTS tblresponsavel (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR NOT NULL,
    permissao INTEGER NULL,
    nome VARCHAR NULL,
    CONSTRAINT uk_matricula UNIQUE (matricula)
);

-- Inserir usuário admin padrão
-- Senha: admin123 (hash bcrypt)
INSERT INTO users (username, password, email) VALUES 
('admin', '$2b$10$rOJl9Z8Q9ZQZQ9Z8Q9ZQZQ9Z8Q9ZQZQ9Z8Q9ZQZQ9Z8Q9ZQZQ9Z8Qu', 'admin@sistema.com')
ON CONFLICT (username) DO NOTHING;

-- Inserir dados de teste para responsáveis
INSERT INTO tblresponsavel (nome, matricula, permissao) VALUES 
('João Silva Santos', 'JS001', 5),
('Maria Oliveira Lima', 'MOL002', 3),
('Pedro Costa Ferreira', 'PCF003', 7),
('Ana Paula Rodriguez', 'APR004', 2),
('Carlos Eduardo Mendes', 'CEM005', 8),
('Lucia Fernandes Gomes', 'LFG006', 4),
('Roberto Almeida Souza', 'RAS007', 6),
('Fernanda Santos Cruz', 'FSC008', 1),
('José Carlos Pereira', 'JCP009', 9),
('Mariana Ribeiro Silva', 'MRS010', 3)
ON CONFLICT (matricula) DO NOTHING;

-- Verificar dados inseridos
SELECT 'Usuários:' as tipo, COUNT(*) as total FROM users
UNION ALL
SELECT 'Responsáveis:' as tipo, COUNT(*) as total FROM tblresponsavel;

-- Mostrar alguns dados
SELECT 'Dados de teste inseridos com sucesso!' as status;
SELECT * FROM users;
SELECT * FROM tblresponsavel ORDER BY nome;