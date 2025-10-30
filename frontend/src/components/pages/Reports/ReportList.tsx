'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  Grid,
  List,
  Search,
  Filter,
  Star,
  Bookmark,
  AlertCircle,
  CheckCircle,
  Users,
  Loader,
  RefreshCw,
  Archive,
  Trash2,
  Share2,
  MoreVertical
} from 'lucide-react';
import ReportCard from './ReportCard';
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
 * Filter options for reports
 */
interface ReportFilter {
  category?: ReportCategory | 'all';
  status?: ReportStatus | 'all';
  frequency?: ReportFrequency | 'all';
  author?: string;
  tags?: string[];
  favoritesOnly?: boolean;
  bookmarkedOnly?: boolean;
  searchQuery?: string;
}

/**
 * Props for the ReportList component
 */
interface ReportListProps {
  /** Array of reports to display */
  reports: Report[];
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | null;
  /** Current view mode */
  viewMode?: ViewMode;
  /** Sort configuration */
  sortBy?: SortOption;
  /** Sort direction */
  sortDirection?: SortDirection;
  /** Filter configuration */
  filters?: ReportFilter;
  /** Selected report IDs */
  selectedReports?: string[];
  /** Whether bulk selection is enabled */
  bulkSelection?: boolean;
  /** Whether user can manage reports */
  canManage?: boolean;
  /** Whether user can run reports */
  canRun?: boolean;
  /** Whether user can share reports */
  canShare?: boolean;
  /** Items per page for pagination */
  pageSize?: number;
  /** Current page number */
  currentPage?: number;
  /** Whether to show pagination */
  showPagination?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Report click handler */
  onReportClick?: (report: Report) => void;
  /** View report handler */
  onViewReport?: (reportId: string) => void;
  /** Run report handler */
  onRunReport?: (reportId: string) => void;
  /** Download report handler */
  onDownloadReport?: (reportId: string, format: 'pdf' | 'excel' | 'csv') => void;
  /** Share report handler */
  onShareReport?: (reportId: string) => void;
  /** Edit report handler */
  onEditReport?: (reportId: string) => void;
  /** Delete report handler */
  onDeleteReport?: (reportId: string) => void;
  /** Bookmark toggle handler */
  onToggleBookmark?: (reportId: string) => void;
  /** Favorite toggle handler */
  onToggleFavorite?: (reportId: string) => void;
  /** Selection change handler */
  onSelectionChange?: (reportId: string, selected: boolean) => void;
  /** Select all handler */
  onSelectAll?: (selected: boolean) => void;
  /** Bulk operation handler */
  onBulkOperation?: (operation: 'export' | 'delete' | 'archive' | 'share', reportIds: string[]) => void;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Refresh handler */
  onRefresh?: () => void;
}

/**
 * ReportList Component
 * 
 * A comprehensive list component for displaying reports with support for multiple
 * view modes, sorting, filtering, pagination, and bulk operations. Provides a
 * flexible interface for report browsing and management.
 * 
 * @param props - ReportList component props
 * @returns JSX element representing the report list
 */
const ReportList = ({
  reports,
  loading = false,
  error = null,
  viewMode = 'grid',
  sortBy = 'updated',
  sortDirection = 'desc',
  filters = {},
  selectedReports = [],
  bulkSelection = false,
  canManage = false,
  canRun = true,
  canShare = true,
  pageSize = 12,
  currentPage = 1,
  showPagination = true,
  className = '',
  onReportClick,
  onViewReport,
  onRunReport,
  onDownloadReport,
  onShareReport,
  onEditReport,
  onDeleteReport,
  onToggleBookmark,
  onToggleFavorite,
  onSelectionChange,
  onSelectAll,
  onBulkOperation,
  onPageChange,
  onRefresh
}: ReportListProps) => {
  // State
  const [hoveredReport, setHoveredReport] = useState<string | null>(null);

  /**
   * Filters and sorts reports based on current configuration
   */
  const filteredAndSortedReports = useMemo(() => {
    let filtered = [...reports];

    // Apply filters
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.author.name.toLowerCase().includes(query) ||
        report.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(report => report.category === filters.category);
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    if (filters.frequency && filters.frequency !== 'all') {
      filtered = filtered.filter(report => report.frequency === filters.frequency);
    }

    if (filters.author) {
      filtered = filtered.filter(report => report.author.id === filters.author);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(report =>
        filters.tags!.some(tag => report.tags.includes(tag))
      );
    }

    if (filters.favoritesOnly) {
      filtered = filtered.filter(report => report.isFavorite);
    }

    if (filters.bookmarkedOnly) {
      filtered = filtered.filter(report => report.isBookmarked);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'created':
          comparison = a.createdDate.getTime() - b.createdDate.getTime();
          break;
        case 'updated':
          comparison = a.lastUpdated.getTime() - b.lastUpdated.getTime();
          break;
        case 'views':
          comparison = a.metrics.views - b.metrics.views;
          break;
        case 'downloads':
          comparison = a.metrics.downloads - b.metrics.downloads;
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [reports, filters, sortBy, sortDirection]);

  /**
   * Gets paginated reports
   */
  const paginatedReports = useMemo(() => {
    if (!showPagination) return filteredAndSortedReports;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedReports.slice(startIndex, endIndex);
  }, [filteredAndSortedReports, currentPage, pageSize, showPagination]);

  /**
   * Calculates total pages
   */
  const totalPages = Math.ceil(filteredAndSortedReports.length / pageSize);

  /**
   * Handles select all toggle
   */
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allSelected = e.target.checked;
    onSelectAll?.(allSelected);
  };

  /**
   * Gets category display info
   */
  const getCategoryInfo = (category: ReportCategory) => {
    const categoryInfo = {
      clinical: { icon: BarChart3, color: 'text-blue-600', label: 'Clinical' },
      financial: { icon: FileText, color: 'text-green-600', label: 'Financial' },
      operational: { icon: Users, color: 'text-purple-600', label: 'Operational' },
      compliance: { icon: CheckCircle, color: 'text-orange-600', label: 'Compliance' },
      'patient-satisfaction': { icon: Star, color: 'text-yellow-600', label: 'Patient Satisfaction' },
      custom: { icon: FileText, color: 'text-gray-600', label: 'Custom' }
    };
    return categoryInfo[category];
  };

  /**
   * Gets status display info
   */
  const getStatusInfo = (status: ReportStatus) => {
    const statusInfo = {
      draft: { color: 'text-gray-600 bg-gray-100', label: 'Draft' },
      published: { color: 'text-green-600 bg-green-100', label: 'Published' },
      archived: { color: 'text-red-600 bg-red-100', label: 'Archived' },
      scheduled: { color: 'text-blue-600 bg-blue-100', label: 'Scheduled' }
    };
    return statusInfo[status];
  };

  // Show loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${className}`} role="status" aria-label="Loading reports">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${className}`} role="alert">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Error loading reports</p>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show empty state
  if (filteredAndSortedReports.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-64 ${className}`}>
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">No reports found</p>
          <p className="text-gray-600 mb-4">
            {filters.searchQuery || Object.keys(filters).length > 0
              ? "Try adjusting your search or filters"
              : "Get started by creating your first report"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Bulk Selection Header */}
      {bulkSelection && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedReports.length === paginatedReports.length && paginatedReports.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-blue-900">
                  Select All ({paginatedReports.length})
                </span>
              </label>
              
              {selectedReports.length > 0 && (
                <span className="text-sm text-blue-700">
                  {selectedReports.length} selected
                </span>
              )}
            </div>
            
            {selectedReports.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onBulkOperation?.('export', selectedReports)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 
                           bg-white border border-blue-300 rounded-md hover:bg-blue-50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
                <button
                  onClick={() => onBulkOperation?.('share', selectedReports)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 
                           bg-white border border-blue-300 rounded-md hover:bg-blue-50"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </button>
                {canManage && (
                  <>
                    <button
                      onClick={() => onBulkOperation?.('archive', selectedReports)}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-700 
                               bg-white border border-orange-300 rounded-md hover:bg-orange-50"
                    >
                      <Archive className="w-4 h-4 mr-1" />
                      Archive
                    </button>
                    <button
                      onClick={() => onBulkOperation?.('delete', selectedReports)}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 
                               bg-white border border-red-300 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              variant="default"
              selectable={bulkSelection}
              selected={selectedReports.includes(report.id)}
              canManage={canManage}
              canRun={canRun}
              canShare={canShare}
              onClick={onReportClick}
              onView={onViewReport}
              onRun={onRunReport}
              onDownload={onDownloadReport}
              onShare={onShareReport}
              onToggleBookmark={onToggleBookmark}
              onToggleFavorite={onToggleFavorite}
              onSelectionChange={onSelectionChange}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {paginatedReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              variant="compact"
              selectable={bulkSelection}
              selected={selectedReports.includes(report.id)}
              canManage={canManage}
              canRun={canRun}
              canShare={canShare}
              onClick={onReportClick}
              onView={onViewReport}
              onRun={onRunReport}
              onDownload={onDownloadReport}
              onShare={onShareReport}
              onToggleBookmark={onToggleBookmark}
              onToggleFavorite={onToggleFavorite}
              onSelectionChange={onSelectionChange}
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {bulkSelection && (
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedReports.length === paginatedReports.length && paginatedReports.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label="Select all reports"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metrics
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedReports.map((report) => {
                  const categoryInfo = getCategoryInfo(report.category);
                  const statusInfo = getStatusInfo(report.status);
                  const CategoryIcon = categoryInfo.icon;

                  return (
                    <tr
                      key={report.id}
                      className={`
                        hover:bg-gray-50 transition-colors
                        ${selectedReports.includes(report.id) ? 'bg-blue-50' : ''}
                      `}
                      onMouseEnter={() => setHoveredReport(report.id)}
                      onMouseLeave={() => setHoveredReport(null)}
                    >
                      {bulkSelection && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedReports.includes(report.id)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              onSelectionChange?.(report.id, e.target.checked);
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            aria-label={`Select report ${report.title}`}
                          />
                        </td>
                      )}
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`p-2 rounded-lg ${categoryInfo.color.replace('text-', 'text-').replace('600', '100')} 
                                          ${categoryInfo.color.replace('text-', 'bg-').replace('600', '100')}`}>
                              <CategoryIcon className={`w-4 h-4 ${categoryInfo.color}`} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <button
                                onClick={() => onReportClick?.(report)}
                                className="text-sm font-medium text-gray-900 hover:text-blue-600"
                              >
                                {report.title}
                              </button>
                              {report.isFavorite && (
                                <Star className="w-4 h-4 ml-1 text-yellow-500 fill-current" />
                              )}
                              {report.isBookmarked && (
                                <Bookmark className="w-4 h-4 ml-1 text-blue-500 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate max-w-xs">
                              {report.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{categoryInfo.label}</span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.author.name}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {report.lastUpdated.toLocaleDateString()}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {report.metrics.views}
                          </div>
                          <div className="flex items-center">
                            <Download className="w-4 h-4 mr-1" />
                            {report.metrics.downloads}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {onViewReport && (
                            <button
                              onClick={() => onViewReport(report.id)}
                              className="text-gray-400 hover:text-blue-600"
                              title="View Report"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          
                          {canRun && onRunReport && (
                            <button
                              onClick={() => onRunReport(report.id)}
                              className="text-gray-400 hover:text-green-600"
                              title="Run Report"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>
                          )}
                          
                          {onDownloadReport && (
                            <button
                              onClick={() => onDownloadReport(report.id, 'pdf')}
                              className="text-gray-400 hover:text-purple-600"
                              title="Download Report"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button className="text-gray-400 hover:text-gray-600" title="More Options">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedReports.length)} of {filteredAndSortedReports.length} reports
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 
                       rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  className={`
                    px-3 py-2 text-sm font-medium border rounded-md
                    ${pageNum === currentPage
                      ? 'text-white bg-blue-600 border-blue-600'
                      : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 
                       rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportList;
