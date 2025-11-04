/**
 * @fileoverview Service Health Management
 * @module services/core/ServiceHealthManager
 * @category Services
 *
 * Manages health monitoring and circuit breaker patterns for registered services.
 * Performs periodic health checks, tracks service availability, and manages
 * circuit breaker states to prevent cascading failures.
 *
 * Key Features:
 * - Periodic automated health checks
 * - Circuit breaker state management
 * - Health status tracking with timestamps
 * - Error rate and response time monitoring
 * - Availability percentage calculation
 *
 * @exports ServiceHealthManager
 */

import type { ServiceHealth, ServiceStatus } from './ServiceRegistry.types';

// ==========================================
// SERVICE HEALTH MANAGER CLASS
// ==========================================

/**
 * Manages health monitoring for all registered services
 */
export class ServiceHealthManager {
  private health: Map<string, ServiceHealth> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private services: Map<string, any> = new Map();

  /**
   * Initialize a service's health tracking
   */
  public initializeServiceHealth(serviceId: string): void {
    this.health.set(serviceId, {
      serviceId,
      status: 'UNKNOWN',
      lastCheck: new Date(),
      responseTime: 0,
      errorRate: 0,
      throughput: 0,
      availabilityPercentage: 100,
      circuitBreakerState: 'CLOSED'
    });
  }

  /**
   * Register a service for health monitoring
   */
  public registerService(serviceId: string, service: any): void {
    this.services.set(serviceId, service);
    this.initializeServiceHealth(serviceId);
  }

  /**
   * Get health status for a specific service
   */
  public getServiceHealth(serviceId: string): ServiceHealth | undefined {
    return this.health.get(serviceId);
  }

  /**
   * Get all service health statuses
   */
  public getAllHealth(): Map<string, ServiceHealth> {
    return new Map(this.health);
  }

  /**
   * Update service health status
   */
  public updateServiceHealth(
    serviceId: string,
    status: ServiceStatus,
    responseTime?: number,
    error?: string
  ): void {
    const health = this.health.get(serviceId);
    if (!health) return;

    health.status = status;
    health.lastCheck = new Date();

    if (responseTime !== undefined) {
      health.responseTime = responseTime;
    }

    if (error) {
      health.lastError = error;
    }

    // Update circuit breaker state based on health
    health.circuitBreakerState = this.determineCircuitBreakerState(status);

    this.health.set(serviceId, health);
  }

  /**
   * Update error rate for a service
   */
  public updateErrorRate(serviceId: string, errorRate: number): void {
    const health = this.health.get(serviceId);
    if (health) {
      health.errorRate = errorRate;
      this.health.set(serviceId, health);
    }
  }

  /**
   * Start automated health checking
   */
  public startHealthChecking(intervalMs: number = 30000): void {
    if (this.healthCheckInterval) {
      return; // Already running
    }

    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks().catch(error => {
        console.error('[HEALTH MANAGER] Health check failed:', error);
      });
    }, intervalMs);

    console.log(`[HEALTH MANAGER] Started health checking (interval: ${intervalMs}ms)`);
  }

  /**
   * Stop automated health checking
   */
  public stopHealthChecking(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('[HEALTH MANAGER] Stopped health checking');
    }
  }

  /**
   * Perform health checks on all registered services
   */
  private async performHealthChecks(): Promise<void> {
    for (const [serviceId, service] of this.services.entries()) {
      try {
        // If service has a health check method, use it
        if (typeof service.healthCheck === 'function') {
          const start = Date.now();
          const isHealthy = await service.healthCheck();
          const responseTime = Date.now() - start;

          this.updateServiceHealth(
            serviceId,
            isHealthy ? 'HEALTHY' : 'UNHEALTHY',
            responseTime
          );
        }
      } catch (error) {
        this.updateServiceHealth(
          serviceId,
          'UNHEALTHY',
          undefined,
          error instanceof Error ? error.message : 'Health check failed'
        );
      }
    }
  }

  /**
   * Determine circuit breaker state based on health status
   */
  private determineCircuitBreakerState(
    status: ServiceStatus
  ): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    switch (status) {
      case 'UNHEALTHY':
        return 'OPEN';
      case 'DEGRADED':
        return 'HALF_OPEN';
      default:
        return 'CLOSED';
    }
  }

  /**
   * Check if service is healthy
   */
  public isServiceHealthy(serviceId: string): boolean {
    const health = this.health.get(serviceId);
    return health?.status === 'HEALTHY';
  }

  /**
   * Unregister a service from health monitoring
   */
  public unregisterService(serviceId: string): void {
    this.health.delete(serviceId);
    this.services.delete(serviceId);
  }

  /**
   * Clear all health data
   */
  public clear(): void {
    this.health.clear();
    this.services.clear();
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.stopHealthChecking();
    this.clear();
  }
}
