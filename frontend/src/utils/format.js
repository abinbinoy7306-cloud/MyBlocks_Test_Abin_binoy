import { format } from 'date-fns';

export const formatDate = (val, pattern = 'dd MMM yyyy') => {
  if (!val) return '—';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return '—';
    return format(d, pattern);
  } catch {
    return '—';
  }
};
