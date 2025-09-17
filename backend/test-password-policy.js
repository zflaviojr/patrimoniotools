import PasswordPolicyService from './src/services/passwordPolicyService.js';

// Testar política de senhas
console.log('=== Teste de Política de Senhas ===\n');

const testPasswords = [
  '123456',           // Muito fraca
  'senha123',         // Fraca
  'Senha123',         // Moderada
  'Senha123!',        // Forte
  'MinhaSenhaForte123@' // Muito forte
];

testPasswords.forEach((password, index) => {
  console.log(`Teste ${index + 1}: "${password}"`);
  const result = PasswordPolicyService.validatePassword(password);
  console.log(`Válida: ${result.isValid}`);
  if (!result.isValid) {
    console.log(`Erros: ${result.errors.join(', ')}`);
  }
  console.log('---');
});

console.log('\n=== Teste concluído ===');