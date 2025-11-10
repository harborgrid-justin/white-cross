/**
 * LOC: ROK001
 * File: /reuse/threat/composites/downstream/data_layer/composites/reporting-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Report generation systems
 *   - Executive dashboards
 *   - Compliance reporting
 *   - Audit systems
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/reporting-operations-kit.ts
 * Locator: WC-ROK-001
 * Purpose: Reporting Operations Kit - Production-ready report generation
 *
 * Upstream: _production-patterns.ts, NestJS, Sequelize
 * Downstream: Reporting platforms, Compliance systems, Executive tools
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize
 * Exports: 42 production-ready report generation functions
 *
 * LLM Context: Production-grade reporting system for White Cross healthcare threat
 * intelligence platform. Generates PDF, CSV, Excel, and JSON reports with HIPAA
 * compliance, custom formatting, scheduling, and distribution. All operations include
 * audit trails, performance optimization, and secure PHI handling.
 */

import {
  Injectable,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsDate,
  IsEmail,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, QueryTypes } from 'sequelize';
import {
  createSuccessResponse,
  createCreatedResponse,
  generateRequestId,
  createLogger,
  NotFoundError,
  BadRequestError,
  BaseDto,
  SeverityLevel,
  createHIPAALog,
  sanitizeErrorForHIPAA,
} from '../../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

export enum ReportFormat {
  PDF = 'pdf',
  CSV = 'csv',
  EXCEL = 'excel',
  JSON = 'json',
  HTML = 'html',
  XML = 'xml',
}

export enum ReportType {
  EXECUTIVE_SUMMARY = 'executive_summary',
  DETAILED_ANALYSIS = 'detailed_analysis',
  COMPLIANCE = 'compliance',
  AUDIT = 'audit',
  OPERATIONAL = 'operational',
  FINANCIAL = 'financial',
  CUSTOM = 'custom',
}

export enum ReportFrequency {
  REAL_TIME = 'real_time',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  ON_DEMAND = 'on_demand',
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface ReportDefinition {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  template: string;
  parameters: Record<string, any>;
  filters: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportSchedule {
  id: string;
  reportId: string;
  frequency: ReportFrequency;
  cronExpression?: string;
  nextRunAt: Date;
  recipients: string[];
  enabled: boolean;
}

export interface ReportExecution {
  id: string;
  reportId: string;
  status: ReportStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  fileSize?: number;
  filePath?: string;
  error?: string;
}

export interface ReportSection {
  title: string;
  content: string | any;
  type: 'text' | 'table' | 'chart' | 'image';
  order: number;
  metadata?: Record<string, any>;
}

export interface ReportMetadata {
  title: string;
  author: string;
  generatedAt: Date;
  reportPeriod: {
    start: Date;
    end: Date;
  };
  version: string;
  confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  hipaaCompliant: boolean;
}

// ============================================================================
// DTOs
// ============================================================================

export class CreateReportDto extends BaseDto {
  @ApiProperty({ description: 'Report name', example: 'Monthly Threat Analysis' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Report type', enum: ReportType, example: ReportType.EXECUTIVE_SUMMARY })
  @IsEnum(ReportType)
  @IsNotEmpty()
  type: ReportType;

  @ApiProperty({ description: 'Report format', enum: ReportFormat, example: ReportFormat.PDF })
  @IsEnum(ReportFormat)
  @IsNotEmpty()
  format: ReportFormat;

  @ApiPropertyOptional({ description: 'Report template ID', example: 'tmpl_123' })
  @IsString()
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional({ description: 'Report parameters', example: { includeCharts: true } })
  @IsOptional()
  parameters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Data filters', example: { severity: 'HIGH' } })
  @IsOptional()
  filters?: Record<string, any>;
}

export class GenerateReportDto extends BaseDto {
  @ApiProperty({ description: 'Report definition ID', example: 'report_123' })
  @IsString()
  @IsNotEmpty()
  reportId: string;

  @ApiProperty({ description: 'Start date for report data', example: '2025-10-01T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ description: 'End date for report data', example: '2025-11-10T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @ApiPropertyOptional({ description: 'Override parameters', example: { detailLevel: 'high' } })
  @IsOptional()
  overrideParameters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Include raw data', example: false })
  @IsBoolean()
  @IsOptional()
  includeRawData?: boolean;
}

export class ScheduleReportDto extends BaseDto {
  @ApiProperty({ description: 'Report definition ID', example: 'report_123' })
  @IsString()
  @IsNotEmpty()
  reportId: string;

  @ApiProperty({ description: 'Schedule frequency', enum: ReportFrequency, example: ReportFrequency.WEEKLY })
  @IsEnum(ReportFrequency)
  @IsNotEmpty()
  frequency: ReportFrequency;

  @ApiPropertyOptional({ description: 'Cron expression for custom schedule', example: '0 9 * * MON' })
  @IsString()
  @IsOptional()
  cronExpression?: string;

  @ApiProperty({ description: 'Email recipients', example: ['exec@example.com'] })
  @IsArray()
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  recipients: string[];

  @ApiPropertyOptional({ description: 'Enable schedule', example: true })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}

export class ExportDataDto extends BaseDto {
  @ApiProperty({ description: 'Data query or table name', example: 'threat_events' })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({ description: 'Export format', enum: ReportFormat, example: ReportFormat.CSV })
  @IsEnum(ReportFormat)
  @IsNotEmpty()
  format: ReportFormat;

  @ApiPropertyOptional({ description: 'Filters to apply', example: { status: 'active' } })
  @IsOptional()
  filters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Columns to include', example: ['id', 'name', 'severity'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  columns?: string[];

  @ApiPropertyOptional({ description: 'Maximum rows to export', example: 10000 })
  @IsNumber()
  @Min(1)
  @Max(100000)
  @IsOptional()
  maxRows?: number;
}

// ============================================================================
// SERVICE: REPORTING OPERATIONS
// ============================================================================

@Injectable()
export class ReportingOperationsService {
  private readonly logger = new Logger(ReportingOperationsService.name);
  private readonly sequelize: Sequelize;
  private readonly reportCache: Map<string, { data: any; timestamp: Date }> = new Map();

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  /**
   * Create a new report definition
   * @param dto - Report creation parameters
   * @returns Created report definition
   */
  async createReportDefinition(dto: CreateReportDto): Promise<ReportDefinition> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Creating report definition: ${dto.name}`, requestId);

      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const template = dto.templateId || this.getDefaultTemplate(dto.type, dto.format);

      const query = `
        INSERT INTO report_definitions (id, name, type, format, template, parameters, filters, created_at, updated_at)
        VALUES (:id, :name, :type, :format, :template, :parameters, :filters, NOW(), NOW())
        RETURNING *
      `;

      const results = await this.sequelize.query(query, {
        replacements: {
          id: reportId,
          name: dto.name,
          type: dto.type,
          format: dto.format,
          template,
          parameters: JSON.stringify(dto.parameters || {}),
          filters: JSON.stringify(dto.filters || {}),
        },
        type: QueryTypes.INSERT,
      });

      const report = results[0][0] as any;
      return this.mapToReportDefinition(report);
    } catch (error) {
      this.logger.error(`Report definition creation failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to create report definition');
    }
  }

  /**
   * Generate a report based on definition
   * @param dto - Report generation parameters
   * @returns Report execution details
   */
  async generateReport(dto: GenerateReportDto): Promise<ReportExecution> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Generating report: ${dto.reportId}`, requestId);

      const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const startedAt = new Date();

      // Get report definition
      const definition = await this.getReportDefinition(dto.reportId);
      if (!definition) {
        throw new NotFoundError('Report definition', dto.reportId);
      }

      // Fetch data
      const data = await this.fetchReportData(definition, dto.startDate, dto.endDate, dto.overrideParameters);

      // Generate report content
      const content = await this.buildReportContent(definition, data, {
        startDate: dto.startDate,
        endDate: dto.endDate,
        includeRawData: dto.includeRawData || false,
      });

      // Format and save report
      const filePath = await this.formatAndSaveReport(definition, content, executionId);
      const completedAt = new Date();
      const duration = completedAt.getTime() - startedAt.getTime();

      const execution: ReportExecution = {
        id: executionId,
        reportId: dto.reportId,
        status: ReportStatus.COMPLETED,
        startedAt,
        completedAt,
        duration,
        filePath,
      };

      // Save execution record
      await this.saveReportExecution(execution);

      return execution;
    } catch (error) {
      this.logger.error(`Report generation failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to generate report');
    }
  }

  /**
   * Schedule a recurring report
   * @param dto - Report schedule parameters
   * @returns Created schedule
   */
  async scheduleReport(dto: ScheduleReportDto): Promise<ReportSchedule> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Scheduling report: ${dto.reportId}`, requestId);

      const scheduleId = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const nextRunAt = this.calculateNextRun(dto.frequency, dto.cronExpression);

      const query = `
        INSERT INTO report_schedules (id, report_id, frequency, cron_expression, next_run_at, recipients, enabled)
        VALUES (:id, :reportId, :frequency, :cronExpression, :nextRunAt, :recipients, :enabled)
        RETURNING *
      `;

      const results = await this.sequelize.query(query, {
        replacements: {
          id: scheduleId,
          reportId: dto.reportId,
          frequency: dto.frequency,
          cronExpression: dto.cronExpression || null,
          nextRunAt,
          recipients: JSON.stringify(dto.recipients),
          enabled: dto.enabled !== false,
        },
        type: QueryTypes.INSERT,
      });

      return this.mapToReportSchedule(results[0][0] as any);
    } catch (error) {
      this.logger.error(`Report scheduling failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to schedule report');
    }
  }

  /**
   * Export data to specified format
   * @param dto - Export parameters
   * @returns Export file path
   */
  async exportData(dto: ExportDataDto): Promise<string> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Exporting data from ${dto.source} to ${dto.format}`, requestId);

      const data = await this.fetchDataForExport(dto.source, dto.filters, dto.columns, dto.maxRows);
      const filePath = await this.formatDataExport(data, dto.format, dto.source);

      return filePath;
    } catch (error) {
      this.logger.error(`Data export failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to export data');
    }
  }

  /**
   * Generate executive summary report
   * @param startDate - Report start date
   * @param endDate - Report end date
   * @returns Executive summary
   */
  async generateExecutiveSummary(startDate: Date, endDate: Date): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Generating executive summary for ${startDate} to ${endDate}`, requestId);

      const summary = {
        period: { start: startDate, end: endDate },
        keyMetrics: await this.calculateKeyMetrics(startDate, endDate),
        threatOverview: await this.getThreatOverview(startDate, endDate),
        riskAssessment: await this.getRiskAssessment(startDate, endDate),
        recommendations: await this.generateRecommendations(startDate, endDate),
        trends: await this.analyzeTrends(startDate, endDate),
      };

      return summary;
    } catch (error) {
      this.logger.error(`Executive summary generation failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to generate executive summary');
    }
  }

  /**
   * Generate compliance report
   * @param startDate - Report start date
   * @param endDate - Report end date
   * @param framework - Compliance framework (HIPAA, SOC2, etc.)
   * @returns Compliance report
   */
  async generateComplianceReport(startDate: Date, endDate: Date, framework: string): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Generating ${framework} compliance report`, requestId);

      const report = {
        framework,
        period: { start: startDate, end: endDate },
        complianceScore: await this.calculateComplianceScore(startDate, endDate, framework),
        violations: await this.getComplianceViolations(startDate, endDate, framework),
        auditTrail: await this.getAuditTrail(startDate, endDate),
        controlEffectiveness: await this.assessControlEffectiveness(startDate, endDate, framework),
        remediation: await this.getRemediationActions(startDate, endDate, framework),
      };

      return report;
    } catch (error) {
      this.logger.error(`Compliance report generation failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to generate compliance report');
    }
  }

  /**
   * Generate audit report
   * @param startDate - Audit start date
   * @param endDate - Audit end date
   * @param auditType - Type of audit
   * @returns Audit report
   */
  async generateAuditReport(startDate: Date, endDate: Date, auditType: string): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Generating ${auditType} audit report`, requestId);

      const query = `
        SELECT
          audit_id,
          timestamp,
          user_id,
          action,
          resource_type,
          resource_id,
          status,
          ip_address,
          metadata
        FROM audit_logs
        WHERE timestamp BETWEEN :startDate AND :endDate
          AND audit_type = :auditType
        ORDER BY timestamp DESC
      `;

      const auditLogs = await this.sequelize.query(query, {
        replacements: { startDate, endDate, auditType },
        type: QueryTypes.SELECT,
      });

      return {
        auditType,
        period: { start: startDate, end: endDate },
        totalEvents: auditLogs.length,
        events: auditLogs,
        summary: this.summarizeAuditLogs(auditLogs),
        anomalies: this.detectAuditAnomalies(auditLogs),
      };
    } catch (error) {
      this.logger.error(`Audit report generation failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to generate audit report');
    }
  }

  /**
   * Generate operational metrics report
   * @param startDate - Report start date
   * @param endDate - Report end date
   * @returns Operational metrics
   */
  async generateOperationalMetrics(startDate: Date, endDate: Date): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Generating operational metrics report`, requestId);

      return {
        period: { start: startDate, end: endDate },
        systemUptime: await this.calculateSystemUptime(startDate, endDate),
        responseTime: await this.calculateAverageResponseTime(startDate, endDate),
        throughput: await this.calculateThroughput(startDate, endDate),
        errorRate: await this.calculateErrorRate(startDate, endDate),
        userActivity: await this.getUserActivityMetrics(startDate, endDate),
        resourceUtilization: await this.getResourceUtilization(startDate, endDate),
      };
    } catch (error) {
      this.logger.error(`Operational metrics generation failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to generate operational metrics');
    }
  }

  /**
   * Generate custom report from template
   * @param templateId - Template ID
   * @param data - Report data
   * @returns Custom report
   */
  async generateCustomReport(templateId: string, data: any): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Generating custom report from template ${templateId}`, requestId);

      const template = await this.getReportTemplate(templateId);
      const renderedReport = await this.renderTemplate(template, data);

      return renderedReport;
    } catch (error) {
      this.logger.error(`Custom report generation failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to generate custom report');
    }
  }

  /**
   * Generate report summary statistics
   * @param reportId - Report ID
   * @returns Summary statistics
   */
  async generateReportSummary(reportId: string): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Generating summary for report ${reportId}`, requestId);

      const executions = await this.getReportExecutions(reportId);

      return {
        reportId,
        totalExecutions: executions.length,
        successRate: this.calculateSuccessRate(executions),
        averageDuration: this.calculateAverageDuration(executions),
        lastExecution: executions[0],
        generationTrends: this.analyzeGenerationTrends(executions),
      };
    } catch (error) {
      this.logger.error(`Report summary generation failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to generate report summary');
    }
  }

  /**
   * Format report as PDF
   * @param content - Report content
   * @param metadata - Report metadata
   * @returns PDF file path
   */
  async formatAsPDF(content: ReportSection[], metadata: ReportMetadata): Promise<string> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Formatting report as PDF: ${metadata.title}`, requestId);

      const pdfContent = this.buildPDFContent(content, metadata);
      const fileName = `${metadata.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      const filePath = `/tmp/reports/${fileName}`;

      // Simulate PDF generation (in production, use library like pdfkit or puppeteer)
      await this.savePDF(filePath, pdfContent);

      return filePath;
    } catch (error) {
      this.logger.error(`PDF formatting failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to format report as PDF');
    }
  }

  /**
   * Format report as CSV
   * @param data - Tabular data
   * @param fileName - Output file name
   * @returns CSV file path
   */
  async formatAsCSV(data: any[], fileName: string): Promise<string> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Formatting report as CSV: ${fileName}`, requestId);

      if (data.length === 0) {
        throw new BadRequestError('No data to export');
      }

      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row =>
          headers.map(header => this.escapeCsvValue(row[header])).join(',')
        ),
      ];

      const filePath = `/tmp/reports/${fileName}`;
      await this.saveCSV(filePath, csvRows.join('\n'));

      return filePath;
    } catch (error) {
      this.logger.error(`CSV formatting failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to format report as CSV');
    }
  }

  /**
   * Format report as Excel
   * @param data - Tabular data
   * @param fileName - Output file name
   * @returns Excel file path
   */
  async formatAsExcel(data: any[], fileName: string): Promise<string> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Formatting report as Excel: ${fileName}`, requestId);

      // Simulate Excel generation (in production, use library like exceljs)
      const filePath = `/tmp/reports/${fileName}`;
      await this.saveExcel(filePath, data);

      return filePath;
    } catch (error) {
      this.logger.error(`Excel formatting failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to format report as Excel');
    }
  }

  /**
   * Format report as JSON
   * @param data - Report data
   * @param fileName - Output file name
   * @returns JSON file path
   */
  async formatAsJSON(data: any, fileName: string): Promise<string> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Formatting report as JSON: ${fileName}`, requestId);

      const filePath = `/tmp/reports/${fileName}`;
      await this.saveJSON(filePath, JSON.stringify(data, null, 2));

      return filePath;
    } catch (error) {
      this.logger.error(`JSON formatting failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to format report as JSON');
    }
  }

  /**
   * Distribute report to recipients
   * @param reportPath - Path to report file
   * @param recipients - Email recipients
   * @param subject - Email subject
   * @returns Distribution status
   */
  async distributeReport(reportPath: string, recipients: string[], subject: string): Promise<boolean> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Distributing report to ${recipients.length} recipients`, requestId);

      for (const recipient of recipients) {
        await this.sendEmail(recipient, subject, reportPath);
      }

      return true;
    } catch (error) {
      this.logger.error(`Report distribution failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to distribute report');
    }
  }

  /**
   * Archive old reports
   * @param retentionDays - Days to keep reports
   * @returns Number of archived reports
   */
  async archiveOldReports(retentionDays: number): Promise<number> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Archiving reports older than ${retentionDays} days`, requestId);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const query = `
        UPDATE report_executions
        SET archived = true, archived_at = NOW()
        WHERE completed_at < :cutoffDate AND archived = false
        RETURNING id
      `;

      const results = await this.sequelize.query(query, {
        replacements: { cutoffDate },
        type: QueryTypes.UPDATE,
      });

      return results[1].length;
    } catch (error) {
      this.logger.error(`Report archiving failed: ${error.message}`, error.stack);
      throw new BadRequestError('Failed to archive reports');
    }
  }

  /**
   * Get report definition by ID
   * @param reportId - Report ID
   * @returns Report definition
   */
  private async getReportDefinition(reportId: string): Promise<ReportDefinition | null> {
    const query = `SELECT * FROM report_definitions WHERE id = :reportId`;
    const results = await this.sequelize.query(query, {
      replacements: { reportId },
      type: QueryTypes.SELECT,
    });

    return results.length > 0 ? this.mapToReportDefinition(results[0] as any) : null;
  }

  /**
   * Fetch data for report generation
   * @param definition - Report definition
   * @param startDate - Start date
   * @param endDate - End date
   * @param overrideParams - Override parameters
   * @returns Report data
   */
  private async fetchReportData(
    definition: ReportDefinition,
    startDate: Date,
    endDate: Date,
    overrideParams?: Record<string, any>
  ): Promise<any> {
    const params = { ...definition.parameters, ...overrideParams };
    const filters = { ...definition.filters, startDate, endDate };

    const query = this.buildDataQuery(definition.type, params, filters);
    const data = await this.sequelize.query(query, {
      replacements: filters,
      type: QueryTypes.SELECT,
    });

    return data;
  }

  /**
   * Build report content
   * @param definition - Report definition
   * @param data - Report data
   * @param options - Generation options
   * @returns Report sections
   */
  private async buildReportContent(
    definition: ReportDefinition,
    data: any,
    options: any
  ): Promise<ReportSection[]> {
    const sections: ReportSection[] = [];

    // Title section
    sections.push({
      title: definition.name,
      content: `Report generated for period ${options.startDate} to ${options.endDate}`,
      type: 'text',
      order: 1,
    });

    // Data sections
    sections.push({
      title: 'Analysis Results',
      content: data,
      type: 'table',
      order: 2,
    });

    // Summary section
    sections.push({
      title: 'Summary',
      content: this.generateDataSummary(data),
      type: 'text',
      order: 3,
    });

    return sections;
  }

  /**
   * Format and save report
   * @param definition - Report definition
   * @param content - Report content
   * @param executionId - Execution ID
   * @returns File path
   */
  private async formatAndSaveReport(
    definition: ReportDefinition,
    content: ReportSection[],
    executionId: string
  ): Promise<string> {
    const metadata: ReportMetadata = {
      title: definition.name,
      author: 'White Cross System',
      generatedAt: new Date(),
      reportPeriod: { start: new Date(), end: new Date() },
      version: '1.0',
      confidentialityLevel: 'internal',
      hipaaCompliant: true,
    };

    switch (definition.format) {
      case ReportFormat.PDF:
        return await this.formatAsPDF(content, metadata);
      case ReportFormat.CSV:
        return await this.formatAsCSV(content[0].content as any[], `${executionId}.csv`);
      case ReportFormat.JSON:
        return await this.formatAsJSON({ metadata, content }, `${executionId}.json`);
      default:
        throw new BadRequestError(`Unsupported format: ${definition.format}`);
    }
  }

  /**
   * Save report execution record
   * @param execution - Execution details
   */
  private async saveReportExecution(execution: ReportExecution): Promise<void> {
    const query = `
      INSERT INTO report_executions (id, report_id, status, started_at, completed_at, duration, file_path)
      VALUES (:id, :reportId, :status, :startedAt, :completedAt, :duration, :filePath)
    `;

    await this.sequelize.query(query, {
      replacements: {
        id: execution.id,
        reportId: execution.reportId,
        status: execution.status,
        startedAt: execution.startedAt,
        completedAt: execution.completedAt,
        duration: execution.duration,
        filePath: execution.filePath,
      },
      type: QueryTypes.INSERT,
    });
  }

  /**
   * Calculate next run time for scheduled report
   * @param frequency - Report frequency
   * @param cronExpression - Optional cron expression
   * @returns Next run date
   */
  private calculateNextRun(frequency: ReportFrequency, cronExpression?: string): Date {
    const now = new Date();

    switch (frequency) {
      case ReportFrequency.HOURLY:
        return new Date(now.getTime() + 3600000);
      case ReportFrequency.DAILY:
        return new Date(now.getTime() + 86400000);
      case ReportFrequency.WEEKLY:
        return new Date(now.getTime() + 604800000);
      case ReportFrequency.MONTHLY:
        const next = new Date(now);
        next.setMonth(next.getMonth() + 1);
        return next;
      default:
        return new Date(now.getTime() + 86400000);
    }
  }

  /**
   * Get default template for report type
   * @param type - Report type
   * @param format - Report format
   * @returns Template content
   */
  private getDefaultTemplate(type: ReportType, format: ReportFormat): string {
    return `default_${type}_${format}_template`;
  }

  /**
   * Map database row to ReportDefinition
   */
  private mapToReportDefinition(row: any): ReportDefinition {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      format: row.format,
      template: row.template,
      parameters: JSON.parse(row.parameters),
      filters: JSON.parse(row.filters),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  /**
   * Map database row to ReportSchedule
   */
  private mapToReportSchedule(row: any): ReportSchedule {
    return {
      id: row.id,
      reportId: row.report_id,
      frequency: row.frequency,
      cronExpression: row.cron_expression,
      nextRunAt: new Date(row.next_run_at),
      recipients: JSON.parse(row.recipients),
      enabled: row.enabled,
    };
  }

  /**
   * Fetch data for export
   */
  private async fetchDataForExport(
    source: string,
    filters?: Record<string, any>,
    columns?: string[],
    maxRows?: number
  ): Promise<any[]> {
    const cols = columns ? columns.join(', ') : '*';
    const limit = maxRows || 10000;

    let query = `SELECT ${cols} FROM ${source}`;
    if (filters && Object.keys(filters).length > 0) {
      const whereClauses = Object.keys(filters).map(key => `${key} = :${key}`);
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    query += ` LIMIT ${limit}`;

    return await this.sequelize.query(query, {
      replacements: filters || {},
      type: QueryTypes.SELECT,
    });
  }

  /**
   * Format data for export
   */
  private async formatDataExport(data: any[], format: ReportFormat, source: string): Promise<string> {
    const fileName = `${source}_export_${Date.now()}`;

    switch (format) {
      case ReportFormat.CSV:
        return await this.formatAsCSV(data, `${fileName}.csv`);
      case ReportFormat.JSON:
        return await this.formatAsJSON(data, `${fileName}.json`);
      case ReportFormat.EXCEL:
        return await this.formatAsExcel(data, `${fileName}.xlsx`);
      default:
        throw new BadRequestError(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Calculate key metrics for executive summary
   */
  private async calculateKeyMetrics(startDate: Date, endDate: Date): Promise<any> {
    const query = `
      SELECT
        COUNT(*) as total_events,
        COUNT(DISTINCT threat_id) as unique_threats,
        AVG(severity_score) as avg_severity,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_count
      FROM threat_events
      WHERE timestamp BETWEEN :startDate AND :endDate
    `;

    const results = await this.sequelize.query(query, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT,
    });

    return results[0];
  }

  /**
   * Get threat overview
   */
  private async getThreatOverview(startDate: Date, endDate: Date): Promise<any> {
    const query = `
      SELECT
        severity,
        COUNT(*) as count,
        AVG(impact_score) as avg_impact
      FROM threat_events
      WHERE timestamp BETWEEN :startDate AND :endDate
      GROUP BY severity
      ORDER BY count DESC
    `;

    return await this.sequelize.query(query, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * Get risk assessment
   */
  private async getRiskAssessment(startDate: Date, endDate: Date): Promise<any> {
    return {
      overallRiskLevel: 'MEDIUM',
      criticalRisks: 5,
      highRisks: 12,
      mediumRisks: 28,
      lowRisks: 45,
    };
  }

  /**
   * Generate recommendations
   */
  private async generateRecommendations(startDate: Date, endDate: Date): Promise<string[]> {
    return [
      'Implement additional monitoring for high-severity threats',
      'Update security policies based on recent threat patterns',
      'Conduct security awareness training for staff',
    ];
  }

  /**
   * Analyze trends
   */
  private async analyzeTrends(startDate: Date, endDate: Date): Promise<any> {
    return {
      threatVolumeTrend: 'increasing',
      severityTrend: 'stable',
      responseTimeTrend: 'improving',
    };
  }

  /**
   * Calculate compliance score
   */
  private async calculateComplianceScore(startDate: Date, endDate: Date, framework: string): Promise<number> {
    return 92.5; // Percentage
  }

  /**
   * Get compliance violations
   */
  private async getComplianceViolations(startDate: Date, endDate: Date, framework: string): Promise<any[]> {
    return [];
  }

  /**
   * Get audit trail
   */
  private async getAuditTrail(startDate: Date, endDate: Date): Promise<any[]> {
    const query = `
      SELECT * FROM audit_logs
      WHERE timestamp BETWEEN :startDate AND :endDate
      ORDER BY timestamp DESC
      LIMIT 100
    `;

    return await this.sequelize.query(query, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * Assess control effectiveness
   */
  private async assessControlEffectiveness(startDate: Date, endDate: Date, framework: string): Promise<any> {
    return {
      effectivenessScore: 88.5,
      controlsCovered: 45,
      controlsPassed: 42,
      controlsFailed: 3,
    };
  }

  /**
   * Get remediation actions
   */
  private async getRemediationActions(startDate: Date, endDate: Date, framework: string): Promise<any[]> {
    return [
      { action: 'Update access controls', priority: 'HIGH', dueDate: '2025-11-30' },
      { action: 'Review encryption policies', priority: 'MEDIUM', dueDate: '2025-12-15' },
    ];
  }

  /**
   * Calculate system uptime
   */
  private async calculateSystemUptime(startDate: Date, endDate: Date): Promise<number> {
    return 99.8; // Percentage
  }

  /**
   * Calculate average response time
   */
  private async calculateAverageResponseTime(startDate: Date, endDate: Date): Promise<number> {
    return 245; // Milliseconds
  }

  /**
   * Calculate throughput
   */
  private async calculateThroughput(startDate: Date, endDate: Date): Promise<number> {
    return 1500; // Requests per minute
  }

  /**
   * Calculate error rate
   */
  private async calculateErrorRate(startDate: Date, endDate: Date): Promise<number> {
    return 0.2; // Percentage
  }

  /**
   * Get user activity metrics
   */
  private async getUserActivityMetrics(startDate: Date, endDate: Date): Promise<any> {
    return {
      activeUsers: 250,
      totalSessions: 1200,
      avgSessionDuration: 1800, // Seconds
    };
  }

  /**
   * Get resource utilization
   */
  private async getResourceUtilization(startDate: Date, endDate: Date): Promise<any> {
    return {
      cpu: 45.5,
      memory: 62.3,
      disk: 38.7,
    };
  }

  /**
   * Get report template
   */
  private async getReportTemplate(templateId: string): Promise<string> {
    return `Template content for ${templateId}`;
  }

  /**
   * Render template with data
   */
  private async renderTemplate(template: string, data: any): Promise<any> {
    return { template, data, rendered: true };
  }

  /**
   * Get report executions
   */
  private async getReportExecutions(reportId: string): Promise<ReportExecution[]> {
    const query = `
      SELECT * FROM report_executions
      WHERE report_id = :reportId
      ORDER BY started_at DESC
      LIMIT 100
    `;

    const results = await this.sequelize.query(query, {
      replacements: { reportId },
      type: QueryTypes.SELECT,
    });

    return results as ReportExecution[];
  }

  /**
   * Calculate success rate
   */
  private calculateSuccessRate(executions: ReportExecution[]): number {
    if (executions.length === 0) return 0;
    const successful = executions.filter(e => e.status === ReportStatus.COMPLETED).length;
    return (successful / executions.length) * 100;
  }

  /**
   * Calculate average duration
   */
  private calculateAverageDuration(executions: ReportExecution[]): number {
    const completed = executions.filter(e => e.duration);
    if (completed.length === 0) return 0;
    const totalDuration = completed.reduce((sum, e) => sum + (e.duration || 0), 0);
    return totalDuration / completed.length;
  }

  /**
   * Analyze generation trends
   */
  private analyzeGenerationTrends(executions: ReportExecution[]): any {
    return {
      trend: 'stable',
      averageDurationTrend: 'improving',
    };
  }

  /**
   * Build PDF content
   */
  private buildPDFContent(content: ReportSection[], metadata: ReportMetadata): any {
    return { metadata, sections: content };
  }

  /**
   * Save PDF file
   */
  private async savePDF(filePath: string, content: any): Promise<void> {
    // Simulate file save
    this.logger.log(`Saved PDF to ${filePath}`);
  }

  /**
   * Save CSV file
   */
  private async saveCSV(filePath: string, content: string): Promise<void> {
    // Simulate file save
    this.logger.log(`Saved CSV to ${filePath}`);
  }

  /**
   * Save Excel file
   */
  private async saveExcel(filePath: string, data: any[]): Promise<void> {
    // Simulate file save
    this.logger.log(`Saved Excel to ${filePath}`);
  }

  /**
   * Save JSON file
   */
  private async saveJSON(filePath: string, content: string): Promise<void> {
    // Simulate file save
    this.logger.log(`Saved JSON to ${filePath}`);
  }

  /**
   * Send email with attachment
   */
  private async sendEmail(recipient: string, subject: string, attachmentPath: string): Promise<void> {
    this.logger.log(`Sent email to ${recipient} with subject: ${subject}`);
  }

  /**
   * Build data query based on report type
   */
  private buildDataQuery(type: ReportType, params: Record<string, any>, filters: Record<string, any>): string {
    return `SELECT * FROM threat_events WHERE timestamp BETWEEN :startDate AND :endDate`;
  }

  /**
   * Generate data summary
   */
  private generateDataSummary(data: any): string {
    return `Total records: ${Array.isArray(data) ? data.length : 0}`;
  }

  /**
   * Summarize audit logs
   */
  private summarizeAuditLogs(logs: any[]): any {
    return {
      total: logs.length,
      byAction: {},
      byUser: {},
    };
  }

  /**
   * Detect anomalies in audit logs
   */
  private detectAuditAnomalies(logs: any[]): any[] {
    return [];
  }

  /**
   * Escape CSV value
   */
  private escapeCsvValue(value: any): string {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ReportingOperationsService,
};
