/**
 * WF-COMP-346 | optimisticHelpers.ts - Optimistic update helpers barrel export
 * Purpose: Main entry point for optimistic update helper functions
 * Upstream: ./optimisticHelpers.types, ./optimisticHelpers.utils, ./optimisticHelpers.mutations, ./optimisticHelpers.transactions
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: optimisticUpdates
 * Exports: All optimistic helper functions and types
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: Barrel export maintaining backward compatibility for all optimistic helper utilities
 */

/**
 * Optimistic Update Helper Functions
 *
 * Utility functions for common optimistic update patterns with TanStack Query.
 * Provides simple, type-safe functions for create, update, and delete operations.
 *
 * This module has been refactored into focused submodules for better organization:
 * - optimisticHelpers.types.ts - Type definitions
 * - optimisticHelpers.utils.ts - Utility functions (temp IDs, merge, cache)
 * - optimisticHelpers.mutations.ts - CRUD operations
 * - optimisticHelpers.bulk.ts - Bulk operations
 * - optimisticHelpers.transactions.ts - Transaction and rollback support
 *
 * All exports are re-exported from this barrel file to maintain backward compatibility.
 *
 * @module OptimisticHelpers
 * @version 2.0.0
 */

// =====================
// TYPE EXPORTS
// =====================

export type {
  OptimisticCreateResult,
  OptimisticBulkCreateResult,
} from './optimisticHelpers.types';

// =====================
// UTILITY EXPORTS
// =====================

export {
  generateTempId,
  isTempId,
  replaceTempId,
  replaceTempIdsInArray,
  updateEntityInList,
  removeEntityFromList,
  defaultMergeFn,
  deepMergeFn,
} from './optimisticHelpers.utils';

// =====================
// MUTATION EXPORTS
// =====================

export {
  optimisticCreate,
  optimisticUpdate,
  optimisticUpdateInList,
  optimisticDelete,
  optimisticDeleteFromList,
} from './optimisticHelpers.mutations';

// =====================
// BULK OPERATION EXPORTS
// =====================

export {
  optimisticBulkCreate,
  optimisticBulkDelete,
} from './optimisticHelpers.bulk';

// =====================
// TRANSACTION EXPORTS
// =====================

export {
  rollbackUpdate,
  confirmUpdate,
  confirmCreate,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} from './optimisticHelpers.transactions';
