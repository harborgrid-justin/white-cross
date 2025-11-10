/**
 * LOC: EDU-DOWN-INTEGRATION-CTRL
 * File: integration-controller.ts
 * Purpose: Integration REST Controller - Production-grade HTTP endpoints
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
  Logger,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  IntegrationService,
  ExternalSystemConnection,
  SyncLog,
  IntegrationConfig,
} from './integration-service';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';

@ApiTags('integration')
@ApiBearerAuth()
@Controller('integration')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IntegrationController {
  private readonly logger = new Logger(IntegrationController.name);

  constructor(private readonly integrationService: IntegrationService) {}

  @Get('systems')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all external system connections' })
  @ApiResponse({ status: 200, description: 'Connections retrieved', type: [ExternalSystemConnection] })
  async getSystemConnections(): Promise<ExternalSystemConnection[]> {
    return this.integrationService.getSystemConnections();
  }

  @Get('systems/:systemName/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get connection status for external system' })
  @ApiParam({ name: 'systemName', type: 'string' })
  @ApiResponse({ status: 200, description: 'Status retrieved', type: ExternalSystemConnection })
  @ApiNotFoundResponse({ description: 'System not found' })
  async getConnectionStatus(
    @Param('systemName') systemName: string
  ): Promise<ExternalSystemConnection> {
    return this.integrationService.getConnectionStatus(systemName);
  }

  @Post('systems/:systemName/test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test connection to external system' })
  @ApiParam({ name: 'systemName', type: 'string' })
  @ApiResponse({ status: 200, description: 'Connection test completed', schema: { type: 'object', properties: { connected: { type: 'boolean' }, message: { type: 'string' } } } })
  @ApiServiceUnavailableResponse({ description: 'Connection test failed' })
  async testConnection(
    @Param('systemName') systemName: string
  ): Promise<{ connected: boolean; message: string }> {
    return this.integrationService.testConnection(systemName);
  }

  @Post('systems/:systemName/sync')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Trigger data synchronization' })
  @ApiParam({ name: 'systemName', type: 'string' })
  @ApiCreatedResponse({ description: 'Sync initiated', type: SyncLog })
  @ApiBadRequestResponse({ description: 'Sync failed' })
  async syncData(
    @Param('systemName') systemName: string
  ): Promise<SyncLog> {
    return this.integrationService.syncData(systemName);
  }

  @Get('systems/:systemName/logs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get synchronization logs' })
  @ApiParam({ name: 'systemName', type: 'string' })
  @Query('limit', 'number')
  @ApiResponse({ status: 200, description: 'Logs retrieved', type: [SyncLog] })
  async getSyncLogs(
    @Param('systemName') systemName: string,
    @Query('limit') limit?: string
  ): Promise<SyncLog[]> {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.integrationService.getSyncLogs(systemName, limitNum);
  }

  @Get('systems/:systemId/config')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get integration configuration' })
  @ApiParam({ name: 'systemId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Configuration retrieved', type: [IntegrationConfig] })
  @ApiNotFoundResponse({ description: 'Configuration not found' })
  async getIntegrationConfig(
    @Param('systemId', ParseUUIDPipe) systemId: string
  ): Promise<IntegrationConfig[]> {
    return this.integrationService.getIntegrationConfig(systemId);
  }

  @Put('systems/:systemId/config/:configKey')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update integration configuration' })
  @ApiParam({ name: 'systemId', type: 'string' })
  @ApiParam({ name: 'configKey', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        configValue: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Configuration updated' })
  @ApiBadRequestResponse({ description: 'Update failed' })
  async updateIntegrationConfig(
    @Param('systemId', ParseUUIDPipe) systemId: string,
    @Param('configKey') configKey: string,
    @Body('configValue') configValue: string
  ): Promise<IntegrationConfig> {
    return this.integrationService.updateIntegrationConfig(systemId, configKey, configValue);
  }

  @Post('sync/:syncLogId/retry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retry failed synchronization' })
  @ApiParam({ name: 'syncLogId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Retry initiated', type: SyncLog })
  @ApiBadRequestResponse({ description: 'Retry failed' })
  async retryFailedSync(
    @Param('syncLogId', ParseUUIDPipe) syncLogId: string
  ): Promise<SyncLog> {
    return this.integrationService.retryFailedSync(syncLogId);
  }

  @Get('systems/:systemName/mappings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get field mapping configuration' })
  @ApiParam({ name: 'systemName', type: 'string' })
  @ApiResponse({ status: 200, description: 'Mappings retrieved' })
  @ApiNotFoundResponse({ description: 'Mappings not found' })
  async getMappingConfiguration(
    @Param('systemName') systemName: string
  ): Promise<Record<string, any>> {
    return this.integrationService.getMappingConfiguration(systemName);
  }

  @Post('systems/:systemName/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate integration data' })
  @ApiParam({ name: 'systemName', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      description: 'Data to validate'
    }
  })
  @ApiResponse({ status: 200, description: 'Validation completed', schema: { type: 'object', properties: { valid: { type: 'boolean' }, errors: { type: 'array', items: { type: 'string' } } } } })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  async validateIntegrationData(
    @Param('systemName') systemName: string,
    @Body() data: Record<string, any>
  ): Promise<{ valid: boolean; errors: string[] }> {
    return this.integrationService.validateIntegrationData(systemName, data);
  }
}
