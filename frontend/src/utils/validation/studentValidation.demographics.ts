/**
 * WF-COMP-355 | studentValidation.demographics.ts - Demographic validation functions
 * Purpose: Validation functions for student demographic information
 * Upstream: studentValidation.types.ts | Dependencies: Validation constants
 * Downstream: Forms, API calls | Called by: Student management components
 * Related: studentValidation modules
 * Exports: Demographic validation functions | Key Features: Name, DOB, grade, gender validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Form input → Validation → Error display or submission
 * LLM Context: Student demographic data validation utilities
 */

import {
  VALIDATION_PATTERNS,
  FIELD_CONSTRAINTS,
  AGE_CONSTRAINTS,
  VALID_GRADES,
  VALID_GENDERS,
  ValidationResult,
} from './studentValidation.types';

/**
 * Validates a student's name (first or last name)
 * @param name - Name to validate
 * @param fieldName - Field name for error messages
 * @returns Validation result with error message if invalid
 */
export function validateName(
  name: string,
  fieldName: 'First name' | 'Last name' = 'First name'
): ValidationResult {
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
export function validateDateOfBirth(dateOfBirth: string | Date): ValidationResult {
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
export function validateGrade(grade: string): ValidationResult {
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
 * Validates a gender value
 * @param gender - Gender to validate
 * @returns Validation result with error message if invalid
 */
export function validateGender(gender: string): ValidationResult {
  if (!VALID_GENDERS.includes(gender as any)) {
    return {
      valid: false,
      error: 'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY',
    };
  }

  return { valid: true };
}
