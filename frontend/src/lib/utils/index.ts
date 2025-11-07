/**
 * Utility Functions Index
 *
 * Centralized export point for all utility functions in the application.
 * Provides a clean, organized interface for importing common utilities.
 *
 * @module lib/utils
 */

// ============================================================================
// DATE UTILITIES
// ============================================================================

export {
  formatDateForApi,
  parseDateFromApi,
  formatDateForDisplay,
  isDateExpired,
  getTimeUntilExpiry,
  getRelativeTime,
  addDays,
  addMonths,
  startOfDay,
  endOfDay,
  isSameDay,
  calculateAge,
  formatTime,
  isValidISODate,
  getDateRange,
} from './date';

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

export {
  formatPhoneNumber,
  formatCurrency,
  formatName,
  formatAddress,
  capitalize,
  truncate,
  formatFileSize,
  formatNumber,
  formatPercentage,
  formatSSN,
  formatMRN,
  formatStudentNumber,
  formatGrade,
  formatList,
  pluralize,
} from './format';

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export {
  isValidEmail,
  isValidPhoneNumber,
  isValidZipCode,
  isValidSSN,
  isValidNPI,
  isValidICD10,
  isValidNDC,
  isValidMRN,
  containsPHI,
  validatePassword,
  isValidDateOfBirth,
  isValidURL,
  isValidDosage,
  isRequired,
  isInRange,
  isOneOf,
} from './validation';

// ============================================================================
// SANITIZATION UTILITIES
// ============================================================================

export {
  sanitizeForLogging,
  sanitizeError,
  maskString,
  maskEmail,
  maskPhoneNumber,
  maskSSN,
  maskMRN,
  removePHIFromObject,
  COMMON_PHI_FIELDS,
  sanitizeAPIPayload,
  sanitizeAPIResponse,
  sanitizeStackTrace,
  getSafeErrorMessage,
} from './sanitization';

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

export {
  StorageType,
  getItem,
  setItem,
  removeItem,
  clearStorage,
  getKeys,
  hasItem,
  getStorageSize,
  cleanupExpired,
  setSessionItem,
  getSessionItem,
  setLocalItem,
  getLocalItem,
  createNamespace,
  isQuotaExceeded,
} from './storage';

// ============================================================================
// TYPE GUARD UTILITIES
// ============================================================================

export {
  // Basic type guards
  isError,
  hasMessage,
  hasCode,
  hasStatusCode,

  // API response type guards
  isApiResponse,
  isSuccessResponse,
  isErrorResponse,
  isPaginatedResponse,

  // Error type guards
  isApiError,
  isValidationError,
  isNetworkError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError,
  isServerError,

  // Data type guards
  isString,
  isNonEmptyString,
  isNumber,
  isBoolean,
  isArray,
  isNonEmptyArray,
  isObject,
  isNullish,
  isDate,

  // Utility type guards
  hasProperty,
  isOneOf as isOneOfValues, // Renamed to avoid conflict with validation isOneOf

  // Helper functions
  ensureError,
  getErrorMessage,
  getStatusCode,
  getErrorCode,
} from './type-guards';

// ============================================================================
// CLASS NAME UTILITIES
// ============================================================================

/**
 * Re-export the cn (className) utility from parent utils.ts
 * This utility combines and merges CSS class names using clsx and tailwind-merge
 */
export { cn } from '../utils';

// ============================================================================
// RE-EXPORT TYPE DEFINITIONS
// ============================================================================

// Re-export types that are commonly used with these utilities
export type { StorageConfig, StorageItem } from './storage';
