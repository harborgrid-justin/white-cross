/**
 * Appointment Validation Schemas
 *
 * Validation schemas for appointment scheduling and management.
 */

import { z } from 'zod';
import {
  dateTimeSchema,
  dateTimeRangeSchema,
  optionalDateTimeSchema
} from '../common/date.schemas';

/**
 * Appointment types
 */
export const APPOINTMENT_TYPES = [
  'check-up',
  'medication',
  'screening',
  'counseling',
  'follow-up',
  'emergency',
  'parent-meeting',
  'other'
] as const;

/**
 * Appointment status
 */
export const APPOINTMENT_STATUS = [
  'scheduled',
  'confirmed',
  'checked-in',
  'in-progress',
  'completed',
  'cancelled',
  'no-show',
  'rescheduled'
] as const;

/**
 * Recurrence patterns
 */
export const RECURRENCE_PATTERNS = [
  'none',
  'daily',
  'weekly',
  'bi-weekly',
  'monthly',
  'custom'
] as const;

/**
 * Create appointment schema
 */
export const createAppointmentSchema = z.object({
  studentId: z
    .string({ required_error: 'Student is required' })
    .uuid('Invalid student ID'),

  type: z.enum(APPOINTMENT_TYPES, {
    required_error: 'Appointment type is required',
    invalid_type_error: 'Invalid appointment type'
  }),

  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),

  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .nullable(),

  startTime: dateTimeSchema,

  endTime: dateTimeSchema,

  location: z
    .string()
    .max(200, 'Location must be less than 200 characters')
    .optional()
    .nullable(),

  provider: z
    .string()
    .max(200, 'Provider name must be less than 200 characters')
    .optional()
    .nullable(),

  reason: z
    .string()
    .max(1000, 'Reason must be less than 1000 characters')
    .optional()
    .nullable(),

  status: z
    .enum(APPOINTMENT_STATUS)
    .default('scheduled'),

  sendReminder: z.boolean().default(true),

  reminderMinutesBefore: z
    .number()
    .int()
    .min(0)
    .max(10080) // 1 week
    .default(60)
    .optional(),

  isRecurring: z.boolean().default(false),

  recurrencePattern: z
    .enum(RECURRENCE_PATTERNS)
    .default('none')
    .optional(),

  recurrenceEndDate: optionalDateTimeSchema,

  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .nullable()
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  {
    message: 'End time must be after start time',
    path: ['endTime']
  }
);

/**
 * Update appointment schema
 */
export const updateAppointmentSchema = createAppointmentSchema
  .partial()
  .extend({
    id: z.string().uuid('Invalid appointment ID')
  });

/**
 * Reschedule appointment schema
 */
export const rescheduleAppointmentSchema = z.object({
  id: z
    .string({ required_error: 'Appointment ID is required' })
    .uuid('Invalid appointment ID'),

  newStartTime: dateTimeSchema,

  newEndTime: dateTimeSchema,

  reason: z
    .string({ required_error: 'Reschedule reason is required' })
    .min(1, 'Reschedule reason is required')
    .max(500, 'Reason must be less than 500 characters')
    .trim(),

  notifyParticipants: z.boolean().default(true)
}).refine(
  (data) => new Date(data.newEndTime) > new Date(data.newStartTime),
  {
    message: 'End time must be after start time',
    path: ['newEndTime']
  }
);

/**
 * Cancel appointment schema
 */
export const cancelAppointmentSchema = z.object({
  id: z
    .string({ required_error: 'Appointment ID is required' })
    .uuid('Invalid appointment ID'),

  reason: z
    .string({ required_error: 'Cancellation reason is required' })
    .min(1, 'Cancellation reason is required')
    .max(500, 'Reason must be less than 500 characters')
    .trim(),

  notifyParticipants: z.boolean().default(true)
});

/**
 * Check-in appointment schema
 */
export const checkInAppointmentSchema = z.object({
  id: z
    .string({ required_error: 'Appointment ID is required' })
    .uuid('Invalid appointment ID'),

  checkInTime: dateTimeSchema,

  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .nullable()
});

/**
 * Complete appointment schema
 */
export const completeAppointmentSchema = z.object({
  id: z
    .string({ required_error: 'Appointment ID is required' })
    .uuid('Invalid appointment ID'),

  completionTime: dateTimeSchema,

  summary: z
    .string()
    .max(2000, 'Summary must be less than 2000 characters')
    .optional()
    .nullable(),

  followUpRequired: z.boolean().default(false),

  followUpNotes: z
    .string()
    .max(1000, 'Follow-up notes must be less than 1000 characters')
    .optional()
    .nullable()
});

/**
 * Appointment search/filter schema
 */
export const appointmentSearchSchema = z.object({
  search: z.string().max(200).optional(),

  studentId: z.string().uuid().optional(),

  type: z.enum(APPOINTMENT_TYPES).optional(),

  status: z.enum(APPOINTMENT_STATUS).optional(),

  startDate: optionalDateTimeSchema,

  endDate: optionalDateTimeSchema,

  provider: z.string().max(200).optional(),

  // Pagination
  page: z.number().int().min(1).default(1),

  limit: z.number().int().min(1).max(100).default(20),

  // Sorting
  sortBy: z.enum(['startTime', 'type', 'status']).optional(),

  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

/**
 * Recurring appointment schema
 */
export const recurringAppointmentSchema = createAppointmentSchema.extend({
  isRecurring: z.literal(true),

  recurrencePattern: z.enum(RECURRENCE_PATTERNS).refine(
    (val) => val !== 'none',
    { message: 'Recurrence pattern is required for recurring appointments' }
  ),

  recurrenceEndDate: dateTimeSchema,

  occurrences: z
    .number()
    .int()
    .min(1)
    .max(365)
    .optional(),

  daysOfWeek: z
    .array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']))
    .min(1, 'At least one day is required')
    .optional()
});

/**
 * Type exports
 */
export type CreateAppointment = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointment = z.infer<typeof updateAppointmentSchema>;
export type RescheduleAppointment = z.infer<typeof rescheduleAppointmentSchema>;
export type CancelAppointment = z.infer<typeof cancelAppointmentSchema>;
export type CheckInAppointment = z.infer<typeof checkInAppointmentSchema>;
export type CompleteAppointment = z.infer<typeof completeAppointmentSchema>;
export type AppointmentSearch = z.infer<typeof appointmentSearchSchema>;
export type RecurringAppointment = z.infer<typeof recurringAppointmentSchema>;
export type AppointmentType = typeof APPOINTMENT_TYPES[number];
export type AppointmentStatus = typeof APPOINTMENT_STATUS[number];
export type RecurrencePattern = typeof RECURRENCE_PATTERNS[number];
