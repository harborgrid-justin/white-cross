'use client';

import React, { useMemo } from 'react';
import { Notification, NotificationGroup } from '../types/notification';
import { NotificationItem } from './NotificationItem';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

export interface NotificationListProps {
  notifications: Notification[];
  grouped?: boolean;
  onMarkAsRead?: (id: string) => void;
  onSnooze?: (id: string, until: Date) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onActionClick?: (notificationId: string, actionId: string) => void;
  emptyMessage?: string;
  compact?: boolean;
}

/**
 * NotificationList Component
 *
 * Displays a list of notifications with optional grouping
 */
export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  grouped = false,
  onMarkAsRead,
  onSnooze,
  onArchive,
  onDelete,
  onActionClick,
  emptyMessage = 'No notifications',
  compact = false,
}) => {
  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    if (!grouped) {
      return null;
    }

    const groups: Record<string, Notification[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    notifications.forEach((notification) => {
      const date = notification.createdAt;

      if (isToday(date)) {
        groups.today.push(notification);
      } else if (isYesterday(date)) {
        groups.yesterday.push(notification);
      } else if (isThisWeek(date)) {
        groups.thisWeek.push(notification);
      } else {
        groups.older.push(notification);
      }
    });

    return groups;
  }, [notifications, grouped]);

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔔</div>
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  if (grouped && groupedNotifications) {
    return (
      <div className="space-y-6">
        {groupedNotifications.today.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Today
            </h3>
            <div className="space-y-3">
              {groupedNotifications.today.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onSnooze={onSnooze}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  onActionClick={onActionClick}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        )}

        {groupedNotifications.yesterday.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Yesterday
            </h3>
            <div className="space-y-3">
              {groupedNotifications.yesterday.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onSnooze={onSnooze}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  onActionClick={onActionClick}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        )}

        {groupedNotifications.thisWeek.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              This Week
            </h3>
            <div className="space-y-3">
              {groupedNotifications.thisWeek.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onSnooze={onSnooze}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  onActionClick={onActionClick}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        )}

        {groupedNotifications.older.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Older
            </h3>
            <div className="space-y-3">
              {groupedNotifications.older.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onSnooze={onSnooze}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  onActionClick={onActionClick}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onSnooze={onSnooze}
          onArchive={onArchive}
          onDelete={onDelete}
          onActionClick={onActionClick}
          compact={compact}
        />
      ))}
    </div>
  );
};
