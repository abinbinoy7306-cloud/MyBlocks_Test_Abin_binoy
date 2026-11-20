import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, PowerOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getTenants, createTenant, updateTenant } from '../../api/tenant.api';
import { getCountries, getCurrencies } from '../../api/lookup.api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import SectionHelp from '../../components/common/SectionHelp';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  plan: z.enum(['free', 'starter', 'pro', 'enterprise']),
  country_id: z.string().optional(),
  currency_id: z.string().optional(),
});

export default function TenantsPage() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const limit = 10;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { plan: 'free' },
  });

  const nameVal = watch('name');
  useEffect(() => {
    if (nameVal) {
      setValue('slug', nameVal.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }, [nameVal, setValue]);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTenants({ page, limit, search });
      setTenants(res.data?.data?.tenants || res.data?.tenants || (Array.isArray(res.data?.data) ? res.data.data : []));
      setTotal(res.data?.data?.total || res.data?.total || 0);
    } catch (_) { toast.error('Failed to load firms'); }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchTenants(); }, [fetchTenants]);

  useEffect(() => {
    getCountries()
      .then((r) => setCountries(r.data?.data?.countries || r.data?.countries || (Array.isArray(r.data?.data) ? r.data.data : [])))
      .catch(() => {});
    getCurrencies()
      .then((r) => setCurrencies(r.data?.data?.currencies || r.data?.currencies || (Array.isArray(r.data?.data) ? r.data.data : [])))
      .catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    try {
      await createTenant(data);
      toast.success('Firm created!');
      setModalOpen(false);
      reset();
      fetchTenants();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create firm');
    }
  };

  const toggleActive = async (t) => {
    try {
      await updateTenant(t.id, { is_active: !t.is_active });
      toast.success(`Firm ${t.is_active ? 'deactivated' : 'activated'}`);
      fetchTenants();
    } catch (_) { toast.error('Action failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-bold text-gray-900">All Firms</h1>
          <SectionHelp sectionKey="sa_tenants_directory" defaultTitle="Corporate Firms Directory" />
        </div>
        <Button icon={<Plus />} onClick={() => { reset(); setModalOpen(true); }}>Add New Firm</Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search firms…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Plan', 'Status', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!Array.isArray(tenants) || tenants.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-gray-400">No firms found</td></tr>
              ) : tenants.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 capitalize">{t.plan}</td>
                  <td className="px-4 py-3">
                    <Badge variant={t.is_active ? 'success' : 'error'}>{t.is_active ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/sa/tenants/${t.id}`)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View"><Eye size={15} /></button>
                      <button onClick={() => toggleActive(t)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Toggle"><PowerOff size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 pb-4">
            <Pagination page={page} totalPages={Math.ceil(total / limit)} onPage={setPage} />
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Firm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Firm Name" placeholder="Acme Corp" error={errors.name?.message} {...register('name')} />
          <Input label="Slug" placeholder="acme-corp" error={errors.slug?.message} {...register('slug')} />
          <Select label="Plan" error={errors.plan?.message} {...register('plan')}>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </Select>
          <Select label="Country" error={errors.country_id?.message} {...register('country_id')}>
            <option value="">— Select Country —</option>
            {countries.map((c) => <option key={c.id} value={c.id}>{c.flag_emoji} {c.name}</option>)}
          </Select>
          <Select label="Currency" error={errors.currency_id?.message} {...register('currency_id')}>
            <option value="">— Select Currency —</option>
            {currencies.map((c) => <option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Create Firm</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
