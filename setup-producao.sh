#!/bin/bash

echo "🚀 Configurando Adriana Bebidas POS para Produção"
echo "=================================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Instalando..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js já está instalado: $(node --version)"
fi

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    sudo npm install -g pm2
else
    echo "✅ PM2 já está instalado: $(pm2 --version)"
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar pasta de logs
echo "📁 Criando pasta de logs..."
mkdir -p logs

# Build da aplicação
echo "🔨 Fazendo build da aplicação..."
npm run build

# Instalar dependências de produção
echo "📦 Instalando dependências de produção..."
npm install express cors helmet express-rate-limit

# Configurar firewall (Ubuntu/Debian)
echo "🔥 Configurando firewall..."
sudo ufw allow 3000/tcp
sudo ufw enable

# Configurar PM2 para iniciar com o sistema
echo "⚙️ Configurando PM2 para iniciar com o sistema..."
pm2 startup
pm2 start ecosystem.config.js --env production
pm2 save

echo ""
echo "🎉 Configuração concluída com sucesso!"
echo ""
echo "📱 Para acessar o sistema:"
echo "   Local: http://localhost:3000"
echo "   Rede: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "🔧 Comandos úteis:"
echo "   pm2 status                    - Ver status do servidor"
echo "   pm2 logs                      - Ver logs em tempo real"
echo "   pm2 restart adriana-bebidas-pos - Reiniciar servidor"
echo "   pm2 stop adriana-bebidas-pos   - Parar servidor"
echo ""
echo "🔒 O sistema está rodando com segurança máxima!"
echo "   - Rate limiting ativo"
echo "   - Headers de segurança configurados"
echo "   - CORS restrito à rede local"
echo "   - Firewall configurado"
