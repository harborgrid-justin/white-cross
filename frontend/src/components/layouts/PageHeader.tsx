/**
 * WF-COMP-NAV-006 | PageHeader.tsx - Unified Page Header Component
 * Purpose: Consistent page header with title, description, actions, breadcrumbs
 * Dependencies: react, Breadcrumbs, Next.js Link
 * Features: Responsive, action buttons area, optional description, back navigation, custom breadcrumbs
 * Last Updated: 2025-11-02
 * Agent: UI/UX Architect
 */

import React, { memo, ReactNode } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import Breadcrumbs from './Breadcrumbs'

// ============================================================================
// MAIN PAGE HEADER COMPONENT
// ============================================================================

/**
 * Props for the PageHeader component.
 *
 * @property {string} title - Main page title displayed prominently
 * @property {string} [description] - Optional descriptive text below the title (alias: subtitle)
 * @property {string} [subtitle] - Alternative prop name for description (for backward compatibility)
 * @property {ReactNode} [actions] - Optional action buttons or controls (e.g., "Add New", "Export")
 * @property {ReactNode} [action] - Alternative single action prop (for backward compatibility)
 * @property {boolean} [showBreadcrumbs=true] - Whether to show breadcrumb navigation
 * @property {Array} [breadcrumbs] - Custom breadcrumb items array
 * @property {string} [backLink] - Optional back navigation link
 * @property {string} [backLabel='Back'] - Label for back link button
 * @property {ReactNode} [children] - Optional additional content below the header
 * @property {string} [className] - Optional CSS classes for the container
 */
interface PageHeaderProps {
  title: string
  description?: string
  subtitle?: string // Alias for description
  actions?: ReactNode
  action?: ReactNode // Alias for actions (singular)
  showBreadcrumbs?: boolean
  breadcrumbs?: Array<{ label: string; href?: string }>
  backLink?: string
  backLabel?: string
  children?: ReactNode
  className?: string
}

/**
 * Unified page header component with breadcrumbs, title, description, and actions.
 *
 * Provides a consistent header layout for all application pages including:
 * - Optional back navigation link
 * - Breadcrumb navigation for context (auto-generated or custom)
 * - Page title
 * - Optional description/subtitle text
 * - Action button area
 * - Additional content area
 *
 * Layout:
 * - Responsive flex layout
 * - Desktop: Title and actions side-by-side
 * - Mobile: Stacked layout with title first
 * - Breadcrumbs always at top when shown
 *
 * Features:
 * - Back navigation support
 * - Consistent spacing and typography
 * - Responsive design
 * - Dark mode support
 * - Text truncation for long titles
 * - Flexible action area for buttons/controls
 * - Custom or auto-generated breadcrumbs
 * - Backward compatible with both old APIs
 *
 * @param props - Component props
 * @param props.title - Main page title
 * @param props.description - Optional descriptive text
 * @param props.subtitle - Alternative prop name for description
 * @param props.actions - Optional action buttons/controls
 * @param props.action - Alternative single action prop
 * @param props.showBreadcrumbs - Toggle breadcrumb display (default: true)
 * @param props.breadcrumbs - Custom breadcrumb items
 * @param props.backLink - Optional back navigation URL
 * @param props.backLabel - Label for back link (default: 'Back')
 * @param props.children - Additional content below header
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
 *       <Button variant="default">Add Medication</Button>
 *     </>
 *   }
 *   showBreadcrumbs={true}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="New Message"
 *   description="Compose and send a new message"
 *   backLink="/messages"
 *   backLabel="Back to Messages"
 * />
 * ```
 */
export const PageHeader = memo(({
  title,
  description,
  subtitle,
  actions,
  action,
  showBreadcrumbs = true,
  breadcrumbs,
  backLink,
  backLabel = 'Back',
  children,
  className = ''
}: PageHeaderProps) => {
  // Support both description and subtitle props (backward compatibility)
  const descriptionText = description || subtitle;

  // Support both actions and action props (backward compatibility)
  const actionElements = actions || action;

  return (
    <div className={`page-header mb-6 ${className}`}>
      {/* Back Navigation */}
      {backLink && (
        <div className="mb-2">
          <Link
            href={backLink}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {backLabel}
          </Link>
        </div>
      )}

      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <div className="mb-4">
          {breadcrumbs ? (
            <Breadcrumbs items={breadcrumbs} />
          ) : (
            <Breadcrumbs />
          )}
        </div>
      )}

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 dark:text-white truncate">
            {title}
          </h1>
          {descriptionText && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-gray-600">
              {descriptionText}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {actionElements && (
          <div className="flex-shrink-0 flex items-center gap-2">
            {actionElements}
          </div>
        )}
      </div>

      {/* Additional Content */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
})

PageHeader.displayName = 'PageHeader'

export default PageHeader

