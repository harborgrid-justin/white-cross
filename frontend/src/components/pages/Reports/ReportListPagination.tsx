'use client';

import React from 'react';

/**
 * Props for ReportListPagination component
 */
interface ReportListPaginationProps {
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Starting index of current page items */
  startIndex: number;
  /** Ending index of current page items */
  endIndex: number;
  /** Total number of items */
  totalItems: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
}

/**
 * Pagination component for ReportList
 *
 * Displays pagination controls including page numbers, previous/next buttons,
 * and information about the current page range.
 *
 * @param props - ReportListPagination component props
 * @returns JSX element representing the pagination controls
 */
export const ReportListPagination: React.FC<ReportListPaginationProps> = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange
}) => {
  // Don't render if there's only one page or less
  if (totalPages <= 1) {
    return null;
  }

  /**
   * Generates array of page numbers to display
   * Shows up to 5 page numbers centered around current page
   */
  const getPageNumbers = (): (number | null)[] => {
    const pages: (number | null)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range around current page
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Adjust start if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Showing {startIndex} to {endIndex} of {totalItems} reports
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300
                   rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === null) {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`
                px-3 py-2 text-sm font-medium border rounded-md
                ${pageNum === currentPage
                  ? 'text-white bg-blue-600 border-blue-600'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300
                   rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportListPagination;
