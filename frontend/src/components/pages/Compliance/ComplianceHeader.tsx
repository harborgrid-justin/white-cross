'use client';

import React, { useState } from 'react';
import { 
  Shield,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  RefreshCw,
  Calendar,
  Users,
  FileText,
  Bell,
  Eye,
  ChevronDown,
  X
} from 'lucide-react';

/**
 * Filter options interface
 */
interface FilterOptions {
  status: string[];
  category: string[];
  priority: string[];
  assignee: string[];
  dueDate: string;
}

/**
 * View mode types
 */
type ViewMode = 'grid' | 'list' | 'kanban' | 'calendar';

/**
 * Sort option types
 */
type SortOption = 'dueDate' | 'priority' | 'status' | 'category' | 'progress' | 'updated';

/**
 * Props for the ComplianceHeader component
 */
interface ComplianceHeaderProps {
  /** Total compliance requirements count */
  totalRequirements?: number;
  /** Compliant requirements count */
  compliantCount?: number;
  /** Non-compliant requirements count */
  nonCompliantCount?: number;
  /** Pending requirements count */
  pendingCount?: number;
  /** Overdue requirements count */
  overdueCount?: number;
  /** Current search term */
  searchTerm?: string;
  /** Current filters */
  filters?: FilterOptions;
  /** Current view mode */
  viewMode?: ViewMode;
  /** Current sort option */
  sortBy?: SortOption;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Available assignees for filtering */
  assignees?: Array<{ id: string; name: string; avatar?: string }>;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Search change handler */
  onSearchChange?: (term: string) => void;
  /** Filter change handler */
  onFilterChange?: (filters: FilterOptions) => void;
  /** View mode change handler */
  onViewModeChange?: (mode: ViewMode) => void;
  /** Sort change handler */
  onSortChange?: (sortBy: SortOption, direction: 'asc' | 'desc') => void;
  /** Create new requirement handler */
  onCreateRequirement?: () => void;
  /** Import requirements handler */
  onImportRequirements?: () => void;
  /** Export requirements handler */
  onExportRequirements?: () => void;
  /** Refresh data handler */
  onRefresh?: () => void;
  /** Settings handler */
  onSettings?: () => void;
  /** Bulk actions handler */
  onBulkActions?: () => void;
}

/**
 * ComplianceHeader Component
 * 
 * A comprehensive header component for compliance management with search, filtering,
 * view controls, statistics display, and action buttons. Features advanced filtering
 * options, status overview, and bulk operations support.
 * 
 * @param props - ComplianceHeader component props
 * @returns JSX element representing the compliance management header
 */
const ComplianceHeader = ({
  totalRequirements = 0,
  compliantCount = 0,
  nonCompliantCount = 0,
  pendingCount = 0,
  overdueCount = 0,
  searchTerm = '',
  filters = {
    status: [],
    category: [],
    priority: [],
    assignee: [],
    dueDate: ''
  },
  viewMode = 'grid',
  sortBy = 'dueDate',
  sortDirection = 'asc',
  assignees = [],
  loading = false,
  className = '',
  onSearchChange,
  onFilterChange,
  onViewModeChange,
  onSortChange,
  onCreateRequirement,
  onImportRequirements,
  onExportRequirements,
  onRefresh,
  onSettings,
  onBulkActions
}: ComplianceHeaderProps) => {
  // State
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  /**
   * Calculates compliance percentage
   */
  const compliancePercentage = totalRequirements > 0 
    ? Math.round((compliantCount / totalRequirements) * 100)
    : 0;

  /**
   * Gets active filter count
   */
  const getActiveFilterCount = () => {
    return filters.status.length + 
           filters.category.length + 
           filters.priority.length + 
           filters.assignee.length + 
           (filters.dueDate ? 1 : 0);
  };

  /**
   * Handles filter clear
   */
  const handleClearFilters = () => {
    onFilterChange?.({
      status: [],
      category: [],
      priority: [],
      assignee: [],
      dueDate: ''
    });
  };

  /**
   * Handles status filter toggle
   */
  const handleStatusFilter = (status: string) => {
    const newStatusFilters = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFilterChange?.({
      ...filters,
      status: newStatusFilters
    });
  };

  /**
   * Handles category filter toggle
   */
  const handleCategoryFilter = (category: string) => {
    const newCategoryFilters = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category];
    
    onFilterChange?.({
      ...filters,
      category: newCategoryFilters
    });
  };

  /**
   * Handles priority filter toggle
   */
  const handlePriorityFilter = (priority: string) => {
    const newPriorityFilters = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    
    onFilterChange?.({
      ...filters,
      priority: newPriorityFilters
    });
  };

  /**
   * Handles assignee filter toggle
   */
  const handleAssigneeFilter = (assigneeId: string) => {
    const newAssigneeFilters = filters.assignee.includes(assigneeId)
      ? filters.assignee.filter(a => a !== assigneeId)
      : [...filters.assignee, assigneeId];
    
    onFilterChange?.({
      ...filters,
      assignee: newAssigneeFilters
    });
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
                <p className="text-gray-600">
                  Monitor and manage regulatory compliance requirements
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={onImportRequirements}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            
            <button
              onClick={onExportRequirements}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            
            <button
              onClick={onSettings}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            <button
              onClick={onCreateRequirement}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Requirement
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requirements</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequirements}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliant</p>
                <p className="text-2xl font-bold text-green-600">{compliantCount}</p>
                <p className="text-xs text-gray-500">{compliancePercentage}% of total</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
                <p className="text-2xl font-bold text-red-600">{nonCompliantCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-orange-600">{overdueCount}</p>
              </div>
              <Bell className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search compliance requirements..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange?.(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filters */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md 
                         hover:bg-gray-50 ${activeFilterCount > 0 
                           ? 'text-blue-700 bg-blue-50 border-blue-200' 
                           : 'text-gray-700 bg-white border-gray-300'}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Filters</h3>
                      <div className="flex items-center space-x-2">
                        {activeFilterCount > 0 && (
                          <button
                            onClick={handleClearFilters}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Clear all
                          </button>
                        )}
                        <button
                          onClick={() => setShowFilters(false)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          aria-label="Close filters"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                        <div className="space-y-1">
                          {['compliant', 'non-compliant', 'pending', 'expired', 'warning'].map((status) => (
                            <label key={status} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.status.includes(status)}
                                onChange={() => handleStatusFilter(status)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">{status.replace('-', ' ')}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Category Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
                        <div className="space-y-1">
                          {['hipaa', 'ferpa', 'clia', 'osha', 'state', 'federal', 'local', 'internal'].map((category) => (
                            <label key={category} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.category.includes(category)}
                                onChange={() => handleCategoryFilter(category)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 uppercase">{category}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Priority Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Priority</label>
                        <div className="space-y-1">
                          {['low', 'medium', 'high', 'critical'].map((priority) => (
                            <label key={priority} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.priority.includes(priority)}
                                onChange={() => handlePriorityFilter(priority)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">{priority}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Assignee Filter */}
                      {assignees.length > 0 && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">Assignee</label>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {assignees.map((assignee) => (
                              <label key={assignee.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={filters.assignee.includes(assignee.id)}
                                  onChange={() => handleAssigneeFilter(assignee.id)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{assignee.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Due Date Filter */}
                      <div>
                        <label htmlFor="dueDateFilter" className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                        <select
                          id="dueDateFilter"
                          value={filters.dueDate}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                            onFilterChange?.({ ...filters, dueDate: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm 
                                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">All dates</option>
                          <option value="overdue">Overdue</option>
                          <option value="today">Due today</option>
                          <option value="week">Due this week</option>
                          <option value="month">Due this month</option>
                          <option value="quarter">Due this quarter</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Sort
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {showSortMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    {[
                      { value: 'dueDate', label: 'Due Date' },
                      { value: 'priority', label: 'Priority' },
                      { value: 'status', label: 'Status' },
                      { value: 'category', label: 'Category' },
                      { value: 'progress', label: 'Progress' },
                      { value: 'updated', label: 'Last Updated' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange?.(option.value as SortOption, sortDirection);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <span className="float-right">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* View Mode */}
            <div className="flex items-center border border-gray-300 rounded-md">
              {[
                { mode: 'grid' as ViewMode, icon: BarChart3, label: 'Grid view' },
                { mode: 'list' as ViewMode, icon: FileText, label: 'List view' },
                { mode: 'kanban' as ViewMode, icon: Users, label: 'Kanban view' },
                { mode: 'calendar' as ViewMode, icon: Calendar, label: 'Calendar view' }
              ].map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.mode}
                    onClick={() => onViewModeChange?.(view.mode)}
                    className={`p-2 text-sm font-medium border-r border-gray-300 last:border-r-0 
                             hover:bg-gray-50 ${viewMode === view.mode 
                               ? 'bg-blue-50 text-blue-700' 
                               : 'text-gray-600'}`}
                    aria-label={view.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceHeader;
