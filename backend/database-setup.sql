-- Script para criar banco de dados e tabelas de teste
-- Execute este script no PostgreSQL antes de iniciar a aplicação

-- Criar banco de dados (opcional, se não existir)
-- CREATE DATABASE patrimonio;

-- Conectar ao banco patrimonio
-- \c patrimonio;

-- Criar schema tools
CREATE SCHEMA IF NOT EXISTS tools;

-- Criar tabela de usuários no schema tools
CREATE TABLE IF NOT EXISTS tools.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de responsáveis (mantém no schema public)
CREATE TABLE IF NOT EXISTS tblresponsavel (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR NOT NULL,
    permissao INTEGER NULL,
    nome VARCHAR NULL,
    CONSTRAINT uk_matricula UNIQUE (matricula)
);

-- Criar tabela de descrições (mantém no schema public)
CREATE TABLE IF NOT EXISTS tbldescricao (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR NOT NULL,
    subcontasiafi VARCHAR,
    vidautil INTEGER,
    codigo VARCHAR NOT NULL UNIQUE DEFAULT '',
    useradd VARCHAR,
    deletado INTEGER DEFAULT 0
);

-- Criar generator/sequence para o campo codigo
CREATE SEQUENCE IF NOT EXISTS seq_descricao_codigo
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;

-- Função para gerar o próximo código
CREATE OR REPLACE FUNCTION generate_descricao_codigo()
RETURNS VARCHAR AS $$
BEGIN
    RETURN CAST(nextval('seq_descricao_codigo') AS VARCHAR);
END;
$$ LANGUAGE plpgsql;

-- Trigger para preencher o código automaticamente antes de inserir
CREATE OR REPLACE FUNCTION fill_descricao_codigo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.codigo IS NULL OR NEW.codigo = '' THEN
        NEW.codigo = generate_descricao_codigo();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_fill_descricao_codigo
    BEFORE INSERT ON tbldescricao
    FOR EACH ROW
    EXECUTE FUNCTION fill_descricao_codigo();

-- Inserir usuário admin padrão
-- Senha: admin123 (hash bcrypt)
INSERT INTO tools.users (username, password, email, telefone) VALUES 
('admin', '$2b$10$Ep7SvSNUO05VS2g7BgFIzeBusJAzK2EZszTEbpzG.Qv15M7j5116u', 'admin@sistema.com', '(83) 2101-1000')
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

-- Inserir dados de teste para descrições
INSERT INTO tbldescricao (descricao, subcontasiafi, vidautil, codigo, useradd, deletado) VALUES
(upper('Barra Vertical e Horizontal com espelho'), '03.03', 5, '1000000331', 'ianna', 0),
(upper('Computador Desktop'), '03.01', 5, '1000000332', 'admin', 0),
(upper('Impressora Laser'), '03.02', 3, '1000000333', 'admin', 0)
ON CONFLICT (codigo) DO NOTHING;

-- Verificar dados inseridos
SELECT 'Usuários:' as tipo, COUNT(*) as total FROM tools.users
UNION ALL
SELECT 'Responsáveis:' as tipo, COUNT(*) as total FROM tblresponsavel
UNION ALL
SELECT 'Descrições:' as tipo, COUNT(*) as total FROM tbldescricao;

-- Mostrar alguns dados
SELECT 'Dados de teste inseridos com sucesso!' as status;
SELECT * FROM tools.users;
SELECT * FROM tblresponsavel ORDER BY nome;
SELECT * FROM tbldescricao ORDER BY descricao;