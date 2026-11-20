import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Mail, ShieldCheck, PowerOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { getUsers, createUser, deactivateUser } from '../../api/user.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/ui/Pagination';
import SectionHelp from '../../components/common/SectionHelp';
import { formatDate } from '../../utils/format';

const schema = z.object({
  first_name: z.string().min(1, 'First name required'),
  last_name: z.string().min(1, 'Last name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters'),
  role: z.enum(['firm_admin', 'manager', 'team_user']),
});

export default function UsersPage() {
  const { tenant } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const limit = 10;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'team_user' },
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page, limit, search, role: roleFilter || undefined });
      setUsers(res.data?.data?.users || res.data?.users || (Array.isArray(res.data?.data) ? res.data.data : []));
      setTotal(res.data?.data?.total || res.data?.total || 0);
    } catch (_) {
      toast.error('Failed to load team members');
    }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onSubmit = async (data) => {
    try {
      await createUser(data);
      toast.success('Team member added');
      reset();
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleDeactivate = async (u) => {
    if (!confirm(`Are you sure you want to deactivate ${u.first_name}?`)) return;
    try {
      await deactivateUser(u.id);
      toast.success('User deactivated');
      fetchUsers();
    } catch (_) {
      toast.error('Failed to deactivate user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold text-gray-900">Firm Users & Roles</h1>
            <SectionHelp sectionKey="admin_users_directory" defaultTitle="Firm Staff Directory" />
          </div>
          <p className="text-sm text-gray-500">Manage user access and permissions for {tenant?.name || 'your firm'}</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
          Add Team Member
        </Button>
      </div>

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Roles</option>
            <option value="firm_admin">Firm Admin</option>
            <option value="manager">Manager</option>
            <option value="team_user">Team User</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Added</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {!Array.isArray(users) || users.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-400">No users found</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">{u.first_name} {u.last_name}</td>
                      <td className="py-3 text-gray-600">
                        <span className="flex items-center gap-1.5"><Mail size={14} /> {u.email}</span>
                      </td>
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
                      <td className="py-3 text-right">
                        {u.is_active && (
                          <button
                            onClick={() => handleDeactivate(u)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                            title="Deactivate User"
                          >
                            <PowerOff size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination currentPage={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} />
      </Card>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); reset(); }} title="Add Team Member">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name *" error={errors.first_name?.message} {...register('first_name')} />
            <Input label="Last Name *" error={errors.last_name?.message} {...register('last_name')} />
          </div>
          <Input label="Email Address *" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Temporary Password *" type="password" error={errors.password?.message} {...register('password')} />
          <Select
            label="Role *"
            options={[
              { value: 'team_user', label: 'Team User' },
              { value: 'manager', label: 'Manager' },
              { value: 'firm_admin', label: 'Firm Admin' },
            ]}
            error={errors.role?.message}
            {...register('role')}
          />
          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Add User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
