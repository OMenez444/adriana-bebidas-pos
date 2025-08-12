import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Lock } from 'lucide-react';

interface SecurityWarningProps {
  isOpen: boolean;
  onClose: () => void;
  mesaNumero: number;
}

export default function SecurityWarning({ isOpen, onClose, mesaNumero }: SecurityWarningProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-6 max-w-md w-full text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-8 h-8 text-yellow-500" />
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
        </div>
        
        <h2 className="text-xl font-bold text-foreground">Acesso Restrito</h2>
        
        <div className="space-y-2">
          <p className="text-muted-foreground">
            A <strong>Mesa {mesaNumero}</strong> está bloqueada para sua segurança.
          </p>
          <p className="text-sm text-muted-foreground">
            Esta medida garante que apenas você possa fazer pedidos para esta mesa, 
            evitando confusões e pedidos incorretos.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-yellow-800">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Navegação bloqueada para outras mesas
            </span>
          </div>
        </div>

        <div className="flex gap-2 justify-center pt-2">
          <Button onClick={onClose} className="px-6">
            Entendi
          </Button>
        </div>
      </div>
    </div>
  );
}
