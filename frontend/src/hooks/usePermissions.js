import { useAuthStore } from '../store/authStore';

export const usePermissions = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  return {
    role,
    isSuperAdmin: role === 'super_admin',
    isFirmAdmin: role === 'firm_admin',
    isManager: role === 'manager',
    isTeamUser: role === 'team_user',
    can: (roles) => roles.includes(role),
  };
};
