/**
 * WF-COMP-338 | documentValidation.ts - Barrel export for document validation
 * Purpose: Re-exports all validation modules for backward compatibility
 * Upstream: All documentValidation.*.ts modules | Dependencies: All validation modules
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: All documentValidation modules
 * Exports: All validation functions, types, constants | Key Features: Single import point
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Import validation → Use validation functions
 * LLM Context: Barrel export for document validation system, maintains backward compatibility
 */

/**
 * Document Validation Utilities - Frontend
 * Client-side validation for document management operations
 * Mirrors backend validation logic for immediate user feedback
 *
 * This module provides a unified import point for all document validation functionality.
 * It has been refactored into focused modules for better maintainability:
 *
 * - documentValidation.types.ts: Type definitions and constants
 * - documentValidation.fileTypes.ts: File upload validation
 * - documentValidation.security.ts: Security and metadata validation
 * - documentValidation.lifecycle.ts: Document lifecycle validation
 * - documentValidation.operations.ts: Document operations validation
 * - documentValidation.schema.ts: Combined validation schemas
 * - documentValidation.helpers.ts: Helper utilities
 *
 * All exports are preserved for backward compatibility.
 */

// ============================================================================
// Re-export Types and Constants
// ============================================================================

export type {
  ValidationError,
  ValidationResult,
} from './documentValidation.types';

export {
  MIN_FILE_SIZE,
  MAX_TITLE_LENGTH,
  MIN_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_TAGS_COUNT,
  MAX_TAG_LENGTH,
  MIN_TAG_LENGTH,
  MAX_SHARE_RECIPIENTS,
} from './documentValidation.types';

// ============================================================================
// Re-export File Type Validation
// ============================================================================

export {
  validateFileSize,
  validateFileType,
  validateFileExtensionMatchesMimeType,
  validateFileName,
  validateFile,
} from './documentValidation.fileTypes';

// ============================================================================
// Re-export Security Validation
// ============================================================================

export {
  validateDocumentTitle,
  validateDocumentDescription,
  validateDocumentCategory,
  validateAccessLevel,
  validateDocumentTags,
  validateSignatureData,
  validateSharePermissions,
} from './documentValidation.security';

// ============================================================================
// Re-export Lifecycle Validation
// ============================================================================

export {
  validateDocumentStatus,
  validateStatusTransition,
  validateRetentionDate,
  calculateDefaultRetentionDate,
  categoryRequiresSignature,
} from './documentValidation.lifecycle';

// ============================================================================
// Re-export Operations Validation
// ============================================================================

export {
  validateDocumentCanBeEdited,
  validateDocumentCanBeSigned,
  validateDocumentCanBeDeleted,
} from './documentValidation.operations';

// ============================================================================
// Re-export Schema Validation
// ============================================================================

export {
  validateDocumentCreation,
  validateDocumentUpdate,
} from './documentValidation.schema';

// ============================================================================
// Re-export Helper Functions
// ============================================================================

export {
  formatValidationErrors,
  getFirstErrorMessage,
} from './documentValidation.helpers';
