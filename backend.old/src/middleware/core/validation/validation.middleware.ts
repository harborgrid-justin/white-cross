/**
 * @fileoverview Framework-Agnostic Input Validation Middleware
 * @module middleware/core/validation/validation.middleware
 * @description Enterprise-grade validation middleware providing OWASP-compliant input validation,
 * sanitization, and healthcare-specific data validation for HIPAA compliance.
 *
 * Key Features:
 * - Framework-agnostic validation architecture
 * - OWASP input validation standards
 * - HIPAA-compliant healthcare data validation
 * - PHI (Protected Health Information) validation
 * - Medical record number (MRN) validation
 * - NPI (National Provider Identifier) validation
 * - ICD-10 code validation
 * - XSS and SQL injection prevention
 * - Automatic data sanitization
 *
 * @security
 * - Prevents XSS attacks through input sanitization
 * - Blocks SQL injection attempts
 * - Validates PHI fields for HIPAA compliance
 * - Enforces field length limits to prevent buffer overflow
 * - Implements whitelist-based validation
 *
 * @requires ../../../shared/security/validation.service
 *
 * @example Usage in Hapi.js
 * ```typescript
 * import { createHealthcareValidationMiddleware } from './validation.middleware';
 *
 * const validator = createHealthcareValidationMiddleware();
 *
 * // In route handler
 * const result = await validator.validateStudentData(request.payload);
 * if (!result.isValid) {
 *   return Boom.badRequest('Validation failed', result.errors);
 * }
 * ```
 *
 * @example Usage in Express.js
 * ```typescript
 * import { ValidationMiddleware } from './validation.middleware';
 *
 * const validator = new ValidationMiddleware(VALIDATION_CONFIGS.healthcare);
 *
 * app.post('/api/students', async (req, res, next) => {
 *   const result = await validator.validateStudentData(req.body);
 *   if (!result.isValid) {
 *     return res.status(400).json({ errors: result.errors });
 *   }
 *   next();
 * });
 * ```
 *
 * LOC: WC-MID-VAL-001
 * UPSTREAM: shared/security/validation.service
 * DOWNSTREAM: adapters/hapi/validation.adapter, adapters/express/validation.adapter
 *
 * @version 1.0.0
 * @since 2025-10-21
 */

import {
  ValidationService,
  createValidationService,
  HEALTHCARE_PATTERNS,
  VALIDATION_CONFIGS,
  HEALTHCARE_VALIDATION_RULES,
  type ValidationRule,
  type ValidationError,
  type ValidationResult,
  type ValidationConfig
} from '../../../shared/security/validation.service';

// Re-export types and constants for convenience
export type {
  ValidationRule,
  ValidationError,
  ValidationResult,
  ValidationConfig
};

export {
  HEALTHCARE_PATTERNS,
  VALIDATION_CONFIGS,
  HEALTHCARE_VALIDATION_RULES
};

/**
 * @class ValidationMiddleware
 * @description Framework-agnostic validation middleware adapter that wraps the consolidated
 * ValidationService to provide middleware-specific functionality.
 *
 * This class serves as an adapter layer between the framework-agnostic validation service
 * and framework-specific middleware implementations (Hapi, Express, etc.).
 *
 * @implements Framework-agnostic validation interface
 *
 * @example
 * ```typescript
 * const validator = new ValidationMiddleware(VALIDATION_CONFIGS.healthcare);
 * const result = await validator.validateStudentData(studentData);
 * ```
 */
export class ValidationMiddleware {
  private validationService: ValidationService;

  /**
   * @constructor
   * @param {ValidationConfig} [config] - Optional validation configuration
   * @description Creates a new ValidationMiddleware instance with the specified configuration.
   * If no configuration is provided, uses the default healthcare configuration.
   */
  constructor(config?: ValidationConfig) {
    this.validationService = createValidationService(config);
  }

  /**
   * @method validateData
   * @description Validates data against a set of validation rules
   * @param {any} data - The data object to validate
   * @param {ValidationRule[]} rules - Array of validation rules to apply
   * @returns {Promise<ValidationResult>} Validation result with errors and sanitized data
   *
   * @example
   * ```typescript
   * const rules: ValidationRule[] = [
   *   { field: 'email', required: true, type: 'email' },
   *   { field: 'age', required: true, type: 'number', min: 0, max: 120 }
   * ];
   * const result = await validator.validateData(userData, rules);
   * if (!result.isValid) {
   *   console.error('Validation errors:', result.errors);
   * }
   * ```
   */
  async validateData(data: any, rules: ValidationRule[]): Promise<ValidationResult> {
    return await this.validationService.validateData(data, rules);
  }

  /**
   * @private
   * @method isValidEmail
   * @description Validates email address format using RFC 5322 compliant regex
   * @param {string} email - Email address to validate
   * @returns {boolean} True if email is valid, false otherwise
   */
  private isValidEmail(email: string): boolean {
    // Use the same email regex pattern as the validation service
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * @private
   * @method isValidDate
   * @description Validates date format and ensures it represents a valid date
   * @param {any} date - Date to validate (Date object or string)
   * @returns {boolean} True if date is valid, false otherwise
   */
  private isValidDate(date: any): boolean {
    if (date instanceof Date) return !isNaN(date.getTime());
    if (typeof date === 'string') {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }
    return false;
  }

  /**
   * @method validateStudentData
   * @description Validates student profile data against healthcare compliance rules
   * @param {any} data - Student data object to validate
   * @returns {Promise<ValidationResult>} Validation result with errors and sanitized data
   *
   * @throws {ValidationError} If required fields are missing or invalid
   *
   * @example
   * ```typescript
   * const studentData = {
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   email: 'john.doe@example.com',
   *   dateOfBirth: '2010-05-15',
   *   medicalRecordNumber: 'MRN123456'
   * };
   * const result = await validator.validateStudentData(studentData);
   * ```
   *
   * @see HEALTHCARE_VALIDATION_RULES.student for complete validation rules
   */
  async validateStudentData(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.student);
  }

  /**
   * @method validateEmergencyContact
   * @description Validates emergency contact data for HIPAA compliance
   * @param {any} data - Emergency contact data object to validate
   * @returns {Promise<ValidationResult>} Validation result with errors and sanitized data
   *
   * @example
   * ```typescript
   * const contactData = {
   *   name: 'Jane Doe',
   *   relationship: 'parent',
   *   phone: '555-123-4567',
   *   email: 'jane.doe@example.com'
   * };
   * const result = await validator.validateEmergencyContact(contactData);
   * ```
   *
   * @see HEALTHCARE_VALIDATION_RULES.emergencyContact for complete validation rules
   */
  async validateEmergencyContact(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.emergencyContact);
  }

  /**
   * @method validateHealthRecord
   * @description Validates health record data including MRN, NPI, and ICD-10 codes
   * @param {any} data - Health record data object to validate
   * @returns {Promise<ValidationResult>} Validation result with errors and sanitized data
   *
   * @security Validates PHI fields for HIPAA compliance
   *
   * @example
   * ```typescript
   * const healthRecord = {
   *   medicalRecordNumber: 'MRN123456',
   *   providerId: '1234567890',  // NPI
   *   diagnosis: 'Type 2 Diabetes',
   *   icdCode: 'E11.9'
   * };
   * const result = await validator.validateHealthRecord(healthRecord);
   * ```
   *
   * @see HEALTHCARE_VALIDATION_RULES.healthRecord for complete validation rules
   */
  async validateHealthRecord(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.healthRecord);
  }

  /**
   * @method validateMedication
   * @description Validates medication data including dosage and prescriber NPI
   * @param {any} data - Medication data object to validate
   * @returns {Promise<ValidationResult>} Validation result with errors and sanitized data
   *
   * @example
   * ```typescript
   * const medication = {
   *   name: 'Metformin',
   *   dosage: '500mg',
   *   frequency: 'twice daily',
   *   prescribedBy: '1234567890'  // NPI
   * };
   * const result = await validator.validateMedication(medication);
   * ```
   *
   * @see HEALTHCARE_VALIDATION_RULES.medication for complete validation rules
   */
  async validateMedication(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.medication);
  }

  /**
   * @method validateAuthData
   * @description Validates authentication data including email and password strength
   * @param {any} data - Authentication data object to validate
   * @returns {Promise<ValidationResult>} Validation result with errors and sanitized data
   *
   * @security Enforces minimum password length of 12 characters
   *
   * @example
   * ```typescript
   * const authData = {
   *   email: 'user@example.com',
   *   password: 'SecureP@ssw0rd123'
   * };
   * const result = await validator.validateAuthData(authData);
   * ```
   *
   * @see HEALTHCARE_VALIDATION_RULES.auth for complete validation rules
   */
  async validateAuthData(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.auth);
  }

  /**
   * @static
   * @method create
   * @description Factory method to create a new ValidationMiddleware instance
   * @param {ValidationConfig} [config] - Optional validation configuration
   * @returns {ValidationMiddleware} New ValidationMiddleware instance
   *
   * @example
   * ```typescript
   * const validator = ValidationMiddleware.create(VALIDATION_CONFIGS.healthcare);
   * ```
   */
  static create(config?: ValidationConfig): ValidationMiddleware {
    return new ValidationMiddleware(config);
  }
}

/**
 * @function createValidationMiddleware
 * @description Factory function to create a new ValidationMiddleware instance
 * @param {ValidationConfig} [config] - Optional validation configuration
 * @returns {ValidationMiddleware} New ValidationMiddleware instance
 *
 * @example
 * ```typescript
 * const validator = createValidationMiddleware({
 *   enableHipaaCompliance: true,
 *   enableSecurityValidation: true,
 *   logValidationErrors: true,
 *   maxFieldLength: 1000
 * });
 * ```
 */
export function createValidationMiddleware(config?: ValidationConfig): ValidationMiddleware {
  return ValidationMiddleware.create(config);
}

/**
 * @function createHealthcareValidationMiddleware
 * @description Factory function to create a ValidationMiddleware instance configured
 * for healthcare operations with HIPAA compliance enabled
 * @returns {ValidationMiddleware} ValidationMiddleware instance with healthcare configuration
 *
 * @security Enables HIPAA compliance, PHI detection, and security validation
 *
 * @example
 * ```typescript
 * const validator = createHealthcareValidationMiddleware();
 * const result = await validator.validateHealthRecord(healthRecordData);
 * ```
 */
export function createHealthcareValidationMiddleware(): ValidationMiddleware {
  return new ValidationMiddleware(VALIDATION_CONFIGS.healthcare);
}

/**
 * @function createAdminValidationMiddleware
 * @description Factory function to create a ValidationMiddleware instance configured
 * for administrative operations with strict validation rules
 * @returns {ValidationMiddleware} ValidationMiddleware instance with admin configuration
 *
 * @security Enforces stricter field length limits (500 chars) and restricted file types
 *
 * @example
 * ```typescript
 * const validator = createAdminValidationMiddleware();
 * const result = await validator.validateAuthData(adminLoginData);
 * ```
 */
export function createAdminValidationMiddleware(): ValidationMiddleware {
  return new ValidationMiddleware(VALIDATION_CONFIGS.admin);
}

/**
 * Default export
 * @default ValidationMiddleware
 */
export default ValidationMiddleware;
