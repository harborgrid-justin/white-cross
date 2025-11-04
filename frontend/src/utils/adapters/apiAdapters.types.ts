/**
 * @fileoverview API Adapter Type Definitions
 * @module utils/adapters/apiAdapters.types
 * @category Utilities
 *
 * Centralized type definitions for API adapter modules.
 * Re-exports types from @/types/api/responses for use across adapter modules.
 */

export type {
  ApiResponse,
  PaginatedResponse,
  SuccessResponse,
  ErrorResponse,
} from '@/types/core/api/responses';
