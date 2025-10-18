/**
 * WC-GEN-307 | errorHandler.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../logging/logger | Dependencies: sequelize, ../logging/logger
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, constants, functions, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Sequelize Error Handling Utility
 *
 * Provides comprehensive error mapping from Sequelize errors to application-friendly
 * error responses. Maintains HIPAA compliance by sanitizing error messages and
 * preventing PHI leakage in error responses.
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
import { logger } from '../logging/logger';

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
 * Main error handler for Sequelize errors
 * Routes errors to appropriate handlers based on error type
 */
export function handleSequelizeError(error: Error | BaseError): ErrorResponse {
  // Handle Sequelize-specific errors
  if (error instanceof ValidationError) {
    const details: Record<string, string[]> = {};

    if (error.errors && error.errors.length > 0) {
      error.errors.forEach((err) => {
        const fieldName = sanitizeFieldName(err.path || 'unknown');
        if (!details[fieldName]) {
          details[fieldName] = [];
        }

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

  if (error instanceof UniqueConstraintError) {
    const fields = error.fields ? Object.keys(error.fields) : [];
    const fieldNames = fields.map(sanitizeFieldName).join(', ');

    logger.warn('Unique constraint violation:', {
      fields,
      originalError: error.message
    });

    let message = 'A record with this information already exists.';

    if (fields.includes('email')) {
      message = 'A user with this email address already exists.';
    } else if (fields.includes('studentNumber')) {
      message = 'A student with this student number already exists.';
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

  if (error instanceof ForeignKeyConstraintError) {
    logger.warn('Foreign key constraint violation:', {
      originalError: error.message
    });

    return {
      message: 'The referenced record does not exist or cannot be used.',
      code: ErrorCodes.FOREIGN_KEY_CONSTRAINT,
      statusCode: 400
    };
  }

  if (error instanceof EmptyResultError) {
    logger.info('Empty result:', { originalError: error.message });

    return {
      message: 'The requested resource was not found.',
      code: ErrorCodes.RESOURCE_NOT_FOUND,
      statusCode: 404
    };
  }

  if (error instanceof OptimisticLockError) {
    logger.warn('Optimistic lock error:', { originalError: error.message });

    return {
      message: 'This record has been modified by another user. Please refresh and try again.',
      code: ErrorCodes.OPTIMISTIC_LOCK,
      statusCode: 409
    };
  }

  if (error instanceof TimeoutError) {
    logger.error('Database timeout:', { originalError: error.message });

    return {
      message: 'The operation took too long to complete. Please try again.',
      code: ErrorCodes.TIMEOUT_ERROR,
      statusCode: 504
    };
  }

  if (error instanceof ConnectionError) {
    logger.error('Database connection error:', { originalError: error.message });

    return {
      message: 'Unable to connect to the database. Please try again later.',
      code: ErrorCodes.CONNECTION_ERROR,
      statusCode: 503
    };
  }

  if (error instanceof DatabaseError) {
    logger.error('Database error:', {
      message: error.message,
      sql: error.sql
    });

    return {
      message: 'A database error occurred. Please try again later.',
      code: ErrorCodes.DATABASE_ERROR,
      statusCode: 500
    };
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

export default {
  handleSequelizeError,
  createErrorResponse,
  ErrorCodes
};