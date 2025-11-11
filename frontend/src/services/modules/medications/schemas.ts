/**
 * @fileoverview Medication Validation Schemas
 *
 * Comprehensive Zod validation schemas for medication management including
 * medication creation, student assignment, administration logging, inventory
 * management, and adverse reaction reporting. Implements Five Rights validation
 * and DEA compliance for controlled substances.
 *
 * **Key Schema Categories:**
 * - Medication CRUD validation with DEA compliance
 * - Student medication assignment with Five Rights
 * - Administration logging with safety verification
 * - Inventory management with batch tracking
 * - Adverse reaction reporting schemas
 *
 * **Safety Features:**
 * - Five Rights enforcement (Patient, Medication, Dose, Route, Time)
 * - NDC and dosage format validation
 * - Controlled substance DEA schedule validation
 * - Cross-field validation for complex rules
 *
 * @module services/modules/medications/schemas
 */

import { z } from 'zod';
import {
  DOSAGE_FORMS,
  ADMINISTRATION_ROUTES,
  DEA_SCHEDULES,
  ADVERSE_REACTION_SEVERITY_LEVELS,
  NDC_REGEX,
  DOSAGE_REGEX,
  STRENGTH_REGEX,
  validateFrequency
} from './types';

/**
 * Schema for creating a new medication in the formulary
 *
 * Validates all required fields and enforces DEA compliance rules.
 * Implements cross-field validation for controlled substances.
 */
export const createMedicationSchema = z.object({
  name: z.string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(200, 'Medication name cannot exceed 200 characters')
    .trim(),

  genericName: z.string()
    .min(2, 'Generic name must be at least 2 characters')
    .max(200, 'Generic name cannot exceed 200 characters')
    .trim()
    .optional(),

  dosageForm: z.enum(DOSAGE_FORMS, {
    message: 'Please select a valid dosage form'
  }),

  strength: z.string()
    .regex(STRENGTH_REGEX, 'Strength must be in valid format (e.g., "500mg", "10ml", "50mcg")')
    .trim(),

  manufacturer: z.string()
    .max(200, 'Manufacturer name cannot exceed 200 characters')
    .trim()
    .optional(),

  ndc: z.string()
    .regex(NDC_REGEX, 'NDC must be in format: XXXXX-XXXX-XX or XXXXX-XXX-XX')
    .trim()
    .optional()
    .or(z.literal('')),

  isControlled: z.boolean().optional().default(false),

  deaSchedule: z.enum(DEA_SCHEDULES)
    .optional()
    .nullable(),
}).refine(
  (data) => {
    // Cross-field validation: DEA Schedule required for controlled substances
    if (data.isControlled && !data.deaSchedule) {
      return false;
    }
    return true;
  },
  {
    message: 'DEA Schedule is required for controlled substances',
    path: ['deaSchedule']
  }
);

/**
 * Schema for assigning medication to student (prescription)
 *
 * Implements Five Rights validation:
 * - Right Patient (studentId UUID required)
 * - Right Medication (medicationId UUID required)
 * - Right Dose (dosage validation)
 * - Right Route (administration route required)
 * - Right Time (start/end dates validated)
 */
export const assignMedicationSchema = z.object({
  studentId: z.string()
    .uuid('Student ID must be a valid UUID')
    .min(1, 'Student ID is required (Right Patient)'),

  medicationId: z.string()
    .uuid('Medication ID must be a valid UUID')
    .min(1, 'Medication ID is required (Right Medication)'),

  dosage: z.string()
    .regex(DOSAGE_REGEX, 'Dosage must be in valid format (e.g., "500mg", "2 tablets", "10ml")')
    .min(1, 'Dosage is required (Right Dose)')
    .trim(),

  frequency: z.string()
    .min(1, 'Frequency is required')
    .trim()
    .refine(
      validateFrequency,
      'Frequency must be valid (e.g., "twice daily", "every 6 hours", "as needed", "BID")'
    ),

  route: z.enum(ADMINISTRATION_ROUTES, {
    message: 'Route is required (Right Route)'
  }),

  instructions: z.string()
    .max(2000, 'Instructions cannot exceed 2000 characters')
    .trim()
    .optional(),

  startDate: z.string()
    .min(1, 'Start date is required')
    .refine(
      (date) => new Date(date) <= new Date(),
      'Start date cannot be in the future'
    ),

  endDate: z.string()
    .optional(),

  prescribedBy: z.string()
    .min(3, 'Prescribing physician name must be at least 3 characters')
    .max(200, 'Prescribing physician name cannot exceed 200 characters')
    .trim(),

  prescriptionNumber: z.string()
    .regex(/^[A-Z0-9]{6,20}$/i, 'Prescription number must be 6-20 alphanumeric characters')
    .trim()
    .optional(),

  refillsRemaining: z.number()
    .int()
    .min(0, 'Refills remaining cannot be negative')
    .max(12, 'Refills remaining cannot exceed 12')
    .optional()
    .default(0),
}).refine(
  (data) => {
    // Cross-field validation: endDate must be after startDate
    if (data.endDate && data.startDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
);

/**
 * Schema for logging medication administration
 *
 * CRITICAL: Implements Five Rights validation for patient safety.
 * All administration events must pass validation before being logged.
 */
export const logAdministrationSchema = z.object({
  studentMedicationId: z.string()
    .uuid('Student medication ID must be a valid UUID')
    .min(1, 'Student medication ID is required'),

  dosageGiven: z.string()
    .regex(DOSAGE_REGEX, 'Dosage given must be in valid format (e.g., "500mg", "2 tablets", "10ml")')
    .min(1, 'Dosage given is required (Right Dose)')
    .trim(),

  timeGiven: z.string()
    .min(1, 'Administration time is required (Right Time)')
    .refine(
      (date) => new Date(date) <= new Date(),
      'Administration time cannot be in the future'
    ),

  notes: z.string()
    .max(2000, 'Notes cannot exceed 2000 characters')
    .trim()
    .optional(),

  sideEffects: z.string()
    .max(2000, 'Side effects description cannot exceed 2000 characters')
    .trim()
    .optional(),

  deviceId: z.string()
    .max(100, 'Device ID cannot exceed 100 characters')
    .trim()
    .optional(),

  witnessId: z.string()
    .uuid('Witness ID must be a valid UUID')
    .optional(),

  witnessName: z.string()
    .max(200, 'Witness name cannot exceed 200 characters')
    .trim()
    .optional(),

  patientVerified: z.boolean().default(true),

  allergyChecked: z.boolean().default(true),
});

/**
 * Schema for adding medication to inventory
 *
 * Validates batch tracking, expiration dates, and quantity management.
 */
export const addToInventorySchema = z.object({
  medicationId: z.string()
    .uuid('Medication ID must be a valid UUID')
    .min(1, 'Medication ID is required'),

  batchNumber: z.string()
    .regex(/^[A-Z0-9-]{3,50}$/i, 'Batch number must be 3-50 alphanumeric characters')
    .trim(),

  expirationDate: z.string()
    .refine(
      (date) => new Date(date) > new Date(),
      'Expiration date must be in the future - cannot add expired medication'
    ),

  quantity: z.number()
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(100000, 'Quantity cannot exceed 100,000 units'),

  reorderLevel: z.number()
    .int()
    .min(0, 'Reorder level cannot be negative')
    .max(10000, 'Reorder level cannot exceed 10,000 units')
    .optional()
    .default(10),

  costPerUnit: z.number()
    .min(0, 'Cost per unit cannot be negative')
    .max(100000, 'Cost per unit cannot exceed $100,000')
    .optional(),

  supplier: z.string()
    .max(200, 'Supplier name cannot exceed 200 characters')
    .trim()
    .optional(),
});

/**
 * Schema for updating inventory quantity
 *
 * Validates quantity updates with reason tracking for audit trail.
 */
export const updateInventorySchema = z.object({
  quantity: z.number()
    .int()
    .min(0, 'Quantity cannot be negative')
    .max(100000, 'Quantity cannot exceed 100,000 units'),

  reason: z.string()
    .max(500, 'Reason cannot exceed 500 characters')
    .trim()
    .optional(),
});

/**
 * Schema for reporting adverse reactions
 *
 * CRITICAL: Adverse reactions are patient safety events requiring immediate
 * documentation and reporting to prescribing physician.
 */
export const reportAdverseReactionSchema = z.object({
  studentMedicationId: z.string()
    .uuid('Student medication ID must be a valid UUID')
    .min(1, 'Student medication ID is required'),

  severity: z.enum(ADVERSE_REACTION_SEVERITY_LEVELS, {
    message: 'Severity must be MILD, MODERATE, SEVERE, or LIFE_THREATENING'
  }),

  reaction: z.string()
    .min(10, 'Reaction description must be at least 10 characters')
    .max(2000, 'Reaction description cannot exceed 2000 characters')
    .trim(),

  actionTaken: z.string()
    .min(10, 'Action taken must be at least 10 characters')
    .max(2000, 'Action taken cannot exceed 2000 characters')
    .trim(),

  notes: z.string()
    .max(5000, 'Notes cannot exceed 5000 characters')
    .trim()
    .optional(),

  reportedAt: z.string()
    .refine(
      (date) => new Date(date) <= new Date(),
      'Reported time cannot be in the future'
    ),
});

/**
 * Schema for deactivating student medication
 *
 * Validates discontinuation with reason tracking.
 */
export const deactivateStudentMedicationSchema = z.object({
  reason: z.string()
    .min(5, 'Reason for discontinuation must be at least 5 characters')
    .max(500, 'Reason cannot exceed 500 characters')
    .trim()
    .optional(),
});

/**
 * Schema for medication filters
 *
 * Validates search and pagination parameters.
 */
export const medicationFiltersSchema = z.object({
  search: z.string()
    .max(200, 'Search term cannot exceed 200 characters')
    .trim()
    .optional(),

  category: z.string()
    .max(100, 'Category cannot exceed 100 characters')
    .trim()
    .optional(),

  isActive: z.boolean().optional(),

  controlledSubstance: z.boolean().optional(),

  page: z.number()
    .int()
    .min(1, 'Page must be at least 1')
    .max(10000, 'Page cannot exceed 10,000')
    .optional()
    .default(1),

  limit: z.number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(20),

  sort: z.string()
    .max(50, 'Sort field cannot exceed 50 characters')
    .optional(),

  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

/**
 * Schema for date range queries
 *
 * Validates date range parameters for schedules and reports.
 */
export const dateRangeSchema = z.object({
  startDate: z.string()
    .optional()
    .refine(
      (date) => !date || !isNaN(new Date(date).getTime()),
      'Start date must be a valid date'
    ),

  endDate: z.string()
    .optional()
    .refine(
      (date) => !date || !isNaN(new Date(date).getTime()),
      'End date must be a valid date'
    ),

  nurseId: z.string()
    .uuid('Nurse ID must be a valid UUID')
    .optional(),
}).refine(
  (data) => {
    // Cross-field validation: endDate must be after startDate
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
);

/**
 * Schema for reminder date queries
 *
 * Validates date parameter for medication reminders.
 */
export const reminderDateSchema = z.object({
  date: z.string()
    .optional()
    .refine(
      (date) => !date || !isNaN(new Date(date).getTime()),
      'Date must be a valid date'
    )
    .transform((date) => date || new Date().toISOString().split('T')[0]),
});

/**
 * Schema for updating medication
 *
 * Validates partial updates to existing medication.
 */
export const updateMedicationSchema = createMedicationSchema.partial();

/**
 * Helper function to validate Five Rights before administration
 *
 * @param data Administration data to validate
 * @returns Validation result with detailed error messages
 */
export function validateFiveRights(data: unknown) {
  return logAdministrationSchema.safeParse(data);
}

/**
 * Helper function to validate DEA compliance for controlled substances
 *
 * @param data Medication data to validate
 * @returns True if DEA compliance is satisfied
 */
export function validateDEACompliance(data: { isControlled?: boolean; deaSchedule?: string | null }) {
  if (data.isControlled && !data.deaSchedule) {
    return {
      success: false,
      error: 'DEA Schedule is required for controlled substances'
    };
  }
  return { success: true };
}

/**
 * Helper function to validate dosage format
 *
 * @param dosage Dosage string to validate
 * @returns Validation result
 */
export function validateDosageFormat(dosage: string) {
  const result = z.string().regex(DOSAGE_REGEX).safeParse(dosage);
  return {
    success: result.success,
    error: result.success ? undefined : 'Dosage must be in valid format (e.g., "500mg", "2 tablets", "10ml")'
  };
}

/**
 * Helper function to validate NDC format
 *
 * @param ndc NDC string to validate
 * @returns Validation result
 */
export function validateNDCFormat(ndc: string) {
  const result = z.string().regex(NDC_REGEX).safeParse(ndc);
  return {
    success: result.success,
    error: result.success ? undefined : 'NDC must be in format: XXXXX-XXXX-XX or XXXXX-XXX-XX'
  };
}

/**
 * Helper function to validate frequency format
 *
 * @param frequency Frequency string to validate
 * @returns Validation result
 */
export function validateFrequencyFormat(frequency: string) {
  const isValid = validateFrequency(frequency);
  return {
    success: isValid,
    error: isValid ? undefined : 'Frequency must be valid (e.g., "twice daily", "every 6 hours", "as needed", "BID")'
  };
}
