/**
 * WF-COMP-355 | studentValidation.types.ts - Student validation type definitions
 * Purpose: Constants, patterns, and type definitions for student validation
 * Upstream: None | Dependencies: None
 * Downstream: All student validation modules | Called by: Validation functions
 * Related: studentValidation modules
 * Exports: constants, patterns, constraints | Key Features: Validation configuration
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import → Use in validation functions
 * LLM Context: Student validation type definitions and constants
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
 * Valid gender values
 */
export const VALID_GENDERS = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'] as const;

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Student creation data interface
 */
export interface StudentCreationData {
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
}

/**
 * Composite validation result with multiple errors
 */
export interface CompositeValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
