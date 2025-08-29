import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const config = {
  // Configurações do servidor
  port: process.env.PORT || 3001,
  
  // Configurações do banco de dados
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'patrimonio',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
  },
  
  // Configurações JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: '24h'
  },
  
  // Configurações CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  },
  
  // Configurações de validação
  validation: {
    minPasswordLength: 6,
    maxNameLength: 255,
    maxMatriculaLength: 50
  }
};

// Validar configurações obrigatórias
const validateConfig = () => {
  const required = [
    'DB_PASSWORD',
    'JWT_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('AVISO: Variáveis de ambiente não definidas:', missing);
    console.warn('Por favor, configure o arquivo .env');
  }
};

validateConfig();

export default config;