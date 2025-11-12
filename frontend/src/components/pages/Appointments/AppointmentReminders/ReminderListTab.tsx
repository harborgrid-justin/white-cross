'use client';

import React from 'react';
import { Search, Eye, RotateCcw, X } from 'lucide-react';
import type { AppointmentReminder, ReminderType, ReminderStatus } from './types';
import { getReminderTypeInfo, getStatusColor } from './utils';

/**
 * Props for the ReminderListTab component
 *
 * @interface ReminderListTabProps
 */
export interface ReminderListTabProps {
  /** Filtered reminders to display */
  reminders: AppointmentReminder[];
  /** Current search query */
  searchQuery: string;
  /** Handler for search query changes */
  onSearchChange: (query: string) => void;
  /** Currently selected reminder type filter */
  selectedType: ReminderType | 'all';
  /** Handler for type filter changes */
  onTypeChange: (type: ReminderType | 'all') => void;
  /** Currently selected status filter */
  selectedStatus: ReminderStatus | 'all';
  /** Handler for status filter changes */
  onStatusChange: (status: ReminderStatus | 'all') => void;
  /** Whether user can send manual reminders (for retry action) */
  canSendManual: boolean;
  /** Handler for viewing reminder details */
  onView: (reminder: AppointmentReminder) => void;
  /** Handler for retrying failed reminders */
  onRetry?: (reminderId: string) => void;
  /** Handler for canceling scheduled reminders */
  onCancel?: (reminderId: string) => void;
}

/**
 * ReminderListTab Component
 *
 * Displays a searchable and filterable list of reminders with actions for
 * viewing, retrying failed reminders, and canceling scheduled ones.
 *
 * @param {ReminderListTabProps} props - Component props
 * @returns {JSX.Element} Reminder list tab content
 *
 * @example
 * <ReminderListTab
 *   reminders={filteredReminders}
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   selectedType={selectedType}
 *   onTypeChange={setSelectedType}
 *   selectedStatus={selectedStatus}
 *   onStatusChange={setSelectedStatus}
 *   canSendManual={true}
 *   onView={handleViewReminder}
 *   onRetry={handleRetryReminder}
 *   onCancel={handleCancelReminder}
 * />
 */
const ReminderListTab: React.FC<ReminderListTabProps> = ({
  reminders,
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  canSendManual,
  onView,
  onRetry,
  onCancel
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reminders..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md
                         focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-label="Search reminders"
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onTypeChange(e.target.value as ReminderType | 'all')
            }
            className="px-3 py-2 border border-gray-300 rounded-md
                     focus:ring-blue-500 focus:border-blue-500 transition-colors"
            aria-label="Filter by reminder type"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="phone">Phone</option>
            <option value="push">Push</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onStatusChange(e.target.value as ReminderStatus | 'all')
            }
            className="px-3 py-2 border border-gray-300 rounded-md
                     focus:ring-blue-500 focus:border-blue-500 transition-colors"
            aria-label="Filter by reminder status"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          {reminders.length > 0 ? (
            <div className="space-y-4">
              {reminders.map((reminder) => {
                const typeInfo = getReminderTypeInfo(reminder.type);
                const IconComponent = typeInfo.icon;

                return (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg
                             hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className={`p-2 rounded-full ${typeInfo.bg} flex-shrink-0`}>
                        <IconComponent className={`w-4 h-4 ${typeInfo.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-900 truncate">{reminder.recipient}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reminder.status)} flex-shrink-0`}>
                            {reminder.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {reminder.message.substring(0, 100)}
                          {reminder.message.length > 100 ? '...' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Scheduled: {reminder.scheduledTime.toLocaleString()}
                          {reminder.sentTime && ` • Sent: ${reminder.sentTime.toLocaleString()}`}
                        </p>
                        {reminder.errorMessage && (
                          <p className="text-xs text-red-600 mt-1">
                            Error: {reminder.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                      {reminder.status === 'failed' && canSendManual && onRetry && (
                        <button
                          onClick={() => onRetry(reminder.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Retry sending"
                          aria-label="Retry sending reminder"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                      {reminder.status === 'scheduled' && onCancel && (
                        <button
                          onClick={() => onCancel(reminder.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Cancel reminder"
                          aria-label="Cancel scheduled reminder"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => onView(reminder)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="View details"
                        aria-label="View reminder details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium mb-2">No reminders found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderListTab;
