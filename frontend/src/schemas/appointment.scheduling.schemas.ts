/**
 * @fileoverview Appointment Scheduling Schemas
 * @module schemas/appointment/scheduling
 *
 * Schemas for conflict detection and available slot finding.
 * Ensures appointments don't overlap and helps find optimal scheduling times.
 */

import { z } from 'zod';
import {
  studentIdSchema,
  nurseIdSchema,
  appointmentIdSchema,
  dateFieldSchema,
  timeFieldSchema,
  durationSchema,
} from './appointment.base.schemas';

// ==========================================
// CONFLICT DETECTION
// ==========================================

/**
 * Conflict Check Schema
 * Validates if a proposed appointment time conflicts with existing appointments
 */
export const conflictCheckSchema = z.object({
  appointmentId: appointmentIdSchema.optional(), // Exclude this appointment (for reschedule)
  studentId: studentIdSchema,
  nurseId: nurseIdSchema.optional(),
  scheduledDate: dateFieldSchema,
  scheduledTime: timeFieldSchema,
  duration: durationSchema,
});

export type ConflictCheckInput = z.infer<typeof conflictCheckSchema>;

// ==========================================
// AVAILABLE SLOTS
// ==========================================

/**
 * Find Available Slots Schema
 * Searches for open time slots that can accommodate an appointment
 */
export const findAvailableSlotsSchema = z.object({
  studentId: studentIdSchema,
  nurseId: nurseIdSchema.optional(),
  date: dateFieldSchema,
  duration: durationSchema,
  startTime: timeFieldSchema.optional(),
  endTime: timeFieldSchema.optional(),
});

export type FindAvailableSlotsInput = z.infer<typeof findAvailableSlotsSchema>;

// ==========================================
// VALIDATION REFINEMENTS
// ==========================================

/**
 * Refinement: Validate search time range is logical (start before end)
 */
export const findAvailableSlotsSchemaWithValidation = findAvailableSlotsSchema.refine(
  (data) => {
    if (data.startTime && data.endTime) {
      return data.startTime < data.endTime;
    }
    return true;
  },
  {
    message: 'Start time must be before end time in search range',
    path: ['endTime'],
  }
);

export type FindAvailableSlotsInputValidated = z.infer<
  typeof findAvailableSlotsSchemaWithValidation
>;

/**
 * Refinement: Ensure duration fits within search window if both times provided
 */
export const findAvailableSlotsSchemaWithDurationCheck = findAvailableSlotsSchema.refine(
  (data) => {
    if (data.startTime && data.endTime) {
      // Parse times to calculate window in minutes
      const [startHour, startMin] = data.startTime.split(':').map(Number);
      const [endHour, endMin] = data.endTime.split(':').map(Number);
      const windowMinutes = (endHour - startHour) * 60 + (endMin - startMin);
      return data.duration <= windowMinutes;
    }
    return true;
  },
  {
    message: 'Appointment duration exceeds available time window',
    path: ['duration'],
  }
);

export type FindAvailableSlotsInputWithDurationCheck = z.infer<
  typeof findAvailableSlotsSchemaWithDurationCheck
>;
