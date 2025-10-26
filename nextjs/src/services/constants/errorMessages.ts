/**
 * Centralized error messages for the White Cross Healthcare Platform
 *
 * Provides consistent, typed error messages across all services.
 * Using constants ensures consistency and makes message updates easier.
 *
 * @module services/constants/errorMessages
 */

/**
 * Structured error messages organized by domain
 *
 * @security Ensure error messages do not expose sensitive PHI/PII
 * @security Do not include technical details that could aid attackers
 */
export const ERROR_MESSAGES = {
  /**
   * Authentication and authorization errors
   */
  AUTH: {
    TOKEN_REFRESH_FAILED: 'Failed to refresh authentication token. Please log in again.',
    TOKEN_INVALID: 'Invalid authentication token. Please log in again.',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    LOGIN_FAILED: 'Login failed. Please check your credentials and try again.',
    LOGOUT_FAILED: 'Failed to log out. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    PERMISSION_DENIED: 'You do not have permission to access this resource.',
    MFA_REQUIRED: 'Multi-factor authentication is required.',
    MFA_INVALID: 'Invalid multi-factor authentication code.',
  },

  /**
   * API and network errors
   */
  API: {
    NETWORK_ERROR: 'Network error. Please check your internet connection and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    REQUEST_TIMEOUT: 'Request timed out. Please try again.',
    REQUEST_FAILED: 'Request failed. Please try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
    BAD_REQUEST: 'Invalid request. Please check your input and try again.',
    NOT_FOUND: 'The requested resource was not found.',
    CONFLICT: 'The operation conflicts with existing data.',
    RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
  },

  /**
   * Cache-related errors
   */
  CACHE: {
    SET_FAILED: 'Failed to cache data.',
    GET_FAILED: 'Failed to retrieve cached data.',
    DELETE_FAILED: 'Failed to remove cached data.',
    INVALIDATE_FAILED: 'Failed to invalidate cache.',
    PERSISTENCE_FAILED: 'Failed to persist cache to storage.',
    RESTORE_FAILED: 'Failed to restore cache from storage.',
  },

  /**
   * Medication module errors
   */
  MEDICATION: {
    SEARCH_FAILED: 'Failed to search medication formulary. Please try again.',
    FETCH_FAILED: 'Failed to fetch medication details. Please try again.',
    CREATE_FAILED: 'Failed to create medication record. Please try again.',
    UPDATE_FAILED: 'Failed to update medication record. Please try again.',
    DELETE_FAILED: 'Failed to delete medication record. Please try again.',
    PRESCRIPTION_FAILED: 'Failed to process prescription. Please try again.',
    ADMINISTRATION_FAILED: 'Failed to record medication administration. Please try again.',
    INTERACTION_CHECK_FAILED: 'Failed to check medication interactions.',
    ALLERGY_CHECK_FAILED: 'Failed to check medication allergies.',
  },

  /**
   * Student management errors
   */
  STUDENT: {
    FETCH_FAILED: 'Failed to fetch student information. Please try again.',
    CREATE_FAILED: 'Failed to create student record. Please try again.',
    UPDATE_FAILED: 'Failed to update student record. Please try again.',
    DELETE_FAILED: 'Failed to delete student record. Please try again.',
    SEARCH_FAILED: 'Failed to search students. Please try again.',
    ENROLLMENT_FAILED: 'Failed to process student enrollment.',
  },

  /**
   * Health records errors
   */
  HEALTH: {
    FETCH_FAILED: 'Failed to fetch health records. Please try again.',
    CREATE_FAILED: 'Failed to create health record. Please try again.',
    UPDATE_FAILED: 'Failed to update health record. Please try again.',
    DELETE_FAILED: 'Failed to delete health record. Please try again.',
    VITAL_SIGNS_FAILED: 'Failed to record vital signs. Please try again.',
    ALLERGY_FAILED: 'Failed to record allergy information. Please try again.',
    VACCINATION_FAILED: 'Failed to record vaccination. Please try again.',
    SCREENING_FAILED: 'Failed to record screening results. Please try again.',
    CONDITION_FAILED: 'Failed to record chronic condition. Please try again.',
  },

  /**
   * Appointment management errors
   */
  APPOINTMENT: {
    FETCH_FAILED: 'Failed to fetch appointments. Please try again.',
    CREATE_FAILED: 'Failed to create appointment. Please try again.',
    UPDATE_FAILED: 'Failed to update appointment. Please try again.',
    CANCEL_FAILED: 'Failed to cancel appointment. Please try again.',
    SCHEDULE_CONFLICT: 'This appointment conflicts with an existing appointment.',
  },

  /**
   * Document management errors
   */
  DOCUMENT: {
    UPLOAD_FAILED: 'Failed to upload document. Please try again.',
    DOWNLOAD_FAILED: 'Failed to download document. Please try again.',
    DELETE_FAILED: 'Failed to delete document. Please try again.',
    FETCH_FAILED: 'Failed to fetch documents. Please try again.',
    INVALID_TYPE: 'Invalid document type.',
    SIZE_EXCEEDED: 'Document size exceeds maximum allowed size.',
  },

  /**
   * Inventory management errors
   */
  INVENTORY: {
    FETCH_FAILED: 'Failed to fetch inventory data. Please try again.',
    UPDATE_FAILED: 'Failed to update inventory. Please try again.',
    LOW_STOCK: 'Item is low in stock.',
    OUT_OF_STOCK: 'Item is out of stock.',
    ORDER_FAILED: 'Failed to place order. Please try again.',
  },

  /**
   * Communication errors
   */
  COMMUNICATION: {
    SEND_FAILED: 'Failed to send message. Please try again.',
    FETCH_FAILED: 'Failed to fetch messages. Please try again.',
    BROADCAST_FAILED: 'Failed to send broadcast. Please try again.',
    NOTIFICATION_FAILED: 'Failed to send notification. Please try again.',
  },

  /**
   * Compliance and audit errors
   */
  COMPLIANCE: {
    AUDIT_LOG_FAILED: 'Failed to record audit log.',
    REPORT_FAILED: 'Failed to generate compliance report. Please try again.',
    VIOLATION_DETECTED: 'Compliance violation detected.',
  },

  /**
   * User management errors
   */
  USER: {
    FETCH_FAILED: 'Failed to fetch user information. Please try again.',
    CREATE_FAILED: 'Failed to create user account. Please try again.',
    UPDATE_FAILED: 'Failed to update user account. Please try again.',
    DELETE_FAILED: 'Failed to delete user account. Please try again.',
    PASSWORD_CHANGE_FAILED: 'Failed to change password. Please try again.',
    PROFILE_UPDATE_FAILED: 'Failed to update profile. Please try again.',
  },

  /**
   * Validation errors
   */
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_FORMAT: 'Invalid format.',
    INVALID_EMAIL: 'Invalid email address.',
    INVALID_PHONE: 'Invalid phone number.',
    INVALID_DATE: 'Invalid date.',
    INVALID_TIME: 'Invalid time.',
    INVALID_RANGE: 'Value is out of valid range.',
    PASSWORD_TOO_WEAK: 'Password does not meet security requirements.',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
  },

  /**
   * Circuit breaker and resilience errors
   */
  RESILIENCE: {
    CIRCUIT_OPEN: 'Service temporarily unavailable due to errors. Please try again later.',
    BULKHEAD_FULL: 'Too many concurrent requests. Please try again in a moment.',
    TIMEOUT: 'Operation timed out. Please try again.',
    RETRY_EXHAUSTED: 'Maximum retry attempts reached. Please try again later.',
  },
} as const;

/**
 * Type representing all possible error message keys
 * Useful for type-safe error message access
 */
export type ErrorMessageCategory = keyof typeof ERROR_MESSAGES;

/**
 * Type representing error message keys within a specific category
 */
export type ErrorMessageKey<T extends ErrorMessageCategory> =
  keyof (typeof ERROR_MESSAGES)[T];

/**
 * Helper function to get a typed error message
 *
 * @param category - The error category
 * @param key - The specific error key within the category
 * @returns The error message string
 *
 * @example
 * ```typescript
 * const message = getErrorMessage('AUTH', 'TOKEN_EXPIRED');
 * throw new Error(message);
 * ```
 */
export function getErrorMessage<T extends ErrorMessageCategory>(
  category: T,
  key: ErrorMessageKey<T>
): string {
  return ERROR_MESSAGES[category][key] as string;
}

/**
 * Helper function to create a custom error with a standardized message
 *
 * @param category - The error category
 * @param key - The specific error key within the category
 * @param cause - Optional underlying error cause
 * @returns Error instance with the standardized message
 *
 * @example
 * ```typescript
 * throw createError('API', 'NETWORK_ERROR');
 *
 * // With underlying cause
 * try {
 *   await fetch(...);
 * } catch (err) {
 *   throw createError('API', 'REQUEST_FAILED', err);
 * }
 * ```
 */
export function createError<T extends ErrorMessageCategory>(
  category: T,
  key: ErrorMessageKey<T>,
  cause?: Error
): Error {
  const message = getErrorMessage(category, key);
  const error = new Error(message);

  if (cause) {
    // Attach cause for debugging (ES2022+)
    if ('cause' in error) {
      Object.defineProperty(error, 'cause', {
        value: cause,
        writable: true,
        configurable: true,
      });
    }
  }

  return error;
}
