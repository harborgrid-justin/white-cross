/**
 * WF-COMP-355 | studentValidation.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Student Validation Utilities
 * Reusable validation functions for student data
 * Ensures consistency across forms and API calls
 */

/**
 * Valid grade values for K-12 education system
 */
export const VALID_GRADES = [
  'K', 'K-1', 'K-2', 'K-3', 'K-4', 'K-5',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
  'Pre-K', 'PK', 'TK',
] as const;

/**
 * Validation regex patterns
 */
export const VALIDATION_PATTERNS = {
  // Phone number (US format): (123) 456-7890, 123-456-7890, 1234567890
  PHONE: /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,

  // Email validation
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Medical record number format (alphanumeric, 5-20 chars)
  MEDICAL_RECORD: /^[A-Z0-9-]{5,20}$/i,

  // Student number format (alphanumeric, 4-20 chars)
  STUDENT_NUMBER: /^[A-Z0-9-]{4,20}$/i,

  // Name validation (letters, spaces, hyphens, apostrophes)
  NAME: /^[a-zA-Z\s'-]+$/,

  // UUID validation
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
} as const;

/**
 * Field length constraints matching backend Sequelize model
 */
export const FIELD_CONSTRAINTS = {
  STUDENT_NUMBER: { min: 4, max: 20 },
  FIRST_NAME: { min: 1, max: 100 },
  LAST_NAME: { min: 1, max: 100 },
  GRADE: { min: 1, max: 10 },
  PHOTO_URL: { min: 0, max: 500 },
  MEDICAL_RECORD_NUM: { min: 5, max: 20 },
  PHONE_NUMBER: { min: 10, max: 20 },
  EMAIL: { min: 5, max: 255 },
  ADDRESS: { min: 0, max: 500 },
} as const;

/**
 * Age constraints for students
 */
export const AGE_CONSTRAINTS = {
  MIN: 3,
  MAX: 100,
} as const;

/**
 * Validates a student number format
 * @param studentNumber - Student number to validate
 * @returns Validation result with error message if invalid
 */
export function validateStudentNumber(studentNumber: string): {
  valid: boolean;
  error?: string;
} {
  if (!studentNumber || studentNumber.trim().length === 0) {
    return { valid: false, error: 'Student number is required' };
  }

  const normalized = studentNumber.trim();

  if (normalized.length < FIELD_CONSTRAINTS.STUDENT_NUMBER.min) {
    return {
      valid: false,
      error: `Student number must be at least ${FIELD_CONSTRAINTS.STUDENT_NUMBER.min} characters`,
    };
  }

  if (normalized.length > FIELD_CONSTRAINTS.STUDENT_NUMBER.max) {
    return {
      valid: false,
      error: `Student number cannot exceed ${FIELD_CONSTRAINTS.STUDENT_NUMBER.max} characters`,
    };
  }

  if (!VALIDATION_PATTERNS.STUDENT_NUMBER.test(normalized)) {
    return {
      valid: false,
      error: 'Student number must be alphanumeric with optional hyphens',
    };
  }

  return { valid: true };
}

/**
 * Validates a medical record number format
 * @param medicalRecordNum - Medical record number to validate
 * @returns Validation result with error message if invalid
 */
export function validateMedicalRecordNumber(
  medicalRecordNum: string | undefined
): {
  valid: boolean;
  error?: string;
} {
  // Optional field
  if (!medicalRecordNum || medicalRecordNum.trim().length === 0) {
    return { valid: true };
  }

  const normalized = medicalRecordNum.trim();

  if (normalized.length < FIELD_CONSTRAINTS.MEDICAL_RECORD_NUM.min) {
    return {
      valid: false,
      error: `Medical record number must be at least ${FIELD_CONSTRAINTS.MEDICAL_RECORD_NUM.min} characters`,
    };
  }

  if (normalized.length > FIELD_CONSTRAINTS.MEDICAL_RECORD_NUM.max) {
    return {
      valid: false,
      error: `Medical record number cannot exceed ${FIELD_CONSTRAINTS.MEDICAL_RECORD_NUM.max} characters`,
    };
  }

  if (!VALIDATION_PATTERNS.MEDICAL_RECORD.test(normalized)) {
    return {
      valid: false,
      error: 'Medical record number must be alphanumeric with optional hyphens',
    };
  }

  return { valid: true };
}

/**
 * Validates a student's name (first or last name)
 * @param name - Name to validate
 * @param fieldName - Field name for error messages
 * @returns Validation result with error message if invalid
 */
export function validateName(
  name: string,
  fieldName: 'First name' | 'Last name' = 'First name'
): {
  valid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }

  const normalized = name.trim();
  const constraint =
    fieldName === 'First name'
      ? FIELD_CONSTRAINTS.FIRST_NAME
      : FIELD_CONSTRAINTS.LAST_NAME;

  if (normalized.length < constraint.min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${constraint.min} character`,
    };
  }

  if (normalized.length > constraint.max) {
    return {
      valid: false,
      error: `${fieldName} cannot exceed ${constraint.max} characters`,
    };
  }

  if (!VALIDATION_PATTERNS.NAME.test(normalized)) {
    return {
      valid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  return { valid: true };
}

/**
 * Validates a date of birth
 * @param dateOfBirth - Date of birth to validate (Date object or ISO string)
 * @returns Validation result with error message if invalid
 */
export function validateDateOfBirth(dateOfBirth: string | Date): {
  valid: boolean;
  error?: string;
} {
  if (!dateOfBirth) {
    return { valid: false, error: 'Date of birth is required' };
  }

  const dob = new Date(dateOfBirth);

  // Check if date is valid
  if (isNaN(dob.getTime())) {
    return { valid: false, error: 'Date of birth must be a valid date' };
  }

  const today = new Date();

  // Check if date is in the past
  if (dob >= today) {
    return { valid: false, error: 'Date of birth must be in the past' };
  }

  // Calculate age
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  // Check age constraints
  if (age < AGE_CONSTRAINTS.MIN || age > AGE_CONSTRAINTS.MAX) {
    return {
      valid: false,
      error: `Student age must be between ${AGE_CONSTRAINTS.MIN} and ${AGE_CONSTRAINTS.MAX} years`,
    };
  }

  return { valid: true };
}

/**
 * Validates a grade level
 * @param grade - Grade to validate
 * @returns Validation result with error message if invalid
 */
export function validateGrade(grade: string): {
  valid: boolean;
  error?: string;
} {
  if (!grade || grade.trim().length === 0) {
    return { valid: false, error: 'Grade is required' };
  }

  const normalized = grade.trim();

  if (normalized.length > FIELD_CONSTRAINTS.GRADE.max) {
    return {
      valid: false,
      error: `Grade cannot exceed ${FIELD_CONSTRAINTS.GRADE.max} characters`,
    };
  }

  // Check if it's a standard grade
  const upperGrade = normalized.toUpperCase();
  const isStandardGrade = VALID_GRADES.some(
    (g) => g.toUpperCase() === upperGrade
  );

  // Check if it's a numeric grade (1-12)
  const isNumericGrade = /^\d{1,2}$/.test(normalized);

  if (!isStandardGrade && !isNumericGrade) {
    return {
      valid: false,
      error: 'Grade must be K-12, Pre-K, TK, or a valid custom grade format',
    };
  }

  return { valid: true };
}

/**
 * Validates an enrollment date
 * @param enrollmentDate - Enrollment date to validate (optional)
 * @returns Validation result with error message if invalid
 */
export function validateEnrollmentDate(
  enrollmentDate: string | Date | undefined
): {
  valid: boolean;
  error?: string;
} {
  // Optional field
  if (!enrollmentDate) {
    return { valid: true };
  }

  const enrollDate = new Date(enrollmentDate);

  // Check if date is valid
  if (isNaN(enrollDate.getTime())) {
    return { valid: false, error: 'Enrollment date must be a valid date' };
  }

  // Check reasonable date range (year 2000 to 1 year in future)
  const minDate = new Date(2000, 0, 1);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  if (enrollDate < minDate || enrollDate > maxDate) {
    return {
      valid: false,
      error: 'Enrollment date must be between 2000 and one year from today',
    };
  }

  return { valid: true };
}

/**
 * Validates a phone number
 * @param phoneNumber - Phone number to validate
 * @returns Validation result with error message if invalid
 */
export function validatePhoneNumber(phoneNumber: string): {
  valid: boolean;
  error?: string;
} {
  if (!phoneNumber || phoneNumber.trim().length === 0) {
    return { valid: false, error: 'Phone number is required' };
  }

  const normalized = phoneNumber.trim();

  if (!VALIDATION_PATTERNS.PHONE.test(normalized)) {
    return {
      valid: false,
      error: 'Phone number must be a valid US phone number',
    };
  }

  return { valid: true };
}

/**
 * Validates an email address
 * @param email - Email to validate (optional)
 * @returns Validation result with error message if invalid
 */
export function validateEmail(email: string | undefined): {
  valid: boolean;
  error?: string;
} {
  // Optional field
  if (!email || email.trim().length === 0) {
    return { valid: true };
  }

  const normalized = email.trim();

  if (normalized.length < FIELD_CONSTRAINTS.EMAIL.min) {
    return {
      valid: false,
      error: `Email must be at least ${FIELD_CONSTRAINTS.EMAIL.min} characters`,
    };
  }

  if (normalized.length > FIELD_CONSTRAINTS.EMAIL.max) {
    return {
      valid: false,
      error: `Email cannot exceed ${FIELD_CONSTRAINTS.EMAIL.max} characters`,
    };
  }

  if (!VALIDATION_PATTERNS.EMAIL.test(normalized)) {
    return { valid: false, error: 'Email must be a valid email address' };
  }

  return { valid: true };
}

/**
 * Validates a photo URL
 * @param photoUrl - Photo URL to validate (optional)
 * @returns Validation result with error message if invalid
 */
export function validatePhotoUrl(photoUrl: string | undefined): {
  valid: boolean;
  error?: string;
} {
  // Optional field
  if (!photoUrl || photoUrl.trim().length === 0) {
    return { valid: true };
  }

  const normalized = photoUrl.trim();

  if (normalized.length > FIELD_CONSTRAINTS.PHOTO_URL.max) {
    return {
      valid: false,
      error: `Photo URL cannot exceed ${FIELD_CONSTRAINTS.PHOTO_URL.max} characters`,
    };
  }

  // Basic URL validation
  try {
    new URL(normalized);
  } catch {
    return { valid: false, error: 'Photo must be a valid URL' };
  }

  return { valid: true };
}

/**
 * Validates a UUID
 * @param uuid - UUID to validate
 * @param fieldName - Field name for error messages
 * @returns Validation result with error message if invalid
 */
export function validateUUID(
  uuid: string | undefined,
  fieldName: string = 'ID'
): {
  valid: boolean;
  error?: string;
} {
  // Optional field
  if (!uuid || uuid.trim().length === 0) {
    return { valid: true };
  }

  const normalized = uuid.trim();

  if (!VALIDATION_PATTERNS.UUID.test(normalized)) {
    return { valid: false, error: `${fieldName} must be a valid UUID` };
  }

  return { valid: true };
}

/**
 * Validates complete student creation data
 * @param data - Student creation data
 * @returns Validation result with all errors
 */
export function validateStudentCreation(data: {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  gender: string;
  photo?: string;
  medicalRecordNum?: string;
  nurseId?: string;
  enrollmentDate?: string;
}): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Validate student number
  const studentNumberResult = validateStudentNumber(data.studentNumber);
  if (!studentNumberResult.valid) {
    errors.studentNumber = studentNumberResult.error!;
  }

  // Validate first name
  const firstNameResult = validateName(data.firstName, 'First name');
  if (!firstNameResult.valid) {
    errors.firstName = firstNameResult.error!;
  }

  // Validate last name
  const lastNameResult = validateName(data.lastName, 'Last name');
  if (!lastNameResult.valid) {
    errors.lastName = lastNameResult.error!;
  }

  // Validate date of birth
  const dobResult = validateDateOfBirth(data.dateOfBirth);
  if (!dobResult.valid) {
    errors.dateOfBirth = dobResult.error!;
  }

  // Validate grade
  const gradeResult = validateGrade(data.grade);
  if (!gradeResult.valid) {
    errors.grade = gradeResult.error!;
  }

  // Validate gender
  const validGenders = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
  if (!validGenders.includes(data.gender)) {
    errors.gender =
      'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY';
  }

  // Validate optional fields
  if (data.photo) {
    const photoResult = validatePhotoUrl(data.photo);
    if (!photoResult.valid) {
      errors.photo = photoResult.error!;
    }
  }

  if (data.medicalRecordNum) {
    const medicalRecordResult = validateMedicalRecordNumber(
      data.medicalRecordNum
    );
    if (!medicalRecordResult.valid) {
      errors.medicalRecordNum = medicalRecordResult.error!;
    }
  }

  if (data.nurseId) {
    const nurseIdResult = validateUUID(data.nurseId, 'Nurse ID');
    if (!nurseIdResult.valid) {
      errors.nurseId = nurseIdResult.error!;
    }
  }

  if (data.enrollmentDate) {
    const enrollmentDateResult = validateEnrollmentDate(data.enrollmentDate);
    if (!enrollmentDateResult.valid) {
      errors.enrollmentDate = enrollmentDateResult.error!;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Normalizes student data before submission
 * Trims whitespace and converts to proper case
 */
export function normalizeStudentData<T extends Record<string, any>>(
  data: T
): T {
  const normalized = { ...data } as any;

  if ('studentNumber' in normalized && typeof normalized.studentNumber === 'string') {
    normalized.studentNumber = normalized.studentNumber.toUpperCase().trim();
  }

  if ('firstName' in normalized && typeof normalized.firstName === 'string') {
    normalized.firstName = normalized.firstName.trim();
  }

  if ('lastName' in normalized && typeof normalized.lastName === 'string') {
    normalized.lastName = normalized.lastName.trim();
  }

  if ('medicalRecordNum' in normalized && typeof normalized.medicalRecordNum === 'string') {
    normalized.medicalRecordNum = normalized.medicalRecordNum
      .toUpperCase()
      .trim();
  }

  if ('grade' in normalized && typeof normalized.grade === 'string') {
    normalized.grade = normalized.grade.trim();
  }

  return normalized;
}
