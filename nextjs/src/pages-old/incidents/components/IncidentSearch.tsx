/**
 * IncidentSearch Component
 *
 * Production-grade search input for incident reports with:
 * - Debounced search to reduce API calls
 * - Search by incident number, student name, keywords in description
 * - Clear button for quick reset
 * - Accessible search interface
 *
 * @module pages/incidents/components/IncidentSearch
 */

import React from 'react';
import { SearchInput } from '@/components/ui/SearchInput';

interface IncidentSearchProps {
  /** Current search query value */
  value?: string;
  /** Callback when search query changes (debounced) */
  onSearch: (query: string) => void;
  /** Placeholder text for search input */
  placeholder?: string;
  /** Optional CSS class name */
  className?: string;
  /** Whether search is disabled */
  disabled?: boolean;
  /** Debounce delay in milliseconds */
  delay?: number;
}

/**
 * IncidentSearch component
 *
 * Provides a debounced search input for filtering incident reports.
 * Searches across:
 * - Incident number
 * - Student name
 * - Keywords in description
 * - Location
 *
 * @example
 * ```tsx
 * <IncidentSearch
 *   value={searchQuery}
 *   onSearch={(query) => dispatch(setSearchQuery(query))}
 *   placeholder="Search incidents by number, student name, or keywords..."
 * />
 * ```
 */
export const IncidentSearch: React.FC<IncidentSearchProps> = ({
  value = '',
  onSearch,
  placeholder = 'Search incidents by number, student name, or keywords...',
  className = '',
  disabled = false,
  delay = 400,
}) => {
  const handleClear = () => {
    onSearch('');
  };

  return (
    <div className={className}>
      <SearchInput
        value={value}
        onChange={onSearch}
        placeholder={placeholder}
        delay={delay}
        onClear={handleClear}
        disabled={disabled}
        testId="incident-search-input"
      />

      {/* Helper text for search functionality */}
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Search by incident #, student name, description keywords, or location
      </p>
    </div>
  );
};

export default IncidentSearch;
