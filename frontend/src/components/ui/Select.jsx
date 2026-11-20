import { forwardRef } from 'react';

const Select = forwardRef(function Select(
  {
    label,
    error,
    className = '',
    children,
    options = [],
    placeholder = '',
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`block w-full rounded-lg border ${
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
        } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent py-2 px-3 text-sm text-gray-900 bg-white disabled:bg-gray-50 ${className}`}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.length > 0 ? (
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Select;
