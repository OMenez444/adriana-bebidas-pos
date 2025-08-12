import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/state/settings';
import { useComandasStore } from '@/state/comandas';
import { Download, Share2, Smartphone, Globe, Wifi } from 'lucide-react';
import { useState } from 'react';
import { useQRCode } from '@/hooks/useQRCode';
import { getQRCodeUrl, isPublicEnvironment, getEnvironmentInfo } from '@/config/environment';

export default function QRCode() {
  const mesasCount = useSettingsStore((s) => s.settings.mesasCount);
  const lojaNome = useSettingsStore((s) => s.settings.lojaNome);
  const comandas = useComandasStore((s) => s.comandas);
  const [selectedMesa, setSelectedMesa] = useState<number | null>(null);

  // Debug: Mostrar informações do ambiente
  const envInfo = getEnvironmentInfo();

  const getMesaStatus = (mesaNumero: number) => {
    const comanda = comandas.find(
      (c) => c.tipo === 'MESA' && c.mesaNumero === mesaNumero && 
      (c.status === 'ABERTA' || c.status === 'EM_PREPARO')
    );
    return comanda ? 'OCUPADA' : 'LIVRE';
  };

  // Usar a função de ambiente para gerar URL do QR Code
  const generateQRCodeUrl = (mesaNumero: number) => {
    const url = getQRCodeUrl(mesaNumero);
    console.log(`QR Code Mesa ${mesaNumero}:`, url); // Debug
    return url;
  };

  const downloadQRCode = (mesaNumero: number) => {
    const qrElement = document.querySelector(`#qr-${mesaNumero} img`) as HTMLImageElement;
    if (qrElement && qrElement.src) {
      const link = document.createElement('a');
      link.download = `qr-mesa-${mesaNumero}.png`;
      link.href = qrElement.src;
      link.click();
    } else {
      alert('QR Code ainda não foi gerado. Aguarde um momento.');
    }
  };

  const shareQRCode = async (mesaNumero: number) => {
    const url = generateQRCodeUrl(mesaNumero);
    if (navigator.share) {
      try {
      await navigator.share({
        title: `${lojaNome} - Mesa ${mesaNumero}`,
        text: `Faça seu pedido online para a Mesa ${mesaNumero}`,
        url: url,
      });
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  } else {
    // Fallback para copiar URL
    navigator.clipboard.writeText(url);
    alert('URL copiada para a área de transferência!');
  }
};

  return (
    <AppLayout title="QR Codes das Mesas">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">QR Codes para Pedidos Online</h1>
          <p className="text-muted-foreground">
            Cada mesa possui um QR Code único para pedidos via celular
          </p>
          
          {/* Indicador de Ambiente */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
            {isPublicEnvironment() ? (
              <>
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  Modo Público - Acessível via dados móveis
                </span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">
                  Modo Local - Apenas na rede WiFi
                </span>
              </>
            )}
          </div>

          {/* Debug: Informações do ambiente */}
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-left text-xs">
            <p><strong>Hostname:</strong> {envInfo.hostname}</p>
            <p><strong>Protocol:</strong> {envInfo.protocol}</p>
            <p><strong>Port:</strong> {envInfo.port}</p>
            <p><strong>Environment:</strong> {envInfo.environment}</p>
            <p><strong>QR Base URL:</strong> {envInfo.qrCodeBaseUrl}</p>
            <p><strong>Is Public:</strong> {envInfo.isPublic ? 'Sim' : 'Não'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: mesasCount }, (_, i) => {
            const mesaNumero = i + 1;
            const status = getMesaStatus(mesaNumero);
            const qrUrl = generateQRCodeUrl(mesaNumero);
            const { dataUrl, error } = useQRCode(qrUrl);
            
            return (
              <Card key={mesaNumero} className="relative">
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-lg">Mesa {mesaNumero}</CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status === 'LIVRE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {status}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="text-center space-y-4">
                  {/* QR Code */}
                  <div id={`qr-${mesaNumero}`} className="flex justify-center">
                    {error ? (
                      <div className="text-red-500 text-sm">
                        Erro: {error}
                      </div>
                    ) : dataUrl ? (
                      <img 
                        src={dataUrl} 
                        alt={`QR Code Mesa ${mesaNumero}`}
                        className="w-32 h-32 border rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 border rounded-lg flex items-center justify-center text-gray-400">
                        Gerando...
                      </div>
                    )}
                  </div>

                  {/* URL do QR Code */}
                  <div className="text-xs text-gray-600 break-all">
                    <strong>URL:</strong> {qrUrl}
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadQRCode(mesaNumero)}
                      disabled={!dataUrl}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Baixar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareQRCode(mesaNumero)}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Compartilhar
                    </Button>
                  </div>

                  {/* Teste de Link */}
                  <div className="pt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(qrUrl, '_blank')}
                      className="w-full"
                    >
                      <Smartphone className="w-4 h-4 mr-1" />
                      Testar Pedido
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
