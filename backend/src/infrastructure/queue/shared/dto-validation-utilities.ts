/**
 * @fileoverview Shared DTO Validation Utilities
 * @module infrastructure/queue/shared
 * @description Common validation patterns and utilities for DTOs
 */

import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

/**
 * Common DTO validation utilities
 */
export class DtoValidationUtilities {
  /**
   * Validates a DTO instance and returns formatted errors
   */
  static async validateDto<T extends object>(
    dtoClass: new () => T,
    data: Partial<T>,
  ): Promise<{ isValid: boolean; errors: string[]; dto?: T }> {
    try {
      // Transform plain object to class instance
      const dtoInstance = plainToClass(dtoClass, data, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      // Validate the instance
      const validationErrors = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
      });

      if (validationErrors.length > 0) {
        return {
          isValid: false,
          errors: this.formatValidationErrors(validationErrors),
        };
      }

      return {
        isValid: true,
        errors: [],
        dto: dtoInstance,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation failed: ${(error as Error).message}`],
      };
    }
  }

  /**
   * Formats validation errors into readable strings
   */
  static formatValidationErrors(errors: ValidationError[]): string[] {
    const formattedErrors: string[] = [];

    errors.forEach((error) => {
      if (error.constraints) {
        Object.values(error.constraints).forEach((constraint) => {
          formattedErrors.push(constraint);
        });
      }

      // Handle nested validation errors
      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatValidationErrors(error.children);
        formattedErrors.push(...nestedErrors.map(err => `${error.property}: ${err}`));
      }
    });

    return formattedErrors;
  }

  /**
   * Common validation for BaseQueueJob properties
   */
  static validateBaseJobProperties(data: any): string[] {
    const errors: string[] = [];

    // Validate createdAt
    if (!data.createdAt) {
      errors.push('createdAt is required');
    } else if (!(data.createdAt instanceof Date) && !this.isValidDateString(data.createdAt)) {
      errors.push('createdAt must be a valid date');
    }

    // Validate jobId if present
    if (data.jobId && typeof data.jobId !== 'string') {
      errors.push('jobId must be a string');
    }

    // Validate initiatedBy if present
    if (data.initiatedBy && typeof data.initiatedBy !== 'string') {
      errors.push('initiatedBy must be a string');
    }

    // Validate metadata if present
    if (data.metadata && typeof data.metadata !== 'object') {
      errors.push('metadata must be an object');
    }

    return errors;
  }

  /**
   * Common validation for UUID fields
   */
  static validateUuidField(value: any, fieldName: string): string[] {
    const errors: string[] = [];
    
    if (!value) {
      errors.push(`${fieldName} is required`);
    } else if (typeof value !== 'string') {
      errors.push(`${fieldName} must be a string`);
    } else if (!this.isValidUuid(value)) {
      errors.push(`${fieldName} must be a valid UUID`);
    }

    return errors;
  }

  /**
   * Common validation for string fields with length constraints
   */
  static validateStringField(
    value: any, 
    fieldName: string, 
    options: { required?: boolean; minLength?: number; maxLength?: number } = {}
  ): string[] {
    const errors: string[] = [];
    const { required = true, minLength, maxLength } = options;

    if (!value) {
      if (required) {
        errors.push(`${fieldName} is required`);
      }
      return errors;
    }

    if (typeof value !== 'string') {
      errors.push(`${fieldName} must be a string`);
      return errors;
    }

    if (minLength && value.length < minLength) {
      errors.push(`${fieldName} must be at least ${minLength} characters long`);
    }

    if (maxLength && value.length > maxLength) {
      errors.push(`${fieldName} must be no longer than ${maxLength} characters`);
    }

    return errors;
  }

  /**
   * Common validation for enum fields
   */
  static validateEnumField<T>(
    value: any, 
    fieldName: string, 
    enumObject: T,
    required: boolean = true
  ): string[] {
    const errors: string[] = [];
    
    if (!value) {
      if (required) {
        errors.push(`${fieldName} is required`);
      }
      return errors;
    }

    const enumValues = Object.values(enumObject as any);
    if (!enumValues.includes(value)) {
      errors.push(`${fieldName} must be one of: ${enumValues.join(', ')}`);
    }

    return errors;
  }

  /**
   * Common validation for array fields
   */
  static validateArrayField(
    value: any,
    fieldName: string,
    options: { 
      required?: boolean; 
      minLength?: number; 
      maxLength?: number;
      itemValidator?: (item: any, index: number) => string[];
    } = {}
  ): string[] {
    const errors: string[] = [];
    const { required = true, minLength, maxLength, itemValidator } = options;

    if (!value) {
      if (required) {
        errors.push(`${fieldName} is required`);
      }
      return errors;
    }

    if (!Array.isArray(value)) {
      errors.push(`${fieldName} must be an array`);
      return errors;
    }

    if (minLength && value.length < minLength) {
      errors.push(`${fieldName} must contain at least ${minLength} items`);
    }

    if (maxLength && value.length > maxLength) {
      errors.push(`${fieldName} must contain no more than ${maxLength} items`);
    }

    // Validate individual items if validator is provided
    if (itemValidator) {
      value.forEach((item, index) => {
        const itemErrors = itemValidator(item, index);
        errors.push(...itemErrors.map(err => `${fieldName}[${index}]: ${err}`));
      });
    }

    return errors;
  }

  /**
   * Common validation for number fields
   */
  static validateNumberField(
    value: any,
    fieldName: string,
    options: { 
      required?: boolean; 
      min?: number; 
      max?: number;
      integer?: boolean;
    } = {}
  ): string[] {
    const errors: string[] = [];
    const { required = true, min, max, integer = false } = options;

    if (value === undefined || value === null) {
      if (required) {
        errors.push(`${fieldName} is required`);
      }
      return errors;
    }

    if (typeof value !== 'number' || isNaN(value)) {
      errors.push(`${fieldName} must be a valid number`);
      return errors;
    }

    if (integer && !Number.isInteger(value)) {
      errors.push(`${fieldName} must be an integer`);
    }

    if (min !== undefined && value < min) {
      errors.push(`${fieldName} must be at least ${min}`);
    }

    if (max !== undefined && value > max) {
      errors.push(`${fieldName} must be no more than ${max}`);
    }

    return errors;
  }

  /**
   * Checks if a string is a valid UUID
   */
  private static isValidUuid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Checks if a string is a valid date string
   */
  private static isValidDateString(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * Creates a validation result object
   */
  static createValidationResult<T>(
    isValid: boolean,
    errors: string[],
    dto?: T
  ): { isValid: boolean; errors: string[]; dto?: T } {
    return { isValid, errors, dto };
  }

  /**
   * Combines multiple validation results
   */
  static combineValidationResults(...results: { isValid: boolean; errors: string[] }[]): {
    isValid: boolean;
    errors: string[];
  } {
    const allErrors: string[] = [];
    let allValid = true;

    results.forEach(result => {
      if (!result.isValid) {
        allValid = false;
      }
      allErrors.push(...result.errors);
    });

    return {
      isValid: allValid,
      errors: allErrors,
    };
  }
}
