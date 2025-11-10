/**
 * Monitoring Controller
 *
 * @module infrastructure/monitoring
 * @description REST API endpoints for advanced monitoring, metrics, and dashboard
 */

import { Body, Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MonitoringService } from './monitoring.service';
import type {
  Alert,
  DashboardData,
  LogEntry,
  LogQueryParams,
  MetricsSnapshot,
  PerformanceEntry,
} from './interfaces/metrics.interface';

/**
 * MonitoringController
 *
 * @description Provides HTTP endpoints for advanced monitoring features including:
 * - Real-time metrics collection (CPU, memory, requests)
 * - Monitoring dashboard data
 * - Alert management
 * - Performance tracking
 * - Log aggregation and querying
 *
 * These endpoints should be protected in production environments.
 *
 * @example
 * ```bash
 * # Get current metrics
 * curl http://localhost:3000/monitoring/metrics
 *
 * # Get dashboard data
 * curl http://localhost:3000/monitoring/dashboard
 *
 * # Query logs
 * curl http://localhost:3000/monitoring/logs?level=error&limit=100
 * ```
 */
@ApiTags('Monitoring & Metrics')
@ApiBearerAuth()
@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  /**
   * Get current system and application metrics
   *
   * @returns Promise resolving to metrics snapshot
   * @description Returns comprehensive metrics including:
   * - System resources (CPU, memory)
   * - Application performance (requests/sec, response times)
   * - Component metrics (database, cache, WebSocket, queues)
   */
  @Get('metrics')
  @ApiOperation({
    summary: 'Get current metrics',
    description:
      'Returns comprehensive system and application metrics including CPU, memory, request rates, and component statistics',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Metrics retrieved successfully',
    type: Object,
  })
  async getMetrics(): Promise<{
    data: MetricsSnapshot;
    statusCode: HttpStatus;
  }> {
    const metrics = await this.monitoringService.collectMetrics();

    return {
      data: metrics,
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Get monitoring dashboard data
   *
   * @returns Promise resolving to dashboard data
   * @description Returns comprehensive dashboard data including:
   * - Overall system status
   * - Current metrics
   * - Active alerts
   * - Recent performance entries
   * - Component health summary
   */
  @Get('dashboard')
  @ApiOperation({
    summary: 'Get monitoring dashboard data',
    description:
      'Returns comprehensive monitoring dashboard data including status, metrics, alerts, and performance history',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dashboard data retrieved successfully',
    type: Object,
  })
  async getDashboard(): Promise<{
    data: DashboardData;
    statusCode: HttpStatus;
  }> {
    const dashboard = await this.monitoringService.getDashboardData();

    return {
      data: dashboard,
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Get active alerts
   *
   * @returns Array of active alerts
   * @description Returns all active (unacknowledged and unresolved) alerts
   */
  @Get('alerts')
  @ApiOperation({
    summary: 'Get active alerts',
    description:
      'Returns all active system alerts that have not been acknowledged or resolved',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alerts retrieved successfully',
    type: Array,
  })
  getActiveAlerts(): {
    data: Alert[];
    statusCode: HttpStatus;
  } {
    const alerts = this.monitoringService.getActiveAlerts();

    return {
      data: alerts,
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Acknowledge an alert
   *
   * @param alertId Alert ID to acknowledge
   * @returns Success response
   */
  @Post('alerts/:alertId/acknowledge')
  @ApiOperation({
    summary: 'Acknowledge an alert',
    description:
      'Marks an alert as acknowledged to prevent repeated notifications',
  })
  @ApiParam({
    name: 'alertId',
    description: 'The ID of the alert to acknowledge',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alert acknowledged successfully',
  })
  acknowledgeAlert(@Param('alertId') alertId: string): {
    message: string;
    statusCode: HttpStatus;
  } {
    this.monitoringService.acknowledgeAlert(alertId);

    return {
      message: `Alert ${alertId} acknowledged successfully`,
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Resolve an alert
   *
   * @param alertId Alert ID to resolve
   * @returns Success response
   */
  @Post('alerts/:alertId/resolve')
  @ApiOperation({
    summary: 'Resolve an alert',
    description:
      'Marks an alert as resolved when the underlying issue has been fixed',
  })
  @ApiParam({
    name: 'alertId',
    description: 'The ID of the alert to resolve',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alert resolved successfully',
  })
  resolveAlert(@Param('alertId') alertId: string): {
    message: string;
    statusCode: HttpStatus;
  } {
    this.monitoringService.resolveAlert(alertId);

    return {
      message: `Alert ${alertId} resolved successfully`,
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Get recent performance entries
   *
   * @param limit Maximum number of entries to return
   * @returns Array of performance entries
   */
  @Get('performance')
  @ApiOperation({
    summary: 'Get recent performance entries',
    description:
      'Returns recent performance tracking entries with operation timings and success status',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of entries to return',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Performance entries retrieved successfully',
    type: Array,
  })
  getRecentPerformance(@Query('limit') limit?: number): {
    data: PerformanceEntry[];
    statusCode: HttpStatus;
  } {
    const entries = this.monitoringService.getRecentPerformance(
      limit ? parseInt(limit.toString(), 10) : 100,
    );

    return {
      data: entries,
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Track a performance entry
   *
   * @param entry Performance entry to track
   * @returns Success response
   */
  @Post('performance')
  @ApiOperation({
    summary: 'Track a performance entry',
    description: 'Records a new performance entry for monitoring and analysis',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Performance entry tracked successfully',
  })
  trackPerformance(@Body() entry: PerformanceEntry): {
    message: string;
    statusCode: HttpStatus;
  } {
    this.monitoringService.trackPerformance(entry);

    return {
      message: 'Performance entry tracked successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  /**
   * Query logs
   *
   * @param level Log level filter
   * @param context Context filter
   * @param startTime Start timestamp
   * @param endTime End timestamp
   * @param limit Maximum number of entries
   * @param search Search query
   * @returns Array of log entries
   */
  @Get('logs')
  @ApiOperation({
    summary: 'Query log entries',
    description:
      'Queries aggregated log entries with optional filtering by level, context, time range, and search query',
  })
  @ApiQuery({
    name: 'level',
    required: false,
    description: 'Filter by log level',
    enum: ['debug', 'info', 'warn', 'error', 'fatal'],
  })
  @ApiQuery({
    name: 'context',
    required: false,
    description: 'Filter by context (module/service name)',
    type: String,
  })
  @ApiQuery({
    name: 'startTime',
    required: false,
    description: 'Filter logs after this timestamp',
    type: String,
  })
  @ApiQuery({
    name: 'endTime',
    required: false,
    description: 'Filter logs before this timestamp',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of entries to return',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search query for message content',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Log entries retrieved successfully',
    type: Array,
  })
  queryLogs(
    @Query('level') level?: string,
    @Query('context') context?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ): {
    data: LogEntry[];
    statusCode: HttpStatus;
  } {
    const params: LogQueryParams = {
      level: level as any,
      context,
      startTime,
      endTime,
      limit: limit ? parseInt(limit.toString(), 10) : undefined,
      search,
    };

    const logs = this.monitoringService.queryLogs(params);

    return {
      data: logs,
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Get system metrics only
   *
   * @returns Promise resolving to system metrics
   */
  @Get('metrics/system')
  @ApiOperation({
    summary: 'Get system metrics only',
    description:
      'Returns only system-level metrics (CPU, memory, process info)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'System metrics retrieved successfully',
  })
  async getSystemMetrics(): Promise<{
    data: Record<string, unknown>;
    statusCode: HttpStatus;
  }> {
    const metrics = await this.monitoringService.collectSystemMetrics();

    return {
      data: metrics,
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Get performance metrics only
   *
   * @returns Promise resolving to performance metrics
   */
  @Get('metrics/performance')
  @ApiOperation({
    summary: 'Get performance metrics only',
    description:
      'Returns only application performance metrics (requests, database, cache, etc.)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Performance metrics retrieved successfully',
  })
  async getPerformanceMetrics(): Promise<{
    data: Record<string, unknown>;
    statusCode: HttpStatus;
  }> {
    const metrics = await this.monitoringService.collectPerformanceMetrics();

    return {
      data: metrics,
      statusCode: HttpStatus.OK,
    };
  }
}
