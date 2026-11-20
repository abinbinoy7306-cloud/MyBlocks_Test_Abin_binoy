import { useTenantStore } from '../../store/tenantStore';
import { useAuth } from '../../hooks/useAuth';

export default function TenantBadge() {
  const { tenant: storeTenant } = useTenantStore();
  const { tenant: authTenant } = useAuth();
  const name = storeTenant?.name || authTenant?.name || 'NCLC';
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
      {name}
    </span>
  );
}
