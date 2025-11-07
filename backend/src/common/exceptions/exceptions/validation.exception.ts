/**
 * @fileoverview Validation Exception
 * @module common/exceptions/exceptions/validation
 * @description Custom exception for validation errors
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationErrorCodes, ErrorCode } from '../constants/error-codes';
import { ValidationErrorDetail } from '../types/error-response.types';

/**
 * Validation Exception
 *
 * @class ValidationException
 * @extends {HttpException}
 *
 * @description Exception thrown when validation fails
 *
 * @example
 * throw new ValidationException('Invalid input data', [
 *   { field: 'email', message: 'Invalid email format', value: 'invalid' }
 * ]);
 */
export class ValidationException extends HttpException {
  public readonly errorCode: ErrorCode;
  public readonly errors: ValidationErrorDetail[];

  constructor(
    message: string = 'Validation failed',
    errors: ValidationErrorDetail[] = [],
    errorCode: ErrorCode = ValidationErrorCodes.INVALID_FORMAT,
  ) {
    const response = {
      success: false,
      error: 'Validation Error',
      message,
      errorCode,
      errors,
    };

    super(response, HttpStatus.BAD_REQUEST);

    this.errorCode = errorCode;
    this.errors = errors;
    this.name = 'ValidationException';
  }

  /**
   * Create exception for required field missing
   */
  static requiredFieldMissing(field: string): ValidationException {
    return new ValidationException(
      'Required field missing',
      [{ field, message: `${field} is required` }],
      ValidationErrorCodes.REQUIRED_FIELD_MISSING,
    );
  }

  /**
   * Create exception for invalid format
   */
  static invalidFormat(
    field: string,
    expectedFormat: string,
    value?: any,
  ): ValidationException {
    return new ValidationException(
      'Invalid format',
      [
        {
          field,
          message: `${field} has invalid format. Expected: ${expectedFormat}`,
          value,
        },
      ],
      ValidationErrorCodes.INVALID_FORMAT,
    );
  }

  /**
   * Create exception for invalid type
   */
  static invalidType(
    field: string,
    expectedType: string,
    actualType: string,
  ): ValidationException {
    return new ValidationException(
      'Invalid type',
      [
        {
          field,
          message: `${field} must be ${expectedType}, got ${actualType}`,
        },
      ],
      ValidationErrorCodes.INVALID_TYPE,
    );
  }

  /**
   * Create exception for out of range
   */
  static outOfRange(
    field: string,
    min: number,
    max: number,
    value: number,
  ): ValidationException {
    return new ValidationException(
      'Value out of range',
      [
        {
          field,
          message: `${field} must be between ${min} and ${max}`,
          value,
        },
      ],
      ValidationErrorCodes.OUT_OF_RANGE,
    );
  }

  /**
   * Create exception for invalid length
   */
  static invalidLength(
    field: string,
    min?: number,
    max?: number,
    actualLength?: number,
  ): ValidationException {
    let message = `${field} has invalid length`;
    if (min !== undefined && max !== undefined) {
      message = `${field} must be between ${min} and ${max} characters`;
    } else if (min !== undefined) {
      message = `${field} must be at least ${min} characters`;
    } else if (max !== undefined) {
      message = `${field} must not exceed ${max} characters`;
    }

    return new ValidationException(
      'Invalid length',
      [{ field, message, value: actualLength }],
      ValidationErrorCodes.INVALID_LENGTH,
    );
  }

  /**
   * Create exception for duplicate entry
   */
  static duplicateEntry(field: string, value?: any): ValidationException {
    return new ValidationException(
      'Duplicate entry',
      [
        {
          field,
          message: `${field} already exists`,
          value,
        },
      ],
      ValidationErrorCodes.DUPLICATE_ENTRY,
    );
  }

  /**
   * Create exception from class-validator errors
   */
  static fromClassValidator(errors: any[]): ValidationException {
    const validationErrors: ValidationErrorDetail[] = errors.flatMap(
      (error) => {
        if (error.constraints) {
          return Object.entries(error.constraints).map(
            ([constraint, message]): ValidationErrorDetail => ({
              field: error.property,
              message: String(message),
              value: error.value,
              constraint,
            }),
          );
        }
        return [];
      },
    );

    return new ValidationException('Validation failed', validationErrors);
  }
}
