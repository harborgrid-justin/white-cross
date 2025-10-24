/**
 * Medication Validation Schemas
 * Zod schemas for medication operations matching backend Joi validators
 *
 * Backend Reference: /backend/src/validators/medicationValidators.ts
 * Database Schema: NEW SCHEMA with separate tables:
 *   - medications (formulary)
 *   - student_medications (prescriptions)
 *   - medication_logs (administration records)
 *   - medication_inventory (stock tracking)
 *   - adverse_reactions (safety reporting)
 *
 * SAFETY CRITICAL: Implements Five Rights of Medication Administration
 *   - Right Patient
 *   - Right Medication
 *   - Right Dose
 *   - Right Route
 *   - Right Time
 */

import { z } from 'zod';

// ============================================================================
// VALIDATION PATTERNS AND CONSTANTS
// ============================================================================

/**
 * NDC (National Drug Code) format validation
 * Format: XXXXX-XXXX-XX (5-4-2) or XXXXX-XXX-XX (5-3-2)
 */
const NDC_PATTERN = /^[0-9]{5}-([0-9]{3,4})-[0-9]{2}$/;

/**
 * Dosage format validation
 * Examples: "500mg", "10ml", "2 tablets", "1 unit", "0.5mg"
 * Units: mg, g, mcg, ml, L, units, tablets, capsules, drops, puff, patch, spray, application, mEq, %
 */
const DOSAGE_PATTERN = /^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|tablets?|capsules?|drops?|puff|patch|spray|application|mEq|%)$/i;

/**
 * Strength format validation (for medication formulary)
 * Examples: "500mg", "10ml", "50mcg"
 */
const STRENGTH_PATTERN = /^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|mEq|%)$/i;

/**
 * Frequency validation patterns for medication administration schedules
 * Supports standard medical abbreviations and common phrases
 */
const FREQUENCY_PATTERNS = [
  /^(once|twice|1x|2x|3x|4x)\s*(daily|per day)$/i,
  /^(three|four|five|six)\s*times\s*(daily|per day|a day)$/i,
  /^every\s+[0-9]+\s+(hour|hours|hr|hrs)$/i,
  /^(q[0-9]+h|qid|tid|bid|qd|qhs|prn|ac|pc|hs)$/i,
  /^as\s+needed$/i,
  /^before\s+(meals|breakfast|lunch|dinner|bedtime)$/i,
  /^after\s+(meals|breakfast|lunch|dinner)$/i,
  /^at\s+bedtime$/i,
  /^weekly$/i,
  /^monthly$/i,
];

/**
 * DEA Schedule classifications for controlled substances
 */
const DEA_SCHEDULES = ['I', 'II', 'III', 'IV', 'V'] as const;

/**
 * Dosage forms (pharmaceutical forms)
 */
const DOSAGE_FORMS = [
  'Tablet',
  'Capsule',
  'Liquid',
  'Injection',
  'Topical',
  'Inhaler',
  'Drops',
  'Patch',
  'Suppository',
  'Powder',
  'Cream',
  'Ointment',
  'Gel',
  'Spray',
  'Lozenge',
] as const;

/**
 * Administration routes (Right Route)
 */
const ADMINISTRATION_ROUTES = [
  'Oral',
  'Sublingual',
  'Topical',
  'Intravenous',
  'Intramuscular',
  'Subcutaneous',
  'Inhalation',
  'Ophthalmic',
  'Otic',
  'Nasal',
  'Rectal',
  'Transdermal',
] as const;

/**
 * Inventory adjustment types for audit trail
 */
const ADJUSTMENT_TYPES = [
  'CORRECTION',
  'DISPOSAL',
  'TRANSFER',
  'ADMINISTRATION',
  'EXPIRED',
  'LOST',
  'DAMAGED',
  'RETURNED',
] as const;

/**
 * Adverse reaction severity levels
 */
const REACTION_SEVERITY_LEVELS = [
  'MILD',
  'MODERATE',
  'SEVERE',
  'LIFE_THREATENING',
] as const;

/**
 * Medication deactivation types
 */
const DEACTIVATION_TYPES = [
  'COMPLETED',
  'DISCONTINUED',
  'CHANGED',
  'ADVERSE_REACTION',
  'PATIENT_REQUEST',
  'PHYSICIAN_ORDER',
  'OTHER',
] as const;

/**
 * Prescription number pattern (6-20 alphanumeric characters)
 */
const PRESCRIPTION_NUMBER_PATTERN = /^[A-Z0-9]{6,20}$/i;

/**
 * Batch number pattern (3-50 alphanumeric with hyphens)
 */
const BATCH_NUMBER_PATTERN = /^[A-Z0-9-]{3,50}$/i;

// ============================================================================
// HELPER SCHEMAS
// ============================================================================

/**
 * UUID validation schema
 */
const uuidSchema = z.string().uuid({ message: 'Must be a valid UUID' });

/**
 * Frequency validation with custom refinement
 */
const frequencySchema = z
  .string()
  .min(1, 'Frequency is required')
  .refine(
    (value) => {
      const normalized = value.trim().toLowerCase();
      return FREQUENCY_PATTERNS.some((pattern) => pattern.test(normalized));
    },
    {
      message:
        'Frequency must be valid (e.g., "twice daily", "every 6 hours", "as needed", "BID", "TID")',
    }
  );

// ============================================================================
// MEDICATION (FORMULARY) VALIDATION
// ============================================================================

/**
 * Create Medication Schema
 * For creating a new medication in the formulary
 *
 * Backend Reference: createMedicationSchema
 */
export const createMedicationSchema = z
  .object({
    name: z
      .string({ message: 'Medication name is required' })
      .min(2, 'Medication name must be at least 2 characters')
      .max(200, 'Medication name cannot exceed 200 characters')
      .transform((val) => val.trim()),

    genericName: z
      .string()
      .min(2, 'Generic name must be at least 2 characters')
      .max(200, 'Generic name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    dosageForm: z.enum(DOSAGE_FORMS, {
      errorMap: () => ({ message: 'Dosage form must be a valid pharmaceutical form' }),
    }),

    strength: z
      .string({ message: 'Strength is required' })
      .regex(
        STRENGTH_PATTERN,
        'Strength must be in valid format (e.g., "500mg", "10ml", "50mcg")'
      )
      .transform((val) => val.trim()),

    manufacturer: z
      .string()
      .max(200, 'Manufacturer name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    ndc: z
      .string()
      .regex(NDC_PATTERN, 'NDC must be in format: XXXXX-XXXX-XX or XXXXX-XXX-XX')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    isControlled: z.boolean().default(false),

    deaSchedule: z.enum(DEA_SCHEDULES).optional().nullable(),

    requiresWitness: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Controlled substances MUST have DEA Schedule
      if (data.isControlled && !data.deaSchedule) {
        return false;
      }
      return true;
    },
    {
      message: 'DEA Schedule is required for controlled substances',
      path: ['deaSchedule'],
    }
  )
  .transform((data) => {
    // Schedule I and II substances automatically require witness
    if (data.deaSchedule === 'I' || data.deaSchedule === 'II') {
      return { ...data, requiresWitness: true };
    }
    // Default requiresWitness to false for non-Schedule I/II
    if (data.requiresWitness === undefined) {
      return { ...data, requiresWitness: false };
    }
    return data;
  });

/**
 * Update Medication Schema
 * For updating an existing medication
 *
 * Backend Reference: updateMedicationSchema
 */
export const updateMedicationSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Medication name must be at least 2 characters')
      .max(200, 'Medication name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional(),

    genericName: z
      .string()
      .min(2, 'Generic name must be at least 2 characters')
      .max(200, 'Generic name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    dosageForm: z
      .enum(DOSAGE_FORMS, {
        errorMap: () => ({ message: 'Dosage form must be a valid pharmaceutical form' }),
      })
      .optional(),

    strength: z
      .string()
      .regex(
        STRENGTH_PATTERN,
        'Strength must be in valid format (e.g., "500mg", "10ml", "50mcg")'
      )
      .transform((val) => val.trim())
      .optional(),

    manufacturer: z
      .string()
      .max(200, 'Manufacturer name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    ndc: z
      .string()
      .regex(NDC_PATTERN, 'NDC must be in format: XXXXX-XXXX-XX or XXXXX-XXX-XX')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    isControlled: z.boolean().optional(),

    deaSchedule: z.enum(DEA_SCHEDULES).optional().nullable(),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// ============================================================================
// PRESCRIPTION (STUDENT MEDICATION) VALIDATION
// ============================================================================

/**
 * Assign Medication to Student Schema
 * For creating a prescription (student medication record)
 *
 * Backend Reference: assignMedicationToStudentSchema
 * Safety: Implements Five Rights of Medication Administration
 */
export const assignMedicationToStudentSchema = z.object({
  studentId: z
    .string({ message: 'Student ID is required (Right Patient)' })
    .uuid('Student ID must be a valid UUID'),

  medicationId: z
    .string({ message: 'Medication ID is required (Right Medication)' })
    .uuid('Medication ID must be a valid UUID'),

  dosage: z
    .string({ message: 'Dosage is required (Right Dose)' })
    .regex(
      DOSAGE_PATTERN,
      'Dosage must be in valid format (e.g., "500mg", "2 tablets", "10ml")'
    )
    .transform((val) => val.trim()),

  frequency: frequencySchema,

  route: z.enum(ADMINISTRATION_ROUTES, {
    errorMap: () => ({
      message: 'Administration route is required (Right Route)',
    }),
  }),

  instructions: z
    .string()
    .max(2000, 'Instructions cannot exceed 2000 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  startDate: z
    .string({ message: 'Start date is required' })
    .datetime()
    .refine((val) => new Date(val) <= new Date(), 'Start date cannot be in the future'),

  endDate: z
    .string()
    .datetime()
    .optional()
    .nullable(),

  prescribedBy: z
    .string({ message: 'Prescribing physician is required' })
    .min(3, 'Prescribing physician name must be at least 3 characters')
    .max(200, 'Prescribing physician name cannot exceed 200 characters')
    .transform((val) => val.trim()),

  prescriptionNumber: z
    .string()
    .regex(
      PRESCRIPTION_NUMBER_PATTERN,
      'Prescription number must be 6-20 alphanumeric characters'
    )
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  refillsRemaining: z
    .number()
    .int()
    .min(0, 'Refills remaining cannot be negative')
    .max(12, 'Refills remaining cannot exceed 12')
    .default(0),
}).refine(
  (data) => {
    // End date must be after start date if provided
    if (data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

/**
 * Update Student Medication Schema
 * For updating an existing prescription
 *
 * Backend Reference: updateStudentMedicationSchema
 */
export const updateStudentMedicationSchema = z
  .object({
    dosage: z
      .string()
      .regex(
        DOSAGE_PATTERN,
        'Dosage must be in valid format (e.g., "500mg", "2 tablets", "10ml")'
      )
      .transform((val) => val.trim())
      .optional(),

    frequency: frequencySchema.optional(),

    route: z
      .enum(ADMINISTRATION_ROUTES, {
        errorMap: () => ({ message: 'Route must be a valid administration route' }),
      })
      .optional(),

    instructions: z
      .string()
      .max(2000, 'Instructions cannot exceed 2000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    endDate: z.string().datetime().optional().nullable(),

    isActive: z.boolean().optional(),

    refillsRemaining: z
      .number()
      .int()
      .min(0, 'Refills remaining cannot be negative')
      .max(12, 'Refills remaining cannot exceed 12')
      .optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// ============================================================================
// MEDICATION ADMINISTRATION VALIDATION
// ============================================================================

/**
 * Log Medication Administration Schema
 * CRITICAL FOR PATIENT SAFETY - Implements Five Rights
 *
 * Backend Reference: logMedicationAdministrationSchema
 */
export const logMedicationAdministrationSchema = z.object({
  studentMedicationId: z
    .string({ message: 'Student medication ID is required' })
    .uuid('Student medication ID must be a valid UUID'),

  dosageGiven: z
    .string({ message: 'Dosage given is required (Right Dose)' })
    .regex(
      DOSAGE_PATTERN,
      'Dosage given must be in valid format (e.g., "500mg", "2 tablets", "10ml")'
    )
    .transform((val) => val.trim()),

  timeGiven: z
    .string({ message: 'Administration time is required (Right Time)' })
    .datetime()
    .refine(
      (val) => new Date(val) <= new Date(),
      'Administration time cannot be in the future'
    ),

  notes: z
    .string()
    .max(2000, 'Notes cannot exceed 2000 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  sideEffects: z
    .string()
    .max(2000, 'Side effects description cannot exceed 2000 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  deviceId: z
    .string()
    .max(100, 'Device ID cannot exceed 100 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  witnessId: z
    .string()
    .uuid('Witness ID must be a valid UUID')
    .optional()
    .nullable(),

  witnessName: z
    .string()
    .max(200, 'Witness name cannot exceed 200 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  patientVerified: z.boolean().default(true),

  allergyChecked: z.boolean().default(true),
});

// ============================================================================
// INVENTORY VALIDATION
// ============================================================================

/**
 * Add to Inventory Schema
 * For adding medication stock to inventory
 *
 * Backend Reference: addToInventorySchema
 */
export const addToInventorySchema = z.object({
  medicationId: z
    .string({ message: 'Medication ID is required' })
    .uuid('Medication ID must be a valid UUID'),

  batchNumber: z
    .string({ message: 'Batch number is required' })
    .regex(
      BATCH_NUMBER_PATTERN,
      'Batch number must be 3-50 alphanumeric characters (may include hyphens)'
    )
    .transform((val) => val.trim()),

  expirationDate: z
    .string({ message: 'Expiration date is required' })
    .datetime()
    .refine(
      (val) => new Date(val) > new Date(),
      'Expiration date must be in the future - cannot add expired medication'
    ),

  quantity: z
    .number({ message: 'Quantity is required' })
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(100000, 'Quantity cannot exceed 100,000 units'),

  reorderLevel: z
    .number()
    .int()
    .min(0, 'Reorder level cannot be negative')
    .max(10000, 'Reorder level cannot exceed 10,000 units')
    .default(10),

  costPerUnit: z
    .number()
    .min(0, 'Cost per unit cannot be negative')
    .max(100000, 'Cost per unit cannot exceed $100,000')
    .optional()
    .nullable(),

  supplier: z
    .string()
    .max(200, 'Supplier name cannot exceed 200 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  location: z
    .string()
    .max(200, 'Storage location cannot exceed 200 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),
});

/**
 * Update Inventory Quantity Schema
 * For adjusting inventory with audit trail
 *
 * Backend Reference: updateInventoryQuantitySchema
 */
export const updateInventoryQuantitySchema = z.object({
  quantity: z
    .number({ message: 'New quantity is required' })
    .int()
    .min(0, 'Quantity cannot be negative')
    .max(100000, 'Quantity cannot exceed 100,000 units'),

  reason: z
    .string({ message: 'Reason for quantity adjustment is required for audit trail' })
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason cannot exceed 500 characters')
    .transform((val) => val.trim()),

  adjustmentType: z.enum(ADJUSTMENT_TYPES, {
    errorMap: () => ({ message: 'Adjustment type is required for audit trail' }),
  }),
});

// ============================================================================
// ADVERSE REACTION VALIDATION
// ============================================================================

/**
 * Report Adverse Reaction Schema
 * For reporting adverse medication reactions
 *
 * Backend Reference: reportAdverseReactionSchema
 */
export const reportAdverseReactionSchema = z
  .object({
    studentMedicationId: z
      .string({ message: 'Student medication ID is required' })
      .uuid('Student medication ID must be a valid UUID'),

    severity: z.enum(REACTION_SEVERITY_LEVELS, {
      errorMap: () => ({
        message: 'Severity must be MILD, MODERATE, SEVERE, or LIFE_THREATENING',
      }),
    }),

    reaction: z
      .string({ message: 'Reaction description is required' })
      .min(10, 'Reaction description must be at least 10 characters')
      .max(2000, 'Reaction description cannot exceed 2000 characters')
      .transform((val) => val.trim()),

    actionTaken: z
      .string({ message: 'Action taken is required' })
      .min(10, 'Action taken must be at least 10 characters')
      .max(2000, 'Action taken cannot exceed 2000 characters')
      .transform((val) => val.trim()),

    notes: z
      .string()
      .max(5000, 'Notes cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    reportedAt: z
      .string({ message: 'Reported time is required' })
      .datetime()
      .refine((val) => new Date(val) <= new Date(), 'Reported time cannot be in the future'),

    emergencyServicesContacted: z.boolean().optional(),

    parentNotified: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // For SEVERE or LIFE_THREATENING, must indicate if emergency services were contacted
      if (data.severity === 'SEVERE' || data.severity === 'LIFE_THREATENING') {
        return data.emergencyServicesContacted !== undefined;
      }
      return true;
    },
    {
      message:
        'Must indicate if emergency services were contacted for SEVERE or LIFE_THREATENING reactions',
      path: ['emergencyServicesContacted'],
    }
  )
  .refine(
    (data) => {
      // For MODERATE, SEVERE, or LIFE_THREATENING, must indicate if parent was notified
      if (
        data.severity === 'MODERATE' ||
        data.severity === 'SEVERE' ||
        data.severity === 'LIFE_THREATENING'
      ) {
        return data.parentNotified !== undefined;
      }
      return true;
    },
    {
      message:
        'Must indicate if parent was notified for MODERATE, SEVERE, or LIFE_THREATENING reactions',
      path: ['parentNotified'],
    }
  );

// ============================================================================
// DEACTIVATION VALIDATION
// ============================================================================

/**
 * Deactivate Student Medication Schema
 * For deactivating a prescription with audit trail
 *
 * Backend Reference: deactivateStudentMedicationSchema
 */
export const deactivateStudentMedicationSchema = z.object({
  reason: z
    .string({ message: 'Reason is required for audit trail' })
    .min(10, 'Deactivation reason must be at least 10 characters')
    .max(500, 'Deactivation reason cannot exceed 500 characters')
    .transform((val) => val.trim()),

  deactivationType: z.enum(DEACTIVATION_TYPES, {
    errorMap: () => ({ message: 'Deactivation type is required' }),
  }),
});

// ============================================================================
// QUERY/FILTER VALIDATION SCHEMAS
// ============================================================================

/**
 * List Medications Query Schema
 */
export const listMedicationsQuerySchema = z.object({
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
  search: z.string().optional(),
  isControlled: z.boolean().optional(),
  deaSchedule: z.enum(DEA_SCHEDULES).optional(),
});

/**
 * Student Medication Logs Query Schema
 */
export const studentLogsQuerySchema = z.object({
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

/**
 * Medication Schedule Query Schema
 */
export const scheduleQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  studentId: z.string().uuid().optional(),
});

/**
 * Adverse Reactions Query Schema
 */
export const adverseReactionsQuerySchema = z.object({
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
  medicationId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  severity: z.enum(REACTION_SEVERITY_LEVELS).optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
export type UpdateMedicationInput = z.infer<typeof updateMedicationSchema>;
export type AssignMedicationToStudentInput = z.infer<typeof assignMedicationToStudentSchema>;
export type UpdateStudentMedicationInput = z.infer<typeof updateStudentMedicationSchema>;
export type LogMedicationAdministrationInput = z.infer<
  typeof logMedicationAdministrationSchema
>;
export type AddToInventoryInput = z.infer<typeof addToInventorySchema>;
export type UpdateInventoryQuantityInput = z.infer<typeof updateInventoryQuantitySchema>;
export type ReportAdverseReactionInput = z.infer<typeof reportAdverseReactionSchema>;
export type DeactivateStudentMedicationInput = z.infer<
  typeof deactivateStudentMedicationSchema
>;
export type ListMedicationsQueryInput = z.infer<typeof listMedicationsQuerySchema>;
export type StudentLogsQueryInput = z.infer<typeof studentLogsQuerySchema>;
export type ScheduleQueryInput = z.infer<typeof scheduleQuerySchema>;
export type AdverseReactionsQueryInput = z.infer<typeof adverseReactionsQuerySchema>;

// ============================================================================
// CONSTANTS EXPORTS
// ============================================================================

export {
  DOSAGE_FORMS,
  ADMINISTRATION_ROUTES,
  DEA_SCHEDULES,
  ADJUSTMENT_TYPES,
  REACTION_SEVERITY_LEVELS,
  DEACTIVATION_TYPES,
};
