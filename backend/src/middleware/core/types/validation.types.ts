/**
 * @fileoverview Validation Type Definitions for NestJS
 * @module middleware/core/types/validation
 * @description Type-safe validation types and patterns for healthcare data.
 * Migrated from backend/src/middleware/core/validation/validation.middleware.ts
 *
 * @security OWASP-compliant validation patterns
 * @compliance HIPAA - Healthcare data validation
 */

/**
 * Healthcare-specific validation patterns
 *
 * @constant HEALTHCARE_PATTERNS
 * @readonly
 *
 * @description Regular expression patterns for healthcare data validation.
 * All patterns are HIPAA-compliant and follow industry standards.
 */
export const HEALTHCARE_PATTERNS = {
  // Medical Record Number (MRN) - alphanumeric, 6-12 characters
  MRN: /^[A-Z0-9]{6,12}$/,

  // National Provider Identifier (NPI) - 10 digits
  NPI: /^\d{10}$/,

  // ICD-10 Code - alphanumeric with dots, 3-7 characters
  ICD10: /^[A-Z]\d{2}(\.\d{1,4})?$/,

  // Phone number - US format with optional extensions
  PHONE: /^(\+1[-.\s]?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}(\s?(ext|x)\s?\d{1,5})?$/i,

  // Email - RFC 5322 compliant
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Date - ISO 8601 format (YYYY-MM-DD)
  DATE: /^\d{4}-\d{2}-\d{2}$/,

  // Time - 24-hour format (HH:MM or HH:MM:SS)
  TIME: /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,

  // SSN - with or without dashes
  SSN: /^\d{3}-?\d{2}-?\d{4}$/,

  // Medication dosage
  DOSAGE: /^\d+(\.\d+)?\s?(mg|mcg|g|ml|L|IU|units?)$/i,

  // Alphanumeric with spaces and basic punctuation
  ALPHANUMERIC_EXTENDED: /^[a-zA-Z0-9\s\-.,()]+$/
};

/**
 * Validation error detail
 *
 * @interface ValidationErrorDetail
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
  constraint?: string;
}

/**
 * Validation result
 *
 * @interface ValidationResult
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationErrorDetail[];
  sanitizedData?: any;
}

/**
 * Validation configuration
 *
 * @interface ValidationConfig
 */
export interface ValidationConfig {
  enableHipaaCompliance?: boolean;
  enableSecurityValidation?: boolean;
  logValidationErrors?: boolean;
  maxFieldLength?: number;
  allowedFileTypes?: string[];
}

/**
 * Default validation configurations
 *
 * @constant VALIDATION_CONFIGS
 */
export const VALIDATION_CONFIGS = {
  healthcare: {
    enableHipaaCompliance: true,
    enableSecurityValidation: true,
    logValidationErrors: true,
    maxFieldLength: 1000,
    allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
  } as ValidationConfig,

  admin: {
    enableHipaaCompliance: true,
    enableSecurityValidation: true,
    logValidationErrors: true,
    maxFieldLength: 500,
    allowedFileTypes: ['pdf', 'csv', 'xlsx']
  } as ValidationConfig,

  public: {
    enableHipaaCompliance: false,
    enableSecurityValidation: true,
    logValidationErrors: false,
    maxFieldLength: 200,
    allowedFileTypes: ['jpg', 'jpeg', 'png']
  } as ValidationConfig
};
