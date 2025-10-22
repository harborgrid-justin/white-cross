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

/**
 * @fileoverview Health Record Validation Schemas
 * @module validators/healthRecordValidators
 * @description Comprehensive Joi validation schemas for health records, allergies, conditions, vaccinations, screenings, growth measurements, and vital signs
 * @requires joi - Validation library
 * @requires ../shared/healthcare/validators - Shared healthcare validation utilities
 */

import Joi from 'joi';

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
 * @constant {Object} createHealthRecordSchema
 * @description Joi validation schema for creating a new health record
 * @type {Joi.ObjectSchema}
 * @property {string} studentId - Required, valid UUID format
 * @property {string} recordType - Required, enum: ['ALLERGY', 'IMMUNIZATION', 'CHRONIC_CONDITION', 'SCREENING', 'GROWTH', 'VITAL_SIGNS', 'GENERAL']
 * @property {Date} recordDate - Required, cannot be in the future (max: 'now')
 * @property {string} title - Required, min 3 chars, max 200 chars
 * @property {string} [description] - Optional, max 5000 chars, allows empty string or null
 * @property {string} [providerId] - Optional, valid UUID format
 * @property {Array<string>} [attachments] - Optional array of URI strings
 * @property {Object} [metadata] - Optional metadata object
 * @property {boolean} [isConfidential=false] - Optional, defaults to false
 * @property {Array<string>} [tags] - Optional array of strings, max 50 chars each
 * @example
 * // Valid health record payload
 * {
 *   studentId: '123e4567-e89b-12d3-a456-426614174000',
 *   recordType: 'ALLERGY',
 *   recordDate: '2024-10-18T10:00:00Z',
 *   title: 'Peanut Allergy Diagnosis',
 *   description: 'Severe peanut allergy diagnosed by Dr. Smith',
 *   isConfidential: true,
 *   tags: ['allergy', 'food', 'severe']
 * }
 *
 * @example
 * // Invalid - will fail validation
 * {
 *   studentId: 'invalid-uuid',      // Not valid UUID
 *   recordType: 'INVALID_TYPE',     // Not in enum
 *   recordDate: '2099-01-01',       // In the future
 *   title: 'AB'                     // Too short (min 3 chars)
 * }
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
 * @constant {Object} updateHealthRecordSchema
 * @description Joi validation schema for updating an existing health record (partial update)
 * @type {Joi.ObjectSchema}
 * @property {Date} [recordDate] - Optional, cannot be in the future
 * @property {string} [title] - Optional, min 3 chars, max 200 chars
 * @property {string} [description] - Optional, max 5000 chars
 * @property {string} [providerId] - Optional, valid UUID
 * @property {Array<string>} [attachments] - Optional array of URIs
 * @property {Object} [metadata] - Optional metadata object
 * @property {boolean} [isConfidential] - Optional boolean flag
 * @property {Array<string>} [tags] - Optional array, max 50 chars per tag
 * @validation All fields are optional, but at least one field must be provided (.min(1))
 * @example
 * // Valid update
 * {
 *   title: 'Updated Allergy Information',
 *   isConfidential: false
 * }
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
 * @constant {Object} createAllergySchema
 * @description Joi validation schema for creating a new allergy record with EpiPen tracking
 * @type {Joi.ObjectSchema}
 * @property {string} studentId - Required, valid UUID
 * @property {string} allergen - Required, min 2 chars, max 200 chars, allergen name
 * @property {string} allergyType - Required, enum: ['FOOD', 'MEDICATION', 'ENVIRONMENTAL', 'INSECT', 'LATEX', 'OTHER']
 * @property {string} severity - Required, enum: ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']
 * @property {Array<string>} symptoms - Required, min 1 symptom, each 2-100 chars
 * @property {string} [reactions] - Optional, max 2000 chars
 * @property {string} treatment - Conditional required for SEVERE/LIFE_THREATENING (min 10 chars), optional otherwise
 * @property {Date} [onsetDate] - Optional, cannot be in future
 * @property {Date} [diagnosedDate] - Optional, cannot be in future
 * @property {string} [diagnosedBy] - Optional, max 200 chars, physician name
 * @property {boolean} hasEpiPen - Conditional required for LIFE_THREATENING
 * @property {string} epiPenLocation - Conditional required when hasEpiPen is true (min 5 chars)
 * @property {Date} epiPenExpiration - Conditional required when hasEpiPen is true, must be in future
 * @property {boolean} [isActive=true] - Optional, defaults to true
 * @property {boolean} [isVerified=false] - Optional, defaults to false
 * @property {string} [verifiedBy] - Optional, valid UUID
 * @property {Date} [verifiedAt] - Optional, cannot be in future
 * @property {string} [notes] - Optional, max 5000 chars
 * @validation
 * - SEVERE/LIFE_THREATENING severity requires treatment description (min 10 chars)
 * - LIFE_THREATENING allergies require hasEpiPen to be specified
 * - hasEpiPen=true requires epiPenLocation and epiPenExpiration
 * - EpiPen expiration must be in future (not expired)
 * @example
 * // Valid severe allergy with EpiPen
 * {
 *   studentId: '123e4567-e89b-12d3-a456-426614174000',
 *   allergen: 'Peanuts',
 *   allergyType: 'FOOD',
 *   severity: 'LIFE_THREATENING',
 *   symptoms: ['Anaphylaxis', 'Throat swelling', 'Difficulty breathing'],
 *   treatment: 'Administer EpiPen immediately and call 911',
 *   hasEpiPen: true,
 *   epiPenLocation: 'Nurse office, red medical cabinet',
 *   epiPenExpiration: '2025-12-31',
 *   diagnosedBy: 'Dr. Sarah Johnson',
 *   isActive: true
 * }
 *
 * @example
 * // Invalid - missing required EpiPen info
 * {
 *   studentId: '123e4567-e89b-12d3-a456-426614174000',
 *   allergen: 'Shellfish',
 *   allergyType: 'FOOD',
 *   severity: 'LIFE_THREATENING',
 *   symptoms: ['Anaphylaxis'],
 *   treatment: 'Emergency protocol',
 *   hasEpiPen: true
 *   // Missing epiPenLocation and epiPenExpiration - will fail validation
 * }
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
 * @constant {Object} updateAllergySchema
 * @description Joi validation schema for updating an existing allergy record (partial update)
 * @type {Joi.ObjectSchema}
 * @validation All fields optional, at least one required (.min(1))
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
 * @constant {Object} createConditionSchema
 * @description Joi validation schema for creating chronic condition records with ICD-10 codes
 * @type {Joi.ObjectSchema}
 * @property {string} studentId - Required UUID
 * @property {string} condition - Required, min 3 chars, max 200 chars
 * @property {string} [icdCode] - Optional ICD-10 code, pattern: /^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/ (e.g., E11.9, J45.40)
 * @property {string} severity - Required, enum: ['MILD', 'MODERATE', 'SEVERE', 'CRITICAL']
 * @property {Date} diagnosedDate - Required, cannot be in future
 * @property {string} [diagnosedBy] - Optional, max 200 chars
 * @property {Array<string>} [symptoms] - Optional array, max 200 chars each
 * @property {Array<string>} [triggers] - Optional array, max 200 chars each
 * @property {string} [treatment] - Optional, max 5000 chars
 * @property {Array<string>} [medications] - Optional array of UUIDs
 * @property {string} actionPlan - Conditional required for SEVERE/CRITICAL (min 20 chars, max 10000 chars)
 * @property {Array<string>} [restrictions] - Optional array, max 200 chars each
 * @property {Array<string>} [accommodations] - Optional array, max 500 chars each
 * @property {string} [emergencyProtocol] - Optional, max 5000 chars
 * @property {Date} [lastReviewDate] - Optional, cannot be in future
 * @property {Date} [nextReviewDate] - Optional, must be in future
 * @property {boolean} [isActive=true] - Optional, defaults to true
 * @property {boolean} [isControlled=false] - Optional, defaults to false
 * @property {string} [notes] - Optional, max 5000 chars
 * @validation
 * - ICD-10 code format: Letter + 2 digits + optional decimal + 1-4 alphanumeric chars
 * - SEVERE/CRITICAL conditions require detailed action plan (min 20 chars)
 * @example
 * // Valid chronic condition
 * {
 *   studentId: '123e4567-e89b-12d3-a456-426614174000',
 *   condition: 'Type 1 Diabetes',
 *   icdCode: 'E10.9',
 *   severity: 'SEVERE',
 *   diagnosedDate: '2023-01-15',
 *   diagnosedBy: 'Dr. Emily Chen',
 *   symptoms: ['Frequent urination', 'Excessive thirst', 'Fatigue'],
 *   triggers: ['Stress', 'Illness', 'Missed insulin dose'],
 *   actionPlan: 'Monitor blood glucose 4x daily. Administer insulin as prescribed...',
 *   restrictions: ['No unsupervised physical activity'],
 *   accommodations: ['Extra time for restroom breaks', 'Snack breaks as needed'],
 *   emergencyProtocol: 'If blood glucose < 70, give 15g fast-acting carbs. Call parent and 911 if no improvement',
 *   isActive: true,
 *   isControlled: true
 * }
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
 * @constant {Object} updateConditionSchema
 * @description Joi validation schema for updating chronic condition (partial update)
 * @type {Joi.ObjectSchema}
 * @validation All fields optional, at least one required (.min(1))
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
 * @constant {Object} createVaccinationSchema
 * @description Joi validation schema for vaccination records with CVX/NDC codes and lot tracking
 * @type {Joi.ObjectSchema}
 * @property {string} studentId - Required UUID
 * @property {string} vaccineName - Required, min 2 chars, max 200 chars
 * @property {string} [cvxCode] - Optional CVX code, pattern: /^[0-9]{1,3}$/ (1-3 digits)
 * @property {string} [ndcCode] - Optional NDC code, pattern: /^[0-9]{5}-[0-9]{4}-[0-9]{2}$/ (format: 12345-1234-12)
 * @property {string} [manufacturer] - Optional, max 200 chars
 * @property {string} lotNumber - Required, min 1 char, max 100 chars
 * @property {Date} expirationDate - Required, must be in future (vaccine not expired)
 * @property {Date} administeredDate - Required, cannot be in future
 * @property {string} administeredBy - Required, max 200 chars, administrator name
 * @property {string} administrationSite - Required, enum: ['LEFT_ARM', 'RIGHT_ARM', 'LEFT_THIGH', 'RIGHT_THIGH', 'ORAL', 'NASAL', 'OTHER']
 * @property {string} route - Required, enum: ['IM', 'SC', 'ID', 'ORAL', 'NASAL', 'OTHER']
 * @property {string} dosage - Required, max 100 chars
 * @property {number} doseNumber - Required, integer, min 1
 * @property {number} totalDoses - Required, integer, must be >= doseNumber
 * @property {Date} [nextDoseDate] - Optional, must be in future
 * @property {string} [facilityName] - Optional, max 200 chars
 * @property {string} [facilityAddress] - Optional, max 500 chars
 * @property {string} [adverseReactions] - Optional, max 2000 chars
 * @property {Array<string>} [contraindications] - Optional array, max 200 chars each
 * @property {boolean} [isValid=true] - Optional, defaults to true
 * @property {string} [notes] - Optional, max 5000 chars
 * @validation
 * - CVX code: 1-3 digit numeric code
 * - NDC code: Format XXXXX-XXXX-XX
 * - Expiration date must be in future (cannot administer expired vaccine)
 * - Total doses must be >= current dose number
 * - Routes: IM (intramuscular), SC (subcutaneous), ID (intradermal), ORAL, NASAL
 * @example
 * // Valid vaccination record
 * {
 *   studentId: '123e4567-e89b-12d3-a456-426614174000',
 *   vaccineName: 'MMR (Measles, Mumps, Rubella)',
 *   cvxCode: '03',
 *   ndcCode: '00006-4681-00',
 *   manufacturer: 'Merck',
 *   lotNumber: 'ABC123XYZ',
 *   expirationDate: '2025-12-31',
 *   administeredDate: '2024-10-15',
 *   administeredBy: 'Jane Smith, RN',
 *   administrationSite: 'LEFT_ARM',
 *   route: 'SC',
 *   dosage: '0.5 mL',
 *   doseNumber: 2,
 *   totalDoses: 2,
 *   facilityName: 'Lincoln Elementary School',
 *   isValid: true
 * }
 *
 * @example
 * // Invalid - expired vaccine
 * {
 *   vaccineName: 'Flu Vaccine',
 *   lotNumber: 'XYZ789',
 *   expirationDate: '2023-01-01',  // In the past - will fail
 *   administeredDate: '2024-10-18',
 *   doseNumber: 1,
 *   totalDoses: 1
 * }
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
 * @constant {Object} createVitalSignsSchema
 * @description Joi validation schema for vital signs with clinical range validation
 * @type {Joi.ObjectSchema}
 * @property {string} studentId - Required UUID
 * @property {Date} recordedDate - Required, cannot be in future
 * @property {number} temperature - Required, min 35°C, max 42°C (95°F - 107.6°F)
 * @property {string} [temperatureUnit='C'] - Optional, enum: ['C', 'F'], defaults to Celsius
 * @property {number} heartRate - Required integer, min 40 bpm, max 200 bpm
 * @property {number} respiratoryRate - Required integer, min 8, max 60 breaths/min
 * @property {number} bloodPressureSystolic - Required integer, min 60 mmHg, max 200 mmHg
 * @property {number} bloodPressureDiastolic - Required integer, min 40 mmHg, max 130 mmHg, must be < systolic
 * @property {number} [oxygenSaturation] - Optional, min 70%, max 100%
 * @property {number} [painLevel] - Optional integer, min 0, max 10 (pain scale)
 * @property {string} recordedBy - Required, max 200 chars, recorder name
 * @property {string} [notes] - Optional, max 2000 chars
 * @validation
 * - Temperature range: 35-42°C for realistic values
 * - Heart rate: 40-200 bpm (covers infants to adults)
 * - Respiratory rate: 8-60 breaths/min (covers infants to adults)
 * - Blood pressure: Diastolic must be less than systolic
 * - Oxygen saturation: 70-100% (below 70% is critical)
 * - Pain level: 0-10 scale (0 = no pain, 10 = worst pain)
 * @example
 * // Valid vital signs
 * {
 *   studentId: '123e4567-e89b-12d3-a456-426614174000',
 *   recordedDate: '2024-10-18T10:30:00Z',
 *   temperature: 37.2,
 *   temperatureUnit: 'C',
 *   heartRate: 75,
 *   respiratoryRate: 16,
 *   bloodPressureSystolic: 120,
 *   bloodPressureDiastolic: 80,
 *   oxygenSaturation: 98,
 *   painLevel: 2,
 *   recordedBy: 'Nurse Johnson'
 * }
 *
 * @example
 * // Invalid - diastolic >= systolic
 * {
 *   temperature: 37.0,
 *   heartRate: 72,
 *   respiratoryRate: 16,
 *   bloodPressureSystolic: 120,
 *   bloodPressureDiastolic: 125,  // Greater than systolic - will fail
 *   recordedBy: 'Staff Name'
 * }
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
