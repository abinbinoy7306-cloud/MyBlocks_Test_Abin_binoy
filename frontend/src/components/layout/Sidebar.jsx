import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { logout as logoutApi } from '../../api/auth.api';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  User,
  LogOut,
  Home,
} from 'lucide-react';

const navByRole = {
  super_admin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/sa/dashboard' },
    { label: 'All Firms', icon: Building2, to: '/sa/tenants' },
    { label: 'All Users', icon: Users, to: '/sa/users' },
  ],
  firm_admin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
    { label: 'Users', icon: Users, to: '/admin/users' },
    { label: 'Firm Settings', icon: Settings, to: '/admin/settings' },
  ],
  manager: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/manager/dashboard' },
    { label: 'My Team', icon: Users, to: '/manager/team' },
  ],
  team_user: [{ label: 'Home', icon: Home, to: '/dashboard' }],
};

export default function Sidebar() {
  const { user } = useAuth();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const items = navByRole[user?.role] || [];

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (_) {}
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
            N
          </div>
          <span className="font-bold text-lg tracking-tight">NCLC</span>
        </div>
        {user?.role && (
          <span className="mt-1 block text-xs text-gray-400 capitalize">
            {user.role.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Profile + Logout */}
      <div className="px-3 py-4 border-t border-gray-700 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          <User size={18} />
          Profile
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-900/40 hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
