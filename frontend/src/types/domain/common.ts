/**
 * Domain Common Types
 *
 * Re-exports commonly used types from the root types directory for convenience.
 * This file provides domain-specific type aliases and augmentations.
 *
 * @module types/domain/common
 * @category Domain Types
 */

// Re-export core common types
export type {
  BaseEntity,
  TimestampFields,
  PaginatedResponse,
  PaginationMeta,
  PaginationParams,
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  AuditFields,
  EntityStatus,
  UserRole,
  ID,
  Nullable,
  Optional,
  DateRange,
  ContactInfo,
  Address,
  NameParts,
  RequestStatus,
  ActionResult,
  FileMetadata,
  SortDirection,
  FilterOperator,
  FilterCondition,
  DeepPartial,
  RequireKeys,
  OptionalKeys,
} from '../common';

// Domain-specific augmentation: Base entity with audit trail
export interface BaseAuditEntity extends import('../common').BaseEntity, import('../common').AuditFields {
  /**
   * Indicates if the entity has been soft deleted
   */
  deletedAt?: string | Date;

  /**
   * User who created this entity
   */
  createdBy?: string;

  /**
   * User who last updated this entity
   */
  updatedBy?: string;

  /**
   * User who deleted this entity (soft delete)
   */
  deletedBy?: string;
}

/**
 * Domain-specific date range filter
 */
export interface DateRangeFilter {
  startDate?: string | Date;
  endDate?: string | Date;
}

/**
 * Search parameters for domain entities
 */
export interface SearchParams extends import('../common').PaginationParams {
  query?: string;
  filters?: Record<string, unknown>;
  dateRange?: DateRangeFilter;
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult<T = unknown> {
  successful: T[];
  failed: Array<{
    item: T;
    error: string;
  }>;
  total: number;
  successCount: number;
  failureCount: number;
}

/**
 * Export type for domain entities
 */
export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json';

/**
 * Export options
 */
export interface ExportOptions {
  format: ExportFormat;
  fields?: string[];
  filters?: Record<string, unknown>;
  dateRange?: DateRangeFilter;
}

/**
 * Import result
 */
export interface ImportResult<T = unknown> {
  imported: T[];
  errors: Array<{
    row: number;
    error: string;
    data?: Record<string, unknown>;
  }>;
  totalRows: number;
  successCount: number;
  errorCount: number;
}
