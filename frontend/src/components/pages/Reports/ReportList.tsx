'use client';

import React from 'react';
import type { ReportListProps } from './ReportList.types';
import { useReportFiltering, useReportPagination } from './ReportList.hooks';
import { LoadingState, ErrorState, EmptyState } from './ReportListStates';
import { ReportListBulkHeader } from './ReportListBulkHeader';
import { ReportGridView, ReportListView, ReportTableView } from './ReportListViews';
import { ReportListPagination } from './ReportListPagination';

/**
 * ReportList Component
 *
 * A comprehensive list component for displaying reports with support for multiple
 * view modes, sorting, filtering, pagination, and bulk operations. Provides a
 * flexible interface for report browsing and management.
 *
 * This component has been refactored into multiple maintainable modules:
 * - ReportList.types.ts: Type definitions
 * - ReportList.utils.ts: Utility functions
 * - ReportList.hooks.ts: Custom React hooks
 * - ReportListStates.tsx: State rendering components
 * - ReportListBulkHeader.tsx: Bulk selection UI
 * - ReportListViews.tsx: View rendering components
 * - ReportListPagination.tsx: Pagination controls
 *
 * @param props - ReportList component props
 * @returns JSX element representing the report list
 */
const ReportList: React.FC<ReportListProps> = ({
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
}) => {
  // Apply filtering and sorting using custom hook
  const filteredAndSortedReports = useReportFiltering(
    reports,
    filters,
    sortBy,
    sortDirection
  );

  // Apply pagination using custom hook
  const {
    paginatedReports,
    totalPages,
    startIndex,
    endIndex,
    totalItems
  } = useReportPagination(
    filteredAndSortedReports,
    currentPage,
    pageSize,
    showPagination
  );

  // Show loading state
  if (loading) {
    return <LoadingState className={className} />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} className={className} onRefresh={onRefresh} />;
  }

  // Show empty state
  if (filteredAndSortedReports.length === 0) {
    return <EmptyState filters={filters} className={className} />;
  }

  // Prepare common view props
  const viewProps = {
    reports: paginatedReports,
    bulkSelection,
    selectedReports,
    canManage,
    canRun,
    canShare,
    onReportClick,
    onViewReport,
    onRunReport,
    onDownloadReport,
    onShareReport,
    onToggleBookmark,
    onToggleFavorite,
    onSelectionChange,
    onSelectAll
  };

  return (
    <div className={className}>
      {/* Bulk Selection Header */}
      {bulkSelection && onBulkOperation && (
        <ReportListBulkHeader
          totalReports={paginatedReports.length}
          selectedCount={selectedReports.length}
          allSelected={
            selectedReports.length === paginatedReports.length &&
            paginatedReports.length > 0
          }
          canManage={canManage}
          onSelectAll={(selected) => onSelectAll?.(selected)}
          onBulkOperation={onBulkOperation}
          selectedReports={selectedReports}
        />
      )}

      {/* Grid View */}
      {viewMode === 'grid' && <ReportGridView {...viewProps} />}

      {/* List View */}
      {viewMode === 'list' && <ReportListView {...viewProps} />}

      {/* Table View */}
      {viewMode === 'table' && <ReportTableView {...viewProps} />}

      {/* Pagination */}
      {showPagination && onPageChange && (
        <ReportListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ReportList;
