/**
 * PageHeader Component
 *
 * Displays a consistent header for pages with title, subtitle, breadcrumbs, and action buttons.
 * Used across the healthcare platform for standardized page headers.
 */

import React from 'react'

export interface PageHeaderProps {
  /**
   * Main page title
   */
  title: string

  /**
   * Optional subtitle or description
   */
  subtitle?: string

  /**
   * Optional breadcrumb items
   */
  breadcrumbs?: Array<{ label: string; href?: string }>

  /**
   * Optional action buttons (e.g., "Add New", "Export")
   */
  actions?: React.ReactNode

  /**
   * Optional additional content below the header
   */
  children?: React.ReactNode

  /**
   * Optional CSS class for styling
   */
  className?: string
}

/**
 * PageHeader component for displaying page titles and actions
 *
 * Optimized with React.memo to prevent unnecessary re-renders.
 */
export const PageHeader = React.memo<PageHeaderProps>(({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
  className = ''
}) => {
  return (
    <div className={`page-header mb-6 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-2 text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <svg
                    className="w-3 h-3 mx-1 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header Content */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {actions && (
          <div className="flex items-center gap-2 ml-4">
            {actions}
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
  );
});

PageHeader.displayName = 'PageHeader';
