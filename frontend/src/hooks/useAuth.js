import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, accessToken, tenant, setAuth, logout, setUser } = useAuthStore();
  return {
    user,
    accessToken,
    tenant,
    isAuthenticated: !!accessToken && !!user,
    setAuth,
    logout,
    setUser,
  };
};
