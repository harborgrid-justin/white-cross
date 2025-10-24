/**
 * WF-COMP-NAV-005 | Breadcrumbs.tsx - Breadcrumb Navigation Component
 * Purpose: Breadcrumb trail showing current location in navigation hierarchy
 * Dependencies: react, react-router-dom, lucide-react, contexts
 * Features: Auto-generation from path, truncation, responsive, accessible
 * Last Updated: 2025-10-24
 * Agent: NAV7L5 - React Component Architect
 */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useNavigation } from '../../contexts/NavigationContext'

// ============================================================================
// MAIN BREADCRUMBS COMPONENT
// ============================================================================

interface BreadcrumbsProps {
  className?: string
  maxItems?: number
}

export const Breadcrumbs = memo(({ className = '', maxItems = 5 }: BreadcrumbsProps) => {
  const { breadcrumbs } = useNavigation()

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }

  // Truncate breadcrumbs if too many
  const displayBreadcrumbs = breadcrumbs.length > maxItems
    ? [
        breadcrumbs[0],
        { label: '...', path: '', isActive: false, isClickable: false },
        ...breadcrumbs.slice(-(maxItems - 2))
      ]
    : breadcrumbs

  return (
    <nav
      className={`flex ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {displayBreadcrumbs.map((item, index) => {
          const isLast = index === displayBreadcrumbs.length - 1

          return (
            <li key={`${item.path}-${index}`} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-2"
                  aria-hidden="true"
                />
              )}

              {item.isClickable && item.path ? (
                <Link
                  to={item.path}
                  className="
                    text-sm font-medium text-gray-600 dark:text-gray-400
                    hover:text-primary-600 dark:hover:text-primary-400
                    transition-colors duration-200
                  "
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {index === 0 ? (
                    <Home className="h-4 w-4" aria-label="Home" />
                  ) : (
                    item.label
                  )}
                </Link>
              ) : (
                <span
                  className={`
                    text-sm font-medium
                    ${isLast
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.label === '...' ? item.label : (
                    index === 0 ? <Home className="h-4 w-4" aria-label="Home" /> : item.label
                  )}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
})

Breadcrumbs.displayName = 'Breadcrumbs'

export default Breadcrumbs
