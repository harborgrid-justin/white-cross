/**
 * Enterprise Validation Decorators
 *
 * Provides comprehensive input validation for methods and controllers
 * with support for custom validation rules, sanitization, and error handling.
 */

import { Injectable, BadRequestException, SetMetadata } from '@nestjs/common';
import { ValidationOptions } from './types';

/**
 * Metadata key for validation configuration
 */
export const VALIDATION_METADATA = 'enterprise:validation';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedData?: any;
}

/**
 * Enterprise validation service
 */
@Injectable()
export class EnterpriseValidationService {
  /**
   * Validate data against a schema
   */
  async validateData(data: any, schema: any, options: ValidationOptions = {}): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    try {
      // Basic validation logic - in real implementation, this would use Joi, Zod, or class-validator
      if (!data) {
        result.isValid = false;
        result.errors.push('Data is required');
        return result;
      }

      // Check for common security issues
      const securityResult = this.validateSecurity(data);
      result.errors.push(...securityResult.errors);
      result.warnings.push(...securityResult.warnings);

      // Schema validation
      if (schema) {
        const schemaResult = await this.validateAgainstSchema(data, schema);
        result.errors.push(...schemaResult.errors);
        result.warnings.push(...schemaResult.warnings);
        result.sanitizedData = schemaResult.sanitizedData;
      }

      result.isValid = result.errors.length === 0;
      return result;
    } catch (error) {
      result.isValid = false;
      result.errors.push(`Validation error: ${error.message}`);
      return result;
    }
  }

  /**
   * Security validation for common vulnerabilities
   */
  private validateSecurity(data: any): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const validateObject = (obj: any, path = '') => {
      if (typeof obj === 'string') {
        // Check for potential XSS
        if (/<script|javascript:|on\w+=/i.test(obj)) {
          errors.push(`Potential XSS detected in ${path}`);
        }

        // Check for SQL injection patterns
        if (/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i.test(obj)) {
          warnings.push(`Potential SQL injection pattern in ${path}`);
        }

        // Check for overly long strings
        if (obj.length > 10000) {
          warnings.push(`Unusually long string in ${path} (${obj.length} characters)`);
        }
      } else if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          validateObject(value, currentPath);
        }
      }
    };

    validateObject(data);
    return { errors, warnings };
  }

  /**
   * Validate against a validation schema
   */
  private async validateAgainstSchema(data: any, schema: any): Promise<ValidationResult> {
    // Placeholder for schema validation - would integrate with Joi, Zod, etc.
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      sanitizedData: data
    };

    // Basic schema validation example
    if (schema.type === 'object' && typeof data !== 'object') {
      result.errors.push('Expected object type');
      result.isValid = false;
    }

    return result;
  }

  /**
   * Sanitize data for safe processing
   */
  sanitizeData(data: any): any {
    if (typeof data === 'string') {
      // Basic HTML sanitization
      return data.replace(/<[^>]*>/g, '').trim();
    } else if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    } else if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value);
      }
      return sanitized;
    }
    return data;
  }
}

/**
 * Method parameter validation decorator
 */
export function ValidateInput(options: ValidationOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const validationService = (this as any).validationService as EnterpriseValidationService;

      // Check if validation should be skipped
      if (options.skipValidation && options.skipValidation({} as any)) {
        return await originalMethod.apply(this, args);
      }

      if (validationService) {
        // Validate each argument
        for (let i = 0; i < args.length; i++) {
          const arg = args[i];
          if (arg && typeof arg === 'object') {
            const validationResult = await validationService.validateData(arg, null, options);

            if (!validationResult.isValid) {
              const errorMessage = options.errorMessages?.[`arg${i}`] ||
                `Validation failed for argument ${i}: ${validationResult.errors.join(', ')}`;
              throw new BadRequestException(errorMessage);
            }

            // Sanitize the argument if validation passed
            if (validationResult.sanitizedData) {
              args[i] = validationResult.sanitizedData;
            }
          }
        }
      }

      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        // Re-throw validation errors as BadRequestException
        if (error instanceof BadRequestException) {
          throw error;
        }

        // Log other errors but don't modify them
        console.warn(`Method execution error in ${methodName}:`, error);
        throw error;
      }
    };

    SetMetadata(VALIDATION_METADATA, options)(target, propertyKey, descriptor);
  };
}

/**
 * Controller-level input validation decorator
 */
export function ValidateController(options: ValidationOptions = {}) {
  return function (target: any) {
    // Store validation configuration on the controller
    SetMetadata(VALIDATION_METADATA, { controller: true, ...options })(target);

    // Could also wrap all methods automatically, but for now just store metadata
  };
}

/**
 * Custom validation rule decorator
 */
export function CustomValidation(rule: (value: any, context?: any) => Promise<boolean> | boolean, errorMessage?: string) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    const existingValidations = Reflect.getMetadata('enterprise:custom-validations', target, propertyKey) || [];
    existingValidations[parameterIndex] = { rule, errorMessage };
    Reflect.defineMetadata('enterprise:custom-validations', existingValidations, target, propertyKey);
  };
}

/**
 * Sanitization decorator
 */
export function SanitizeInput(fields?: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const validationService = (this as any).validationService as EnterpriseValidationService;

      if (validationService) {
        // Sanitize specified fields or all object arguments
        const sanitizedArgs = args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            if (fields) {
              // Sanitize only specified fields
              const sanitized = { ...arg };
              for (const field of fields) {
                if (sanitized[field]) {
                  sanitized[field] = validationService.sanitizeData(sanitized[field]);
                }
              }
              return sanitized;
            } else {
              // Sanitize all fields
              return validationService.sanitizeData(arg);
            }
          }
          return arg;
        });

        return await originalMethod.apply(this, sanitizedArgs);
      }

      return await originalMethod.apply(this, args);
    };
  };
}

/**
 * HIPAA-compliant data validation decorator
 */
export function ValidatePHI(options: {
  allowPHI?: boolean;
  maskFields?: string[];
  auditAccess?: boolean;
} = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      // PHI validation logic would go here
      // This is a placeholder for HIPAA compliance features

      if (!options.allowPHI) {
        // Check if any arguments contain PHI
        for (const arg of args) {
          if (this.containsPHI && this.containsPHI(arg)) {
            throw new BadRequestException('PHI data not allowed in this context');
          }
        }
      }

      const result = await originalMethod.apply(this, args);

      // Mask sensitive fields in response if specified
      if (options.maskFields && result && typeof result === 'object') {
        const maskedResult = { ...result };
        for (const field of options.maskFields) {
          if (maskedResult[field]) {
            maskedResult[field] = '***MASKED***';
          }
        }
        return maskedResult;
      }

      return result;
    };

    SetMetadata('enterprise:phi-validation', options)(target, propertyKey, descriptor);
  };
}