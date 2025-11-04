/**
 * @fileoverview Appointment Query Schemas
 * @module schemas/appointment/query
 *
 * Schemas for querying, filtering, and listing appointments.
 * Includes support for pagination, sorting, and calendar views.
 */

import { z } from 'zod';
import {
  studentIdSchema,
  nurseIdSchema,
  dateFieldSchema,
  prioritySchema,
  APPOINTMENT_STATUSES,
} from './appointment.base.schemas';

// ==========================================
// APPOINTMENT LIST QUERY
// ==========================================

/**
 * Appointment List Query Schema
 * Comprehensive filtering and pagination for appointment lists
 */
export const appointmentListQuerySchema = z.object({
  studentId: studentIdSchema.optional(),
  nurseId: nurseIdSchema.optional(),
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  priority: prioritySchema.optional(),
  appointmentType: z.string().optional(),
  startDate: dateFieldSchema.optional(),
  endDate: dateFieldSchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
  sortBy: z.enum(['scheduledDate', 'createdAt', 'priority', 'status']).default('scheduledDate'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type AppointmentListQuery = z.infer<typeof appointmentListQuerySchema>;

// ==========================================
// CALENDAR EVENTS QUERY
// ==========================================

/**
 * Calendar Events Query Schema
 * Retrieves appointments for calendar display within a date range
 */
export const calendarEventsQuerySchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
  nurseId: nurseIdSchema.optional(),
  studentId: studentIdSchema.optional(),
  statuses: z.array(z.enum(APPOINTMENT_STATUSES)).optional(),
});

export type CalendarEventsQuery = z.infer<typeof calendarEventsQuerySchema>;

// ==========================================
// VALIDATION REFINEMENTS
// ==========================================

/**
 * Refinement: Ensure end date is not before start date
 */
export const appointmentListQuerySchemaWithValidation = appointmentListQuerySchema.refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  }
);

export type AppointmentListQueryValidated = z.infer<
  typeof appointmentListQuerySchemaWithValidation
>;

/**
 * Refinement: Ensure calendar date range is logical
 */
export const calendarEventsQuerySchemaWithValidation = calendarEventsQuerySchema.refine(
  (data) => {
    return data.startDate <= data.endDate;
  },
  {
    message: 'Calendar end date must be on or after start date',
    path: ['endDate'],
  }
);

export type CalendarEventsQueryValidated = z.infer<typeof calendarEventsQuerySchemaWithValidation>;

/**
 * Refinement: Limit calendar date range to reasonable window (e.g., max 1 year)
 */
export const calendarEventsQuerySchemaWithRangeLimit = calendarEventsQuerySchema.refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 365;
  },
  {
    message: 'Calendar date range cannot exceed 365 days',
    path: ['endDate'],
  }
);

export type CalendarEventsQueryWithRangeLimit = z.infer<
  typeof calendarEventsQuerySchemaWithRangeLimit
>;
