/**
 * WF-IDX-268 | index.ts - Base API Service Module Exports
 *
 * @module services/core/base-api
 * @description
 * Centralized exports for the modularized BaseApiService architecture.
 * Provides all types, classes, and utilities for building type-safe API services.
 *
 * @purpose
 * - Export BaseApiService class and factory function
 * - Export all type definitions (BaseEntity, FilterParams, etc.)
 * - Export operation mixins for advanced composition
 * - Export utility functions for custom implementations
 * - Maintain backward compatibility with original module
 *
 * @upstream All base-api submodules
 * @dependencies types, BaseApiService, operation mixins, utils, validation
 * @downstream All API service consumers
 * @exports All public APIs from base-api module
 *
 * @keyFeatures
 * - Single import point for all base-api functionality
 * - Type-safe exports with explicit type/value separation
 * - Re-exports for backward compatibility
 * - Organized by functional area
 *
 * @lastUpdated 2025-11-04
 * @fileType TypeScript Module Index
 * @architecture Core service layer module aggregator
 */

// ==========================================
// CORE SERVICE CLASS & FACTORY
// ==========================================

export { BaseApiService, createApiService } from './BaseApiService';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type {
  BaseEntity,
  PaginationParams,
  FilterParams,
  CrudOperations,
  PaginatedResponse,
} from './types';

// ==========================================
// OPERATION MIXINS (for advanced composition)
// ==========================================

export { CrudOperationsMixin } from './crud-operations';
export { BulkOperationsMixin } from './bulk-operations';
export { ExportImportMixin } from './export-import';
export { CustomRequestsMixin } from './custom-requests';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export { extractData, buildQueryParams, buildEndpoint } from './utils';

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

export { validateId, validateCreateData, validateUpdateData } from './validation';
