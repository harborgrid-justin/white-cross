/**
 * Shared services module - centralized exports
 */

// Base classes
export { BaseService } from './base/BaseService';
export type { BaseServiceConfig } from './base/BaseService';

// Common types
export * from './types/common';
export * from './types/pagination';

// Validation utilities
export * from './validation/commonValidators';

// Database utilities
export * from './database/pagination';

// Re-export commonly used utilities with aliases for convenience
export {
  validateUUID as validateId,
  validateRequiredFields as validateRequired,
  combineValidationResults as combineValidations
} from './validation/commonValidators';

export {
  buildPaginationQuery as buildPagination,
  createPaginatedResponse as paginate,
  extractPaginationFromQuery as extractPagination
} from './database/pagination';
