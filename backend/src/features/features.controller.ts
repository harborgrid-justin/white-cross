/**
 * @fileoverview Features Controller
 * @module features/features.controller
 * @description HTTP endpoints for feature flag management
 */

import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FeaturesService } from './features.service';
import { ToggleFeatureDto } from '@/features/dto';

@ApiTags('features')
@Controller('features')
// @ApiBearerAuth()
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Get()
  @ApiOperation({
    summary: 'List all features',
    description: 'Retrieves all feature flags and their current status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Features retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          enabled: { type: 'boolean' },
          description: { type: 'string' },
        },
      },
    },
  })
  async findAll() {
    return this.featuresService.getAllFeatures();
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Get feature status',
    description: 'Checks if a specific feature is enabled.',
  })
  @ApiParam({
    name: 'name',
    description: 'Feature flag name',
    example: 'ai-search',
  })
  @ApiResponse({
    status: 200,
    description: 'Feature status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        enabled: { type: 'boolean' },
      },
    },
  })
  async getFeature(@Param('name') name: string) {
    return this.featuresService.isFeatureEnabled(name);
  }

  @Patch(':name')
  @ApiOperation({
    summary: 'Toggle feature flag',
    description: 'Enables or disables a feature flag. Admin only.',
  })
  @ApiParam({
    name: 'name',
    description: 'Feature flag name',
    example: 'ai-search',
  })
  @ApiResponse({
    status: 200,
    description: 'Feature toggled successfully',
  })
  async toggleFeature(
    @Param('name') name: string,
    @Body() toggleDto: ToggleFeatureDto,
  ) {
    return this.featuresService.toggleFeature(name, toggleDto.enabled);
  }
}
