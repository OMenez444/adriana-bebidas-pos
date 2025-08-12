export const formatCurrency = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export const formatDateTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('pt-BR') : '';

export const normalizeSearch = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
