import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { IntegrationService } from './services/integration.service';
import { CircuitBreakerService } from './services/circuit-breaker.service';
import { RateLimiterService } from './services/rate-limiter.service';
import { CreateIntegrationDto, UpdateIntegrationDto } from './dto';

@ApiTags('Integrations')
@ApiBearerAuth()
@Controller('integrations')
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly rateLimiterService: RateLimiterService,
  ) {}

  @Post('configure')
  @ApiOperation({
    summary: 'Configure new integration',
    description: 'Create a new integration configuration for external systems (SIS, EHR, Pharmacy, Lab, Insurance, etc.)',
  })
  @ApiResponse({
    status: 201,
    description: 'Integration created successfully',
    schema: {
      example: {
        id: 'uuid',
        name: 'PowerSchool SIS',
        type: 'SIS',
        status: 'INACTIVE',
        endpoint: 'https://api.powerschool.com',
        apiKey: '***MASKED***',
        isActive: true,
        createdAt: '2025-10-28T08:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid integration data' })
  @ApiResponse({ status: 409, description: 'Integration with this name already exists' })
  @ApiBody({ type: CreateIntegrationDto })
  async createIntegration(@Body() createDto: CreateIntegrationDto) {
    return this.integrationService.createIntegration(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all integrations',
    description: 'Get all integration configurations with optional type filtering',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['SIS', 'EHR', 'PHARMACY', 'LABORATORY', 'INSURANCE', 'PARENT_PORTAL'],
    description: 'Filter by integration type',
  })
  @ApiResponse({
    status: 200,
    description: 'List of integrations retrieved successfully',
    schema: {
      example: [
        {
          id: 'uuid',
          name: 'PowerSchool SIS',
          type: 'SIS',
          status: 'ACTIVE',
          endpoint: 'https://api.powerschool.com',
          apiKey: '***MASKED***',
          lastSyncAt: '2025-10-28T07:00:00Z',
          lastSyncStatus: 'success',
        },
      ],
    },
  })
  async getAllIntegrations(@Query('type') type?: string) {
    return this.integrationService.getAllIntegrations(type);
  }

  @Get('status')
  @ApiOperation({
    summary: 'Get integration status overview',
    description: 'Get comprehensive statistics and status of all integrations including circuit breaker and rate limiter status',
  })
  @ApiResponse({
    status: 200,
    description: 'Integration status retrieved successfully',
    schema: {
      example: {
        totalIntegrations: 6,
        activeIntegrations: 5,
        inactiveIntegrations: 1,
        syncStatistics: {
          totalSyncs: 150,
          successfulSyncs: 145,
          failedSyncs: 5,
          successRate: 96.67,
        },
        statsByType: {
          SIS: { success: 50, failed: 1, total: 51 },
          EHR: { success: 45, failed: 2, total: 47 },
        },
      },
    },
  })
  async getIntegrationStatus() {
    const stats = await this.integrationService.getIntegrationStatistics();

    // Add circuit breaker and rate limiter status
    return {
      ...stats,
      circuitBreakerStatus: {
        message: 'Circuit breaker status available for each integration',
      },
      rateLimiterStatus: {
        message: 'Rate limiter status available for each integration',
      },
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get integration details',
    description: 'Retrieve detailed configuration for a specific integration',
  })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({
    status: 200,
    description: 'Integration details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Integration not found' })
  async getIntegrationById(@Param('id') id: string) {
    return this.integrationService.getIntegrationById(id, false);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update integration configuration',
    description: 'Update an existing integration configuration',
  })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({ status: 200, description: 'Integration updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 404, description: 'Integration not found' })
  @ApiBody({ type: UpdateIntegrationDto })
  async updateIntegration(
    @Param('id') id: string,
    @Body() updateDto: UpdateIntegrationDto,
  ) {
    return this.integrationService.updateIntegration(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete integration',
    description: 'Remove an integration configuration',
  })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({ status: 204, description: 'Integration deleted successfully' })
  @ApiResponse({ status: 404, description: 'Integration not found' })
  async deleteIntegration(@Param('id') id: string) {
    await this.integrationService.deleteIntegration(id);
  }

  @Post(':id/test')
  @ApiOperation({
    summary: 'Test integration connection',
    description: 'Test connectivity to the external system with circuit breaker protection',
  })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({
    status: 200,
    description: 'Connection test completed',
    schema: {
      example: {
        success: true,
        message: 'Successfully connected to Student Information System',
        responseTime: 245,
        details: {
          version: '2.1.0',
          studentCount: 1542,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Integration not found' })
  @ApiResponse({ status: 503, description: 'Circuit breaker is OPEN' })
  async testConnection(@Param('id') id: string) {
    return this.integrationService.testConnection(id);
  }

  @Post(':id/sync')
  @ApiOperation({
    summary: 'Trigger integration sync',
    description: 'Manually trigger data synchronization with rate limiting and retry logic',
  })
  @ApiParam({ name: 'id', description: 'Integration ID' })
  @ApiResponse({
    status: 200,
    description: 'Sync completed successfully',
    schema: {
      example: {
        success: true,
        recordsProcessed: 150,
        recordsSucceeded: 148,
        recordsFailed: 2,
        duration: 5240,
        errors: ['Record 1: Validation error', 'Record 2: Missing field'],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Integration not found' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async syncIntegration(@Param('id') id: string) {
    return this.integrationService.syncIntegration(id);
  }

  @Get('logs')
  @ApiOperation({
    summary: 'Get integration logs',
    description: 'Retrieve integration operation logs with pagination and filtering',
  })
  @ApiQuery({ name: 'integrationId', required: false, description: 'Filter by integration ID' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by integration type' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20)' })
  @ApiResponse({
    status: 200,
    description: 'Logs retrieved successfully',
    schema: {
      example: {
        logs: [
          {
            id: 'uuid',
            integrationId: 'uuid',
            integrationType: 'SIS',
            action: 'sync',
            status: 'success',
            recordsProcessed: 150,
            recordsSucceeded: 150,
            recordsFailed: 0,
            duration: 5000,
            createdAt: '2025-10-28T08:00:00Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          totalPages: 5,
        },
      },
    },
  })
  async getIntegrationLogs(
    @Query('integrationId') integrationId?: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.integrationService.getIntegrationLogs(
      integrationId,
      type,
      page || 1,
      limit || 20,
    );
  }

  @Get(':serviceName/circuit-breaker/status')
  @ApiOperation({
    summary: 'Get circuit breaker status',
    description: 'Get the current status of the circuit breaker for a specific service',
  })
  @ApiParam({ name: 'serviceName', description: 'Service name (e.g., SIS, EHR, PHARMACY)' })
  @ApiResponse({
    status: 200,
    description: 'Circuit breaker status retrieved',
    schema: {
      example: {
        state: 'CLOSED',
        failures: 0,
        nextAttempt: null,
      },
    },
  })
  getCircuitBreakerStatus(@Param('serviceName') serviceName: string) {
    return this.circuitBreakerService.getStatus(serviceName) || {
      state: 'CLOSED',
      failures: 0,
      message: 'Circuit breaker not initialized for this service',
    };
  }

  @Post(':serviceName/circuit-breaker/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset circuit breaker',
    description: 'Manually reset the circuit breaker to CLOSED state',
  })
  @ApiParam({ name: 'serviceName', description: 'Service name' })
  @ApiResponse({ status: 200, description: 'Circuit breaker reset successfully' })
  resetCircuitBreaker(@Param('serviceName') serviceName: string) {
    this.circuitBreakerService.reset(serviceName);
    return { message: `Circuit breaker reset for ${serviceName}` };
  }

  @Get(':serviceName/rate-limiter/status')
  @ApiOperation({
    summary: 'Get rate limiter status',
    description: 'Get the current rate limit status for a specific service',
  })
  @ApiParam({ name: 'serviceName', description: 'Service name' })
  @ApiResponse({
    status: 200,
    description: 'Rate limiter status retrieved',
    schema: {
      example: {
        current: 25,
        max: 100,
        window: 60000,
        remaining: 75,
      },
    },
  })
  getRateLimiterStatus(@Param('serviceName') serviceName: string) {
    return this.rateLimiterService.getStatus(serviceName) || {
      current: 0,
      max: 100,
      window: 60000,
      remaining: 100,
      message: 'Rate limiter not initialized for this service',
    };
  }
}

