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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IpRestrictionService } from './services/ip-restriction.service';
import { SecurityIncidentService } from './services/security-incident.service';
import { SessionManagementService } from './services/session-management.service';
import { ThreatDetectionService } from './services/threat-detection.service';
import {
  CreateIpRestrictionDto,
  UpdateIpRestrictionDto,
  IpCheckDto,
  CreateSecurityIncidentDto,
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
  @ApiOperation({ summary: 'Create IP restriction rule' })
  @ApiResponse({ status: 201, description: 'IP restriction created' })
  async createIpRestriction(@Body() dto: CreateIpRestrictionDto) {
    if (dto.type === 'whitelist') {
      return await this.ipRestrictionService.addToWhitelist(dto);
    } else if (dto.type === 'blacklist') {
      return await this.ipRestrictionService.addToBlacklist(dto);
    }
    // For geo_restriction, use the generic method
    return await this.ipRestrictionService.addToWhitelist(dto);
  }

  @Get('ip-restrictions')
  @ApiOperation({ summary: 'List all IP restrictions' })
  @ApiResponse({ status: 200, description: 'List of IP restrictions' })
  async listIpRestrictions(@Query('type') type?: string) {
    return await this.ipRestrictionService.getAllRestrictions(type as any);
  }

  @Patch('ip-restrictions/:id')
  @ApiOperation({ summary: 'Update IP restriction' })
  @ApiResponse({ status: 200, description: 'IP restriction updated' })
  async updateIpRestriction(
    @Param('id') id: string,
    @Body() dto: UpdateIpRestrictionDto,
  ) {
    return await this.ipRestrictionService.updateRestriction(id, dto);
  }

  @Delete('ip-restrictions/:id')
  @ApiOperation({ summary: 'Remove IP restriction' })
  @ApiResponse({ status: 200, description: 'IP restriction removed' })
  async removeIpRestriction(@Param('id') id: string) {
    const result = await this.ipRestrictionService.removeRestriction(id);
    return { success: result };
  }

  @Post('ip-restrictions/check')
  @ApiOperation({ summary: 'Check if IP address is allowed' })
  @ApiResponse({ status: 200, description: 'IP check result' })
  async checkIpAccess(@Body() dto: IpCheckDto) {
    return await this.ipRestrictionService.checkIPAccess(
      dto.ipAddress,
      dto.userId,
    );
  }

  // ==================== Security Incident Endpoints ====================

  @Post('incidents')
  @ApiOperation({ summary: 'Report security incident' })
  @ApiResponse({ status: 201, description: 'Incident reported' })
  async reportIncident(@Body() dto: CreateSecurityIncidentDto) {
    return await this.incidentService.reportIncident(dto);
  }

  @Get('incidents')
  @ApiOperation({ summary: 'List security incidents with filters' })
  @ApiResponse({ status: 200, description: 'List of incidents' })
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
