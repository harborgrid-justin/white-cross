/**
 * Compliance Controller - Complete HIPAA/FERPA Compliance Management
 * Comprehensive API for audit trails, consent management, policy management,
 * compliance reporting, checklists, PHI disclosures, data retention, and violations
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ParseUUIDPipe,
  Logger,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import type { Request } from 'express';

// Services
import { AuditService } from './services/audit.service';
import { ConsentService } from './services/consent.service';
import { ComplianceReportService } from './services/compliance-report.service';
import { ChecklistService } from './services/checklist.service';
import { PolicyService } from './services/policy.service';
import { DataRetentionService } from './services/data-retention.service';
import { ViolationService } from './services/violation.service';
import { StatisticsService } from './services/statistics.service';

// DTOs
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { SignConsentFormDto } from './dto/sign-consent-form.dto';
import { CreateComplianceReportDto, UpdateComplianceReportDto, GenerateReportDto, QueryComplianceReportDto } from './dto/compliance-report.dto';
import { CreateChecklistDto, UpdateChecklistDto, QueryChecklistDto } from './dto/checklist.dto';
import { CreatePolicyDto, UpdatePolicyDto, QueryPolicyDto } from './dto/policy.dto';
import { CreateDataRetentionDto, UpdateDataRetentionDto, QueryDataRetentionDto } from './dto/data-retention.dto';
import { CreateViolationDto, UpdateViolationDto, CreateRemediationDto, UpdateRemediationDto, QueryViolationDto } from './dto/violation.dto';
import { QueryStatisticsDto } from './dto/statistics.dto';

@ApiTags('compliance')
@Controller('compliance')
export class ComplianceController {
  private readonly logger = new Logger(ComplianceController.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly consentService: ConsentService,
    private readonly reportService: ComplianceReportService,
    private readonly checklistService: ChecklistService,
    private readonly policyService: PolicyService,
    private readonly dataRetentionService: DataRetentionService,
    private readonly violationService: ViolationService,
    private readonly statisticsService: StatisticsService,
  ) {}

  // ==================== AUDIT LOG ENDPOINTS ====================

  @Get('audit-logs')
  @ApiOperation({
    summary: 'Get audit logs with filtering',
    description: 'Retrieve paginated audit logs for HIPAA compliance tracking. Supports filtering by user, entity type, action, and date range.',
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
  @ApiOperation({ summary: 'Create audit log entry', description: 'Create HIPAA-compliant audit log entry' })
  @ApiBody({ type: CreateAuditLogDto })
  @ApiResponse({ status: 201, description: 'Audit log created successfully' })
  async createAuditLog(@Body() createAuditLogDto: CreateAuditLogDto) {
    return this.auditService.createAuditLog(createAuditLogDto);
  }

  // ==================== COMPLIANCE REPORT ENDPOINTS ====================

  @Get('reports')
  @ApiOperation({ summary: 'List compliance reports', description: 'Retrieve paginated compliance reports with filtering' })
  @ApiResponse({ status: 200, description: 'Reports retrieved successfully' })
  async listReports(@Query() query: QueryComplianceReportDto) {
    return this.reportService.listReports(query);
  }

  @Get('reports/:id')
  @ApiOperation({ summary: 'Get compliance report by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Report retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async getReportById(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportService.getReportById(id);
  }

  @Post('reports')
  @ApiOperation({ summary: 'Create compliance report' })
  @ApiBody({ type: CreateComplianceReportDto })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  async createReport(@Body() dto: CreateComplianceReportDto, @Req() req: Request) {
    // In real implementation, get userId from JWT token
    const userId = (req as any).user?.id || 'system';
    return this.reportService.createReport(dto, userId);
  }

  @Put('reports/:id')
  @ApiOperation({ summary: 'Update compliance report' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateComplianceReportDto })
  @ApiResponse({ status: 200, description: 'Report updated successfully' })
  async updateReport(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateComplianceReportDto) {
    return this.reportService.updateReport(id, dto);
  }

  @Delete('reports/:id')
  @ApiOperation({ summary: 'Delete compliance report' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Report deleted successfully' })
  async deleteReport(@Param('id', ParseUUIDPipe) id: string) {
    await this.reportService.deleteReport(id);
    return { deleted: true };
  }

  @Post('reports/generate')
  @ApiOperation({ summary: 'Generate automated compliance report' })
  @ApiBody({ type: GenerateReportDto })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  async generateReport(@Body() dto: GenerateReportDto, @Req() req: Request) {
    const userId = (req as any).user?.id || 'system';
    return this.reportService.generateReport(dto, userId);
  }

  // ==================== CHECKLIST ENDPOINTS ====================

  @Get('checklists')
  @ApiOperation({ summary: 'List compliance checklists' })
  @ApiResponse({ status: 200, description: 'Checklists retrieved successfully' })
  async listChecklists(@Query() query: QueryChecklistDto) {
    return this.checklistService.listChecklists(query);
  }

  @Get('checklists/:id')
  @ApiOperation({ summary: 'Get checklist by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Checklist retrieved successfully' })
  async getChecklistById(@Param('id', ParseUUIDPipe) id: string) {
    return this.checklistService.getChecklistById(id);
  }

  @Post('checklists')
  @ApiOperation({ summary: 'Create compliance checklist item' })
  @ApiBody({ type: CreateChecklistDto })
  @ApiResponse({ status: 201, description: 'Checklist created successfully' })
  async createChecklist(@Body() dto: CreateChecklistDto) {
    return this.checklistService.createChecklist(dto);
  }

  @Put('checklists/:id')
  @ApiOperation({ summary: 'Update checklist item' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateChecklistDto })
  @ApiResponse({ status: 200, description: 'Checklist updated successfully' })
  async updateChecklist(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateChecklistDto) {
    return this.checklistService.updateChecklist(id, dto);
  }

  @Delete('checklists/:id')
  @ApiOperation({ summary: 'Delete checklist item' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Checklist deleted successfully' })
  async deleteChecklist(@Param('id', ParseUUIDPipe) id: string) {
    await this.checklistService.deleteChecklist(id);
    return { deleted: true };
  }

  // ==================== POLICY MANAGEMENT ENDPOINTS ====================

  @Get('policies')
  @ApiOperation({ summary: 'List policy documents' })
  @ApiResponse({ status: 200, description: 'Policies retrieved successfully' })
  async listPolicies(@Query() query: QueryPolicyDto) {
    return this.policyService.listPolicies(query);
  }

  @Get('policies/:id')
  @ApiOperation({ summary: 'Get policy by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Policy retrieved successfully' })
  async getPolicyById(@Param('id', ParseUUIDPipe) id: string) {
    return this.policyService.getPolicyById(id);
  }

  @Post('policies')
  @ApiOperation({ summary: 'Create policy document' })
  @ApiBody({ type: CreatePolicyDto })
  @ApiResponse({ status: 201, description: 'Policy created successfully' })
  async createPolicy(@Body() dto: CreatePolicyDto) {
    return this.policyService.createPolicy(dto);
  }

  @Put('policies/:id')
  @ApiOperation({ summary: 'Update policy document' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePolicyDto })
  @ApiResponse({ status: 200, description: 'Policy updated successfully' })
  async updatePolicy(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePolicyDto) {
    return this.policyService.updatePolicy(id, dto);
  }

  @Delete('policies/:id')
  @ApiOperation({ summary: 'Delete policy document' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Policy deleted successfully' })
  async deletePolicy(@Param('id', ParseUUIDPipe) id: string) {
    await this.policyService.deletePolicy(id);
    return { deleted: true };
  }

  @Post('policies/:id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge policy', description: 'COMPLIANCE REQUIRED - Records staff acknowledgment of policy' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 201, description: 'Policy acknowledged successfully' })
  async acknowledgePolicy(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = (req as any).user?.id || 'system';
    const ipAddress = req.ip || 'unknown';
    return this.policyService.acknowledgePolicy(id, userId, ipAddress);
  }

  // ==================== CONSENT MANAGEMENT ENDPOINTS ====================

  @Get('consents')
  @ApiOperation({ summary: 'Get consent forms', description: 'Retrieve consent forms with optional filtering by active status' })
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
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Consent form retrieved successfully' })
  async getConsentFormById(@Param('id', ParseUUIDPipe) id: string) {
    return this.consentService.getConsentFormById(id);
  }

  @Post('consents/sign')
  @ApiOperation({ summary: 'Sign consent form', description: 'Digitally sign a consent form with legal validity' })
  @ApiBody({ type: SignConsentFormDto })
  @ApiResponse({ status: 201, description: 'Consent form signed successfully' })
  async signConsentForm(@Body() signConsentFormDto: SignConsentFormDto) {
    return this.consentService.signConsentForm(signConsentFormDto);
  }

  @Get('consents/students/:studentId')
  @ApiOperation({ summary: 'Get all consents for a student' })
  @ApiParam({ name: 'studentId', type: String })
  @ApiResponse({ status: 200, description: 'Student consents retrieved successfully' })
  async getStudentConsents(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.consentService.getStudentConsents(studentId);
  }

  @Post('consents/:id/withdraw')
  @ApiOperation({ summary: 'Withdraw consent' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Consent withdrawn successfully' })
  async withdrawConsent(@Param('id', ParseUUIDPipe) id: string, @Body('withdrawnBy') withdrawnBy: string) {
    return this.consentService.withdrawConsent(id, withdrawnBy);
  }

  // ==================== DATA RETENTION ENDPOINTS ====================

  @Get('data-retention')
  @ApiOperation({ summary: 'List data retention policies' })
  @ApiResponse({ status: 200, description: 'Data retention policies retrieved successfully' })
  async listDataRetentionPolicies(@Query() query: QueryDataRetentionDto) {
    return this.dataRetentionService.listPolicies(query);
  }

  @Get('data-retention/:id')
  @ApiOperation({ summary: 'Get data retention policy by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Policy retrieved successfully' })
  async getDataRetentionPolicyById(@Param('id', ParseUUIDPipe) id: string) {
    return this.dataRetentionService.getPolicyById(id);
  }

  @Post('data-retention')
  @ApiOperation({ summary: 'Create data retention policy' })
  @ApiBody({ type: CreateDataRetentionDto })
  @ApiResponse({ status: 201, description: 'Policy created successfully' })
  async createDataRetentionPolicy(@Body() dto: CreateDataRetentionDto) {
    return this.dataRetentionService.createPolicy(dto);
  }

  @Put('data-retention/:id')
  @ApiOperation({ summary: 'Update data retention policy' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDataRetentionDto })
  @ApiResponse({ status: 200, description: 'Policy updated successfully' })
  async updateDataRetentionPolicy(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDataRetentionDto, @Req() req: Request) {
    const reviewedBy = (req as any).user?.id || 'system';
    return this.dataRetentionService.updatePolicy(id, dto, reviewedBy);
  }

  // ==================== HIPAA/FERPA STATUS ENDPOINTS ====================

  @Get('hipaa-status')
  @ApiOperation({ summary: 'Get HIPAA compliance status' })
  @ApiResponse({ status: 200, description: 'HIPAA status retrieved successfully' })
  async getHipaaStatus() {
    return this.statisticsService.getHipaaStatus();
  }

  @Get('ferpa-status')
  @ApiOperation({ summary: 'Get FERPA compliance status' })
  @ApiResponse({ status: 200, description: 'FERPA status retrieved successfully' })
  async getFerpaStatus() {
    return this.statisticsService.getFerpaStatus();
  }

  // ==================== VIOLATION AND REMEDIATION ENDPOINTS ====================

  @Get('violations')
  @ApiOperation({ summary: 'List compliance violations' })
  @ApiResponse({ status: 200, description: 'Violations retrieved successfully' })
  async listViolations(@Query() query: QueryViolationDto) {
    return this.violationService.listViolations(query);
  }

  @Post('violations')
  @ApiOperation({ summary: 'Report compliance violation' })
  @ApiBody({ type: CreateViolationDto })
  @ApiResponse({ status: 201, description: 'Violation reported successfully' })
  async createViolation(@Body() dto: CreateViolationDto, @Req() req: Request) {
    const reportedBy = (req as any).user?.id || 'system';
    return this.violationService.createViolation(dto, reportedBy);
  }

  @Put('violations/:id')
  @ApiOperation({ summary: 'Update violation status' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateViolationDto })
  @ApiResponse({ status: 200, description: 'Violation updated successfully' })
  async updateViolation(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateViolationDto) {
    return this.violationService.updateViolation(id, dto);
  }

  @Post('remediation')
  @ApiOperation({ summary: 'Track remediation action' })
  @ApiBody({ type: CreateRemediationDto })
  @ApiResponse({ status: 201, description: 'Remediation action created successfully' })
  async createRemediation(@Body() dto: CreateRemediationDto) {
    return this.violationService.createRemediation(dto);
  }

  @Put('remediation/:id')
  @ApiOperation({ summary: 'Update remediation action' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateRemediationDto })
  @ApiResponse({ status: 200, description: 'Remediation updated successfully' })
  async updateRemediation(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRemediationDto) {
    return this.violationService.updateRemediation(id, dto);
  }

  // ==================== STATISTICS ENDPOINTS ====================

  @Get('statistics')
  @ApiOperation({ summary: 'Get compliance statistics', description: 'Comprehensive compliance metrics for dashboards and reporting' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(@Query() query: QueryStatisticsDto) {
    return this.statisticsService.getComplianceStatistics(query);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get compliance dashboard data', description: 'Aggregate compliance dashboard with reports, checklists, consents, and audit statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  async getComplianceDashboard() {
    return this.statisticsService.getComplianceDashboard();
  }
}
