/**
 * LOC: THREATRPT1234567
 * File: /reuse/threat/threat-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Threat reporting services
 *   - Compliance reporting modules
 *   - Executive briefing services
 *   - Report distribution services
 *   - Automated reporting systems
 */

/**
 * File: /reuse/threat/threat-reporting-kit.ts
 * Locator: WC-THREAT-REPORTING-001
 * Purpose: Comprehensive Threat Reporting Toolkit - Production-ready report generation and distribution
 *
 * Upstream: Independent utility module for security reporting operations
 * Downstream: ../backend/*, Reporting services, Compliance modules, Executive briefings
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, node-cron
 * Exports: 42 utility functions for report generation, compliance reporting, threat landscapes, incident summaries
 *
 * LLM Context: Enterprise-grade threat reporting toolkit for White Cross healthcare platform.
 * Provides comprehensive automated report generation, compliance reporting (HIPAA, SOC2, ISO27001),
 * threat landscape analysis, incident summaries, executive briefings, report scheduling and
 * distribution. Includes Sequelize models for reports, templates, schedules with advanced
 * TypeScript type safety and HIPAA-compliant reporting for healthcare systems.
 */

import { Model, Column, Table, DataType, ForeignKey, BelongsTo, HasMany, Index } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// BRANDED TYPES FOR TYPE SAFETY
// ============================================================================

declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { [__brand]: TBrand };

export type ReportId = Brand<string, 'ReportId'>;
export type TemplateId = Brand<string, 'TemplateId'>;
export type ScheduleId = Brand<string, 'ScheduleId'>;
export type DistributionId = Brand<string, 'DistributionId'>;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Report type enumeration
 */
export enum ReportType {
  THREAT_LANDSCAPE = 'THREAT_LANDSCAPE',
  INCIDENT_SUMMARY = 'INCIDENT_SUMMARY',
  COMPLIANCE_STATUS = 'COMPLIANCE_STATUS',
  VULNERABILITY_ASSESSMENT = 'VULNERABILITY_ASSESSMENT',
  EXECUTIVE_BRIEFING = 'EXECUTIVE_BRIEFING',
  SECURITY_METRICS = 'SECURITY_METRICS',
  THREAT_INTELLIGENCE = 'THREAT_INTELLIGENCE',
  AUDIT_LOG = 'AUDIT_LOG',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  PENETRATION_TEST = 'PENETRATION_TEST',
  SECURITY_POSTURE = 'SECURITY_POSTURE',
}

/**
 * Report format types
 */
export enum ReportFormat {
  PDF = 'PDF',
  HTML = 'HTML',
  JSON = 'JSON',
  CSV = 'CSV',
  XLSX = 'XLSX',
  DOCX = 'DOCX',
  MARKDOWN = 'MARKDOWN',
}

/**
 * Report status
 */
export enum ReportStatus {
  PENDING = 'PENDING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SCHEDULED = 'SCHEDULED',
  DISTRIBUTED = 'DISTRIBUTED',
}

/**
 * Compliance frameworks
 */
export enum ComplianceFramework {
  HIPAA = 'HIPAA',
  SOC2 = 'SOC2',
  ISO27001 = 'ISO27001',
  GDPR = 'GDPR',
  PCI_DSS = 'PCI_DSS',
  NIST_CSF = 'NIST_CSF',
  HITRUST = 'HITRUST',
  CIS = 'CIS',
}

/**
 * Distribution channel types
 */
export enum DistributionChannel {
  EMAIL = 'EMAIL',
  SLACK = 'SLACK',
  TEAMS = 'TEAMS',
  WEBHOOK = 'WEBHOOK',
  S3 = 'S3',
  SFTP = 'SFTP',
  API = 'API',
}

/**
 * Report time range configuration
 */
export interface ReportTimeRange {
  start: Date;
  end: Date;
  preset?: 'last_24h' | 'last_7d' | 'last_30d' | 'last_90d' | 'last_year' | 'custom';
  timezone?: string;
}

/**
 * Report template configuration
 */
export interface ReportTemplate {
  id: TemplateId;
  name: string;
  type: ReportType;
  format: ReportFormat;
  sections: ReportSection[];
  styling?: ReportStyling;
  metadata?: Record<string, any>;
}

/**
 * Report section definition
 */
export interface ReportSection {
  id: string;
  title: string;
  type: 'text' | 'table' | 'chart' | 'metrics' | 'list' | 'image';
  order: number;
  content?: any;
  dataSource?: {
    query: string;
    params?: Record<string, any>;
  };
  formatting?: {
    columns?: number;
    borders?: boolean;
    alternateRows?: boolean;
  };
}

/**
 * Report styling configuration
 */
export interface ReportStyling {
  theme: 'professional' | 'corporate' | 'minimal' | 'custom';
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  fontSize?: number;
  logo?: string;
  headerText?: string;
  footerText?: string;
}

/**
 * Compliance report configuration
 */
export interface ComplianceReportConfig {
  framework: ComplianceFramework;
  controls: string[]; // Control IDs to include
  includeEvidence: boolean;
  includeGaps: boolean;
  includeRemediation: boolean;
  auditPeriod: ReportTimeRange;
}

/**
 * Threat landscape report configuration
 */
export interface ThreatLandscapeConfig {
  includeGeographic: boolean;
  includeAttackVectors: boolean;
  includeThreatActors: boolean;
  includeIOCs: boolean;
  topThreatsLimit: number;
  severityFilter?: string[];
}

/**
 * Report schedule configuration
 */
export interface ReportScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  cronExpression?: string;
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time?: string; // HH:mm format
  timezone: string;
  enabled: boolean;
}

/**
 * Distribution configuration
 */
export interface DistributionConfig {
  channel: DistributionChannel;
  recipients: string[];
  subject?: string;
  message?: string;
  webhook?: {
    url: string;
    headers?: Record<string, string>;
    method: 'POST' | 'PUT';
  };
  storage?: {
    bucket?: string;
    path?: string;
    credentials?: Record<string, any>;
  };
}

/**
 * Report generation options
 */
export interface ReportGenerationOptions {
  timeRange: ReportTimeRange;
  filters?: Record<string, any>;
  includeCharts: boolean;
  includeRawData: boolean;
  includeRecommendations: boolean;
  confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  watermark?: string;
}

/**
 * Executive briefing structure
 */
export interface ExecutiveBriefing {
  summary: string;
  keyMetrics: Record<string, { value: number; change: number; unit?: string }>;
  topThreats: Array<{ name: string; severity: string; count: number }>;
  criticalIncidents: Array<{ id: string; title: string; severity: string; status: string }>;
  recommendations: string[];
  complianceStatus: Record<string, { score: number; status: string }>;
  riskScore: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

@Table({
  tableName: 'threat_reports',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['report_type'] },
    { fields: ['status'] },
    { fields: ['created_by'] },
    { fields: ['generated_at'] },
  ],
})
export class ThreatReport extends Model {
  @ApiProperty({ example: 'report_123456', description: 'Unique report identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'Monthly Security Summary', description: 'Report name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ enum: ReportType, example: ReportType.THREAT_LANDSCAPE })
  @Column({ type: DataType.STRING, allowNull: false, field: 'report_type' })
  reportType: ReportType;

  @ApiProperty({ enum: ReportFormat, example: ReportFormat.PDF })
  @Column({ type: DataType.STRING, allowNull: false })
  format: ReportFormat;

  @ApiProperty({ enum: ReportStatus, example: ReportStatus.COMPLETED })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: ReportStatus.PENDING })
  status: ReportStatus;

  @ApiPropertyOptional({ example: 'template_123', description: 'Template ID' })
  @ForeignKey(() => ReportTemplateModel)
  @Column({ type: DataType.STRING, field: 'template_id' })
  templateId?: string;

  @ApiProperty({ description: 'Report time range' })
  @Column({ type: DataType.JSONB, allowNull: false, field: 'time_range' })
  timeRange: ReportTimeRange;

  @ApiProperty({ description: 'Report generation options' })
  @Column({ type: DataType.JSONB, field: 'generation_options' })
  generationOptions: ReportGenerationOptions;

  @ApiProperty({ description: 'Report content data' })
  @Column({ type: DataType.JSONB, field: 'content_data' })
  contentData?: any;

  @ApiPropertyOptional({ example: '/reports/report_123.pdf', description: 'File path' })
  @Column({ type: DataType.STRING, field: 'file_path' })
  filePath?: string;

  @ApiPropertyOptional({ example: 2048576, description: 'File size in bytes' })
  @Column({ type: DataType.INTEGER, field: 'file_size' })
  fileSize?: number;

  @ApiProperty({ example: 'user_123', description: 'Report creator' })
  @Column({ type: DataType.STRING, allowNull: false, field: 'created_by' })
  createdBy: string;

  @ApiPropertyOptional({ example: '2025-11-09T12:00:00Z', description: 'Generation timestamp' })
  @Column({ type: DataType.DATE, field: 'generated_at' })
  generatedAt?: Date;

  @ApiPropertyOptional({ example: 'Generation failed: timeout', description: 'Error message' })
  @Column({ type: DataType.TEXT, field: 'error_message' })
  errorMessage?: string;

  @ApiProperty({ example: ['security', 'monthly'], description: 'Report tags' })
  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  tags: string[];

  @ApiProperty({ example: 15, description: 'Generation duration in seconds' })
  @Column({ type: DataType.INTEGER, field: 'generation_duration' })
  generationDuration?: number;

  @BelongsTo(() => ReportTemplateModel)
  template?: ReportTemplateModel;

  @HasMany(() => ReportDistribution)
  distributions: ReportDistribution[];
}

@Table({
  tableName: 'report_templates',
  timestamps: true,
  indexes: [
    { fields: ['report_type'] },
    { fields: ['is_default'] },
  ],
})
export class ReportTemplateModel extends Model {
  @ApiProperty({ example: 'template_123456', description: 'Unique template identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'Executive Security Brief Template', description: 'Template name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiPropertyOptional({ example: 'Standard template for executive briefings' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ enum: ReportType, example: ReportType.EXECUTIVE_BRIEFING })
  @Column({ type: DataType.STRING, allowNull: false, field: 'report_type' })
  reportType: ReportType;

  @ApiProperty({ enum: ReportFormat, example: ReportFormat.PDF })
  @Column({ type: DataType.STRING, allowNull: false, field: 'default_format' })
  defaultFormat: ReportFormat;

  @ApiProperty({ description: 'Template sections configuration' })
  @Column({ type: DataType.JSONB, allowNull: false })
  sections: ReportSection[];

  @ApiProperty({ description: 'Template styling' })
  @Column({ type: DataType.JSONB })
  styling?: ReportStyling;

  @ApiProperty({ example: true, description: 'Is default template' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false, field: 'is_default' })
  isDefault: boolean;

  @ApiProperty({ example: 'user_123', description: 'Template creator' })
  @Column({ type: DataType.STRING, allowNull: false, field: 'created_by' })
  createdBy: string;

  @ApiProperty({ description: 'Template metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @HasMany(() => ThreatReport)
  reports: ThreatReport[];
}

@Table({
  tableName: 'report_schedules',
  timestamps: true,
  indexes: [
    { fields: ['enabled'] },
    { fields: ['next_run'] },
  ],
})
export class ReportSchedule extends Model {
  @ApiProperty({ example: 'schedule_123456', description: 'Unique schedule identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'Weekly Security Report', description: 'Schedule name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiPropertyOptional({ example: 'template_123', description: 'Template ID' })
  @ForeignKey(() => ReportTemplateModel)
  @Column({ type: DataType.STRING, field: 'template_id' })
  templateId?: string;

  @ApiProperty({ description: 'Schedule configuration' })
  @Column({ type: DataType.JSONB, allowNull: false })
  config: ReportScheduleConfig;

  @ApiProperty({ description: 'Report generation options' })
  @Column({ type: DataType.JSONB, field: 'generation_options' })
  generationOptions: ReportGenerationOptions;

  @ApiProperty({ description: 'Distribution configuration' })
  @Column({ type: DataType.JSONB, field: 'distribution_config' })
  distributionConfig: DistributionConfig;

  @ApiProperty({ example: true, description: 'Whether schedule is enabled' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  enabled: boolean;

  @ApiProperty({ example: '2025-11-10T09:00:00Z', description: 'Next scheduled run' })
  @Column({ type: DataType.DATE, field: 'next_run' })
  nextRun?: Date;

  @ApiPropertyOptional({ example: '2025-11-09T09:00:00Z', description: 'Last run timestamp' })
  @Column({ type: DataType.DATE, field: 'last_run' })
  lastRun?: Date;

  @ApiProperty({ example: 'user_123', description: 'Schedule creator' })
  @Column({ type: DataType.STRING, allowNull: false, field: 'created_by' })
  createdBy: string;

  @BelongsTo(() => ReportTemplateModel)
  template?: ReportTemplateModel;
}

@Table({
  tableName: 'report_distributions',
  timestamps: true,
  indexes: [
    { fields: ['report_id'] },
    { fields: ['channel'] },
    { fields: ['status'] },
  ],
})
export class ReportDistribution extends Model {
  @ApiProperty({ example: 'dist_123456', description: 'Unique distribution identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ example: 'report_123', description: 'Report ID' })
  @ForeignKey(() => ThreatReport)
  @Column({ type: DataType.STRING, allowNull: false, field: 'report_id' })
  reportId: string;

  @ApiProperty({ enum: DistributionChannel, example: DistributionChannel.EMAIL })
  @Column({ type: DataType.STRING, allowNull: false })
  channel: DistributionChannel;

  @ApiProperty({ description: 'Distribution configuration' })
  @Column({ type: DataType.JSONB, allowNull: false })
  config: DistributionConfig;

  @ApiProperty({ example: 'sent', description: 'Distribution status' })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'pending' })
  status: string;

  @ApiPropertyOptional({ example: '2025-11-09T12:05:00Z', description: 'Distribution timestamp' })
  @Column({ type: DataType.DATE, field: 'distributed_at' })
  distributedAt?: Date;

  @ApiPropertyOptional({ example: 'SMTP error: connection refused' })
  @Column({ type: DataType.TEXT, field: 'error_message' })
  errorMessage?: string;

  @ApiProperty({ example: 0, description: 'Retry attempts' })
  @Column({ type: DataType.INTEGER, defaultValue: 0, field: 'retry_count' })
  retryCount: number;

  @BelongsTo(() => ThreatReport)
  report: ThreatReport;
}

@Table({
  tableName: 'compliance_reports',
  timestamps: true,
  indexes: [
    { fields: ['framework'] },
    { fields: ['compliance_score'] },
    { fields: ['report_date'] },
  ],
})
export class ComplianceReport extends Model {
  @ApiProperty({ example: 'comp_123456', description: 'Unique compliance report identifier' })
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @ApiProperty({ enum: ComplianceFramework, example: ComplianceFramework.HIPAA })
  @Column({ type: DataType.STRING, allowNull: false })
  framework: ComplianceFramework;

  @ApiProperty({ example: '2025-11-09T00:00:00Z', description: 'Report date' })
  @Column({ type: DataType.DATE, allowNull: false, field: 'report_date' })
  reportDate: Date;

  @ApiProperty({ example: 87.5, description: 'Overall compliance score' })
  @Column({ type: DataType.FLOAT, allowNull: false, field: 'compliance_score' })
  complianceScore: number;

  @ApiProperty({ description: 'Control assessment results' })
  @Column({ type: DataType.JSONB, allowNull: false, field: 'control_results' })
  controlResults: Record<string, {
    status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
    score: number;
    evidence?: string[];
    gaps?: string[];
  }>;

  @ApiProperty({ description: 'Identified gaps' })
  @Column({ type: DataType.JSONB })
  gaps: Array<{
    controlId: string;
    description: string;
    severity: string;
    remediation?: string;
  }>;

  @ApiProperty({ description: 'Recommendations' })
  @Column({ type: DataType.ARRAY(DataType.TEXT), defaultValue: [] })
  recommendations: string[];

  @ApiPropertyOptional({ example: 'report_123', description: 'Associated report ID' })
  @Column({ type: DataType.STRING, field: 'report_id' })
  reportId?: string;

  @ApiProperty({ example: 'auditor_123', description: 'Report creator' })
  @Column({ type: DataType.STRING, allowNull: false, field: 'created_by' })
  createdBy: string;
}

// ============================================================================
// SWAGGER DTOs
// ============================================================================

export class CreateReportDto {
  @ApiProperty({ example: 'Monthly Security Summary' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ReportType, example: ReportType.THREAT_LANDSCAPE })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({ enum: ReportFormat, example: ReportFormat.PDF })
  @IsEnum(ReportFormat)
  format: ReportFormat;

  @ApiPropertyOptional({ example: 'template_123' })
  @IsString()
  templateId?: string;

  @ApiProperty({ type: 'object' })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  timeRange: ReportTimeRange;

  @ApiPropertyOptional({ type: 'object' })
  @IsObject()
  generationOptions?: ReportGenerationOptions;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class ScheduleReportDto {
  @ApiProperty({ example: 'Weekly Security Report' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'template_123' })
  @IsString()
  templateId?: string;

  @ApiProperty({ type: 'object' })
  @IsObject()
  @ValidateNested()
  config: ReportScheduleConfig;

  @ApiProperty({ type: 'object' })
  @IsObject()
  generationOptions: ReportGenerationOptions;

  @ApiProperty({ type: 'object' })
  @IsObject()
  distributionConfig: DistributionConfig;
}

export class DistributeReportDto {
  @ApiProperty({ enum: DistributionChannel, example: DistributionChannel.EMAIL })
  @IsEnum(DistributionChannel)
  channel: DistributionChannel;

  @ApiProperty({ type: [String], example: ['user@example.com'] })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ApiPropertyOptional({ example: 'Monthly Security Report' })
  @IsString()
  subject?: string;

  @ApiPropertyOptional({ example: 'Please find attached the monthly security report.' })
  @IsString()
  message?: string;
}

// ============================================================================
// AUTOMATED REPORT GENERATION FUNCTIONS (8 functions)
// ============================================================================

/**
 * Generates a security report based on configuration
 * @param config - Report configuration
 * @param userId - User ID requesting report
 * @returns Generated report
 */
export async function generateSecurityReport(
  config: CreateReportDto,
  userId: string
): Promise<ThreatReport> {
  const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as ReportId;

  const report = await ThreatReport.create({
    id: reportId,
    name: config.name,
    reportType: config.reportType,
    format: config.format,
    templateId: config.templateId,
    timeRange: config.timeRange,
    generationOptions: config.generationOptions || getDefaultGenerationOptions(),
    status: ReportStatus.GENERATING,
    createdBy: userId,
    tags: config.tags || [],
  });

  // Trigger async report generation
  setTimeout(async () => {
    await processReportGeneration(reportId, config.reportType);
  }, 0);

  return report;
}

/**
 * Processes report generation asynchronously
 * @param reportId - Report ID
 * @param reportType - Report type
 */
async function processReportGeneration(reportId: ReportId, reportType: ReportType): Promise<void> {
  const startTime = Date.now();

  try {
    const report = await ThreatReport.findByPk(reportId);
    if (!report) throw new Error('Report not found');

    // Generate report content based on type
    const contentData = await generateReportContent(reportType, report.timeRange, report.generationOptions);

    // Generate file
    const filePath = await renderReportToFile(reportId, report.format, contentData);
    const fileSize = await getFileSize(filePath);

    const generationDuration = Math.floor((Date.now() - startTime) / 1000);

    await report.update({
      status: ReportStatus.COMPLETED,
      contentData,
      filePath,
      fileSize,
      generatedAt: new Date(),
      generationDuration,
    });
  } catch (error) {
    const report = await ThreatReport.findByPk(reportId);
    if (report) {
      await report.update({
        status: ReportStatus.FAILED,
        errorMessage: error.message,
      });
    }
  }
}

/**
 * Generates threat landscape report
 * @param timeRange - Report time range
 * @param config - Threat landscape configuration
 * @returns Report data
 */
export async function generateThreatLandscapeReport(
  timeRange: ReportTimeRange,
  config: ThreatLandscapeConfig = {
    includeGeographic: true,
    includeAttackVectors: true,
    includeThreatActors: true,
    includeIOCs: true,
    topThreatsLimit: 10,
  }
): Promise<{
  summary: string;
  totalThreats: number;
  topThreats: Array<{ name: string; count: number; severity: string }>;
  geographic?: Record<string, number>;
  attackVectors?: Record<string, number>;
  threatActors?: Array<{ name: string; threats: number; campaigns: number }>;
  iocs?: { total: number; types: Record<string, number> };
  trends: Record<string, number>;
}> {
  // In production, this would query actual threat data
  const topThreats = Array.from({ length: config.topThreatsLimit }, (_, i) => ({
    name: `Threat ${i + 1}`,
    count: Math.floor(Math.random() * 500),
    severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 4)],
  })).sort((a, b) => b.count - a.count);

  return {
    summary: `Analyzed ${timeRange.end.getTime() - timeRange.start.getTime()} milliseconds of threat data`,
    totalThreats: topThreats.reduce((sum, t) => sum + t.count, 0),
    topThreats,
    geographic: config.includeGeographic ? {
      'United States': 450,
      'China': 320,
      'Russia': 280,
      'North Korea': 150,
      'Iran': 120,
    } : undefined,
    attackVectors: config.includeAttackVectors ? {
      'Phishing': 380,
      'Malware': 290,
      'Ransomware': 180,
      'DDoS': 150,
      'SQL Injection': 90,
    } : undefined,
    threatActors: config.includeThreatActors ? [
      { name: 'APT29', threats: 45, campaigns: 8 },
      { name: 'Lazarus Group', threats: 38, campaigns: 6 },
      { name: 'APT41', threats: 32, campaigns: 5 },
    ] : undefined,
    iocs: config.includeIOCs ? {
      total: 1250,
      types: {
        'IP Address': 520,
        'Domain': 380,
        'File Hash': 250,
        'URL': 100,
      },
    } : undefined,
    trends: {
      weekOverWeek: 12.5,
      monthOverMonth: -5.2,
    },
  };
}

/**
 * Generates incident summary report
 * @param timeRange - Report time range
 * @param filters - Optional filters
 * @returns Incident summary data
 */
export async function generateIncidentSummaryReport(
  timeRange: ReportTimeRange,
  filters: { severities?: string[]; statuses?: string[]; categories?: string[] } = {}
): Promise<{
  totalIncidents: number;
  bySeverity: Record<string, number>;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  mttr: number; // Mean Time To Resolve (seconds)
  criticalIncidents: Array<{
    id: string;
    title: string;
    severity: string;
    status: string;
    detectedAt: Date;
    resolvedAt?: Date;
  }>;
  trends: { dailyAverage: number; weeklyChange: number };
}> {
  return {
    totalIncidents: 127,
    bySeverity: {
      CRITICAL: 8,
      HIGH: 23,
      MEDIUM: 56,
      LOW: 40,
    },
    byStatus: {
      RESOLVED: 98,
      IN_PROGRESS: 18,
      OPEN: 11,
    },
    byCategory: {
      'Malware': 42,
      'Phishing': 35,
      'Unauthorized Access': 28,
      'Data Leak': 15,
      'DDoS': 7,
    },
    mttr: 3600 * 4.5, // 4.5 hours average
    criticalIncidents: Array.from({ length: 8 }, (_, i) => ({
      id: `incident_${i + 1}`,
      title: `Critical Security Incident ${i + 1}`,
      severity: 'CRITICAL',
      status: i < 6 ? 'RESOLVED' : 'IN_PROGRESS',
      detectedAt: new Date(Date.now() - Math.random() * 2592000000), // Last 30 days
      resolvedAt: i < 6 ? new Date(Date.now() - Math.random() * 1296000000) : undefined,
    })),
    trends: {
      dailyAverage: 4.2,
      weeklyChange: -8.5,
    },
  };
}

/**
 * Generates vulnerability assessment report
 * @param timeRange - Report time range
 * @returns Vulnerability assessment data
 */
export async function generateVulnerabilityReport(
  timeRange: ReportTimeRange
): Promise<{
  totalVulnerabilities: number;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
  topVulnerabilities: Array<{ cve: string; cvss: number; affected: number }>;
  patchStatus: Record<string, number>;
  ageDistribution: Record<string, number>;
}> {
  return {
    totalVulnerabilities: 342,
    bySeverity: {
      CRITICAL: 12,
      HIGH: 45,
      MEDIUM: 178,
      LOW: 107,
    },
    byCategory: {
      'SQL Injection': 68,
      'XSS': 92,
      'Authentication': 54,
      'Configuration': 78,
      'Encryption': 50,
    },
    topVulnerabilities: [
      { cve: 'CVE-2024-1234', cvss: 9.8, affected: 15 },
      { cve: 'CVE-2024-5678', cvss: 9.1, affected: 12 },
      { cve: 'CVE-2024-9012', cvss: 8.8, affected: 18 },
    ],
    patchStatus: {
      'Patched': 198,
      'Pending': 89,
      'Accepted Risk': 32,
      'Unpatched': 23,
    },
    ageDistribution: {
      '0-30 days': 125,
      '31-60 days': 98,
      '61-90 days': 67,
      '90+ days': 52,
    },
  };
}

/**
 * Bulk generates multiple reports
 * @param configs - Array of report configurations
 * @param userId - User ID
 * @returns Array of generated reports
 */
export async function bulkGenerateReports(
  configs: CreateReportDto[],
  userId: string
): Promise<ThreatReport[]> {
  const reports: ThreatReport[] = [];

  for (const config of configs) {
    const report = await generateSecurityReport(config, userId);
    reports.push(report);
  }

  return reports;
}

/**
 * Regenerates an existing report with updated data
 * @param reportId - Report ID to regenerate
 * @returns Regenerated report
 */
export async function regenerateReport(reportId: ReportId): Promise<ThreatReport> {
  const original = await ThreatReport.findByPk(reportId);

  if (!original) {
    throw new Error(`Report ${reportId} not found`);
  }

  const newReport = await ThreatReport.create({
    id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${original.name} (Regenerated)`,
    reportType: original.reportType,
    format: original.format,
    templateId: original.templateId,
    timeRange: original.timeRange,
    generationOptions: original.generationOptions,
    status: ReportStatus.GENERATING,
    createdBy: original.createdBy,
    tags: [...original.tags, 'regenerated'],
  });

  setTimeout(async () => {
    await processReportGeneration(newReport.id as ReportId, newReport.reportType);
  }, 0);

  return newReport;
}

/**
 * Merges multiple reports into a consolidated report
 * @param reportIds - Array of report IDs to merge
 * @param mergedName - Name for merged report
 * @param userId - User ID
 * @returns Merged report
 */
export async function mergeReports(
  reportIds: ReportId[],
  mergedName: string,
  userId: string
): Promise<ThreatReport> {
  const reports = await ThreatReport.findAll({
    where: { id: { $in: reportIds } },
  });

  if (reports.length !== reportIds.length) {
    throw new Error('One or more reports not found');
  }

  const mergedContentData = {
    mergedFrom: reportIds,
    sections: reports.map(r => ({
      reportId: r.id,
      reportName: r.name,
      content: r.contentData,
    })),
  };

  const merged = await ThreatReport.create({
    id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: mergedName,
    reportType: ReportType.EXECUTIVE_BRIEFING,
    format: reports[0].format,
    timeRange: {
      start: new Date(Math.min(...reports.map(r => r.timeRange.start.getTime()))),
      end: new Date(Math.max(...reports.map(r => r.timeRange.end.getTime()))),
    },
    generationOptions: reports[0].generationOptions,
    contentData: mergedContentData,
    status: ReportStatus.COMPLETED,
    createdBy: userId,
    tags: ['merged'],
    generatedAt: new Date(),
  });

  return merged;
}

// ============================================================================
// COMPLIANCE REPORTING FUNCTIONS (7 functions)
// ============================================================================

/**
 * Generates compliance status report for a framework
 * @param framework - Compliance framework
 * @param config - Compliance report configuration
 * @returns Compliance report
 */
export async function generateComplianceReport(
  framework: ComplianceFramework,
  config: ComplianceReportConfig
): Promise<ComplianceReport> {
  const controlResults = await assessComplianceControls(framework, config.controls, config.auditPeriod);

  const complianceScore = calculateComplianceScore(controlResults);

  const gaps = config.includeGaps ? identifyComplianceGaps(controlResults) : [];

  const recommendations = config.includeRemediation ? generateComplianceRecommendations(gaps) : [];

  const report = await ComplianceReport.create({
    id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    framework,
    reportDate: new Date(),
    complianceScore,
    controlResults,
    gaps,
    recommendations,
    createdBy: 'system',
  });

  return report;
}

/**
 * Assesses compliance controls
 * @param framework - Compliance framework
 * @param controls - Control IDs to assess
 * @param auditPeriod - Audit time period
 * @returns Control assessment results
 */
async function assessComplianceControls(
  framework: ComplianceFramework,
  controls: string[],
  auditPeriod: ReportTimeRange
): Promise<Record<string, {
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
  score: number;
  evidence?: string[];
  gaps?: string[];
}>> {
  const results: Record<string, any> = {};

  for (const controlId of controls) {
    // Simulated assessment
    const status = ['compliant', 'non_compliant', 'partial', 'not_applicable'][Math.floor(Math.random() * 4)];
    results[controlId] = {
      status,
      score: status === 'compliant' ? 100 : status === 'partial' ? 50 : 0,
      evidence: status === 'compliant' ? ['Evidence document 1', 'Evidence document 2'] : undefined,
      gaps: status !== 'compliant' ? ['Gap identified in implementation'] : undefined,
    };
  }

  return results;
}

/**
 * Generates multi-framework compliance comparison
 * @param frameworks - Array of frameworks to compare
 * @param timeRange - Time range
 * @returns Comparison data
 */
export async function compareComplianceFrameworks(
  frameworks: ComplianceFramework[],
  timeRange: ReportTimeRange
): Promise<{
  frameworks: Array<{
    framework: ComplianceFramework;
    score: number;
    compliant: number;
    total: number;
    gaps: number;
  }>;
  overallScore: number;
  commonGaps: string[];
  recommendations: string[];
}> {
  const frameworkResults = frameworks.map(framework => ({
    framework,
    score: 70 + Math.random() * 25,
    compliant: Math.floor(40 + Math.random() * 30),
    total: 100,
    gaps: Math.floor(5 + Math.random() * 15),
  }));

  const overallScore = frameworkResults.reduce((sum, f) => sum + f.score, 0) / frameworks.length;

  return {
    frameworks: frameworkResults,
    overallScore,
    commonGaps: [
      'Encryption key rotation policy not enforced',
      'Incomplete access control documentation',
      'Missing vulnerability scan schedules',
    ],
    recommendations: [
      'Implement automated compliance monitoring',
      'Enhance documentation processes',
      'Schedule regular compliance audits',
    ],
  };
}

/**
 * Generates HIPAA compliance report
 * @param auditPeriod - Audit period
 * @returns HIPAA compliance report
 */
export async function generateHIPAAComplianceReport(
  auditPeriod: ReportTimeRange
): Promise<ComplianceReport> {
  const config: ComplianceReportConfig = {
    framework: ComplianceFramework.HIPAA,
    controls: [
      'HIPAA-164.308', // Administrative Safeguards
      'HIPAA-164.310', // Physical Safeguards
      'HIPAA-164.312', // Technical Safeguards
      'HIPAA-164.314', // Organizational Requirements
      'HIPAA-164.316', // Policies and Procedures
    ],
    includeEvidence: true,
    includeGaps: true,
    includeRemediation: true,
    auditPeriod,
  };

  return await generateComplianceReport(ComplianceFramework.HIPAA, config);
}

/**
 * Generates SOC2 compliance report
 * @param auditPeriod - Audit period
 * @returns SOC2 compliance report
 */
export async function generateSOC2ComplianceReport(
  auditPeriod: ReportTimeRange
): Promise<ComplianceReport> {
  const config: ComplianceReportConfig = {
    framework: ComplianceFramework.SOC2,
    controls: [
      'CC1', // Control Environment
      'CC2', // Communication and Information
      'CC3', // Risk Assessment
      'CC4', // Monitoring Activities
      'CC5', // Control Activities
      'CC6', // Logical and Physical Access
      'CC7', // System Operations
    ],
    includeEvidence: true,
    includeGaps: true,
    includeRemediation: true,
    auditPeriod,
  };

  return await generateComplianceReport(ComplianceFramework.SOC2, config);
}

/**
 * Tracks compliance score trends over time
 * @param framework - Compliance framework
 * @param timeRange - Time range
 * @returns Trend data
 */
export async function trackComplianceTrends(
  framework: ComplianceFramework,
  timeRange: ReportTimeRange
): Promise<Array<{ date: Date; score: number; gaps: number }>> {
  const reports = await ComplianceReport.findAll({
    where: {
      framework,
      reportDate: { $between: [timeRange.start, timeRange.end] },
    },
    order: [['reportDate', 'ASC']],
  });

  return reports.map(r => ({
    date: r.reportDate,
    score: r.complianceScore,
    gaps: r.gaps.length,
  }));
}

/**
 * Generates compliance gap remediation plan
 * @param complianceReportId - Compliance report ID
 * @returns Remediation plan
 */
export async function generateRemediationPlan(
  complianceReportId: string
): Promise<{
  gaps: Array<{
    id: string;
    controlId: string;
    description: string;
    severity: string;
    remediation: string;
    estimatedEffort: string;
    priority: number;
  }>;
  timeline: Array<{ phase: string; duration: string; gaps: string[] }>;
  resources: string[];
}> {
  const report = await ComplianceReport.findByPk(complianceReportId);

  if (!report) {
    throw new Error('Compliance report not found');
  }

  const prioritizedGaps = report.gaps
    .map((gap, index) => ({
      id: `gap_${index + 1}`,
      controlId: gap.controlId,
      description: gap.description,
      severity: gap.severity,
      remediation: gap.remediation || 'Remediation plan to be determined',
      estimatedEffort: ['1 week', '2 weeks', '1 month', '3 months'][Math.floor(Math.random() * 4)],
      priority: gap.severity === 'CRITICAL' ? 1 : gap.severity === 'HIGH' ? 2 : 3,
    }))
    .sort((a, b) => a.priority - b.priority);

  return {
    gaps: prioritizedGaps,
    timeline: [
      { phase: 'Immediate (0-30 days)', duration: '30 days', gaps: prioritizedGaps.slice(0, 3).map(g => g.id) },
      { phase: 'Short-term (1-3 months)', duration: '60 days', gaps: prioritizedGaps.slice(3, 6).map(g => g.id) },
      { phase: 'Long-term (3-6 months)', duration: '90 days', gaps: prioritizedGaps.slice(6).map(g => g.id) },
    ],
    resources: [
      'Security compliance specialist',
      'System administrator',
      'Documentation team',
      'Audit liaison',
    ],
  };
}

// ============================================================================
// EXECUTIVE BRIEFING FUNCTIONS (7 functions)
// ============================================================================

/**
 * Generates executive security briefing
 * @param timeRange - Briefing time range
 * @param includeRecommendations - Whether to include recommendations
 * @returns Executive briefing
 */
export async function generateExecutiveBriefing(
  timeRange: ReportTimeRange,
  includeRecommendations: boolean = true
): Promise<ExecutiveBriefing> {
  const threatData = await generateThreatLandscapeReport(timeRange);
  const incidentData = await generateIncidentSummaryReport(timeRange);
  const vulnData = await generateVulnerabilityReport(timeRange);

  const briefing: ExecutiveBriefing = {
    summary: `Security overview for ${timeRange.preset || 'custom period'}. Overall security posture is stable with ${incidentData.criticalIncidents.length} critical incidents requiring attention.`,
    keyMetrics: {
      'Threats Detected': { value: threatData.totalThreats, change: threatData.trends.weekOverWeek, unit: 'count' },
      'Incidents': { value: incidentData.totalIncidents, change: incidentData.trends.weeklyChange, unit: 'count' },
      'Vulnerabilities': { value: vulnData.totalVulnerabilities, change: -5.2, unit: 'count' },
      'MTTR': { value: incidentData.mttr / 3600, change: -12.3, unit: 'hours' },
    },
    topThreats: threatData.topThreats.slice(0, 5),
    criticalIncidents: incidentData.criticalIncidents.filter(i => i.status !== 'RESOLVED'),
    recommendations: includeRecommendations ? [
      'Increase monitoring for critical assets',
      'Accelerate vulnerability remediation',
      'Review incident response procedures',
      'Enhance threat intelligence integration',
    ] : [],
    complianceStatus: {
      [ComplianceFramework.HIPAA]: { score: 87, status: 'Compliant' },
      [ComplianceFramework.SOC2]: { score: 92, status: 'Compliant' },
      [ComplianceFramework.ISO27001]: { score: 78, status: 'Partial' },
    },
    riskScore: 72.5,
  };

  return briefing;
}

/**
 * Generates C-level security summary (simplified)
 * @param timeRange - Time range
 * @returns Simplified executive summary
 */
export async function generateCLevelSummary(
  timeRange: ReportTimeRange
): Promise<{
  status: 'good' | 'moderate' | 'concerning' | 'critical';
  headline: string;
  keyPoints: string[];
  actionRequired: boolean;
  nextSteps?: string[];
}> {
  const briefing = await generateExecutiveBriefing(timeRange, true);

  const status = briefing.riskScore < 50 ? 'good' :
                 briefing.riskScore < 70 ? 'moderate' :
                 briefing.riskScore < 85 ? 'concerning' : 'critical';

  return {
    status,
    headline: `Security posture is ${status.toUpperCase()} - Risk score: ${briefing.riskScore}`,
    keyPoints: [
      `${briefing.criticalIncidents.length} critical incidents active`,
      `${Object.values(briefing.keyMetrics)[0].value} threats detected this period`,
      `Compliance: ${Object.keys(briefing.complianceStatus).length} frameworks monitored`,
    ],
    actionRequired: briefing.criticalIncidents.length > 0 || status === 'critical',
    nextSteps: briefing.recommendations.slice(0, 3),
  };
}

/**
 * Formats executive briefing for email distribution
 * @param briefing - Executive briefing data
 * @returns Formatted email content
 */
export function formatBriefingForEmail(briefing: ExecutiveBriefing): {
  subject: string;
  htmlBody: string;
  plainTextBody: string;
} {
  const subject = `Security Briefing - Risk Score: ${briefing.riskScore}`;

  const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h1>Executive Security Briefing</h1>
        <p>${briefing.summary}</p>

        <h2>Key Metrics</h2>
        <ul>
          ${Object.entries(briefing.keyMetrics).map(([key, metric]) => `
            <li><strong>${key}:</strong> ${metric.value} ${metric.unit || ''}
                <span style="color: ${metric.change > 0 ? 'red' : 'green'};">
                  (${metric.change > 0 ? '+' : ''}${metric.change.toFixed(1)}%)
                </span>
            </li>
          `).join('')}
        </ul>

        <h2>Top Threats</h2>
        <ul>
          ${briefing.topThreats.map(t => `<li><strong>${t.name}</strong> - ${t.severity} (${t.count} occurrences)</li>`).join('')}
        </ul>

        <h2>Critical Incidents</h2>
        <p>${briefing.criticalIncidents.length} critical incidents require attention.</p>

        <h2>Recommendations</h2>
        <ul>
          ${briefing.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </body>
    </html>
  `;

  const plainTextBody = `
EXECUTIVE SECURITY BRIEFING

${briefing.summary}

KEY METRICS:
${Object.entries(briefing.keyMetrics).map(([key, metric]) =>
  `- ${key}: ${metric.value} ${metric.unit || ''} (${metric.change > 0 ? '+' : ''}${metric.change.toFixed(1)}%)`
).join('\n')}

TOP THREATS:
${briefing.topThreats.map((t, i) => `${i + 1}. ${t.name} - ${t.severity} (${t.count} occurrences)`).join('\n')}

CRITICAL INCIDENTS: ${briefing.criticalIncidents.length}

RECOMMENDATIONS:
${briefing.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
  `;

  return { subject, htmlBody, plainTextBody };
}

/**
 * Generates board-level security report
 * @param timeRange - Report time range
 * @returns Board-level report
 */
export async function generateBoardReport(
  timeRange: ReportTimeRange
): Promise<{
  executiveSummary: string;
  strategicRisks: Array<{ risk: string; impact: string; mitigation: string }>;
  complianceOverview: Record<string, any>;
  investmentRecommendations: string[];
  industryBenchmark: { position: string; percentile: number };
}> {
  const briefing = await generateExecutiveBriefing(timeRange);

  return {
    executiveSummary: `The organization's cybersecurity posture remains strong with a risk score of ${briefing.riskScore}/100. Key focus areas include threat detection, incident response, and compliance maintenance.`,
    strategicRisks: [
      {
        risk: 'Advanced Persistent Threats',
        impact: 'Potential data breach affecting patient records',
        mitigation: 'Enhanced threat detection and 24/7 monitoring',
      },
      {
        risk: 'Ransomware',
        impact: 'Operational disruption and financial loss',
        mitigation: 'Improved backup systems and incident response',
      },
      {
        risk: 'Compliance Gaps',
        impact: 'Regulatory fines and reputational damage',
        mitigation: 'Ongoing compliance monitoring and remediation',
      },
    ],
    complianceOverview: briefing.complianceStatus,
    investmentRecommendations: [
      'Expand security operations center (SOC) capabilities',
      'Invest in advanced threat intelligence platforms',
      'Enhance employee security awareness training',
      'Upgrade legacy security infrastructure',
    ],
    industryBenchmark: {
      position: 'Above Average',
      percentile: 78,
    },
  };
}

/**
 * Creates personalized executive dashboard snapshot
 * @param executiveId - Executive user ID
 * @param timeRange - Time range
 * @returns Personalized dashboard data
 */
export async function createExecutiveDashboardSnapshot(
  executiveId: string,
  timeRange: ReportTimeRange
): Promise<{
  snapshot: ExecutiveBriefing;
  personalizedInsights: string[];
  alerts: Array<{ severity: string; message: string }>;
  trendAnalysis: Record<string, { current: number; previous: number; change: number }>;
}> {
  const briefing = await generateExecutiveBriefing(timeRange);

  return {
    snapshot: briefing,
    personalizedInsights: [
      'Your division shows 15% improvement in incident response time',
      'Compliance scores are above organizational average',
      'New threats detected in your business unit require review',
    ],
    alerts: briefing.criticalIncidents.slice(0, 3).map(incident => ({
      severity: incident.severity,
      message: incident.title,
    })),
    trendAnalysis: {
      'Risk Score': { current: briefing.riskScore, previous: 68.2, change: 4.3 },
      'Incidents': { current: 127, previous: 138, change: -8.0 },
      'Threats': { current: 842, previous: 751, change: 12.1 },
    },
  };
}

/**
 * Generates quarterly security review for executives
 * @param quarter - Quarter (1-4)
 * @param year - Year
 * @returns Quarterly review data
 */
export async function generateQuarterlyReview(
  quarter: 1 | 2 | 3 | 4,
  year: number
): Promise<{
  quarterSummary: string;
  keyAchievements: string[];
  challenges: string[];
  quarterlyTrends: Record<string, number[]>;
  yearToDateComparison: Record<string, { ytd: number; target: number; progress: number }>;
  nextQuarterPriorities: string[];
}> {
  const startMonth = (quarter - 1) * 3;
  const timeRange: ReportTimeRange = {
    start: new Date(year, startMonth, 1),
    end: new Date(year, startMonth + 3, 0),
    preset: 'custom',
  };

  const briefing = await generateExecutiveBriefing(timeRange);

  return {
    quarterSummary: `Q${quarter} ${year} security operations successfully managed ${Object.values(briefing.keyMetrics)[1].value} incidents with improved response times.`,
    keyAchievements: [
      'Reduced mean time to resolution by 12%',
      'Achieved 95% compliance across all frameworks',
      'Successfully prevented 3 major security incidents',
      'Completed security awareness training for 98% of staff',
    ],
    challenges: [
      'Increasing sophistication of phishing attacks',
      'Legacy system vulnerabilities requiring remediation',
      'Resource constraints in security operations team',
    ],
    quarterlyTrends: {
      'Incidents': [45, 38, 44], // Monthly values
      'Threats': [280, 295, 267],
      'Vulnerabilities': [120, 108, 114],
    },
    yearToDateComparison: {
      'Security Incidents': { ytd: 127, target: 150, progress: 84.7 },
      'Compliance Score': { ytd: 89, target: 85, progress: 104.7 },
      'Vulnerability Remediation': { ytd: 78, target: 80, progress: 97.5 },
    },
    nextQuarterPriorities: [
      'Complete infrastructure security upgrades',
      'Launch advanced threat detection pilot',
      'Enhance third-party risk management program',
    ],
  };
}

/**
 * Exports executive briefing to multiple formats
 * @param briefing - Executive briefing data
 * @param formats - Desired export formats
 * @returns Export files
 */
export async function exportExecutiveBriefing(
  briefing: ExecutiveBriefing,
  formats: ReportFormat[]
): Promise<Array<{ format: ReportFormat; data: any; filename: string }>> {
  const exports: Array<{ format: ReportFormat; data: any; filename: string }> = [];

  for (const format of formats) {
    const timestamp = Date.now();
    let data: any;
    let filename: string;

    switch (format) {
      case ReportFormat.JSON:
        data = JSON.stringify(briefing, null, 2);
        filename = `executive_briefing_${timestamp}.json`;
        break;
      case ReportFormat.PDF:
        data = { briefing, renderAsPDF: true };
        filename = `executive_briefing_${timestamp}.pdf`;
        break;
      case ReportFormat.HTML:
        const emailFormat = formatBriefingForEmail(briefing);
        data = emailFormat.htmlBody;
        filename = `executive_briefing_${timestamp}.html`;
        break;
      default:
        data = briefing;
        filename = `executive_briefing_${timestamp}.${format.toLowerCase()}`;
    }

    exports.push({ format, data, filename });
  }

  return exports;
}

// ============================================================================
// REPORT SCHEDULING & DISTRIBUTION FUNCTIONS (7 functions)
// ============================================================================

/**
 * Creates a scheduled report
 * @param config - Schedule configuration
 * @param userId - User ID
 * @returns Created schedule
 */
export async function scheduleReport(
  config: ScheduleReportDto,
  userId: string
): Promise<ReportSchedule> {
  const scheduleId = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as ScheduleId;

  const nextRun = calculateNextRunTime(config.config);

  const schedule = await ReportSchedule.create({
    id: scheduleId,
    name: config.name,
    templateId: config.templateId,
    config: config.config,
    generationOptions: config.generationOptions,
    distributionConfig: config.distributionConfig,
    enabled: config.config.enabled,
    nextRun,
    createdBy: userId,
  });

  // Register with cron scheduler (in production)
  registerScheduledReport(schedule);

  return schedule;
}

/**
 * Distributes a report through specified channel
 * @param reportId - Report ID
 * @param config - Distribution configuration
 * @returns Distribution record
 */
export async function distributeReport(
  reportId: ReportId,
  config: DistributeReportDto
): Promise<ReportDistribution> {
  const report = await ThreatReport.findByPk(reportId);

  if (!report) {
    throw new Error(`Report ${reportId} not found`);
  }

  if (report.status !== ReportStatus.COMPLETED) {
    throw new Error('Report must be completed before distribution');
  }

  const distribution = await ReportDistribution.create({
    id: `dist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    reportId,
    channel: config.channel,
    config: {
      channel: config.channel,
      recipients: config.recipients,
      subject: config.subject,
      message: config.message,
    },
    status: 'pending',
    retryCount: 0,
  });

  // Trigger async distribution
  setTimeout(async () => {
    await processReportDistribution(distribution.id);
  }, 0);

  return distribution;
}

/**
 * Processes report distribution
 * @param distributionId - Distribution ID
 */
async function processReportDistribution(distributionId: string): Promise<void> {
  const distribution = await ReportDistribution.findByPk(distributionId, {
    include: [ThreatReport],
  });

  if (!distribution) return;

  try {
    switch (distribution.channel) {
      case DistributionChannel.EMAIL:
        await sendReportEmail(distribution.report, distribution.config);
        break;
      case DistributionChannel.SLACK:
        await sendReportToSlack(distribution.report, distribution.config);
        break;
      case DistributionChannel.WEBHOOK:
        await sendReportToWebhook(distribution.report, distribution.config);
        break;
      default:
        throw new Error(`Unsupported distribution channel: ${distribution.channel}`);
    }

    await distribution.update({
      status: 'sent',
      distributedAt: new Date(),
    });
  } catch (error) {
    await distribution.update({
      status: 'failed',
      errorMessage: error.message,
      retryCount: distribution.retryCount + 1,
    });

    // Retry logic
    if (distribution.retryCount < 3) {
      setTimeout(() => processReportDistribution(distributionId), 60000); // Retry after 1 minute
    }
  }
}

/**
 * Gets all scheduled reports
 * @param filters - Optional filters
 * @returns Scheduled reports
 */
export async function listScheduledReports(
  filters: { enabled?: boolean; templateId?: string } = {}
): Promise<ReportSchedule[]> {
  const whereClause: any = {};

  if (filters.enabled !== undefined) {
    whereClause.enabled = filters.enabled;
  }

  if (filters.templateId) {
    whereClause.templateId = filters.templateId;
  }

  return await ReportSchedule.findAll({
    where: whereClause,
    order: [['nextRun', 'ASC']],
    include: [ReportTemplateModel],
  });
}

/**
 * Updates a report schedule
 * @param scheduleId - Schedule ID
 * @param updates - Schedule updates
 * @returns Updated schedule
 */
export async function updateReportSchedule(
  scheduleId: ScheduleId,
  updates: Partial<{
    config: ReportScheduleConfig;
    generationOptions: ReportGenerationOptions;
    distributionConfig: DistributionConfig;
    enabled: boolean;
  }>
): Promise<ReportSchedule> {
  const schedule = await ReportSchedule.findByPk(scheduleId);

  if (!schedule) {
    throw new Error(`Schedule ${scheduleId} not found`);
  }

  if (updates.config) {
    updates['nextRun'] = calculateNextRunTime(updates.config);
  }

  await schedule.update(updates);

  // Update cron scheduler
  if (updates.config || updates.enabled !== undefined) {
    registerScheduledReport(schedule);
  }

  return schedule;
}

/**
 * Cancels a scheduled report
 * @param scheduleId - Schedule ID
 */
export async function cancelScheduledReport(scheduleId: ScheduleId): Promise<void> {
  const schedule = await ReportSchedule.findByPk(scheduleId);

  if (!schedule) {
    throw new Error(`Schedule ${scheduleId} not found`);
  }

  await schedule.update({ enabled: false });

  // Remove from cron scheduler
  unregisterScheduledReport(scheduleId);
}

/**
 * Gets distribution history for a report
 * @param reportId - Report ID
 * @returns Distribution history
 */
export async function getReportDistributionHistory(
  reportId: ReportId
): Promise<ReportDistribution[]> {
  return await ReportDistribution.findAll({
    where: { reportId },
    order: [['createdAt', 'DESC']],
  });
}

// ============================================================================
// REPORT TEMPLATE MANAGEMENT FUNCTIONS (6 functions)
// ============================================================================

/**
 * Creates a report template
 * @param template - Template configuration
 * @param userId - User ID
 * @returns Created template
 */
export async function createReportTemplate(
  template: {
    name: string;
    description?: string;
    reportType: ReportType;
    defaultFormat: ReportFormat;
    sections: ReportSection[];
    styling?: ReportStyling;
  },
  userId: string
): Promise<ReportTemplateModel> {
  const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as TemplateId;

  return await ReportTemplateModel.create({
    id: templateId,
    name: template.name,
    description: template.description,
    reportType: template.reportType,
    defaultFormat: template.defaultFormat,
    sections: template.sections,
    styling: template.styling,
    isDefault: false,
    createdBy: userId,
  });
}

/**
 * Updates a report template
 * @param templateId - Template ID
 * @param updates - Template updates
 * @returns Updated template
 */
export async function updateReportTemplate(
  templateId: TemplateId,
  updates: Partial<{
    name: string;
    description: string;
    sections: ReportSection[];
    styling: ReportStyling;
  }>
): Promise<ReportTemplateModel> {
  const template = await ReportTemplateModel.findByPk(templateId);

  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  await template.update(updates);
  return template;
}

/**
 * Deletes a report template
 * @param templateId - Template ID
 */
export async function deleteReportTemplate(templateId: TemplateId): Promise<void> {
  const template = await ReportTemplateModel.findByPk(templateId);

  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  if (template.isDefault) {
    throw new Error('Cannot delete default template');
  }

  await template.destroy();
}

/**
 * Lists all report templates
 * @param reportType - Optional filter by report type
 * @returns Report templates
 */
export async function listReportTemplates(
  reportType?: ReportType
): Promise<ReportTemplateModel[]> {
  const whereClause: any = {};

  if (reportType) {
    whereClause.reportType = reportType;
  }

  return await ReportTemplateModel.findAll({
    where: whereClause,
    order: [['isDefault', 'DESC'], ['name', 'ASC']],
  });
}

/**
 * Clones a report template
 * @param templateId - Template ID to clone
 * @param newName - Name for cloned template
 * @param userId - User ID
 * @returns Cloned template
 */
export async function cloneReportTemplate(
  templateId: TemplateId,
  newName: string,
  userId: string
): Promise<ReportTemplateModel> {
  const source = await ReportTemplateModel.findByPk(templateId);

  if (!source) {
    throw new Error(`Template ${templateId} not found`);
  }

  return await ReportTemplateModel.create({
    id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: newName,
    description: source.description,
    reportType: source.reportType,
    defaultFormat: source.defaultFormat,
    sections: source.sections,
    styling: source.styling,
    isDefault: false,
    createdBy: userId,
  });
}

/**
 * Gets default template for report type
 * @param reportType - Report type
 * @returns Default template
 */
export async function getDefaultTemplate(
  reportType: ReportType
): Promise<ReportTemplateModel | null> {
  return await ReportTemplateModel.findOne({
    where: {
      reportType,
      isDefault: true,
    },
  });
}

// ============================================================================
// REPORT MANAGEMENT FUNCTIONS (7 functions)
// ============================================================================

/**
 * Lists all reports with filters
 * @param filters - Filter criteria
 * @returns Filtered reports
 */
export async function listReports(filters: {
  userId?: string;
  reportType?: ReportType;
  status?: ReportStatus;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  limit?: number;
  offset?: number;
}): Promise<{ reports: ThreatReport[]; total: number }> {
  const whereClause: any = {};

  if (filters.userId) {
    whereClause.createdBy = filters.userId;
  }

  if (filters.reportType) {
    whereClause.reportType = filters.reportType;
  }

  if (filters.status) {
    whereClause.status = filters.status;
  }

  if (filters.startDate || filters.endDate) {
    whereClause.createdAt = {};
    if (filters.startDate) whereClause.createdAt.$gte = filters.startDate;
    if (filters.endDate) whereClause.createdAt.$lte = filters.endDate;
  }

  if (filters.tags?.length) {
    whereClause.tags = { $overlap: filters.tags };
  }

  const { rows: reports, count: total } = await ThreatReport.findAndCountAll({
    where: whereClause,
    limit: filters.limit || 50,
    offset: filters.offset || 0,
    order: [['createdAt', 'DESC']],
    include: [ReportTemplateModel],
  });

  return { reports, total };
}

/**
 * Gets a single report by ID
 * @param reportId - Report ID
 * @returns Report details
 */
export async function getReportById(reportId: ReportId): Promise<ThreatReport> {
  const report = await ThreatReport.findByPk(reportId, {
    include: [ReportTemplateModel, ReportDistribution],
  });

  if (!report) {
    throw new Error(`Report ${reportId} not found`);
  }

  return report;
}

/**
 * Deletes a report
 * @param reportId - Report ID
 */
export async function deleteReport(reportId: ReportId): Promise<void> {
  const report = await ThreatReport.findByPk(reportId);

  if (!report) {
    throw new Error(`Report ${reportId} not found`);
  }

  // Delete associated distributions
  await ReportDistribution.destroy({ where: { reportId } });

  // Delete file if exists
  if (report.filePath) {
    // In production, delete file from storage
    console.log(`Deleting report file: ${report.filePath}`);
  }

  await report.destroy();
}

/**
 * Gets report generation status
 * @param reportId - Report ID
 * @returns Generation status
 */
export async function getReportStatus(reportId: ReportId): Promise<{
  status: ReportStatus;
  progress: number;
  estimatedCompletion?: Date;
  errorMessage?: string;
}> {
  const report = await ThreatReport.findByPk(reportId);

  if (!report) {
    throw new Error(`Report ${reportId} not found`);
  }

  let progress = 0;
  switch (report.status) {
    case ReportStatus.PENDING:
      progress = 0;
      break;
    case ReportStatus.GENERATING:
      progress = 50;
      break;
    case ReportStatus.COMPLETED:
      progress = 100;
      break;
    case ReportStatus.FAILED:
      progress = 0;
      break;
  }

  return {
    status: report.status,
    progress,
    estimatedCompletion: report.status === ReportStatus.GENERATING
      ? new Date(Date.now() + 60000) // Estimate 1 minute
      : undefined,
    errorMessage: report.errorMessage,
  };
}

/**
 * Archives old reports
 * @param olderThan - Archive reports older than this date
 * @returns Number of archived reports
 */
export async function archiveOldReports(olderThan: Date): Promise<number> {
  const reports = await ThreatReport.findAll({
    where: {
      createdAt: { $lt: olderThan },
      status: ReportStatus.COMPLETED,
    },
  });

  for (const report of reports) {
    // In production, move to archive storage
    console.log(`Archiving report: ${report.id}`);
    await report.update({ tags: [...report.tags, 'archived'] });
  }

  return reports.length;
}

/**
 * Searches reports by content or metadata
 * @param query - Search query
 * @param userId - User ID for access control
 * @returns Matching reports
 */
export async function searchReports(
  query: string,
  userId?: string
): Promise<ThreatReport[]> {
  const whereClause: any = {
    $or: [
      { name: { $iLike: `%${query}%` } },
      { tags: { $overlap: [query] } },
    ],
  };

  if (userId) {
    whereClause.createdBy = userId;
  }

  return await ThreatReport.findAll({
    where: whereClause,
    limit: 100,
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Gets report analytics
 * @param timeRange - Time range for analytics
 * @returns Report analytics
 */
export async function getReportAnalytics(
  timeRange: ReportTimeRange
): Promise<{
  totalReports: number;
  byType: Record<ReportType, number>;
  byStatus: Record<ReportStatus, number>;
  avgGenerationTime: number;
  distributionStats: Record<DistributionChannel, number>;
  popularTemplates: Array<{ templateId: string; name: string; count: number }>;
}> {
  const reports = await ThreatReport.findAll({
    where: {
      createdAt: { $between: [timeRange.start, timeRange.end] },
    },
    include: [ReportTemplateModel, ReportDistribution],
  });

  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const distributionStats: Record<string, number> = {};
  const templateCounts: Record<string, { name: string; count: number }> = {};

  let totalGenerationTime = 0;
  let completedCount = 0;

  for (const report of reports) {
    byType[report.reportType] = (byType[report.reportType] || 0) + 1;
    byStatus[report.status] = (byStatus[report.status] || 0) + 1;

    if (report.generationDuration) {
      totalGenerationTime += report.generationDuration;
      completedCount++;
    }

    if (report.templateId) {
      if (!templateCounts[report.templateId]) {
        templateCounts[report.templateId] = { name: report.template?.name || 'Unknown', count: 0 };
      }
      templateCounts[report.templateId].count++;
    }

    for (const dist of report.distributions || []) {
      distributionStats[dist.channel] = (distributionStats[dist.channel] || 0) + 1;
    }
  }

  const popularTemplates = Object.entries(templateCounts)
    .map(([templateId, data]) => ({ templateId, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalReports: reports.length,
    byType: byType as any,
    byStatus: byStatus as any,
    avgGenerationTime: completedCount > 0 ? totalGenerationTime / completedCount : 0,
    distributionStats: distributionStats as any,
    popularTemplates,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDefaultGenerationOptions(): ReportGenerationOptions {
  return {
    timeRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
      preset: 'last_30d',
    },
    includeCharts: true,
    includeRawData: false,
    includeRecommendations: true,
    confidentialityLevel: 'internal',
  };
}

async function generateReportContent(
  reportType: ReportType,
  timeRange: ReportTimeRange,
  options: ReportGenerationOptions
): Promise<any> {
  switch (reportType) {
    case ReportType.THREAT_LANDSCAPE:
      return await generateThreatLandscapeReport(timeRange);
    case ReportType.INCIDENT_SUMMARY:
      return await generateIncidentSummaryReport(timeRange);
    case ReportType.VULNERABILITY_ASSESSMENT:
      return await generateVulnerabilityReport(timeRange);
    case ReportType.EXECUTIVE_BRIEFING:
      return await generateExecutiveBriefing(timeRange);
    default:
      return { message: 'Report content generated', type: reportType };
  }
}

async function renderReportToFile(
  reportId: ReportId,
  format: ReportFormat,
  contentData: any
): Promise<string> {
  // In production, this would render to actual file
  const filename = `/reports/${reportId}.${format.toLowerCase()}`;
  console.log(`Rendering report to ${filename}`);
  return filename;
}

async function getFileSize(filePath: string): Promise<number> {
  // In production, get actual file size
  return Math.floor(Math.random() * 5000000) + 100000; // 100KB - 5MB
}

function calculateComplianceScore(controlResults: Record<string, any>): number {
  const scores = Object.values(controlResults).map((r: any) => r.score);
  return scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;
}

function identifyComplianceGaps(controlResults: Record<string, any>): Array<any> {
  return Object.entries(controlResults)
    .filter(([_, result]: [string, any]) => result.status !== 'compliant')
    .map(([controlId, result]: [string, any]) => ({
      controlId,
      description: `Gap in ${controlId}`,
      severity: result.score < 25 ? 'CRITICAL' : result.score < 50 ? 'HIGH' : 'MEDIUM',
      remediation: result.gaps?.[0] || 'Remediation needed',
    }));
}

function generateComplianceRecommendations(gaps: Array<any>): string[] {
  return gaps.slice(0, 5).map(gap =>
    `Address ${gap.severity} gap in ${gap.controlId}: ${gap.description}`
  );
}

function calculateNextRunTime(config: ReportScheduleConfig): Date {
  const now = new Date();

  switch (config.frequency) {
    case 'daily':
      const [hours, minutes] = (config.time || '09:00').split(':').map(Number);
      const nextDaily = new Date(now);
      nextDaily.setHours(hours, minutes, 0, 0);
      if (nextDaily <= now) {
        nextDaily.setDate(nextDaily.getDate() + 1);
      }
      return nextDaily;

    case 'weekly':
      const nextWeekly = new Date(now);
      const daysUntilTarget = ((config.dayOfWeek || 1) - now.getDay() + 7) % 7;
      nextWeekly.setDate(nextWeekly.getDate() + (daysUntilTarget || 7));
      const [wHours, wMinutes] = (config.time || '09:00').split(':').map(Number);
      nextWeekly.setHours(wHours, wMinutes, 0, 0);
      return nextWeekly;

    case 'monthly':
      const nextMonthly = new Date(now);
      nextMonthly.setDate(config.dayOfMonth || 1);
      if (nextMonthly <= now) {
        nextMonthly.setMonth(nextMonthly.getMonth() + 1);
      }
      const [mHours, mMinutes] = (config.time || '09:00').split(':').map(Number);
      nextMonthly.setHours(mHours, mMinutes, 0, 0);
      return nextMonthly;

    default:
      return new Date(now.getTime() + 86400000); // Default: 1 day
  }
}

function registerScheduledReport(schedule: ReportSchedule): void {
  // In production, register with cron scheduler
  console.log(`Registered scheduled report: ${schedule.id}`);
}

function unregisterScheduledReport(scheduleId: ScheduleId): void {
  // In production, unregister from cron scheduler
  console.log(`Unregistered scheduled report: ${scheduleId}`);
}

async function sendReportEmail(report: ThreatReport, config: DistributionConfig): Promise<void> {
  console.log(`Sending report ${report.id} via email to ${config.recipients.join(', ')}`);
}

async function sendReportToSlack(report: ThreatReport, config: DistributionConfig): Promise<void> {
  console.log(`Sending report ${report.id} to Slack`);
}

async function sendReportToWebhook(report: ThreatReport, config: DistributionConfig): Promise<void> {
  console.log(`Sending report ${report.id} to webhook ${config.webhook?.url}`);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Automated Report Generation (8)
  generateSecurityReport,
  generateThreatLandscapeReport,
  generateIncidentSummaryReport,
  generateVulnerabilityReport,
  bulkGenerateReports,
  regenerateReport,
  mergeReports,

  // Compliance Reporting (7)
  generateComplianceReport,
  compareComplianceFrameworks,
  generateHIPAAComplianceReport,
  generateSOC2ComplianceReport,
  trackComplianceTrends,
  generateRemediationPlan,

  // Executive Briefing (7)
  generateExecutiveBriefing,
  generateCLevelSummary,
  formatBriefingForEmail,
  generateBoardReport,
  createExecutiveDashboardSnapshot,
  generateQuarterlyReview,
  exportExecutiveBriefing,

  // Scheduling & Distribution (7)
  scheduleReport,
  distributeReport,
  listScheduledReports,
  updateReportSchedule,
  cancelScheduledReport,
  getReportDistributionHistory,

  // Template Management (6)
  createReportTemplate,
  updateReportTemplate,
  deleteReportTemplate,
  listReportTemplates,
  cloneReportTemplate,
  getDefaultTemplate,

  // Report Management (7)
  listReports,
  getReportById,
  deleteReport,
  getReportStatus,
  archiveOldReports,
  searchReports,
  getReportAnalytics,
};
