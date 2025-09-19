import { query } from './database.js';
import createSecurityTables from './init-security-tables.js';

// Função para testar conexão com o banco de dados
export const testConnection = async () => {
  try {
    await query('SELECT 1');
    console.log('✅ Conexão com banco de dados estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de dados:', error.message);
    return false;
  }
};

// Função para criar tabelas (mantendo a função existente como createTables)
export const createTables = async () => {
  try {
    console.log('Inicializando banco de dados...');
    
    // Criar schema tools
    console.log('Criando schema tools...');
    await query('CREATE SCHEMA IF NOT EXISTS tools');
    
    // Criar tabela de usuários no schema tools
    console.log('Criando tabela de usuários...');
    await query(`
      CREATE TABLE IF NOT EXISTS tools.users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        password_last_changed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        password_expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '90 days'
      )
    `);
    
    // Criar tabela de responsáveis (mantém no schema public)
    console.log('Criando tabela de responsáveis...');
    await query(`
      CREATE TABLE IF NOT EXISTS tblresponsavel (
        id SERIAL PRIMARY KEY,
        matricula VARCHAR NOT NULL,
        permissao INTEGER NULL,
        nome VARCHAR NULL,
        CONSTRAINT uk_matricula UNIQUE (matricula)
      )
    `);
    
    // Criar tabela de descrições (mantém no schema public)
    console.log('Criando tabela de descrições...');
    await query(`
      CREATE TABLE IF NOT EXISTS tbldescricao (
        id SERIAL PRIMARY KEY,
        descricao VARCHAR NOT NULL,
        subcontasiafi VARCHAR,
        vidautil INTEGER,
        codigo VARCHAR NOT NULL UNIQUE DEFAULT '',
        useradd VARCHAR,
        deletado INTEGER DEFAULT 0
      )
    `);
    
    // Criar generator/sequence para o campo codigo
    console.log('Criando sequence para códigos de descrição...');
    await query(`
      CREATE SEQUENCE IF NOT EXISTS seq_descricao_codigo
        START WITH 1000000000
        INCREMENT BY 1
        MINVALUE 1000000000
        MAXVALUE 9999999999
        CACHE 1
    `);
    
    // Criar função para gerar o próximo código
    console.log('Criando função para geração de códigos...');
    await query(`
      CREATE OR REPLACE FUNCTION generate_descricao_codigo()
      RETURNS VARCHAR AS $$
      BEGIN
        RETURN CAST(nextval('seq_descricao_codigo') AS VARCHAR);
      END;
      $$ LANGUAGE plpgsql
    `);
    
    // Criar trigger para preencher o código automaticamente antes de inserir
    console.log('Criando trigger para geração automática de códigos...');
    await query(`
      CREATE OR REPLACE FUNCTION fill_descricao_codigo()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL THEN
          NEW.codigo := generate_descricao_codigo();
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    // Remover trigger existente se houver e criar novo
    try {
      await query(`DROP TRIGGER IF EXISTS trg_fill_descricao_codigo ON tbldescricao`);
    } catch (error) {
      console.log('Nenhum trigger existente para remover');
    }
    
    await query(`
      CREATE TRIGGER trg_fill_descricao_codigo
        BEFORE INSERT ON tbldescricao
        FOR EACH ROW
        EXECUTE PROCEDURE fill_descricao_codigo()
    `);
    
    // Criar tabelas de segurança
    console.log('Criando tabelas de segurança...');
    await createSecurityTables();
    
    // Inserir usuário admin padrão (se não existir)
    console.log('Inserindo usuário admin padrão...');
    await query(`
      INSERT INTO tools.users (username, password, email, telefone) VALUES 
      ('admin', '$2b$10$Ep7SvSNUO05VS2g7BgFIzeBusJAzK2EZszTEbpzG.Qv15M7j5116u', 'admin@sistema.com', '(83) 2101-1000')
      ON CONFLICT (username) DO NOTHING
    `);
    
    // Inserir dados de teste para responsáveis
    console.log('Inserindo dados de teste para responsáveis...');
    await query(`
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
      ON CONFLICT (matricula) DO NOTHING
    `);
    
    // Inserir dados de teste para descrições
    console.log('Inserindo dados de teste para descrições...');
    await query(`
      INSERT INTO tbldescricao (descricao, subcontasiafi, vidautil, codigo, useradd, deletado) VALUES
      (upper('Barra Vertical e Horizontal com espelho'), '03.03', 5, '1000000331', 'ianna', 0),
      (upper('Computador Desktop'), '03.01', 5, '1000000332', 'admin', 0),
      (upper('Impressora Laser'), '03.02', 3, '1000000333', 'admin', 0)
      ON CONFLICT (codigo) DO NOTHING
    `);
    
    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

// Executar script se este arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const initDatabase = async () => {
    const connected = await testConnection();
    if (connected) {
      await createTables();
      console.log('Script concluído com sucesso!');
      process.exit(0);
    } else {
      console.error('Falha na conexão com o banco de dados');
      process.exit(1);
    }
  };
  
  initDatabase().catch((error) => {
    console.error('Erro ao executar script:', error);
    process.exit(1);
  });
}