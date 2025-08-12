#!/bin/bash

echo "🚀 Deploy Público - Adriana Bebidas POS"
echo "========================================"

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não está instalado. Instalando..."
    npm install -g vercel
else
    echo "✅ Vercel CLI já está instalado: $(vercel --version)"
fi

# Verificar se está logado no Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Faça login no Vercel:"
    vercel login
else
    echo "✅ Logado no Vercel como: $(vercel whoami)"
fi

# Fazer build da aplicação
echo "🔨 Fazendo build da aplicação..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build. Verifique os erros acima."
    exit 1
fi

echo "✅ Build concluído com sucesso!"

# Perguntar se é deploy de produção
read -p "🚀 Fazer deploy de PRODUÇÃO? (s/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🚀 Deploy de PRODUÇÃO iniciado..."
    vercel --prod
    echo ""
    echo "🎉 Deploy de PRODUÇÃO concluído!"
    echo "🌐 URL: https://adriana-bebidas-pos.vercel.app"
else
    echo "🧪 Deploy de DESENVOLVIMENTO iniciado..."
    vercel
    echo ""
    echo "🎉 Deploy de DESENVOLVIMENTO concluído!"
    echo "🌐 URL: https://adriana-bebidas-pos-*.vercel.app"
fi

echo ""
echo "📱 Para testar o QR Code público:"
echo "   1. Acesse a URL gerada acima"
echo "   2. Vá para a aba 'QR Code'"
echo "   3. Verifique se mostra 'Modo Público'"
echo "   4. Teste o QR Code em outro dispositivo"
echo "   5. Acesse via dados móveis (não WiFi)"

echo ""
echo "🔧 Comandos úteis:"
echo "   vercel logs                    - Ver logs do deploy"
echo "   vercel domains                 - Gerenciar domínios"
echo "   vercel env                     - Gerenciar variáveis"
echo "   vercel remove                  - Remover projeto"

echo ""
echo "🎯 Próximos passos:"
echo "   1. Testar funcionalidades públicas"
echo "   2. Configurar domínio personalizado (opcional)"
echo "   3. Treinar funcionários"
echo "   4. Divulgar para clientes"
