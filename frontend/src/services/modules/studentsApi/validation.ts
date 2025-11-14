/**
 * @fileoverview Students API Validation Schemas and Constants
 * 
 * Provides comprehensive validation schemas and constants for student data operations.
 * All validation rules mirror the backend Student model to ensure data integrity.
 * 
 * @module studentsApi/validation
 * @version 1.0.0
 * @since 2025-11-11
 */

import { z } from 'zod';

/**
 * Valid grade values for K-12 education system
 *
 * Supports standard K-12 grades plus common variations and pre-kindergarten formats.
 * Custom grade formats are also validated via regex pattern matching.
 *
 * @constant {readonly string[]}
 */
export const VALID_GRADES = [
  'K', 'K-1', 'K-2', 'K-3', 'K-4', 'K-5', // Kindergarten variations
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
  'Pre-K', 'PK', 'TK', // Pre-kindergarten variations
] as const;

/**
 * Phone number validation regex for US formats
 *
 * Supports:
 * - (123) 456-7890
 * - 123-456-7890
 * - 1234567890
 * - +1-123-456-7890
 *
 * @constant {RegExp}
 */
export const PHONE_REGEX = /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

/**
 * Email validation regex (basic format check)
 *
 * Validates standard email format: user@domain.tld
 *
 * @constant {RegExp}
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Medical record number format validation
 *
 * Format: Alphanumeric with hyphens, 5-20 characters, uppercase
 * Examples: MRN-12345, MEDICAL-001, A1B2C3D4E5
 *
 * @constant {RegExp}
 */
export const MEDICAL_RECORD_REGEX = /^[A-Z0-9-]{5,20}$/;

/**
 * Student number format validation
 *
 * Format: Alphanumeric with hyphens, 4-20 characters, uppercase
 * Examples: STU-2025-001, STUDENT-123, A1B2C3
 *
 * @constant {RegExp}
 */
export const STUDENT_NUMBER_REGEX = /^[A-Z0-9-]{4,20}$/;

/**
 * Create student schema with comprehensive validation
 * Matches backend Student model field constraints
 */
export const createStudentSchema = z.object({
  studentNumber: z
    .string()
    .min(4, 'Student number must be at least 4 characters')
    .max(20, 'Student number cannot exceed 20 characters')
    .regex(STUDENT_NUMBER_REGEX, 'Student number must be alphanumeric with optional hyphens')
    .transform(val => val.toUpperCase()),

  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),

  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const dob = new Date(date);
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());

      return dob >= minDate && dob <= maxDate;
    }, {
      message: 'Date of birth must be between 3 and 100 years ago'
    })
    .refine((date) => {
      const dob = new Date(date);
      return dob < new Date();
    }, {
      message: 'Date of birth must be in the past'
    }),

  grade: z
    .string()
    .min(1, 'Grade is required')
    .max(10, 'Grade cannot exceed 10 characters')
    .refine((grade) => {
      // Allow custom grade formats or standard K-12
      const normalized = grade.toUpperCase().trim();
      return VALID_GRADES.some(g => g.toUpperCase() === normalized) || /^\d{1,2}$/.test(grade);
    }, {
      message: 'Grade must be K-12, Pre-K, TK, or a valid custom grade format'
    }),

  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], {
    message: 'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY'
  }),

  photo: z
    .string()
    .url('Photo must be a valid URL')
    .max(500, 'Photo URL cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),

  medicalRecordNum: z
    .string()
    .min(5, 'Medical record number must be at least 5 characters')
    .max(20, 'Medical record number cannot exceed 20 characters')
    .regex(MEDICAL_RECORD_REGEX, 'Medical record number must be alphanumeric with optional hyphens')
    .transform(val => val.toUpperCase())
    .optional()
    .or(z.literal('')),

  nurseId: z
    .string()
    .uuid('Nurse ID must be a valid UUID')
    .optional()
    .or(z.literal('')),

  enrollmentDate: z
    .string()
    .refine((date) => {
      if (!date) return true;
      const enrollDate = new Date(date);
      const minDate = new Date(2000, 0, 1); // Min: Year 2000
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1); // Allow up to 1 year in future

      return enrollDate >= minDate && enrollDate <= maxDate;
    }, {
      message: 'Enrollment date must be between 2000 and one year from today'
    })
    .optional()
    .or(z.literal('')),

  createdBy: z
    .string()
    .uuid('Created by must be a valid user UUID')
    .optional(),
});

/**
 * Update student schema - all fields optional except validations still apply
 */
export const updateStudentSchema = createStudentSchema.partial().extend({
  isActive: z.boolean({
    error: 'Active status must be a boolean'
  }).optional(),

  updatedBy: z
    .string()
    .uuid('Updated by must be a valid user UUID')
    .optional(),
});

/**
 * Student filters schema for search/filtering queries
 */
export const studentFiltersSchema = z.object({
  search: z
    .string()
    .max(200, 'Search query cannot exceed 200 characters')
    .optional(),

  grade: z
    .string()
    .max(10, 'Grade filter cannot exceed 10 characters')
    .optional(),

  isActive: z
    .boolean({
      error: 'Active filter must be a boolean'
    })
    .optional(),

  nurseId: z
    .string()
    .uuid('Nurse ID must be a valid UUID')
    .optional(),

  hasAllergies: z
    .boolean({
      error: 'Has allergies filter must be a boolean'
    })
    .optional(),

  hasMedications: z
    .boolean({
      error: 'Has medications filter must be a boolean'
    })
    .optional(),

  gender: z
    .enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], {
      message: 'Gender filter must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY'
    })
    .optional(),

  page: z
    .number({
      error: 'Page must be a number'
    })
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .optional(),

  limit: z
    .number({
      error: 'Limit must be a number'
    })
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional(),
});
