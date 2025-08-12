import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useComandasStore } from '@/state/comandas';
import { useProductsStore } from '@/state/products';
import { TipoComanda } from '@/state/types';
import { formatCurrency } from '@/utils/format';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Nova() {
  const navigate = useNavigate();
  const openMesa = useComandasStore((s) => s.openMesa);
  const openDelivery = useComandasStore((s) => s.openDelivery);
  const produtos = useProductsStore((s) => s.produtos);

  const [tipo, setTipo] = useState<TipoComanda>('MESA');
  const [mesaNumero, setMesaNumero] = useState<number>(1);
  const [clienteNome, setClienteNome] = useState('');

  const criar = () => {
    const c =
      tipo === 'MESA' ? openMesa(mesaNumero) : openDelivery(clienteNome || 'Cliente');
    navigate(`/comanda/${c.id}`);
  };

  return (
    <AppLayout title="Nova Comanda">
      <div className="space-y-6">
        {/* Seleção de Tipo */}
        <div className="bg-card border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Tipo de Comanda</h2>
          <RadioGroup value={tipo} onValueChange={(v) => setTipo(v as TipoComanda)} className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MESA" id="r1" />
              <Label htmlFor="r1" className="text-base">Mesa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DELIVERY" id="r2" />
              <Label htmlFor="r2" className="text-base">Delivery</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Configurações Específicas */}
        <div className="bg-card border rounded-lg p-4">
          <h3 className="text-md font-medium mb-4">Configurações</h3>
          
          {tipo === 'MESA' ? (
            <div className="space-y-2">
              <Label htmlFor="mesa" className="text-sm font-medium">Número da Mesa</Label>
              <Input 
                id="mesa" 
                type="number" 
                min={1} 
                max={50}
                value={mesaNumero} 
                onChange={(e) => setMesaNumero(parseInt(e.target.value || '1'))}
                className="w-full sm:w-48"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="cliente" className="text-sm font-medium">Nome do Cliente</Label>
              <Input 
                id="cliente" 
                value={clienteNome} 
                onChange={(e) => setClienteNome(e.target.value)}
                placeholder="Digite o nome do cliente"
                className="w-full sm:w-80"
              />
            </div>
          )}
        </div>

        {/* Botão de Criação */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={criar}
            className="w-full sm:w-auto px-8 h-12 text-base"
            disabled={tipo === 'DELIVERY' && !clienteNome.trim()}
          >
            {tipo === 'MESA' ? `Criar Mesa ${mesaNumero}` : 'Criar Delivery'}
          </Button>
        </div>

        {/* Sugestões de Produtos */}
        <div className="bg-card border rounded-lg p-4">
          <h3 className="text-md font-medium mb-4">Sugestões Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {produtos.slice(0, 8).map((p) => (
              <div key={p.id} className="p-3 rounded-md border text-center text-sm hover:shadow-md transition-shadow cursor-pointer">
                {p.imagem && (
                  <img
                    src={p.imagem}
                    alt={p.nome}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                )}
                <div className="font-medium truncate">{p.nome}</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(p.preco)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
