/**
 * LOC: 17D8C29D4A
 * WC-VAL-HLT-059 | healthRecordValidators.ts - Healthcare Data Validation Schemas
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-VAL-HLT-059 | healthRecordValidators.ts - Healthcare Data Validation Schemas
 * Purpose: Comprehensive Joi validation for health records, allergies, conditions, vaccinations, screenings
 * Upstream: ../shared/healthcare/validators, joi | Dependencies: joi, healthcare validators, ICD codes
 * Downstream: ../routes/healthRecords.ts, ../services/healthRecordService.ts | Called by: health record endpoints
 * Related: ../middleware/auditLogging.ts, ../validators/complianceValidators.ts, ../database/models/HealthRecord.ts
 * Exports: createHealthRecordSchema, createAllergySchema, createVaccinationSchema, createVitalSignsSchema | Key Services: HIPAA-compliant health data validation
 * Last Updated: 2025-10-18 | File Type: .ts | Pattern: Validation Layer
 * Critical Path: Request validation → Health data sanitization → Clinical validation → PHI protection
 * LLM Context: Medical record validators with clinical standards, allergy management, vaccination tracking, vital signs monitoring, growth measurements, screening protocols
 */

import Joi from 'joi';

/**
 * Health Record Validation Schemas
 * Provides comprehensive validation for all health record types
 * in compliance with healthcare data standards
 */

// Import shared healthcare validators
import { 
  validateMedicalCode, 
  validateAllergySeverity, 
  validateVitalSigns
} from '../shared/healthcare/validators';

// ============================================================================
// HEALTH RECORD VALIDATION
// ============================================================================

/**
 * Schema for creating a new health record
 */
export const createHealthRecordSchema = Joi.object({
  studentId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required'
    }),

  recordType: Joi.string()
    .valid('ALLERGY', 'IMMUNIZATION', 'CHRONIC_CONDITION', 'SCREENING', 'GROWTH', 'VITAL_SIGNS', 'GENERAL')
    .required()
    .messages({
      'any.only': 'Record type must be one of: ALLERGY, IMMUNIZATION, CHRONIC_CONDITION, SCREENING, GROWTH, VITAL_SIGNS, GENERAL',
      'any.required': 'Record type is required'
    }),

  recordDate: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.max': 'Record date cannot be in the future',
      'any.required': 'Record date is required'
    }),

  title: Joi.string().min(3).max(200).required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required'
    }),

  description: Joi.string().max(5000).allow('', null),

  providerId: Joi.string().uuid()
    .messages({
      'string.guid': 'Provider ID must be a valid UUID'
    }),

  attachments: Joi.array().items(Joi.string().uri()),

  metadata: Joi.object(),

  isConfidential: Joi.boolean().default(false),

  tags: Joi.array().items(Joi.string().max(50))
});

/**
 * Schema for updating an existing health record
 */
export const updateHealthRecordSchema = Joi.object({
  recordDate: Joi.date().max('now')
    .messages({
      'date.max': 'Record date cannot be in the future'
    }),

  title: Joi.string().min(3).max(200)
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 200 characters'
    }),

  description: Joi.string().max(5000).allow('', null),

  providerId: Joi.string().uuid()
    .messages({
      'string.guid': 'Provider ID must be a valid UUID'
    }),

  attachments: Joi.array().items(Joi.string().uri()),

  metadata: Joi.object(),

  isConfidential: Joi.boolean(),

  tags: Joi.array().items(Joi.string().max(50))
}).min(1);

// ============================================================================
// ALLERGY VALIDATION
// ============================================================================

/**
 * Schema for creating a new allergy record
 */
export const createAllergySchema = Joi.object({
  studentId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required'
    }),

  allergen: Joi.string().min(2).max(200).required()
    .messages({
      'string.min': 'Allergen name must be at least 2 characters',
      'string.max': 'Allergen name cannot exceed 200 characters',
      'any.required': 'Allergen is required'
    }),

  allergyType: Joi.string()
    .valid('FOOD', 'MEDICATION', 'ENVIRONMENTAL', 'INSECT', 'LATEX', 'OTHER')
    .required()
    .messages({
      'any.only': 'Allergy type must be one of: FOOD, MEDICATION, ENVIRONMENTAL, INSECT, LATEX, OTHER',
      'any.required': 'Allergy type is required'
    }),

  severity: Joi.string()
    .valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING')
    .required()
    .messages({
      'any.only': 'Severity must be one of: MILD, MODERATE, SEVERE, LIFE_THREATENING',
      'any.required': 'Severity is required'
    }),

  symptoms: Joi.array()
    .items(Joi.string().min(2).max(100))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one symptom is required',
      'any.required': 'Symptoms are required'
    }),

  reactions: Joi.string().max(2000).allow('', null),

  treatment: Joi.when('severity', {
    is: Joi.string().valid('SEVERE', 'LIFE_THREATENING'),
    then: Joi.string().min(10).max(2000).required()
      .messages({
        'any.required': 'Treatment is required for SEVERE or LIFE_THREATENING allergies',
        'string.min': 'Treatment description must be at least 10 characters'
      }),
    otherwise: Joi.string().max(2000).allow('', null)
  }),

  onsetDate: Joi.date().max('now').allow(null)
    .messages({
      'date.max': 'Onset date cannot be in the future'
    }),

  diagnosedDate: Joi.date().max('now').allow(null)
    .messages({
      'date.max': 'Diagnosed date cannot be in the future'
    }),

  diagnosedBy: Joi.string().max(200).allow('', null),

  hasEpiPen: Joi.when('severity', {
    is: 'LIFE_THREATENING',
    then: Joi.boolean().required()
      .messages({
        'any.required': 'EpiPen information is required for LIFE_THREATENING allergies'
      }),
    otherwise: Joi.boolean().default(false)
  }),

  epiPenLocation: Joi.when('hasEpiPen', {
    is: true,
    then: Joi.string().min(5).max(200).required()
      .messages({
        'any.required': 'EpiPen location is required when EpiPen is available',
        'string.min': 'EpiPen location must be at least 5 characters'
      }),
    otherwise: Joi.string().allow('', null)
  }),

  epiPenExpiration: Joi.when('hasEpiPen', {
    is: true,
    then: Joi.date().min('now').required()
      .messages({
        'any.required': 'EpiPen expiration date is required when EpiPen is available',
        'date.min': 'EpiPen has expired - must be replaced'
      }),
    otherwise: Joi.date().allow(null)
  }),

  isActive: Joi.boolean().default(true),

  isVerified: Joi.boolean().default(false),

  verifiedBy: Joi.string().uuid().allow(null)
    .messages({
      'string.guid': 'Verified by must be a valid user UUID'
    }),

  verifiedAt: Joi.date().max('now').allow(null)
    .messages({
      'date.max': 'Verification date cannot be in the future'
    }),

  notes: Joi.string().max(5000).allow('', null)
});

/**
 * Schema for updating an allergy record
 */
export const updateAllergySchema = Joi.object({
  allergen: Joi.string().min(2).max(200)
    .messages({
      'string.min': 'Allergen name must be at least 2 characters',
      'string.max': 'Allergen name cannot exceed 200 characters'
    }),

  allergyType: Joi.string()
    .valid('FOOD', 'MEDICATION', 'ENVIRONMENTAL', 'INSECT', 'LATEX', 'OTHER')
    .messages({
      'any.only': 'Allergy type must be one of: FOOD, MEDICATION, ENVIRONMENTAL, INSECT, LATEX, OTHER'
    }),

  severity: Joi.string()
    .valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING')
    .messages({
      'any.only': 'Severity must be one of: MILD, MODERATE, SEVERE, LIFE_THREATENING'
    }),

  symptoms: Joi.array()
    .items(Joi.string().min(2).max(100))
    .min(1)
    .messages({
      'array.min': 'At least one symptom is required'
    }),

  reactions: Joi.string().max(2000).allow('', null),

  treatment: Joi.string().max(2000).allow('', null),

  onsetDate: Joi.date().max('now').allow(null)
    .messages({
      'date.max': 'Onset date cannot be in the future'
    }),

  diagnosedDate: Joi.date().max('now').allow(null)
    .messages({
      'date.max': 'Diagnosed date cannot be in the future'
    }),

  diagnosedBy: Joi.string().max(200).allow('', null),

  hasEpiPen: Joi.boolean(),

  epiPenLocation: Joi.string().max(200).allow('', null),

  epiPenExpiration: Joi.date().allow(null),

  isActive: Joi.boolean(),

  isVerified: Joi.boolean(),

  verifiedBy: Joi.string().uuid().allow(null)
    .messages({
      'string.guid': 'Verified by must be a valid user UUID'
    }),

  verifiedAt: Joi.date().max('now').allow(null)
    .messages({
      'date.max': 'Verification date cannot be in the future'
    }),

  notes: Joi.string().max(5000).allow('', null)
}).min(1);

// ============================================================================
// CHRONIC CONDITION VALIDATION
// ============================================================================

/**
 * Schema for creating a chronic condition record
 */
export const createConditionSchema = Joi.object({
  studentId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required'
    }),

  condition: Joi.string().min(3).max(200).required()
    .messages({
      'string.min': 'Condition name must be at least 3 characters',
      'string.max': 'Condition name cannot exceed 200 characters',
      'any.required': 'Condition is required'
    }),

  icdCode: Joi.string()
    .pattern(/^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'ICD code must be in valid ICD-10 format (e.g., E11.9, J45.40)'
    }),

  severity: Joi.string()
    .valid('MILD', 'MODERATE', 'SEVERE', 'CRITICAL')
    .required()
    .messages({
      'any.only': 'Severity must be one of: MILD, MODERATE, SEVERE, CRITICAL',
      'any.required': 'Severity is required'
    }),

  diagnosedDate: Joi.date().max('now').required()
    .messages({
      'date.max': 'Diagnosed date cannot be in the future',
      'any.required': 'Diagnosed date is required'
    }),

  diagnosedBy: Joi.string().max(200).allow('', null),

  symptoms: Joi.array().items(Joi.string().max(200)),

  triggers: Joi.array().items(Joi.string().max(200)),

  treatment: Joi.string().max(5000).allow('', null),

  medications: Joi.array().items(Joi.string().uuid())
    .messages({
      'string.guid': 'Medication IDs must be valid UUIDs'
    }),

  actionPlan: Joi.when('severity', {
    is: Joi.string().valid('SEVERE', 'CRITICAL'),
    then: Joi.string().min(20).max(10000).required()
      .messages({
        'any.required': 'Action plan is required for SEVERE or CRITICAL conditions',
        'string.min': 'Action plan must be at least 20 characters'
      }),
    otherwise: Joi.string().max(10000).allow('', null)
  }),

  restrictions: Joi.array().items(Joi.string().max(200)),

  accommodations: Joi.array().items(Joi.string().max(500)),

  emergencyProtocol: Joi.string().max(5000).allow('', null),

  lastReviewDate: Joi.date().max('now').allow(null)
    .messages({
      'date.max': 'Last review date cannot be in the future'
    }),

  nextReviewDate: Joi.date().min('now').allow(null)
    .messages({
      'date.min': 'Next review date must be in the future'
    }),

  isActive: Joi.boolean().default(true),

  isControlled: Joi.boolean().default(false),

  notes: Joi.string().max(5000).allow('', null)
});

/**
 * Schema for updating a chronic condition record
 */
export const updateConditionSchema = Joi.object({
  condition: Joi.string().min(3).max(200)
    .messages({
      'string.min': 'Condition name must be at least 3 characters',
      'string.max': 'Condition name cannot exceed 200 characters'
    }),

  icdCode: Joi.string()
    .pattern(/^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'ICD code must be in valid ICD-10 format (e.g., E11.9, J45.40)'
    }),

  severity: Joi.string()
    .valid('MILD', 'MODERATE', 'SEVERE', 'CRITICAL')
    .messages({
      'any.only': 'Severity must be one of: MILD, MODERATE, SEVERE, CRITICAL'
    }),

  diagnosedDate: Joi.date().max('now')
    .messages({
      'date.max': 'Diagnosed date cannot be in the future'
    }),

  diagnosedBy: Joi.string().max(200).allow('', null),

  symptoms: Joi.array().items(Joi.string().max(200)),

  triggers: Joi.array().items(Joi.string().max(200)),

  treatment: Joi.string().max(5000).allow('', null),

  medications: Joi.array().items(Joi.string().uuid())
    .messages({
      'string.guid': 'Medication IDs must be valid UUIDs'
    }),

  actionPlan: Joi.string().max(10000).allow('', null),

  restrictions: Joi.array().items(Joi.string().max(200)),

  accommodations: Joi.array().items(Joi.string().max(500)),

  emergencyProtocol: Joi.string().max(5000).allow('', null),

  lastReviewDate: Joi.date().max('now').allow(null)
    .messages({
      'date.max': 'Last review date cannot be in the future'
    }),

  nextReviewDate: Joi.date().min('now').allow(null)
    .messages({
      'date.min': 'Next review date must be in the future'
    }),

  isActive: Joi.boolean(),

  isControlled: Joi.boolean(),

  notes: Joi.string().max(5000).allow('', null)
}).min(1);

// ============================================================================
// VACCINATION VALIDATION
// ============================================================================

/**
 * Schema for creating a vaccination record
 */
export const createVaccinationSchema = Joi.object({
  studentId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required'
    }),

  vaccineName: Joi.string().min(2).max(200).required()
    .messages({
      'string.min': 'Vaccine name must be at least 2 characters',
      'string.max': 'Vaccine name cannot exceed 200 characters',
      'any.required': 'Vaccine name is required'
    }),

  cvxCode: Joi.string()
    .pattern(/^[0-9]{1,3}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'CVX code must be 1-3 digits'
    }),

  ndcCode: Joi.string()
    .pattern(/^[0-9]{5}-[0-9]{4}-[0-9]{2}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'NDC code must be in format: 12345-1234-12'
    }),

  manufacturer: Joi.string().max(200).allow('', null),

  lotNumber: Joi.string().min(1).max(100).required()
    .messages({
      'any.required': 'Lot number is required',
      'string.min': 'Lot number is required'
    }),

  expirationDate: Joi.date().min('now').required()
    .messages({
      'date.min': 'Vaccine has expired - cannot administer expired vaccine',
      'any.required': 'Expiration date is required'
    }),

  administeredDate: Joi.date().max('now').required()
    .messages({
      'date.max': 'Administration date cannot be in the future',
      'any.required': 'Administration date is required'
    }),

  administeredBy: Joi.string().max(200).required()
    .messages({
      'any.required': 'Administrator name is required'
    }),

  administrationSite: Joi.string()
    .valid('LEFT_ARM', 'RIGHT_ARM', 'LEFT_THIGH', 'RIGHT_THIGH', 'ORAL', 'NASAL', 'OTHER')
    .required()
    .messages({
      'any.only': 'Administration site must be one of: LEFT_ARM, RIGHT_ARM, LEFT_THIGH, RIGHT_THIGH, ORAL, NASAL, OTHER',
      'any.required': 'Administration site is required'
    }),

  route: Joi.string()
    .valid('IM', 'SC', 'ID', 'ORAL', 'NASAL', 'OTHER')
    .required()
    .messages({
      'any.only': 'Route must be one of: IM (intramuscular), SC (subcutaneous), ID (intradermal), ORAL, NASAL, OTHER',
      'any.required': 'Route of administration is required'
    }),

  dosage: Joi.string().max(100).required()
    .messages({
      'any.required': 'Dosage is required'
    }),

  doseNumber: Joi.number().integer().min(1).required()
    .messages({
      'number.min': 'Dose number must be at least 1',
      'any.required': 'Dose number is required'
    }),

  totalDoses: Joi.number().integer().min(Joi.ref('doseNumber')).required()
    .messages({
      'number.min': 'Total doses must be greater than or equal to dose number',
      'any.required': 'Total doses required is required'
    }),

  nextDoseDate: Joi.date().min('now').allow(null)
    .messages({
      'date.min': 'Next dose date must be in the future'
    }),

  facilityName: Joi.string().max(200).allow('', null),

  facilityAddress: Joi.string().max(500).allow('', null),

  adverseReactions: Joi.string().max(2000).allow('', null),

  contraindications: Joi.array().items(Joi.string().max(200)),

  isValid: Joi.boolean().default(true),

  notes: Joi.string().max(5000).allow('', null)
});

/**
 * Schema for updating a vaccination record
 */
export const updateVaccinationSchema = Joi.object({
  vaccineName: Joi.string().min(2).max(200)
    .messages({
      'string.min': 'Vaccine name must be at least 2 characters',
      'string.max': 'Vaccine name cannot exceed 200 characters'
    }),

  cvxCode: Joi.string()
    .pattern(/^[0-9]{1,3}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'CVX code must be 1-3 digits'
    }),

  ndcCode: Joi.string()
    .pattern(/^[0-9]{5}-[0-9]{4}-[0-9]{2}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'NDC code must be in format: 12345-1234-12'
    }),

  manufacturer: Joi.string().max(200).allow('', null),

  lotNumber: Joi.string().min(1).max(100)
    .messages({
      'string.min': 'Lot number is required'
    }),

  expirationDate: Joi.date(),

  administeredDate: Joi.date().max('now')
    .messages({
      'date.max': 'Administration date cannot be in the future'
    }),

  administeredBy: Joi.string().max(200),

  administrationSite: Joi.string()
    .valid('LEFT_ARM', 'RIGHT_ARM', 'LEFT_THIGH', 'RIGHT_THIGH', 'ORAL', 'NASAL', 'OTHER')
    .messages({
      'any.only': 'Administration site must be one of: LEFT_ARM, RIGHT_ARM, LEFT_THIGH, RIGHT_THIGH, ORAL, NASAL, OTHER'
    }),

  route: Joi.string()
    .valid('IM', 'SC', 'ID', 'ORAL', 'NASAL', 'OTHER')
    .messages({
      'any.only': 'Route must be one of: IM, SC, ID, ORAL, NASAL, OTHER'
    }),

  dosage: Joi.string().max(100),

  doseNumber: Joi.number().integer().min(1)
    .messages({
      'number.min': 'Dose number must be at least 1'
    }),

  totalDoses: Joi.number().integer(),

  nextDoseDate: Joi.date().allow(null),

  facilityName: Joi.string().max(200).allow('', null),

  facilityAddress: Joi.string().max(500).allow('', null),

  adverseReactions: Joi.string().max(2000).allow('', null),

  contraindications: Joi.array().items(Joi.string().max(200)),

  isValid: Joi.boolean(),

  notes: Joi.string().max(5000).allow('', null)
}).min(1);

// ============================================================================
// SCREENING VALIDATION
// ============================================================================

/**
 * Schema for creating a screening record
 */
export const createScreeningSchema = Joi.object({
  studentId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required'
    }),

  screeningType: Joi.string()
    .valid('VISION', 'HEARING', 'DENTAL', 'SCOLIOSIS', 'BMI', 'DEVELOPMENTAL', 'MENTAL_HEALTH', 'OTHER')
    .required()
    .messages({
      'any.only': 'Screening type must be one of: VISION, HEARING, DENTAL, SCOLIOSIS, BMI, DEVELOPMENTAL, MENTAL_HEALTH, OTHER',
      'any.required': 'Screening type is required'
    }),

  screeningDate: Joi.date().max('now').required()
    .messages({
      'date.max': 'Screening date cannot be in the future',
      'any.required': 'Screening date is required'
    }),

  screenedBy: Joi.string().max(200).required()
    .messages({
      'any.required': 'Screener name is required'
    }),

  outcome: Joi.string()
    .valid('PASS', 'FAIL', 'REFER', 'INCONCLUSIVE')
    .required()
    .messages({
      'any.only': 'Outcome must be one of: PASS, FAIL, REFER, INCONCLUSIVE',
      'any.required': 'Screening outcome is required'
    }),

  results: Joi.object().required()
    .messages({
      'any.required': 'Screening results are required'
    }),

  referralNeeded: Joi.boolean().default(false),

  referralType: Joi.when('outcome', {
    is: 'REFER',
    then: Joi.string().min(3).max(200).required()
      .messages({
        'any.required': 'Referral type is required when outcome is REFER',
        'string.min': 'Referral type must be at least 3 characters'
      }),
    otherwise: Joi.string().max(200).allow('', null)
  }),

  referralTo: Joi.when('outcome', {
    is: 'REFER',
    then: Joi.string().min(3).max(200).required()
      .messages({
        'any.required': 'Referral destination is required when outcome is REFER',
        'string.min': 'Referral destination must be at least 3 characters'
      }),
    otherwise: Joi.string().max(200).allow('', null)
  }),

  referralReason: Joi.when('outcome', {
    is: 'REFER',
    then: Joi.string().min(10).max(1000).required()
      .messages({
        'any.required': 'Referral reason is required when outcome is REFER',
        'string.min': 'Referral reason must be at least 10 characters'
      }),
    otherwise: Joi.string().max(1000).allow('', null)
  }),

  referralDate: Joi.date().allow(null),

  followUpRequired: Joi.boolean().default(false),

  followUpDate: Joi.date().min('now').allow(null)
    .messages({
      'date.min': 'Follow-up date must be in the future'
    }),

  notes: Joi.string().max(5000).allow('', null)
});

/**
 * Schema for updating a screening record
 */
export const updateScreeningSchema = Joi.object({
  screeningType: Joi.string()
    .valid('VISION', 'HEARING', 'DENTAL', 'SCOLIOSIS', 'BMI', 'DEVELOPMENTAL', 'MENTAL_HEALTH', 'OTHER')
    .messages({
      'any.only': 'Screening type must be one of: VISION, HEARING, DENTAL, SCOLIOSIS, BMI, DEVELOPMENTAL, MENTAL_HEALTH, OTHER'
    }),

  screeningDate: Joi.date().max('now')
    .messages({
      'date.max': 'Screening date cannot be in the future'
    }),

  screenedBy: Joi.string().max(200),

  outcome: Joi.string()
    .valid('PASS', 'FAIL', 'REFER', 'INCONCLUSIVE')
    .messages({
      'any.only': 'Outcome must be one of: PASS, FAIL, REFER, INCONCLUSIVE'
    }),

  results: Joi.object(),

  referralNeeded: Joi.boolean(),

  referralType: Joi.string().max(200).allow('', null),

  referralTo: Joi.string().max(200).allow('', null),

  referralReason: Joi.string().max(1000).allow('', null),

  referralDate: Joi.date().allow(null),

  followUpRequired: Joi.boolean(),

  followUpDate: Joi.date().allow(null),

  notes: Joi.string().max(5000).allow('', null)
}).min(1);

// ============================================================================
// GROWTH MEASUREMENT VALIDATION
// ============================================================================

/**
 * Schema for creating a growth measurement record
 */
export const createGrowthMeasurementSchema = Joi.object({
  studentId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required'
    }),

  measurementDate: Joi.date().max('now').required()
    .messages({
      'date.max': 'Measurement date cannot be in the future',
      'any.required': 'Measurement date is required'
    }),

  height: Joi.number().positive().max(300).required()
    .messages({
      'number.positive': 'Height must be a positive number',
      'number.max': 'Height cannot exceed 300 cm (unrealistic value)',
      'any.required': 'Height is required'
    }),

  heightUnit: Joi.string()
    .valid('CM', 'IN')
    .default('CM')
    .messages({
      'any.only': 'Height unit must be CM or IN'
    }),

  weight: Joi.number().positive().max(500).required()
    .messages({
      'number.positive': 'Weight must be a positive number',
      'number.max': 'Weight cannot exceed 500 kg (unrealistic value)',
      'any.required': 'Weight is required'
    }),

  weightUnit: Joi.string()
    .valid('KG', 'LB')
    .default('KG')
    .messages({
      'any.only': 'Weight unit must be KG or LB'
    }),

  bmi: Joi.number().positive().max(100).allow(null)
    .messages({
      'number.positive': 'BMI must be a positive number',
      'number.max': 'BMI cannot exceed 100 (unrealistic value)'
    }),

  headCircumference: Joi.number().positive().max(100).allow(null)
    .messages({
      'number.positive': 'Head circumference must be a positive number',
      'number.max': 'Head circumference cannot exceed 100 cm (unrealistic value)'
    }),

  headCircumferenceUnit: Joi.string()
    .valid('CM', 'IN')
    .default('CM')
    .messages({
      'any.only': 'Head circumference unit must be CM or IN'
    }),

  heightPercentile: Joi.number().min(0).max(100).allow(null)
    .messages({
      'number.min': 'Height percentile must be between 0 and 100',
      'number.max': 'Height percentile must be between 0 and 100'
    }),

  weightPercentile: Joi.number().min(0).max(100).allow(null)
    .messages({
      'number.min': 'Weight percentile must be between 0 and 100',
      'number.max': 'Weight percentile must be between 0 and 100'
    }),

  bmiPercentile: Joi.number().min(0).max(100).allow(null)
    .messages({
      'number.min': 'BMI percentile must be between 0 and 100',
      'number.max': 'BMI percentile must be between 0 and 100'
    }),

  measuredBy: Joi.string().max(200).required()
    .messages({
      'any.required': 'Measurer name is required'
    }),

  notes: Joi.string().max(2000).allow('', null)
});

/**
 * Schema for updating a growth measurement record
 */
export const updateGrowthMeasurementSchema = Joi.object({
  measurementDate: Joi.date().max('now')
    .messages({
      'date.max': 'Measurement date cannot be in the future'
    }),

  height: Joi.number().positive().max(300)
    .messages({
      'number.positive': 'Height must be a positive number',
      'number.max': 'Height cannot exceed 300 cm (unrealistic value)'
    }),

  heightUnit: Joi.string()
    .valid('CM', 'IN')
    .messages({
      'any.only': 'Height unit must be CM or IN'
    }),

  weight: Joi.number().positive().max(500)
    .messages({
      'number.positive': 'Weight must be a positive number',
      'number.max': 'Weight cannot exceed 500 kg (unrealistic value)'
    }),

  weightUnit: Joi.string()
    .valid('KG', 'LB')
    .messages({
      'any.only': 'Weight unit must be KG or LB'
    }),

  bmi: Joi.number().positive().max(100).allow(null)
    .messages({
      'number.positive': 'BMI must be a positive number',
      'number.max': 'BMI cannot exceed 100 (unrealistic value)'
    }),

  headCircumference: Joi.number().positive().max(100).allow(null)
    .messages({
      'number.positive': 'Head circumference must be a positive number',
      'number.max': 'Head circumference cannot exceed 100 cm (unrealistic value)'
    }),

  headCircumferenceUnit: Joi.string()
    .valid('CM', 'IN')
    .messages({
      'any.only': 'Head circumference unit must be CM or IN'
    }),

  heightPercentile: Joi.number().min(0).max(100).allow(null)
    .messages({
      'number.min': 'Height percentile must be between 0 and 100',
      'number.max': 'Height percentile must be between 0 and 100'
    }),

  weightPercentile: Joi.number().min(0).max(100).allow(null)
    .messages({
      'number.min': 'Weight percentile must be between 0 and 100',
      'number.max': 'Weight percentile must be between 0 and 100'
    }),

  bmiPercentile: Joi.number().min(0).max(100).allow(null)
    .messages({
      'number.min': 'BMI percentile must be between 0 and 100',
      'number.max': 'BMI percentile must be between 0 and 100'
    }),

  measuredBy: Joi.string().max(200),

  notes: Joi.string().max(2000).allow('', null)
}).min(1);

// ============================================================================
// VITAL SIGNS VALIDATION
// ============================================================================

/**
 * Schema for creating a vital signs record
 */
export const createVitalSignsSchema = Joi.object({
  studentId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required'
    }),

  recordedDate: Joi.date().max('now').required()
    .messages({
      'date.max': 'Recorded date cannot be in the future',
      'any.required': 'Recorded date is required'
    }),

  temperature: Joi.number().min(35).max(42).required()
    .messages({
      'number.min': 'Temperature must be at least 35°C (95°F)',
      'number.max': 'Temperature cannot exceed 42°C (107.6°F)',
      'any.required': 'Temperature is required'
    }),

  temperatureUnit: Joi.string()
    .valid('C', 'F')
    .default('C')
    .messages({
      'any.only': 'Temperature unit must be C (Celsius) or F (Fahrenheit)'
    }),

  heartRate: Joi.number().integer().min(40).max(200).required()
    .messages({
      'number.min': 'Heart rate must be at least 40 bpm',
      'number.max': 'Heart rate cannot exceed 200 bpm',
      'any.required': 'Heart rate is required'
    }),

  respiratoryRate: Joi.number().integer().min(8).max(60).required()
    .messages({
      'number.min': 'Respiratory rate must be at least 8 breaths/min',
      'number.max': 'Respiratory rate cannot exceed 60 breaths/min',
      'any.required': 'Respiratory rate is required'
    }),

  bloodPressureSystolic: Joi.number().integer().min(60).max(200).required()
    .messages({
      'number.min': 'Systolic blood pressure must be at least 60 mmHg',
      'number.max': 'Systolic blood pressure cannot exceed 200 mmHg',
      'any.required': 'Systolic blood pressure is required'
    }),

  bloodPressureDiastolic: Joi.number().integer().min(40).max(130).required()
    .less(Joi.ref('bloodPressureSystolic'))
    .messages({
      'number.min': 'Diastolic blood pressure must be at least 40 mmHg',
      'number.max': 'Diastolic blood pressure cannot exceed 130 mmHg',
      'number.less': 'Diastolic blood pressure must be less than systolic',
      'any.required': 'Diastolic blood pressure is required'
    }),

  oxygenSaturation: Joi.number().min(70).max(100).allow(null)
    .messages({
      'number.min': 'Oxygen saturation must be at least 70%',
      'number.max': 'Oxygen saturation cannot exceed 100%'
    }),

  painLevel: Joi.number().integer().min(0).max(10).allow(null)
    .messages({
      'number.min': 'Pain level must be between 0 and 10',
      'number.max': 'Pain level must be between 0 and 10'
    }),

  recordedBy: Joi.string().max(200).required()
    .messages({
      'any.required': 'Recorder name is required'
    }),

  notes: Joi.string().max(2000).allow('', null)
});

/**
 * Schema for updating a vital signs record
 */
export const updateVitalSignsSchema = Joi.object({
  recordedDate: Joi.date().max('now')
    .messages({
      'date.max': 'Recorded date cannot be in the future'
    }),

  temperature: Joi.number().min(35).max(42)
    .messages({
      'number.min': 'Temperature must be at least 35°C (95°F)',
      'number.max': 'Temperature cannot exceed 42°C (107.6°F)'
    }),

  temperatureUnit: Joi.string()
    .valid('C', 'F')
    .messages({
      'any.only': 'Temperature unit must be C (Celsius) or F (Fahrenheit)'
    }),

  heartRate: Joi.number().integer().min(40).max(200)
    .messages({
      'number.min': 'Heart rate must be at least 40 bpm',
      'number.max': 'Heart rate cannot exceed 200 bpm'
    }),

  respiratoryRate: Joi.number().integer().min(8).max(60)
    .messages({
      'number.min': 'Respiratory rate must be at least 8 breaths/min',
      'number.max': 'Respiratory rate cannot exceed 60 breaths/min'
    }),

  bloodPressureSystolic: Joi.number().integer().min(60).max(200)
    .messages({
      'number.min': 'Systolic blood pressure must be at least 60 mmHg',
      'number.max': 'Systolic blood pressure cannot exceed 200 mmHg'
    }),

  bloodPressureDiastolic: Joi.number().integer().min(40).max(130)
    .messages({
      'number.min': 'Diastolic blood pressure must be at least 40 mmHg',
      'number.max': 'Diastolic blood pressure cannot exceed 130 mmHg'
    }),

  oxygenSaturation: Joi.number().min(70).max(100).allow(null)
    .messages({
      'number.min': 'Oxygen saturation must be at least 70%',
      'number.max': 'Oxygen saturation cannot exceed 100%'
    }),

  painLevel: Joi.number().integer().min(0).max(10).allow(null)
    .messages({
      'number.min': 'Pain level must be between 0 and 10',
      'number.max': 'Pain level must be between 0 and 10'
    }),

  recordedBy: Joi.string().max(200),

  notes: Joi.string().max(2000).allow('', null)
}).min(1);
