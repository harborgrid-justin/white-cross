/**
 * Standardized Error Messages
 *
 * Consistent user-facing error messages across the application.
 * All messages are patient-friendly and provide clear next steps.
 *
 * @module constants/errorMessages
 * @category Core
 */

export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',
  TIMEOUT_ERROR: 'The request took too long to complete. Please try again.',

  // Authentication errors
  AUTH_EXPIRED: 'Your session has expired. Please log in again.',
  AUTH_INVALID: 'Invalid credentials. Please check your username and password.',
  AUTH_FORBIDDEN: 'You do not have permission to access this resource.',

  // Generic CRUD errors
  FETCH_FAILED: (resource: string) => `Failed to load ${resource}. Please try again.`,
  CREATE_FAILED: (resource: string) => `Failed to create ${resource}. Please check your input and try again.`,
  UPDATE_FAILED: (resource: string) => `Failed to update ${resource}. Please try again.`,
  DELETE_FAILED: (resource: string) => `Failed to delete ${resource}. Please try again.`,

  // Specific resource errors
  STUDENTS_LOAD_FAILED: 'Unable to load student records. Please try again or contact support.',
  MEDICATIONS_LOAD_FAILED: 'Unable to load medication records. Please try again or contact support.',
  APPOINTMENTS_LOAD_FAILED: 'Unable to load appointments. Please try again or contact support.',
  HEALTH_RECORDS_LOAD_FAILED: 'Unable to load health records. Please try again or contact support.',
  IMMUNIZATIONS_LOAD_FAILED: 'Unable to load immunization records. Please try again or contact support.',

  // Server errors
  SERVER_ERROR: 'A server error occurred. Our team has been notified. Please try again later.',
  MAINTENANCE: 'The system is currently undergoing maintenance. Please try again in a few minutes.',

  // Validation errors
  VALIDATION_FAILED: 'Please correct the errors in the form and try again.',
  REQUIRED_FIELD: (fieldName: string) => `${fieldName} is required.`,
  INVALID_FORMAT: (fieldName: string) => `${fieldName} format is invalid.`,

  // Generic fallback
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again or contact support.',
} as const;

/**
 * Get error message for API errors based on status code
 */
export function getApiErrorMessage(statusCode: number, resource?: string): string {
  switch (statusCode) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return ERROR_MESSAGES.AUTH_EXPIRED;
    case 403:
      return ERROR_MESSAGES.AUTH_FORBIDDEN;
    case 404:
      return resource
        ? `${resource} not found.`
        : 'The requested resource was not found.';
    case 408:
      return ERROR_MESSAGES.TIMEOUT_ERROR;
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
    case 502:
    case 503:
      return ERROR_MESSAGES.SERVER_ERROR;
    case 504:
      return ERROR_MESSAGES.TIMEOUT_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}
