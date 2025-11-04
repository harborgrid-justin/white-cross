/**
 * @fileoverview Witness base schemas and enums
 * @module schemas/incidents/witness.base
 *
 * Base schemas, enums, and witness information validation.
 */

import { z } from 'zod';

// ==========================================
// ENUMS & CONSTANTS
// ==========================================

/**
 * Witness Type Classification
 */
export const WitnessType = z.enum([
  'STUDENT',        // Student witness
  'STAFF',          // School staff member
  'TEACHER',        // Teacher witness
  'PARENT',         // Parent or guardian
  'VISITOR',        // School visitor
  'FIRST_RESPONDER', // Emergency personnel
  'OTHER',          // Other witness type
]);

export type WitnessTypeEnum = z.infer<typeof WitnessType>;

/**
 * Statement Status
 */
export const StatementStatus = z.enum([
  'PENDING',        // Statement not yet collected
  'DRAFT',          // Statement in progress
  'SUBMITTED',      // Statement submitted for review
  'VERIFIED',       // Statement verified and locked
  'DISPUTED',       // Statement disputed
  'AMENDED',        // Statement amended (creates new version)
]);

export type StatementStatusEnum = z.infer<typeof StatementStatus>;

/**
 * Witness Verification Method
 */
export const VerificationMethod = z.enum([
  'SIGNATURE',      // Physical signature
  'DIGITAL_SIGNATURE', // Digital signature with certificate
  'EMAIL_CONFIRMATION', // Email confirmation link
  'IN_PERSON',      // In-person verification
  'PHONE',          // Phone verification
  'NONE',           // No verification (draft)
]);

export type VerificationMethodEnum = z.infer<typeof VerificationMethod>;

// ==========================================
// WITNESS SCHEMA
// ==========================================

/**
 * Witness Information Schema
 */
export const WitnessSchema = z.object({
  // Identification
  id: z.string().uuid().optional(),
  incidentId: z.string().uuid({
    required_error: 'Incident ID is required',
  }),

  // Witness Details
  witnessType: WitnessType,

  // Contact Information
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email().optional(),
  phone: z.string().optional(),

  // Student-specific
  studentId: z.string().uuid().optional(), // If witness is a student
  grade: z.string().optional(),

  // Staff-specific
  staffId: z.string().uuid().optional(), // If witness is staff
  position: z.string().optional(),
  department: z.string().optional(),

  // Role in incident
  relationshipToIncident: z.string()
    .min(10, 'Please describe the witness relationship to the incident')
    .max(500),

  // Witness location during incident
  witnessLocation: z.string().max(200),
  distanceFromIncident: z.string().max(100).optional(), // e.g., "10 feet away"

  // Metadata
  addedAt: z.string().datetime().optional(),
  addedBy: z.string().uuid().optional(),
  addedByName: z.string().optional(),

  // Statement tracking
  statementProvided: z.boolean().default(false),
  statementDate: z.string().datetime().optional(),

  // Privacy
  consentToContact: z.boolean().default(true),
  consentRecordedAt: z.string().datetime().optional(),
});

export type Witness = z.infer<typeof WitnessSchema>;

// ==========================================
// CREATE/UPDATE SCHEMAS
// ==========================================

/**
 * Create Witness Schema
 */
export const CreateWitnessSchema = WitnessSchema.omit({
  id: true,
  addedAt: true,
  statementDate: true,
  consentRecordedAt: true,
});

export type CreateWitnessInput = z.infer<typeof CreateWitnessSchema>;

/**
 * Update Witness Schema
 */
export const UpdateWitnessSchema = WitnessSchema.partial().extend({
  id: z.string().uuid(),
});

export type UpdateWitnessInput = z.infer<typeof UpdateWitnessSchema>;
