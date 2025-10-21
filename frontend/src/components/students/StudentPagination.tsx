/**
 * WF-COMP-100 | StudentPagination.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Student Pagination Component
 * Pagination controls for student list
 */

import React from 'react'

interface StudentPaginationProps {
  currentPage: number
  totalPages: number
  perPage: number
  totalResults: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

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
