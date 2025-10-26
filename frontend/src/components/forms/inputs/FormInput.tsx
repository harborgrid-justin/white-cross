/**
 * FormInput Component
 *
 * Text input field integrated with React Hook Form.
 */

import React from 'react';
import { UseFormRegister, FieldValues, Path, FieldError } from 'react-hook-form';
import { FormField } from '../FormField';
import clsx from 'clsx';

export interface FormInputProps<TFieldValues extends FieldValues = FieldValues> {
  /** Field name (must match schema) */
  name: Path<TFieldValues>;

  /** Field label */
  label?: string;

  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

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

  /** Additional input attributes */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  /** Additional CSS classes */
  className?: string;
}

/**
 * FormInput component
 */
export function FormInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  hint,
  required,
  isPhi,
  disabled,
  error,
  register,
  inputProps,
  className
}: FormInputProps<TFieldValues>) {
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
      <input
        id={name}
        type={type}
        placeholder={placeholder}
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
        {...inputProps}
      />
    </FormField>
  );
}
