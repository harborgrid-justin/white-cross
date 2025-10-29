/**
 * Form Components
 *
 * Form wrapper components with validation and error handling.
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /**
   * Form submission handler
   */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

/**
 * Form wrapper component
 */
export function Form({ children, className, onSubmit, ...props }: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      e.preventDefault()
      onSubmit(e)
    }
  }

  return (
    <form
      className={cn('space-y-4', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  )
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Error message to display
   */
  error?: string

  /**
   * Label for the field
   */
  label?: string

  /**
   * Whether the field is required
   */
  required?: boolean

  /**
   * Optional ID for the field (generated automatically if not provided)
   */
  id?: string
}

/**
 * Form field wrapper with label and error display.
 *
 * Implements WCAG 2.1 Level A compliance:
 * - 1.3.1 Info and Relationships (Level A)
 * - 3.3.2 Labels or Instructions (Level A)
 * - 3.3.1 Error Identification (Level A)
 *
 * Features:
 * - Automatic unique ID generation using React.useId()
 * - Proper label association with htmlFor
 * - Error messages linked via aria-describedby
 * - aria-invalid state management
 * - aria-required for required fields
 * - Screen reader accessible required indicator
 */
export function FormField({
  children,
  error,
  label,
  required,
  className,
  id,
  ...props
}: FormFieldProps) {
  // Generate unique ID for this field if not provided
  const generatedId = React.useId()
  const fieldId = id || `field-${generatedId}`
  const errorId = `${fieldId}-error`

  // Clone children to inject accessibility attributes
  const childWithProps = React.isValidElement(children)
    ? React.cloneElement(children, {
        id: fieldId,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': error ? errorId : undefined,
        'aria-required': required ? 'true' : undefined,
      } as any)
    : children

  return (
    <div className={cn('form-field', className)} {...props}>
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && (
            <>
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>
      )}
      {childWithProps}
      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Error message
   */
  message?: string
}

/**
 * Form error message component
 */
export function FormError({ message, className, ...props }: FormErrorProps) {
  if (!message) return null

  return (
    <p
      className={cn('text-sm text-red-600 dark:text-red-400', className)}
      role="alert"
      {...props}
    >
      {message}
    </p>
  )
}

export default Form
