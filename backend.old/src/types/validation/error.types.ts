/**
 * Type definitions for validation and error handling
 * Provides strongly-typed error structures
 */

/**
 * Validation error codes for specific error types.
 * Standardized error codes for client-side error handling and i18n.
 *
 * @enum {string}
 *
 * @example
 * ```typescript
 * const error: ValidationError = {
 *   field: 'age',
 *   message: 'Age must be between 0 and 120',
 *   code: ValidationErrorCode.OUT_OF_RANGE,
 *   value: 150
 * };
 * ```
 */
export enum ValidationErrorCode {
  /** Required field is missing */
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  /** Value is required */
  REQUIRED = 'REQUIRED',
  /** Value format is invalid (e.g., email, phone) */
  INVALID_FORMAT = 'INVALID_FORMAT',
  /** Value type doesn't match expected type */
  INVALID_TYPE = 'INVALID_TYPE',
  /** Value is not in acceptable set */
  INVALID_VALUE = 'INVALID_VALUE',
  /** Numeric value outside acceptable range */
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  /** String too short */
  TOO_SHORT = 'TOO_SHORT',
  /** String too long */
  TOO_LONG = 'TOO_LONG',
  /** Number too small */
  TOO_SMALL = 'TOO_SMALL',
  /** Number too large */
  TOO_LARGE = 'TOO_LARGE',
  /** Value is not an integer when required */
  NOT_INTEGER = 'NOT_INTEGER',
  /** Value doesn't match regex pattern */
  PATTERN_MISMATCH = 'PATTERN_MISMATCH',
  /** Duplicate value where uniqueness required */
  DUPLICATE_VALUE = 'DUPLICATE_VALUE',
  /** Duplicate items in array */
  DUPLICATE_ITEMS = 'DUPLICATE_ITEMS',
  /** Referenced entity doesn't exist */
  INVALID_REFERENCE = 'INVALID_REFERENCE',
  /** Format is unusual but not strictly invalid */
  UNUSUAL_FORMAT = 'UNUSUAL_FORMAT',
  /** Custom validation error */
  CUSTOM = 'CUSTOM'
}

/**
 * Generic validation error with type parameter for the field value.
 * Represents a single field validation failure.
 *
 * @template T - Type of the invalid field value
 *
 * @interface ValidationError
 * @property {string} field - Field name that failed validation
 * @property {string} message - Human-readable error message
 * @property {ValidationErrorCode} code - Standardized error code
 * @property {T} [value] - The invalid value that was provided
 * @property {string} [constraint] - Constraint that was violated (e.g., "min: 0")
 * @property {string} [expected] - Expected value or format description
 *
 * @example
 * ```typescript
 * const emailError: ValidationError<string> = {
 *   field: 'email',
 *   message: 'Must be a valid email address',
 *   code: ValidationErrorCode.INVALID_FORMAT,
 *   value: 'not-an-email',
 *   expected: 'user@example.com format'
 * };
 * ```
 */
export interface ValidationError<T = unknown> {
  field: string;
  message: string;
  code: ValidationErrorCode;
  value?: T;
  constraint?: string;
  expected?: string;
}

/**
 * Field change tracking for audit purposes.
 * Records before/after values for data modification auditing.
 *
 * @template T - Type of the field value
 *
 * @interface FieldChange
 * @property {string} field - Name of the changed field
 * @property {T} oldValue - Value before change
 * @property {T} newValue - Value after change
 * @property {Date} changedAt - Timestamp of change
 * @property {string} changedBy - User ID who made the change
 *
 * @remarks
 * Used for HIPAA audit logging of PHI modifications.
 */
export interface FieldChange<T = unknown> {
  field: string;
  oldValue: T;
  newValue: T;
  changedAt: Date;
  changedBy: string;
}

/**
 * Application error interface.
 * Standardized error structure for all application errors.
 *
 * @interface ApplicationError
 * @property {string} name - Error class name (e.g., 'ValidationError')
 * @property {string} message - Human-readable error message
 * @property {string} [stack] - Error stack trace (development only)
 * @property {string} code - Application error code for programmatic handling
 * @property {number} statusCode - HTTP status code for API responses
 * @property {Record<string, unknown>} [details] - Additional error context
 * @property {Date} [timestamp] - When error occurred
 * @property {string} [requestId] - Request ID for error tracking
 *
 * @remarks
 * Base interface for all typed error classes. Specific error types extend this.
 */
export interface ApplicationError {
  name: string;
  message: string;
  stack?: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp?: Date;
  requestId?: string;
}

/**
 * Database error details.
 * Extends ApplicationError with database-specific context.
 *
 * @interface DatabaseError
 * @extends ApplicationError
 * @property {'DatabaseError'} name - Error type discriminator
 * @property {string} [query] - SQL query that failed (sanitized)
 * @property {unknown[]} [parameters] - Query parameters (sanitized)
 * @property {string} [constraint] - Database constraint that was violated
 * @property {string} [table] - Database table involved in error
 */
export interface DatabaseError extends ApplicationError {
  name: 'DatabaseError';
  query?: string;
  parameters?: unknown[];
  constraint?: string;
  table?: string;
}

/**
 * Validation error details (collection of field errors)
 */
export interface ValidationErrorDetails extends ApplicationError {
  name: 'ValidationError';
  errors: ValidationError[];
}

/**
 * Authentication error details
 */
export interface AuthenticationError extends ApplicationError {
  name: 'AuthenticationError';
  reason: 'invalid_credentials' | 'token_expired' | 'token_invalid' | 'unauthorized';
}

/**
 * Authorization error details
 */
export interface AuthorizationError extends ApplicationError {
  name: 'AuthorizationError';
  requiredPermissions?: string[];
  userPermissions?: string[];
  resource?: string;
  action?: string;
}

/**
 * Not found error details
 */
export interface NotFoundError extends ApplicationError {
  name: 'NotFoundError';
  resource: string;
  identifier: string | number;
}

/**
 * Sequelize validation error structure
 */
export interface SequelizeValidationErrorItem {
  message: string;
  type: string;
  path: string;
  value?: unknown;
  origin?: string;
  validatorKey?: string;
  validatorName?: string;
  validatorArgs?: unknown[];
}

/**
 * Error metadata for logging
 */
export interface ErrorMetadata {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  timestamp?: Date;
  additionalContext?: Record<string, unknown>;
}

/**
 * Error response structure for API responses.
 * Standardized error format returned to clients.
 *
 * @interface ErrorResponse
 * @property {false} success - Always false for error responses
 * @property {string} error - Error type/category
 * @property {string} message - Human-readable error description
 * @property {string} [code] - Application error code
 * @property {number} [statusCode] - HTTP status code
 * @property {Record<string, unknown>} [details] - Additional error details
 * @property {string} timestamp - ISO timestamp of error
 * @property {string} [requestId] - Request ID for error tracking
 *
 * @example
 * ```typescript
 * const errorResponse: ErrorResponse = {
 *   success: false,
 *   error: 'ValidationError',
 *   message: 'Invalid input data',
 *   code: 'VALIDATION_FAILED',
 *   statusCode: 400,
 *   timestamp: new Date().toISOString()
 * };
 * ```
 */
export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
}

/**
 * Success response structure for API responses.
 * Standardized success format returned to clients.
 *
 * @template T - Type of the response data
 *
 * @interface SuccessResponse
 * @property {true} success - Always true for success responses
 * @property {T} data - Response payload data
 * @property {string} [message] - Optional success message
 * @property {Record<string, unknown>} [metadata] - Additional response metadata
 *
 * @example
 * ```typescript
 * const userResponse: SuccessResponse<User> = {
 *   success: true,
 *   data: {
 *     id: '123',
 *     email: 'nurse@school.edu',
 *     role: 'nurse'
 *   },
 *   message: 'User retrieved successfully'
 * };
 * ```
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  metadata?: Record<string, unknown>;
}

/**
 * API response type (success or error).
 * Discriminated union for type-safe response handling.
 *
 * @template T - Type of success response data
 * @typedef {SuccessResponse<T> | ErrorResponse} ApiResponse
 *
 * @example
 * ```typescript
 * function handleResponse<T>(response: ApiResponse<T>) {
 *   if (response.success) {
 *     console.log(response.data); // TypeScript knows this exists
 *   } else {
 *     console.error(response.error); // TypeScript knows this exists
 *   }
 * }
 * ```
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
