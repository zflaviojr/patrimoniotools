#!/usr/bin/env node

// Script simples para testar a API
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testando API do backend...\n');
  
  try {
    // Teste 1: Health check
    console.log('1. Testando health check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    
    // Teste 2: Login
    console.log('\n2. Testando login...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Login realizado com sucesso');
      const token = loginData.data.token;
      
      // Teste 3: Listar responsáveis
      console.log('\n3. Testando listagem de responsáveis...');
      const responsaveisResponse = await fetch(`${API_BASE}/api/responsaveis`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const responsaveisData = await responsaveisResponse.json();
      
      if (responsaveisData.success) {
        console.log(`✅ ${responsaveisData.data.length} responsáveis encontrados`);
        
        // Teste 4: Criar responsável
        console.log('\n4. Testando criação de responsável...');
        const novoResponsavel = {
          nome: 'Teste Integração',
          matricula: 'TEST001',
          permissao: 5
        };
        
        const createResponse = await fetch(`${API_BASE}/api/responsaveis`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(novoResponsavel)
        });
        
        const createData = await createResponse.json();
        
        if (createData.success) {
          console.log('✅ Responsável criado com sucesso');
          
          // Teste 5: Buscar por matrícula
          console.log('\n5. Testando busca por matrícula...');
          const searchResponse = await fetch(`${API_BASE}/api/responsaveis/matricula/TEST001`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const searchData = await searchResponse.json();
          
          if (searchData.success) {
            console.log('✅ Busca por matrícula funcionando');
            
            // Teste 6: Excluir responsável de teste
            console.log('\n6. Limpando dados de teste...');
            const deleteResponse = await fetch(`${API_BASE}/api/responsaveis/${createData.data.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            const deleteData = await deleteResponse.json();
            
            if (deleteData.success) {
              console.log('✅ Responsável de teste removido');
            }
          } else {
            console.log('❌ Erro na busca:', searchData.message);
          }
        } else {
          console.log('❌ Erro na criação:', createData.message);
        }
      } else {
        console.log('❌ Erro na listagem:', responsaveisData.message);
      }
    } else {
      console.log('❌ Erro no login:', loginData.message);
    }
    
    console.log('\n🎉 Testes de integração concluídos!');
    
  } catch (error) {
    console.error('❌ Erro na comunicação com a API:', error.message);
    console.log('\n💡 Certifique-se de que o backend está rodando em http://localhost:3001');
  }
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testAPI();
}

export default testAPI;