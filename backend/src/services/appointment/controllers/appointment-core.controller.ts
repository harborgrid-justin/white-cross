/**
 * @fileoverview Core Appointment Controller
 * @module appointment/controllers/appointment-core.controller
 * @description HTTP endpoints for core appointment CRUD operations
 */

import { Body, Controller, Delete, Get, Logger, Param, ParseUUIDPipe, Patch, Post, Query, Version } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentReadService } from '../services/appointment-read.service';
import { AppointmentWriteService } from '../services/appointment-write.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { AppointmentFiltersDto } from '../dto/appointment-filters.dto';

import { BaseController } from '@/common/base';
/**
 * Core Appointment Controller
 *
 * Handles basic CRUD operations for appointments:
 * - List appointments with filtering
 * - Get single appointment by ID
 * - Create new appointment
 * - Update existing appointment
 * - Cancel appointment
 */
@ApiTags('appointments-core')
@ApiBearerAuth()

@Version('1')
@Controller('appointments')
export class AppointmentCoreController extends BaseController {
  private readonly logger = new Logger(AppointmentCoreController.name);

  constructor(
    private readonly appointmentReadService: AppointmentReadService,
    private readonly appointmentWriteService: AppointmentWriteService,
  ) {}

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
  getAppointments(@Query() filters: AppointmentFiltersDto) {
    this.logger.log('GET /appointments');
    return this.appointmentReadService.getAppointments(filters);
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
  getAppointmentById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.logger.log(`GET /appointments/${id}`);
    return this.appointmentReadService.getAppointmentById(id);
  }

  /**
   * Create a new appointment
   */
  @Post()
  @ApiOperation({
    summary: 'Create appointment',
    description: 'Create a new appointment with validation and conflict checking',
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
    return this.appointmentWriteService.createAppointment(createDto);
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
    return this.appointmentWriteService.updateAppointment(id, updateDto);
  }

  /**
   * Cancel an appointment
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Cancel appointment',
    description: 'Cancel an appointment with optional reason. Triggers waitlist processing.',
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
    return this.appointmentWriteService.cancelAppointment(id, reason);
  }
}
