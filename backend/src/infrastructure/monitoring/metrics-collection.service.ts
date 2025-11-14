/**
 * Metrics Collection Service
 *
 * @module infrastructure/monitoring
 * @description Service responsible for collecting system and application metrics
 * including CPU, memory, database, cache, WebSocket, and job queue statistics.
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as os from 'os';
import * as v8 from 'v8';
import {
  MetricsSnapshot,
  PerformanceMetrics,
  SystemMetrics,
} from './interfaces/metrics.interface';

/**
 * Service interfaces for optional dependencies
 */
interface CacheServiceInterface {
  getStats?(): Promise<Record<string, unknown>> | Record<string, unknown>;
}

interface WebSocketServiceInterface {
  getConnectedSocketsCount?(): number;
}

interface MessageQueueServiceInterface {
  getAllQueueStats?(): Promise<Record<string, any>>;
}

/**
 * MetricsCollectionService
 *
 * @description Collects comprehensive system and application metrics.
 * Provides real-time monitoring data for CPU, memory, database connections,
 * cache performance, WebSocket activity, and job queue statistics.
 *
 * @example
 * ```typescript
 * const metrics = await metricsCollectionService.collectMetrics();
 * console.log('CPU Usage:', metrics.system.cpu.usage);
 * ```
 */
@Injectable()
export class MetricsCollectionService extends BaseService {
  // Optional service dependencies
  private cacheService?: CacheServiceInterface;
  private websocketService?: WebSocketServiceInterface;
  private queueManagerService?: MessageQueueServiceInterface;

  // Request metrics storage
  private requestMetrics = {
    total: 0,
    failed: 0,
    responseTimes: [] as number[],
    lastSecondRequests: [] as number[],
  };

  // Database query metrics storage
  private queryMetrics = {
    totalQueries: 0,
    queryTimes: [] as number[],
    slowQueries: 0,
    slowQueryThreshold: 1000, // ms - configurable
  };

  // WebSocket metrics storage
  private wsMetrics = {
    messagesSent: 0,
    messagesReceived: 0,
    lastMinuteMessages: [] as number[], // timestamps
  };

  // Job processing metrics storage
  private jobMetrics = {
    totalJobs: 0,
    processingTimes: [] as number[],
  };

  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {
    super("MetricsCollectionService");
  }

  /**
   * Inject optional service dependencies
   */
  setCacheService(cacheService: CacheServiceInterface | undefined): void {
    this.cacheService = cacheService;
  }

  setWebSocketService(websocketService: WebSocketServiceInterface | undefined): void {
    this.websocketService = websocketService;
  }

  setQueueManagerService(queueManagerService: MessageQueueServiceInterface | undefined): void {
    this.queueManagerService = queueManagerService;
  }

  /**
   * Set slow query threshold
   */
  setSlowQueryThreshold(thresholdMs: number): void {
    this.queryMetrics.slowQueryThreshold = thresholdMs;
  }

  /**
   * Get request metrics (for external access)
   */
  getRequestMetrics() {
    return this.requestMetrics;
  }

  /**
   * Get query metrics (for external access)
   */
  getQueryMetrics() {
    return this.queryMetrics;
  }

  /**
   * Get WebSocket metrics (for external access)
   */
  getWebSocketMetrics() {
    return this.wsMetrics;
  }

  /**
   * Get job metrics (for external access)
   */
  getJobMetrics() {
    return this.jobMetrics;
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
    const avgResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    const sortedTimes = [...responseTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p99Index = Math.floor(sortedTimes.length * 0.99);
    const p95ResponseTime = sortedTimes[p95Index] || 0;
    const p99ResponseTime = sortedTimes[p99Index] || 0;

    const successRate =
      this.requestMetrics.total > 0
        ? ((this.requestMetrics.total - this.requestMetrics.failed) /
            this.requestMetrics.total) *
          100
        : 100;

    // Calculate requests per second (last 60 seconds)
    const now = Date.now();
    const recentRequests = this.requestMetrics.lastSecondRequests.filter(
      (timestamp) => now - timestamp < 60000,
    );
    const requestsPerSecond = recentRequests.length / 60;

    // Database metrics using Sequelize
    const pool = (this.sequelize.connectionManager as any).pool;
    const poolSize = pool?.size || pool?.max || 10;
    const idleConnections = pool?.available || pool?.idle || 0;
    const activeConnections = pool?.using || poolSize - idleConnections;

    // Calculate average query time
    const queryTimes = this.queryMetrics.queryTimes;
    const avgQueryTime =
      queryTimes.length > 0
        ? queryTimes.reduce((a, b) => a + b, 0) / queryTimes.length
        : 0;

    // Cache metrics
    let cacheStats = {
      hitRate: 0,
      hits: 0,
      misses: 0,
      size: 0,
      memoryUsage: 0,
    };

    if (this.cacheService?.getStats) {
      try {
        const stats = await this.cacheService.getStats();
        cacheStats = {
          hitRate: (stats.hitRate as number) || 0,
          hits: (stats.hits as number) || 0,
          misses: (stats.misses as number) || 0,
          size: (stats.size as number) || 0,
          memoryUsage: (stats.memoryUsage as number) || 0,
        };
      } catch (error) {
        this.logWarning('Failed to get cache stats', error);
      }
    }

    // WebSocket metrics
    const wsConnectedClients =
      this.websocketService?.getConnectedSocketsCount() || 0;

    // Job queue metrics
    const queueMetrics = {
      waitingJobs: 0,
      activeJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
    };

    if (this.queueManagerService) {
      try {
        const allStats = await this.queueManagerService.getAllQueueStats();
        Object.values(allStats).forEach((stats: Record<string, unknown>) => {
          queueMetrics.waitingJobs += (stats.waiting as number) || 0;
          queueMetrics.activeJobs += (stats.active as number) || 0;
          queueMetrics.completedJobs += (stats.completed as number) || 0;
          queueMetrics.failedJobs += (stats.failed as number) || 0;
        });
      } catch (error) {
        this.logWarning('Failed to collect queue metrics', error);
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
        messagesPerSecond:
          Math.round((this.wsMetrics.lastMinuteMessages.length / 60) * 100) /
          100,
        totalMessages:
          this.wsMetrics.messagesSent + this.wsMetrics.messagesReceived,
      },
      queue: {
        ...queueMetrics,
        averageProcessingTime:
          this.jobMetrics.processingTimes.length > 0
            ? Math.round(
                (this.jobMetrics.processingTimes.reduce((a, b) => a + b, 0) /
                  this.jobMetrics.processingTimes.length) *
                  100,
              ) / 100
            : 0,
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
      this.logWarning(
        `Slow query detected: ${queryTime}ms (threshold: ${this.queryMetrics.slowQueryThreshold}ms)`,
      );
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
    this.wsMetrics.lastMinuteMessages =
      this.wsMetrics.lastMinuteMessages.filter(
        (timestamp) => timestamp > oneMinuteAgo,
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
      this.logWarning(
        `Slow job detected: ${jobType || 'unknown'} took ${processingTime}ms`,
      );
    }

    // Keep processing times bounded (last 1000 jobs)
    if (this.jobMetrics.processingTimes.length > 1000) {
      this.jobMetrics.processingTimes.shift();
    }
  }
}
