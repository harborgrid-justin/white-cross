/**
 * @fileoverview Appointment Query Controller
 * @module appointment/controllers/appointment-query.controller
 * @description HTTP endpoints for appointment queries and availability
 */

import { Controller, Get, Logger, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentQueryService } from '@/services/appointment-query.service';
import { DateRangeDto } from '../dto/statistics.dto';

import { BaseController } from '@/common/base';
/**
 * Appointment Query Controller
 *
 * Handles query and availability endpoints:
 * - Get appointments by date
 * - Get upcoming appointments
 * - Get nurse's upcoming appointments
 * - Check nurse availability
 */
@ApiTags('appointments-query')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentQueryController extends BaseController {
  private readonly logger = new Logger(AppointmentQueryController.name);

  constructor(private readonly appointmentQueryService: AppointmentQueryService) {}

  /**
   * Get appointments by date
   */
  @Get('by-date')
  @ApiOperation({
    summary: 'Get appointments by date',
    description: 'Retrieve all appointments for a specific date',
  })
  @ApiQuery({ name: 'date', description: 'Date in YYYY-MM-DD format', example: '2024-01-15' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved appointments for the date',
  })
  async getAppointmentsByDate(@Query('date') dateStr: string) {
    this.logger.log(`GET /appointments/by-date?date=${dateStr}`);
    return this.appointmentQueryService.getAppointmentsByDate(dateStr);
  }

  /**
   * Get upcoming appointments
   */
  @Get('upcoming')
  @ApiOperation({
    summary: 'Get upcoming appointments',
    description: 'Retrieve upcoming appointments across all nurses',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of appointments to return',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved upcoming appointments',
  })
  async getUpcomingAppointments(@Query('limit') limit?: number) {
    this.logger.log('GET /appointments/upcoming');
    return this.appointmentQueryService.getGeneralUpcomingAppointments(limit);
  }

  /**
   * Get nurse's upcoming appointments
   */
  @Get('nurse/:nurseId/upcoming')
  @ApiOperation({
    summary: 'Get nurse upcoming appointments',
    description: 'Retrieve upcoming appointments for a specific nurse',
  })
  @ApiParam({ name: 'nurseId', description: 'Nurse UUID' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of appointments to return',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved nurse upcoming appointments',
  })
  @ApiResponse({ status: 400, description: 'Invalid nurse UUID' })
  async getNurseUpcomingAppointments(
    @Param('nurseId', new ParseUUIDPipe({ version: '4' })) nurseId: string,
    @Query('limit') limit?: number,
  ) {
    this.logger.log(`GET /appointments/nurse/${nurseId}/upcoming`);
    return this.appointmentQueryService.getUpcomingAppointments(nurseId, limit);
  }

  /**
   * Check nurse availability
   */
  @Get('availability/:nurseId')
  @ApiOperation({
    summary: 'Check nurse availability',
    description: 'Check availability slots for a nurse within a date range',
  })
  @ApiParam({ name: 'nurseId', description: 'Nurse UUID' })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    description: 'Start date for availability check (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    description: 'End date for availability check (YYYY-MM-DD)',
    example: '2024-01-20',
  })
  @ApiQuery({
    name: 'duration',
    required: false,
    description: 'Appointment duration in minutes',
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved availability slots',
  })
  @ApiResponse({ status: 400, description: 'Invalid nurse UUID' })
  async checkAvailability(
    @Param('nurseId', new ParseUUIDPipe({ version: '4' })) nurseId: string,
    @Query() query: { dateFrom?: string; dateTo?: string; duration?: number },
  ) {
    this.logger.log(`GET /appointments/availability/${nurseId}`);
    return this.appointmentQueryService.getAvailableSlots(
      nurseId,
      query.dateFrom,
      query.dateTo,
      query.duration,
    );
  }
}
