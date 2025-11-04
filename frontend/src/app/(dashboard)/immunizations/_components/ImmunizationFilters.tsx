/**
 * @fileoverview Immunization Filters Component
 * @module app/immunizations/components
 *
 * Provides filtering and search controls for immunization list.
 * Includes status filter, vaccine type filter, date range, and search.
 */

'use client';

import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import type {
  ImmunizationStatus,
  ImmunizationType,
  ImmunizationFilterState,
} from './types/immunization.types';

interface ImmunizationFiltersProps {
  filterState: ImmunizationFilterState;
  showFilters: boolean;
  onToggleFilters: () => void;
  onStatusFilterChange: (status: ImmunizationStatus | 'all') => void;
  onTypeFilterChange: (type: ImmunizationType | 'all') => void;
  onSearchQueryChange: (query: string) => void;
  onDateChange: (date: Date) => void;
  onClearFilters: () => void;
}

/**
 * ImmunizationFilters component
 * Renders search input, filter toggle, and advanced filter controls
 */
export const ImmunizationFiltersComponent: React.FC<ImmunizationFiltersProps> = ({
  filterState,
  showFilters,
  onToggleFilters,
  onStatusFilterChange,
  onTypeFilterChange,
  onSearchQueryChange,
  onDateChange,
  onClearFilters,
}) => {
  return (
    <div>
      {/* Primary Filter Controls */}
      <div className="flex items-center gap-3">
        <div className="w-64">
          <SearchInput
            value={filterState.searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search immunizations, students, or vaccines..."
            aria-label="Search immunizations"
          />
        </div>

        <Button
          variant="outline"
          onClick={onToggleFilters}
          className={showFilters ? 'bg-gray-100' : ''}
          aria-expanded={showFilters}
          aria-controls="advanced-filters"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200" id="advanced-filters">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Status Filter */}
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={filterState.statusFilter}
                onChange={(e) =>
                  onStatusFilterChange(e.target.value as ImmunizationStatus | 'all')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by immunization status"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="administered">Administered</option>
                <option value="overdue">Overdue</option>
                <option value="declined">Declined</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Vaccine Type Filter */}
            <div>
              <label
                htmlFor="type-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vaccine Type
              </label>
              <select
                id="type-filter"
                value={filterState.typeFilter}
                onChange={(e) =>
                  onTypeFilterChange(e.target.value as ImmunizationType | 'all')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by vaccine type"
              >
                <option value="all">All Types</option>
                <option value="covid19">COVID-19</option>
                <option value="flu">Influenza</option>
                <option value="measles">MMR</option>
                <option value="hepatitis_b">Hepatitis B</option>
                <option value="tetanus">Tdap</option>
                <option value="varicella">Varicella</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label
                htmlFor="date-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date Range
              </label>
              <input
                id="date-filter"
                type="date"
                value={filterState.selectedDate.toISOString().split('T')[0]}
                onChange={(e) => onDateChange(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select date range for immunizations"
              />
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <Button variant="outline" onClick={onClearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
