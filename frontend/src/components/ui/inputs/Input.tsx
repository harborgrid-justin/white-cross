'use client';

/**
 * WF-INPUT-001 | Input.tsx - Core Input Component
 * Purpose: Base input component with validation and states
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: Forms, search, data entry | Called by: Form components
 * Related: Form validation, user input handling
 * Exports: Input component | Key Features: Validation, states, accessibility
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: User input → Validation → State update
 * LLM Context: Core input component for White Cross healthcare platform
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Input component.
 *
 * @interface InputProps
 * @extends {Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>}
 *
 * @property {string} [label] - Label text displayed above the input
 * @property {string} [error] - Error message text (displays in red below input)
 * @property {string} [helperText] - Helper text displayed below input when no error
 * @property {boolean} [required=false] - Whether input is required (shows asterisk)
 * @property {('default' | 'filled' | 'outlined')} [variant='default'] - Visual style variant
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Input size affecting padding and text size
 * @property {React.ReactNode} [icon] - Icon element to display inside input
 * @property {('left' | 'right')} [iconPosition='left'] - Icon placement relative to text
 * @property {boolean} [loading=false] - Loading state showing spinner animation
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

/**
 * Input variant style configurations.
 * Each variant includes border, focus states, background, and dark mode support.
 *
 * @constant
 * @internal
 */
const inputVariants = {
  default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white',
  filled: 'bg-gray-50 border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-800',
  outlined: 'border-2 border-gray-300 focus:border-primary-500 focus:ring-0 dark:bg-gray-800 dark:border-gray-600 dark:text-white'
};

/**
 * Input size configurations.
 * Defines padding and text size for each size variant.
 *
 * @constant
 * @internal
 */
const inputSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
};

/**
 * Core input component with label, error states, and icon support.
 *
 * A flexible, accessible text input component with label, error handling,
 * helper text, icons, and loading states. Optimized with React.forwardRef
 * for parent component DOM access.
 *
 * **Features:**
 * - 3 visual variants (default, filled, outlined)
 * - 3 size options (sm, md, lg)
 * - Label with required indicator
 * - Error state with validation message
 * - Helper text for guidance
 * - Icon support (left or right)
 * - Loading state with spinner
 * - Dark mode support
 * - Full accessibility
 *
 * **Accessibility:**
 * - Semantic label with htmlFor association
 * - aria-invalid for error state
 * - aria-required for required fields
 * - aria-describedby linking to error/helper text
 * - aria-busy during loading
 * - Screen reader text for loading spinner
 * - Unique ID generation for proper associations
 *
 * @component
 * @param {InputProps} props - Input component props
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref to input element
 * @returns {JSX.Element} Rendered input with label and validation
 *
 * @example
 * ```tsx
 * // Basic input with label
 * <Input label="Email" type="email" placeholder="Enter your email" />
 *
 * // Required input with helper text
 * <Input
 *   label="Password"
 *   type="password"
 *   required
 *   helperText="Must be at least 8 characters"
 * />
 *
 * // Input with error state
 * <Input
 *   label="Username"
 *   value={username}
 *   error="Username is already taken"
 *   onChange={(e) => setUsername(e.target.value)}
 * />
 *
 * // Input with left icon
 * <Input
 *   label="Search"
 *   icon={<SearchIcon />}
 *   iconPosition="left"
 *   placeholder="Search patients..."
 * />
 *
 * // Large filled variant with loading
 * <Input
 *   label="Medical Record Number"
 *   variant="filled"
 *   size="lg"
 *   loading={isSearching}
 * />
 * ```
 *
 * @remarks
 * **Healthcare Context**: Ensure proper input validation for medical data:
 * - Use type="number" for vital signs, dosages
 * - Validate medical record numbers with appropriate patterns
 * - Provide clear error messages for invalid medical data
 * - Mark required fields (*, allergies, medications)
 *
 * @see {@link InputProps} for detailed prop documentation
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    helperText,
    required = false,
    variant = 'default',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled,
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isDisabled = disabled || loading;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-1',
              hasError ? 'text-danger-700 dark:text-danger-400' : 'text-gray-700 dark:text-gray-300',
              isDisabled && 'text-gray-400 dark:text-gray-600'
            )}
          >
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={cn(
                'text-gray-400',
                hasError && 'text-red-400'
              )}>
                {icon}
              </span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'block w-full rounded-lg border shadow-sm transition-all duration-200',
              'focus:outline-none focus:ring-2',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-gray-900 dark:disabled:text-gray-600',
              inputVariants[variant],
              inputSizes[size],
              hasError && 'border-danger-300 text-danger-900 placeholder-danger-300 focus:border-danger-500 focus:ring-danger-500 dark:border-danger-500 dark:text-danger-400',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              loading && 'pr-10',
              className
            )}
            disabled={isDisabled}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-required={required ? 'true' : undefined}
            aria-describedby={
              error ? `${inputId}-error` :
              helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-live="polite" aria-busy="true">
              <svg
                className="animate-spin h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="sr-only">Loading</span>
            </div>
          )}
          
          {icon && iconPosition === 'right' && !loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className={cn(
                'text-gray-400',
                hasError && 'text-red-400'
              )}>
                {icon}
              </span>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-danger-600 dark:text-danger-400" id={`${inputId}-error`}>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400" id={`${inputId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
