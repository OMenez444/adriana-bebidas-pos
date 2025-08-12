import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Comanda, ItemComanda, MetodoPagamento, Produto, StatusComanda } from './types';
import { COMANDAS_STORAGE_KEY } from './settings';
import { useSettingsStore } from './settings';

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function recalc(c: Comanda): Comanda {
  const subtotal = round2(c.itens.reduce((acc, it) => acc + it.total, 0));
  const taxaValor = round2(subtotal * (c.taxaServicoPercent / 100));
  const total = Math.max(0, round2(subtotal + taxaValor - (c.descontoValor || 0)));
  return { ...c, subtotal, total };
}

interface ComandasState {
  comandas: Comanda[];
  openMesa: (mesaNumero: number) => Comanda;
  openDelivery: (clienteNome: string) => Comanda;
  getById: (id: string) => Comanda | undefined;
  addItem: (comandaId: string, produto: Produto) => void;
  decItem: (comandaId: string, itemId: string) => void;
  setItemQty: (comandaId: string, itemId: string, qtd: number) => void;
  removeItem: (comandaId: string, itemId: string) => void;
  setDesconto: (comandaId: string, valor: number) => void;
  setStatus: (comandaId: string, status: StatusComanda) => void;
  fecharComPagamento: (comandaId: string, metodo: MetodoPagamento, valorRecebido?: number) => void;
  replaceAll: (list: Comanda[]) => void;
}

export const useComandasStore = create<ComandasState>()(
  persist(
    (set, get) => ({
      comandas: [],
      openMesa: (mesaNumero) => {
        const existing = get().comandas.find(
          (c) => c.tipo === 'MESA' && c.mesaNumero === mesaNumero && (c.status === 'ABERTA' || c.status === 'EM_PREPARO')
        );
        if (existing) return existing;
        const taxa = useSettingsStore.getState().settings.taxaServicoPercent;
        const c: Comanda = {
          id: nanoid(),
          tipo: 'MESA',
          mesaNumero,
          status: 'ABERTA',
          itens: [],
          subtotal: 0,
          taxaServicoPercent: taxa,
          descontoValor: 0,
          total: 0,
          criadoEm: new Date().toISOString(),
        };
        set((s) => ({ comandas: [c, ...s.comandas] }));
        return c;
      },
      openDelivery: (clienteNome) => {
        const taxa = useSettingsStore.getState().settings.taxaServicoPercent;
        const c: Comanda = {
          id: nanoid(),
          tipo: 'DELIVERY',
          clienteNome,
          status: 'ABERTA',
          itens: [],
          subtotal: 0,
          taxaServicoPercent: taxa,
          descontoValor: 0,
          total: 0,
          criadoEm: new Date().toISOString(),
        };
        set((s) => ({ comandas: [c, ...s.comandas] }));
        return c;
      },
      getById: (id) => get().comandas.find((c) => c.id === id),
      addItem: (comandaId, produto) =>
        set((s) => {
          const comandas = s.comandas.map((c) => {
            if (c.id !== comandaId) return c;
            const existing = c.itens.find((i) => i.produtoId === produto.id);
            let itens: ItemComanda[];
            if (existing) {
              itens = c.itens.map((i) =>
                i.id === existing.id
                  ? { ...i, qtd: i.qtd + 1, total: round2((i.qtd + 1) * i.precoUnit) }
                  : i
              );
            } else {
              const novo: ItemComanda = {
                id: nanoid(),
                produtoId: produto.id,
                nomeProduto: produto.nome,
                qtd: 1,
                precoUnit: produto.preco,
                total: round2(produto.preco),
              };
              itens = [novo, ...c.itens];
            }
            return recalc({ ...c, itens });
          });
          return { comandas };
        }),
      decItem: (comandaId, itemId) =>
        set((s) => ({
          comandas: s.comandas.map((c) => {
            if (c.id !== comandaId) return c;
            const itens = c.itens
              .map((i) => (i.id === itemId ? { ...i, qtd: i.qtd - 1, total: round2((i.qtd - 1) * i.precoUnit) } : i))
              .filter((i) => i.qtd > 0);
            return recalc({ ...c, itens });
          }),
        })),
      setItemQty: (comandaId, itemId, qtd) =>
        set((s) => ({
          comandas: s.comandas.map((c) => {
            if (c.id !== comandaId) return c;
            const itens = c.itens.map((i) => (i.id === itemId ? { ...i, qtd, total: round2(qtd * i.precoUnit) } : i));
            return recalc({ ...c, itens });
          }),
        })),
      removeItem: (comandaId, itemId) =>
        set((s) => ({
          comandas: s.comandas.map((c) => {
            if (c.id !== comandaId) return c;
            const itens = c.itens.filter((i) => i.id !== itemId);
            return recalc({ ...c, itens });
          }),
        })),
      setDesconto: (comandaId, valor) =>
        set((s) => ({
          comandas: s.comandas.map((c) => (c.id === comandaId ? recalc({ ...c, descontoValor: Math.max(0, round2(valor)) }) : c)),
        })),
      setStatus: (comandaId, status) =>
        set((s) => ({
          comandas: s.comandas.map((c) => (c.id === comandaId ? { ...c, status } : c)),
        })),
      fecharComPagamento: (comandaId, metodo, valorRecebido) =>
        set((s) => ({
          comandas: s.comandas.map((c) => {
            if (c.id !== comandaId) return c;
            const troco = valorRecebido ? Math.max(0, round2(valorRecebido - c.total)) : undefined;
            return {
              ...c,
              status: 'FECHADA_PAGA',
              fechadoEm: new Date().toISOString(),
              pagamento: { metodo, valorRecebido, troco },
            };
          }),
        })),
      replaceAll: (list) => set(() => ({ comandas: list })),
    }),
    { name: COMANDAS_STORAGE_KEY, storage: createJSONStorage(() => localStorage) }
  )
);
