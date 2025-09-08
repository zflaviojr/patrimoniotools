import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import config from './config/environment.js';
import { createTables, testConnection } from './config/init-db.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Importar rotas
import authRoutes from './routes/auth.js';
import responsaveisRoutes from './routes/responsaveis.js';
import usersRoutes from './routes/users.js';
import descricoesRoutes from './routes/descricoes.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware básico
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/responsaveis', responsaveisRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/descricoes', descricoesRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API do Sistema de Gestão de Responsáveis',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      responsaveis: '/api/responsaveis',
      users: '/api/users',
      descricoes: '/api/descricoes',
      health: '/health'
    }
  });
});

// Middleware de tratamento de erros (deve vir depois das rotas)
app.use(notFoundHandler);
app.use(errorHandler);

// Função para inicializar o servidor
const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    
    // Testar conexão com banco
    console.log('📡 Testando conexão com banco de dados...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Falha na conexão com banco de dados');
      process.exit(1);
    }
    
    // Inicializar tabelas
    console.log('🗄️ Inicializando tabelas do banco...');
    await createTables();
    
    // Iniciar servidor
    const port = config.port;
    app.listen(port, () => {
      console.log('✅ Servidor iniciado com sucesso!');
      console.log(`🌐 URL: http://localhost:${port}`);
      console.log(`📋 Health Check: http://localhost:${port}/health`);
      console.log(`🔗 API: http://localhost:${port}/api`);
      console.log('📊 Endpoints disponíveis:');
      console.log('   - POST /api/auth/login');
      console.log('   - GET  /api/auth/validate');
      console.log('   - GET  /api/responsaveis');
      console.log('   - POST /api/responsaveis');
      console.log('   - PUT  /api/responsaveis/:id');
      console.log('   - DELETE /api/responsaveis/:id');
      console.log('   - GET  /api/responsaveis/matricula/:matricula');
      console.log('   - GET  /api/descricoes');
      console.log('   - POST /api/descricoes');
      console.log('   - PUT  /api/descricoes/:id');
      console.log('   - DELETE /api/descricoes/:id');
      console.log('   - GET  /api/descricoes/codigo/:codigo');
      console.log('   - GET  /api/users (admin only)');
      console.log('   - POST /api/users (admin only)');
      console.log('   - PUT  /api/users/:id (admin only)');
      console.log('   - DELETE /api/users/:id (admin only)');
      console.log('   - PUT  /api/users/profile/:id');
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de sinais do sistema
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM. Finalizando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT. Finalizando servidor...');
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('💥 Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚫 Promise rejeitada não tratada:', reason);
  process.exit(1);
});

// Iniciar servidor
startServer();

export default app;