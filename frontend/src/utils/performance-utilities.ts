/**
 * Performance Utilities for White Cross Healthcare Platform
 *
 * Comprehensive collection of performance optimization utilities including:
 * - React hooks for debouncing, throttling, and intersection observation
 * - Web Worker management
 * - Performance measurement
 * - Memoization helpers
 * - Virtual scrolling utilities
 * - Observer patterns (resize, media query)
 *
 * This is a barrel export file that re-exports all utilities from specialized modules:
 * - performance-utilities.types.ts - Type definitions and interfaces
 * - performance-utilities.hooks.ts - React hooks (debounce, throttle, intersection, etc.)
 * - performance-utilities.monitoring.ts - Performance measurement and tracking
 * - performance-utilities.optimization.ts - Optimization utilities (worker, memoization, etc.)
 * - performance-utilities.observers.ts - Observer patterns (resize, media query, virtual scroll)
 *
 * @module performance-utilities
 * @version 1.0.0
 */

// ============================================================================
// TYPE EXPORTS
// ============================================================================

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
  BatchUpdatesResult
} from './performance-utilities.types';

// ============================================================================
// HOOKS EXPORTS
// ============================================================================

export {
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useInfiniteScroll,
  useIdleCallback,
  useLazyImage,
  useBatchUpdates
} from './performance-utilities.hooks';

// ============================================================================
// MONITORING EXPORTS
// ============================================================================

export {
  performanceMark,
  performanceMeasure,
  usePerformanceTracking
} from './performance-utilities.monitoring';

// ============================================================================
// OPTIMIZATION EXPORTS
// ============================================================================

export {
  useWebWorker,
  useDeepCompareMemo,
  memoize
} from './performance-utilities.optimization';

// ============================================================================
// OBSERVER EXPORTS
// ============================================================================

export {
  useResizeObserver,
  useMediaQuery,
  useVirtualScroll
} from './performance-utilities.observers';

// ============================================================================
// DEFAULT EXPORT (for backward compatibility)
// ============================================================================

import { useDebounce, useThrottle, useIntersectionObserver, useInfiniteScroll, useIdleCallback, useLazyImage, useBatchUpdates } from './performance-utilities.hooks';
import { performanceMark, performanceMeasure, usePerformanceTracking } from './performance-utilities.monitoring';
import { useWebWorker, useDeepCompareMemo, memoize } from './performance-utilities.optimization';
import { useResizeObserver, useMediaQuery, useVirtualScroll } from './performance-utilities.observers';

export default {
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useInfiniteScroll,
  useWebWorker,
  performanceMark,
  performanceMeasure,
  usePerformanceTracking,
  useDeepCompareMemo,
  memoize,
  useIdleCallback,
  useLazyImage,
  useBatchUpdates,
  useResizeObserver,
  useMediaQuery,
  useVirtualScroll
};
