/**
 * @fileoverview Appointment Status Controller
 * @module appointment/controllers/appointment-status.controller
 * @description HTTP endpoints for appointment status transitions
 */

import { Body, Controller, Logger, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentStatusService } from '@/services/appointment-status.service';

import { BaseController } from '@/common/base';
/**
 * Appointment Status Controller
 *
 * Handles status transition endpoints:
 * - Start appointment (SCHEDULED → IN_PROGRESS)
 * - Complete appointment (IN_PROGRESS → COMPLETED)
 * - Mark as no-show (SCHEDULED → NO_SHOW)
 */
@ApiTags('appointments-status')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentStatusController extends BaseController {
  private readonly logger = new Logger(AppointmentStatusController.name);

  constructor(private readonly appointmentStatusService: AppointmentStatusService) {}

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
  async startAppointment(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.logger.log(`PATCH /appointments/${id}/start`);
    return this.appointmentStatusService.startAppointment(id);
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
          description: 'Whether follow-up is required',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Appointment completed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot complete appointment in current state or invalid UUID',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async completeAppointment(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() completionData?: { notes?: string; outcomes?: string; followUpRequired?: boolean },
  ) {
    this.logger.log(`PATCH /appointments/${id}/complete`);
    return this.appointmentStatusService.completeAppointment(id, completionData);
  }

  /**
   * Mark appointment as no-show
   */
  @Patch(':id/no-show')
  @ApiOperation({
    summary: 'Mark appointment as no-show',
    description: 'Mark a scheduled appointment as no-show when student does not arrive',
  })
  @ApiParam({ name: 'id', description: 'Appointment UUID' })
  @ApiResponse({ status: 200, description: 'Appointment marked as no-show successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot mark appointment as no-show in current state or invalid UUID',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async markNoShow(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.logger.log(`PATCH /appointments/${id}/no-show`);
    return this.appointmentStatusService.markNoShow(id);
  }
}
