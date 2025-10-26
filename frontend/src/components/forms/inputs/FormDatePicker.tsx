/**
 * FormDatePicker Component
 *
 * Date input field integrated with React Hook Form.
 */

import React from 'react';
import { UseFormRegister, FieldValues, Path, FieldError } from 'react-hook-form';
import { FormField } from '../FormField';
import clsx from 'clsx';
import { Calendar } from 'lucide-react';

export interface FormDatePickerProps<TFieldValues extends FieldValues = FieldValues> {
  /** Field name */
  name: Path<TFieldValues>;

  /** Field label */
  label?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Helper/hint text */
  hint?: string;

  /** Mark as required */
  required?: boolean;

  /** Mark as PHI field */
  isPhi?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Minimum date (YYYY-MM-DD) */
  min?: string;

  /** Maximum date (YYYY-MM-DD) */
  max?: string;

  /** Error from React Hook Form */
  error?: FieldError;

  /** React Hook Form register function */
  register: UseFormRegister<TFieldValues>;

  /** Additional input attributes */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  /** Additional CSS classes */
  className?: string;
}

/**
 * FormDatePicker component
 */
export function FormDatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  hint,
  required,
  isPhi,
  disabled,
  min,
  max,
  error,
  register,
  inputProps,
  className
}: FormDatePickerProps<TFieldValues>) {
  return (
    <FormField
      label={label}
      name={name}
      error={error}
      hint={hint}
      required={required}
      isPhi={isPhi}
      className={className}
    >
      <div className="relative">
        <input
          id={name}
          type="date"
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={clsx(
            'block w-full rounded-md border-gray-300 shadow-sm',
            'focus:border-blue-500 focus:ring-blue-500',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'dark:bg-gray-800 dark:border-gray-600 dark:text-white',
            'px-3 py-2 pr-10 text-sm',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...register(name, { required })}
          {...inputProps}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </FormField>
  );
}
