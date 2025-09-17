import bcrypt from 'bcryptjs';

// Gerar hash para a senha admin123
const generateHash = async () => {
  try {
    const password = 'admin123';
    console.log('Gerando hash para a senha:', password);
    
    // Gerar hash com salt rounds = 10
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('Hash gerado:', hashedPassword);
    
    // Testar a verificação
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Verificação com a senha original:', isValid);
    
  } catch (error) {
    console.error('Erro ao gerar hash:', error);
  }
};

generateHash();