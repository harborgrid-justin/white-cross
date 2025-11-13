/**
 * @fileoverview Appointment Statistics Controller
 * @module appointment/controllers/appointment-statistics.controller
 * @description HTTP endpoints for appointment statistics, analytics, and reporting
 */

import { Controller, Get, Logger, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentStatisticsService } from '../services/appointment-statistics.service';
import { AppointmentQueryService } from '../services/appointment-query.service';
import { StatisticsFiltersDto, SearchAppointmentsDto, DateRangeDto } from '../dto/statistics.dto';

import { BaseController } from '../../../common/base';
/**
 * Appointment Statistics Controller
 *
 * Handles statistics and analytics endpoints:
 * - Get appointment statistics
 * - Search appointments
 * - Get appointments by date range
 * - Get appointment trends
 * - Get no-show statistics
 * - Get utilization statistics
 */
@ApiTags('appointments-statistics')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentStatisticsController extends BaseController {
  private readonly logger = new Logger(AppointmentStatisticsController.name);

  constructor(
    private readonly appointmentStatisticsService: AppointmentStatisticsService,
    private readonly appointmentQueryService: AppointmentQueryService,
  ) {}

  /**
   * Get appointment statistics
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'Get appointment statistics',
    description: 'Retrieve comprehensive appointment statistics and metrics',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics(@Query() filters: StatisticsFiltersDto) {
    this.logger.log('GET /appointments/statistics');
    return this.appointmentStatisticsService.getStatistics(filters);
  }

  /**
   * Search appointments
   */
  @Get('search')
  @ApiOperation({
    summary: 'Search appointments',
    description: 'Search appointments by various criteria with full-text search',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  async searchAppointments(@Query() searchDto: SearchAppointmentsDto) {
    this.logger.log('GET /appointments/search');
    return this.appointmentStatisticsService.searchAppointments(searchDto);
  }

  /**
   * Get appointments by date range
   */
  @Get('range')
  @ApiOperation({
    summary: 'Get appointments by date range',
    description: 'Retrieve appointments within a specific date range',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointments retrieved successfully',
  })
  async getAppointmentsByDateRange(@Query() dateRange: DateRangeDto) {
    this.logger.log('GET /appointments/range');
    return this.appointmentQueryService.getAppointmentsByDateRange(dateRange);
  }

  /**
   * Get appointment trends
   */
  @Get('trends')
  @ApiOperation({
    summary: 'Get appointment trends',
    description: 'Retrieve appointment trends over time with analytics',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: true,
    description: 'Start date for trend analysis',
    example: '2025-10-01',
  })
  @ApiQuery({
    name: 'dateTo',
    required: true,
    description: 'End date for trend analysis',
    example: '2025-10-31',
  })
  @ApiQuery({
    name: 'groupBy',
    required: false,
    description: 'Grouping interval',
    enum: ['day', 'week', 'month'],
    example: 'day',
  })
  @ApiResponse({ status: 200, description: 'Trends retrieved successfully' })
  async getAppointmentTrends(
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('groupBy') groupBy?: 'day' | 'week' | 'month',
  ) {
    this.logger.log('GET /appointments/trends');
    return this.appointmentStatisticsService.getAppointmentTrends(
      dateFrom,
      dateTo,
      groupBy || 'day',
    );
  }

  /**
   * Get no-show statistics
   */
  @Get('stats/no-show')
  @ApiOperation({
    summary: 'Get no-show statistics',
    description: 'Retrieve no-show rates and statistics',
  })
  @ApiQuery({
    name: 'nurseId',
    required: false,
    description: 'Filter by nurse UUID',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    description: 'Start date for statistics',
    example: '2025-10-01',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    description: 'End date for statistics',
    example: '2025-10-31',
  })
  @ApiResponse({
    status: 200,
    description: 'No-show statistics retrieved successfully',
  })
  async getNoShowStats(
    @Query('nurseId') nurseId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    this.logger.log('GET /appointments/stats/no-show');
    return this.appointmentStatisticsService.getNoShowStats(nurseId, dateFrom, dateTo);
  }

  /**
   * Get utilization statistics
   */
  @Get('stats/utilization')
  @ApiOperation({
    summary: 'Get utilization statistics',
    description: 'Retrieve appointment slot utilization statistics',
  })
  @ApiQuery({
    name: 'nurseId',
    required: true,
    description: 'Nurse UUID',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: true,
    description: 'Start date for statistics',
    example: '2025-10-01',
  })
  @ApiQuery({
    name: 'dateTo',
    required: true,
    description: 'End date for statistics',
    example: '2025-10-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilization statistics retrieved successfully',
  })
  async getUtilizationStats(
    @Query('nurseId') nurseId: string,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ) {
    this.logger.log('GET /appointments/stats/utilization');
    return this.appointmentStatisticsService.getUtilizationStats(
      nurseId,
      dateFrom,
      dateTo,
    );
  }
}
