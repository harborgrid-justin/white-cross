'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ExclamationTriangleIcon, InboxIcon } from '@heroicons/react/24/outline';
import CommunicationCard, { Communication } from './CommunicationCard';
import { CommunicationViewMode, CommunicationFilters, CommunicationSort } from './CommunicationHeader';

/**
 * Props for the CommunicationList component
 */
export interface CommunicationListProps {
  /** Array of communications to display */
  communications?: Communication[];
  /** Current view mode */
  viewMode?: CommunicationViewMode;
  /** Current filters */
  filters?: CommunicationFilters;
  /** Current sort configuration */
  sort?: CommunicationSort;
  /** Search query */
  searchQuery?: string;
  /** Whether loading state is active */
  loading?: boolean;
  /** Error message if any */
  error?: string;
  /** Whether bulk selection is enabled */
  bulkSelectEnabled?: boolean;
  /** Array of selected communication IDs */
  selectedIds?: string[];
  /** Items per page for pagination */
  itemsPerPage?: number;
  /** Current page number */
  currentPage?: number;
  /** Whether to show pagination */
  showPagination?: boolean;
  /** Callback when communication is clicked */
  onCommunicationClick?: (communication: Communication) => void;
  /** Callback when communications are selected */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Callback when reply is clicked */
  onReply?: (communication: Communication) => void;
  /** Callback when forward is clicked */
  onForward?: (communication: Communication) => void;
  /** Callback when flag is toggled */
  onToggleFlag?: (communication: Communication) => void;
  /** Callback when delete is clicked */
  onDelete?: (communication: Communication) => void;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback to retry on error */
  onRetry?: () => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * CommunicationList Component
 * 
 * A comprehensive list component for displaying communications with support for
 * different view modes, filtering, sorting, pagination, and bulk operations.
 * 
 * Features:
 * - Multiple view modes (list, grid, compact)
 * - Real-time filtering and sorting
 * - Pagination support
 * - Bulk selection and operations
 * - Loading and error states
 * - Empty state handling
 * - Responsive design
 * - Accessibility compliant with ARIA attributes
 * - HIPAA-compliant display with sensitive data protection
 * 
 * @param props - The component props
 * @returns The rendered CommunicationList component
 */
const CommunicationList = ({
  communications = [],
  viewMode = 'list',
  filters = {},
  sort = { field: 'date', order: 'desc' },
  searchQuery = '',
  loading = false,
  error,
  bulkSelectEnabled = false,
  selectedIds = [],
  itemsPerPage = 20,
  currentPage = 1,
  showPagination = true,
  onCommunicationClick,
  onSelectionChange,
  onReply,
  onForward,
  onToggleFlag,
  onDelete,
  onPageChange,
  onRetry,
  className = ''
}: CommunicationListProps) => {
  const [selectAll, setSelectAll] = useState(false);

  /**
   * Filter and sort communications
   */
  const filteredAndSortedCommunications = useMemo(() => {
    let result = [...communications];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(comm =>
        comm.subject.toLowerCase().includes(query) ||
        comm.content.toLowerCase().includes(query) ||
        comm.sender.name.toLowerCase().includes(query) ||
        comm.sender.email?.toLowerCase().includes(query) ||
        comm.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.type?.length) {
      result = result.filter(comm => filters.type!.includes(comm.type));
    }

    if (filters.status?.length) {
      result = result.filter(comm => filters.status!.includes(comm.status));
    }

    if (filters.priority?.length) {
      result = result.filter(comm => filters.priority!.includes(comm.priority));
    }

    if (filters.sender) {
      const senderQuery = filters.sender.toLowerCase();
      result = result.filter(comm =>
        comm.sender.name.toLowerCase().includes(senderQuery) ||
        comm.sender.email?.toLowerCase().includes(senderQuery)
      );
    }

    if (filters.hasAttachments !== undefined) {
      result = result.filter(comm => comm.hasAttachments === filters.hasAttachments);
    }

    if (filters.isRead !== undefined) {
      result = result.filter(comm => comm.isRead === filters.isRead);
    }

    if (filters.isFlagged !== undefined) {
      result = result.filter(comm => comm.isFlagged === filters.isFlagged);
    }

    if (filters.tags?.length) {
      result = result.filter(comm =>
        filters.tags!.some(tag => comm.tags.includes(tag))
      );
    }

    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      result = result.filter(comm => {
        const commDate = new Date(comm.sentDate);
        return commDate >= startDate && commDate <= endDate;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sort.field) {
        case 'date':
          aValue = new Date(a.sentDate).getTime();
          bValue = new Date(b.sentDate).getTime();
          break;
        case 'sender':
          aValue = a.sender.name.toLowerCase();
          bValue = b.sender.name.toLowerCase();
          break;
        case 'subject':
          aValue = a.subject.toLowerCase();
          bValue = b.subject.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { low: 1, normal: 2, high: 3, urgent: 4 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.sentDate).getTime();
          bValue = new Date(b.sentDate).getTime();
      }

      if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [communications, searchQuery, filters, sort]);

  /**
   * Paginate communications
   */
  const paginatedCommunications = useMemo(() => {
    if (!showPagination) return filteredAndSortedCommunications;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCommunications.slice(startIndex, endIndex);
  }, [filteredAndSortedCommunications, currentPage, itemsPerPage, showPagination]);

  /**
   * Calculate total pages
   */
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedCommunications.length / itemsPerPage);
  }, [filteredAndSortedCommunications.length, itemsPerPage]);

  /**
   * Handle select all toggle
   */
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      const allIds = paginatedCommunications.map(comm => comm.id);
      onSelectionChange?.(allIds);
    } else {
      onSelectionChange?.([]);
    }
  };

  /**
   * Handle individual selection
   */
  const handleSelection = (communication: Communication, selected: boolean) => {
    let newSelectedIds: string[];
    
    if (selected) {
      newSelectedIds = [...selectedIds, communication.id];
    } else {
      newSelectedIds = selectedIds.filter(id => id !== communication.id);
    }
    
    onSelectionChange?.(newSelectedIds);
  };

  /**
   * Calculate if all items on current page are selected
   */
  const allPageItemsSelected = useMemo(() => {
    const allPageIds = paginatedCommunications.map(comm => comm.id);
    return allPageIds.length > 0 && allPageIds.every(id => selectedIds.includes(id));
  }, [selectedIds, paginatedCommunications]);

  /**
   * Update select all state when page selection changes
   */
  useEffect(() => {
    setSelectAll(allPageItemsSelected);
  }, [allPageItemsSelected]);

  /**
   * Get grid CSS classes based on view mode
   */
  const getGridClasses = () => {
    switch (viewMode) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
      case 'compact':
        return 'space-y-1';
      case 'list':
      default:
        return 'space-y-3';
    }
  };

  /**
   * Render pagination
   */
  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const initialEndPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we don't have enough pages
    const adjustedStartPage = initialEndPage - startPage + 1 < maxVisiblePages 
      ? Math.max(1, initialEndPage - maxVisiblePages + 1)
      : startPage;
    
    const endPage = Math.min(totalPages, adjustedStartPage + maxVisiblePages - 1);

    for (let i = adjustedStartPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
              {' '}to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredAndSortedCommunications.length)}
              </span>
              {' '}of{' '}
              <span className="font-medium">{filteredAndSortedCommunications.length}</span>
              {' '}results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                    pageNum === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading communications...</p>
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">Error loading communications</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  /**
   * Render empty state
   */
  if (filteredAndSortedCommunications.length === 0) {
    const hasFilters = searchQuery || Object.values(filters).some(value => 
      Array.isArray(value) ? value.length > 0 : value !== undefined
    );

    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <InboxIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">
            {hasFilters ? 'No communications match your filters' : 'No communications'}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {hasFilters 
              ? 'Try adjusting your search or filter criteria'
              : 'Communications will appear here when they are created'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Bulk Selection Header */}
      {bulkSelectEnabled && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Select all {paginatedCommunications.length} communications on this page
            </span>
          </label>
        </div>
      )}

      {/* Communications List */}
      <div className={`p-4 ${getGridClasses()}`}>
        {paginatedCommunications.map((communication) => (
          <CommunicationCard
            key={communication.id}
            communication={communication}
            compact={viewMode === 'compact'}
            selected={selectedIds.includes(communication.id)}
            selectable={bulkSelectEnabled}
            onClick={onCommunicationClick}
            onSelect={handleSelection}
            onReply={onReply}
            onForward={onForward}
            onToggleFlag={onToggleFlag}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default CommunicationList;
