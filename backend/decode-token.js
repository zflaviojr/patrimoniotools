import { decodeToken } from './src/utils/jwt.js';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3NTY5OTI0MTEsImV4cCI6MTc1NzA3ODgxMX0.QaLgV-KRsI6aBUBTRFMmiK6Aolo8YdhmmtZ-VqOuilPE';

console.log('Decodificando token...');
const decoded = decodeToken(token);
console.log('Token decodificado:', decoded);