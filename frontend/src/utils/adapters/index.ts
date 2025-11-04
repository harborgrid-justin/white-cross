/**
 * @fileoverview API Adapters Barrel Export
 * @module utils/adapters
 * @category Utilities
 *
 * Centralized export point for all adapter utilities.
 * Provides convenient access to type-safe API response transformation utilities.
 *
 * Module Organization:
 * - apiAdapters.ts - Main barrel export with backward compatibility
 * - apiAdapters.types.ts - Type definitions
 * - apiAdapters.core.ts - Core unwrapping utilities
 * - apiAdapters.guards.ts - Type guard functions
 * - apiAdapters.errors.ts - Error handling utilities
 * - apiAdapters.transform.ts - Response transformation utilities
 *
 * @example
 * ```typescript
 * // Import everything through barrel export
 * import { unwrapData, adaptResponse, isSuccessResponse } from '@/utils/adapters';
 *
 * // Or import from specific modules
 * import { unwrapData } from '@/utils/adapters/apiAdapters.core';
 * ```
 */

// Re-export everything from the main apiAdapters module
export * from './apiAdapters';

// Re-export type definitions for convenience
export type {
  ApiResponse,
  PaginatedResponse,
  SuccessResponse,
  ErrorResponse,
} from './apiAdapters.types';
