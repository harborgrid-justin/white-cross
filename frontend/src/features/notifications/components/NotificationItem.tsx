'use client';

import React, { useState } from 'react';
import { Notification, NotificationPriority, NotificationStatus } from '../types/notification';
import { formatDistanceToNow } from 'date-fns';

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onSnooze?: (id: string, until: Date) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onActionClick?: (notificationId: string, actionId: string) => void;
  compact?: boolean;
}

/**
 * NotificationItem Component
 *
 * Displays a single notification with actions
 */
export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onSnooze,
  onArchive,
  onDelete,
  onActionClick,
  compact = false,
}) => {
  const [showActions, setShowActions] = useState(false);
  const isUnread = notification.status !== NotificationStatus.READ;

  const priorityColors: Record<NotificationPriority, string> = {
    [NotificationPriority.LOW]: 'border-l-gray-400',
    [NotificationPriority.MEDIUM]: 'border-l-blue-500',
    [NotificationPriority.HIGH]: 'border-l-yellow-500',
    [NotificationPriority.URGENT]: 'border-l-orange-500',
    [NotificationPriority.EMERGENCY]: 'border-l-red-600',
  };

  const priorityIcons: Record<NotificationPriority, string> = {
    [NotificationPriority.LOW]: '📌',
    [NotificationPriority.MEDIUM]: 'ℹ️',
    [NotificationPriority.HIGH]: '⚠️',
    [NotificationPriority.URGENT]: '🔴',
    [NotificationPriority.EMERGENCY]: '🚨',
  };

  const handleSnooze = () => {
    // Snooze for 1 hour by default
    const snoozeUntil = new Date(Date.now() + 60 * 60 * 1000);
    onSnooze?.(notification.id, snoozeUntil);
  };

  return (
    <div
      className={`
        relative border-l-4 bg-white rounded-lg shadow-sm
        hover:shadow-md transition-shadow
        ${priorityColors[notification.priority]}
        ${isUnread ? 'bg-blue-50' : ''}
        ${compact ? 'p-3' : 'p-4'}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Unread indicator */}
      {isUnread && (
        <div className="absolute top-4 right-4">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        </div>
      )}

      <div className="flex items-start space-x-3">
        {/* Priority icon */}
        <div className="flex-shrink-0 text-2xl" aria-label={`Priority: ${notification.priority}`}>
          {priorityIcons[notification.priority]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`text-sm font-semibold text-gray-900 ${
                  isUnread ? 'font-bold' : ''
                }`}
              >
                {notification.title}
              </h3>
              {!compact && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {notification.message}
                </p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
            <span>{formatDistanceToNow(notification.createdAt, { addSuffix: true })}</span>
            {notification.type && (
              <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                {notification.type.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          {/* Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {notification.actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => onActionClick?.(notification.id, action.id)}
                  className={`
                    px-3 py-1 text-xs font-medium rounded-md
                    transition-colors
                    ${
                      action.variant === 'danger'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : action.variant === 'primary'
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {action.icon && <span className="mr-1">{action.icon}</span>}
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Quick actions */}
          {showActions && (
            <div className="mt-3 flex items-center space-x-2 text-xs">
              {isUnread && onMarkAsRead && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark as read
                </button>
              )}
              {onSnooze && (
                <button
                  onClick={handleSnooze}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Snooze
                </button>
              )}
              {onArchive && (
                <button
                  onClick={() => onArchive(notification.id)}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Archive
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(notification.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
