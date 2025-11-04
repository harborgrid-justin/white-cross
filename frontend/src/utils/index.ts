/**
 * @fileoverview Comprehensive Barrel Export for All Utility Modules
 * @module utils
 * @category Utils
 *
 * Central export point for all utility functions, types, and classes used throughout
 * the White Cross Healthcare Platform frontend application.
 *
 * This barrel export provides organized access to:
 * - Validation utilities (student, document, user validation)
 * - API adapters and response transformers
 * - Performance optimization utilities (hooks, monitoring, observers)
 * - Optimistic update management
 * - Navigation utilities (permissions, filtering, routing)
 * - Error handling and recovery
 * - Security utilities (sanitization, token management)
 * - Date formatting and manipulation
 * - Medication management utilities
 * - Health records utilities
 * - Document validation
 * - Lodash utility wrappers
 * - UI utilities (toast, class names)
 * - Debug and logging utilities
 * - Metadata generation
 * - General formatters and generators
 *
 * @example
 * ```typescript
 * // Import specific utilities
 * import { validateStudentCreation, showSuccessToast, cn } from '@/utils';
 *
 * // Import from specific categories
 * import { unwrapData, adaptResponse } from '@/utils';
 * import { useDebounce, useThrottle } from '@/utils';
 * import { optimisticCreate, optimisticUpdate } from '@/utils';
 * ```
 *
 * Note: For better tree-shaking, prefer importing from specific modules when possible.
 * However, this barrel export ensures backward compatibility and convenient imports.
 */

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Student Validation Utilities
 * Comprehensive validation functions for student data including demographics,
 * health information, and enrollment data.
 */
export type {
  ValidationResult,
  StudentCreationData,
  CompositeValidationResult,
} from './validation/studentValidation.types';

export {
  // Constants
  VALID_GRADES,
  VALIDATION_PATTERNS,
  FIELD_CONSTRAINTS,
  AGE_CONSTRAINTS,
  VALID_GENDERS,

  // Demographic validation
  validateName,
  validateDateOfBirth,
  validateGrade,
  validateGender,

  // Health validation
  validateMedicalRecordNumber,
  validateUUID,
  validatePhotoUrl,

  // Enrollment validation
  validateStudentNumber,
  validateEnrollmentDate,
  validatePhoneNumber,
  validateEmail,

  // Composite validation
  validateStudentCreation,
  normalizeStudentData,
} from './validation/studentValidation';

/**
 * User Validation Utilities
 * Validation functions for user account data and authentication.
 */
export * from './validation/userValidation';

/**
 * Document Validation Utilities
 * Client-side validation for document management operations including
 * file uploads, metadata, security, and lifecycle management.
 */
export type {
  ValidationError as DocumentValidationError,
  ValidationResult as DocumentValidationResult,
} from './documentValidation.types';

export {
  // Constants
  MIN_FILE_SIZE,
  MAX_TITLE_LENGTH,
  MIN_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_TAGS_COUNT,
  MAX_TAG_LENGTH,
  MIN_TAG_LENGTH,
  MAX_SHARE_RECIPIENTS,

  // File type validation
  validateFileSize,
  validateFileType,
  validateFileExtensionMatchesMimeType,
  validateFileName,
  validateFile,

  // Security validation
  validateDocumentTitle,
  validateDocumentDescription,
  validateDocumentCategory,
  validateAccessLevel,
  validateDocumentTags,
  validateSignatureData,
  validateSharePermissions,

  // Lifecycle validation
  validateDocumentStatus,
  validateStatusTransition,
  validateRetentionDate,
  calculateDefaultRetentionDate,
  categoryRequiresSignature,

  // Operations validation
  validateDocumentCanBeEdited,
  validateDocumentCanBeSigned,
  validateDocumentCanBeDeleted,

  // Schema validation
  validateDocumentCreation,
  validateDocumentUpdate,

  // Helpers
  formatValidationErrors,
  getFirstErrorMessage,
} from './documentValidation';

// ============================================================================
// API ADAPTERS
// ============================================================================

/**
 * API Response Adapters
 * Type-safe utilities for transforming API responses to expected hook formats.
 * Handles wrapped/unwrapped responses, pagination, and domain-specific transformations.
 */
export type {
  ApiResponse,
  PaginatedResponse,
  SuccessResponse,
  ErrorResponse,
} from './adapters/apiAdapters.types';

export {
  // Core unwrapping
  unwrapData,
  extractData,
  extractDataOptional,
  unwrapPaginatedData,

  // Type guards
  isSuccessResponse,
  isErrorResponse,
  isPaginatedResponse,

  // Error handling
  handleApiError,

  // Transformations
  adaptResponse,
  adaptResponseWrapper,
  adaptMedicationResponse,
  adaptStudentResponse,
  adaptHealthRecordResponse,
  extractApiData,
} from './adapters/apiAdapters';

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Performance Optimization Utilities
 * Comprehensive collection including React hooks, monitoring, optimization,
 * and observer patterns for optimal application performance.
 */
export type {
  InfiniteScrollConfig,
  InfiniteScrollResult,
  LazyImageResult,
  ElementSize,
  VirtualScrollConfig,
  VirtualScrollItem,
  VirtualScrollResult,
  WorkerFunction,
  WorkerExecute,
  WebWorkerResult,
  BatchUpdateFn,
  FlushFn,
  BatchUpdatesResult,
} from './performance-utilities.types';

export {
  // Hooks
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useInfiniteScroll,
  useIdleCallback,
  useLazyImage,
  useBatchUpdates,

  // Monitoring
  performanceMark,
  performanceMeasure,
  usePerformanceTracking,

  // Optimization
  useWebWorker,
  useDeepCompareMemo,
  memoize,

  // Observers
  useResizeObserver,
  useMediaQuery,
  useVirtualScroll,
} from './performance-utilities';

/**
 * Legacy Performance Utilities
 * Basic performance utilities (debounce, throttle) for backward compatibility.
 */
export { debounce, throttle } from './performance';

// ============================================================================
// OPTIMISTIC UPDATE UTILITIES
// ============================================================================

/**
 * Optimistic Update System
 * Enterprise-grade optimistic update management for TanStack Query with
 * automatic rollback, race condition handling, and conflict resolution.
 */
export {
  // Enums
  UpdateStatus,
  RollbackStrategy,
  ConflictResolutionStrategy,
  OperationType,
} from './optimisticUpdates.types';

export type {
  OptimisticUpdate,
  ConflictResolution,
  OptimisticOperationOptions,
  OptimisticUpdateStats,
} from './optimisticUpdates.types';

export {
  OptimisticUpdateManager,
  optimisticUpdateManager,
} from './optimisticUpdates';

/**
 * Optimistic Update Helpers
 * Simplified helper functions for common optimistic update patterns.
 */
export type {
  OptimisticCreateResult,
  OptimisticBulkCreateResult,
} from './optimisticHelpers.types';

export {
  // Utility functions
  generateTempId,
  isTempId,
  replaceTempId,
  replaceTempIdsInArray,
  updateEntityInList,
  removeEntityFromList,
  defaultMergeFn,
  deepMergeFn,

  // CRUD operations
  optimisticCreate,
  optimisticUpdate,
  optimisticUpdateInList,
  optimisticDelete,
  optimisticDeleteFromList,

  // Bulk operations
  optimisticBulkCreate,
  optimisticBulkDelete,

  // Transactions
  rollbackUpdate,
  confirmUpdate,
  confirmCreate,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} from './optimisticHelpers';

// ============================================================================
// NAVIGATION UTILITIES
// ============================================================================

/**
 * Navigation Utilities
 * Comprehensive utilities for permission checking, filtering, active route
 * detection, and navigation item manipulation.
 */
export type {
  User as NavigationUser,
  UserRole,
  NavigationItem,
  FilteredNavigationItem,
  NavigationPermission,
  AccessCheckResult,
  AccessDenialReason,
  RolePermissionMap,
} from './navigationUtils.types';

export {
  // Permission checking
  hasRequiredRole,
  hasRequiredPermissions,
  canAccessNavigationItem,

  // Navigation filtering
  filterNavigationItems,
  getAccessibleNavigationItems,

  // Active route detection
  isNavigationItemActive,
  markActiveNavigationItems,

  // Helper functions
  getDisabledReasonMessage,
  sortNavigationItems,
  groupNavigationItemsBySection,
  formatBadgeValue,
} from './navigationUtils';

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Error Handling and Recovery
 * Unified error handling with classification, user-friendly messaging,
 * retry logic, and HIPAA-compliant logging.
 */
export type {
  ErrorType,
  ProcessedError,
  ErrorNotification,
  UseErrorHandlerResult,
  RetryOptions,
} from './errorHandling.types';

export {
  // Type guards
  isApiError,
  isValidationError,

  // Error handlers
  processError,
  mapStatusCodeToErrorType,
  isRetryableError,
  getUserFriendlyMessage,

  // Reporting
  logError,
  createErrorNotification,
  getErrorTitle,
  getNotificationType,

  // Recovery
  withErrorHandling,
  createErrorHandler,
  withRetry,
} from './errorHandling';

// ============================================================================
// SECURITY UTILITIES
// ============================================================================

/**
 * Sanitization Utilities
 * Security utilities for sanitizing and validating user input to prevent
 * XSS attacks and ensure data integrity.
 */
export {
  sanitizeText,
  sanitizeHtml,
  sanitizeUrl,
  sanitizeFileName,
  sanitizeEmail,
  sanitizePhoneNumber,
  sanitizeId,
  sanitizeNumber,
  sanitizeDate,
  sanitizeSearchQuery,
  deepSanitizeObject,
  validateSafeHealthcareText,
  generateCSPNonce,
} from './sanitization';

/**
 * Token Security Management
 * Secure token management utilities with encryption, expiration checking,
 * and secure storage patterns.
 */
export type {
  TokenData,
  EncryptedTokenData,
} from './tokenSecurity';

export { TokenSecurityManager } from './tokenSecurity';

// ============================================================================
// MEDICATION UTILITIES
// ============================================================================

/**
 * Medication Management Utilities
 * Comprehensive utilities for medication data formatting, status tracking,
 * inventory management, and operations.
 */
export type {
  Medication,
  MedicationReminder,
  Priority,
  ExpirationStatus,
  StockStatus,
  StrengthInfo,
  InventoryInfo,
  MedicationStats,
  MedicationFilters,
} from './medications.types';

export {
  // Formatting
  formatDate as formatMedicationDate,
  parseAndFormatStrength,
  getMedicationDisplayName,
  formatMedicationForDisplay,

  // Status
  getDaysUntilExpiration,
  getExpirationStatus,
  getStockStatus,
  getSeverityColor as getMedicationSeverityColor,
  getMedicationStatusColor,
  getInventoryStatusColor,

  // Inventory
  calculateTotalInventory,

  // Operations
  getNextReminderTime,
  filterMedications,
  getMedicationStats,
  validateMedicationData,
} from './medications';

// ============================================================================
// HEALTH RECORDS UTILITIES
// ============================================================================

/**
 * Health Records Utilities
 * Utilities for formatting and displaying health record data including
 * conditions, allergies, vaccinations, and medical history.
 */
export {
  formatDate as formatHealthRecordDate,
  formatShortDate,
  getSeverityColor as getAllergySeverityColor,
  getConditionSeverityColor,
  getStatusColor as getConditionStatusColor,
  getVaccinationStatusColor,
  getPriorityColor,
  calculateBMI,
  sortVaccinations,
  filterVaccinations,
  generateId as generateHealthRecordId,
  validateRequired,
  validateDateRange,
  validateNumericRange,
  debounce as healthRecordDebounce,
} from './healthRecords';

// ============================================================================
// LODASH UTILITY WRAPPERS
// ============================================================================

/**
 * Lodash Utility Wrappers
 * Organized lodash utility functions for arrays, objects, strings, functions,
 * dates, validation, math, React patterns, and healthcare-specific operations.
 */
export {
  arrayUtils,
  objectUtils,
  stringUtils,
  functionUtils,
  dateUtils as lodashDateUtils,
  validationUtils,
  mathUtils,
  reactUtils,
  healthcareUtils,
} from './lodashUtils';

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Date Utilities
 * Comprehensive date formatting and manipulation utilities.
 */
export {
  formatDate,
  isValidDate,
  addDays,
  subtractDays,
  addMonths,
  addYears,
  isToday,
  isYesterday,
  isTomorrow,
  isFuture,
  isPast,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  getRelativeTime,
  calculateAge,
  daysBetween,
  formatDuration,
} from './dateUtils';

// ============================================================================
// FORMATTERS
// ============================================================================

/**
 * General Formatting Utilities
 * Utilities for formatting various data types for display.
 */
export {
  formatDate as formatDateDisplay,
  formatCurrency,
  formatName,
  formatPhone,
  formatPercentage,
  formatFileSize,
} from './formatters';

// ============================================================================
// GENERATORS
// ============================================================================

/**
 * ID and Value Generators
 * Utilities for generating unique IDs, UUIDs, slugs, and other values.
 */
export {
  generateId,
  generateUUID,
  createSlug,
  generateRandomString,
  generatePassword,
  generateRandomColor,
  generateRandomNumber,
  generateInitials,
  generateShortCode,
  generateFileName,
  generateReferenceNumber,
} from './generators';

// ============================================================================
// UI UTILITIES
// ============================================================================

/**
 * Class Name Utility
 * Merges class names with proper Tailwind CSS handling.
 */
export { cn } from './cn';

/**
 * Toast Notifications
 * Wrapper functions for consistent toast notifications with test support.
 */
export {
  showSuccessToast,
  showErrorToast,
  toast,
} from './toast';

// ============================================================================
// METADATA UTILITIES
// ============================================================================

/**
 * Metadata Generation
 * SEO-optimized metadata generation for all pages with Open Graph,
 * Twitter Cards, and structured data support.
 */
export {
  baseMetadata,
  viewport,
  generateMetadata,
  generateStructuredData,
  structuredDataTemplates,
  healthcareMetadata,
} from './metadata';

export type { PageMetadataConfig, StructuredDataConfig } from './metadata';

// ============================================================================
// DEBUG AND LOGGING
// ============================================================================

/**
 * Debug and Logging Utilities
 * Namespaced debug logging for development and troubleshooting.
 */
export { createLogger } from './debug';

// ============================================================================
// LEGACY STUDENT VALIDATION (BACKWARD COMPATIBILITY)
// ============================================================================

/**
 * Legacy Student Validation
 * Backward compatibility export for the old studentValidation module location.
 * Prefer importing from './validation/studentValidation' for new code.
 */
export * from './studentValidation';

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

/**
 * Default export object for backward compatibility.
 * Contains commonly used utilities.
 *
 * Note: Prefer named imports for better tree-shaking.
 */
import { cn } from './cn';
import { showSuccessToast, showErrorToast } from './toast';
import { formatDate } from './dateUtils';
import { sanitizeText, sanitizeHtml } from './sanitization';
import { generateId, generateUUID } from './generators';
import { debounce, throttle } from './performance';

export default {
  // UI utilities
  cn,
  showSuccessToast,
  showErrorToast,

  // Date utilities
  formatDate,

  // Security
  sanitizeText,
  sanitizeHtml,

  // Generators
  generateId,
  generateUUID,

  // Performance
  debounce,
  throttle,
};
