/**
 * MedicationsPagination Component
 *
 * Comprehensive pagination controls for medication lists supporting page navigation,
 * dynamic page size selection, and direct page jumping. Provides clear visual feedback
 * about current position in result set with intelligent page number display.
 *
 * @component
 *
 * @param {MedicationsPaginationProps} props - Component properties
 * @param {number} props.currentPage - Current active page (1-indexed)
 * @param {number} props.pageSize - Number of medications displayed per page
 * @param {number} props.totalCount - Total number of medications across all pages
 * @param {(page: number, pageSize: number) => void} props.onPageChange - Callback invoked when page or page size changes
 *
 * @returns {React.FC<MedicationsPaginationProps>} Medication pagination component
 *
 * @example
 * ```tsx
 * import { MedicationsPagination } from './components/MedicationsPagination';
 *
 * function MedicationList() {
 *   const [currentPage, setCurrentPage] = useState(1);
 *   const [pageSize, setPageSize] = useState(20);
 *   const totalCount = 150; // From API response
 *
 *   const handlePageChange = (page: number, newPageSize: number) => {
 *     setCurrentPage(page);
 *     setPageSize(newPageSize);
 *     // Fetch medications for new page
 *   };
 *
 *   return (
 *     <MedicationsPagination
 *       currentPage={currentPage}
 *       pageSize={pageSize}
 *       totalCount={totalCount}
 *       onPageChange={handlePageChange}
 *     />
 *   );
 * }
 * ```
 *
 * @remarks
 * **Pagination Features**:
 * - First/Last page quick navigation (««, »» buttons)
 * - Previous/Next page navigation (‹, › buttons)
 * - Direct page number selection (clickable page numbers)
 * - Jump to specific page via text input (Enter to navigate)
 * - Dynamic page size selection (10, 20, 50, 100 items per page)
 * - Current position indicator (showing X-Y of Z medications)
 *
 * **Smart Page Display**:
 * - Shows maximum 5 page numbers at a time
 * - Centers current page in visible range when possible
 * - Adjusts visible range at start/end of pagination
 * - Disabled state for unavailable navigation (first page, last page)
 *
 * **Page Size Change Behavior**:
 * - Maintains approximate scroll position when changing page size
 * - Recalculates current page to show similar items
 * - Example: Page 3 of 10/page → Page 2 of 20/page (shows items 21-40)
 *
 * **User Experience**:
 * - Hides pagination when no results (totalCount === 0)
 * - Clear visual feedback for current page (active state)
 * - Disabled buttons for unavailable actions (prevents errors)
 * - Tooltips on navigation buttons for clarity
 *
 * **Accessibility**:
 * - Semantic button elements for all navigation actions
 * - Disabled attribute on unavailable navigation options
 * - Title attributes for screen reader context
 * - Keyboard navigation support (Tab, Enter)
 * - Labeled form controls (page size selector, jump to page input)
 *
 * **State Management**:
 * - Pure component - all state managed by parent
 * - onPageChange callback provides both page and pageSize
 * - Parent responsible for data fetching and state updates
 *
 * @see {@link MedicationsList} for paginated list display
 * @see {@link MedicationFilters} for combining pagination with filtering
 *
 * @since 1.0.0
 */

import React from 'react';

/**
 * Props for MedicationsPagination component
 *
 * @interface MedicationsPaginationProps
 *
 * @property {number} currentPage - Current page number (1-indexed, not 0-indexed)
 * @property {number} pageSize - Number of items displayed per page (10, 20, 50, or 100)
 * @property {number} totalCount - Total number of medications across all pages
 * @property {(page: number, pageSize: number) => void} onPageChange - Callback receiving new page and page size
 *
 * @remarks
 * Component calculates total pages as Math.ceil(totalCount / pageSize).
 * Returns null and renders nothing when totalCount is 0.
 */
interface MedicationsPaginationProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number, pageSize: number) => void;
}

export const MedicationsPagination: React.FC<MedicationsPaginationProps> = ({
  currentPage,
  pageSize,
  totalCount,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newPage = Math.ceil((currentPage - 1) * pageSize / newPageSize) + 1;
    onPageChange(newPage, newPageSize);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="medications-pagination">
      <div className="pagination-info">
        <span>
          Showing {startIndex}-{endIndex} of {totalCount} medications
        </span>
      </div>

      <div className="pagination-controls">
        {/* Page Size Selector */}
        <div className="page-size-selector">
          <label htmlFor="pageSize">Per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Page Navigation */}
        <div className="page-navigation">
          {/* First Page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="page-button first"
            title="First page"
          >
            ««
          </button>

          {/* Previous Page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-button previous"
            title="Previous page"
          >
            ‹
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`page-button ${page === currentPage ? 'active' : ''}`}
              title={`Page ${page}`}
            >
              {page}
            </button>
          ))}

          {/* Next Page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-button next"
            title="Next page"
          >
            ›
          </button>

          {/* Last Page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="page-button last"
            title="Last page"
          >
            »»
          </button>
        </div>
      </div>

      {/* Jump to Page */}
      <div className="jump-to-page">
        <label htmlFor="jumpToPage">Go to page:</label>
        <input
          id="jumpToPage"
          type="number"
          min={1}
          max={totalPages}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLInputElement;
              const page = Number(target.value);
              if (page >= 1 && page <= totalPages) {
                handlePageChange(page);
                target.value = '';
              }
            }
          }}
          placeholder={`1-${totalPages}`}
        />
      </div>
    </div>
  );
};

export default MedicationsPagination;
