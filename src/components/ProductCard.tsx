import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Produto } from '@/state/types';
import { formatCurrency } from '@/utils/format';
import { Plus, Image as ImageIcon } from 'lucide-react';

interface ProductCardProps {
  produto: Produto;
  onAddToCart?: (produto: Produto) => void;
  showPrice?: boolean;
  showAddButton?: boolean;
  className?: string;
}

export default function ProductCard({ 
  produto, 
  onAddToCart, 
  showPrice = true, 
  showAddButton = true,
  className = '' 
}: ProductCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Imagem do Produto */}
      {produto.imagem ? (
        <div className="relative">
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="w-full h-32 object-cover"
          />
          {produto.categoria && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 text-xs"
            >
              {produto.categoria}
            </Badge>
          )}
        </div>
      ) : (
        <div className="relative h-32 bg-muted flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
          {produto.categoria && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 text-xs"
            >
              {produto.categoria}
            </Badge>
          )}
        </div>
      )}
      
      {/* Informações do Produto */}
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium line-clamp-2">
          {produto.nome}
        </CardTitle>
        {produto.descricao && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {produto.descricao}
          </p>
        )}
      </CardHeader>
      
      {/* Preço e Botão */}
      <CardContent className="pt-0 space-y-3">
        {showPrice && (
          <div className="text-lg font-bold text-primary">
            {formatCurrency(produto.preco)}
          </div>
        )}
        
        {showAddButton && onAddToCart && (
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => onAddToCart(produto)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
