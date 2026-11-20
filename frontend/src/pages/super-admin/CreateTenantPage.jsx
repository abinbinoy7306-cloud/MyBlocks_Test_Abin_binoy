import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { createTenant } from '../../api/tenant.api';
import { getCountries, getCurrencies } from '../../api/lookup.api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import SectionHelp from '../../components/common/SectionHelp';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  plan: z.enum(['free', 'starter', 'pro', 'enterprise']),
  country_id: z.string().optional(),
  currency_id: z.string().optional(),
});

export default function CreateTenantPage() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { plan: 'free' },
  });

  const nameVal = watch('name');
  useEffect(() => {
    if (nameVal) {
      setValue('slug', nameVal.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }, [nameVal, setValue]);

  useEffect(() => {
    Promise.all([getCountries(), getCurrencies()]).then(([cRes, curRes]) => {
      setCountries((cRes.data?.countries || cRes.data?.data || []).map((c) => ({ value: String(c.id), label: `${c.flag_emoji || ''} ${c.name}` })));
      setCurrencies((curRes.data?.currencies || curRes.data?.data || []).map((c) => ({ value: String(c.id), label: `${c.code} (${c.symbol})` })));
    }).catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    try {
      await createTenant({
        ...data,
        country_id: data.country_id ? parseInt(data.country_id) : undefined,
        currency_id: data.currency_id ? parseInt(data.currency_id) : undefined,
      });
      toast.success('Firm registered successfully');
      navigate('/sa/tenants');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create firm');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={() => navigate('/sa/tenants')} icon={<ArrowLeft size={16} />}>
          Back
        </Button>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold text-gray-900">Add New Firm</h1>
            <SectionHelp sectionKey="sa_create_tenant" defaultTitle="Tenant Onboarding Guide" />
          </div>
          <p className="text-sm text-gray-500">Register a new enterprise tenant organization</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Firm Name *" placeholder="e.g. Acme Corporation" error={errors.name?.message} {...register('name')} />
          <Input label="Slug / Subdomain *" placeholder="acme-corp" error={errors.slug?.message} {...register('slug')} />
          <Select label="Subscription Plan *" options={[
            { value: 'free', label: 'Free' },
            { value: 'starter', label: 'Starter' },
            { value: 'pro', label: 'Pro' },
            { value: 'enterprise', label: 'Enterprise' },
          ]} error={errors.plan?.message} {...register('plan')} />
          <Select label="Primary Country" options={countries} placeholder="Select country..." error={errors.country_id?.message} {...register('country_id')} />
          <Select label="Base Currency" options={currencies} placeholder="Select currency..." error={errors.currency_id?.message} {...register('currency_id')} />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => navigate('/sa/tenants')}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create Firm
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
