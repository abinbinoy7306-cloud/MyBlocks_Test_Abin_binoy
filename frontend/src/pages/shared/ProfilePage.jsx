import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile, resetUserPassword } from '../../api/user.api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import SectionHelp from '../../components/common/SectionHelp';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name required'),
  last_name: z.string().min(1, 'Last name required'),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password required'),
  new_password: z.string().min(6, 'Min 6 characters'),
  confirm_password: z.string().min(6, 'Confirm password required'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

export default function ProfilePage() {
  const { user, tenant } = useAuth();

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { isSubmitting: profileSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    },
  });

  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: pwdErrors, isSubmitting: pwdSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    try {
      await updateProfile(data);
      toast.success('Profile details updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await resetUserPassword(user.id, {
        currentPassword: data.current_password,
        newPassword: data.new_password,
      });
      toast.success('Password changed successfully');
      resetPasswordForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-bold text-gray-900">Account Profile</h1>
          <SectionHelp sectionKey="profile_personal" defaultTitle="Personal Account Profile" />
        </div>
        <p className="text-sm text-gray-500">Manage your personal credentials and security</p>
      </div>

      <Card
        title={
          <div className="flex items-center gap-1.5">
            <span>Account Overview</span>
            <SectionHelp sectionKey="profile_personal" defaultTitle="Account Overview" />
          </div>
        }
      >
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white text-xl font-bold flex items-center justify-center">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{user?.first_name} {user?.last_name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded font-semibold bg-gray-100 text-gray-800 capitalize">
                {user?.role?.replace('_', ' ')}
              </span>
              {tenant?.name && (
                <span className="text-xs text-indigo-600 font-medium">
                  • {tenant.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" {...regProfile('first_name')} />
            <Input label="Last Name" {...regProfile('last_name')} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={profileSubmitting}>Save Profile</Button>
          </div>
        </form>
      </Card>

      <Card
        title={
          <div className="flex items-center gap-1.5">
            <span>Change Password</span>
            <SectionHelp sectionKey="profile_password" defaultTitle="Security & Password Management" />
          </div>
        }
      >
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <Input label="Current Password" type="password" error={pwdErrors.current_password?.message} {...regPassword('current_password')} />
          <Input label="New Password" type="password" error={pwdErrors.new_password?.message} {...regPassword('new_password')} />
          <Input label="Confirm New Password" type="password" error={pwdErrors.confirm_password?.message} {...regPassword('confirm_password')} />
          <div className="flex justify-end">
            <Button type="submit" loading={pwdSubmitting}>Update Password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
