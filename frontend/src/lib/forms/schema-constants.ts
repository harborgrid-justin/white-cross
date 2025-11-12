/**
 * Schema Validation Constants
 *
 * Healthcare-specific regex patterns and error messages for form validation.
 * Used by schema generation utilities to validate healthcare data types.
 *
 * @module lib/forms/schema-constants
 * @example
 * ```typescript
 * import { PATTERNS, ERROR_MESSAGES } from '@/lib/forms/schema-constants';
 *
 * // Validate SSN format
 * const isValidSSN = PATTERNS.ssn.test('123-45-6789');
 *
 * // Get error message
 * const errorMsg = ERROR_MESSAGES.ssn;
 * ```
 */

/**
 * Healthcare-specific regex patterns
 *
 * Regular expressions for validating common healthcare data formats.
 */
export const PATTERNS = {
  /**
   * Social Security Number
   * Format: 123-45-6789
   */
  ssn: /^\d{3}-\d{2}-\d{4}$/,

  /**
   * Phone Number
   * Formats: (123) 456-7890, 123-456-7890, 1234567890
   */
  phone: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,

  /**
   * Medical Record Number
   * Format: 6-12 alphanumeric characters
   * Note: Varies by institution
   */
  mrn: /^[A-Z0-9]{6,12}$/,

  /**
   * ZIP Code
   * Formats: 12345 or 12345-6789
   */
  zipcode: /^\d{5}(-\d{4})?$/,

  /**
   * URL
   * Format: http:// or https:// followed by domain
   */
  url: /^https?:\/\/.+/,

  /**
   * Email Address
   * Basic email validation pattern
   */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /**
   * ICD-10 Code
   * Format: Letter followed by 2-5 digits with optional decimal
   */
  icd10: /^[A-Z]\d{2}(\.\d{1,3})?$/,

  /**
   * National Drug Code (NDC)
   * Format: 11 digits in 5-4-2 pattern
   */
  ndc: /^\d{5}-\d{4}-\d{2}$/,

  /**
   * National Provider Identifier (NPI)
   * Format: 10 digits
   */
  npi: /^\d{10}$/,
} as const;

/**
 * Validation error messages
 *
 * User-friendly error messages for validation failures.
 * Supports both static messages and message generators for dynamic values.
 */
export const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number (e.g., (555) 123-4567)',
  ssn: 'Please enter a valid SSN (e.g., 123-45-6789)',
  mrn: 'Please enter a valid medical record number',
  zipcode: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)',
  url: 'Please enter a valid URL',
  min: (min: number) => `Minimum value is ${min}`,
  max: (max: number) => `Maximum value is ${max}`,
  minLength: (min: number) => `Minimum length is ${min} characters`,
  maxLength: (max: number) => `Maximum length is ${max} characters`,
  pattern: 'Invalid format',
  icd10: 'Please enter a valid ICD-10 code',
  ndc: 'Please enter a valid NDC code',
  npi: 'Please enter a valid NPI number',
} as const;
