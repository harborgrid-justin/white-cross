/**
 * Students Validators
 * Validation schemas for student management endpoints
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

/**
 * Query Schemas
 */

export const listStudentsQuerySchema = paginationSchema.keys({
  search: Joi.string()
    .trim()
    .optional()
    .description('Search term for student name or student ID'),
  grade: Joi.string()
    .trim()
    .optional()
    .description('Filter by grade level'),
  isActive: Joi.boolean()
    .optional()
    .description('Filter by active status'),
  nurseId: Joi.string()
    .uuid()
    .optional()
    .description('Filter by assigned nurse ID'),
  hasAllergies: Joi.boolean()
    .optional()
    .description('Filter students with allergies'),
  hasMedications: Joi.boolean()
    .optional()
    .description('Filter students with active medications')
});

/**
 * Payload Schemas
 */

export const createStudentSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .description('Student first name')
    .messages({
      'string.min': 'First name must be at least 1 character',
      'string.max': 'First name cannot exceed 100 characters',
      'any.required': 'First name is required'
    }),

  lastName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .description('Student last name')
    .messages({
      'string.min': 'Last name must be at least 1 character',
      'string.max': 'Last name cannot exceed 100 characters',
      'any.required': 'Last name is required'
    }),

  dateOfBirth: Joi.date()
    .iso()
    .max('now')
    .required()
    .description('Student date of birth (ISO 8601 format)')
    .messages({
      'date.max': 'Date of birth cannot be in the future',
      'any.required': 'Date of birth is required'
    }),

  grade: Joi.string()
    .trim()
    .min(1)
    .max(10)
    .required()
    .description('Grade level (e.g., "K", "1", "2", etc.)')
    .messages({
      'string.min': 'Grade must be at least 1 character',
      'string.max': 'Grade cannot exceed 10 characters',
      'any.required': 'Grade is required'
    }),

  studentNumber: Joi.string()
    .trim()
    .min(4)
    .max(20)
    .required()
    .description('Unique school-assigned student number')
    .messages({
      'string.min': 'Student number must be at least 4 characters',
      'string.max': 'Student number cannot exceed 20 characters',
      'any.required': 'Student number is required'
    }),

  gender: Joi.string()
    .valid('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')
    .required()
    .description('Student gender (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY)')
    .messages({
      'any.only': 'Gender must be one of: MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY',
      'any.required': 'Gender is required'
    }),

  photo: Joi.string()
    .uri()
    .max(500)
    .optional()
    .description('Student photo URL'),

  medicalRecordNum: Joi.string()
    .trim()
    .min(5)
    .max(20)
    .optional()
    .description('Medical record number (unique)'),

  enrollmentDate: Joi.date()
    .iso()
    .max('now')
    .optional()
    .description('Student enrollment date'),

  nurseId: Joi.string()
    .uuid()
    .optional()
    .description('Assigned nurse UUID'),

  schoolId: Joi.string()
    .uuid()
    .optional()
    .description('School UUID (optional, for reference only)')
    .messages({
      'string.guid': 'School ID must be a valid UUID'
    }),

  districtId: Joi.string()
    .uuid()
    .optional()
    .description('District UUID (optional, for reference only)')
    .messages({
      'string.guid': 'District ID must be a valid UUID'
    })
});

export const updateStudentSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional(),

  lastName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional(),

  dateOfBirth: Joi.date()
    .iso()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Date of birth cannot be in the future'
    }),

  grade: Joi.string()
    .trim()
    .min(1)
    .max(10)
    .optional(),

  studentNumber: Joi.string()
    .trim()
    .min(4)
    .max(20)
    .optional(),

  gender: Joi.string()
    .valid('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')
    .optional(),

  photo: Joi.string()
    .uri()
    .max(500)
    .optional(),

  medicalRecordNum: Joi.string()
    .trim()
    .min(5)
    .max(20)
    .optional(),

  enrollmentDate: Joi.date()
    .iso()
    .max('now')
    .optional(),

  nurseId: Joi.string()
    .uuid()
    .optional(),

  isActive: Joi.boolean()
    .optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const deactivateStudentSchema = Joi.object({
  reason: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .description('Reason for deactivating student')
    .messages({
      'string.min': 'Reason must be at least 5 characters',
      'string.max': 'Reason cannot exceed 500 characters',
      'any.required': 'Reason is required'
    })
});

/**
 * Parameter Schemas
 */

export const studentIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('Student UUID')
});

export const transferStudentSchema = Joi.object({
  nurseId: Joi.string()
    .uuid()
    .required()
    .description('New nurse UUID to assign student to')
    .messages({
      'any.required': 'Nurse ID is required for transfer'
    })
});

export const gradeParamSchema = Joi.object({
  grade: Joi.string()
    .trim()
    .required()
    .description('Grade level (e.g., "K", "1", "2", etc.)')
});

export const searchQueryParamSchema = Joi.object({
  query: Joi.string()
    .trim()
    .min(1)
    .required()
    .description('Search query for student name or ID')
    .messages({
      'string.min': 'Search query must be at least 1 character'
    })
});

export const healthRecordsQuerySchema = paginationSchema;
