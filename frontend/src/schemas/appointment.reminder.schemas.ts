/**
 * @fileoverview Appointment Reminder Schemas
 * @module schemas/appointment/reminder
 *
 * Schemas for appointment reminder configuration, scheduling, and sending.
 * Handles reminder timing, notification methods, and custom messaging.
 */

import { z } from 'zod';
import {
  appointmentIdSchema,
  REMINDER_TYPES,
  NOTIFICATION_METHODS,
} from './appointment.base.schemas';

// ==========================================
// REMINDER SETTINGS
// ==========================================

/**
 * Reminder Settings Schema
 * Configures when and how appointment reminders are sent
 */
export const reminderSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  times: z
    .array(z.enum(REMINDER_TYPES))
    .min(1, 'At least one reminder time must be selected')
    .default(['24h', '1h']),
  customMinutes: z
    .number()
    .int()
    .min(1, 'Custom minutes must be at least 1')
    .max(10080, 'Custom reminder cannot exceed 7 days (10080 minutes)')
    .optional(),
  method: z.enum(NOTIFICATION_METHODS).default('email'),
  message: z.string().max(500, 'Custom message cannot exceed 500 characters').optional(),
});

export type ReminderSettings = z.infer<typeof reminderSettingsSchema>;

// ==========================================
// SCHEDULE REMINDERS
// ==========================================

/**
 * Schedule Reminders Schema
 * Associates reminder settings with a specific appointment
 */
export const scheduleRemindersSchema = z.object({
  appointmentId: appointmentIdSchema,
  settings: reminderSettingsSchema,
});

export type ScheduleRemindersInput = z.infer<typeof scheduleRemindersSchema>;

// ==========================================
// SEND REMINDER
// ==========================================

/**
 * Send Reminder Schema
 * Manually triggers a reminder for an appointment
 */
export const sendReminderSchema = z.object({
  appointmentId: appointmentIdSchema,
  method: z.enum(NOTIFICATION_METHODS).default('email'),
  customMessage: z.string().max(500).optional(),
});

export type SendReminderInput = z.infer<typeof sendReminderSchema>;

// ==========================================
// VALIDATION REFINEMENTS
// ==========================================

/**
 * Refinement: Ensure custom minutes is provided when 'custom' is in reminder times
 */
export const reminderSettingsSchemaWithValidation = reminderSettingsSchema.refine(
  (data) => {
    if (data.times.includes('custom') && !data.customMinutes) {
      return false;
    }
    return true;
  },
  {
    message: 'Custom minutes must be specified when using custom reminder time',
    path: ['customMinutes'],
  }
);

export type ReminderSettingsValidated = z.infer<typeof reminderSettingsSchemaWithValidation>;

// ==========================================
// VALIDATION HELPERS
// ==========================================

/**
 * Validate custom reminder minutes make sense given appointment time
 * @param customMinutes - Minutes before appointment to send reminder
 * @param scheduledDate - Appointment date (YYYY-MM-DD)
 * @param scheduledTime - Appointment time (HH:MM)
 * @returns True if reminder time would be in the future
 */
export const validateReminderTime = (
  customMinutes: number | undefined,
  scheduledDate: string,
  scheduledTime: string
): boolean => {
  if (!customMinutes) return true;

  const appointmentDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
  const reminderTime = new Date(appointmentDateTime.getTime() - customMinutes * 60000);
  const now = new Date();

  return reminderTime > now;
};
