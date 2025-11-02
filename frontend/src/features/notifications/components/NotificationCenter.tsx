'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications, useUnreadCount } from '../hooks';
import { NotificationList } from './NotificationList';
import { NotificationBadge } from './NotificationBadge';
import { NotificationFilters, NotificationType, NotificationPriority } from '../types/notification';

export interface NotificationCenterProps {
  userId: string;
  onNotificationClick?: (id: string) => void;
}

/**
 * NotificationCenter Component
 *
 * Dropdown notification center component for header
 */
export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userId,
  onNotificationClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { count: unreadCount } = useUnreadCount(userId);

  const [filters, setFilters] = useState<NotificationFilters>({});

  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    snooze,
    archive,
    delete: deleteNotification,
  } = useNotifications(userId, filters);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter(n => n.status !== 'read')
    : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell icon trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="notification-dropdown"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1">
            <NotificationBadge count={unreadCount} size="sm" />
          </div>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          id="notification-dropdown"
          role="dialog"
          aria-label="Notifications panel"
          className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1" role="tablist" aria-label="Notification filters">
              <button
                role="tab"
                aria-selected={activeTab === 'all'}
                aria-controls="notifications-panel"
                onClick={() => setActiveTab('all')}
                className={`
                  flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                  ${activeTab === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                All
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'unread'}
                aria-controls="notifications-panel"
                onClick={() => setActiveTab('unread')}
                className={`
                  flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                  ${activeTab === 'unread'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {/* Notifications list */}
          <div
            id="notifications-panel"
            role="tabpanel"
            aria-label={`${activeTab === 'all' ? 'All' : 'Unread'} notifications`}
            className="max-h-96 overflow-y-auto p-4"
          >
            {isLoading ? (
              <div className="text-center py-8" role="status" aria-live="polite">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" aria-hidden="true"></div>
                <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : (
              <NotificationList
                notifications={filteredNotifications}
                onMarkAsRead={markAsRead}
                onSnooze={snooze}
                onArchive={archive}
                onDelete={deleteNotification}
                compact
              />
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 text-center">
            <a
              href="/notifications"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all notifications →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
