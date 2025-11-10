/**
 * @fileoverview Waitlist Controller
 * @module appointment/controllers/waitlist.controller
 * @description HTTP endpoints for appointment waitlist management
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WaitlistService } from '../services/waitlist.service';
import {
  CreateWaitlistEntryDto,
  NotifyWaitlistEntryDto,
  RemoveFromWaitlistDto,
  UpdateWaitlistPriorityDto,
  WaitlistFiltersDto,
} from '../dto/waitlist.dto';

/**
 * Waitlist Controller
 *
 * Handles waitlist management endpoints:
 * - Add to waitlist
 * - Get waitlist
 * - Update priority
 * - Get position
 * - Notify entry
 * - Remove from waitlist
 */
@ApiTags('appointments-waitlist')
@ApiBearerAuth()
@Controller('appointments')
export class WaitlistController {
  private readonly logger = new Logger(WaitlistController.name);

  constructor(private readonly waitlistService: WaitlistService) {}

  /**
   * Add student to appointment waitlist
   */
  @Post('waitlist')
  @ApiOperation({
    summary: 'Add to waitlist',
    description: 'Add student to appointment waitlist when no slots are available',
  })
  @ApiBody({ type: CreateWaitlistEntryDto })
  @ApiResponse({ status: 201, description: 'Successfully added to waitlist' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async addToWaitlist(@Body() createDto: CreateWaitlistEntryDto) {
    this.logger.log('POST /appointments/waitlist');
    return this.waitlistService.addToWaitlist(createDto);
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
    return this.waitlistService.getWaitlist(filters);
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
    return this.waitlistService.updateWaitlistPriority(id, updateDto.priority);
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
  async getWaitlistPosition(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.logger.log(`GET /appointments/waitlist/${id}/position`);
    return this.waitlistService.getWaitlistPosition(id);
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
    return this.waitlistService.notifyWaitlistEntry(id, notifyDto?.message);
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
    return this.waitlistService.removeFromWaitlist(id, removeDto?.reason);
  }
}
