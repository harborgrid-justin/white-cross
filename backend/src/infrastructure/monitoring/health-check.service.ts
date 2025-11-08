/**
 * Health Check Service
 *
 * @module infrastructure/monitoring
 * @description Service responsible for checking health of all infrastructure components
 * including database, cache, WebSocket, job queues, and external APIs.
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import {
  ComponentHealth,
  HealthCheckResponse,
  HealthStatus,
  LivenessResponse,
  ReadinessResponse,
} from './interfaces/health-check.interface';

/**
 * Service interfaces for optional dependencies
 */
interface CacheServiceInterface {
  getStats?(): Promise<Record<string, unknown>> | Record<string, unknown>;
}

interface WebSocketServiceInterface {
  isInitialized?(): boolean;
  getConnectedSocketsCount?(): number;
  getStats?(): Record<string, unknown>;
}

interface MessageQueueServiceInterface {
  getAllQueueStats?(): Promise<Record<string, any>>;
  getStats?(): Record<string, unknown>;
}

interface CircuitBreakerServiceInterface {
  getStatus?(service: string): any;
  getStats?(): Record<string, unknown>;
}

/**
 * HealthCheckService
 *
 * @description Performs health checks on all infrastructure components.
 * Provides Kubernetes-ready readiness and liveness probes.
 *
 * @example
 * ```typescript
 * const healthCheck = await healthCheckService.performHealthCheck();
 * if (healthCheck.status === HealthStatus.UNHEALTHY) {
 *   // Handle unhealthy state
 * }
 * ```
 */
@Injectable()
export class HealthCheckService {
  private readonly logger = new Logger(HealthCheckService.name);

  // Optional service dependencies
  private cacheService?: CacheServiceInterface;
  private websocketService?: WebSocketServiceInterface;
  private queueManagerService?: MessageQueueServiceInterface;
  private circuitBreakerService?: CircuitBreakerServiceInterface;

  // Configuration
  private failedJobsThreshold: number = 100;

  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
  ) {
    this.failedJobsThreshold = this.configService.get(
      'ALERT_FAILED_JOBS_THRESHOLD',
      100,
    );
  }

  /**
   * Inject optional service dependencies
   */
  setCacheService(cacheService: CacheServiceInterface | undefined): void {
    this.cacheService = cacheService;
    this.logger.log('Cache service registered for health monitoring');
  }

  setWebSocketService(websocketService: WebSocketServiceInterface | undefined): void {
    this.websocketService = websocketService;
    this.logger.log('WebSocket service registered for health monitoring');
  }

  setQueueManagerService(queueManagerService: MessageQueueServiceInterface | undefined): void {
    this.queueManagerService = queueManagerService;
    this.logger.log('Queue manager service registered for health monitoring');
  }

  setCircuitBreakerService(circuitBreakerService: CircuitBreakerServiceInterface | undefined): void {
    this.circuitBreakerService = circuitBreakerService;
    this.logger.log('Circuit breaker service registered for health monitoring');
  }

  /**
   * Check database health
   *
   * @returns Promise resolving to database health status
   * @throws Never throws - returns unhealthy status on error
   */
  async checkDatabaseHealth(): Promise<ComponentHealth> {
    try {
      // Check if connection is initialized
      try {
        await this.sequelize.authenticate();
      } catch (authError) {
        return {
          status: HealthStatus.UNHEALTHY,
          message: 'Database connection is not initialized',
        };
      }

      // Execute simple query to verify database connectivity
      const startTime = Date.now();
      await this.sequelize.query('SELECT 1 as health_check');
      const responseTime = Date.now() - startTime;

      // Get connection pool statistics from Sequelize
      const pool = (this.sequelize.connectionManager as any).pool;
      const poolSize = pool?.size || pool?.max || 10; // Default to 10 if unavailable
      const idleConnections = pool?.available || pool?.idle || 0;
      const activeConnections = pool?.using || poolSize - idleConnections;

      // Check if connection pool is near capacity
      const poolUsage = poolSize > 0 ? (activeConnections / poolSize) * 100 : 0;
      const status =
        poolUsage > 90 ? HealthStatus.DEGRADED : HealthStatus.HEALTHY;

      return {
        status,
        message:
          status === HealthStatus.HEALTHY
            ? 'Database connection is healthy'
            : 'Database connection pool near capacity',
        details: {
          connected: true,
          responseTime: `${responseTime}ms`,
          database: this.sequelize.config.database,
          poolSize,
          activeConnections,
          idleConnections,
          poolUsage: `${poolUsage.toFixed(2)}%`,
        },
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        status: HealthStatus.UNHEALTHY,
        message: 'Database connection failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Check Redis health
   *
   * @returns Promise resolving to Redis health status
   * @description Checks Redis connectivity and retrieves cache statistics.
   * Returns degraded status if Redis is not configured.
   */
  async checkRedisHealth(): Promise<ComponentHealth> {
    try {
      const redisUrl = this.configService.get<string>('REDIS_URL');
      const redisHost = this.configService.get<string>('REDIS_HOST');
      const redisPort = this.configService.get<number>('REDIS_PORT');

      if (!redisUrl && !redisHost) {
        return {
          status: HealthStatus.DEGRADED,
          message: 'Redis is not configured',
          details: {
            configured: false,
          },
        };
      }

      // Check if cache service is available and get stats
      if (this.cacheService && this.cacheService.getStats) {
        try {
          const stats = await this.cacheService.getStats();
          const hitRate = (stats.hitRate as number) || 0;

          return {
            status: HealthStatus.HEALTHY,
            message: 'Redis cache is operational',
            details: {
              configured: true,
              connected: true,
              hitRate: `${hitRate.toFixed(2)}%`,
              size: stats.size as number,
              maxSize: stats.maxSize as number,
              hits: stats.hits as number,
              misses: stats.misses as number,
              evictions: stats.evictions as number,
              memoryUsage: `${((stats.memoryUsage as number) / 1024 / 1024).toFixed(2)} MB`,
            },
          };
        } catch (error) {
          return {
            status: HealthStatus.DEGRADED,
            message: 'Redis cache service error',
            details: {
              configured: true,
              connected: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      }

      // Fallback: Redis is configured but service not injected
      return {
        status: HealthStatus.DEGRADED,
        message: 'Redis configured but cache service not available',
        details: {
          configured: true,
          host: redisHost || 'from REDIS_URL',
          port: redisPort,
          serviceAvailable: false,
        },
      };
    } catch (error) {
      this.logger.error('Redis health check failed', error);
      return {
        status: HealthStatus.UNHEALTHY,
        message: 'Redis health check failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Check WebSocket health
   *
   * @returns Promise resolving to WebSocket health status
   * @description Checks WebSocket server status and connected clients.
   */
  async checkWebSocketHealth(): Promise<ComponentHealth> {
    try {
      if (!this.websocketService) {
        return {
          status: HealthStatus.DEGRADED,
          message: 'WebSocket service not registered',
          details: {
            serviceAvailable: false,
          },
        };
      }

      const isInitialized = this.websocketService.isInitialized();
      const connectedClients = this.websocketService.getConnectedSocketsCount();

      if (!isInitialized) {
        return {
          status: HealthStatus.DEGRADED,
          message: 'WebSocket server not initialized',
          details: {
            initialized: false,
            connectedClients: 0,
          },
        };
      }

      return {
        status: HealthStatus.HEALTHY,
        message: 'WebSocket server is operational',
        details: {
          initialized: true,
          connectedClients,
          serverActive: true,
        },
      };
    } catch (error) {
      this.logger.error('WebSocket health check failed', error);
      return {
        status: HealthStatus.DEGRADED,
        message: 'WebSocket server not fully operational',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Check job queue health
   *
   * @returns Promise resolving to job queue health status
   * @description Checks job queue status and retrieves queue statistics.
   */
  async checkJobQueueHealth(): Promise<ComponentHealth> {
    try {
      if (!this.queueManagerService) {
        return {
          status: HealthStatus.DEGRADED,
          message: 'Job queue service not registered',
          details: {
            serviceAvailable: false,
          },
        };
      }

      // Get statistics for all queues
      const allStats = await this.queueManagerService.getAllQueueStats();
      const queueCount = Object.keys(allStats).length;

      if (queueCount === 0) {
        return {
          status: HealthStatus.DEGRADED,
          message: 'No job queues initialized',
          details: {
            queueCount: 0,
          },
        };
      }

      // Calculate totals across all queues
      let totalWaiting = 0;
      let totalActive = 0;
      let totalCompleted = 0;
      let totalFailed = 0;
      let totalDelayed = 0;

      Object.values(allStats).forEach((stats: Record<string, unknown>) => {
        totalWaiting += (stats.waiting as number) || 0;
        totalActive += (stats.active as number) || 0;
        totalCompleted += (stats.completed as number) || 0;
        totalFailed += (stats.failed as number) || 0;
        totalDelayed += (stats.delayed as number) || 0;
      });

      // Check for excessive failed jobs
      const status =
        totalFailed > this.failedJobsThreshold
          ? HealthStatus.DEGRADED
          : HealthStatus.HEALTHY;

      return {
        status,
        message:
          status === HealthStatus.HEALTHY
            ? 'Job queues are operational'
            : `High number of failed jobs: ${totalFailed}`,
        details: {
          queueCount,
          waiting: totalWaiting,
          active: totalActive,
          completed: totalCompleted,
          failed: totalFailed,
          delayed: totalDelayed,
          queues: allStats,
        },
      };
    } catch (error) {
      this.logger.error('Job queue health check failed', error);
      return {
        status: HealthStatus.DEGRADED,
        message: 'Job queue health check failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Check external API health
   *
   * @returns Promise resolving to external API health status
   * @description Checks external API connectivity and circuit breaker status
   */
  async checkExternalAPIHealth(): Promise<ComponentHealth> {
    try {
      if (!this.circuitBreakerService) {
        return {
          status: HealthStatus.HEALTHY,
          message: 'External API monitoring not configured',
          details: {
            circuitBreakerAvailable: false,
          },
        };
      }

      // Check circuit breaker status for known services
      const services = ['sis-integration', 'external-api'];
      const circuitStatuses: Record<string, any> = {};
      let hasOpenCircuit = false;
      let hasHalfOpenCircuit = false;

      for (const service of services) {
        const status = this.circuitBreakerService.getStatus(service);
        if (status) {
          circuitStatuses[service] = status;
          if (status.state === 'OPEN') hasOpenCircuit = true;
          if (status.state === 'HALF_OPEN') hasHalfOpenCircuit = true;
        }
      }

      let status = HealthStatus.HEALTHY;
      let message = 'External APIs are operational';

      if (hasOpenCircuit) {
        status = HealthStatus.UNHEALTHY;
        message =
          'One or more external APIs are unavailable (circuit breaker OPEN)';
      } else if (hasHalfOpenCircuit) {
        status = HealthStatus.DEGRADED;
        message = 'External APIs recovering (circuit breaker HALF_OPEN)';
      }

      return {
        status,
        message,
        details: {
          circuitBreakerAvailable: true,
          circuits: circuitStatuses,
        },
      };
    } catch (error) {
      this.logger.error('External API health check failed', error);
      return {
        status: HealthStatus.DEGRADED,
        message: 'External API health check failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Perform comprehensive health check
   *
   * @returns Promise resolving to complete health check response
   * @description Executes all component health checks in parallel and determines
   * overall system health status. System is:
   * - UNHEALTHY if any component is unhealthy
   * - DEGRADED if any component is degraded
   * - HEALTHY if all components are healthy
   */
  async performHealthCheck(): Promise<HealthCheckResponse> {
    const [database, redis, websocket, jobQueue, externalAPIs] =
      await Promise.all([
        this.checkDatabaseHealth(),
        this.checkRedisHealth(),
        this.checkWebSocketHealth(),
        this.checkJobQueueHealth(),
        this.checkExternalAPIHealth(),
      ]);

    // Determine overall status
    const components = { database, redis, websocket, jobQueue, externalAPIs };
    const statuses = Object.values(components).map((c) => c.status);

    let overallStatus: HealthStatus;
    if (statuses.includes(HealthStatus.UNHEALTHY)) {
      overallStatus = HealthStatus.UNHEALTHY;
    } else if (statuses.includes(HealthStatus.DEGRADED)) {
      overallStatus = HealthStatus.DEGRADED;
    } else {
      overallStatus = HealthStatus.HEALTHY;
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get('NODE_ENV', 'development'),
      version: this.configService.get('npm_package_version', '1.0.0'),
      components,
    };
  }

  /**
   * Kubernetes readiness probe
   *
   * @returns Promise resolving to readiness status
   * @description Determines if application is ready to serve traffic.
   * System is ready if database is healthy.
   */
  async checkReadiness(): Promise<ReadinessResponse> {
    const [dbHealth, redisHealth] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkRedisHealth(),
    ]);

    // System is ready if database is healthy
    const isReady = dbHealth.status === HealthStatus.HEALTHY;

    return {
      ready: isReady,
      timestamp: new Date().toISOString(),
      checks: {
        database: dbHealth.status,
        redis: redisHealth.status,
      },
    };
  }

  /**
   * Kubernetes liveness probe
   *
   * @returns Liveness status
   * @description Simple check to verify the process is alive.
   * If this responds, the process is running.
   */
  checkLiveness(): LivenessResponse {
    return {
      alive: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
