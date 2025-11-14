/**
 * @fileoverview Screening Controller
 * @module health-record/screening
 * @description HTTP endpoints for health screening management
 */

import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query, Version } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScreeningService } from './screening.service';
import { BatchScreeningDto } from './dto/screening.dto';
import { CreateReferralDto } from './dto/screening.dto';
import { OverdueScreeningsQueryDto } from './dto/screening.dto';
import { ScreeningScheduleQueryDto } from './dto/screening.dto';
import { ScreeningStatisticsQueryDto } from './dto/screening.dto';

import { BaseController } from '@/common/base';
@ApiTags('health-records-screenings')

@Controller('health-records/screenings')
// @ApiBearerAuth()
export class ScreeningController extends BaseController {
  constructor(private readonly screeningService: ScreeningService) {
    super();
  }

  /**
   * GAP-SCREEN-001: Get all screenings for a student
   */
  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get student screenings',
    description:
      'Retrieves all health screening records for a specific student.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Student screenings retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async getStudentScreenings(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    return this.screeningService.getStudentScreenings(studentId);
  }

  /**
   * GAP-SCREEN-002: Batch screening creation
   */
  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Import screenings in batch',
    description:
      'Creates multiple screening records at once for mass screening events.',
  })
  @ApiResponse({
    status: 201,
    description: 'Batch screenings created successfully',
    schema: {
      type: 'object',
      properties: {
        successCount: { type: 'number' },
        errorCount: { type: 'number' },
        createdIds: { type: 'array', items: { type: 'string' } },
        errors: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async batchCreate(@Body() batchDto: BatchScreeningDto) {
    return this.screeningService.batchCreate(batchDto.screenings);
  }

  /**
   * GAP-SCREEN-003: Get overdue screenings
   */
  @Get('overdue')
  @ApiOperation({
    summary: 'Get overdue screenings',
    description: 'Retrieves list of students with overdue health screenings.',
  })
  @ApiQuery({
    name: 'schoolId',
    required: false,
    description: 'Filter by school ID',
  })
  @ApiQuery({
    name: 'gradeLevel',
    required: false,
    description: 'Filter by grade level',
  })
  @ApiQuery({
    name: 'screeningType',
    required: false,
    description: 'Filter by screening type',
  })
  @ApiResponse({
    status: 200,
    description: 'Overdue screenings retrieved successfully',
  })
  async getOverdueScreenings(@Query() query: OverdueScreeningsQueryDto) {
    return this.screeningService.getOverdueScreenings(query);
  }

  /**
   * GAP-SCREEN-004: Get screening schedule
   */
  @Get('schedule')
  @ApiOperation({
    summary: 'Get screening schedule',
    description:
      'Retrieves required screening schedule by grade level and state.',
  })
  @ApiQuery({
    name: 'gradeLevel',
    required: false,
    description: 'Grade level',
  })
  @ApiQuery({
    name: 'stateCode',
    required: false,
    description: 'State code for state-specific requirements',
  })
  @ApiResponse({
    status: 200,
    description: 'Screening schedule retrieved successfully',
  })
  async getScreeningSchedule(@Query() query: ScreeningScheduleQueryDto) {
    return this.screeningService.getScreeningSchedule(query);
  }

  /**
   * GAP-SCREEN-005: Create screening referral
   */
  @Post(':id/referral')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create screening referral',
    description:
      'Creates a referral to a specialist based on screening results.',
  })
  @ApiParam({
    name: 'id',
    description: 'Screening UUID',
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Referral created successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Screening not found',
  })
  async createReferral(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() referralDto: CreateReferralDto,
  ) {
    return this.screeningService.createReferral(id, referralDto);
  }

  /**
   * GAP-SCREEN-006: Get screening statistics
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'Get screening statistics',
    description: 'Retrieves screening statistics and compliance metrics.',
  })
  @ApiQuery({
    name: 'schoolId',
    required: false,
    description: 'Filter by school ID',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for statistics',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for statistics',
  })
  @ApiQuery({
    name: 'screeningType',
    required: false,
    description: 'Filter by screening type',
  })
  @ApiResponse({
    status: 200,
    description: 'Screening statistics retrieved successfully',
  })
  async getStatistics(@Query() query: ScreeningStatisticsQueryDto) {
    return this.screeningService.getScreeningStatistics(query);
  }
}
