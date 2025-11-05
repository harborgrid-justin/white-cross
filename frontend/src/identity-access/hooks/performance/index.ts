/**
 * Performance Hooks Index
 *
 * Central export for all performance optimization hooks.
 *
 * @module hooks/performance
 */

export { useThrottle } from './useThrottle';
export { useDebounce, useDebouncedValue } from './useDebounce';
export {
  usePerformanceMonitor,
  useRenderTracker,
  getComponentMetrics,
  getAllMetrics,
  clearMetrics
} from './usePerformanceMonitor';
