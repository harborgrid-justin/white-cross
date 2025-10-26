/**
 * @fileoverview Appointment Validation Schemas
 * @module schemas/appointment
 *
 * Zod validation schemas for all appointment operations.
 * Provides type-safe validation with comprehensive error messages.
 */

import { z } from 'zod';

// ==========================================
// ENUMS AND CONSTANTS
// ==========================================

export const APPOINTMENT_STATUSES = [
  'scheduled',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
  'no-show',
] as const;

export const APPOINTMENT_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export const REMINDER_TYPES = ['24h', '1h', '15min', 'custom'] as const;

export const NOTIFICATION_METHODS = ['email', 'sms', 'both'] as const;

// ==========================================
// CORE SCHEMAS
// ==========================================

/**
 * Create Appointment Schema
 */
export const appointmentCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID format'),
  appointmentType: z.string().min(1, 'Appointment type is required').max(100),
  scheduledDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  scheduledTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
  duration: z
    .number()
    .int('Duration must be an integer')
    .min(15, 'Duration must be at least 15 minutes')
    .max(480, 'Duration cannot exceed 8 hours')
    .multipleOf(15, 'Duration must be in 15-minute increments'),
  reason: z.string().min(3, 'Reason must be at least 3 characters').max(500),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
  priority: z.enum(APPOINTMENT_PRIORITIES).default('medium'),
  reminderEnabled: z.boolean().default(true),
  nurseId: z.string().uuid('Invalid nurse ID format').optional(),
});

export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>;

/**
 * Update Appointment Schema (all fields optional except ID)
 */
export const appointmentUpdateSchema = z.object({
  appointmentType: z.string().min(1).max(100).optional(),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  scheduledTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  duration: z.number().int().min(15).max(480).multipleOf(15).optional(),
  reason: z.string().min(3).max(500).optional(),
  notes: z.string().max(2000).optional(),
  priority: z.enum(APPOINTMENT_PRIORITIES).optional(),
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  nurseId: z.string().uuid().optional(),
});

export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>;

/**
 * Reschedule Appointment Schema
 */
export const appointmentRescheduleSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID format'),
  newDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  newTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
  reason: z.string().min(3, 'Reason for rescheduling is required').max(500),
  notifyParent: z.boolean().default(true),
});

export type AppointmentRescheduleInput = z.infer<typeof appointmentRescheduleSchema>;

/**
 * Cancel Appointment Schema
 */
export const appointmentCancelSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID format'),
  reason: z.string().min(3, 'Cancellation reason is required').max(500),
  notifyParent: z.boolean().default(true),
  offerWaitlist: z.boolean().default(true),
});

export type AppointmentCancelInput = z.infer<typeof appointmentCancelSchema>;

/**
 * Complete Appointment Schema
 */
export const appointmentCompleteSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID format'),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type AppointmentCompleteInput = z.infer<typeof appointmentCompleteSchema>;

/**
 * Mark No-Show Schema
 */
export const appointmentNoShowSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID format'),
  notes: z.string().max(2000).optional(),
  notifyParent: z.boolean().default(true),
});

export type AppointmentNoShowInput = z.infer<typeof appointmentNoShowSchema>;

// ==========================================
// REMINDER SCHEMAS
// ==========================================

/**
 * Reminder Settings Schema
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

/**
 * Schedule Reminders Schema
 */
export const scheduleRemindersSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID format'),
  settings: reminderSettingsSchema,
});

export type ScheduleRemindersInput = z.infer<typeof scheduleRemindersSchema>;

/**
 * Send Reminder Schema
 */
export const sendReminderSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID format'),
  method: z.enum(NOTIFICATION_METHODS).default('email'),
  customMessage: z.string().max(500).optional(),
});

export type SendReminderInput = z.infer<typeof sendReminderSchema>;

// ==========================================
// WAITLIST SCHEMAS
// ==========================================

/**
 * Waitlist Entry Schema
 */
export const waitlistEntrySchema = z.object({
  studentId: z.string().uuid('Invalid student ID format'),
  requestedType: z.string().min(1, 'Appointment type is required').max(100),
  requestedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  requestedTimeRange: z
    .object({
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    })
    .optional(),
  priority: z.enum(APPOINTMENT_PRIORITIES).default('medium'),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  expiresAt: z.string().datetime('Invalid expiration date').optional(),
});

export type WaitlistEntryInput = z.infer<typeof waitlistEntrySchema>;

/**
 * Remove from Waitlist Schema
 */
export const removeFromWaitlistSchema = z.object({
  waitlistId: z.string().uuid('Invalid waitlist ID format'),
  reason: z.string().max(500).optional(),
});

export type RemoveFromWaitlistInput = z.infer<typeof removeFromWaitlistSchema>;

/**
 * Fill from Waitlist Schema
 */
export const fillFromWaitlistSchema = z.object({
  cancelledAppointmentId: z.string().uuid('Invalid appointment ID format'),
  autoFill: z.boolean().default(true),
  waitlistId: z.string().uuid('Invalid waitlist ID format').optional(),
});

export type FillFromWaitlistInput = z.infer<typeof fillFromWaitlistSchema>;

// ==========================================
// CONFLICT DETECTION SCHEMAS
// ==========================================

/**
 * Conflict Check Schema
 */
export const conflictCheckSchema = z.object({
  appointmentId: z.string().uuid().optional(), // Exclude this appointment (for reschedule)
  studentId: z.string().uuid('Invalid student ID format'),
  nurseId: z.string().uuid('Invalid nurse ID format').optional(),
  scheduledDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  scheduledTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
  duration: z.number().int().min(15).max(480),
});

export type ConflictCheckInput = z.infer<typeof conflictCheckSchema>;

/**
 * Find Available Slots Schema
 */
export const findAvailableSlotsSchema = z.object({
  studentId: z.string().uuid('Invalid student ID format'),
  nurseId: z.string().uuid('Invalid nurse ID format').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  duration: z.number().int().min(15).max(480),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
});

export type FindAvailableSlotsInput = z.infer<typeof findAvailableSlotsSchema>;

// ==========================================
// BULK OPERATIONS SCHEMAS
// ==========================================

/**
 * Bulk Create Appointments Schema
 */
export const bulkCreateAppointmentsSchema = z.object({
  appointments: z
    .array(appointmentCreateSchema)
    .min(1, 'At least one appointment is required')
    .max(50, 'Cannot create more than 50 appointments at once'),
  checkConflicts: z.boolean().default(true),
  skipOnConflict: z.boolean().default(false),
});

export type BulkCreateAppointmentsInput = z.infer<typeof bulkCreateAppointmentsSchema>;

/**
 * Bulk Cancel Appointments Schema
 */
export const bulkCancelAppointmentsSchema = z.object({
  appointmentIds: z
    .array(z.string().uuid())
    .min(1, 'At least one appointment ID is required')
    .max(100, 'Cannot cancel more than 100 appointments at once'),
  reason: z.string().min(3, 'Cancellation reason is required').max(500),
  notifyParents: z.boolean().default(true),
});

export type BulkCancelAppointmentsInput = z.infer<typeof bulkCancelAppointmentsSchema>;

// ==========================================
// QUERY/FILTER SCHEMAS
// ==========================================

/**
 * Appointment List Query Schema
 */
export const appointmentListQuerySchema = z.object({
  studentId: z.string().uuid().optional(),
  nurseId: z.string().uuid().optional(),
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  priority: z.enum(APPOINTMENT_PRIORITIES).optional(),
  appointmentType: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
  sortBy: z.enum(['scheduledDate', 'createdAt', 'priority', 'status']).default('scheduledDate'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type AppointmentListQuery = z.infer<typeof appointmentListQuerySchema>;

/**
 * Calendar Events Query Schema
 */
export const calendarEventsQuerySchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
  nurseId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  statuses: z.array(z.enum(APPOINTMENT_STATUSES)).optional(),
});

export type CalendarEventsQuery = z.infer<typeof calendarEventsQuerySchema>;

// ==========================================
// REPORT SCHEMAS
// ==========================================

/**
 * Appointment Report Schema
 */
export const appointmentReportSchema = z.object({
  reportType: z.enum([
    'appointments',
    'no-shows',
    'cancellations',
    'utilization',
    'waitlist',
  ]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nurseId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  appointmentType: z.string().optional(),
  format: z.enum(['pdf', 'csv', 'excel']).default('pdf'),
  includeCharts: z.boolean().default(true),
});

export type AppointmentReportInput = z.infer<typeof appointmentReportSchema>;

// ==========================================
// SETTINGS SCHEMAS
// ==========================================

/**
 * Appointment Settings Schema
 */
export const appointmentSettingsSchema = z.object({
  defaultDuration: z.number().int().min(15).max(480).multipleOf(15).default(30),
  defaultReminderSettings: reminderSettingsSchema,
  allowOnlineScheduling: z.boolean().default(false),
  requireParentConsent: z.boolean().default(true),
  autoConfirmAppointments: z.boolean().default(false),
  enableWaitlist: z.boolean().default(true),
  workingHours: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  }),
  workingDays: z
    .array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']))
    .min(1, 'At least one working day must be selected'),
  bufferTime: z.number().int().min(0).max(60).default(5), // Minutes between appointments
});

export type AppointmentSettings = z.infer<typeof appointmentSettingsSchema>;

// ==========================================
// VALIDATION HELPERS
// ==========================================

/**
 * Validate appointment date is not in the past
 */
export const validateFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Validate appointment time is within working hours
 */
export const validateWorkingHours = (
  time: string,
  workingHours: { start: string; end: string }
): boolean => {
  return time >= workingHours.start && time <= workingHours.end;
};

/**
 * Validate custom reminder minutes make sense
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
