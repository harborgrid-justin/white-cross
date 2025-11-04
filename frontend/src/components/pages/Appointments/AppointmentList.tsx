'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  CheckSquare,
  Square,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Phone,
  Video,
  RefreshCw
} from 'lucide-react';
import AppointmentCard, { type Appointment } from './AppointmentCard';
import type { AppointmentViewMode, AppointmentSortOption, AppointmentFilters } from './AppointmentHeader';

/**
 * Pagination configuration
 */
interface PaginationConfig {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Bulk action types
 */
export type BulkAction = 
  | 'confirm'
  | 'cancel'
  | 'reschedule'
  | 'check-in'
  | 'complete'
  | 'delete'
  | 'message'
  | 'export';

/**
 * Props for the AppointmentList component
 */
interface AppointmentListProps {
  /** Array of appointments to display */
  appointments: Appointment[];
  /** Current view mode */
  viewMode: AppointmentViewMode;
  /** Current sort option */
  sortBy: AppointmentSortOption;
  /** Current filters */
  filters: AppointmentFilters;
  /** Pagination configuration */
  pagination: PaginationConfig;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Whether to show selection checkboxes */
  showSelection?: boolean;
  /** Selected appointment IDs */
  selectedIds: string[];
  /** Whether bulk actions are available */
  showBulkActions?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Appointment click handler */
  onAppointmentClick?: (appointment: Appointment) => void;
  /** Appointment edit handler */
  onAppointmentEdit?: (appointment: Appointment) => void;
  /** Appointment delete handler */
  onAppointmentDelete?: (appointmentId: string) => void;
  /** Appointment cancel handler */
  onAppointmentCancel?: (appointmentId: string) => void;
  /** Appointment reschedule handler */
  onAppointmentReschedule?: (appointment: Appointment) => void;
  /** Appointment check-in handler */
  onAppointmentCheckIn?: (appointmentId: string) => void;
  /** Appointment complete handler */
  onAppointmentComplete?: (appointmentId: string) => void;
  /** Appointment message handler */
  onAppointmentMessage?: (appointment: Appointment) => void;
  /** Join virtual appointment handler */
  onJoinVirtual?: (virtualLink: string) => void;
  /** Selection change handler */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Bulk action handler */
  onBulkAction?: (action: BulkAction, appointmentIds: string[]) => void;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Page size change handler */
  onPageSizeChange?: (pageSize: number) => void;
  /** Refresh handler */
  onRefresh?: () => void;
}

/**
 * AppointmentList Component
 * 
 * A comprehensive list component for displaying appointments with support for
 * different view modes, sorting, filtering, pagination, bulk operations, and
 * individual appointment actions. Includes loading states and accessibility features.
 * 
 * @param props - AppointmentList component props
 * @returns JSX element representing the appointment list
 */
const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  viewMode = 'list',
  sortBy,
  filters,
  pagination,
  isLoading = false,
  showSelection = false,
  selectedIds = [],
  showBulkActions = false,
  className = '',
  onAppointmentClick,
  onAppointmentEdit,
  onAppointmentDelete,
  onAppointmentCancel,
  onAppointmentReschedule,
  onAppointmentCheckIn,
  onAppointmentComplete,
  onAppointmentMessage,
  onJoinVirtual,
  onSelectionChange,
  onBulkAction,
  onPageChange,
  onPageSizeChange,
  onRefresh
}) => {
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  /**
   * Handles selection of individual appointment
   */
  const handleAppointmentSelect = (appointmentId: string, selected: boolean): void => {
    if (!onSelectionChange) return;

    const newSelectedIds = selected
      ? [...selectedIds, appointmentId]
      : selectedIds.filter(id => id !== appointmentId);
    
    onSelectionChange(newSelectedIds);
  };

  /**
   * Handles select all toggle
   */
  const handleSelectAll = (selected: boolean): void => {
    if (!onSelectionChange) return;

    const newSelectedIds = selected
      ? appointments.map(appointment => appointment.id)
      : [];
    
    onSelectionChange(newSelectedIds);
  };

  /**
   * Handles bulk action execution
   */
  const handleBulkAction = (action: BulkAction): void => {
    if (!onBulkAction || selectedIds.length === 0) return;
    
    onBulkAction(action, selectedIds);
    setShowBulkMenu(false);
  };

  /**
   * Handles page size change
   */
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newPageSize = parseInt(e.target.value);
    onPageSizeChange?.(newPageSize);
  };

  /**
   * Gets grid columns based on view mode
   */
  const getGridColumns = (): string => {
    switch (viewMode) {
      case 'grid':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 'calendar':
        return 'grid-cols-1';
      case 'timeline':
        return 'grid-cols-1';
      default:
        return 'grid-cols-1';
    }
  };

  /**
   * Renders pagination controls
   */
  const renderPagination = (): React.ReactNode => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, pagination.page - 2);
    const endPage = Math.min(pagination.totalPages, pagination.page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              value={pagination.pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
          
          <div className="text-sm text-gray-700">
            Showing {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.totalItems)} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center space-x-1">
            {startPage > 1 && (
              <>
                <button
                  onClick={() => onPageChange?.(1)}
                  className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 focus:outline-none
                           focus:ring-2 focus:ring-blue-500 rounded-md"
                  aria-label="Go to page 1"
                >
                  1
                </button>
                {startPage > 2 && <span className="text-gray-400">...</span>}
              </>
            )}

            {pages.map(page => (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={`
                  px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${page === pagination.page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                  }
                `}
                aria-label={`Go to page ${page}`}
                aria-current={page === pagination.page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}

            {endPage < pagination.totalPages && (
              <>
                {endPage < pagination.totalPages - 1 && <span className="text-gray-400">...</span>}
                <button
                  onClick={() => onPageChange?.(pagination.totalPages)}
                  className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 focus:outline-none
                           focus:ring-2 focus:ring-blue-500 rounded-md"
                  aria-label={`Go to page ${pagination.totalPages}`}
                >
                  {pagination.totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  /**
   * Renders bulk actions bar
   */
  const renderBulkActions = (): React.ReactNode => {
    if (!showBulkActions || selectedIds.length === 0) return null;

    return (
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.length} appointment{selectedIds.length === 1 ? '' : 's'} selected
            </span>
            
            <div className="relative">
              <button
                onClick={() => setShowBulkMenu(!showBulkMenu)}
                className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Bulk actions menu"
                aria-expanded={showBulkMenu}
                aria-haspopup="true"
              >
                Actions
                <MoreVertical size={16} className="ml-1 inline" aria-hidden="true" />
              </button>

              {showBulkMenu && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                  role="menu"
                  aria-label="Bulk actions"
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleBulkAction('confirm')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Confirm Appointments
                    </button>
                    <button
                      onClick={() => handleBulkAction('cancel')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Cancel Appointments
                    </button>
                    <button
                      onClick={() => handleBulkAction('reschedule')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Reschedule Appointments
                    </button>
                    <button
                      onClick={() => handleBulkAction('message')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Send Messages
                    </button>
                    <div className="border-t border-gray-200" role="separator" />
                    <button
                      onClick={() => handleBulkAction('export')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export Selected
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      role="menuitem"
                    >
                      Delete Appointments
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onSelectionChange?.([])}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            Clear selection
          </button>
        </div>
      </div>
    );
  };

  /**
   * Renders loading state
   */
  const renderLoading = (): React.ReactNode => (
    <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
      <div className="flex items-center space-x-2 text-gray-600">
        <RefreshCw className="animate-spin" size={20} aria-hidden="true" />
        <span>Loading appointments...</span>
      </div>
    </div>
  );

  /**
   * Renders empty state
   */
  const renderEmptyState = (): React.ReactNode => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Calendar size={48} className="text-gray-400 mb-4" aria-hidden="true" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
      <p className="text-gray-600 mb-4">
        {Object.keys(filters).some(key => {
          const value = filters[key as keyof AppointmentFilters];
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(v => {
              if (typeof v === 'boolean') return v;
              if (typeof v === 'string') return v !== '';
              return v !== undefined && v !== null;
            });
          }
          if (typeof value === 'boolean') return value;
          if (typeof value === 'string') return value !== '';
          return value !== undefined && value !== null;
        })
          ? 'No appointments match your current filters.'
          : 'Get started by creating your first appointment.'
        }
      </p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Refresh
        </button>
      )}
    </div>
  );

  const allSelected = appointments.length > 0 && selectedIds.length === appointments.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < appointments.length;

  if (isLoading) {
    return (
      <div className={`bg-white ${className}`}>
        {renderLoading()}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className={`bg-white ${className}`}>
        {renderEmptyState()}
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Selection Header */}
      {showSelection && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSelectAll(!allSelected)}
              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
              aria-label={`${allSelected ? 'Deselect' : 'Select'} all ${appointments.length} appointments`}
              aria-pressed={allSelected}
            >
              {allSelected ? (
                <CheckSquare size={16} className="text-blue-600" aria-hidden="true" />
              ) : someSelected ? (
                <div className="w-4 h-4 bg-blue-600 border border-blue-600 rounded flex items-center justify-center" aria-hidden="true">
                  <div className="w-2 h-2 bg-white rounded-sm" />
                </div>
              ) : (
                <Square size={16} aria-hidden="true" />
              )}
              <span>
                {allSelected ? 'Deselect all' : 'Select all'}
                {appointments.length > 0 && ` (${appointments.length})`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {renderBulkActions()}

      {/* Appointments Grid/List */}
      <div className={`p-6 grid gap-6 ${getGridColumns()}`}>
        {appointments.map((appointment) => (
          <div key={appointment.id} className="relative">
            {showSelection && (
              <div className="absolute top-4 left-4 z-10">
                <button
                  onClick={() => handleAppointmentSelect(
                    appointment.id,
                    !selectedIds.includes(appointment.id)
                  )}
                  className="p-1 bg-white rounded-md shadow-sm border border-gray-300
                           hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Select appointment with ${appointment.patient.name}`}
                  aria-pressed={selectedIds.includes(appointment.id)}
                >
                  {selectedIds.includes(appointment.id) ? (
                    <CheckSquare size={16} className="text-blue-600" aria-hidden="true" />
                  ) : (
                    <Square size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            )}

            <AppointmentCard
              appointment={appointment}
              compact={viewMode === 'grid'}
              showPatient={true}
              showProvider={true}
              showActions={true}
              className={`${showSelection ? 'ml-8' : ''} ${
                selectedIds.includes(appointment.id) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={onAppointmentClick}
              onEdit={onAppointmentEdit}
              onDelete={onAppointmentDelete}
              onCancel={onAppointmentCancel}
              onReschedule={onAppointmentReschedule}
              onCheckIn={onAppointmentCheckIn}
              onComplete={onAppointmentComplete}
              onMessage={onAppointmentMessage}
              onJoinVirtual={onJoinVirtual}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default AppointmentList;
