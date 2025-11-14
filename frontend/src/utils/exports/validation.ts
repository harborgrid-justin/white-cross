/**
 * @fileoverview Validation Utilities Barrel Export
 * @module utils/exports/validation
 * @category Utils
 *
 * Centralized export for all validation utilities including student validation,
 * user validation, and document validation.
 *
 * This module provides comprehensive validation for:
 * - Student data (demographics, health, enrollment)
 * - User accounts and authentication
 * - Document management and lifecycle
 *
 * @example
 * ```typescript
 * import { validateStudentCreation, validateEmail } from '@/utils';
 * import { validateDocumentTitle, validateFileSize } from '@/utils';
 * ```
 */

// ============================================================================
// STUDENT VALIDATION
// ============================================================================

/**
 * Student Validation Utilities
 * Comprehensive validation functions for student data including demographics,
 * health information, and enrollment data.
 */
export type {
  ValidationResult,
  StudentCreationData,
  CompositeValidationResult,
} from '../validation/studentValidation.types';

export {
  // Constants
  VALID_GRADES,
  VALIDATION_PATTERNS,
  FIELD_CONSTRAINTS,
  AGE_CONSTRAINTS,
  VALID_GENDERS,

  // Demographic validation
  validateName,
  validateDateOfBirth,
  validateGrade,
  validateGender,

  // Health validation
  validateMedicalRecordNumber,
  validateUUID,
  validatePhotoUrl,

  // Enrollment validation
  validateStudentNumber,
  validateEnrollmentDate,
  validatePhoneNumber,
  validateEmail,

  // Composite validation
  validateStudentCreation,
  normalizeStudentData,
} from '../validation/studentValidation';

// ============================================================================
// USER VALIDATION
// ============================================================================

/**
 * User Validation Utilities
 * Validation functions for user account data and authentication.
 */
export * from '../validation/userValidation';

// ============================================================================
// DOCUMENT VALIDATION
// ============================================================================

/**
 * Document Validation Utilities
 * Client-side validation for document management operations including
 * file uploads, metadata, security, and lifecycle management.
 */
export type {
  ValidationError as DocumentValidationError,
  ValidationResult as DocumentValidationResult,
} from '../documentValidation.types';

export {
  // Constants
  MIN_FILE_SIZE,
  MAX_TITLE_LENGTH,
  MIN_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_TAGS_COUNT,
  MAX_TAG_LENGTH,
  MIN_TAG_LENGTH,
  MAX_SHARE_RECIPIENTS,

  // File type validation
  validateFileSize,
  validateFileType,
  validateFileExtensionMatchesMimeType,
  validateFileName,
  validateFile,

  // Security validation
  validateDocumentTitle,
  validateDocumentDescription,
  validateDocumentCategory,
  validateAccessLevel,
  validateDocumentTags,
  validateSignatureData,
  validateSharePermissions,

  // Lifecycle validation
  validateDocumentStatus,
  validateStatusTransition,
  validateRetentionDate,
  calculateDefaultRetentionDate,
  categoryRequiresSignature,

  // Operations validation
  validateDocumentCanBeEdited,
  validateDocumentCanBeSigned,
  validateDocumentCanBeDeleted,

  // Schema validation
  validateDocumentCreation,
  validateDocumentUpdate,

  // Helpers
  formatValidationErrors,
  getFirstErrorMessage,
} from '../documentValidation';
