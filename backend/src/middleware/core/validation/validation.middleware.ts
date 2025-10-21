/**
 * LOC: WC-MID-VAL-001
 * WC-MID-VAL-001 | Framework-Agnostic Input Validation Middleware
 *
 * UPSTREAM (imports from):
 *   - utils/logger (logging utilities)
 *
 * DOWNSTREAM (imported by):
 *   - adapters/hapi/validation.adapter.ts
 *   - adapters/express/validation.adapter.ts
 */

/**
 * WC-MID-VAL-001 | Framework-Agnostic Input Validation Middleware
 * Purpose: OWASP-compliant input validation, sanitization, and healthcare data validation
 * Upstream: utils/logger, healthcare validation rules, OWASP guidelines
 * Downstream: All API endpoints | Called by: Framework adapters
 * Related: security/headers/*, error-handling/*, healthcare compliance
 * Exports: ValidationMiddleware class, healthcare validators | Key Services: Input validation, data sanitization
 * Last Updated: 2025-10-21 | Dependencies: Framework-agnostic with healthcare focus
 * Critical Path: Request → Schema validation → Data sanitization → Healthcare compliance → Response
 * LLM Context: HIPAA compliance, PHI validation, OWASP input validation
 */

/**
 * Framework-agnostic Input Validation Middleware
 * 
 * This middleware provides framework adapters that use the consolidated
 * validation service from shared/security/validation.service.ts
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
 * Validation Middleware Adapter
 * 
 * This class wraps the consolidated ValidationService to provide
 * middleware-specific functionality while delegating core logic to the service.
 */
export class ValidationMiddleware {
  private validationService: ValidationService;

  constructor(config?: ValidationConfig) {
    this.validationService = createValidationService(config);
  }

  /**
   * Validate data against rules
   * Delegates to validation service and adapts the result format
   */
  async validateData(data: any, rules: ValidationRule[]): Promise<ValidationResult> {
    return await this.validationService.validateData(data, rules);
  }

  /**
   * Utility methods for healthcare validation
   * These delegate to the validation service for consistency
   */
  private isValidEmail(email: string): boolean {
    // Use the same email regex pattern as the validation service
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidDate(date: any): boolean {
    if (date instanceof Date) return !isNaN(date.getTime());
    if (typeof date === 'string') {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }
    return false;
  }

  /**
   * Validate healthcare-specific data
   */
  async validateStudentData(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.student);
  }

  async validateEmergencyContact(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.emergencyContact);
  }

  async validateHealthRecord(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.healthRecord);
  }

  async validateMedication(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.medication);
  }

  async validateAuthData(data: any): Promise<ValidationResult> {
    return this.validateData(data, HEALTHCARE_VALIDATION_RULES.auth);
  }

  /**
   * Factory methods
   */
  static create(config?: ValidationConfig): ValidationMiddleware {
    return new ValidationMiddleware(config);
  }
}

/**
 * Factory functions
 */
export function createValidationMiddleware(config?: ValidationConfig): ValidationMiddleware {
  return ValidationMiddleware.create(config);
}

export function createHealthcareValidationMiddleware(): ValidationMiddleware {
  return new ValidationMiddleware(VALIDATION_CONFIGS.healthcare);
}

export function createAdminValidationMiddleware(): ValidationMiddleware {
  return new ValidationMiddleware(VALIDATION_CONFIGS.admin);
}

/**
 * Default export
 */
export default ValidationMiddleware;
