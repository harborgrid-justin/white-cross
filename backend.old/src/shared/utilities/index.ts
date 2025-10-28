/**
 * LOC: UTILITIES_INDEX_CONSOLIDATED
 * WC-UTL-IDX-001 | Enterprise Utilities Index
 *
 * UPSTREAM (imports from):
 *   - All utility modules
 *
 * DOWNSTREAM (imported by):
 *   - Services, middleware, routes
 *   - Application components
 */

/**
 * WC-UTL-IDX-001 | Enterprise Utilities Index
 * Purpose: Centralized utility exports with proper enterprise naming standards
 * Upstream: All utility modules | Dependencies: Framework-agnostic
 * Downstream: All application layers | Called by: Services, middleware, routes
 * Related: All utility files in this directory
 * Exports: All utility functions with standardized naming | Key Services: Utility aggregation
 * Last Updated: 2025-10-21 | Dependencies: TypeScript, Node.js
 * Critical Path: Import request → Utility selection → Function execution → Code reusability
 * LLM Context: Enterprise utilities with healthcare focus, SOA compliance, naming standards
 */

// Array utilities
export * from './array.utils';

// Date utilities  
export * from './date.utils';

// Object utilities
export * from './object.utils';

// String utilities
export * from './string.utils';

// Validation utilities
export * from './validation.utils';

// Password utilities
export * from './password.utils';

// Response helper utilities (if moved to utilities)
export * from '../utils/responseHelpers';

/**
 * Consolidated utility exports for convenience
 */
export { default as ArrayUtils } from './array.utils';
export { default as DateUtils } from './date.utils';
export { default as ObjectUtils } from './object.utils';
export { default as StringUtils } from './string.utils';
export { default as ValidationUtils } from './validation.utils';
export { default as PasswordUtils } from './password.utils';

/**
 * Enterprise utility constants
 */
export const UTILITY_CONSTANTS = {
  // String constants
  DEFAULT_TRIM_CHARS: ' \t\n\r\0\x0B',
  
  // Date constants
  ISO_DATE_FORMAT: 'YYYY-MM-DD',
  ISO_DATETIME_FORMAT: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  
  // Validation constants
  DEFAULT_PASSWORD_MIN_LENGTH: 12,
  DEFAULT_EMAIL_MAX_LENGTH: 320,
  DEFAULT_NAME_MAX_LENGTH: 100,
  
  // Array constants
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
} as const;

/**
 * Enterprise utility types
 */
export type UtilityResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
};

export type PaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

/**
 * Default export for convenience
 */
export default {
  UTILITY_CONSTANTS,
  // Re-export all utilities under namespaces for organized access
  Array: {} as typeof import('./array.utils'),
  Date: {} as typeof import('./date.utils'),
  Object: {} as typeof import('./object.utils'),
  String: {} as typeof import('./string.utils'),
  Validation: {} as typeof import('./validation.utils'),
  Password: {} as typeof import('./password.utils')
};
