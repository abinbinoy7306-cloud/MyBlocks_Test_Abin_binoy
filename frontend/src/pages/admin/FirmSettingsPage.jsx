import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { getTenantSettings, updateTenantSettings, getTenant, updateTenant } from '../../api/tenant.api';
import { getCountries, getCurrencies } from '../../api/lookup.api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import SectionHelp from '../../components/common/SectionHelp';

const schema = z.object({
  name: z.string().min(2, 'Firm name required'),
  country_id: z.string().optional(),
  currency_id: z.string().optional(),
  timezone: z.string().optional(),
  date_format: z.string().optional(),
  fiscal_year_start: z.string().optional(),
  is_gst_enabled: z.boolean().optional(),
  gstin: z.string().optional(),
});

export default function FirmSettingsPage() {
  const { tenant } = useAuth();
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      is_gst_enabled: false,
      timezone: 'UTC',
      date_format: 'DD/MM/YYYY',
      fiscal_year_start: '01-01',
    },
  });

  const isGst = watch('is_gst_enabled');

  useEffect(() => {
    if (!tenant?.id) return;
    Promise.all([
      getTenant(tenant.id),
      getTenantSettings(tenant.id).catch(() => ({ data: {} })),
      getCountries(),
      getCurrencies(),
    ]).then(([tRes, sRes, cRes, curRes]) => {
      const t = tRes.data?.tenant || tRes.data?.data || tRes.data || {};
      const s = sRes.data?.settings || sRes.data?.data || sRes.data || {};

      setCountries((cRes.data?.countries || cRes.data?.data || []).map(c => ({ value: String(c.id), label: `${c.flag_emoji || ''} ${c.name}` })));
      setCurrencies((curRes.data?.currencies || curRes.data?.data || []).map(c => ({ value: String(c.id), label: `${c.code} (${c.symbol})` })));

      reset({
        name: t.name || '',
        country_id: t.country_id ? String(t.country_id) : '',
        currency_id: t.currency_id ? String(t.currency_id) : '',
        timezone: s.timezone || 'UTC',
        date_format: s.date_format || 'DD/MM/YYYY',
        fiscal_year_start: s.fiscal_year_start || '01-01',
        is_gst_enabled: !!s.is_gst_enabled,
        gstin: s.gstin || '',
      });
    }).catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, [tenant?.id, reset]);

  const onSubmit = async (data) => {
    try {
      await updateTenant(tenant.id, {
        name: data.name,
        country_id: data.country_id ? parseInt(data.country_id) : undefined,
        currency_id: data.currency_id ? parseInt(data.currency_id) : undefined,
      });

      await updateTenantSettings(tenant.id, {
        timezone: data.timezone,
        date_format: data.date_format,
        fiscal_year_start: data.fiscal_year_start,
        is_gst_enabled: data.is_gst_enabled,
        gstin: data.is_gst_enabled ? data.gstin : null,
      });

      toast.success('Firm settings saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-bold text-gray-900">Firm Settings & Localization</h1>
          <SectionHelp sectionKey="admin_settings_general" defaultTitle="Firm Settings" />
        </div>
        <p className="text-sm text-gray-500">Configure regional compliance, currencies, and workspace preferences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card
          title={
            <div className="flex items-center gap-1.5">
              <span>General Information</span>
              <SectionHelp sectionKey="admin_settings_general" defaultTitle="Firm Corporate Profile" />
            </div>
          }
        >
          <div className="space-y-4">
            <Input label="Firm / Legal Entity Name *" error={errors.name?.message} {...register('name')} />
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-1.5">
              <span>Multi-Country & Multi-Currency Localization</span>
              <SectionHelp sectionKey="admin_settings_localization" defaultTitle="Localization Settings" />
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Base Country" options={countries} placeholder="Select country..." {...register('country_id')} />
            <Select label="Base Currency" options={currencies} placeholder="Select currency..." {...register('currency_id')} />
            <Select
              label="Default Timezone"
              options={[
                { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST +5:30)' },
                { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
                { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
                { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
                { value: 'Asia/Dubai', label: 'Asia/Dubai (GST +4:00)' },
                { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT +8:00)' },
              ]}
              {...register('timezone')}
            />
            <Select
              label="Date Display Format"
              options={[
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 31/12/2026)' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g. 12/31/2026)' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO 8601)' },
              ]}
              {...register('date_format')}
            />
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-1.5">
              <span>Tax & Statutory Compliance (India / Multi-Country)</span>
              <SectionHelp sectionKey="admin_settings_tax" defaultTitle="Statutory Tax & GST/VAT Compliance" />
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                id="is_gst"
                type="checkbox"
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                {...register('is_gst_enabled')}
              />
              <label htmlFor="is_gst" className="text-sm font-medium text-gray-700">
                Enable GST / VAT Tax Compliance
              </label>
            </div>
            {isGst && (
              <Input
                label="Goods and Services Tax Number (GSTIN) *"
                placeholder="27AAAAA0000A1Z5"
                error={errors.gstin?.message}
                {...register('gstin')}
              />
            )}
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" loading={isSubmitting}>
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
