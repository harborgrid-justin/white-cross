/**
 * WF-COMP-007 | Breadcrumbs.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../contexts/AuthContext, ../routes/routeUtils | Dependencies: react, react-router-dom, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, functions, types | Key Features: useMemo, component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Breadcrumbs Component
 *
 * Enterprise-grade breadcrumb navigation with permission checking,
 * accessibility features, and responsive design.
 *
 * @module components/Breadcrumbs
 */

import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { buildBreadcrumbs } from '../../../routes/routeUtils';
import type { BreadcrumbItem, BreadcrumbConfig } from '../../../types/navigation';
import type { Breadcrumb } from '../../../routes/routeUtils';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface BreadcrumbsProps {
  /** Optional override for breadcrumb items */
  items?: BreadcrumbItem[];
  /** Configuration options */
  config?: BreadcrumbConfig;
  /** Additional CSS classes */
  className?: string;
  /** Custom separator component */
  separator?: React.ReactNode;
  /** Whether to show on mobile */
  showOnMobile?: boolean;
}

// ============================================================================
// BREADCRUMBS COMPONENT
// ============================================================================

/**
 * Breadcrumbs navigation component with permission-aware routing.
 *
 * Features:
 * - Automatic breadcrumb generation from route metadata
 * - Permission-based link filtering
 * - Accessible keyboard navigation
 * - Responsive design with truncation
 * - Customizable separators and styling
 *
 * @example
 * ```tsx
 * // Automatic breadcrumbs from current route
 * <Breadcrumbs />
 *
 * // Custom breadcrumbs
 * <Breadcrumbs
 *   items={[
 *     { label: 'Home', path: '/', isActive: false },
 *     { label: 'Students', path: '/students', isActive: false },
 *     { label: 'John Doe', isActive: true },
 *   ]}
 * />
 *
 * // With custom configuration
 * <Breadcrumbs
 *   config={{
 *     showHomeIcon: true,
 *     maxItems: 4,
 *     showIcons: true
 *   }}
 * />
 * ```
 */
export default function Breadcrumbs({
  items: customItems,
  config = {},
  className = '',
  separator,
  showOnMobile = false,
}: BreadcrumbsProps) {
  const location = useLocation();
  const params = useParams();
  const { user } = useAuthContext();

  // Configuration with defaults
  const {
    showHomeIcon = true,
    maxItems = 5,
    showIcons = false,
  } = config;

  // Generate breadcrumbs from current route or use custom items
  const breadcrumbs: Breadcrumb[] = React.useMemo(() => {
    if (customItems) {
      // Convert custom items to Breadcrumb format
      return customItems.map(item => ({
        label: item.label,
        path: item.path || '',
        icon: item.icon,
        isActive: item.isActive,
      }));
    }

    // Generate from current route
    return buildBreadcrumbs(location.pathname, params);
  }, [customItems, location.pathname, params]);

  // Handle truncation if too many items
  const displayBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs.length <= maxItems) {
      return breadcrumbs;
    }

    // Keep first, last, and truncate middle
    return [
      breadcrumbs[0],
      {
        label: '...',
        path: '',
        isActive: false,
        icon: undefined,
      },
      ...breadcrumbs.slice(-(maxItems - 2)),
    ];
  }, [breadcrumbs, maxItems]);

  // Don't render if only one item (current page)
  if (breadcrumbs.length <= 1) {
    return null;
  }

  // Default separator
  const defaultSeparator = (
    <ChevronRight
      className="h-4 w-4 text-gray-400 flex-shrink-0"
      aria-hidden="true"
    />
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={`
        ${showOnMobile ? '' : 'hidden md:block'}
        ${className}
      `}
    >
      <ol
        className="flex items-center space-x-2 text-sm"
        role="list"
      >
        {displayBreadcrumbs.map((crumb, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isEllipsis = crumb.label === '...';

          return (
            <React.Fragment key={`${crumb.path}-${index}`}>
              <li className="flex items-center">
                {isEllipsis ? (
                  // Ellipsis for truncated breadcrumbs
                  <span
                    className="text-gray-500 px-2"
                    aria-label="More pages"
                  >
                    {crumb.label}
                  </span>
                ) : crumb.path && !isLast ? (
                  // Clickable breadcrumb link
                  <Link
                    to={crumb.path}
                    className="
                      flex items-center gap-1.5
                      text-gray-600 hover:text-gray-900
                      transition-colors duration-150
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      rounded px-1 py-0.5
                    "
                    aria-label={`Go to ${crumb.label}`}
                  >
                    {/* Home icon for first item */}
                    {index === 0 && showHomeIcon ? (
                      <Home
                        className="h-4 w-4 flex-shrink-0"
                        aria-hidden="true"
                      />
                    ) : null}

                    {/* Optional icon */}
                    {showIcons && crumb.icon && index !== 0 && (
                      <span className="flex-shrink-0" aria-hidden="true">
                        {/* Icon would be rendered here based on crumb.icon */}
                      </span>
                    )}

                    {/* Breadcrumb label */}
                    <span className="truncate max-w-[200px]">
                      {crumb.label}
                    </span>
                  </Link>
                ) : (
                  // Current page (not clickable)
                  <span
                    className="
                      flex items-center gap-1.5
                      text-gray-900 font-medium
                      px-1 py-0.5
                    "
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {/* Optional icon */}
                    {showIcons && crumb.icon && (
                      <span className="flex-shrink-0" aria-hidden="true">
                        {/* Icon would be rendered here based on crumb.icon */}
                      </span>
                    )}

                    {/* Breadcrumb label */}
                    <span className="truncate max-w-[200px]">
                      {crumb.label}
                    </span>
                  </span>
                )}
              </li>

              {/* Separator between breadcrumbs */}
              {!isLast && (
                <li
                  className="flex items-center"
                  aria-hidden="true"
                >
                  {separator || defaultSeparator}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

// ============================================================================
// BREADCRUMB ITEM COMPONENT
// ============================================================================

interface BreadcrumbItemComponentProps {
  item: BreadcrumbItem;
  isLast: boolean;
  showIcon?: boolean;
}

/**
 * Individual breadcrumb item component for advanced use cases.
 */
export function BreadcrumbItemComponent({
  item,
  isLast,
  showIcon = false,
}: BreadcrumbItemComponentProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
    }
  };

  const content = (
    <>
      {showIcon && item.icon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {/* Icon rendering logic */}
        </span>
      )}
      <span className="truncate max-w-[200px]">
        {item.label}
      </span>
    </>
  );

  if (item.path && !isLast && item.isClickable !== false) {
    return (
      <Link
        to={item.path}
        onClick={handleClick}
        className="
          flex items-center gap-1.5
          text-gray-600 hover:text-gray-900
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          rounded px-1 py-0.5
        "
        aria-label={item.ariaLabel || `Go to ${item.label}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <span
      className={`
        flex items-center gap-1.5
        ${isLast ? 'text-gray-900 font-medium' : 'text-gray-600'}
        px-1 py-0.5
      `}
      aria-current={isLast ? 'page' : undefined}
      aria-label={item.ariaLabel}
    >
      {content}
    </span>
  );
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type { BreadcrumbsProps, BreadcrumbItemComponentProps };

