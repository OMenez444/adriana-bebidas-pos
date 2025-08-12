export type TipoComanda = 'MESA' | 'DELIVERY';
export type StatusComanda = 'ABERTA' | 'EM_PREPARO' | 'FECHADA_PAGA' | 'CANCELADA';
export type MetodoPagamento = 'DINHEIRO' | 'CARTAO' | 'PIX';

export interface Produto {
  id: string;
  nome: string;
  categoria?: string;
  preco: number;
  imagem?: string; // Base64 da imagem
  descricao?: string; // Descrição opcional do produto
}

export interface ItemComanda {
  id: string;
  produtoId: string;
  nomeProduto: string;
  qtd: number;
  precoUnit: number;
  total: number;
}

export interface Pagamento {
  metodo: MetodoPagamento;
  valorRecebido?: number;
  troco?: number;
}

export interface Comanda {
  id: string;
  tipo: TipoComanda;
  mesaNumero?: number;
  clienteNome?: string;
  status: StatusComanda;
  itens: ItemComanda[];
  subtotal: number;
  taxaServicoPercent: number;
  descontoValor: number;
  total: number;
  criadoEm: string; // ISO
  fechadoEm?: string; // ISO
  pagamento?: Pagamento;
}

export interface Settings {
  lojaNome: string;
  adminPin: string;
  taxaServicoPercent: number;
  mesasCount: number;
}
