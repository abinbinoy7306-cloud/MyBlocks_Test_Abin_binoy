import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const roleRedirect = {
  super_admin: '/sa/dashboard',
  firm_admin: '/admin/dashboard',
  manager: '/manager/dashboard',
  team_user: '/dashboard',
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await login({ email: data.email, password: data.password });
      const payload = res.data?.data || res.data;
      const { user, accessToken, refreshToken, tenant } = payload;
      setAuth({ user, accessToken, refreshToken, tenant });
      toast.success(`Welcome back, ${user.first_name || user.email}!`);
      navigate(roleRedirect[user.role] || '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError('root', { message: msg });
      toast.error(msg);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-8 text-white text-center">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Building2 size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">NCLC Platform</h1>
          <p className="text-indigo-200 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-7 space-y-5">
          <Input
            label="Email address"
            type="email"
            placeholder="admin@nclc.com"
            icon={<Mail size={16} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                {...register('rememberMe')}
              />
              Remember me
            </label>
          </div>

          {errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            size="lg"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center mb-2">
              Quick Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'admin@nclc.com');
                  setValue('password', 'Admin@123');
                }}
                className="p-2 border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-left transition"
              >
                <div className="font-semibold text-gray-900">Super Admin</div>
                <div className="text-[11px] text-gray-500 truncate">admin@nclc.com</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'admin@acme.com');
                  setValue('password', 'Admin@123');
                }}
                className="p-2 border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-left transition"
              >
                <div className="font-semibold text-gray-900">Firm Admin</div>
                <div className="text-[11px] text-gray-500 truncate">admin@acme.com</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'manager@acme.com');
                  setValue('password', 'Manager@123');
                }}
                className="p-2 border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-left transition"
              >
                <div className="font-semibold text-gray-900">Manager</div>
                <div className="text-[11px] text-gray-500 truncate">manager@acme.com</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'user@acme.com');
                  setValue('password', 'User@1234');
                }}
                className="p-2 border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-left transition"
              >
                <div className="font-semibold text-gray-900">Team User</div>
                <div className="text-[11px] text-gray-500 truncate">user@acme.com</div>
              </button>
            </div>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 pb-5">
          © {new Date().getFullYear()} NCLC Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
