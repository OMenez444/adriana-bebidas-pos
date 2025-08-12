const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Rate limiting para prevenir ataques
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use(limiter);

// CORS configurado para segurança
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:3000', 'http://192.168.1.100:3000'] // IPs permitidos
    : true,
  credentials: true
}));

// Servir arquivos estáticos da pasta dist
app.use(express.static(path.join(__dirname, 'dist')));

// Rota para todas as páginas (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// Middleware 404
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Adriana Bebidas POS rodando em:`);
  console.log(`   📱 Local: http://localhost:${PORT}`);
  console.log(`   🌐 Rede: http://192.168.1.100:${PORT} (ajuste o IP)`);
  console.log(`   🔒 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   📊 Porta: ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Servidor sendo encerrado...');
  app.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
});
