import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      tenant: null,
      setAuth: ({ user, accessToken, refreshToken, tenant }) =>
        set({ user, accessToken, refreshToken, tenant }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, tenant: null }),
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
    }),
    { name: 'nclc-auth' }
  )
);
