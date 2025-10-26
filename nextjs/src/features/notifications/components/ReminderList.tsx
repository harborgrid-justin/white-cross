'use client';

import React from 'react';
import { Reminder, ReminderStatus } from '../types/reminder';
import { formatDistanceToNow, format } from 'date-fns';

export interface ReminderListProps {
  reminders: Reminder[];
  onComplete?: (id: string) => void;
  onSnooze?: (id: string, until: Date) => void;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * ReminderList Component
 *
 * Displays list of reminders with actions
 */
export const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onComplete,
  onSnooze,
  onPause,
  onResume,
  onDelete,
}) => {
  if (reminders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⏰</div>
        <p className="text-gray-500 text-sm">No reminders</p>
      </div>
    );
  }

  const statusColors = {
    [ReminderStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [ReminderStatus.PAUSED]: 'bg-yellow-100 text-yellow-800',
    [ReminderStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
    [ReminderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [ReminderStatus.EXPIRED]: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <div
          key={reminder.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-900">{reminder.title}</h3>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[reminder.status]}`}>
                  {reminder.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{reminder.message}</p>

              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <span>📅 {format(reminder.scheduledAt, 'MMM d, yyyy h:mm a')}</span>
                {reminder.recurrence && (
                  <span>🔁 {reminder.recurrence.frequency}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="ml-4 flex items-center space-x-2">
              {reminder.status === ReminderStatus.ACTIVE && (
                <>
                  <button
                    onClick={() => onComplete?.(reminder.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                    title="Complete"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => onPause?.(reminder.id)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-md"
                    title="Pause"
                  >
                    ⏸
                  </button>
                </>
              )}
              {reminder.status === ReminderStatus.PAUSED && (
                <button
                  onClick={() => onResume?.(reminder.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  title="Resume"
                >
                  ▶
                </button>
              )}
              <button
                onClick={() => onDelete?.(reminder.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
