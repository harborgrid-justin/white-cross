/**
 * Student Validation Schemas
 *
 * HIPAA-compliant validation schemas for student-related forms.
 * All schemas include PHI (Protected Health Information) field marking.
 */

import { z } from 'zod';
import {
  addressSchema,
  partialAddressSchema
} from '../common/address.schemas';
import {
  phoneSchema,
  optionalPhoneSchema
} from '../common/phone.schemas';
import {
  emailSchema,
  optionalEmailSchema
} from '../common/email.schemas';
import {
  studentDateOfBirthSchema,
  dateSchema,
  optionalDateSchema
} from '../common/date.schemas';

/**
 * Gender options
 */
export const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'] as const;

/**
 * Grade levels
 */
export const GRADE_LEVELS = [
  'pre-k',
  'kindergarten',
  '1', '2', '3', '4', '5', '6',
  '7', '8', '9', '10', '11', '12'
] as const;

/**
 * Student status
 */
export const STUDENT_STATUS = ['active', 'inactive', 'graduated', 'transferred'] as const;

/**
 * Base student schema (for create)
 * PHI FIELDS: firstName, lastName, middleName, dateOfBirth, ssn, medicalRecordNumber, address, phone, email
 */
export const createStudentSchema = z.object({
  // Basic Information (PHI)
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .trim(),

  middleName: z
    .string()
    .max(100, 'Middle name must be less than 100 characters')
    .trim()
    .optional()
    .nullable(),

  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .trim(),

  preferredName: z
    .string()
    .max(100, 'Preferred name must be less than 100 characters')
    .trim()
    .optional()
    .nullable(),

  // Demographics (PHI)
  dateOfBirth: studentDateOfBirthSchema,

  gender: z.enum(GENDERS, {
    required_error: 'Gender is required',
    invalid_type_error: 'Invalid gender selection'
  }),

  // Academic Information
  studentId: z
    .string()
    .max(50, 'Student ID must be less than 50 characters')
    .trim()
    .optional()
    .nullable(),

  gradeLevel: z.enum(GRADE_LEVELS, {
    required_error: 'Grade level is required',
    invalid_type_error: 'Invalid grade level'
  }),

  homeroom: z
    .string()
    .max(50, 'Homeroom must be less than 50 characters')
    .trim()
    .optional()
    .nullable(),

  schoolId: z
    .string({ required_error: 'School is required' })
    .uuid('Invalid school ID'),

  // Contact Information (PHI)
  email: optionalEmailSchema,

  phone: optionalPhoneSchema,

  address: addressSchema,

  // Medical Identifiers (PHI - SENSITIVE)
  ssn: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX')
    .optional()
    .nullable(),

  medicalRecordNumber: z
    .string()
    .max(50, 'Medical record number must be less than 50 characters')
    .trim()
    .optional()
    .nullable(),

  // Status
  status: z
    .enum(STUDENT_STATUS)
    .default('active')
    .optional(),

  enrollmentDate: dateSchema,

  expectedGraduationDate: optionalDateSchema,

  // Emergency Information
  allergies: z
    .string()
    .max(1000, 'Allergies must be less than 1000 characters')
    .optional()
    .nullable(),

  medications: z
    .string()
    .max(1000, 'Medications must be less than 1000 characters')
    .optional()
    .nullable(),

  medicalConditions: z
    .string()
    .max(1000, 'Medical conditions must be less than 1000 characters')
    .optional()
    .nullable(),

  specialNeeds: z
    .string()
    .max(1000, 'Special needs must be less than 1000 characters')
    .optional()
    .nullable(),

  // Additional Notes
  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .nullable()
});

/**
 * Update student schema (all fields optional except ID)
 */
export const updateStudentSchema = createStudentSchema
  .partial()
  .extend({
    id: z.string().uuid('Invalid student ID')
  });

/**
 * Student search/filter schema
 */
export const studentSearchSchema = z.object({
  search: z.string().max(200).optional(),

  firstName: z.string().max(100).optional(),

  lastName: z.string().max(100).optional(),

  studentId: z.string().max(50).optional(),

  gradeLevel: z.enum(GRADE_LEVELS).optional(),

  schoolId: z.string().uuid().optional(),

  status: z.enum(STUDENT_STATUS).optional(),

  address: partialAddressSchema.optional(),

  // Pagination
  page: z.number().int().min(1).default(1),

  limit: z.number().int().min(1).max(100).default(20),

  // Sorting
  sortBy: z.enum(['firstName', 'lastName', 'gradeLevel', 'enrollmentDate']).optional(),

  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

/**
 * Bulk student import schema (CSV/Excel upload)
 */
export const studentImportSchema = z.array(
  createStudentSchema.extend({
    rowNumber: z.number().int().positive()
  })
).min(1, 'At least one student is required');

/**
 * Student transfer schema
 */
export const studentTransferSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),

  fromSchoolId: z.string().uuid('Invalid school ID'),

  toSchoolId: z
    .string({ required_error: 'Destination school is required' })
    .uuid('Invalid school ID'),

  transferDate: dateSchema,

  reason: z
    .string()
    .max(500, 'Reason must be less than 500 characters')
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable()
});

/**
 * Student graduation schema
 */
export const studentGraduationSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),

  graduationDate: dateSchema,

  diplomaType: z.enum(['standard', 'honors', 'advanced', 'ged']).optional(),

  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .nullable()
});

/**
 * PHI field markers for audit logging
 */
export const STUDENT_PHI_FIELDS = [
  'firstName',
  'lastName',
  'middleName',
  'preferredName',
  'dateOfBirth',
  'ssn',
  'medicalRecordNumber',
  'email',
  'phone',
  'address',
  'allergies',
  'medications',
  'medicalConditions',
  'specialNeeds'
] as const;

/**
 * Type exports
 */
export type CreateStudent = z.infer<typeof createStudentSchema>;
export type UpdateStudent = z.infer<typeof updateStudentSchema>;
export type StudentSearch = z.infer<typeof studentSearchSchema>;
export type StudentImport = z.infer<typeof studentImportSchema>;
export type StudentTransfer = z.infer<typeof studentTransferSchema>;
export type StudentGraduation = z.infer<typeof studentGraduationSchema>;
export type Gender = typeof GENDERS[number];
export type GradeLevel = typeof GRADE_LEVELS[number];
export type StudentStatus = typeof STUDENT_STATUS[number];
