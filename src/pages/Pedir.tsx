import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProductsStore } from '@/state/products';
import { useComandasStore } from '@/state/comandas';
import { useSettingsStore } from '@/state/settings';
import { Produto, ItemComanda } from '@/state/types';
import { formatCurrency } from '@/utils/format';
import { Search, Plus, Minus, ShoppingCart, CheckCircle, Lock, AlertTriangle, Shield } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import SecurityWarning from '@/components/SecurityWarning';
import { useMesaSecurity } from '@/hooks/useMesaSecurity';
import MesaStatus from '@/components/MesaStatus';

export default function Pedir() {
  const { mesaNumero } = useParams();
  const navigate = useNavigate();
  const mesa = parseInt(mesaNumero || '0');
  
  const produtos = useProductsStore((s) => s.produtos);
  const settings = useSettingsStore((s) => s.settings);
  const comandas = useComandasStore((s) => s.comandas);
  const addItem = useComandasStore((s) => s.addItem);
  const openMesa = useComandasStore((s) => s.openMesa);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [cart, setCart] = useState<Array<{ produto: Produto; qtd: number }>>([]);
  const [orderSent, setOrderSent] = useState(false);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);

  // Hook de segurança da mesa
  const { isLocked } = useMesaSecurity({
    mesaNumero: mesa,
    onSecurityWarning: () => setShowSecurityWarning(true)
  });

  // Obter ou criar comanda para a mesa
  const comanda = useMemo(() => {
    let c = comandas.find(
      (c) => c.tipo === 'MESA' && c.mesaNumero === mesa && 
      (c.status === 'ABERTA' || c.status === 'EM_PREPARO')
    );
    
    if (!c) {
      c = openMesa(mesa);
    }
    
    return c;
  }, [mesa, comandas, openMesa]);

  // Categorias únicas dos produtos
  const categorias = useMemo(() => {
    const cats = produtos.map(p => p.categoria).filter(Boolean) as string[];
    return ['TODAS', ...Array.from(new Set(cats))];
  }, [produtos]);

  // Produtos filtrados
  const produtosFiltrados = useMemo(() => {
    let filtered = produtos;
    
    if (selectedCategory !== 'TODAS') {
      filtered = filtered.filter(p => p.categoria === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(term) || 
        (p.categoria && p.categoria.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  }, [produtos, selectedCategory, searchTerm]);

  // Adicionar produto ao carrinho
  const addToCart = (produto: Produto) => {
    setCart(prev => {
      const existing = prev.find(item => item.produto.id === produto.id);
      if (existing) {
        return prev.map(item => 
          item.produto.id === produto.id 
            ? { ...item, qtd: item.qtd + 1 }
            : item
        );
      }
      return [...prev, { produto, qtd: 1 }];
    });
  };

  // Remover produto do carrinho
  const removeFromCart = (produtoId: string) => {
    setCart(prev => prev.filter(item => item.produto.id !== produtoId));
  };

  // Alterar quantidade no carrinho
  const updateCartQty = (produtoId: string, qtd: number) => {
    if (qtd <= 0) {
      removeFromCart(produtoId);
      return;
    }
    
    setCart(prev => prev.map(item => 
      item.produto.id === produtoId ? { ...item, qtd } : item
    ));
  };

  // Calcular total do carrinho
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.produto.preco * item.qtd), 0);
  }, [cart]);



  // Enviar pedido
  const sendOrder = () => {
    if (cart.length === 0) return;
    
    // Adicionar itens à comanda
    cart.forEach(item => {
      for (let i = 0; i < item.qtd; i++) {
        addItem(comanda.id, item.produto);
      }
    });
    
    setOrderSent(true);
    setCart([]);
    
    // Não redirecionar - manter na mesa
    setTimeout(() => {
      setOrderSent(false);
    }, 3000);
  };

  if (!mesa || mesa <= 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Mesa Inválida</h1>
          <p className="text-muted-foreground">QR Code inválido ou mesa não encontrada.</p>
          <Button onClick={() => navigate('/mesas')}>Voltar</Button>
        </div>
      </div>
    );
  }

  // Modal de Aviso de Segurança
  if (showSecurityWarning) {
    return (
      <SecurityWarning
        isOpen={showSecurityWarning}
        onClose={() => setShowSecurityWarning(false)}
        mesaNumero={mesa}
      />
    );
  }

  if (orderSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-green-600">Pedido Enviado!</h1>
          <p className="text-muted-foreground">
            Seu pedido foi recebido e está sendo preparado.
          </p>
          <p className="text-sm text-muted-foreground">
            Continue fazendo pedidos ou aguarde o atendimento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Seguro */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <div>
                <h1 className="font-semibold">{settings.lojaNome}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Mesa {mesa}</p>
                  <Badge variant="secondary" className="text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    Bloqueada
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Carrinho */}
          <div className="relative">
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Carrinho
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                  {cart.reduce((total, item) => total + item.qtd, 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-4 space-y-6">
        {/* Status da Mesa */}
        <MesaStatus 
          mesaNumero={mesa}
          isLocked={isLocked}
          comandaId={comanda?.id}
        />

        {/* Busca e Filtros */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categorias.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="grid grid-cols-2 gap-3">
          {produtosFiltrados.map(produto => (
            <ProductCard
              key={produto.id}
              produto={produto}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {/* Carrinho Flutuante Otimizado */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 space-y-3 shadow-lg">
            {/* Resumo do Carrinho */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Seu Pedido</h3>
              <Badge variant="secondary" className="text-sm">
                {cart.reduce((total, item) => total + item.qtd, 0)} itens
              </Badge>
            </div>
            
            {/* Lista de Itens */}
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {cart.map(item => (
                <div key={item.produto.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.produto.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.produto.preco)} x {item.qtd}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQty(item.produto.id, item.qtd - 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{item.qtd}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQty(item.produto.id, item.qtd + 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total e Botão de Pedido */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Total do pedido</p>
                <p className="font-bold text-2xl text-primary">{formatCurrency(cartTotal)}</p>
              </div>
              <Button size="lg" onClick={sendOrder} className="px-8 h-12 text-lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                Enviar Pedido
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
