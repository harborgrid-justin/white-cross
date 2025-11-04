/**
 * @fileoverview Notification Form Handling Operations
 * @module app/notifications/forms
 *
 * Form data handling wrappers for notification operations.
 * Converts FormData to proper data structures for CRUD operations.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createNotificationAction } from './notifications.crud';
import { updateNotificationPreferencesAction } from './notifications.preferences';
import type {
  ActionResult,
  Notification,
  CreateNotificationData,
  NotificationPreferences,
  UpdateNotificationPreferencesData,
} from './notifications.types';

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create notification from form data
 * Form-friendly wrapper for createNotificationAction
 */
export async function createNotificationFromForm(formData: FormData): Promise<ActionResult<Notification>> {
  const userIds = (formData.get('userIds') as string)?.split(',').filter(Boolean) || [];
  const channels = (formData.get('channels') as string)?.split(',').filter(Boolean) as Notification['channel'][] || [];

  const notificationData: CreateNotificationData = {
    userId: formData.get('userId') as string || undefined,
    userIds: userIds.length > 0 ? userIds : undefined,
    title: formData.get('title') as string,
    message: formData.get('message') as string,
    type: formData.get('type') as Notification['type'] || 'info',
    category: formData.get('category') as Notification['category'] || 'system',
    priority: formData.get('priority') as Notification['priority'] || 'normal',
    channels: channels.length > 0 ? channels : undefined,
    actionUrl: formData.get('actionUrl') as string || undefined,
    actionLabel: formData.get('actionLabel') as string || undefined,
    imageUrl: formData.get('imageUrl') as string || undefined,
    resourceType: formData.get('resourceType') as string || undefined,
    resourceId: formData.get('resourceId') as string || undefined,
    scheduledAt: formData.get('scheduledAt') as string || undefined,
    expiresAt: formData.get('expiresAt') as string || undefined,
    templateId: formData.get('templateId') as string || undefined,
  };

  const result = await createNotificationAction(notificationData);

  if (result.success && result.data) {
    revalidatePath('/notifications', 'page');
  }

  return result;
}

/**
 * Update notification preferences from form data
 * Form-friendly wrapper for updateNotificationPreferencesAction
 */
export async function updateNotificationPreferencesFromForm(
  userId: string,
  formData: FormData
): Promise<ActionResult<NotificationPreferences>> {
  const preferencesData: UpdateNotificationPreferencesData = {
    emailEnabled: formData.get('emailEnabled') === 'true',
    smsEnabled: formData.get('smsEnabled') === 'true',
    pushEnabled: formData.get('pushEnabled') === 'true',
    desktopEnabled: formData.get('desktopEnabled') === 'true',
    categories: {
      system: formData.get('categories.system') === 'true',
      medication: formData.get('categories.medication') === 'true',
      appointment: formData.get('categories.appointment') === 'true',
      incident: formData.get('categories.incident') === 'true',
      compliance: formData.get('categories.compliance') === 'true',
      communication: formData.get('categories.communication') === 'true',
      security: formData.get('categories.security') === 'true',
    },
    quietHours: {
      enabled: formData.get('quietHours.enabled') === 'true',
      startTime: formData.get('quietHours.startTime') as string || '22:00',
      endTime: formData.get('quietHours.endTime') as string || '08:00',
    },
    frequency: formData.get('frequency') as NotificationPreferences['frequency'] || 'immediate',
  };

  const result = await updateNotificationPreferencesAction(userId, preferencesData);

  if (result.success && result.data) {
    revalidatePath('/notifications/preferences', 'page');
  }

  return result;
}
