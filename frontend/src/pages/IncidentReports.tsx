/**
 * Incident Reports Page - Enterprise Implementation
 *
 * Complete incident management system with:
 * - Redux state management
 * - Advanced filtering with persistence
 * - Pagination and sorting
 * - Search functionality
 * - Real-time updates
 * - HIPAA-compliant data handling
 * - Comprehensive error handling
 *
 * @module pages/IncidentReports
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Camera,
  FileText,
  Bell,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  Shield,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../stores/hooks/reduxHooks';
import {
  fetchIncidentReports,
  searchIncidentReports,
  setFilters,
  clearSelectedIncident,
  selectIncidentReports,
  selectPagination,
  selectFilters,
  selectFilteredAndSortedReports,
  selectIsLoading,
  selectError,
  selectReportStatistics,
} from '../stores/slices/incidentReportsSlice';
import { usePersistedFilters } from '../hooks/useRouteState';
import { usePageState } from '../hooks/useRouteState';
import { useSortState } from '../hooks/useRouteState';
import type {
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  IncidentReportFilters,
  IncidentReport,
} from '../types/incidents';
import {
  getIncidentSeverityColor,
  getIncidentTypeLabel,
  getIncidentSeverityLabel,
} from '../types/incidents';
import toast from 'react-hot-toast';

/**
 * Filter form state interface
 */
interface IncidentFiltersForm {
  search: string;
  type: IncidentType | '';
  severity: IncidentSeverity | '';
  status: IncidentStatus | '';
  dateFrom: string;
  dateTo: string;
  parentNotified: string; // 'all' | 'true' | 'false'
  followUpRequired: string; // 'all' | 'true' | 'false'
}

/**
 * Sort columns available for incident reports
 */
type IncidentSortColumn = 'occurredAt' | 'severity' | 'type' | 'status' | 'reportedAt';

/**
 * Main Incident Reports Page Component
 */
export default function IncidentReports() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // =====================
  // REDUX STATE
  // =====================
  const reports = useAppSelector(selectFilteredAndSortedReports);
  const pagination = useAppSelector(selectPagination);
  const reduxFilters = useAppSelector(selectFilters);
  const statistics = useAppSelector(selectReportStatistics);
  const isLoadingList = useAppSelector(selectIsLoading('list'));
  const isSearching = useAppSelector(selectIsLoading('searching'));
  const listError = useAppSelector(selectError('list'));
  const searchError = useAppSelector(selectError('search'));

  // =====================
  // LOCAL STATE - FILTERS
  // =====================
  const {
    filters: localFilters,
    updateFilter,
    clearFilters: clearLocalFilters,
    isRestored,
  } = usePersistedFilters<IncidentFiltersForm>({
    storageKey: 'incident-reports-filters',
    defaultFilters: {
      search: '',
      type: '',
      severity: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      parentNotified: 'all',
      followUpRequired: 'all',
    },
    debounceMs: 500,
    syncWithUrl: true,
  });

  // =====================
  // PAGINATION STATE
  // =====================
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    resetPage,
    pageSizeOptions,
  } = usePageState({
    defaultPage: 1,
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    resetOnFilterChange: true,
  });

  // =====================
  // SORT STATE
  // =====================
  const {
    column: sortColumn,
    direction: sortDirection,
    toggleSort,
    getSortIndicator,
  } = useSortState<IncidentSortColumn>({
    validColumns: ['occurredAt', 'severity', 'type', 'status', 'reportedAt'],
    defaultColumn: 'occurredAt',
    defaultDirection: 'desc',
    persistPreference: true,
    storageKey: 'incident-reports-sort',
  });

  // =====================
  // UI STATE
  // =====================
  const [showFilters, setShowFilters] = React.useState(false);
  const [isSearchMode, setIsSearchMode] = React.useState(false);

  // =====================
  // DERIVED STATE
  // =====================
  const hasActiveFilters = useMemo(() => {
    return (
      localFilters.type !== '' ||
      localFilters.severity !== '' ||
      localFilters.status !== '' ||
      localFilters.dateFrom !== '' ||
      localFilters.dateTo !== '' ||
      localFilters.parentNotified !== 'all' ||
      localFilters.followUpRequired !== 'all'
    );
  }, [localFilters]);

  const isLoading = isLoadingList || isSearching;
  const currentError = listError || searchError;

  // =====================
  // DATA FETCHING
  // =====================

  /**
   * Fetch incident reports with current filters
   */
  const loadIncidentReports = useCallback(() => {
    // Build API filters from local filters
    const apiFilters: IncidentReportFilters = {
      page,
      limit: pageSize,
    };

    if (localFilters.type) apiFilters.type = localFilters.type as IncidentType;
    if (localFilters.severity) apiFilters.severity = localFilters.severity as IncidentSeverity;
    if (localFilters.status) apiFilters.status = localFilters.status as IncidentStatus;
    if (localFilters.dateFrom) apiFilters.dateFrom = localFilters.dateFrom;
    if (localFilters.dateTo) apiFilters.dateTo = localFilters.dateTo;
    if (localFilters.parentNotified !== 'all') {
      apiFilters.parentNotified = localFilters.parentNotified === 'true';
    }
    if (localFilters.followUpRequired !== 'all') {
      apiFilters.followUpRequired = localFilters.followUpRequired === 'true';
    }

    // Update Redux filters
    dispatch(setFilters(apiFilters));

    // Fetch data
    if (isSearchMode && localFilters.search.trim()) {
      dispatch(searchIncidentReports({
        query: localFilters.search.trim(),
        page,
        limit: pageSize,
      }));
    } else {
      dispatch(fetchIncidentReports(apiFilters));
    }
  }, [
    dispatch,
    page,
    pageSize,
    localFilters,
    isSearchMode,
  ]);

  /**
   * Initial load and reload on filter/pagination changes
   */
  useEffect(() => {
    if (!isRestored) return; // Wait for filters to be restored

    loadIncidentReports();

    // Cleanup on unmount
    return () => {
      dispatch(clearSelectedIncident());
    };
  }, [isRestored, page, pageSize, localFilters, isSearchMode, loadIncidentReports, dispatch]);

  // =====================
  // EVENT HANDLERS
  // =====================

  /**
   * Handle search input
   */
  const handleSearch = useCallback((searchQuery: string) => {
    updateFilter('search', searchQuery);
    setIsSearchMode(searchQuery.trim().length > 0);
    resetPage();
  }, [updateFilter, resetPage]);

  /**
   * Handle filter changes
   */
  const handleFilterChange = useCallback((
    field: keyof IncidentFiltersForm,
    value: string
  ) => {
    updateFilter(field, value);
    resetPage();
  }, [updateFilter, resetPage]);

  /**
   * Clear all filters
   */
  const handleClearFilters = useCallback(() => {
    clearLocalFilters();
    setIsSearchMode(false);
    resetPage();
  }, [clearLocalFilters, resetPage]);

  /**
   * Navigate to incident detail page
   * HIPAA Compliance: Use hash-based routing to avoid PHI in URLs
   */
  const handleViewIncident = useCallback((reportId: string) => {
    navigate(`/incident-reports/${reportId}`);
  }, [navigate]);

  /**
   * Navigate to create incident page
   */
  const handleCreateIncident = useCallback(() => {
    navigate('/incident-reports/new');
  }, [navigate]);

  /**
   * Handle pagination change
   */
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setPage]);

  /**
   * Refresh data
   */
  const handleRefresh = useCallback(() => {
    loadIncidentReports();
    toast.success('Incident reports refreshed');
  }, [loadIncidentReports]);

  // =====================
  // HELPER FUNCTIONS
  // =====================

  /**
   * Get status badge color
   */
  const getStatusColor = (status?: IncidentStatus) => {
    switch (status) {
      case 'OPEN':
        return 'text-blue-600 bg-blue-100';
      case 'INVESTIGATING':
        return 'text-yellow-600 bg-yellow-100';
      case 'RESOLVED':
        return 'text-green-600 bg-green-100';
      case 'CLOSED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // =====================
  // RENDER: ERROR STATE
  // =====================
  if (currentError && !isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incident Reports</h1>
            <p className="text-gray-600">Comprehensive incident management system</p>
          </div>
          <button
            onClick={handleRefresh}
            className="btn-primary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>

        <div className="card p-12 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Incident Reports
          </h3>
          <p className="text-gray-600 mb-4">{currentError}</p>
          <button onClick={handleRefresh} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================
  // RENDER: EMPTY STATE
  // =====================
  if (!isLoading && reports.length === 0 && !hasActiveFilters) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incident Reports</h1>
            <p className="text-gray-600">Comprehensive incident management system</p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <FileText className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Documentation</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Incident documentation</li>
              <li>Automated injury reports</li>
              <li>Witness statements</li>
              <li>Timeline tracking</li>
            </ul>
          </div>

          <div className="card p-6">
            <Camera className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Evidence Collection</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Photo/video upload</li>
              <li>Document management</li>
              <li>Evidence timestamping</li>
              <li>Secure storage</li>
            </ul>
          </div>

          <div className="card p-6">
            <Bell className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Parent notification automation</li>
              <li>Staff alerts</li>
              <li>Follow-up reminders</li>
              <li>Multi-channel delivery</li>
            </ul>
          </div>

          <div className="card p-6">
            <Shield className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Compliance</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Legal compliance tracking</li>
              <li>Insurance claim integration</li>
              <li>Regulatory reporting</li>
              <li>Complete audit trail</li>
            </ul>
          </div>
        </div>

        {/* Empty State */}
        <div className="card p-12 text-center">
          <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Incident Reports Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first incident report
          </p>
          <button
            onClick={handleCreateIncident}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create First Report
          </button>
        </div>
      </div>
    );
  }

  // =====================
  // RENDER: MAIN VIEW
  // =====================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incident Reports</h1>
          <p className="text-gray-600">
            {pagination.total} total report{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleCreateIncident}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Report Incident
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Parent Notified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.parentNotificationRate.toFixed(0)}%
                </p>
              </div>
              <Bell className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Follow-up Required</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.followUpRate.toFixed(0)}%
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Incidents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(statistics.bySeverity.CRITICAL || 0) + (statistics.bySeverity.HIGH || 0)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search incidents by description, location, or student..."
              value={localFilters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {localFilters.search && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center ${hasActiveFilters ? 'ring-2 ring-blue-500' : ''}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                Active
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="btn-secondary flex items-center text-red-600"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={localFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="INJURY">Injury</option>
                  <option value="ILLNESS">Illness</option>
                  <option value="BEHAVIORAL">Behavioral</option>
                  <option value="MEDICATION_ERROR">Medication Error</option>
                  <option value="ALLERGIC_REACTION">Allergic Reaction</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={localFilters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Severities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={localFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="INVESTIGATING">Investigating</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {/* Parent Notified Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Notified
                </label>
                <select
                  value={localFilters.parentNotified}
                  onChange={(e) => handleFilterChange('parentNotified', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  value={localFilters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  value={localFilters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Follow-up Required Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-up Required
                </label>
                <select
                  value={localFilters.followUpRequired}
                  onChange={(e) => handleFilterChange('followUpRequired', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Incident Reports List */}
      <div className="card">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Incident Reports
              {isLoading && <span className="ml-2 text-sm text-gray-500">(Loading...)</span>}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Showing {reports.length > 0 ? ((page - 1) * pageSize + 1) : 0} to{' '}
                {Math.min(page * pageSize, pagination.total)} of {pagination.total}
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && reports.length === 0 && (
          <div className="p-12 text-center">
            <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading incident reports...</p>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && reports.length === 0 && hasActiveFilters && (
          <div className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Incidents Found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={handleClearFilters}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Reports Table */}
        {reports.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSort('occurredAt')}
                  >
                    Date {getSortIndicator('occurredAt')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSort('type')}
                  >
                    Type {getSortIndicator('type')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSort('severity')}
                  >
                    Severity {getSortIndicator('severity')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSort('status')}
                  >
                    Status {getSortIndicator('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flags
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewIncident(report.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.occurredAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getIncidentTypeLabel(report.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIncidentSeverityColor(
                          report.severity
                        )}`}
                      >
                        {getIncidentSeverityLabel(report.severity)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.student
                        ? `${report.student.firstName} ${report.student.lastName}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status || 'OPEN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {report.parentNotified && (
                          <span
                            className="text-green-600"
                            title="Parent Notified"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </span>
                        )}
                        {report.followUpRequired && (
                          <span
                            className="text-orange-600"
                            title="Follow-up Required"
                          >
                            <Clock className="h-4 w-4" />
                          </span>
                        )}
                        {report.insuranceClaimNumber && (
                          <span
                            className="text-blue-600"
                            title="Insurance Claim Filed"
                          >
                            <Shield className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewIncident(report.id);
                        }}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {reports.length > 0 && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded ${
                          page === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.pages}
                  className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Page Info */}
              <div className="text-sm text-gray-600">
                Page {page} of {pagination.pages}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
