/**
 * @fileoverview Appointment Waitlist Schemas
 * @module schemas/appointment/waitlist
 *
 * Schemas for managing appointment waitlists. Handles adding students to waitlists,
 * removing them, and automatically filling cancelled appointment slots.
 */

import { z } from 'zod';
import {
  studentIdSchema,
  appointmentIdSchema,
  dateFieldSchema,
  timeFieldSchema,
  prioritySchema,
  appointmentTypeSchema,
} from './appointment.base.schemas';

// ==========================================
// WAITLIST ENTRY
// ==========================================

/**
 * Waitlist Entry Schema
 * Adds a student to the waitlist with their preferences and requirements
 */
export const waitlistEntrySchema = z.object({
  studentId: studentIdSchema,
  requestedType: appointmentTypeSchema,
  requestedDate: dateFieldSchema.optional(),
  requestedTimeRange: z
    .object({
      start: timeFieldSchema,
      end: timeFieldSchema,
    })
    .optional(),
  priority: prioritySchema.default('medium'),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  expiresAt: z.string().datetime('Invalid expiration date').optional(),
});

export type WaitlistEntryInput = z.infer<typeof waitlistEntrySchema>;

// ==========================================
// REMOVE FROM WAITLIST
// ==========================================

/**
 * Remove from Waitlist Schema
 * Removes a student from the waitlist
 */
export const removeFromWaitlistSchema = z.object({
  waitlistId: z.string().uuid('Invalid waitlist ID format'),
  reason: z.string().max(500).optional(),
});

export type RemoveFromWaitlistInput = z.infer<typeof removeFromWaitlistSchema>;

// ==========================================
// FILL FROM WAITLIST
// ==========================================

/**
 * Fill from Waitlist Schema
 * Automatically fills a cancelled appointment slot from the waitlist
 */
export const fillFromWaitlistSchema = z.object({
  cancelledAppointmentId: appointmentIdSchema,
  autoFill: z.boolean().default(true),
  waitlistId: z.string().uuid('Invalid waitlist ID format').optional(),
});

export type FillFromWaitlistInput = z.infer<typeof fillFromWaitlistSchema>;

// ==========================================
// VALIDATION REFINEMENTS
// ==========================================

/**
 * Refinement: Validate time range is logical (start before end)
 */
export const waitlistEntrySchemaWithValidation = waitlistEntrySchema.refine(
  (data) => {
    if (data.requestedTimeRange) {
      const { start, end } = data.requestedTimeRange;
      return start < end;
    }
    return true;
  },
  {
    message: 'Start time must be before end time in requested time range',
    path: ['requestedTimeRange'],
  }
);

export type WaitlistEntryInputValidated = z.infer<typeof waitlistEntrySchemaWithValidation>;

/**
 * Refinement: When not auto-filling, waitlist ID must be provided
 */
export const fillFromWaitlistSchemaWithValidation = fillFromWaitlistSchema.refine(
  (data) => {
    if (!data.autoFill && !data.waitlistId) {
      return false;
    }
    return true;
  },
  {
    message: 'Waitlist ID is required when auto-fill is disabled',
    path: ['waitlistId'],
  }
);

export type FillFromWaitlistInputValidated = z.infer<typeof fillFromWaitlistSchemaWithValidation>;
