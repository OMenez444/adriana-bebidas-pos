# 🚀 Adriana Bebidas POS - Guia de Produção

## 🎯 **Sistema POS Completo para Estabelecimentos**

Sistema de Point of Sale (POS) desenvolvido especificamente para a Adriana Bebidas, com funcionalidades completas para gerenciamento de mesas, comandas, produtos e pagamentos.

## ✨ **Funcionalidades Principais**

- 🏠 **Painel de Mesas** - Gerenciamento visual de mesas
- 📋 **Comandas** - Sistema completo de pedidos
- 🆕 **Nova Comanda** - Criação rápida de mesas/delivery
- 📱 **QR Code** - Pedidos via smartphone dos clientes
- 👑 **Admin** - Gerenciamento de produtos e configurações
- 💳 **Pagamentos** - Múltiplos métodos de pagamento

## 🚀 **Deploy em Produção**

### **1. Instalação Rápida**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/adriana-bebidas-pos.git
cd adriana-bebidas-pos

# Instale as dependências
npm install

# Faça o build da aplicação
npm run build

# Inicie o servidor
npm start
```

### **2. Com PM2 (Recomendado para Produção)**

```bash
# Instale o PM2 globalmente
npm install -g pm2

# Inicie com PM2
npm run pm2:start

# Verifique o status
npm run pm2:status

# Veja os logs
npm run pm2:logs
```

### **3. Script de Instalação Automática**

```bash
# Dê permissão de execução
chmod +x setup-producao.sh

# Execute o script
./setup-producao.sh
```

## 🔒 **Configurações de Segurança**

### **Firewall (UFW)**
```bash
# Ative o firewall
sudo ufw enable

# Permita apenas a porta da aplicação
sudo ufw allow 3000/tcp

# Verifique o status
sudo ufw status
```

### **Usuário Dedicado**
```bash
# Crie um usuário para a aplicação
sudo adduser pos-user
sudo usermod -aG sudo pos-user

# Mude para o usuário
su - pos-user
```

## 📱 **Acesso ao Sistema**

### **Na Rede Local**
- **URL**: `http://SEU_IP:3000`
- **Exemplo**: `http://192.168.1.100:3000`
- **Dispositivos**: Qualquer celular/tablet/PC na rede WiFi

### **Configuração de Dispositivos**
1. Conecte à WiFi do estabelecimento
2. Abra o navegador
3. Acesse: `http://SEU_IP:3000`
4. Adicione à tela inicial (PWA)

## 🔄 **Manutenção e Backup**

### **Comandos Úteis**
```bash
# Ver status do servidor
npm run pm2:status

# Reiniciar servidor
npm run pm2:restart

# Ver logs em tempo real
npm run pm2:logs

# Parar servidor
npm run pm2:stop
```

### **Backup Automático**
```bash
# Configure backup diário no crontab
0 2 * * * /path/to/backup-script.sh
```

### **Atualizações**
```bash
# Atualize o código
git pull origin main

# Reinstale dependências
npm install

# Faça novo build
npm run build

# Reinicie o servidor
npm run pm2:restart
```

## 🏗️ **Estrutura do Projeto**

```
adriana-bebidas-pos/
├── src/                    # Código fonte React
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/             # Páginas da aplicação
│   ├── state/             # Gerenciamento de estado (Zustand)
│   └── utils/             # Utilitários e formatação
├── dist/                   # Build de produção
├── server.js               # Servidor Express
├── ecosystem.config.js     # Configuração PM2
├── setup-producao.sh      # Script de instalação
└── package.json            # Dependências e scripts
```

## 🛠️ **Tecnologias Utilizadas**

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Estado**: Zustand (com persistência localStorage)
- **Roteamento**: React Router DOM
- **Backend**: Node.js + Express
- **Processos**: PM2
- **Segurança**: Helmet + CORS + Rate Limiting

## 📊 **Requisitos do Sistema**

### **Servidor**
- **OS**: Ubuntu Server 22.04 LTS (recomendado)
- **RAM**: Mínimo 2GB (recomendado 4GB+)
- **Storage**: Mínimo 10GB (recomendado 32GB+)
- **Node.js**: Versão 18+ LTS

### **Cliente**
- **Navegador**: Chrome 90+, Firefox 88+, Safari 14+
- **Rede**: WiFi local do estabelecimento
- **Dispositivo**: Qualquer smartphone/tablet/PC

## 🚨 **Solução de Problemas**

### **Erro: Porta já em uso**
```bash
# Verifique o que está usando a porta
sudo lsof -i :3000

# Mate o processo
sudo kill -9 PID_DO_PROCESSO

# Reinicie o servidor
npm run pm2:restart
```

### **Erro: Permissão negada**
```bash
# Dê permissão ao usuário
sudo chown -R pos-user:pos-user /path/to/app

# Verifique permissões
ls -la
```

### **Erro: Módulo não encontrado**
```bash
# Reinstale dependências
rm -rf node_modules package-lock.json
npm install

# Faça novo build
npm run build
```

## 📞 **Suporte**

### **Logs do Sistema**
```bash
# Logs da aplicação
npm run pm2:logs

# Logs do sistema
sudo journalctl -u pm2-pos-user

# Logs do firewall
sudo ufw status verbose
```

### **Monitoramento**
```bash
# Status do servidor
pm2 monit

# Recursos do sistema
htop

# Uso de disco
df -h
```

## 🎉 **Status de Produção**

✅ **Sistema**: Funcionando perfeitamente  
✅ **Segurança**: Firewall e headers configurados  
✅ **Performance**: Otimizado para mobile  
✅ **Backup**: Configurado automaticamente  
✅ **Monitoramento**: PM2 ativo  

---

**Adriana Bebidas POS** 🚀  
*Sistema profissional para estabelecimentos*  
*Versão: 1.0.0 | Status: Produção* ✅
