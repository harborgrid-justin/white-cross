import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigurationService } from './services/configuration.service';
import {
  ConfigurationBulkUpdateDto,
  CreateConfigurationDto,
  FilterConfigurationDto,
  ImportConfigurationsDto,
  UpdateConfigurationDto,
} from './dto';
import { ConfigCategory } from '../services/administration/enums/administration.enums';
import { JwtAuthGuard } from '@/services/auth/guards/jwt-auth.guard';

import { BaseController } from '@/common/base';
/**
 * Configuration Controller
 *
 * Manages system configuration settings with comprehensive CRUD operations,
 * validation, audit trails, and import/export capabilities.
 *
 * All endpoints require authentication. Administrative endpoints require admin role.
 */
@ApiTags('Configuration')

@Controller('configurations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConfigurationController extends BaseController {
  constructor(private readonly configurationService: ConfigurationService) {}

  /**
   * Get all configurations with optional filtering
   * GET /configurations
   */
  @Get()
  @ApiOperation({
    summary: 'Get all configurations',
    description:
      'Retrieve configurations with optional filtering by category, scope, tags, visibility, etc. Supports pagination and advanced search capabilities.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    example: 1,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    example: 50,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: ['system', 'security', 'notification', 'integration'],
    description: 'Filter by configuration category',
  })
  @ApiQuery({
    name: 'scope',
    required: false,
    description: 'Filter by configuration scope',
  })
  @ApiQuery({
    name: 'isPublic',
    required: false,
    type: 'boolean',
    description: 'Filter by public visibility',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in configuration keys and descriptions',
  })
  @ApiResponse({
    status: 200,
    description: 'Configurations retrieved successfully with pagination',
    schema: {
      type: 'object',
      properties: {
        configurations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              value: { type: 'string' },
              description: { type: 'string' },
              category: { type: 'string' },
              dataType: {
                type: 'string',
                enum: ['string', 'number', 'boolean', 'json'],
              },
              isPublic: { type: 'boolean' },
              isEditable: { type: 'boolean' },
              requiresRestart: { type: 'boolean' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getConfigurations(@Query() filter: FilterConfigurationDto) {
    return this.configurationService.getConfigurations(filter);
  }

  /**
   * Get a single configuration by key
   * GET /configurations/:key
   */
  @Get(':key')
  @ApiOperation({
    summary: 'Get configuration by key',
    description: 'Retrieve a single configuration by its unique key',
  })
  @ApiParam({ name: 'key', description: 'Configuration key' })
  @ApiQuery({
    name: 'scopeId',
    required: false,
    description: 'Optional scope ID for scoped configurations',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuration retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async getConfigByKey(
    @Param('key') key: string,
    @Query('scopeId') scopeId?: string,
  ) {
    return this.configurationService.getConfigByKey(key, scopeId);
  }

  /**
   * Get public configurations
   * GET /configurations/public/all
   */
  @Get('public/all')
  @ApiOperation({
    summary: 'Get public configurations',
    description:
      'Retrieve all configurations marked as public (safe for frontend exposure)',
  })
  @ApiResponse({
    status: 200,
    description: 'Public configurations retrieved successfully',
  })
  async getPublicConfigurations() {
    return this.configurationService.getPublicConfigurations();
  }

  /**
   * Get configurations by category
   * GET /configurations/category/:category
   */
  @Get('category/:category')
  @ApiOperation({
    summary: 'Get configurations by category',
    description: 'Retrieve all configurations in a specific category',
  })
  @ApiParam({
    name: 'category',
    enum: ConfigCategory,
    description: 'Configuration category',
  })
  @ApiQuery({
    name: 'scopeId',
    required: false,
    description: 'Optional scope ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Configurations retrieved successfully',
  })
  async getConfigsByCategory(
    @Param('category') category: ConfigCategory,
    @Query('scopeId') scopeId?: string,
  ) {
    return this.configurationService.getConfigsByCategory(category, scopeId);
  }

  /**
   * Get configurations requiring restart
   * GET /configurations/restart-required/all
   */
  @Get('restart-required/all')
  @ApiOperation({
    summary: 'Get configurations requiring restart',
    description:
      'Retrieve all configurations that require system restart when changed',
  })
  @ApiResponse({
    status: 200,
    description: 'Configurations retrieved successfully',
  })
  async getConfigsRequiringRestart() {
    return this.configurationService.getConfigsRequiringRestart();
  }

  /**
   * Get configuration change history
   * GET /configurations/:key/history
   */
  @Get(':key/history')
  @ApiOperation({
    summary: 'Get configuration history',
    description: 'Retrieve change history for a specific configuration',
  })
  @ApiParam({ name: 'key', description: 'Configuration key' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of history records',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Configuration history retrieved successfully',
  })
  async getConfigHistory(
    @Param('key') key: string,
    @Query('limit') limit?: number,
  ) {
    return this.configurationService.getConfigHistory(key, limit || 50);
  }

  /**
   * Get changes by user
   * GET /configurations/changes/user/:userId
   */
  @Get('changes/user/:userId')
  @ApiOperation({
    summary: 'Get configuration changes by user',
    description: 'Retrieve all configuration changes made by a specific user',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of records',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User changes retrieved successfully',
  })
  async getConfigChangesByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.configurationService.getConfigChangesByUser(
      userId,
      limit || 50,
    );
  }

  /**
   * Get recent changes
   * GET /configurations/changes/recent
   */
  @Get('changes/recent')
  @ApiOperation({
    summary: 'Get recent configuration changes',
    description:
      'Retrieve recent configuration changes across all configurations',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of records',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Recent changes retrieved successfully',
  })
  async getRecentChanges(@Query('limit') limit?: number) {
    return this.configurationService.getRecentChanges(limit || 100);
  }

  /**
   * Get configuration statistics
   * GET /configurations/statistics/summary
   */
  @Get('statistics/summary')
  @ApiOperation({
    summary: 'Get configuration statistics',
    description: 'Retrieve aggregate statistics about configurations',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getConfigurationStatistics() {
    return this.configurationService.getConfigurationStatistics();
  }

  /**
   * Create a new configuration
   * POST /configurations
   */
  @Post()
  @ApiOperation({
    summary: 'Create configuration',
    description:
      'Create a new system configuration with validation and audit trail. Requires ADMIN role. Supports various data types and validation rules.',
  })
  @ApiBody({ type: CreateConfigurationDto })
  @ApiResponse({
    status: 201,
    description: 'Configuration created successfully',
    schema: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        value: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        dataType: { type: 'string' },
        isPublic: { type: 'boolean' },
        isEditable: { type: 'boolean' },
        requiresRestart: { type: 'boolean' },
        createdBy: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data, validation errors, or key already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createConfiguration(@Body() createDto: CreateConfigurationDto) {
    return this.configurationService.createConfiguration(createDto);
  }

  /**
   * Update a configuration
   * PUT /configurations/:key
   */
  @Put(':key')
  @ApiOperation({
    summary: 'Update configuration',
    description:
      'Update a configuration value with comprehensive validation and audit trail. Tracks all changes for compliance. Some configurations may require system restart.',
  })
  @ApiParam({
    name: 'key',
    description: 'Configuration key',
    example: 'notification.email.enabled',
  })
  @ApiQuery({
    name: 'scopeId',
    required: false,
    description: 'Optional scope ID for scoped configurations',
  })
  @ApiBody({ type: UpdateConfigurationDto })
  @ApiResponse({
    status: 200,
    description: 'Configuration updated successfully with audit record',
    schema: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        oldValue: { type: 'string' },
        newValue: { type: 'string' },
        updatedBy: { type: 'string' },
        updatedAt: { type: 'string', format: 'date-time' },
        requiresRestart: { type: 'boolean' },
        changeId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation error, configuration not editable, or invalid value',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Insufficient permissions to modify this configuration',
  })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateConfiguration(
    @Param('key') key: string,
    @Body() updateDto: UpdateConfigurationDto,
    @Query('scopeId') scopeId?: string,
    @Req() request?: any,
  ) {
    // Extract IP and user agent from request if available
    if (request) {
      updateDto.ipAddress = updateDto.ipAddress || request.ip;
      updateDto.userAgent = updateDto.userAgent || request.get('user-agent');
    }

    return this.configurationService.updateConfiguration(
      key,
      updateDto,
      scopeId,
    );
  }

  /**
   * Bulk update configurations
   * PUT /configurations/bulk/update
   */
  @Put('bulk/update')
  @ApiOperation({
    summary: 'Bulk update configurations',
    description: 'Update multiple configurations in a single request',
  })
  @ApiResponse({ status: 200, description: 'Bulk update completed' })
  async bulkUpdateConfigurations(
    @Body() bulkUpdateDto: ConfigurationBulkUpdateDto,
  ) {
    return this.configurationService.bulkUpdateConfigurations(bulkUpdateDto);
  }

  /**
   * Reset configuration to default
   * PUT /configurations/:key/reset
   */
  @Put(':key/reset')
  @ApiOperation({
    summary: 'Reset configuration to default',
    description: 'Reset a configuration to its default value',
  })
  @ApiParam({ name: 'key', description: 'Configuration key' })
  @ApiQuery({
    name: 'scopeId',
    required: false,
    description: 'Optional scope ID',
  })
  @ApiResponse({ status: 200, description: 'Configuration reset successfully' })
  @ApiResponse({ status: 400, description: 'No default value specified' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async resetToDefault(
    @Param('key') key: string,
    @Body('changedBy') changedBy: string,
    @Query('scopeId') scopeId?: string,
  ) {
    return this.configurationService.resetToDefault(key, changedBy, scopeId);
  }

  /**
   * Delete a configuration
   * DELETE /configurations/:key
   */
  @Delete(':key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete configuration',
    description: 'Delete a configuration by key (ADMIN ONLY)',
  })
  @ApiParam({ name: 'key', description: 'Configuration key' })
  @ApiQuery({
    name: 'scopeId',
    required: false,
    description: 'Optional scope ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Configuration deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async deleteConfiguration(
    @Param('key') key: string,
    @Query('scopeId') scopeId?: string,
  ) {
    await this.configurationService.deleteConfiguration(key, scopeId);
  }

  /**
   * Export configurations
   * POST /configurations/export
   */
  @Post('export')
  @ApiOperation({
    summary: 'Export configurations',
    description: 'Export configurations as JSON with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Configurations exported successfully',
  })
  async exportConfigurations(@Body() filter: FilterConfigurationDto) {
    const json = await this.configurationService.exportConfigurations(filter);
    return { json, count: JSON.parse(json).length };
  }

  /**
   * Import configurations
   * POST /configurations/import
   */
  @Post('import')
  @ApiOperation({
    summary: 'Import configurations',
    description: 'Import configurations from JSON (ADMIN ONLY)',
  })
  @ApiResponse({
    status: 200,
    description: 'Import completed with results summary',
  })
  @ApiResponse({ status: 400, description: 'Invalid JSON format' })
  async importConfigurations(@Body() importDto: ImportConfigurationsDto) {
    return this.configurationService.importConfigurations(importDto);
  }
}
