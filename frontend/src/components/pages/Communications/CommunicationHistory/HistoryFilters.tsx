'use client';

import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import type { HistoryFilters } from './types';
import { ChannelFilter } from './ChannelFilter';

/**
 * Props for the HistoryFilters component
 */
export interface HistoryFiltersProps {
  /** Current filter values */
  filters: HistoryFilters;
  /** Callback when filters change */
  onFilterChange: (filters: HistoryFilters) => void;
  /** Callback to clear all filters */
  onClear: () => void;
  /** Student ID (used for clearing filters) */
  studentId?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * HistoryFilters component for filtering communication history
 *
 * Features:
 * - Comprehensive filtering options (type, status, priority, category)
 * - Date range selection
 * - Sort controls
 * - Clear all filters functionality
 * - Responsive grid layout
 *
 * @component
 * @example
 * ```tsx
 * <HistoryFilters
 *   filters={filters}
 *   onFilterChange={setFilters}
 *   onClear={clearFilters}
 *   studentId={studentId}
 * />
 * ```
 */
export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  filters,
  onFilterChange,
  onClear,
  studentId,
  className = ''
}) => {
  const handleFilterChange = <K extends keyof HistoryFilters>(
    key: K,
    value: HistoryFilters[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleDateRangeChange = (key: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, [key]: value }
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [HistoryFilters['sortBy'], 'asc' | 'desc'];
    onFilterChange({ ...filters, sortBy, sortOrder });
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Type Filter */}
        <ChannelFilter
          selectedType={filters.type}
          onTypeChange={(type) => handleFilterChange('type', type)}
        />

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleFilterChange('status', e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="sent">Sent</option>
          <option value="delivered">Delivered</option>
          <option value="read">Read</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleFilterChange('priority', e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleFilterChange('category', e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          <option value="emergency">Emergency</option>
          <option value="routine">Routine</option>
          <option value="appointment">Appointment</option>
          <option value="medication">Medication</option>
          <option value="general">General</option>
        </select>

        {/* Date Range Start */}
        <div className="relative">
          <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            placeholder="Start date"
            value={filters.dateRange.start}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleDateRangeChange('start', e.target.value)
            }
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Start date"
          />
        </div>

        {/* Date Range End */}
        <div className="relative">
          <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            placeholder="End date"
            value={filters.dateRange.end}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleDateRangeChange('end', e.target.value)
            }
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="End date"
          />
        </div>

        {/* Sort By */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleSortChange(e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Sort communications"
        >
          <option value="created_at-desc">Newest First</option>
          <option value="created_at-asc">Oldest First</option>
          <option value="priority-desc">High Priority First</option>
          <option value="status-asc">Status A-Z</option>
        </select>
      </div>

      {/* Clear Filters */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onClear}
          className="text-sm text-gray-600 hover:text-gray-800"
          aria-label="Clear all filters"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default HistoryFilters;
