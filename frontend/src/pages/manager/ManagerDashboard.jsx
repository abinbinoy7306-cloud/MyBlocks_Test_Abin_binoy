import { useEffect, useState } from 'react';
import { Users, CheckCircle, Clock, ShieldCheck, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUsers } from '../../api/user.api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import SectionHelp from '../../components/common/SectionHelp';
import { formatDate } from '../../utils/format';

export default function ManagerDashboard() {
  const { user, tenant } = useAuth();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers({ role: 'team_user' })
      .then((res) => {
        const list = res.data?.data?.users || res.data?.users || (Array.isArray(res.data?.data) ? res.data.data : []);
        setTeamMembers(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const memberList = Array.isArray(teamMembers) ? teamMembers : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold text-gray-900">Manager Command Center</h1>
            <SectionHelp sectionKey="manager_dashboard_overview" defaultTitle="Manager Operations Center" />
          </div>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.first_name}! Operating within <span className="font-semibold text-gray-700">{tenant?.name || 'Firm Workspace'}</span>
          </p>
        </div>
        <Button onClick={() => navigate('/manager/team')} icon={<Users size={16} />}>
          View Full Team
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-500">
                <Users size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{memberList.length}</p>
                <p className="text-sm text-gray-500">Active Direct Reports</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500">
                <CheckCircle size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {memberList.filter(u => u.is_active).length}
                </p>
                <p className="text-sm text-gray-500">Online / Available</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500">
                <ShieldCheck size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-500">Team SLA Compliance</p>
              </div>
            </div>
          </div>

          <Card
            title={
              <div className="flex items-center gap-1.5">
                <span>My Team Roster</span>
                <SectionHelp sectionKey="manager_team_roster" defaultTitle="My Team Roster" />
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Onboarded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {memberList.length === 0 ? (
                    <tr><td colSpan={5} className="py-6 text-center text-gray-400">No team members assigned yet.</td></tr>
                  ) : (
                    memberList.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">{m.first_name} {m.last_name}</td>
                        <td className="py-3 text-gray-600">
                          <span className="flex items-center gap-1.5"><Mail size={14} /> {m.email}</span>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {m.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3">
                          <Badge variant={m.is_active ? 'success' : 'error'}>
                            {m.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 text-gray-400">
                          {formatDate(m.createdAt)}
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
