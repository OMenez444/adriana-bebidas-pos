import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/state/settings';
import { useComandasStore } from '@/state/comandas';
import { Download, Share2, Smartphone, Globe, Wifi } from 'lucide-react';
import { useState } from 'react';
import { useQRCode } from '@/hooks/useQRCode';
import { getQRCodeUrl, isPublicEnvironment } from '@/config/environment';

export default function QRCode() {
  const mesasCount = useSettingsStore((s) => s.settings.mesasCount);
  const lojaNome = useSettingsStore((s) => s.settings.lojaNome);
  const comandas = useComandasStore((s) => s.comandas);
  const [selectedMesa, setSelectedMesa] = useState<number | null>(null);

  const getMesaStatus = (mesaNumero: number) => {
    const comanda = comandas.find(
      (c) => c.tipo === 'MESA' && c.mesaNumero === mesaNumero && 
      (c.status === 'ABERTA' || c.status === 'EM_PREPARO')
    );
    return comanda ? 'OCUPADA' : 'LIVRE';
  };

  // Usar a função de ambiente para gerar URL do QR Code
  const generateQRCodeUrl = (mesaNumero: number) => {
    return getQRCodeUrl(mesaNumero);
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
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    status === 'OCUPADA' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'OCUPADA' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    {status === 'OCUPADA' ? 'Ocupada' : 'Livre'}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <div id={`qr-${mesaNumero}`} className="p-4 bg-white rounded-lg">
                      {error ? (
                        <div className="w-[150px] h-[150px] flex items-center justify-center text-red-500 text-xs">
                          Erro ao gerar QR Code
                        </div>
                      ) : dataUrl ? (
                        <img
                          src={dataUrl}
                          alt={`QR Code Mesa ${mesaNumero}`}
                          className="w-[150px] h-[150px]"
                        />
                      ) : (
                        <div className="w-[150px] h-[150px] flex items-center justify-center text-gray-400">
                          Gerando QR Code...
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Cliente escaneia e faz pedido
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadQRCode(mesaNumero)}
                        disabled={!dataUrl}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareQRCode(mesaNumero)}
                        disabled={!dataUrl}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-blue-900">Como Funciona</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Cliente escaneia o QR Code da mesa</li>
                <li>• Acessa o cardápio digital no celular</li>
                <li>• Faz o pedido diretamente</li>
                <li>• Pedido aparece automaticamente na comanda</li>
                <li>• Atendente recebe notificação</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
