/**
 * Medications Validators
 * Validation schemas for medication management endpoints
 *
 * ✅ UPDATED: This file now uses the NEW schema validators
 * that match the actual database schema with separate tables:
 * - medications: name, genericName, dosageForm, strength, manufacturer, ndc, isControlled, deaSchedule, requiresWitness
 * - student_medications: studentId, medicationId, dosage, frequency, route, instructions, startDate, endDate, isActive, prescribedBy
 * - medication_logs: studentMedicationId, nurseId, dosageGiven, timeGiven, administeredBy, notes, sideEffects, witnessId, etc.
 * - medication_inventory: medicationId, batchNumber, expirationDate, quantity, reorderLevel, costPerUnit, supplier
 *
 * Database migrations:
 * - 00004-create-medications-extended.ts (creates the separate tables)
 * - 20250111000000-add-medication-enhanced-fields.js (adds DEA schedule and witness fields)
 */

import Joi from 'joi';

// Re-export NEW medication validators to match the actual database schema
export {
  createMedicationSchema,
  updateMedicationSchema,
  assignMedicationToStudentSchema,
  updateStudentMedicationSchema,
  logMedicationAdministrationSchema,
  addToInventorySchema,
  updateInventoryQuantitySchema,
  reportAdverseReactionSchema,
  deactivateStudentMedicationSchema,
  deactivateMedicationSchema
} from '../../../../validators/medicationValidators';

// Additional query and parameter schemas for medication routes

/**
 * Parameter schema for medication ID
 */
export const medicationIdParamSchema = Joi.object({
  id: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Medication ID must be a valid UUID',
      'any.required': 'Medication ID is required',
    }),
});

/**
 * Parameter schema for student ID
 */
export const studentIdParamSchema = Joi.object({
  id: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required',
    }),
});

/**
 * Parameter schema for student medication ID
 */
export const studentMedicationIdParamSchema = Joi.object({
  id: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Student medication ID must be a valid UUID',
      'any.required': 'Student medication ID is required',
    }),
});

/**
 * Parameter schema for inventory ID
 */
export const inventoryIdParamSchema = Joi.object({
  id: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Inventory ID must be a valid UUID',
      'any.required': 'Inventory ID is required',
    }),
});

/**
 * Query schema for listing medications
 */
export const listMedicationsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow('').optional(),
  isControlled: Joi.boolean().optional(),
  deaSchedule: Joi.string().valid('I', 'II', 'III', 'IV', 'V').optional(),
});

/**
 * Query schema for student medication logs
 */
export const studentLogsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
});

/**
 * Query schema for medication schedule
 */
export const scheduleQuerySchema = Joi.object({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  studentId: Joi.string().uuid().optional(),
});

/**
 * Query schema for medication reminders
 */
export const remindersQuerySchema = Joi.object({
  date: Joi.date().iso().default(() => new Date()),
});

/**
 * Query schema for adverse reactions
 */
export const adverseReactionsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  medicationId: Joi.string().uuid().optional(),
  studentId: Joi.string().uuid().optional(),
  severity: Joi.string()
    .valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING')
    .optional(),
});
