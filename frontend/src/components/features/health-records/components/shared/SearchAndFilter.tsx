/**
 * WF-COMP-025 | SearchAndFilter.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Search, Filter } from 'lucide-react'

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