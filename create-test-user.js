const { query } = require('./backend/src/config/database.js');

async function createTestUser() {
  try {
    const result = await query(
      `INSERT INTO users (username, password, email, telefone) 
       VALUES ('testuser', '$2b$10$Ep7SvSNUO05VS2g7BgFIzeBusJAzK2EZszTEbpzG.Qv15M7j5116u', 'testuser@example.com', '(11) 99999-9999') 
       ON CONFLICT (username) 
       DO UPDATE SET 
         password = '$2b$10$Ep7SvSNUO05VS2g7BgFIzeBusJAzK2EZszTEbpzG.Qv15M7j5116u', 
         email = 'testuser@example.com', 
         telefone = '(11) 99999-9999'`
    );
    
    console.log('Usuário testuser criado/atualizado com sucesso');
    console.log('Resultado:', result);
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
  }
}

createTestUser();