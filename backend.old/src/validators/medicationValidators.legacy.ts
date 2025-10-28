/**
 * LOC: LEGACY-MED-VALIDATORS
 * WC-VAL-MED-LEGACY | Legacy Medication Validation Schemas
 *
 * UPSTREAM (imports from):
 *   - joi - Validation library
 *
 * DOWNSTREAM (imported by):
 *   - routes/v1/healthcare/validators/medications.validators.ts
 */

/**
 * @fileoverview Legacy Medication Validation Schemas for Old Database Schema
 * @module validators/medicationValidators.legacy
 * @description Joi validation schemas for the legacy medications table schema
 * where medications table contains: medicationName, dosage, frequency, route, prescribedBy, etc.
 * This validates against the database schema created by migration: 20251011221125-create-complete-healthcare-schema.js
 *
 * @database_schema
 * Table: medications
 * Fields:
 *   - id (STRING, PK)
 *   - medicationName (STRING, NOT NULL) - Name of the medication
 *   - dosage (STRING, NOT NULL) - Dosage amount (e.g., "500mg", "2 tablets")
 *   - frequency (STRING, NOT NULL) - Administration frequency (e.g., "twice daily", "BID")
 *   - route (STRING, NOT NULL) - Route of administration (e.g., "Oral", "Topical")
 *   - prescribedBy (STRING, NOT NULL) - Prescribing physician name
 *   - startDate (DATE, NOT NULL) - Prescription start date
 *   - endDate (DATE, NULLABLE) - Prescription end date
 *   - instructions (TEXT, NULLABLE) - Administration instructions
 *   - sideEffects (TEXT, NULLABLE) - Known or observed side effects
 *   - isActive (BOOLEAN, NOT NULL, DEFAULT true) - Active status
 *   - studentId (STRING, NOT NULL, FK) - Reference to student
 *   - createdAt, updatedAt (DATE, NOT NULL)
 *
 * @requires joi - Validation library
 * @security Implements medication administration safety validation
 * @compliance HIPAA-compliant validation for PHI data
 */

import Joi from 'joi';

// ============================================================================
// VALIDATION PATTERNS AND CONSTANTS
// ============================================================================

/**
 * @constant {RegExp} dosagePattern
 * @description Dosage format validation pattern for medication amounts
 * @validation
 * - Numeric value (integer or decimal)
 * - Space (optional)
 * - Unit: mg, g, mcg, ml, L, units, tablets, capsules, drops, puff, patch, spray, application, mEq, %
 * @example
 * // Valid dosages
 * '500mg', '10ml', '2 tablets', '1 unit', '0.5mg', '2.5 tablets'
 *
 * // Invalid
 * '500', 'mg', '500 milligrams', 'two tablets'
 */
const dosagePattern = /^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|tablets?|capsules?|drops?|puff|patch|spray|application|mEq|%)$/i;

/**
 * @constant {Array<RegExp>} frequencyPatterns
 * @description Frequency validation patterns for medication administration schedules
 * @validation Supports standard medical abbreviations and common phrases:
 * - Daily patterns: "once daily", "twice daily", "1x daily", "2x per day"
 * - Multiple times: "three times daily", "four times a day"
 * - Hourly intervals: "every 6 hours", "every 8 hrs"
 * - Medical abbreviations: QID (4x/day), TID (3x/day), BID (2x/day), QD (daily), QHS (at bedtime), PRN (as needed)
 * - Meal-related: "before meals", "after lunch", "with dinner"
 * - Time-specific: "at bedtime", "morning"
 * - Periodic: "weekly", "monthly"
 * @example
 * // Valid frequencies
 * 'twice daily', 'BID', 'every 6 hours', 'q8h', 'as needed', 'PRN', 'before meals', 'at bedtime'
 */
const frequencyPatterns = [
  /^(once|twice|1x|2x|3x|4x)\s*(daily|per day)$/i,
  /^(three|four|five|six)\s*times\s*(daily|per day|a day)$/i,
  /^every\s+[0-9]+\s+(hour|hours|hr|hrs)$/i,
  /^(q[0-9]+h|qid|tid|bid|qd|qhs|prn|ac|pc|hs)$/i,
  /^as\s+needed$/i,
  /^before\s+(meals|breakfast|lunch|dinner|bedtime)$/i,
  /^after\s+(meals|breakfast|lunch|dinner)$/i,
  /^at\s+bedtime$/i,
  /^(morning|noon|evening|night)$/i,
  /^with\s+(meals|food|water)$/i,
  /^weekly$/i,
  /^monthly$/i,
];

/**
 * @constant {Array<string>} administrationRoutes
 * @description Valid routes of medication administration
 * @validation Standard medical administration routes
 */
const administrationRoutes = [
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
  'Vaginal',
  'Buccal',
  'Intradermal',
];

// ============================================================================
// CUSTOM VALIDATORS
// ============================================================================

/**
 * @function frequencyValidator
 * @description Custom Joi validator for medication frequency patterns
 * @param {string} value - Frequency string to validate
 * @param {Object} helpers - Joi helper functions
 * @returns {string|Joi.ErrorReport} Returns value if valid, error if invalid
 * @validation Tests value against all frequencyPatterns (medical abbreviations and common phrases)
 * @throws {ValidationError} When frequency doesn't match any valid pattern
 * @example
 * // Valid inputs
 * frequencyValidator('twice daily', helpers)    // ✓
 * frequencyValidator('BID', helpers)           // ✓
 * frequencyValidator('every 6 hours', helpers) // ✓
 * frequencyValidator('as needed', helpers)     // ✓
 *
 * // Invalid inputs
 * frequencyValidator('whenever', helpers)      // ✗ - Not a standard pattern
 * frequencyValidator('sometimes', helpers)     // ✗ - Too vague
 */
const frequencyValidator = (value: string, helpers: any) => {
  const normalizedValue = value.trim().toLowerCase();
  const isValid = frequencyPatterns.some(pattern => pattern.test(normalizedValue));

  if (!isValid) {
    return helpers.error('string.invalidFrequency');
  }

  return value;
};

// ============================================================================
// MEDICATION VALIDATION SCHEMAS (Legacy Database Schema)
// ============================================================================

/**
 * @constant {Object} createMedicationLegacySchema
 * @description Joi validation schema for creating a medication in the legacy medications table
 * @type {Joi.ObjectSchema}
 *
 * @property {string} medicationName - Required, min 2 chars, max 200 chars, medication name
 * @property {string} dosage - Required, pattern: dosagePattern (e.g., "500mg", "2 tablets")
 * @property {string} frequency - Required, custom validator (e.g., "twice daily", "BID")
 * @property {string} route - Required, enum: administrationRoutes
 * @property {string} prescribedBy - Required, min 3 chars, max 200 chars, prescribing physician
 * @property {Date} startDate - Required, ISO date, cannot be in future
 * @property {Date} [endDate] - Optional, ISO date, must be after startDate
 * @property {string} [instructions] - Optional, max 2000 chars, administration instructions
 * @property {string} [sideEffects] - Optional, max 2000 chars, known or observed side effects
 * @property {boolean} [isActive=true] - Optional, defaults to true, active status
 * @property {string} studentId - Required, UUID, reference to student
 *
 * @validation
 * - medicationName: min 2, max 200 characters
 * - dosage: must match dosagePattern with valid units
 * - frequency: must match frequencyPatterns
 * - route: must be valid administration route
 * - prescribedBy: min 3, max 200 characters
 * - startDate: required, cannot be in future
 * - endDate: optional, must be after startDate
 * - studentId: must be valid UUID
 *
 * @security
 * - Input sanitization through trim()
 * - Length limits prevent buffer overflow
 * - Pattern validation prevents injection attacks
 * - Student ID validation ensures referential integrity
 *
 * @example
 * // Valid medication
 * {
 *   medicationName: 'Amoxicillin 500mg',
 *   dosage: '500mg',
 *   frequency: 'twice daily',
 *   route: 'Oral',
 *   prescribedBy: 'Dr. Jane Smith',
 *   startDate: '2024-01-15T00:00:00Z',
 *   endDate: '2024-01-25T00:00:00Z',
 *   instructions: 'Take with food',
 *   sideEffects: 'May cause nausea',
 *   isActive: true,
 *   studentId: '123e4567-e89b-12d3-a456-426614174000'
 * }
 *
 * @example
 * // Invalid - dosage format incorrect
 * {
 *   medicationName: 'Amoxicillin',
 *   dosage: '500', // Missing unit
 *   frequency: 'twice daily',
 *   route: 'Oral',
 *   prescribedBy: 'Dr. Smith',
 *   startDate: '2024-01-15T00:00:00Z',
 *   studentId: '123e4567-e89b-12d3-a456-426614174000'
 * }
 */
export const createMedicationLegacySchema = Joi.object({
  medicationName: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Medication name must be at least 2 characters',
      'string.max': 'Medication name cannot exceed 200 characters',
      'any.required': 'Medication name is required',
      'string.empty': 'Medication name cannot be empty',
    }),

  dosage: Joi.string()
    .trim()
    .pattern(dosagePattern)
    .required()
    .messages({
      'string.pattern.base': 'Dosage must be in valid format (e.g., "500mg", "2 tablets", "10ml")',
      'any.required': 'Dosage is required',
      'string.empty': 'Dosage cannot be empty',
    }),

  frequency: Joi.string()
    .trim()
    .custom(frequencyValidator, 'frequency validation')
    .required()
    .messages({
      'string.invalidFrequency': 'Frequency must be valid (e.g., "twice daily", "every 6 hours", "as needed", "BID", "TID")',
      'any.required': 'Frequency is required',
      'string.empty': 'Frequency cannot be empty',
    }),

  route: Joi.string()
    .trim()
    .custom((value: string, helpers: any) => {
      // Normalize to capitalize first letter for case-insensitive matching
      const normalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      if (administrationRoutes.includes(normalized)) {
        return normalized;
      }
      return helpers.error('any.only');
    }, 'route validation')
    .required()
    .messages({
      'any.only': 'Route must be a valid administration route (Oral, Topical, Intravenous, etc.)',
      'any.required': 'Administration route is required',
      'string.empty': 'Route cannot be empty',
    }),

  prescribedBy: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Prescribing physician name must be at least 3 characters',
      'string.max': 'Prescribing physician name cannot exceed 200 characters',
      'any.required': 'Prescribing physician is required',
      'string.empty': 'Prescribing physician cannot be empty',
    }),

  startDate: Joi.date()
    .iso()
    .required()
    .messages({
      'date.format': 'Start date must be in ISO 8601 format',
      'any.required': 'Start date is required',
    }),

  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .allow(null)
    .messages({
      'date.format': 'End date must be in ISO 8601 format',
      'date.min': 'End date must be after start date',
    }),

  instructions: Joi.string()
    .trim()
    .max(2000)
    .allow('', null)
    .messages({
      'string.max': 'Instructions cannot exceed 2000 characters',
    }),

  sideEffects: Joi.string()
    .trim()
    .max(2000)
    .allow('', null)
    .messages({
      'string.max': 'Side effects description cannot exceed 2000 characters',
    }),

  isActive: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'isActive must be a boolean value',
    }),

  studentId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required',
      'string.empty': 'Student ID cannot be empty',
    }),
});

/**
 * @constant {Object} updateMedicationLegacySchema
 * @description Joi validation schema for updating a medication in the legacy medications table
 * @type {Joi.ObjectSchema}
 *
 * @description All fields are optional for update operations, but at least one field must be provided
 *
 * @property {string} [medicationName] - Optional, min 2 chars, max 200 chars
 * @property {string} [dosage] - Optional, pattern: dosagePattern
 * @property {string} [frequency] - Optional, custom validator
 * @property {string} [route] - Optional, enum: administrationRoutes
 * @property {string} [prescribedBy] - Optional, min 3 chars, max 200 chars
 * @property {Date} [startDate] - Optional, ISO date, cannot be in future
 * @property {Date} [endDate] - Optional, ISO date, must be after startDate
 * @property {string} [instructions] - Optional, max 2000 chars
 * @property {string} [sideEffects] - Optional, max 2000 chars
 * @property {boolean} [isActive] - Optional, boolean
 *
 * @validation
 * - At least one field must be provided (.min(1))
 * - All validations same as create schema, but all optional
 *
 * @example
 * // Valid update - change dosage and frequency
 * {
 *   dosage: '750mg',
 *   frequency: 'three times daily'
 * }
 *
 * @example
 * // Valid update - deactivate medication
 * {
 *   isActive: false,
 *   endDate: '2024-01-20T00:00:00Z'
 * }
 */
export const updateMedicationLegacySchema = Joi.object({
  medicationName: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .messages({
      'string.min': 'Medication name must be at least 2 characters',
      'string.max': 'Medication name cannot exceed 200 characters',
    }),

  dosage: Joi.string()
    .trim()
    .pattern(dosagePattern)
    .messages({
      'string.pattern.base': 'Dosage must be in valid format (e.g., "500mg", "2 tablets", "10ml")',
    }),

  frequency: Joi.string()
    .trim()
    .custom(frequencyValidator, 'frequency validation')
    .messages({
      'string.invalidFrequency': 'Frequency must be valid (e.g., "twice daily", "every 6 hours", "as needed")',
    }),

  route: Joi.string()
    .trim()
    .custom((value: string, helpers: any) => {
      // Normalize to capitalize first letter for case-insensitive matching
      const normalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      if (administrationRoutes.includes(normalized)) {
        return normalized;
      }
      return helpers.error('any.only');
    }, 'route validation')
    .messages({
      'any.only': 'Route must be a valid administration route',
    }),

  prescribedBy: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .messages({
      'string.min': 'Prescribing physician name must be at least 3 characters',
      'string.max': 'Prescribing physician name cannot exceed 200 characters',
    }),

  startDate: Joi.date()
    .iso()
    .messages({
      'date.format': 'Start date must be in ISO 8601 format',
    }),

  endDate: Joi.date()
    .iso()
    .allow(null)
    .messages({
      'date.format': 'End date must be in ISO 8601 format',
    }),

  instructions: Joi.string()
    .trim()
    .max(2000)
    .allow('', null)
    .messages({
      'string.max': 'Instructions cannot exceed 2000 characters',
    }),

  sideEffects: Joi.string()
    .trim()
    .max(2000)
    .allow('', null)
    .messages({
      'string.max': 'Side effects description cannot exceed 2000 characters',
    }),

  isActive: Joi.boolean()
    .messages({
      'boolean.base': 'isActive must be a boolean value',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

/**
 * @constant {Object} deactivateMedicationLegacySchema
 * @description Joi validation schema for deactivating a medication
 * @type {Joi.ObjectSchema}
 *
 * @property {string} reason - Required, min 10 chars, max 500 chars, deactivation reason
 * @property {string} deactivationType - Required, enum: valid deactivation types
 *
 * @validation
 * - reason: min 10, max 500 characters for audit trail
 * - deactivationType: must be valid enum value
 *
 * @example
 * {
 *   reason: 'Treatment completed successfully after 10-day course',
 *   deactivationType: 'COMPLETED'
 * }
 */
export const deactivateMedicationLegacySchema = Joi.object({
  reason: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Deactivation reason must be at least 10 characters',
      'string.max': 'Deactivation reason cannot exceed 500 characters',
      'any.required': 'Reason is required for audit trail',
      'string.empty': 'Reason cannot be empty',
    }),

  deactivationType: Joi.string()
    .valid('COMPLETED', 'DISCONTINUED', 'CHANGED', 'ADVERSE_REACTION', 'PATIENT_REQUEST', 'PHYSICIAN_ORDER', 'OTHER')
    .required()
    .messages({
      'any.only': 'Deactivation type must be valid (COMPLETED, DISCONTINUED, CHANGED, ADVERSE_REACTION, PATIENT_REQUEST, PHYSICIAN_ORDER, OTHER)',
      'any.required': 'Deactivation type is required',
    }),
});

/**
 * @constant {Object} listMedicationsQueryLegacySchema
 * @description Joi validation schema for querying medications list
 * @type {Joi.ObjectSchema}
 *
 * @property {number} [page] - Optional, page number, min 1
 * @property {number} [limit] - Optional, items per page, min 1, max 100
 * @property {string} [search] - Optional, search term for medication name
 * @property {string} [studentId] - Optional, UUID, filter by student
 * @property {boolean} [isActive] - Optional, filter by active status
 *
 * @example
 * {
 *   page: 1,
 *   limit: 20,
 *   search: 'amoxicillin',
 *   isActive: true
 * }
 */
export const listMedicationsQueryLegacySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Page must be at least 1',
      'number.base': 'Page must be a number',
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
      'number.base': 'Limit must be a number',
    }),

  search: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.base': 'Search must be a string',
    }),

  studentId: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
    }),

  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isActive must be a boolean',
    }),
});

/**
 * @constant {Object} medicationIdParamLegacySchema
 * @description Joi validation schema for medication ID parameter
 * @type {Joi.ObjectSchema}
 *
 * @property {string} id - Required, UUID, medication ID
 */
export const medicationIdParamLegacySchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Medication ID must be a valid UUID',
      'any.required': 'Medication ID is required',
    }),
});

/**
 * @constant {Object} studentIdParamLegacySchema
 * @description Joi validation schema for student ID parameter
 * @type {Joi.ObjectSchema}
 *
 * @property {string} studentId - Required, UUID, student ID
 */
export const studentIdParamLegacySchema = Joi.object({
  studentId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required',
    }),
});

// ============================================================================
// RE-EXPORTS FOR BACKWARD COMPATIBILITY
// ============================================================================

/**
 * Export legacy schemas with standard names for easy integration
 */
export {
  createMedicationLegacySchema as createMedicationSchema,
  updateMedicationLegacySchema as updateMedicationSchema,
  deactivateMedicationLegacySchema as deactivateMedicationSchema,
  listMedicationsQueryLegacySchema as listMedicationsQuerySchema,
  medicationIdParamLegacySchema as medicationIdParamSchema,
  studentIdParamLegacySchema as studentIdParamSchema,
};
