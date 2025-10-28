/**
 * Health Records Validators
 * Validation schemas for comprehensive health record management
 *
 * @description Joi validation schemas aligned with health_records database table schema
 *
 * Key Schema Alignments:
 * - recordType: ENUM validation matching HealthRecordType (8 values: CHECKUP, VACCINATION, ILLNESS, INJURY, ALLERGY, CHRONIC_CONDITION, SCREENING, EMERGENCY)
 * - recordDate: ISO date validation, cannot be in the future (REQUIRED)
 * - diagnosis: Optional text for medical diagnosis
 * - treatment: Optional text for treatment information
 * - notes: Optional additional comments
 * - provider: Optional healthcare provider name
 *
 * All schemas include comprehensive JSDoc documentation with field descriptions
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

/**
 * General Health Record Schemas
 * Aligned with health_records database table schema
 */

/**
 * Query schema for filtering health records
 * @property {string} recordType - Filter by record type (CHECKUP, VACCINATION, etc.)
 * @property {Date} dateFrom - Filter records from this date onwards
 * @property {Date} dateTo - Filter records up to this date
 * @property {string} provider - Filter by healthcare provider name
 */
export const healthRecordQuerySchema = paginationSchema.keys({
  recordType: Joi.string()
    .valid(
      'CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'ALLERGY',
      'CHRONIC_CONDITION', 'SCREENING', 'EMERGENCY'
    )
    .optional()
    .description('Filter by record type'),
  dateFrom: Joi.date().iso().optional().description('Start date for filtering'),
  dateTo: Joi.date().iso().optional().description('End date for filtering'),
  provider: Joi.string().trim().optional().description('Healthcare provider name filter')
});

/**
 * Schema for creating a new health record
 * Maps to health_records database table columns
 * @property {string} studentId - Student UUID (required)
 * @property {string} recordType - Type of health record (required, ENUM)
 * @property {Date} recordDate - Date when health event occurred (required, cannot be future)
 * @property {string} diagnosis - Medical diagnosis description (optional)
 * @property {string} treatment - Treatment provided or recommended (optional)
 * @property {string} notes - Additional notes (optional)
 * @property {string} provider - Healthcare provider name (optional)
 */
export const createHealthRecordSchema = Joi.object({
  studentId: Joi.string().uuid().required()
    .description('Student UUID reference'),
  recordType: Joi.string()
    .valid(
      'CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'ALLERGY',
      'CHRONIC_CONDITION', 'SCREENING', 'EMERGENCY'
    )
    .required()
    .description('Type of health record'),
  recordDate: Joi.date().iso().max('now').required()
    .description('Date when health event occurred'),
  diagnosis: Joi.string().trim().max(5000).optional()
    .description('Medical diagnosis description'),
  treatment: Joi.string().trim().max(5000).optional()
    .description('Treatment provided or recommended'),
  notes: Joi.string().trim().max(5000).optional()
    .description('Additional notes or comments'),
  provider: Joi.string().trim().max(255).optional()
    .description('Healthcare provider name')
}).description('Create new health record with database-aligned fields');

/**
 * Schema for updating an existing health record
 * All fields optional except at least one must be provided
 * Maps to health_records table columns
 */
export const updateHealthRecordSchema = Joi.object({
  recordType: Joi.string()
    .valid(
      'CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'ALLERGY',
      'CHRONIC_CONDITION', 'SCREENING', 'EMERGENCY'
    )
    .optional()
    .description('Type of health record'),
  recordDate: Joi.date().iso().max('now').optional()
    .description('Date when health event occurred'),
  diagnosis: Joi.string().trim().max(5000).optional()
    .description('Medical diagnosis description'),
  treatment: Joi.string().trim().max(5000).optional()
    .description('Treatment provided or recommended'),
  notes: Joi.string().trim().max(5000).optional()
    .description('Additional notes or comments'),
  provider: Joi.string().trim().max(255).optional()
    .description('Healthcare provider name')
}).min(1).description('Update health record - at least one field required');

/**
 * Allergy Schemas
 */

export const createAllergySchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  allergen: Joi.string().trim().min(2).max(200).required(),
  severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING').required(),
  reaction: Joi.string().trim().max(1000).optional(),
  treatment: Joi.string().trim().max(1000).optional(),
  verified: Joi.boolean().optional(),
  verifiedBy: Joi.string().trim().optional()
});

export const updateAllergySchema = Joi.object({
  allergen: Joi.string().trim().min(2).max(200).optional(),
  severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING').optional(),
  reaction: Joi.string().trim().max(1000).optional(),
  treatment: Joi.string().trim().max(1000).optional(),
  verified: Joi.boolean().optional(),
  verifiedBy: Joi.string().trim().optional()
}).min(1);

/**
 * Chronic Condition Schemas
 */

export const createChronicConditionSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  condition: Joi.string().trim().min(2).max(200).required(),
  diagnosisDate: Joi.date().iso().max('now').required(),
  status: Joi.string().valid('ACTIVE', 'CONTROLLED', 'IN_REMISSION', 'CURED').optional(),
  severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE', 'CRITICAL').optional(),
  notes: Joi.string().trim().max(5000).optional(),
  carePlan: Joi.string().trim().max(5000).optional(),
  medications: Joi.array().items(Joi.string()).optional(),
  restrictions: Joi.array().items(Joi.string()).optional(),
  triggers: Joi.array().items(Joi.string()).optional(),
  diagnosedBy: Joi.string().trim().optional(),
  lastReviewDate: Joi.date().iso().optional(),
  nextReviewDate: Joi.date().iso().min('now').optional(),
  icdCode: Joi.string().trim().pattern(/^[A-Z]\d{2}/).optional()
});

export const updateChronicConditionSchema = Joi.object({
  condition: Joi.string().trim().min(2).max(200).optional(),
  diagnosisDate: Joi.date().iso().max('now').optional(),
  status: Joi.string().valid('ACTIVE', 'CONTROLLED', 'IN_REMISSION', 'CURED').optional(),
  severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE', 'CRITICAL').optional(),
  notes: Joi.string().trim().max(5000).optional(),
  carePlan: Joi.string().trim().max(5000).optional(),
  medications: Joi.array().items(Joi.string()).optional(),
  restrictions: Joi.array().items(Joi.string()).optional(),
  triggers: Joi.array().items(Joi.string()).optional(),
  diagnosedBy: Joi.string().trim().optional(),
  lastReviewDate: Joi.date().iso().optional(),
  nextReviewDate: Joi.date().iso().min('now').optional(),
  icdCode: Joi.string().trim().pattern(/^[A-Z]\d{2}/).optional()
}).min(1);

/**
 * Vaccination/Immunization Schemas
 */

export const createVaccinationSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  vaccineName: Joi.string().trim().min(2).max(200).required(),
  administrationDate: Joi.date().iso().max('now').required(),
  administeredBy: Joi.string().trim().required(),
  cvxCode: Joi.string().trim().optional(),
  ndcCode: Joi.string().trim().optional(),
  lotNumber: Joi.string().trim().optional(),
  manufacturer: Joi.string().trim().optional(),
  doseNumber: Joi.number().integer().min(1).optional(),
  totalDoses: Joi.number().integer().min(1).optional(),
  expirationDate: Joi.date().iso().optional(),
  nextDueDate: Joi.date().iso().min('now').optional(),
  site: Joi.string().valid('LEFT_ARM', 'RIGHT_ARM', 'LEFT_THIGH', 'RIGHT_THIGH', 'ORAL', 'NASAL').optional(),
  route: Joi.string().valid('IM', 'SC', 'ID', 'ORAL', 'NASAL', 'IV').optional(),
  dosageAmount: Joi.string().trim().optional(),
  reactions: Joi.string().trim().max(1000).optional(),
  notes: Joi.string().trim().max(2000).optional()
});

export const updateVaccinationSchema = Joi.object({
  vaccineName: Joi.string().trim().min(2).max(200).optional(),
  administrationDate: Joi.date().iso().max('now').optional(),
  administeredBy: Joi.string().trim().optional(),
  cvxCode: Joi.string().trim().optional(),
  ndcCode: Joi.string().trim().optional(),
  lotNumber: Joi.string().trim().optional(),
  manufacturer: Joi.string().trim().optional(),
  doseNumber: Joi.number().integer().min(1).optional(),
  totalDoses: Joi.number().integer().min(1).optional(),
  expirationDate: Joi.date().iso().optional(),
  nextDueDate: Joi.date().iso().min('now').optional(),
  site: Joi.string().valid('LEFT_ARM', 'RIGHT_ARM', 'LEFT_THIGH', 'RIGHT_THIGH', 'ORAL', 'NASAL').optional(),
  route: Joi.string().valid('IM', 'SC', 'ID', 'ORAL', 'NASAL', 'IV').optional(),
  dosageAmount: Joi.string().trim().optional(),
  reactions: Joi.string().trim().max(1000).optional(),
  notes: Joi.string().trim().max(2000).optional()
}).min(1);

/**
 * Vital Signs Schemas
 */

export const recordVitalsSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  recordedBy: Joi.string().trim().required(),
  vitals: Joi.object({
    temperature: Joi.number().min(90).max(115).optional(),
    bloodPressureSystolic: Joi.number().min(50).max(250).optional(),
    bloodPressureDiastolic: Joi.number().min(30).max(150).optional(),
    heartRate: Joi.number().min(30).max(250).optional(),
    respiratoryRate: Joi.number().min(5).max(60).optional(),
    oxygenSaturation: Joi.number().min(70).max(100).optional(),
    height: Joi.number().min(30).max(250).optional(),
    weight: Joi.number().min(5).max(500).optional(),
    bmi: Joi.number().min(10).max(80).optional()
  }).required()
});

/**
 * Parameter Schemas
 */

export const studentIdParamSchema = Joi.object({
  studentId: Joi.string().uuid().required()
});

export const recordIdParamSchema = Joi.object({
  id: Joi.string().uuid().required()
});
