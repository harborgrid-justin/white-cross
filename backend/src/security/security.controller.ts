import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { IpRestrictionService } from './services/ip-restriction.service';
import { SecurityIncidentService } from './services/security-incident.service';
import { SessionManagementService } from './services/session-management.service';
import { ThreatDetectionService } from './services/threat-detection.service';
import {
  SecurityCreateIpRestrictionDto,
  UpdateIpRestrictionDto,
  IpCheckDto,
  SecurityCreateIncidentDto,
  UpdateIncidentStatusDto,
  IncidentFilterDto,
} from './dto';

/**
 * Security Controller
 * Manages security features including IP restrictions, incidents, and sessions
 */
@ApiTags('Security')
@Controller('security')
@ApiBearerAuth()
export class SecurityController {
  constructor(
    private readonly ipRestrictionService: IpRestrictionService,
    private readonly incidentService: SecurityIncidentService,
    private readonly sessionService: SessionManagementService,
    private readonly threatDetectionService: ThreatDetectionService,
  ) {}

  // ==================== IP Restriction Endpoints ====================

  @Post('ip-restrictions')
  @ApiOperation({ 
    summary: 'Create IP restriction rule',
    description: 'Creates a new IP restriction rule for whitelist, blacklist, or geo-restriction. Supports individual IPs, CIDR notation, or geographic regions.'
  })
  @ApiBody({ type: SecurityCreateIpRestrictionDto })
  @ApiResponse({ 
    status: 201, 
    description: 'IP restriction created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        type: { type: 'string', enum: ['whitelist', 'blacklist', 'geo_restriction'] },
        ipAddress: { type: 'string' },
        description: { type: 'string' },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid IP address format or restriction data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createIpRestriction(@Body() dto: SecurityCreateIpRestrictionDto) {
    if (dto.type === 'whitelist') {
      return await this.ipRestrictionService.addToWhitelist(dto);
    } else if (dto.type === 'blacklist') {
      return await this.ipRestrictionService.addToBlacklist(dto);
    }
    // For geo_restriction, use the generic method
    return await this.ipRestrictionService.addToWhitelist(dto);
  }

  @Get('ip-restrictions')
  @ApiOperation({ 
    summary: 'List all IP restrictions',
    description: 'Retrieves all IP restriction rules with optional filtering by type (whitelist, blacklist, geo_restriction).'
  })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    enum: ['whitelist', 'blacklist', 'geo_restriction'],
    description: 'Filter by restriction type'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of IP restrictions retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['whitelist', 'blacklist', 'geo_restriction'] },
          ipAddress: { type: 'string' },
          description: { type: 'string' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async listIpRestrictions(@Query('type') type?: string) {
    return await this.ipRestrictionService.getAllRestrictions(type as any);
  }

  @Patch('ip-restrictions/:id')
  @ApiOperation({ 
    summary: 'Update IP restriction',
    description: 'Updates an existing IP restriction rule. Allows modification of description, active status, and IP address.'
  })
  @ApiParam({ name: 'id', description: 'IP restriction UUID' })
  @ApiBody({ type: UpdateIpRestrictionDto })
  @ApiResponse({ 
    status: 200, 
    description: 'IP restriction updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        type: { type: 'string' },
        ipAddress: { type: 'string' },
        description: { type: 'string' },
        isActive: { type: 'boolean' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'IP restriction not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateIpRestriction(
    @Param('id') id: string,
    @Body() dto: UpdateIpRestrictionDto,
  ) {
    return await this.ipRestrictionService.updateRestriction(id, dto);
  }

  @Delete('ip-restrictions/:id')
  @ApiOperation({ 
    summary: 'Remove IP restriction',
    description: 'Permanently removes an IP restriction rule from the system. This action cannot be undone.'
  })
  @ApiParam({ name: 'id', description: 'IP restriction UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'IP restriction removed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'IP restriction removed successfully' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'IP restriction not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async removeIpRestriction(@Param('id') id: string) {
    const result = await this.ipRestrictionService.removeRestriction(id);
    return { success: result };
  }

  @Post('ip-restrictions/check')
  @ApiOperation({ 
    summary: 'Check if IP address is allowed',
    description: 'Validates if a specific IP address is allowed based on current restriction rules. Used for real-time access control validation.'
  })
  @ApiBody({ type: IpCheckDto })
  @ApiResponse({ 
    status: 200, 
    description: 'IP access check completed successfully',
    schema: {
      type: 'object',
      properties: {
        isAllowed: { type: 'boolean' },
        reason: { type: 'string' },
        restrictionType: { type: 'string', nullable: true },
        ipAddress: { type: 'string' },
        checkDate: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid IP address format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async checkIpAccess(@Body() dto: IpCheckDto) {
    return await this.ipRestrictionService.checkIPAccess(
      dto.ipAddress,
      dto.userId,
    );
  }

  // ==================== Security Incident Endpoints ====================

  @Post('incidents')
  @ApiOperation({ 
    summary: 'Report security incident',
    description: 'Reports a new security incident with detailed information including type, severity, affected resources, and initial assessment. Triggers automated response workflows.'
  })
  @ApiBody({ type: SecurityCreateIncidentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Security incident reported successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        incidentNumber: { type: 'string' },
        type: { type: 'string' },
        severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
        status: { type: 'string', enum: ['open', 'investigating', 'resolved', 'closed'] },
        reportedAt: { type: 'string', format: 'date-time' },
        reportedBy: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid incident data or missing required fields' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async reportIncident(@Body() dto: SecurityCreateIncidentDto) {
    return await this.incidentService.reportIncident(dto);
  }

  @Get('incidents')
  @ApiOperation({ 
    summary: 'List security incidents with filters',
    description: 'Retrieves paginated list of security incidents with filtering by status, severity, type, date range, and affected resources.'
  })
  @ApiQuery({ name: 'status', required: false, enum: ['open', 'investigating', 'resolved', 'closed'], description: 'Filter by incident status' })
  @ApiQuery({ name: 'severity', required: false, enum: ['low', 'medium', 'high', 'critical'], description: 'Filter by severity level' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by incident type' })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 20, description: 'Items per page' })
  @ApiResponse({ 
    status: 200, 
    description: 'Security incidents retrieved successfully with pagination',
    schema: {
      type: 'object',
      properties: {
        incidents: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              incidentNumber: { type: 'string' },
              type: { type: 'string' },
              severity: { type: 'string' },
              status: { type: 'string' },
              title: { type: 'string' },
              reportedAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async listIncidents(@Query() filters: IncidentFilterDto) {
    return await this.incidentService.getAllIncidents(filters);
  }

  @Get('incidents/statistics')
  @ApiOperation({ summary: 'Get incident statistics' })
  @ApiResponse({ status: 200, description: 'Incident statistics' })
  async getIncidentStatistics() {
    return await this.incidentService.getIncidentStatistics();
  }

  @Get('incidents/:id')
  @ApiOperation({ summary: 'Get incident by ID' })
  @ApiResponse({ status: 200, description: 'Incident details' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  async getIncident(@Param('id') id: string) {
    const incident = await this.incidentService.getIncidentById(id);
    if (!incident) {
      return { error: 'Incident not found' };
    }
    return incident;
  }

  @Patch('incidents/:id')
  @ApiOperation({ summary: 'Update incident status' })
  @ApiResponse({ status: 200, description: 'Incident updated' })
  async updateIncidentStatus(
    @Param('id') id: string,
    @Body() dto: UpdateIncidentStatusDto,
  ) {
    return await this.incidentService.updateIncidentStatus(id, dto);
  }

  @Get('incidents/report/generate')
  @ApiOperation({ summary: 'Generate incident report' })
  @ApiResponse({ status: 200, description: 'Incident report' })
  async generateIncidentReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.incidentService.generateIncidentReport(
      new Date(startDate),
      new Date(endDate),
    );
  }

  // ==================== Session Management Endpoints ====================

  @Get('sessions')
  @ApiOperation({ summary: 'List active sessions for user' })
  @ApiResponse({ status: 200, description: 'List of active sessions' })
  async listActiveSessions(@Query('userId') userId: string) {
    return await this.sessionService.getActiveSessions(userId);
  }

  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Invalidate session' })
  @ApiResponse({ status: 200, description: 'Session invalidated' })
  async invalidateSession(@Param('id') id: string) {
    const result = await this.sessionService.invalidateSession(id);
    return { success: result };
  }

  @Delete('sessions/user/:userId')
  @ApiOperation({ summary: 'Invalidate all user sessions' })
  @ApiResponse({ status: 200, description: 'User sessions invalidated' })
  async invalidateUserSessions(@Param('userId') userId: string) {
    const count = await this.sessionService.invalidateUserSessions(userId);
    return { invalidatedCount: count };
  }

  @Post('sessions/cleanup')
  @ApiOperation({ summary: 'Cleanup expired sessions' })
  @ApiResponse({ status: 200, description: 'Expired sessions cleaned' })
  async cleanupExpiredSessions() {
    const count = await this.sessionService.cleanupExpiredSessions();
    return { cleanedCount: count };
  }

  // ==================== Threat Detection Endpoints ====================

  @Get('threats/status')
  @ApiOperation({ summary: 'Get threat detection status' })
  @ApiResponse({ status: 200, description: 'Threat detection status' })
  async getThreatDetectionStatus() {
    // Return system status and configuration
    return {
      enabled: true,
      detectionMethods: [
        'sql_injection',
        'xss',
        'brute_force',
        'privilege_escalation',
        'data_breach',
        'path_traversal',
        'command_injection',
      ],
      bruteForceThreshold: 5,
      bruteForceWindowSeconds: 300,
    };
  }

  @Get('threats/recent-attempts/:ipAddress')
  @ApiOperation({ summary: 'Get recent failed login attempts for IP' })
  @ApiResponse({ status: 200, description: 'Recent failed attempts' })
  async getRecentFailedAttempts(@Param('ipAddress') ipAddress: string) {
    return await this.threatDetectionService.getRecentFailedAttempts(
      ipAddress,
    );
  }

  @Post('threats/scan-input')
  @ApiOperation({ summary: 'Scan input for threats' })
  @ApiResponse({ status: 200, description: 'Threat scan results' })
  async scanInput(
    @Body() body: { input: string; userId?: string; ipAddress?: string },
  ) {
    return await this.threatDetectionService.scanInput(body.input, {
      userId: body.userId,
      ipAddress: body.ipAddress,
    });
  }

  // ==================== Health and Status Endpoints ====================

  @Get('health')
  @ApiOperation({ summary: 'Security module health check' })
  @ApiResponse({ status: 200, description: 'Health status' })
  async healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date(),
      modules: {
        ipRestriction: 'operational',
        threatDetection: 'operational',
        incidentManagement: 'operational',
        sessionManagement: 'operational',
      },
    };
  }
}
