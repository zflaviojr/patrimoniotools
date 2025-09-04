import { generateToken } from './backend/src/utils/jwt.js';
import config from './backend/src/config/environment.js';

console.log('JWT Secret:', config.jwt.secret);

// Gerar token para o usuário admin (id: 1)
const payload = {
  userId: 1,
  username: 'admin'
};

try {
  const token = generateToken(payload);
  console.log('Token gerado:', token);
} catch (error) {
  console.error('Erro ao gerar token:', error);
}