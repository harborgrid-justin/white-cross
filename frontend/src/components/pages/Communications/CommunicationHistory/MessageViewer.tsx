'use client';

import React from 'react';
import {
  UserIcon,
  ClockIcon,
  EyeIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import type { CommunicationRecord } from './types';
import { getTypeIcon, getStatusBadge, getPriorityBadge, formatFileSize } from './utils';

/**
 * Props for the MessageViewer component
 */
export interface MessageViewerProps {
  /** Communication record to display */
  record: CommunicationRecord;
  /** Whether this record is selected */
  isSelected: boolean;
  /** Callback when selection changes */
  onSelect: (id: string, selected: boolean) => void;
  /** Callback when viewing the communication */
  onView: (record: CommunicationRecord) => void;
  /** Callback when opening a thread */
  onOpenThread?: (threadId: string) => void;
  /** Callback when resending a communication */
  onResend?: (recordId: string) => void;
}

/**
 * MessageViewer component for displaying individual communication records
 *
 * Features:
 * - Displays communication content preview
 * - Shows sender and recipient information
 * - Displays status and priority badges
 * - Shows attachments
 * - Action buttons for view, thread, resend
 * - Checkbox selection
 * - Memoized for performance
 *
 * @component
 * @example
 * ```tsx
 * <MessageViewer
 *   record={communicationRecord}
 *   isSelected={isSelected}
 *   onSelect={handleSelect}
 *   onView={handleView}
 *   onOpenThread={handleOpenThread}
 *   onResend={handleResend}
 * />
 * ```
 */
export const MessageViewer: React.FC<MessageViewerProps> = React.memo(({
  record,
  isSelected,
  onSelect,
  onView,
  onOpenThread,
  onResend
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(record.id, e.target.checked);
  };

  const handleView = () => {
    onView(record);
  };

  const handleOpenThread = () => {
    if (record.thread_id && onOpenThread) {
      onOpenThread(record.thread_id);
    }
  };

  const handleResend = () => {
    if (onResend) {
      onResend(record.id);
    }
  };

  return (
    <div className="px-6 py-4 hover:bg-gray-50">
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          aria-label={`Select communication ${record.id}`}
        />

        {/* Communication Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                {getTypeIcon(record.type)}
                {record.subject ? (
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {record.subject}
                  </h3>
                ) : (
                  <h3 className="text-lg font-medium text-gray-900">
                    {record.type.charAt(0).toUpperCase() + record.type.slice(1)} Communication
                  </h3>
                )}
              </div>
              {getStatusBadge(record.status)}
              {getPriorityBadge(record.priority)}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleView}
                className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label={`View communication ${record.id}`}
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                View
              </button>
              {record.thread_id && onOpenThread && (
                <button
                  onClick={handleOpenThread}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label={`Open thread for communication ${record.id}`}
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                  Thread
                </button>
              )}
              {record.status === 'failed' && onResend && (
                <button
                  onClick={handleResend}
                  className="inline-flex items-center px-3 py-1 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  aria-label={`Resend communication ${record.id}`}
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Resend
                </button>
              )}
            </div>
          </div>

          {/* Communication Preview */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {record.content}
          </p>

          {/* Recipients */}
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <UserIcon className="h-4 w-4" />
              <span>From: {record.sender.name} ({record.sender.role})</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>To: {record.recipients.map(r => r.name).join(', ')}</span>
            </div>
            {record.metadata.student_name && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Student: {record.metadata.student_name}</span>
              </div>
            )}
          </div>

          {/* Attachments */}
          {record.attachments && record.attachments.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {record.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                  >
                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {attachment.name} ({formatFileSize(attachment.size)})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-3 w-3" />
                <span>{new Date(record.created_at).toLocaleString()}</span>
              </div>
              {record.metadata.read_at && (
                <div className="flex items-center space-x-1">
                  <EyeIcon className="h-3 w-3" />
                  <span>Read: {new Date(record.metadata.read_at).toLocaleString()}</span>
                </div>
              )}
              {record.metadata.delivery_attempts && record.metadata.delivery_attempts > 1 && (
                <div className="flex items-center space-x-1">
                  <ArrowPathIcon className="h-3 w-3" />
                  <span>{record.metadata.delivery_attempts} attempts</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MessageViewer.displayName = 'MessageViewer';

export default MessageViewer;
