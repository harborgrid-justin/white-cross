/**
 * Health Monitor Implementation
 * Tracks endpoint health metrics and detects degradation patterns
 * Enables proactive issue detection before circuit breaker triggers
 */

import {
  EndpointHealth,
  DegradationAlert,
  HealthCheckResult,
  ResilienceEvent
} from './types';

/**
 * Health Monitor
 * Tracks success/failure rates and response times per endpoint
 * Detects degradation patterns and unusual behavior
 */
export class HealthMonitor {
  private endpointHealth: Map<string, EndpointHealth> = new Map();
  private responseTimes: Map<string, number[]> = new Map();
  private degradationAlerts: DegradationAlert[] = [];
  private eventListeners: Set<(event: ResilienceEvent) => void> = new Set();

  // Thresholds for degradation detection
  private thresholds = {
    failureRateWarning: 0.1, // 10%
    failureRateCritical: 0.3, // 30%
    p95ResponseTimeWarning: 3000, // 3 seconds
    p95ResponseTimeCritical: 5000, // 5 seconds
    timeoutRateWarning: 0.05, // 5%
    timeoutRateCritical: 0.15 // 15%
  };

  /**
   * Record successful request
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
   * Record failed request
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
   * Record timeout request
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
   * Get or create endpoint health record
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
   * Update response times for endpoint
   */
  private updateResponseTimes(endpoint: string, responseTime: number): void {
    let times = this.responseTimes.get(endpoint) || [];

    if (!times) {
      times = [];
      this.responseTimes.set(endpoint, times);
    }

    times.push(responseTime);

    // Keep only last 1000 response times for percentile calculation
    if (times.length > 1000) {
      times.shift();
    }
  }

  /**
   * Update computed metrics
   */
  private updateMetrics(endpoint: string, health: EndpointHealth): void {
    const total = health.totalRequests;

    if (total === 0) {
      health.successRate = 1.0;
      health.failureRate = 0;
      return;
    }

    health.successRate = health.successfulRequests / total;
    health.failureRate = health.failedRequests / total;

    // Calculate response time percentiles
    const times = this.responseTimes.get(endpoint) || [];
    if (times.length > 0) {
      const sorted = [...times].sort((a, b) => a - b);
      health.avgResponseTime = sorted.reduce((a, b) => a + b, 0) / sorted.length;
      health.p95ResponseTime = sorted[Math.floor(sorted.length * 0.95)] || 0;
      health.p99ResponseTime = sorted[Math.floor(sorted.length * 0.99)] || 0;
    }

    this.endpointHealth.set(endpoint, health);
  }

  /**
   * Check for degradation patterns
   */
  private checkDegradation(endpoint: string, health: EndpointHealth): void {
    const alerts: DegradationAlert[] = [];

    // Check failure rate
    if (health.failureRate >= this.thresholds.failureRateCritical) {
      alerts.push({
        endpoint,
        type: 'highFailureRate',
        severity: 'critical',
        message: `Critical: ${(health.failureRate * 100).toFixed(1)}% failure rate`,
        timestamp: Date.now(),
        metrics: { failureRate: health.failureRate }
      });
    } else if (health.failureRate >= this.thresholds.failureRateWarning) {
      alerts.push({
        endpoint,
        type: 'highFailureRate',
        severity: 'high',
        message: `Warning: ${(health.failureRate * 100).toFixed(1)}% failure rate`,
        timestamp: Date.now(),
        metrics: { failureRate: health.failureRate }
      });
    }

    // Check response time
    if (health.p95ResponseTime >= this.thresholds.p95ResponseTimeCritical) {
      alerts.push({
        endpoint,
        type: 'slowResponse',
        severity: 'critical',
        message: `Critical: p95 response time ${health.p95ResponseTime.toFixed(0)}ms`,
        timestamp: Date.now(),
        metrics: { p95ResponseTime: health.p95ResponseTime }
      });
    } else if (health.p95ResponseTime >= this.thresholds.p95ResponseTimeWarning) {
      alerts.push({
        endpoint,
        type: 'slowResponse',
        severity: 'high',
        message: `Warning: p95 response time ${health.p95ResponseTime.toFixed(0)}ms`,
        timestamp: Date.now(),
        metrics: { p95ResponseTime: health.p95ResponseTime }
      });
    }

    // Check timeout rate
    const timeoutRate = health.totalRequests > 0 ? health.timeoutRequests / health.totalRequests : 0;
    if (timeoutRate >= this.thresholds.timeoutRateCritical) {
      alerts.push({
        endpoint,
        type: 'highTimeout',
        severity: 'critical',
        message: `Critical: ${(timeoutRate * 100).toFixed(1)}% timeout rate`,
        timestamp: Date.now(),
        metrics: { timeoutRequests: health.timeoutRequests }
      });
    } else if (timeoutRate >= this.thresholds.timeoutRateWarning) {
      alerts.push({
        endpoint,
        type: 'highTimeout',
        severity: 'high',
        message: `Warning: ${(timeoutRate * 100).toFixed(1)}% timeout rate`,
        timestamp: Date.now(),
        metrics: { timeoutRequests: health.timeoutRequests }
      });
    }

    // Update degradation status
    const isDegraded = alerts.some(a => a.severity === 'critical' || a.severity === 'high');
    health.isDegraded = isDegraded;
    if (isDegraded) {
      health.degradationReason = alerts.map(a => a.message).join('; ');
    }

    // Store and emit alerts
    alerts.forEach(alert => {
      this.degradationAlerts.push(alert);
      this.emitEvent({
        type: 'healthDegradation',
        endpoint,
        details: { ...alert } as Record<string, unknown>,
        timestamp: Date.now()
      });
    });

    // Keep only last 100 alerts
    if (this.degradationAlerts.length > 100) {
      this.degradationAlerts = this.degradationAlerts.slice(-100);
    }
  }

  /**
   * Emit event to listeners
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
   * Register event listener
   */
  public onEvent(listener: (event: ResilienceEvent) => void): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  /**
   * Get health status for endpoint
   */
  public getHealth(endpoint: string): EndpointHealth | undefined {
    return this.endpointHealth.get(endpoint);
  }

  /**
   * Get all endpoint health statuses
   */
  public getAllHealth(): Map<string, EndpointHealth> {
    return new Map(this.endpointHealth);
  }

  /**
   * Get degraded endpoints
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
   */
  public getRecentAlerts(limit: number = 10): DegradationAlert[] {
    return this.degradationAlerts.slice(-limit);
  }

  /**
   * Get alerts for specific endpoint
   */
  public getAlertsForEndpoint(endpoint: string, limit: number = 10): DegradationAlert[] {
    return this.degradationAlerts
      .filter(alert => alert.endpoint === endpoint)
      .slice(-limit);
  }

  /**
   * Update degradation thresholds
   */
  public updateThresholds(thresholds: Partial<typeof this.thresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  /**
   * Reset health metrics for endpoint
   */
  public resetEndpoint(endpoint: string): void {
    this.endpointHealth.delete(endpoint);
    this.responseTimes.delete(endpoint);
  }

  /**
   * Reset all metrics
   */
  public resetAll(): void {
    this.endpointHealth.clear();
    this.responseTimes.clear();
    this.degradationAlerts = [];
  }

  /**
   * Get comprehensive health report
   */
  public getHealthReport(): {
    totalEndpoints: number;
    degradedCount: number;
    endpoints: EndpointHealth[];
    recentAlerts: DegradationAlert[];
    overallHealthScore: number;
  } {
    const endpoints = Array.from(this.endpointHealth.values());
    const degradedCount = endpoints.filter(e => e.isDegraded).length;

    // Calculate overall health score (0-100)
    // Based on average success rate across all endpoints
    const avgSuccessRate = endpoints.length > 0
      ? endpoints.reduce((sum, e) => sum + e.successRate, 0) / endpoints.length
      : 1;

    const overallHealthScore = Math.round(avgSuccessRate * 100);

    return {
      totalEndpoints: endpoints.length,
      degradedCount,
      endpoints,
      recentAlerts: this.degradationAlerts.slice(-20),
      overallHealthScore
    };
  }

  /**
   * Perform health check on endpoint
   * Makes a simple request to verify endpoint availability
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
}

/**
 * Singleton instance for global health monitoring
 */
let monitorInstance: HealthMonitor | null = null;

/**
 * Get global health monitor instance
 */
export function getGlobalHealthMonitor(): HealthMonitor {
  if (!monitorInstance) {
    monitorInstance = new HealthMonitor();
  }
  return monitorInstance;
}

/**
 * Reset global health monitor (for testing)
 */
export function resetGlobalHealthMonitor(): void {
  if (monitorInstance) {
    monitorInstance.resetAll();
  }
}
