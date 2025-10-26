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

/**
 * Props for the PageContainer component.
 *
 * @property {ReactNode} children - Content to be wrapped in the container
 * @property {string} [className] - Optional CSS classes for additional styling
 * @property {'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'} [maxWidth='7xl'] - Maximum width constraint
 * @property {boolean} [padding=true] - Whether to apply responsive padding
 */
interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
  padding?: boolean
}

/**
 * Page container wrapper component with responsive padding and max-width.
 *
 * Provides a consistent content wrapper for all pages with:
 * - Configurable maximum width
 * - Responsive horizontal padding
 * - Vertical spacing
 * - Centered content
 *
 * Max Width Options:
 * - sm: 640px - For narrow forms or focused content
 * - md: 768px - For medium-width content
 * - lg: 1024px - For larger content areas
 * - xl: 1280px - For wide content
 * - 2xl: 1536px - For very wide layouts
 * - 7xl: 1280px (80rem) - Default, optimal for most pages
 * - full: No max width constraint
 *
 * Features:
 * - Responsive padding (increases on larger screens)
 * - Automatic horizontal centering
 * - Optional padding toggle
 * - Flexible max-width configuration
 *
 * @param props - Component props
 * @param props.children - Page content to wrap
 * @param props.className - Additional CSS classes
 * @param props.maxWidth - Maximum width constraint (default: '7xl')
 * @param props.padding - Enable responsive padding (default: true)
 * @returns JSX element representing the page container
 *
 * @example
 * ```tsx
 * <PageContainer>
 *   <PageHeader title="Dashboard" />
 *   <DashboardContent />
 * </PageContainer>
 * ```
 *
 * @example
 * ```tsx
 * <PageContainer maxWidth="xl" padding={false} className="custom-bg">
 *   <CustomLayout />
 * </PageContainer>
 * ```
 */
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
