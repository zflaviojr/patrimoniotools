import AuthService from './src/services/authService.js';
import PasswordPolicyService from './src/services/passwordPolicyService.js';
import LoginAttemptService from './src/services/loginAttemptService.js';
import AuditService from './src/services/auditService.js';
import User from './src/models/User.js';

async function testSecurityFeatures() {
  console.log('=== Teste de Funcionalidades de Segurança ===\n');
  
  try {
    // 1. Testar política de senhas
    console.log('1. Testando política de senhas...');
    const weakPassword = '123456';
    const strongPassword = 'SenhaForte123!';
    
    const weakValidation = PasswordPolicyService.validatePassword(weakPassword);
    const strongValidation = PasswordPolicyService.validatePassword(strongPassword);
    
    console.log('Senha fraca:', weakPassword);
    console.log('Válida:', weakValidation.isValid);
    console.log('Erros:', weakValidation.errors);
    
    console.log('\nSenha forte:', strongPassword);
    console.log('Válida:', strongValidation.isValid);
    console.log('Erros:', strongValidation.errors);
    
    // 2. Testar tentativas de login
    console.log('\n2. Testando tentativas de login...');
    const username = 'admin';
    const ip = '127.0.0.1';
    
    // Registrar algumas tentativas falhas
    for (let i = 0; i < 3; i++) {
      await LoginAttemptService.recordAttempt(username, ip, false);
      console.log(`Tentativa ${i + 1} registrada`);
    }
    
    // Verificar tentativas restantes
    const remaining = await LoginAttemptService.getRemainingAttempts(username, ip);
    console.log(`Tentativas restantes: ${remaining}`);
    
    // Verificar se está bloqueado
    const isLocked = await LoginAttemptService.isLocked(username, ip);
    console.log(`Conta bloqueada: ${isLocked}`);
    
    // 3. Testar histórico de senhas
    console.log('\n3. Testando histórico de senhas...');
    const userId = 1; // ID de usuário de teste
    
    // Adicionar senhas ao histórico
    await PasswordPolicyService.addToPasswordHistory(userId, 'Senha123!');
    await PasswordPolicyService.addToPasswordHistory(userId, 'Senha456@');
    
    // Verificar reutilização
    const isReused = await PasswordPolicyService.isPasswordReused(userId, 'Senha123!');
    console.log(`Senha reutilizada: ${isReused}`);
    
    // 4. Testar logs de auditoria
    console.log('\n4. Testando logs de auditoria...');
    await AuditService.logEvent(userId, 'TEST_EVENT', 'Teste de funcionalidade de segurança', ip);
    console.log('Evento de auditoria registrado');
    
    // Obter logs
    const logs = await AuditService.getLogs({ userId });
    console.log(`Logs encontrados: ${logs.length}`);
    
    console.log('\n=== Teste concluído com sucesso! ===');
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

// Executar teste se este arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testSecurityFeatures()
    .then(() => {
      console.log('\nTeste finalizado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erro ao executar teste:', error);
      process.exit(1);
    });
}

export default testSecurityFeatures;