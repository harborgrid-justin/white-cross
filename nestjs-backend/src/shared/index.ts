/**
 * @fileoverview Shared Module - Central Export Point
 * @module shared
 * @description Central export point for all shared utilities, services, and types
 *
 * This module provides access to:
 * - NestJS modules (LoggingModule, CacheModule, SharedModule)
 * - Services (LoggerService, CacheService, AuthenticationService, ValidationService)
 * - Pure utility functions (array, object, string, date, password, validation)
 * - Security utilities (authentication, permissions, rate limiting, SQL sanitization)
 * - Type utilities and guards
 * - Domain-specific utilities (healthcare, communication, files, time, monitoring)
 */

// ==========================================
// MODULES
// ==========================================
export { SharedModule } from './shared.module';
export { LoggingModule } from './logging/logging.module';
export { CacheModule } from './cache/cache.module';

// ==========================================
// SERVICES
// ==========================================
export * from './logging/logger.service';
export * from './cache/cache.service';
export * from './security/authentication.service';
export * from './security/validation.service';

// ==========================================
// UTILITIES (Pure Functions)
// ==========================================

// Array utilities
export * from './utilities/array.utils';
export * from './utilities/array';

// Object utilities
export * from './utilities/object.utils';
export * from './utilities/object';

// String utilities
export * from './utilities/string.utils';
export * from './utilities/string';

// Date utilities
export * from './utilities/date.utils';
export * from './utilities/date';
export * from './utilities/dateHelpers';

// Password utilities
export * from './utilities/password.utils';

// Validation utilities
export * from './utilities/validation.utils';

// Response helpers
export * from './utilities/responseHelpers';

// Pagination utilities
export * from './utilities/pagination';

// Payload helpers
export * from './utilities/payloadHelpers';

// Resilience utilities (retry, timeout)
export * from './utilities/resilience';

// ==========================================
// SECURITY UTILITIES
// ==========================================
export * from './security';

// ==========================================
// PERMISSIONS
// ==========================================
export * from './permissions';

// ==========================================
// TYPES
// ==========================================
export * from './types';

// ==========================================
// DATABASE UTILITIES
// ==========================================
export * from './database';

// ==========================================
// CONFIGURATION UTILITIES
// ==========================================
export * from './config';

// ==========================================
// MONITORING UTILITIES
// ==========================================
export * from './monitoring';

// ==========================================
// TIME UTILITIES
// ==========================================
export * from './time';

// ==========================================
// COMMUNICATION UTILITIES
// ==========================================
export * from './communication';

// ==========================================
// FILE UTILITIES
// ==========================================
export * from './files';

// ==========================================
// HEALTHCARE UTILITIES
// ==========================================
export * from './healthcare';

// ==========================================
// ERROR UTILITIES
// ==========================================
export * from './errors';

// ==========================================
// CONSTANTS
// ==========================================
export * from './constants';

// ==========================================
// BASE CLASSES
// ==========================================
export { BaseService } from './base/BaseService';
export type { BaseServiceConfig } from './base/BaseService';

// ==========================================
// VALIDATION (Existing)
// ==========================================
export * from './validation/commonValidators';

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
