/**
 * @fileoverview Health Monitor Main Orchestrator
 * @module services/resilience/HealthMonitor/HealthMonitor
 * @category Resilience Services
 *
 * Main orchestrator class that coordinates metrics calculation and degradation detection
 * for comprehensive endpoint health monitoring. Integrates MetricsCalculator and
 * DegradationDetector to provide a unified health monitoring interface.
 */

import type {
  EndpointHealth,
  DegradationAlert,
  HealthCheckResult,
  HealthReport,
  HealthThresholds,
  HealthEventListener,
  UnsubscribeFunction
} from './types';
import { ResilienceEvent } from '../types';
import { MetricsCalculator } from './MetricsCalculator';
import { DegradationDetector } from './DegradationDetector';

/**
 * Health Monitor Orchestrator Class
 *
 * @class
 * @classdesc Main orchestrator that coordinates health monitoring activities including
 * metrics calculation, degradation detection, and event management. Provides a unified
 * interface for comprehensive endpoint health tracking.
 *
 * Architecture:
 * - Delegates metrics calculation to MetricsCalculator
 * - Delegates degradation detection to DegradationDetector
 * - Maintains endpoint health records and response time data
 * - Coordinates between components for efficient monitoring
 * - Provides unified API for health monitoring operations
 */
export class HealthMonitor {
  private endpointHealth: Map<string, EndpointHealth> = new Map();
  private responseTimes: Map<string, number[]> = new Map();
  private metricsCalculator: MetricsCalculator;
  private degradationDetector: DegradationDetector;
  private eventListeners: Set<HealthEventListener> = new Set();
  private maxResponseTimes: number = 1000;

  /**
   * Create health monitor with optional configuration
   *
   * @param {Partial<HealthThresholds>} [initialThresholds] - Initial degradation thresholds
   * @param {number} [maxResponseTimes=1000] - Maximum response times to keep per endpoint
   */
  constructor(initialThresholds?: Partial<HealthThresholds>, maxResponseTimes: number = 1000) {
    this.metricsCalculator = new MetricsCalculator();
    this.degradationDetector = new DegradationDetector(initialThresholds);
    this.maxResponseTimes = maxResponseTimes;

    // Forward degradation events from detector
    this.degradationDetector.onEvent((event) => {
      this.emitEvent(event);
    });
  }

  /**
   * Record a successful request for endpoint health tracking
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {number} responseTime - Response time in milliseconds
   * @returns {void}
   */
  public recordSuccess(endpoint: string, responseTime: number): void {
    const health = this.getOrCreateHealth(endpoint);
    health.totalRequests++;
    health.successfulRequests++;
    health.lastRequestTime = Date.now();
    
    this.updateResponseTimes(endpoint, responseTime);
    this.updateMetrics(endpoint, health);
  }

  /**
   * Record a failed request for endpoint health tracking
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {number} [responseTime] - Optional response time in milliseconds
   * @returns {void}
   */
  public recordFailure(endpoint: string, responseTime?: number): void {
    const health = this.getOrCreateHealth(endpoint);
    health.totalRequests++;
    health.failedRequests++;
    health.lastRequestTime = Date.now();

    if (responseTime !== undefined) {
      this.updateResponseTimes(endpoint, responseTime);
    }

    this.updateMetrics(endpoint, health);
    this.checkDegradation(endpoint, health);
  }

  /**
   * Record a timeout request for endpoint health tracking
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {number} timeoutMs - Timeout duration in milliseconds
   * @returns {void}
   */
  public recordTimeout(endpoint: string, timeoutMs: number): void {
    const health = this.getOrCreateHealth(endpoint);
    health.totalRequests++;
    health.timeoutRequests++;
    health.failedRequests++;
    health.lastRequestTime = Date.now();
    
    this.updateResponseTimes(endpoint, timeoutMs);
    this.updateMetrics(endpoint, health);
    this.checkDegradation(endpoint, health);
  }

  /**
   * Get or create health record for endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @returns {EndpointHealth} Health record for the endpoint
   * @private
   */
  private getOrCreateHealth(endpoint: string): EndpointHealth {
    if (!this.endpointHealth.has(endpoint)) {
      this.endpointHealth.set(endpoint, {
        endpoint,
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        timeoutRequests: 0,
        successRate: 1.0,
        failureRate: 0,
        lastRequestTime: Date.now(),
        avgResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        isDegraded: false
      });

      this.responseTimes.set(endpoint, []);
    }

    return this.endpointHealth.get(endpoint)!;
  }

  /**
   * Update response times for endpoint with sliding window
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {number} responseTime - Response time in milliseconds
   * @returns {void}
   * @private
   */
  private updateResponseTimes(endpoint: string, responseTime: number): void {
    let times = this.responseTimes.get(endpoint);
    
    if (!times) {
      times = [];
      this.responseTimes.set(endpoint, times);
    }

    times.push(responseTime);

    // Keep only last N response times for percentile calculation
    if (times.length > this.maxResponseTimes) {
      times.shift();
    }
  }

  /**
   * Update computed metrics for endpoint using MetricsCalculator
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {EndpointHealth} health - Health record to update
   * @returns {void}
   * @private
   */
  private updateMetrics(endpoint: string, health: EndpointHealth): void {
    const responseTimes = this.responseTimes.get(endpoint) || [];
    this.metricsCalculator.updateHealthMetrics(health, responseTimes);
    this.endpointHealth.set(endpoint, health);
  }

  /**
   * Check for degradation patterns using DegradationDetector
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {EndpointHealth} health - Health record to check
   * @returns {void}
   * @private
   */
  private checkDegradation(endpoint: string, health: EndpointHealth): void {
    this.degradationDetector.checkDegradation(health);
  }

  /**
   * Emit event to all registered listeners
   *
   * @param {ResilienceEvent} event - Event to emit
   * @returns {void}
   * @private
   */
  private emitEvent(event: ResilienceEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in health monitor event listener:', error);
      }
    });
  }

  /**
   * Register event listener for health monitoring events
   *
   * @param {HealthEventListener} listener - Event listener callback function
   * @returns {UnsubscribeFunction} Unsubscribe function to remove the listener
   */
  public onEvent(listener: HealthEventListener): UnsubscribeFunction {
    this.eventListeners.add(listener);
    
    // Also forward events from degradation detector
    const detectorUnsubscribe = this.degradationDetector.onEvent(listener);
    
    return () => {
      this.eventListeners.delete(listener);
      detectorUnsubscribe();
    };
  }

  /**
   * Get health status for a specific endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @returns {EndpointHealth | undefined} Health status for the endpoint
   */
  public getHealth(endpoint: string): EndpointHealth | undefined {
    return this.endpointHealth.get(endpoint);
  }

  /**
   * Get all endpoint health statuses
   *
   * @returns {Map<string, EndpointHealth>} Map of endpoint to health status
   */
  public getAllHealth(): Map<string, EndpointHealth> {
    return new Map(this.endpointHealth);
  }

  /**
   * Get list of degraded endpoints
   *
   * @returns {EndpointHealth[]} Array of health records for degraded endpoints
   */
  public getDegradedEndpoints(): EndpointHealth[] {
    const degraded: EndpointHealth[] = [];
    this.endpointHealth.forEach(health => {
      if (health.isDegraded) {
        degraded.push(health);
      }
    });
    return degraded;
  }

  /**
   * Get recent degradation alerts
   *
   * @param {number} [limit=10] - Maximum number of alerts to return
   * @returns {DegradationAlert[]} Array of recent alerts
   */
  public getRecentAlerts(limit: number = 10): DegradationAlert[] {
    return this.degradationDetector.getRecentAlerts(limit);
  }

  /**
   * Get alerts for a specific endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {number} [limit=10] - Maximum number of alerts to return
   * @returns {DegradationAlert[]} Array of alerts for the endpoint
   */
  public getAlertsForEndpoint(endpoint: string, limit: number = 10): DegradationAlert[] {
    return this.degradationDetector.getAlertsForEndpoint(endpoint, limit);
  }

  /**
   * Update degradation detection thresholds
   *
   * @param {Partial<HealthThresholds>} thresholds - New threshold values
   * @returns {void}
   */
  public updateThresholds(thresholds: Partial<HealthThresholds>): void {
    this.degradationDetector.updateThresholds(thresholds);
  }

  /**
   * Get current degradation thresholds
   *
   * @returns {HealthThresholds} Current threshold configuration
   */
  public getThresholds(): HealthThresholds {
    return this.degradationDetector.getThresholds();
  }

  /**
   * Reset health metrics for a specific endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @returns {void}
   */
  public resetEndpoint(endpoint: string): void {
    this.endpointHealth.delete(endpoint);
    this.responseTimes.delete(endpoint);
  }

  /**
   * Reset all health metrics
   *
   * @returns {void}
   */
  public resetAll(): void {
    this.endpointHealth.clear();
    this.responseTimes.clear();
    this.degradationDetector.clearAlerts();
  }

  /**
   * Get comprehensive health report
   *
   * @returns {HealthReport} Comprehensive health report
   */
  public getHealthReport(): HealthReport {
    const endpoints = Array.from(this.endpointHealth.values());
    const degradedCount = endpoints.filter(e => e.isDegraded).length;
    const overallHealthScore = this.metricsCalculator.calculateOverallHealthScore(endpoints);

    return {
      totalEndpoints: endpoints.length,
      degradedCount,
      endpoints,
      recentAlerts: this.degradationDetector.getRecentAlerts(20),
      overallHealthScore
    };
  }

  /**
   * Perform active health check on an endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {() => Promise<void>} checkFn - Health check function
   * @returns {Promise<HealthCheckResult>} Result of the health check
   */
  public async healthCheck(endpoint: string, checkFn: () => Promise<void>): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      await Promise.race([
        checkFn(),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('Health check timeout')), 5000)
        )
      ]);

      const responseTime = performance.now() - startTime;
      this.recordSuccess(endpoint, responseTime);

      return {
        endpoint,
        healthy: true,
        responseTime,
        timestamp: Date.now()
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      this.recordFailure(endpoint, responseTime);

      return {
        endpoint,
        healthy: false,
        responseTime,
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Calculate health score for a specific endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @returns {number} Health score (0-100)
   */
  public getEndpointHealthScore(endpoint: string): number {
    const health = this.endpointHealth.get(endpoint);
    if (!health) return 0;
    
    return this.metricsCalculator.calculateEndpointHealthScore(health);
  }

  /**
   * Check if endpoint has active alerts
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {number} [timeWindowMs=300000] - Time window to check (5 minutes)
   * @returns {boolean} True if endpoint has recent alerts
   */
  public hasActiveAlerts(endpoint: string, timeWindowMs: number = 300000): boolean {
    return this.degradationDetector.hasActiveAlerts(endpoint, timeWindowMs);
  }

  /**
   * Get endpoints with critical alerts
   *
   * @param {number} [timeWindowMs=600000] - Time window to check (10 minutes)
   * @returns {string[]} Array of endpoints with critical alerts
   */
  public getCriticalEndpoints(timeWindowMs: number = 600000): string[] {
    return this.degradationDetector.getCriticalEndpoints(timeWindowMs);
  }

  /**
   * Get alert statistics
   *
   * @returns {object} Alert statistics summary
   */
  public getAlertStats(): ReturnType<DegradationDetector['getAlertStats']> {
    return this.degradationDetector.getAlertStats();
  }
}
