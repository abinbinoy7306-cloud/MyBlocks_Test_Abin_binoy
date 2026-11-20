import { useAuth } from '../../hooks/useAuth';
import { Calendar, Globe, DollarSign, Shield, CheckCircle2, FileText, Bell } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import SectionHelp from '../../components/common/SectionHelp';
import { formatDate } from '../../utils/format';

export default function UserDashboard() {
  const { user, tenant } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
              Personal Workspace
            </span>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-bold mt-1">
                Welcome back, {user?.first_name} {user?.last_name}!
              </h1>
              <SectionHelp sectionKey="user_dashboard_overview" defaultTitle="Personal Workspace" />
            </div>
            <p className="text-indigo-200 text-sm mt-1">
              Organization: <span className="text-white font-medium">{tenant?.name || 'Assigned Firm'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-lg text-xs font-medium">
              Role: {user?.role?.replace('_', ' ')}
            </span>
            <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active Status
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="Workspace Profile">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Primary Email</span>
              <span className="font-medium text-gray-900">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Firm Organization</span>
              <span className="font-medium text-gray-900">{tenant?.name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>Account Status</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span>Member Since</span>
              <span className="font-medium text-gray-900">
                {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Assigned Modules (NCLC Suite)">
          <div className="space-y-2.5 text-sm">
            {[
              { name: 'CRM & Lead Management', active: true },
              { name: 'Helpdesk & Support Tickets', active: true },
              { name: 'Self-Service HR & Leaves', active: true },
              { name: 'Personal Expense Reports', active: false },
            ].map((m) => (
              <div key={m.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="text-gray-700 text-xs font-medium">{m.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${m.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}>
                  {m.active ? 'Enabled' : 'Locked'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Notifications">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-100">
              <Bell size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold">Multi-Tenant Isolation Active</p>
                <p className="text-blue-700 mt-0.5">Your actions are encrypted and scoped to your organization.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-100">
              <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold">Security Health</p>
                <p className="text-emerald-700 mt-0.5">JWT token refresh and RBAC guards operating normally.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
