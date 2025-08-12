import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComandasStore } from '@/state/comandas';
import { useSettingsStore } from '@/state/settings';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/format';
import { QrCode, Coffee, Users, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Mesas() {
  const navigate = useNavigate();
  const mesasCount = useSettingsStore((s) => s.settings.mesasCount);
  const comandas = useComandasStore((s) => s.comandas);
  const openMesa = useComandasStore((s) => s.openMesa);

  const byMesa = new Map<number, { status: 'LIVRE' | 'OCUPADA' | 'PAGA'; total: number; comandaId?: string }>();
  for (let i = 1; i <= mesasCount; i++) byMesa.set(i, { status: 'LIVRE', total: 0 });

  comandas.forEach((c) => {
    if (c.tipo !== 'MESA' || !c.mesaNumero) return;
    const prev = byMesa.get(c.mesaNumero);
    if (!prev) return;
    if (c.status === 'FECHADA_PAGA') byMesa.set(c.mesaNumero, { status: 'PAGA', total: c.total });
    if (c.status === 'ABERTA' || c.status === 'EM_PREPARO') byMesa.set(c.mesaNumero, { status: 'OCUPADA', total: c.total, comandaId: c.id });
  });

  const totals = {
    abertas: comandas.filter((c) => c.status === 'ABERTA' || c.status === 'EM_PREPARO').length,
    livres: Array.from(byMesa.values()).filter((m) => m.status === 'LIVRE').length,
    total: mesasCount,
  };

  return (
    <AppLayout title="Painel de Mesas">
      {/* Resumo das Mesas - Mobile First */}
      <div className="mb-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Coffee className="w-5 h-5 text-primary" />
          Status das Mesas
        </h2>
        
        {/* Cards de Status Responsivos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Abertas</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{totals.abertas}</div>
            <div className="text-xs text-muted-foreground">Comandas ativas</div>
          </div>
          
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Livres</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{totals.livres}</div>
            <div className="text-xs text-muted-foreground">Disponíveis</div>
          </div>
          
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coffee className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold text-primary">{totals.total}</div>
            <div className="text-xs text-muted-foreground">Mesas no sistema</div>
          </div>
        </div>
      </div>
      
      {/* Grid de Mesas Responsivo */}
      <div className="space-y-4">
        <h3 className="text-md font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Gerenciar Mesas
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from(byMesa.entries()).map(([num, info]) => (
            <Card key={num} className={`
              transition-all duration-200 hover:shadow-md
              ${info.status === 'LIVRE' 
                ? 'border-green-500/40 bg-green-50/30 dark:bg-green-950/20' 
                : info.status === 'OCUPADA' 
                  ? 'border-yellow-500/40 bg-yellow-50/30 dark:bg-yellow-950/20' 
                  : 'border-primary/40 bg-primary/5'
              }
            `}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Mesa {num}</CardTitle>
                  <Badge variant={
                    info.status === 'LIVRE' ? 'default' 
                    : info.status === 'OCUPADA' ? 'secondary' 
                    : 'outline'
                  } className={`
                    ${info.status === 'LIVRE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                    ${info.status === 'OCUPADA' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                    ${info.status === 'PAGA' ? 'bg-primary/10 text-primary border-primary/30' : ''}
                  `}>
                    {info.status === 'LIVRE' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {info.status === 'OCUPADA' && <Clock className="w-3 h-3 mr-1" />}
                    {info.status === 'PAGA' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {info.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Valor da Mesa */}
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Valor Atual</div>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(info.total)}
                  </div>
                </div>
                
                {/* Botões de Ação */}
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate(`/qrcode`)}
                    className="w-full justify-center"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Gerar QR Code
                  </Button>
                  
                  <Button 
                    size="default"
                    onClick={() => {
                      if (info.comandaId) {
                        navigate(`/comanda/${info.comandaId}`);
                      } else {
                        const c = openMesa(num);
                        navigate(`/comanda/${c.id}`);
                      }
                    }}
                    className={`
                      w-full justify-center
                      ${info.status === 'LIVRE' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                      }
                    `}
                  >
                    {info.status === 'LIVRE' ? 'Abrir Mesa' : 'Ver Comanda'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
