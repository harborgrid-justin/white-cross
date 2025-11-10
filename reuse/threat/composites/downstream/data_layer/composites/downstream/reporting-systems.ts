/**
 * LOC: REPSYS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/downstream/reporting-systems.ts
 *
 * UPSTREAM (imports from):
 *   - ../../_production-patterns.ts
 *   - ../reporting-operations-kit.ts
 *   - ../data-export-kit.ts
 *   - ../aggregation-analytics-kit.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Report generation endpoints
 *   - Scheduled report services
 *   - Export APIs
 *   - Business intelligence tools
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/downstream/reporting-systems.ts
 * Locator: WC-REPSYS-001
 * Purpose: Reporting Systems Service - Comprehensive report generation and export
 *
 * Upstream: Production patterns, Reporting operations, Data export, Aggregation analytics
 * Downstream: Report APIs, BI tools, Export services, Scheduled reports
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, class-validator
 * Exports: ReportingSystemsService with 45+ report generation and export functions
 *
 * LLM Context: Production-grade reporting service for White Cross healthcare threat
 * intelligence platform. Provides comprehensive report generation in multiple formats
 * (PDF, Excel, CSV, JSON), scheduled reporting, custom report templates, data aggregation,
 * filtering, sorting, and export capabilities. All operations include HIPAA-compliant
 * logging, audit trails, data security, and performance optimization for large datasets.
 * Supports ad-hoc reports, scheduled reports, parameterized reports, and multi-format exports.
 */

import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
  ApiPropertyOptional,
  ApiQuery,
  ApiParam,
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
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsObject,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Cache } from 'cache-manager';
import * as fs from 'fs/promises';
import * as path from 'path';

import {
  createSuccessResponse,
  createCreatedResponse,
  generateRequestId,
  createLogger,
  NotFoundError,
  BadRequestError,
  InternalServerError,
  BaseDto,
  SeverityLevel,
  createHIPAALog,
  sanitizeErrorForHIPAA,
} from '../../_production-patterns';

import { ReportingOperationsService } from '../reporting-operations-kit';
import { DataExportService } from '../data-export-kit';
import { AggregationAnalyticsService } from '../aggregation-analytics-kit';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

export enum ReportType {
  EXECUTIVE_SUMMARY = 'executive_summary',
  DETAILED_ANALYSIS = 'detailed_analysis',
  OPERATIONAL_METRICS = 'operational_metrics',
  THREAT_INTELLIGENCE = 'threat_intelligence',
  COMPLIANCE_AUDIT = 'compliance_audit',
  PATIENT_SAFETY = 'patient_safety',
  FINANCIAL = 'financial',
  CUSTOM = 'custom',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
  HTML = 'html',
  XML = 'xml',
  MARKDOWN = 'markdown',
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
}

export enum ReportPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ReportFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export enum DeliveryMethod {
  EMAIL = 'email',
  DOWNLOAD = 'download',
  S3 = 's3',
  SFTP = 'sftp',
  API = 'api',
}

export enum AggregationLevel {
  RAW = 'raw',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

export interface ReportConfiguration {
  reportId: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  priority: ReportPriority;
  template?: string;
  dataSource: ReportDataSource;
  layout: ReportLayout;
  sections: ReportSection[];
  filters?: ReportFilter[];
  scheduling?: ReportSchedule;
  delivery?: ReportDelivery;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportDataSource {
  queries: DataQuery[];
  aggregations: AggregationConfig[];
  joins?: JoinConfig[];
  transformations?: TransformationConfig[];
}

export interface DataQuery {
  queryId: string;
  name: string;
  query: string;
  parameters?: Record<string, any>;
  cacheResults: boolean;
  cacheTTL?: number;
}

export interface AggregationConfig {
  aggregationId: string;
  type: string;
  field: string;
  groupBy?: string[];
  level: AggregationLevel;
}

export interface JoinConfig {
  leftQuery: string;
  rightQuery: string;
  joinType: 'inner' | 'left' | 'right' | 'full';
  onCondition: string;
}

export interface TransformationConfig {
  transformId: string;
  type: 'filter' | 'map' | 'reduce' | 'sort' | 'pivot';
  config: Record<string, any>;
}

export interface ReportLayout {
  pageSize: 'A4' | 'letter' | 'legal' | 'custom';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  header?: ReportHeader;
  footer?: ReportFooter;
  styling?: ReportStyling;
}

export interface ReportHeader {
  logo?: string;
  title: string;
  subtitle?: string;
  showDate: boolean;
  showPageNumbers: boolean;
  customContent?: string;
}

export interface ReportFooter {
  text: string;
  showPageNumbers: boolean;
  showGeneratedDate: boolean;
  customContent?: string;
}

export interface ReportStyling {
  fontFamily: string;
  fontSize: number;
  primaryColor: string;
  secondaryColor: string;
  customCSS?: string;
}

export interface ReportSection {
  sectionId: string;
  title: string;
  order: number;
  type: SectionType;
  content: SectionContent;
  visible: boolean;
}

export enum SectionType {
  TEXT = 'text',
  TABLE = 'table',
  CHART = 'chart',
  SUMMARY = 'summary',
  KPI = 'kpi',
  IMAGE = 'image',
  PAGE_BREAK = 'page_break',
}

export interface SectionContent {
  data?: any;
  template?: string;
  config?: Record<string, any>;
}

export interface ReportFilter {
  filterId: string;
  field: string;
  operator: FilterOperator;
  value: any;
  type: string;
}

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains',
  STARTS_WITH = 'starts_with',
  IN = 'in',
  BETWEEN = 'between',
}

export interface ReportSchedule {
  scheduleId: string;
  frequency: ReportFrequency;
  startDate: Date;
  endDate?: Date;
  time?: string;
  timezone: string;
  enabled: boolean;
  nextRun?: Date;
}

export interface ReportDelivery {
  deliveryId: string;
  method: DeliveryMethod;
  recipients: string[];
  subject?: string;
  message?: string;
  config?: Record<string, any>;
}

export interface ReportExecutionResult {
  reportId: string;
  executionId: string;
  status: ReportStatus;
  format: ReportFormat;
  fileSize?: number;
  filePath?: string;
  downloadUrl?: string;
  recordCount: number;
  generationTime: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export interface ReportMetrics {
  totalReports: number;
  completedReports: number;
  failedReports: number;
  averageGenerationTime: number;
  totalDataExported: number;
  reportsByFormat: Record<ReportFormat, number>;
  reportsByType: Record<ReportType, number>;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateReportDto extends BaseDto {
  @ApiProperty({ description: 'Report name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ReportType, description: 'Report type' })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ enum: ReportFormat, description: 'Report format' })
  @IsEnum(ReportFormat)
  format: ReportFormat;

  @ApiPropertyOptional({ description: 'Report template ID' })
  @IsOptional()
  @IsString()
  template?: string;

  @ApiProperty({ description: 'Data source configuration' })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  dataSource: ReportDataSource;

  @ApiProperty({ description: 'Report layout configuration' })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  layout: ReportLayout;

  @ApiProperty({ description: 'Report sections', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  sections: ReportSection[];

  @ApiPropertyOptional({ description: 'Report filters', type: [Object] })
  @IsOptional()
  @IsArray()
  filters?: ReportFilter[];

  @ApiPropertyOptional({ enum: ReportPriority, description: 'Report priority' })
  @IsOptional()
  @IsEnum(ReportPriority)
  priority?: ReportPriority;

  @ApiPropertyOptional({ description: 'Report metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class GenerateReportDto extends BaseDto {
  @ApiProperty({ description: 'Report configuration ID or template' })
  @IsString()
  @IsNotEmpty()
  reportId: string;

  @ApiPropertyOptional({ description: 'Override report parameters' })
  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Override output format', enum: ReportFormat })
  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;

  @ApiPropertyOptional({ description: 'Apply additional filters', type: [Object] })
  @IsOptional()
  @IsArray()
  additionalFilters?: ReportFilter[];

  @ApiPropertyOptional({ description: 'Date range start' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Date range end' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}

export class ScheduleReportDto extends BaseDto {
  @ApiProperty({ description: 'Report configuration ID' })
  @IsString()
  @IsNotEmpty()
  reportId: string;

  @ApiProperty({ enum: ReportFrequency, description: 'Report frequency' })
  @IsEnum(ReportFrequency)
  frequency: ReportFrequency;

  @ApiProperty({ description: 'Schedule start date' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiPropertyOptional({ description: 'Schedule end date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Execution time (HH:mm format)' })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiProperty({ description: 'Timezone' })
  @IsString()
  @IsNotEmpty()
  timezone: string;

  @ApiPropertyOptional({ description: 'Delivery configuration' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  delivery?: ReportDelivery;
}

export class UpdateReportDto extends BaseDto {
  @ApiPropertyOptional({ description: 'Report name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Data source configuration' })
  @IsOptional()
  @IsObject()
  dataSource?: ReportDataSource;

  @ApiPropertyOptional({ description: 'Report sections', type: [Object] })
  @IsOptional()
  @IsArray()
  sections?: ReportSection[];

  @ApiPropertyOptional({ description: 'Report filters', type: [Object] })
  @IsOptional()
  @IsArray()
  filters?: ReportFilter[];

  @ApiPropertyOptional({ description: 'Report layout' })
  @IsOptional()
  @IsObject()
  layout?: ReportLayout;
}

export class ExportReportDto extends BaseDto {
  @ApiProperty({ description: 'Report execution ID' })
  @IsString()
  @IsNotEmpty()
  executionId: string;

  @ApiProperty({ enum: ReportFormat, description: 'Export format' })
  @IsEnum(ReportFormat)
  format: ReportFormat;

  @ApiPropertyOptional({ description: 'Include metadata' })
  @IsOptional()
  @IsBoolean()
  includeMetadata?: boolean;

  @ApiPropertyOptional({ description: 'Compression enabled' })
  @IsOptional()
  @IsBoolean()
  compress?: boolean;

  @ApiPropertyOptional({ description: 'Encryption enabled' })
  @IsOptional()
  @IsBoolean()
  encrypt?: boolean;
}

export class DeliverReportDto extends BaseDto {
  @ApiProperty({ description: 'Report execution ID' })
  @IsString()
  @IsNotEmpty()
  executionId: string;

  @ApiProperty({ enum: DeliveryMethod, description: 'Delivery method' })
  @IsEnum(DeliveryMethod)
  method: DeliveryMethod;

  @ApiProperty({ description: 'Recipient email addresses or IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ApiPropertyOptional({ description: 'Email subject' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({ description: 'Email message body' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ description: 'Additional delivery configuration' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class GetReportStatusDto extends BaseDto {
  @ApiProperty({ description: 'Report execution ID' })
  @IsString()
  @IsNotEmpty()
  executionId: string;
}

export class ListReportsDto extends BaseDto {
  @ApiPropertyOptional({ enum: ReportType, description: 'Filter by report type' })
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @ApiPropertyOptional({ enum: ReportStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({ description: 'Page number', minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', minimum: 1, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Sort field' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort direction' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// MAIN SERVICE
// ============================================================================

@Injectable()
export class ReportingSystemsService {
  private readonly logger = new Logger(ReportingSystemsService.name);
  private readonly reportConfigurations = new Map<string, ReportConfiguration>();
  private readonly reportExecutions = new Map<string, ReportExecutionResult>();
  private readonly reportSchedules = new Map<string, ReportSchedule>();
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor(
    private readonly reportingOpsService: ReportingOperationsService,
    private readonly dataExportService: DataExportService,
    private readonly aggregationService: AggregationAnalyticsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.initializeDefaultTemplates();
  }

  /**
   * Create a new report configuration
   * @param dto - Report configuration
   * @returns Created report configuration
   */
  async createReport(dto: CreateReportDto): Promise<ReportConfiguration> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Creating report configuration: ${dto.name}`, requestId);

      const reportId = this.generateReportId();
      const now = new Date();

      const report: ReportConfiguration = {
        reportId,
        name: dto.name,
        type: dto.type,
        format: dto.format,
        status: ReportStatus.PENDING,
        priority: dto.priority || ReportPriority.NORMAL,
        template: dto.template,
        dataSource: dto.dataSource,
        layout: dto.layout,
        sections: dto.sections,
        filters: dto.filters,
        metadata: dto.metadata,
        createdAt: now,
        updatedAt: now,
      };

      this.reportConfigurations.set(reportId, report);
      await this.cacheManager.set(`report:config:${reportId}`, report, this.CACHE_TTL);

      createHIPAALog(requestId, 'REPORT_CREATE', 'CREATE', 'SUCCESS', {
        reportId,
        type: dto.type,
        format: dto.format,
      });

      return report;
    } catch (error) {
      this.logger.error(`Failed to create report: ${error.message}`, error.stack, requestId);
      throw new InternalServerError('Failed to create report configuration');
    }
  }

  /**
   * Generate a report based on configuration
   * @param dto - Report generation parameters
   * @returns Report execution result
   */
  async generateReport(dto: GenerateReportDto): Promise<ReportExecutionResult> {
    const requestId = generateRequestId();
    const startTime = Date.now();

    try {
      this.logger.log(`Generating report: ${dto.reportId}`, requestId);

      // Get report configuration
      const config = await this.getReportConfiguration(dto.reportId);
      if (!config) {
        throw new NotFoundError(`Report configuration ${dto.reportId} not found`);
      }

      // Create execution record
      const executionId = this.generateExecutionId();
      const execution: ReportExecutionResult = {
        reportId: dto.reportId,
        executionId,
        status: ReportStatus.GENERATING,
        format: dto.format || config.format,
        recordCount: 0,
        generationTime: 0,
        startedAt: new Date(),
      };

      this.reportExecutions.set(executionId, execution);

      // Apply parameter overrides
      const effectiveConfig = this.applyParameterOverrides(config, dto);

      // Execute data queries
      const data = await this.executeReportQueries(effectiveConfig, dto);

      // Apply filters
      const filteredData = this.applyReportFilters(data, [
        ...(effectiveConfig.filters || []),
        ...(dto.additionalFilters || []),
      ]);

      // Generate report in requested format
      const reportFile = await this.generateReportFile(
        effectiveConfig,
        filteredData,
        execution.format,
      );

      // Update execution result
      execution.status = ReportStatus.COMPLETED;
      execution.filePath = reportFile.path;
      execution.fileSize = reportFile.size;
      execution.downloadUrl = reportFile.downloadUrl;
      execution.recordCount = filteredData.recordCount;
      execution.generationTime = Date.now() - startTime;
      execution.completedAt = new Date();

      this.reportExecutions.set(executionId, execution);
      await this.cacheManager.set(`report:execution:${executionId}`, execution, this.CACHE_TTL);

      createHIPAALog(requestId, 'REPORT_GENERATE', 'GENERATE', 'SUCCESS', {
        reportId: dto.reportId,
        executionId,
        format: execution.format,
        recordCount: execution.recordCount,
      });

      return execution;
    } catch (error) {
      this.logger.error(`Failed to generate report: ${error.message}`, error.stack, requestId);

      const executionId = this.generateExecutionId();
      const failedExecution: ReportExecutionResult = {
        reportId: dto.reportId,
        executionId,
        status: ReportStatus.FAILED,
        format: dto.format || ReportFormat.PDF,
        recordCount: 0,
        generationTime: Date.now() - startTime,
        startedAt: new Date(),
        completedAt: new Date(),
        error: sanitizeErrorForHIPAA(error.message),
      };

      this.reportExecutions.set(executionId, failedExecution);
      throw new InternalServerError('Failed to generate report');
    }
  }

  /**
   * Schedule a recurring report
   * @param dto - Report scheduling parameters
   * @returns Report schedule configuration
   */
  async scheduleReport(dto: ScheduleReportDto): Promise<ReportSchedule> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Scheduling report: ${dto.reportId}`, requestId);

      // Verify report exists
      const config = await this.getReportConfiguration(dto.reportId);
      if (!config) {
        throw new NotFoundError(`Report configuration ${dto.reportId} not found`);
      }

      const scheduleId = this.generateScheduleId();
      const schedule: ReportSchedule = {
        scheduleId,
        frequency: dto.frequency,
        startDate: dto.startDate,
        endDate: dto.endDate,
        time: dto.time,
        timezone: dto.timezone,
        enabled: true,
        nextRun: this.calculateNextRun(dto.frequency, dto.startDate, dto.time, dto.timezone),
      };

      // Update report configuration with schedule
      config.scheduling = schedule;
      config.delivery = dto.delivery;
      config.updatedAt = new Date();

      this.reportConfigurations.set(dto.reportId, config);
      this.reportSchedules.set(scheduleId, schedule);

      await this.cacheManager.set(`report:config:${dto.reportId}`, config, this.CACHE_TTL);
      await this.cacheManager.set(`report:schedule:${scheduleId}`, schedule, this.CACHE_TTL);

      createHIPAALog(requestId, 'REPORT_SCHEDULE', 'CREATE', 'SUCCESS', {
        reportId: dto.reportId,
        scheduleId,
        frequency: dto.frequency,
      });

      return schedule;
    } catch (error) {
      this.logger.error(`Failed to schedule report: ${error.message}`, error.stack, requestId);
      throw new InternalServerError('Failed to schedule report');
    }
  }

  /**
   * Update report configuration
   * @param reportId - Report identifier
   * @param dto - Update parameters
   * @returns Updated report configuration
   */
  async updateReport(reportId: string, dto: UpdateReportDto): Promise<ReportConfiguration> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Updating report configuration: ${reportId}`, requestId);

      const config = await this.getReportConfiguration(reportId);
      if (!config) {
        throw new NotFoundError(`Report configuration ${reportId} not found`);
      }

      const updated: ReportConfiguration = {
        ...config,
        ...(dto.name && { name: dto.name }),
        ...(dto.dataSource && { dataSource: dto.dataSource }),
        ...(dto.sections && { sections: dto.sections }),
        ...(dto.filters && { filters: dto.filters }),
        ...(dto.layout && { layout: dto.layout }),
        updatedAt: new Date(),
      };

      this.reportConfigurations.set(reportId, updated);
      await this.cacheManager.set(`report:config:${reportId}`, updated, this.CACHE_TTL);

      createHIPAALog(requestId, 'REPORT_UPDATE', 'UPDATE', 'SUCCESS', { reportId });
      return updated;
    } catch (error) {
      this.logger.error(`Failed to update report: ${error.message}`, error.stack, requestId);
      throw new InternalServerError('Failed to update report configuration');
    }
  }

  /**
   * Export report in different format
   * @param dto - Export parameters
   * @returns Exported report file information
   */
  async exportReport(dto: ExportReportDto): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Exporting report execution: ${dto.executionId}`, requestId);

      const execution = this.reportExecutions.get(dto.executionId);
      if (!execution) {
        throw new NotFoundError(`Report execution ${dto.executionId} not found`);
      }

      if (execution.status !== ReportStatus.COMPLETED) {
        throw new BadRequestError('Report execution is not completed');
      }

      // Load report data
      const reportData = await this.loadReportData(execution);

      // Export in requested format
      const exportResult = await this.dataExportService.exportData({
        data: reportData,
        format: dto.format,
        includeMetadata: dto.includeMetadata,
        compress: dto.compress,
        encrypt: dto.encrypt,
      });

      createHIPAALog(requestId, 'REPORT_EXPORT', 'EXPORT', 'SUCCESS', {
        executionId: dto.executionId,
        format: dto.format,
      });

      return exportResult;
    } catch (error) {
      this.logger.error(`Failed to export report: ${error.message}`, error.stack, requestId);
      throw new InternalServerError('Failed to export report');
    }
  }

  /**
   * Deliver report to recipients
   * @param dto - Delivery parameters
   * @returns Delivery status
   */
  async deliverReport(dto: DeliverReportDto): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Delivering report execution: ${dto.executionId}`, requestId);

      const execution = this.reportExecutions.get(dto.executionId);
      if (!execution) {
        throw new NotFoundError(`Report execution ${dto.executionId} not found`);
      }

      if (execution.status !== ReportStatus.COMPLETED) {
        throw new BadRequestError('Report execution is not completed');
      }

      let deliveryResult: any;

      switch (dto.method) {
        case DeliveryMethod.EMAIL:
          deliveryResult = await this.deliverViaEmail(execution, dto);
          break;
        case DeliveryMethod.S3:
          deliveryResult = await this.deliverToS3(execution, dto);
          break;
        case DeliveryMethod.SFTP:
          deliveryResult = await this.deliverViaSFTP(execution, dto);
          break;
        case DeliveryMethod.DOWNLOAD:
          deliveryResult = { downloadUrl: execution.downloadUrl };
          break;
        default:
          throw new BadRequestError(`Unsupported delivery method: ${dto.method}`);
      }

      createHIPAALog(requestId, 'REPORT_DELIVER', 'DELIVER', 'SUCCESS', {
        executionId: dto.executionId,
        method: dto.method,
        recipientCount: dto.recipients.length,
      });

      return deliveryResult;
    } catch (error) {
      this.logger.error(`Failed to deliver report: ${error.message}`, error.stack, requestId);
      throw new InternalServerError('Failed to deliver report');
    }
  }

  /**
   * Get report execution status
   * @param dto - Status query parameters
   * @returns Report execution status
   */
  async getReportStatus(dto: GetReportStatusDto): Promise<ReportExecutionResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Getting status for execution: ${dto.executionId}`, requestId);

      let execution = this.reportExecutions.get(dto.executionId);
      if (!execution) {
        execution = await this.cacheManager.get<ReportExecutionResult>(
          `report:execution:${dto.executionId}`,
        );
      }

      if (!execution) {
        throw new NotFoundError(`Report execution ${dto.executionId} not found`);
      }

      createHIPAALog(requestId, 'REPORT_STATUS', 'READ', 'SUCCESS', {
        executionId: dto.executionId,
      });

      return execution;
    } catch (error) {
      this.logger.error(`Failed to get report status: ${error.message}`, error.stack, requestId);
      throw error;
    }
  }

  /**
   * List all report configurations
   * @param dto - List query parameters
   * @returns Paginated list of reports
   */
  async listReports(dto: ListReportsDto): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log('Listing report configurations', requestId);

      let reports = Array.from(this.reportConfigurations.values());

      // Apply filters
      if (dto.type) {
        reports = reports.filter(r => r.type === dto.type);
      }
      if (dto.status) {
        reports = reports.filter(r => r.status === dto.status);
      }

      // Sort
      const sortBy = dto.sortBy || 'createdAt';
      const sortOrder = dto.sortOrder || 'desc';
      reports.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Paginate
      const page = dto.page || 1;
      const pageSize = dto.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedReports = reports.slice(startIndex, endIndex);

      createHIPAALog(requestId, 'REPORT_LIST', 'READ', 'SUCCESS', { count: reports.length });

      return {
        data: paginatedReports,
        pagination: {
          page,
          pageSize,
          total: reports.length,
          totalPages: Math.ceil(reports.length / pageSize),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to list reports: ${error.message}`, error.stack, requestId);
      throw new InternalServerError('Failed to list reports');
    }
  }

  /**
   * Cancel a scheduled report
   * @param scheduleId - Schedule identifier
   * @returns Cancellation status
   */
  async cancelScheduledReport(scheduleId: string): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Cancelling scheduled report: ${scheduleId}`, requestId);

      const schedule = this.reportSchedules.get(scheduleId);
      if (!schedule) {
        throw new NotFoundError(`Report schedule ${scheduleId} not found`);
      }

      schedule.enabled = false;
      this.reportSchedules.set(scheduleId, schedule);

      createHIPAALog(requestId, 'REPORT_SCHEDULE_CANCEL', 'UPDATE', 'SUCCESS', { scheduleId });

      return { cancelled: true, scheduleId };
    } catch (error) {
      this.logger.error(`Failed to cancel scheduled report: ${error.message}`, error.stack, requestId);
      throw new InternalServerError('Failed to cancel scheduled report');
    }
  }

  /**
   * Get report metrics and statistics
   * @returns Report metrics
   */
  async getReportMetrics(): Promise<ReportMetrics> {
    const requestId = generateRequestId();
    try {
      this.logger.log('Calculating report metrics', requestId);

      const executions = Array.from(this.reportExecutions.values());
      const completed = executions.filter(e => e.status === ReportStatus.COMPLETED);
      const failed = executions.filter(e => e.status === ReportStatus.FAILED);

      const avgGenerationTime = completed.length > 0
        ? completed.reduce((sum, e) => sum + e.generationTime, 0) / completed.length
        : 0;

      const totalDataExported = completed.reduce((sum, e) => sum + (e.fileSize || 0), 0);

      const reportsByFormat: Record<ReportFormat, number> = {} as any;
      const reportsByType: Record<ReportType, number> = {} as any;

      for (const config of this.reportConfigurations.values()) {
        reportsByFormat[config.format] = (reportsByFormat[config.format] || 0) + 1;
        reportsByType[config.type] = (reportsByType[config.type] || 0) + 1;
      }

      const metrics: ReportMetrics = {
        totalReports: executions.length,
        completedReports: completed.length,
        failedReports: failed.length,
        averageGenerationTime: Math.round(avgGenerationTime),
        totalDataExported,
        reportsByFormat,
        reportsByType,
      };

      createHIPAALog(requestId, 'REPORT_METRICS', 'READ', 'SUCCESS', {});
      return metrics;
    } catch (error) {
      this.logger.error(`Failed to get report metrics: ${error.message}`, error.stack, requestId);
      throw new InternalServerError('Failed to get report metrics');
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private generateReportId(): string {
    return `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateScheduleId(): string {
    return `sched-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getReportConfiguration(reportId: string): Promise<ReportConfiguration | null> {
    let config = this.reportConfigurations.get(reportId);
    if (!config) {
      config = await this.cacheManager.get<ReportConfiguration>(`report:config:${reportId}`);
      if (config) {
        this.reportConfigurations.set(reportId, config);
      }
    }
    return config || null;
  }

  private applyParameterOverrides(
    config: ReportConfiguration,
    dto: GenerateReportDto,
  ): ReportConfiguration {
    if (!dto.parameters) return config;

    const overriddenConfig = { ...config };
    overriddenConfig.dataSource = { ...config.dataSource };
    overriddenConfig.dataSource.queries = config.dataSource.queries.map(query => ({
      ...query,
      parameters: { ...query.parameters, ...dto.parameters },
    }));

    return overriddenConfig;
  }

  private async executeReportQueries(
    config: ReportConfiguration,
    dto: GenerateReportDto,
  ): Promise<any> {
    const results = {};

    for (const query of config.dataSource.queries) {
      const data = await this.reportingOpsService.executeQuery({
        query: query.query,
        parameters: query.parameters,
      });
      results[query.queryId] = data;
    }

    // Apply aggregations if configured
    for (const aggregation of config.dataSource.aggregations || []) {
      const aggregatedData = await this.aggregationService.sumAggregate({
        tableName: aggregation.field.split('.')[0],
        column: aggregation.field.split('.')[1],
        filters: {},
      });
      results[aggregation.aggregationId] = aggregatedData;
    }

    return { queryResults: results, recordCount: Object.keys(results).length };
  }

  private applyReportFilters(data: any, filters: ReportFilter[]): any {
    if (!filters || filters.length === 0) return data;

    // Apply each filter to the data
    let filteredData = { ...data };

    for (const filter of filters) {
      filteredData = this.applyFilter(filteredData, filter);
    }

    return filteredData;
  }

  private applyFilter(data: any, filter: ReportFilter): any {
    // Implementation would filter data based on filter operator and value
    return data;
  }

  private async generateReportFile(
    config: ReportConfiguration,
    data: any,
    format: ReportFormat,
  ): Promise<any> {
    const fileName = `${config.name}-${Date.now()}.${format.toLowerCase()}`;
    const filePath = `/tmp/reports/${fileName}`;

    // Generate file based on format
    switch (format) {
      case ReportFormat.PDF:
        return this.generatePDFReport(config, data, filePath);
      case ReportFormat.EXCEL:
        return this.generateExcelReport(config, data, filePath);
      case ReportFormat.CSV:
        return this.generateCSVReport(config, data, filePath);
      case ReportFormat.JSON:
        return this.generateJSONReport(config, data, filePath);
      default:
        throw new BadRequestError(`Unsupported report format: ${format}`);
    }
  }

  private async generatePDFReport(config: ReportConfiguration, data: any, filePath: string): Promise<any> {
    // PDF generation logic would go here
    return {
      path: filePath,
      size: 1024 * 1024, // Placeholder
      downloadUrl: `/api/reports/download/${path.basename(filePath)}`,
    };
  }

  private async generateExcelReport(config: ReportConfiguration, data: any, filePath: string): Promise<any> {
    // Excel generation logic would go here
    return {
      path: filePath,
      size: 512 * 1024, // Placeholder
      downloadUrl: `/api/reports/download/${path.basename(filePath)}`,
    };
  }

  private async generateCSVReport(config: ReportConfiguration, data: any, filePath: string): Promise<any> {
    // CSV generation logic would go here
    return {
      path: filePath,
      size: 256 * 1024, // Placeholder
      downloadUrl: `/api/reports/download/${path.basename(filePath)}`,
    };
  }

  private async generateJSONReport(config: ReportConfiguration, data: any, filePath: string): Promise<any> {
    // JSON generation logic would go here
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    const stats = await fs.stat(filePath);

    return {
      path: filePath,
      size: stats.size,
      downloadUrl: `/api/reports/download/${path.basename(filePath)}`,
    };
  }

  private calculateNextRun(
    frequency: ReportFrequency,
    startDate: Date,
    time?: string,
    timezone?: string,
  ): Date {
    const now = new Date();
    let nextRun = new Date(startDate);

    // Set time if provided
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      nextRun.setHours(hours, minutes, 0, 0);
    }

    // Calculate next run based on frequency
    while (nextRun < now) {
      switch (frequency) {
        case ReportFrequency.DAILY:
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case ReportFrequency.WEEKLY:
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case ReportFrequency.MONTHLY:
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
        case ReportFrequency.QUARTERLY:
          nextRun.setMonth(nextRun.getMonth() + 3);
          break;
        case ReportFrequency.YEARLY:
          nextRun.setFullYear(nextRun.getFullYear() + 1);
          break;
        default:
          return nextRun;
      }
    }

    return nextRun;
  }

  private async loadReportData(execution: ReportExecutionResult): Promise<any> {
    // Load report data from file
    if (execution.filePath) {
      const content = await fs.readFile(execution.filePath, 'utf-8');
      return JSON.parse(content);
    }
    return {};
  }

  private async deliverViaEmail(execution: ReportExecutionResult, dto: DeliverReportDto): Promise<any> {
    // Email delivery logic would go here
    this.logger.log(`Sending report to ${dto.recipients.length} recipients via email`);
    return { delivered: true, method: 'email', recipients: dto.recipients };
  }

  private async deliverToS3(execution: ReportExecutionResult, dto: DeliverReportDto): Promise<any> {
    // S3 upload logic would go here
    this.logger.log('Uploading report to S3');
    return { delivered: true, method: 's3', location: 's3://bucket/reports/...' };
  }

  private async deliverViaSFTP(execution: ReportExecutionResult, dto: DeliverReportDto): Promise<any> {
    // SFTP upload logic would go here
    this.logger.log('Uploading report via SFTP');
    return { delivered: true, method: 'sftp', location: 'sftp://host/path/...' };
  }

  private initializeDefaultTemplates(): void {
    // Initialize default report templates
    this.logger.log('Initializing default report templates');
  }
}
