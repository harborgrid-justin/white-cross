/**
 * @fileoverview Alerts Controller
 * @module alerts/alerts.controller
 * @description HTTP endpoints for alert and notification management
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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertFilterDto } from './dto/alert-filter.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@ApiTags('alerts')
@Controller('alerts')
// @ApiBearerAuth()
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get user alerts',
    description: 'Retrieves all alerts for the current user with pagination.',
  })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'unreadOnly', required: false, type: 'boolean' })
  @ApiResponse({
    status: 200,
    description: 'Alerts retrieved successfully',
  })
  async getUserAlerts(@Query() filterDto: AlertFilterDto) {
    // TODO: Get userId from JWT token
    return this.alertsService.getUserAlerts('user-id', filterDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create alert',
    description: 'Creates a new alert/notification.',
  })
  @ApiResponse({
    status: 201,
    description: 'Alert created successfully',
  })
  async create(@Body() createDto: CreateAlertDto) {
    // TODO: Get userId from JWT token
    return this.alertsService.createAlert(createDto, 'system-user');
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Mark alert as read',
    description: 'Marks a specific alert as read.',
  })
  @ApiParam({ name: 'id', description: 'Alert UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Alert marked as read',
  })
  async markAsRead(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.alertsService.markAsRead(id, 'user-id');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete alert',
    description: 'Deletes a specific alert.',
  })
  @ApiParam({ name: 'id', description: 'Alert UUID', format: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Alert deleted successfully',
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.alertsService.deleteAlert(id);
  }

  @Get('preferences')
  @ApiOperation({
    summary: 'Get notification preferences',
    description: 'Retrieves notification preferences for the current user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Preferences retrieved successfully',
  })
  async getPreferences() {
    // TODO: Get userId from JWT token
    return this.alertsService.getPreferences('user-id');
  }

  @Patch('preferences')
  @ApiOperation({
    summary: 'Update notification preferences',
    description: 'Updates notification preferences for the current user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully',
  })
  async updatePreferences(@Body() updateDto: UpdatePreferencesDto) {
    // TODO: Get userId from JWT token
    return this.alertsService.updatePreferences('user-id', updateDto);
  }
}
