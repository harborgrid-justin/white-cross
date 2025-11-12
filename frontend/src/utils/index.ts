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
 * Student, User, and Document Validation
 * Comprehensive validation functions for all data types.
 */
export * from './exports/validation';

// ============================================================================
// API ADAPTERS
// ============================================================================

/**
 * API Response Adapters
 * Type-safe utilities for transforming API responses.
 */
export * from './exports/api';

// ============================================================================
// PERFORMANCE AND OPTIMISTIC UPDATES
// ============================================================================

/**
 * Performance Optimization and Optimistic Updates
 * React hooks, monitoring, and optimistic update management.
 */
export * from './exports/performance';

// ============================================================================
// NAVIGATION AND ERROR HANDLING
// ============================================================================

/**
 * Navigation and Error Handling
 * Permission checking, navigation filtering, and error recovery.
 */
export * from './exports/navigation';

// ============================================================================
// SECURITY UTILITIES
// ============================================================================

/**
 * Security and Sanitization
 * Input sanitization and token security management.
 */
export * from './exports/security';

// ============================================================================
// HEALTHCARE UTILITIES
// ============================================================================

/**
 * Healthcare-Specific Utilities
 * Medication and health records management.
 */
export * from './exports/healthcare';

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Formatting, Dates, and Generators
 * Date utilities, formatters, generators, and lodash wrappers.
 */
export * from './exports/formatting';

// ============================================================================
// UI UTILITIES
// ============================================================================

/**
 * UI Components and Metadata
 * Class names, toast notifications, metadata, and debugging.
 */
export * from './exports/ui';

// ============================================================================
// LEGACY STUDENT VALIDATION (BACKWARD COMPATIBILITY)
// ============================================================================

/**
 * Legacy Student Validation
 * Backward compatibility export for the old studentValidation module location.
 * Prefer importing from './exports/validation' for new code.
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
