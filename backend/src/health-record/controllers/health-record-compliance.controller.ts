/**
 * @fileoverview Health Record Compliance Controller
 * @module health-record/controllers/health-record-compliance.controller
 * @description HTTP endpoints for HIPAA compliance, monitoring, and audit operations
 */

import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PHIAccessLogger } from '../services/phi-access-logger.service';
import { HealthRecordMetricsService } from '../services/health-record-metrics.service';
import { HealthRecordAuditInterceptor } from '../interceptors/health-record-audit.interceptor';
import { HealthRecordCacheInterceptor } from '../interceptors/health-record-cache.interceptor';
import { HealthRecordRateLimitGuard } from '../guards/health-record-rate-limit.guard';

import { BaseController } from '@/common/base';
/**
 * Health Record Compliance Controller
 *
 * Handles HIPAA compliance, monitoring, and audit endpoints:
 * - PHI access statistics and logs
 * - Security incident tracking
 * - Compliance reporting
 * - Performance metrics
 * - System health monitoring
 */
@ApiTags('health-record-compliance')
@Controller('health-record')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, HealthRecordRateLimitGuard)
@UseInterceptors(HealthRecordAuditInterceptor, HealthRecordCacheInterceptor)
export class HealthRecordComplianceController extends BaseController {
  constructor(
    private readonly phiAccessLogger: PHIAccessLogger,
    private readonly metricsService: HealthRecordMetricsService,
  ) {}

  /**
   * Get PHI access statistics for compliance monitoring
   */
  @Get('compliance/phi-access-stats')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get PHI access statistics',
    description: 'Retrieves PHI access statistics for HIPAA compliance monitoring.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for statistics (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for statistics (ISO string)',
    example: '2024-01-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'PHI access statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalAccesses: { type: 'number' },
        uniqueUsers: { type: 'number' },
        uniqueStudents: { type: 'number' },
        operationCounts: { type: 'object' },
        dataTypeCounts: { type: 'object' },
        securityIncidents: { type: 'number' },
        period: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date-time' },
            end: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  async getPHIAccessStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    return this.phiAccessLogger.getPHIAccessStatistics(start, end);
  }

  /**
   * Get recent PHI access logs for audit review
   */
  @Get('compliance/phi-access-logs')
  @ApiOperation({
    summary: 'Get PHI access logs',
    description: 'Retrieves recent PHI access logs for audit purposes.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of entries to return',
    example: 100,
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: 'Filter by student ID',
  })
  @ApiQuery({
    name: 'operation',
    required: false,
    description: 'Filter by operation type',
  })
  @ApiResponse({
    status: 200,
    description: 'PHI access logs retrieved successfully',
  })
  async getPHIAccessLogs(
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
    @Query('studentId') studentId?: string,
    @Query('operation') operation?: string,
  ) {
    if (userId || studentId || operation) {
      return this.phiAccessLogger.searchPHIAccessLogs({
        userId,
        studentId,
        operation,
      });
    }

    return this.phiAccessLogger.getRecentPHIAccessLogs(limit || 100);
  }

  /**
   * Get security incidents for compliance review
   */
  @Get('compliance/security-incidents')
  @ApiOperation({
    summary: 'Get security incidents',
    description: 'Retrieves security incidents related to PHI access for compliance review.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of incidents to return',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Security incidents retrieved successfully',
  })
  async getSecurityIncidents(@Query('limit') limit?: number) {
    return this.phiAccessLogger.getSecurityIncidents(limit || 50);
  }

  /**
   * Generate comprehensive compliance report
   */
  @Get('compliance/report')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Generate compliance report',
    description: 'Generates comprehensive HIPAA compliance report with PHI access details.',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Report start date (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'Report end date (ISO string)',
    example: '2024-01-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Compliance report generated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date parameters',
  })
  async generateComplianceReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.phiAccessLogger.generateComplianceReport(start, end);
  }

  /**
   * Get health record performance metrics
   */
  @Get('metrics/performance')
  @ApiOperation({
    summary: 'Get performance metrics',
    description: 'Retrieves performance metrics for health record operations.',
  })
  @ApiResponse({
    status: 200,
    description: 'Performance metrics retrieved successfully',
  })
  getPerformanceMetrics() {
    return this.metricsService.getHealthRecordMetricsSnapshot();
  }

  /**
   * Get health status including compliance checks
   */
  @Get('health')
  @ApiOperation({
    summary: 'Get system health status',
    description: 'Retrieves health status including HIPAA compliance checks.',
  })
  @ApiResponse({
    status: 200,
    description: 'Health status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        healthy: { type: 'boolean' },
        issues: { type: 'array', items: { type: 'string' } },
        metrics: { type: 'object' },
      },
    },
  })
  getHealthStatus() {
    return this.metricsService.getHealthStatus();
  }

  /**
   * Get Prometheus metrics for monitoring
   */
  @Get('metrics/prometheus')
  @ApiOperation({
    summary: 'Get Prometheus metrics',
    description: 'Retrieves Prometheus-formatted metrics for external monitoring systems.',
  })
  @ApiResponse({
    status: 200,
    description: 'Prometheus metrics retrieved successfully',
    content: {
      'text/plain': {
        schema: { type: 'string' },
      },
    },
  })
  getPrometheusMetrics() {
    return {
      metrics: this.metricsService.getPrometheusMetrics(),
      contentType: 'text/plain',
    };
  }

  /**
   * Get compliance dashboard summary
   */
  @Get('compliance/dashboard')
  @ApiOperation({
    summary: 'Get compliance dashboard data',
    description: 'Retrieves comprehensive compliance dashboard data for monitoring interface.',
  })
  @ApiResponse({
    status: 200,
    description: 'Compliance dashboard data retrieved successfully',
  })
  getComplianceDashboard() {
    const phiStats = this.phiAccessLogger.getPHIAccessStatistics(
      new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      new Date(),
    );
    const securityIncidents = this.phiAccessLogger.getSecurityIncidents(10);
    const metricsSnapshot = this.metricsService.getHealthRecordMetricsSnapshot();
    const complianceReport = this.metricsService.getComplianceReport();
    const healthStatus = this.metricsService.getHealthStatus();

    return {
      summary: {
        totalPHIAccesses: phiStats.totalAccesses,
        securityIncidentCount: securityIncidents.length,
        systemHealth: healthStatus.healthy,
        complianceScore: complianceReport.complianceScore,
      },
      phiAccessStatistics: phiStats,
      recentSecurityIncidents: securityIncidents,
      performanceMetrics: metricsSnapshot.performanceMetrics,
      complianceMetrics: complianceReport,
      systemHealth: healthStatus,
      lastUpdated: new Date().toISOString(),
    };
  }
}