/**
 * @fileoverview Reminder Create Actions - Next.js v14+ Compatible
 *
 * Create operations for reminder management.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, NextApiClientError } from '@/lib/api/server';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types/core/api/responses';

import {
  ActionResult,
  Reminder,
  CreateReminderData,
  ReminderTemplate,
  CreateReminderTemplateData,
  REMINDER_CACHE_TAGS
} from './reminders.types';

/**
 * Create a new reminder
 * Includes audit logging and cache invalidation
 */
export async function createReminderAction(data: CreateReminderData): Promise<ActionResult<Reminder>> {
  try {
    // Validate required fields
    if (!data.title || !data.description || !data.dueDate) {
      return {
        success: false,
        error: 'Missing required fields: title, description, dueDate'
      };
    }

    // Validate due date
    const dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) {
      return {
        success: false,
        error: 'Invalid due date format'
      };
    }

    const response = await serverPost<ApiResponse<Reminder>>(
      `/api/reminders`,
      data,
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.REMINDERS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create reminder');
    }

    // AUDIT LOG - Reminder creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: response.data.id,
      details: `Created reminder: ${data.title}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.REMINDERS, 'default');
    revalidateTag('reminder-list', 'default');
    revalidateTag('overdue-reminders', 'default');
    revalidatePath('/reminders', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Reminder created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create reminder';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Reminder',
      details: `Failed to create reminder: ${errorMessage}`,
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
 * Create reminder template
 * Includes audit logging and cache invalidation
 */
export async function createReminderTemplateAction(data: CreateReminderTemplateData): Promise<ActionResult<ReminderTemplate>> {
  try {
    // Validate required fields
    if (!data.name || !data.title || !data.content) {
      return {
        success: false,
        error: 'Missing required fields: name, title, content'
      };
    }

    const response = await serverPost<ApiResponse<ReminderTemplate>>(
      `/api/reminders/templates`,
      data,
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.TEMPLATES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create reminder template');
    }

    // AUDIT LOG - Template creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'ReminderTemplate',
      resourceId: response.data.id,
      details: `Created reminder template: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.TEMPLATES, 'default');
    revalidateTag('reminder-template-list', 'default');
    revalidatePath('/reminders/templates', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Reminder template created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create reminder template';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'ReminderTemplate',
      details: `Failed to create reminder template: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}