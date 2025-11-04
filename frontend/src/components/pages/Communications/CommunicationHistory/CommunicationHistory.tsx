'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  FunnelIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import type { CommunicationHistoryProps } from './types';
import { useCommunicationHistory, useHistoryFilters, useRecordSelection } from './hooks';
import { HistorySearch } from './HistorySearch';
import { HistoryFilters } from './HistoryFilters';
import { HistoryList } from './HistoryList';

/**
 * CommunicationHistory component for viewing communication history and logs
 *
 * Features:
 * - Complete communication history with filtering and search
 * - Real-time status tracking (sent, delivered, read, failed)
 * - Thread-based conversation grouping
 * - Advanced filtering by type, status, priority, date range
 * - Export functionality for compliance and auditing
 * - Communication resend capabilities
 * - Attachment preview and download
 * - Delivery analytics and statistics
 *
 * @component
 * @example
 * ```tsx
 * <CommunicationHistory
 *   studentId="student-123"
 *   onViewCommunication={(record) => handleViewCommunication(record)}
 *   onResendCommunication={(id) => handleResendCommunication(id)}
 *   onOpenThread={(threadId) => handleOpenThread(threadId)}
 * />
 * ```
 */
export const CommunicationHistory: React.FC<CommunicationHistoryProps> = ({
  className = '',
  isLoading: externalIsLoading = false,
  error: externalError,
  studentId,
  onViewCommunication,
  onResendCommunication,
  onOpenThread
}): React.ReactElement => {
  // Custom hooks for state management
  const { communications, isLoading: dataLoading, error: dataError } = useCommunicationHistory(studentId);
  const {
    filters,
    setFilter,
    clearFilters,
    getFilteredCommunications
  } = useHistoryFilters(studentId);
  const {
    selectedRecords,
    toggleRecord,
    toggleAll,
    clearSelection
  } = useRecordSelection();

  // UI state
  const [showFilters, setShowFilters] = useState(false);

  // Combine loading and error states
  const isLoading = externalIsLoading || dataLoading;
  const error = externalError || dataError;

  // Memoized filtered communications
  const filteredCommunications = useMemo(() => {
    return getFilteredCommunications(communications);
  }, [communications, getFilteredCommunications]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search ||
      filters.type ||
      filters.status ||
      filters.priority ||
      filters.category ||
      filters.dateRange.start ||
      filters.dateRange.end
    );
  }, [filters]);

  // Memoized event handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilter('search', value);
  }, [setFilter]);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const handleSelectAll = useCallback(() => {
    toggleAll(filteredCommunications);
  }, [toggleAll, filteredCommunications]);

  const handleExport = useCallback(() => {
    if (selectedRecords.size === 0) return;

    // This would typically trigger a download of communication records
    console.log('Exporting records:', Array.from(selectedRecords));

    // Clear selection after export
    clearSelection();
  }, [selectedRecords, clearSelection]);

  const handleViewCommunication = useCallback((record: Parameters<typeof onViewCommunication>[0]) => {
    onViewCommunication?.(record);
  }, [onViewCommunication]);

  const handleResendCommunication = useCallback((recordId: string) => {
    onResendCommunication?.(recordId);
  }, [onResendCommunication]);

  const handleOpenThread = useCallback((threadId: string) => {
    onOpenThread?.(threadId);
  }, [onOpenThread]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading communication history</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communication History</h2>
          <p className="text-gray-600 mt-1">
            {studentId ? 'Student-specific communication logs and history' : 'Complete communication logs and history'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Toggle filters"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
            <ChevronDownIcon className={`h-4 w-4 ml-2 transform ${showFilters ? 'rotate-180' : ''} transition-transform`} />
          </button>
          {selectedRecords.size > 0 && (
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Export selected communications"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export ({selectedRecords.size})
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <HistorySearch
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search communications..."
      />

      {/* Filters */}
      {showFilters && (
        <HistoryFilters
          filters={filters}
          onFilterChange={(newFilters) => {
            Object.entries(newFilters).forEach(([key, value]) => {
              setFilter(key as keyof typeof filters, value);
            });
          }}
          onClear={clearFilters}
          studentId={studentId}
        />
      )}

      {/* Communications List */}
      <HistoryList
        communications={filteredCommunications}
        selectedRecords={selectedRecords}
        onRecordSelect={toggleRecord}
        onSelectAll={handleSelectAll}
        onViewCommunication={handleViewCommunication}
        onOpenThread={handleOpenThread}
        onResendCommunication={handleResendCommunication}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

export default CommunicationHistory;
