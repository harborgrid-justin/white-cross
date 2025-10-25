/**
 * IncidentsHeader Component
 *
 * Page header component with title, actions, search bar, and breadcrumbs.
 * Provides consistent header layout for incidents pages.
 *
 * @module components/incidents/IncidentsHeader
 */

import React, { memo, ReactNode, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import IncidentBreadcrumbs from './IncidentBreadcrumbs';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Props for the IncidentsHeader component.
 *
 * @property {string} title - Main page title
 * @property {string} [description] - Optional descriptive text below the title
 * @property {ReactNode} [actions] - Optional action buttons or controls (e.g., "Add New", "Export")
 * @property {boolean} [showSearch=false] - Whether to show search bar
 * @property {boolean} [showBreadcrumbs=true] - Whether to show breadcrumb navigation
 * @property {string} [searchPlaceholder] - Placeholder text for search input
 * @property {(query: string) => void} [onSearch] - Callback when search query changes
 * @property {string} [className] - Additional CSS classes
 */
export interface IncidentsHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  showSearch?: boolean;
  showBreadcrumbs?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

/**
 * IncidentsHeader - Page header component
 *
 * Provides a consistent header layout for incidents pages including:
 * - Breadcrumb navigation for context
 * - Page title and optional description
 * - Optional search bar
 * - Action button area
 *
 * Layout:
 * - Responsive flex layout
 * - Desktop: Title and actions side-by-side
 * - Mobile: Stacked layout with title first
 * - Breadcrumbs always at top when shown
 * - Search bar below title when enabled
 *
 * Features:
 * - Consistent spacing and typography
 * - Responsive design
 * - Dark mode support
 * - Text truncation for long titles
 * - Flexible action area for buttons/controls
 * - Integrated search functionality
 * - Accessible with ARIA labels
 *
 * @param props - Component props
 * @param props.title - Main page title
 * @param props.description - Optional descriptive text
 * @param props.actions - Optional action buttons/controls
 * @param props.showSearch - Toggle search bar display (default: false)
 * @param props.showBreadcrumbs - Toggle breadcrumb display (default: true)
 * @param props.searchPlaceholder - Search input placeholder text
 * @param props.onSearch - Search query change callback
 * @param props.className - Additional CSS classes
 * @returns JSX element representing the page header
 *
 * @example
 * ```tsx
 * <IncidentsHeader
 *   title="Incident Reports"
 *   description="View and manage all incident reports"
 *   showSearch={true}
 *   onSearch={(query) => handleSearch(query)}
 *   actions={
 *     <>
 *       <Button variant="secondary">Export</Button>
 *       <Button variant="primary">Create Incident</Button>
 *     </>
 *   }
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Simple header without search
 * <IncidentsHeader
 *   title="Incident Details"
 *   showBreadcrumbs={true}
 * />
 * ```
 */
export const IncidentsHeader = memo(({
  title,
  description,
  actions,
  showSearch = false,
  showBreadcrumbs = true,
  searchPlaceholder = 'Search incidents...',
  onSearch,
  className
}: IncidentsHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  return (
    <div className={cn('incidents-header bg-white dark:bg-gray-800 p-4 lg:p-6', className)}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <div className="mb-4">
          <IncidentBreadcrumbs />
        </div>
      )}

      {/* Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
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
          <div className="flex-shrink-0 flex items-center gap-2 flex-wrap">
            {actions}
          </div>
        )}
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className={cn(
              'block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600',
              'rounded-lg bg-white dark:bg-gray-700',
              'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'transition-colors duration-200'
            )}
            aria-label="Search incidents"
          />
        </div>
      )}
    </div>
  );
});

IncidentsHeader.displayName = 'IncidentsHeader';

export default IncidentsHeader;
