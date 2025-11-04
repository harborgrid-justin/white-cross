/**
 * @fileoverview Reminder Update Actions - Next.js v14+ Compatible
 *
 * Update operations for reminder management.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPut, NextApiClientError } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types/core/api/responses';

import {
  ActionResult,
  Reminder,
  UpdateReminderData,
  REMINDER_CACHE_TAGS
} from './reminders.types';

/**
 * Update reminder
 * Includes audit logging and cache invalidation
 */
export async function updateReminderAction(
  reminderId: string,
  data: UpdateReminderData
): Promise<ActionResult<Reminder>> {
  try {
    if (!reminderId) {
      return {
        success: false,
        error: 'Reminder ID is required'
      };
    }

    // Validate due date if provided
    if (data.dueDate) {
      const dueDate = new Date(data.dueDate);
      if (isNaN(dueDate.getTime())) {
        return {
          success: false,
          error: 'Invalid due date format'
        };
      }
    }

    const response = await serverPut<ApiResponse<Reminder>>(
      `/api/reminders/${reminderId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.REMINDERS, `reminder-${reminderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update reminder');
    }

    // AUDIT LOG - Reminder update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Updated reminder: ${response.data.title}`,
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.REMINDERS, 'default');
    revalidateTag(`reminder-${reminderId}`, 'default');
    revalidateTag('reminder-list', 'default');
    revalidateTag('overdue-reminders', 'default');
    revalidatePath('/reminders', 'page');
    revalidatePath(`/reminders/${reminderId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Reminder updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update reminder';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Failed to update reminder: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}