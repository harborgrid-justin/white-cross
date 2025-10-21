/**
 * Appointments Validators
 * Validation schemas for appointment scheduling and management endpoints
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

/**
 * Query Schemas
 */

export const listAppointmentsQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  nurseId: Joi.string()
    .uuid()
    .optional()
    .description('Filter by nurse UUID'),
  studentId: Joi.string()
    .uuid()
    .optional()
    .description('Filter by student UUID'),
  status: Joi.string()
    .valid('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED')
    .optional()
    .description('Filter by appointment status'),
  type: Joi.string()
    .optional()
    .description('Filter by appointment type'),
  dateFrom: Joi.date()
    .iso()
    .optional()
    .description('Filter by start date (ISO 8601)'),
  dateTo: Joi.date()
    .iso()
    .optional()
    .description('Filter by end date (ISO 8601)')
});

export const availableSlotsQuerySchema = Joi.object({
  date: Joi.date()
    .iso()
    .required()
    .description('Date to check availability (ISO 8601)')
    .messages({
      'any.required': 'Date is required'
    }),
  slotDuration: Joi.number()
    .integer()
    .min(15)
    .max(120)
    .optional()
    .description('Slot duration in minutes (default: 30)')
});

export const upcomingAppointmentsQuerySchema = Joi.object({
  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .optional()
    .description('Maximum number of appointments to return (default: 10)')
});

export const statisticsQuerySchema = Joi.object({
  nurseId: Joi.string()
    .uuid()
    .optional()
    .description('Filter statistics by nurse UUID'),
  dateFrom: Joi.date()
    .iso()
    .optional()
    .description('Start date for statistics (ISO 8601)'),
  dateTo: Joi.date()
    .iso()
    .optional()
    .description('End date for statistics (ISO 8601)')
});

/**
 * Payload Schemas
 */

export const createAppointmentSchema = Joi.object({
  studentId: Joi.string()
    .uuid()
    .required()
    .description('Student UUID')
    .messages({
      'any.required': 'Student ID is required'
    }),

  nurseId: Joi.string()
    .uuid()
    .required()
    .description('Nurse UUID')
    .messages({
      'any.required': 'Nurse ID is required'
    }),

  type: Joi.string()
    .trim()
    .required()
    .description('Appointment type (e.g., "Checkup", "Medication", "Emergency")')
    .messages({
      'any.required': 'Appointment type is required'
    }),

  startTime: Joi.date()
    .iso()
    .min('now')
    .required()
    .description('Appointment start time (ISO 8601, future date required)')
    .messages({
      'date.min': 'Start time must be in the future',
      'any.required': 'Start time is required'
    }),

  endTime: Joi.date()
    .iso()
    .greater(Joi.ref('startTime'))
    .optional()
    .description('Appointment end time (ISO 8601, must be after start time)')
    .messages({
      'date.greater': 'End time must be after start time'
    }),

  duration: Joi.number()
    .integer()
    .min(15)
    .max(120)
    .optional()
    .description('Appointment duration in minutes (15-120, default: 30)')
    .messages({
      'number.min': 'Duration must be at least 15 minutes',
      'number.max': 'Duration cannot exceed 120 minutes'
    }),

  reason: Joi.string()
    .trim()
    .max(500)
    .optional()
    .description('Reason for appointment'),

  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .description('Additional notes'),

  priority: Joi.string()
    .valid('LOW', 'MEDIUM', 'HIGH', 'URGENT')
    .optional()
    .description('Appointment priority level'),

  isFollowUp: Joi.boolean()
    .optional()
    .description('Whether this is a follow-up appointment'),

  parentAppointmentId: Joi.string()
    .uuid()
    .optional()
    .description('Parent appointment UUID if this is a follow-up')
});

export const updateAppointmentSchema = Joi.object({
  startTime: Joi.date()
    .iso()
    .optional(),

  endTime: Joi.date()
    .iso()
    .optional(),

  duration: Joi.number()
    .integer()
    .min(15)
    .max(120)
    .optional(),

  type: Joi.string()
    .trim()
    .optional(),

  reason: Joi.string()
    .trim()
    .max(500)
    .optional(),

  notes: Joi.string()
    .trim()
    .max(1000)
    .optional(),

  priority: Joi.string()
    .valid('LOW', 'MEDIUM', 'HIGH', 'URGENT')
    .optional(),

  status: Joi.string()
    .valid('SCHEDULED', 'RESCHEDULED')
    .optional()
    .description('Can only manually set to SCHEDULED or RESCHEDULED')
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const cancelAppointmentSchema = Joi.object({
  reason: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .description('Reason for cancellation (5-500 characters)')
    .messages({
      'string.min': 'Cancellation reason must be at least 5 characters',
      'string.max': 'Cancellation reason cannot exceed 500 characters',
      'any.required': 'Cancellation reason is required'
    })
});

export const completeAppointmentSchema = Joi.object({
  notes: Joi.string()
    .trim()
    .max(2000)
    .optional()
    .description('Completion notes'),

  outcomes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .description('Appointment outcomes and results'),

  followUpRequired: Joi.boolean()
    .optional()
    .description('Whether a follow-up appointment is needed'),

  followUpDate: Joi.date()
    .iso()
    .min('now')
    .optional()
    .description('Suggested follow-up date')
});

/**
 * Parameter Schemas
 */

export const appointmentIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('Appointment UUID')
});

export const nurseIdParamSchema = Joi.object({
  nurseId: Joi.string()
    .uuid()
    .required()
    .description('Nurse UUID')
});

export const waitlistIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('Waitlist entry UUID')
});

/**
 * Recurring Appointments Schema
 */

export const createRecurringAppointmentsSchema = Joi.object({
  baseData: Joi.object({
    studentId: Joi.string().uuid().required(),
    nurseId: Joi.string().uuid().required(),
    type: Joi.string().trim().required(),
    startTime: Joi.date().iso().min('now').required(),
    endTime: Joi.date().iso().greater(Joi.ref('startTime')).optional(),
    duration: Joi.number().integer().min(15).max(120).optional(),
    reason: Joi.string().trim().max(500).optional(),
    notes: Joi.string().trim().max(1000).optional(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').optional()
  }).required().description('Base appointment data to be repeated'),

  recurrencePattern: Joi.object({
    frequency: Joi.string()
      .valid('DAILY', 'WEEKLY', 'MONTHLY')
      .required()
      .description('Recurrence frequency'),

    interval: Joi.number()
      .integer()
      .min(1)
      .max(12)
      .optional()
      .description('Interval between occurrences (e.g., every 2 weeks)'),

    daysOfWeek: Joi.array()
      .items(Joi.number().integer().min(0).max(6))
      .optional()
      .description('Days of week for WEEKLY pattern (0=Sunday, 6=Saturday)'),

    endDate: Joi.date()
      .iso()
      .greater('now')
      .optional()
      .description('End date for recurrence'),

    occurrences: Joi.number()
      .integer()
      .min(1)
      .max(52)
      .optional()
      .description('Maximum number of occurrences')
  }).required().description('Recurrence pattern configuration')
    .messages({
      'any.required': 'Recurrence pattern is required'
    })
});

/**
 * Waitlist Schemas
 */

export const addToWaitlistSchema = Joi.object({
  studentId: Joi.string()
    .uuid()
    .required()
    .description('Student UUID')
    .messages({
      'any.required': 'Student ID is required'
    }),

  nurseId: Joi.string()
    .uuid()
    .optional()
    .description('Preferred nurse UUID (optional)'),

  type: Joi.string()
    .trim()
    .required()
    .description('Appointment type needed')
    .messages({
      'any.required': 'Appointment type is required'
    }),

  priority: Joi.string()
    .valid('LOW', 'MEDIUM', 'HIGH', 'URGENT')
    .optional()
    .description('Waitlist priority'),

  preferredDates: Joi.array()
    .items(Joi.date().iso().min('now'))
    .optional()
    .description('Preferred appointment dates'),

  notes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .description('Additional notes or requirements')
});

export const waitlistQuerySchema = Joi.object({
  nurseId: Joi.string()
    .uuid()
    .optional()
    .description('Filter by preferred nurse'),

  status: Joi.string()
    .valid('PENDING', 'CONTACTED', 'SCHEDULED', 'CANCELLED')
    .optional()
    .description('Filter by waitlist status'),

  priority: Joi.string()
    .valid('LOW', 'MEDIUM', 'HIGH', 'URGENT')
    .optional()
    .description('Filter by priority')
});

export const removeFromWaitlistSchema = Joi.object({
  reason: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .optional()
    .description('Reason for removal (optional)')
});

/**
 * Calendar Export Schema
 */

export const calendarExportQuerySchema = Joi.object({
  dateFrom: Joi.date()
    .iso()
    .optional()
    .description('Start date for calendar export'),

  dateTo: Joi.date()
    .iso()
    .optional()
    .description('End date for calendar export')
});
