/**
 * Medications Validators
 * Validation schemas for medication management endpoints
 *
 * ⚠️ IMPORTANT: This file has been updated to use LEGACY validators
 * that match the actual database schema (medicationName, dosage, frequency, route, prescribedBy)
 * from migration: 20251011221125-create-complete-healthcare-schema.js
 *
 * If your database uses the NEW schema (separate medications and student_medications tables),
 * switch the imports back to medicationValidators.ts instead of medicationValidators.legacy.ts
 */

import Joi from 'joi';

// Re-export LEGACY medication validators to match the actual database schema
// These validate against the legacy medications table with fields:
// medicationName, dosage, frequency, route, prescribedBy, startDate, endDate, etc.
export {
  createMedicationSchema,
  updateMedicationSchema,
  deactivateMedicationSchema,
  listMedicationsQuerySchema,
  medicationIdParamSchema,
  studentIdParamSchema,
} from '../../../../validators/medicationValidators.legacy';

// For the NEW schema (if database is migrated to separate tables), use:
// export {
//   createMedicationSchema,
//   updateMedicationSchema,
//   assignMedicationToStudentSchema,
//   updateStudentMedicationSchema,
//   logMedicationAdministrationSchema,
//   addToInventorySchema,
//   updateInventoryQuantitySchema,
//   reportAdverseReactionSchema,
//   deactivateStudentMedicationSchema
// } from '../../../../validators/medicationValidators';

// NOTE: The legacy schema does NOT have separate inventory, administration logging,
// or student medication assignment schemas. These would need to be added if required
// for the legacy database schema.

/**
 * @deprecated These schemas are from the NEW schema and are not compatible with legacy database
 * They are kept here for reference only. Do NOT use these with the legacy database.
 *
 * - assignMedicationToStudentSchema (requires separate medications + student_medications tables)
 * - updateStudentMedicationSchema (requires student_medications table)
 * - logMedicationAdministrationSchema (requires medication_logs table)
 * - addToInventorySchema (requires medication_inventory table)
 * - updateInventoryQuantitySchema (requires medication_inventory table)
 * - reportAdverseReactionSchema (requires adverse_reactions table)
 */

/**
 * Query Schemas for Legacy Medication API
 */

// listMedicationsQuerySchema is already exported from legacy validators
// This provides pagination, search, studentId filter, and isActive filter

/**
 * @deprecated The following query schemas are for the NEW schema only
 * They reference tables that don't exist in the legacy schema:
 * - studentLogsQuerySchema (requires medication_logs table)
 * - scheduleQuerySchema (requires student_medications table)
 * - remindersQuerySchema (requires student_medications table)
 * - adverseReactionsQuerySchema (requires adverse_reactions table)
 */

/**
 * Parameter Schemas for Legacy Medication API
 */

// medicationIdParamSchema and studentIdParamSchema are already exported from legacy validators

/**
 * @deprecated The following parameter schemas are for the NEW schema only
 * They reference tables that don't exist in the legacy schema:
 * - inventoryIdParamSchema (requires medication_inventory table)
 * - studentMedicationIdParamSchema (requires student_medications table)
 */

// ============================================================================
// STUB SCHEMAS FOR NEW SCHEMA ROUTES (Legacy Compatibility)
// ============================================================================
// These schemas are provided for backward compatibility with routes that
// reference the NEW schema, even though the underlying tables don't exist
// in the legacy schema. Controllers should handle the legacy schema appropriately.

/**
 * Schema for assigning medication to student (legacy compatibility)
 */
export const assignMedicationToStudentSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  medicationName: Joi.string().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  route: Joi.string().required(),
  prescribedBy: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().allow(null).optional(),
  instructions: Joi.string().allow('', null).optional(),
  sideEffects: Joi.string().allow('', null).optional(),
});

/**
 * Schema for deactivating student medication
 */
export const deactivateStudentMedicationSchema = Joi.object({
  reason: Joi.string().min(10).max(500).required(),
  deactivationType: Joi.string()
    .valid('COMPLETED', 'DISCONTINUED', 'CHANGED', 'ADVERSE_REACTION', 'PATIENT_REQUEST', 'PHYSICIAN_ORDER', 'OTHER')
    .required(),
});

/**
 * Schema for logging medication administration
 */
export const logMedicationAdministrationSchema = Joi.object({
  studentMedicationId: Joi.string().uuid().required(),
  medicationId: Joi.string().uuid().required(),
  studentId: Joi.string().uuid().required(),
  administeredBy: Joi.string().uuid().required(),
  administeredAt: Joi.date().iso().required(),
  dosageGiven: Joi.string().required(),
  notes: Joi.string().allow('', null).optional(),
  witnessedBy: Joi.string().uuid().allow(null).optional(),
});

/**
 * Schema for adding medication to inventory
 */
export const addToInventorySchema = Joi.object({
  medicationId: Joi.string().uuid().required(),
  batchNumber: Joi.string().required(),
  expirationDate: Joi.date().iso().required(),
  quantity: Joi.number().integer().min(1).required(),
  costPerUnit: Joi.number().min(0).allow(null).optional(),
});

/**
 * Schema for updating inventory quantity
 */
export const updateInventoryQuantitySchema = Joi.object({
  quantityChange: Joi.number().integer().required(),
  reason: Joi.string().min(10).max(500).required(),
  adjustmentType: Joi.string()
    .valid('CORRECTION', 'WASTE', 'TRANSFER', 'EXPIRED', 'ADMINISTERED')
    .required(),
});

/**
 * Schema for reporting adverse reaction
 */
export const reportAdverseReactionSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  medicationId: Joi.string().uuid().required(),
  severity: Joi.string()
    .valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING')
    .required(),
  symptoms: Joi.string().min(10).max(2000).required(),
  actionsTaken: Joi.string().min(10).max(2000).required(),
  reportedBy: Joi.string().uuid().required(),
  reportedAt: Joi.date().iso().required(),
  parentNotified: Joi.boolean().required(),
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

/**
 * Parameter schema for inventory ID
 */
export const inventoryIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * Parameter schema for student medication ID
 */
export const studentMedicationIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
