/**
 * @fileoverview Reminder Utilities - Next.js v14+ Compatible
 *
 * Utility functions and helper methods for reminder management.
 */

import { cache } from 'react';
import { getReminders } from './reminders.cache';
import { ReminderFilters } from './reminders.types';

/**
 * Check if reminder exists
 */
export async function reminderExists(reminderId: string): Promise<boolean> {
  const reminder = await getReminders().then(reminders =>
    reminders.find(r => r.id === reminderId)
  );
  return reminder !== undefined;
}

/**
 * Get reminder count
 */
export const getReminderCount = cache(async (filters?: ReminderFilters): Promise<number> => {
  try {
    const reminders = await getReminders(filters);
    return reminders.length;
  } catch {
    return 0;
  }
});

/**
 * Get reminder overview
 */
export async function getReminderOverview(userId?: string): Promise<{
  totalReminders: number;
  activeReminders: number;
  overdueReminders: number;
  completedToday: number;
  upcomingReminders: number;
}> {
  try {
    const filters: ReminderFilters = {};
    if (userId) filters.assignedTo = userId;

    const reminders = await getReminders(filters);
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    return {
      totalReminders: reminders.length,
      activeReminders: reminders.filter(r => r.status === 'active').length,
      overdueReminders: reminders.filter(r => r.status === 'overdue').length,
      completedToday: reminders.filter(r =>
        r.status === 'completed' &&
        r.completedAt?.startsWith(today)
      ).length,
      upcomingReminders: reminders.filter(r => {
        const dueDate = new Date(r.dueDate);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return r.status === 'active' && dueDate <= tomorrow;
      }).length,
    };
  } catch {
    return {
      totalReminders: 0,
      activeReminders: 0,
      overdueReminders: 0,
      completedToday: 0,
      upcomingReminders: 0,
    };
  }
}