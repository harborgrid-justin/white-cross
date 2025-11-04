/**
 * Forms toolbar component
 *
 * Provides controls for creating forms, importing, bulk actions, searching,
 * filtering, and switching between grid/list views.
 */

import React from 'react';
import { Plus, Upload, Filter, Play, Archive, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/inputs';
import { Card } from '@/components/ui/card';
import { FormStatus, FormType, SortField, ViewMode, BulkAction } from './types/formTypes';

/**
 * Props for FormsToolbar component
 */
export interface FormsToolbarProps {
  /** Current search query */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;

  /** Whether filters panel is shown */
  showFilters: boolean;
  /** Callback to toggle filters panel */
  onToggleFilters: () => void;

  /** Current view mode (grid or list) */
  view: ViewMode;
  /** Callback when view mode changes */
  onViewChange: (view: ViewMode) => void;

  /** Number of selected forms */
  selectedCount: number;
  /** Callback for bulk actions */
  onBulkAction: (action: BulkAction) => void;

  /** Current status filter */
  statusFilter: FormStatus | 'all';
  /** Callback when status filter changes */
  onStatusFilterChange: (status: FormStatus | 'all') => void;

  /** Current type filter */
  typeFilter: FormType | 'all';
  /** Callback when type filter changes */
  onTypeFilterChange: (type: FormType | 'all') => void;

  /** Current sort field */
  sortBy: SortField;
  /** Callback when sort field changes */
  onSortByChange: (field: SortField) => void;

  /** Callback to reset all filters */
  onResetFilters: () => void;
}

/**
 * Toolbar component with actions, search, filters, and view controls
 *
 * @param props - Component props
 * @returns JSX element with toolbar controls
 */
export const FormsToolbar: React.FC<FormsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  view,
  onViewChange,
  selectedCount,
  onBulkAction,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortByChange,
  onResetFilters,
}) => {
  return (
    <Card>
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Primary Actions */}
          <div className="flex items-center gap-3">
            <Link href="/forms/new">
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Button>
            </Link>

            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Form
            </Button>

            {/* Bulk Actions */}
            {selectedCount > 0 && (
              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                <span className="text-sm text-gray-600">{selectedCount} selected</span>
                <Button variant="outline" size="sm" onClick={() => onBulkAction('publish')}>
                  <Play className="h-4 w-4 mr-1" />
                  Publish
                </Button>
                <Button variant="outline" size="sm" onClick={() => onBulkAction('archive')}>
                  <Archive className="h-4 w-4 mr-1" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBulkAction('delete')}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Search, Filter, and View Controls */}
          <div className="flex items-center gap-3">
            <div className="w-64">
              <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search forms, descriptions, or tags..."
              />
            </div>

            <Button
              variant="outline"
              onClick={onToggleFilters}
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => onViewChange('grid')}
                className={`px-3 py-2 text-sm ${
                  view === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                Grid
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`px-3 py-2 text-sm border-l border-gray-300 ${
                  view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="List view"
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Status Filter */}
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => onStatusFilterChange(e.target.value as FormStatus | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Form Type
                </label>
                <select
                  id="type-filter"
                  value={typeFilter}
                  onChange={(e) => onTypeFilterChange(e.target.value as FormType | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter by form type"
                >
                  <option value="all">All Types</option>
                  <option value="enrollment">Enrollment</option>
                  <option value="health_screening">Health Screening</option>
                  <option value="incident_report">Incident Report</option>
                  <option value="permission_slip">Permission Slip</option>
                  <option value="medical_consent">Medical Consent</option>
                  <option value="emergency_contact">Emergency Contact</option>
                  <option value="assessment">Assessment</option>
                  <option value="survey">Survey</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => onSortByChange(e.target.value as SortField)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Sort by"
                >
                  <option value="updated">Last Updated</option>
                  <option value="title">Title</option>
                  <option value="created">Created Date</option>
                  <option value="responses">Response Count</option>
                  <option value="completion_rate">Completion Rate</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button variant="outline" onClick={onResetFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
