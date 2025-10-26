/**
 * Student Pagination Component - White Cross Healthcare Platform
 *
 * @fileoverview Pagination controls for student list with page navigation,
 * results-per-page selector, and page indicator. Automatically calculates
 * result ranges and provides Previous/Next/Last navigation buttons.
 *
 * @module pages/students/components/StudentPagination
 * @version 1.0.0
 */

import React from 'react'

/**
 * Props for the StudentPagination component.
 *
 * @interface StudentPaginationProps
 * @property {number} currentPage - Current active page number (1-indexed)
 * @property {number} totalPages - Total number of pages available
 * @property {number} perPage - Number of results displayed per page (10, 25, or 50)
 * @property {number} totalResults - Total number of student records available
 * @property {(page: number) => void} onPageChange - Callback fired when page changes
 * @property {(perPage: number) => void} onPerPageChange - Callback fired when results-per-page changes
 *
 * @remarks
 * All page navigation resets to page 1 when changing the perPage value to ensure
 * a consistent user experience.
 */
interface StudentPaginationProps {
  currentPage: number
  totalPages: number
  perPage: number
  totalResults: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

/**
 * Student Pagination Component.
 *
 * Comprehensive pagination controls for navigating through student records.
 * Includes page number buttons, previous/next/last navigation, results-per-page
 * selector, and a clear display of current result range.
 *
 * @component
 * @param {StudentPaginationProps} props - Component props
 * @returns {React.ReactElement | null} Rendered pagination controls or null if no results
 *
 * @remarks
 * Design Pattern: Controlled component - all state is managed by parent component.
 *
 * Features:
 * - Displays current result range (e.g., "Showing 1 to 20 of 156 results")
 * - Results-per-page selector (10, 25, 50 options)
 * - Previous/Next/Last navigation buttons
 * - Direct page number navigation (displays all page buttons)
 * - Automatic calculation of start/end indices
 * - Disabled state for boundary pages
 * - Returns null when no results to display
 * - Test IDs for automated testing
 *
 * Accessibility:
 * - Clear visual feedback for current page
 * - Disabled state for unavailable navigation
 * - Test IDs on all interactive elements
 *
 * @example
 * ```tsx
 * import { StudentPagination } from './components/StudentPagination';
 *
 * function StudentList() {
 *   const [pagination, setPagination] = useState({
 *     currentPage: 1,
 *     perPage: 25,
 *     totalResults: 156
 *   });
 *   const totalPages = Math.ceil(pagination.totalResults / pagination.perPage);
 *
 *   return (
 *     <>
 *       {/* Student list rendering */}
 *       <StudentPagination
 *         currentPage={pagination.currentPage}
 *         totalPages={totalPages}
 *         perPage={pagination.perPage}
 *         totalResults={pagination.totalResults}
 *         onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
 *         onPerPageChange={(perPage) => setPagination({ ...pagination, perPage, currentPage: 1 })}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export const StudentPagination: React.FC<StudentPaginationProps> = ({
  currentPage,
  totalPages,
  perPage,
  totalResults,
  onPageChange,
  onPerPageChange
}) => {
  const startIndex = (currentPage - 1) * perPage + 1
  const endIndex = Math.min(currentPage * perPage, totalResults)

  if (totalResults === 0) {
    return null
  }

  return (
    <div className="mt-6 flex items-center justify-between" data-testid="pagination-controls">
      <div className="text-sm text-gray-700">
        Showing {startIndex} to {endIndex} of {totalResults} results
      </div>
      <div className="flex items-center space-x-2">
        <select
          className="input-field text-sm"
          data-testid="per-page-select"
          value={perPage}
          onChange={(e) => {
            onPerPageChange(parseInt(e.target.value))
            onPageChange(1)
          }}
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
        <button
          className="btn-secondary"
          data-testid="previous-page-button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
            }`}
            data-testid={`page-number-${i + 1}`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="btn-secondary"
          data-testid="next-page-button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
        <button
          className="btn-secondary"
          data-testid="last-page-button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </button>
        <span className="text-sm text-gray-600" data-testid="page-indicator">
          Page {currentPage} <span data-testid="total-pages">of {totalPages}</span>
        </span>
      </div>
    </div>
  )
}

