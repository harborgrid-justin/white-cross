/**
 * WF-CONST-001 | errors.ts - Error Constants and User Message Utilities
 * Purpose: Centralized error code definitions and user-friendly message generation
 * Dependencies: None (standalone constants module)
 * Exports: ERROR_CODES, getUserMessage, getErrorTitle, ERROR_MESSAGES
 * Features: HIPAA-compliant messaging, multi-category error codes, localization-ready
 * Last Updated: 2025-10-27
 * Agent: Core Config/Constants Architect
 *
 * Error Categories:
 * - AUTHENTICATION: Login, session, token errors
 * - AUTHORIZATION: Permission, access control errors
 * - VALIDATION: Input validation, data format errors
 * - NETWORK: Connection, timeout, offline errors
 * - SERVER: Backend failures, database errors
 * - CLIENT: Frontend logic errors
 * - RESOURCE: Not found, conflict, gone errors
 * - RATE_LIMIT: Too many requests
 * - PHI: HIPAA-specific data access errors
 *
 * HIPAA Compliance:
 * - No PHI data in error messages
 * - Generic messages for sensitive operations
 * - Audit-friendly error codes
 * - Role-appropriate error detail levels
 */

/**
 * Comprehensive error codes for the healthcare platform
 *
 * Error Code Format: CATEGORY_SPECIFIC_DESCRIPTION
 * - Categories: AUTH, VALIDATION, NETWORK, SERVER, CLIENT, RESOURCE, RATE, PHI
 * - Codes are hierarchical for easy filtering and logging
 * - Each code maps to a user-friendly message
 *
 * Usage:
 * ```typescript
 * throw new Error(ERROR_CODES.AUTH_SESSION_EXPIRED);
 * // Later: getUserMessage(ERROR_CODES.AUTH_SESSION_EXPIRED)
 * ```
 *
 * @constant
 */
export const ERROR_CODES = {
  // ============================================================================
  // AUTHENTICATION ERRORS (AUTH_*)
  // ============================================================================
  /** User credentials are invalid */
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  /** Authentication token is missing */
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  /** Authentication token is invalid or malformed */
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  /** Authentication token has expired */
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  /** User session has expired */
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  /** Multi-factor authentication is required */
  AUTH_MFA_REQUIRED: 'AUTH_MFA_REQUIRED',
  /** Multi-factor authentication code is invalid */
  AUTH_MFA_INVALID: 'AUTH_MFA_INVALID',
  /** Account is locked due to too many failed attempts */
  AUTH_ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',
  /** Account is disabled or deactivated */
  AUTH_ACCOUNT_DISABLED: 'AUTH_ACCOUNT_DISABLED',
  /** Password reset is required */
  AUTH_PASSWORD_RESET_REQUIRED: 'AUTH_PASSWORD_RESET_REQUIRED',
  /** Email verification is required */
  AUTH_EMAIL_VERIFICATION_REQUIRED: 'AUTH_EMAIL_VERIFICATION_REQUIRED',

  // ============================================================================
  // AUTHORIZATION ERRORS (AUTHZ_*)
  // ============================================================================
  /** User lacks permission for this action */
  AUTHZ_INSUFFICIENT_PERMISSIONS: 'AUTHZ_INSUFFICIENT_PERMISSIONS',
  /** User role does not allow this operation */
  AUTHZ_ROLE_NOT_ALLOWED: 'AUTHZ_ROLE_NOT_ALLOWED',
  /** Access to this resource is forbidden */
  AUTHZ_RESOURCE_FORBIDDEN: 'AUTHZ_RESOURCE_FORBIDDEN',
  /** Organization access is denied */
  AUTHZ_ORGANIZATION_ACCESS_DENIED: 'AUTHZ_ORGANIZATION_ACCESS_DENIED',
  /** School access is denied */
  AUTHZ_SCHOOL_ACCESS_DENIED: 'AUTHZ_SCHOOL_ACCESS_DENIED',
  /** Feature flag is not enabled for user */
  AUTHZ_FEATURE_NOT_ENABLED: 'AUTHZ_FEATURE_NOT_ENABLED',
  /** Trial period has expired */
  AUTHZ_TRIAL_EXPIRED: 'AUTHZ_TRIAL_EXPIRED',
  /** Subscription is required for this feature */
  AUTHZ_SUBSCRIPTION_REQUIRED: 'AUTHZ_SUBSCRIPTION_REQUIRED',

  // ============================================================================
  // VALIDATION ERRORS (VALIDATION_*)
  // ============================================================================
  /** Required field is missing */
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  /** Field value is invalid */
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  /** Email format is invalid */
  VALIDATION_INVALID_EMAIL: 'VALIDATION_INVALID_EMAIL',
  /** Phone number format is invalid */
  VALIDATION_INVALID_PHONE: 'VALIDATION_INVALID_PHONE',
  /** Date format is invalid */
  VALIDATION_INVALID_DATE: 'VALIDATION_INVALID_DATE',
  /** Value is too short */
  VALIDATION_TOO_SHORT: 'VALIDATION_TOO_SHORT',
  /** Value is too long */
  VALIDATION_TOO_LONG: 'VALIDATION_TOO_LONG',
  /** Value is below minimum */
  VALIDATION_BELOW_MINIMUM: 'VALIDATION_BELOW_MINIMUM',
  /** Value is above maximum */
  VALIDATION_ABOVE_MAXIMUM: 'VALIDATION_ABOVE_MAXIMUM',
  /** Value must be unique */
  VALIDATION_DUPLICATE_VALUE: 'VALIDATION_DUPLICATE_VALUE',
  /** File type is not allowed */
  VALIDATION_INVALID_FILE_TYPE: 'VALIDATION_INVALID_FILE_TYPE',
  /** File size exceeds limit */
  VALIDATION_FILE_TOO_LARGE: 'VALIDATION_FILE_TOO_LARGE',
  /** Invalid medical record number format */
  VALIDATION_INVALID_MRN: 'VALIDATION_INVALID_MRN',
  /** Invalid NPI (National Provider Identifier) */
  VALIDATION_INVALID_NPI: 'VALIDATION_INVALID_NPI',
  /** Invalid ICD-10 code */
  VALIDATION_INVALID_ICD10: 'VALIDATION_INVALID_ICD10',
  /** Date is in the past when future is required */
  VALIDATION_DATE_PAST: 'VALIDATION_DATE_PAST',
  /** Date is in the future when past is required */
  VALIDATION_DATE_FUTURE: 'VALIDATION_DATE_FUTURE',

  // ============================================================================
  // NETWORK ERRORS (NETWORK_*)
  // ============================================================================
  /** Network connection failed */
  NETWORK_CONNECTION_FAILED: 'NETWORK_CONNECTION_FAILED',
  /** No internet connection */
  NETWORK_OFFLINE: 'NETWORK_OFFLINE',
  /** Request timed out */
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  /** DNS resolution failed */
  NETWORK_DNS_FAILED: 'NETWORK_DNS_FAILED',
  /** Request was aborted */
  NETWORK_REQUEST_ABORTED: 'NETWORK_REQUEST_ABORTED',
  /** General network error */
  NETWORK_ERROR: 'NETWORK_ERROR',

  // ============================================================================
  // SERVER ERRORS (SERVER_*)
  // ============================================================================
  /** Internal server error */
  SERVER_INTERNAL_ERROR: 'SERVER_INTERNAL_ERROR',
  /** Database error occurred */
  SERVER_DATABASE_ERROR: 'SERVER_DATABASE_ERROR',
  /** Service is temporarily unavailable */
  SERVER_UNAVAILABLE: 'SERVER_UNAVAILABLE',
  /** Server is under maintenance */
  SERVER_MAINTENANCE: 'SERVER_MAINTENANCE',
  /** Service dependency failed */
  SERVER_DEPENDENCY_FAILED: 'SERVER_DEPENDENCY_FAILED',
  /** Server configuration error */
  SERVER_CONFIG_ERROR: 'SERVER_CONFIG_ERROR',
  /** Server overloaded */
  SERVER_OVERLOADED: 'SERVER_OVERLOADED',
  /** Generic server error */
  SERVER_ERROR: 'SERVER_ERROR',

  // ============================================================================
  // CLIENT ERRORS (CLIENT_*)
  // ============================================================================
  /** Bad request format */
  CLIENT_BAD_REQUEST: 'CLIENT_BAD_REQUEST',
  /** Unsupported operation */
  CLIENT_UNSUPPORTED_OPERATION: 'CLIENT_UNSUPPORTED_OPERATION',
  /** Invalid state for this operation */
  CLIENT_INVALID_STATE: 'CLIENT_INVALID_STATE',
  /** Operation cancelled by user */
  CLIENT_OPERATION_CANCELLED: 'CLIENT_OPERATION_CANCELLED',
  /** Browser not supported */
  CLIENT_BROWSER_NOT_SUPPORTED: 'CLIENT_BROWSER_NOT_SUPPORTED',
  /** JavaScript is required */
  CLIENT_JAVASCRIPT_REQUIRED: 'CLIENT_JAVASCRIPT_REQUIRED',

  // ============================================================================
  // RESOURCE ERRORS (RESOURCE_*)
  // ============================================================================
  /** Requested resource not found */
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  /** Student record not found */
  RESOURCE_STUDENT_NOT_FOUND: 'RESOURCE_STUDENT_NOT_FOUND',
  /** Health record not found */
  RESOURCE_HEALTH_RECORD_NOT_FOUND: 'RESOURCE_HEALTH_RECORD_NOT_FOUND',
  /** Medication record not found */
  RESOURCE_MEDICATION_NOT_FOUND: 'RESOURCE_MEDICATION_NOT_FOUND',
  /** Appointment not found */
  RESOURCE_APPOINTMENT_NOT_FOUND: 'RESOURCE_APPOINTMENT_NOT_FOUND',
  /** Document not found */
  RESOURCE_DOCUMENT_NOT_FOUND: 'RESOURCE_DOCUMENT_NOT_FOUND',
  /** User not found */
  RESOURCE_USER_NOT_FOUND: 'RESOURCE_USER_NOT_FOUND',
  /** Resource already exists */
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  /** Resource conflict */
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  /** Resource has been deleted */
  RESOURCE_GONE: 'RESOURCE_GONE',
  /** Resource is locked by another user */
  RESOURCE_LOCKED: 'RESOURCE_LOCKED',
  /** Resource version conflict */
  RESOURCE_VERSION_CONFLICT: 'RESOURCE_VERSION_CONFLICT',

  // ============================================================================
  // RATE LIMIT ERRORS (RATE_*)
  // ============================================================================
  /** Too many requests */
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  /** Too many login attempts */
  RATE_LIMIT_LOGIN_ATTEMPTS: 'RATE_LIMIT_LOGIN_ATTEMPTS',
  /** Too many API calls */
  RATE_LIMIT_API_CALLS: 'RATE_LIMIT_API_CALLS',
  /** Daily quota exceeded */
  RATE_LIMIT_DAILY_QUOTA: 'RATE_LIMIT_DAILY_QUOTA',

  // ============================================================================
  // PHI/HIPAA ERRORS (PHI_*)
  // ============================================================================
  /** PHI access requires additional authentication */
  PHI_ACCESS_REQUIRES_AUTH: 'PHI_ACCESS_REQUIRES_AUTH',
  /** PHI access is audited */
  PHI_ACCESS_AUDITED: 'PHI_ACCESS_AUDITED',
  /** PHI export is restricted */
  PHI_EXPORT_RESTRICTED: 'PHI_EXPORT_RESTRICTED',
  /** PHI sharing requires consent */
  PHI_CONSENT_REQUIRED: 'PHI_CONSENT_REQUIRED',
  /** Minimum necessary standard violated */
  PHI_MINIMUM_NECESSARY: 'PHI_MINIMUM_NECESSARY',
  /** Break the glass access logged */
  PHI_BREAK_GLASS_ACCESS: 'PHI_BREAK_GLASS_ACCESS',

  // ============================================================================
  // BUSINESS LOGIC ERRORS (BUSINESS_*)
  // ============================================================================
  /** Student already enrolled */
  BUSINESS_STUDENT_ALREADY_ENROLLED: 'BUSINESS_STUDENT_ALREADY_ENROLLED',
  /** Appointment time conflict */
  BUSINESS_APPOINTMENT_CONFLICT: 'BUSINESS_APPOINTMENT_CONFLICT',
  /** Medication dosage exceeded */
  BUSINESS_MEDICATION_DOSAGE_EXCEEDED: 'BUSINESS_MEDICATION_DOSAGE_EXCEEDED',
  /** Immunization already recorded */
  BUSINESS_IMMUNIZATION_DUPLICATE: 'BUSINESS_IMMUNIZATION_DUPLICATE',
  /** Inventory item out of stock */
  BUSINESS_OUT_OF_STOCK: 'BUSINESS_OUT_OF_STOCK',
  /** Document signature required */
  BUSINESS_SIGNATURE_REQUIRED: 'BUSINESS_SIGNATURE_REQUIRED',
  /** Parent consent required */
  BUSINESS_PARENT_CONSENT_REQUIRED: 'BUSINESS_PARENT_CONSENT_REQUIRED',

  // ============================================================================
  // UNKNOWN/GENERIC ERRORS
  // ============================================================================
  /** Unknown error occurred */
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  /** Unexpected error */
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const;

/**
 * Type-safe error code type
 */
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * User-friendly error messages mapped to error codes
 *
 * These messages are designed to be:
 * - Clear and actionable
 * - Free of technical jargon
 * - HIPAA-compliant (no PHI)
 * - Empathetic and helpful
 * - Localization-ready
 *
 * @constant
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Authentication
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Your email or password is incorrect. Please try again.',
  [ERROR_CODES.AUTH_TOKEN_MISSING]: 'Your session is missing. Please log in again.',
  [ERROR_CODES.AUTH_TOKEN_INVALID]: 'Your session is invalid. Please log in again.',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: 'Your session has expired for security reasons. Please log in again.',
  [ERROR_CODES.AUTH_MFA_REQUIRED]: 'Multi-factor authentication is required. Please complete verification.',
  [ERROR_CODES.AUTH_MFA_INVALID]: 'The verification code is incorrect. Please try again.',
  [ERROR_CODES.AUTH_ACCOUNT_LOCKED]: 'Your account has been locked due to multiple failed login attempts. Please contact support.',
  [ERROR_CODES.AUTH_ACCOUNT_DISABLED]: 'Your account is currently disabled. Please contact your administrator.',
  [ERROR_CODES.AUTH_PASSWORD_RESET_REQUIRED]: 'You must reset your password before continuing.',
  [ERROR_CODES.AUTH_EMAIL_VERIFICATION_REQUIRED]: 'Please verify your email address to continue.',

  // Authorization
  [ERROR_CODES.AUTHZ_INSUFFICIENT_PERMISSIONS]: 'You do not have permission to perform this action.',
  [ERROR_CODES.AUTHZ_ROLE_NOT_ALLOWED]: 'Your role does not allow access to this feature.',
  [ERROR_CODES.AUTHZ_RESOURCE_FORBIDDEN]: 'You do not have permission to access this information.',
  [ERROR_CODES.AUTHZ_ORGANIZATION_ACCESS_DENIED]: 'You do not have access to this organization.',
  [ERROR_CODES.AUTHZ_SCHOOL_ACCESS_DENIED]: 'You do not have access to this school.',
  [ERROR_CODES.AUTHZ_FEATURE_NOT_ENABLED]: 'This feature is not enabled for your account.',
  [ERROR_CODES.AUTHZ_TRIAL_EXPIRED]: 'Your trial period has expired. Please upgrade to continue.',
  [ERROR_CODES.AUTHZ_SUBSCRIPTION_REQUIRED]: 'A subscription is required to access this feature.',

  // Validation
  [ERROR_CODES.VALIDATION_REQUIRED_FIELD]: 'This field is required. Please provide a value.',
  [ERROR_CODES.VALIDATION_INVALID_FORMAT]: 'The format of this field is invalid. Please check and try again.',
  [ERROR_CODES.VALIDATION_INVALID_EMAIL]: 'Please enter a valid email address.',
  [ERROR_CODES.VALIDATION_INVALID_PHONE]: 'Please enter a valid phone number.',
  [ERROR_CODES.VALIDATION_INVALID_DATE]: 'Please enter a valid date.',
  [ERROR_CODES.VALIDATION_TOO_SHORT]: 'This value is too short. Please provide more information.',
  [ERROR_CODES.VALIDATION_TOO_LONG]: 'This value is too long. Please shorten it.',
  [ERROR_CODES.VALIDATION_BELOW_MINIMUM]: 'This value is below the minimum allowed.',
  [ERROR_CODES.VALIDATION_ABOVE_MAXIMUM]: 'This value is above the maximum allowed.',
  [ERROR_CODES.VALIDATION_DUPLICATE_VALUE]: 'This value already exists. Please use a different value.',
  [ERROR_CODES.VALIDATION_INVALID_FILE_TYPE]: 'This file type is not allowed. Please upload a different file.',
  [ERROR_CODES.VALIDATION_FILE_TOO_LARGE]: 'This file is too large. Please upload a smaller file.',
  [ERROR_CODES.VALIDATION_INVALID_MRN]: 'The medical record number format is invalid.',
  [ERROR_CODES.VALIDATION_INVALID_NPI]: 'The National Provider Identifier (NPI) format is invalid.',
  [ERROR_CODES.VALIDATION_INVALID_ICD10]: 'The ICD-10 code format is invalid.',
  [ERROR_CODES.VALIDATION_DATE_PAST]: 'Please select a future date.',
  [ERROR_CODES.VALIDATION_DATE_FUTURE]: 'Please select a past date.',

  // Network
  [ERROR_CODES.NETWORK_CONNECTION_FAILED]: 'Unable to connect to the server. Please check your internet connection.',
  [ERROR_CODES.NETWORK_OFFLINE]: 'You appear to be offline. Please check your internet connection.',
  [ERROR_CODES.NETWORK_TIMEOUT]: 'The request took too long. Please try again.',
  [ERROR_CODES.NETWORK_DNS_FAILED]: 'Unable to reach the server. Please check your connection.',
  [ERROR_CODES.NETWORK_REQUEST_ABORTED]: 'The request was cancelled. Please try again.',
  [ERROR_CODES.NETWORK_ERROR]: 'A network error occurred. Please check your connection and try again.',

  // Server
  [ERROR_CODES.SERVER_INTERNAL_ERROR]: 'An internal server error occurred. Our team has been notified.',
  [ERROR_CODES.SERVER_DATABASE_ERROR]: 'A database error occurred. Please try again in a few moments.',
  [ERROR_CODES.SERVER_UNAVAILABLE]: 'The service is temporarily unavailable. Please try again shortly.',
  [ERROR_CODES.SERVER_MAINTENANCE]: 'The system is currently under maintenance. Please try again later.',
  [ERROR_CODES.SERVER_DEPENDENCY_FAILED]: 'A required service is unavailable. Please try again later.',
  [ERROR_CODES.SERVER_CONFIG_ERROR]: 'A server configuration error occurred. Please contact support.',
  [ERROR_CODES.SERVER_OVERLOADED]: 'The server is currently overloaded. Please try again in a few moments.',
  [ERROR_CODES.SERVER_ERROR]: 'A server error occurred. Please try again or contact support if the problem persists.',

  // Client
  [ERROR_CODES.CLIENT_BAD_REQUEST]: 'The request could not be processed. Please check your input and try again.',
  [ERROR_CODES.CLIENT_UNSUPPORTED_OPERATION]: 'This operation is not supported.',
  [ERROR_CODES.CLIENT_INVALID_STATE]: 'This action cannot be performed in the current state.',
  [ERROR_CODES.CLIENT_OPERATION_CANCELLED]: 'The operation was cancelled.',
  [ERROR_CODES.CLIENT_BROWSER_NOT_SUPPORTED]: 'Your browser is not supported. Please use a modern browser.',
  [ERROR_CODES.CLIENT_JAVASCRIPT_REQUIRED]: 'JavaScript must be enabled to use this application.',

  // Resource
  [ERROR_CODES.RESOURCE_NOT_FOUND]: 'The requested item was not found.',
  [ERROR_CODES.RESOURCE_STUDENT_NOT_FOUND]: 'The student record was not found.',
  [ERROR_CODES.RESOURCE_HEALTH_RECORD_NOT_FOUND]: 'The health record was not found.',
  [ERROR_CODES.RESOURCE_MEDICATION_NOT_FOUND]: 'The medication record was not found.',
  [ERROR_CODES.RESOURCE_APPOINTMENT_NOT_FOUND]: 'The appointment was not found.',
  [ERROR_CODES.RESOURCE_DOCUMENT_NOT_FOUND]: 'The document was not found.',
  [ERROR_CODES.RESOURCE_USER_NOT_FOUND]: 'The user was not found.',
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: 'This item already exists.',
  [ERROR_CODES.RESOURCE_CONFLICT]: 'A conflict occurred. The data may have been modified by another user.',
  [ERROR_CODES.RESOURCE_GONE]: 'This item has been permanently deleted.',
  [ERROR_CODES.RESOURCE_LOCKED]: 'This item is currently being edited by another user.',
  [ERROR_CODES.RESOURCE_VERSION_CONFLICT]: 'This item was modified by another user. Please refresh and try again.',

  // Rate Limit
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait a moment before trying again.',
  [ERROR_CODES.RATE_LIMIT_LOGIN_ATTEMPTS]: 'Too many login attempts. Please wait 15 minutes before trying again.',
  [ERROR_CODES.RATE_LIMIT_API_CALLS]: 'API rate limit exceeded. Please wait before making more requests.',
  [ERROR_CODES.RATE_LIMIT_DAILY_QUOTA]: 'Daily quota exceeded. Please try again tomorrow.',

  // PHI/HIPAA
  [ERROR_CODES.PHI_ACCESS_REQUIRES_AUTH]: 'Access to patient information requires additional authentication.',
  [ERROR_CODES.PHI_ACCESS_AUDITED]: 'Access to this information is being audited for compliance.',
  [ERROR_CODES.PHI_EXPORT_RESTRICTED]: 'Exporting patient information is restricted. Please contact your administrator.',
  [ERROR_CODES.PHI_CONSENT_REQUIRED]: 'Patient consent is required to share this information.',
  [ERROR_CODES.PHI_MINIMUM_NECESSARY]: 'You can only access the minimum necessary patient information.',
  [ERROR_CODES.PHI_BREAK_GLASS_ACCESS]: 'Emergency access has been granted and logged.',

  // Business Logic
  [ERROR_CODES.BUSINESS_STUDENT_ALREADY_ENROLLED]: 'This student is already enrolled.',
  [ERROR_CODES.BUSINESS_APPOINTMENT_CONFLICT]: 'This appointment conflicts with an existing appointment.',
  [ERROR_CODES.BUSINESS_MEDICATION_DOSAGE_EXCEEDED]: 'The medication dosage exceeds the safe limit.',
  [ERROR_CODES.BUSINESS_IMMUNIZATION_DUPLICATE]: 'This immunization has already been recorded.',
  [ERROR_CODES.BUSINESS_OUT_OF_STOCK]: 'This item is currently out of stock.',
  [ERROR_CODES.BUSINESS_SIGNATURE_REQUIRED]: 'A signature is required to complete this action.',
  [ERROR_CODES.BUSINESS_PARENT_CONSENT_REQUIRED]: 'Parent or guardian consent is required.',

  // Unknown
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
  [ERROR_CODES.UNEXPECTED_ERROR]: 'An unexpected error occurred. Please contact support if the problem persists.',
};

/**
 * Get user-friendly message for an error code
 *
 * Returns a clear, actionable message appropriate for displaying to end users.
 * Messages are HIPAA-compliant and do not contain PHI or technical details.
 *
 * @param errorCode - The error code to get a message for
 * @returns User-friendly error message
 *
 * @example
 * ```typescript
 * const message = getUserMessage(ERROR_CODES.AUTH_SESSION_EXPIRED);
 * // "Your session has expired for security reasons. Please log in again."
 * ```
 *
 * @example
 * ```typescript
 * // With unknown error code
 * const message = getUserMessage('UNKNOWN_CODE');
 * // "An unexpected error occurred. Please try again."
 * ```
 */
export function getUserMessage(errorCode: string): string {
  // Check if error code exists in our mapping
  if (errorCode in ERROR_MESSAGES) {
    return ERROR_MESSAGES[errorCode as ErrorCode];
  }

  // For HTTP status code errors
  if (errorCode.startsWith('HTTP_')) {
    const statusCode = parseInt(errorCode.replace('HTTP_', ''), 10);
    return getHttpStatusMessage(statusCode);
  }

  // Default fallback message
  return ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
}

/**
 * Get user-friendly title for an error code
 *
 * Returns a short title suitable for error dialog headers or toast titles.
 *
 * @param errorCode - The error code to get a title for
 * @returns Error title
 *
 * @example
 * ```typescript
 * const title = getErrorTitle(ERROR_CODES.NETWORK_TIMEOUT);
 * // "Connection Timeout"
 * ```
 */
export function getErrorTitle(errorCode: string): string {
  // Authentication errors
  if (errorCode.startsWith('AUTH_')) {
    return 'Authentication Error';
  }

  // Authorization errors
  if (errorCode.startsWith('AUTHZ_')) {
    return 'Access Denied';
  }

  // Validation errors
  if (errorCode.startsWith('VALIDATION_')) {
    return 'Invalid Input';
  }

  // Network errors
  if (errorCode.startsWith('NETWORK_')) {
    return 'Connection Error';
  }

  // Server errors
  if (errorCode.startsWith('SERVER_')) {
    return 'Server Error';
  }

  // Resource errors
  if (errorCode.startsWith('RESOURCE_')) {
    if (errorCode.includes('NOT_FOUND')) {
      return 'Not Found';
    }
    if (errorCode.includes('CONFLICT')) {
      return 'Conflict';
    }
    return 'Resource Error';
  }

  // Rate limit errors
  if (errorCode.startsWith('RATE_')) {
    return 'Rate Limit Exceeded';
  }

  // PHI errors
  if (errorCode.startsWith('PHI_')) {
    return 'Access Restricted';
  }

  // Business logic errors
  if (errorCode.startsWith('BUSINESS_')) {
    return 'Operation Failed';
  }

  return 'Error';
}

/**
 * Get HTTP status code message
 *
 * Provides user-friendly messages for common HTTP status codes.
 *
 * @param statusCode - HTTP status code
 * @returns User-friendly message
 */
function getHttpStatusMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: 'The request could not be processed. Please check your input.',
    401: 'Your session has expired. Please log in again.',
    403: 'You do not have permission to access this resource.',
    404: 'The requested resource was not found.',
    408: 'The request took too long. Please try again.',
    409: 'A conflict occurred. The data may have been modified.',
    422: 'The provided data is invalid. Please check and try again.',
    429: 'Too many requests. Please wait before trying again.',
    500: 'An internal server error occurred. Our team has been notified.',
    502: 'The server is temporarily unavailable. Please try again shortly.',
    503: 'The service is currently unavailable. Please try again later.',
    504: 'The request timed out. Please try again.',
  };

  return messages[statusCode] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
}

/**
 * Check if error is retryable
 *
 * Determines whether an error should trigger a retry mechanism.
 *
 * @param errorCode - The error code to check
 * @returns True if error is retryable
 *
 * @example
 * ```typescript
 * if (isRetryableError(ERROR_CODES.NETWORK_TIMEOUT)) {
 *   // Implement retry logic
 * }
 * ```
 */
export function isRetryableError(errorCode: string): boolean {
  const retryableErrors = [
    ERROR_CODES.NETWORK_CONNECTION_FAILED,
    ERROR_CODES.NETWORK_TIMEOUT,
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.SERVER_UNAVAILABLE,
    ERROR_CODES.SERVER_OVERLOADED,
    ERROR_CODES.SERVER_DATABASE_ERROR,
    ERROR_CODES.RATE_LIMIT_EXCEEDED,
  ];

  return retryableErrors.includes(errorCode as ErrorCode);
}

/**
 * Check if error requires re-authentication
 *
 * @param errorCode - The error code to check
 * @returns True if re-authentication is required
 */
export function requiresReauth(errorCode: string): boolean {
  const reauthErrors = [
    ERROR_CODES.AUTH_TOKEN_EXPIRED,
    ERROR_CODES.AUTH_SESSION_EXPIRED,
    ERROR_CODES.AUTH_TOKEN_INVALID,
    ERROR_CODES.AUTH_TOKEN_MISSING,
  ];

  return reauthErrors.includes(errorCode as ErrorCode);
}

/**
 * Get error severity level
 *
 * Returns the severity level for UI presentation (toast color, icon, etc.)
 *
 * @param errorCode - The error code
 * @returns Severity level: 'error' | 'warning' | 'info'
 */
export function getErrorSeverity(errorCode: string): 'error' | 'warning' | 'info' {
  // High severity - system failures, auth issues
  if (
    errorCode.startsWith('AUTH_') ||
    errorCode.startsWith('SERVER_') ||
    errorCode.startsWith('PHI_')
  ) {
    return 'error';
  }

  // Medium severity - validation, permissions
  if (
    errorCode.startsWith('VALIDATION_') ||
    errorCode.startsWith('AUTHZ_') ||
    errorCode.startsWith('BUSINESS_')
  ) {
    return 'warning';
  }

  // Low severity - rate limits, network issues
  if (errorCode.startsWith('RATE_') || errorCode.startsWith('NETWORK_')) {
    return 'info';
  }

  return 'error';
}

export default {
  ERROR_CODES,
  ERROR_MESSAGES,
  getUserMessage,
  getErrorTitle,
  isRetryableError,
  requiresReauth,
  getErrorSeverity,
};
