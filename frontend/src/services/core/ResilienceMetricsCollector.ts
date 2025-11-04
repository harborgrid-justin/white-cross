/**
 * @fileoverview Metrics aggregation for resilience patterns
 * @module services/core/ResilienceMetricsCollector
 * @category Services
 *
 * Centralized metrics collection and aggregation for all resilience components:
 * - Circuit breaker metrics (state, failure rates)
 * - Bulkhead metrics (queue length, concurrent requests)
 * - Deduplication metrics (cache hits, savings)
 * - Health monitoring metrics (endpoint health, degradation)
 *
 * This module extracts metrics aggregation logic from ResilientApiClient
 * to maintain single responsibility and provide a clean metrics API.
 */

import type {
  CircuitBreakerRegistry,
  Bulkhead,
  RequestDeduplicator,
  HealthMonitor,
  CircuitBreakerMetrics,
  BulkheadMetrics,
  DeduplicationMetrics,
  EndpointHealth,
  DegradationAlert
} from '../resilience';

/**
 * Health report from HealthMonitor
 */
export interface HealthReport {
  totalEndpoints: number;
  degradedCount: number;
  endpoints: EndpointHealth[];
  recentAlerts: DegradationAlert[];
  overallHealthScore: number;
}

/**
 * Aggregated metrics from all resilience components
 */
export interface AggregatedResilienceMetrics {
  circuitBreakers: Map<string, CircuitBreakerMetrics>;
  bulkhead: BulkheadMetrics;
  deduplication: DeduplicationMetrics;
  health: HealthReport;
  timestamp: number;
}

/**
 * Configuration for metrics collection
 */
export interface MetricsCollectorConfig {
  circuitBreakerRegistry: CircuitBreakerRegistry;
  bulkhead: Bulkhead;
  deduplicator: RequestDeduplicator;
  healthMonitor: HealthMonitor;
}

/**
 * Resilience Metrics Collector
 *
 * Aggregates and provides access to metrics from all resilience components.
 * Useful for monitoring dashboards, health checks, and debugging.
 *
 * @example
 * ```typescript
 * const collector = new ResilienceMetricsCollector({
 *   circuitBreakerRegistry,
 *   bulkhead,
 *   deduplicator,
 *   healthMonitor
 * });
 *
 * // Get all metrics
 * const metrics = collector.getAllMetrics();
 * console.log('Circuit breaker states:', metrics.circuitBreakers);
 * console.log('Bulkhead queue length:', metrics.bulkhead.queueLength);
 * console.log('Deduplication cache hits:', metrics.deduplication.cacheHits);
 *
 * // Get specific component metrics
 * const circuitMetrics = collector.getCircuitBreakerMetrics();
 * const healthReport = collector.getHealthReport();
 * ```
 */
export class ResilienceMetricsCollector {
  private circuitBreakerRegistry: CircuitBreakerRegistry;
  private bulkhead: Bulkhead;
  private deduplicator: RequestDeduplicator;
  private healthMonitor: HealthMonitor;

  constructor(config: MetricsCollectorConfig) {
    this.circuitBreakerRegistry = config.circuitBreakerRegistry;
    this.bulkhead = config.bulkhead;
    this.deduplicator = config.deduplicator;
    this.healthMonitor = config.healthMonitor;
  }

  /**
   * Get all metrics from all resilience components
   *
   * @returns Aggregated metrics with timestamp
   */
  public getAllMetrics(): AggregatedResilienceMetrics {
    return {
      circuitBreakers: this.circuitBreakerRegistry.getAllMetrics(),
      bulkhead: this.bulkhead.getMetrics(),
      deduplication: this.deduplicator.getMetrics(),
      health: this.healthMonitor.getHealthReport(),
      timestamp: Date.now()
    };
  }

  /**
   * Get circuit breaker metrics for all endpoints
   *
   * @returns Map of endpoint URL to circuit breaker metrics
   */
  public getCircuitBreakerMetrics(): Map<string, CircuitBreakerMetrics> {
    return this.circuitBreakerRegistry.getAllMetrics();
  }

  /**
   * Get bulkhead metrics (queue length, concurrent requests, etc.)
   *
   * @returns Current bulkhead metrics
   */
  public getBulkheadMetrics(): BulkheadMetrics {
    return this.bulkhead.getMetrics();
  }

  /**
   * Get request deduplication metrics
   *
   * @returns Deduplication cache statistics
   */
  public getDeduplicationMetrics(): DeduplicationMetrics {
    return this.deduplicator.getMetrics();
  }

  /**
   * Get health monitoring report
   *
   * @returns Health status for all monitored endpoints
   */
  public getHealthReport(): HealthReport {
    return this.healthMonitor.getHealthReport();
  }

  /**
   * Get metrics summary for monitoring dashboards
   *
   * Provides a condensed view of the most important metrics:
   * - Number of open circuit breakers (failing endpoints)
   * - Current bulkhead utilization
   * - Deduplication effectiveness
   * - Overall system health
   *
   * @returns Summary metrics for quick health assessment
   */
  public getSummary(): {
    openCircuitBreakers: number;
    halfOpenCircuitBreakers: number;
    totalActiveRequests: number;
    totalQueuedRequests: number;
    deduplicationSavings: number;
    degradedEndpoints: number;
  } {
    const circuitMetrics = this.getCircuitBreakerMetrics();
    const bulkheadMetrics = this.getBulkheadMetrics();
    const deduplicationMetrics = this.getDeduplicationMetrics();
    const healthReport = this.getHealthReport();

    // Count circuit breaker states
    let openCircuitBreakers = 0;
    let halfOpenCircuitBreakers = 0;
    circuitMetrics.forEach(metrics => {
      if (metrics.state === 'OPEN') {
        openCircuitBreakers++;
      } else if (metrics.state === 'HALF_OPEN') {
        halfOpenCircuitBreakers++;
      }
    });

    // Calculate total active and queued requests from bulkhead
    const totalActiveRequests =
      bulkheadMetrics.activeByCriticality.CRITICAL +
      bulkheadMetrics.activeByCriticality.HIGH +
      bulkheadMetrics.activeByCriticality.NORMAL +
      bulkheadMetrics.activeByCriticality.LOW;

    const totalQueuedRequests =
      bulkheadMetrics.queuedByCriticality.CRITICAL +
      bulkheadMetrics.queuedByCriticality.HIGH +
      bulkheadMetrics.queuedByCriticality.NORMAL +
      bulkheadMetrics.queuedByCriticality.LOW;

    // Calculate deduplication savings percentage
    const deduplicationSavings = deduplicationMetrics.totalRequests > 0
      ? deduplicationMetrics.duplicatedPercentage
      : 0;

    // Count degraded endpoints
    const degradedEndpoints = healthReport.endpoints.filter(e => e.isDegraded).length;

    return {
      openCircuitBreakers,
      halfOpenCircuitBreakers,
      totalActiveRequests,
      totalQueuedRequests,
      deduplicationSavings,
      degradedEndpoints
    };
  }

  /**
   * Reset all metrics across all components
   *
   * Useful for testing or clearing metrics after maintenance windows.
   */
  public resetAll(): void {
    this.circuitBreakerRegistry.resetAll();
    this.deduplicator.clearAll();
    this.bulkhead.resetMetrics();
    this.healthMonitor.resetAll();
  }
}
