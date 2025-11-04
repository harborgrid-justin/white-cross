/**
 * WF-COMP-355 | studentValidation.health.ts - Health information validation functions
 * Purpose: Validation functions for student health-related information
 * Upstream: studentValidation.types.ts | Dependencies: Validation constants
 * Downstream: Forms, API calls | Called by: Student health management components
 * Related: studentValidation modules
 * Exports: Health validation functions | Key Features: Medical record, nurse ID, photo validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Form input → Validation → Error display or submission
 * LLM Context: Student health data validation utilities
 */

import {
  VALIDATION_PATTERNS,
  FIELD_CONSTRAINTS,
  ValidationResult,
} from './studentValidation.types';

/**
 * Validates a medical record number format
 * @param medicalRecordNum - Medical record number to validate
 * @returns Validation result with error message if invalid
 */
export function validateMedicalRecordNumber(
  medicalRecordNum: string | undefined
): ValidationResult {
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
 * Validates a UUID
 * @param uuid - UUID to validate
 * @param fieldName - Field name for error messages
 * @returns Validation result with error message if invalid
 */
export function validateUUID(
  uuid: string | undefined,
  fieldName: string = 'ID'
): ValidationResult {
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
 * Validates a photo URL
 * @param photoUrl - Photo URL to validate (optional)
 * @returns Validation result with error message if invalid
 */
export function validatePhotoUrl(photoUrl: string | undefined): ValidationResult {
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
