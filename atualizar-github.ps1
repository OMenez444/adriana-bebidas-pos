# Script para atualizar o projeto Adriana Bebidas POS no GitHub
# Execute este script como administrador se necessário

Write-Host "🚀 Atualizando Projeto Adriana Bebidas POS no GitHub" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green

# Verificar se o Git está instalado
$gitPath = "C:\Program Files\Git\bin\git.exe"
if (Test-Path $gitPath) {
    Write-Host "✅ Git encontrado em: $gitPath" -ForegroundColor Green
} else {
    Write-Host "❌ Git não encontrado. Instalando..." -ForegroundColor Red
    winget install --id Git.Git -e --source winget
    Write-Host "🔄 Aguarde a instalação e execute o script novamente" -ForegroundColor Yellow
    exit
}

# Adicionar Git ao PATH temporariamente
$env:PATH += ";C:\Program Files\Git\bin"

# Verificar versão do Git
try {
    $gitVersion = & git --version
    Write-Host "✅ Git funcionando: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao executar Git. Tente reiniciar o terminal" -ForegroundColor Red
    exit
}

# Verificar se já é um repositório Git
if (Test-Path ".git") {
    Write-Host "✅ Repositório Git já configurado" -ForegroundColor Green
} else {
    Write-Host "🔧 Inicializando repositório Git..." -ForegroundColor Yellow
    & git init
    Write-Host "✅ Repositório Git inicializado" -ForegroundColor Green
}

# Configurar usuário Git (será solicitado se não configurado)
Write-Host "🔧 Configurando usuário Git..." -ForegroundColor Yellow
$userName = Read-Host "Digite seu nome completo"
$userEmail = Read-Host "Digite seu email do GitHub"

& git config user.name $userName
& git config user.email $userEmail

Write-Host "✅ Usuário Git configurado: $userName <$userEmail>" -ForegroundColor Green

# Adicionar arquivo .gitignore se não existir
if (-not (Test-Path ".gitignore")) {
    Write-Host "📝 Criando arquivo .gitignore..." -ForegroundColor Yellow
    
    @"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# PM2
.pm2/

# Vercel
.vercel/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    
    Write-Host "✅ Arquivo .gitignore criado" -ForegroundColor Green
}

# Adicionar todos os arquivos
Write-Host "📁 Adicionando arquivos ao Git..." -ForegroundColor Yellow
& git add .

# Verificar status
Write-Host "📊 Status do repositório:" -ForegroundColor Yellow
& git status

# Fazer commit inicial
Write-Host "💾 Fazendo commit inicial..." -ForegroundColor Yellow
$commitMessage = Read-Host "Digite a mensagem do commit (ou pressione Enter para usar padrão)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "🚀 Versão inicial: Sistema POS Adriana Bebidas com hospedagem híbrida"
}

& git commit -m $commitMessage

Write-Host "✅ Commit realizado com sucesso!" -ForegroundColor Green

# Configurar repositório remoto
Write-Host "🌐 Configurando repositório remoto..." -ForegroundColor Yellow
$remoteUrl = Read-Host "Digite a URL do repositório GitHub (ex: https://github.com/seu-usuario/adriana-bebidas-pos.git)"

if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
    Write-Host "⚠️ URL não fornecida. Pulando configuração do repositório remoto" -ForegroundColor Yellow
} else {
    & git remote add origin $remoteUrl
    Write-Host "✅ Repositório remoto configurado: $remoteUrl" -ForegroundColor Green
    
    # Fazer push
    Write-Host "🚀 Enviando para o GitHub..." -ForegroundColor Yellow
    & git branch -M main
    & git push -u origin main
    
    Write-Host "✅ Projeto enviado para o GitHub com sucesso!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Verifique o repositório no GitHub"
Write-Host "   2. Configure o deploy automático no Vercel"
Write-Host "   3. Teste as funcionalidades públicas"
Write-Host "   4. Compartilhe com a equipe"
Write-Host ""
Write-Host "🔧 Comandos úteis:" -ForegroundColor Cyan
Write-Host "   git status                    - Ver status do repositório"
Write-Host "   git add .                     - Adicionar arquivos"
Write-Host "   git commit -m 'mensagem'      - Fazer commit"
Write-Host "   git push                      - Enviar para GitHub"
Write-Host "   git pull                      - Baixar do GitHub"
Write-Host ""
Write-Host "📚 Documentação criada:" -ForegroundColor Cyan
Write-Host "   - GUIA_HOSPEDAGEM.md          - Hospedagem local segura"
Write-Host "   - GUIA_DEPLOY_PUBLICO.md      - Deploy público no Vercel"
Write-Host "   - README_PRODUCAO.md          - Guia de produção"
Write-Host "   - deploy-publico.sh           - Script de deploy automático"
Write-Host "   - setup-producao.sh           - Script de instalação local"
