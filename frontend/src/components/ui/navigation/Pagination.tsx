'use client';

/**
 * WF-PAGINATION-001 | Pagination.tsx - Pagination Component
 * Purpose: Page navigation for lists and tables
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: DataTable, lists, search results
 * Related: Table, DataTable
 * Exports: Pagination component | Key Features: Page navigation, jump to page, items per page
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Click page → Update current page → Fetch data
 * LLM Context: Pagination component for White Cross healthcare platform
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Pagination component.
 */
export interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems?: number;
  /** Items per page */
  itemsPerPage?: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when items per page changes */
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  /** Show items per page selector */
  showItemsPerPage?: boolean;
  /** Items per page options */
  itemsPerPageOptions?: number[];
  /** Show total items count */
  showTotalItems?: boolean;
  /** Show first/last page buttons */
  showFirstLast?: boolean;
  /** Maximum page buttons to show */
  maxPageButtons?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * Generate page numbers to display
 */
const generatePageNumbers = (currentPage: number, totalPages: number, maxButtons: number): (number | 'ellipsis')[] => {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const halfMax = Math.floor(maxButtons / 2);

  // Always show first page
  pages.push(1);

  let startPage = Math.max(2, currentPage - halfMax);
  let endPage = Math.min(totalPages - 1, currentPage + halfMax);

  // Adjust if near start
  if (currentPage <= halfMax + 1) {
    endPage = maxButtons - 1;
  }

  // Adjust if near end
  if (currentPage >= totalPages - halfMax) {
    startPage = totalPages - maxButtons + 2;
  }

  // Add ellipsis after first page if needed
  if (startPage > 2) {
    pages.push('ellipsis');
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add ellipsis before last page if needed
  if (endPage < totalPages - 1) {
    pages.push('ellipsis');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};

/**
 * Pagination component for lists and tables.
 *
 * Provides page navigation with first/last, previous/next, and numbered page buttons.
 * Supports items per page selection and displays total items count.
 *
 * **Features:**
 * - Numbered page buttons
 * - Previous/Next navigation
 * - First/Last page buttons (optional)
 * - Items per page selector (optional)
 * - Total items display (optional)
 * - Smart ellipsis for many pages
 * - Keyboard accessible
 * - Dark mode support
 *
 * **Accessibility:**
 * - Semantic navigation element
 * - aria-label for navigation context
 * - aria-current for current page
 * - Keyboard navigation (Tab, Enter/Space)
 * - Disabled state for unavailable actions
 *
 * @component
 * @param {PaginationProps} props - Pagination component props
 * @returns {JSX.Element} Rendered pagination controls
 *
 * @example
 * ```tsx
 * // Basic pagination
 * <Pagination
 *   currentPage={page}
 *   totalPages={10}
 *   onPageChange={setPage}
 * />
 *
 * // Pagination with items per page
 * <Pagination
 *   currentPage={page}
 *   totalPages={totalPages}
 *   totalItems={totalItems}
 *   itemsPerPage={itemsPerPage}
 *   onPageChange={setPage}
 *   onItemsPerPageChange={setItemsPerPage}
 *   showItemsPerPage
 *   showTotalItems
 * />
 *
 * // Pagination with first/last buttons
 * <Pagination
 *   currentPage={page}
 *   totalPages={50}
 *   onPageChange={setPage}
 *   showFirstLast
 *   maxPageButtons={7}
 * />
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Paginate patient lists
 * - Paginate medication administration records
 * - Paginate health record entries
 * - Paginate search results
 * - Keep items per page reasonable for medical data review
 *
 * @see {@link PaginationProps} for detailed prop documentation
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = false,
  itemsPerPageOptions = [10, 25, 50, 100],
  showTotalItems = false,
  showFirstLast = false,
  maxPageButtons = 7,
  disabled = false,
  className,
}) => {
  const canGoPrevious = currentPage > 1 && !disabled;
  const canGoNext = currentPage < totalPages && !disabled;

  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    onItemsPerPageChange?.(newItemsPerPage);
    // Reset to first page when changing items per page
    handlePageChange(1);
  };

  const pageNumbers = generatePageNumbers(currentPage, totalPages, maxPageButtons);

  const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}
    >
      {/* Left side: Items info and per-page selector */}
      <div className="flex items-center gap-4">
        {showTotalItems && totalItems !== undefined && (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        )}

        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm text-gray-700 dark:text-gray-300">
              Per page:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              disabled={disabled}
              className="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right side: Page navigation */}
      <div className="flex items-center gap-1">
        {/* First page button */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={!canGoPrevious}
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              canGoPrevious
                ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                : 'text-gray-400 cursor-not-allowed dark:text-gray-600'
            )}
            aria-label="Go to first page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={cn(
            'px-3 py-2 rounded-md text-sm font-medium transition-colors',
            canGoPrevious
              ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              : 'text-gray-400 cursor-not-allowed dark:text-gray-600'
          )}
          aria-label="Go to previous page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-400 dark:text-gray-600"
              >
                ...
              </span>
            );
          }

          const isCurrentPage = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={disabled}
              aria-current={isCurrentPage ? 'page' : undefined}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isCurrentPage
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {page}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={cn(
            'px-3 py-2 rounded-md text-sm font-medium transition-colors',
            canGoNext
              ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              : 'text-gray-400 cursor-not-allowed dark:text-gray-600'
          )}
          aria-label="Go to next page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Last page button */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={!canGoNext}
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              canGoNext
                ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                : 'text-gray-400 cursor-not-allowed dark:text-gray-600'
            )}
            aria-label="Go to last page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
};

Pagination.displayName = 'Pagination';

export default Pagination;
