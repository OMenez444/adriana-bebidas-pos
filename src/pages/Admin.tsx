import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProductsStore } from '@/state/products';
import { useSettingsStore } from '@/state/settings';
import { Produto } from '@/state/types';
import { useMemo, useState } from 'react';
import { Shield, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function Admin() {
  const { settings, update, resetAll } = useSettingsStore();
  const { produtos, add, update: updateProd, remove } = useProductsStore();

  const [pinOk, setPinOk] = useState(false);
  const [pin, setPin] = useState('');

  const tryEnter = () => {
    if (pin === settings.adminPin) {
      setPinOk(true);
      setPin(''); // Limpa o PIN após login bem-sucedido
    } else {
      alert('PIN incorreto! Tente novamente.');
      setPin(''); // Limpa o campo para nova tentativa
    }
  };

  if (!pinOk) {
    return (
      <AppLayout title="Acesso Administrativo">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="w-full max-w-sm space-y-6 p-6 border rounded-lg shadow-sm bg-card">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Painel Administrativo</h2>
              <p className="text-sm text-muted-foreground">Digite o PIN de acesso para continuar</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-pin" className="text-sm font-medium">PIN de Administrador</Label>
                <Input 
                  id="admin-pin"
                  type="password" 
                  value={pin} 
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Digite o PIN"
                  onKeyDown={(e) => e.key === 'Enter' && tryEnter()}
                  autoFocus
                  className="w-full text-center text-lg tracking-widest"
                  inputMode="numeric"
                />
              </div>
              
              <Button 
                onClick={tryEnter} 
                className="w-full h-12 text-base"
                disabled={pin.length < 4}
              >
                Acessar Painel
              </Button>
            </div>
            
            <div className="text-xs text-center text-muted-foreground bg-muted/50 p-3 rounded-lg">
              PIN padrão: <span className="font-mono font-bold">2024</span>
            </div>
            
            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  if (confirm('Isso irá redefinir o PIN para o padrão (2024). Continuar?')) {
                    update({ adminPin: '2024' });
                    alert('PIN redefinido para o padrão: 2024');
                  }
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Esqueci o PIN
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Admin">
      {/* Layout Mobile-First */}
      <div className="space-y-6">
        {/* Seção de Configurações */}
        <section className="bg-card border rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Configurações da Loja
          </h2>
          
          <div className="space-y-4">
            {/* Nome da Loja */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nome da Loja</Label>
              <Input 
                value={settings.lojaNome} 
                onChange={(e) => update({ lojaNome: e.target.value })}
                className="w-full"
                placeholder="Nome da sua loja"
              />
            </div>
            
            {/* Configurações em Grid para Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quantidade de Mesas</Label>
                <Input 
                  type="number" 
                  min={1} 
                  max={50}
                  value={settings.mesasCount} 
                  onChange={(e) => update({ mesasCount: parseInt(e.target.value || '1') })} 
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Taxa de Serviço (%)</Label>
                <Input 
                  type="number" 
                  min={0} 
                  max={50}
                  step="0.5"
                  value={settings.taxaServicoPercent} 
                  onChange={(e) => update({ taxaServicoPercent: parseFloat(e.target.value || '0') })} 
                  className="w-full"
                />
              </div>
            </div>
            
            {/* PIN Admin Otimizado */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">PIN Administrativo</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                  type="password" 
                  value={settings.adminPin} 
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (/^\d{0,8}$/.test(valor)) {
                      update({ adminPin: valor });
                    }
                  }} 
                  placeholder="Digite o novo PIN"
                  minLength={4}
                  maxLength={8}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const novoPin = prompt('Digite o novo PIN (4-8 dígitos):', settings.adminPin);
                    if (novoPin && /^\d{4,8}$/.test(novoPin)) {
                      if (confirm(`Confirmar alteração do PIN para "${novoPin}"?`)) {
                        update({ adminPin: novoPin });
                        alert('PIN alterado com sucesso!');
                      }
                    } else if (novoPin !== null) {
                      alert('PIN deve ter entre 4 e 8 dígitos e conter apenas números!');
                    }
                  }}
                  className="whitespace-nowrap"
                >
                  Alterar
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                PIN deve ter entre 4 e 8 dígitos
              </div>
            </div>
            
            {/* Botão Factory Reset */}
            <div className="pt-2">
              <Button 
                variant="destructive" 
                onClick={() => confirm('Factory reset: apagar tudo?') && resetAll()}
                className="w-full sm:w-auto"
              >
                Factory Reset
              </Button>
            </div>
          </div>
        </section>

        {/* Seção de Produtos */}
        <section className="bg-card border rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Gerenciar Produtos
          </h2>
          
          {/* Formulário de Produto */}
          <ProdForm onAdd={(p) => add(p)} />

          {/* Lista de Produtos Mobile-First */}
          <div className="mt-6">
            <h3 className="text-md font-medium mb-3">Produtos Cadastrados ({produtos.length})</h3>
            
            {/* Grid Mobile para Produtos */}
            <div className="grid grid-cols-1 gap-4">
              {produtos.map((p) => (
                <div key={p.id} className="bg-muted/50 rounded-lg p-4 border">
                  {/* Cabeçalho do Produto */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* Imagem */}
                    <div className="flex-shrink-0">
                      {p.imagem ? (
                        <img
                          src={p.imagem}
                          alt={p.nome}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Informações do Produto */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{p.nome}</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        {p.categoria || 'Sem categoria'}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        R$ {p.preco.toFixed(2)}
                      </p>
                      {p.descricao && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {p.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => {
                        const nome = prompt('Nome', p.nome) ?? p.nome;
                        const categoria = prompt('Categoria', p.categoria || '') || undefined;
                        const preco = parseFloat(prompt('Preço', String(p.preco)) || String(p.preco));
                        const descricao = prompt('Descrição', p.descricao || '') || undefined;
                        if (!isNaN(preco)) updateProd(p.id, { nome, categoria, preco, descricao });
                      }}
                      className="flex-1"
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => confirm('Excluir produto?') && remove(p.id)}
                      className="flex-1"
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mensagem quando não há produtos */}
            {produtos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum produto cadastrado</p>
                <p className="text-sm">Adicione seu primeiro produto acima</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function ProdForm({ onAdd }: { onAdd: (p: Omit<Produto, 'id'>) => void }) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState<string | undefined>();

  const canAdd = useMemo(() => nome.trim() && !isNaN(parseFloat(preco)), [nome, preco]);

  const handleAdd = () => {
    onAdd({ 
      nome, 
      categoria: categoria || undefined, 
      preco: parseFloat(preco.replace(',', '.')),
      descricao: descricao || undefined,
      imagem
    });
    setNome('');
    setCategoria('');
    setPreco('');
    setDescricao('');
    setImagem(undefined);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <h3 className="text-md font-medium mb-3">Adicionar Novo Produto</h3>
      
      {/* Campos em Grid Mobile-First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Nome do Produto</Label>
          <Input 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            placeholder="Ex: Cerveja 600ml"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Categoria</Label>
          <Input 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)} 
            placeholder="Ex: Bebidas"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Preço (R$)</Label>
          <Input 
            value={preco} 
            onChange={(e) => setPreco(e.target.value)} 
            placeholder="0,00" 
            type="number"
            step="0.01"
            min="0"
            className="w-full"
          />
        </div>
      </div>
      
      {/* Descrição */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Descrição</Label>
        <Textarea 
          value={descricao} 
          onChange={(e) => setDescricao(e.target.value)} 
          placeholder="Descreva o produto para os clientes..."
          rows={3}
          className="w-full"
        />
      </div>

      {/* Upload de Imagem */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Imagem do Produto</Label>
        <ImageUpload
          currentImage={imagem}
          onImageChange={setImagem}
        />
      </div>

      {/* Botão de Adicionar */}
      <div className="flex justify-end pt-2">
        <Button 
          disabled={!canAdd} 
          onClick={handleAdd}
          size="lg"
          className="w-full sm:w-auto px-8"
        >
          Adicionar Produto
        </Button>
      </div>
    </div>
  );
}

