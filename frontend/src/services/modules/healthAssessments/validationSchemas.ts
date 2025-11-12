/**
 * Health Assessments Validation Schemas
 *
 * Zod validation schemas for all health assessment request payloads.
 * Provides runtime validation with type inference for TypeScript.
 *
 * @module HealthAssessments/ValidationSchemas
 * @version 2.0.0
 * @since 2025-10-24
 */

import { z } from 'zod';

// ============================================================================
// COMMON VALIDATION PATTERNS
// ============================================================================

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid('Must be a valid UUID');

/**
 * Date validation schema (ISO datetime or YYYY-MM-DD)
 */
export const dateSchema = z
  .string()
  .datetime({ message: 'Must be a valid ISO datetime' })
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)'));

// ============================================================================
// SCREENING VALIDATION SCHEMAS
// ============================================================================

/**
 * Screening type enumeration
 */
const screeningTypeEnum = z.enum(
  ['VISION', 'HEARING', 'DENTAL', 'SCOLIOSIS', 'BMI', 'BLOOD_PRESSURE', 'DEVELOPMENTAL'],
  {
    errorMap: () => ({ message: 'Invalid screening type' }),
  }
);

/**
 * Screening result enumeration
 */
const screeningResultEnum = z.enum(['PASS', 'FAIL', 'REFER', 'INCOMPLETE'], {
  errorMap: () => ({ message: 'Result must be PASS, FAIL, REFER, or INCOMPLETE' }),
});

/**
 * Vision screening detailed results schema
 */
const visionResultsSchema = z.object({
  leftEye: z.string().min(1, 'Left eye measurement required'),
  rightEye: z.string().min(1, 'Right eye measurement required'),
  colorVision: z.string().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

/**
 * Hearing screening detailed results schema
 */
const hearingResultsSchema = z.object({
  leftEar: z.number().min(0, 'Left ear dB must be non-negative'),
  rightEar: z.number().min(0, 'Right ear dB must be non-negative'),
  frequencies: z.record(z.string(), z.number()).optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

/**
 * Dental screening detailed results schema
 */
const dentalResultsSchema = z.object({
  cavities: z.number().int().min(0, 'Cavities count must be non-negative'),
  missingTeeth: z.number().int().min(0, 'Missing teeth count must be non-negative'),
  orthodonticNeeds: z.boolean(),
  hygiene: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

/**
 * Scoliosis screening detailed results schema
 */
const scoliosisResultsSchema = z.object({
  spinalCurvature: z.boolean(),
  degreesIfMeasured: z.number().min(0).max(180).optional(),
  referralRequired: z.boolean(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

/**
 * BMI screening detailed results schema
 */
const bmiResultsSchema = z.object({
  height: z.number().min(30, 'Height must be at least 30 cm').max(250, 'Height cannot exceed 250 cm'),
  weight: z.number().min(2, 'Weight must be at least 2 kg').max(300, 'Weight cannot exceed 300 kg'),
  bmi: z.number().min(5).max(100),
  percentile: z.number().min(0).max(100),
  category: z.enum(['UNDERWEIGHT', 'HEALTHY', 'OVERWEIGHT', 'OBESE']),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

/**
 * Generic screening results for other types
 */
const genericScreeningResultsSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()])
);

/**
 * Discriminated union for screening detailed results
 */
const screeningDetailedResultsSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('VISION'), data: visionResultsSchema }),
  z.object({ type: z.literal('HEARING'), data: hearingResultsSchema }),
  z.object({ type: z.literal('DENTAL'), data: dentalResultsSchema }),
  z.object({ type: z.literal('SCOLIOSIS'), data: scoliosisResultsSchema }),
  z.object({ type: z.literal('BMI'), data: bmiResultsSchema }),
  z.object({
    type: z.enum(['BLOOD_PRESSURE', 'DEVELOPMENTAL']),
    data: genericScreeningResultsSchema,
  }),
]);

/**
 * Create screening request validation schema
 *
 * Validates:
 * - Student ID is valid UUID
 * - Screening type is valid
 * - Result is valid enum value
 * - Follow-up notes required when follow-up needed
 */
export const createScreeningSchema = z
  .object({
    studentId: uuidSchema,
    screeningType: screeningTypeEnum,
    screeningDate: dateSchema.optional(),
    result: screeningResultEnum,
    detailedResults: screeningDetailedResultsSchema.optional(),
    followUpRequired: z.boolean().optional().default(false),
    followUpNotes: z
      .string()
      .max(2000, 'Follow-up notes cannot exceed 2000 characters')
      .trim()
      .optional(),
    parentNotified: z.boolean().optional().default(false),
  })
  .refine(
    (data: { followUpRequired?: boolean; followUpNotes?: string }) => {
      // If follow-up required, follow-up notes should be provided
      if (data.followUpRequired && !data.followUpNotes) {
        return false;
      }
      return true;
    },
    { message: 'Follow-up notes are required when follow-up is needed', path: ['followUpNotes'] }
  );

// ============================================================================
// GROWTH MEASUREMENT VALIDATION SCHEMAS
// ============================================================================

/**
 * Create growth measurement request validation schema
 *
 * Validates:
 * - Height in reasonable range (30-250 cm)
 * - Weight in reasonable range (2-300 kg)
 * - Optional head circumference in range (20-80 cm)
 * - Notes length limit
 */
export const createGrowthMeasurementSchema = z.object({
  height: z
    .number()
    .min(30, 'Height must be at least 30 cm')
    .max(250, 'Height cannot exceed 250 cm')
    .refine((val: number) => val > 0, 'Height must be positive'),
  weight: z
    .number()
    .min(2, 'Weight must be at least 2 kg')
    .max(300, 'Weight cannot exceed 300 kg')
    .refine((val: number) => val > 0, 'Weight must be positive'),
  measurementDate: dateSchema.optional(),
  headCircumference: z
    .number()
    .min(20, 'Head circumference must be at least 20 cm')
    .max(80, 'Head circumference cannot exceed 80 cm')
    .optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').trim().optional(),
});

// ============================================================================
// EMERGENCY NOTIFICATION VALIDATION SCHEMAS
// ============================================================================

/**
 * Emergency type enumeration
 */
const emergencyTypeEnum = z.enum(
  ['MEDICAL_EMERGENCY', 'ALLERGIC_REACTION', 'INJURY', 'SEIZURE', 'CARDIAC', 'RESPIRATORY', 'OTHER'],
  {
    errorMap: () => ({ message: 'Invalid emergency type' }),
  }
);

/**
 * Emergency severity enumeration
 */
const emergencySeverityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
  errorMap: () => ({ message: 'Severity must be LOW, MEDIUM, HIGH, or CRITICAL' }),
});

/**
 * Vital signs validation schema
 */
const vitalSignsSchema = z.object({
  bloodPressure: z
    .string()
    .regex(/^\d{2,3}\/\d{2,3}$/, 'Blood pressure must be in format XXX/YYY')
    .optional(),
  heartRate: z
    .number()
    .int()
    .min(30, 'Heart rate must be at least 30 bpm')
    .max(250, 'Heart rate cannot exceed 250 bpm')
    .optional(),
  temperature: z
    .number()
    .min(32, 'Temperature must be at least 32°C')
    .max(45, 'Temperature cannot exceed 45°C')
    .optional(),
  respiratoryRate: z
    .number()
    .int()
    .min(5, 'Respiratory rate must be at least 5 breaths/min')
    .max(60, 'Respiratory rate cannot exceed 60 breaths/min')
    .optional(),
  oxygenSaturation: z
    .number()
    .int()
    .min(50, 'Oxygen saturation must be at least 50%')
    .max(100, 'Oxygen saturation cannot exceed 100%')
    .optional(),
});

/**
 * Create emergency notification request validation schema
 *
 * Validates:
 * - Student ID is valid UUID
 * - Emergency type is valid
 * - Severity level is valid
 * - Description has minimum content
 * - Location is specified
 * - Vital signs are in valid ranges
 */
export const createEmergencyNotificationSchema = z.object({
  studentId: uuidSchema,
  emergencyType: emergencyTypeEnum,
  severity: emergencySeverityEnum,
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters')
    .trim(),
  location: z
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(500, 'Location cannot exceed 500 characters')
    .trim(),
  actionsTaken: z.array(z.string()).optional(),
  vitalSigns: vitalSignsSchema.optional(),
});

// ============================================================================
// MEDICATION INTERACTION VALIDATION SCHEMAS
// ============================================================================

/**
 * Check new medication request validation schema
 *
 * Validates:
 * - Medication name has minimum length
 * - Optional dosage and frequency within limits
 */
export const checkNewMedicationSchema = z.object({
  medicationName: z
    .string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(200, 'Medication name cannot exceed 200 characters')
    .trim(),
  dosage: z.string().max(100, 'Dosage cannot exceed 100 characters').trim().optional(),
  frequency: z.string().max(200, 'Frequency cannot exceed 200 characters').trim().optional(),
});
