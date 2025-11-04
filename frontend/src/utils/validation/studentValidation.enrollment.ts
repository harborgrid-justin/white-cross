/**
 * WF-COMP-355 | studentValidation.enrollment.ts - Enrollment validation functions
 * Purpose: Validation functions for student enrollment and contact information
 * Upstream: studentValidation.types.ts | Dependencies: Validation constants
 * Downstream: Forms, API calls | Called by: Student enrollment components
 * Related: studentValidation modules
 * Exports: Enrollment validation functions | Key Features: Student number, enrollment date, contact validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Form input → Validation → Error display or submission
 * LLM Context: Student enrollment data validation utilities
 */

import {
  VALIDATION_PATTERNS,
  FIELD_CONSTRAINTS,
  ValidationResult,
} from './studentValidation.types';

/**
 * Validates a student number format
 * @param studentNumber - Student number to validate
 * @returns Validation result with error message if invalid
 */
export function validateStudentNumber(studentNumber: string): ValidationResult {
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
 * Validates an enrollment date
 * @param enrollmentDate - Enrollment date to validate (optional)
 * @returns Validation result with error message if invalid
 */
export function validateEnrollmentDate(
  enrollmentDate: string | Date | undefined
): ValidationResult {
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
export function validatePhoneNumber(phoneNumber: string): ValidationResult {
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
export function validateEmail(email: string | undefined): ValidationResult {
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
