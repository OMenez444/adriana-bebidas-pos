import { Badge } from '@/components/ui/badge';
import { Shield, Lock, CheckCircle } from 'lucide-react';

interface MesaStatusProps {
  mesaNumero: number;
  isLocked: boolean;
  comandaId?: string;
}

export default function MesaStatus({ mesaNumero, isLocked, comandaId }: MesaStatusProps) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-medium text-green-800">Mesa {mesaNumero} Ativa</h3>
            <p className="text-sm text-green-600">
              Sua mesa está segura e bloqueada para pedidos
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Segura
          </Badge>
          
          <Badge variant="outline" className="text-xs">
            <Lock className="w-3 h-3 mr-1" />
            Bloqueada
          </Badge>
          
          {comandaId && (
            <Badge variant="default" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Comanda Ativa
            </Badge>
          )}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-green-200">
        <div className="grid grid-cols-2 gap-4 text-xs text-green-700">
          <div>
            <span className="font-medium">Status:</span> Ativa para Pedidos
          </div>
          <div>
            <span className="font-medium">Segurança:</span> Navegação Bloqueada
          </div>
        </div>
      </div>
    </div>
  );
}
