import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Check } from 'lucide-react';
import { useComandasStore } from '@/state/comandas';
import { formatDateTime } from '@/utils/format';

interface OrderNotificationProps {
  onClose: () => void;
}

export default function OrderNotification({ onClose }: OrderNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const comandas = useComandasStore((s) => s.comandas);
  
  // Simular notificação de novo pedido (em produção, isso viria de um WebSocket)
  const [hasNewOrder, setHasNewOrder] = useState(false);
  
  useEffect(() => {
    // Verificar se há comandas com itens recentes (últimos 2 minutos)
    const checkNewOrders = () => {
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
      
      const recentOrders = comandas.filter(c => {
        if (c.itens.length === 0) return false;
        const lastItemTime = new Date(c.criadoEm);
        return lastItemTime > twoMinutesAgo;
      });
      
      setHasNewOrder(recentOrders.length > 0);
    };
    
    checkNewOrders();
    const interval = setInterval(checkNewOrders, 30000); // Verificar a cada 30 segundos
    
    return () => clearInterval(interval);
  }, [comandas]);

  if (!isVisible || !hasNewOrder) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <Card className="w-80 shadow-lg border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900">Novo Pedido Online!</h4>
                <p className="text-sm text-green-700">
                  Cliente fez pedido via QR Code
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {formatDateTime(new Date().toISOString())}
                </p>
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setHasNewOrder(false);
                  setIsVisible(false);
                  onClose();
                }}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Pedido Online
              </Badge>
              <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                Ver Detalhes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
