import { generateToken, verifyToken } from './src/utils/jwt.js';

console.log('Testando geração e verificação de token...');

// Gerar um novo token
const payload = { userId: 1, username: 'admin' };
const token = generateToken(payload);
console.log('Token gerado:', token);

// Verificar o token gerado
try {
  const verified = verifyToken(token);
  console.log('Token verificado:', verified);
} catch (error) {
  console.error('Erro ao verificar token gerado:', error.message);
}

// Tentar verificar o token antigo novamente
const oldToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3NTY5OTI0MTEsImV4cCI6MTc1NzA3ODgxMX0.QaLgV-KRsI6aBUBTRFMmiK6Aolo8YdhmmtZ-VqOuilPE';
console.log('\nTentando verificar token antigo:');
try {
  const verified = verifyToken(oldToken);
  console.log('Token antigo verificado:', verified);
} catch (error) {
  console.error('Erro ao verificar token antigo:', error.message);
}