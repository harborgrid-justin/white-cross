/**
 * WF-COMP-355 | validation/index.ts - Validation utilities barrel export
 * Purpose: Central export point for all validation utilities
 * Upstream: Student and user validation modules | Dependencies: All validation submodules
 * Downstream: Components, pages, forms, actions | Called by: All features needing validation
 * Related: validation/studentValidation, validation/userValidation
 * Exports: All validation functions with namespaces | Key Features: Conflict resolution via namespaces
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import → Use validation functions
 * LLM Context: Central barrel export for validation utilities, uses namespaces to avoid conflicts
 */

/**
 * Validation Utilities
 *
 * This module provides comprehensive validation utilities for the application.
 * To avoid naming conflicts between student and user validation functions,
 * we export them in namespaces while also providing direct exports for unique functions.
 *
 * Usage Examples:
 *
 * // Using namespaced exports (recommended when there are conflicts)
 * import { StudentValidation, UserValidation } from '@/utils/validation';
 * StudentValidation.validateName(name, 'First name');
 * UserValidation.validateEmail(email);
 *
 * // Using direct exports (for unique functions)
 * import { validatePassword, validateSSN, validateStudentCreation } from '@/utils/validation';
 * validatePassword('myPassword123!');
 *
 * // Using named re-exports (for avoiding conflicts explicitly)
 * import {
 *   validateName as validateStudentName,
 *   validateEmail as validateStudentEmail
 * } from '@/utils/validation/studentValidation';
 */

// =============================================================================
// STUDENT VALIDATION - Export as namespace and direct exports
// =============================================================================

import * as StudentValidationModule from './studentValidation';

/**
 * Student validation utilities namespace
 * Contains all validation functions specific to student data
 */
export const StudentValidation = StudentValidationModule;

// Direct exports for unique student validation functions
export {
  // Composite and normalization functions (unique to student validation)
  validateStudentCreation,
  normalizeStudentData,

  // Student-specific validations
  validateStudentNumber,
  validateMedicalRecordNumber,
  validateUUID,
  validatePhotoUrl,
  validateEnrollmentDate,

  // Constants and types (unique to student validation)
  VALID_GRADES,
  VALIDATION_PATTERNS,
  FIELD_CONSTRAINTS,
  AGE_CONSTRAINTS,
  VALID_GENDERS,

  // Types
  ValidationResult,
  StudentCreationData,
  CompositeValidationResult,
} from './studentValidation';

// =============================================================================
// USER VALIDATION - Export as namespace and direct exports
// =============================================================================

import * as UserValidationModule from './userValidation';

/**
 * User validation utilities namespace
 * Contains all validation functions specific to user data
 */
export const UserValidation = UserValidationModule;

// Direct exports for unique user validation functions
export {
  validatePassword,
  validateRequired,
  validateZipCode,
  validateSSN,
  validateEmergencyContact,
} from './userValidation';

// =============================================================================
// SHARED VALIDATIONS - Use with caution (naming conflicts exist)
// =============================================================================

/**
 * WARNING: The following functions exist in BOTH student and user validation
 * with different implementations and signatures:
 *
 * - validateName (different signatures and validation rules)
 * - validateEmail (different implementations)
 * - validatePhone/validatePhoneNumber (different implementations)
 * - validateDateOfBirth (different return types and constraints)
 * - validateGrade (student-specific, also exists in demographics)
 * - validateGender (student-specific, also exists in demographics)
 *
 * RECOMMENDED: Always use the namespaced versions to be explicit:
 *   - StudentValidation.validateName(name, 'First name')
 *   - UserValidation.validateName(name)
 *   - StudentValidation.validateEmail(email)
 *   - UserValidation.validateEmail(email)
 *
 * If you need direct imports, use named imports from the specific module:
 *   import { validateName as validateStudentName } from './studentValidation';
 *   import { validateName as validateUserName } from './userValidation';
 */

// =============================================================================
// DEFAULT EXPORTS FOR CONVENIENCE
// =============================================================================

/**
 * Default export provides both namespaces for convenience
 */
export default {
  Student: StudentValidation,
  User: UserValidation,
};
