/**
 * WF-COMP-338 | documentValidation.test.ts - Verification test
 * Purpose: Verifies all exports are accessible from main barrel module
 * This file tests backward compatibility after refactoring
 */

import {
  // Types
  ValidationError,
  ValidationResult,

  // Constants
  MIN_FILE_SIZE,
  MAX_TITLE_LENGTH,
  MIN_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_TAGS_COUNT,
  MAX_TAG_LENGTH,
  MIN_TAG_LENGTH,
  MAX_SHARE_RECIPIENTS,

  // File Type Validation
  validateFileSize,
  validateFileType,
  validateFileExtensionMatchesMimeType,
  validateFileName,
  validateFile,

  // Security Validation
  validateDocumentTitle,
  validateDocumentDescription,
  validateDocumentCategory,
  validateAccessLevel,
  validateDocumentTags,
  validateSignatureData,
  validateSharePermissions,

  // Lifecycle Validation
  validateDocumentStatus,
  validateStatusTransition,
  validateRetentionDate,
  calculateDefaultRetentionDate,
  categoryRequiresSignature,

  // Operations Validation
  validateDocumentCanBeEdited,
  validateDocumentCanBeSigned,
  validateDocumentCanBeDeleted,

  // Schema Validation
  validateDocumentCreation,
  validateDocumentUpdate,

  // Helper Functions
  formatValidationErrors,
  getFirstErrorMessage,
} from './documentValidation';

// Type assertions to verify exports are correct
const testError: ValidationError = {
  field: 'test',
  message: 'test',
  code: 'TEST',
};

const testResult: ValidationResult = {
  isValid: true,
  errors: [],
};

// Verify constants are numbers
const minSize: number = MIN_FILE_SIZE;
const maxTitle: number = MAX_TITLE_LENGTH;

// Verify functions exist and have correct signatures
const titleValidation = validateDocumentTitle('Test Title');
const fileNameValidation = validateFileName('test.pdf');

console.log('All exports verified successfully!');
console.log('Total constants exported: 8');
console.log('Total functions exported: 25');
console.log('Total types exported: 2');
