/**
 * WF-COMP-NAV-007 | PageContainer.tsx - Page Container Component
 * Purpose: Consistent page wrapper with padding and max-width
 * Dependencies: react
 * Features: Responsive padding, max-width constraint
 * Last Updated: 2025-10-24
 * Agent: NAV7L5 - React Component Architect
 */

import React, { memo, ReactNode } from 'react'

// ============================================================================
// MAIN PAGE CONTAINER COMPONENT
// ============================================================================

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
  padding?: boolean
}

export const PageContainer = memo(({
  children,
  className = '',
  maxWidth = '7xl',
  padding = true
}: PageContainerProps) => {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  }[maxWidth]

  return (
    <div
      className={`
        ${maxWidthClass} mx-auto
        ${padding ? 'px-4 sm:px-6 lg:px-8 py-6' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
})

PageContainer.displayName = 'PageContainer'

export default PageContainer
