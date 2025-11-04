'use client';

import React, { useCallback } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { CommunicationRecord } from './types';
import { MessageViewer } from './MessageViewer';

/**
 * Props for the HistoryList component
 */
export interface HistoryListProps {
  /** Communications to display */
  communications: CommunicationRecord[];
  /** Set of selected record IDs */
  selectedRecords: Set<string>;
  /** Callback when a record is selected */
  onRecordSelect: (id: string, selected: boolean) => void;
  /** Callback when select all is toggled */
  onSelectAll: () => void;
  /** Callback when viewing a communication */
  onViewCommunication?: (record: CommunicationRecord) => void;
  /** Callback when opening a thread */
  onOpenThread?: (threadId: string) => void;
  /** Callback when resending a communication */
  onResendCommunication?: (recordId: string) => void;
  /** Whether to show filters hint in empty state */
  hasActiveFilters?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * HistoryList component for displaying list of communication records
 *
 * Features:
 * - Displays list of communication records with MessageViewer
 * - Select all functionality
 * - Empty state handling with contextual messages
 * - Dividers between records
 * - Handles all user interactions
 *
 * @component
 * @example
 * ```tsx
 * <HistoryList
 *   communications={filteredCommunications}
 *   selectedRecords={selectedRecords}
 *   onRecordSelect={handleRecordSelect}
 *   onSelectAll={handleSelectAll}
 *   onViewCommunication={handleView}
 *   onOpenThread={handleOpenThread}
 *   onResendCommunication={handleResend}
 *   hasActiveFilters={hasFilters}
 * />
 * ```
 */
export const HistoryList: React.FC<HistoryListProps> = ({
  communications,
  selectedRecords,
  onRecordSelect,
  onSelectAll,
  onViewCommunication,
  onOpenThread,
  onResendCommunication,
  hasActiveFilters = false,
  className = ''
}) => {
  const isAllSelected = communications.length > 0 && selectedRecords.size === communications.length;

  const handleViewCommunication = useCallback((record: CommunicationRecord) => {
    onViewCommunication?.(record);
  }, [onViewCommunication]);

  const handleOpenThread = useCallback((threadId: string) => {
    onOpenThread?.(threadId);
  }, [onOpenThread]);

  const handleResendCommunication = useCallback((recordId: string) => {
    onResendCommunication?.(recordId);
  }, [onResendCommunication]);

  if (communications.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="text-center py-12">
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No communications found</h3>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters
              ? 'Try adjusting your filters to see more communications.'
              : 'Communications will appear here once they are sent.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="divide-y divide-gray-200">
        {/* Select All Header */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                aria-label="Select all communications"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Select All ({communications.length})
              </span>
            </label>
            <div className="text-sm text-gray-500">
              {selectedRecords.size > 0 && `${selectedRecords.size} selected`}
            </div>
          </div>
        </div>

        {/* Communication Records */}
        {communications.map((record) => (
          <MessageViewer
            key={record.id}
            record={record}
            isSelected={selectedRecords.has(record.id)}
            onSelect={onRecordSelect}
            onView={handleViewCommunication}
            onOpenThread={handleOpenThread}
            onResend={handleResendCommunication}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
