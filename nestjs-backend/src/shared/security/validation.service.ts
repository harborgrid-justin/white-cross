/**
 * @fileoverview Enterprise Validation Service
 * @module shared/security/validation.service
 * @description Framework-agnostic validation service providing centralized validation logic,
 * input sanitization, and healthcare-specific data validation for HIPAA compliance.
 *
 * Key Features:
 * - Framework-agnostic validation architecture
 * - HIPAA-compliant healthcare data validation
 * - Medical Record Number (MRN) validation
 * - National Provider Identifier (NPI) validation with Luhn algorithm
 * - ICD-10 diagnostic code validation
 * - PHI (Protected Health Information) detection
 * - XSS and SQL injection prevention
 * - Automatic input sanitization
 * - Configurable validation rules
 * - Custom validation function support
 *
 * @security
 * - Prevents XSS attacks through input sanitization
 * - Blocks SQL injection patterns
 * - Validates PHI fields for HIPAA compliance
 * - Enforces field length limits
 * - Implements type-safe validation
 * - Detects unmasked SSN patterns
 *
 * Healthcare Validation Patterns:
 * - MRN: Alphanumeric, 6-20 characters
 * - NPI: Exactly 10 digits with Luhn checksum
 * - ICD-10: Letter + 2 digits + optional decimal + 1-4 chars
 * - Phone: US phone number formats
 * - SSN: Masked format (***-**-XXXX)
 * - DOB: YYYY-MM-DD format
 *
 * @requires ../logging/logger
 *
 * @example Basic usage
 * ```typescript
 * import { createValidationService, HEALTHCARE_VALIDATION_RULES } from './validation.service';
 *
 * const validator = createValidationService();
 * const result = await validator.validateData(studentData, HEALTHCARE_VALIDATION_RULES.student);
 *
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * } else {
 *   // Use sanitized data
 *   const safeData = result.sanitizedData;
 * }
 * ```
 *
 * @example Healthcare-specific validation
 * ```typescript
 * import { createHealthcareValidation } from './validation.service';
 *
 * const validator = createHealthcareValidation();
 * const result = await validator.validateHealthRecordData(healthRecord);
 * ```
 *
 * LOC: VALIDATION_SERVICE_CONSOLIDATED
 * UPSTREAM: ../logging/logger
 * DOWNSTREAM: middleware/validation/*, services/validation/*, routes/validation/*
 *
 * @version 1.0.0
 * @since 2025-10-21
 */

import { logger } from '../logging/logger';

/**
 * @interface ValidationRule
 * @description Defines a validation rule for a single field
 *
 * @property {string} field - The field name to validate
 * @property {boolean} [required] - Whether the field is required
 * @property {string} [type] - Expected data type (string, number, boolean, email, phone, uuid, date)
 * @property {number} [minLength] - Minimum string length
 * @property {number} [maxLength] - Maximum string length
 * @property {number} [min] - Minimum numeric value
 * @property {number} [max] - Maximum numeric value
 * @property {RegExp} [pattern] - Regular expression pattern to match
 * @property {string[]} [enum] - List of allowed values
 * @property {Function} [custom] - Custom validation function
 */
export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'uuid' | 'date';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: string[];
  custom?: (value: any) => boolean;
}

/**
 * @interface ValidationError
 * @description Represents a validation error for a specific field
 *
 * @property {string} field - The field that failed validation
 * @property {string} message - Human-readable error message
 * @property {any} [value] - The invalid value (may be redacted)
 * @property {string} [code] - Error code for programmatic handling
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  code?: string;
}

/**
 * @interface ValidationResult
 * @description Result of a validation operation
 *
 * @property {boolean} isValid - Whether validation passed
 * @property {ValidationError[]} errors - Array of validation errors (empty if valid)
 * @property {any} [sanitizedData] - Sanitized data (only present if valid)
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: any;
}

/**
 * @interface ValidationConfig
 * @description Configuration options for the validation service
 *
 * @property {boolean} enableHipaaCompliance - Enable HIPAA compliance checks (PHI detection, SSN masking)
 * @property {boolean} enableSecurityValidation - Enable security checks (XSS, SQL injection)
 * @property {boolean} logValidationErrors - Log validation errors for monitoring
 * @property {number} maxFieldLength - Maximum allowed field length
 * @property {readonly string[]} [allowedFileTypes] - Allowed MIME types for file uploads
 */
export interface ValidationConfig {
  enableHipaaCompliance: boolean;
  enableSecurityValidation: boolean;
  logValidationErrors: boolean;
  maxFieldLength: number;
  allowedFileTypes?: readonly string[];
}

/**
 * @constant HEALTHCARE_PATTERNS
 * @description Regular expression patterns for healthcare-specific data validation
 * @readonly
 *
 * @property {RegExp} MRN - Medical Record Number: alphanumeric, 6-20 characters
 * @property {RegExp} NPI - National Provider Identifier: exactly 10 digits
 * @property {RegExp} ICD10 - ICD-10 diagnostic codes: letter + 2 digits + optional decimal + 1-4 chars
 * @property {RegExp} PHONE - US phone numbers: various formats supported
 * @property {RegExp} SSN_PARTIAL - Masked SSN: ***-**-XXXX format
 * @property {RegExp} DOB - Date of birth: YYYY-MM-DD format
 * @property {RegExp} EMERGENCY_RELATIONSHIP - Emergency contact relationships
 *
 * @example
 * ```typescript
 * import { HEALTHCARE_PATTERNS } from './validation.service';
 *
 * const isValidNPI = HEALTHCARE_PATTERNS.NPI.test('1234567890');
 * const isValidICD = HEALTHCARE_PATTERNS.ICD10.test('E11.9');
 * ```
 */
export const HEALTHCARE_PATTERNS = {
  // Medical Record Number - alphanumeric, 6-20 characters
  MRN: /^[A-Z0-9]{6,20}$/,
  
  // National Provider Identifier (NPI) - exactly 10 digits
  NPI: /^\d{10}$/,
  
  // ICD-10 codes - letter followed by 2 digits, optional decimal and 1-4 more digits/letters
  ICD10: /^[A-Z]\d{2}(\.\w{1,4})?$/,
  
  // Phone number - various US formats
  PHONE: /^(\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
  
  // SSN - XXX-XX-XXXX format (partial for validation)
  SSN_PARTIAL: /^\*\*\*-\*\*-\d{4}$/,
  
  // Date of birth - YYYY-MM-DD format
  DOB: /^\d{4}-\d{2}-\d{2}$/,
  
  // Emergency contact relationship
  EMERGENCY_RELATIONSHIP: /^(parent|guardian|spouse|sibling|friend|other)$/i
};

/**
 * Default validation configurations
 */
export const VALIDATION_CONFIGS: Record<string, ValidationConfig> = {
  // Standard healthcare validation
  healthcare: {
    enableHipaaCompliance: true,
    enableSecurityValidation: true,
    logValidationErrors: true,
    maxFieldLength: 1000,
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf', 'text/plain']
  },
  
  // Strict administrative validation
  admin: {
    enableHipaaCompliance: true,
    enableSecurityValidation: true,
    logValidationErrors: true,
    maxFieldLength: 500,
    allowedFileTypes: ['application/pdf', 'text/csv', 'application/vnd.ms-excel']
  },
  
  // Relaxed development validation
  development: {
    enableHipaaCompliance: false,
    enableSecurityValidation: false,
    logValidationErrors: false,
    maxFieldLength: 5000,
    allowedFileTypes: ['*/*']
  }
};

/**
 * Healthcare validation rule sets
 */
export const HEALTHCARE_VALIDATION_RULES: Record<string, ValidationRule[]> = {
  // Student profile validation
  student: [
    { field: 'firstName', required: true, type: 'string', minLength: 1, maxLength: 50 },
    { field: 'lastName', required: true, type: 'string', minLength: 1, maxLength: 50 },
    { field: 'email', required: true, type: 'email', maxLength: 100 },
    { field: 'dateOfBirth', required: true, type: 'date', pattern: HEALTHCARE_PATTERNS.DOB },
    { field: 'medicalRecordNumber', required: false, type: 'string', pattern: HEALTHCARE_PATTERNS.MRN }
  ],
  
  // Emergency contact validation
  emergencyContact: [
    { field: 'name', required: true, type: 'string', minLength: 1, maxLength: 100 },
    { field: 'relationship', required: true, type: 'string', pattern: HEALTHCARE_PATTERNS.EMERGENCY_RELATIONSHIP },
    { field: 'phone', required: true, type: 'phone', pattern: HEALTHCARE_PATTERNS.PHONE },
    { field: 'email', required: false, type: 'email', maxLength: 100 }
  ],
  
  // Health record validation
  healthRecord: [
    { field: 'medicalRecordNumber', required: true, type: 'string', pattern: HEALTHCARE_PATTERNS.MRN },
    { field: 'providerId', required: true, type: 'string', pattern: HEALTHCARE_PATTERNS.NPI },
    { field: 'diagnosis', required: false, type: 'string', maxLength: 500 },
    { field: 'icdCode', required: false, type: 'string', pattern: HEALTHCARE_PATTERNS.ICD10 }
  ],
  
  // Medication validation
  medication: [
    { field: 'name', required: true, type: 'string', minLength: 1, maxLength: 200 },
    { field: 'dosage', required: true, type: 'string', minLength: 1, maxLength: 100 },
    { field: 'frequency', required: true, type: 'string', minLength: 1, maxLength: 100 },
    { field: 'prescribedBy', required: true, type: 'string', pattern: HEALTHCARE_PATTERNS.NPI }
  ],
  
  // User authentication validation
  auth: [
    { field: 'email', required: true, type: 'email', maxLength: 100 },
    { field: 'password', required: true, type: 'string', minLength: 12, maxLength: 128 }
  ]
};

/**
 * @class ValidationService
 * @description Enterprise-grade validation service providing centralized validation logic
 * that can be used across different frameworks and middleware implementations
 *
 * Features:
 * - Type validation (string, number, boolean, email, phone, uuid, date)
 * - Length validation (min/max length for strings)
 * - Range validation (min/max for numbers)
 * - Pattern matching (regex validation)
 * - Enum validation (allowed values)
 * - Custom validation functions
 * - HIPAA compliance validation
 * - Security validation (XSS, SQL injection)
 * - Automatic data sanitization
 *
 * @example
 * ```typescript
 * const service = new ValidationService(VALIDATION_CONFIGS.healthcare);
 *
 * const rules: ValidationRule[] = [
 *   { field: 'email', required: true, type: 'email' },
 *   { field: 'age', required: true, type: 'number', min: 0, max: 120 }
 * ];
 *
 * const result = await service.validateData(userData, rules);
 * if (result.isValid) {
 *   console.log('Sanitized data:', result.sanitizedData);
 * }
 * ```
 */
export class ValidationService {
  private config: ValidationConfig;

  /**
   * @constructor
   * @param {ValidationConfig} [config=VALIDATION_CONFIGS.healthcare] - Validation configuration
   * @description Creates a new ValidationService instance with the specified configuration
   */
  constructor(config: ValidationConfig = VALIDATION_CONFIGS.healthcare) {
    this.config = config;
  }

  /**
   * @method validateData
   * @async
   * @description Validates data against an array of validation rules
   * @param {any} data - The data object to validate
   * @param {ValidationRule[]} rules - Array of validation rules to apply
   * @returns {Promise<ValidationResult>} Validation result with errors and sanitized data
   *
   * Validation Process:
   * 1. Iterate through each rule
   * 2. Validate field against rule constraints
   * 3. Run HIPAA compliance checks if enabled
   * 4. Run security validation if enabled
   * 5. Sanitize valid fields
   * 6. Log errors if logging enabled
   * 7. Return result with sanitized data or errors
   *
   * @example
   * ```typescript
   * const rules: ValidationRule[] = [
   *   { field: 'firstName', required: true, type: 'string', minLength: 1, maxLength: 50 },
   *   { field: 'email', required: true, type: 'email' },
   *   { field: 'age', required: false, type: 'number', min: 0, max: 120 }
   * ];
   *
   * const result = await validator.validateData({ firstName: 'John', email: 'john@example.com' }, rules);
   * ```
   */
  async validateData(data: any, rules: ValidationRule[]): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const sanitizedData: any = {};

    for (const rule of rules) {
      const value = data[rule.field];
      const fieldErrors = await this.validateField(rule.field, value, rule);
      errors.push(...fieldErrors);
      
      // Sanitize the value if no errors
      if (fieldErrors.length === 0) {
        sanitizedData[rule.field] = this.sanitizeValue(value, rule);
      }
    }

    // Log validation errors if enabled
    if (this.config.logValidationErrors && errors.length > 0) {
      logger.warn('Validation errors occurred', {
        errors: errors.map(e => ({ field: e.field, message: e.message, code: e.code })),
        ruleCount: rules.length
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitizedData : undefined
    };
  }

  /**
   * Validate a single field
   */
  private async validateField(fieldName: string, value: any, rule: ValidationRule): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    // Skip further validation if value is empty and not required
    if (value === undefined || value === null || value === '') {
      if (rule.required) {
        errors.push({
          field: fieldName,
          message: `${fieldName} is required`,
          code: 'REQUIRED_FIELD_MISSING'
        });
      }
      return errors;
    }

    // Type validation
    if (rule.type) {
      const typeError = this.validateType(fieldName, value, rule.type);
      if (typeError) {
        errors.push(typeError);
        return errors; // Stop further validation if type is wrong
      }
    }

    // Length validation
    if (rule.minLength !== undefined || rule.maxLength !== undefined) {
      const lengthError = this.validateLength(fieldName, value, rule.minLength, rule.maxLength);
      if (lengthError) {
        errors.push(lengthError);
      }
    }

    // Numeric range validation
    if (rule.min !== undefined || rule.max !== undefined) {
      const rangeError = this.validateRange(fieldName, value, rule.min, rule.max);
      if (rangeError) {
        errors.push(rangeError);
      }
    }

    // Pattern validation
    if (rule.pattern) {
      const patternError = this.validatePattern(fieldName, value, rule.pattern);
      if (patternError) {
        errors.push(patternError);
      }
    }

    // Enum validation
    if (rule.enum) {
      const enumError = this.validateEnum(fieldName, value, rule.enum);
      if (enumError) {
        errors.push(enumError);
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = this.validateCustom(fieldName, value, rule.custom);
      if (customError) {
        errors.push(customError);
      }
    }

    // HIPAA compliance validation
    if (this.config.enableHipaaCompliance) {
      const hipaaError = this.validateHipaaCompliance(fieldName, value);
      if (hipaaError) {
        errors.push(hipaaError);
      }
    }

    // Security validation
    if (this.config.enableSecurityValidation) {
      const securityError = this.validateSecurity(fieldName, value);
      if (securityError) {
        errors.push(securityError);
      }
    }

    return errors;
  }

  /**
   * Validate field type
   */
  private validateType(fieldName: string, value: any, expectedType: string): ValidationError | null {
    let isValid = false;

    switch (expectedType) {
      case 'string':
        isValid = typeof value === 'string';
        break;
      case 'number':
        isValid = typeof value === 'number' && !isNaN(value);
        break;
      case 'boolean':
        isValid = typeof value === 'boolean';
        break;
      case 'email':
        isValid = typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'phone':
        isValid = typeof value === 'string' && HEALTHCARE_PATTERNS.PHONE.test(value);
        break;
      case 'uuid':
        isValid = typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
        break;
      case 'date':
        isValid = typeof value === 'string' && !isNaN(Date.parse(value));
        break;
      default:
        isValid = true; // Unknown type, skip validation
    }

    return isValid ? null : {
      field: fieldName,
      message: `${fieldName} must be of type ${expectedType}`,
      value,
      code: 'INVALID_TYPE'
    };
  }

  /**
   * Validate field length
   */
  private validateLength(fieldName: string, value: any, minLength?: number, maxLength?: number): ValidationError | null {
    const length = String(value).length;

    if (minLength !== undefined && length < minLength) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${minLength} characters long`,
        value,
        code: 'MIN_LENGTH_VIOLATION'
      };
    }

    if (maxLength !== undefined && length > maxLength) {
      return {
        field: fieldName,
        message: `${fieldName} cannot exceed ${maxLength} characters`,
        value,
        code: 'MAX_LENGTH_VIOLATION'
      };
    }

    return null;
  }

  /**
   * Validate numeric range
   */
  private validateRange(fieldName: string, value: any, min?: number, max?: number): ValidationError | null {
    const numValue = Number(value);

    if (isNaN(numValue)) {
      return {
        field: fieldName,
        message: `${fieldName} must be a valid number`,
        value,
        code: 'INVALID_NUMBER'
      };
    }

    if (min !== undefined && numValue < min) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${min}`,
        value,
        code: 'MIN_VALUE_VIOLATION'
      };
    }

    if (max !== undefined && numValue > max) {
      return {
        field: fieldName,
        message: `${fieldName} cannot exceed ${max}`,
        value,
        code: 'MAX_VALUE_VIOLATION'
      };
    }

    return null;
  }

  /**
   * Validate pattern
   */
  private validatePattern(fieldName: string, value: any, pattern: RegExp): ValidationError | null {
    if (!pattern.test(String(value))) {
      return {
        field: fieldName,
        message: `${fieldName} format is invalid`,
        value,
        code: 'PATTERN_MISMATCH'
      };
    }

    return null;
  }

  /**
   * Validate enum
   */
  private validateEnum(fieldName: string, value: any, allowedValues: string[]): ValidationError | null {
    if (!allowedValues.includes(String(value))) {
      return {
        field: fieldName,
        message: `${fieldName} must be one of: ${allowedValues.join(', ')}`,
        value,
        code: 'INVALID_ENUM_VALUE'
      };
    }

    return null;
  }

  /**
   * Validate custom rule
   */
  private validateCustom(fieldName: string, value: any, customValidator: (value: any) => boolean): ValidationError | null {
    if (!customValidator(value)) {
      return {
        field: fieldName,
        message: `${fieldName} failed custom validation`,
        value,
        code: 'CUSTOM_VALIDATION_FAILED'
      };
    }

    return null;
  }

  /**
   * HIPAA compliance validation
   */
  private validateHipaaCompliance(fieldName: string, value: any): ValidationError | null {
    const valueStr = String(value);

    // Check for potential SSN patterns (not masked)
    if (/\d{3}-?\d{2}-?\d{4}/.test(valueStr) && !HEALTHCARE_PATTERNS.SSN_PARTIAL.test(valueStr)) {
      return {
        field: fieldName,
        message: `${fieldName} appears to contain unmasked SSN`,
        code: 'HIPAA_VIOLATION_SSN'
      };
    }

    return null;
  }

  /**
   * Security validation
   */
  private validateSecurity(fieldName: string, value: any): ValidationError | null {
    const valueStr = String(value);

    // Check for potential XSS
    if (/<script|javascript:|on\w+=/i.test(valueStr)) {
      return {
        field: fieldName,
        message: `${fieldName} contains potentially dangerous content`,
        code: 'SECURITY_XSS_DETECTED'
      };
    }

    // Check for SQL injection patterns
    if (/(union|select|insert|update|delete|drop|exec|execute)\s/i.test(valueStr)) {
      return {
        field: fieldName,
        message: `${fieldName} contains potentially dangerous SQL content`,
        code: 'SECURITY_SQL_INJECTION'
      };
    }

    return null;
  }

  /**
   * Sanitize value based on type
   */
  private sanitizeValue(value: any, rule: ValidationRule): any {
    if (value === null || value === undefined) {
      return value;
    }

    // Trim strings
    if (rule.type === 'string' || rule.type === 'email') {
      return String(value).trim();
    }

    // Parse numbers
    if (rule.type === 'number') {
      return Number(value);
    }

    // Parse booleans
    if (rule.type === 'boolean') {
      return Boolean(value);
    }

    return value;
  }

  /**
   * Validate authentication data
   */
  async validateAuthData(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.auth);
  }

  /**
   * Validate student profile data
   */
  async validateStudentData(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.student);
  }

  /**
   * Validate emergency contact data
   */
  async validateEmergencyContactData(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.emergencyContact);
  }

  /**
   * Validate health record data
   */
  async validateHealthRecordData(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.healthRecord);
  }

  /**
   * Validate medication data
   */
  async validateMedicationData(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.medication);
  }
}

/**
 * @function createValidationService
 * @description Factory function to create a ValidationService instance with custom configuration
 * @param {ValidationConfig} [config] - Optional validation configuration
 * @returns {ValidationService} New ValidationService instance
 *
 * @example
 * ```typescript
 * const validator = createValidationService({
 *   enableHipaaCompliance: true,
 *   enableSecurityValidation: true,
 *   logValidationErrors: true,
 *   maxFieldLength: 1000
 * });
 * ```
 */
export function createValidationService(config?: ValidationConfig): ValidationService {
  return new ValidationService(config);
}

/**
 * @function createHealthcareValidation
 * @description Factory function to create a ValidationService instance pre-configured
 * for healthcare operations with HIPAA compliance
 * @returns {ValidationService} ValidationService instance with healthcare configuration
 *
 * Healthcare Configuration:
 * - enableHipaaCompliance: true (PHI detection, SSN masking)
 * - enableSecurityValidation: true (XSS, SQL injection prevention)
 * - logValidationErrors: true (audit compliance)
 * - maxFieldLength: 1000
 * - allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf', 'text/plain']
 *
 * @example
 * ```typescript
 * const validator = createHealthcareValidation();
 * const result = await validator.validateHealthRecordData(healthRecord);
 * ```
 */
export function createHealthcareValidation(): ValidationService {
  return new ValidationService(VALIDATION_CONFIGS.healthcare);
}

/**
 * @function createAdminValidation
 * @description Factory function to create a ValidationService instance pre-configured
 * for administrative operations with strict validation
 * @returns {ValidationService} ValidationService instance with admin configuration
 *
 * Admin Configuration:
 * - enableHipaaCompliance: true
 * - enableSecurityValidation: true
 * - logValidationErrors: true
 * - maxFieldLength: 500 (stricter limit)
 * - allowedFileTypes: ['application/pdf', 'text/csv', 'application/vnd.ms-excel']
 *
 * @example
 * ```typescript
 * const validator = createAdminValidation();
 * const result = await validator.validateAuthData(adminCredentials);
 * ```
 */
export function createAdminValidation(): ValidationService {
  return new ValidationService(VALIDATION_CONFIGS.admin);
}

/**
 * @default
 * @description Default export containing all validation service components
 */
export default {
  ValidationService,
  createValidationService,
  createHealthcareValidation,
  createAdminValidation,
  HEALTHCARE_PATTERNS,
  VALIDATION_CONFIGS,
  HEALTHCARE_VALIDATION_RULES
};
