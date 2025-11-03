import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeyAuthService } from './api-key-auth.service';
import { CreateApiKeyDto, ApiKeyResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../database/models/user.model';

/**
 * API Key Authentication Controller
 *
 * Manages API key lifecycle: creation, listing, rotation, revocation.
 * Only accessible by admins.
 *
 * @controller ApiKeyAuthController
 */
@ApiTags('API Key Management')
@Controller('api/v1/api-keys')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApiKeyAuthController {
  constructor(private readonly apiKeyAuthService: ApiKeyAuthService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DISTRICT_ADMIN)
  @ApiOperation({ summary: 'Generate a new API key' })
  @ApiResponse({
    status: 201,
    description: 'API key generated successfully',
    type: ApiKeyResponseDto,
  })
  async generateApiKey(
    @Body() createDto: CreateApiKeyDto,
    @Request() req,
  ): Promise<ApiKeyResponseDto> {
    return this.apiKeyAuthService.generateApiKey(createDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DISTRICT_ADMIN)
  @ApiOperation({ summary: 'List all API keys for current user' })
  @ApiResponse({ status: 200, description: 'API keys retrieved successfully' })
  async listApiKeys(@Request() req): Promise<any[]> {
    return this.apiKeyAuthService.listApiKeys(req.user.id);
  }

  @Post(':id/rotate')
  @Roles(UserRole.ADMIN, UserRole.DISTRICT_ADMIN)
  @ApiOperation({ summary: 'Rotate an API key (create new, revoke old)' })
  @ApiResponse({
    status: 200,
    description: 'API key rotated successfully',
    type: ApiKeyResponseDto,
  })
  async rotateApiKey(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ApiKeyResponseDto> {
    return this.apiKeyAuthService.rotateApiKey(id, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DISTRICT_ADMIN)
  @ApiOperation({ summary: 'Revoke an API key' })
  @ApiResponse({ status: 200, description: 'API key revoked successfully' })
  async revokeApiKey(@Param('id') id: string, @Request() req): Promise<void> {
    return this.apiKeyAuthService.revokeApiKey(id, req.user.id);
  }
}
