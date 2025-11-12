/**
 * @fileoverview Centralized API Response Type System - Barrel Export
 * @module types/core/api/responses
 * @category Types
 *
 * This module serves as the primary export point for all API response types
 * and utilities. It maintains backward compatibility by re-exporting all types
 * from the modular structure.
 *
 * Module Structure:
 * - base-responses: Core response interfaces (ApiResponse, ErrorResponse, etc.)
 * - paginated-responses: Pagination types and utilities
 * - mutation-responses: Mutation operation types
 * - specialized-responses: Domain-specific responses (File, Export, Health)
 * - response-utilities: Helper functions for creating and unwrapping responses
 *
 * Usage:
 * ```typescript
 * import { ApiResponse, PaginatedResponse, wrapSuccessResponse } from './responses';
 * ```
 *
 * For specific imports from individual modules:
 * ```typescript
 * import { ApiResponse } from './base-responses';
 * import { PaginatedResponse } from './paginated-responses';
 * ```
 */

// ==========================================
// BASE RESPONSE TYPES
// ==========================================

export type {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  ErrorDetail,
} from './base-responses';

export {
  isErrorResponse,
  isSuccessResponse,
} from './base-responses';

// ==========================================
// PAGINATED RESPONSE TYPES
// ==========================================

export type {
  PaginatedResponse,
  PaginationInfo,
  PaginationResponse,
} from './paginated-responses';

export {
  wrapPaginatedResponse,
  unwrapPaginatedResponse,
} from './paginated-responses';

// ==========================================
// MUTATION RESPONSE TYPES
// ==========================================

export type {
  MutationResponse,
  BulkOperationResponse,
  BulkOperationResult,
} from './mutation-responses';

// ==========================================
// SPECIALIZED RESPONSE TYPES
// ==========================================

export type {
  FileUploadResponse,
  FileUploadData,
  ExportDataResponse,
  ExportDataInfo,
  HealthCheckResponse,
  HealthCheckData,
} from './specialized-responses';

// ==========================================
// RESPONSE UTILITY FUNCTIONS
// ==========================================

export {
  wrapSuccessResponse,
  createErrorResponse,
  unwrapApiResponse,
} from './response-utilities';
