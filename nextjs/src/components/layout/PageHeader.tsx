/**
 * WF-COMP-NAV-006 | PageHeader.tsx - Page Header Component
 * Purpose: Consistent page header with title, description, actions, breadcrumbs
 * Dependencies: react, Breadcrumbs
 * Features: Responsive, action buttons area, optional description
 * Last Updated: 2025-10-24
 * Agent: NAV7L5 - React Component Architect
 */

import React, { memo, ReactNode } from 'react'
import Breadcrumbs from './Breadcrumbs'

// ============================================================================
// MAIN PAGE HEADER COMPONENT
// ============================================================================

/**
 * Props for the PageHeader component.
 *
 * @property {string} title - Main page title displayed prominently
 * @property {string} [description] - Optional descriptive text below the title
 * @property {ReactNode} [actions] - Optional action buttons or controls (e.g., "Add New", "Export")
 * @property {boolean} [showBreadcrumbs=true] - Whether to show breadcrumb navigation
 * @property {string} [className] - Optional CSS classes for the container
 */
interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  showBreadcrumbs?: boolean
  className?: string
}

/**
 * Page header component with breadcrumbs, title, description, and actions.
 *
 * Provides a consistent header layout for all application pages including:
 * - Breadcrumb navigation for context
 * - Page title
 * - Optional description text
 * - Action button area
 *
 * Layout:
 * - Responsive flex layout
 * - Desktop: Title and actions side-by-side
 * - Mobile: Stacked layout with title first
 * - Breadcrumbs always at top when shown
 *
 * Features:
 * - Consistent spacing and typography
 * - Responsive design
 * - Dark mode support
 * - Text truncation for long titles
 * - Flexible action area for buttons/controls
 *
 * @param props - Component props
 * @param props.title - Main page title
 * @param props.description - Optional descriptive text
 * @param props.actions - Optional action buttons/controls
 * @param props.showBreadcrumbs - Toggle breadcrumb display (default: true)
 * @param props.className - Additional CSS classes
 * @returns JSX element representing the page header
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Student Health Records"
 *   description="View and manage student medical information"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Medications"
 *   description="Track and dispense medications"
 *   actions={
 *     <>
 *       <Button variant="secondary">Export</Button>
 *       <Button variant="primary">Add Medication</Button>
 *     </>
 *   }
 *   showBreadcrumbs={true}
 * />
 * ```
 */
export const PageHeader = memo(({
  title,
  description,
  actions,
  showBreadcrumbs = true,
  className = ''
}: PageHeaderProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      {showBreadcrumbs && (
        <div className="mb-4">
          <Breadcrumbs />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex-shrink-0 flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
})

PageHeader.displayName = 'PageHeader'

export default PageHeader
