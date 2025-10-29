/**
 * Monitoring Service
 *
 * @module infrastructure/monitoring
 * @description Comprehensive health monitoring service for all infrastructure components
 * with metrics collection, alerting, and performance tracking
 */

import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { Sequelize, QueryTypes } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';
import * as v8 from 'v8';
import {
  ComponentHealth,
  HealthCheckResponse,
  HealthStatus,
  ReadinessResponse,
  LivenessResponse,
} from './interfaces/health-check.interface';
import {
  SystemMetrics,
  PerformanceMetrics,
  MetricsSnapshot,
  Alert,
  AlertSeverity,
  AlertConfig,
  PerformanceEntry,
  DashboardData,
  LogEntry,
  LogQueryParams,
} from './interfaces/metrics.interface';

/**
 * MonitoringService
 *
 * @description Provides comprehensive health monitoring for all infrastructure components
 * including database, cache, external APIs, and job queues. Kubernetes-ready with
 * readiness and liveness probe support. Includes metrics collection, alerting,
 * performance tracking, and logging aggregation.
 *
 * @example
 * ```typescript
 * const healthCheck = await monitoringService.performHealthCheck();
 * if (healthCheck.status === HealthStatus.UNHEALTHY) {
 *   // Handle unhealthy state
 * }
 *
 * const metrics = await monitoringService.collectMetrics();
 * console.log('CPU Usage:', metrics.system.cpu.usage);
 * ```
 */
@Injectable()
export class MonitoringService implements OnModuleInit {
  private readonly logger = new Logger(MonitoringService.name);

  // Performance tracking
  private performanceHistory: PerformanceEntry[] = [];
  private readonly maxPerformanceEntries = 1000;

  // Request metrics
  private requestMetrics = {
    total: 0,
    failed: 0,
    responseTimes: [] as number[],
    lastSecondRequests: [] as number[],
  };

  // Database query metrics
  private queryMetrics = {
    totalQueries: 0,
    queryTimes: [] as number[],
    slowQueries: 0,
    slowQueryThreshold: 1000, // ms - configurable
  };

  // WebSocket metrics
  private wsMetrics = {
    messagesSent: 0,
    messagesReceived: 0,
    lastMinuteMessages: [] as number[], // timestamps
  };

  // Job processing metrics
  private jobMetrics = {
    totalJobs: 0,
    processingTimes: [] as number[],
  };

  // Alert management
  private alerts: Map<string, Alert> = new Map();
  private alertConfig: AlertConfig = {
    enabled: true,
    cpuThreshold: 80,
    memoryThreshold: 85,
    responseTimeThreshold: 5000,
    errorRateThreshold: 5,
    dbConnectionThreshold: 90,
    failedJobsThreshold: 100,
  };

  // Log aggregation
  private logBuffer: LogEntry[] = [];
  private readonly maxLogEntries = 10000;

  // Metrics collection interval
  private metricsInterval?: NodeJS.Timeout;
  private lastMetrics?: MetricsSnapshot;

  // Service dependencies (optional - injected if available)
  private cacheService?: any;
  private websocketService?: any;
  private queueManagerService?: any;
  private circuitBreakerService?: any;

  constructor(
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Initialize monitoring service
   */
  async onModuleInit() {
    this.logger.log('Initializing monitoring service...');

    // Load alert configuration from environment
    this.loadAlertConfig();

    // Start metrics collection interval (every 30 seconds)
    this.startMetricsCollection();

    // Setup log interception
    this.setupLogAggregation();

    this.logger.log('Monitoring service initialized successfully');
  }

  /**
   * Inject optional service dependencies
   */
  setCacheService(cacheService: any): void {
    this.cacheService = cacheService;
    this.logger.log('Cache service registered for monitoring');
  }

  setWebSocketService(websocketService: any): void {
    this.websocketService = websocketService;
    this.logger.log('WebSocket service registered for monitoring');
  }

  setQueueManagerService(queueManagerService: any): void {
    this.queueManagerService = queueManagerService;
    this.logger.log('Queue manager service registered for monitoring');
  }

  setCircuitBreakerService(circuitBreakerService: any): void {
    this.circuitBreakerService = circuitBreakerService;
    this.logger.log('Circuit breaker service registered for monitoring');
  }

  /**
   * Check database health
   *
   * @returns Promise resolving to database health status
   * @throws Never throws - returns unhealthy status on error
   */
  async checkDatabaseHealth(): Promise<ComponentHealth> {
    try {
      // Check if connection is authenticated
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
      await this.sequelize.query('SELECT 1 as health_check', {
        type: QueryTypes.SELECT
      });
      const responseTime = Date.now() - startTime;

      // Get connection pool statistics
      const pool = (this.sequelize.connectionManager as any).pool;
      const poolSize = pool?.size || 0;
      const idleConnections = pool?.available || 0;
      const activeConnections = poolSize - idleConnections;

      // Check if connection pool is near capacity
      const poolUsage = poolSize > 0 ? (activeConnections / poolSize) * 100 : 0;
      const status = poolUsage > 90 ? HealthStatus.DEGRADED : HealthStatus.HEALTHY;

      return {
        status,
        message: status === HealthStatus.HEALTHY
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
      if (this.cacheService) {
        try {
          const stats = this.cacheService.getStats();
          const hitRate = stats.hitRate || 0;

          return {
            status: HealthStatus.HEALTHY,
            message: 'Redis cache is operational',
            details: {
              configured: true,
              connected: true,
              hitRate: `${hitRate.toFixed(2)}%`,
              size: stats.size,
              maxSize: stats.maxSize,
              hits: stats.hits,
              misses: stats.misses,
              evictions: stats.evictions,
              memoryUsage: `${(stats.memoryUsage / 1024 / 1024).toFixed(2)} MB`,
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

      Object.values(allStats).forEach((stats: any) => {
        totalWaiting += stats.waiting;
        totalActive += stats.active;
        totalCompleted += stats.completed;
        totalFailed += stats.failed;
        totalDelayed += stats.delayed;
      });

      // Check for excessive failed jobs
      const status = totalFailed > this.alertConfig.failedJobsThreshold
        ? HealthStatus.DEGRADED
        : HealthStatus.HEALTHY;

      return {
        status,
        message: status === HealthStatus.HEALTHY
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
        message = 'One or more external APIs are unavailable (circuit breaker OPEN)';
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

  /**
   * Collect system metrics
   *
   * @returns Promise resolving to system metrics
   * @description Collects CPU, memory, and process metrics
   */
  async collectSystemMetrics(): Promise<SystemMetrics> {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = (usedMem / totalMem) * 100;

    // Calculate CPU usage
    let totalIdle = 0;
    let totalTick = 0;
    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += (cpu.times as any)[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const cpuUsage = 100 - (100 * idle) / total;

    // Get heap statistics
    const heapStats = v8.getHeapStatistics();
    const memUsage = process.memoryUsage();

    return {
      cpu: {
        usage: Math.round(cpuUsage * 100) / 100,
        system: Math.round(cpuUsage * 100) / 100,
        user: Math.round(cpuUsage * 100) / 100,
        cores: cpus.length,
        loadAverage: os.loadavg(),
      },
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usagePercent: Math.round(memUsagePercent * 100) / 100,
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss,
      },
      process: {
        uptime: process.uptime(),
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
      },
    };
  }

  /**
   * Collect performance metrics
   *
   * @returns Promise resolving to performance metrics
   * @description Collects application performance metrics
   */
  async collectPerformanceMetrics(): Promise<PerformanceMetrics> {
    // Calculate request metrics
    const responseTimes = this.requestMetrics.responseTimes.slice(-100);
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    const sortedTimes = [...responseTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p99Index = Math.floor(sortedTimes.length * 0.99);
    const p95ResponseTime = sortedTimes[p95Index] || 0;
    const p99ResponseTime = sortedTimes[p99Index] || 0;

    const successRate = this.requestMetrics.total > 0
      ? ((this.requestMetrics.total - this.requestMetrics.failed) / this.requestMetrics.total) * 100
      : 100;

    // Calculate requests per second (last 60 seconds)
    const now = Date.now();
    const recentRequests = this.requestMetrics.lastSecondRequests.filter(
      (timestamp) => now - timestamp < 60000
    );
    const requestsPerSecond = recentRequests.length / 60;

    // Database metrics
    const pool = (this.sequelize.connectionManager as any).pool;
    const poolSize = pool?.size || 0;
    const idleConnections = pool?.available || 0;
    const activeConnections = poolSize - idleConnections;

    // Calculate average query time
    const queryTimes = this.queryMetrics.queryTimes;
    const avgQueryTime = queryTimes.length > 0
      ? queryTimes.reduce((a, b) => a + b, 0) / queryTimes.length
      : 0;

    // Cache metrics
    const cacheStats = this.cacheService?.getStats() || {
      hitRate: 0,
      hits: 0,
      misses: 0,
      size: 0,
      memoryUsage: 0,
    };

    // WebSocket metrics
    const wsConnectedClients = this.websocketService?.getConnectedSocketsCount() || 0;

    // Job queue metrics
    let queueMetrics = {
      waitingJobs: 0,
      activeJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
    };

    if (this.queueManagerService) {
      try {
        const allStats = await this.queueManagerService.getAllQueueStats();
        Object.values(allStats).forEach((stats: any) => {
          queueMetrics.waitingJobs += stats.waiting;
          queueMetrics.activeJobs += stats.active;
          queueMetrics.completedJobs += stats.completed;
          queueMetrics.failedJobs += stats.failed;
        });
      } catch (error) {
        this.logger.warn('Failed to collect queue metrics', error);
      }
    }

    return {
      requests: {
        requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
        averageResponseTime: Math.round(avgResponseTime * 100) / 100,
        p95ResponseTime: Math.round(p95ResponseTime * 100) / 100,
        p99ResponseTime: Math.round(p99ResponseTime * 100) / 100,
        totalRequests: this.requestMetrics.total,
        failedRequests: this.requestMetrics.failed,
        successRate: Math.round(successRate * 100) / 100,
      },
      database: {
        activeConnections,
        idleConnections,
        averageQueryTime: Math.round(avgQueryTime * 100) / 100,
        slowQueries: this.queryMetrics.slowQueries,
        totalQueries: this.queryMetrics.totalQueries,
      },
      cache: {
        hitRate: cacheStats.hitRate,
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        size: cacheStats.size,
        memoryUsage: cacheStats.memoryUsage,
      },
      websocket: {
        connectedClients: wsConnectedClients,
        messagesPerSecond: Math.round((this.wsMetrics.lastMinuteMessages.length / 60) * 100) / 100,
        totalMessages: this.wsMetrics.messagesSent + this.wsMetrics.messagesReceived,
        messagesSent: this.wsMetrics.messagesSent,
        messagesReceived: this.wsMetrics.messagesReceived,
      },
      queue: {
        ...queueMetrics,
        averageProcessingTime: this.jobMetrics.processingTimes.length > 0
          ? Math.round((this.jobMetrics.processingTimes.reduce((a, b) => a + b, 0) / this.jobMetrics.processingTimes.length) * 100) / 100
          : 0,
        totalJobsProcessed: this.jobMetrics.totalJobs,
      },
    };
  }

  /**
   * Collect complete metrics snapshot
   *
   * @returns Promise resolving to metrics snapshot
   */
  async collectMetrics(): Promise<MetricsSnapshot> {
    const [system, performance] = await Promise.all([
      this.collectSystemMetrics(),
      this.collectPerformanceMetrics(),
    ]);

    const snapshot: MetricsSnapshot = {
      timestamp: new Date().toISOString(),
      system,
      performance,
    };

    this.lastMetrics = snapshot;

    // Check for alerts based on metrics
    await this.checkAlerts(snapshot);

    return snapshot;
  }

  /**
   * Track request for metrics
   *
   * @param responseTime Response time in milliseconds
   * @param success Whether request was successful
   */
  trackRequest(responseTime: number, success: boolean = true): void {
    this.requestMetrics.total++;
    if (!success) {
      this.requestMetrics.failed++;
    }
    this.requestMetrics.responseTimes.push(responseTime);
    this.requestMetrics.lastSecondRequests.push(Date.now());

    // Keep arrays bounded
    if (this.requestMetrics.responseTimes.length > 1000) {
      this.requestMetrics.responseTimes.shift();
    }
    if (this.requestMetrics.lastSecondRequests.length > 1000) {
      this.requestMetrics.lastSecondRequests.shift();
    }
  }

  /**
   * Track performance entry
   *
   * @param entry Performance entry
   */
  trackPerformance(entry: PerformanceEntry): void {
    this.performanceHistory.push(entry);

    // Keep history bounded
    if (this.performanceHistory.length > this.maxPerformanceEntries) {
      this.performanceHistory.shift();
    }
  }

  /**
   * Get recent performance entries
   *
   * @param limit Maximum number of entries to return
   * @returns Recent performance entries
   */
  getRecentPerformance(limit: number = 100): PerformanceEntry[] {
    return this.performanceHistory.slice(-limit);
  }

  /**
   * Check for alert conditions based on metrics
   *
   * @param metrics Current metrics snapshot
   */
  private async checkAlerts(metrics: MetricsSnapshot): Promise<void> {
    if (!this.alertConfig.enabled) {
      return;
    }

    const alerts: Alert[] = [];

    // Check CPU usage
    if (metrics.system.cpu.usage > this.alertConfig.cpuThreshold) {
      alerts.push({
        id: `cpu-high-${Date.now()}`,
        severity: AlertSeverity.WARNING,
        title: 'High CPU Usage',
        message: `CPU usage is ${metrics.system.cpu.usage.toFixed(2)}% (threshold: ${this.alertConfig.cpuThreshold}%)`,
        component: 'system',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: { cpuUsage: metrics.system.cpu.usage },
      });
    }

    // Check memory usage
    if (metrics.system.memory.usagePercent > this.alertConfig.memoryThreshold) {
      alerts.push({
        id: `memory-high-${Date.now()}`,
        severity: AlertSeverity.WARNING,
        title: 'High Memory Usage',
        message: `Memory usage is ${metrics.system.memory.usagePercent.toFixed(2)}% (threshold: ${this.alertConfig.memoryThreshold}%)`,
        component: 'system',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: { memoryUsage: metrics.system.memory.usagePercent },
      });
    }

    // Check response time
    if (metrics.performance.requests.averageResponseTime > this.alertConfig.responseTimeThreshold) {
      alerts.push({
        id: `response-time-high-${Date.now()}`,
        severity: AlertSeverity.ERROR,
        title: 'High Response Time',
        message: `Average response time is ${metrics.performance.requests.averageResponseTime.toFixed(2)}ms (threshold: ${this.alertConfig.responseTimeThreshold}ms)`,
        component: 'application',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: { responseTime: metrics.performance.requests.averageResponseTime },
      });
    }

    // Check error rate
    const errorRate = 100 - metrics.performance.requests.successRate;
    if (errorRate > this.alertConfig.errorRateThreshold) {
      alerts.push({
        id: `error-rate-high-${Date.now()}`,
        severity: AlertSeverity.CRITICAL,
        title: 'High Error Rate',
        message: `Error rate is ${errorRate.toFixed(2)}% (threshold: ${this.alertConfig.errorRateThreshold}%)`,
        component: 'application',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: { errorRate },
      });
    }

    // Check failed jobs
    if (metrics.performance.queue.failedJobs > this.alertConfig.failedJobsThreshold) {
      alerts.push({
        id: `failed-jobs-high-${Date.now()}`,
        severity: AlertSeverity.ERROR,
        title: 'High Failed Jobs Count',
        message: `Failed jobs count is ${metrics.performance.queue.failedJobs} (threshold: ${this.alertConfig.failedJobsThreshold})`,
        component: 'queue',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: { failedJobs: metrics.performance.queue.failedJobs },
      });
    }

    // Store new alerts
    alerts.forEach((alert) => {
      this.alerts.set(alert.id, alert);
      this.logger.warn(`Alert triggered: ${alert.title}`, alert);
    });

    // Clean up old alerts (older than 1 hour)
    const oneHourAgo = Date.now() - 3600000;
    Array.from(this.alerts.entries()).forEach(([id, alert]) => {
      if (new Date(alert.timestamp).getTime() < oneHourAgo) {
        this.alerts.delete(id);
      }
    });
  }

  /**
   * Get active alerts
   *
   * @returns Array of active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(
      (alert) => !alert.acknowledged && !alert.resolvedAt
    );
  }

  /**
   * Acknowledge an alert
   *
   * @param alertId Alert ID
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.logger.log(`Alert acknowledged: ${alertId}`);
    }
  }

  /**
   * Resolve an alert
   *
   * @param alertId Alert ID
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolvedAt = new Date().toISOString();
      this.logger.log(`Alert resolved: ${alertId}`);
    }
  }

  /**
   * Get monitoring dashboard data
   *
   * @returns Promise resolving to dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    const health = await this.performHealthCheck();
    const metrics = this.lastMetrics || await this.collectMetrics();
    const alerts = this.getActiveAlerts();
    const recentPerformance = this.getRecentPerformance(50);

    return {
      status: {
        health: health.status,
        uptime: health.uptime,
        environment: health.environment,
        version: health.version,
      },
      metrics,
      alerts,
      recentPerformance,
      components: {
        database: health.components.database.status,
        cache: health.components.redis.status,
        websocket: health.components.websocket.status,
        queue: health.components.jobQueue.status,
        externalApis: health.components.externalAPIs.status,
      },
    };
  }

  /**
   * Add log entry to aggregation buffer
   *
   * @param entry Log entry
   */
  addLogEntry(entry: LogEntry): void {
    this.logBuffer.push(entry);

    // Keep buffer bounded
    if (this.logBuffer.length > this.maxLogEntries) {
      this.logBuffer.shift();
    }
  }

  /**
   * Query log entries
   *
   * @param params Query parameters
   * @returns Filtered log entries
   */
  queryLogs(params: LogQueryParams): LogEntry[] {
    let logs = [...this.logBuffer];

    // Filter by level
    if (params.level) {
      logs = logs.filter((log) => log.level === params.level);
    }

    // Filter by context
    if (params.context) {
      logs = logs.filter((log) => log.context.includes(params.context!));
    }

    // Filter by time range
    if (params.startTime) {
      const startTime = new Date(params.startTime).getTime();
      logs = logs.filter((log) => new Date(log.timestamp).getTime() >= startTime);
    }

    if (params.endTime) {
      const endTime = new Date(params.endTime).getTime();
      logs = logs.filter((log) => new Date(log.timestamp).getTime() <= endTime);
    }

    // Filter by search query
    if (params.search) {
      const search = params.search.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.message.toLowerCase().includes(search) ||
          log.context.toLowerCase().includes(search)
      );
    }

    // Apply limit
    if (params.limit) {
      logs = logs.slice(-params.limit);
    }

    return logs;
  }

  /**
   * Track database query execution time
   *
   * @param queryTime Query execution time in milliseconds
   */
  trackQuery(queryTime: number): void {
    this.queryMetrics.totalQueries++;
    this.queryMetrics.queryTimes.push(queryTime);

    // Check if query is slow
    if (queryTime > this.queryMetrics.slowQueryThreshold) {
      this.queryMetrics.slowQueries++;
      this.logger.warn(`Slow query detected: ${queryTime}ms (threshold: ${this.queryMetrics.slowQueryThreshold}ms)`);
    }

    // Keep query times bounded (last 1000 queries)
    if (this.queryMetrics.queryTimes.length > 1000) {
      this.queryMetrics.queryTimes.shift();
    }
  }

  /**
   * Track WebSocket message
   *
   * @param direction Direction of message: 'sent' or 'received'
   */
  trackWebSocketMessage(direction: 'sent' | 'received'): void {
    if (direction === 'sent') {
      this.wsMetrics.messagesSent++;
    } else {
      this.wsMetrics.messagesReceived++;
    }

    // Track timestamp for rate calculation
    this.wsMetrics.lastMinuteMessages.push(Date.now());

    // Keep bounded to last 60 seconds
    const oneMinuteAgo = Date.now() - 60000;
    this.wsMetrics.lastMinuteMessages = this.wsMetrics.lastMinuteMessages.filter(
      (timestamp) => timestamp > oneMinuteAgo
    );
  }

  /**
   * Track job processing time
   *
   * @param processingTime Job processing time in milliseconds
   * @param jobType Type of job processed
   */
  trackJobProcessing(processingTime: number, jobType?: string): void {
    this.jobMetrics.totalJobs++;
    this.jobMetrics.processingTimes.push(processingTime);

    // Log slow jobs (>30 seconds)
    if (processingTime > 30000) {
      this.logger.warn(`Slow job detected: ${jobType || 'unknown'} took ${processingTime}ms`);
    }

    // Keep processing times bounded (last 1000 jobs)
    if (this.jobMetrics.processingTimes.length > 1000) {
      this.jobMetrics.processingTimes.shift();
    }
  }

  /**
   * Load alert configuration from environment
   */
  private loadAlertConfig(): void {
    this.alertConfig = {
      enabled: this.configService.get('ALERTS_ENABLED', 'true') === 'true',
      cpuThreshold: this.configService.get('ALERT_CPU_THRESHOLD', 80),
      memoryThreshold: this.configService.get('ALERT_MEMORY_THRESHOLD', 85),
      responseTimeThreshold: this.configService.get('ALERT_RESPONSE_TIME_THRESHOLD', 5000),
      errorRateThreshold: this.configService.get('ALERT_ERROR_RATE_THRESHOLD', 5),
      dbConnectionThreshold: this.configService.get('ALERT_DB_CONNECTION_THRESHOLD', 90),
      failedJobsThreshold: this.configService.get('ALERT_FAILED_JOBS_THRESHOLD', 100),
    };

    // Load slow query threshold
    this.queryMetrics.slowQueryThreshold = this.configService.get('SLOW_QUERY_THRESHOLD_MS', 1000);

    this.logger.log('Alert configuration loaded', this.alertConfig);
  }

  /**
   * Start metrics collection interval
   */
  private startMetricsCollection(): void {
    // Collect metrics immediately
    this.collectMetrics().catch((error) => {
      this.logger.error('Failed to collect initial metrics', error);
    });

    // Collect metrics every 30 seconds
    this.metricsInterval = setInterval(() => {
      this.collectMetrics().catch((error) => {
        this.logger.error('Failed to collect metrics', error);
      });
    }, 30000);

    this.logger.log('Metrics collection started (30s interval)');
  }

  /**
   * Setup log aggregation
   */
  private setupLogAggregation(): void {
    // Note: In a real implementation, you would intercept Winston/Pino logs
    // For now, this is a placeholder
    this.logger.log('Log aggregation setup complete');
  }

  /**
   * Stop metrics collection
   */
  stopMetricsCollection(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = undefined;
      this.logger.log('Metrics collection stopped');
    }
  }
}
