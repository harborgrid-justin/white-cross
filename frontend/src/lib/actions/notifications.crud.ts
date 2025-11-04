/**
 * @fileoverview Notification CRUD Operations
 * @module app/notifications/crud
 *
 * Core create, read, update operations for notifications.
 * Includes audit logging and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, serverPut, NextApiClientError, type ApiResponse } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { NOTIFICATION_CACHE_TAGS } from './notifications.cache';
import type {
  ActionResult,
  Notification,
  CreateNotificationData,
  UpdateNotificationData,
} from './notifications.types';

// ==========================================
// NOTIFICATION CRUD OPERATIONS
// ==========================================

/**
 * Create a new notification
 * Includes audit logging and cache invalidation
 */
export async function createNotificationAction(data: CreateNotificationData): Promise<ActionResult<Notification>> {
  try {
    // Validate required fields
    if (!data.title || !data.message) {
      return {
        success: false,
        error: 'Missing required fields: title, message'
      };
    }

    const response = await serverPost<ApiResponse<Notification>>(
      `/api/notifications`,
      data,
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.NOTIFICATIONS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create notification');
    }

    // AUDIT LOG - Notification creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Notification',
      resourceId: response.data.id,
      details: `Created notification: ${data.title}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(NOTIFICATION_CACHE_TAGS.NOTIFICATIONS, 'default');
    revalidateTag('notification-list', 'default');
    revalidatePath('/notifications', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Notification created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create notification';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Notification',
      details: `Failed to create notification: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update notification
 * Includes audit logging and cache invalidation
 */
export async function updateNotificationAction(
  notificationId: string,
  data: UpdateNotificationData
): Promise<ActionResult<Notification>> {
  try {
    if (!notificationId) {
      return {
        success: false,
        error: 'Notification ID is required'
      };
    }

    const response = await serverPut<ApiResponse<Notification>>(
      `/api/notifications/${notificationId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.NOTIFICATIONS, `notification-${notificationId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update notification');
    }

    // Cache invalidation (minimal audit logging for read status)
    revalidateTag(NOTIFICATION_CACHE_TAGS.NOTIFICATIONS, 'default');
    revalidateTag(`notification-${notificationId}`, 'default');
    revalidateTag('notification-list', 'default');
    revalidatePath('/notifications', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Notification updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update notification';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Mark notification as read
 * Includes cache invalidation
 */
export async function markNotificationReadAction(notificationId: string): Promise<ActionResult<Notification>> {
  try {
    if (!notificationId) {
      return {
        success: false,
        error: 'Notification ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Notification>>(
      `/api/notifications/${notificationId}/read`,
      {},
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.NOTIFICATIONS, `notification-${notificationId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to mark notification as read');
    }

    // Cache invalidation (no audit log for read status)
    revalidateTag(NOTIFICATION_CACHE_TAGS.NOTIFICATIONS, 'default');
    revalidateTag(`notification-${notificationId}`, 'default');
    revalidateTag('notification-list', 'default');
    revalidatePath('/notifications', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Notification marked as read'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to mark notification as read';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Mark all notifications as read
 * Includes cache invalidation
 */
export async function markAllNotificationsReadAction(userId: string): Promise<ActionResult<void>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const response = await serverPost<ApiResponse<void>>(
      `/api/users/${userId}/notifications/mark-all-read`,
      {},
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.NOTIFICATIONS] }
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to mark all notifications as read');
    }

    // Cache invalidation
    revalidateTag(NOTIFICATION_CACHE_TAGS.NOTIFICATIONS, 'default');
    revalidateTag('notification-list', 'default');
    revalidatePath('/notifications', 'page');

    return {
      success: true,
      message: 'All notifications marked as read'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to mark all notifications as read';

    return {
      success: false,
      error: errorMessage
    };
  }
}
