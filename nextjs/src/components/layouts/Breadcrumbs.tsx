'use client';

/**
 * WF-COMP-LAY-001 | Breadcrumbs.tsx - Navigation Breadcrumb Trail Component
 * Purpose: Display hierarchical navigation path for current page
 * Dependencies: react, react-router-dom, lucide-react, NavigationContext
 * Features: Auto-generated from route, manual override, responsive, accessible
 * Last Updated: 2025-10-27
 * Agent: Layout Components Architect
 */

import React, { memo, useMemo } from 'react';
import Link from "next/link"; import { useLocation } from 'next/link' // Migrated from react-router-dom;
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { getBreadcrumbs } from '../../config/navigationConfig';

// ============================================================================
// BREADCRUMBS COMPONENT
// ============================================================================

/**
 * Props for Breadcrumbs component
 */
export interface BreadcrumbsProps {
  /** Custom breadcrumb items (overrides auto-generated) */
  items?: Array<{ label: string; path?: string }>;
  /** Whether to show home icon */
  showHomeIcon?: boolean;
  /** Maximum items to display before truncation */
  maxItems?: number;
  /** Custom separator element */
  separator?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether to use NavigationContext breadcrumbs */
  useContext?: boolean;
}

/**
 * Breadcrumbs navigation component.
 *
 * Displays the current page's position in the application hierarchy.
 * Can automatically generate breadcrumbs from the current route or
 * accept custom breadcrumb items.
 *
 * Features:
 * - Auto-generates breadcrumbs from current route path
 * - Manual breadcrumb override via props
 * - NavigationContext integration
 * - Home icon shortcut
 * - Responsive truncation
 * - Keyboard navigation support
 * - Accessibility with ARIA labels
 * - Dark mode support
 * - Custom separators
 *
 * Breadcrumb Generation:
 * 1. Props items (highest priority)
 * 2. NavigationContext breadcrumbs (if useContext=true)
 * 3. Auto-generated from current route (fallback)
 *
 * @param props - Component props
 * @param props.items - Custom breadcrumb items
 * @param props.showHomeIcon - Show home icon (default: true)
 * @param props.maxItems - Max items before truncation (default: 5)
 * @param props.separator - Custom separator element
 * @param props.className - Additional CSS classes
 * @param props.useContext - Use NavigationContext breadcrumbs (default: true)
 * @returns JSX element representing the breadcrumb navigation
 *
 * @example
 * ```tsx
 * // Auto-generated breadcrumbs
 * <Breadcrumbs />
 * ```
 *
 * @example
 * ```tsx
 * // Custom breadcrumbs
 * <Breadcrumbs
 *   items={[
 *     { label: 'Students', path: '/students' },
 *     { label: 'John Doe', path: '/students/123' },
 *     { label: 'Health Records' }
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom separator
 * <Breadcrumbs
 *   separator={<span className="mx-2">→</span>}
 *   maxItems={3}
 * />
 * ```
 */
export const Breadcrumbs = memo(({
  items: customItems,
  showHomeIcon = true,
  maxItems = 5,
  separator,
  className = '',
  useContext = true,
}: BreadcrumbsProps) => {
  const location = useLocation();
  const navigation = useNavigation();

  // Determine breadcrumb items
  const breadcrumbItems = useMemo(() => {
    // 1. Use custom items if provided
    if (customItems && customItems.length > 0) {
      return customItems;
    }

    // 2. Use NavigationContext breadcrumbs if enabled
    if (useContext && navigation.breadcrumbs && navigation.breadcrumbs.length > 0) {
      return navigation.breadcrumbs.map(bc => ({
        label: bc.label,
        path: bc.href,
      }));
    }

    // 3. Auto-generate from current route
    const generated = getBreadcrumbs(location.pathname);
    return generated.map(bc => ({
      label: bc.name,
      path: bc.path,
    }));
  }, [customItems, useContext, navigation.breadcrumbs, location.pathname]);

  // Apply max items truncation
  const displayItems = useMemo(() => {
    if (breadcrumbItems.length <= maxItems) {
      return breadcrumbItems;
    }

    // Keep first item (home), last item (current), and truncate middle
    const firstItem = breadcrumbItems[0];
    const lastItems = breadcrumbItems.slice(-(maxItems - 2));

    return [
      firstItem,
      { label: '...', path: undefined }, // Truncation indicator
      ...lastItems,
    ];
  }, [breadcrumbItems, maxItems]);

  // Don't render if no breadcrumbs
  if (displayItems.length === 0) {
    return null;
  }

  // Default separator
  const defaultSeparator = (
    <ChevronRight
      className="h-4 w-4 text-gray-400 dark:text-gray-600"
      aria-hidden="true"
    />
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isHome = index === 0 && item.path === '/dashboard';
          const isTruncated = item.label === '...';

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mr-2">
                  {separator || defaultSeparator}
                </span>
              )}

              {isTruncated ? (
                <span
                  className="text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                >
                  {item.label}
                </span>
              ) : isLast || !item.path ? (
                <span
                  className="font-medium text-gray-900 dark:text-gray-100"
                  aria-current="page"
                >
                  {isHome && showHomeIcon ? (
                    <Home className="h-4 w-4" aria-label="Home" />
                  ) : (
                    item.label
                  )}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="
                    text-gray-600 hover:text-gray-900
                    dark:text-gray-400 dark:hover:text-gray-100
                    transition-colors duration-200
                    hover:underline focus:underline focus:outline-none
                    focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    rounded-sm px-1 -mx-1
                  "
                  aria-label={`Navigate to ${item.label}`}
                >
                  {isHome && showHomeIcon ? (
                    <Home className="h-4 w-4" aria-label="Home" />
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
