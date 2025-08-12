const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const isVercel = process.env.VERCEL === '1';

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
    },
  },
}));

// Rate limiting mais permissivo para uso público
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isVercel ? 200 : 100, // 200 requests para Vercel, 100 para local
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use(limiter);

// CORS configurado para permitir acesso público
app.use(cors({
  origin: isVercel 
    ? true // Permite qualquer origem no Vercel
    : ['http://localhost:3000', 'http://192.168.1.100:3000'], // Restrito localmente
  credentials: true
}));

// Middleware para detectar ambiente
app.use((req, res, next) => {
  req.isPublic = isVercel;
  next();
});

// Rota de status para verificar ambiente
app.get('/api/status', (req, res) => {
  res.json({
    environment: isVercel ? 'public' : 'local',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Servir arquivos estáticos da pasta dist
app.use(express.static(path.join(__dirname, 'dist')));

// Rota para todas as páginas (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo deu errado!',
    environment: isVercel ? 'public' : 'local',
    timestamp: new Date().toISOString()
  });
});

// Middleware 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Página não encontrada',
    environment: isVercel ? 'public' : 'local',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor apenas se não estiver no Vercel
if (!isVercel) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Adriana Bebidas POS rodando em:`);
    console.log(`   📱 Local: http://localhost:${PORT}`);
    console.log(`   🌐 Rede: http://192.168.1.100:${PORT} (ajuste o IP)`);
    console.log(`   🔒 Modo: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   📊 Porta: ${PORT}`);
    console.log(`   🌍 Ambiente: Local`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🔄 Servidor sendo encerrado...');
    app.close(() => {
      console.log('✅ Servidor encerrado com sucesso');
      process.exit(0);
    });
  });
}

// Exportar para Vercel
module.exports = app;
