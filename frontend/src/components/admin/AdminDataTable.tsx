'use client';

/**
 * AdminDataTable Component
 *
 * Advanced data table component for admin interfaces with filtering,
 * sorting, pagination, and export capabilities.
 * Now with dark mode support and semantic design tokens.
 *
 * @module components/admin/AdminDataTable
 * @since 2025-10-26
 * @updated 2025-11-04 - Added dark mode support
 */

import React, { useState, useMemo } from 'react';
import {
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Filter,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
}

export interface AdminDataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  exportable?: boolean
  onExport?: (format: 'csv' | 'json' | 'excel') => void
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  className?: string
}

const AdminDataTableComponent = function AdminDataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Search...',
  exportable = true,
  onExport,
  pagination,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className = ''
}: AdminDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showExportMenu, setShowExportMenu] = useState(false)

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [data, searchQuery])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue === bValue) return 0

      const comparison = aValue > bValue ? 1 : -1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortColumn, sortDirection])

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return

    if (sortColumn === column.key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column.key)
      setSortDirection('asc')
    }
  }

  const handleExport = (format: 'csv' | 'json' | 'excel') => {
    setShowExportMenu(false)
    onExport?.(format)
  }

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null

    if (sortColumn !== column.key) {
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />
    }

    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary dark:text-primary" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary dark:text-primary" />
    )
  }

  return (
    <div className={cn(
      'bg-card dark:bg-card rounded-lg shadow-card dark:shadow-none border border-border dark:border-border/50',
      className
    )}>
      {/* Header Controls */}
      {(searchable || exportable) && (
        <div className="p-4 border-b border-border dark:border-border/50 flex items-center justify-between gap-4">
          {/* Search */}
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-muted-foreground" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-2 rounded-lg transition-colors',
                  'bg-background dark:bg-background',
                  'border border-input dark:border-input',
                  'text-foreground dark:text-foreground',
                  'placeholder:text-muted-foreground dark:placeholder:text-muted-foreground',
                  'focus:ring-2 focus:ring-ring focus:border-transparent',
                  'focus-visible:outline-none'
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors" />
                </button>
              )}
            </div>
          )}

          {/* Export */}
          {exportable && onExport && (
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary/90',
                  'dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90'
                )}
              >
                <Download className="h-5 w-5" />
                Export
              </button>

              {showExportMenu && (
                <div className={cn(
                  'absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10',
                  'bg-popover dark:bg-popover',
                  'border border-border dark:border-border'
                )}>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full px-4 py-2 text-left text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent first:rounded-t-lg transition-colors"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full px-4 py-2 text-left text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent transition-colors"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full px-4 py-2 text-left text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent last:rounded-b-lg transition-colors"
                  >
                    Export as Excel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 dark:bg-muted/30 border-b border-border dark:border-border/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
                    'text-muted-foreground dark:text-muted-foreground',
                    column.sortable && 'cursor-pointer hover:bg-muted dark:hover:bg-muted/50 transition-colors'
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border dark:divide-border/50">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-muted-foreground dark:text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30'
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-foreground dark:text-foreground"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-border dark:border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground dark:text-foreground">Rows per page:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) =>
                pagination.onPageSizeChange(Number(e.target.value))
              }
              className={cn(
                'border rounded px-2 py-1 text-sm transition-colors',
                'bg-background dark:bg-background',
                'border-input dark:border-input',
                'text-foreground dark:text-foreground'
              )}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground dark:text-foreground">
              Page {pagination.page} of{' '}
              {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={cn(
                  'px-3 py-1 rounded text-sm transition-colors',
                  'border border-input dark:border-input',
                  'bg-background dark:bg-background',
                  'text-foreground dark:text-foreground',
                  'hover:bg-accent dark:hover:bg-accent',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                Previous
              </button>
              <button
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.pageSize)
                }
                className={cn(
                  'px-3 py-1 rounded text-sm transition-colors',
                  'border border-input dark:border-input',
                  'bg-background dark:bg-background',
                  'text-foreground dark:text-foreground',
                  'hover:bg-accent dark:hover:bg-accent',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const AdminDataTable = React.memo(AdminDataTableComponent) as typeof AdminDataTableComponent;
