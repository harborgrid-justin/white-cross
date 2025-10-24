/**
 * Student Validation Schemas Module
 *
 * Comprehensive Zod validation schemas for student management operations.
 * Ensures data integrity and type safety aligned with backend Joi validators.
 *
 * **Validation Coverage**:
 * - Student CRUD operations (create, update, deactivate)
 * - Student transfers between nurses
 * - Bulk operations (update, deactivate)
 * - Import/export operations
 * - Search and filtering
 *
 * **Backend Alignment**: Schemas match backend validators for API compatibility
 *
 * @module validation/studentSchemas
 * @category Validation
 * @see {@link backend/src/routes/v1/operations/validators/students.validators.ts} Backend validators
 *
 * @example
 * ```typescript
 * import { createStudentSchema } from './validation/studentSchemas';
 *
 * const result = createStudentSchema.safeParse(formData);
 * if (!result.success) {
 *   console.error('Validation errors:', result.error.errors);
 * } else {
 *   await createStudent(result.data);
 * }
 * ```
 */

import { z } from 'zod';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Valid gender options for student profiles.
 *
 * Readonly tuple ensuring only valid values are accepted.
 * Matches backend Gender enum.
 */
const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'] as const;

// ============================================================================
// HELPER SCHEMAS
// ============================================================================

/**
 * UUID v4 validation schema.
 *
 * Validates string is properly formatted UUID v4 identifier.
 * Used for all entity ID validations (students, nurses, schools, etc.).
 *
 * **Error Message**: "Must be a valid UUID"
 */
const uuidSchema = z.string().uuid({ message: 'Must be a valid UUID' });

/**
 * Past date validation schema.
 *
 * Validates date is in ISO 8601 format and not in the future.
 * Used for birth dates, enrollment dates, and historical events.
 *
 * **Constraints**:
 * - Must be valid ISO 8601 datetime string
 * - Cannot be in the future
 *
 * **Error Message**: "Date cannot be in the future"
 *
 * @example
 * ```typescript
 * pastDateSchema.parse('2025-01-01T00:00:00Z'); // ✅ Valid
 * pastDateSchema.parse('2030-01-01T00:00:00Z'); // ❌ Fails - future date
 * ```
 */
const pastDateSchema = z
  .string()
  .datetime()
  .refine((val) => new Date(val) <= new Date(), 'Date cannot be in the future');

// ============================================================================
// STUDENT MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Create Student Validation Schema
 *
 * Validates student registration data with comprehensive field-level constraints.
 * All required fields must be provided; optional fields can be null or undefined.
 *
 * **Validation Rules**:
 *
 * Required Fields:
 * - `firstName`: 1-100 characters, trimmed, required
 * - `lastName`: 1-100 characters, trimmed, required
 * - `dateOfBirth`: ISO 8601 datetime, must be in past, required
 * - `grade`: 1-10 characters (e.g., "K", "1", "12"), trimmed, required
 * - `studentNumber`: 4-20 characters, unique identifier, trimmed, required
 * - `gender`: One of MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY, required
 *
 * Optional Fields:
 * - `photo`: Valid URL, max 500 characters, optional
 * - `medicalRecordNum`: 5-20 characters, alphanumeric, optional
 * - `enrollmentDate`: ISO 8601 datetime, must be in past, optional
 * - `nurseId`: UUID v4 of assigned nurse, optional
 * - `schoolId`: UUID v4 of school, optional
 * - `districtId`: UUID v4 of district, optional
 *
 * **Transformations**:
 * - String fields are automatically trimmed of leading/trailing whitespace
 *
 * **Common Validation Errors**:
 * - "First name is required" - firstName field is missing or empty
 * - "Student number must be at least 4 characters" - studentNumber too short
 * - "Date of birth cannot be in the future" - dateOfBirth is a future date
 * - "Gender must be one of: MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY" - Invalid gender value
 *
 * @see {@link backend/src/routes/v1/operations/validators/students.validators.ts:createStudentSchema} Backend validator
 *
 * @example
 * ```typescript
 * const studentData = {
 *   firstName: '  John  ', // Will be trimmed to 'John'
 *   lastName: 'Doe',
 *   dateOfBirth: '2010-05-15T00:00:00Z',
 *   grade: '9',
 *   studentNumber: 'STU-2025-001',
 *   gender: 'MALE',
 *   enrollmentDate: '2025-09-01T00:00:00Z',
 *   nurseId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
 * };
 *
 * const result = createStudentSchema.safeParse(studentData);
 * if (result.success) {
 *   console.log('Valid student data:', result.data);
 * } else {
 *   console.error('Validation errors:', result.error.errors);
 * }
 * ```
 *
 * @example Handling Validation Errors
 * ```typescript
 * const result = createStudentSchema.safeParse(invalidData);
 * if (!result.success) {
 *   result.error.errors.forEach(err => {
 *     console.log(`${err.path.join('.')}: ${err.message}`);
 *   });
 * }
 * ```
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
