/**
 * Type Definitions for Performance Utilities
 *
 * Shared type definitions and interfaces for all performance utility modules.
 *
 * @module performance-utilities.types
 * @version 1.0.0
 */

// ============================================================================
// INFINITE SCROLL TYPES
// ============================================================================

/**
 * Configuration for infinite scroll hook
 */
export interface InfiniteScrollConfig {
  /** Callback to load more items */
  onLoadMore: () => Promise<void>;
  /** Whether there are more items to load */
  hasMore?: boolean;
  /** Intersection threshold (0-1) */
  threshold?: number;
}

/**
 * Return type for infinite scroll hook
 */
export interface InfiniteScrollResult {
  /** Reference to attach to the sentinel element */
  ref: React.RefObject<HTMLDivElement | null>;
  /** Whether data is currently loading */
  isLoading: boolean;
}

// ============================================================================
// LAZY IMAGE TYPES
// ============================================================================

/**
 * Return type for lazy image hook
 */
export interface LazyImageResult {
  /** Reference to attach to the image element */
  ref: React.RefObject<HTMLImageElement | null>;
  /** Whether the image has loaded */
  loaded: boolean;
}

// ============================================================================
// RESIZE OBSERVER TYPES
// ============================================================================

/**
 * Element dimensions
 */
export interface ElementSize {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
}

// ============================================================================
// VIRTUAL SCROLL TYPES
// ============================================================================

/**
 * Configuration for virtual scroll
 */
export interface VirtualScrollConfig {
  /** Total number of items */
  itemCount: number;
  /** Height of each item in pixels */
  itemHeight: number;
  /** Height of the container in pixels */
  containerHeight: number;
  /** Number of items to render outside viewport */
  overscan?: number;
}

/**
 * Virtual scroll item info
 */
export interface VirtualScrollItem {
  /** Index of the item */
  index: number;
  /** Top position in pixels */
  top: number;
}

/**
 * Return type for virtual scroll hook
 */
export interface VirtualScrollResult {
  /** Array of visible items with their positions */
  visibleItems: VirtualScrollItem[];
  /** Total height of all items */
  totalHeight: number;
  /** Function to update scroll position */
  setScrollTop: (scrollTop: number) => void;
}

// ============================================================================
// WEB WORKER TYPES
// ============================================================================

/**
 * Web worker function type
 */
export type WorkerFunction<T, R> = (data: T) => R;

/**
 * Web worker execute function
 */
export type WorkerExecute<T, R> = (data: T) => Promise<R>;

/**
 * Web worker hook return type
 */
export type WebWorkerResult<T, R> = [WorkerExecute<T, R>, boolean];

// ============================================================================
// BATCH UPDATE TYPES
// ============================================================================

/**
 * Batch update function
 */
export type BatchUpdateFn = (update: () => void) => void;

/**
 * Flush function to execute batched updates
 */
export type FlushFn = () => void;

/**
 * Batch updates hook return type
 */
export type BatchUpdatesResult = readonly [BatchUpdateFn, FlushFn];
