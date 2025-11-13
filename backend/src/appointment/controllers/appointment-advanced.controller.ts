/**
 * @fileoverview Appointment Advanced Operations Controller
 * @module appointment/controllers/appointment-advanced.controller
 * @description HTTP endpoints for advanced appointment operations (recurring, bulk, conflicts, calendar)
 */

import { Body, Controller, Get, Logger, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentRecurringService } from '../services/appointment-recurring.service';
import { AppointmentWriteService } from '../services/appointment-write.service';
import { AppointmentSchedulingService } from '../services/appointment-scheduling.service';
import { AppointmentQueryService } from '../services/appointment-query.service';
import { CreateRecurringAppointmentDto } from '../dto/recurring.dto';
import { BulkCancelDto } from '../dto/statistics.dto';
import { AppointmentFiltersDto } from '../dto/appointment-filters.dto';

import { BaseController } from '../../common/base';
/**
 * Appointment Advanced Operations Controller
 *
 * Handles advanced appointment operations:
 * - Create recurring appointments
 * - Bulk cancel appointments
 * - Get appointments for multiple students
 * - Check for scheduling conflicts
 * - Export calendar in iCal format
 */
@ApiTags('appointments-advanced')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentAdvancedController extends BaseController {
  private readonly logger = new Logger(AppointmentAdvancedController.name);

  constructor(
    private readonly appointmentRecurringService: AppointmentRecurringService,
    private readonly appointmentWriteService: AppointmentWriteService,
    private readonly appointmentSchedulingService: AppointmentSchedulingService,
    private readonly appointmentQueryService: AppointmentQueryService,
  ) {}

  /**
   * Create recurring appointments
   */
  @Post('recurring')
  @ApiOperation({
    summary: 'Create recurring appointments',
    description: 'Create a series of recurring appointments based on a pattern',
  })
  @ApiBody({ type: CreateRecurringAppointmentDto })
  @ApiResponse({
    status: 201,
    description: 'Recurring appointments created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or scheduling conflicts',
  })
  async createRecurringAppointments(@Body() createDto: CreateRecurringAppointmentDto) {
    this.logger.log('POST /appointments/recurring');
    return this.appointmentRecurringService.createRecurringAppointments(createDto);
  }

  /**
   * Bulk cancel appointments
   */
  @Post('bulk/cancel')
  @ApiOperation({
    summary: 'Bulk cancel appointments',
    description: 'Cancel multiple appointments at once',
  })
  @ApiBody({ type: BulkCancelDto })
  @ApiResponse({ status: 200, description: 'Bulk cancellation completed' })
  async bulkCancelAppointments(@Body() bulkCancelDto: BulkCancelDto) {
    this.logger.log('POST /appointments/bulk/cancel');
    return this.appointmentWriteService.bulkCancelAppointments(bulkCancelDto);
  }

  /**
   * Get appointments for multiple students
   */
  @Get('students')
  @ApiOperation({
    summary: 'Get appointments for students',
    description: 'Retrieve appointments for multiple students',
  })
  @ApiQuery({
    name: 'studentIds',
    required: true,
    description: 'Comma-separated list of student UUIDs',
    example:
      '123e4567-e89b-12d3-a456-426614174000,987fcdeb-51a2-43d1-b456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointments retrieved successfully',
  })
  async getAppointmentsForStudents(
    @Query('studentIds') studentIds: string,
    @Query() filters?: Partial<AppointmentFiltersDto>,
  ) {
    this.logger.log('GET /appointments/students');
    const studentIdArray = studentIds.split(',');
    return this.appointmentQueryService.getAppointmentsForStudents(
      studentIdArray,
      filters,
    );
  }

  /**
   * Check for scheduling conflicts
   */
  @Get('conflicts')
  @ApiOperation({
    summary: 'Check conflicts',
    description: 'Check for scheduling conflicts before booking an appointment',
  })
  @ApiQuery({
    name: 'nurseId',
    required: true,
    description: 'Nurse UUID',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
  })
  @ApiQuery({
    name: 'startTime',
    required: true,
    description: 'Proposed start time (ISO 8601)',
    example: '2025-10-28T10:30:00Z',
  })
  @ApiQuery({
    name: 'duration',
    required: true,
    description: 'Appointment duration in minutes',
    example: 30,
  })
  @ApiQuery({
    name: 'excludeAppointmentId',
    required: false,
    description: 'Appointment ID to exclude from conflict check (for updates)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Conflict check completed' })
  async checkConflicts(
    @Query('nurseId') nurseId: string,
    @Query('startTime') startTime: string,
    @Query('duration') duration: string,
    @Query('excludeAppointmentId') excludeAppointmentId?: string,
  ) {
    this.logger.log('GET /appointments/conflicts');
    return this.appointmentSchedulingService.checkConflicts(
      nurseId,
      startTime,
      parseInt(duration, 10),
      excludeAppointmentId,
    );
  }

  /**
   * Export calendar
   */
  @Get('calendar/:nurseId')
  @ApiOperation({
    summary: 'Export calendar',
    description: 'Export nurse calendar in iCal format',
  })
  @ApiParam({ name: 'nurseId', description: 'Nurse UUID' })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    description: 'Start date for export',
    example: '2025-10-01',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    description: 'End date for export',
    example: '2025-10-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Calendar exported successfully',
    content: {
      'text/calendar': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  async exportCalendar(
    @Param('nurseId', new ParseUUIDPipe({ version: '4' })) nurseId: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    this.logger.log(`GET /appointments/calendar/${nurseId}`);
    return this.appointmentQueryService.exportCalendar(nurseId, dateFrom, dateTo);
  }
}
