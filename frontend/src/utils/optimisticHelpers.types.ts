/**
 * WF-COMP-346 | optimisticHelpers.types.ts - Type definitions
 * Purpose: Type definitions for optimistic update helpers
 * Upstream: @tanstack/react-query, @/types/common
 * Downstream: optimisticHelpers.mutations, optimisticHelpers.transactions
 * Related: optimisticUpdates
 * Exports: types and interfaces
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Type system for optimistic update operations
 * LLM Context: Type definitions for optimistic helpers module
 */

import { BaseEntity } from '@/types/common';

/**
 * Result type for optimistic create operations
 */
export interface OptimisticCreateResult<T extends BaseEntity> {
  /** ID of the optimistic update in the manager */
  updateId: string;
  /** Temporary ID assigned to the new entity */
  tempId: string;
  /** The temporary entity with generated ID and timestamps */
  tempEntity: T;
}

/**
 * Result type for optimistic bulk create operations
 */
export interface OptimisticBulkCreateResult<T extends BaseEntity> {
  /** ID of the optimistic update in the manager */
  updateId: string;
  /** Array of temporary entities with generated IDs */
  tempEntities: T[];
  /** Map from temporary IDs to real IDs (populated after confirmation) */
  tempIdMap: Map<string, string>;
}
