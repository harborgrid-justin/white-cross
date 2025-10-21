/**
 * Medications Validators
 * Validation schemas for medication management endpoints
 * Re-exports existing comprehensive medication validators and adds query/param schemas
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

// Re-export existing comprehensive medication validators
// These include Five Rights of Medication Administration compliance
export {
  createMedicationSchema,
  updateMedicationSchema,
  assignMedicationToStudentSchema,
  updateStudentMedicationSchema,
  logMedicationAdministrationSchema,
  addToInventorySchema,
  updateInventoryQuantitySchema,
  reportAdverseReactionSchema,
  deactivateStudentMedicationSchema
} from '../../../../validators/medicationValidators';

/**
 * Query Schemas
 */

export const listMedicationsQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  search: Joi.string()
    .trim()
    .optional()
    .description('Search term for medication name')
});

export const studentLogsQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit'])
});

export const scheduleQuerySchema = Joi.object({
  startDate: Joi.date()
    .iso()
    .optional()
    .description('Schedule start date (ISO 8601 format)'),
  endDate: Joi.date()
    .iso()
    .optional()
    .description('Schedule end date (ISO 8601 format)'),
  nurseId: Joi.string()
    .uuid()
    .optional()
    .description('Filter by specific nurse ID')
});

export const remindersQuerySchema = Joi.object({
  date: Joi.date()
    .iso()
    .optional()
    .description('Date for reminders (ISO 8601 format, defaults to today)')
});

export const adverseReactionsQuerySchema = Joi.object({
  medicationId: Joi.string()
    .uuid()
    .optional()
    .description('Filter by medication ID'),
  studentId: Joi.string()
    .uuid()
    .optional()
    .description('Filter by student ID')
});

/**
 * Parameter Schemas
 */

export const studentIdParamSchema = Joi.object({
  studentId: Joi.string()
    .uuid()
    .required()
    .description('Student UUID')
});

export const inventoryIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('Inventory item UUID')
});

export const studentMedicationIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('Student medication assignment UUID')
});
