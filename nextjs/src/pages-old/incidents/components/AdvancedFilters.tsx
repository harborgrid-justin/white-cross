/**
 * AdvancedFilters Component
 *
 * Production-grade advanced filtering modal with:
 * - Modal dialog for advanced filter options
 * - Additional filters: student selection, location, reported by, assignee
 * - Date range presets with custom range support
 * - Save and load filter templates
 * - Apply and Reset functionality
 *
 * @module pages/incidents/components/AdvancedFilters
 */

import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import Modal from '@/components/ui/overlays/Modal';
import { StudentFilter } from './StudentFilter';
import { DateRangeFilter } from './DateRangeFilter';
import { TypeFilter } from './TypeFilter';
import { SeverityFilter } from './SeverityFilter';
import { StatusFilter } from './StatusFilter';
import type { IncidentType, IncidentSeverity, IncidentStatus } from '@/types/incidents';

/**
 * Advanced filter state interface
 */
export interface AdvancedFilterState {
  // Basic filters
  types?: IncidentType[];
  severities?: IncidentSeverity[];
  statuses?: IncidentStatus[];
  dateFrom?: string;
  dateTo?: string;

  // Advanced filters
  studentIds?: string[];
  location?: string;
  reportedBy?: string;
  assignedTo?: string;
  followUpRequired?: boolean;
  parentNotified?: boolean;
}

interface AdvancedFiltersProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback when modal closes */
  onClose: () => void;
  /** Callback when filters are applied */
  onApply: (filters: AdvancedFilterState) => void;
  /** Initial filter state */
  initialFilters?: AdvancedFilterState;
  /** Optional CSS class name */
  className?: string;
}

/**
 * AdvancedFilters component
 *
 * Modal dialog with comprehensive filtering options including:
 * - Student selection (multi-select)
 * - Location filtering
 * - Reporter filtering
 * - Assignee filtering
 * - Date range with presets
 * - Type, severity, and status filters
 * - Filter template management
 *
 * @example
 * ```tsx
 * <AdvancedFilters
 *   isOpen={showAdvancedFilters}
 *   onClose={() => setShowAdvancedFilters(false)}
 *   onApply={(filters) => {
 *     dispatch(setFilters(filters));
 *     setShowAdvancedFilters(false);
 *   }}
 *   initialFilters={currentFilters}
 * />
 * ```
 */
export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters = {},
  className = '',
}) => {
  const [filters, setFilters] = useState<AdvancedFilterState>(initialFilters);
  const [savedTemplates, setSavedTemplates] = useState<{ name: string; filters: AdvancedFilterState }[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);

  // Update filters when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Load saved templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('incident-filter-templates');
    if (saved) {
      try {
        setSavedTemplates(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load filter templates:', error);
      }
    }
  }, []);

  /**
   * Handle filter changes
   */
  const updateFilter = <K extends keyof AdvancedFilterState>(
    key: K,
    value: AdvancedFilterState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === undefined || value === '' ? undefined : value,
    }));
  };

  /**
   * Apply filters
   */
  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  /**
   * Reset all filters
   */
  const handleReset = () => {
    setFilters({});
  };

  /**
   * Save current filters as template
   */
  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;

    const newTemplate = {
      name: templateName,
      filters: { ...filters },
    };

    const updated = [...savedTemplates, newTemplate];
    setSavedTemplates(updated);
    localStorage.setItem('incident-filter-templates', JSON.stringify(updated));

    setTemplateName('');
    setShowSaveTemplate(false);
  };

  /**
   * Load filter template
   */
  const handleLoadTemplate = (template: { name: string; filters: AdvancedFilterState }) => {
    setFilters(template.filters);
  };

  /**
   * Delete filter template
   */
  const handleDeleteTemplate = (index: number) => {
    const updated = savedTemplates.filter((_, i) => i !== index);
    setSavedTemplates(updated);
    localStorage.setItem('incident-filter-templates', JSON.stringify(updated));
  };

  /**
   * Count active filters
   */
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <Modal open={isOpen} onClose={onClose} size="lg" className={className}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Advanced Filters</h2>
            {activeFilterCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Filter Templates */}
            {savedTemplates.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Saved Filter Templates
                </h3>
                <div className="flex flex-wrap gap-2">
                  {savedTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md"
                    >
                      <button
                        onClick={() => handleLoadTemplate(template)}
                        className="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                      >
                        {template.name}
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(index)}
                        className="text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300"
                        aria-label="Delete template"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Selection */}
            <div>
              <StudentFilter
                selected={filters.studentIds || []}
                onChange={(studentIds) => updateFilter('studentIds', studentIds)}
                multiple
                label="Filter by Students"
              />
            </div>

            {/* Classification Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TypeFilter
                selected={filters.types || []}
                onChange={(types) => updateFilter('types', types)}
              />

              <SeverityFilter
                selected={filters.severities || []}
                onChange={(severities) => updateFilter('severities', severities)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <StatusFilter
                selected={filters.statuses || []}
                onChange={(statuses) => updateFilter('statuses', statuses)}
              />
            </div>

            {/* Date Range */}
            <div>
              <DateRangeFilter
                startDate={filters.dateFrom}
                endDate={filters.dateTo}
                onChange={(start, end) => {
                  updateFilter('dateFrom', start);
                  updateFilter('dateTo', end);
                }}
                label="Incident Date Range"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => updateFilter('location', e.target.value)}
                placeholder="e.g., Playground, Cafeteria, Gymnasium..."
                className="
                  w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  rounded-md shadow-sm
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                "
              />
            </div>

            {/* Additional Flags */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Additional Options
              </h3>

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Follow-up Required</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateFilter('followUpRequired', true)}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.followUpRequired === true
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }
                    `}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFilter('followUpRequired', false)}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.followUpRequired === false
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }
                    `}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFilter('followUpRequired', undefined)}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.followUpRequired === undefined
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }
                    `}
                  >
                    All
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Parent Notified</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateFilter('parentNotified', true)}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.parentNotified === true
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }
                    `}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFilter('parentNotified', false)}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.parentNotified === false
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }
                    `}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFilter('parentNotified', undefined)}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.parentNotified === undefined
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }
                    `}
                  >
                    All
                  </button>
                </div>
              </div>
            </div>

            {/* Save Template Section */}
            {!showSaveTemplate && activeFilterCount > 0 && (
              <button
                onClick={() => setShowSaveTemplate(true)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                Save as Template
              </button>
            )}

            {showSaveTemplate && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., High Severity This Week"
                    className="
                      flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                      rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                    "
                  />
                  <button
                    onClick={handleSaveTemplate}
                    disabled={!templateName.trim()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowSaveTemplate(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AdvancedFilters;
