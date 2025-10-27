/**
 * Label Component
 *
 * Accessible label component for form inputs.
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Whether the associated input is required
   */
  required?: boolean

  /**
   * Whether the label should appear disabled
   */
  disabled?: boolean
}

/**
 * Label component for form inputs
 */
export function Label({
  children,
  required,
  disabled,
  className,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        'block text-sm font-medium mb-1',
        disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 dark:text-gray-300',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

export default Label
