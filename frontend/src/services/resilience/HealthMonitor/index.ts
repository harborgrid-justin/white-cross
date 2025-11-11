/**
 * @fileoverview Health Monitor Module Exports
 * @module services/resilience/HealthMonitor
 * @category Resilience Services
 *
 * Main entry point for the Health Monitor module providing a unified interface
 * for all health monitoring capabilities including metrics calculation,
 * degradation detection, and event management.
 */

// Main Health Monitor class
export { HealthMonitor } from './HealthMonitor';

// Supporting utility classes
export { MetricsCalculator, metricsCalculator } from './MetricsCalculator';
export { DegradationDetector, degradationDetector } from './DegradationDetector';

// Type definitions
export type {
  EndpointHealth,
  DegradationAlert,
  HealthCheckResult,
  HealthReport,
  HealthThresholds,
  HealthMonitorConfig,
  HealthEventListener,
  UnsubscribeFunction,
  HealthMonitorInterface,
  ResponseTimeStats,
  TimeSeriesMetrics,
  HealthTrend,
  AggregationPeriod,
  HealthEvent,
  HealthEventType,
  DegradationType,
  AlertSeverity
} from './types';

// Re-export resilience event types for convenience
export type { ResilienceEvent } from '../types';

// Import classes for internal use
import { HealthMonitor as HealthMonitorClass } from './HealthMonitor';
import { MetricsCalculator as MetricsCalculatorClass } from './MetricsCalculator';
import type { HealthThresholds, HealthMonitorConfig, EndpointHealth } from './types';

/**
 * Singleton instance for global health monitoring
 */
let globalHealthMonitor: HealthMonitorClass | null = null;

/**
 * Get global health monitor instance
 *
 * @param {Partial<HealthThresholds>} [thresholds] - Optional initial thresholds
 * @returns {HealthMonitor} Shared health monitor instance
 *
 * @description
 * Returns the global singleton health monitor instance. Creates the instance on
 * first access with optional threshold configuration. Use this for application-wide
 * health monitoring to ensure consistent metrics across all code.
 *
 * @example
 * ```typescript
 * import { getGlobalHealthMonitor } from '@/services/resilience/HealthMonitor';
 *
 * const monitor = getGlobalHealthMonitor({
 *   failureRateWarning: 0.05,
 *   failureRateCritical: 0.15
 * });
 *
 * // All code shares the same monitor instance
 * monitor.recordSuccess('/api/patients', 150);
 * ```
 */
export function getGlobalHealthMonitor(thresholds?: Partial<HealthThresholds>): HealthMonitorClass {
  if (!globalHealthMonitor) {
    globalHealthMonitor = new HealthMonitorClass(thresholds);
  }
  return globalHealthMonitor;
}

/**
 * Reset global health monitor (for testing)
 *
 * @returns {void}
 *
 * @description
 * Resets all metrics in the global health monitor instance and creates a new one.
 * Primarily for use in tests to ensure clean state between test runs.
 *
 * **Warning**: Do not use in production code as it clears all monitoring history.
 *
 * @example
 * ```typescript
 * // In test cleanup
 * afterEach(() => {
 *   resetGlobalHealthMonitor();
 * });
 * ```
 */
export function resetGlobalHealthMonitor(): void {
  if (globalHealthMonitor) {
    globalHealthMonitor.resetAll();
  }
  globalHealthMonitor = null;
}

/**
 * Create new health monitor instance with configuration
 *
 * @param {HealthMonitorConfig} [config] - Optional configuration
 * @returns {HealthMonitor} New health monitor instance
 *
 * @description
 * Factory function to create a new health monitor instance with optional
 * configuration. Use this when you need multiple isolated monitoring instances
 * or specific configuration that differs from the global instance.
 *
 * @example
 * ```typescript
 * import { createHealthMonitor } from '@/services/resilience/HealthMonitor';
 *
 * const criticalServicesMonitor = createHealthMonitor({
 *   thresholds: {
 *     failureRateWarning: 0.02,     // 2% for critical services
 *     failureRateCritical: 0.05,    // 5% for critical services
 *     p95ResponseTimeWarning: 1000, // 1 second warning
 *     p95ResponseTimeCritical: 2000 // 2 second critical
 *   },
 *   maxResponseTimes: 2000, // Keep more history for critical services
 *   maxAlerts: 200
 * });
 * ```
 */
export function createHealthMonitor(config?: HealthMonitorConfig): HealthMonitorClass {
  const {
    thresholds,
    maxResponseTimes,
    // maxAlerts and enableEvents would be used if we expanded the constructor
  } = config || {};

  return new HealthMonitorClass(thresholds, maxResponseTimes);
}

/**
 * Health monitor utility functions
 */
export const HealthMonitorUtils = {
  /**
   * Calculate response time percentile
   *
   * @param {number[]} responseTimes - Array of response times
   * @param {number} percentile - Percentile to calculate (0-1)
   * @returns {number} Calculated percentile value
   */
  calculatePercentile: (responseTimes: number[], percentile: number): number => {
    const calculator = new MetricsCalculatorClass();
    const stats = calculator.calculateResponseTimeStats(responseTimes);
    
    // Map common percentiles to stats properties
    switch (percentile) {
      case 0.5: return stats.median;
      case 0.95: return stats.p95;
      case 0.99: return stats.p99;
      default: {
        // Calculate custom percentile
        const sorted = [...responseTimes].sort((a, b) => a - b);
        const index = percentile * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        
        if (lower === upper || sorted.length === 0) {
          return sorted[lower] ?? 0;
        }
        
        const weight = index - lower;
        const lowerValue = sorted[lower] ?? 0;
        const upperValue = sorted[upper] ?? 0;
        return lowerValue * (1 - weight) + upperValue * weight;
      }
    }
  },

  /**
   * Check if health metrics indicate degradation
   *
   * @param {EndpointHealth} health - Health metrics to check
   * @param {Partial<HealthThresholds>} thresholds - Thresholds to check against
   * @returns {boolean} True if degraded
   */
  isDegraded: (
    health: EndpointHealth, 
    thresholds: Partial<HealthThresholds>
  ): boolean => {
    const calculator = new MetricsCalculatorClass();
    return calculator.isDegraded(health, {
      maxFailureRate: thresholds.failureRateCritical || 0.3,
      maxP95ResponseTime: thresholds.p95ResponseTimeCritical || 5000,
      maxTimeoutRate: thresholds.timeoutRateCritical || 0.15
    });
  },

  /**
   * Format health metrics for display
   *
   * @param {EndpointHealth} health - Health metrics to format
   * @returns {object} Formatted health display data
   */
  formatHealthForDisplay: (health: EndpointHealth) => ({
    endpoint: health.endpoint,
    status: health.isDegraded ? '🔴 DEGRADED' : '🟢 HEALTHY',
    successRate: `${(health.successRate * 100).toFixed(1)}%`,
    avgResponseTime: `${health.avgResponseTime.toFixed(0)}ms`,
    p95ResponseTime: `${health.p95ResponseTime.toFixed(0)}ms`,
    totalRequests: health.totalRequests.toLocaleString(),
    lastRequest: new Date(health.lastRequestTime).toLocaleString(),
    degradationReason: health.degradationReason || 'N/A'
  }),

  /**
   * Create health summary for multiple endpoints
   *
   * @param {EndpointHealth[]} endpoints - Array of endpoint health records
   * @returns {object} Health summary statistics
   */
  createHealthSummary: (endpoints: EndpointHealth[]) => {
    const calculator = new MetricsCalculatorClass();
    const total = endpoints.length;
    const degraded = endpoints.filter(e => e.isDegraded).length;
    const healthy = total - degraded;
    
    return {
      total,
      healthy,
      degraded,
      healthyPercentage: total > 0 ? ((healthy / total) * 100).toFixed(1) : '100',
      overallScore: calculator.calculateOverallHealthScore(endpoints),
      avgResponseTime: total > 0 
        ? Math.round(endpoints.reduce((sum, e) => sum + e.avgResponseTime, 0) / total)
        : 0,
      totalRequests: endpoints.reduce((sum, e) => sum + e.totalRequests, 0)
    };
  }
};

/**
 * Default health monitor configuration
 */
export const defaultHealthMonitorConfig: HealthMonitorConfig = {
  thresholds: {
    failureRateWarning: 0.1,      // 10%
    failureRateCritical: 0.3,     // 30%
    p95ResponseTimeWarning: 3000, // 3 seconds
    p95ResponseTimeCritical: 5000, // 5 seconds
    timeoutRateWarning: 0.05,     // 5%
    timeoutRateCritical: 0.15     // 15%
  },
  maxResponseTimes: 1000,
  maxAlerts: 100,
  enableEvents: true
};

/**
 * Healthcare-specific health monitor configuration
 * Stricter thresholds for critical healthcare services
 */
export const healthcareHealthMonitorConfig: HealthMonitorConfig = {
  thresholds: {
    failureRateWarning: 0.02,     // 2% for healthcare
    failureRateCritical: 0.05,    // 5% for healthcare
    p95ResponseTimeWarning: 1500, // 1.5 seconds
    p95ResponseTimeCritical: 3000, // 3 seconds
    timeoutRateWarning: 0.01,     // 1%
    timeoutRateCritical: 0.03     // 3%
  },
  maxResponseTimes: 2000, // Keep more history for compliance
  maxAlerts: 500,         // Keep more alerts for audit trail
  enableEvents: true
};
