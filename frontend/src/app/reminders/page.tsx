'use client';

import React, { useState } from 'react';
import { useReminders, useReminderStats, useUpcomingReminders, useOverdueReminders } from '@/features/notifications/hooks';
import { ReminderList } from '@/features/notifications/components';
import { ReminderStatus, ReminderType } from '@/features/notifications/types';
import Link from 'next/link';

/**
 * Reminders Page
 *
 * Comprehensive reminder management with filtering and statistics
 */
export default function RemindersPage() {
  // TODO: Get userId from auth context
  const userId = 'current-user-id';

  const [view, setView] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');

  const { reminders, isLoading, complete, pause, resume, snooze, delete: deleteReminder } =
    useReminders(userId);

  const { stats } = useReminderStats(userId);
  const { reminders: upcomingReminders } = useUpcomingReminders(userId, 24);
  const { reminders: overdueReminders } = useOverdueReminders(userId);

  const getFilteredReminders = () => {
    switch (view) {
      case 'upcoming':
        return upcomingReminders;
      case 'overdue':
        return overdueReminders;
      case 'completed':
        return reminders.filter((r) => r.status === ReminderStatus.COMPLETED);
      default:
        return reminders;
    }
  };

  const filteredReminders = getFilteredReminders();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
            <p className="mt-2 text-gray-600">
              Manage and schedule your reminders
            </p>
          </div>
          <Link
            href="/reminders/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create reminder
          </Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Active</div>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Upcoming</div>
              <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Overdue</div>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* View selector sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Views</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setView('all')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    view === 'all'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All reminders
                </button>
                <button
                  onClick={() => setView('upcoming')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${
                    view === 'upcoming'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Upcoming (24h)
                  {stats && stats.upcoming > 0 && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                      {stats.upcoming}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setView('overdue')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${
                    view === 'overdue'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Overdue
                  {stats && stats.overdue > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {stats.overdue}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setView('completed')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    view === 'completed'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          {/* Reminders list */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading reminders...</p>
                </div>
              ) : (
                <ReminderList
                  reminders={filteredReminders}
                  onComplete={complete}
                  onSnooze={snooze}
                  onPause={pause}
                  onResume={resume}
                  onDelete={deleteReminder}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
