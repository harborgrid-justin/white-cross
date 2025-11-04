/**
 * WF-COMP-338 | documentValidation.types.ts - Type definitions
 * Purpose: Type definitions and constants for document validation
 * Upstream: ../types/documents | Dependencies: ../types/documents
 * Downstream: Other documentValidation modules | Called by: Validation modules
 * Related: documentValidation modules
 * Exports: types, interfaces, constants | Key Features: Validation types
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Type definitions for validation system
 * LLM Context: Type definitions for document validation, part of React frontend architecture
 */

/**
 * Document Validation Types - Frontend
 * Type definitions and constants for document validation operations
 * Provides shared types across all validation modules
 */

// ============================================================================
// Validation Constants
// ============================================================================

export const MIN_FILE_SIZE = 1024; // 1KB
export const MAX_TITLE_LENGTH = 255;
export const MIN_TITLE_LENGTH = 3;
export const MAX_DESCRIPTION_LENGTH = 5000;
export const MAX_TAGS_COUNT = 10;
export const MAX_TAG_LENGTH = 50;
export const MIN_TAG_LENGTH = 2;
export const MAX_SHARE_RECIPIENTS = 50;

// ============================================================================
// Validation Error Types
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
