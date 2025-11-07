/**
 * @fileoverview Appointment Controller
 * @module appointment/appointment.controller
 * @description HTTP endpoints for appointment management with comprehensive healthcare workflow support
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
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentFiltersDto } from './dto/appointment-filters.dto';
import {
  CreateWaitlistEntryDto,
  WaitlistFiltersDto,
  UpdateWaitlistPriorityDto,
  RemoveFromWaitlistDto,
  NotifyWaitlistEntryDto,
} from './dto/waitlist.dto';
import {
  CreateReminderDto,
  ReminderProcessingResultDto,
} from './dto/reminder.dto';
import {
  StatisticsFiltersDto,
  SearchAppointmentsDto,
  BulkCancelDto,
  DateRangeDto,
} from './dto/statistics.dto';
import { CreateRecurringAppointmentDto } from './dto/recurring.dto';

/**
 * Appointment Controller
 *
 * Handles all HTTP endpoints for appointment management:
 * - CRUD operations for appointments
 * - Scheduling with conflict detection and availability checking
 * - Status lifecycle management (scheduled → in-progress → completed)
 * - Recurring appointment support
 * - Waitlist management integration
 * - Healthcare workflow optimization
 * - Business hours and schedule validation
 * - Reminder scheduling and notification
 */
@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentController {
  private readonly logger = new Logger(AppointmentController.name);

  constructor(private readonly appointmentService: AppointmentService) {}

  /**
   * Get appointments with pagination and filtering
   */
  @Get()
  @ApiOperation({
    summary: 'List appointments',
    description:
      'Retrieve appointments with pagination and optional filtering by nurse, student, status, type, and date range',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved appointments',
  })
  async getAppointments(@Query() filters: AppointmentFiltersDto) {
    this.logger.log('GET /appointments');
    return this.appointmentService.getAppointments(filters);
  }

  /**
   * Get a single appointment by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get appointment by ID',
    description: 'Retrieve detailed information about a specific appointment',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, description: 'Appointment found' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async getAppointmentById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.logger.log(`GET /appointments/${id}`);
    return this.appointmentService.getAppointmentById(id);
  }

  /**
   * Create a new appointment
   */
  @Post()
  @ApiOperation({
    summary: 'Create appointment',
    description:
      'Create a new appointment with validation and conflict checking',
  })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or conflicts detected',
  })
  async createAppointment(@Body() createDto: CreateAppointmentDto) {
    this.logger.log('POST /appointments');
    return this.appointmentService.createAppointment(createDto);
  }

  /**
   * Update an existing appointment
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update appointment',
    description:
      'Update appointment details with validation and conflict checking',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or invalid transition or invalid UUID',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async updateAppointment(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    this.logger.log(`PATCH /appointments/${id}`);
    return this.appointmentService.updateAppointment(id, updateDto);
  }

  /**
   * Cancel an appointment
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Cancel appointment',
    description:
      'Cancel an appointment with optional reason. Triggers waitlist processing.',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiQuery({
    name: 'reason',
    required: false,
    description: 'Reason for cancellation',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment cancelled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot cancel appointment in current state or invalid UUID',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async cancelAppointment(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query('reason') reason?: string,
  ) {
    this.logger.log(`DELETE /appointments/${id}`);
    return this.appointmentService.cancelAppointment(id, reason);
  }

  /**
   * Start an appointment (transition to IN_PROGRESS)
   */
  @Patch(':id/start')
  @ApiOperation({
    summary: 'Start appointment',
    description: 'Mark appointment as in progress when student arrives',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, description: 'Appointment started successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot start appointment in current state or invalid UUID',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async startAppointment(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.logger.log(`PATCH /appointments/${id}/start`);
    return this.appointmentService.startAppointment(id);
  }

  /**
   * Complete an appointment
   */
  @Patch(':id/complete')
  @ApiOperation({
    summary: 'Complete appointment',
    description: 'Mark appointment as completed with optional outcome data',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      properties: {
        notes: { type: 'string', description: 'Completion notes' },
        outcomes: { type: 'string', description: 'Health outcomes' },
        followUpRequired: {
          type: 'boolean',
          description: 'Whether follow-up is needed',
        },
        followUpDate: {
          type: 'string',
          format: 'date-time',
          description: 'Suggested follow-up date',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment completed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot complete appointment in current state or invalid UUID',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async completeAppointment(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() completionData?: Record<string, unknown>,
  ) {
    this.logger.log(`PATCH /appointments/${id}/complete`);
    return this.appointmentService.completeAppointment(id, completionData);
  }

  /**
   * Mark appointment as no-show
   */
  @Patch(':id/no-show')
  @ApiOperation({
    summary: 'Mark as no-show',
    description: 'Mark appointment as no-show when student does not arrive',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, description: 'Appointment marked as no-show' })
  @ApiResponse({
    status: 400,
    description: 'Cannot mark as no-show in current state or invalid UUID',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async markNoShow(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.logger.log(`PATCH /appointments/${id}/no-show`);
    return this.appointmentService.markNoShow(id);
  }

  /**
   * Get appointments by date
   */
  @Get('by-date')
  @ApiOperation({
    summary: 'Get appointments by date',
    description: 'Retrieve all appointments for a specific date',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'Date to filter appointments (YYYY-MM-DD)',
    example: '2025-10-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved appointments for the specified date',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Appointment' },
        },
      },
    },
  })
  async getAppointmentsByDate(@Query('date') dateStr: string) {
    this.logger.log(`GET /appointments/by-date?date=${dateStr}`);
    return this.appointmentService.getAppointmentsByDate(dateStr);
  }

  /**
   * Get upcoming appointments (general - not nurse-specific)
   */
  @Get('upcoming')
  @ApiOperation({
    summary: 'Get upcoming appointments',
    description: 'Retrieve upcoming appointments for the next N days',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to look ahead',
    example: 7,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of appointments to return',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved upcoming appointments',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Appointment' },
        },
      },
    },
  })
  async getGeneralUpcomingAppointments(
    @Query('days') days?: number,
    @Query('limit') limit?: number,
  ) {
    this.logger.log(`GET /appointments/upcoming?days=${days}&limit=${limit}`);
    return this.appointmentService.getGeneralUpcomingAppointments(
      days ? parseInt(days.toString(), 10) : 7,
      limit ? parseInt(limit.toString(), 10) : 50,
    );
  }

  /**
   * Get upcoming appointments for a nurse
   */
  @Get('nurse/:nurseId/upcoming')
  @ApiOperation({
    summary: 'Get upcoming appointments',
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
    description: 'Successfully retrieved upcoming appointments',
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  async getUpcomingAppointments(
    @Param('nurseId', new ParseUUIDPipe({ version: '4' })) nurseId: string,
    @Query('limit') limit?: number,
  ) {
    this.logger.log(`GET /appointments/nurse/${nurseId}/upcoming`);
    return this.appointmentService.getUpcomingAppointments(
      nurseId,
      limit ? parseInt(limit.toString(), 10) : 10,
    );
  }

  /**
   * Get available time slots
   */
  @Get('availability/:nurseId')
  @ApiOperation({
    summary: 'Check availability',
    description: 'Get available time slots for a nurse on a specific date',
  })
  @ApiParam({ name: 'nurseId', description: 'Nurse UUID' })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'Date to check availability (YYYY-MM-DD)',
    example: '2025-10-26',
  })
  @ApiQuery({
    name: 'duration',
    required: false,
    description: 'Slot duration in minutes',
    example: 30,
  })
  @ApiResponse({ status: 200, description: 'Available slots retrieved' })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format or invalid date',
  })
  async getAvailableSlots(
    @Param('nurseId', new ParseUUIDPipe({ version: '4' })) nurseId: string,
    @Query('date') dateStr: string,
    @Query('duration') duration?: number,
  ) {
    const date = new Date(dateStr);
    this.logger.log(
      `GET /appointments/availability/${nurseId}?date=${dateStr}`,
    );
    return this.appointmentService.getAvailableSlots(
      nurseId,
      date,
      duration ? parseInt(duration.toString(), 10) : 30,
    );
  }

  // ==================== WAITLIST ENDPOINTS ====================

  /**
   * Add student to appointment waitlist
   */
  @Post('waitlist')
  @ApiOperation({
    summary: 'Add to waitlist',
    description:
      'Add student to appointment waitlist when no slots are available',
  })
  @ApiBody({ type: CreateWaitlistEntryDto })
  @ApiResponse({ status: 201, description: 'Successfully added to waitlist' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async addToWaitlist(@Body() createDto: CreateWaitlistEntryDto) {
    this.logger.log('POST /appointments/waitlist');
    return this.appointmentService.addToWaitlist(createDto);
  }

  /**
   * Get appointment waitlist
   */
  @Get('waitlist')
  @ApiOperation({
    summary: 'Get waitlist',
    description: 'Retrieve appointment waitlist with filtering and pagination',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved waitlist' })
  async getWaitlist(@Query() filters: WaitlistFiltersDto) {
    this.logger.log('GET /appointments/waitlist');
    return this.appointmentService.getWaitlist(filters);
  }

  /**
   * Update waitlist entry priority
   */
  @Patch('waitlist/:id/priority')
  @ApiOperation({
    summary: 'Update waitlist priority',
    description: 'Update the priority level of a waitlist entry',
  })
  @ApiParam({ name: 'id', description: 'Waitlist entry UUID' })
  @ApiBody({ type: UpdateWaitlistPriorityDto })
  @ApiResponse({ status: 200, description: 'Priority updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Waitlist entry not found' })
  async updateWaitlistPriority(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: UpdateWaitlistPriorityDto,
  ) {
    this.logger.log(`PATCH /appointments/waitlist/${id}/priority`);
    return this.appointmentService.updateWaitlistPriority(
      id,
      updateDto.priority,
    );
  }

  /**
   * Get waitlist position
   */
  @Get('waitlist/:id/position')
  @ApiOperation({
    summary: 'Get waitlist position',
    description: 'Get the current position of a student in the waitlist',
  })
  @ApiParam({ name: 'id', description: 'Waitlist entry UUID' })
  @ApiResponse({ status: 200, description: 'Position retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Waitlist entry not found' })
  async getWaitlistPosition(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.logger.log(`GET /appointments/waitlist/${id}/position`);
    return this.appointmentService.getWaitlistPosition(id);
  }

  /**
   * Notify waitlist entry
   */
  @Post('waitlist/:id/notify')
  @ApiOperation({
    summary: 'Notify waitlist entry',
    description: 'Send notification to waitlisted student about available slot',
  })
  @ApiParam({ name: 'id', description: 'Waitlist entry UUID' })
  @ApiBody({ type: NotifyWaitlistEntryDto, required: false })
  @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Waitlist entry not found' })
  async notifyWaitlistEntry(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() notifyDto?: NotifyWaitlistEntryDto,
  ) {
    this.logger.log(`POST /appointments/waitlist/${id}/notify`);
    return this.appointmentService.notifyWaitlistEntry(id, notifyDto?.message);
  }

  /**
   * Remove from waitlist
   */
  @Delete('waitlist/:id')
  @ApiOperation({
    summary: 'Remove from waitlist',
    description: 'Remove student from appointment waitlist',
  })
  @ApiParam({ name: 'id', description: 'Waitlist entry UUID' })
  @ApiBody({ type: RemoveFromWaitlistDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Removed from waitlist successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Waitlist entry not found' })
  async removeFromWaitlist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() removeDto?: RemoveFromWaitlistDto,
  ) {
    this.logger.log(`DELETE /appointments/waitlist/${id}`);
    return this.appointmentService.removeFromWaitlist(id, removeDto?.reason);
  }

  // ==================== REMINDER ENDPOINTS ====================

  /**
   * Process pending reminders
   */
  @Post('reminders/process')
  @ApiOperation({
    summary: 'Process pending reminders',
    description: 'Process all pending appointment reminders for delivery',
  })
  @ApiResponse({ status: 200, description: 'Reminders processed successfully' })
  async processPendingReminders(): Promise<ReminderProcessingResultDto> {
    this.logger.log('POST /appointments/reminders/process');
    return this.appointmentService.processPendingReminders();
  }

  /**
   * Get appointment reminders
   */
  @Get(':id/reminders')
  @ApiOperation({
    summary: 'Get appointment reminders',
    description: 'Retrieve all reminders for a specific appointment',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, description: 'Reminders retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async getAppointmentReminders(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.logger.log(`GET /appointments/${id}/reminders`);
    return this.appointmentService.getAppointmentReminders(id);
  }

  /**
   * Schedule custom reminder
   */
  @Post('reminders')
  @ApiOperation({
    summary: 'Schedule reminder',
    description: 'Schedule a custom reminder for an appointment',
  })
  @ApiBody({ type: CreateReminderDto })
  @ApiResponse({ status: 201, description: 'Reminder scheduled successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async scheduleReminder(@Body() createDto: CreateReminderDto) {
    this.logger.log('POST /appointments/reminders');
    return this.appointmentService.scheduleReminder(createDto);
  }

  /**
   * Cancel reminder
   */
  @Delete('reminders/:reminderId')
  @ApiOperation({
    summary: 'Cancel reminder',
    description: 'Cancel a scheduled appointment reminder',
  })
  @ApiParam({ name: 'reminderId', description: 'Reminder UUID' })
  @ApiResponse({ status: 200, description: 'Reminder cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Reminder not found' })
  async cancelReminder(
    @Param('reminderId', new ParseUUIDPipe({ version: '4' }))
    reminderId: string,
  ) {
    this.logger.log(`DELETE /appointments/reminders/${reminderId}`);
    return this.appointmentService.cancelReminder(reminderId);
  }

  // ==================== STATISTICS ENDPOINTS ====================

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
    return this.appointmentService.getStatistics(filters);
  }

  /**
   * Search appointments
   */
  @Get('search')
  @ApiOperation({
    summary: 'Search appointments',
    description:
      'Search appointments by various criteria with full-text search',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  async searchAppointments(@Query() searchDto: SearchAppointmentsDto) {
    this.logger.log('GET /appointments/search');
    return this.appointmentService.searchAppointments(searchDto);
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
    return this.appointmentService.getAppointmentsByDateRange(dateRange);
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
    return this.appointmentService.getAppointmentTrends(
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
    return this.appointmentService.getNoShowStats(nurseId, dateFrom, dateTo);
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
    return this.appointmentService.getUtilizationStats(
      nurseId,
      dateFrom,
      dateTo,
    );
  }

  // ==================== RECURRING APPOINTMENTS ====================

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
  async createRecurringAppointments(
    @Body() createDto: CreateRecurringAppointmentDto,
  ) {
    this.logger.log('POST /appointments/recurring');
    return this.appointmentService.createRecurringAppointments(createDto);
  }

  // ==================== BULK OPERATIONS ====================

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
    return this.appointmentService.bulkCancelAppointments(bulkCancelDto);
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
    return this.appointmentService.getAppointmentsForStudents(
      studentIdArray,
      filters,
    );
  }

  // ==================== CONFLICT CHECKING ====================

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
    return this.appointmentService.checkConflicts(
      nurseId,
      startTime,
      parseInt(duration, 10),
      excludeAppointmentId,
    );
  }

  // ==================== CALENDAR EXPORT ====================

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
    return this.appointmentService.exportCalendar(nurseId, dateFrom, dateTo);
  }
}
