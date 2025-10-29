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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertFilterDto } from './dto/alert-filter.dto';
import { AlertsUpdatePreferencesDto } from './dto/update-preferences.dto';

@ApiTags('alerts')
@Controller('alerts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
  async getUserAlerts(
    @CurrentUser('id') userId: string,
    @Query() filterDto: AlertFilterDto,
  ) {
    return this.alertsService.getUserAlerts(userId, filterDto);
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
  async create(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateAlertDto,
  ) {
    return this.alertsService.createAlert(createDto, userId);
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
    @CurrentUser('id') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.alertsService.markAsRead(id, userId);
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
  async getPreferences(@CurrentUser('id') userId: string) {
    return this.alertsService.getPreferences(userId);
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
  async updatePreferences(
    @CurrentUser('id') userId: string,
    @Body() updateDto: AlertsUpdatePreferencesDto,
  ) {
    return this.alertsService.updatePreferences(userId, updateDto);
  }
}
