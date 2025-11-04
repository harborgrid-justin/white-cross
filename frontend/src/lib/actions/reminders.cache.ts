/**
 * @fileoverview Reminder Cache Functions - Next.js v14+ Compatible
 *
 * Cached data functions for reminder management using Next.js cache().
 */

import { cache } from 'react';

// Core API integrations
import { serverGet } from '@/lib/api/nextjs-client';
import { CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/core/api/responses';
import {
  Reminder,
  ReminderTemplate,
  ReminderAnalytics,
  ReminderFilters,
  REMINDER_CACHE_TAGS
} from './reminders.types';

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get reminder by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getReminder = cache(async (id: string): Promise<Reminder | null> => {
  try {
    const response = await serverGet<ApiResponse<Reminder>>(
      `/api/reminders/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`reminder-${id}`, REMINDER_CACHE_TAGS.REMINDERS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get reminder:', error);
    return null;
  }
});

/**
 * Get all reminders with caching
 */
export const getReminders = cache(async (filters?: ReminderFilters): Promise<Reminder[]> => {
  try {
    const response = await serverGet<ApiResponse<Reminder[]>>(
      `/api/reminders`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [REMINDER_CACHE_TAGS.REMINDERS, 'reminder-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get reminders:', error);
    return [];
  }
});

/**
 * Get reminder templates with caching
 */
export const getReminderTemplates = cache(async (): Promise<ReminderTemplate[]> => {
  try {
    const response = await serverGet<ApiResponse<ReminderTemplate[]>>(
      `/api/reminders/templates`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [REMINDER_CACHE_TAGS.TEMPLATES, 'reminder-template-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get reminder templates:', error);
    return [];
  }
});

/**
 * Get reminder analytics with caching
 */
export const getReminderAnalytics = cache(async (filters?: Record<string, unknown>): Promise<ReminderAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<ReminderAnalytics>>(
      `/api/reminders/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: ['reminder-analytics', 'reminder-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get reminder analytics:', error);
    return null;
  }
});

/**
 * Get overdue reminders with caching
 */
export const getOverdueReminders = cache(async (userId?: string): Promise<Reminder[]> => {
  try {
    const filters: ReminderFilters = { overdue: true };
    if (userId) filters.assignedTo = userId;

    const response = await serverGet<ApiResponse<Reminder[]>>(
      `/api/reminders/overdue`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.REALTIME,
          tags: ['overdue-reminders', REMINDER_CACHE_TAGS.REMINDERS]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get overdue reminders:', error);
    return [];
  }
});