import { useEffect, useState } from 'react';
import { Building2, Users, Globe, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTenants } from '../../api/tenant.api';
import { getUsers } from '../../api/user.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
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

export default function SADashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ tenants: 0, users: 0, active: 0, countries: 0 });
  const [recentTenants, setRecentTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [tRes, uRes] = await Promise.all([
          getTenants({ limit: 5, page: 1 }),
          getUsers({ limit: 1 }),
        ]);
        const tenants = tRes.data?.data?.tenants || tRes.data?.tenants || (Array.isArray(tRes.data?.data) ? tRes.data.data : []);
        const totalTenants = tRes.data?.data?.total || tRes.data?.total || tenants.length;
        const totalUsers = uRes.data?.data?.total || uRes.data?.total || 0;
        const activeTenants = tenants.filter((t) => t.is_active).length;
        const countries = [...new Set(tenants.map((t) => t.country_id).filter(Boolean))].length;
        setStats({ tenants: totalTenants, users: totalUsers, active: activeTenants, countries });
        setRecentTenants(tenants.slice(0, 5));
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <SectionHelp sectionKey="sa_dashboard_overview" defaultTitle="Super Admin KPI Overview" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Platform-wide overview</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<Plus />} onClick={() => navigate('/sa/tenants/new')}>
            Add Firm
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard icon={Building2} label="Total Firms" value={stats.tenants} color="bg-indigo-500" />
            <StatCard icon={Users} label="Total Users" value={stats.users} color="bg-blue-500" />
            <StatCard icon={TrendingUp} label="Active Tenants" value={stats.active} color="bg-green-500" />
            <StatCard icon={Globe} label="Countries" value={stats.countries} color="bg-orange-500" />
          </div>

          <Card
            title={
              <div className="flex items-center gap-1.5">
                <span>Recent Firms</span>
                <SectionHelp sectionKey="sa_recent_firms" defaultTitle="Recent Firms Activity" />
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr>
                    {['Firm Name', 'Plan', 'Status', 'Created'].map((h) => (
                      <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentTenants.length === 0 ? (
                    <tr><td colSpan={4} className="py-6 text-center text-sm text-gray-400">No firms yet</td></tr>
                  ) : (
                    recentTenants.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/sa/tenants/${t.id}`)}>
                        <td className="py-3 text-sm font-medium text-gray-900">{t.name}</td>
                        <td className="py-3 text-sm text-gray-500 capitalize">{t.plan}</td>
                        <td className="py-3">
                          <Badge variant={t.is_active ? 'success' : 'error'}>
                            {t.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-gray-400">
                          {formatDate(t.createdAt)}
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
