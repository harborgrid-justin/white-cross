/**
 * @fileoverview Appointment Base Schemas
 * @module schemas/appointment/base
 *
 * Core enums, constants, and foundational types for appointment system.
 * These are the building blocks used across all appointment-related schemas.
 */

import { z } from 'zod';

// ==========================================
// ENUMS AND CONSTANTS
// ==========================================

/**
 * Valid appointment status values
 * Used throughout the appointment lifecycle
 */
export const APPOINTMENT_STATUSES = [
  'scheduled',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
  'no-show',
] as const;

/**
 * Appointment priority levels
 * Determines urgency and scheduling preference
 */
export const APPOINTMENT_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

/**
 * Standard reminder timing options
 */
export const REMINDER_TYPES = ['24h', '1h', '15min', 'custom'] as const;

/**
 * Available notification delivery methods
 */
export const NOTIFICATION_METHODS = ['email', 'sms', 'both'] as const;

/**
 * Report types for appointment analytics
 */
export const REPORT_TYPES = [
  'appointments',
  'no-shows',
  'cancellations',
  'utilization',
  'waitlist',
] as const;

/**
 * Export formats for reports
 */
export const REPORT_FORMATS = ['pdf', 'csv', 'excel'] as const;

/**
 * Days of the week for scheduling
 */
export const WORKING_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

// ==========================================
// REGEX PATTERNS
// ==========================================

/**
 * Date format: YYYY-MM-DD
 */
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Time format: HH:MM (24-hour)
 */
export const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// ==========================================
// REUSABLE FIELD SCHEMAS
// ==========================================

/**
 * Student ID field
 */
export const studentIdSchema = z.string().uuid('Invalid student ID format');

/**
 * Nurse ID field
 */
export const nurseIdSchema = z.string().uuid('Invalid nurse ID format');

/**
 * Appointment ID field
 */
export const appointmentIdSchema = z.string().uuid('Invalid appointment ID format');

/**
 * Date field with YYYY-MM-DD format
 */
export const dateFieldSchema = z
  .string()
  .regex(DATE_REGEX, 'Date must be in YYYY-MM-DD format');

/**
 * Time field with HH:MM format
 */
export const timeFieldSchema = z
  .string()
  .regex(TIME_REGEX, 'Time must be in HH:MM format');

/**
 * Duration in minutes (15-min increments, 15 min - 8 hours)
 */
export const durationSchema = z
  .number()
  .int('Duration must be an integer')
  .min(15, 'Duration must be at least 15 minutes')
  .max(480, 'Duration cannot exceed 8 hours')
  .multipleOf(15, 'Duration must be in 15-minute increments');

/**
 * Appointment type string
 */
export const appointmentTypeSchema = z
  .string()
  .min(1, 'Appointment type is required')
  .max(100);

/**
 * Priority level
 */
export const prioritySchema = z.enum(APPOINTMENT_PRIORITIES);

/**
 * Appointment status
 */
export const statusSchema = z.enum(APPOINTMENT_STATUSES);

/**
 * Notes field (up to 2000 characters)
 */
export const notesSchema = z
  .string()
  .max(2000, 'Notes cannot exceed 2000 characters')
  .optional();

/**
 * Reason field (required, 3-500 characters)
 */
export const reasonSchema = z
  .string()
  .min(3, 'Reason must be at least 3 characters')
  .max(500);

// ==========================================
// COMPOSITE SCHEMAS
// ==========================================

/**
 * Time range schema for scheduling windows
 */
export const timeRangeSchema = z.object({
  start: timeFieldSchema,
  end: timeFieldSchema,
});

/**
 * Working hours configuration
 */
export const workingHoursSchema = z.object({
  start: timeFieldSchema,
  end: timeFieldSchema,
});

// ==========================================
// TYPE EXPORTS
// ==========================================

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
export type AppointmentPriority = (typeof APPOINTMENT_PRIORITIES)[number];
export type ReminderType = (typeof REMINDER_TYPES)[number];
export type NotificationMethod = (typeof NOTIFICATION_METHODS)[number];
export type ReportType = (typeof REPORT_TYPES)[number];
export type ReportFormat = (typeof REPORT_FORMATS)[number];
export type WorkingDay = (typeof WORKING_DAYS)[number];
export type TimeRange = z.infer<typeof timeRangeSchema>;
export type WorkingHours = z.infer<typeof workingHoursSchema>;
