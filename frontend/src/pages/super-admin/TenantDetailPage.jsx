import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Globe, DollarSign, Calendar, Users, ShieldCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTenant, getTenantUsers, getTenantStats } from '../../api/tenant.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import SectionHelp from '../../components/common/SectionHelp';
import { formatDate } from '../../utils/format';

export default function TenantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, uRes, sRes] = await Promise.all([
        getTenant(id),
        getTenantUsers(id),
        getTenantStats(id).catch(() => ({ data: {} })),
      ]);
      setTenant(tRes.data?.data?.tenant || tRes.data?.tenant || tRes.data?.data || tRes.data);
      const userList = uRes.data?.data?.users || uRes.data?.users || (Array.isArray(uRes.data?.data) ? uRes.data.data : []);
      setUsers(userList);
      setStats(sRes.data?.data?.stats || sRes.data?.stats || sRes.data?.data || sRes.data || {});
    } catch (_) {
      toast.error('Failed to load firm details');
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Firm not found</p>
        <Button className="mt-4" onClick={() => navigate('/sa/tenants')}>
          Back to Firms
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/sa/tenants')} icon={<ArrowLeft size={16} />}>
          Back
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
            <SectionHelp sectionKey="sa_tenant_details" defaultTitle="Tenant 360° Management" />
            <Badge variant={tenant.is_active ? 'success' : 'error'}>
              {tenant.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <span className="text-xs uppercase px-2 py-0.5 rounded font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {tenant.plan} plan
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Slug: {tenant.slug}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="Firm Details">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-2"><Globe size={16} /> Country</span>
              <span className="font-medium text-gray-900">{tenant.Country?.name || tenant.country || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-2"><DollarSign size={16} /> Currency</span>
              <span className="font-medium text-gray-900">{tenant.Currency?.code || tenant.currency || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-2"><Calendar size={16} /> Created On</span>
              <span className="font-medium text-gray-900">
                {formatDate(tenant.createdAt)}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Usage & Roles">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-2"><Users size={16} /> Total Staff</span>
              <span className="font-medium text-gray-900">{Array.isArray(users) ? users.length : 0}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-2"><ShieldCheck size={16} /> Firm Admins</span>
              <span className="font-medium text-gray-900">
                {Array.isArray(users) ? users.filter(u => u.role === 'firm_admin').length : 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-2"><Users size={16} /> Managers</span>
              <span className="font-medium text-gray-900">
                {Array.isArray(users) ? users.filter(u => u.role === 'manager').length : 0}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Settings Overview">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Timezone</span>
              <span className="font-medium text-gray-900">{tenant.TenantSetting?.timezone || 'UTC'}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Enabled</span>
              <span className="font-medium text-gray-900">
                {tenant.TenantSetting?.is_gst_enabled ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GSTIN</span>
              <span className="font-medium text-gray-900">{tenant.TenantSetting?.gstin || 'None'}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title={`Users in ${tenant.name} (${users.length})`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                <th className="pb-3">User</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!Array.isArray(users) || users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    No users enrolled in this firm yet.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">
                      {u.first_name} {u.last_name}
                    </td>
                    <td className="py-3 text-gray-600">
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {u.email}</span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {u.role?.replace('_', ' ')}
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
    </div>
  );
}
