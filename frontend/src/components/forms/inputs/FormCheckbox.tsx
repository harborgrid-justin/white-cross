/**
 * FormCheckbox Component
 *
 * Checkbox input integrated with React Hook Form.
 */

import React from 'react';
import { UseFormRegister, FieldValues, Path, FieldError } from 'react-hook-form';
import clsx from 'clsx';

export interface FormCheckboxProps<TFieldValues extends FieldValues = FieldValues> {
  /** Field name */
  name: Path<TFieldValues>;

  /** Checkbox label */
  label: string;

  /** Helper/hint text */
  hint?: string;

  /** Mark as required */
  required?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Error from React Hook Form */
  error?: FieldError;

  /** React Hook Form register function */
  register: UseFormRegister<TFieldValues>;

  /** Additional checkbox attributes */
  checkboxProps?: React.InputHTMLAttributes<HTMLInputElement>;

  /** Additional CSS classes */
  className?: string;
}

/**
 * FormCheckbox component
 */
export function FormCheckbox<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hint,
  required,
  disabled,
  error,
  register,
  checkboxProps,
  className
}: FormCheckboxProps<TFieldValues>) {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={clsx('mb-4', className)}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={name}
            type="checkbox"
            disabled={disabled}
            className={clsx(
              'h-4 w-4 rounded border-gray-300 text-blue-600',
              'focus:ring-blue-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:bg-gray-800 dark:border-gray-600',
              error && 'border-red-500'
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
            {...register(name, { required })}
            {...checkboxProps}
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor={name}
            className={clsx(
              'font-medium text-gray-700 dark:text-gray-300',
              required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </label>
          {hint && !errorMessage && (
            <p id={`${name}-hint`} className="text-gray-500 dark:text-gray-400">
              {hint}
            </p>
          )}
          {errorMessage && (
            <p id={`${name}-error`} className="text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
