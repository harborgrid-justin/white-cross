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
}

/**
 * Form field wrapper with label and error display
 */
export function FormField({
  children,
  error,
  label,
  required,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn('form-field', className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
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
