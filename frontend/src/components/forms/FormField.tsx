/**
 * FormField Component
 *
 * Base wrapper component for all form inputs.
 * Provides consistent label, error, and hint text styling.
 */

import React from 'react';
import { FieldError } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export interface FormFieldProps {
  /** Field label */
  label?: string;

  /** Field name (for htmlFor and id attributes) */
  name: string;

  /** Error message from React Hook Form */
  error?: FieldError | string;

  /** Helper/hint text */
  hint?: string;

  /** Mark field as required */
  required?: boolean;

  /** Mark field as containing PHI for accessibility */
  isPhi?: boolean;

  /** Children (the actual input component) */
  children: React.ReactNode;

  /** Additional CSS classes */
  className?: string;
}

/**
 * FormField wrapper component
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  hint,
  required,
  isPhi,
  children,
  className
}) => {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={clsx('mb-4', className)}>
      {label && (
        <label
          htmlFor={name}
          className={clsx(
            'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
            required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
          )}
        >
          {label}
          {isPhi && (
            <span
              className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
              title="Protected Health Information"
            >
              PHI
            </span>
          )}
        </label>
      )}

      {children}

      {hint && !errorMessage && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}

      {errorMessage && (
        <div className="mt-1 flex items-start gap-1 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
