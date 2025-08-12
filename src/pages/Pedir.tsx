import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Produto } from '@/state/types';
import { formatCurrency } from '@/utils/format';
import { Search, Plus, Minus, ShoppingCart, CheckCircle, Smartphone } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Produtos padrão para demonstração (serão carregados do localStorage se disponível)
const PRODUTOS_PADRAO: Produto[] = [
  {
    id: '1',
    nome: 'Coca-Cola 350ml',
    preco: 6.50,
    categoria: 'Bebidas',
    imagem: '',
    descricao: 'Refrigerante Coca-Cola 350ml'
  },
  {
    id: '2',
    nome: 'Água Mineral 500ml',
    preco: 3.00,
    categoria: 'Bebidas',
    imagem: '',
    descricao: 'Água mineral natural 500ml'
  },
  {
    id: '3',
    nome: 'Suco de Laranja 300ml',
    preco: 8.00,
    categoria: 'Bebidas',
    imagem: '',
    descricao: 'Suco natural de laranja 300ml'
  },
  {
    id: '4',
    nome: 'Cerveja Heineken 350ml',
    preco: 12.00,
    categoria: 'Bebidas',
    imagem: '',
    descricao: 'Cerveja Heineken 350ml'
  }
];

export default function Pedir() {
  const { mesaNumero } = useParams();
  const mesa = parseInt(mesaNumero || '0');
  
  // Carregar produtos do localStorage ou usar padrão
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_PADRAO);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [cart, setCart] = useState<Array<{ produto: Produto; qtd: number }>>([]);
  const [orderSent, setOrderSent] = useState(false);

  // Carregar produtos do localStorage se disponível
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('adriana-bebidas-products');
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProdutos(parsed);
        }
      }
    } catch (error) {
      console.log('Usando produtos padrão');
    }
  }, []);

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
      item.produto.id === produtoId 
        ? { ...item, qtd }
        : item
    ));
  };

  // Calcular total do carrinho
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.produto.preco * item.qtd), 0);
  }, [cart]);

  // Enviar pedido
  const sendOrder = () => {
    if (cart.length === 0) {
      alert('Adicione produtos ao carrinho antes de enviar o pedido.');
      return;
    }

    // Simular envio do pedido
    const orderData = {
      mesa: mesa,
      items: cart,
      total: cartTotal,
      timestamp: new Date().toISOString()
    };

    // Salvar pedido no localStorage para demonstração
    try {
      const existingOrders = JSON.parse(localStorage.getItem('adriana-bebidas-orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('adriana-bebidas-orders', JSON.stringify(existingOrders));
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
    }

    setOrderSent(true);
    setCart([]);
    
    // Mostrar confirmação
    alert(`Pedido enviado com sucesso para a Mesa ${mesa}!\nTotal: ${formatCurrency(cartTotal)}`);
  };

  if (orderSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-800">Pedido Enviado!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Seu pedido foi enviado com sucesso para a Mesa {mesa}.
            </p>
            <p className="text-sm text-gray-500">
              Aguarde o atendente confirmar seu pedido.
            </p>
            <Button 
              onClick={() => setOrderSent(false)}
              className="w-full"
            >
              Fazer Novo Pedido
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Cardápio Digital
              </h1>
              <p className="text-gray-600">
                Mesa {mesa} - Faça seu pedido online
              </p>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Smartphone className="w-5 h-5" />
              <span className="text-sm font-medium">Pedido Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Produtos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  {categorias.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de Produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {produtosFiltrados.map((produto) => (
                <Card key={produto.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {produto.imagem && (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {produto.nome}
                        </h3>
                        {produto.descricao && (
                          <p className="text-sm text-gray-500 mt-1">
                            {produto.descricao}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(produto.preco)}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(produto)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {produtosFiltrados.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhum produto encontrado.</p>
                <p className="text-sm">Tente ajustar os filtros de busca.</p>
              </div>
            )}
          </div>

          {/* Coluna Direita - Carrinho */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Seu Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Carrinho vazio</p>
                    <p className="text-sm">Adicione produtos para fazer seu pedido</p>
                  </div>
                ) : (
                  <>
                    {/* Itens do Carrinho */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.produto.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.produto.nome}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(item.produto.preco)} cada
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQty(item.produto.id, item.qtd - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.qtd}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQty(item.produto.id, item.qtd + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-right min-w-0">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(item.produto.preco * item.qtd)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">
                          {formatCurrency(cartTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Botão Enviar */}
                    <Button
                      onClick={sendOrder}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Enviar Pedido
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
