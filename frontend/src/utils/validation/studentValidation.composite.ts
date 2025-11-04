/**
 * WF-COMP-355 | studentValidation.composite.ts - Composite validation and normalization
 * Purpose: Composite validation functions that combine multiple validations
 * Upstream: All studentValidation modules | Dependencies: All validation functions
 * Downstream: Forms, API calls | Called by: Student management components
 * Related: studentValidation modules
 * Exports: Composite validation, normalization functions | Key Features: Full student validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Form submission → Composite validation → API call or error display
 * LLM Context: Combined student validation utilities
 */

import {
  StudentCreationData,
  CompositeValidationResult,
} from './studentValidation.types';

import {
  validateName,
  validateDateOfBirth,
  validateGrade,
  validateGender,
} from './studentValidation.demographics';

import {
  validateMedicalRecordNumber,
  validateUUID,
  validatePhotoUrl,
} from './studentValidation.health';

import {
  validateStudentNumber,
  validateEnrollmentDate,
} from './studentValidation.enrollment';

/**
 * Validates complete student creation data
 * @param data - Student creation data
 * @returns Validation result with all errors
 */
export function validateStudentCreation(
  data: StudentCreationData
): CompositeValidationResult {
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
  const genderResult = validateGender(data.gender);
  if (!genderResult.valid) {
    errors.gender = genderResult.error!;
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
