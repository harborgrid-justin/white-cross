'use client';

/**
 * WF-CHECKBOX-001 | Checkbox.tsx - Checkbox Component
 * Purpose: Checkbox input with label, description, and validation states
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: Forms, filters, selections | Called by: Form components
 * Related: Form validation, multi-select controls
 * Exports: Checkbox component | Key Features: Indeterminate state, variants, sizes, accessibility
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: User toggle → Validation → State update
 * LLM Context: Checkbox component for White Cross healthcare platform
 */

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS class names.
 *
 * @param inputs - Array of class name strings or undefined values
 * @returns Merged and deduplicated class name string
 *
 * @internal
 */
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Props for the Checkbox component.
 *
 * @interface CheckboxProps
 * @extends {Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>}
 *
 * @property {string} [label] - Label text displayed next to checkbox
 * @property {string} [description] - Helper description text below label
 * @property {string} [error] - Error message text (displays in red, overrides variant)
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Checkbox size (height and width)
 * @property {('default' | 'success' | 'warning' | 'error')} [variant='default'] - Visual style variant
 * @property {boolean} [indeterminate=false] - Indeterminate state (partial selection, overrides checked)
 */
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void; // Alias for onChange for compatibility with shadcn/ui
}

/**
 * Checkbox component with label, description, and indeterminate state support.
 *
 * A fully accessible checkbox component with label, description text, error
 * handling, multiple visual variants, and support for the indeterminate state.
 * The component handles the indeterminate state via DOM manipulation as React
 * doesn't support it as a prop.
 *
 * **Features:**
 * - 4 visual variants (default, success, warning, error)
 * - 3 size options (sm, md, lg)
 * - Label and description text
 * - Error state with validation message
 * - Indeterminate state support (partial selection)
 * - Disabled state styling
 * - Focus ring for keyboard navigation
 * - Transition animations
 *
 * **Accessibility:**
 * - Semantic label with htmlFor association
 * - aria-describedby linking to description/error
 * - aria-invalid for error state
 * - aria-required for required checkboxes
 * - role="alert" for error messages
 * - Disabled state prevents interaction
 *
 * @component
 * @param {CheckboxProps} props - Checkbox component props
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref to checkbox input element
 * @returns {JSX.Element} Rendered checkbox with label and description
 *
 * @example
 * ```tsx
 * // Basic checkbox with label
 * <Checkbox
 *   id="terms"
 *   label="I agree to terms and conditions"
 *   checked={agreed}
 *   onChange={(e) => setAgreed(e.target.checked)}
 * />
 *
 * // Checkbox with description
 * <Checkbox
 *   id="notifications"
 *   label="Email notifications"
 *   description="Receive updates about your patient appointments"
 *   checked={emailEnabled}
 *   onChange={(e) => setEmailEnabled(e.target.checked)}
 * />
 *
 * // Checkbox with error state
 * <Checkbox
 *   id="consent"
 *   label="Patient consent"
 *   description="Required for treatment"
 *   error="Consent must be obtained before proceeding"
 *   required
 * />
 *
 * // Success variant (e.g., completed task)
 * <Checkbox
 *   label="Vaccination completed"
 *   variant="success"
 *   checked={vaccinationDone}
 *   disabled
 * />
 *
 * // Indeterminate state (partial selection)
 * <Checkbox
 *   label="Select all medications"
 *   indeterminate={someMedsSelected && !allMedsSelected}
 *   checked={allMedsSelected}
 *   onChange={handleSelectAll}
 * />
 * ```
 *
 * @remarks
 * **Healthcare Context**: Use checkboxes for:
 * - Medical history selections (allergies, conditions)
 * - Consent forms and HIPAA acknowledgments
 * - Multi-select medication administration
 * - Screening checklist items
 * - Patient preference selections
 *
 * **Indeterminate State**: The indeterminate state is useful for hierarchical
 * selections where some but not all child items are selected (e.g., "Select All"
 * checkbox when only some items are checked).
 *
 * @see {@link CheckboxProps} for detailed prop documentation
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    className,
    label,
    description,
    error,
    size = 'md',
    variant = 'default',
    indeterminate = false,
    disabled,
    onChange,
    onCheckedChange,
    ...props
  }, ref) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    // Create a unified change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    // Set indeterminate state via DOM manipulation (React doesn't support indeterminate prop)
    React.useEffect(() => {
      const checkbox = checkboxRef.current || (ref as React.RefObject<HTMLInputElement>)?.current;
      if (checkbox) {
        checkbox.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const variantClasses = {
      default: 'border-gray-300 text-blue-600 focus:ring-blue-500',
      success: 'border-green-300 text-green-600 focus:ring-green-500',
      warning: 'border-yellow-300 text-yellow-600 focus:ring-yellow-500',
      error: 'border-red-300 text-red-600 focus:ring-red-500'
    };

    const actualVariant = error ? 'error' : variant;

    return (
      <div className="flex items-start space-x-3">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            ref={ref || checkboxRef}
            className={cn(
              'rounded border-2 focus:ring-2 focus:ring-offset-2 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[size],
              variantClasses[actualVariant],
              className
            )}
            disabled={disabled}
            onChange={handleChange}
            aria-describedby={
              description ? `${props.id}-description` : error ? `${props.id}-error` : undefined
            }
            aria-invalid={error ? 'true' : 'false'}
            aria-required={props.required ? 'true' : undefined}
            {...props}
          />
        </div>
        {(label || description || error) && (
          <div className="flex-1">
            {label && (
              <label 
                htmlFor={props.id} 
                className={cn(
                  'block text-sm font-medium leading-5',
                  disabled ? 'text-gray-400' : 'text-gray-900',
                  error && 'text-red-900'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p 
                id={`${props.id}-description`}
                className={cn(
                  'text-sm leading-5',
                  disabled ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                {description}
              </p>
            )}
            {error && (
              <p 
                id={`${props.id}-error`}
                className="text-sm text-red-600 mt-1"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox, type CheckboxProps };
