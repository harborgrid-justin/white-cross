/**
 * @fileoverview Health Record Controller
 * @module health-record/health-record.controller
 * @description HTTP endpoints for student health record management
 */

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HealthRecordService } from './health-record.service';
import { HealthRecordCreateDto } from './dto/create-health-record.dto';
import { HealthRecordUpdateDto } from './dto/update-health-record.dto';
import { HealthRecordFilterDto } from './dto/health-record-filter.dto';
import { HealthRecordAuditInterceptor } from './interceptors/health-record-audit.interceptor';
import { HealthRecordCacheInterceptor } from './interceptors/health-record-cache.interceptor';
import { HealthRecordRateLimitGuard } from './guards/health-record-rate-limit.guard';
import { PHIAccessLogger } from './services/phi-access-logger.service';
import { HealthRecordMetricsService } from './services/health-record-metrics.service';
import type { HealthRecordRequest } from './interfaces/health-record-types';

/**
 * Health Record Controller
 *
 * Handles all HTTP endpoints for health record management:
 * - CRUD operations for health records
 * - Student health summaries
 * - Health record filtering and search
 * - HIPAA compliance dashboard and audit endpoints
 */
@ApiTags('health-record')
@Controller('health-record')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, HealthRecordRateLimitGuard)
@UseInterceptors(HealthRecordAuditInterceptor, HealthRecordCacheInterceptor)
export class HealthRecordController {
  constructor(
    private readonly healthRecordService: HealthRecordService,
    private readonly phiAccessLogger: PHIAccessLogger,
    private readonly metricsService: HealthRecordMetricsService,
  ) {}

  // ==================== CRUD Endpoints ====================

  /**
   * Get all health records with optional filtering and pagination
   */
  @Get()
  @ApiOperation({
    summary: 'Get all health records',
    description:
      'Retrieves all health records across all students with optional filtering and pagination.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page',
    example: 20,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by record type',
    example: 'VACCINATION',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: 'Filter by student ID',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    description: 'Filter records from this date (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    description: 'Filter records to this date (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @ApiQuery({
    name: 'provider',
    required: false,
    description: 'Filter by provider name',
    example: 'Dr. Smith',
  })
  @ApiResponse({
    status: 200,
    description: 'Health records retrieved successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('studentId') studentId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('provider') provider?: string,
    @Req() req?: HealthRecordRequest,
  ) {
    const filters: any = {};

    if (type) filters.type = type;
    if (studentId) filters.studentId = studentId;
    if (provider) filters.provider = provider;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);

    const result = await this.healthRecordService.getAllHealthRecords(
      page || 1,
      limit || 20,
      filters,
    );

    // Return in the format expected by frontend: { data: [...], meta: {...} }
    return {
      data: result.records,
      meta: {
        pagination: result.pagination,
        filters,
      },
    };
  }

  /**
   * Create a new health record
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create health record',
    description:
      'Creates a new health record entry for a student. Can include visit notes, diagnoses, treatments, and medications.',
  })
  @ApiBody({ type: HealthRecordCreateDto })
  @ApiResponse({
    status: 201,
    description: 'Health record created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data (validation errors)',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(
    @Body() createDto: HealthRecordCreateDto,
    @Req() req: HealthRecordRequest,
  ) {
    return this.healthRecordService.createHealthRecord(createDto);
  }

  /**
   * Get all health records for a student
   */
  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get student health records',
    description:
      'Retrieves all health records for a specific student with optional filtering.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Health records retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findByStudent(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
    @Query() filterDto: HealthRecordFilterDto,
    @Req() req: HealthRecordRequest,
  ) {
    return this.healthRecordService.getHealthRecord(studentId);
  }

  /**
   * Get specific health record by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get health record by ID',
    description: 'Retrieves a specific health record by its UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Health record UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Health record retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Health record not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Req() req: HealthRecordRequest,
  ) {
    const record = await this.healthRecordService.getHealthRecordById(id);

    return {
      data: record,
      meta: {
        recordId: id,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Update health record
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update health record',
    description: 'Updates an existing health record.',
  })
  @ApiParam({
    name: 'id',
    description: 'Health record UUID',
    format: 'uuid',
  })
  @ApiBody({ type: HealthRecordUpdateDto })
  @ApiResponse({
    status: 200,
    description: 'Health record updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data (validation errors)',
  })
  @ApiResponse({
    status: 404,
    description: 'Health record not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: HealthRecordUpdateDto,
    @Req() req: HealthRecordRequest,
  ) {
    return this.healthRecordService.updateHealthRecord(id, updateDto);
  }

  /**
   * Delete health record (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete health record',
    description: 'Soft deletes a health record for compliance.',
  })
  @ApiParam({
    name: 'id',
    description: 'Health record UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 204,
    description: 'Health record deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Health record not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Req() req: HealthRecordRequest,
  ) {
    await this.healthRecordService.deleteHealthRecord(id);
  }

  /**
   * Get student health summary
   */
  @Get('student/:studentId/summary')
  @ApiOperation({
    summary: 'Get health summary',
    description:
      'Retrieves comprehensive health summary including recent visits, conditions, medications, and allergies.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Health summary retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getHealthSummary(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
    @Req() req: HealthRecordRequest,
  ) {
    return this.healthRecordService.getCompleteHealthProfile(studentId);
  }

  // ==================== HIPAA Compliance Dashboard Endpoints ====================

  /**
   * Get PHI access statistics for compliance monitoring
   */
  @Get('compliance/phi-access-stats')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get PHI access statistics',
    description:
      'Retrieves PHI access statistics for HIPAA compliance monitoring.',
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
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 24 * 60 * 60 * 1000);
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
    description:
      'Retrieves security incidents related to PHI access for compliance review.',
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
    description:
      'Generates comprehensive HIPAA compliance report with PHI access details.',
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
  async getPerformanceMetrics() {
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
  async getHealthStatus() {
    return this.metricsService.getHealthStatus();
  }

  /**
   * Get Prometheus metrics for monitoring
   */
  @Get('metrics/prometheus')
  @ApiOperation({
    summary: 'Get Prometheus metrics',
    description:
      'Retrieves Prometheus-formatted metrics for external monitoring systems.',
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
  async getPrometheusMetrics() {
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
    description:
      'Retrieves comprehensive compliance dashboard data for monitoring interface.',
  })
  @ApiResponse({
    status: 200,
    description: 'Compliance dashboard data retrieved successfully',
  })
  async getComplianceDashboard() {
    const [
      phiStats,
      securityIncidents,
      metricsSnapshot,
      complianceReport,
      healthStatus,
    ] = await Promise.all([
      this.phiAccessLogger.getPHIAccessStatistics(
        new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        new Date(),
      ),
      this.phiAccessLogger.getSecurityIncidents(10),
      this.metricsService.getHealthRecordMetricsSnapshot(),
      this.metricsService.getComplianceReport(),
      this.metricsService.getHealthStatus(),
    ]);

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
