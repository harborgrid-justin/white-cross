/**
 * LOC: 61C2BBD27B
 * WC-VAL-MED-010 | Medication Validation Schemas
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - routes/v1/healthcare/validators/medications.validators.ts
 *
 * ⚠️ DATABASE SCHEMA NOTE:
 * This codebase has TWO different medication table schemas:
 *
 * 1. LEGACY SCHEMA (migration: 20251011221125-create-complete-healthcare-schema.js):
 *    - Single `medications` table with fields:
 *      medicationName, dosage, frequency, route, prescribedBy, startDate, endDate,
 *      instructions, sideEffects, isActive, studentId
 *
 * 2. NEW SCHEMA (migration: 00004-create-medications-extended.ts):
 *    - Separate tables: `medications` and `student_medications`
 *    - medications: name, genericName, dosageForm, strength, manufacturer, ndc, isControlled
 *    - student_medications: studentId, medicationId, dosage, frequency, route, instructions,
 *      startDate, endDate, isActive, prescribedBy
 *
 * THIS FILE validates against the NEW SCHEMA (separate tables).
 * For LEGACY SCHEMA validation, use: medicationValidators.legacy.ts
 *
 * To determine which schema your database uses, check which migration was run.
 */

/**
 * WC-VAL-MED-010 | Medication Validation Schemas
 * Purpose: Joi validation schemas for medication operations, Five Rights compliance
 * Upstream: External joi package | Dependencies: joi, moment
 * Downstream: routes/medications.ts, medicationService | Called by: Medication API endpoints
 * Related: medicationService.ts, routes/medications.ts, MedicationInventory.ts
 * Exports: Joi schemas for validation | Key Services: Input validation, safety checks
 * Last Updated: 2025-10-23 | Dependencies: joi, moment-timezone
 * Critical Path: Request → Schema validation → Type safety → Service call
 * LLM Context: Medication safety validation, prevents dosing errors, HIPAA compliance
 */

/**
 * @fileoverview Medication Validation Schemas (NEW SCHEMA - Separate Tables)
 * @module validators/medicationValidators
 * @description Comprehensive Joi validation schemas for medication operations following the Five Rights of Medication Administration
 * @requires joi - Validation library
 * @security Implements Five Rights: Right Patient, Right Medication, Right Dose, Right Route, Right Time
 * @compliance DEA Schedule validation for controlled substances, NDC code validation, dosage safety checks
 *
 * @database_schema_new
 * This validates against the NEW two-table schema:
 *
 * Table: medications (formulary)
 * Fields: id, name, genericName, dosageForm, strength, manufacturer, ndc, isControlled
 *
 * Table: student_medications (prescriptions)
 * Fields: id, studentId, medicationId, dosage, frequency, route, instructions,
 *         startDate, endDate, isActive, prescribedBy
 */

import Joi from 'joi';

// ============================================================================
// VALIDATION PATTERNS AND CONSTANTS
// ============================================================================

/**
 * @constant {RegExp} ndcPattern
 * @description NDC (National Drug Code) format validation pattern
 * @validation
 * - Format: XXXXX-XXXX-XX (5-4-2 format) or XXXXX-XXX-XX (5-3-2 format)
 * - Must be all numeric with hyphens in correct positions
 * @example
 * // Valid NDC codes
 * '12345-1234-12'  // 5-4-2 format
 * '12345-123-12'   // 5-3-2 format
 *
 * // Invalid
 * '1234-1234-12'   // Wrong format
 * '12345-12345-12' // Too many digits in middle section
 */
const ndcPattern = /^[0-9]{5}-([0-9]{3,4})-[0-9]{2}$/;

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
  /^weekly$/i,
  /^monthly$/i,
];

/**
 * @constant {Array<string>} deaSchedules
 * @description DEA Schedule classification for controlled substances
 * @validation
 * - Schedule I: High abuse potential, no accepted medical use (research only)
 * - Schedule II: High abuse potential, accepted medical use with severe restrictions
 * - Schedule III: Moderate to low abuse potential
 * - Schedule IV: Low abuse potential
 * - Schedule V: Lowest abuse potential
 * @security Schedule II substances require witness for administration
 * @example ['I', 'II', 'III', 'IV', 'V']
 */
const deaSchedules = ['I', 'II', 'III', 'IV', 'V'];

// ============================================================================
// MEDICATION VALIDATION
// ============================================================================

/**
 * @constant {Object} createMedicationSchema
 * @description Joi validation schema for creating a new medication in the formulary
 * @type {Joi.ObjectSchema}
 * @property {string} name - Required, min 2 chars, max 200 chars, medication name
 * @property {string} [genericName] - Optional, min 2 chars, max 200 chars
 * @property {string} dosageForm - Required, enum: ['Tablet', 'Capsule', 'Liquid', 'Injection', 'Topical', 'Inhaler', 'Drops', 'Patch', 'Suppository', 'Powder', 'Cream', 'Ointment', 'Gel', 'Spray', 'Lozenge']
 * @property {string} strength - Required, pattern: /^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|mEq|%)$/i (e.g., "500mg", "10ml")
 * @property {string} [manufacturer] - Optional, max 200 chars
 * @property {string} [ndc] - Optional, NDC format: XXXXX-XXXX-XX or XXXXX-XXX-XX
 * @property {boolean} [isControlled=false] - Optional, defaults to false
 * @property {string} deaSchedule - Conditional required when isControlled=true, enum: ['I', 'II', 'III', 'IV', 'V']
 * @property {boolean} requiresWitness - Defaults to true for Schedule I/II, false otherwise
 * @validation
 * - Controlled substances (isControlled=true) MUST have DEA Schedule
 * - Schedule I and II substances automatically require witness
 * - Strength must match dosage pattern with valid units
 * @security
 * - NDC validation prevents invalid drug codes
 * - DEA Schedule validation ensures proper controlled substance handling
 * - Witness requirement for high-risk medications (Schedule I/II)
 * @example
 * // Valid medication
 * {
 *   name: 'Amoxicillin',
 *   genericName: 'Amoxicillin',
 *   dosageForm: 'Capsule',
 *   strength: '500mg',
 *   manufacturer: 'Generic Pharma',
 *   ndc: '12345-1234-12',
 *   isControlled: false
 * }
 *
 * @example
 * // Valid controlled substance
 * {
 *   name: 'Adderall',
 *   genericName: 'Amphetamine/Dextroamphetamine',
 *   dosageForm: 'Tablet',
 *   strength: '10mg',
 *   isControlled: true,
 *   deaSchedule: 'II',
 *   requiresWitness: true
 * }
 *
 * @example
 * // Invalid - controlled substance missing DEA schedule
 * {
 *   name: 'Oxycodone',
 *   dosageForm: 'Tablet',
 *   strength: '5mg',
 *   isControlled: true
 *   // Missing deaSchedule - will fail validation
 * }
 */
export const createMedicationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Medication name must be at least 2 characters',
      'string.max': 'Medication name cannot exceed 200 characters',
      'any.required': 'Medication name is required',
    }),

  genericName: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .allow('', null)
    .messages({
      'string.min': 'Generic name must be at least 2 characters',
      'string.max': 'Generic name cannot exceed 200 characters',
    }),

  dosageForm: Joi.string()
    .trim()
    .valid(
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
      'Lozenge'
    )
    .required()
    .messages({
      'any.only': 'Dosage form must be a valid pharmaceutical form',
      'any.required': 'Dosage form is required',
    }),

  strength: Joi.string()
    .trim()
    .pattern(/^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|mEq|%)$/i)
    .required()
    .messages({
      'string.pattern.base': 'Strength must be in valid format (e.g., "500mg", "10ml", "50mcg")',
      'any.required': 'Strength is required',
    }),

  manufacturer: Joi.string()
    .trim()
    .max(200)
    .allow('', null)
    .messages({
      'string.max': 'Manufacturer name cannot exceed 200 characters',
    }),

  ndc: Joi.string()
    .trim()
    .pattern(ndcPattern)
    .allow('', null)
    .messages({
      'string.pattern.base': 'NDC must be in format: XXXXX-XXXX-XX or XXXXX-XXX-XX',
    }),

  isControlled: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'isControlled must be a boolean value',
    }),

  deaSchedule: Joi.when('isControlled', {
    is: true,
    then: Joi.string()
      .valid(...deaSchedules)
      .required()
      .messages({
        'any.only': 'DEA Schedule must be I, II, III, IV, or V',
        'any.required': 'DEA Schedule is required for controlled substances',
      }),
    otherwise: Joi.string().valid(...deaSchedules).allow(null),
  }),

  requiresWitness: Joi.when('deaSchedule', {
    is: Joi.string().valid('I', 'II'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
});

/**
 * Schema for updating a medication
 */
export const updateMedicationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .messages({
      'string.min': 'Medication name must be at least 2 characters',
      'string.max': 'Medication name cannot exceed 200 characters',
    }),

  genericName: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .allow('', null)
    .messages({
      'string.min': 'Generic name must be at least 2 characters',
      'string.max': 'Generic name cannot exceed 200 characters',
    }),

  dosageForm: Joi.string()
    .trim()
    .valid(
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
      'Lozenge'
    )
    .messages({
      'any.only': 'Dosage form must be a valid pharmaceutical form',
    }),

  strength: Joi.string()
    .trim()
    .pattern(/^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|mEq|%)$/i)
    .messages({
      'string.pattern.base': 'Strength must be in valid format (e.g., "500mg", "10ml", "50mcg")',
    }),

  manufacturer: Joi.string()
    .trim()
    .max(200)
    .allow('', null)
    .messages({
      'string.max': 'Manufacturer name cannot exceed 200 characters',
    }),

  ndc: Joi.string()
    .trim()
    .pattern(ndcPattern)
    .allow('', null)
    .messages({
      'string.pattern.base': 'NDC must be in format: XXXXX-XXXX-XX or XXXXX-XXX-XX',
    }),

  isControlled: Joi.boolean(),

  deaSchedule: Joi.string()
    .valid(...deaSchedules)
    .allow(null)
    .messages({
      'any.only': 'DEA Schedule must be I, II, III, IV, or V',
    }),
}).min(1);

// ============================================================================
// PRESCRIPTION (STUDENT MEDICATION) VALIDATION
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

/**
 * Schema for assigning medication to student (creating prescription)
 */
export const assignMedicationToStudentSchema = Joi.object({
  studentId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required (Right Patient)',
    }),

  medicationId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Medication ID must be a valid UUID',
      'any.required': 'Medication ID is required (Right Medication)',
    }),

  dosage: Joi.string()
    .trim()
    .pattern(dosagePattern)
    .required()
    .messages({
      'string.pattern.base': 'Dosage must be in valid format (e.g., "500mg", "2 tablets", "10ml")',
      'any.required': 'Dosage is required (Right Dose)',
    }),

  frequency: Joi.string()
    .trim()
    .custom(frequencyValidator, 'frequency validation')
    .required()
    .messages({
      'string.invalidFrequency': 'Frequency must be valid (e.g., "twice daily", "every 6 hours", "as needed", "BID", "TID")',
      'any.required': 'Frequency is required',
    }),

  route: Joi.string()
    .trim()
    .valid(
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
      'Transdermal'
    )
    .required()
    .messages({
      'any.only': 'Route must be a valid administration route',
      'any.required': 'Administration route is required (Right Route)',
    }),

  instructions: Joi.string()
    .trim()
    .max(2000)
    .allow('', null)
    .messages({
      'string.max': 'Instructions cannot exceed 2000 characters',
    }),

  startDate: Joi.date()
    .iso()
    .max('now')
    .required()
    .messages({
      'date.max': 'Start date cannot be in the future',
      'any.required': 'Start date is required',
    }),

  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .allow(null)
    .messages({
      'date.min': 'End date must be after start date',
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
    }),

  prescriptionNumber: Joi.string()
    .trim()
    .pattern(/^[A-Z0-9]{6,20}$/i)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Prescription number must be 6-20 alphanumeric characters',
    }),

  refillsRemaining: Joi.number()
    .integer()
    .min(0)
    .max(12)
    .default(0)
    .messages({
      'number.min': 'Refills remaining cannot be negative',
      'number.max': 'Refills remaining cannot exceed 12',
    }),
});

/**
 * Schema for updating student medication
 */
export const updateStudentMedicationSchema = Joi.object({
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
    .valid(
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
      'Transdermal'
    )
    .messages({
      'any.only': 'Route must be a valid administration route',
    }),

  instructions: Joi.string()
    .trim()
    .max(2000)
    .allow('', null),

  endDate: Joi.date()
    .iso()
    .allow(null),

  isActive: Joi.boolean(),

  refillsRemaining: Joi.number()
    .integer()
    .min(0)
    .max(12),
}).min(1);

// ============================================================================
// MEDICATION ADMINISTRATION VALIDATION
// ============================================================================

/**
 * @constant {Object} logMedicationAdministrationSchema
 * @description Joi validation schema for logging medication administration - CRITICAL FOR PATIENT SAFETY
 * @type {Joi.ObjectSchema}
 * @security Implements the Five Rights of Medication Administration:
 * - Right Patient: studentMedicationId + patientVerified
 * - Right Medication: Verified through studentMedicationId link
 * - Right Dose: dosageGiven validation
 * - Right Route: Verified through prescription
 * - Right Time: timeGiven validation
 * @property {string} studentMedicationId - Required UUID, links to prescription (Right Patient, Right Medication)
 * @property {string} dosageGiven - Required, pattern: dosagePattern (e.g., "500mg", "2 tablets") (Right Dose)
 * @property {Date} timeGiven - Required, cannot be in future (Right Time)
 * @property {string} [notes] - Optional, max 2000 chars, administration notes
 * @property {string} [sideEffects] - Optional, max 2000 chars, observed side effects
 * @property {string} [deviceId] - Optional, max 100 chars, device identifier (e.g., inhaler serial)
 * @property {string} [witnessId] - Optional UUID, required for controlled substances
 * @property {string} [witnessName] - Optional, max 200 chars, witness name for controlled substances
 * @property {boolean} [patientVerified=true] - Optional, defaults to true, confirms patient identity
 * @property {boolean} [allergyChecked=true] - Optional, defaults to true, confirms allergy review
 * @validation
 * - Dosage must match valid format (number + unit)
 * - Time cannot be in future (prevents backdating)
 * - Patient verification required (safety check)
 * - Allergy check required (safety check)
 * @security
 * - Patient identity verification
 * - Allergy cross-check
 * - Witness requirement for controlled substances
 * - Audit trail with timestamps
 * @example
 * // Valid medication administration
 * {
 *   studentMedicationId: '123e4567-e89b-12d3-a456-426614174000',
 *   dosageGiven: '500mg',
 *   timeGiven: '2024-10-18T14:30:00Z',
 *   notes: 'Administered with water, no issues',
 *   patientVerified: true,
 *   allergyChecked: true
 * }
 *
 * @example
 * // Controlled substance with witness
 * {
 *   studentMedicationId: '123e4567-e89b-12d3-a456-426614174000',
 *   dosageGiven: '10mg',
 *   timeGiven: '2024-10-18T08:00:00Z',
 *   witnessId: '987e6543-e21b-43d2-b654-426614174999',
 *   witnessName: 'Sarah Johnson, RN',
 *   patientVerified: true,
 *   allergyChecked: true
 * }
 *
 * @example
 * // Invalid - future timestamp
 * {
 *   studentMedicationId: '123e4567-e89b-12d3-a456-426614174000',
 *   dosageGiven: '500mg',
 *   timeGiven: '2099-01-01T00:00:00Z'  // In future - will fail
 * }
 */
export const logMedicationAdministrationSchema = Joi.object({
  studentMedicationId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Student medication ID must be a valid UUID',
      'any.required': 'Student medication ID is required',
    }),

  dosageGiven: Joi.string()
    .trim()
    .pattern(dosagePattern)
    .required()
    .messages({
      'string.pattern.base': 'Dosage given must be in valid format (e.g., "500mg", "2 tablets", "10ml")',
      'any.required': 'Dosage given is required (Right Dose)',
    }),

  timeGiven: Joi.date()
    .iso()
    .max('now')
    .required()
    .messages({
      'date.max': 'Administration time cannot be in the future',
      'any.required': 'Administration time is required (Right Time)',
    }),

  notes: Joi.string()
    .trim()
    .max(2000)
    .allow('', null)
    .messages({
      'string.max': 'Notes cannot exceed 2000 characters',
    }),

  sideEffects: Joi.string()
    .trim()
    .max(2000)
    .allow('', null)
    .messages({
      'string.max': 'Side effects description cannot exceed 2000 characters',
    }),

  deviceId: Joi.string()
    .trim()
    .max(100)
    .allow('', null)
    .messages({
      'string.max': 'Device ID cannot exceed 100 characters',
    }),

  witnessId: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      'string.guid': 'Witness ID must be a valid UUID',
    }),

  witnessName: Joi.string()
    .trim()
    .max(200)
    .allow('', null)
    .messages({
      'string.max': 'Witness name cannot exceed 200 characters',
    }),

  patientVerified: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Patient verification must be a boolean',
    }),

  allergyChecked: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Allergy check must be a boolean',
    }),
});

// ============================================================================
// INVENTORY VALIDATION
// ============================================================================

/**
 * Schema for adding medication to inventory
 */
export const addToInventorySchema = Joi.object({
  medicationId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Medication ID must be a valid UUID',
      'any.required': 'Medication ID is required',
    }),

  batchNumber: Joi.string()
    .trim()
    .pattern(/^[A-Z0-9-]{3,50}$/i)
    .required()
    .messages({
      'string.pattern.base': 'Batch number must be 3-50 alphanumeric characters (may include hyphens)',
      'any.required': 'Batch number is required',
    }),

  expirationDate: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.min': 'Expiration date must be in the future - cannot add expired medication',
      'any.required': 'Expiration date is required',
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .max(100000)
    .required()
    .messages({
      'number.min': 'Quantity must be at least 1',
      'number.max': 'Quantity cannot exceed 100,000 units',
      'any.required': 'Quantity is required',
    }),

  reorderLevel: Joi.number()
    .integer()
    .min(0)
    .max(10000)
    .default(10)
    .messages({
      'number.min': 'Reorder level cannot be negative',
      'number.max': 'Reorder level cannot exceed 10,000 units',
    }),

  costPerUnit: Joi.number()
    .precision(4)
    .min(0)
    .max(100000)
    .allow(null)
    .messages({
      'number.min': 'Cost per unit cannot be negative',
      'number.max': 'Cost per unit cannot exceed $100,000',
    }),

  supplier: Joi.string()
    .trim()
    .max(200)
    .allow('', null)
    .messages({
      'string.max': 'Supplier name cannot exceed 200 characters',
    }),

  location: Joi.string()
    .trim()
    .max(200)
    .allow('', null)
    .messages({
      'string.max': 'Storage location cannot exceed 200 characters',
    }),
});

/**
 * Schema for updating inventory quantity
 */
export const updateInventoryQuantitySchema = Joi.object({
  quantity: Joi.number()
    .integer()
    .min(0)
    .max(100000)
    .required()
    .messages({
      'number.min': 'Quantity cannot be negative',
      'number.max': 'Quantity cannot exceed 100,000 units',
      'any.required': 'New quantity is required',
    }),

  reason: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.min': 'Reason must be at least 5 characters',
      'string.max': 'Reason cannot exceed 500 characters',
      'any.required': 'Reason for quantity adjustment is required for audit trail',
    }),

  adjustmentType: Joi.string()
    .valid('CORRECTION', 'DISPOSAL', 'TRANSFER', 'ADMINISTRATION', 'EXPIRED', 'LOST', 'DAMAGED', 'RETURNED')
    .required()
    .messages({
      'any.only': 'Adjustment type must be valid',
      'any.required': 'Adjustment type is required for audit trail',
    }),
});

// ============================================================================
// ADVERSE REACTION VALIDATION
// ============================================================================

/**
 * Schema for reporting adverse medication reaction
 */
export const reportAdverseReactionSchema = Joi.object({
  studentMedicationId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Student medication ID must be a valid UUID',
      'any.required': 'Student medication ID is required',
    }),

  severity: Joi.string()
    .valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING')
    .required()
    .messages({
      'any.only': 'Severity must be MILD, MODERATE, SEVERE, or LIFE_THREATENING',
      'any.required': 'Severity is required',
    }),

  reaction: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Reaction description must be at least 10 characters',
      'string.max': 'Reaction description cannot exceed 2000 characters',
      'any.required': 'Reaction description is required',
    }),

  actionTaken: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Action taken must be at least 10 characters',
      'string.max': 'Action taken cannot exceed 2000 characters',
      'any.required': 'Action taken is required',
    }),

  notes: Joi.string()
    .trim()
    .max(5000)
    .allow('', null)
    .messages({
      'string.max': 'Notes cannot exceed 5000 characters',
    }),

  reportedAt: Joi.date()
    .iso()
    .max('now')
    .required()
    .messages({
      'date.max': 'Reported time cannot be in the future',
      'any.required': 'Reported time is required',
    }),

  emergencyServicesContacted: Joi.when('severity', {
    is: Joi.string().valid('SEVERE', 'LIFE_THREATENING'),
    then: Joi.boolean().required().messages({
      'any.required': 'Must indicate if emergency services were contacted for SEVERE or LIFE_THREATENING reactions',
    }),
    otherwise: Joi.boolean().default(false),
  }),

  parentNotified: Joi.when('severity', {
    is: Joi.string().valid('MODERATE', 'SEVERE', 'LIFE_THREATENING'),
    then: Joi.boolean().required().messages({
      'any.required': 'Must indicate if parent was notified for MODERATE, SEVERE, or LIFE_THREATENING reactions',
    }),
    otherwise: Joi.boolean().default(false),
  }),
});

// ============================================================================
// DEACTIVATION VALIDATION
// ============================================================================

/**
 * Schema for deactivating student medication
 */
export const deactivateStudentMedicationSchema = Joi.object({
  reason: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Deactivation reason must be at least 10 characters',
      'string.max': 'Deactivation reason cannot exceed 500 characters',
      'any.required': 'Reason is required for audit trail',
    }),

  deactivationType: Joi.string()
    .valid('COMPLETED', 'DISCONTINUED', 'CHANGED', 'ADVERSE_REACTION', 'PATIENT_REQUEST', 'PHYSICIAN_ORDER', 'OTHER')
    .required()
    .messages({
      'any.only': 'Deactivation type must be valid',
      'any.required': 'Deactivation type is required',
    }),
});

/**
 * Schema for deactivating medication (from formulary)
 */
export const deactivateMedicationSchema = Joi.object({
  reason: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Deactivation reason must be at least 10 characters',
      'string.max': 'Deactivation reason cannot exceed 500 characters',
      'any.required': 'Reason is required for audit trail',
    }),

  deactivationType: Joi.string()
    .valid('COMPLETED', 'DISCONTINUED', 'CHANGED', 'ADVERSE_REACTION', 'PATIENT_REQUEST', 'PHYSICIAN_ORDER', 'OTHER')
    .required()
    .messages({
      'any.only': 'Deactivation type must be valid (COMPLETED, DISCONTINUED, CHANGED, ADVERSE_REACTION, PATIENT_REQUEST, PHYSICIAN_ORDER, OTHER)',
      'any.required': 'Deactivation type is required',
    }),
});
