/**
 * @fileoverview Appointment Reminder Scheduling Utility
 * @module lib/appointments/reminders
 *
 * Handles scheduling, cancellation, and management of appointment reminders.
 * Supports multiple reminder types and delivery methods.
 */

import { apiClient } from '@/services/core/ApiClient';
import type { ReminderSettings } from '@/schemas/appointment.schemas';

// ==========================================
// TYPES
// ==========================================

export interface ReminderSchedule {
  appointmentId: string;
  scheduledFor: Date;
  settings: ReminderSettings;
}

export interface ScheduledReminder {
  id: string;
  appointmentId: string;
  reminderType: '24h' | '1h' | '15min' | 'custom';
  scheduledFor: Date;
  deliveryMethod: 'email' | 'sms' | 'both';
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  sentAt?: Date;
  error?: string;
}

export interface ReminderResult {
  scheduled: boolean;
  reminderIds: string[];
  error?: string;
}

// ==========================================
// REMINDER TIME CALCULATIONS
// ==========================================

/**
 * Calculate reminder times based on appointment time
 */
export function calculateReminderTimes(
  appointmentDateTime: Date,
  reminderTypes: ('24h' | '1h' | '15min' | 'custom')[],
  customMinutes?: number
): Map<string, Date> {
  const reminderTimes = new Map<string, Date>();

  for (const type of reminderTypes) {
    let reminderTime: Date;

    switch (type) {
      case '24h':
        reminderTime = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '1h':
        reminderTime = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000);
        break;
      case '15min':
        reminderTime = new Date(appointmentDateTime.getTime() - 15 * 60 * 1000);
        break;
      case 'custom':
        if (customMinutes) {
          reminderTime = new Date(appointmentDateTime.getTime() - customMinutes * 60 * 1000);
        } else {
          continue; // Skip if no custom minutes provided
        }
        break;
      default:
        continue;
    }

    // Only schedule reminders that are in the future
    if (reminderTime > new Date()) {
      reminderTimes.set(type, reminderTime);
    }
  }

  return reminderTimes;
}

/**
 * Validate that reminder time is reasonable (not too far in past/future)
 */
export function validateReminderTime(reminderTime: Date, appointmentTime: Date): boolean {
  const now = new Date();

  // Reminder must be in the future
  if (reminderTime <= now) {
    return false;
  }

  // Reminder must be before the appointment
  if (reminderTime >= appointmentTime) {
    return false;
  }

  // Reminder should not be more than 7 days before appointment
  const maxAdvance = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  if (appointmentTime.getTime() - reminderTime.getTime() > maxAdvance) {
    return false;
  }

  return true;
}

// ==========================================
// REMINDER SCHEDULING
// ==========================================

/**
 * Schedule reminders for an appointment
 */
export async function scheduleReminders(schedule: ReminderSchedule): Promise<ReminderResult> {
  try {
    const { appointmentId, scheduledFor, settings } = schedule;

    if (!settings.enabled) {
      return {
        scheduled: false,
        reminderIds: [],
      };
    }

    // Calculate reminder times
    const reminderTimes = calculateReminderTimes(
      scheduledFor,
      settings.times,
      settings.customMinutes
    );

    if (reminderTimes.size === 0) {
      return {
        scheduled: false,
        reminderIds: [],
        error: 'No valid reminder times calculated',
      };
    }

    // Schedule each reminder via API
    const reminderIds: string[] = [];

    for (const [type, time] of reminderTimes.entries()) {
      try {
        const response = await apiClient.post<{ id: string }>(
          `/appointments/${appointmentId}/reminders`,
          {
            reminderType: type,
            scheduledFor: time.toISOString(),
            deliveryMethod: settings.method,
            customMessage: settings.message,
          }
        );

        reminderIds.push(response.data.id);
      } catch (error) {
        console.error(`Failed to schedule ${type} reminder:`, error);
        // Continue scheduling other reminders even if one fails
      }
    }

    return {
      scheduled: reminderIds.length > 0,
      reminderIds,
    };
  } catch (error) {
    console.error('Error scheduling reminders:', error);
    return {
      scheduled: false,
      reminderIds: [],
      error: error instanceof Error ? error.message : 'Failed to schedule reminders',
    };
  }
}

/**
 * Cancel all reminders for an appointment
 */
export async function cancelReminders(appointmentId: string): Promise<boolean> {
  try {
    await apiClient.delete(`/appointments/${appointmentId}/reminders`);
    return true;
  } catch (error) {
    console.error('Error cancelling reminders:', error);
    return false;
  }
}

/**
 * Cancel a specific reminder
 */
export async function cancelReminder(reminderId: string): Promise<boolean> {
  try {
    await apiClient.delete(`/reminders/${reminderId}`);
    return true;
  } catch (error) {
    console.error('Error cancelling reminder:', error);
    return false;
  }
}

/**
 * Update reminder settings for an appointment
 * Cancels existing reminders and schedules new ones
 */
export async function updateReminderSettings(
  appointmentId: string,
  scheduledFor: Date,
  settings: ReminderSettings
): Promise<ReminderResult> {
  try {
    // Cancel existing reminders
    await cancelReminders(appointmentId);

    // Schedule new reminders
    return await scheduleReminders({
      appointmentId,
      scheduledFor,
      settings,
    });
  } catch (error) {
    console.error('Error updating reminder settings:', error);
    return {
      scheduled: false,
      reminderIds: [],
      error: error instanceof Error ? error.message : 'Failed to update reminder settings',
    };
  }
}

// ==========================================
// REMINDER DELIVERY
// ==========================================

/**
 * Send immediate reminder (manual send)
 */
export async function sendImmediateReminder(
  appointmentId: string,
  method: 'email' | 'sms' | 'both',
  customMessage?: string
): Promise<{ sent: boolean; error?: string }> {
  try {
    const response = await apiClient.post<{ sent: boolean }>(
      `/appointments/${appointmentId}/send-reminder`,
      {
        method,
        customMessage,
      }
    );

    return {
      sent: response.data.sent,
    };
  } catch (error) {
    console.error('Error sending immediate reminder:', error);
    return {
      sent: false,
      error: error instanceof Error ? error.message : 'Failed to send reminder',
    };
  }
}

/**
 * Get reminder history for an appointment
 */
export async function getReminderHistory(
  appointmentId: string
): Promise<ScheduledReminder[]> {
  try {
    const response = await apiClient.get<ScheduledReminder[]>(
      `/appointments/${appointmentId}/reminders`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching reminder history:', error);
    return [];
  }
}

/**
 * Get pending reminders for an appointment
 */
export async function getPendingReminders(
  appointmentId: string
): Promise<ScheduledReminder[]> {
  try {
    const history = await getReminderHistory(appointmentId);
    return history.filter((reminder) => reminder.status === 'pending');
  } catch (error) {
    console.error('Error fetching pending reminders:', error);
    return [];
  }
}

// ==========================================
// REMINDER TEMPLATES
// ==========================================

/**
 * Generate default reminder message
 */
export function generateReminderMessage(params: {
  studentName: string;
  appointmentType: string;
  appointmentDate: string;
  appointmentTime: string;
  nurseName?: string;
  location?: string;
  customInstructions?: string;
}): string {
  const { studentName, appointmentType, appointmentDate, appointmentTime, nurseName, location, customInstructions } = params;

  let message = `Reminder: ${studentName} has a ${appointmentType} appointment scheduled for ${appointmentDate} at ${appointmentTime}.`;

  if (nurseName) {
    message += ` With: ${nurseName}.`;
  }

  if (location) {
    message += ` Location: ${location}.`;
  }

  if (customInstructions) {
    message += ` ${customInstructions}`;
  }

  message += ' Please arrive 5 minutes early. Reply CANCEL to cancel this appointment.';

  return message;
}

/**
 * Get reminder subject line
 */
export function getReminderSubject(
  reminderType: '24h' | '1h' | '15min' | 'custom',
  appointmentType: string
): string {
  const timeframes: Record<string, string> = {
    '24h': 'Tomorrow',
    '1h': 'In 1 Hour',
    '15min': 'In 15 Minutes',
    'custom': 'Upcoming',
  };

  return `${timeframes[reminderType]}: ${appointmentType} Appointment Reminder`;
}

// ==========================================
// BATCH OPERATIONS
// ==========================================

/**
 * Schedule reminders for multiple appointments
 */
export async function scheduleMultipleReminders(
  schedules: ReminderSchedule[]
): Promise<Map<string, ReminderResult>> {
  const results = new Map<string, ReminderResult>();

  // Process all schedules in parallel
  const promises = schedules.map((schedule) =>
    scheduleReminders(schedule).then((result) => ({
      appointmentId: schedule.appointmentId,
      result,
    }))
  );

  const settled = await Promise.allSettled(promises);

  settled.forEach((outcome) => {
    if (outcome.status === 'fulfilled') {
      results.set(outcome.value.appointmentId, outcome.value.result);
    }
  });

  return results;
}

/**
 * Cancel reminders for multiple appointments
 */
export async function cancelMultipleReminders(
  appointmentIds: string[]
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();

  // Process all cancellations in parallel
  const promises = appointmentIds.map((id) =>
    cancelReminders(id).then((result) => ({ id, result }))
  );

  const settled = await Promise.allSettled(promises);

  settled.forEach((outcome) => {
    if (outcome.status === 'fulfilled') {
      results.set(outcome.value.id, outcome.value.result);
    } else {
      results.set('unknown', false);
    }
  });

  return results;
}

// ==========================================
// REMINDER STATISTICS
// ==========================================

/**
 * Get reminder statistics for a date range
 */
export async function getReminderStatistics(params: {
  startDate: string;
  endDate: string;
  nurseId?: string;
}): Promise<{
  totalScheduled: number;
  totalSent: number;
  totalFailed: number;
  totalCancelled: number;
  deliveryRate: number;
}> {
  try {
    const response = await apiClient.get<{
      totalScheduled: number;
      totalSent: number;
      totalFailed: number;
      totalCancelled: number;
    }>('/appointments/reminders/statistics', {
      params,
    });

    const { totalScheduled, totalSent, totalFailed, totalCancelled } = response.data;

    const deliveryRate = totalScheduled > 0 ? (totalSent / totalScheduled) * 100 : 0;

    return {
      ...response.data,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
    };
  } catch (error) {
    console.error('Error fetching reminder statistics:', error);
    return {
      totalScheduled: 0,
      totalSent: 0,
      totalFailed: 0,
      totalCancelled: 0,
      deliveryRate: 0,
    };
  }
}

// ==========================================
// REMINDER PREFERENCES
// ==========================================

/**
 * Get default reminder settings from user preferences
 */
export async function getDefaultReminderSettings(): Promise<ReminderSettings> {
  try {
    const response = await apiClient.get<ReminderSettings>(
      '/appointments/settings/reminders'
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching default reminder settings:', error);
    // Return safe defaults
    return {
      enabled: true,
      times: ['24h', '1h'],
      method: 'email',
    };
  }
}

/**
 * Save default reminder settings to user preferences
 */
export async function saveDefaultReminderSettings(
  settings: ReminderSettings
): Promise<boolean> {
  try {
    await apiClient.put('/appointments/settings/reminders', settings);
    return true;
  } catch (error) {
    console.error('Error saving default reminder settings:', error);
    return false;
  }
}
