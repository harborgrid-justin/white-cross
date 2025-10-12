/**
 * Sequelize Error Handling Utility
 *
 * Provides comprehensive error mapping from Sequelize errors to application-friendly
 * error responses. Maintains HIPAA compliance by sanitizing error messages and
 * preventing PHI leakage in error responses.
 *
 * @module utils/sequelizeErrorHandler
 */

import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
  TimeoutError,
  ConnectionError,
  EmptyResultError,
  OptimisticLockError,
  BaseError
} from 'sequelize';
import { logger } from './logger';

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, any>;
}

/**
 * Error codes for consistent error handling across the application
 */
export const ErrorCodes = {
  // Validation Errors (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Conflict Errors (409)
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  UNIQUE_CONSTRAINT: 'UNIQUE_CONSTRAINT',

  // Not Found Errors (404)
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  EMPTY_RESULT: 'EMPTY_RESULT',

  // Foreign Key Errors (400)
  FOREIGN_KEY_CONSTRAINT: 'FOREIGN_KEY_CONSTRAINT',
  INVALID_REFERENCE: 'INVALID_REFERENCE',

  // Database Errors (500)
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',

  // Concurrency Errors (409)
  OPTIMISTIC_LOCK: 'OPTIMISTIC_LOCK',
  CONCURRENT_UPDATE: 'CONCURRENT_UPDATE',

  // General Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

/**
 * Maps Sequelize field names to user-friendly names
 * Helps prevent PHI leakage by providing generic field names
 */
const FIELD_NAME_MAP: Record<string, string> = {
  email: 'email address',
  studentNumber: 'student number',
  medicalRecordNum: 'medical record number',
  phoneNumber: 'phone number',
  licenseNumber: 'license number',
  ssnLast4: 'SSN',
  userId: 'user',
  studentId: 'student',
  medicationId: 'medication',
  nurseId: 'nurse'
};

/**
 * Sanitizes field names to prevent PHI leakage
 */
function sanitizeFieldName(field: string): string {
  return FIELD_NAME_MAP[field] || 'field';
}

/**
 * Sanitizes database error messages to remove sensitive information
 */
function sanitizeErrorMessage(message: string): string {
  // Remove database-specific details that might contain PHI
  return message
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID]')
    .replace(/\b[\w\.-]+@[\w\.-]+\.\w+\b/gi, '[EMAIL]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]')
    .replace(/table "(\w+)"/, 'resource')
    .replace(/column "(\w+)"/, 'field')
    .replace(/key "(\w+)"/, 'constraint');
}

/**
 * Handles Sequelize ValidationError
 * Maps validation errors to user-friendly messages
 */
function handleValidationError(error: ValidationError): ErrorResponse {
  const details: Record<string, string[]> = {};

  if (error.errors && error.errors.length > 0) {
    error.errors.forEach((err) => {
      const fieldName = sanitizeFieldName(err.path || 'unknown');
      if (!details[fieldName]) {
        details[fieldName] = [];
      }

      // Sanitize validation message
      const message = err.message || 'Invalid value';
      details[fieldName].push(sanitizeErrorMessage(message));
    });
  }

  logger.warn('Validation error:', { details, originalError: error.message });

  return {
    message: 'Validation failed. Please check your input and try again.',
    code: ErrorCodes.VALIDATION_ERROR,
    statusCode: 400,
    details
  };
}

/**
 * Handles Sequelize UniqueConstraintError
 * Maps unique constraint violations to user-friendly messages
 */
function handleUniqueConstraintError(error: UniqueConstraintError): ErrorResponse {
  const fields = error.fields ? Object.keys(error.fields) : [];
  const fieldNames = fields.map(sanitizeFieldName).join(', ');

  // Extract table name from parent error if available
  const tableName = (error as any).table || ((error as any).parent?.table) || 'table';

  logger.warn('Unique constraint violation:', {
    fields,
    table: tableName,
    originalError: error.message
  });

  // Generate user-friendly message based on the constraint
  let message = 'A record with this information already exists.';

  if (fields.includes('email')) {
    message = 'A user with this email address already exists.';
  } else if (fields.includes('studentNumber')) {
    message = 'A student with this student number already exists.';
  } else if (fields.includes('medicalRecordNum')) {
    message = 'This medical record number is already in use.';
  } else if (fieldNames) {
    message = `A record with this ${fieldNames} already exists.`;
  }

  return {
    message,
    code: ErrorCodes.UNIQUE_CONSTRAINT,
    statusCode: 409,
    details: { fields: fieldNames }
  };
}

/**
 * Handles Sequelize ForeignKeyConstraintError
 * Maps foreign key violations to user-friendly messages
 */
function handleForeignKeyConstraintError(error: ForeignKeyConstraintError): ErrorResponse {
  // Handle fields which can be string or string[]
  let field: string;
  if (error.fields) {
    if (Array.isArray(error.fields)) {
      field = error.fields.length > 0 ? sanitizeFieldName(error.fields[0]) : 'reference';
    } else if (typeof error.fields === 'string') {
      field = sanitizeFieldName(error.fields);
    } else {
      field = 'reference';
    }
  } else {
    field = 'reference';
  }

  // Extract table name from parent error if available
  const tableName = (error as any).table || ((error as any).parent?.table) || 'table';

  logger.warn('Foreign key constraint violation:', {
    field,
    table: tableName,
    originalError: error.message
  });

  let message = 'The referenced record does not exist or cannot be used.';

  // Provide specific messages for common relationships
  const fieldsArray: string[] = [];
  if (error.fields) {
    if (Array.isArray(error.fields)) {
      fieldsArray.push(...error.fields);
    } else if (typeof error.fields === 'string') {
      fieldsArray.push(error.fields);
    } else if (typeof error.fields === 'object') {
      fieldsArray.push(...Object.keys(error.fields));
    }
  }

  if (fieldsArray.includes('studentId')) {
    message = 'The specified student does not exist.';
  } else if (fieldsArray.includes('userId') || fieldsArray.includes('nurseId')) {
    message = 'The specified user does not exist.';
  } else if (fieldsArray.includes('medicationId')) {
    message = 'The specified medication does not exist.';
  }

  return {
    message,
    code: ErrorCodes.FOREIGN_KEY_CONSTRAINT,
    statusCode: 400,
    details: { field }
  };
}

/**
 * Handles Sequelize EmptyResultError
 * Indicates no records found for the query
 */
function handleEmptyResultError(error: EmptyResultError): ErrorResponse {
  logger.info('Empty result:', { originalError: error.message });

  return {
    message: 'The requested resource was not found.',
    code: ErrorCodes.RESOURCE_NOT_FOUND,
    statusCode: 404
  };
}

/**
 * Handles Sequelize OptimisticLockError
 * Indicates concurrent modification conflict
 */
function handleOptimisticLockError(error: OptimisticLockError): ErrorResponse {
  logger.warn('Optimistic lock error:', { originalError: error.message });

  return {
    message: 'This record has been modified by another user. Please refresh and try again.',
    code: ErrorCodes.OPTIMISTIC_LOCK,
    statusCode: 409
  };
}

/**
 * Handles Sequelize TimeoutError
 * Indicates database operation timeout
 */
function handleTimeoutError(error: TimeoutError): ErrorResponse {
  logger.error('Database timeout:', { originalError: error.message });

  return {
    message: 'The operation took too long to complete. Please try again.',
    code: ErrorCodes.TIMEOUT_ERROR,
    statusCode: 504
  };
}

/**
 * Handles Sequelize ConnectionError
 * Indicates database connection issues
 */
function handleConnectionError(error: ConnectionError): ErrorResponse {
  logger.error('Database connection error:', { originalError: error.message });

  return {
    message: 'Unable to connect to the database. Please try again later.',
    code: ErrorCodes.CONNECTION_ERROR,
    statusCode: 503
  };
}

/**
 * Handles generic Sequelize DatabaseError
 * Catches all other database-related errors
 */
function handleDatabaseError(error: DatabaseError): ErrorResponse {
  logger.error('Database error:', {
    message: error.message,
    sql: error.sql,
    originalError: error.parent?.message
  });

  // Check for specific database error codes
  const pgError = error.parent as any;
  if (pgError?.code) {
    switch (pgError.code) {
      case '23505': // Unique violation
        return {
          message: 'A record with this information already exists.',
          code: ErrorCodes.DUPLICATE_ENTRY,
          statusCode: 409
        };
      case '23503': // Foreign key violation
        return {
          message: 'The referenced record does not exist.',
          code: ErrorCodes.FOREIGN_KEY_CONSTRAINT,
          statusCode: 400
        };
      case '23502': // Not null violation
        return {
          message: 'Required field is missing.',
          code: ErrorCodes.VALIDATION_ERROR,
          statusCode: 400
        };
      case '22P02': // Invalid text representation
        return {
          message: 'Invalid data format provided.',
          code: ErrorCodes.INVALID_INPUT,
          statusCode: 400
        };
    }
  }

  return {
    message: 'A database error occurred. Please try again later.',
    code: ErrorCodes.DATABASE_ERROR,
    statusCode: 500
  };
}

/**
 * Main error handler for Sequelize errors
 * Routes errors to appropriate handlers based on error type
 *
 * @param error - The Sequelize error to handle
 * @returns ErrorResponse object with sanitized error information
 */
export function handleSequelizeError(error: Error | BaseError): ErrorResponse {
  // Handle Sequelize-specific errors
  if (error instanceof ValidationError) {
    return handleValidationError(error);
  }

  if (error instanceof UniqueConstraintError) {
    return handleUniqueConstraintError(error);
  }

  if (error instanceof ForeignKeyConstraintError) {
    return handleForeignKeyConstraintError(error);
  }

  if (error instanceof EmptyResultError) {
    return handleEmptyResultError(error);
  }

  if (error instanceof OptimisticLockError) {
    return handleOptimisticLockError(error);
  }

  if (error instanceof TimeoutError) {
    return handleTimeoutError(error);
  }

  if (error instanceof ConnectionError) {
    return handleConnectionError(error);
  }

  if (error instanceof DatabaseError) {
    return handleDatabaseError(error);
  }

  // Handle application-level errors
  if (error.message) {
    // Check for common application error patterns
    if (error.message.includes('not found')) {
      return {
        message: error.message,
        code: ErrorCodes.RESOURCE_NOT_FOUND,
        statusCode: 404
      };
    }

    if (error.message.includes('already exists')) {
      return {
        message: error.message,
        code: ErrorCodes.DUPLICATE_ENTRY,
        statusCode: 409
      };
    }

    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return {
        message: error.message,
        code: ErrorCodes.INVALID_INPUT,
        statusCode: 400
      };
    }
  }

  // Fallback for unknown errors
  logger.error('Unhandled error:', {
    message: error.message,
    stack: error.stack,
    type: error.constructor.name
  });

  return {
    message: 'An unexpected error occurred. Please try again later.',
    code: ErrorCodes.INTERNAL_ERROR,
    statusCode: 500
  };
}

/**
 * Creates a standardized error response for Hapi handlers
 *
 * @param h - Hapi response toolkit
 * @param error - The error to handle
 * @returns Hapi response object with proper error formatting
 */
export function createErrorResponse(h: any, error: Error | BaseError) {
  const errorResponse = handleSequelizeError(error);

  return h.response({
    success: false,
    error: {
      message: errorResponse.message,
      code: errorResponse.code,
      ...(errorResponse.details && { details: errorResponse.details })
    }
  }).code(errorResponse.statusCode);
}

/**
 * Wraps a handler function with automatic error handling
 * Useful for reducing boilerplate in route handlers
 *
 * @param handler - The handler function to wrap
 * @returns Wrapped handler with automatic error handling
 */
export function withErrorHandling(handler: (request: any, h: any) => Promise<any>) {
  return async (request: any, h: any) => {
    try {
      return await handler(request, h);
    } catch (error) {
      return createErrorResponse(h, error as Error);
    }
  };
}

/**
 * Extracts validation errors from Sequelize ValidationError
 * Returns a map of field names to error messages
 *
 * @param error - ValidationError instance
 * @returns Map of field names to error messages
 */
export function extractValidationErrors(error: ValidationError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  if (error.errors) {
    error.errors.forEach((err) => {
      const field = err.path || 'unknown';
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(err.message);
    });
  }

  return errors;
}

/**
 * Checks if an error is a Sequelize error
 *
 * @param error - Error to check
 * @returns True if error is a Sequelize error
 */
export function isSequelizeError(error: Error): error is BaseError {
  return error instanceof BaseError;
}

/**
 * Checks if an error indicates a resource not found
 *
 * @param error - Error to check
 * @returns True if error indicates resource not found
 */
export function isNotFoundError(error: Error): boolean {
  return (
    error instanceof EmptyResultError ||
    error.message.toLowerCase().includes('not found')
  );
}

/**
 * Checks if an error indicates a unique constraint violation
 *
 * @param error - Error to check
 * @returns True if error indicates unique constraint violation
 */
export function isUniqueConstraintError(error: Error): boolean {
  return (
    error instanceof UniqueConstraintError ||
    error.message.toLowerCase().includes('already exists')
  );
}

/**
 * HIPAA-compliant audit logging for errors
 * Logs errors without exposing PHI
 *
 * @param error - Error to log
 * @param context - Additional context for the error
 */
export function auditLogError(error: Error, context: Record<string, any> = {}) {
  const sanitizedContext = {
    ...context,
    errorType: error.constructor.name,
    errorCode: isSequelizeError(error) ? (error as any).code : undefined,
    timestamp: new Date().toISOString()
  };

  // Remove any potential PHI from context (use type-safe delete)
  const contextWithoutPHI = { ...sanitizedContext };
  if ('email' in contextWithoutPHI) delete contextWithoutPHI.email;
  if ('phone' in contextWithoutPHI) delete contextWithoutPHI.phone;
  if ('ssn' in contextWithoutPHI) delete contextWithoutPHI.ssn;
  if ('medicalRecordNum' in contextWithoutPHI) delete contextWithoutPHI.medicalRecordNum;

  logger.error('Error occurred:', {
    message: sanitizeErrorMessage(error.message),
    context: contextWithoutPHI
  });
}
