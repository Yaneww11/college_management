import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const widthClass = fullWidth ? 'w-full' : '';
    const errorClass = error
      ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`appearance-none block ${widthClass} px-3 py-2 border ${errorClass} rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${className}`}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;