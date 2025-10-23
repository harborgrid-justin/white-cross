/**
 * @fileoverview Enhanced Error Code System - Structured Error Handling
 * @module shared/errors/ErrorCode
 * @description Berty-inspired structured error codes with wrapping and context
 * 
 * Provides:
 * - Typed error codes for all application errors
 * - Error wrapping to preserve error chains
 * - Context preservation for debugging
 * - Integration with existing ErrorHandlerMiddleware
 * 
 * @see middleware/error-handling/handlers/error-handler.middleware.ts
 * @author White-Cross Platform Team
 * @version 1.0.0
 * @since 2025-10-23
 */

/**
 * Comprehensive error code enumeration
 * Organized by functional domain for easy navigation
 */
export enum ErrorCode {
  // Generic Errors (0-99)
  ErrUndefined = 0,
  ErrInternal = 1,
  ErrInvalidInput = 2,
  ErrNotFound = 3,
  ErrUnauthorized = 4,
  ErrForbidden = 5,
  ErrTimeout = 6,
  ErrConflict = 7,
  ErrNotImplemented = 8,

  // Authentication Errors (100-199)
  ErrAuthInvalidToken = 100,
  ErrAuthExpiredToken = 101,
  ErrAuthInvalidCredentials = 102,
  ErrAuthInsufficientPermissions = 103,
  ErrAuthTokenMissing = 104,
  ErrAuthSessionExpired = 105,
  ErrAuthInvalidSignature = 106,
  ErrAuthMFARequired = 107,
  ErrAuthMFAInvalid = 108,

  // Medication Errors (200-299)
  ErrMedicationNotFound = 200,
  ErrMedicationAlreadyAdministered = 201,
  ErrMedicationExpired = 202,
  ErrMedicationDosageInvalid = 203,
  ErrMedicationInteraction = 204,
  ErrMedicationMissingConsent = 205,
  ErrMedicationScheduleConflict = 206,
  ErrMedicationOutOfStock = 207,
  ErrMedicationInvalidRoute = 208,
  ErrMedicationTimingViolation = 209,

  // Student Errors (300-399)
  ErrStudentNotFound = 300,
  ErrStudentInactive = 301,
  ErrStudentNoConsent = 302,
  ErrStudentDuplicate = 303,
  ErrStudentInvalidGrade = 304,
  ErrStudentMissingGuardian = 305,
  ErrStudentInvalidStatus = 306,

  // Health Record Errors (400-499)
  ErrHealthRecordNotFound = 400,
  ErrHealthRecordInvalid = 401,
  ErrHealthRecordLocked = 402,
  ErrHealthRecordMissingData = 403,
  ErrHealthRecordAccessDenied = 404,
  ErrHealthRecordExpired = 405,

  // Contact Errors (500-599)
  ErrContactNotFound = 500,
  ErrContactDuplicate = 501,
  ErrContactInvalidType = 502,
  ErrContactMissingRequired = 503,
  ErrContactInvalidRelation = 504,

  // Permission Errors (600-699)
  ErrPermissionDenied = 600,
  ErrPermissionNotFound = 601,
  ErrPermissionInvalidScope = 602,
  ErrPermissionExpired = 603,
  ErrPermissionInsufficientRole = 604,

  // Database Errors (700-799)
  ErrDatabaseConnection = 700,
  ErrDatabaseQuery = 701,
  ErrDatabaseConstraint = 702,
  ErrDatabaseTimeout = 703,
  ErrDatabaseLock = 704,
  ErrDatabaseMigration = 705,

  // Validation Errors (800-899)
  ErrValidationFailed = 800,
  ErrValidationMissingField = 801,
  ErrValidationInvalidFormat = 802,
  ErrValidationOutOfRange = 803,
  ErrValidationTooLong = 804,
  ErrValidationTooShort = 805,

  // Network/External Errors (900-999)
  ErrNetworkTimeout = 900,
  ErrNetworkConnection = 901,
  ErrExternalService = 902,
  ErrExternalAPIFailed = 903,
  ErrExternalTimeout = 904,
}

/**
 * Interface for errors that carry error codes
 */
export interface WithCode {
  code: ErrorCode;
  message: string;
  innerError?: Error;
  context?: Record<string, any>;
}

/**
 * Enhanced application error with error codes and context
 * Integrates with existing ErrorHandlerMiddleware
 */
export class AppError extends Error implements WithCode {
  public readonly code: ErrorCode;
  public readonly innerError?: Error;
  public readonly context?: Record<string, any>;
  public readonly timestamp: Date;

  constructor(
    code: ErrorCode,
    message: string,
    innerError?: Error,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.innerError = innerError;
    this.context = context;
    this.timestamp = new Date();

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * Wrap another error with this error code
   */
  wrap(inner: Error, additionalContext?: Record<string, any>): AppError {
    return new AppError(
      this.code,
      this.message,
      inner,
      { ...this.context, ...additionalContext }
    );
  }

  /**
   * Get full error chain
   */
  getErrorChain(): Error[] {
    const chain: Error[] = [this];
    let current: Error | undefined = this.innerError;
    
    while (current) {
      chain.push(current);
      current = (current as any).innerError;
    }
    
    return chain;
  }

  /**
   * Get all error codes in the chain
   */
  getCodes(): ErrorCode[] {
    return this.getErrorChain()
      .filter((err): err is AppError => err instanceof AppError)
      .map(err => err.code);
  }

  /**
   * Check if error chain contains a specific code
   */
  hasCode(code: ErrorCode): boolean {
    return this.getCodes().includes(code);
  }

  /**
   * Convert to JSON for logging/API responses
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      codeName: ErrorCode[this.code],
      message: this.message,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      innerError: this.innerError ? {
        name: this.innerError.name,
        message: this.innerError.message,
      } : undefined,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    };
  }

  /**
   * Get HTTP status code for this error
   */
  getHttpStatus(): number {
    // Map error codes to HTTP status codes
    if (this.code >= 100 && this.code < 200) return 401; // Auth errors
    if (this.code >= 200 && this.code < 300) return 400; // Medication errors (bad request)
    if (this.code >= 300 && this.code < 400) return 404; // Student not found
    if (this.code >= 400 && this.code < 500) return 404; // Health record not found
    if (this.code >= 500 && this.code < 600) return 404; // Contact not found
    if (this.code >= 600 && this.code < 700) return 403; // Permission denied
    if (this.code >= 700 && this.code < 800) return 500; // Database errors
    if (this.code >= 800 && this.code < 900) return 400; // Validation errors
    if (this.code >= 900 && this.code < 1000) return 503; // Network errors
    
    // Generic errors
    switch (this.code) {
      case ErrorCode.ErrUnauthorized:
        return 401;
      case ErrorCode.ErrForbidden:
        return 403;
      case ErrorCode.ErrNotFound:
        return 404;
      case ErrorCode.ErrConflict:
        return 409;
      case ErrorCode.ErrTimeout:
        return 408;
      case ErrorCode.ErrNotImplemented:
        return 501;
      default:
        return 500;
    }
  }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

/**
 * Check if error (or error chain) contains a specific error code
 */
export function hasErrorCode(err: unknown, code: ErrorCode): boolean {
  if (isAppError(err)) {
    return err.hasCode(code);
  }
  return false;
}

/**
 * Get all error codes from an error chain
 */
export function getErrorCodes(err: unknown): ErrorCode[] {
  if (isAppError(err)) {
    return err.getCodes();
  }
  return [];
}

/**
 * Factory functions for common errors
 */
export class ErrorFactory {
  // Authentication errors
  static invalidToken(context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrAuthInvalidToken,
      'Invalid authentication token',
      undefined,
      context
    );
  }

  static expiredToken(context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrAuthExpiredToken,
      'Authentication token has expired',
      undefined,
      context
    );
  }

  static insufficientPermissions(action: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrAuthInsufficientPermissions,
      `Insufficient permissions to ${action}`,
      undefined,
      context
    );
  }

  // Student errors
  static studentNotFound(studentId: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrStudentNotFound,
      `Student with ID ${studentId} not found`,
      undefined,
      { studentId, ...context }
    );
  }

  static studentNoConsent(studentId: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrStudentNoConsent,
      `Student does not have required consent`,
      undefined,
      { studentId, ...context }
    );
  }

  // Medication errors
  static medicationNotFound(medicationId: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrMedicationNotFound,
      `Medication with ID ${medicationId} not found`,
      undefined,
      { medicationId, ...context }
    );
  }

  static medicationAlreadyAdministered(medicationLogId: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrMedicationAlreadyAdministered,
      'Medication has already been administered',
      undefined,
      { medicationLogId, ...context }
    );
  }

  static medicationDosageInvalid(dosage: string, reason: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrMedicationDosageInvalid,
      `Invalid dosage: ${reason}`,
      undefined,
      { dosage, reason, ...context }
    );
  }

  // Health record errors
  static healthRecordNotFound(recordId: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrHealthRecordNotFound,
      `Health record with ID ${recordId} not found`,
      undefined,
      { recordId, ...context }
    );
  }

  static healthRecordLocked(recordId: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrHealthRecordLocked,
      'Health record is locked and cannot be modified',
      undefined,
      { recordId, ...context }
    );
  }

  // Contact errors
  static contactNotFound(contactId: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrContactNotFound,
      `Contact with ID ${contactId} not found`,
      undefined,
      { contactId, ...context }
    );
  }

  // Permission errors
  static permissionDenied(action: string, resource: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrPermissionDenied,
      `Permission denied for action '${action}' on resource '${resource}'`,
      undefined,
      { action, resource, ...context }
    );
  }

  // Validation errors
  static validationFailed(field: string, reason: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrValidationFailed,
      `Validation failed for field '${field}': ${reason}`,
      undefined,
      { field, reason, ...context }
    );
  }

  static missingField(field: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrValidationMissingField,
      `Required field '${field}' is missing`,
      undefined,
      { field, ...context }
    );
  }

  // Database errors
  static databaseError(operation: string, inner: Error, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrDatabaseQuery,
      `Database error during ${operation}`,
      inner,
      { operation, ...context }
    );
  }

  // Generic errors
  static notFound(resource: string, identifier: string, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrNotFound,
      `${resource} with identifier '${identifier}' not found`,
      undefined,
      { resource, identifier, ...context }
    );
  }

  static internalError(message: string, inner?: Error, context?: Record<string, any>): AppError {
    return new AppError(
      ErrorCode.ErrInternal,
      message || 'Internal server error',
      inner,
      context
    );
  }
}

/**
 * Export for backwards compatibility and convenience
 */
export default {
  ErrorCode,
  AppError,
  isAppError,
  hasErrorCode,
  getErrorCodes,
  ErrorFactory,
};
