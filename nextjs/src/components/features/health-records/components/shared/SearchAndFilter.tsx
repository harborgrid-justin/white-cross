'use client';

/**
 * SearchAndFilter Component - Search input with filter and sort controls
 *
 * Reusable component providing search, filter, and sort functionality for
 * lists and tables. Used across health records, students, and other data views.
 *
 * @module components/features/health-records/shared/SearchAndFilter
 * @component
 * @since 2025-10-17
 */

import React from 'react'
import { Search, Filter } from 'lucide-react'

/**
 * Props for SearchAndFilter component
 *
 * @interface SearchAndFilterProps
 * @property {string} searchQuery - Current search query value
 * @property {(query: string) => void} onSearchChange - Callback when search changes
 * @property {Array<{value: string, label: string}>} [filterOptions=[]] - Filter dropdown options
 * @property {string} [filterValue=''] - Current filter selection
 * @property {(value: string) => void} [onFilterChange] - Callback when filter changes
 * @property {Array<{value: string, label: string}>} [sortOptions=[]] - Sort dropdown options
 * @property {string} [sortValue=''] - Current sort selection
 * @property {(value: string) => void} [onSortChange] - Callback when sort changes
 * @property {string} [searchPlaceholder='Search...'] - Placeholder text for search input
 * @property {boolean} [showFilter=true] - Show filter dropdown
 * @property {boolean} [showSort=true] - Show sort dropdown
 * @property {Object} [testIds={}] - Test IDs for testing automation
 * @property {string} [testIds.search] - Test ID for search input
 * @property {string} [testIds.filter] - Test ID for filter select
 * @property {string} [testIds.sort] - Test ID for sort select
 *
 * @example
 * ```tsx
 * <SearchAndFilter
 *   searchQuery={query}
 *   onSearchChange={setQuery}
 *   filterOptions={[
 *     { value: 'all', label: 'All Types' },
 *     { value: 'physical', label: 'Physical Exams' }
 *   ]}
 *   filterValue={filterType}
 *   onFilterChange={setFilterType}
 * />
 * ```
 */
interface SearchAndFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterOptions?: Array<{
    value: string
    label: string
  }>
  filterValue?: string
  onFilterChange?: (value: string) => void
  sortOptions?: Array<{
    value: string
    label: string
  }>
  sortValue?: string
  onSortChange?: (value: string) => void
  searchPlaceholder?: string
  showFilter?: boolean
  showSort?: boolean
  testIds?: {
    search?: string
    filter?: string
    sort?: string
  }
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  filterOptions = [],
  filterValue = '',
  onFilterChange,
  sortOptions = [],
  sortValue = '',
  onSortChange,
  searchPlaceholder = 'Search...',
  showFilter = true,
  showSort = true,
  testIds = {}
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid={testIds.search || 'search-input'}
        />
      </div>
      
      {showFilter && filterOptions.length > 0 && (
        <select 
          className="border border-gray-300 rounded-lg px-3 py-2" 
          data-testid={testIds.filter || 'filter-select'}
          value={filterValue}
          onChange={(e) => onFilterChange?.(e.target.value)}
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      
      {showSort && sortOptions.length > 0 && (
        <select 
          className="border border-gray-300 rounded-lg px-3 py-2" 
          data-testid={testIds.sort || 'sort-select'}
          value={sortValue}
          onChange={(e) => onSortChange?.(e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      
      {showFilter && filterOptions.length === 0 && (
        <button className="btn-secondary flex items-center" data-testid="filter-button">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      )}
    </div>
  )
}