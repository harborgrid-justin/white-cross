/**
 * Student Validation Schemas
 * Zod schemas for type-safe validation of student data
 *
 * @module lib/validations/student.schema
 */

import { z } from 'zod';
import { Gender } from '@/types/student.types';

/**
 * Gender enum schema
 */
const GenderSchema = z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'] as const);

/**
 * Student number validation
 * Format: alphanumeric with hyphens, 3-50 characters
 */
const studentNumberSchema = z
  .string()
  .min(3, 'Student number must be at least 3 characters')
  .max(50, 'Student number must not exceed 50 characters')
  .regex(/^[A-Z0-9-]+$/i, 'Student number can only contain letters, numbers, and hyphens');

/**
 * Name validation
 * Letters, spaces, hyphens, apostrophes only
 */
const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must not exceed 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

/**
 * Grade validation
 * Supports: K, 1-12
 */
const gradeSchema = z
  .string()
  .regex(/^(K|[1-9]|1[0-2])$/, 'Grade must be K or 1-12');

/**
 * Date of birth validation
 * Must be a past date
 */
const dateOfBirthSchema = z
  .string()
  .or(z.date())
  .refine((val) => {
    const date = typeof val === 'string' ? new Date(val) : val;
    return date < new Date();
  }, 'Date of birth must be in the past')
  .refine((val) => {
    const date = typeof val === 'string' ? new Date(val) : val;
    const year = date.getFullYear();
    return year > 1900 && year <= new Date().getFullYear();
  }, 'Date of birth must be between 1900 and current year');

/**
 * Medical record number validation
 * Optional, alphanumeric with hyphens
 */
const medicalRecordNumberSchema = z
  .string()
  .regex(/^[A-Z0-9-]+$/i, 'Medical record number can only contain letters, numbers, and hyphens')
  .min(3, 'Medical record number must be at least 3 characters')
  .max(50, 'Medical record number must not exceed 50 characters')
  .optional()
  .or(z.literal(''));

/**
 * UUID validation
 */
const uuidSchema = z
  .string()
  .uuid('Invalid UUID format');

/**
 * Photo URL validation
 */
const photoUrlSchema = z
  .string()
  .url('Invalid photo URL')
  .optional()
  .or(z.literal(''));

/**
 * Create Student Schema
 * Validates data for creating a new student
 *
 * @remarks
 * All required fields must be provided. Date of birth must be a past date.
 * Student number must be unique (enforced by backend).
 *
 * @example
 * ```typescript
 * const validData = {
 *   studentNumber: 'STU-2024-001',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: '2015-05-15',
 *   grade: '3',
 *   gender: 'MALE',
 *   enrollmentDate: '2024-09-01'
 * };
 * const result = CreateStudentSchema.parse(validData);
 * ```
 */
export const CreateStudentSchema = z.object({
  studentNumber: studentNumberSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  dateOfBirth: dateOfBirthSchema,
  grade: gradeSchema,
  gender: GenderSchema,
  photo: photoUrlSchema,
  medicalRecordNum: medicalRecordNumberSchema,
  nurseId: uuidSchema.optional(),
  enrollmentDate: z.string().or(z.date()).optional(),
  createdBy: uuidSchema.optional()
});

/**
 * Update Student Schema
 * Validates data for updating an existing student
 *
 * @remarks
 * All fields are optional - only provided fields will be updated.
 * Partial updates are supported.
 *
 * @example
 * ```typescript
 * const updateData = {
 *   grade: '4',
 *   isActive: true
 * };
 * const result = UpdateStudentSchema.parse(updateData);
 * ```
 */
export const UpdateStudentSchema = z.object({
  studentNumber: studentNumberSchema.optional(),
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  dateOfBirth: dateOfBirthSchema.optional(),
  grade: gradeSchema.optional(),
  gender: GenderSchema.optional(),
  photo: photoUrlSchema,
  medicalRecordNum: medicalRecordNumberSchema,
  nurseId: uuidSchema.optional().or(z.null()),
  isActive: z.boolean().optional(),
  enrollmentDate: z.string().or(z.date()).optional(),
  updatedBy: uuidSchema.optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  'At least one field must be provided for update'
);

/**
 * Student Filters Schema
 * Validates query parameters for filtering students
 *
 * @example
 * ```typescript
 * const filters = {
 *   grade: '5',
 *   isActive: true,
 *   hasAllergies: true,
 *   page: 1,
 *   limit: 20
 * };
 * const result = StudentFiltersSchema.parse(filters);
 * ```
 */
export const StudentFiltersSchema = z.object({
  search: z.string().min(1).optional(),
  grade: gradeSchema.optional(),
  isActive: z.boolean().optional(),
  includeInactive: z.boolean().optional(),
  nurseId: uuidSchema.optional(),
  hasAllergies: z.boolean().optional(),
  hasMedications: z.boolean().optional(),
  gender: GenderSchema.optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20)
});

/**
 * Transfer Student Schema
 * Validates data for transferring a student to a different nurse
 */
export const TransferStudentSchema = z.object({
  nurseId: uuidSchema
});

/**
 * Deactivate Student Schema
 * Validates data for deactivating a student
 */
export const DeactivateStudentSchema = z.object({
  reason: z
    .string()
    .min(5, 'Deactivation reason must be at least 5 characters')
    .max(500, 'Deactivation reason must not exceed 500 characters')
});

/**
 * Student Form Schema
 * Comprehensive schema for client-side form validation
 * Includes additional UI-specific fields and validation
 */
export const StudentFormSchema = z.object({
  studentNumber: studentNumberSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date < new Date();
  }, 'Please enter a valid past date'),
  grade: gradeSchema,
  gender: GenderSchema,
  photo: z.string().url().optional().or(z.literal('')),
  medicalRecordNum: z.string().optional().or(z.literal('')),
  nurseId: z.string().optional().or(z.literal('')),
  enrollmentDate: z.string().optional()
});

/**
 * Bulk Update Students Schema
 * Validates data for bulk updating multiple students
 */
export const BulkUpdateStudentsSchema = z.object({
  studentIds: z.array(uuidSchema).min(1, 'At least one student ID is required'),
  updateData: UpdateStudentSchema.omit({ updatedBy: true })
});

/**
 * Type exports from schemas
 */
export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInput = z.infer<typeof UpdateStudentSchema>;
export type StudentFiltersInput = z.infer<typeof StudentFiltersSchema>;
export type TransferStudentInput = z.infer<typeof TransferStudentSchema>;
export type DeactivateStudentInput = z.infer<typeof DeactivateStudentSchema>;
export type StudentFormInput = z.infer<typeof StudentFormSchema>;
export type BulkUpdateStudentsInput = z.infer<typeof BulkUpdateStudentsSchema>;

/**
 * Validation helper functions
 */

/**
 * Validates create student data
 * @param data - Data to validate
 * @returns Validation result with parsed data or errors
 */
export function validateCreateStudent(data: unknown) {
  return CreateStudentSchema.safeParse(data);
}

/**
 * Validates update student data
 * @param data - Data to validate
 * @returns Validation result with parsed data or errors
 */
export function validateUpdateStudent(data: unknown) {
  return UpdateStudentSchema.safeParse(data);
}

/**
 * Validates student filters
 * @param data - Data to validate
 * @returns Validation result with parsed data or errors
 */
export function validateStudentFilters(data: unknown) {
  return StudentFiltersSchema.safeParse(data);
}
