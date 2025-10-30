'use client';

import React, { useState } from 'react';
import { 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  Clock,
  Star,
  Bookmark,
  Settings,
  MoreVertical,
  FileText,
  BarChart3,
  Users,
  Eye,
  Share2
} from 'lucide-react';
import type { Report, ReportCategory, ReportStatus, ReportFrequency } from './ReportCard';

/**
 * View mode options
 */
type ViewMode = 'grid' | 'list' | 'table';

/**
 * Sort options
 */
type SortOption = 'title' | 'category' | 'status' | 'created' | 'updated' | 'views' | 'downloads';

/**
 * Sort direction
 */
type SortDirection = 'asc' | 'desc';

/**
 * Filter options
 */
interface FilterOptions {
  category: ReportCategory | 'all';
  status: ReportStatus | 'all';
  frequency: ReportFrequency | 'all';
  author: string;
  tags: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  favoritesOnly: boolean;
  bookmarkedOnly: boolean;
}

/**
 * Props for the ReportHeader component
 */
interface ReportHeaderProps {
  /** Total number of reports */
  totalReports?: number;
  /** Number of filtered reports */
  filteredReports?: number;
  /** Current search query */
  searchQuery?: string;
  /** Current sort option */
  sortBy?: SortOption;
  /** Current sort direction */
  sortDirection?: SortDirection;
  /** Current view mode */
  viewMode?: ViewMode;
  /** Current filter options */
  filters?: FilterOptions;
  /** Available categories for filtering */
  categories?: ReportCategory[];
  /** Available authors for filtering */
  authors?: Array<{ id: string; name: string; }>;
  /** Available tags for filtering */
  availableTags?: string[];
  /** Whether user can create reports */
  canCreate?: boolean;
  /** Whether user can import reports */
  canImport?: boolean;
  /** Whether user can export reports */
  canExport?: boolean;
  /** Whether bulk selection is active */
  bulkSelection?: boolean;
  /** Number of selected reports */
  selectedCount?: number;
  /** Custom CSS classes */
  className?: string;
  /** Search change handler */
  onSearchChange?: (query: string) => void;
  /** Sort change handler */
  onSortChange?: (sortBy: SortOption, direction: SortDirection) => void;
  /** View mode change handler */
  onViewModeChange?: (mode: ViewMode) => void;
  /** Filter change handler */
  onFilterChange?: (filters: FilterOptions) => void;
  /** Create report handler */
  onCreateReport?: () => void;
  /** Import reports handler */
  onImportReports?: () => void;
  /** Export reports handler */
  onExportReports?: (format: 'pdf' | 'excel' | 'csv') => void;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Bulk operations handler */
  onBulkOperation?: (operation: 'export' | 'delete' | 'archive' | 'share') => void;
  /** Toggle bulk selection handler */
  onToggleBulkSelection?: () => void;
}

/**
 * ReportHeader Component
 * 
 * A comprehensive header component for the reports interface with search,
 * filtering, sorting, view controls, and bulk operations. Provides a complete
 * set of tools for report management and navigation.
 * 
 * @param props - ReportHeader component props
 * @returns JSX element representing the report header
 */
const ReportHeader = ({
  totalReports = 0,
  filteredReports,
  searchQuery = '',
  sortBy = 'updated',
  sortDirection = 'desc',
  viewMode = 'grid',
  filters,
  categories = [],
  authors = [],
  availableTags = [],
  canCreate = true,
  canImport = false,
  canExport = true,
  bulkSelection = false,
  selectedCount = 0,
  className = '',
  onSearchChange,
  onSortChange,
  onViewModeChange,
  onFilterChange,
  onCreateReport,
  onImportReports,
  onExportReports,
  onRefresh,
  onBulkOperation,
  onToggleBulkSelection
}: ReportHeaderProps) => {
  // State
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showBulkMenu, setShowBulkMenu] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  /**
   * Gets sort option display text
   */
  const getSortOptionText = (option: SortOption): string => {
    const optionMap = {
      title: 'Title',
      category: 'Category',
      status: 'Status',
      created: 'Created Date',
      updated: 'Last Updated',
      views: 'Views',
      downloads: 'Downloads'
    };
    return optionMap[option];
  };

  /**
   * Handles sort change
   */
  const handleSortChange = (newSortBy: SortOption) => {
    const newDirection = sortBy === newSortBy && sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange?.(newSortBy, newDirection);
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Main Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">
              {filteredReports !== undefined ? filteredReports : totalReports} 
              {filteredReports !== undefined && filteredReports !== totalReports && ` of ${totalReports}`} reports
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {canImport && (
              <button
                onClick={onImportReports}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>
            )}
            
            {canExport && (
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                           bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onExportReports?.('pdf');
                          setShowExportMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export as PDF
                      </button>
                      <button
                        onClick={() => {
                          onExportReports?.('excel');
                          setShowExportMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Export as Excel
                      </button>
                      <button
                        onClick={() => {
                          onExportReports?.('csv');
                          setShowExportMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export as CSV
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={onRefresh}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            
            {canCreate && (
              <button
                onClick={onCreateReport}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                         bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </button>
            )}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md 
                         focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md
                ${showFilters 
                  ? 'text-blue-700 bg-blue-50 border-blue-300' 
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const [newSortBy, newDirection] = e.target.value.split('-') as [SortOption, SortDirection];
                  onSortChange?.(newSortBy, newDirection);
                }}
                className="appearance-none pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md 
                         focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="updated-desc">Recently Updated</option>
                <option value="created-desc">Recently Created</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="views-desc">Most Viewed</option>
                <option value="downloads-desc">Most Downloaded</option>
                <option value="category-asc">Category</option>
              </select>
              {sortDirection === 'asc' ? (
                <SortAsc className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              ) : (
                <SortDesc className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Bulk Selection */}
            {onToggleBulkSelection && (
              <button
                onClick={onToggleBulkSelection}
                className={`
                  inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md
                  ${bulkSelection 
                    ? 'text-blue-700 bg-blue-50 border-blue-300' 
                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <Users className="w-4 h-4 mr-2" />
                Select
              </button>
            )}

            {/* View Mode */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => onViewModeChange?.('grid')}
                className={`
                  p-2 text-sm font-medium border-r border-gray-300
                  ${viewMode === 'grid' 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                  }
                `}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange?.('list')}
                className={`
                  p-2 text-sm font-medium
                  ${viewMode === 'list' 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                  }
                `}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Operations Bar */}
      {bulkSelection && selectedCount > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedCount} report{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onBulkOperation?.('export')}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 
                         bg-white border border-blue-300 rounded-md hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
              <button
                onClick={() => onBulkOperation?.('share')}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 
                         bg-white border border-blue-300 rounded-md hover:bg-blue-50"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </button>
              <button
                onClick={() => onBulkOperation?.('archive')}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-700 
                         bg-white border border-orange-300 rounded-md hover:bg-orange-50"
              >
                Archive
              </button>
              <button
                onClick={() => onBulkOperation?.('delete')}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 
                         bg-white border border-red-300 rounded-md hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters?.category || 'all'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  onFilterChange?.({
                    ...filters,
                    category: e.target.value as ReportCategory | 'all'
                  } as FilterOptions);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
                         focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="clinical">Clinical</option>
                <option value="financial">Financial</option>
                <option value="operational">Operational</option>
                <option value="compliance">Compliance</option>
                <option value="patient-satisfaction">Patient Satisfaction</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters?.status || 'all'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  onFilterChange?.({
                    ...filters,
                    status: e.target.value as ReportStatus | 'all'
                  } as FilterOptions);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
                         focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <select
                value={filters?.author || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  onFilterChange?.({
                    ...filters,
                    author: e.target.value
                  } as FilterOptions);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
                         focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Authors</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quick Filters
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters?.favoritesOnly || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onFilterChange?.({
                        ...filters,
                        favoritesOnly: e.target.checked
                      } as FilterOptions);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Star className="w-4 h-4 ml-2 mr-1 text-yellow-500" />
                  <span className="text-sm text-gray-700">Favorites only</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters?.bookmarkedOnly || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onFilterChange?.({
                        ...filters,
                        bookmarkedOnly: e.target.checked
                      } as FilterOptions);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Bookmark className="w-4 h-4 ml-2 mr-1 text-blue-500" />
                  <span className="text-sm text-gray-700">Bookmarked only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportHeader;
