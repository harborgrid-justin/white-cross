/**
 * @fileoverview Communications Notifications - Next.js v14+ Compatible
 *
 * Notification-related server actions for communications module.
 * Handles notifications, preferences, and notification management.
 */

'use server';

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api/server';
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

    const response = await serverGet<{ notifications: Notification[]; total: number }>(
      '/communications/notifications',
      validatedFilter as Record<string, string | number | boolean>
    );

    return {
      success: true,
      data: response
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
    const response = await serverGet<NotificationCount>(
      '/communications/notifications/count'
    );

    return {
      success: true,
      data: response
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

    await serverPost(
      '/communications/notifications/read',
      validatedData
    );

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
    await serverPost(
      '/communications/notifications/read-all'
    );

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

    await serverPost(
      '/communications/notifications/archive',
      validatedData
    );

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

    await serverDelete(
      '/communications/notifications',
      validatedData
    );

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
    const response = await serverGet<NotificationPreferences>(
      '/communications/notifications/preferences'
    );

    return {
      success: true,
      data: response
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
    const response = await serverPut<NotificationPreferences>(
      '/communications/notifications/preferences',
      preferences
    );

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update notification preferences'
    };
  }
}
