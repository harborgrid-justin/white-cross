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

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  showBreadcrumbs?: boolean
  className?: string
}

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
