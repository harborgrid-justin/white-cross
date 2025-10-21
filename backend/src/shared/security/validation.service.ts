/**
 * LOC: VALIDATION_SERVICE_CONSOLIDATED
 * WC-SEC-VAL-001 | Enterprise Validation Service
 *
 * UPSTREAM (imports from):
 *   - joi validation library
 *   - express-validator
 *   - shared utilities
 *
 * DOWNSTREAM (imported by):
 *   - middleware/validation/*
 *   - services/validation/*
 *   - routes/validation/*
 */

/**
 * WC-SEC-VAL-001 | Enterprise Validation Service
 * Purpose: Centralized validation logic, input sanitization, healthcare data validation
 * Upstream: Joi, express-validator, healthcare patterns | Dependencies: Framework-agnostic
 * Downstream: Validation middleware, API routes | Called by: Framework adapters
 * Related: middleware/validation/*, utilities/validation.utils.ts
 * Exports: ValidationService class, healthcare validators | Key Services: Data validation, sanitization
 * Last Updated: 2025-10-21 | Dependencies: Framework-agnostic
 * Critical Path: Input validation → Schema validation → Healthcare compliance → Sanitization
 * LLM Context: Healthcare platform validation, HIPAA compliance, OWASP security
 */

import { logger } from '../logging/logger';

/**
 * Validation rule interface
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
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  code?: string;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: any;
}

/**
 * Validation configuration interface
 */
export interface ValidationConfig {
  enableHipaaCompliance: boolean;
  enableSecurityValidation: boolean;
  logValidationErrors: boolean;
  maxFieldLength: number;
  allowedFileTypes?: readonly string[];
}

/**
 * Healthcare-specific validation patterns
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
 * Enterprise Validation Service
 * 
 * Provides centralized validation logic that can be used across
 * different frameworks and middleware implementations.
 */
export class ValidationService {
  private config: ValidationConfig;

  constructor(config: ValidationConfig = VALIDATION_CONFIGS.healthcare) {
    this.config = config;
  }

  /**
   * Validate data against rules
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
 * Factory function for creating validation service
 */
export function createValidationService(config?: ValidationConfig): ValidationService {
  return new ValidationService(config);
}

/**
 * Create healthcare-specific validation service
 */
export function createHealthcareValidation(): ValidationService {
  return new ValidationService(VALIDATION_CONFIGS.healthcare);
}

/**
 * Create admin-specific validation service
 */
export function createAdminValidation(): ValidationService {
  return new ValidationService(VALIDATION_CONFIGS.admin);
}

/**
 * Default export for convenience
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
