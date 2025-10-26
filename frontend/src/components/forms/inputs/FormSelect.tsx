/**
 * FormSelect Component
 *
 * Select dropdown integrated with React Hook Form.
 */

import React from 'react';
import { UseFormRegister, FieldValues, Path, FieldError } from 'react-hook-form';
import { FormField } from '../FormField';
import clsx from 'clsx';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps<TFieldValues extends FieldValues = FieldValues> {
  /** Field name */
  name: Path<TFieldValues>;

  /** Field label */
  label?: string;

  /** Select options */
  options: SelectOption[];

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

  /** Error from React Hook Form */
  error?: FieldError;

  /** React Hook Form register function */
  register: UseFormRegister<TFieldValues>;

  /** Additional select attributes */
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;

  /** Additional CSS classes */
  className?: string;
}

/**
 * FormSelect component
 */
export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  options,
  placeholder,
  hint,
  required,
  isPhi,
  disabled,
  error,
  register,
  selectProps,
  className
}: FormSelectProps<TFieldValues>) {
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
      <select
        id={name}
        disabled={disabled}
        className={clsx(
          'block w-full rounded-md border-gray-300 shadow-sm',
          'focus:border-blue-500 focus:ring-blue-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          'dark:bg-gray-800 dark:border-gray-600 dark:text-white',
          'px-3 py-2 text-sm',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...register(name, { required })}
        {...selectProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
