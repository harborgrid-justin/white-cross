/**
 * @fileoverview Notification Preferences Operations
 * @module app/notifications/preferences
 *
 * Operations for managing user notification preferences.
 * Includes audit logging and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPut, NextApiClientError } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import type { ApiResponse } from '@/types/api';
import { NOTIFICATION_CACHE_TAGS } from './notifications.cache';
import type {
  ActionResult,
  NotificationPreferences,
  UpdateNotificationPreferencesData,
} from './notifications.types';

// ==========================================
// NOTIFICATION PREFERENCES OPERATIONS
// ==========================================

/**
 * Update notification preferences
 * Includes audit logging and cache invalidation
 */
export async function updateNotificationPreferencesAction(
  userId: string,
  data: UpdateNotificationPreferencesData
): Promise<ActionResult<NotificationPreferences>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const response = await serverPut<ApiResponse<NotificationPreferences>>(
      `/api/users/${userId}/notification-preferences`,
      data,
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.PREFERENCES, `notification-preferences-${userId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update notification preferences');
    }

    // AUDIT LOG - Preferences update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'NotificationPreferences',
      resourceId: userId,
      details: 'Updated notification preferences',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(NOTIFICATION_CACHE_TAGS.PREFERENCES, 'default');
    revalidateTag(`notification-preferences-${userId}`, 'default');
    revalidatePath('/notifications/preferences', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Notification preferences updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update notification preferences';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'NotificationPreferences',
      resourceId: userId,
      details: `Failed to update notification preferences: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
