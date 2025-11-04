/**
 * @fileoverview Reminder Form Handlers - Next.js v14+ Compatible
 *
 * Form data handling and form-specific server actions for reminders.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createReminderAction } from './reminders.create';
import type { CreateReminderData, ActionResult, Reminder } from './reminders.types';

/**
 * Create reminder from form data
 * Form-friendly wrapper for createReminderAction
 */
export async function createReminderFromForm(formData: FormData): Promise<ActionResult<Reminder>> {
  // Parse reminder times from form data
  const reminderTimesJson = formData.get('reminderTimes') as string;
  let reminderTimes: string[] = [];

  try {
    reminderTimes = JSON.parse(reminderTimesJson || '[]');
  } catch {
    // Use default reminder times if parsing fails
    reminderTimes = ['30m', '1d'];
  }

  // Parse channels from form data
  const channelsJson = formData.get('channels') as string;
  let channels: Reminder['channels'] = [];

  try {
    channels = JSON.parse(channelsJson || '[]');
  } catch {
    // Use default channels if parsing fails
    channels = ['in-app', 'email'];
  }

  // Parse tags from form data
  const tagsJson = formData.get('tags') as string;
  let tags: string[] = [];

  try {
    tags = JSON.parse(tagsJson || '[]');
  } catch {
    // Ignore tag parsing errors
  }

  const reminderData: CreateReminderData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as Reminder['type'],
    priority: (formData.get('priority') as Reminder['priority']) || 'normal',
    studentId: formData.get('studentId') as string || undefined,
    assignedTo: formData.get('assignedTo') as string || undefined,
    dueDate: formData.get('dueDate') as string,
    reminderTimes,
    channels,
    tags: tags.length > 0 ? tags : undefined,
    notes: formData.get('notes') as string || undefined,
  };

  const result = await createReminderAction(reminderData);

  if (result.success && result.data) {
    revalidatePath('/reminders', 'page');
  }

  return result;
}