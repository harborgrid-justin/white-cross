/**
 * Monitoring Module
 *
 * @module infrastructure/monitoring
 * @description NestJS module for health monitoring and system diagnostics
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoringService } from './monitoring.service';
import { HealthController } from './health.controller';

/**
 * MonitoringModule
 *
 * @description Provides comprehensive health monitoring infrastructure including:
 * - Database health checks
 * - Redis cache monitoring
 * - External API status
 * - Job queue health
 * - WebSocket server status
 * - Kubernetes readiness and liveness probes
 *
 * This module is Kubernetes-ready and provides endpoints that can be used
 * for container orchestration health checks.
 *
 * Endpoints:
 * - GET /health - Comprehensive health check
 * - GET /health/ready - Kubernetes readiness probe
 * - GET /health/live - Kubernetes liveness probe
 *
 * @example
 * ```typescript
 * // Import in AppModule
 * @Module({
 *   imports: [MonitoringModule, ...],
 * })
 * export class AppModule {}
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
 */
@Module({
  imports: [
    ConfigModule,
    // TypeOrmModule provides the database connection for health checks
    TypeOrmModule.forFeature([]),
  ],
  controllers: [HealthController],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule {}
