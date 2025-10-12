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

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageState, useSortState } from '../../hooks/useRouteState';
import { useIncidentReportsData } from './hooks/useIncidentReportsData';
import { useIncidentReportsFilters } from './hooks/useIncidentReportsFilters';
import IncidentReportsHeader from './components/IncidentReportsHeader';
import IncidentReportsStatistics from './components/IncidentReportsStatistics';
import IncidentReportsFilters from './components/IncidentReportsFilters';
import IncidentReportsTable from './components/IncidentReportsTable';
import IncidentReportsEmptyState from './components/IncidentReportsEmptyState';
import IncidentReportsErrorState from './components/IncidentReportsErrorState';
import IncidentReportsLoadingState from './components/IncidentReportsLoadingState';
import type { IncidentSortColumn } from './types';
import toast from 'react-hot-toast';

/**
 * Main Incident Reports Page Component
 */
export default function IncidentReports() {
  const navigate = useNavigate();

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
  // FILTERS STATE
  // =====================
  const {
    localFilters,
    isSearchMode,
    hasActiveFilters,
    isRestored,
    handleSearch,
    handleFilterChange,
    handleClearFilters: clearFilters,
  } = useIncidentReportsFilters({
    onFilterChange: resetPage,
  });

  // =====================
  // DATA FETCHING
  // =====================
  const {
    reports,
    pagination,
    statistics,
    isLoading,
    currentError,
    loadIncidentReports,
  } = useIncidentReportsData({
    localFilters,
    page,
    pageSize,
    isSearchMode,
    isRestored,
  });

  // =====================
  // EVENT HANDLERS
  // =====================

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

  /**
   * Clear filters with page reset
   */
  const handleClearFilters = useCallback(() => {
    clearFilters();
    resetPage();
  }, [clearFilters, resetPage]);

  // =====================
  // RENDER: ERROR STATE
  // =====================
  if (currentError && !isLoading) {
    return (
      <div className="space-y-6">
        <IncidentReportsHeader
          totalReports={pagination.total}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onCreateIncident={handleCreateIncident}
        />
        <IncidentReportsErrorState
          error={currentError}
          onRetry={handleRefresh}
        />
      </div>
    );
  }

  // =====================
  // RENDER: EMPTY STATE
  // =====================
  if (!isLoading && reports.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incident Reports</h1>
            <p className="text-gray-600">Comprehensive incident management system</p>
          </div>
        </div>
        <IncidentReportsEmptyState
          hasActiveFilters={hasActiveFilters}
          onCreateIncident={handleCreateIncident}
          onClearFilters={handleClearFilters}
        />
      </div>
    );
  }

  // =====================
  // RENDER: MAIN VIEW
  // =====================
  return (
    <div className="space-y-6">
      {/* Header */}
      <IncidentReportsHeader
        totalReports={pagination.total}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onCreateIncident={handleCreateIncident}
      />

      {/* Statistics Cards */}
      <IncidentReportsStatistics statistics={statistics} />

      {/* Search and Filter Bar */}
      <IncidentReportsFilters
        filters={localFilters}
        hasActiveFilters={hasActiveFilters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Loading State */}
      {isLoading && reports.length === 0 ? (
        <IncidentReportsLoadingState />
      ) : (
        /* Reports Table */
        <IncidentReportsTable
          reports={reports}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          totalReports={pagination.total}
          totalPages={pagination.pages}
          pageSizeOptions={pageSizeOptions}
          sortColumn={sortColumn}
          onViewIncident={handleViewIncident}
          onPageChange={handlePageChange}
          onPageSizeChange={setPageSize}
          onSort={toggleSort}
          getSortIndicator={getSortIndicator}
        />
      )}
    </div>
  );
}
