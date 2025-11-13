/**
 * @fileoverview Incident Query Controller
 * @module incident-report/controllers/incident-query.controller
 * @description HTTP endpoints for incident report queries
 */

import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IncidentReadService } from '@/services/incident-read.service';
import { IncidentStatisticsService } from '@/services/incident-statistics.service';

import { BaseController } from '@/common/base';
/**
 * Incident Query Controller
 *
 * Handles query operations for incident reports:
 * - Get incidents requiring follow-up
 * - Get student recent incidents
 * - Get statistics
 * - Get incidents by type
 * - Get incidents by severity
 * - Get severity trends
 */
@ApiTags('incident-reports-query')
@ApiBearerAuth()
@Controller('incident-reports')
export class IncidentQueryController extends BaseController {
  constructor(
    private readonly readService: IncidentReadService,
    private readonly statisticsService: IncidentStatisticsService,
  ) {}

  @Get('follow-up/required')
  @ApiOperation({ summary: 'Get incidents requiring follow-up' })
  @ApiResponse({ status: 200, description: 'Returns incidents requiring follow-up' })
  async getIncidentsRequiringFollowUp() {
    return this.readService.getIncidentsRequiringFollowUp();
  }

  @Get('student/:studentId/recent')
  @ApiOperation({ summary: 'Get recent incidents for a student' })
  @ApiParam({ name: 'studentId', type: 'string', format: 'uuid' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of incidents to return (default: 10)',
  })
  @ApiResponse({ status: 200, description: 'Returns recent incidents for the student' })
  async getStudentRecentIncidents(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Query('limit') limit?: number,
  ) {
    const limitNum = limit ? parseInt(limit.toString()) : 10;
    return this.readService.getStudentRecentIncidents(studentId, limitNum);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get incident statistics' })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: String,
    description: 'Start date for statistics (ISO string)',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: String,
    description: 'End date for statistics (ISO string)',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    type: String,
    description: 'Filter by student ID',
  })
  @ApiResponse({ status: 200, description: 'Returns incident statistics' })
  async getStatistics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('studentId') studentId?: string,
  ) {
    return await this.statisticsService.getIncidentStatistics(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
      studentId,
    );
  }

  @Get('by-type')
  @ApiOperation({ summary: 'Get incident counts by type' })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: String,
    description: 'Start date filter (ISO string)',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: String,
    description: 'End date filter (ISO string)',
  })
  @ApiResponse({ status: 200, description: 'Returns incident counts grouped by type' })
  async getIncidentsByType(@Query('dateFrom') dateFrom?: string, @Query('dateTo') dateTo?: string) {
    return await this.statisticsService.getIncidentsByType(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }

  @Get('by-severity')
  @ApiOperation({ summary: 'Get incident counts by severity' })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: String,
    description: 'Start date filter (ISO string)',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: String,
    description: 'End date filter (ISO string)',
  })
  @ApiResponse({ status: 200, description: 'Returns incident counts grouped by severity' })
  async getIncidentsBySeverity(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return await this.statisticsService.getIncidentsBySeverity(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }

  @Get('severity-trends')
  @ApiOperation({ summary: 'Get severity trends over time' })
  @ApiQuery({
    name: 'dateFrom',
    required: true,
    type: String,
    description: 'Start date for trends (ISO string)',
  })
  @ApiQuery({
    name: 'dateTo',
    required: true,
    type: String,
    description: 'End date for trends (ISO string)',
  })
  @ApiResponse({ status: 200, description: 'Returns severity trends data' })
  async getSeverityTrends(@Query('dateFrom') dateFrom: string, @Query('dateTo') dateTo: string) {
    return await this.statisticsService.getSeverityTrends(new Date(dateFrom), new Date(dateTo));
  }
}
