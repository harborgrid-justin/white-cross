/**
 * @fileoverview Students Validators - Validation schemas for student management endpoints
 *
 * Comprehensive Joi validation schemas for all student-related API operations including:
 * - Student enrollment and profile management
 * - Search and filtering
 * - Nurse assignment and transfers
 * - Health records access control
 *
 * All schemas enforce HIPAA-compliant data validation with strict type checking,
 * length constraints, and business rule validation.
 *
 * @module operations/validators/students
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

/**
 * Query Schemas
 */

/**
 * List students query parameters schema
 *
 * Validates query parameters for student listing with pagination and multiple filters.
 * Supports nurse dashboards, administrative reports, and student search interfaces.
 *
 * @schema
 * @example
 * // Valid query for students with allergies in grade 3
 * {
 *   page: 1,
 *   limit: 20,
 *   grade: '3',
 *   hasAllergies: true
 * }
 *
 * @example
 * // Valid search query for student lookup
 * {
 *   search: 'John Smith',
 *   nurseId: 'nurse-uuid-123',
 *   isActive: true
 * }
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

/**
 * Create student payload schema
 *
 * Validates new student enrollment data with comprehensive demographic validation.
 * Enforces business rules: date of birth must be past, student number must be unique,
 * and all required fields must be present.
 *
 * @schema
 * @example
 * // Valid kindergarten student enrollment
 * {
 *   firstName: 'Emily',
 *   lastName: 'Johnson',
 *   dateOfBirth: '2018-09-15',
 *   grade: 'K',
 *   studentNumber: 'STU-2024-0123',
 *   gender: 'FEMALE',
 *   enrollmentDate: '2024-08-20',
 *   nurseId: 'nurse-uuid-456'
 * }
 *
 * @example
 * // Invalid - future date of birth
 * {
 *   firstName: 'Test',
 *   lastName: 'Student',
 *   dateOfBirth: '2030-01-01', // FAILS: date.max validation
 *   grade: '1',
 *   studentNumber: 'STU-2024-9999',
 *   gender: 'MALE'
 * }
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

/**
 * Update student payload schema
 *
 * Validates student profile updates. At least one field must be provided for update.
 * Partial update support allows nurses and administrators to modify specific fields
 * without requiring complete student data resubmission.
 *
 * @schema
 * @example
 * // Valid grade level update for new school year
 * {
 *   grade: '4'
 * }
 *
 * @example
 * // Valid nurse reassignment
 * {
 *   nurseId: 'new-nurse-uuid-789'
 * }
 *
 * @example
 * // Invalid - empty update payload
 * {
 *   // FAILS: object.min - at least one field required
 * }
 */
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

/**
 * Deactivate student payload schema
 *
 * Validates deactivation request requiring detailed reason for audit trail.
 * Reason must be substantive (5-500 characters) to ensure proper documentation
 * of student withdrawal, transfer, or graduation.
 *
 * @schema
 * @example
 * // Valid graduation deactivation
 * {
 *   reason: 'Student graduated and enrolled in middle school'
 * }
 *
 * @example
 * // Valid transfer deactivation
 * {
 *   reason: 'Family relocated to different school district - transferred to Lincoln Elementary'
 * }
 *
 * @example
 * // Invalid - reason too short
 * {
 *   reason: 'Left' // FAILS: string.min - must be at least 5 characters
 * }
 */
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

/**
 * Student ID parameter schema
 *
 * Validates student UUID in route parameters. Ensures proper UUID format
 * for all student lookup and modification operations.
 *
 * @schema
 * @example
 * // Valid UUID parameter
 * {
 *   id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
 * }
 */
export const studentIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('Student UUID')
});

/**
 * Transfer student payload schema
 *
 * Validates nurse assignment transfer request. Requires valid nurse UUID
 * to ensure student is reassigned to an existing, active nurse.
 *
 * @schema
 * @example
 * // Valid transfer to new nurse
 * {
 *   nurseId: 'new-nurse-uuid-123'
 * }
 *
 * @example
 * // Invalid - missing nurse ID
 * {
 *   // FAILS: any.required - nurseId is mandatory for transfer
 * }
 */
export const transferStudentSchema = Joi.object({
  nurseId: Joi.string()
    .uuid()
    .required()
    .description('New nurse UUID to assign student to')
    .messages({
      'any.required': 'Nurse ID is required for transfer'
    })
});

/**
 * Grade parameter schema
 *
 * Validates grade level in route parameters. Supports standard grade formats
 * including kindergarten ("K") and grades 1-12.
 *
 * @schema
 * @example
 * // Valid kindergarten grade
 * {
 *   grade: 'K'
 * }
 *
 * @example
 * // Valid numeric grade
 * {
 *   grade: '5'
 * }
 */
export const gradeParamSchema = Joi.object({
  grade: Joi.string()
    .trim()
    .required()
    .description('Grade level (e.g., "K", "1", "2", etc.)')
});

/**
 * Search query parameter schema
 *
 * Validates search query for student lookup by name or ID. Minimum 1 character
 * required to prevent overly broad searches. Supports fuzzy matching for quick
 * student identification in emergency situations.
 *
 * @schema
 * @example
 * // Valid search by last name
 * {
 *   query: 'Smith'
 * }
 *
 * @example
 * // Valid search by student number
 * {
 *   query: 'STU-2024-0123'
 * }
 *
 * @example
 * // Invalid - empty query
 * {
 *   query: '' // FAILS: string.min - must be at least 1 character
 * }
 */
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

/**
 * Health records query parameter schema
 *
 * Validates query parameters for health records pagination. Uses standard
 * pagination schema to maintain consistency across all paginated endpoints.
 *
 * @schema
 * @example
 * // Valid pagination query
 * {
 *   page: 1,
 *   limit: 20
 * }
 */
export const healthRecordsQuerySchema = paginationSchema;
