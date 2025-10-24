/**
 * Student Validation Schemas
 * Zod schemas for student management matching backend Joi validators
 *
 * Backend Reference: /backend/src/routes/v1/operations/validators/students.validators.ts
 *
 * Validates:
 *   - Student creation
 *   - Student updates
 *   - Student deactivation
 *   - Student transfers
 *   - Search and filtering
 */

import { z } from 'zod';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Gender options
 */
const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'] as const;

// ============================================================================
// HELPER SCHEMAS
// ============================================================================

/**
 * UUID validation schema
 */
const uuidSchema = z.string().uuid({ message: 'Must be a valid UUID' });

/**
 * Past date validation (cannot be in future)
 */
const pastDateSchema = z
  .string()
  .datetime()
  .refine((val) => new Date(val) <= new Date(), 'Date cannot be in the future');

// ============================================================================
// STUDENT MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Create Student Schema
 * For registering a new student
 *
 * Backend Reference: createStudentSchema
 */
export const createStudentSchema = z.object({
  firstName: z
    .string({ message: 'First name is required' })
    .min(1, 'First name must be at least 1 character')
    .max(100, 'First name cannot exceed 100 characters')
    .transform((val) => val.trim()),

  lastName: z
    .string({ message: 'Last name is required' })
    .min(1, 'Last name must be at least 1 character')
    .max(100, 'Last name cannot exceed 100 characters')
    .transform((val) => val.trim()),

  dateOfBirth: z
    .string({ message: 'Date of birth is required' })
    .datetime()
    .refine((val) => new Date(val) <= new Date(), 'Date of birth cannot be in the future'),

  grade: z
    .string({ message: 'Grade is required' })
    .min(1, 'Grade must be at least 1 character')
    .max(10, 'Grade cannot exceed 10 characters')
    .transform((val) => val.trim()),

  studentNumber: z
    .string({ message: 'Student number is required' })
    .min(4, 'Student number must be at least 4 characters')
    .max(20, 'Student number cannot exceed 20 characters')
    .transform((val) => val.trim()),

  gender: z.enum(GENDER_OPTIONS, {
    errorMap: () => ({
      message: 'Gender must be one of: MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY',
    }),
  }),

  photo: z
    .string()
    .url('Photo must be a valid URL')
    .max(500, 'Photo URL cannot exceed 500 characters')
    .optional()
    .nullable(),

  medicalRecordNum: z
    .string()
    .min(5, 'Medical record number must be at least 5 characters')
    .max(20, 'Medical record number cannot exceed 20 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  enrollmentDate: pastDateSchema.optional().nullable(),

  nurseId: z
    .string()
    .uuid('Assigned nurse ID must be a valid UUID')
    .optional()
    .nullable(),

  schoolId: z
    .string()
    .uuid('School ID must be a valid UUID')
    .optional()
    .nullable(),

  districtId: z
    .string()
    .uuid('District ID must be a valid UUID')
    .optional()
    .nullable(),
});

/**
 * Update Student Schema
 * For updating an existing student (partial update)
 *
 * Backend Reference: updateStudentSchema
 */
export const updateStudentSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name must be at least 1 character')
      .max(100, 'First name cannot exceed 100 characters')
      .transform((val) => val.trim())
      .optional(),

    lastName: z
      .string()
      .min(1, 'Last name must be at least 1 character')
      .max(100, 'Last name cannot exceed 100 characters')
      .transform((val) => val.trim())
      .optional(),

    dateOfBirth: pastDateSchema.optional(),

    grade: z
      .string()
      .min(1, 'Grade must be at least 1 character')
      .max(10, 'Grade cannot exceed 10 characters')
      .transform((val) => val.trim())
      .optional(),

    studentNumber: z
      .string()
      .min(4, 'Student number must be at least 4 characters')
      .max(20, 'Student number cannot exceed 20 characters')
      .transform((val) => val.trim())
      .optional(),

    gender: z.enum(GENDER_OPTIONS).optional(),

    photo: z
      .string()
      .url('Photo must be a valid URL')
      .max(500, 'Photo URL cannot exceed 500 characters')
      .optional()
      .nullable(),

    medicalRecordNum: z
      .string()
      .min(5, 'Medical record number must be at least 5 characters')
      .max(20, 'Medical record number cannot exceed 20 characters')
      .transform((val) => val.trim())
      .optional()
      .nullable(),

    enrollmentDate: pastDateSchema.optional().nullable(),

    nurseId: z
      .string()
      .uuid('Assigned nurse ID must be a valid UUID')
      .optional()
      .nullable(),

    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

/**
 * Deactivate Student Schema
 * For deactivating a student with audit trail
 *
 * Backend Reference: deactivateStudentSchema
 */
export const deactivateStudentSchema = z.object({
  reason: z
    .string({ message: 'Reason is required' })
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason cannot exceed 500 characters')
    .transform((val) => val.trim()),
});

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * List Students Query Schema
 * For filtering and paginating student lists
 *
 * Backend Reference: listStudentsQuerySchema
 */
export const listStudentsQuerySchema = z.object({
  page: z.number().int().min(1).default(1).optional(),

  limit: z.number().int().min(1).max(100).default(10).optional(),

  search: z
    .string()
    .transform((val) => val.trim())
    .optional(),

  grade: z
    .string()
    .transform((val) => val.trim())
    .optional(),

  isActive: z.boolean().optional(),

  nurseId: z.string().uuid('Nurse ID must be a valid UUID').optional(),

  hasAllergies: z.boolean().optional(),

  hasMedications: z.boolean().optional(),
});

/**
 * Student ID Parameter Schema
 * For validating student ID in URL parameters
 *
 * Backend Reference: studentIdParamSchema
 */
export const studentIdParamSchema = z.object({
  id: uuidSchema,
});

/**
 * Grade Parameter Schema
 * For filtering by grade
 *
 * Backend Reference: gradeParamSchema
 */
export const gradeParamSchema = z.object({
  grade: z
    .string({ message: 'Grade is required' })
    .transform((val) => val.trim()),
});

/**
 * Search Query Parameter Schema
 * For search functionality
 *
 * Backend Reference: searchQueryParamSchema
 */
export const searchQueryParamSchema = z.object({
  query: z
    .string({ message: 'Search query is required' })
    .min(1, 'Search query must be at least 1 character')
    .transform((val) => val.trim()),
});

/**
 * Health Records Query Schema
 * For paginating student health records
 *
 * Backend Reference: healthRecordsQuerySchema
 */
export const healthRecordsQuerySchema = z.object({
  page: z.number().int().min(1).default(1).optional(),

  limit: z.number().int().min(1).max(100).default(10).optional(),
});

// ============================================================================
// TRANSFER SCHEMAS
// ============================================================================

/**
 * Transfer Student Schema
 * For transferring a student to a different nurse
 *
 * Backend Reference: transferStudentSchema
 */
export const transferStudentSchema = z.object({
  nurseId: z
    .string({ message: 'Nurse ID is required for transfer' })
    .uuid('New nurse ID must be a valid UUID'),
});

// ============================================================================
// BULK OPERATION SCHEMAS
// ============================================================================

/**
 * Bulk Update Students Schema
 * For updating multiple students at once
 */
export const bulkUpdateStudentsSchema = z.object({
  studentIds: z
    .array(uuidSchema)
    .min(1, 'At least one student ID is required')
    .max(100, 'Cannot update more than 100 students at once'),

  updates: z
    .object({
      grade: z.string().optional(),
      nurseId: uuidSchema.optional(),
      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      'At least one update field is required'
    ),
});

/**
 * Bulk Deactivate Students Schema
 * For deactivating multiple students at once
 */
export const bulkDeactivateStudentsSchema = z.object({
  studentIds: z
    .array(uuidSchema)
    .min(1, 'At least one student ID is required')
    .max(100, 'Cannot deactivate more than 100 students at once'),

  reason: z
    .string({ message: 'Reason is required for bulk deactivation' })
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason cannot exceed 500 characters')
    .transform((val) => val.trim()),
});

// ============================================================================
// STUDENT IMPORT/EXPORT SCHEMAS
// ============================================================================

/**
 * Import Students Schema
 * For validating bulk student import data
 */
export const importStudentsSchema = z.object({
  students: z
    .array(
      z.object({
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
        dateOfBirth: z.string().datetime(),
        grade: z.string().min(1).max(10),
        studentNumber: z.string().min(4).max(20),
        gender: z.enum(GENDER_OPTIONS),
        medicalRecordNum: z.string().min(5).max(20).optional(),
      })
    )
    .min(1, 'At least one student is required')
    .max(500, 'Cannot import more than 500 students at once'),

  validateOnly: z.boolean().default(false),
});

/**
 * Export Students Query Schema
 * For filtering students to export
 */
export const exportStudentsQuerySchema = z.object({
  grade: z.string().optional(),

  nurseId: uuidSchema.optional(),

  isActive: z.boolean().optional(),

  format: z.enum(['csv', 'xlsx', 'json']).default('csv'),

  includeHealthRecords: z.boolean().default(false),

  includeMedications: z.boolean().default(false),

  includeAllergies: z.boolean().default(false),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type DeactivateStudentInput = z.infer<typeof deactivateStudentSchema>;
export type ListStudentsQueryInput = z.infer<typeof listStudentsQuerySchema>;
export type StudentIdParamInput = z.infer<typeof studentIdParamSchema>;
export type GradeParamInput = z.infer<typeof gradeParamSchema>;
export type SearchQueryParamInput = z.infer<typeof searchQueryParamSchema>;
export type HealthRecordsQueryInput = z.infer<typeof healthRecordsQuerySchema>;
export type TransferStudentInput = z.infer<typeof transferStudentSchema>;
export type BulkUpdateStudentsInput = z.infer<typeof bulkUpdateStudentsSchema>;
export type BulkDeactivateStudentsInput = z.infer<typeof bulkDeactivateStudentsSchema>;
export type ImportStudentsInput = z.infer<typeof importStudentsSchema>;
export type ExportStudentsQueryInput = z.infer<typeof exportStudentsQuerySchema>;

// ============================================================================
// CONSTANTS EXPORTS
// ============================================================================

export { GENDER_OPTIONS };

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate student age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

/**
 * Validate student number uniqueness (async - should be called separately)
 */
export const isStudentNumberUnique = async (
  studentNumber: string,
  excludeStudentId?: string
): Promise<{ isUnique: boolean; message?: string }> => {
  // This would typically call an API endpoint
  // Placeholder for actual implementation
  return { isUnique: true };
};

/**
 * Validate medical record number format
 */
export const validateMedicalRecordNumber = (
  medicalRecordNum: string
): { isValid: boolean; message?: string } => {
  if (medicalRecordNum.length < 5 || medicalRecordNum.length > 20) {
    return {
      isValid: false,
      message: 'Medical record number must be 5-20 characters',
    };
  }

  // Check for alphanumeric only
  if (!/^[A-Za-z0-9-]+$/.test(medicalRecordNum)) {
    return {
      isValid: false,
      message: 'Medical record number can only contain letters, numbers, and hyphens',
    };
  }

  return { isValid: true };
};

/**
 * Format student name
 */
export const formatStudentName = (
  firstName: string,
  lastName: string,
  format: 'full' | 'lastFirst' | 'firstInitial' = 'full'
): string => {
  const first = firstName.trim();
  const last = lastName.trim();

  switch (format) {
    case 'lastFirst':
      return `${last}, ${first}`;
    case 'firstInitial':
      return `${first.charAt(0)}. ${last}`;
    case 'full':
    default:
      return `${first} ${last}`;
  }
};

/**
 * Get grade level number (for sorting/comparison)
 */
export const getGradeLevel = (grade: string): number => {
  const gradeUpper = grade.toUpperCase().trim();

  // Handle kindergarten
  if (gradeUpper === 'K' || gradeUpper === 'KINDERGARTEN') {
    return 0;
  }

  // Handle pre-k
  if (gradeUpper === 'PRE-K' || gradeUpper === 'PREK') {
    return -1;
  }

  // Handle numeric grades
  const numericGrade = parseInt(gradeUpper);
  if (!isNaN(numericGrade)) {
    return numericGrade;
  }

  // Default for unknown grades
  return -999;
};

/**
 * Compare grades for sorting
 */
export const compareGrades = (grade1: string, grade2: string): number => {
  const level1 = getGradeLevel(grade1);
  const level2 = getGradeLevel(grade2);

  return level1 - level2;
};

/**
 * Check if student is school-age (typically 5-18)
 */
export const isSchoolAge = (dateOfBirth: string): boolean => {
  const age = calculateAge(dateOfBirth);
  return age >= 5 && age <= 18;
};

/**
 * Get student age category
 */
export const getAgeCategory = (
  dateOfBirth: string
): 'preschool' | 'elementary' | 'middle' | 'high' | 'adult' => {
  const age = calculateAge(dateOfBirth);

  if (age < 5) return 'preschool';
  if (age >= 5 && age <= 11) return 'elementary';
  if (age >= 12 && age <= 14) return 'middle';
  if (age >= 15 && age <= 18) return 'high';
  return 'adult';
};

/**
 * Validate enrollment date (cannot be in future, reasonable date)
 */
export const validateEnrollmentDate = (
  enrollmentDate: string,
  dateOfBirth: string
): { isValid: boolean; message?: string } => {
  const enrollment = new Date(enrollmentDate);
  const dob = new Date(dateOfBirth);
  const today = new Date();

  // Cannot be in future
  if (enrollment > today) {
    return {
      isValid: false,
      message: 'Enrollment date cannot be in the future',
    };
  }

  // Cannot be before date of birth
  if (enrollment < dob) {
    return {
      isValid: false,
      message: 'Enrollment date cannot be before date of birth',
    };
  }

  // Typically students enroll at age 4-5 or later
  const ageAtEnrollment =
    enrollment.getFullYear() - dob.getFullYear();
  if (ageAtEnrollment < 3) {
    return {
      isValid: false,
      message: 'Enrollment date seems too early (student would be younger than 3)',
    };
  }

  return { isValid: true };
};
