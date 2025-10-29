'use client';

import { Pagination } from '@/components/ui/navigation/Pagination';

/**
 * WF-COMP-STUDENT-003 | StudentPagination.tsx
 * Purpose: Pagination controls for student lists with page size options
 *
 * @module app/(dashboard)/students/_components/StudentPagination
 */

/**
 * Pagination state interface
 */
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Props for StudentPagination component
 */
interface StudentPaginationProps {
  /** Current pagination state */
  pagination: PaginationState;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange: (pageSize: number) => void;
  /** Whether pagination is disabled (e.g., during loading) */
  disabled?: boolean;
  /** Optional className for styling */
  className?: string;
}

/**
 * StudentPagination Component
 *
 * Provides pagination controls for student lists with:
 * - Page navigation (first, previous, next, last)
 * - Page size selector
 * - Total count display
 * - Keyboard navigation support
 *
 * **Features:**
 * - Standard pagination UI
 * - Configurable page sizes
 * - Disabled state during loading
 * - Accessible controls
 * - Result count display
 *
 * **Accessibility:**
 * - Keyboard navigation
 * - ARIA labels
 * - Focus management
 * - Screen reader friendly
 *
 * @component
 * @example
 * ```tsx
 * const [pagination, setPagination] = useState<PaginationState>({
 *   currentPage: 1,
 *   pageSize: 25,
 *   totalItems: 150,
 *   totalPages: 6
 * });
 *
 * <StudentPagination
 *   pagination={pagination}
 *   onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
 *   onPageSizeChange={(size) => setPagination({ ...pagination, pageSize: size })}
 * />
 * ```
 */
export function StudentPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  disabled = false,
  className = ''
}: StudentPaginationProps) {
  const { currentPage, pageSize, totalItems, totalPages } = pagination;

  /**
   * Calculate the range of items being displayed
   */
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  /**
   * Available page size options
   */
  const pageSizeOptions = [10, 25, 50, 100];

  /**
   * Handle page size change
   */
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    // Reset to first page when changing page size
    onPageChange(1);
    onPageSizeChange(newPageSize);
  };

  return (
    <div className={`flex items-center justify-between py-4 ${className}`}>
      {/* Results Summary */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> students
        </p>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-gray-700">
            Per page:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={disabled}
            className="block rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        disabled={disabled}
      />
    </div>
  );
}
