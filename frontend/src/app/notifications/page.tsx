'use client';

import React, { useState } from 'react';
import { useNotifications, useNotificationStats } from '@/features/notifications/hooks';
import {
  NotificationList,
  NotificationBadge,
} from '@/features/notifications/components';
import {
  NotificationFilters,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
} from '@/features/notifications/types';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Notifications Page
 *
 * Comprehensive notification center with filtering and management
 */
export default function NotificationsPage() {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [filters, setFilters] = useState<NotificationFilters>({});
  const [view, setView] = useState<'all' | 'unread' | 'archived'>('all');

  const { notifications, isLoading, markAsRead, markAllAsRead, snooze, archive, delete: deleteNotification } =
    useNotifications(userId, filters);

  const { stats } = useNotificationStats(userId);

  const filteredNotifications = notifications.filter((n) => {
    if (view === 'unread') return n.status !== NotificationStatus.READ;
    if (view === 'archived') return n.status === NotificationStatus.ARCHIVED;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">
            Manage and view all your notifications in one place
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Unread</div>
              <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">High Priority</div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.byPriority.high || 0}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Urgent</div>
              <div className="text-2xl font-bold text-red-600">
                {stats.byPriority.urgent || 0}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              {/* View filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">View</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setView('all')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      view === 'all'
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setView('unread')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${
                      view === 'unread'
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Unread
                    {stats && stats.unread > 0 && (
                      <NotificationBadge count={stats.unread} size="sm" />
                    )}
                  </button>
                  <button
                    onClick={() => setView('archived')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      view === 'archived'
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Archived
                  </button>
                </div>
              </div>

              {/* Priority filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
                <div className="space-y-2">
                  {Object.values(NotificationPriority).map((priority) => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.priorities?.includes(priority)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const priorities = filters.priorities || [];
                          setFilters({
                            ...filters,
                            priorities: e.target.checked
                              ? [...priorities, priority]
                              : priorities.filter((p) => p !== priority),
                          });
                        }}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {priority}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => void markAllAsRead()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          </div>

          {/* Notifications list */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading notifications...</p>
                </div>
              ) : (
                <NotificationList
                  notifications={filteredNotifications}
                  grouped
                  onMarkAsRead={markAsRead}
                  onSnooze={(id: string, until: Date) => snooze({ id, snoozedUntil: until })}
                  onArchive={archive}
                  onDelete={deleteNotification}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
