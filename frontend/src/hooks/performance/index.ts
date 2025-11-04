/**
 * Performance Optimization Hooks
 *
 * Collection of hooks for improving frontend performance:
 * - Virtual scrolling for long lists
 * - Debouncing and throttling
 * - Intersection Observer for lazy loading
 * - Web Workers for CPU-intensive tasks
 *
 * @module hooks/performance
 */

export { useVirtualScroll, useDynamicVirtualScroll } from './useVirtualScroll';
export type { UseVirtualScrollOptions, UseVirtualScrollResult } from './useVirtualScroll';

export { useWebWorker, useInlineWebWorker } from './useWebWorker';
export type { UseWebWorkerOptions, UseWebWorkerResult } from './useWebWorker';

// Re-export from utils for convenience
export { debounce, throttle, memoize } from '@/utils/performance';
