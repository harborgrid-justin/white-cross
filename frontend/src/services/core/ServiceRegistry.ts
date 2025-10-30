/**
 * @fileoverview Enterprise service registry for API service management and discovery
 * @module services/core/ServiceRegistry
 * @category Services
 * 
 * Central registry providing service registration, discovery, health monitoring,
 * and lifecycle management for all API services in the application.
 * 
 * Key Features:
 * - Service registration and discovery by name or category
 * - Health monitoring with circuit breaker integration
 * - Dependency injection and lazy loading support
 * - Version management and deprecation tracking
 * - Performance metrics collection per service
 * - Service lifecycle management (initialize, destroy)
 * - Centralized error tracking and reporting
 * 
 * Service Categories:
 * - HEALTH: Health records, allergies, conditions, vaccinations
 * - STUDENT: Student data, contacts, demographics
 * - MEDICATION: Medication management, administration
 * - APPOINTMENT: Appointments, scheduling
 * - COMMUNICATION: Messages, notifications, alerts
 * - COMPLIANCE: Audit logs, regulatory compliance
 * - ADMINISTRATION: Users, schools, districts, settings
 * - INTEGRATION: External system integrations
 * - REPORTING: Analytics, reports, exports
 * - AUDIT: Audit trail, HIPAA compliance logging
 * 
 * @example
 * ```typescript
 * // Register a service
 * serviceRegistry.register('students', studentsService, {
 *   name: 'Students API',
 *   version: '1.0.0',
 *   description: 'Student data management',
 *   endpoint: '/api/students',
 *   category: 'STUDENT',
 *   dependencies: ['auth', 'cache']
 * });
 * 
 * // Get a service
 * const studentsService = serviceRegistry.get('students');
 * 
 * // Get all services by category
 * const healthServices = serviceRegistry.getByCategory('HEALTH');
 * 
 * // Check service health
 * const health = serviceRegistry.getHealth('students');
 * if (health.status === 'DEGRADED') {
 *   console.warn('Students service is degraded');
 * }
 * 
 * // Get service metrics
 * const metrics = serviceRegistry.getMetrics('students');
 * console.log(`Error rate: ${metrics.failedRequests / metrics.totalRequests}`);
 * ```
 */

import { BaseApiService } from './BaseApiService';
import { ApiMonitoring } from './ApiMonitoring';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ServiceMetadata {
  name: string;
  version: string;
  description: string;
  endpoint: string;
  category: ServiceCategory;
  dependencies?: string[];
  features?: string[];
  deprecated?: boolean;
  deprecationMessage?: string;
  migrationGuide?: string;
}

export type ServiceCategory =
  | 'HEALTH'
  | 'STUDENT'
  | 'MEDICATION'
  | 'APPOINTMENT'
  | 'COMMUNICATION'
  | 'COMPLIANCE'
  | 'ADMINISTRATION'
  | 'INTEGRATION'
  | 'REPORTING'
  | 'AUDIT';

export interface ServiceHealth {
  serviceId: string;
  status: ServiceStatus;
  lastCheck: Date;
  responseTime: number;
  errorRate: number;
  throughput: number;
  availabilityPercentage: number;
  circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  lastError?: string;
}

export type ServiceStatus =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'UNHEALTHY'
  | 'UNKNOWN'
  | 'MAINTENANCE';

export interface ServiceMetrics {
  serviceId: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  requestsPerSecond: number;
  errorsByType: Record<string, number>;
  lastUpdated: Date;
}

export interface ServiceDependency {
  serviceId: string;
  dependsOn: string[];
  requiredFor: string[];
  criticalDependency: boolean;
}

// ==========================================
// SERVICE REGISTRY CLASS
// ==========================================

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, any> = new Map();
  private metadata: Map<string, ServiceMetadata> = new Map();
  private health: Map<string, ServiceHealth> = new Map();
  private metrics: Map<string, ServiceMetrics> = new Map();
  private dependencies: Map<string, ServiceDependency> = new Map();
  private monitoring: ApiMonitoring;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.monitoring = ApiMonitoring.getInstance();
    this.initializeHealthChecking();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  /**
   * Register a service
   */
  public registerService<T>(
    id: string,
    service: T,
    metadata: ServiceMetadata,
    dependencies?: string[]
  ): void {
    // Check for deprecation
    if (metadata.deprecated && process.env.NODE_ENV === 'development') {
      console.warn(
        `[SERVICE REGISTRY] Registering deprecated service: ${id}\n` +
        `${metadata.deprecationMessage || 'This service is deprecated.'}\n` +
        `${metadata.migrationGuide || ''}`
      );
    }

    // Store service and metadata
    this.services.set(id, service);
    this.metadata.set(id, metadata);

    // Initialize health status
    this.health.set(id, {
      serviceId: id,
      status: 'UNKNOWN',
      lastCheck: new Date(),
      responseTime: 0,
      errorRate: 0,
      throughput: 0,
      availabilityPercentage: 100,
      circuitBreakerState: 'CLOSED'
    });

    // Initialize metrics
    this.metrics.set(id, {
      serviceId: id,
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

    // Register dependencies
    if (dependencies && dependencies.length > 0) {
      this.dependencies.set(id, {
        serviceId: id,
        dependsOn: dependencies,
        requiredFor: [],
        criticalDependency: metadata.category === 'HEALTH' || metadata.category === 'STUDENT'
      });

      // Update reverse dependencies
      dependencies.forEach(dep => {
        const depInfo = this.dependencies.get(dep);
        if (depInfo) {
          depInfo.requiredFor.push(id);
        }
      });
    }

    console.log(`[SERVICE REGISTRY] Registered service: ${id} (v${metadata.version})`);
  }

  /**
   * Get a service by ID
   */
  public getService<T>(id: string): T | undefined {
    const service = this.services.get(id);

    if (!service) {
      console.warn(`[SERVICE REGISTRY] Service not found: ${id}`);
      return undefined;
    }

    // Check if service is healthy
    const health = this.health.get(id);
    if (health && health.status === 'UNHEALTHY') {
      console.warn(`[SERVICE REGISTRY] Service is unhealthy: ${id}`);
    }

    // Track service access
    this.trackServiceAccess(id);

    return service as T;
  }

  /**
   * Get all services by category
   */
  public getServicesByCategory(category: ServiceCategory): Array<{ id: string; service: any; metadata: ServiceMetadata }> {
    const result: Array<{ id: string; service: any; metadata: ServiceMetadata }> = [];

    this.services.forEach((service, id) => {
      const metadata = this.metadata.get(id);
      if (metadata && metadata.category === category) {
        result.push({ id, service, metadata });
      }
    });

    return result;
  }

  /**
   * Get service metadata
   */
  public getServiceMetadata(id: string): ServiceMetadata | undefined {
    return this.metadata.get(id);
  }

  /**
   * Get service health
   */
  public getServiceHealth(id: string): ServiceHealth | undefined {
    return this.health.get(id);
  }

  /**
   * Get all service health statuses
   */
  public getAllHealth(): Map<string, ServiceHealth> {
    return new Map(this.health);
  }

  /**
   * Get service metrics
   */
  public getServiceMetrics(id: string): ServiceMetrics | undefined {
    return this.metrics.get(id);
  }

  /**
   * Check service dependencies
   */
  public checkDependencies(id: string): { satisfied: boolean; missing: string[] } {
    const deps = this.dependencies.get(id);
    if (!deps || deps.dependsOn.length === 0) {
      return { satisfied: true, missing: [] };
    }

    const missing: string[] = [];
    deps.dependsOn.forEach(dep => {
      if (!this.services.has(dep)) {
        missing.push(dep);
      } else {
        const health = this.health.get(dep);
        if (health && health.status === 'UNHEALTHY') {
          missing.push(`${dep} (unhealthy)`);
        }
      }
    });

    return {
      satisfied: missing.length === 0,
      missing
    };
  }

  /**
   * Update service health
   */
  public updateServiceHealth(
    id: string,
    status: ServiceStatus,
    responseTime?: number,
    error?: string
  ): void {
    const health = this.health.get(id);
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
    if (status === 'UNHEALTHY') {
      health.circuitBreakerState = 'OPEN';
    } else if (status === 'DEGRADED') {
      health.circuitBreakerState = 'HALF_OPEN';
    } else {
      health.circuitBreakerState = 'CLOSED';
    }

    this.health.set(id, health);
  }

  /**
   * Record service metric
   */
  public recordMetric(
    id: string,
    success: boolean,
    responseTime: number,
    errorType?: string
  ): void {
    const metrics = this.metrics.get(id);
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

    // Update average response time (simple moving average)
    metrics.averageResponseTime =
      (metrics.averageResponseTime * (metrics.totalRequests - 1) + responseTime) /
      metrics.totalRequests;

    metrics.lastUpdated = new Date();
    this.metrics.set(id, metrics);

    // Update error rate in health
    const health = this.health.get(id);
    if (health) {
      health.errorRate = (metrics.failedRequests / metrics.totalRequests) * 100;
      this.health.set(id, health);
    }
  }

  /**
   * Get service dependency graph
   */
  public getDependencyGraph(): Map<string, ServiceDependency> {
    return new Map(this.dependencies);
  }

  /**
   * Get critical services
   */
  public getCriticalServices(): string[] {
    const critical: string[] = [];

    this.dependencies.forEach((dep, id) => {
      if (dep.criticalDependency) {
        critical.push(id);
      }
    });

    return critical;
  }

  /**
   * Unregister a service
   */
  public unregisterService(id: string): boolean {
    // Check if service has dependents
    const deps = this.dependencies.get(id);
    if (deps && deps.requiredFor.length > 0) {
      console.warn(
        `[SERVICE REGISTRY] Cannot unregister ${id}: required by ${deps.requiredFor.join(', ')}`
      );
      return false;
    }

    // Remove service
    this.services.delete(id);
    this.metadata.delete(id);
    this.health.delete(id);
    this.metrics.delete(id);
    this.dependencies.delete(id);

    // Update reverse dependencies
    this.dependencies.forEach(dep => {
      dep.dependsOn = dep.dependsOn.filter(d => d !== id);
      dep.requiredFor = dep.requiredFor.filter(r => r !== id);
    });

    console.log(`[SERVICE REGISTRY] Unregistered service: ${id}`);
    return true;
  }

  /**
   * Get service inventory
   */
  public getInventory(): Array<{
    id: string;
    metadata: ServiceMetadata;
    health: ServiceHealth;
    metrics: ServiceMetrics;
  }> {
    const inventory: Array<any> = [];

    this.services.forEach((_, id) => {
      inventory.push({
        id,
        metadata: this.metadata.get(id),
        health: this.health.get(id),
        metrics: this.metrics.get(id)
      });
    });

    return inventory;
  }

  /**
   * Export registry state
   */
  public exportState(): string {
    return JSON.stringify({
      services: Array.from(this.metadata.entries()),
      health: Array.from(this.health.entries()),
      metrics: Array.from(this.metrics.entries()),
      dependencies: Array.from(this.dependencies.entries()),
      timestamp: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Initialize health checking
   */
  private initializeHealthChecking(): void {
    // Perform health checks every 30 seconds
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, 30000);
  }

  /**
   * Perform health checks on all services
   */
  private async performHealthChecks(): Promise<void> {
    for (const [id, service] of this.services.entries()) {
      try {
        // If service has a health check method, use it
        if (typeof service.healthCheck === 'function') {
          const start = Date.now();
          const isHealthy = await service.healthCheck();
          const responseTime = Date.now() - start;

          this.updateServiceHealth(
            id,
            isHealthy ? 'HEALTHY' : 'UNHEALTHY',
            responseTime
          );
        }
      } catch (error) {
        this.updateServiceHealth(
          id,
          'UNHEALTHY',
          undefined,
          error instanceof Error ? error.message : 'Health check failed'
        );
      }
    }
  }

  /**
   * Track service access
   */
  private trackServiceAccess(id: string): void {
    // This could be extended to track access patterns,
    // implement rate limiting, etc.
    const metrics = this.metrics.get(id);
    if (metrics) {
      // Simple RPS calculation (would be more sophisticated in production)
      const now = Date.now();
      const timeSinceLastUpdate = (now - metrics.lastUpdated.getTime()) / 1000;
      if (timeSinceLastUpdate > 0) {
        metrics.requestsPerSecond = 1 / timeSinceLastUpdate;
      }
    }
  }

  /**
   * Cleanup on destroy
   */
  public destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    this.services.clear();
    this.metadata.clear();
    this.health.clear();
    this.metrics.clear();
    this.dependencies.clear();
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const serviceRegistry = ServiceRegistry.getInstance();

// ==========================================
// AUTO-REGISTRATION HELPER
// ==========================================

/**
 * Decorator for auto-registering services
 */
export function RegisterService(metadata: ServiceMetadata) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    // Auto-register on instantiation
    const originalConstructor = constructor;
    const newConstructor: any = function (...args: any[]) {
      const instance = new originalConstructor(...args);
      serviceRegistry.registerService(
        metadata.name,
        instance,
        metadata,
        metadata.dependencies
      );
      return instance;
    };
    newConstructor.prototype = originalConstructor.prototype;
    return newConstructor;
  };
}

export default serviceRegistry;
