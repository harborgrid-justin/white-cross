'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
  TableLoadingState
} from '@/components/ui/data/Table';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Column definition for DataTable
 */
export interface DataTableColumn<T> {
  /** Unique identifier for the column */
  id: string;
  /** Column header label */
  header: string;
  /** Function to access the cell value from row data */
  accessor: (row: T) => React.ReactNode;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Custom sort function */
  sortFn?: (a: T, b: T) => number;
  /** Column width */
  width?: string;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether to hide on mobile */
  hideOnMobile?: boolean;
  /** Custom className for cells */
  cellClassName?: string;
}

/**
 * DataTable props
 */
export interface DataTableProps<T> {
  /** Array of data to display */
  data: T[];
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Loading state */
  loading?: boolean;
  /** Loading rows count for skeleton */
  loadingRows?: number;
  /** Empty state title */
  emptyTitle?: string;
  /** Empty state description */
  emptyDescription?: string;
  /** Custom empty state component */
  emptyState?: React.ReactNode;
  /** Enable search */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Custom search function */
  onSearch?: (query: string) => void;
  /** Enable pagination */
  paginated?: boolean;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Initial page size */
  initialPageSize?: number;
  /** Total count for server-side pagination */
  totalCount?: number;
  /** Current page for controlled pagination */
  currentPage?: number;
  /** Page change handler for controlled pagination */
  onPageChange?: (page: number) => void;
  /** Page size change handler */
  onPageSizeChange?: (pageSize: number) => void;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row IDs */
  selectedRows?: Set<string | number>;
  /** Selection change handler */
  onSelectionChange?: (selectedIds: Set<string | number>) => void;
  /** Function to get unique ID from row */
  getRowId?: (row: T) => string | number;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Table size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Table variant */
  variant?: 'default' | 'striped' | 'bordered';
  /** Custom className */
  className?: string;
  /** Accessible label for the table */
  ariaLabel?: string;
}

/**
 * DataTable - A comprehensive data table component with search, sort, pagination, and selection
 *
 * @example
 * ```tsx
 * const columns: DataTableColumn<User>[] = [
 *   { id: 'name', header: 'Name', accessor: (row) => row.name, sortable: true },
 *   { id: 'email', header: 'Email', accessor: (row) => row.email },
 *   { id: 'role', header: 'Role', accessor: (row) => <Badge>{row.role}</Badge> }
 * ];
 *
 * <DataTable
 *   data={users}
 *   columns={columns}
 *   searchable
 *   paginated
 *   selectable
 * />
 * ```
 */
export const DataTable = <T,>({
  data,
  columns,
  loading = false,
  loadingRows = 5,
  emptyTitle = 'No data found',
  emptyDescription = 'Try adjusting your search or filters',
  emptyState,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  paginated = false,
  pageSizeOptions = [10, 25, 50, 100],
  initialPageSize = 10,
  totalCount,
  currentPage: controlledCurrentPage,
  onPageChange: controlledPageChange,
  onPageSizeChange,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (row: T, index: number) => index,
  onRowClick,
  size = 'md',
  variant = 'default',
  className,
  ariaLabel = 'Data table'
}: DataTableProps<T>): React.ReactElement => {
  // Local state for search
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for sorting
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Local state for pagination (uncontrolled)
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Use controlled or uncontrolled pagination
  const currentPage = controlledCurrentPage ?? internalCurrentPage;
  const handlePageChange = useCallback((page: number) => {
    if (controlledPageChange) {
      controlledPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  }, [controlledPageChange]);

  // Handle search
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
    // Reset to first page on search
    handlePageChange(1);
  }, [onSearch, handlePageChange]);

  // Handle sorting
  const handleSort = useCallback((columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filter (client-side if no onSearch callback)
    if (searchable && !onSearch && searchQuery) {
      result = result.filter(row =>
        columns.some(col => {
          const value = col.accessor(row);
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortColumn) {
      const column = columns.find(col => col.id === sortColumn);
      if (column) {
        result.sort((a, b) => {
          if (column.sortFn) {
            return sortDirection === 'asc' ? column.sortFn(a, b) : column.sortFn(b, a);
          }
          const aVal = column.accessor(a);
          const bVal = column.accessor(b);
          const comparison = String(aVal).localeCompare(String(bVal));
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      }
    }

    return result;
  }, [data, columns, searchable, onSearch, searchQuery, sortColumn, sortDirection]);

  // Pagination calculations
  const totalItems = totalCount ?? processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = paginated ? processedData.slice(startIndex, endIndex) : processedData;

  // Handle selection
  const allRowsSelected = selectable && paginatedData.length > 0 &&
    paginatedData.every((row, index) => selectedRows.has(getRowId(row, startIndex + index)));

  const someRowsSelected = selectable && selectedRows.size > 0 && !allRowsSelected;

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;

    if (allRowsSelected) {
      // Deselect all current page rows
      const newSelection = new Set(selectedRows);
      paginatedData.forEach((row, index) => {
        newSelection.delete(getRowId(row, startIndex + index));
      });
      onSelectionChange(newSelection);
    } else {
      // Select all current page rows
      const newSelection = new Set(selectedRows);
      paginatedData.forEach((row, index) => {
        newSelection.add(getRowId(row, startIndex + index));
      });
      onSelectionChange(newSelection);
    }
  }, [allRowsSelected, paginatedData, selectedRows, onSelectionChange, getRowId, startIndex]);

  const handleSelectRow = useCallback((row: T, index: number) => {
    if (!onSelectionChange) return;

    const rowId = getRowId(row, startIndex + index);
    const newSelection = new Set(selectedRows);

    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      newSelection.add(rowId);
    }

    onSelectionChange(newSelection);
  }, [selectedRows, onSelectionChange, getRowId, startIndex]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      {searchable && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
              aria-label="Search table"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
        <Table variant={variant} size={size} aria-label={ariaLabel}>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={allRowsSelected}
                    ref={input => {
                      if (input) input.indeterminate = someRowsSelected;
                    }}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              {columns.map(column => (
                <TableHead
                  key={column.id}
                  sortable={column.sortable}
                  sortDirection={sortColumn === column.id ? sortDirection : null}
                  onSort={column.sortable ? () => handleSort(column.id) : undefined}
                  style={{ width: column.width }}
                  className={cn(
                    column.align === 'center' ? 'text-center' : undefined,
                    column.align === 'right' ? 'text-right' : undefined,
                    column.hideOnMobile ? 'hidden md:table-cell' : undefined
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableLoadingState rows={loadingRows} cols={columns.length + (selectable ? 1 : 0)} />
            ) : paginatedData.length === 0 ? (
              <TableEmptyState colSpan={columns.length + (selectable ? 1 : 0)}>
                {emptyState || (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{emptyTitle}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{emptyDescription}</p>
                  </div>
                )}
              </TableEmptyState>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowId = getRowId(row, startIndex + rowIndex);
                const isSelected = selectedRows.has(rowId);

                return (
                  <TableRow
                    key={rowId}
                    selected={isSelected}
                    clickable={!!onRowClick}
                    onClick={() => onRowClick?.(row)}
                    className="dark:hover:bg-gray-800"
                  >
                    {selectable && (
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(row, rowIndex);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      </TableCell>
                    )}
                    {columns.map(column => (
                      <TableCell
                        key={column.id}
                        className={cn(
                          column.align === 'center' ? 'text-center' : undefined,
                          column.align === 'right' ? 'text-right' : undefined,
                          column.hideOnMobile ? 'hidden md:table-cell' : undefined,
                          column.cellClassName,
                          'dark:text-gray-200'
                        )}
                      >
                        {column.accessor(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {paginated && !loading && paginatedData.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </span>
            <Select
              value={String(pageSize)}
              onChange={(value) => {
                const newSize = Number(value);
                setPageSize(newSize);
                onPageSizeChange?.(newSize);
                handlePageChange(1);
              }}
              options={pageSizeOptions.map(size => ({ value: String(size), label: `${size} per page` }))}
              size="sm"
              className="ml-4"
              aria-label="Rows per page"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

DataTable.displayName = 'DataTable';

export default React.memo(DataTable) as typeof DataTable;
