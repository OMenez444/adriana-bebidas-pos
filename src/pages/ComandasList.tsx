import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useComandasStore } from '@/state/comandas';
import { useProductsStore } from '@/state/products';
import { useSettingsStore } from '@/state/settings';
import { Comanda, Produto } from '@/state/types';
import { formatCurrency, formatDateTime, normalizeSearch } from '@/utils/format';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Upload, FileText, Users, Coffee, Calendar, DollarSign, Package, Eye, Printer, RotateCcw, XCircle } from 'lucide-react';

export default function ComandasList() {
  const navigate = useNavigate();
  const comandas = useComandasStore((s) => s.comandas);
  const replaceComandas = useComandasStore((s) => s.replaceAll);
  const produtos = useProductsStore((s) => s.produtos);
  const replaceProdutos = useProductsStore((s) => s.replaceAll);
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.update);
  const setStatus = useComandasStore((s) => s.setStatus);

  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const nq = normalizeSearch(q);
    return comandas.filter((c) => {
      const hay = `${c.id} ${c.tipo} ${c.mesaNumero ?? ''} ${c.clienteNome ?? ''} ${c.status}`;
      return normalizeSearch(hay).includes(nq);
    });
  }, [q, comandas]);

  const exportJson = () => {
    const blob = new Blob([
      JSON.stringify(
        { settings, produtos, comandas },
        null,
        2
      ),
    ], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-disk-bebidas-adriana.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || typeof data !== 'object') throw new Error('Arquivo inválido');
        if (!confirm('Importar irá substituir TODO o estado atual. Continuar?')) return;
        updateSettings(data.settings ?? settings);
        replaceProdutos(Array.isArray(data.produtos) ? (data.produtos as Produto[]) : produtos);
        replaceComandas(Array.isArray(data.comandas) ? (data.comandas as Comanda[]) : comandas);
        alert('Importação concluída.');
      } catch (e) {
        alert('Falha ao importar JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <AppLayout title="Comandas">
      {/* Header com Estatísticas */}
      <div className="mb-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Gerenciamento de Comandas
        </h2>
        
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{comandas.length}</div>
            <div className="text-xs text-muted-foreground">Comandas</div>
          </div>
          
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coffee className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Ativas</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {comandas.filter(c => c.status === 'ABERTA' || c.status === 'EM_PREPARO').length}
            </div>
            <div className="text-xs text-muted-foreground">Em andamento</div>
          </div>
          
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Mesas</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {comandas.filter(c => c.tipo === 'MESA').length}
            </div>
            <div className="text-xs text-muted-foreground">Comandas de mesa</div>
          </div>
          
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Valor Total</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(comandas.reduce((sum, c) => sum + c.total, 0))}
            </div>
            <div className="text-xs text-muted-foreground">Soma de todas</div>
          </div>
        </div>
      </div>

      {/* Barra de Busca e Ações */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por ID, mesa, cliente, status..." 
              value={q} 
              onChange={(e) => setQ(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={exportJson} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer hover:bg-accent transition-colors">
              <Upload className="w-4 h-4" />
              Importar
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files && importJson(e.target.files[0])} />
            </label>
          </div>
        </div>
        
        {/* Filtros Rápidos */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={q === '' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setQ('')}
          >
            Todas ({comandas.length})
          </Button>
          <Button 
            variant={q.includes('ABERTA') ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setQ('ABERTA')}
          >
            Abertas ({comandas.filter(c => c.status === 'ABERTA').length})
          </Button>
          <Button 
            variant={q.includes('MESA') ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setQ('MESA')}
          >
            Mesas ({comandas.filter(c => c.tipo === 'MESA').length})
          </Button>
        </div>
      </div>

      {/* Lista de Comandas Mobile-First */}
      <div className="space-y-4">
        <h3 className="text-md font-medium flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          Comandas ({filtered.length})
        </h3>
        
        {/* Grid de Comandas Responsivo */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((c) => (
            <Card key={c.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-base font-semibold truncate">
                        {c.tipo === 'MESA' ? `Mesa ${c.mesaNumero}` : c.clienteNome || 'Cliente'}
                      </CardTitle>
                      <Badge variant={
                        c.status === 'ABERTA' ? 'default' 
                        : c.status === 'EM_PREPARO' ? 'secondary'
                        : c.status === 'FECHADA_PAGA' ? 'outline'
                        : 'destructive'
                      } className={`
                        ${c.status === 'ABERTA' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                        ${c.status === 'EM_PREPARO' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                        ${c.status === 'FECHADA_PAGA' ? 'bg-primary/10 text-primary border-primary/30' : ''}
                        ${c.status === 'CANCELADA' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                      `}>
                      {c.status === 'ABERTA' && <Eye className="w-3 h-3 mr-1" />}
                      {c.status === 'EM_PREPARO' && <Package className="w-3 h-3 mr-1" />}
                      {c.status === 'FECHADA_PAGA' && <DollarSign className="w-3 h-3 mr-1" />}
                      {c.status === 'CANCELADA' && <XCircle className="w-3 h-3 mr-1" />}
                      {c.status}
                    </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground font-mono mb-2">
                      ID: {c.id.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Informações da Comanda */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Tipo</div>
                    <div className="font-medium">{c.tipo}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Itens</div>
                    <div className="font-medium">{c.itens.length}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Total</div>
                    <div className="font-bold text-primary">{formatCurrency(c.total)}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Criada</div>
                    <div className="font-medium text-xs">{formatDateTime(c.criadoEm)}</div>
                  </div>
                </div>
                
                {/* Botões de Ação */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/comanda/${c.id}`)}
                    className="flex-1 sm:flex-none"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Abrir
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => window.print()}
                    className="flex-1 sm:flex-none"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                  
                  {c.status === 'FECHADA_PAGA' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => { if (confirm('Reabrir comanda?')) setStatus(c.id, 'ABERTA'); }}
                      className="flex-1 sm:flex-none"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reabrir
                    </Button>
                  )}
                  
                  {(c.status === 'ABERTA' || c.status === 'EM_PREPARO') && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => { if (confirm('Cancelar comanda?')) setStatus(c.id, 'CANCELADA'); }}
                      className="flex-1 sm:flex-none"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Mensagem quando não há comandas */}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhuma comanda encontrada</p>
            <p className="text-sm">
              {q ? `Não há comandas que correspondam à busca "${q}"` : 'Comece criando sua primeira comanda'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
