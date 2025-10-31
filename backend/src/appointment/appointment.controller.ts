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
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AppointmentService } from './services/appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentFiltersDto } from './dto/appointment-filters.dto';

/**
 * Appointment Controller
 * Handles HTTP endpoints for appointment management
 *
 * Endpoints:
 * - GET /appointments - List appointments with pagination and filters
 * - GET /appointments/:id - Get single appointment
 * - POST /appointments - Create new appointment
 * - PATCH /appointments/:id - Update appointment
 * - DELETE /appointments/:id - Cancel appointment
 * - POST /appointments/:id/start - Start appointment
 * - POST /appointments/:id/complete - Complete appointment
 * - POST /appointments/:id/no-show - Mark as no-show
 * - GET /appointments/nurse/:nurseId/upcoming - Get upcoming appointments
 * - GET /appointments/availability - Check availability
 */
@ApiTags('appointments')
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
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async getAppointmentById(@Param('id') id: string) {
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
  @ApiResponse({ status: 400, description: 'Validation failed or conflicts detected' })
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
    description: 'Update appointment details with validation and conflict checking',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed or invalid transition' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async updateAppointment(
    @Param('id') id: string,
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
  @ApiResponse({ status: 200, description: 'Appointment cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Cannot cancel appointment in current state' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async cancelAppointment(
    @Param('id') id: string,
    @Query('reason') reason?: string,
  ) {
    this.logger.log(`DELETE /appointments/${id}`);
    return this.appointmentService.cancelAppointment(id, reason);
  }

  /**
   * Start an appointment (transition to IN_PROGRESS)
   */
  @Post(':id/start')
  @ApiOperation({
    summary: 'Start appointment',
    description: 'Mark appointment as in progress when student arrives',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, description: 'Appointment started successfully' })
  @ApiResponse({ status: 400, description: 'Cannot start appointment in current state' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async startAppointment(@Param('id') id: string) {
    this.logger.log(`POST /appointments/${id}/start`);
    return this.appointmentService.startAppointment(id);
  }

  /**
   * Complete an appointment
   */
  @Post(':id/complete')
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
  @ApiResponse({ status: 200, description: 'Appointment completed successfully' })
  @ApiResponse({ status: 400, description: 'Cannot complete appointment in current state' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async completeAppointment(
    @Param('id') id: string,
    @Body() completionData?: any,
  ) {
    this.logger.log(`POST /appointments/${id}/complete`);
    return this.appointmentService.completeAppointment(id, completionData);
  }

  /**
   * Mark appointment as no-show
   */
  @Post(':id/no-show')
  @ApiOperation({
    summary: 'Mark as no-show',
    description: 'Mark appointment as no-show when student does not arrive',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, description: 'Appointment marked as no-show' })
  @ApiResponse({ status: 400, description: 'Cannot mark as no-show in current state' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async markNoShow(@Param('id') id: string) {
    this.logger.log(`POST /appointments/${id}/no-show`);
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
          items: { $ref: '#/components/schemas/Appointment' }
        }
      }
    }
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
          items: { $ref: '#/components/schemas/Appointment' }
        }
      }
    }
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
  @ApiResponse({ status: 200, description: 'Successfully retrieved upcoming appointments' })
  async getUpcomingAppointments(
    @Param('nurseId') nurseId: string,
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
  async getAvailableSlots(
    @Param('nurseId') nurseId: string,
    @Query('date') dateStr: string,
    @Query('duration') duration?: number,
  ) {
    const date = new Date(dateStr);
    this.logger.log(`GET /appointments/availability/${nurseId}?date=${dateStr}`);
    return this.appointmentService.getAvailableSlots(
      nurseId,
      date,
      duration ? parseInt(duration.toString(), 10) : 30,
    );
  }
}
