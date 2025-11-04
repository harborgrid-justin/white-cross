/**
 * @fileoverview Notification Template Operations
 * @module app/notifications/templates
 *
 * Operations for managing notification templates.
 * Includes audit logging and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import type { ApiResponse } from '@/types/api';
import { NOTIFICATION_CACHE_TAGS } from './notifications.cache';
import type {
  ActionResult,
  NotificationTemplate,
  CreateNotificationTemplateData,
} from './notifications.types';

// ==========================================
// NOTIFICATION TEMPLATE OPERATIONS
// ==========================================

/**
 * Create notification template
 * Includes audit logging and cache invalidation
 */
export async function createNotificationTemplateAction(data: CreateNotificationTemplateData): Promise<ActionResult<NotificationTemplate>> {
  try {
    // Validate required fields
    if (!data.name || !data.title || !data.message) {
      return {
        success: false,
        error: 'Missing required fields: name, title, message'
      };
    }

    const response = await serverPost<ApiResponse<NotificationTemplate>>(
      `/api/notifications/templates`,
      data,
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.TEMPLATES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create notification template');
    }

    // AUDIT LOG - Template creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'NotificationTemplate',
      resourceId: response.data.id,
      details: `Created notification template: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(NOTIFICATION_CACHE_TAGS.TEMPLATES, 'default');
    revalidateTag('notification-template-list', 'default');
    revalidatePath('/notifications/templates', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Notification template created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create notification template';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'NotificationTemplate',
      details: `Failed to create notification template: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
