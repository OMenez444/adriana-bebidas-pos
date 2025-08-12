import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Produto } from './types';
import { PRODUCTS_STORAGE_KEY } from './settings';

const SEED_PRODUCTS: Produto[] = [
  { 
    id: nanoid(), 
    nome: 'Cerveja 600ml', 
    categoria: 'Bebidas', 
    preco: 14.0,
    descricao: 'Cerveja gelada 600ml - escolha sua marca preferida'
  },
  { 
    id: nanoid(), 
    nome: 'Refrigerante Lata', 
    categoria: 'Bebidas', 
    preco: 7.0,
    descricao: 'Refrigerante em lata 350ml - Coca-Cola, Pepsi, Sprite'
  },
  { 
    id: nanoid(), 
    nome: 'Água 500ml', 
    categoria: 'Bebidas', 
    preco: 4.0,
    descricao: 'Água mineral natural 500ml'
  },
  { 
    id: nanoid(), 
    nome: 'Porção de Fritas', 
    categoria: 'Porções', 
    preco: 28.0,
    descricao: 'Porção generosa de batatas fritas crocantes'
  },
  { 
    id: nanoid(), 
    nome: 'Energético 250ml', 
    categoria: 'Bebidas', 
    preco: 10.0,
    descricao: 'Energético Red Bull, Monster ou similar 250ml'
  },
];

interface ProductsState {
  produtos: Produto[];
  add: (p: Omit<Produto, 'id'>) => void;
  update: (id: string, partial: Partial<Produto>) => void;
  remove: (id: string) => void;
  replaceAll: (list: Produto[]) => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set) => ({
      produtos: SEED_PRODUCTS,
      add: (p) => set((s) => ({ produtos: [{ ...p, id: nanoid() }, ...s.produtos] })),
      update: (id, partial) =>
        set((s) => ({
          produtos: s.produtos.map((x) => (x.id === id ? { ...x, ...partial } : x)),
        })),
      remove: (id) => set((s) => ({ produtos: s.produtos.filter((x) => x.id !== id) })),
      replaceAll: (list) => set(() => ({ produtos: list })),
    }),
    { name: PRODUCTS_STORAGE_KEY, storage: createJSONStorage(() => localStorage) }
  )
);
