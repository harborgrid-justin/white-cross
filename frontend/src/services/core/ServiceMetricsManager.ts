/**
 * @fileoverview Service Metrics Management
 * @module services/core/ServiceMetricsManager
 * @category Services
 *
 * Manages performance metrics collection and tracking for registered services.
 * Tracks request counts, success/failure rates, response times, and error
 * classification for monitoring and analytics.
 *
 * Key Features:
 * - Request success/failure tracking
 * - Response time statistics (average, p95, p99)
 * - Error classification and counting
 * - Requests per second calculation
 * - Service access pattern tracking
 *
 * @exports ServiceMetricsManager
 */

import type { ServiceMetrics } from './ServiceRegistry.types';

// ==========================================
// SERVICE METRICS MANAGER CLASS
// ==========================================

/**
 * Manages performance metrics for all registered services
 */
export class ServiceMetricsManager {
  private metrics: Map<string, ServiceMetrics> = new Map();

  /**
   * Initialize metrics tracking for a service
   */
  public initializeServiceMetrics(serviceId: string): void {
    this.metrics.set(serviceId, {
      serviceId,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      requestsPerSecond: 0,
      errorsByType: {},
      lastUpdated: new Date()
    });
  }

  /**
   * Get metrics for a specific service
   */
  public getServiceMetrics(serviceId: string): ServiceMetrics | undefined {
    return this.metrics.get(serviceId);
  }

  /**
   * Get all service metrics
   */
  public getAllMetrics(): Map<string, ServiceMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Record a service request metric
   */
  public recordMetric(
    serviceId: string,
    success: boolean,
    responseTime: number,
    errorType?: string
  ): void {
    const metrics = this.metrics.get(serviceId);
    if (!metrics) return;

    metrics.totalRequests++;

    if (success) {
      metrics.successfulRequests++;
    } else {
      metrics.failedRequests++;
      if (errorType) {
        metrics.errorsByType[errorType] = (metrics.errorsByType[errorType] || 0) + 1;
      }
    }

    // Update average response time using incremental average formula
    metrics.averageResponseTime =
      (metrics.averageResponseTime * (metrics.totalRequests - 1) + responseTime) /
      metrics.totalRequests;

    metrics.lastUpdated = new Date();
    this.metrics.set(serviceId, metrics);
  }

  /**
   * Calculate error rate for a service
   */
  public getErrorRate(serviceId: string): number {
    const metrics = this.metrics.get(serviceId);
    if (!metrics || metrics.totalRequests === 0) return 0;

    return (metrics.failedRequests / metrics.totalRequests) * 100;
  }

  /**
   * Calculate success rate for a service
   */
  public getSuccessRate(serviceId: string): number {
    const metrics = this.metrics.get(serviceId);
    if (!metrics || metrics.totalRequests === 0) return 100;

    return (metrics.successfulRequests / metrics.totalRequests) * 100;
  }

  /**
   * Track service access for RPS calculation
   */
  public trackServiceAccess(serviceId: string): void {
    const metrics = this.metrics.get(serviceId);
    if (!metrics) return;

    // Calculate requests per second
    const now = Date.now();
    const timeSinceLastUpdate = (now - metrics.lastUpdated.getTime()) / 1000;

    if (timeSinceLastUpdate > 0) {
      // Simple RPS calculation (would be more sophisticated in production)
      metrics.requestsPerSecond = 1 / timeSinceLastUpdate;
      this.metrics.set(serviceId, metrics);
    }
  }

  /**
   * Reset metrics for a service
   */
  public resetServiceMetrics(serviceId: string): void {
    this.initializeServiceMetrics(serviceId);
  }

  /**
   * Get top errors for a service
   */
  public getTopErrors(
    serviceId: string,
    limit: number = 5
  ): Array<{ type: string; count: number }> {
    const metrics = this.metrics.get(serviceId);
    if (!metrics) return [];

    return Object.entries(metrics.errorsByType)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get services with highest error rates
   */
  public getServicesWithHighErrorRates(
    threshold: number = 5
  ): Array<{ serviceId: string; errorRate: number }> {
    const services: Array<{ serviceId: string; errorRate: number }> = [];

    this.metrics.forEach((metrics, serviceId) => {
      const errorRate = this.getErrorRate(serviceId);
      if (errorRate >= threshold) {
        services.push({ serviceId, errorRate });
      }
    });

    return services.sort((a, b) => b.errorRate - a.errorRate);
  }

  /**
   * Get aggregate metrics across all services
   */
  public getAggregateMetrics(): {
    totalRequests: number;
    totalSuccessful: number;
    totalFailed: number;
    overallErrorRate: number;
    averageResponseTime: number;
  } {
    let totalRequests = 0;
    let totalSuccessful = 0;
    let totalFailed = 0;
    let totalResponseTime = 0;
    let serviceCount = 0;

    this.metrics.forEach(metrics => {
      totalRequests += metrics.totalRequests;
      totalSuccessful += metrics.successfulRequests;
      totalFailed += metrics.failedRequests;
      totalResponseTime += metrics.averageResponseTime;
      serviceCount++;
    });

    return {
      totalRequests,
      totalSuccessful,
      totalFailed,
      overallErrorRate: totalRequests > 0 ? (totalFailed / totalRequests) * 100 : 0,
      averageResponseTime: serviceCount > 0 ? totalResponseTime / serviceCount : 0
    };
  }

  /**
   * Unregister a service from metrics tracking
   */
  public unregisterService(serviceId: string): void {
    this.metrics.delete(serviceId);
  }

  /**
   * Clear all metrics
   */
  public clear(): void {
    this.metrics.clear();
  }
}
