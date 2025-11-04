/**
 * @fileoverview Notification Cache Functions
 * @module app/notifications/cache
 *
 * Cached data retrieval functions for notifications using Next.js cache integration.
 * Includes cache tags, TTL configurations, and memoized getter functions.
 */

'use server';

import { cache } from 'react';
import { serverGet } from '@/lib/api/nextjs-client';
import { CACHE_TTL } from '@/lib/cache/constants';
import type { ApiResponse } from '@/types/api';
import type {
  Notification,
  NotificationFilters,
  NotificationPreferences,
  NotificationTemplate,
  NotificationAnalytics,
} from './notifications.types';

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Custom cache tags for notifications
 * Used for targeted cache invalidation
 */
export const NOTIFICATION_CACHE_TAGS = {
  NOTIFICATIONS: 'notifications',
  PREFERENCES: 'notification-preferences',
  TEMPLATES: 'notification-templates',
  SUBSCRIPTIONS: 'notification-subscriptions',
  CHANNELS: 'notification-channels',
} as const;

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get notification by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getNotification = cache(async (id: string): Promise<Notification | null> => {
  try {
    const response = await serverGet<ApiResponse<Notification>>(
      `/api/notifications/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`notification-${id}`, NOTIFICATION_CACHE_TAGS.NOTIFICATIONS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get notification:', error);
    return null;
  }
});

/**
 * Get all notifications with caching
 * Supports optional filtering
 */
export const getNotifications = cache(async (filters?: NotificationFilters): Promise<Notification[]> => {
  try {
    const response = await serverGet<ApiResponse<Notification[]>>(
      `/api/notifications`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [NOTIFICATION_CACHE_TAGS.NOTIFICATIONS, 'notification-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return [];
  }
});

/**
 * Get user notification preferences with caching
 */
export const getNotificationPreferences = cache(async (userId: string): Promise<NotificationPreferences | null> => {
  try {
    const response = await serverGet<ApiResponse<NotificationPreferences>>(
      `/api/users/${userId}/notification-preferences`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`notification-preferences-${userId}`, NOTIFICATION_CACHE_TAGS.PREFERENCES]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get notification preferences:', error);
    return null;
  }
});

/**
 * Get notification templates with caching
 */
export const getNotificationTemplates = cache(async (): Promise<NotificationTemplate[]> => {
  try {
    const response = await serverGet<ApiResponse<NotificationTemplate[]>>(
      `/api/notifications/templates`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [NOTIFICATION_CACHE_TAGS.TEMPLATES, 'notification-template-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get notification templates:', error);
    return [];
  }
});

/**
 * Get notification analytics with caching
 */
export const getNotificationAnalytics = cache(async (filters?: Record<string, unknown>): Promise<NotificationAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<NotificationAnalytics>>(
      `/api/notifications/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: ['notification-analytics', 'notification-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get notification analytics:', error);
    return null;
  }
});
