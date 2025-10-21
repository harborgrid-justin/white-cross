/**
 * HealthCheckService - System health monitoring and status checks
 *
 * Provides comprehensive health checks for all critical services
 * and exposes /health endpoint for load balancers and monitoring.
 *
 * HIPAA Compliant - No PHI exposed in health check responses
 */

import { metricsService } from './MetricsService';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  checks: {
    [service: string]: ServiceHealthCheck;
  };
  uptime: number;
  version: string;
}

export interface ServiceHealthCheck {
  status: 'pass' | 'warn' | 'fail';
  message?: string;
  responseTime?: number;
  details?: Record<string, any>;
}

export interface HealthCheckConfig {
  enabled: boolean;
  checkInterval: number; // ms
  timeout: number; // ms per check
  criticalServices: string[];
}

export interface HealthCheckProvider {
  name: string;
  check: () => Promise<ServiceHealthCheck>;
  critical: boolean;
}

/**
 * HealthCheckService - Monitor system component health
 */
export class HealthCheckService {
  private static instance: HealthCheckService;
  private config: HealthCheckConfig;
  private providers: Map<string, HealthCheckProvider> = new Map();
  private lastHealthCheck: HealthCheckResult | null = null;
  private checkTimer: NodeJS.Timeout | null = null;
  private startTime: number = Date.now();

  private constructor(config: Partial<HealthCheckConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      checkInterval: config.checkInterval ?? 30000, // 30 seconds
      timeout: config.timeout ?? 5000, // 5 seconds
      criticalServices: config.criticalServices ?? [
        'tokenManager',
        'auditService',
        'indexedDB',
      ],
    };

    this.registerDefaultProviders();

    if (this.config.enabled) {
      this.startHealthChecks();
    }
  }

  public static getInstance(config?: Partial<HealthCheckConfig>): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService(config);
    }
    return HealthCheckService.instance;
  }

  /**
   * Register default health check providers
   */
  private registerDefaultProviders(): void {
    // Token Manager health check
    this.registerProvider({
      name: 'tokenManager',
      critical: true,
      check: async () => {
        try {
          // Check if SecureTokenManager is functioning
          const hasToken = !!localStorage.getItem('auth_token');
          const hasRefreshToken = !!localStorage.getItem('refresh_token');

          if (!hasToken && !hasRefreshToken) {
            return {
              status: 'warn',
              message: 'No authentication tokens present',
            };
          }

          return {
            status: 'pass',
            message: 'Token manager operational',
            details: {
              hasToken,
              hasRefreshToken,
            },
          };
        } catch (error) {
          return {
            status: 'fail',
            message: `Token manager error: ${error instanceof Error ? error.message : 'Unknown'}`,
          };
        }
      },
    });

    // Audit Service health check
    this.registerProvider({
      name: 'auditService',
      critical: true,
      check: async () => {
        try {
          const auditMetrics = metricsService.getAuditMetrics();
          const failureRate =
            auditMetrics.eventsLogged > 0
              ? auditMetrics.eventsFailed / auditMetrics.eventsLogged
              : 0;

          if (failureRate > 0.05) {
            return {
              status: 'warn',
              message: `High audit failure rate: ${(failureRate * 100).toFixed(2)}%`,
              details: {
                eventsLogged: auditMetrics.eventsLogged,
                eventsFailed: auditMetrics.eventsFailed,
                queueDepth: auditMetrics.queueDepth,
              },
            };
          }

          if (auditMetrics.queueDepth > 1000) {
            return {
              status: 'warn',
              message: `High audit queue depth: ${auditMetrics.queueDepth}`,
              details: auditMetrics,
            };
          }

          return {
            status: 'pass',
            message: 'Audit service operational',
            details: {
              eventsLogged: auditMetrics.eventsLogged,
              queueDepth: auditMetrics.queueDepth,
            },
          };
        } catch (error) {
          return {
            status: 'fail',
            message: `Audit service error: ${error instanceof Error ? error.message : 'Unknown'}`,
          };
        }
      },
    });

    // IndexedDB health check
    this.registerProvider({
      name: 'indexedDB',
      critical: true,
      check: async () => {
        try {
          if (!window.indexedDB) {
            return {
              status: 'fail',
              message: 'IndexedDB not available',
            };
          }

          // Test database connection
          const testDB = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open('health_check_test', 1);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = (event) => {
              const db = (event.target as IDBOpenDBRequest).result;
              if (!db.objectStoreNames.contains('test')) {
                db.createObjectStore('test');
              }
            };
          });

          testDB.close();

          return {
            status: 'pass',
            message: 'IndexedDB operational',
          };
        } catch (error) {
          return {
            status: 'fail',
            message: `IndexedDB error: ${error instanceof Error ? error.message : 'Unknown'}`,
          };
        }
      },
    });

    // Circuit Breaker health check
    this.registerProvider({
      name: 'circuitBreaker',
      critical: false,
      check: async () => {
        try {
          const resilienceMetrics = metricsService.getResilienceMetrics();
          const openCircuits = resilienceMetrics.circuitBreakerOpen;

          if (openCircuits > 5) {
            return {
              status: 'warn',
              message: `Multiple circuit breakers open: ${openCircuits}`,
              details: resilienceMetrics,
            };
          }

          return {
            status: 'pass',
            message: 'Circuit breakers healthy',
            details: {
              open: resilienceMetrics.circuitBreakerOpen,
              closed: resilienceMetrics.circuitBreakerClosed,
            },
          };
        } catch (error) {
          return {
            status: 'fail',
            message: `Circuit breaker check error: ${error instanceof Error ? error.message : 'Unknown'}`,
          };
        }
      },
    });

    // Cache health check
    this.registerProvider({
      name: 'cache',
      critical: false,
      check: async () => {
        try {
          const cacheMetrics = metricsService.getCacheMetrics();
          const hitRate = cacheMetrics.hitRate;

          if (hitRate < 0.3 && cacheMetrics.hits + cacheMetrics.misses > 100) {
            return {
              status: 'warn',
              message: `Low cache hit rate: ${(hitRate * 100).toFixed(2)}%`,
              details: cacheMetrics,
            };
          }

          return {
            status: 'pass',
            message: 'Cache operational',
            details: {
              hitRate: (hitRate * 100).toFixed(2) + '%',
              hits: cacheMetrics.hits,
              misses: cacheMetrics.misses,
            },
          };
        } catch (error) {
          return {
            status: 'fail',
            message: `Cache check error: ${error instanceof Error ? error.message : 'Unknown'}`,
          };
        }
      },
    });

    // Memory health check
    this.registerProvider({
      name: 'memory',
      critical: false,
      check: async () => {
        try {
          if (!('memory' in performance)) {
            return {
              status: 'pass',
              message: 'Memory API not available',
            };
          }

          const memory = (performance as any).memory;
          const usedMB = memory.usedJSHeapSize / 1024 / 1024;
          const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
          const usagePercent = (usedMB / limitMB) * 100;

          if (usagePercent > 90) {
            return {
              status: 'warn',
              message: `High memory usage: ${usagePercent.toFixed(2)}%`,
              details: {
                usedMB: usedMB.toFixed(2),
                limitMB: limitMB.toFixed(2),
                usagePercent: usagePercent.toFixed(2),
              },
            };
          }

          return {
            status: 'pass',
            message: 'Memory usage normal',
            details: {
              usedMB: usedMB.toFixed(2),
              usagePercent: usagePercent.toFixed(2),
            },
          };
        } catch (error) {
          return {
            status: 'fail',
            message: `Memory check error: ${error instanceof Error ? error.message : 'Unknown'}`,
          };
        }
      },
    });

    // API connectivity check
    this.registerProvider({
      name: 'apiConnectivity',
      critical: true,
      check: async () => {
        try {
          const startTime = Date.now();
          const response = await fetch('/api/health', {
            method: 'GET',
            signal: AbortSignal.timeout(this.config.timeout),
          });
          const responseTime = Date.now() - startTime;

          if (!response.ok) {
            return {
              status: 'fail',
              message: `API returned ${response.status}`,
              responseTime,
            };
          }

          if (responseTime > 2000) {
            return {
              status: 'warn',
              message: `Slow API response: ${responseTime}ms`,
              responseTime,
            };
          }

          return {
            status: 'pass',
            message: 'API connectivity healthy',
            responseTime,
          };
        } catch (error) {
          return {
            status: 'fail',
            message: `API connectivity error: ${error instanceof Error ? error.message : 'Unknown'}`,
          };
        }
      },
    });
  }

  /**
   * Register a custom health check provider
   */
  public registerProvider(provider: HealthCheckProvider): void {
    this.providers.set(provider.name, provider);
  }

  /**
   * Unregister a health check provider
   */
  public unregisterProvider(name: string): void {
    this.providers.delete(name);
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    this.checkTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.config.checkInterval);

    // Perform initial check
    this.performHealthCheck();
  }

  /**
   * Perform health check on all registered providers
   */
  public async performHealthCheck(): Promise<HealthCheckResult> {
    const checks: { [service: string]: ServiceHealthCheck } = {};
    const startTime = Date.now();

    // Run all health checks in parallel
    const checkPromises = Array.from(this.providers.entries()).map(
      async ([name, provider]) => {
        try {
          const checkPromise = provider.check();
          const timeoutPromise = new Promise<ServiceHealthCheck>((resolve) =>
            setTimeout(
              () =>
                resolve({
                  status: 'fail',
                  message: 'Health check timeout',
                }),
              this.config.timeout
            )
          );

          const result = await Promise.race([checkPromise, timeoutPromise]);
          checks[name] = result;
        } catch (error) {
          checks[name] = {
            status: 'fail',
            message: `Health check error: ${error instanceof Error ? error.message : 'Unknown'}`,
          };
        }
      }
    );

    await Promise.all(checkPromises);

    // Determine overall status
    const criticalFailures = this.config.criticalServices.filter(
      (service) => checks[service]?.status === 'fail'
    );

    const hasWarnings = Object.values(checks).some((check) => check.status === 'warn');
    const hasFailures = Object.values(checks).some((check) => check.status === 'fail');

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (criticalFailures.length > 0) {
      overallStatus = 'unhealthy';
    } else if (hasFailures || hasWarnings) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: Date.now(),
      checks,
      uptime: Date.now() - this.startTime,
      version: import.meta.env.VITE_APP_VERSION || 'unknown',
    };

    this.lastHealthCheck = result;

    // Track health status in metrics
    metricsService.trackWebVitals({
      name: 'TTFB',
      value: Date.now() - startTime,
    });

    return result;
  }

  /**
   * Get last health check result
   */
  public getLastHealthCheck(): HealthCheckResult | null {
    return this.lastHealthCheck;
  }

  /**
   * Check if system is healthy
   */
  public isHealthy(): boolean {
    return this.lastHealthCheck?.status === 'healthy';
  }

  /**
   * Get health status for load balancer
   */
  public getLoadBalancerStatus(): {
    status: number;
    body: { status: string; timestamp: number };
  } {
    const health = this.lastHealthCheck;

    if (!health) {
      return {
        status: 503,
        body: {
          status: 'unknown',
          timestamp: Date.now(),
        },
      };
    }

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

    return {
      status: statusCode,
      body: {
        status: health.status,
        timestamp: health.timestamp,
      },
    };
  }

  /**
   * Get detailed health report
   */
  public getDetailedHealth(): HealthCheckResult | null {
    return this.lastHealthCheck;
  }

  /**
   * Get health metrics in Prometheus format
   */
  public getPrometheusHealth(): string {
    const health = this.lastHealthCheck;
    if (!health) return '';

    const lines: string[] = [];

    // Overall status
    const statusValue = health.status === 'healthy' ? 1 : health.status === 'degraded' ? 0.5 : 0;
    lines.push(`# TYPE health_status gauge`);
    lines.push(`health_status ${statusValue}`);

    // Uptime
    lines.push(`# TYPE health_uptime_seconds gauge`);
    lines.push(`health_uptime_seconds ${health.uptime / 1000}`);

    // Individual service checks
    for (const [service, check] of Object.entries(health.checks)) {
      const value = check.status === 'pass' ? 1 : check.status === 'warn' ? 0.5 : 0;
      lines.push(`# TYPE health_service_status{service="${service}"} gauge`);
      lines.push(`health_service_status{service="${service}"} ${value}`);

      if (check.responseTime !== undefined) {
        lines.push(`# TYPE health_service_response_time{service="${service}"} gauge`);
        lines.push(`health_service_response_time{service="${service}"} ${check.responseTime}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Force a health check now
   */
  public async checkNow(): Promise<HealthCheckResult> {
    return this.performHealthCheck();
  }

  /**
   * Cleanup on shutdown
   */
  public destroy(): void {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }
}

// Export singleton instance
export const healthCheckService = HealthCheckService.getInstance();
