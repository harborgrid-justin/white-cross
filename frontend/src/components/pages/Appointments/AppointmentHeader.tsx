'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Plus, 
  Download, 
  RefreshCw, 
  Grid3X3, 
  List, 
  Clock,
  Users,
  TrendingUp,
  Settings,
  ChevronDown,
  X,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import type { AppointmentStatus, AppointmentType, AppointmentPriority } from './AppointmentCard';

/**
 * View modes for appointment display
 */
export type AppointmentViewMode = 'list' | 'grid' | 'calendar' | 'timeline';

/**
 * Sort options for appointments
 */
export type AppointmentSortOption = 
  | 'date-asc'
  | 'date-desc'
  | 'patient-name'
  | 'provider-name'
  | 'status'
  | 'priority'
  | 'duration';

/**
 * Filter criteria for appointments
 */
export interface AppointmentFilters {
  /** Date range filter */
  dateRange: {
    start?: string;
    end?: string;
  };
  /** Status filter */
  status: AppointmentStatus[];
  /** Type filter */
  type: AppointmentType[];
  /** Priority filter */
  priority: AppointmentPriority[];
  /** Provider filter */
  providerId: string[];
  /** Patient filter */
  patientId: string[];
  /** Location filter */
  location: string[];
  /** Virtual appointment filter */
  isVirtual?: boolean;
}

/**
 * Quick filter presets
 */
export interface QuickFilter {
  id: string;
  label: string;
  filters: Partial<AppointmentFilters>;
  count?: number;
}

/**
 * Props for the AppointmentHeader component
 */
interface AppointmentHeaderProps {
  /** Current search query */
  searchQuery: string;
  /** Current view mode */
  viewMode: AppointmentViewMode;
  /** Current sort option */
  sortBy: AppointmentSortOption;
  /** Current filters */
  filters: AppointmentFilters;
  /** Total number of appointments */
  totalCount: number;
  /** Number of filtered appointments */
  filteredCount: number;
  /** Quick filter presets */
  quickFilters: QuickFilter[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Whether user can create appointments */
  canCreate?: boolean;
  /** Whether user can export data */
  canExport?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Search change handler */
  onSearchChange: (query: string) => void;
  /** View mode change handler */
  onViewModeChange: (mode: AppointmentViewMode) => void;
  /** Sort change handler */
  onSortChange: (sort: AppointmentSortOption) => void;
  /** Filter change handler */
  onFiltersChange: (filters: AppointmentFilters) => void;
  /** Quick filter selection handler */
  onQuickFilterSelect: (filterId: string) => void;
  /** Create appointment handler */
  onCreate?: () => void;
  /** Export handler */
  onExport?: () => void;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Settings handler */
  onSettings?: () => void;
}

/**
 * AppointmentHeader Component
 * 
 * A comprehensive header component for appointment management with search,
 * filtering, sorting, view controls, and action buttons. Includes analytics
 * overview and quick filter presets.
 * 
 * @param props - AppointmentHeader component props
 * @returns JSX element representing the appointment header
 */
const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  searchQuery,
  viewMode,
  sortBy,
  filters,
  totalCount,
  filteredCount,
  quickFilters,
  isLoading = false,
  canCreate = true,
  canExport = true,
  className = '',
  onSearchChange,
  onViewModeChange,
  onSortChange,
  onFiltersChange,
  onQuickFilterSelect,
  onCreate,
  onExport,
  onRefresh,
  onSettings
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  /**
   * Gets the appropriate view mode icon
   */
  const getViewModeIcon = (mode: AppointmentViewMode): React.ReactNode => {
    const iconProps = { size: 18 };
    
    switch (mode) {
      case 'grid':
        return <Grid3X3 {...iconProps} />;
      case 'calendar':
        return <Calendar {...iconProps} />;
      case 'timeline':
        return <Clock {...iconProps} />;
      default:
        return <List {...iconProps} />;
    }
  };

  /**
   * Gets sort option display label
   */
  const getSortLabel = (sort: AppointmentSortOption): string => {
    const labels = {
      'date-asc': 'Date (Oldest)',
      'date-desc': 'Date (Newest)',
      'patient-name': 'Patient Name',
      'provider-name': 'Provider Name',
      'status': 'Status',
      'priority': 'Priority',
      'duration': 'Duration'
    };
    return labels[sort];
  };

  /**
   * Calculates active filter count
   */
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.status.length > 0) count++;
    if (filters.type.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.providerId.length > 0) count++;
    if (filters.patientId.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.isVirtual !== undefined) count++;
    return count;
  };

  /**
   * Clears all filters
   */
  const clearFilters = (): void => {
    onFiltersChange({
      dateRange: {},
      status: [],
      type: [],
      priority: [],
      providerId: [],
      patientId: [],
      location: [],
      isVirtual: undefined
    });
  };

  /**
   * Handles filter change for specific field
   */
  const handleFilterChange = <K extends keyof AppointmentFilters>(
    key: K,
    value: AppointmentFilters[K]
  ): void => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  /**
   * Handles search input change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value);
  };

  const activeFilterCount = getActiveFilterCount();
  const showingFiltered = filteredCount !== totalCount;

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-sm text-gray-600 mt-1">
              {showingFiltered ? (
                <>Showing {filteredCount} of {totalCount} appointments</>
              ) : (
                <>{totalCount} total appointments</>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {canExport && (
              <button
                onClick={onExport}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md
                         hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 transition-colors"
                aria-label="Export appointments"
              >
                <Download size={18} className="mr-2" />
                Export
              </button>
            )}

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 text-gray-700 bg-white border border-gray-300 rounded-md
                       hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500 transition-colors disabled:opacity-50"
              aria-label="Refresh appointments"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>

            {onSettings && (
              <button
                onClick={onSettings}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded-md
                         hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 transition-colors"
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>
            )}

            {canCreate && onCreate && (
              <button
                onClick={onCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         transition-colors"
                aria-label="Create new appointment"
              >
                <Plus size={18} className="mr-2" />
                New Appointment
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Today</p>
                <p className="text-2xl font-bold text-blue-900">
                  {quickFilters.find(f => f.id === 'today')?.count || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-900">
                  {quickFilters.find(f => f.id === 'confirmed')?.count || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {quickFilters.find(f => f.id === 'pending')?.count || 0}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Virtual</p>
                <p className="text-2xl font-bold text-purple-900">
                  {quickFilters.find(f => f.id === 'virtual')?.count || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder-gray-500"
                aria-label="Search appointments"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-2">
              {quickFilters.slice(0, 4).map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => onQuickFilterSelect(filter.id)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-full
                           hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                           transition-colors"
                >
                  {filter.label}
                  {filter.count !== undefined && (
                    <span className="ml-1 text-gray-500">({filter.count})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center px-3 py-2 border border-gray-300 rounded-md
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-colors ${activeFilterCount > 0 ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
              `}
              aria-label="Toggle filters"
            >
              <Filter size={18} className="mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2 ml-4">
            {/* Sort Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md
                         hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                         transition-colors"
                aria-label="Sort options"
              >
                <TrendingUp size={18} className="mr-2" />
                {getSortLabel(sortBy)}
                <ChevronDown size={16} className="ml-2" />
              </button>

              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    {[
                      'date-desc',
                      'date-asc',
                      'patient-name',
                      'provider-name',
                      'status',
                      'priority',
                      'duration'
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          onSortChange(option as AppointmentSortOption);
                          setShowSortMenu(false);
                        }}
                        className={`
                          block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                          ${sortBy === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                        `}
                      >
                        {getSortLabel(option as AppointmentSortOption)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center border border-gray-300 rounded-md">
              {(['list', 'grid', 'calendar', 'timeline'] as AppointmentViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  className={`
                    p-2 ${mode === viewMode 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    } ${mode === 'list' ? 'rounded-l' : ''} ${mode === 'timeline' ? 'rounded-r' : ''}
                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                  `}
                  aria-label={`${mode} view`}
                  title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                >
                  {getViewModeIcon(mode)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
            <div className="flex items-center space-x-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        start: e.target.value
                      })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={filters.dateRange.end || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    end: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {[
                  'scheduled', 'confirmed', 'checked-in', 'in-progress', 
                  'completed', 'cancelled', 'no-show', 'rescheduled'
                ].map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status as AppointmentStatus)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newStatus = e.target.checked
                          ? [...filters.status, status as AppointmentStatus]
                          : filters.status.filter(s => s !== status);
                        handleFilterChange('status', newStatus);
                      }}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {status.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {[
                  'consultation', 'follow-up', 'procedure', 'emergency',
                  'screening', 'vaccination', 'therapy', 'surgery', 'diagnostic', 'virtual'
                ].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type as AppointmentType)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newType = e.target.checked
                          ? [...filters.type, type as AppointmentType]
                          : filters.type.filter(t => t !== type);
                        handleFilterChange('type', newType);
                      }}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="space-y-2">
                {['low', 'normal', 'high', 'urgent'].map((priority) => (
                  <label key={priority} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.priority.includes(priority as AppointmentPriority)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newPriority = e.target.checked
                          ? [...filters.priority, priority as AppointmentPriority]
                          : filters.priority.filter(p => p !== priority);
                        handleFilterChange('priority', newPriority);
                      }}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentHeader;
