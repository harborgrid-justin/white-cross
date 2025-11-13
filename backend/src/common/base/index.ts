/**
 * Base Services Index - Centralized exports for all base service classes
 *
 * Provides easy access to all base service implementations for reducing
 * code duplication across the White Cross healthcare platform.
 */

export * from './base.service';
export * from './base-crud.service';
export * from './base-healthcare.service';
export * from './base-repository.service';

// Legacy exports
export { BaseService } from './base.service';

// Re-export commonly used types and interfaces
export type { CrudOperationResult, PaginationParams, FilterParams } from './base-crud.service';

export type { PHIAccessContext, HealthcareValidationResult } from './base-healthcare.service';

export type { CacheOptions, QueryOptimization, RepositoryMetrics } from './base-repository.service';
