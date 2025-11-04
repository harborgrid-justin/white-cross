/**
 * Performance Monitor
 *
 * @module services/cache/core/PerformanceMonitor
 * @internal
 *
 * Monitors cache operation performance and alerts on slow operations.
 */

import { PERFORMANCE_CONFIG } from '../cacheConfig';
import type { PerformanceMetrics } from '../types';
import type { IPerformanceMonitor } from './types';

/**
 * Performance Monitor Implementation
 *
 * @class
 * @implements {IPerformanceMonitor}
 *
 * Monitors cache operations and reports slow performance:
 * - Configurable sampling rate (avoid overhead)
 * - Threshold-based alerting
 * - Operation-specific thresholds
 *
 * Configuration:
 * - Sampling rate controls how many operations are monitored
 * - Thresholds define acceptable latency for each operation type
 * - Can be disabled for production to reduce overhead
 *
 * Performance Impact:
 * - Minimal when sampling rate is low (default: 100%)
 * - O(1) per monitored operation
 * - Console warnings only when thresholds exceeded
 *
 * @example
 * ```typescript
 * const monitor = new PerformanceMonitor();
 *
 * monitor.recordMetric({
 *   operation: 'cache-get',
 *   duration: 15.5,
 *   timestamp: Date.now(),
 *   success: true,
 *   metadata: { key: 'user:123' }
 * });
 * ```
 */
export class PerformanceMonitor implements IPerformanceMonitor {
  /**
   * Record Performance Metric
   *
   * Records an operation's performance and alerts if it exceeds threshold.
   * Applies sampling rate to reduce monitoring overhead.
   *
   * @param metric - Performance metric to record
   *
   * @example
   * ```typescript
   * monitor.recordMetric({
   *   operation: 'cache-set',
   *   duration: 8.3,
   *   timestamp: Date.now(),
   *   success: true,
   *   metadata: { key: 'student:456', size: 2048 }
   * });
   * ```
   */
  recordMetric(metric: PerformanceMetrics): void {
    if (!PERFORMANCE_CONFIG.enabled) return;

    // Sample based on sample rate (probabilistic sampling)
    if (Math.random() > PERFORMANCE_CONFIG.sampleRate) return;

    // Check against thresholds
    const threshold = PERFORMANCE_CONFIG.thresholds[
      metric.operation as keyof typeof PERFORMANCE_CONFIG.thresholds
    ];

    if (threshold && metric.duration > threshold) {
      console.warn(
        `[CacheManager] Slow operation: ${metric.operation} took ${metric.duration}ms (threshold: ${threshold}ms)`,
        metric.metadata
      );
    }
  }

  /**
   * Check if Monitoring is Enabled
   *
   * @returns Whether performance monitoring is enabled
   *
   * @example
   * ```typescript
   * if (monitor.isEnabled()) {
   *   const start = performance.now();
   *   // ... operation ...
   *   monitor.recordMetric({...});
   * }
   * ```
   */
  isEnabled(): boolean {
    return PERFORMANCE_CONFIG.enabled;
  }
}
