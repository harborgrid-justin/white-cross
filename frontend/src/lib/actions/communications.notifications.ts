/**
 * @fileoverview Communications Notifications - Next.js v14+ Compatible
 *
 * Notification-related server actions for communications module.
 * Handles notifications, preferences, and notification management.
 */

'use server';

import { fetchApi } from './communications.utils';
import type { ActionResult } from './communications.types';
import {
  NotificationFilterSchema,
  MarkNotificationAsReadSchema,
  ArchiveNotificationSchema,
  DeleteNotificationSchema,
  type Notification,
  type NotificationFilter,
  type NotificationPreferences,
  type NotificationCount
} from '@/lib/validations/notification.schemas';

// ============================================================================
// NOTIFICATION ACTIONS
// ============================================================================

/**
 * Get notifications with filtering and pagination
 */
export async function getNotifications(
  filter?: NotificationFilter
): Promise<ActionResult<{ notifications: Notification[]; total: number }>> {
  try {
    const validatedFilter = filter ? NotificationFilterSchema.parse(filter) : {};

    const response = await fetchApi<{ notifications: Notification[]; total: number }>(
      '/communications/notifications',
      {
        method: 'GET',
        params: validatedFilter
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch notifications'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch notifications'
    };
  }
}

/**
 * Get notification count
 */
export async function getNotificationCount(): Promise<ActionResult<NotificationCount>> {
  try {
    const response = await fetchApi<NotificationCount>(
      '/communications/notifications/count',
      { method: 'GET' }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch notification count'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching notification count:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch notification count'
    };
  }
}

/**
 * Mark notifications as read
 */
export async function markNotificationsAsRead(
  notificationIds: string[]
): Promise<ActionResult<void>> {
  try {
    const validatedData = MarkNotificationAsReadSchema.parse({ notificationIds });

    const response = await fetchApi(
      '/communications/notifications/read',
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to mark notifications as read'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark notifications as read'
    };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<ActionResult<void>> {
  try {
    const response = await fetchApi(
      '/communications/notifications/read-all',
      { method: 'POST' }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to mark all notifications as read'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
    };
  }
}

/**
 * Archive notifications
 */
export async function archiveNotifications(
  notificationIds: string[]
): Promise<ActionResult<void>> {
  try {
    const validatedData = ArchiveNotificationSchema.parse({ notificationIds });

    const response = await fetchApi(
      '/communications/notifications/archive',
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to archive notifications'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error archiving notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to archive notifications'
    };
  }
}

/**
 * Delete notifications
 */
export async function deleteNotifications(
  notificationIds: string[]
): Promise<ActionResult<void>> {
  try {
    const validatedData = DeleteNotificationSchema.parse({ notificationIds });

    const response = await fetchApi(
      '/communications/notifications',
      {
        method: 'DELETE',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to delete notifications'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete notifications'
    };
  }
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences(): Promise<ActionResult<NotificationPreferences>> {
  try {
    const response = await fetchApi<NotificationPreferences>(
      '/communications/notifications/preferences',
      { method: 'GET' }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch notification preferences'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch notification preferences'
    };
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<ActionResult<NotificationPreferences>> {
  try {
    const response = await fetchApi<NotificationPreferences>(
      '/communications/notifications/preferences',
      {
        method: 'PUT',
        body: preferences
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to update notification preferences'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update notification preferences'
    };
  }
}
