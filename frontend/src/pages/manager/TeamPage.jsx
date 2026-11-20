import { useEffect, useState, useCallback } from 'react';
import { Search, Mail, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { getUsers } from '../../api/user.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/ui/Pagination';
import SectionHelp from '../../components/common/SectionHelp';
import { formatDate } from '../../utils/format';

export default function TeamPage() {
  const { tenant } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page, limit, search, role: 'team_user' });
      setUsers(res.data?.data?.users || res.data?.users || (Array.isArray(res.data?.data) ? res.data.data : []));
      setTotal(res.data?.data?.total || res.data?.total || 0);
    } catch (_) {
      toast.error('Failed to load team roster');
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-bold text-gray-900">My Team Members</h1>
          <SectionHelp sectionKey="manager_team_roster" defaultTitle="My Team Members" />
        </div>
        <p className="text-sm text-gray-500">Collaborate and manage assignments within {tenant?.name || 'your firm'}</p>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search team member..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                  <th className="pb-3">Member</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {!Array.isArray(users) || users.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">No team members found</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                            {u.first_name?.[0]}{u.last_name?.[0]}
                          </div>
                          <span className="font-medium text-gray-900">{u.first_name} {u.last_name}</span>
                        </div>
                      </td>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination currentPage={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} />
      </Card>
    </div>
  );
}
