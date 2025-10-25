/**
 * IncidentFilters Component
 *
 * Production-grade comprehensive filter panel for incidents with:
 * - Multiple filter controls organized in a panel/sidebar
 * - Filters by type, severity, status, date range, follow-up required, parent notified
 * - Apply and Clear All functionality
 * - Collapsible sections for better UX
 * - Filter count indicator
 *
 * @module pages/incidents/components/IncidentFilters
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { TypeFilter } from './TypeFilter';
import { SeverityFilter } from './SeverityFilter';
import { StatusFilter } from './StatusFilter';
import { DateRangeFilter } from './DateRangeFilter';
import type { IncidentType, IncidentSeverity, IncidentStatus } from '@/types/incidents';

/**
 * Filter state interface
 */
export interface IncidentFilterState {
  types?: IncidentType[];
  severities?: IncidentSeverity[];
  statuses?: IncidentStatus[];
  dateFrom?: string;
  dateTo?: string;
  followUpRequired?: boolean;
  parentNotified?: boolean;
}

interface IncidentFiltersProps {
  /** Current filter state */
  filters: IncidentFilterState;
  /** Callback when filters change */
  onFilterChange: (filters: IncidentFilterState) => void;
  /** Optional CSS class name */
  className?: string;
  /** Whether filters are disabled */
  disabled?: boolean;
}

/**
 * IncidentFilters component
 *
 * Comprehensive filter panel that combines all available filters.
 * Provides organized sections for different filter categories with
 * collapsible sections for better space management.
 *
 * @example
 * ```tsx
 * <IncidentFilters
 *   filters={currentFilters}
 *   onFilterChange={(newFilters) => dispatch(setFilters(newFilters))}
 * />
 * ```
 */
export const IncidentFilters: React.FC<IncidentFiltersProps> = ({
  filters,
  onFilterChange,
  className = '',
  disabled = false,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    classification: true,
    dateRange: true,
    status: true,
    flags: true,
  });

  /**
   * Toggle section expansion
   */
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /**
   * Handle individual filter changes
   */
  const handleTypeChange = (types: IncidentType[]) => {
    onFilterChange({ ...filters, types: types.length > 0 ? types : undefined });
  };

  const handleSeverityChange = (severities: IncidentSeverity[]) => {
    onFilterChange({ ...filters, severities: severities.length > 0 ? severities : undefined });
  };

  const handleStatusChange = (statuses: IncidentStatus[]) => {
    onFilterChange({ ...filters, statuses: statuses.length > 0 ? statuses : undefined });
  };

  const handleDateRangeChange = (startDate: string | undefined, endDate: string | undefined) => {
    onFilterChange({ ...filters, dateFrom: startDate, dateTo: endDate });
  };

  const handleFollowUpRequiredChange = (value: boolean | undefined) => {
    onFilterChange({ ...filters, followUpRequired: value });
  };

  const handleParentNotifiedChange = (value: boolean | undefined) => {
    onFilterChange({ ...filters, parentNotified: value });
  };

  /**
   * Clear all filters
   */
  const handleClearAll = () => {
    onFilterChange({});
  };

  /**
   * Count active filters
   */
  const activeFilterCount = [
    filters.types && filters.types.length > 0,
    filters.severities && filters.severities.length > 0,
    filters.statuses && filters.statuses.length > 0,
    filters.dateFrom || filters.dateTo,
    filters.followUpRequired !== undefined,
    filters.parentNotified !== undefined,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {activeFilterCount}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={disabled}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter sections */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Classification Section */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => toggleSection('classification')}
            className="w-full flex items-center justify-between mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <span>Classification</span>
            {expandedSections.classification ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedSections.classification && (
            <div className="space-y-4">
              <TypeFilter
                selected={filters.types || []}
                onChange={handleTypeChange}
                disabled={disabled}
              />

              <SeverityFilter
                selected={filters.severities || []}
                onChange={handleSeverityChange}
                disabled={disabled}
              />
            </div>
          )}
        </div>

        {/* Date Range Section */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => toggleSection('dateRange')}
            className="w-full flex items-center justify-between mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <span>Date Range</span>
            {expandedSections.dateRange ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedSections.dateRange && (
            <DateRangeFilter
              startDate={filters.dateFrom}
              endDate={filters.dateTo}
              onChange={handleDateRangeChange}
              disabled={disabled}
            />
          )}
        </div>

        {/* Status Section */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => toggleSection('status')}
            className="w-full flex items-center justify-between mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <span>Status</span>
            {expandedSections.status ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedSections.status && (
            <StatusFilter
              selected={filters.statuses || []}
              onChange={handleStatusChange}
              disabled={disabled}
            />
          )}
        </div>

        {/* Flags Section */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => toggleSection('flags')}
            className="w-full flex items-center justify-between mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <span>Additional Filters</span>
            {expandedSections.flags ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedSections.flags && (
            <div className="space-y-3">
              {/* Follow-up Required */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Follow-up Required</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFollowUpRequiredChange(true)}
                    disabled={disabled}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.followUpRequired === true
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFollowUpRequiredChange(false)}
                    disabled={disabled}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.followUpRequired === false
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFollowUpRequiredChange(undefined)}
                    disabled={disabled}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.followUpRequired === undefined
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    All
                  </button>
                </div>
              </div>

              {/* Parent Notified */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Parent Notified</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleParentNotifiedChange(true)}
                    disabled={disabled}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.parentNotified === true
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleParentNotifiedChange(false)}
                    disabled={disabled}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.parentNotified === false
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => handleParentNotifiedChange(undefined)}
                    disabled={disabled}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.parentNotified === undefined
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentFilters;
