/**
 * Performance Optimization Library
 *
 * Comprehensive performance utilities for the White Cross application.
 *
 * @module lib/performance
 */

// Export all performance utilities
export * from './metrics';
export * from './lazy';
export * from './prefetch';

// Re-export commonly used items for convenience
export { performanceMetrics, initPerformanceMetrics } from './metrics';
export { lazyWithRetry, lazyWithPreload, prefetchComponent } from './lazy';
export { prefetchResource, preloadResource, intelligentPrefetcher } from './prefetch';
