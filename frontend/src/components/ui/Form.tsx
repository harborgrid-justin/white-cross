/**
 * Form Components - Re-export
 *
 * This is a convenience re-export for the Form components.
 * The actual implementation is in ./inputs/Form.tsx
 */

'use client'

import * as React from 'react'
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

export {
  Form,
  FormError,
  type FormProps,
  type FormErrorProps
} from './inputs/Form'

// Export the custom FormField that doesn't conflict with react-hook-form
export { FormField as CustomFormField, type FormFieldProps } from './inputs/Form'

// Additional form subcomponents for compatibility with react-hook-form
export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`form-item mb-4 ${className || ''}`} {...props}>
      {children}
    </div>
  )
)
FormItem.displayName = 'FormItem'

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, ...props }, ref) => (
    <label ref={ref} className={`block text-sm font-medium mb-1 ${className || ''}`} {...props}>
      {children}
    </label>
  )
)
FormLabel.displayName = 'FormLabel'

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`form-control ${className || ''}`} {...props}>
      {children}
    </div>
  )
)
FormControl.displayName = 'FormControl'

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

export const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={`text-sm text-gray-600 mt-1 ${className || ''}`} {...props}>
      {children}
    </p>
  )
)
FormDescription.displayName = 'FormDescription'

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null
    return (
      <p ref={ref} className={`text-sm text-red-600 mt-1 ${className || ''}`} {...props}>
        {children}
      </p>
    )
  }
)
FormMessage.displayName = 'FormMessage'

// FormField compatible with react-hook-form - This is a simple pass-through wrapper
// that accepts the react-hook-form Controller props
import { Controller } from 'react-hook-form'

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return <Controller {...props} />
}
