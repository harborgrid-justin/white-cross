/**
 * WF-COMP-355 | studentValidation.ts - Student validation barrel export
 * Purpose: Main export file for all student validation utilities
 * Upstream: All studentValidation modules | Dependencies: All validation submodules
 * Downstream: Components, pages, forms | Called by: Student management features
 * Related: All studentValidation modules
 * Exports: All validation functions, constants, types | Key Features: Backward compatibility
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import → Use validation functions
 * LLM Context: Central export point for student validation, maintains backward compatibility
 */

/**
 * Student Validation Utilities
 * Reusable validation functions for student data
 * Ensures consistency across forms and API calls
 *
 * This file serves as a barrel export for all student validation modules.
 * It maintains backward compatibility with the original monolithic module.
 */

// Export all types, constants, and interfaces
export {
  VALID_GRADES,
  VALIDATION_PATTERNS,
  FIELD_CONSTRAINTS,
  AGE_CONSTRAINTS,
  VALID_GENDERS,
  ValidationResult,
  StudentCreationData,
  CompositeValidationResult,
} from './studentValidation.types';

// Export demographic validation functions
export {
  validateName,
  validateDateOfBirth,
  validateGrade,
  validateGender,
} from './studentValidation.demographics';

// Export health validation functions
export {
  validateMedicalRecordNumber,
  validateUUID,
  validatePhotoUrl,
} from './studentValidation.health';

// Export enrollment validation functions
export {
  validateStudentNumber,
  validateEnrollmentDate,
  validatePhoneNumber,
  validateEmail,
} from './studentValidation.enrollment';

// Export composite validation and normalization functions
export {
  validateStudentCreation,
  normalizeStudentData,
} from './studentValidation.composite';
