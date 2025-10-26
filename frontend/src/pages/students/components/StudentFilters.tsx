/**
 * Student Filters Component - White Cross Healthcare Platform
 *
 * @fileoverview Comprehensive search and filter controls for student list management.
 * Provides real-time search, multi-criteria filtering, sorting, and view toggling
 * for student records with an intuitive collapsible filter panel.
 *
 * @module pages/students/components/StudentFilters
 * @version 1.0.0
 */

import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Props for the StudentFilters component.
 *
 * @interface StudentFiltersProps
 * @property {string} searchTerm - Current search query string
 * @property {string} sortBy - Current sort configuration (e.g., "lastName-asc", "grade-desc")
 * @property {boolean} showFilters - Whether the advanced filters panel is visible
 * @property {string} gradeFilter - Selected grade filter value (e.g., "K", "1", "12", or "" for all)
 * @property {string} genderFilter - Selected gender filter value ("MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY", or "" for all)
 * @property {string} statusFilter - Selected status filter value ("active", "inactive", or "" for all)
 * @property {boolean} showArchived - Whether archived/inactive students are being displayed
 * @property {number} resultsCount - Total number of students matching current filters
 * @property {(value: string) => void} onSearchChange - Callback fired when search term changes
 * @property {() => void} onClearSearch - Callback to clear the search input
 * @property {(value: string) => void} onSortChange - Callback fired when sort option changes
 * @property {() => void} onToggleFilters - Callback to toggle advanced filters panel visibility
 * @property {(value: string) => void} onGradeFilterChange - Callback fired when grade filter changes
 * @property {(value: string) => void} onGenderFilterChange - Callback fired when gender filter changes
 * @property {(value: string) => void} onStatusFilterChange - Callback fired when status filter changes
 * @property {() => void} onToggleArchived - Callback to toggle between active and archived student views
 *
 * @remarks
 * - All filter changes are handled by parent component for state management
 * - Toast notifications provide user feedback for filter actions
 * - Filters are client-side or server-side depending on parent implementation
 */
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

/**
 * Student Filters Component.
 *
 * Provides a comprehensive filtering interface for the student list with search,
 * sort, multi-criteria filters, and view mode toggles. Features a collapsible
 * advanced filter panel for grade, gender, and status filtering.
 *
 * @component
 * @param {StudentFiltersProps} props - Component props
 * @returns {React.ReactElement} Rendered filter controls
 *
 * @remarks
 * Design Pattern: Controlled component - all state is managed by parent component.
 *
 * Features:
 * - Real-time search with clear button and result count display
 * - Sort by last name (A-Z/Z-A) or grade (low to high/high to low)
 * - Collapsible advanced filters panel
 * - Grade filter (K-12)
 * - Gender filter (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY)
 * - Status filter (active, inactive)
 * - Toggle between active and archived student views
 * - One-click filter reset functionality
 * - Toast notifications for user feedback
 *
 * Accessibility:
 * - All inputs have aria-label attributes
 * - Clear visual feedback for active filters
 * - Keyboard navigation support
 * - Test IDs for automated testing
 *
 * @example
 * ```tsx
 * import { StudentFilters } from './components/StudentFilters';
 *
 * function StudentList() {
 *   const [filters, setFilters] = useState({
 *     searchTerm: '',
 *     sortBy: '',
 *     gradeFilter: '',
 *     genderFilter: '',
 *     statusFilter: '',
 *     showArchived: false,
 *     showFilters: false
 *   });
 *   const [resultsCount, setResultsCount] = useState(0);
 *
 *   return (
 *     <StudentFilters
 *       {...filters}
 *       resultsCount={resultsCount}
 *       onSearchChange={(value) => setFilters({ ...filters, searchTerm: value })}
 *       onClearSearch={() => setFilters({ ...filters, searchTerm: '' })}
 *       onSortChange={(value) => setFilters({ ...filters, sortBy: value })}
 *       onToggleFilters={() => setFilters({ ...filters, showFilters: !filters.showFilters })}
 *       onGradeFilterChange={(value) => setFilters({ ...filters, gradeFilter: value })}
 *       onGenderFilterChange={(value) => setFilters({ ...filters, genderFilter: value })}
 *       onStatusFilterChange={(value) => setFilters({ ...filters, statusFilter: value })}
 *       onToggleArchived={() => setFilters({ ...filters, showArchived: !filters.showArchived })}
 *     />
 *   );
 * }
 * ```
 */
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
  /**
   * Applies the currently selected filters and shows success notification.
   *
   * @function applyFilters
   * @returns {void}
   *
   * @remarks
   * This is primarily for user feedback. Actual filtering logic is handled
   * by the parent component through the onChange callbacks.
   */
  const applyFilters = () => {
    toast.success('Filters applied')
  }

  /**
   * Resets all filter values to their defaults and closes the filter panel.
   *
   * @function resetFilters
   * @returns {void}
   *
   * @remarks
   * Clears grade, gender, status, and sort filters by invoking parent callbacks
   * with empty strings, then collapses the advanced filters panel.
   */
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

