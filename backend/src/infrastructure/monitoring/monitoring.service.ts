/**
 * Monitoring Service
 *
 * @module infrastructure/monitoring
 * @description Comprehensive health monitoring service for all infrastructure components
 * with metrics collection, alerting, and performance tracking
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ComponentHealth,
  HealthCheckResponse,
  LivenessResponse,
  ReadinessResponse,
} from './interfaces/health-check.interface';
import {
  Alert,
  DashboardData,
  LogEntry,
  LogQueryParams,
  MetricsSnapshot,
  PerformanceEntry,
} from './interfaces/metrics.interface';
import { HealthCheckService } from './health-check.service';
import { MetricsCollectionService } from './metrics-collection.service';
import { AlertManagementService } from './alert-management.service';
import { PerformanceTrackingService } from './performance-tracking.service';
import { LogAggregationService } from './log-aggregation.service';

import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
/**
 * Service interfaces for optional dependencies
 */
interface CacheServiceInterface {
  getStats?(): Promise<Record<string, unknown>> | Record<string, unknown>;
}

interface WebSocketServiceInterface {
  getStats?(): Record<string, unknown>;
  isInitialized?(): boolean;
  getConnectedSocketsCount?(): number;
}

interface MessageQueueServiceInterface {
  getStats?(): Record<string, unknown>;
  getAllQueueStats?(): Promise<Record<string, any>>;
}

interface CircuitBreakerServiceInterface {
  getStats?(): Record<string, unknown>;
  getStatus?(service: string): any;
}

/**
 * MonitoringService
 *
 * @description Provides comprehensive health monitoring for all infrastructure components
 * including database, cache, external APIs, and job queues. Kubernetes-ready with
 * readiness and liveness probe support. Includes metrics collection, alerting,
 * performance tracking, and logging aggregation.
 *
 * This service now delegates to specialized services for better code organization:
 * - HealthCheckService: Component health checks
 * - MetricsCollectionService: System and performance metrics
 * - AlertManagementService: Alert generation and management
 * - PerformanceTrackingService: Performance entry tracking
 * - LogAggregationService: Log buffering and querying
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
  // Metrics collection interval
  private metricsInterval?: NodeJS.Timeout;
  private lastMetrics?: MetricsSnapshot;

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly healthCheckService: HealthCheckService,
    private readonly metricsCollectionService: MetricsCollectionService,
    private readonly alertManagementService: AlertManagementService,
    private readonly performanceTrackingService: PerformanceTrackingService,
    private readonly logAggregationService: LogAggregationService,
  ) {
    super({
      serviceName: 'MonitoringService',
      logger,
      enableAuditLogging: true,
    });
  }

  /**
   * Initialize monitoring service
   */
  async onModuleInit() {
    this.logInfo('Initializing monitoring service...');

    // Initialize log aggregation
    await this.logAggregationService.initialize();

    // Load slow query threshold
    const slowQueryThreshold = this.configService.get(
      'SLOW_QUERY_THRESHOLD_MS',
      1000,
    );
    this.metricsCollectionService.setSlowQueryThreshold(slowQueryThreshold);

    // Start metrics collection interval (every 30 seconds)
    this.startMetricsCollection();

    this.logInfo('Monitoring service initialized successfully');
  }

  /**
   * Inject optional service dependencies
   */
  setCacheService(cacheService: CacheServiceInterface | undefined): void {
    this.healthCheckService.setCacheService(cacheService);
    this.metricsCollectionService.setCacheService(cacheService);
    this.logInfo('Cache service registered for monitoring');
  }

  setWebSocketService(websocketService: WebSocketServiceInterface | undefined): void {
    this.healthCheckService.setWebSocketService(websocketService);
    this.metricsCollectionService.setWebSocketService(websocketService);
    this.logInfo('WebSocket service registered for monitoring');
  }

  setQueueManagerService(queueManagerService: MessageQueueServiceInterface | undefined): void {
    this.healthCheckService.setQueueManagerService(queueManagerService);
    this.metricsCollectionService.setQueueManagerService(queueManagerService);
    this.logInfo('Queue manager service registered for monitoring');
  }

  setCircuitBreakerService(circuitBreakerService: CircuitBreakerServiceInterface | undefined): void {
    this.healthCheckService.setCircuitBreakerService(circuitBreakerService);
    this.logInfo('Circuit breaker service registered for monitoring');
  }

  /**
   * Health Check Methods - Delegated to HealthCheckService
   */

  async checkDatabaseHealth(): Promise<ComponentHealth> {
    return this.healthCheckService.checkDatabaseHealth();
  }

  async checkRedisHealth(): Promise<ComponentHealth> {
    return this.healthCheckService.checkRedisHealth();
  }

  async checkWebSocketHealth(): Promise<ComponentHealth> {
    return this.healthCheckService.checkWebSocketHealth();
  }

  async checkJobQueueHealth(): Promise<ComponentHealth> {
    return this.healthCheckService.checkJobQueueHealth();
  }

  async checkExternalAPIHealth(): Promise<ComponentHealth> {
    return this.healthCheckService.checkExternalAPIHealth();
  }

  async performHealthCheck(): Promise<HealthCheckResponse> {
    return this.healthCheckService.performHealthCheck();
  }

  async checkReadiness(): Promise<ReadinessResponse> {
    return this.healthCheckService.checkReadiness();
  }

  checkLiveness(): LivenessResponse {
    return this.healthCheckService.checkLiveness();
  }

  /**
   * Metrics Collection Methods - Delegated to MetricsCollectionService
   */

  async collectSystemMetrics() {
    return this.metricsCollectionService.collectSystemMetrics();
  }

  async collectPerformanceMetrics() {
    return this.metricsCollectionService.collectPerformanceMetrics();
  }

  async collectMetrics(): Promise<MetricsSnapshot> {
    const snapshot = await this.metricsCollectionService.collectMetrics();
    this.lastMetrics = snapshot;

    // Check for alerts based on metrics
    await this.alertManagementService.checkAlerts(snapshot);

    return snapshot;
  }

  trackRequest(responseTime: number, success: boolean = true): void {
    this.metricsCollectionService.trackRequest(responseTime, success);
  }

  trackQuery(queryTime: number): void {
    this.metricsCollectionService.trackQuery(queryTime);
  }

  trackWebSocketMessage(direction: 'sent' | 'received'): void {
    this.metricsCollectionService.trackWebSocketMessage(direction);
  }

  trackJobProcessing(processingTime: number, jobType?: string): void {
    this.metricsCollectionService.trackJobProcessing(processingTime, jobType);
  }

  /**
   * Alert Management Methods - Delegated to AlertManagementService
   */

  getActiveAlerts(): Alert[] {
    return this.alertManagementService.getActiveAlerts();
  }

  acknowledgeAlert(alertId: string): void {
    this.alertManagementService.acknowledgeAlert(alertId);
  }

  resolveAlert(alertId: string): void {
    this.alertManagementService.resolveAlert(alertId);
  }

  /**
   * Performance Tracking Methods - Delegated to PerformanceTrackingService
   */

  trackPerformance(entry: PerformanceEntry): void {
    this.performanceTrackingService.trackPerformance(entry);
  }

  getRecentPerformance(limit: number = 100): PerformanceEntry[] {
    return this.performanceTrackingService.getRecentPerformance(limit);
  }

  /**
   * Log Aggregation Methods - Delegated to LogAggregationService
   */

  addLogEntry(entry: LogEntry): void {
    this.logAggregationService.addLogEntry(entry);
  }

  queryLogs(params: LogQueryParams): LogEntry[] {
    return this.logAggregationService.queryLogs(params);
  }

  /**
   * Dashboard Data
   *
   * @returns Promise resolving to dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    const health = await this.performHealthCheck();
    const metrics = this.lastMetrics || (await this.collectMetrics());
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
   * Metrics Collection Management
   */

  private startMetricsCollection(): void {
    // Collect metrics immediately
    this.collectMetrics().catch((error) => {
      this.logError('Failed to collect initial metrics', error);
    });

    // Collect metrics every 30 seconds
    this.metricsInterval = setInterval(() => {
      this.collectMetrics().catch((error) => {
        this.logError('Failed to collect metrics', error);
      });
    }, 30000);

    this.logInfo('Metrics collection started (30s interval)');
  }

  stopMetricsCollection(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = undefined;
      this.logInfo('Metrics collection stopped');
    }
  }
}
