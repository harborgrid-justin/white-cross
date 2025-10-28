/**
 * Compliance Controller
 * RESTful API endpoints for HIPAA-compliant healthcare operations
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
  ParseIntPipe,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AuditService } from './services/audit.service';
import { ConsentService } from './services/consent.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { SignConsentFormDto } from './dto/sign-consent-form.dto';
import { CreatePhiDisclosureDto } from './dto/create-phi-disclosure.dto';

@ApiTags('compliance')
@Controller('compliance')
export class ComplianceController {
  private readonly logger = new Logger(ComplianceController.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly consentService: ConsentService,
    // Additional services will be injected here as they're created:
    // private readonly phiDisclosureService: PhiDisclosureService,
    // private readonly complianceReportService: ComplianceReportService,
    // private readonly checklistService: ChecklistService,
    // private readonly policyService: PolicyService,
    // private readonly statisticsService: StatisticsService,
  ) {}

  // ==================== AUDIT LOG ENDPOINTS ====================

  @Get('audit-logs')
  @ApiOperation({
    summary: 'Get audit logs with filtering',
    description:
      'Retrieve paginated audit logs for HIPAA compliance tracking. Supports filtering by user, entity type, action, and date range.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'entityType', required: false, type: String })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully' })
  async getAuditLogs(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('userId') userId?: string,
    @Query('entityType') entityType?: string,
    @Query('action') action?: any,
  ) {
    const filters: any = {};
    if (userId) filters.userId = userId;
    if (entityType) filters.entityType = entityType;
    if (action) filters.action = action;

    return this.auditService.getAuditLogs(page || 1, limit || 50, filters);
  }

  @Get('audit-logs/:id')
  @ApiOperation({ summary: 'Get audit log by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Audit log UUID' })
  @ApiResponse({ status: 200, description: 'Audit log retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Audit log not found' })
  async getAuditLogById(@Param('id', ParseUUIDPipe) id: string) {
    return this.auditService.getAuditLogById(id);
  }

  @Post('audit-logs')
  @ApiOperation({
    summary: 'Create audit log entry',
    description:
      'Create HIPAA-compliant audit log entry. Required for tracking all PHI access and modifications.',
  })
  @ApiBody({ type: CreateAuditLogDto })
  @ApiResponse({ status: 201, description: 'Audit log created successfully' })
  async createAuditLog(@Body() createAuditLogDto: CreateAuditLogDto) {
    return this.auditService.createAuditLog(createAuditLogDto);
  }

  @Get('audit-logs/entities/:type/:id')
  @ApiOperation({ summary: 'Get audit history for specific entity' })
  @ApiParam({ name: 'type', type: String, description: 'Entity type' })
  @ApiParam({ name: 'id', type: String, description: 'Entity UUID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Entity audit logs retrieved successfully' })
  async getEntityAuditLogs(
    @Param('type') type: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.auditService.getEntityAuditLogs(type, id, page || 1, limit || 20);
  }

  @Get('audit-logs/users/:userId')
  @ApiOperation({ summary: 'Get audit history for specific user' })
  @ApiParam({ name: 'userId', type: String, description: 'User UUID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'User audit logs retrieved successfully' })
  async getUserAuditLogs(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.auditService.getUserAuditLogs(userId, page || 1, limit || 20);
  }

  @Get('audit-logs/statistics')
  @ApiOperation({
    summary: 'Get audit statistics',
    description: 'Generate comprehensive audit statistics for compliance reporting and analytics',
  })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Audit statistics retrieved successfully' })
  async getAuditStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.auditService.getAuditStatistics(start, end);
  }

  // ==================== CONSENT FORM ENDPOINTS ====================

  @Get('consents')
  @ApiOperation({
    summary: 'Get consent forms',
    description: 'Retrieve consent forms with optional filtering by active status',
  })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Consent forms retrieved successfully' })
  async getConsentForms(@Query('isActive') isActive?: string) {
    const filters: any = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    return this.consentService.getConsentForms(filters);
  }

  @Get('consents/:id')
  @ApiOperation({ summary: 'Get consent form by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Consent form UUID' })
  @ApiResponse({ status: 200, description: 'Consent form retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Consent form not found' })
  async getConsentFormById(@Param('id', ParseUUIDPipe) id: string) {
    return this.consentService.getConsentFormById(id);
  }

  @Post('consents/sign')
  @ApiOperation({
    summary: 'Sign consent form',
    description:
      'Digitally sign a consent form with legal validity. Captures signatory information, relationship, and optional digital signature.',
  })
  @ApiBody({ type: SignConsentFormDto })
  @ApiResponse({ status: 201, description: 'Consent form signed successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed or consent already signed' })
  @ApiResponse({ status: 404, description: 'Consent form not found' })
  async signConsentForm(@Body() signConsentFormDto: SignConsentFormDto) {
    return this.consentService.signConsentForm(signConsentFormDto);
  }

  @Get('consents/students/:studentId')
  @ApiOperation({ summary: 'Get all consents for a student' })
  @ApiParam({ name: 'studentId', type: String, description: 'Student UUID' })
  @ApiResponse({ status: 200, description: 'Student consents retrieved successfully' })
  async getStudentConsents(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.consentService.getStudentConsents(studentId);
  }

  @Post('consents/:id/withdraw')
  @ApiOperation({
    summary: 'Withdraw consent',
    description:
      'Withdraw a previously signed consent. Creates permanent audit trail. Withdrawal is irreversible.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Consent signature UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        withdrawnBy: {
          type: 'string',
          description: 'Name of person withdrawing consent',
          example: 'Jane Doe',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Consent withdrawn successfully' })
  @ApiResponse({ status: 400, description: 'Consent already withdrawn' })
  @ApiResponse({ status: 404, description: 'Consent signature not found' })
  async withdrawConsent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('withdrawnBy') withdrawnBy: string,
  ) {
    return this.consentService.withdrawConsent(id, withdrawnBy);
  }

  // ==================== PHI DISCLOSURE ENDPOINTS ====================
  // These endpoints will be implemented with the PHIDisclosureService

  /*
  @Get('phi-disclosures')
  @ApiOperation({ summary: 'Get PHI disclosures with filtering' })
  async getPhiDisclosures(...) {
    return this.phiDisclosureService.getDisclosures(...);
  }

  @Post('phi-disclosures')
  @ApiOperation({ summary: 'Create PHI disclosure record' })
  @ApiBody({ type: CreatePhiDisclosureDto })
  async createPhiDisclosure(@Body() dto: CreatePhiDisclosureDto) {
    return this.phiDisclosureService.createDisclosure(dto, userId, ipAddress, userAgent);
  }

  @Get('phi-disclosures/students/:studentId')
  @ApiOperation({ summary: 'Get all PHI disclosures for a student' })
  async getStudentDisclosures(@Param('studentId') studentId: string) {
    return this.phiDisclosureService.getDisclosuresByStudent(studentId);
  }

  @Get('phi-disclosures/overdue')
  @ApiOperation({ summary: 'Get overdue follow-ups' })
  async getOverdueFollowUps() {
    return this.phiDisclosureService.getOverdueFollowUps();
  }

  @Post('phi-disclosures/:id/complete-followup')
  @ApiOperation({ summary: 'Mark follow-up as completed' })
  async completeFollowUp(...) {
    return this.phiDisclosureService.completeFollowUp(...);
  }

  @Get('phi-disclosures/statistics')
  @ApiOperation({ summary: 'Get PHI disclosure statistics' })
  async getDisclosureStatistics(...) {
    return this.phiDisclosureService.getStatistics(...);
  }
  */

  // ==================== COMPLIANCE REPORT ENDPOINTS ====================
  // To be implemented with ComplianceReportService

  // ==================== CHECKLIST ENDPOINTS ====================
  // To be implemented with ChecklistService

  // ==================== POLICY ENDPOINTS ====================
  // To be implemented with PolicyService

  // ==================== STATISTICS ENDPOINTS ====================
  // To be implemented with StatisticsService

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get compliance dashboard data',
    description:
      'Retrieve comprehensive compliance dashboard with reports, checklists, consents, and audit statistics',
  })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  async getComplianceDashboard() {
    // This will aggregate data from multiple services
    // return this.statisticsService.getComplianceDashboard();
    return {
      message:
        'Dashboard endpoint - will be implemented with StatisticsService and aggregate data from all compliance services',
    };
  }
}
