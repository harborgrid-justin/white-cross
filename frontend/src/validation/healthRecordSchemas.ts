/**
 * Health Record Validation Schemas
 * Zod schemas for health records, allergies, conditions, vaccinations, screenings, vital signs
 *
 * Backend Reference: /backend/src/validators/healthRecordValidators.ts
 * Compliance: HIPAA Privacy Rule, PHI protection, medical record standards
 *
 * Validates:
 *   - Health Records (general)
 *   - Allergies (with EpiPen tracking)
 *   - Chronic Conditions (with ICD-10 codes)
 *   - Vaccinations (with CVX/NDC codes)
 *   - Screenings (vision, hearing, dental, etc.)
 *   - Growth Measurements (height, weight, BMI)
 *   - Vital Signs (temperature, BP, heart rate, etc.)
 */

import { z } from 'zod';

// ============================================================================
// VALIDATION PATTERNS AND CONSTANTS
// ============================================================================

/**
 * ICD-10 code pattern
 * Format: Letter + 2 digits + optional decimal + 1-4 alphanumeric chars
 * Examples: E11.9, J45.40, Z23
 */
const ICD_10_PATTERN = /^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/;

/**
 * CVX code pattern (vaccine codes)
 * Format: 1-3 digits
 * Examples: 03, 21, 141
 */
const CVX_CODE_PATTERN = /^[0-9]{1,3}$/;

/**
 * NDC code pattern (vaccine NDC codes)
 * Format: XXXXX-XXXX-XX (5-4-2 format)
 * Examples: 00006-4681-00
 */
const NDC_CODE_PATTERN = /^[0-9]{5}-[0-9]{4}-[0-9]{2}$/;

/**
 * Health record types
 */
const RECORD_TYPES = [
  'ALLERGY',
  'IMMUNIZATION',
  'CHRONIC_CONDITION',
  'SCREENING',
  'GROWTH',
  'VITAL_SIGNS',
  'GENERAL',
] as const;

/**
 * Allergy types
 */
const ALLERGY_TYPES = [
  'FOOD',
  'MEDICATION',
  'ENVIRONMENTAL',
  'INSECT',
  'LATEX',
  'OTHER',
] as const;

/**
 * Severity levels
 */
const SEVERITY_LEVELS = ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'] as const;

/**
 * Condition severity levels
 */
const CONDITION_SEVERITY_LEVELS = ['MILD', 'MODERATE', 'SEVERE', 'CRITICAL'] as const;

/**
 * Screening types
 */
const SCREENING_TYPES = [
  'VISION',
  'HEARING',
  'DENTAL',
  'SCOLIOSIS',
  'BMI',
  'DEVELOPMENTAL',
  'MENTAL_HEALTH',
  'OTHER',
] as const;

/**
 * Screening outcomes
 */
const SCREENING_OUTCOMES = ['PASS', 'FAIL', 'REFER', 'INCONCLUSIVE'] as const;

/**
 * Vaccination administration sites
 */
const ADMINISTRATION_SITES = [
  'LEFT_ARM',
  'RIGHT_ARM',
  'LEFT_THIGH',
  'RIGHT_THIGH',
  'ORAL',
  'NASAL',
  'OTHER',
] as const;

/**
 * Vaccination routes
 */
const VACCINATION_ROUTES = ['IM', 'SC', 'ID', 'ORAL', 'NASAL', 'OTHER'] as const;

/**
 * Temperature units
 */
const TEMPERATURE_UNITS = ['C', 'F'] as const;

/**
 * Height/length units
 */
const HEIGHT_UNITS = ['CM', 'IN'] as const;

/**
 * Weight units
 */
const WEIGHT_UNITS = ['KG', 'LB'] as const;

/**
 * Valid relationships for authorization
 */
const VALID_RELATIONSHIPS = [
  'Mother',
  'Father',
  'Parent',
  'Legal Guardian',
  'Foster Parent',
  'Grandparent',
  'Stepparent',
  'Other Authorized Adult',
] as const;

// ============================================================================
// HELPER SCHEMAS
// ============================================================================

/**
 * UUID validation schema
 */
const uuidSchema = z.string().uuid({ message: 'Must be a valid UUID' });

/**
 * Past date validation (cannot be in future)
 */
const pastDateSchema = z
  .string()
  .datetime()
  .refine((val) => new Date(val) <= new Date(), 'Date cannot be in the future');

/**
 * Future date validation (cannot be in past)
 */
const futureDateSchema = z
  .string()
  .datetime()
  .refine((val) => new Date(val) >= new Date(), 'Date must be in the future');

// ============================================================================
// HEALTH RECORD VALIDATION
// ============================================================================

/**
 * Create Health Record Schema
 * For creating a general health record
 *
 * Backend Reference: createHealthRecordSchema
 */
export const createHealthRecordSchema = z.object({
  studentId: z
    .string({ message: 'Student ID is required' })
    .uuid('Student ID must be a valid UUID'),

  recordType: z.enum(RECORD_TYPES, {
    errorMap: () => ({
      message:
        'Record type must be one of: ALLERGY, IMMUNIZATION, CHRONIC_CONDITION, SCREENING, GROWTH, VITAL_SIGNS, GENERAL',
    }),
  }),

  recordDate: pastDateSchema,

  title: z
    .string({ message: 'Title is required' })
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .transform((val) => val.trim()),

  description: z
    .string()
    .max(5000, 'Description cannot exceed 5000 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  providerId: z
    .string()
    .uuid('Provider ID must be a valid UUID')
    .optional()
    .nullable(),

  attachments: z.array(z.string().url()).optional(),

  metadata: z.record(z.any()).optional(),

  isConfidential: z.boolean().default(false),

  tags: z.array(z.string().max(50)).optional(),
});

/**
 * Update Health Record Schema
 *
 * Backend Reference: updateHealthRecordSchema
 */
export const updateHealthRecordSchema = z
  .object({
    recordDate: pastDateSchema.optional(),

    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional(),

    description: z
      .string()
      .max(5000, 'Description cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    providerId: z
      .string()
      .uuid('Provider ID must be a valid UUID')
      .optional()
      .nullable(),

    attachments: z.array(z.string().url()).optional(),

    metadata: z.record(z.any()).optional(),

    isConfidential: z.boolean().optional(),

    tags: z.array(z.string().max(50)).optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// ============================================================================
// ALLERGY VALIDATION
// ============================================================================

/**
 * Create Allergy Schema
 * With EpiPen tracking for life-threatening allergies
 *
 * Backend Reference: createAllergySchema
 */
export const createAllergySchema = z
  .object({
    studentId: z
      .string({ message: 'Student ID is required' })
      .uuid('Student ID must be a valid UUID'),

    allergen: z
      .string({ message: 'Allergen is required' })
      .min(2, 'Allergen name must be at least 2 characters')
      .max(200, 'Allergen name cannot exceed 200 characters')
      .transform((val) => val.trim()),

    allergyType: z.enum(ALLERGY_TYPES, {
      errorMap: () => ({
        message: 'Allergy type must be one of: FOOD, MEDICATION, ENVIRONMENTAL, INSECT, LATEX, OTHER',
      }),
    }),

    severity: z.enum(SEVERITY_LEVELS, {
      errorMap: () => ({
        message: 'Severity must be one of: MILD, MODERATE, SEVERE, LIFE_THREATENING',
      }),
    }),

    symptoms: z
      .array(
        z
          .string()
          .min(2, 'Each symptom must be at least 2 characters')
          .max(100, 'Each symptom cannot exceed 100 characters')
      )
      .min(1, 'At least one symptom is required'),

    reactions: z
      .string()
      .max(2000, 'Reactions cannot exceed 2000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    treatment: z
      .string()
      .max(2000, 'Treatment cannot exceed 2000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    onsetDate: pastDateSchema.optional().nullable(),

    diagnosedDate: pastDateSchema.optional().nullable(),

    diagnosedBy: z
      .string()
      .max(200, 'Diagnosed by cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    hasEpiPen: z.boolean().optional(),

    epiPenLocation: z
      .string()
      .min(5, 'EpiPen location must be at least 5 characters')
      .max(200, 'EpiPen location cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    epiPenExpiration: z.string().datetime().optional().nullable(),

    isActive: z.boolean().default(true),

    isVerified: z.boolean().default(false),

    verifiedBy: z
      .string()
      .uuid('Verified by must be a valid user UUID')
      .optional()
      .nullable(),

    verifiedAt: pastDateSchema.optional().nullable(),

    notes: z
      .string()
      .max(5000, 'Notes cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // SEVERE/LIFE_THREATENING severity requires treatment
      if (data.severity === 'SEVERE' || data.severity === 'LIFE_THREATENING') {
        return data.treatment && data.treatment.length >= 10;
      }
      return true;
    },
    {
      message: 'Treatment is required for SEVERE or LIFE_THREATENING allergies (min 10 characters)',
      path: ['treatment'],
    }
  )
  .refine(
    (data) => {
      // LIFE_THREATENING requires hasEpiPen to be specified
      if (data.severity === 'LIFE_THREATENING') {
        return data.hasEpiPen !== undefined;
      }
      return true;
    },
    {
      message: 'EpiPen information is required for LIFE_THREATENING allergies',
      path: ['hasEpiPen'],
    }
  )
  .refine(
    (data) => {
      // hasEpiPen=true requires location
      if (data.hasEpiPen === true) {
        return data.epiPenLocation && data.epiPenLocation.length >= 5;
      }
      return true;
    },
    {
      message: 'EpiPen location is required when EpiPen is available',
      path: ['epiPenLocation'],
    }
  )
  .refine(
    (data) => {
      // hasEpiPen=true requires expiration date in future
      if (data.hasEpiPen === true && data.epiPenExpiration) {
        return new Date(data.epiPenExpiration) > new Date();
      }
      return true;
    },
    {
      message: 'EpiPen has expired - must be replaced',
      path: ['epiPenExpiration'],
    }
  );

/**
 * Update Allergy Schema
 *
 * Backend Reference: updateAllergySchema
 */
export const updateAllergySchema = z
  .object({
    allergen: z
      .string()
      .min(2, 'Allergen name must be at least 2 characters')
      .max(200, 'Allergen name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional(),

    allergyType: z.enum(ALLERGY_TYPES).optional(),

    severity: z.enum(SEVERITY_LEVELS).optional(),

    symptoms: z
      .array(z.string().min(2).max(100))
      .min(1, 'At least one symptom is required')
      .optional(),

    reactions: z
      .string()
      .max(2000, 'Reactions cannot exceed 2000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    treatment: z
      .string()
      .max(2000, 'Treatment cannot exceed 2000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    onsetDate: pastDateSchema.optional().nullable(),

    diagnosedDate: pastDateSchema.optional().nullable(),

    diagnosedBy: z
      .string()
      .max(200, 'Diagnosed by cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    hasEpiPen: z.boolean().optional(),

    epiPenLocation: z
      .string()
      .max(200, 'EpiPen location cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    epiPenExpiration: z.string().datetime().optional().nullable(),

    isActive: z.boolean().optional(),

    isVerified: z.boolean().optional(),

    verifiedBy: z
      .string()
      .uuid('Verified by must be a valid user UUID')
      .optional()
      .nullable(),

    verifiedAt: pastDateSchema.optional().nullable(),

    notes: z
      .string()
      .max(5000, 'Notes cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// ============================================================================
// CHRONIC CONDITION VALIDATION
// ============================================================================

/**
 * Create Chronic Condition Schema
 * With ICD-10 codes and action plans
 *
 * Backend Reference: createConditionSchema
 */
export const createConditionSchema = z
  .object({
    studentId: z
      .string({ message: 'Student ID is required' })
      .uuid('Student ID must be a valid UUID'),

    condition: z
      .string({ message: 'Condition is required' })
      .min(3, 'Condition name must be at least 3 characters')
      .max(200, 'Condition name cannot exceed 200 characters')
      .transform((val) => val.trim()),

    icdCode: z
      .string()
      .regex(ICD_10_PATTERN, 'ICD code must be in valid ICD-10 format (e.g., E11.9, J45.40)')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    severity: z.enum(CONDITION_SEVERITY_LEVELS, {
      errorMap: () => ({
        message: 'Severity must be one of: MILD, MODERATE, SEVERE, CRITICAL',
      }),
    }),

    diagnosedDate: z
      .string({ message: 'Diagnosed date is required' })
      .datetime()
      .refine((val) => new Date(val) <= new Date(), 'Diagnosed date cannot be in the future'),

    diagnosedBy: z
      .string()
      .max(200, 'Diagnosed by cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    symptoms: z.array(z.string().max(200)).optional(),

    triggers: z.array(z.string().max(200)).optional(),

    treatment: z
      .string()
      .max(5000, 'Treatment cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    medications: z.array(z.string().uuid('Medication IDs must be valid UUIDs')).optional(),

    actionPlan: z
      .string()
      .max(10000, 'Action plan cannot exceed 10000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    restrictions: z.array(z.string().max(200)).optional(),

    accommodations: z.array(z.string().max(500)).optional(),

    emergencyProtocol: z
      .string()
      .max(5000, 'Emergency protocol cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    lastReviewDate: pastDateSchema.optional().nullable(),

    nextReviewDate: futureDateSchema.optional().nullable(),

    isActive: z.boolean().default(true),

    isControlled: z.boolean().default(false),

    notes: z
      .string()
      .max(5000, 'Notes cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // SEVERE/CRITICAL conditions require detailed action plan
      if (data.severity === 'SEVERE' || data.severity === 'CRITICAL') {
        return data.actionPlan && data.actionPlan.length >= 20;
      }
      return true;
    },
    {
      message: 'Action plan is required for SEVERE or CRITICAL conditions (min 20 characters)',
      path: ['actionPlan'],
    }
  );

/**
 * Update Chronic Condition Schema
 *
 * Backend Reference: updateConditionSchema
 */
export const updateConditionSchema = z
  .object({
    condition: z
      .string()
      .min(3, 'Condition name must be at least 3 characters')
      .max(200, 'Condition name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional(),

    icdCode: z
      .string()
      .regex(ICD_10_PATTERN, 'ICD code must be in valid ICD-10 format (e.g., E11.9, J45.40)')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    severity: z.enum(CONDITION_SEVERITY_LEVELS).optional(),

    diagnosedDate: pastDateSchema.optional(),

    diagnosedBy: z
      .string()
      .max(200, 'Diagnosed by cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    symptoms: z.array(z.string().max(200)).optional(),

    triggers: z.array(z.string().max(200)).optional(),

    treatment: z
      .string()
      .max(5000, 'Treatment cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    medications: z.array(z.string().uuid('Medication IDs must be valid UUIDs')).optional(),

    actionPlan: z
      .string()
      .max(10000, 'Action plan cannot exceed 10000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    restrictions: z.array(z.string().max(200)).optional(),

    accommodations: z.array(z.string().max(500)).optional(),

    emergencyProtocol: z
      .string()
      .max(5000, 'Emergency protocol cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    lastReviewDate: pastDateSchema.optional().nullable(),

    nextReviewDate: futureDateSchema.optional().nullable(),

    isActive: z.boolean().optional(),

    isControlled: z.boolean().optional(),

    notes: z
      .string()
      .max(5000, 'Notes cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// ============================================================================
// VACCINATION VALIDATION
// ============================================================================

/**
 * Create Vaccination Schema
 * With CVX/NDC codes and lot tracking
 *
 * Backend Reference: createVaccinationSchema
 */
export const createVaccinationSchema = z.object({
  studentId: z
    .string({ message: 'Student ID is required' })
    .uuid('Student ID must be a valid UUID'),

  vaccineName: z
    .string({ message: 'Vaccine name is required' })
    .min(2, 'Vaccine name must be at least 2 characters')
    .max(200, 'Vaccine name cannot exceed 200 characters')
    .transform((val) => val.trim()),

  cvxCode: z
    .string()
    .regex(CVX_CODE_PATTERN, 'CVX code must be 1-3 digits')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  ndcCode: z
    .string()
    .regex(NDC_CODE_PATTERN, 'NDC code must be in format: 12345-1234-12')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  manufacturer: z
    .string()
    .max(200, 'Manufacturer cannot exceed 200 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  lotNumber: z
    .string({ message: 'Lot number is required' })
    .min(1, 'Lot number is required')
    .max(100, 'Lot number cannot exceed 100 characters')
    .transform((val) => val.trim()),

  expirationDate: z
    .string({ message: 'Expiration date is required' })
    .datetime()
    .refine(
      (val) => new Date(val) >= new Date(),
      'Vaccine has expired - cannot administer expired vaccine'
    ),

  administeredDate: z
    .string({ message: 'Administration date is required' })
    .datetime()
    .refine((val) => new Date(val) <= new Date(), 'Administration date cannot be in the future'),

  administeredBy: z
    .string({ message: 'Administrator name is required' })
    .max(200, 'Administrator name cannot exceed 200 characters')
    .transform((val) => val.trim()),

  administrationSite: z.enum(ADMINISTRATION_SITES, {
    errorMap: () => ({
      message:
        'Administration site must be one of: LEFT_ARM, RIGHT_ARM, LEFT_THIGH, RIGHT_THIGH, ORAL, NASAL, OTHER',
    }),
  }),

  route: z.enum(VACCINATION_ROUTES, {
    errorMap: () => ({
      message:
        'Route must be one of: IM (intramuscular), SC (subcutaneous), ID (intradermal), ORAL, NASAL, OTHER',
    }),
  }),

  dosage: z
    .string({ message: 'Dosage is required' })
    .max(100, 'Dosage cannot exceed 100 characters')
    .transform((val) => val.trim()),

  doseNumber: z
    .number({ message: 'Dose number is required' })
    .int()
    .min(1, 'Dose number must be at least 1'),

  totalDoses: z
    .number({ message: 'Total doses required is required' })
    .int()
    .min(1, 'Total doses must be at least 1'),

  nextDoseDate: futureDateSchema.optional().nullable(),

  facilityName: z
    .string()
    .max(200, 'Facility name cannot exceed 200 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  facilityAddress: z
    .string()
    .max(500, 'Facility address cannot exceed 500 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  adverseReactions: z
    .string()
    .max(2000, 'Adverse reactions cannot exceed 2000 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  contraindications: z.array(z.string().max(200)).optional(),

  isValid: z.boolean().default(true),

  notes: z
    .string()
    .max(5000, 'Notes cannot exceed 5000 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),
}).refine(
  (data) => {
    // Total doses must be >= current dose number
    return data.totalDoses >= data.doseNumber;
  },
  {
    message: 'Total doses must be greater than or equal to dose number',
    path: ['totalDoses'],
  }
);

/**
 * Update Vaccination Schema
 *
 * Backend Reference: updateVaccinationSchema
 */
export const updateVaccinationSchema = z
  .object({
    vaccineName: z
      .string()
      .min(2, 'Vaccine name must be at least 2 characters')
      .max(200, 'Vaccine name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional(),

    cvxCode: z
      .string()
      .regex(CVX_CODE_PATTERN, 'CVX code must be 1-3 digits')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    ndcCode: z
      .string()
      .regex(NDC_CODE_PATTERN, 'NDC code must be in format: 12345-1234-12')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    manufacturer: z
      .string()
      .max(200, 'Manufacturer cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    lotNumber: z
      .string()
      .min(1, 'Lot number is required')
      .max(100, 'Lot number cannot exceed 100 characters')
      .transform((val) => val.trim())
      .optional(),

    expirationDate: z.string().datetime().optional(),

    administeredDate: pastDateSchema.optional(),

    administeredBy: z
      .string()
      .max(200, 'Administrator name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional(),

    administrationSite: z.enum(ADMINISTRATION_SITES).optional(),

    route: z.enum(VACCINATION_ROUTES).optional(),

    dosage: z
      .string()
      .max(100, 'Dosage cannot exceed 100 characters')
      .transform((val) => val.trim())
      .optional(),

    doseNumber: z.number().int().min(1, 'Dose number must be at least 1').optional(),

    totalDoses: z.number().int().optional(),

    nextDoseDate: z.string().datetime().optional().nullable(),

    facilityName: z
      .string()
      .max(200, 'Facility name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    facilityAddress: z
      .string()
      .max(500, 'Facility address cannot exceed 500 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    adverseReactions: z
      .string()
      .max(2000, 'Adverse reactions cannot exceed 2000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    contraindications: z.array(z.string().max(200)).optional(),

    isValid: z.boolean().optional(),

    notes: z
      .string()
      .max(5000, 'Notes cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// ============================================================================
// SCREENING VALIDATION
// ============================================================================

/**
 * Create Screening Schema
 *
 * Backend Reference: createScreeningSchema
 */
export const createScreeningSchema = z
  .object({
    studentId: z
      .string({ message: 'Student ID is required' })
      .uuid('Student ID must be a valid UUID'),

    screeningType: z.enum(SCREENING_TYPES, {
      errorMap: () => ({
        message:
          'Screening type must be one of: VISION, HEARING, DENTAL, SCOLIOSIS, BMI, DEVELOPMENTAL, MENTAL_HEALTH, OTHER',
      }),
    }),

    screeningDate: z
      .string({ message: 'Screening date is required' })
      .datetime()
      .refine((val) => new Date(val) <= new Date(), 'Screening date cannot be in the future'),

    screenedBy: z
      .string({ message: 'Screener name is required' })
      .max(200, 'Screener name cannot exceed 200 characters')
      .transform((val) => val.trim()),

    outcome: z.enum(SCREENING_OUTCOMES, {
      errorMap: () => ({
        message: 'Outcome must be one of: PASS, FAIL, REFER, INCONCLUSIVE',
      }),
    }),

    results: z.record(z.any(), { message: 'Screening results are required' }),

    referralNeeded: z.boolean().default(false),

    referralType: z
      .string()
      .min(3, 'Referral type must be at least 3 characters')
      .max(200, 'Referral type cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    referralTo: z
      .string()
      .min(3, 'Referral destination must be at least 3 characters')
      .max(200, 'Referral destination cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    referralReason: z
      .string()
      .min(10, 'Referral reason must be at least 10 characters')
      .max(1000, 'Referral reason cannot exceed 1000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    referralDate: z.string().datetime().optional().nullable(),

    followUpRequired: z.boolean().default(false),

    followUpDate: futureDateSchema.optional().nullable(),

    notes: z
      .string()
      .max(5000, 'Notes cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // outcome REFER requires referral type
      if (data.outcome === 'REFER') {
        return data.referralType && data.referralType.length >= 3;
      }
      return true;
    },
    {
      message: 'Referral type is required when outcome is REFER',
      path: ['referralType'],
    }
  )
  .refine(
    (data) => {
      // outcome REFER requires referral destination
      if (data.outcome === 'REFER') {
        return data.referralTo && data.referralTo.length >= 3;
      }
      return true;
    },
    {
      message: 'Referral destination is required when outcome is REFER',
      path: ['referralTo'],
    }
  )
  .refine(
    (data) => {
      // outcome REFER requires referral reason
      if (data.outcome === 'REFER') {
        return data.referralReason && data.referralReason.length >= 10;
      }
      return true;
    },
    {
      message: 'Referral reason is required when outcome is REFER',
      path: ['referralReason'],
    }
  );

/**
 * Update Screening Schema
 *
 * Backend Reference: updateScreeningSchema
 */
export const updateScreeningSchema = z
  .object({
    screeningType: z.enum(SCREENING_TYPES).optional(),

    screeningDate: pastDateSchema.optional(),

    screenedBy: z
      .string()
      .max(200, 'Screener name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional(),

    outcome: z.enum(SCREENING_OUTCOMES).optional(),

    results: z.record(z.any()).optional(),

    referralNeeded: z.boolean().optional(),

    referralType: z
      .string()
      .max(200, 'Referral type cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    referralTo: z
      .string()
      .max(200, 'Referral destination cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    referralReason: z
      .string()
      .max(1000, 'Referral reason cannot exceed 1000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    referralDate: z.string().datetime().optional().nullable(),

    followUpRequired: z.boolean().optional(),

    followUpDate: z.string().datetime().optional().nullable(),

    notes: z
      .string()
      .max(5000, 'Notes cannot exceed 5000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// ============================================================================
// GROWTH MEASUREMENT VALIDATION
// ============================================================================

/**
 * Create Growth Measurement Schema
 *
 * Backend Reference: createGrowthMeasurementSchema
 */
export const createGrowthMeasurementSchema = z.object({
  studentId: z
    .string({ message: 'Student ID is required' })
    .uuid('Student ID must be a valid UUID'),

  measurementDate: z
    .string({ message: 'Measurement date is required' })
    .datetime()
    .refine((val) => new Date(val) <= new Date(), 'Measurement date cannot be in the future'),

  height: z
    .number({ message: 'Height is required' })
    .positive('Height must be a positive number')
    .max(300, 'Height cannot exceed 300 cm (unrealistic value)'),

  heightUnit: z.enum(HEIGHT_UNITS).default('CM'),

  weight: z
    .number({ message: 'Weight is required' })
    .positive('Weight must be a positive number')
    .max(500, 'Weight cannot exceed 500 kg (unrealistic value)'),

  weightUnit: z.enum(WEIGHT_UNITS).default('KG'),

  bmi: z
    .number()
    .positive('BMI must be a positive number')
    .max(100, 'BMI cannot exceed 100 (unrealistic value)')
    .optional()
    .nullable(),

  headCircumference: z
    .number()
    .positive('Head circumference must be a positive number')
    .max(100, 'Head circumference cannot exceed 100 cm (unrealistic value)')
    .optional()
    .nullable(),

  headCircumferenceUnit: z.enum(HEIGHT_UNITS).default('CM'),

  heightPercentile: z
    .number()
    .min(0, 'Height percentile must be between 0 and 100')
    .max(100, 'Height percentile must be between 0 and 100')
    .optional()
    .nullable(),

  weightPercentile: z
    .number()
    .min(0, 'Weight percentile must be between 0 and 100')
    .max(100, 'Weight percentile must be between 0 and 100')
    .optional()
    .nullable(),

  bmiPercentile: z
    .number()
    .min(0, 'BMI percentile must be between 0 and 100')
    .max(100, 'BMI percentile must be between 0 and 100')
    .optional()
    .nullable(),

  measuredBy: z
    .string({ message: 'Measurer name is required' })
    .max(200, 'Measurer name cannot exceed 200 characters')
    .transform((val) => val.trim()),

  notes: z
    .string()
    .max(2000, 'Notes cannot exceed 2000 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),
});

/**
 * Update Growth Measurement Schema
 *
 * Backend Reference: updateGrowthMeasurementSchema
 */
export const updateGrowthMeasurementSchema = z
  .object({
    measurementDate: pastDateSchema.optional(),

    height: z
      .number()
      .positive('Height must be a positive number')
      .max(300, 'Height cannot exceed 300 cm (unrealistic value)')
      .optional(),

    heightUnit: z.enum(HEIGHT_UNITS).optional(),

    weight: z
      .number()
      .positive('Weight must be a positive number')
      .max(500, 'Weight cannot exceed 500 kg (unrealistic value)')
      .optional(),

    weightUnit: z.enum(WEIGHT_UNITS).optional(),

    bmi: z
      .number()
      .positive('BMI must be a positive number')
      .max(100, 'BMI cannot exceed 100 (unrealistic value)')
      .optional()
      .nullable(),

    headCircumference: z
      .number()
      .positive('Head circumference must be a positive number')
      .max(100, 'Head circumference cannot exceed 100 cm (unrealistic value)')
      .optional()
      .nullable(),

    headCircumferenceUnit: z.enum(HEIGHT_UNITS).optional(),

    heightPercentile: z
      .number()
      .min(0, 'Height percentile must be between 0 and 100')
      .max(100, 'Height percentile must be between 0 and 100')
      .optional()
      .nullable(),

    weightPercentile: z
      .number()
      .min(0, 'Weight percentile must be between 0 and 100')
      .max(100, 'Weight percentile must be between 0 and 100')
      .optional()
      .nullable(),

    bmiPercentile: z
      .number()
      .min(0, 'BMI percentile must be between 0 and 100')
      .max(100, 'BMI percentile must be between 0 and 100')
      .optional()
      .nullable(),

    measuredBy: z
      .string()
      .max(200, 'Measurer name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional(),

    notes: z
      .string()
      .max(2000, 'Notes cannot exceed 2000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// ============================================================================
// VITAL SIGNS VALIDATION
// ============================================================================

/**
 * Create Vital Signs Schema
 * With clinical range validation
 *
 * Backend Reference: createVitalSignsSchema
 */
export const createVitalSignsSchema = z
  .object({
    studentId: z
      .string({ message: 'Student ID is required' })
      .uuid('Student ID must be a valid UUID'),

    recordedDate: z
      .string({ message: 'Recorded date is required' })
      .datetime()
      .refine((val) => new Date(val) <= new Date(), 'Recorded date cannot be in the future'),

    temperature: z
      .number({ message: 'Temperature is required' })
      .min(35, 'Temperature must be at least 35°C (95°F)')
      .max(42, 'Temperature cannot exceed 42°C (107.6°F)'),

    temperatureUnit: z.enum(TEMPERATURE_UNITS).default('C'),

    heartRate: z
      .number({ message: 'Heart rate is required' })
      .int()
      .min(40, 'Heart rate must be at least 40 bpm')
      .max(200, 'Heart rate cannot exceed 200 bpm'),

    respiratoryRate: z
      .number({ message: 'Respiratory rate is required' })
      .int()
      .min(8, 'Respiratory rate must be at least 8 breaths/min')
      .max(60, 'Respiratory rate cannot exceed 60 breaths/min'),

    bloodPressureSystolic: z
      .number({ message: 'Systolic blood pressure is required' })
      .int()
      .min(60, 'Systolic blood pressure must be at least 60 mmHg')
      .max(200, 'Systolic blood pressure cannot exceed 200 mmHg'),

    bloodPressureDiastolic: z
      .number({ message: 'Diastolic blood pressure is required' })
      .int()
      .min(40, 'Diastolic blood pressure must be at least 40 mmHg')
      .max(130, 'Diastolic blood pressure cannot exceed 130 mmHg'),

    oxygenSaturation: z
      .number()
      .min(70, 'Oxygen saturation must be at least 70%')
      .max(100, 'Oxygen saturation cannot exceed 100%')
      .optional()
      .nullable(),

    painLevel: z
      .number()
      .int()
      .min(0, 'Pain level must be between 0 and 10')
      .max(10, 'Pain level must be between 0 and 10')
      .optional()
      .nullable(),

    recordedBy: z
      .string({ message: 'Recorder name is required' })
      .max(200, 'Recorder name cannot exceed 200 characters')
      .transform((val) => val.trim()),

    notes: z
      .string()
      .max(2000, 'Notes cannot exceed 2000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // Diastolic must be less than systolic
      return data.bloodPressureDiastolic < data.bloodPressureSystolic;
    },
    {
      message: 'Diastolic blood pressure must be less than systolic',
      path: ['bloodPressureDiastolic'],
    }
  );

/**
 * Update Vital Signs Schema
 *
 * Backend Reference: updateVitalSignsSchema
 */
export const updateVitalSignsSchema = z
  .object({
    recordedDate: pastDateSchema.optional(),

    temperature: z
      .number()
      .min(35, 'Temperature must be at least 35°C (95°F)')
      .max(42, 'Temperature cannot exceed 42°C (107.6°F)')
      .optional(),

    temperatureUnit: z.enum(TEMPERATURE_UNITS).optional(),

    heartRate: z
      .number()
      .int()
      .min(40, 'Heart rate must be at least 40 bpm')
      .max(200, 'Heart rate cannot exceed 200 bpm')
      .optional(),

    respiratoryRate: z
      .number()
      .int()
      .min(8, 'Respiratory rate must be at least 8 breaths/min')
      .max(60, 'Respiratory rate cannot exceed 60 breaths/min')
      .optional(),

    bloodPressureSystolic: z
      .number()
      .int()
      .min(60, 'Systolic blood pressure must be at least 60 mmHg')
      .max(200, 'Systolic blood pressure cannot exceed 200 mmHg')
      .optional(),

    bloodPressureDiastolic: z
      .number()
      .int()
      .min(40, 'Diastolic blood pressure must be at least 40 mmHg')
      .max(130, 'Diastolic blood pressure cannot exceed 130 mmHg')
      .optional(),

    oxygenSaturation: z
      .number()
      .min(70, 'Oxygen saturation must be at least 70%')
      .max(100, 'Oxygen saturation cannot exceed 100%')
      .optional()
      .nullable(),

    painLevel: z
      .number()
      .int()
      .min(0, 'Pain level must be between 0 and 10')
      .max(10, 'Pain level must be between 0 and 10')
      .optional()
      .nullable(),

    recordedBy: z
      .string()
      .max(200, 'Recorder name cannot exceed 200 characters')
      .transform((val) => val.trim())
      .optional(),

    notes: z
      .string()
      .max(2000, 'Notes cannot exceed 2000 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateHealthRecordInput = z.infer<typeof createHealthRecordSchema>;
export type UpdateHealthRecordInput = z.infer<typeof updateHealthRecordSchema>;
export type CreateAllergyInput = z.infer<typeof createAllergySchema>;
export type UpdateAllergyInput = z.infer<typeof updateAllergySchema>;
export type CreateConditionInput = z.infer<typeof createConditionSchema>;
export type UpdateConditionInput = z.infer<typeof updateConditionSchema>;
export type CreateVaccinationInput = z.infer<typeof createVaccinationSchema>;
export type UpdateVaccinationInput = z.infer<typeof updateVaccinationSchema>;
export type CreateScreeningInput = z.infer<typeof createScreeningSchema>;
export type UpdateScreeningInput = z.infer<typeof updateScreeningSchema>;
export type CreateGrowthMeasurementInput = z.infer<typeof createGrowthMeasurementSchema>;
export type UpdateGrowthMeasurementInput = z.infer<typeof updateGrowthMeasurementSchema>;
export type CreateVitalSignsInput = z.infer<typeof createVitalSignsSchema>;
export type UpdateVitalSignsInput = z.infer<typeof updateVitalSignsSchema>;

// ============================================================================
// CONSTANTS EXPORTS
// ============================================================================

export {
  RECORD_TYPES,
  ALLERGY_TYPES,
  SEVERITY_LEVELS,
  CONDITION_SEVERITY_LEVELS,
  SCREENING_TYPES,
  SCREENING_OUTCOMES,
  ADMINISTRATION_SITES,
  VACCINATION_ROUTES,
  TEMPERATURE_UNITS,
  HEIGHT_UNITS,
  WEIGHT_UNITS,
  VALID_RELATIONSHIPS,
};
