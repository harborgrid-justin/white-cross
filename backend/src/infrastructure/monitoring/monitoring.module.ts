/**
 * Monitoring Module
 *
 * @module infrastructure/monitoring
 * @description NestJS module for health monitoring and system diagnostics
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { MonitoringService } from './monitoring.service';
import { HealthController } from './health.controller';
import { MonitoringController } from './monitoring.controller';
import { HealthCheckService } from './health-check.service';
import { MetricsCollectionService } from './metrics-collection.service';
import { AlertManagementService } from './alert-management.service';
import { PerformanceTrackingService } from './performance-tracking.service';
import { LogAggregationService } from './log-aggregation.service';

/**
 * MonitoringModule
 *
 * @description Provides comprehensive health monitoring infrastructure including:
 * - Database health checks with connection pool monitoring
 * - Redis cache monitoring with hit rate statistics
 * - External API status with circuit breaker integration
 * - Job queue health with detailed queue statistics
 * - WebSocket server status with connected client count
 * - Kubernetes readiness and liveness probes
 * - Real-time metrics collection (CPU, memory, requests/sec)
 * - Alert management for critical issues
 * - Performance tracking and analysis
 * - Log aggregation and querying
 * - Monitoring dashboard with comprehensive system overview
 *
 * This module is Kubernetes-ready and provides endpoints that can be used
 * for container orchestration health checks and production monitoring.
 *
 * Health Endpoints:
 * - GET /health - Comprehensive health check
 * - GET /health/ready - Kubernetes readiness probe
 * - GET /health/live - Kubernetes liveness probe
 *
 * Monitoring Endpoints:
 * - GET /monitoring/metrics - Real-time system and application metrics
 * - GET /monitoring/dashboard - Complete monitoring dashboard data
 * - GET /monitoring/alerts - Active system alerts
 * - POST /monitoring/alerts/:alertId/acknowledge - Acknowledge alert
 * - POST /monitoring/alerts/:alertId/resolve - Resolve alert
 * - GET /monitoring/performance - Recent performance entries
 * - POST /monitoring/performance - Track performance entry
 * - GET /monitoring/logs - Query aggregated logs
 * - GET /monitoring/metrics/system - System metrics only
 * - GET /monitoring/metrics/performance - Performance metrics only
 *
 * Features:
 * - Automatic metrics collection every 30 seconds
 * - Configurable alert thresholds via environment variables
 * - Performance tracking with P95/P99 percentiles
 * - Request rate monitoring (requests per second)
 * - Database connection pool monitoring
 * - Cache hit rate tracking
 * - WebSocket connection monitoring
 * - Job queue statistics tracking
 * - Circuit breaker status monitoring
 * - CPU and memory usage tracking
 * - Log aggregation with search and filtering
 *
 * Environment Variables (optional):
 * - ALERTS_ENABLED - Enable/disable alerting (default: true)
 * - ALERT_CPU_THRESHOLD - CPU usage alert threshold in % (default: 80)
 * - ALERT_MEMORY_THRESHOLD - Memory usage alert threshold in % (default: 85)
 * - ALERT_RESPONSE_TIME_THRESHOLD - Response time threshold in ms (default: 5000)
 * - ALERT_ERROR_RATE_THRESHOLD - Error rate threshold in % (default: 5)
 * - ALERT_DB_CONNECTION_THRESHOLD - DB connection pool threshold in % (default: 90)
 * - ALERT_FAILED_JOBS_THRESHOLD - Failed jobs count threshold (default: 100)
 *
 * @example
 * ```typescript
 * // Import in AppModule
 * @Module({
 *   imports: [MonitoringModule, ...],
 * })
 * export class AppModule {}
 *
 * // Inject MonitoringService to register other services
 * export class AppModule implements OnModuleInit {
 *   constructor(
 *     private readonly monitoringService: MonitoringService,
 *     private readonly cacheService: CacheService,
 *     private readonly websocketService: WebSocketService,
 *     private readonly queueManagerService: QueueManagerService,
 *     private readonly circuitBreakerService: CircuitBreakerService,
 *   ) {}
 *
 *   onModuleInit() {
 *     // Register services for monitoring
 *     this.monitoringService.setCacheService(this.cacheService);
 *     this.monitoringService.setWebSocketService(this.websocketService);
 *     this.monitoringService.setQueueManagerService(this.queueManagerService);
 *     this.monitoringService.setCircuitBreakerService(this.circuitBreakerService);
 *   }
 * }
 * ```
 *
 * @example
 * ```yaml
 * # Kubernetes deployment.yaml
 * livenessProbe:
 *   httpGet:
 *     path: /health/live
 *     port: 3000
 *   initialDelaySeconds: 30
 *   periodSeconds: 10
 *
 * readinessProbe:
 *   httpGet:
 *     path: /health/ready
 *     port: 3000
 *   initialDelaySeconds: 5
 *   periodSeconds: 5
 * ```
 *
 * @example
 * ```typescript
 * // Track request performance
 * const startTime = Date.now();
 * try {
 *   const result = await someOperation();
 *   const duration = Date.now() - startTime;
 *   monitoringService.trackRequest(duration, true);
 *   return result;
 * } catch (error) {
 *   const duration = Date.now() - startTime;
 *   monitoringService.trackRequest(duration, false);
 *   throw error;
 * }
 * ```
 */
@Module({
  imports: [
    ConfigModule,
    // SequelizeModule provides the database connection for health checks
    SequelizeModule.forFeature([]),
  ],
  controllers: [HealthController, MonitoringController],
  providers: [
    // Core monitoring service (orchestrates all other services)
    MonitoringService,

    // Specialized monitoring services
    HealthCheckService,
    MetricsCollectionService,
    AlertManagementService,
    PerformanceTrackingService,
    LogAggregationService,
  ],
  exports: [
    MonitoringService,
    HealthCheckService,
    MetricsCollectionService,
    AlertManagementService,
    PerformanceTrackingService,
    LogAggregationService,
  ],
})
export class MonitoringModule {}

// Note: SentryModule is imported separately in AppModule for global error tracking
