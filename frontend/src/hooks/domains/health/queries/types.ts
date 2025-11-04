/**
 * WF-COMP-131 | types.ts - Shared types for health records hooks
 * Purpose: Type definitions for health records domain
 * Upstream: @/types/healthRecords | Dependencies: None
 * Downstream: All health records hook modules
 * Related: Health records hooks, services, types
 * Exports: Error classes, interfaces | Key Features: Type safety
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Type definitions for all health records operations
 * LLM Context: Type definitions and error classes for health records
 */

/**
 * Custom error for health records API failures
 */
export class HealthRecordsApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'HealthRecordsApiError';
  }
}

/**
 * Custom error for circuit breaker states
 */
export class CircuitBreakerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerError';
  }
}

/**
 * Pagination parameters for list queries
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
