/**
 * LOC: INCRESPCOORD001
 * File: /reuse/threat/composites/downstream/incident-response-coordinators.ts
 *
 * UPSTREAM (imports from):
 *   - ../automated-response-orchestration-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - Incident response platforms
 *   - SOAR systems
 *   - Crisis management tools
 *   - Response automation engines
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Injectable,
  Logger,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsEnum, IsOptional, ValidateNested, Type } from 'class-validator';
import * as crypto from 'crypto';

// ============================================================================
// DTO CLASSES WITH VALIDATION
// ============================================================================

export class CreateIncidentDto {
  @ApiProperty({ description: 'Incident title', example: 'Unauthorized data access attempt' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: ['critical', 'high', 'medium', 'low'], example: 'critical' })
  @IsEnum(['critical', 'high', 'medium', 'low'])
  @IsNotEmpty()
  severity: 'critical' | 'high' | 'medium' | 'low';

  @ApiProperty({ description: 'Incident category', example: 'Data Breach' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Affected systems', example: ['EHR', 'PatientDB'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  affectedSystems?: string[];
}

export class EscalateIncidentDto {
  @ApiProperty({ enum: ['critical', 'high', 'medium', 'low'], example: 'critical' })
  @IsEnum(['critical', 'high', 'medium', 'low'])
  @IsNotEmpty()
  newSeverity: 'critical' | 'high' | 'medium' | 'low';

  @ApiProperty({ description: 'Additional responder IDs', example: ['responder-1', 'responder-2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  additionalResponders?: string[];

  @ApiProperty({ description: 'User who escalated', example: 'analyst-001' })
  @IsString()
  @IsNotEmpty()
  escalatedBy: string;
}

export class ExecutePlaybookDto {
  @ApiProperty({ description: 'Incident ID', example: 'inc-12345' })
  @IsString()
  @IsNotEmpty()
  incidentId: string;

  @ApiProperty({ description: 'Playbook context data', example: { threatLevel: 'high' } })
  @IsOptional()
  context?: Record<string, any>;
}

export class CloseIncidentDto {
  @ApiProperty({ description: 'Closure notes', example: 'Threat contained and remediated' })
  @IsString()
  @IsNotEmpty()
  notes: string;

  @ApiProperty({ description: 'User who closed the incident', example: 'ir-lead-001' })
  @IsString()
  @IsNotEmpty()
  closedBy: string;

  @ApiProperty({ description: 'Root cause analysis', example: 'Compromised credentials from phishing' })
  @IsString()
  @IsOptional()
  rootCause?: string;

  @ApiProperty({ description: 'Lessons learned', example: ['Improve email filtering', 'Enhanced MFA'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  lessonsLearned?: string[];

  @ApiProperty({ description: 'Recommendations', example: ['Deploy EDR', 'Incident response training'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  recommendations?: string[];
}

@ApiTags('incident-response')
@Controller('api/v1/incident-response')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class IncidentResponseController {
  private readonly logger = new Logger(IncidentResponseController.name);

  constructor(private readonly service: IncidentResponseService) {}

  @Post('incidents/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create and coordinate incident response', description: 'Create new incident and assign responders' })
  @ApiBody({ type: CreateIncidentDto, description: 'Incident creation payload' })
  @ApiResponse({ status: 201, description: 'Incident created and response initiated' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiResponse({ status: 500, description: 'Failed to create incident' })
  async createIncident(@Body() dto: CreateIncidentDto): Promise<any> {
    return this.service.createAndCoordinateIncident(dto);
  }

  @Put('incidents/:incidentId/escalate')
  @ApiOperation({ summary: 'Escalate incident', description: 'Escalate incident severity and assign additional responders' })
  @ApiParam({ name: 'incidentId', description: 'Incident ID to escalate' })
  @ApiBody({ type: EscalateIncidentDto, description: 'Escalation payload' })
  @ApiResponse({ status: 200, description: 'Incident escalated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid escalation data' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  @ApiResponse({ status: 500, description: 'Escalation failed' })
  async escalateIncident(
    @Param('incidentId') incidentId: string,
    @Body() dto: EscalateIncidentDto,
  ): Promise<any> {
    return this.service.escalateIncidentResponse(incidentId, dto);
  }

  @Post('playbooks/:playbookId/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute incident response playbook', description: 'Execute automated playbook for incident response' })
  @ApiParam({ name: 'playbookId', description: 'Playbook ID' })
  @ApiBody({ type: ExecutePlaybookDto, description: 'Execution context' })
  @ApiResponse({ status: 200, description: 'Playbook execution started' })
  @ApiResponse({ status: 400, description: 'Invalid execution data' })
  @ApiResponse({ status: 404, description: 'Playbook not found' })
  @ApiResponse({ status: 500, description: 'Execution failed' })
  async executePlaybook(
    @Param('playbookId') playbookId: string,
    @Body() dto: ExecutePlaybookDto,
  ): Promise<any> {
    return this.service.executeResponsePlaybook(playbookId, dto);
  }

  @Get('incidents/:incidentId/status')
  @ApiOperation({ summary: 'Get incident response status', description: 'Retrieve current status and timeline of incident' })
  @ApiParam({ name: 'incidentId', description: 'Incident ID' })
  @ApiResponse({ status: 200, description: 'Incident status retrieved' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  @ApiResponse({ status: 500, description: 'Failed to retrieve status' })
  async getIncidentStatus(@Param('incidentId') incidentId: string): Promise<any> {
    return this.service.getIncidentResponseStatus(incidentId);
  }

  @Post('incidents/:incidentId/close')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close incident and generate report', description: 'Close incident and create post-mortem report' })
  @ApiParam({ name: 'incidentId', description: 'Incident ID' })
  @ApiBody({ type: CloseIncidentDto, description: 'Closure details' })
  @ApiResponse({ status: 200, description: 'Incident closed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid closure data' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  @ApiResponse({ status: 500, description: 'Failed to close incident' })
  async closeIncident(
    @Param('incidentId') incidentId: string,
    @Body() dto: CloseIncidentDto,
  ): Promise<any> {
    return this.service.closeIncidentWithReport(incidentId, dto);
  }
}

@Injectable()
export class IncidentResponseService {
  private readonly logger = new Logger(IncidentResponseService.name);
  private incidents: Map<string, any> = new Map();

  async createAndCoordinateIncident(dto: CreateIncidentDto): Promise<any> {
    const requestId = crypto.randomUUID();
    try {
      const incidentId = crypto.randomUUID();

      const newIncident = {
        incidentId,
        title: dto.title,
        severity: dto.severity,
        category: dto.category,
        status: 'investigating',
        createdAt: new Date(),
        responders: [],
        timeline: [
          {
            timestamp: new Date(),
            event: 'Incident created',
            actor: 'system',
          },
        ],
        affectedSystems: dto.affectedSystems || [],
        responseActions: [],
      };

      this.incidents.set(incidentId, newIncident);

      // Auto-assign based on severity
      if (dto.severity === 'critical') {
        newIncident.responders = ['senior-ir-lead', 'security-manager', 'ciso'];
      } else if (dto.severity === 'high') {
        newIncident.responders = ['ir-analyst', 'security-engineer'];
      } else {
        newIncident.responders = ['ir-analyst'];
      }

      this.logger.log(`[${requestId}] Created incident ${incidentId} with severity ${dto.severity}`);

      return {
        requestId,
        incidentId,
        status: 'initiated',
        assignedResponders: newIncident.responders,
        nextSteps: [
          'Assess incident scope',
          'Contain threat',
          'Gather evidence',
          'Initiate remediation',
        ],
      };
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to create incident: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create incident');
    }
  }

  async escalateIncidentResponse(incidentId: string, dto: EscalateIncidentDto): Promise<any> {
    const requestId = crypto.randomUUID();
    try {
      const incident = this.incidents.get(incidentId);

      if (!incident) {
        this.logger.warn(`[${requestId}] Incident not found: ${incidentId}`);
        throw new NotFoundException(`Incident ${incidentId} not found`);
      }

      incident.severity = dto.newSeverity || incident.severity;
      incident.responders.push(...(dto.additionalResponders || []));
      incident.timeline.push({
        timestamp: new Date(),
        event: `Escalated to ${dto.newSeverity}`,
        actor: dto.escalatedBy,
      });

      this.logger.warn(`[${requestId}] Incident ${incidentId} escalated to ${incident.severity}`);

      return {
        requestId,
        incidentId,
        escalated: true,
        newSeverity: incident.severity,
        additionalResponders: dto.additionalResponders || [],
        notificationsSent: true,
      };
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to escalate incident: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to escalate incident');
    }
  }

  async executeResponsePlaybook(playbookId: string, dto: ExecutePlaybookDto): Promise<any> {
    const requestId = crypto.randomUUID();
    try {
      if (!playbookId || playbookId.trim() === '') {
        throw new BadRequestException('Playbook ID is required');
      }

      if (!dto.incidentId || dto.incidentId.trim() === '') {
        throw new BadRequestException('Incident ID is required');
      }

      const incident = this.incidents.get(dto.incidentId);
      if (!incident) {
        throw new NotFoundException(`Incident ${dto.incidentId} not found`);
      }

      this.logger.log(`[${requestId}] Executing playbook ${playbookId} for incident ${dto.incidentId}`);

      return {
        requestId,
        executionId: crypto.randomUUID(),
        playbookId,
        incidentId: dto.incidentId,
        status: 'executing',
        steps: [
          { step: 'Isolate affected systems', status: 'completed' },
          { step: 'Collect forensic evidence', status: 'in_progress' },
          { step: 'Analyze threat indicators', status: 'pending' },
          { step: 'Remediate vulnerabilities', status: 'pending' },
          { step: 'Restore services', status: 'pending' },
        ],
        estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000),
      };
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to execute playbook: ${error.message}`, error.stack);
      if (error instanceof (BadRequestException || NotFoundException)) throw error;
      throw new InternalServerErrorException('Failed to execute playbook');
    }
  }

  async getIncidentResponseStatus(incidentId: string): Promise<any> {
    const requestId = crypto.randomUUID();
    try {
      if (!incidentId || incidentId.trim() === '') {
        throw new BadRequestException('Incident ID is required');
      }

      const incident = this.incidents.get(incidentId);

      if (!incident) {
        this.logger.warn(`[${requestId}] Incident not found: ${incidentId}`);
        throw new NotFoundException(`Incident ${incidentId} not found`);
      }

      this.logger.log(`[${requestId}] Retrieved status for incident ${incidentId}`);

      return {
        requestId,
        incidentId,
        status: incident.status,
        severity: incident.severity,
        responders: incident.responders,
        duration: Date.now() - incident.createdAt.getTime(),
        completedActions: incident.responseActions.filter((a: any) => a.completed).length,
        totalActions: incident.responseActions.length,
        timeline: incident.timeline,
      };
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to get incident status: ${error.message}`, error.stack);
      if (error instanceof (BadRequestException || NotFoundException)) throw error;
      throw new InternalServerErrorException('Failed to retrieve incident status');
    }
  }

  async closeIncidentWithReport(incidentId: string, dto: CloseIncidentDto): Promise<any> {
    const requestId = crypto.randomUUID();
    try {
      if (!incidentId || incidentId.trim() === '') {
        throw new BadRequestException('Incident ID is required');
      }

      const incident = this.incidents.get(incidentId);

      if (!incident) {
        this.logger.warn(`[${requestId}] Incident not found for closure: ${incidentId}`);
        throw new NotFoundException(`Incident ${incidentId} not found`);
      }

      incident.status = 'closed';
      incident.closedAt = new Date();
      incident.closureNotes = dto.notes;
      incident.timeline.push({
        timestamp: new Date(),
        event: 'Incident closed',
        actor: dto.closedBy,
      });

      const report = {
        reportId: crypto.randomUUID(),
        incidentId,
        title: incident.title,
        severity: incident.severity,
        duration: incident.closedAt.getTime() - incident.createdAt.getTime(),
        affectedSystems: incident.affectedSystems,
        rootCause: dto.rootCause,
        lessonsLearned: dto.lessonsLearned || [],
        recommendations: dto.recommendations || [],
        timeline: incident.timeline,
        generatedAt: new Date(),
      };

      this.logger.log(`[${requestId}] Incident ${incidentId} closed with report ${report.reportId}`);

      return {
        requestId,
        incidentId,
        closed: true,
        closedAt: incident.closedAt,
        report,
      };
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to close incident: ${error.message}`, error.stack);
      if (error instanceof (BadRequestException || NotFoundException)) throw error;
      throw new InternalServerErrorException('Failed to close incident');
    }
  }
}

export default { IncidentResponseController, IncidentResponseService };
