import Descricao from './src/models/Descricao.js';
import { createTables } from './src/config/init-db.js';

async function testDescricao() {
  try {
    console.log('🔍 Testando funcionalidades da entidade Descrição...');
    
    // Inicializar tabelas
    await createTables();
    console.log('✅ Tabelas inicializadas');
    
    // Testar criação de descrição
    console.log('\n📝 Testando criação de descrição...');
    const descricao1 = await Descricao.create({
      descricao: 'Computador Desktop',
      subcontasiafi: '03.01',
      vidautil: 5,
      useradd: 'admin'
    });
    console.log('✅ Descrição criada:', descricao1);
    
    // Testar criação de outra descrição
    console.log('\n📝 Testando criação de outra descrição...');
    const descricao2 = await Descricao.create({
      descricao: 'Impressora Laser',
      subcontasiafi: '03.02',
      vidautil: 3,
      useradd: 'admin'
    });
    console.log('✅ Descrição criada:', descricao2);
    
    // Testar listagem de todas as descrições
    console.log('\n📋 Testando listagem de descrições...');
    const todasDescricoes = await Descricao.findAll();
    console.log('✅ Total de descrições:', todasDescricoes.length);
    todasDescricoes.forEach(desc => {
      console.log(`   - ${desc.codigo}: ${desc.descricao}`);
    });
    
    // Testar busca por ID
    console.log('\n🔍 Testando busca por ID...');
    const descricaoPorId = await Descricao.findById(descricao1.id);
    console.log('✅ Descrição encontrada por ID:', descricaoPorId.descricao);
    
    // Testar busca por código
    console.log('\n🔍 Testando busca por código...');
    const descricaoPorCodigo = await Descricao.findByCodigo(descricao1.codigo);
    console.log('✅ Descrição encontrada por código:', descricaoPorCodigo.descricao);
    
    // Testar atualização
    console.log('\n✏️ Testando atualização de descrição...');
    const descricaoAtualizada = await descricao1.update({
      descricao: 'Computador Desktop Intel i7',
      subcontasiafi: '03.01',
      vidautil: 6,
      useradd: 'admin'
    });
    console.log('✅ Descrição atualizada:', descricaoAtualizada.descricao);
    
    // Testar busca por termo
    console.log('\n🔍 Testando busca por termo...');
    const descricoesPorTermo = await Descricao.findByDescricao('computador');
    console.log('✅ Descrições encontradas por termo:', descricoesPorTermo.length);
    
    // Testar contagem
    console.log('\n📊 Testando contagem de descrições...');
    const totalDescricoes = await Descricao.count();
    console.log('✅ Total de descrições ativas:', totalDescricoes);
    
    // Testar paginação
    console.log('\n📄 Testando paginação...');
    const descricoesPaginadas = await Descricao.findWithPagination(1, 5, '');
    console.log('✅ Descrições paginadas:', descricoesPaginadas.descricoes.length);
    console.log('   Página:', descricoesPaginadas.pagination.page);
    console.log('   Total de páginas:', descricoesPaginadas.pagination.totalPages);
    
    // Testar exclusão (soft delete)
    console.log('\n🗑️ Testando exclusão de descrição...');
    const descricaoExcluida = await descricao2.delete();
    console.log('✅ Descrição excluída (soft delete):', descricaoExcluida);
    
    // Verificar que a descrição excluída não aparece na listagem
    const descricoesAposExclusao = await Descricao.findAll();
    console.log('✅ Total de descrições após exclusão:', descricoesAposExclusao.length);
    
    console.log('\n🎉 Todos os testes da entidade Descrição passaram com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
    process.exit(1);
  }
}

// Executar testes
testDescricao();