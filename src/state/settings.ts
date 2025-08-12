import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Settings } from './types';

const SEED_SETTINGS: Settings = {
  lojaNome: 'DISK BEBIDAS ADRIANA',
  adminPin: '2024',
  taxaServicoPercent: 10,
  mesasCount: 12,
};

interface SettingsState {
  settings: Settings;
  update: (partial: Partial<Settings>) => void;
  resetAll: () => void; // factory reset
}

export const SETTINGS_STORAGE_KEY = 'adriana-settings';
export const PRODUCTS_STORAGE_KEY = 'adriana-products';
export const COMANDAS_STORAGE_KEY = 'adriana-comandas';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: SEED_SETTINGS,
      update: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),
      resetAll: () => {
        try {
          localStorage.removeItem(SETTINGS_STORAGE_KEY);
          localStorage.removeItem(PRODUCTS_STORAGE_KEY);
          localStorage.removeItem(COMANDAS_STORAGE_KEY);
          // optional: keep a small flag
        } finally {
          window.location.reload();
        }
      },
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
