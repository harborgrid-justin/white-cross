/**
 * @fileoverview Appointment Bulk Operations Schemas
 * @module schemas/appointment/bulk
 *
 * Schemas for bulk appointment operations. Enables efficient batch processing
 * of multiple appointments with validation and conflict checking.
 */

import { z } from 'zod';
import { appointmentCreateSchema } from './appointment.crud.schemas';

// ==========================================
// BULK CREATE
// ==========================================

/**
 * Bulk Create Appointments Schema
 * Creates multiple appointments in a single operation
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

// ==========================================
// BULK CANCEL
// ==========================================

/**
 * Bulk Cancel Appointments Schema
 * Cancels multiple appointments with a common reason
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
// VALIDATION REFINEMENTS
// ==========================================

/**
 * Refinement: Ensure no duplicate appointment IDs in bulk cancel
 */
export const bulkCancelAppointmentsSchemaWithValidation = bulkCancelAppointmentsSchema.refine(
  (data) => {
    const uniqueIds = new Set(data.appointmentIds);
    return uniqueIds.size === data.appointmentIds.length;
  },
  {
    message: 'Duplicate appointment IDs found in bulk cancel request',
    path: ['appointmentIds'],
  }
);

export type BulkCancelAppointmentsInputValidated = z.infer<
  typeof bulkCancelAppointmentsSchemaWithValidation
>;

/**
 * Refinement: Ensure no duplicate student/date/time combinations in bulk create
 */
export const bulkCreateAppointmentsSchemaWithValidation = bulkCreateAppointmentsSchema.refine(
  (data) => {
    const seen = new Set<string>();
    for (const apt of data.appointments) {
      const key = `${apt.studentId}-${apt.scheduledDate}-${apt.scheduledTime}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
    }
    return true;
  },
  {
    message: 'Duplicate appointments found in bulk create request (same student, date, time)',
    path: ['appointments'],
  }
);

export type BulkCreateAppointmentsInputValidated = z.infer<
  typeof bulkCreateAppointmentsSchemaWithValidation
>;
