/**
 * @fileoverview Performance and Optimistic Update Utilities Barrel Export
 * @module utils/exports/performance
 * @category Utils
 *
 * Comprehensive collection of performance optimization utilities including:
 * - React hooks (debounce, throttle, intersection observer)
 * - Performance monitoring and tracking
 * - Optimistic update management
 * - Web workers and memoization
 *
 * @example
 * ```typescript
 * import { useDebounce, useThrottle, optimisticCreate } from '@/utils';
 * import { performanceMark, performanceMeasure } from '@/utils';
 * import { OptimisticUpdateManager } from '@/utils';
 * ```
 */

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Performance Optimization Utilities
 * Comprehensive collection including React hooks, monitoring, optimization,
 * and observer patterns for optimal application performance.
 */
export type {
  InfiniteScrollConfig,
  InfiniteScrollResult,
  LazyImageResult,
  ElementSize,
  VirtualScrollConfig,
  VirtualScrollItem,
  VirtualScrollResult,
  WorkerFunction,
  WorkerExecute,
  WebWorkerResult,
  BatchUpdateFn,
  FlushFn,
  BatchUpdatesResult,
} from '../performance-utilities.types';

export {
  // Hooks
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useInfiniteScroll,
  useIdleCallback,
  useLazyImage,
  useBatchUpdates,

  // Monitoring
  performanceMark,
  performanceMeasure,
  usePerformanceTracking,

  // Optimization
  useWebWorker,
  useDeepCompareMemo,
  memoize,

  // Observers
  useResizeObserver,
  useMediaQuery,
  useVirtualScroll,
} from '../performance-utilities';

/**
 * Legacy Performance Utilities
 * Basic performance utilities (debounce, throttle) for backward compatibility.
 */
export { debounce, throttle } from '../performance';

// ============================================================================
// OPTIMISTIC UPDATE UTILITIES
// ============================================================================

/**
 * Optimistic Update System
 * Enterprise-grade optimistic update management for TanStack Query with
 * automatic rollback, race condition handling, and conflict resolution.
 */
export {
  // Enums
  UpdateStatus,
  RollbackStrategy,
  ConflictResolutionStrategy,
  OperationType,
} from '../optimisticUpdates.types';

export type {
  OptimisticUpdate,
  ConflictResolution,
  OptimisticOperationOptions,
  OptimisticUpdateStats,
} from '../optimisticUpdates.types';

export {
  OptimisticUpdateManager,
  optimisticUpdateManager,
} from '../optimisticUpdates';

/**
 * Optimistic Update Helpers
 * Simplified helper functions for common optimistic update patterns.
 */
export type {
  OptimisticCreateResult,
  OptimisticBulkCreateResult,
} from '../optimisticHelpers.types';

export {
  // Utility functions
  generateTempId,
  isTempId,
  replaceTempId,
  replaceTempIdsInArray,
  updateEntityInList,
  removeEntityFromList,
  defaultMergeFn,
  deepMergeFn,

  // CRUD operations
  optimisticCreate,
  optimisticUpdate,
  optimisticUpdateInList,
  optimisticDelete,
  optimisticDeleteFromList,

  // Bulk operations
  optimisticBulkCreate,
  optimisticBulkDelete,

  // Transactions
  rollbackUpdate,
  confirmUpdate,
  confirmCreate,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} from '../optimisticHelpers';
