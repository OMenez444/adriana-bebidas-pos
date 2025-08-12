import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useComandasStore } from '@/state/comandas';
import { useProductsStore } from '@/state/products';
import { MetodoPagamento } from '@/state/types';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { CircleMinus, CirclePlus, Printer, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ComandaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getById = useComandasStore((s) => s.getById);
  const comanda = getById(id!);
  const produtos = useProductsStore((s) => s.produtos);
  const addItem = useComandasStore((s) => s.addItem);
  const decItem = useComandasStore((s) => s.decItem);
  const removeItem = useComandasStore((s) => s.removeItem);
  const setDesconto = useComandasStore((s) => s.setDesconto);
  const fechar = useComandasStore((s) => s.fecharComPagamento);

  const [q, setQ] = useState('');
  const [pagOpen, setPagOpen] = useState(false);
  const [metodo, setMetodo] = useState<MetodoPagamento>('DINHEIRO');
  const [valorRecebido, setValorRecebido] = useState('');

  const produtosFiltrados = useMemo(() => {
    const nq = q.toLowerCase();
    return produtos.filter((p) => `${p.nome} ${p.categoria ?? ''}`.toLowerCase().includes(nq));
  }, [q, produtos]);

  if (!comanda) return <AppLayout title="Comanda">Comanda não encontrada.</AppLayout>;

  const taxaValor = comanda.subtotal * (comanda.taxaServicoPercent / 100);
  const totalCalc = Math.max(0, comanda.subtotal + taxaValor - comanda.descontoValor);
  const troco = valorRecebido ? Math.max(0, parseFloat(valorRecebido.replace(',', '.')) - totalCalc) : 0;

  return (
    <AppLayout title={`Comanda ${comanda.id}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm opacity-80">{comanda.tipo === 'MESA' ? `Mesa ${comanda.mesaNumero}` : comanda.clienteNome} · {comanda.status} · {formatDateTime(comanda.criadoEm)}</div>
        <Button variant="secondary" onClick={() => navigate('/mesas')}>Voltar para Mesas</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <section className="md:col-span-2 space-y-3">
          <div>
            <Input placeholder="Buscar produto" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {produtosFiltrados.map((p) => (
                <Card key={p.id} className="cursor-pointer" onClick={() => addItem(comanda.id, p)}>
                  <CardHeader className="py-2 text-sm">{p.nome}</CardHeader>
                  <CardContent className="py-2 text-xs opacity-80">{p.categoria} · {formatCurrency(p.preco)}</CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="w-40">Qtd</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comanda.itens.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell>{it.nomeProduto}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="secondary" onClick={() => decItem(comanda.id, it.id)}>
                          <CircleMinus className="h-4 w-4" />
                        </Button>
                        <div>{it.qtd}</div>
                        <Button size="icon" onClick={() => addItem(comanda.id, produtos.find((p) => p.id === it.produtoId)!)}>
                          <CirclePlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(it.precoUnit)}</TableCell>
                    <TableCell>{formatCurrency(it.total)}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="destructive" onClick={() => removeItem(comanda.id, it.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <aside className="space-y-3">
          <Card>
            <CardContent className="space-y-2 pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(comanda.subtotal)}</span></div>
              <div className="flex justify-between"><span>Taxa de serviço ({comanda.taxaServicoPercent}%)</span><span>{formatCurrency(taxaValor)}</span></div>
              <div className="flex justify-between items-center">
                <span>Desconto (R$)</span>
                <Input className="w-32" value={String(comanda.descontoValor)} onChange={(e) => setDesconto(comanda.id, parseFloat(e.target.value || '0'))} />
              </div>
              <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{formatCurrency(totalCalc)}</span></div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
            <Button variant="destructive" onClick={() => { if (confirm('Cancelar comanda?')) { useComandasStore.getState().setStatus(comanda.id, 'CANCELADA'); alert('Comanda cancelada.'); } }}>Cancelar</Button>
            <Button className="col-span-2" size="lg" onClick={() => setPagOpen(true)}>Fechar/Pagar</Button>
          </div>

          {pagOpen && (
            <Card>
              <CardContent className="space-y-3 pt-4">
                <div className="text-sm">Escolha o método de pagamento</div>
                <div className="flex gap-2">
                  {(['DINHEIRO','CARTAO','PIX'] as MetodoPagamento[]).map((m) => (
                    <Button key={m} variant={metodo === m ? 'default' : 'secondary'} onClick={() => setMetodo(m)}>{m}</Button>
                  ))}
                </div>
                <div>
                  <Label>Valor recebido (opcional)</Label>
                  <Input value={valorRecebido} onChange={(e) => setValorRecebido(e.target.value)} placeholder="0,00" />
                  {valorRecebido && <div className="text-sm opacity-80 mt-1">Troco: {formatCurrency(Math.max(0, troco))}</div>}
                </div>
                <Button onClick={() => { 
                  fechar(comanda.id, metodo, valorRecebido ? parseFloat(valorRecebido.replace(',', '.')) : undefined); 
                  
                  // Mensagem personalizada baseada no tipo de comanda
                  if (comanda.tipo === 'MESA') {
                    alert(`Pagamento registrado com sucesso! Mesa ${comanda.mesaNumero} fechada.`);
                    // Redireciona para o painel de mesas após fechar
                    setTimeout(() => {
                      navigate('/mesas');
                    }, 1500); // Aguarda 1.5 segundos para o usuário ver a mensagem
                  } else {
                    alert('Pagamento registrado com sucesso! Comanda de delivery fechada.');
                    // Para delivery, volta para a lista de comandas
                    setTimeout(() => {
                      navigate('/comandas');
                    }, 1500);
                  }
                }}>
                  Confirmar pagamento
                </Button>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </AppLayout>
  );
}
