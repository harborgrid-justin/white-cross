'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/features/notifications/hooks';
import { NotificationList } from '@/features/notifications/components';
import { NotificationFilters, NotificationStatus } from '@/features/notifications/types';
import { startOfWeek, startOfMonth, subMonths } from 'date-fns';

/**
 * Notification History Page
 *
 * View archived and historical notifications
 */
export default function NotificationHistoryPage() {
  // TODO: Get userId from auth context
  const userId = 'current-user-id';

  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('month');

  const filters: NotificationFilters = {
    statuses: [NotificationStatus.READ, NotificationStatus.ARCHIVED],
    ...(dateRange === 'week' && { startDate: startOfWeek(new Date()) }),
    ...(dateRange === 'month' && { startDate: startOfMonth(new Date()) }),
  };

  const { notifications, isLoading, markAsRead, snooze, archive, delete: deleteNotification } =
    useNotifications(userId, filters);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notification History</h1>
          <p className="mt-2 text-gray-600">
            View your past notifications and archived items
          </p>
        </div>

        {/* Date range selector */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg shadow-sm" role="group">
            <button
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                dateRange === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              This week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 text-sm font-medium ${
                dateRange === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              This month
            </button>
            <button
              onClick={() => setDateRange('all')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                dateRange === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All time
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading history...</p>
            </div>
          ) : (
            <NotificationList
              notifications={notifications}
              grouped
              onMarkAsRead={markAsRead}
              onSnooze={snooze}
              onArchive={archive}
              onDelete={deleteNotification}
            />
          )}
        </div>
      </div>
    </div>
  );
}
