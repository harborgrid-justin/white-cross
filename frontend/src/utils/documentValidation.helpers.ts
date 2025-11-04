/**
 * WF-COMP-338 | documentValidation.helpers.ts - Helper utilities
 * Purpose: Helper functions for validation result formatting
 * Upstream: ./documentValidation.types | Dependencies: Validation types
 * Downstream: documentValidation.ts | Called by: UI components
 * Related: All documentValidation modules
 * Exports: helper functions | Key Features: Error formatting, message extraction
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Validation result → Formatting → UI display
 * LLM Context: Helper utilities for validation result processing
 */

/**
 * Validation Helper Functions - Frontend
 * Utility functions for working with validation results
 * Provides formatting and extraction helpers
 */

import { ValidationError } from './documentValidation.types';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map(error => error.message).join(', ');
}

/**
 * Gets first validation error message
 */
export function getFirstErrorMessage(errors: ValidationError[]): string {
  return errors.length > 0 ? errors[0].message : '';
}
