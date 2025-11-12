'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BillingListPaginationProps } from './types';

/**
 * BillingListPagination Component
 *
 * Displays pagination controls for navigating through invoice pages.
 * Includes mobile and desktop variants with page information.
 *
 * @param props - BillingListPagination component props
 * @returns JSX element representing the pagination controls
 */
const BillingListPagination: React.FC<BillingListPaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-8">
      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{' '}
            of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + Math.max(1, currentPage - 2);
              if (page > totalPages) return null;

              return (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    page === currentPage
                      ? 'z-10 bg-green-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BillingListPagination;
