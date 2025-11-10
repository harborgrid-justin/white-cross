/**
 * Performance Components and Utilities Index
 *
 * Central export point for all performance optimization components.
 *
 * @module components/performance
 * @since 1.2.0
 */

// Virtualized Components
export * from './VirtualizedList';
export * from './VirtualizedTable';

// Re-export from hooks
export { useOptimizedQuery, usePrefetchOnInteraction } from '@/hooks/performance/useOptimizedQuery';
export {
  useDeepMemo,
  useDeepCallback,
  useStableCallback,
  useMemoizedComputation,
  useDebouncedValue,
  useThrottledValue,
} from '@/hooks/performance/useMemoizedCallback';
