/**
 * @fileoverview Reminder Controller
 * @module appointment/controllers/reminder.controller
 * @description HTTP endpoints for appointment reminder management
 */

import { Body, Controller, Get, Logger, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReminderService } from '../services/reminder.service';
import { ReminderProcessingResultDto } from '../dto/reminder.dto';

import { BaseController } from '../../../common/base';
/**
 * Reminder Controller
 *
 * Handles reminder management endpoints:
 * - Process pending reminders
 * - Get appointment reminders
 * - Create reminders (handled by appointment creation)
 */
@ApiTags('appointments-reminders')
@ApiBearerAuth()
@Controller('appointments')
export class ReminderController extends BaseController {
  private readonly logger = new Logger(ReminderController.name);

  constructor(private readonly reminderService: ReminderService) {}

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
    return this.reminderService.processPendingReminders();
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
    return this.reminderService.getAppointmentReminders(id);
  }

  /**
   * Create appointment reminder (manual)
   */
  @Post(':id/reminders')
  @ApiOperation({
    summary: 'Create appointment reminder',
    description: 'Create a manual reminder for a specific appointment',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 201, description: 'Reminder created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format or validation failed' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async createAppointmentReminder(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() createDto: { scheduledFor: Date; type: string; message: string },
  ) {
    this.logger.log(`POST /appointments/${id}/reminders`);
    return this.reminderService.createAppointmentReminder(id, createDto);
  }
}