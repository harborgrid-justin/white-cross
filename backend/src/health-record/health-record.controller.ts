/**
 * @fileoverview Health Record Controller
 * @module health-record/health-record.controller
 * @description HTTP endpoints for student health record management
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { HealthRecordService } from './health-record.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';
import { HealthRecordFilterDto } from './dto/health-record-filter.dto';

/**
 * Health Record Controller
 *
 * Handles all HTTP endpoints for health record management:
 * - CRUD operations for health records
 * - Student health summaries
 * - Health record filtering and search
 */
@ApiTags('health-record')
@Controller('health-record')
// @ApiBearerAuth() // Uncomment when authentication is implemented
export class HealthRecordController {
  constructor(private readonly healthRecordService: HealthRecordService) {}

  // ==================== CRUD Endpoints ====================

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
  @ApiBody({ type: CreateHealthRecordDto })
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
  async create(@Body() createDto: CreateHealthRecordDto) {
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
  ) {
    // Service method needs to be added
    return { message: 'Get by ID - pending service implementation', id };
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
  @ApiBody({ type: UpdateHealthRecordDto })
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
    @Body() updateDto: UpdateHealthRecordDto,
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
  ) {
    return this.healthRecordService.getCompleteHealthProfile(studentId);
  }
}
