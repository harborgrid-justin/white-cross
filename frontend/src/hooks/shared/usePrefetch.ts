/**
 * Smart Prefetch Hook
 *
 * Advanced prefetching strategies including:
 * - Prefetch on hover with configurable delay
 * - Prefetch next page
 * - Predictive prefetching based on navigation patterns
 * - Smart prefetching (only when network idle)
 * - Priority-based prefetching
 *
 * This file re-exports from modular implementations in the prefetch/ directory
 */

export {
  useNetworkIdle,
  usePrefetch,
  usePrefetchListItem,
  usePrefetchNextPage,
  usePredictivePrefetch,
  useSmartPrefetchManager,
  type UsePrefetchOptions
} from './prefetch';
