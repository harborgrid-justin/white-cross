/**
 * Validation Exception Filter - Field-Level Error Handling
 *
 * Specialized exception filter for handling validation errors from class-validator.
 * Transforms validation errors into consistent, user-friendly error responses with
 * detailed field-level error information.
 *
 * Features:
 * - Field-level error messages
 * - Constraint violation details
 * - Nested object validation support
 * - Array validation support
 * - User-friendly error descriptions
 * - Developer-friendly constraint names
 * - OpenAPI-compatible error responses
 *
 * @module filters/validation-exception
 * @version 1.0.0
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Field-level validation error detail
 */
export interface FieldValidationError {
  /** Field name that failed validation */
  field: string;
  /** Value that was submitted (sanitized) */
  value: any;
  /** Human-readable error messages */
  messages: string[];
  /** Constraint names that failed */
  constraints: string[];
  /** Nested field errors (for objects and arrays) */
  children?: FieldValidationError[];
}

/**
 * Validation error response structure
 */
export interface ValidationErrorResponse {
  /** Always false for error responses */
  success: false;
  /** HTTP status code (always 400 for validation errors) */
  statusCode: 400;
  /** Error type */
  error: 'ValidationError';
  /** Summary message */
  message: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Request path */
  path: string;
  /** HTTP method */
  method: string;
  /** Correlation ID for tracking */
  correlationId: string;
  /** Detailed field-level errors */
  errors: FieldValidationError[];
  /** Total number of validation errors */
  errorCount: number;
}

/**
 * Constraint message mapping for user-friendly errors
 */
const CONSTRAINT_MESSAGES: Record<string, (field: string, value?: any) => string> = {
  isNotEmpty: (field) => `${field} is required and cannot be empty`,
  isString: (field) => `${field} must be a text value`,
  isNumber: (field) => `${field} must be a number`,
  isInt: (field) => `${field} must be an integer`,
  isBoolean: (field) => `${field} must be true or false`,
  isArray: (field) => `${field} must be an array`,
  isEmail: (field) => `${field} must be a valid email address`,
  isUrl: (field) => `${field} must be a valid URL`,
  isUUID: (field) => `${field} must be a valid UUID`,
  isDate: (field) => `${field} must be a valid date`,
  isEnum: (field, value) => `${field} must be one of the allowed values`,
  min: (field, value) => `${field} must be at least ${value}`,
  max: (field, value) => `${field} must be at most ${value}`,
  minLength: (field, value) => `${field} must be at least ${value} characters long`,
  maxLength: (field, value) => `${field} must be at most ${value} characters long`,
  matches: (field) => `${field} has an invalid format`,
  arrayMinSize: (field, value) => `${field} must contain at least ${value} items`,
  arrayMaxSize: (field, value) => `${field} must contain at most ${value} items`,
  isPositive: (field) => `${field} must be a positive number`,
  isNegative: (field) => `${field} must be a negative number`,
  length: (field, value) => `${field} must be exactly ${value} characters long`,
};

// ============================================================================
// Validation Exception Filter Implementation
// ============================================================================

/**
 * Catches and formats validation errors from class-validator and BadRequestException.
 * Provides detailed field-level error information for client debugging and user feedback.
 *
 * @example
 * ```typescript
 * // In main.ts
 * app.useGlobalFilters(
 *   new GlobalExceptionFilter(),
 *   new ValidationExceptionFilter()
 * );
 * ```
 *
 * @example
 * ```typescript
 * // On specific controller
 * @UseFilters(ValidationExceptionFilter)
 * @Controller('threats')
 * export class ThreatController { ... }
 * ```
 */
@Catch(ValidationError, BadRequestException)
@Injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  /**
   * Main exception handling method
   */
  catch(exception: ValidationError | BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Extract validation errors
    const fieldErrors = this.extractValidationErrors(exception);

    // Generate correlation ID
    const correlationId = this.getCorrelationId(request);

    // Build validation error response
    const errorResponse: ValidationErrorResponse = {
      success: false,
      statusCode: 400,
      error: 'ValidationError',
      message: this.buildSummaryMessage(fieldErrors),
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      correlationId,
      errors: fieldErrors,
      errorCount: this.countTotalErrors(fieldErrors),
    };

    // Log validation error
    this.logValidationError(request, errorResponse);

    // Send response
    response.status(400).json(errorResponse);
  }

  /**
   * Extract validation errors from exception
   */
  private extractValidationErrors(
    exception: ValidationError | BadRequestException,
  ): FieldValidationError[] {
    // Handle class-validator ValidationError
    if (exception instanceof ValidationError) {
      return this.transformValidationError(exception);
    }

    // Handle BadRequestException with validation errors
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();

      // Check if it contains validation errors from ValidationPipe
      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        const message = (exceptionResponse as any).message;

        // If message is an array of ValidationErrors
        if (Array.isArray(message) && message[0] instanceof ValidationError) {
          return message.map((error) => this.transformValidationError(error)).flat();
        }

        // If message is an array of strings
        if (Array.isArray(message)) {
          return message.map((msg, index) => ({
            field: `field${index}`,
            value: null,
            messages: [msg],
            constraints: ['unknown'],
          }));
        }

        // If message is a single string
        if (typeof message === 'string') {
          return [
            {
              field: 'request',
              value: null,
              messages: [message],
              constraints: ['validation'],
            },
          ];
        }
      }
    }

    // Fallback for unknown validation error format
    return [
      {
        field: 'unknown',
        value: null,
        messages: ['Validation failed'],
        constraints: ['unknown'],
      },
    ];
  }

  /**
   * Transform class-validator ValidationError to FieldValidationError
   */
  private transformValidationError(error: ValidationError): FieldValidationError[] {
    const fieldError: FieldValidationError = {
      field: error.property,
      value: this.sanitizeValue(error.value),
      messages: this.buildUserFriendlyMessages(error),
      constraints: error.constraints ? Object.keys(error.constraints) : [],
    };

    // Handle nested validation errors
    if (error.children && error.children.length > 0) {
      fieldError.children = error.children
        .map((child) => this.transformValidationError(child))
        .flat();
    }

    return [fieldError];
  }

  /**
   * Build user-friendly error messages from validation constraints
   */
  private buildUserFriendlyMessages(error: ValidationError): string[] {
    if (!error.constraints) {
      return ['Validation failed'];
    }

    const messages: string[] = [];

    for (const [constraintName, constraintMessage] of Object.entries(error.constraints)) {
      // Use custom constraint message if available
      if (constraintMessage) {
        messages.push(constraintMessage);
        continue;
      }

      // Use predefined constraint message mapping
      const messageBuilder = CONSTRAINT_MESSAGES[constraintName];
      if (messageBuilder) {
        messages.push(messageBuilder(this.formatFieldName(error.property), error.value));
      } else {
        // Fallback to constraint name
        messages.push(`${this.formatFieldName(error.property)} failed ${constraintName} validation`);
      }
    }

    return messages;
  }

  /**
   * Format field name to be more readable
   */
  private formatFieldName(fieldName: string): string {
    // Convert camelCase to Title Case with spaces
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Build summary message from field errors
   */
  private buildSummaryMessage(fieldErrors: FieldValidationError[]): string {
    const errorCount = this.countTotalErrors(fieldErrors);

    if (errorCount === 1) {
      return 'Validation failed: 1 error found';
    }

    return `Validation failed: ${errorCount} errors found`;
  }

  /**
   * Count total validation errors including nested errors
   */
  private countTotalErrors(fieldErrors: FieldValidationError[]): number {
    let count = 0;

    for (const error of fieldErrors) {
      count += error.messages.length;

      if (error.children) {
        count += this.countTotalErrors(error.children);
      }
    }

    return count;
  }

  /**
   * Sanitize field value to prevent sensitive data leakage
   */
  private sanitizeValue(value: any): any {
    // Don't return values for sensitive fields
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /apikey/i,
      /api_key/i,
      /ssn/i,
      /credit[-_]?card/i,
    ];

    const valueString = String(value || '');
    for (const pattern of sensitivePatterns) {
      if (pattern.test(valueString)) {
        return '[REDACTED]';
      }
    }

    // Truncate long values
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...';
    }

    // Limit array size
    if (Array.isArray(value) && value.length > 10) {
      return [...value.slice(0, 10), `... (${value.length - 10} more items)`];
    }

    return value;
  }

  /**
   * Get or generate correlation ID
   */
  private getCorrelationId(request: Request): string {
    return (
      (request.headers['x-correlation-id'] as string) ||
      (request as any).correlationId ||
      `val-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    );
  }

  /**
   * Log validation error
   */
  private logValidationError(request: Request, errorResponse: ValidationErrorResponse): void {
    const fieldList = errorResponse.errors.map((e) => e.field).join(', ');

    this.logger.warn(
      `[${errorResponse.correlationId}] Validation failed: ${request.method} ${request.url} - ` +
        `${errorResponse.errorCount} errors in fields: ${fieldList}`,
      {
        correlationId: errorResponse.correlationId,
        method: request.method,
        url: request.url,
        errorCount: errorResponse.errorCount,
        fields: fieldList,
        userAgent: request.headers['user-agent'],
        ip: request.ip,
      },
    );
  }
}
