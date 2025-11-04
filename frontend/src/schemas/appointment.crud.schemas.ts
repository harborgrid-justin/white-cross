/**
 * @fileoverview Appointment CRUD Schemas
 * @module schemas/appointment/crud
 *
 * Schemas for creating, updating, rescheduling, canceling, completing,
 * and marking appointments as no-show. Core appointment lifecycle operations.
 */

import { z } from 'zod';
import {
  studentIdSchema,
  nurseIdSchema,
  appointmentIdSchema,
  dateFieldSchema,
  timeFieldSchema,
  durationSchema,
  appointmentTypeSchema,
  prioritySchema,
  notesSchema,
  reasonSchema,
  APPOINTMENT_STATUSES,
  APPOINTMENT_PRIORITIES,
} from './appointment.base.schemas';

// ==========================================
// CREATE APPOINTMENT
// ==========================================

/**
 * Create Appointment Schema
 * Used for scheduling new appointments
 */
export const appointmentCreateSchema = z.object({
  studentId: studentIdSchema,
  appointmentType: appointmentTypeSchema,
  scheduledDate: dateFieldSchema,
  scheduledTime: timeFieldSchema,
  duration: durationSchema,
  reason: reasonSchema,
  notes: notesSchema,
  priority: prioritySchema.default('medium'),
  reminderEnabled: z.boolean().default(true),
  nurseId: nurseIdSchema.optional(),
});

export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>;

// ==========================================
// UPDATE APPOINTMENT
// ==========================================

/**
 * Update Appointment Schema
 * All fields optional except appointment ID (provided separately)
 * Allows partial updates to existing appointments
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

// ==========================================
// RESCHEDULE APPOINTMENT
// ==========================================

/**
 * Reschedule Appointment Schema
 * Moves appointment to a new date/time with notification support
 */
export const appointmentRescheduleSchema = z.object({
  appointmentId: appointmentIdSchema,
  newDate: dateFieldSchema,
  newTime: timeFieldSchema,
  reason: z.string().min(3, 'Reason for rescheduling is required').max(500),
  notifyParent: z.boolean().default(true),
});

export type AppointmentRescheduleInput = z.infer<typeof appointmentRescheduleSchema>;

// ==========================================
// CANCEL APPOINTMENT
// ==========================================

/**
 * Cancel Appointment Schema
 * Cancels appointment with optional waitlist backfill
 */
export const appointmentCancelSchema = z.object({
  appointmentId: appointmentIdSchema,
  reason: z.string().min(3, 'Cancellation reason is required').max(500),
  notifyParent: z.boolean().default(true),
  offerWaitlist: z.boolean().default(true),
});

export type AppointmentCancelInput = z.infer<typeof appointmentCancelSchema>;

// ==========================================
// COMPLETE APPOINTMENT
// ==========================================

/**
 * Complete Appointment Schema
 * Marks appointment as completed with optional follow-up scheduling
 */
export const appointmentCompleteSchema = z.object({
  appointmentId: appointmentIdSchema,
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type AppointmentCompleteInput = z.infer<typeof appointmentCompleteSchema>;

// ==========================================
// NO-SHOW APPOINTMENT
// ==========================================

/**
 * Mark No-Show Schema
 * Records when a patient doesn't attend their scheduled appointment
 */
export const appointmentNoShowSchema = z.object({
  appointmentId: appointmentIdSchema,
  notes: z.string().max(2000).optional(),
  notifyParent: z.boolean().default(true),
});

export type AppointmentNoShowInput = z.infer<typeof appointmentNoShowSchema>;

// ==========================================
// VALIDATION REFINEMENTS
// ==========================================

/**
 * Refinement: Ensure follow-up date is provided when follow-up is required
 */
export const appointmentCompleteSchemaWithValidation = appointmentCompleteSchema.refine(
  (data) => {
    if (data.followUpRequired && !data.followUpDate) {
      return false;
    }
    return true;
  },
  {
    message: 'Follow-up date is required when follow-up is marked as required',
    path: ['followUpDate'],
  }
);

export type AppointmentCompleteInputValidated = z.infer<
  typeof appointmentCompleteSchemaWithValidation
>;
