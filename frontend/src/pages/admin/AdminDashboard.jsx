import { useEffect, useState } from 'react';
import { Users, UserCheck, ShieldAlert, Settings, Plus, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUsers } from '../../api/user.api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import SectionHelp from '../../components/common/SectionHelp';
import { formatDate } from '../../utils/format';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, tenant } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers({ limit: 5 })
      .then((res) => {
        const uList = res.data?.data?.users || res.data?.users || (Array.isArray(res.data?.data) ? res.data.data : []);
        setUsers(uList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const userList = Array.isArray(users) ? users : [];
  const totalUsers = userList.length;
  const managers = userList.filter((u) => u.role === 'manager').length;
  const teamUsers = userList.filter((u) => u.role === 'team_user').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Firm Workspace Dashboard</h1>
            <SectionHelp sectionKey="admin_dashboard_overview" defaultTitle="Firm Workspace Dashboard" />
            {tenant?.name && (
              <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-indigo-100">
                {tenant.name}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Manage your firm team and settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Settings size={16} />} onClick={() => navigate('/admin/settings')}>
            Settings
          </Button>
          <Button icon={<Plus size={16} />} onClick={() => navigate('/admin/users')}>
            Manage Users
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard icon={Users} label="Total Firm Staff" value={totalUsers} color="bg-indigo-500" />
            <StatCard icon={UserCheck} label="Managers" value={managers} color="bg-blue-500" />
            <StatCard icon={Building2} label="Team Members" value={teamUsers} color="bg-emerald-500" />
          </div>

          <Card title="Team Directory Preview">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {userList.length === 0 ? (
                    <tr><td colSpan={5} className="py-6 text-center text-gray-400">No team members yet</td></tr>
                  ) : (
                    userList.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">{u.first_name} {u.last_name}</td>
                        <td className="py-3 text-gray-600">{u.email}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3">
                          <Badge variant={u.is_active ? 'success' : 'error'}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 text-gray-400">
                          {formatDate(u.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
