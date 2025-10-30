'use client';

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  Bars3Icon,
  Squares2X2Icon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  ArchiveBoxIcon,
  StarIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { CommunicationType, CommunicationStatus, CommunicationPriority } from './CommunicationCard';

/**
 * View mode options for communications
 */
export type CommunicationViewMode = 'list' | 'grid' | 'compact';

/**
 * Filter options for communications
 */
export interface CommunicationFilters {
  type?: CommunicationType[];
  status?: CommunicationStatus[];
  priority?: CommunicationPriority[];
  dateRange?: {
    start: string;
    end: string;
  };
  sender?: string;
  hasAttachments?: boolean;
  isRead?: boolean;
  isFlagged?: boolean;
  tags?: string[];
}

/**
 * Sort options for communications
 */
export type CommunicationSortField = 'date' | 'sender' | 'subject' | 'priority' | 'status';
export type CommunicationSortOrder = 'asc' | 'desc';

export interface CommunicationSort {
  field: CommunicationSortField;
  order: CommunicationSortOrder;
}

/**
 * Communication statistics
 */
export interface CommunicationStats {
  total: number;
  unread: number;
  flagged: number;
  drafts: number;
  sent: number;
  failed: number;
}

/**
 * Props for the CommunicationHeader component
 */
export interface CommunicationHeaderProps {
  /** Search query */
  searchQuery?: string;
  /** Current filters */
  filters?: CommunicationFilters;
  /** Current sort configuration */
  sort?: CommunicationSort;
  /** Current view mode */
  viewMode?: CommunicationViewMode;
  /** Communication statistics */
  stats?: CommunicationStats;
  /** Whether bulk selection is enabled */
  bulkSelectEnabled?: boolean;
  /** Number of selected items */
  selectedCount?: number;
  /** Whether loading state is active */
  loading?: boolean;
  /** Callback when search changes */
  onSearchChange?: (query: string) => void;
  /** Callback when filters change */
  onFiltersChange?: (filters: CommunicationFilters) => void;
  /** Callback when sort changes */
  onSortChange?: (sort: CommunicationSort) => void;
  /** Callback when view mode changes */
  onViewModeChange?: (mode: CommunicationViewMode) => void;
  /** Callback when compose is clicked */
  onCompose?: (type: CommunicationType) => void;
  /** Callback when bulk actions are performed */
  onBulkAction?: (action: string) => void;
  /** Callback when clear filters is clicked */
  onClearFilters?: () => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * CommunicationHeader Component
 * 
 * A comprehensive header component for communication management with search,
 * filtering, sorting, view controls, and bulk actions.
 * 
 * Features:
 * - Global search functionality
 * - Advanced filtering by type, status, priority, date range
 * - Sorting by multiple fields
 * - View mode selection (list, grid, compact)
 * - Statistics display with real-time counts
 * - Bulk selection and actions
 * - Compose new communication buttons
 * - Responsive design with mobile support
 * - Accessibility compliant with ARIA attributes
 * 
 * @param props - The component props
 * @returns The rendered CommunicationHeader component
 */
const CommunicationHeader = ({
  searchQuery = '',
  filters = {},
  sort = { field: 'date', order: 'desc' },
  viewMode = 'list',
  stats,
  bulkSelectEnabled = false,
  selectedCount = 0,
  loading = false,
  onSearchChange,
  onFiltersChange,
  onSortChange,
  onViewModeChange,
  onCompose,
  onBulkAction,
  onClearFilters,
  className = ''
}: CommunicationHeaderProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showComposeMenu, setShowComposeMenu] = useState(false);

  /**
   * Handle search input change
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(event.target.value);
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (key: string, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange?.(newFilters);
  };

  /**
   * Handle sort change
   */
  const handleSortChange = (field: CommunicationSortField) => {
    const newOrder = sort.field === field && sort.order === 'desc' ? 'asc' : 'desc';
    onSortChange?.({ field, order: newOrder });
  };

  /**
   * Get active filter count
   */
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.type?.length) count++;
    if (filters.status?.length) count++;
    if (filters.priority?.length) count++;
    if (filters.dateRange) count++;
    if (filters.sender) count++;
    if (filters.hasAttachments !== undefined) count++;
    if (filters.isRead !== undefined) count++;
    if (filters.isFlagged !== undefined) count++;
    if (filters.tags?.length) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Main Header Row */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Title & Stats */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Communications</h1>
            {stats && (
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{stats.total} total</span>
                {stats.unread > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {stats.unread} unread
                  </span>
                )}
                {stats.flagged > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    {stats.flagged} flagged
                  </span>
                )}
                {stats.drafts > 0 && (
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    {stats.drafts} drafts
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Compose Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowComposeMenu(!showComposeMenu)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-expanded={showComposeMenu}
                aria-haspopup="true"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Compose
              </button>

              {showComposeMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => {
                        onCompose?.('email');
                        setShowComposeMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <EnvelopeIcon className="h-4 w-4 mr-3" />
                      Email
                    </button>
                    <button
                      onClick={() => {
                        onCompose?.('sms');
                        setShowComposeMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-3" />
                      SMS
                    </button>
                    <button
                      onClick={() => {
                        onCompose?.('phone');
                        setShowComposeMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <PhoneIcon className="h-4 w-4 mr-3" />
                      Phone Call
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => onViewModeChange?.('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="List view"
              >
                <Bars3Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange?.('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Grid view"
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange?.('compact')}
                className={`p-2 ${
                  viewMode === 'compact'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Compact view"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-6 py-3 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search communications..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search communications"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${
              activeFilterCount > 0
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-expanded={showFilters}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <select
            value={`${sort.field}-${sort.order}`}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const [field, order] = e.target.value.split('-') as [CommunicationSortField, CommunicationSortOrder];
              onSortChange?.({ field, order });
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Sort communications"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="sender-asc">Sender A-Z</option>
            <option value="sender-desc">Sender Z-A</option>
            <option value="subject-asc">Subject A-Z</option>
            <option value="subject-desc">Subject Z-A</option>
            <option value="priority-desc">High Priority First</option>
            <option value="status-asc">Status</option>
          </select>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {bulkSelectEnabled && selectedCount > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedCount} communication{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onBulkAction?.('markRead')}
                className="px-3 py-1 text-sm text-blue-700 hover:text-blue-900"
              >
                Mark as Read
              </button>
              <button
                onClick={() => onBulkAction?.('markUnread')}
                className="px-3 py-1 text-sm text-blue-700 hover:text-blue-900"
              >
                Mark as Unread
              </button>
              <button
                onClick={() => onBulkAction?.('flag')}
                className="px-3 py-1 text-sm text-blue-700 hover:text-blue-900"
              >
                <StarIcon className="h-4 w-4 inline mr-1" />
                Flag
              </button>
              <button
                onClick={() => onBulkAction?.('archive')}
                className="px-3 py-1 text-sm text-blue-700 hover:text-blue-900"
              >
                <ArchiveBoxIcon className="h-4 w-4 inline mr-1" />
                Archive
              </button>
              <button
                onClick={() => onBulkAction?.('delete')}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                <TrashIcon className="h-4 w-4 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="px-6 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Loading communications...
          </div>
        </div>
      )}

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                multiple
                value={filters.type || []}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const values = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value) as CommunicationType[];
                  handleFilterChange('type', values);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                size={4}
                aria-label="Filter by communication type"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="phone">Phone</option>
                <option value="chat">Chat</option>
                <option value="letter">Letter</option>
                <option value="notification">Notification</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                multiple
                value={filters.status || []}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const values = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value) as CommunicationStatus[];
                  handleFilterChange('status', values);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                size={4}
                aria-label="Filter by communication status"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                multiple
                value={filters.priority || []}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const values = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value) as CommunicationPriority[];
                  handleFilterChange('priority', values);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                size={4}
                aria-label="Filter by communication priority"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Additional Filters */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sender
                </label>
                <input
                  type="text"
                  placeholder="Filter by sender..."
                  value={filters.sender || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('sender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasAttachments || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('hasAttachments', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Has attachments</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isFlagged || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('isFlagged', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Flagged</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isRead === false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('isRead', e.target.checked ? false : undefined)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Unread only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationHeader;
