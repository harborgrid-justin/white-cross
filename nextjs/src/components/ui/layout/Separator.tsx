/**
 * Separator Component
 *
 * Visual divider component for separating content.
 */

import React from 'react'
import { cn } from '@/lib/utils'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of the separator
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * Whether to add decorative styling
   */
  decorative?: boolean
}

/**
 * Separator component for dividing content
 */
export function Separator({
  orientation = 'horizontal',
  decorative = false,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? 'presentation' : 'separator'}
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-gray-200 dark:bg-gray-700',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  )
}

export default Separator
