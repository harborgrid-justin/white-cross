/**
 * Health Records Validators
 * Validation schemas for comprehensive health record management
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

/**
 * General Health Record Schemas
 */

export const healthRecordQuerySchema = paginationSchema.keys({
  type: Joi.string()
    .valid('CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING')
    .optional()
    .description('Filter by record type'),
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  provider: Joi.string().trim().optional()
});

export const createHealthRecordSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  type: Joi.string()
    .valid('CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING')
    .required(),
  date: Joi.date().iso().max('now').required(),
  description: Joi.string().trim().min(5).max(2000).required(),
  vital: Joi.object().optional(),
  provider: Joi.string().trim().optional(),
  notes: Joi.string().trim().max(5000).optional(),
  attachments: Joi.array().items(Joi.string()).optional()
});

export const updateHealthRecordSchema = Joi.object({
  type: Joi.string()
    .valid('CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING')
    .optional(),
  date: Joi.date().iso().max('now').optional(),
  description: Joi.string().trim().min(5).max(2000).optional(),
  vital: Joi.object().optional(),
  provider: Joi.string().trim().optional(),
  notes: Joi.string().trim().max(5000).optional(),
  attachments: Joi.array().items(Joi.string()).optional()
}).min(1);

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
