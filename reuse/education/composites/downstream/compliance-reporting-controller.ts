/**
 * LOC: EDU-DOWN-COMPLIANCE-CTRL-005
 * File: /reuse/education/composites/downstream/compliance-reporting-controller.ts
 *
 * Purpose: Compliance Reporting REST Controller - Production-grade HTTP endpoints
 * Handles regulatory reporting, compliance audits, and institutional governance
 *
 * Upstream: ComplianceReportingService, ComplianceReportingComposite
 * Downstream: REST API clients, Compliance systems, Regulatory bodies
 * Dependencies: NestJS 10.x, Swagger/OpenAPI, class-validator
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  ParseIntPipe,
  ValidationPipe,
  Logger,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ComplianceReportingService } from './compliance-reporting-service';

// Guard and Interceptor imports
// import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
// import { RolesGuard } from '@/common/guards/roles.guard';
// import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
// import { Roles } from '@/common/decorators/roles.decorator';

/**
 * Compliance Reporting Controller
 * Provides REST API endpoints for compliance and regulatory reporting
 */
@ApiTags('Compliance & Reporting')
@Controller('api/v1/compliance')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor)
export class ComplianceReportingController {
  private readonly logger = new Logger(ComplianceReportingController.name);

  constructor(private readonly complianceService: ComplianceReportingService) {}

  /**
   * Get all compliance reports
   */
  @Get()
  @ApiOperation({
    summary: 'Get all compliance reports',
    description: 'Retrieve paginated list of compliance reports',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiOkResponse({
    description: 'Compliance reports retrieved successfully',
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('status') status?: string,
  ) {
    return this.complianceService.findAll({
      page,
      limit,
      status,
    });
  }

  /**
   * Get compliance report by ID
   */
  @Get(':reportId')
  @ApiOperation({
    summary: 'Get compliance report by ID',
    description: 'Retrieve a specific compliance report',
  })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiOkResponse({ description: 'Compliance report found' })
  @ApiNotFoundResponse({ description: 'Report not found' })
  async findOne(@Param('reportId', ParseUUIDPipe) reportId: string) {
    return this.complianceService.findOne(reportId);
  }

  /**
   * Create compliance report
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create compliance report',
    description: 'Create a new compliance report',
  })
  @ApiBody({
    description: 'Compliance report data',
    schema: {
      properties: {
        reportType: { type: 'string' },
        reportingPeriod: { type: 'string' },
        reguatoryBody: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Compliance report created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid report data' })
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createReportDto: any,
  ) {
    this.logger.log(`Creating compliance report of type: ${createReportDto.reportType}`);
    return this.complianceService.create(createReportDto);
  }

  /**
   * Update compliance report
   */
  @Put(':reportId')
  @ApiOperation({
    summary: 'Update compliance report',
    description: 'Update an existing compliance report',
  })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiOkResponse({ description: 'Report updated successfully' })
  async update(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateReportDto: any,
  ) {
    this.logger.log(`Updating compliance report: ${reportId}`);
    return this.complianceService.update(reportId, updateReportDto);
  }

  /**
   * Delete compliance report
   */
  @Delete(':reportId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete compliance report',
    description: 'Delete a compliance report',
  })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiOkResponse({ description: 'Report deleted successfully' })
  async delete(@Param('reportId', ParseUUIDPipe) reportId: string) {
    this.logger.log(`Deleting compliance report: ${reportId}`);
    return this.complianceService.delete(reportId);
  }

  /**
   * Generate compliance report
   */
  @Post(':reportId/generate')
  @ApiOperation({
    summary: 'Generate compliance report',
    description: 'Generate full compliance report with all required data',
  })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiOkResponse({ description: 'Report generation started' })
  async generate(@Param('reportId', ParseUUIDPipe) reportId: string) {
    return this.complianceService.generate(reportId);
  }

  /**
   * Verify compliance requirements
   */
  @Post(':reportId/verify')
  @ApiOperation({
    summary: 'Verify compliance requirements',
    description: 'Verify all compliance requirements are met',
  })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiOkResponse({ description: 'Compliance verification completed' })
  async verify(@Param('reportId', ParseUUIDPipe) reportId: string) {
    return this.complianceService.verify(reportId);
  }

  /**
   * Submit report to regulatory body
   */
  @Post(':reportId/submit')
  @ApiOperation({
    summary: 'Submit report',
    description: 'Submit compliance report to regulatory body',
  })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiOkResponse({ description: 'Report submitted successfully' })
  async submit(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body() submitData: any,
  ) {
    return this.complianceService.submit(reportId, submitData);
  }

  /**
   * Get audit trail
   */
  @Get(':reportId/audit-trail')
  @ApiOperation({
    summary: 'Get audit trail',
    description: 'Retrieve detailed audit trail for compliance report',
  })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiOkResponse({ description: 'Audit trail retrieved' })
  async getAuditTrail(@Param('reportId', ParseUUIDPipe) reportId: string) {
    return this.complianceService.getAuditTrail(reportId);
  }

  /**
   * Download report
   */
  @Get(':reportId/download')
  @ApiOperation({
    summary: 'Download report',
    description: 'Download compliance report in PDF format',
  })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiOkResponse({
    description: 'Report download started',
    content: { 'application/pdf': {} },
  })
  async download(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Res() res: Response,
  ) {
    this.logger.log(`Downloading compliance report: ${reportId}`);
    const pdfStream = await this.complianceService.generatePdf(reportId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="compliance-report.pdf"');
    pdfStream.pipe(res);
  }

  /**
   * Get compliance status
   */
  @Get('status/summary')
  @ApiOperation({
    summary: 'Get compliance status',
    description: 'Get overall compliance status and open issues',
  })
  @ApiOkResponse({ description: 'Compliance status retrieved' })
  async getStatus() {
    return this.complianceService.getStatus();
  }

  /**
   * Get upcoming compliance deadlines
   */
  @Get('deadlines/upcoming')
  @ApiOperation({
    summary: 'Get upcoming deadlines',
    description: 'Retrieve upcoming compliance reporting deadlines',
  })
  @ApiQuery({ name: 'daysAhead', required: false, type: Number })
  @ApiOkResponse({ description: 'Deadlines retrieved' })
  async getUpcomingDeadlines(
    @Query('daysAhead', new ParseIntPipe({ optional: true })) daysAhead: number = 90,
  ) {
    return this.complianceService.getUpcomingDeadlines(daysAhead);
  }

  /**
   * Run compliance audit
   */
  @Post('audit/run')
  @ApiOperation({
    summary: 'Run compliance audit',
    description: 'Execute comprehensive compliance audit',
  })
  @ApiOkResponse({ description: 'Audit execution started' })
  async runAudit(@Body() auditData: any) {
    this.logger.log('Running compliance audit');
    return this.complianceService.runAudit(auditData);
  }

  /**
   * Get audit results
   */
  @Get('audit/:auditId/results')
  @ApiOperation({
    summary: 'Get audit results',
    description: 'Retrieve compliance audit results',
  })
  @ApiParam({ name: 'auditId', description: 'Audit UUID' })
  @ApiOkResponse({ description: 'Audit results retrieved' })
  async getAuditResults(@Param('auditId', ParseUUIDPipe) auditId: string) {
    return this.complianceService.getAuditResults(auditId);
  }

  /**
   * Export compliance data
   */
  @Get('export/:format')
  @ApiOperation({
    summary: 'Export compliance data',
    description: 'Export compliance data in specified format',
  })
  @ApiParam({ name: 'format', enum: ['csv', 'xlsx', 'pdf'] })
  @ApiOkResponse({ description: 'Export generated successfully' })
  async export(
    @Param('format') format: 'csv' | 'xlsx' | 'pdf',
  ) {
    this.logger.log(`Exporting compliance data in ${format} format`);
    return this.complianceService.export(format);
  }

  /**
   * Get compliance statistics
   */
  @Get('analytics/statistics')
  @ApiOperation({
    summary: 'Get compliance statistics',
    description: 'Retrieve compliance analytics and statistics',
  })
  @ApiOkResponse({ description: 'Statistics retrieved successfully' })
  async getStatistics() {
    return this.complianceService.getStatistics();
  }

  /**
   * Archive report
   */
  @Patch(':reportId/archive')
  @ApiOperation({
    summary: 'Archive report',
    description: 'Archive a compliance report',
  })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiOkResponse({ description: 'Report archived successfully' })
  async archive(@Param('reportId', ParseUUIDPipe) reportId: string) {
    return this.complianceService.archive(reportId);
  }
}
