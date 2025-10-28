/**
 * @fileoverview Error Response Type Definitions
 * @module common/exceptions/types/error-response
 * @description Type-safe error response interfaces for standardized error handling
 *
 * @security HIPAA-compliant error responses (no PHI exposure)
 * @compliance OWASP error handling standards
 */

/**
 * Standardized error response structure
 *
 * @interface ErrorResponse
 * @description Base error response format for all API errors
 */
export interface ErrorResponse {
  /** Success flag - always false for errors */
  success: false;

  /** ISO timestamp of error occurrence */
  timestamp: string;

  /** Request path that triggered the error */
  path: string;

  /** HTTP method used */
  method: string;

  /** HTTP status code */
  statusCode: number;

  /** Error type/category */
  error: string;

  /** Human-readable error message(s) */
  message: string | string[];

  /** Standardized error code for client handling */
  errorCode: string;

  /** Unique request ID for tracking and correlation */
  requestId: string;

  /** Additional error details (only in development) */
  details?: any;

  /** Stack trace (only in development) */
  stack?: string;
}

/**
 * Validation error detail
 *
 * @interface ValidationErrorDetail
 */
export interface ValidationErrorDetail {
  /** Field name that failed validation */
  field: string;

  /** Validation error message */
  message: string;

  /** Value that failed validation (sanitized) */
  value?: any;

  /** Validation constraint that was violated */
  constraint?: string;

  /** Nested validation errors for complex objects */
  children?: ValidationErrorDetail[];
}

/**
 * Validation error response
 *
 * @interface ValidationErrorResponse
 * @extends {ErrorResponse}
 */
export interface ValidationErrorResponse extends ErrorResponse {
  error: 'Validation Error';
  errorCode: string;
  errors: ValidationErrorDetail[];
}

/**
 * Business logic error response
 *
 * @interface BusinessErrorResponse
 * @extends {ErrorResponse}
 */
export interface BusinessErrorResponse extends ErrorResponse {
  error: 'Business Logic Error';
  errorCode: string;
  /** Business rule that was violated */
  rule?: string;
  /** Contextual data (PHI-free) */
  context?: Record<string, any>;
}

/**
 * Healthcare-specific error response
 *
 * @interface HealthcareErrorResponse
 * @extends {ErrorResponse}
 */
export interface HealthcareErrorResponse extends ErrorResponse {
  error: 'Healthcare Error';
  errorCode: string;
  /** Healthcare domain context */
  domain?: 'clinical' | 'medication' | 'allergy' | 'vaccination' | 'appointment';
  /** Safety level */
  safetyLevel?: 'critical' | 'warning' | 'info';
}

/**
 * Security error response
 *
 * @interface SecurityErrorResponse
 * @extends {ErrorResponse}
 */
export interface SecurityErrorResponse extends ErrorResponse {
  error: 'Security Error';
  errorCode: string;
  /** Security violation type */
  violationType?: 'authentication' | 'authorization' | 'rate_limit' | 'ip_restriction' | 'csrf';
  /** Whether incident was logged */
  incidentLogged: boolean;
}

/**
 * System error response
 *
 * @interface SystemErrorResponse
 * @extends {ErrorResponse}
 */
export interface SystemErrorResponse extends ErrorResponse {
  error: 'System Error';
  errorCode: string;
  /** Whether error is transient (retry may succeed) */
  isTransient?: boolean;
  /** Retry-After header value in seconds */
  retryAfter?: number;
}

/**
 * Error severity levels
 *
 * @enum {string}
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error categories for logging and monitoring
 *
 * @enum {string}
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  BUSINESS = 'business',
  HEALTHCARE = 'healthcare',
  SECURITY = 'security',
  SYSTEM = 'system',
  NETWORK = 'network',
  DATABASE = 'database',
  EXTERNAL = 'external',
}

/**
 * Error logging context
 *
 * @interface ErrorLoggingContext
 */
export interface ErrorLoggingContext {
  /** Error category */
  category: ErrorCategory;

  /** Error severity */
  severity: ErrorSeverity;

  /** User ID (if available) */
  userId?: string;

  /** Organization ID (if available) */
  organizationId?: string;

  /** Request ID for correlation */
  requestId: string;

  /** User agent */
  userAgent?: string;

  /** IP address */
  ipAddress?: string;

  /** Whether error contains PHI */
  containsPHI: boolean;

  /** Additional metadata (PHI-free) */
  metadata?: Record<string, any>;
}
