'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Download, Settings, AlertTriangle, Clock } from 'lucide-react';

/**
 * Filter options for medications
 */
type MedicationFilter = 'all' | 'active' | 'inactive' | 'discontinued' | 'on-hold' | 'due' | 'overdue' | 'expiring';

/**
 * Sort options for medications
 */
type MedicationSort = 'name' | 'status' | 'next-dose' | 'priority' | 'prescribed-date';

/**
 * Props for the MedicationHeader component
 */
interface MedicationHeaderProps {
  /** Current search query */
  searchQuery?: string;
  /** Callback when search query changes */
  onSearchChange?: (query: string) => void;
  /** Current filter selection */
  currentFilter?: MedicationFilter;
  /** Callback when filter changes */
  onFilterChange?: (filter: MedicationFilter) => void;
  /** Current sort selection */
  currentSort?: MedicationSort;
  /** Callback when sort changes */
  onSortChange?: (sort: MedicationSort) => void;
  /** Callback when add medication is clicked */
  onAddMedication?: () => void;
  /** Callback when export is clicked */
  onExport?: () => void;
  /** Callback when settings is clicked */
  onSettings?: () => void;
  /** Total count of medications */
  totalCount?: number;
  /** Count of active medications */
  activeCount?: number;
  /** Count of due medications */
  dueCount?: number;
  /** Count of overdue medications */
  overdueCount?: number;
  /** Count of expiring medications */
  expiringCount?: number;
  /** Whether filters are visible */
  showFilters?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * MedicationHeader Component
 * 
 * Header component for medication management with search, filtering, sorting,
 * and action buttons. Includes medication counts and status indicators.
 * 
 * @component
 * @example
 * ```tsx
 * <MedicationHeader 
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   onAddMedication={handleAddMedication}
 *   totalCount={medications.length}
 *   activeCount={activeMedications.length}
 * />
 * ```
 */
export const MedicationHeader = ({
  searchQuery = '',
  onSearchChange,
  currentFilter = 'all',
  onFilterChange,
  currentSort = 'name',
  onSortChange,
  onAddMedication,
  onExport,
  onSettings,
  totalCount = 0,
  activeCount = 0,
  dueCount = 0,
  overdueCount = 0,
  expiringCount = 0,
  showFilters = false,
  className = ''
}: MedicationHeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(showFilters);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(event.target.value);
    }
  };

  const handleFilterSelect = (filter: MedicationFilter) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
    setIsFilterOpen(false);
  };

  const handleSortSelect = (sort: MedicationSort) => {
    if (onSortChange) {
      onSortChange(sort);
    }
  };

  const getFilterLabel = (filter: MedicationFilter) => {
    switch (filter) {
      case 'all':
        return 'All Medications';
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'discontinued':
        return 'Discontinued';
      case 'on-hold':
        return 'On Hold';
      case 'due':
        return 'Due';
      case 'overdue':
        return 'Overdue';
      case 'expiring':
        return 'Expiring';
      default:
        return 'All Medications';
    }
  };

  const getSortLabel = (sort: MedicationSort) => {
    switch (sort) {
      case 'name':
        return 'Name';
      case 'status':
        return 'Status';
      case 'next-dose':
        return 'Next Dose';
      case 'priority':
        return 'Priority';
      case 'prescribed-date':
        return 'Prescribed Date';
      default:
        return 'Name';
    }
  };

  const getFilterCount = (filter: MedicationFilter) => {
    switch (filter) {
      case 'all':
        return totalCount;
      case 'active':
        return activeCount;
      case 'due':
        return dueCount;
      case 'overdue':
        return overdueCount;
      case 'expiring':
        return expiringCount;
      default:
        return 0;
    }
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-6 py-4">
        {/* Main header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage student medications and administration schedules
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {onSettings && (
              <button
                onClick={onSettings}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Medication settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            )}
            {onAddMedication && (
              <button
                onClick={onAddMedication}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </button>
            )}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">{activeCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600">Due Today</p>
                <p className="text-2xl font-bold text-blue-900">{dueCount}</p>
              </div>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600">Overdue</p>
                <p className="text-2xl font-bold text-red-900">{overdueCount}</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-600">Expiring</p>
                <p className="text-2xl font-bold text-yellow-900">{expiringCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search medications"
              />
            </div>
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 min-w-[150px] justify-between"
              aria-expanded={isFilterOpen}
              aria-haspopup="true"
            >
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                {getFilterLabel(currentFilter)}
              </div>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  {(['all', 'active', 'inactive', 'discontinued', 'on-hold', 'due', 'overdue', 'expiring'] as MedicationFilter[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterSelect(filter)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                        currentFilter === filter ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <span>{getFilterLabel(filter)}</span>
                      <span className="text-xs text-gray-500">
                        {getFilterCount(filter)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSortSelect(e.target.value as MedicationSort)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 min-w-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sort medications"
            >
              {(['name', 'status', 'next-dose', 'priority', 'prescribed-date'] as MedicationSort[]).map((sort) => (
                <option key={sort} value={sort}>
                  Sort by {getSortLabel(sort)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Close filter overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsFilterOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default MedicationHeader;
