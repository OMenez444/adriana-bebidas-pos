module.exports = {
  apps: [{
    name: 'adriana-bebidas-pos',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Configurações de segurança
    max_restarts: 10,
    min_uptime: '10s',
    // Configurações de rede
    listen_timeout: 8000,
    kill_timeout: 5000
  }],

  deploy: {
    production: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:seu-usuario/adriana-bebidas-pos.git',
      path: '/var/www/adriana-bebidas-pos',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
