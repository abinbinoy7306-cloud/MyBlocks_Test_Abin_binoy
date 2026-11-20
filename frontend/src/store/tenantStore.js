import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTenantStore = create(
  persist(
    (set) => ({
      tenant: null,
      settings: null,
      setTenant: (tenant) => set({ tenant }),
      setSettings: (settings) => set({ settings }),
      clear: () => set({ tenant: null, settings: null }),
    }),
    { name: 'nclc-tenant' }
  )
);
