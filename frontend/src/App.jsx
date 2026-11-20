import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Super Admin
import SADashboard from './pages/super-admin/SADashboard';
import TenantsPage from './pages/super-admin/TenantsPage';
import TenantDetailPage from './pages/super-admin/TenantDetailPage';
import CreateTenantPage from './pages/super-admin/CreateTenantPage';
import AllUsersPage from './pages/super-admin/AllUsersPage';

// Firm Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import FirmSettingsPage from './pages/admin/FirmSettingsPage';

// Manager
import ManagerDashboard from './pages/manager/ManagerDashboard';
import TeamPage from './pages/manager/TeamPage';

// Team User
import UserDashboard from './pages/user/UserDashboard';

// Shared
import ProfilePage from './pages/shared/ProfilePage';
import NotFoundPage from './pages/shared/NotFoundPage';

function RoleRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  switch (user?.role) {
    case 'super_admin':
      return <Navigate to="/sa/dashboard" replace />;
    case 'firm_admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'manager':
      return <Navigate to="/manager/dashboard" replace />;
    case 'team_user':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/" element={<RoleRedirect />} />

        {/* Authenticated Application Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Super Admin Section */}
          <Route path="/sa/dashboard" element={<SADashboard />} />
          <Route path="/sa/tenants" element={<TenantsPage />} />
          <Route path="/sa/tenants/new" element={<CreateTenantPage />} />
          <Route path="/sa/tenants/:id" element={<TenantDetailPage />} />
          <Route path="/sa/users" element={<AllUsersPage />} />

          {/* Firm Admin Section */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/settings" element={<FirmSettingsPage />} />

          {/* Manager Section */}
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/team" element={<TeamPage />} />

          {/* Team User Section */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Shared Profile */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
