/**
 * Medication Validation Schemas
 *
 * HIPAA-compliant validation schemas for medication-related forms.
 * All medication data is considered PHI (Protected Health Information).
 */

import { z } from 'zod';
import {
  dateSchema,
  timeSchema,
  dateTimeSchema,
  optionalDateSchema,
  optionalTimeSchema
} from '../common/date.schemas';
import { fileSchema, medicalFileSchema } from '../common/file.schemas';

/**
 * Medication types
 */
export const MEDICATION_TYPES = [
  'prescription',
  'over-the-counter',
  'herbal',
  'vitamin',
  'supplement'
] as const;

/**
 * Administration routes
 */
export const ADMINISTRATION_ROUTES = [
  'oral',
  'topical',
  'inhalation',
  'injection-subcutaneous',
  'injection-intramuscular',
  'injection-intravenous',
  'nasal',
  'ophthalmic',
  'otic',
  'rectal',
  'sublingual',
  'transdermal'
] as const;

/**
 * Administration frequencies
 */
export const FREQUENCIES = [
  'once-daily',
  'twice-daily',
  'three-times-daily',
  'four-times-daily',
  'every-4-hours',
  'every-6-hours',
  'every-8-hours',
  'every-12-hours',
  'as-needed',
  'weekly',
  'monthly',
  'other'
] as const;

/**
 * Medication status
 */
export const MEDICATION_STATUS = ['active', 'discontinued', 'expired', 'suspended'] as const;

/**
 * Units of measurement
 */
export const MEDICATION_UNITS = [
  'mg', 'ml', 'g', 'mcg', 'units',
  'tablet', 'capsule', 'drops', 'puffs',
  'patch', 'spray', 'other'
] as const;

/**
 * Create medication schema
 * PHI: ALL medication fields
 */
export const createMedicationSchema = z.object({
  // Student association
  studentId: z
    .string({ required_error: 'Student is required' })
    .uuid('Invalid student ID'),

  // Medication identification
  name: z
    .string({ required_error: 'Medication name is required' })
    .min(1, 'Medication name is required')
    .max(200, 'Medication name must be less than 200 characters')
    .trim(),

  genericName: z
    .string()
    .max(200, 'Generic name must be less than 200 characters')
    .trim()
    .optional()
    .nullable(),

  type: z.enum(MEDICATION_TYPES, {
    required_error: 'Medication type is required',
    invalid_type_error: 'Invalid medication type'
  }),

  // Prescription information
  prescriptionNumber: z
    .string()
    .max(100, 'Prescription number must be less than 100 characters')
    .trim()
    .optional()
    .nullable(),

  prescribedBy: z
    .string()
    .max(200, 'Prescriber name must be less than 200 characters')
    .trim()
    .optional()
    .nullable(),

  prescribedDate: optionalDateSchema,

  // Dosage information
  dosage: z
    .string({ required_error: 'Dosage is required' })
    .min(1, 'Dosage is required')
    .max(100, 'Dosage must be less than 100 characters')
    .trim(),

  dosageUnit: z.enum(MEDICATION_UNITS, {
    required_error: 'Dosage unit is required'
  }),

  // Administration
  route: z.enum(ADMINISTRATION_ROUTES, {
    required_error: 'Administration route is required',
    invalid_type_error: 'Invalid administration route'
  }),

  frequency: z.enum(FREQUENCIES, {
    required_error: 'Frequency is required',
    invalid_type_error: 'Invalid frequency'
  }),

  customFrequency: z
    .string()
    .max(200, 'Custom frequency must be less than 200 characters')
    .optional()
    .nullable(),

  // Timing
  startDate: dateSchema,

  endDate: optionalDateSchema,

  administrationTimes: z
    .array(timeSchema)
    .min(1, 'At least one administration time is required')
    .optional(),

  // Special instructions
  instructions: z
    .string()
    .max(1000, 'Instructions must be less than 1000 characters')
    .optional()
    .nullable(),

  sideEffects: z
    .string()
    .max(1000, 'Side effects must be less than 1000 characters')
    .optional()
    .nullable(),

  contraindications: z
    .string()
    .max(1000, 'Contraindications must be less than 1000 characters')
    .optional()
    .nullable(),

  // Storage and handling
  storageInstructions: z
    .string()
    .max(500, 'Storage instructions must be less than 500 characters')
    .optional()
    .nullable(),

  // Status
  status: z
    .enum(MEDICATION_STATUS)
    .default('active'),

  discontinuedDate: optionalDateSchema,

  discontinuedReason: z
    .string()
    .max(500, 'Reason must be less than 500 characters')
    .optional()
    .nullable(),

  // Additional information
  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .nullable()
});

/**
 * Update medication schema
 */
export const updateMedicationSchema = createMedicationSchema
  .partial()
  .extend({
    id: z.string().uuid('Invalid medication ID')
  });

/**
 * Medication administration record schema
 * PHI: ALL administration records
 */
export const medicationAdministrationSchema = z.object({
  medicationId: z
    .string({ required_error: 'Medication is required' })
    .uuid('Invalid medication ID'),

  studentId: z
    .string({ required_error: 'Student is required' })
    .uuid('Invalid student ID'),

  administeredAt: dateTimeSchema,

  administeredBy: z
    .string({ required_error: 'Administrator name is required' })
    .min(1, 'Administrator name is required')
    .max(200, 'Administrator name must be less than 200 characters')
    .trim(),

  dosageGiven: z
    .string({ required_error: 'Dosage given is required' })
    .min(1, 'Dosage given is required')
    .max(100, 'Dosage given must be less than 100 characters')
    .trim(),

  dosageUnit: z.enum(MEDICATION_UNITS),

  route: z.enum(ADMINISTRATION_ROUTES),

  // Observation and response
  studentResponse: z
    .string()
    .max(1000, 'Student response must be less than 1000 characters')
    .optional()
    .nullable(),

  adverseReaction: z
    .boolean()
    .default(false),

  adverseReactionDetails: z
    .string()
    .max(1000, 'Adverse reaction details must be less than 1000 characters')
    .optional()
    .nullable(),

  // Documentation
  witnessedBy: z
    .string()
    .max(200, 'Witness name must be less than 200 characters')
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable()
});

/**
 * Medication prescription schema
 * PHI: ALL prescription data
 */
export const prescriptionSchema = z.object({
  studentId: z
    .string({ required_error: 'Student is required' })
    .uuid('Invalid student ID'),

  prescriptionNumber: z
    .string({ required_error: 'Prescription number is required' })
    .min(1, 'Prescription number is required')
    .max(100, 'Prescription number must be less than 100 characters')
    .trim(),

  prescribedBy: z
    .string({ required_error: 'Prescriber name is required' })
    .min(1, 'Prescriber name is required')
    .max(200, 'Prescriber name must be less than 200 characters')
    .trim(),

  prescriberNPI: z
    .string()
    .regex(/^\d{10}$/, 'NPI must be 10 digits')
    .optional()
    .nullable(),

  prescriberPhone: z
    .string()
    .max(20, 'Phone must be less than 20 characters')
    .optional()
    .nullable(),

  prescribedDate: dateSchema,

  expirationDate: optionalDateSchema,

  refillsAllowed: z
    .number()
    .int()
    .min(0)
    .max(12)
    .default(0),

  refillsRemaining: z
    .number()
    .int()
    .min(0)
    .default(0),

  // Prescription document
  prescriptionDocument: medicalFileSchema.optional(),

  // Notes
  pharmacyInstructions: z
    .string()
    .max(500, 'Pharmacy instructions must be less than 500 characters')
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable()
});

/**
 * Medication schedule schema
 */
export const medicationScheduleSchema = z.object({
  medicationId: z
    .string({ required_error: 'Medication is required' })
    .uuid('Invalid medication ID'),

  dayOfWeek: z
    .enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .optional(),

  time: timeSchema,

  isActive: z.boolean().default(true),

  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .nullable()
});

/**
 * Medication search/filter schema
 */
export const medicationSearchSchema = z.object({
  search: z.string().max(200).optional(),

  studentId: z.string().uuid().optional(),

  name: z.string().max(200).optional(),

  type: z.enum(MEDICATION_TYPES).optional(),

  status: z.enum(MEDICATION_STATUS).optional(),

  startDate: optionalDateSchema,

  endDate: optionalDateSchema,

  // Pagination
  page: z.number().int().min(1).default(1),

  limit: z.number().int().min(1).max(100).default(20),

  // Sorting
  sortBy: z.enum(['name', 'startDate', 'status']).optional(),

  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

/**
 * PHI field markers for audit logging
 * ALL medication fields are PHI
 */
export const MEDICATION_PHI_FIELDS = [
  'name',
  'genericName',
  'dosage',
  'route',
  'frequency',
  'prescriptionNumber',
  'prescribedBy',
  'instructions',
  'sideEffects',
  'studentId'
] as const;

/**
 * Type exports
 */
export type CreateMedication = z.infer<typeof createMedicationSchema>;
export type UpdateMedication = z.infer<typeof updateMedicationSchema>;
export type MedicationAdministration = z.infer<typeof medicationAdministrationSchema>;
export type Prescription = z.infer<typeof prescriptionSchema>;
export type MedicationSchedule = z.infer<typeof medicationScheduleSchema>;
export type MedicationSearch = z.infer<typeof medicationSearchSchema>;
export type MedicationType = typeof MEDICATION_TYPES[number];
export type AdministrationRoute = typeof ADMINISTRATION_ROUTES[number];
export type Frequency = typeof FREQUENCIES[number];
export type MedicationStatus = typeof MEDICATION_STATUS[number];
export type MedicationUnit = typeof MEDICATION_UNITS[number];
