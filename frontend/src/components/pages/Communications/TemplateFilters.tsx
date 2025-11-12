/**
 * TemplateFilters Component
 *
 * Provides filtering and sorting controls for communication templates.
 * Includes search, type/category/status filters, and bulk actions.
 */

'use client';

import React from 'react';
import {
  MagnifyingGlassIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import type { TemplateFilters as FilterState } from './CommunicationTemplates.types';

/**
 * Props for the TemplateFilters component
 */
interface TemplateFiltersProps {
  /** Current filter state */
  filters: FilterState;
  /** Callback when filters change */
  onFiltersChange: (filters: FilterState) => void;
  /** Number of selected templates */
  selectedCount: number;
  /** Number of filtered templates */
  filteredCount: number;
  /** Total number of templates */
  totalCount: number;
  /** Callback for bulk delete action */
  onBulkDelete: () => void;
}

/**
 * TemplateFilters component for filtering and sorting communication templates
 *
 * @component
 * @example
 * ```tsx
 * <TemplateFilters
 *   filters={filters}
 *   onFiltersChange={setFilters}
 *   selectedCount={5}
 *   filteredCount={20}
 *   totalCount={50}
 *   onBulkDelete={handleBulkDelete}
 * />
 * ```
 */
export const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  filters,
  onFiltersChange,
  selectedCount,
  filteredCount,
  totalCount,
  onBulkDelete
}): React.ReactElement => {
  /**
   * Updates a single filter field
   */
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ): void => {
    onFiltersChange({ ...filters, [key]: value });
  };

  /**
   * Handles sort field and order change from combined select
   */
  const handleSortChange = (value: string): void => {
    const [sortBy, sortOrder] = value.split('-') as [
      FilterState['sortBy'],
      FilterState['sortOrder']
    ];
    onFiltersChange({ ...filters, sortBy, sortOrder });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFilter('search', e.target.value)
            }
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search templates"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            updateFilter('type', e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by type"
        >
          <option value="">All Types</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="phone_script">Phone Script</option>
          <option value="chat">Chat</option>
        </select>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            updateFilter('category', e.target.value)
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

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            updateFilter('status', e.target.value as FilterState['status'])
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by status"
        >
          <option value="all">All Templates</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Sort and Bulk Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleSortChange(e.target.value)
            }
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Sort templates"
          >
            <option value="updated_at-desc">Recently Updated</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="usage_count-desc">Most Used</option>
            <option value="usage_count-asc">Least Used</option>
            <option value="created_at-desc">Recently Created</option>
          </select>

          <div className="text-sm text-gray-500">
            {filteredCount} of {totalCount} templates
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedCount} selected
            </span>
            <button
              onClick={onBulkDelete}
              className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Delete selected templates"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
