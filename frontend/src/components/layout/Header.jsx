import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import TenantBadge from '../common/TenantBadge';

export default function Header() {
  const { user } = useAuth();
  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || 'User';

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <TenantBadge />
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{fullName}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
        </div>
        <Avatar name={fullName} src={user?.avatar_url} />
      </div>
    </header>
  );
}
