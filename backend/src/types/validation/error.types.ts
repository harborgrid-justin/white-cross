/**
 * Type definitions for validation and error handling
 * Provides strongly-typed error structures
 */

/**
 * Validation error codes for specific error types
 */
export enum ValidationErrorCode {
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_TYPE = 'INVALID_TYPE',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  PATTERN_MISMATCH = 'PATTERN_MISMATCH',
  DUPLICATE_VALUE = 'DUPLICATE_VALUE',
  INVALID_REFERENCE = 'INVALID_REFERENCE',
  CUSTOM = 'CUSTOM'
}

/**
 * Generic validation error with type parameter for the field value
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
 * Field change tracking for audit purposes
 */
export interface FieldChange<T = unknown> {
  field: string;
  oldValue: T;
  newValue: T;
  changedAt: Date;
  changedBy: string;
}

/**
 * Application error interface
 * Standardized error structure for the application
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
 * Database error details
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
 * Error response structure for API responses
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
 * Success response structure for API responses
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  metadata?: Record<string, unknown>;
}

/**
 * API response type (success or error)
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
