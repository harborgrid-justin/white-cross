/**
 * Health Record Validation Schemas
 *
 * HIPAA-compliant validation schemas for health records.
 * All health record data is PHI (Protected Health Information).
 */

import { z } from 'zod';
import {
  dateSchema,
  optionalDateSchema,
  pastDateSchema
} from '../common/date.schemas';
import { medicalFileSchema } from '../common/file.schemas';

/**
 * Allergy severity levels
 */
export const ALLERGY_SEVERITY = ['mild', 'moderate', 'severe', 'life-threatening'] as const;

/**
 * Allergy types
 */
export const ALLERGY_TYPES = [
  'food',
  'medication',
  'environmental',
  'insect',
  'latex',
  'other'
] as const;

/**
 * Immunization status
 */
export const IMMUNIZATION_STATUS = ['completed', 'due', 'overdue', 'exempted'] as const;

/**
 * Condition types
 */
export const CONDITION_TYPES = [
  'chronic',
  'acute',
  'hereditary',
  'congenital',
  'mental-health',
  'developmental',
  'other'
] as const;

/**
 * Vital signs units
 */
export const BP_UNITS = ['mmHg'] as const;
export const TEMP_UNITS = ['F', 'C'] as const;
export const HEIGHT_UNITS = ['in', 'cm'] as const;
export const WEIGHT_UNITS = ['lb', 'kg'] as const;

/**
 * Allergy schema (PHI - ALL fields)
 */
export const allergySchema = z.object({
  studentId: z
    .string({ required_error: 'Student is required' })
    .uuid('Invalid student ID'),

  allergen: z
    .string({ required_error: 'Allergen is required' })
    .min(1, 'Allergen is required')
    .max(200, 'Allergen must be less than 200 characters')
    .trim(),

  type: z.enum(ALLERGY_TYPES, {
    required_error: 'Allergy type is required',
    invalid_type_error: 'Invalid allergy type'
  }),

  severity: z.enum(ALLERGY_SEVERITY, {
    required_error: 'Severity is required',
    invalid_type_error: 'Invalid severity level'
  }),

  reaction: z
    .string({ required_error: 'Reaction is required' })
    .min(1, 'Reaction is required')
    .max(500, 'Reaction must be less than 500 characters')
    .trim(),

  treatment: z
    .string()
    .max(500, 'Treatment must be less than 500 characters')
    .optional()
    .nullable(),

  onsetDate: optionalDateSchema,

  diagnosedBy: z
    .string()
    .max(200, 'Diagnosing provider must be less than 200 characters')
    .optional()
    .nullable(),

  requiresEpiPen: z.boolean().default(false),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable(),

  isActive: z.boolean().default(true)
});

/**
 * Immunization schema (PHI - ALL fields)
 */
export const immunizationSchema = z.object({
  studentId: z
    .string({ required_error: 'Student is required' })
    .uuid('Invalid student ID'),

  vaccineName: z
    .string({ required_error: 'Vaccine name is required' })
    .min(1, 'Vaccine name is required')
    .max(200, 'Vaccine name must be less than 200 characters')
    .trim(),

  cvxCode: z
    .string()
    .max(20, 'CVX code must be less than 20 characters')
    .optional()
    .nullable(),

  doseNumber: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .nullable(),

  totalDoses: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .nullable(),

  administeredDate: dateSchema,

  expirationDate: optionalDateSchema,

  lotNumber: z
    .string()
    .max(100, 'Lot number must be less than 100 characters')
    .optional()
    .nullable(),

  manufacturer: z
    .string()
    .max(200, 'Manufacturer must be less than 200 characters')
    .optional()
    .nullable(),

  administeredBy: z
    .string()
    .max(200, 'Administrator name must be less than 200 characters')
    .optional()
    .nullable(),

  administrationSite: z
    .string()
    .max(100, 'Administration site must be less than 100 characters')
    .optional()
    .nullable(),

  route: z
    .enum(['oral', 'intranasal', 'intramuscular', 'subcutaneous', 'other'])
    .optional(),

  status: z.enum(IMMUNIZATION_STATUS).default('completed'),

  nextDueDate: optionalDateSchema,

  documentationFile: medicalFileSchema.optional(),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable()
});

/**
 * Medical condition schema (PHI - ALL fields)
 */
export const conditionSchema = z.object({
  studentId: z
    .string({ required_error: 'Student is required' })
    .uuid('Invalid student ID'),

  condition: z
    .string({ required_error: 'Condition is required' })
    .min(1, 'Condition is required')
    .max(200, 'Condition must be less than 200 characters')
    .trim(),

  type: z.enum(CONDITION_TYPES, {
    required_error: 'Condition type is required',
    invalid_type_error: 'Invalid condition type'
  }),

  icd10Code: z
    .string()
    .max(20, 'ICD-10 code must be less than 20 characters')
    .optional()
    .nullable(),

  diagnosedDate: optionalDateSchema,

  diagnosedBy: z
    .string()
    .max(200, 'Diagnosing provider must be less than 200 characters')
    .optional()
    .nullable(),

  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .nullable(),

  treatment: z
    .string()
    .max(1000, 'Treatment must be less than 1000 characters')
    .optional()
    .nullable(),

  managementPlan: z
    .string()
    .max(2000, 'Management plan must be less than 2000 characters')
    .optional()
    .nullable(),

  triggers: z
    .string()
    .max(500, 'Triggers must be less than 500 characters')
    .optional()
    .nullable(),

  accommodations: z
    .string()
    .max(1000, 'Accommodations must be less than 1000 characters')
    .optional()
    .nullable(),

  resolvedDate: optionalDateSchema,

  isActive: z.boolean().default(true),

  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .nullable()
});

/**
 * Vital signs schema (PHI - ALL fields)
 */
export const vitalSignsSchema = z.object({
  studentId: z
    .string({ required_error: 'Student is required' })
    .uuid('Invalid student ID'),

  recordedAt: dateSchema,

  recordedBy: z
    .string({ required_error: 'Recorded by is required' })
    .min(1, 'Recorded by is required')
    .max(200, 'Recorded by must be less than 200 characters')
    .trim(),

  // Blood pressure
  systolic: z
    .number()
    .int()
    .min(50)
    .max(250)
    .optional()
    .nullable(),

  diastolic: z
    .number()
    .int()
    .min(30)
    .max(150)
    .optional()
    .nullable(),

  bpUnit: z.enum(BP_UNITS).default('mmHg').optional(),

  // Temperature
  temperature: z
    .number()
    .min(90)
    .max(110)
    .optional()
    .nullable(),

  temperatureUnit: z.enum(TEMP_UNITS).default('F').optional(),

  // Pulse
  pulse: z
    .number()
    .int()
    .min(30)
    .max(220)
    .optional()
    .nullable(),

  // Respiratory rate
  respiratoryRate: z
    .number()
    .int()
    .min(8)
    .max(60)
    .optional()
    .nullable(),

  // Oxygen saturation
  oxygenSaturation: z
    .number()
    .int()
    .min(70)
    .max(100)
    .optional()
    .nullable(),

  // Height and weight
  height: z
    .number()
    .min(0)
    .max(300)
    .optional()
    .nullable(),

  heightUnit: z.enum(HEIGHT_UNITS).default('in').optional(),

  weight: z
    .number()
    .min(0)
    .max(1000)
    .optional()
    .nullable(),

  weightUnit: z.enum(WEIGHT_UNITS).default('lb').optional(),

  // BMI (calculated)
  bmi: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .nullable()
});

/**
 * Medical history schema (PHI - ALL fields)
 */
export const medicalHistorySchema = z.object({
  studentId: z
    .string({ required_error: 'Student is required' })
    .uuid('Invalid student ID'),

  recordDate: dateSchema,

  // Family history
  familyHistory: z
    .string()
    .max(2000, 'Family history must be less than 2000 characters')
    .optional()
    .nullable(),

  // Past illnesses and surgeries
  pastIllnesses: z
    .string()
    .max(2000, 'Past illnesses must be less than 2000 characters')
    .optional()
    .nullable(),

  surgeries: z
    .string()
    .max(2000, 'Surgeries must be less than 2000 characters')
    .optional()
    .nullable(),

  // Hospitalizations
  hospitalizations: z
    .string()
    .max(2000, 'Hospitalizations must be less than 2000 characters')
    .optional()
    .nullable(),

  // Immunization history
  immunizationStatus: z
    .enum(['up-to-date', 'incomplete', 'exempted', 'unknown'])
    .optional(),

  // Other
  developmentalHistory: z
    .string()
    .max(2000, 'Developmental history must be less than 2000 characters')
    .optional()
    .nullable(),

  socialHistory: z
    .string()
    .max(1000, 'Social history must be less than 1000 characters')
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .nullable()
});

/**
 * Health plan schema (504, IEP, etc.) - PHI
 */
export const healthPlanSchema = z.object({
  studentId: z
    .string({ required_error: 'Student is required' })
    .uuid('Invalid student ID'),

  planType: z
    .enum(['504', 'iep', 'ihp', 'eap', 'other'], {
      required_error: 'Plan type is required'
    }),

  planName: z
    .string({ required_error: 'Plan name is required' })
    .min(1, 'Plan name is required')
    .max(200, 'Plan name must be less than 200 characters')
    .trim(),

  startDate: dateSchema,

  endDate: optionalDateSchema,

  reviewDate: optionalDateSchema,

  goals: z
    .string()
    .max(5000, 'Goals must be less than 5000 characters')
    .optional()
    .nullable(),

  accommodations: z
    .string()
    .max(5000, 'Accommodations must be less than 5000 characters')
    .optional()
    .nullable(),

  interventions: z
    .string()
    .max(5000, 'Interventions must be less than 5000 characters')
    .optional()
    .nullable(),

  emergencyProtocol: z
    .string()
    .max(2000, 'Emergency protocol must be less than 2000 characters')
    .optional()
    .nullable(),

  isActive: z.boolean().default(true),

  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .nullable()
});

/**
 * Update schemas (make fields optional)
 */
export const updateAllergySchema = allergySchema.partial().extend({
  id: z.string().uuid('Invalid allergy ID')
});

export const updateImmunizationSchema = immunizationSchema.partial().extend({
  id: z.string().uuid('Invalid immunization ID')
});

export const updateConditionSchema = conditionSchema.partial().extend({
  id: z.string().uuid('Invalid condition ID')
});

export const updateVitalSignsSchema = vitalSignsSchema.partial().extend({
  id: z.string().uuid('Invalid vital signs ID')
});

export const updateMedicalHistorySchema = medicalHistorySchema.partial().extend({
  id: z.string().uuid('Invalid medical history ID')
});

export const updateHealthPlanSchema = healthPlanSchema.partial().extend({
  id: z.string().uuid('Invalid health plan ID')
});

/**
 * PHI field markers - ALL health record fields are PHI
 */
export const HEALTH_RECORD_PHI_FIELDS = [
  'allergen',
  'reaction',
  'treatment',
  'vaccineName',
  'condition',
  'diagnosis',
  'vitals',
  'medicalHistory',
  'healthPlan'
] as const;

/**
 * Type exports
 */
export type Allergy = z.infer<typeof allergySchema>;
export type UpdateAllergy = z.infer<typeof updateAllergySchema>;
export type Immunization = z.infer<typeof immunizationSchema>;
export type UpdateImmunization = z.infer<typeof updateImmunizationSchema>;
export type Condition = z.infer<typeof conditionSchema>;
export type UpdateCondition = z.infer<typeof updateConditionSchema>;
export type VitalSigns = z.infer<typeof vitalSignsSchema>;
export type UpdateVitalSigns = z.infer<typeof updateVitalSignsSchema>;
export type MedicalHistory = z.infer<typeof medicalHistorySchema>;
export type UpdateMedicalHistory = z.infer<typeof updateMedicalHistorySchema>;
export type HealthPlan = z.infer<typeof healthPlanSchema>;
export type UpdateHealthPlan = z.infer<typeof updateHealthPlanSchema>;
export type AllergySeverity = typeof ALLERGY_SEVERITY[number];
export type AllergyType = typeof ALLERGY_TYPES[number];
export type ImmunizationStatus = typeof IMMUNIZATION_STATUS[number];
export type ConditionType = typeof CONDITION_TYPES[number];
