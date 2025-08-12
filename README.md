# 🚀 Adriana Bebidas POS - Sistema de Point of Sale Completo

## 🎯 **Visão Geral**

Sistema de Point of Sale (POS) desenvolvido especificamente para a **Adriana Bebidas**, com funcionalidades completas para gerenciamento de mesas, comandas, produtos e pagamentos. O sistema oferece **hospedagem híbrida** - funcionando tanto localmente quanto publicamente na internet.

## ✨ **Funcionalidades Principais**

### 🏠 **Gestão de Mesas**
- **Painel visual** com status das mesas (Livre, Ocupada, Paga)
- **QR Code único** para cada mesa
- **Pedidos online** via smartphone dos clientes
- **Sincronização em tempo real**

### 📋 **Sistema de Comandas**
- **Criação rápida** de mesas e delivery
- **Gestão de pedidos** com adição/remoção de itens
- **Múltiplos métodos** de pagamento
- **Histórico completo** de transações

### 📱 **Pedidos Online (QR Code)**
- **Cardápio digital** com imagens dos produtos
- **Carrinho de compras** intuitivo
- **Valor total** atualizado em tempo real
- **Acesso via dados móveis** ou WiFi

### 👑 **Painel Administrativo**
- **Configurações** da loja (nome, PIN admin)
- **Gestão de produtos** com imagens
- **Editor de imagens** integrado
- **Backup automático** dos dados

### 💳 **Sistema de Pagamentos**
- **Múltiplos métodos** (Dinheiro, Cartão, PIX)
- **Cálculo automático** de troco
- **Descontos** configuráveis
- **Fechamento automático** de comandas

## 🏗️ **Arquitetura Técnica**

### **Frontend**
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** + **Radix UI**
- **Zustand** para gerenciamento de estado
- **React Router DOM** para navegação

### **Backend**
- **Node.js** + **Express.js**
- **PM2** para gerenciamento de processos
- **Helmet** + **CORS** + **Rate Limiting** para segurança
- **Suporte a Vercel** para deploy público

### **Banco de Dados**
- **LocalStorage** para persistência local
- **Estrutura otimizada** para performance
- **Backup automático** via Git

## 🌐 **Hospedagem Híbrida**

### **🏠 Ambiente Local (Estabelecimento)**
- **Servidor próprio** (Raspberry Pi 4 recomendado)
- **Dados 100% seguros** na rede local
- **Funciona offline** sem dependência de internet
- **Controle total** sobre o sistema

### **🌍 Ambiente Público (Internet)**
- **Vercel gratuito** para backup e acesso externo
- **QR Code sempre funcional** via dados móveis
- **SSL automático** e CDN global
- **Deploy automático** via GitHub

## 🚀 **Instalação e Deploy**

### **1. Instalação Local (Recomendado)**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/adriana-bebidas-pos.git
cd adriana-bebidas-pos

# Instale as dependências
npm install

# Faça o build
npm run build

# Execute o script de instalação
chmod +x setup-producao.sh
./setup-producao.sh
```

### **2. Deploy Público (Vercel)**

```bash
# Instale o Vercel CLI
npm install -g vercel

# Faça login
vercel login

# Deploy automático
npm run deploy:vercel
```

### **3. Script de Atualização GitHub**

```bash
# Execute o script PowerShell
.\atualizar-github.ps1
```

## 📱 **Como Funciona o QR Code**

### **Para o Cliente:**
1. **Escaneia** o QR Code da mesa
2. **Acessa** o cardápio digital
3. **Seleciona** produtos desejados
4. **Faz o pedido** diretamente
5. **Acompanha** o status em tempo real

### **Para o Estabelecimento:**
1. **Recebe notificação** de novo pedido
2. **Processa** o pedido na comanda
3. **Prepara** os itens solicitados
4. **Finaliza** com pagamento
5. **Fecha** a mesa automaticamente

## 🔒 **Segurança e Confiabilidade**

### **Segurança Local:**
- ✅ **Firewall configurado** (UFW)
- ✅ **CORS restrito** à rede local
- ✅ **Rate limiting** para prevenir ataques
- ✅ **Dados criptografados** no localStorage

### **Segurança Pública:**
- ✅ **HTTPS automático** (Vercel)
- ✅ **Headers de segurança** (Helmet)
- ✅ **Rate limiting** adaptativo
- ✅ **Validação de dados** robusta

## 💰 **Custos e Economia**

### **Hospedagem Local:**
- **Hardware**: R$ 300-800 (investimento único)
- **Energia**: R$ 15-30/mês
- **Manutenção**: R$ 50-100/ano
- **Total/ano**: R$ 200-400

### **Hospedagem Pública:**
- **Vercel**: R$ 0/mês (gratuito)
- **Domínio**: R$ 30-40/ano (opcional)
- **Total/ano**: R$ 0-40

## 📊 **Requisitos do Sistema**

### **Servidor Local:**
- **OS**: Ubuntu Server 22.04 LTS
- **RAM**: Mínimo 2GB (recomendado 4GB+)
- **Storage**: Mínimo 10GB (recomendado 32GB+)
- **Node.js**: Versão 18+ LTS

### **Cliente:**
- **Navegador**: Chrome 90+, Firefox 88+, Safari 14+
- **Rede**: WiFi local ou dados móveis
- **Dispositivo**: Qualquer smartphone/tablet/PC

## 🔄 **Manutenção e Atualizações**

### **Atualizações Automáticas:**
```bash
# Atualizar código
git pull origin main

# Reinstalar dependências
npm install

# Novo build
npm run build

# Reiniciar servidor
npm run pm2:restart
```

### **Backup Automático:**
- **Local**: Script cron diário
- **Nuvem**: Git + Vercel
- **Recuperação**: Restore automático

## 📚 **Documentação Completa**

- **📖 [GUIA_HOSPEDAGEM.md](GUIA_HOSPEDAGEM.md)** - Hospedagem local segura
- **🌐 [GUIA_DEPLOY_PUBLICO.md](GUIA_DEPLOY_PUBLICO.md)** - Deploy público no Vercel
- **🏭 [README_PRODUCAO.md](README_PRODUCAO.md)** - Guia de produção
- **🚀 [deploy-publico.sh](deploy-publico.sh)** - Script de deploy automático
- **⚙️ [setup-producao.sh](setup-producao.sh)** - Script de instalação local

## 🎯 **Casos de Uso**

### **Estabelecimentos Pequenos:**
- **Raspberry Pi 4** + hospedagem local
- **Sistema offline** confiável
- **Custo mínimo** de manutenção

### **Estabelecimentos Médios:**
- **Mini PC Intel NUC** + hospedagem híbrida
- **Acesso público** para clientes
- **Backup na nuvem** automático

### **Estabelecimentos Grandes:**
- **Servidor dedicado** + hospedagem híbrida
- **Múltiplas filiais** sincronizadas
- **Monitoramento** avançado

## 🚨 **Suporte e Solução de Problemas**

### **Logs do Sistema:**
```bash
# Logs da aplicação
npm run pm2:logs

# Status do servidor
npm run pm2:status

# Monitoramento
pm2 monit
```

### **Problemas Comuns:**
- **Porta em uso**: `sudo lsof -i :3000`
- **Permissões**: `sudo chown -R user:user /path`
- **Dependências**: `rm -rf node_modules && npm install`

## 🎉 **Status do Projeto**

✅ **Sistema**: Funcionando perfeitamente  
✅ **Hospedagem Local**: Configurada e segura  
✅ **Hospedagem Pública**: Pronta para deploy  
✅ **QR Code**: Funcionando via dados móveis  
✅ **Mobile**: Interface otimizada  
✅ **Segurança**: Máxima em ambos os ambientes  
✅ **Documentação**: Completa e detalhada  

## 🚀 **Próximos Passos**

1. **Execute o script** `atualizar-github.ps1`
2. **Configure o repositório** no GitHub
3. **Faça deploy** no Vercel
4. **Teste as funcionalidades** públicas
5. **Configure domínio** personalizado (opcional)
6. **Treine a equipe** no uso
7. **Divulgue para clientes**

## 🤝 **Contribuição**

Este projeto foi desenvolvido especificamente para a **Adriana Bebidas**. Para contribuições ou dúvidas:

- **Issues**: Reporte bugs ou solicite funcionalidades
- **Pull Requests**: Contribua com melhorias
- **Documentação**: Ajude a manter a documentação atualizada

## 📄 **Licença**

Este projeto é desenvolvido para uso comercial da **Adriana Bebidas**. Todos os direitos reservados.

---

**Adriana Bebidas POS** 🚀  
*Sistema profissional para estabelecimentos*  
*Versão: 1.0.0 | Status: Produção* ✅  
*Hospedagem: Híbrida (Local + Público)* 🌐🏠
