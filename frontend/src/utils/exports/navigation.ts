/**
 * @fileoverview Navigation and Error Handling Utilities Barrel Export
 * @module utils/exports/navigation
 * @category Utils
 *
 * Utilities for navigation management and error handling including:
 * - Permission checking and access control
 * - Navigation item filtering
 * - Active route detection
 * - Unified error processing and recovery
 *
 * @example
 * ```typescript
 * import { filterNavigationItems, canAccessNavigationItem } from '@/utils';
 * import { processError, withErrorHandling, withRetry } from '@/utils';
 * ```
 */

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
} from '../navigationUtils.types';

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
} from '../navigationUtils';

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
} from '../errorHandling.types';

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
} from '../errorHandling';
