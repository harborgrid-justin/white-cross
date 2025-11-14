/**
 * @fileoverview Health Record CRUD Controller
 * @module health-record/controllers/health-record-crud.controller
 * @description HTTP endpoints for basic CRUD operations on health records
 */

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../services/auth';
import { HealthRecordService } from '../health-record.service';
import { HealthRecordCreateDto } from '../dto/create-health-record.dto';
import { HealthRecordUpdateDto } from '../dto/update-health-record.dto';
import { HealthRecordAuditInterceptor } from '../interceptors/health-record-audit.interceptor';
import { HealthRecordCacheInterceptor } from '../interceptors/health-record-cache.interceptor';
import { HealthRecordRateLimitGuard } from '../guards/health-record-rate-limit.guard';

import { BaseController } from '@/common/base';
/**
 * Filter interface for health record queries
 */
interface HealthRecordFilters {
  type?: string;
  studentId?: string;
  provider?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Health Record CRUD Controller
 *
 * Handles basic CRUD operations for health records:
 * - Create, read, update, delete health records
 * - Student-specific health record retrieval
 * - Health summaries and filtering
 */
@ApiTags('Health Records')

@Controller('health-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, HealthRecordRateLimitGuard)
@UseInterceptors(HealthRecordAuditInterceptor, HealthRecordCacheInterceptor)
export class HealthRecordCrudController extends BaseController {
  constructor(private readonly healthRecordService: HealthRecordService) {}

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
  ) {
    const filters: HealthRecordFilters = {};

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
  async create(@Body() createDto: HealthRecordCreateDto) {
    return this.healthRecordService.createHealthRecord(createDto);
  }

  /**
   * Get all health records for a student
   */
  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get student health records',
    description: 'Retrieves all health records for a specific student with optional filtering.',
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
  async findByStudent(@Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string) {
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
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
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
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
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
  ): Promise<any> {
    return this.healthRecordService.getCompleteHealthProfile(studentId);
  }
}