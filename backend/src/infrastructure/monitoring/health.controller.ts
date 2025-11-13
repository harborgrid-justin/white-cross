/**
 * Health Check Controller
 *
 * @module infrastructure/monitoring
 * @description REST API endpoints for health monitoring and Kubernetes probes
 */

import { Controller, Get, HttpStatus, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../services/auth/decorators/public.decorator';
import { MonitoringService } from './monitoring.service';
import { BaseController } from '@/common/base';
import {
  HealthCheckResponse,
  HealthStatus,
  LivenessResponse,
  ReadinessResponse,
} from './interfaces/health-check.interface';

/**
 * HealthController
 *
 * @description Provides HTTP endpoints for health monitoring including:
 * - Comprehensive health check (/health)
 * - Kubernetes readiness probe (/health/ready)
 * - Kubernetes liveness probe (/health/live)
 *
 * All endpoints are unauthenticated to allow infrastructure monitoring tools
 * and Kubernetes to access them without credentials.
 *
 * VERSION_NEUTRAL: Health endpoints are version-neutral and remain at /health
 * (not /api/v1/health) for Kubernetes probe compatibility.
 *
 * @example
 * ```bash
 * # Check overall system health
 * curl http://localhost:3000/health
 *
 * # Check if ready to serve traffic
 * curl http://localhost:3000/health/ready
 *
 * # Check if process is alive
 * curl http://localhost:3000/health/live
 * ```
 */
@ApiTags('Health & Monitoring')
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController extends BaseController {
  constructor(private readonly monitoringService: MonitoringService) {}

  /**
   * Comprehensive health check endpoint
   *
   * @returns Promise resolving to detailed health status of all components
   * @description Returns comprehensive health information including:
   * - Overall system status
   * - Individual component health (database, Redis, WebSocket, job queues, external APIs)
   * - System uptime and version
   * - Detailed diagnostic information
   *
   * HTTP Status Codes:
   * - 200: System is healthy or degraded
   * - 503: System is unhealthy (Service Unavailable)
   */
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Comprehensive health check',
    description:
      'Returns detailed health status of all infrastructure components including database, cache, queues, and external APIs',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'System is healthy or degraded',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'System is unhealthy',
  })
  async getHealth(): Promise<{
    data: HealthCheckResponse;
    statusCode: HttpStatus;
  }> {
    const health = await this.monitoringService.performHealthCheck();

    const statusCode =
      health.status === HealthStatus.HEALTHY
        ? HttpStatus.OK
        : health.status === HealthStatus.DEGRADED
          ? HttpStatus.OK
          : HttpStatus.SERVICE_UNAVAILABLE;

    return {
      data: health,
      statusCode,
    };
  }

  /**
   * Kubernetes readiness probe endpoint
   *
   * @returns Promise resolving to readiness status
   * @description Indicates whether the application is ready to serve traffic.
   * Kubernetes will route traffic to the pod only if this returns 200.
   *
   * The application is considered ready when:
   * - Database connection is healthy
   *
   * HTTP Status Codes:
   * - 200: Application is ready to serve traffic
   * - 503: Application is not ready (Service Unavailable)
   *
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
   */
  @Public()
  @Get('ready')
  @ApiOperation({
    summary: 'Kubernetes readiness probe',
    description:
      'Returns 200 if the application is ready to serve traffic. Used by Kubernetes to determine when to route traffic to the pod.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application is ready to serve traffic',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Application is not ready',
  })
  async getReadiness(): Promise<{
    data: ReadinessResponse;
    statusCode: HttpStatus;
  }> {
    const readiness = await this.monitoringService.checkReadiness();

    const statusCode = readiness.ready
      ? HttpStatus.OK
      : HttpStatus.SERVICE_UNAVAILABLE;

    return {
      data: readiness,
      statusCode,
    };
  }

  /**
   * Kubernetes liveness probe endpoint
   *
   * @returns Liveness status
   * @description Simple health check to verify the process is running.
   * Kubernetes will restart the pod if this endpoint fails to respond.
   *
   * This is a lightweight check that only verifies the process is alive
   * and can respond to HTTP requests. It does not check external dependencies.
   *
   * HTTP Status Codes:
   * - 200: Process is alive and responding
   *
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
   */
  @Public()
  @Get('live')
  @ApiOperation({
    summary: 'Kubernetes liveness probe',
    description:
      'Returns 200 if the application process is alive. Used by Kubernetes to determine when to restart the pod.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Process is alive',
    type: Object,
  })
  getLiveness(): { data: LivenessResponse; statusCode: HttpStatus } {
    const liveness = this.monitoringService.checkLiveness();

    return {
      data: liveness,
      statusCode: HttpStatus.OK,
    };
  }
}
