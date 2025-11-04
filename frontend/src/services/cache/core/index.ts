/**
 * Cache Core Modules
 *
 * @module services/cache/core
 * @internal
 *
 * Internal modules for CacheManager implementation.
 * Not part of public API - do not export from main index.
 */

export { MemoryEstimator } from './MemoryEstimator';
export { LRUEvictionPolicy } from './LRUEvictionPolicy';
export { TagIndexManager } from './TagIndexManager';
export { CacheEventEmitter } from './CacheEventEmitter';
export { CacheStatistics } from './CacheStatistics';
export { PerformanceMonitor } from './PerformanceMonitor';

export type {
  IEvictionPolicy,
  IStatisticsTracker,
  ITagIndexManager,
  ICacheEventEmitter,
  IMemoryEstimator,
  IPerformanceMonitor,
  CacheEventListener
} from './types';
