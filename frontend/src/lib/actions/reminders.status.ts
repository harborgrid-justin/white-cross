/**
 * @fileoverview Reminder Status Actions - Next.js v14+ Compatible
 *
 * Status change operations for reminder management.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types/core/api/responses';

// Utils
import { formatDate } from '@/utils/dateUtils';

import {
  ActionResult,
  Reminder,
  REMINDER_CACHE_TAGS
} from './reminders.types';

/**
 * Complete reminder
 * Includes audit logging and cache invalidation
 */
export async function completeReminderAction(
  reminderId: string,
  notes?: string
): Promise<ActionResult<Reminder>> {
  try {
    if (!reminderId) {
      return {
        success: false,
        error: 'Reminder ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Reminder>>(
      `/api/reminders/${reminderId}/complete`,
      { notes },
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.REMINDERS, `reminder-${reminderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to complete reminder');
    }

    // AUDIT LOG - Reminder completion
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Completed reminder: ${response.data.title}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.REMINDERS, 'default');
    revalidateTag(`reminder-${reminderId}`, 'default');
    revalidateTag('reminder-list', 'default');
    revalidateTag('overdue-reminders', 'default');
    revalidatePath('/reminders', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Reminder completed successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to complete reminder';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Failed to complete reminder: ${errorMessage}`,
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
 * Snooze reminder
 * Includes audit logging and cache invalidation
 */
export async function snoozeReminderAction(
  reminderId: string,
  snoozeUntil: string
): Promise<ActionResult<Reminder>> {
  try {
    if (!reminderId) {
      return {
        success: false,
        error: 'Reminder ID is required'
      };
    }

    if (!snoozeUntil) {
      return {
        success: false,
        error: 'Snooze until date is required'
      };
    }

    // Validate snooze date
    const snoozeDate = new Date(snoozeUntil);
    if (isNaN(snoozeDate.getTime())) {
      return {
        success: false,
        error: 'Invalid snooze date format'
      };
    }

    const response = await serverPost<ApiResponse<Reminder>>(
      `/api/reminders/${reminderId}/snooze`,
      { snoozeUntil },
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.REMINDERS, `reminder-${reminderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to snooze reminder');
    }

    // AUDIT LOG - Reminder snooze
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Snoozed reminder: ${response.data.title} until ${formatDate(snoozeUntil)}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.REMINDERS, 'default');
    revalidateTag(`reminder-${reminderId}`, 'default');
    revalidateTag('reminder-list', 'default');
    revalidateTag('overdue-reminders', 'default');
    revalidatePath('/reminders', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Reminder snoozed successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to snooze reminder';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Failed to snooze reminder: ${errorMessage}`,
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
 * Delete reminder
 * Includes audit logging and cache invalidation
 */
export async function deleteReminderAction(reminderId: string): Promise<ActionResult<void>> {
  try {
    if (!reminderId) {
      return {
        success: false,
        error: 'Reminder ID is required'
      };
    }

    const response = await serverDelete<ApiResponse<void>>(
      `/api/reminders/${reminderId}`,
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.REMINDERS, `reminder-${reminderId}`] }
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete reminder');
    }

    // AUDIT LOG - Reminder deletion
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: 'Deleted reminder',
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.REMINDERS, 'default');
    revalidateTag(`reminder-${reminderId}`, 'default');
    revalidateTag('reminder-list', 'default');
    revalidateTag('overdue-reminders', 'default');
    revalidatePath('/reminders', 'page');

    return {
      success: true,
      message: 'Reminder deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete reminder';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Failed to delete reminder: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}