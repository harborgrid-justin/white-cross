/**
 * @fileoverview Formatting Utilities Barrel Export
 * @module utils/exports/formatting
 * @category Utils
 *
 * General-purpose formatting utilities including:
 * - Date formatting and manipulation
 * - Currency, phone, and name formatting
 * - ID and value generators
 * - Lodash utility wrappers
 *
 * @example
 * ```typescript
 * import { formatDate, formatCurrency, formatPhone } from '@/utils';
 * import { generateId, generateUUID, createSlug } from '@/utils';
 * import { arrayUtils, objectUtils, stringUtils } from '@/utils';
 * ```
 */

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
} from '../dateUtils';

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
} from '../formatters';

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
} from '../generators';

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
} from '../lodashUtils';
