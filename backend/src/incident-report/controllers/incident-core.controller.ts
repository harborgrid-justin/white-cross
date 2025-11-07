/**
 * @fileoverview Incident Core Controller
 * @module incident-report/controllers/incident-core.controller
 * @description HTTP endpoints for core incident report CRUD operations
 */

import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IncidentReadService } from '../services/incident-read.service';
import { IncidentWriteService } from '../services/incident-write.service';
import { CreateIncidentReportDto } from '../dto/create-incident-report.dto';
import { IncidentFiltersDto } from '../dto/incident-filters.dto';
import { UpdateIncidentReportDto } from '../dto/update-incident-report.dto';

/**
 * Incident Core Controller
 *
 * Handles basic CRUD operations for incident reports:
 * - List incident reports with filtering
 * - Get single incident report by ID
 * - Create new incident report
 * - Update existing incident report
 */
@ApiTags('incident-reports-core')
@ApiBearerAuth()
@Controller('incident-reports')
export class IncidentCoreController {
  constructor(
    private readonly readService: IncidentReadService,
    private readonly writeService: IncidentWriteService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all incident reports with filters',
    description:
      'Retrieves paginated incident reports with comprehensive filtering by type, severity, status, date range, student, and location.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20)',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    type: String,
    description: 'Filter by student ID',
  })
  @ApiQuery({
    name: 'reportedById',
    required: false,
    type: String,
    description: 'Filter by reporter ID',
  })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Filter by incident type' })
  @ApiQuery({ name: 'severity', required: false, type: String, description: 'Filter by severity' })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: String,
    description: 'Filter from date (ISO string)',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: String,
    description: 'Filter to date (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'Incident reports retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/IncidentReport' } },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid filters provided' })
  async getIncidentReports(@Query() filters: IncidentFiltersDto) {
    return this.readService.getIncidentReports(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get incident report by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Incident report retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Incident report not found' })
  async getIncidentReportById(@Param('id', ParseUUIDPipe) id: string) {
    return this.readService.getIncidentReportById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new incident report',
    description: 'Creates a new incident report with validation and automatic notifications',
  })
  @ApiBody({ type: CreateIncidentReportDto })
  @ApiResponse({ status: 201, description: 'Incident report created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid incident report data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createIncidentReport(@Body() dto: CreateIncidentReportDto) {
    return this.writeService.createIncidentReport(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update incident report',
    description: 'Updates an existing incident report with validation',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateIncidentReportDto })
  @ApiResponse({ status: 200, description: 'Incident report updated successfully' })
  @ApiResponse({ status: 404, description: 'Incident report not found' })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  async updateIncidentReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIncidentReportDto,
  ) {
    return this.writeService.updateIncidentReport(id, dto);
  }
}
