/**
 * Health Records API Validation Schemas
 * 
 * Comprehensive Zod validation schemas for all health record entities:
 * - Health Records validation
 * - Allergies validation
 * - Chronic Conditions validation
 * - Vaccinations validation
 * - Screenings validation
 * - Growth Measurements validation
 * - Vital Signs validation
 * - Bulk Import validation
 *
 * @module services/modules/healthRecords/schemas
 */

import { z, type ZodIssue } from 'zod';
import {
  AllergyType,
  AllergySeverity,
  ConditionStatus,
  ConditionSeverity,
  VaccinationStatus,
  ScreeningType,
  ScreeningOutcome,
  type HealthRecordCreate,
  type AllergyCreate,
  type ChronicConditionCreate,
  type CarePlanUpdate,
  type VaccinationCreate,
  type ScreeningCreate,
  type GrowthMeasurementCreate,
  type VitalSignsCreate,
  type BulkImportRequest
} from './types';

// ==========================================
// HEALTH RECORD VALIDATION SCHEMAS
// ==========================================

export const healthRecordCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  type: z.enum([
    'GENERAL_VISIT',
    'INJURY',
    'ILLNESS',
    'MEDICATION',
    'VACCINATION',
    'SCREENING',
    'PHYSICAL_EXAM',
    'EMERGENCY',
    'MENTAL_HEALTH',
    'DENTAL',
    'VISION',
    'HEARING',
    'OTHER'
  ]),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required').max(5000),
  diagnosis: z.string().max(2000).optional(),
  treatment: z.string().max(2000).optional(),
  provider: z.string().max(255).optional(),
  providerNPI: z
    .string()
    .regex(/^\d{10}$/, 'NPI must be 10 digits')
    .optional()
    .or(z.literal('')),
  location: z.string().max(255).optional(),
  notes: z.string().max(10000).optional(),
  attachments: z.array(z.string()).optional(),
  isConfidential: z.boolean().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional(),
});

// ==========================================
// ALLERGY VALIDATION SCHEMAS
// ==========================================

export const allergyCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  allergen: z.string().min(1, 'Allergen is required').max(255),
  allergyType: z.nativeEnum(AllergyType),
  severity: z.nativeEnum(AllergySeverity),
  reaction: z.string().max(1000).optional(),
  symptoms: z.array(z.string()).optional(),
  treatment: z.string().max(1000).optional(),
  onsetDate: z.string().optional(),
  diagnosedBy: z.string().max(255).optional(),
  verified: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  notes: z.string().max(2000).optional(),
});

export const allergyUpdateSchema = allergyCreateSchema
  .partial()
  .omit({ studentId: true });

// ==========================================
// CHRONIC CONDITION VALIDATION SCHEMAS
// ==========================================

export const chronicConditionCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  condition: z.string().min(1, 'Condition is required').max(255),
  icdCode: z
    .string()
    .regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'Invalid ICD code format')
    .optional()
    .or(z.literal('')),
  diagnosedDate: z.string().min(1, 'Diagnosed date is required'),
  status: z.nativeEnum(ConditionStatus),
  severity: z.nativeEnum(ConditionSeverity),
  notes: z.string().max(2000).optional(),
  carePlan: z.string().max(10000).optional(),
  medications: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  triggers: z.array(z.string()).optional(),
  diagnosedBy: z.string().max(255).optional(),
  nextReviewDate: z.string().optional(),
  emergencyProtocol: z.string().max(5000).optional(),
});

export const chronicConditionUpdateSchema = chronicConditionCreateSchema
  .partial()
  .omit({ studentId: true })
  .extend({
    lastReviewDate: z.string().optional(),
    isActive: z.boolean().optional(),
  });

export const carePlanUpdateSchema = z.object({
  carePlan: z.string().min(1, 'Care plan is required').max(10000),
  medications: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  triggers: z.array(z.string()).optional(),
  emergencyProtocol: z.string().max(5000).optional(),
  nextReviewDate: z.string().optional(),
});

// ==========================================
// VACCINATION VALIDATION SCHEMAS
// ==========================================

export const vaccinationCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  vaccineName: z.string().min(1, 'Vaccine name is required').max(255),
  vaccineType: z.string().min(1, 'Vaccine type is required').max(100),
  cvxCode: z.string().max(10).optional(),
  doseNumber: z.number().int().min(1).optional(),
  totalDoses: z.number().int().min(1).optional(),
  administeredDate: z.string().min(1, 'Administered date is required'),
  expirationDate: z.string().optional(),
  lotNumber: z.string().max(50).optional(),
  manufacturer: z.string().max(255).optional(),
  administeredBy: z.string().max(255).optional(),
  administeredByNPI: z
    .string()
    .regex(/^\d{10}$/, 'NPI must be 10 digits')
    .optional()
    .or(z.literal('')),
  site: z.string().max(50).optional(),
  route: z.string().max(50).optional(),
  dosage: z.string().max(50).optional(),
  status: z.nativeEnum(VaccinationStatus).optional(),
  reactions: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
  nextDueDate: z.string().optional(),
});

export const vaccinationUpdateSchema = vaccinationCreateSchema
  .partial()
  .omit({ studentId: true });

// ==========================================
// SCREENING VALIDATION SCHEMAS
// ==========================================

export const screeningCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  screeningType: z.nativeEnum(ScreeningType),
  screeningDate: z.string().min(1, 'Screening date is required'),
  performedBy: z.string().min(1, 'Performed by is required').max(255),
  outcome: z.nativeEnum(ScreeningOutcome),
  results: z.string().max(5000).optional(),
  measurements: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  referralRequired: z.boolean().optional(),
  referralTo: z.string().max(255).optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export const screeningUpdateSchema = screeningCreateSchema
  .partial()
  .omit({ studentId: true });

// ==========================================
// GROWTH MEASUREMENT VALIDATION SCHEMAS
// ==========================================

export const growthMeasurementCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  measurementDate: z.string().min(1, 'Measurement date is required'),
  height: z
    .number()
    .positive('Height must be positive')
    .max(300, 'Height seems unrealistic')
    .optional(),
  weight: z
    .number()
    .positive('Weight must be positive')
    .max(500, 'Weight seems unrealistic')
    .optional(),
  headCircumference: z
    .number()
    .positive()
    .max(100, 'Head circumference seems unrealistic')
    .optional(),
  measuredBy: z.string().min(1, 'Measured by is required').max(255),
  notes: z.string().max(2000).optional(),
});

export const growthMeasurementUpdateSchema = growthMeasurementCreateSchema
  .partial()
  .omit({ studentId: true });

// ==========================================
// VITAL SIGNS VALIDATION SCHEMAS
// ==========================================

export const vitalSignsCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  recordDate: z.string().min(1, 'Record date is required'),
  temperature: z
    .number()
    .min(35, 'Temperature too low')
    .max(42, 'Temperature too high')
    .optional(),
  temperatureMethod: z
    .enum(['oral', 'axillary', 'tympanic', 'temporal'])
    .optional(),
  bloodPressureSystolic: z
    .number()
    .int()
    .min(50, 'BP systolic too low')
    .max(250, 'BP systolic too high')
    .optional(),
  bloodPressureDiastolic: z
    .number()
    .int()
    .min(30, 'BP diastolic too low')
    .max(150, 'BP diastolic too high')
    .optional(),
  heartRate: z
    .number()
    .int()
    .min(30, 'Heart rate too low')
    .max(250, 'Heart rate too high')
    .optional(),
  respiratoryRate: z
    .number()
    .int()
    .min(8, 'Respiratory rate too low')
    .max(60, 'Respiratory rate too high')
    .optional(),
  oxygenSaturation: z
    .number()
    .min(0)
    .max(100, 'O2 saturation must be 0-100%')
    .optional(),
  pain: z.number().int().min(0).max(10, 'Pain scale is 0-10').optional(),
  glucose: z
    .number()
    .min(0)
    .max(600, 'Glucose level seems unrealistic')
    .optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  notes: z.string().max(2000).optional(),
  recordedBy: z.string().min(1, 'Recorded by is required').max(255),
});

export const vitalSignsUpdateSchema = vitalSignsCreateSchema
  .partial()
  .omit({ studentId: true });

// ==========================================
// BULK IMPORT VALIDATION SCHEMA
// ==========================================

export const bulkImportSchema = z.object({
  records: z
    .array(healthRecordCreateSchema)
    .min(1, 'At least one record is required')
    .max(1000, 'Maximum 1000 records per bulk import'),
  validateOnly: z.boolean().optional(),
  continueOnError: z.boolean().optional(),
});

// ==========================================
// VALIDATION HELPER FUNCTIONS
// ==========================================

/**
 * Validates data against a schema and returns formatted validation errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.reduce(
        (acc: Record<string, string[]>, err: ZodIssue) => {
          const path = err.path.join('.');
          if (!acc[path]) acc[path] = [];
          acc[path].push(err.message);
          return acc;
        },
        {} as Record<string, string[]>
      );
      return { success: false, errors: formattedErrors };
    }
    return { success: false, errors: { general: ['Validation failed'] } };
  }
}

/**
 * Validates health record create data
 */
export function validateHealthRecordCreate(data: unknown) {
  return validateData(healthRecordCreateSchema, data);
}

/**
 * Validates allergy create data
 */
export function validateAllergyCreate(data: unknown) {
  return validateData(allergyCreateSchema, data);
}

/**
 * Validates chronic condition create data
 */
export function validateChronicConditionCreate(data: unknown) {
  return validateData(chronicConditionCreateSchema, data);
}

/**
 * Validates care plan update data
 */
export function validateCarePlanUpdate(data: unknown) {
  return validateData(carePlanUpdateSchema, data);
}

/**
 * Validates vaccination create data
 */
export function validateVaccinationCreate(data: unknown) {
  return validateData(vaccinationCreateSchema, data);
}

/**
 * Validates screening create data
 */
export function validateScreeningCreate(data: unknown) {
  return validateData(screeningCreateSchema, data);
}

/**
 * Validates growth measurement create data
 */
export function validateGrowthMeasurementCreate(data: unknown) {
  return validateData(growthMeasurementCreateSchema, data);
}

/**
 * Validates vital signs create data
 */
export function validateVitalSignsCreate(data: unknown) {
  return validateData(vitalSignsCreateSchema, data);
}

/**
 * Validates bulk import data
 */
export function validateBulkImport(data: unknown) {
  return validateData(bulkImportSchema, data);
}

// ==========================================
// SCHEMA EXPORTS
// ==========================================

export const schemas = {
  healthRecord: {
    create: healthRecordCreateSchema,
  },
  allergy: {
    create: allergyCreateSchema,
    update: allergyUpdateSchema,
  },
  chronicCondition: {
    create: chronicConditionCreateSchema,
    update: chronicConditionUpdateSchema,
    carePlan: carePlanUpdateSchema,
  },
  vaccination: {
    create: vaccinationCreateSchema,
    update: vaccinationUpdateSchema,
  },
  screening: {
    create: screeningCreateSchema,
    update: screeningUpdateSchema,
  },
  growthMeasurement: {
    create: growthMeasurementCreateSchema,
    update: growthMeasurementUpdateSchema,
  },
  vitalSigns: {
    create: vitalSignsCreateSchema,
    update: vitalSignsUpdateSchema,
  },
  bulkImport: bulkImportSchema,
} as const;
