/**
 * WF-COMP-099 | StudentFilters.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react, react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Student Filters Component
 * Search and filter controls for student list
 */

import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface StudentFiltersProps {
  searchTerm: string
  sortBy: string
  showFilters: boolean
  gradeFilter: string
  genderFilter: string
  statusFilter: string
  showArchived: boolean
  resultsCount: number
  onSearchChange: (value: string) => void
  onClearSearch: () => void
  onSortChange: (value: string) => void
  onToggleFilters: () => void
  onGradeFilterChange: (value: string) => void
  onGenderFilterChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onToggleArchived: () => void
}

export const StudentFilters: React.FC<StudentFiltersProps> = ({
  searchTerm,
  sortBy,
  showFilters,
  gradeFilter,
  genderFilter,
  statusFilter,
  showArchived,
  resultsCount,
  onSearchChange,
  onClearSearch,
  onSortChange,
  onToggleFilters,
  onGradeFilterChange,
  onGenderFilterChange,
  onStatusFilterChange,
  onToggleArchived
}) => {
  const applyFilters = () => {
    toast.success('Filters applied')
  }

  const resetFilters = () => {
    onGradeFilterChange('')
    onGenderFilterChange('')
    onStatusFilterChange('')
    onSortChange('')
    onToggleFilters()
    toast.success('Filters cleared')
  }

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search students by name, ID, or grade..."
              className="input-field pl-10 pr-10"
              data-testid="search-input"
              aria-label="Search students"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                data-testid="clear-search-button"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="text-sm text-gray-600 mt-1" data-testid="results-count">
              {resultsCount} result{resultsCount !== 1 ? 's' : ''} found
            </div>
          )}
        </div>
        <select
          className="input-field"
          data-testid="sort-by-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="lastName-asc">Last Name (A-Z)</option>
          <option value="lastName-desc">Last Name (Z-A)</option>
          <option value="grade-asc">Grade (Low to High)</option>
          <option value="grade-desc">Grade (High to Low)</option>
        </select>
        <button
          className="btn-secondary flex items-center"
          data-testid="filter-button"
          onClick={onToggleFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
        {!showArchived ? (
          <button
            className="btn-secondary"
            data-testid="view-archived-button"
            onClick={onToggleArchived}
          >
            View Archived
          </button>
        ) : (
          <button
            className="btn-secondary"
            data-testid="view-active-button"
            onClick={onToggleArchived}
          >
            View Active
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg" data-testid="filter-dropdown">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select
                className="input-field"
                data-testid="grade-filter-select"
                value={gradeFilter}
                onChange={(e) => onGradeFilterChange(e.target.value)}
              >
                <option value="">All Grades</option>
                <option value="K">Kindergarten</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade.toString()}>Grade {grade}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                className="input-field"
                data-testid="gender-filter-select"
                value={genderFilter}
                onChange={(e) => onGenderFilterChange(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="input-field"
                data-testid="active-status-filter"
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
              >
                <option value="">All Students</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                className="btn-primary"
                data-testid="apply-filters-button"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
              <button
                className="btn-secondary"
                data-testid="reset-filters-button"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

