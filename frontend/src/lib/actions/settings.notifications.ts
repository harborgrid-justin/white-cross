/**
 * @fileoverview Notification Preferences Actions
 * @module lib/actions/settings.notifications
 *
 * Server actions for managing user notification preferences including
 * email, SMS, push notifications, and notification types.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { updateNotificationPreferencesAction } from '@/lib/actions/settings.notifications';
 *
 * function NotificationForm() {
 *   const [state, formAction, isPending] = useActionState(updateNotificationPreferencesAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { type ZodIssue } from 'zod';
import type { ActionResult } from './settings.types';
import {
  getAuthUser,
  createAuditContext
} from './settings.utils';
import { API_ENDPOINTS } from '@/constants/api';
import { serverPut } from '@/lib/api/nextjs-client';
import {
  updateNotificationPreferencesSchema,
} from '@/schemas/settings.schemas';
import { auditLog } from '@/lib/audit';

/**
 * Update notification preferences
 * Handles updates to user notification settings including channels and types
 * Supports email, SMS, push notifications, and quiet hours configuration
 * @param prevState - Previous form state
 * @param formData - Form data containing notification preferences
 * @returns Action result with success status and any errors
 */
export async function updateNotificationPreferencesAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const auditContext = await createAuditContext();

  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        errors: {
          _form: ['Authentication required']
        }
      };
    }

    const rawData = {
      emailNotifications: formData.get('emailNotifications') === 'true',
      smsNotifications: formData.get('smsNotifications') === 'true',
      pushNotifications: formData.get('pushNotifications') === 'true',
      notificationTypes: JSON.parse(formData.get('notificationTypes')?.toString() || '[]'),
      quietHours: formData.get('quietHours') ? JSON.parse(formData.get('quietHours')!.toString()) : undefined,
    };

    const validation = updateNotificationPreferencesSchema.safeParse(rawData);

    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    const result = await serverPut(`${API_ENDPOINTS.USERS.BASE}/${user.id}/notification-preferences`, validation.data, {
      tags: ['user-settings', `user-${user.id}`]
    });

    await auditLog({
      ...auditContext,
      action: 'UPDATE_NOTIFICATION_PREFERENCES',
      resource: 'User',
      resourceId: user.id,
      changes: validation.data,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('user-settings', 'default');
    revalidateTag(`user-${user.id}`, 'default');
    revalidatePath('/settings/notifications');

    return {
      success: true,
      message: 'Notification preferences updated successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
}
