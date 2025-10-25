/**
 * IncidentBreadcrumbs Component
 *
 * Breadcrumb navigation component for incidents module.
 * Displays hierarchical navigation trail with clickable links.
 *
 * @module components/incidents/IncidentBreadcrumbs
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

/**
 * Props for the IncidentBreadcrumbs component.
 *
 * @property {BreadcrumbItem[]} [items] - Breadcrumb items to display
 * @property {number} [maxItems=5] - Maximum number of breadcrumb items before truncation
 * @property {string} [className] - Additional CSS classes
 */
export interface IncidentBreadcrumbsProps {
  items?: BreadcrumbItem[];
  maxItems?: number;
  className?: string;
}

/**
 * Default breadcrumb items for incidents module
 */
const DEFAULT_ITEMS: BreadcrumbItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Incidents', path: '/incidents', isActive: true }
];

/**
 * IncidentBreadcrumbs - Breadcrumb navigation component
 *
 * Displays a breadcrumb trail showing the user's location in the incidents module.
 * Breadcrumbs provide context and quick navigation to parent pages.
 *
 * Features:
 * - Home icon for root level
 * - ChevronRight separators
 * - Clickable links for navigation
 * - Active page indication (no link)
 * - Smart truncation for long paths
 * - Responsive design
 * - Dark mode support
 * - Accessible with ARIA labels
 *
 * Truncation:
 * - When items exceed maxItems, shows: Home > ... > Recent Items
 * - Keeps first item (home) and last N-2 items visible
 * - Uses ellipsis to indicate hidden items
 *
 * @param props - Component props
 * @param props.items - Breadcrumb items (uses default if not provided)
 * @param props.maxItems - Maximum breadcrumb items before truncation (default: 5)
 * @param props.className - Additional CSS classes
 * @returns JSX element representing breadcrumb navigation
 *
 * @example
 * ```tsx
 * // Default breadcrumbs
 * <IncidentBreadcrumbs />
 * ```
 *
 * @example
 * ```tsx
 * // Custom breadcrumbs
 * <IncidentBreadcrumbs
 *   items={[
 *     { label: 'Home', path: '/' },
 *     { label: 'Incidents', path: '/incidents' },
 *     { label: 'Details', path: '/incidents/123', isActive: true }
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With truncation
 * <IncidentBreadcrumbs
 *   items={longBreadcrumbList}
 *   maxItems={3}
 * />
 * ```
 */
export const IncidentBreadcrumbs = memo(({
  items = DEFAULT_ITEMS,
  maxItems = 5,
  className
}: IncidentBreadcrumbsProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Truncate breadcrumbs if too many
  const displayItems = items.length > maxItems
    ? [
        items[0],
        { label: '...', path: undefined, isActive: false },
        ...items.slice(-(maxItems - 2))
      ]
    : items;

  return (
    <nav
      className={cn('flex', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li key={`${item.path}-${index}`} className="flex items-center">
              {/* Separator */}
              {!isFirst && (
                <ChevronRight
                  className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-2"
                  aria-hidden="true"
                />
              )}

              {/* Breadcrumb Item */}
              {isEllipsis ? (
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.label}
                </span>
              ) : item.path && !item.isActive ? (
                <Link
                  to={item.path}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    'text-gray-600 dark:text-gray-400',
                    'hover:text-primary-600 dark:hover:text-primary-400'
                  )}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {isFirst ? (
                    <div className="flex items-center">
                      <Home className="h-4 w-4" aria-label="Home" />
                    </div>
                  ) : (
                    item.label
                  )}
                </Link>
              ) : (
                <span
                  className={cn(
                    'text-sm font-medium',
                    isLast || item.isActive
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {isFirst ? (
                    <div className="flex items-center">
                      <Home className="h-4 w-4" aria-label="Home" />
                    </div>
                  ) : (
                    item.label
                  )}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

IncidentBreadcrumbs.displayName = 'IncidentBreadcrumbs';

export default IncidentBreadcrumbs;
