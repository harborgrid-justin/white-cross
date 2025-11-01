/**
 * Date Picker Component
 * Date input component with calendar picker
 */

'use client';

import * as React from 'react';

export interface DatePickerProps {
  value?: Date | string;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  className = '',
}: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    if (value) {
      const date = typeof value === 'string' ? new Date(value) : value;
      setInputValue(date.toISOString().split('T')[0]);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) {
      const date = e.target.value ? new Date(e.target.value) : null;
      onChange(date);
    }
  };

  return (
    <input
      type="date"
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
    />
  );
}

export default DatePicker;
