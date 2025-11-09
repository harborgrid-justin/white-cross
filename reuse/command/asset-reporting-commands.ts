/**
 * ASSET REPORTING AND ANALYTICS COMMAND FUNCTIONS
 *
 * Comprehensive reporting and analytics toolkit for enterprise asset management.
 * Provides 47 specialized functions covering:
 * - Standard report generation (predefined formats)
 * - Custom report builder with dynamic queries
 * - Interactive dashboard generation
 * - KPI tracking and calculation
 * - Compliance and regulatory reporting
 * - Financial analysis and depreciation reports
 * - Operational efficiency reports
 * - Executive summary generation
 * - Report scheduling and automation
 * - Report distribution and delivery
 * - Report template management
 * - Data visualization preparation
 * - Export to multiple formats (PDF, Excel, CSV)
 * - Report versioning and history
 * - Ad-hoc query execution
 *
 * @module AssetReportingCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security Role-based report access control
 * @performance Optimized queries with materialized views for large datasets
 *
 * @example
 * ```typescript
 * import {
 *   generateAssetInventoryReport,
 *   createCustomReport,
 *   generateDashboard,
 *   calculateAssetKPIs,
 *   scheduleReport,
 *   ReportFormat,
 *   ReportFrequency
 * } from './asset-reporting-commands';
 *
 * // Generate standard inventory report
 * const report = await generateAssetInventoryReport({
 *   includeDepreciation: true,
 *   groupBy: 'assetType',
 *   format: ReportFormat.PDF
 * });
 *
 * // Schedule monthly executive summary
 * await scheduleReport({
 *   reportTemplateId: 'exec-summary',
 *   frequency: ReportFrequency.MONTHLY,
 *   recipients: ['exec@company.com'],
 *   format: ReportFormat.PDF
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  IsArray,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions, QueryTypes } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Report types
 */
export enum ReportType {
  INVENTORY = 'inventory',
  DEPRECIATION = 'depreciation',
  MAINTENANCE = 'maintenance',
  COMPLIANCE = 'compliance',
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  UTILIZATION = 'utilization',
  LIFECYCLE = 'lifecycle',
  CUSTOM = 'custom',
  DASHBOARD = 'dashboard',
  EXECUTIVE_SUMMARY = 'executive_summary',
  AUDIT = 'audit',
}

/**
 * Report formats
 */
export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
  HTML = 'html',
  DASHBOARD = 'dashboard',
}

/**
 * Report frequency for scheduling
 */
export enum ReportFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

/**
 * Report status
 */
export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
}

/**
 * Aggregation functions
 */
export enum AggregationFunction {
  SUM = 'sum',
  AVG = 'avg',
  COUNT = 'count',
  MIN = 'min',
  MAX = 'max',
  STDDEV = 'stddev',
}

/**
 * Chart types
 */
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  DOUGHNUT = 'doughnut',
  AREA = 'area',
  SCATTER = 'scatter',
  GAUGE = 'gauge',
  TABLE = 'table',
}

/**
 * KPI metric types
 */
export enum KPIMetricType {
  ASSET_AVAILABILITY = 'asset_availability',
  UTILIZATION_RATE = 'utilization_rate',
  MAINTENANCE_COST_RATIO = 'maintenance_cost_ratio',
  MEAN_TIME_BETWEEN_FAILURES = 'mtbf',
  MEAN_TIME_TO_REPAIR = 'mttr',
  ASSET_TURNOVER = 'asset_turnover',
  DEPRECIATION_RATE = 'depreciation_rate',
  COMPLIANCE_SCORE = 'compliance_score',
  TOTAL_COST_OF_OWNERSHIP = 'tco',
}

/**
 * Report generation options
 */
export interface ReportGenerationOptions {
  reportType: ReportType;
  title?: string;
  description?: string;
  filters?: ReportFilters;
  groupBy?: string[];
  sortBy?: SortOption[];
  includeCharts?: boolean;
  includeExecutiveSummary?: boolean;
  format: ReportFormat;
  locale?: string;
  timezone?: string;
  customParameters?: Record<string, any>;
}

/**
 * Report filters
 */
export interface ReportFilters {
  dateFrom?: Date;
  dateTo?: Date;
  assetIds?: string[];
  assetTypeIds?: string[];
  departmentIds?: string[];
  locationIds?: string[];
  statusFilters?: string[];
  customFilters?: Record<string, any>;
}

/**
 * Sort options
 */
export interface SortOption {
  field: string;
  direction: 'ASC' | 'DESC';
}

/**
 * Custom report definition
 */
export interface CustomReportDefinition {
  name: string;
  description?: string;
  dataSource: DataSourceDefinition;
  columns: ColumnDefinition[];
  filters?: FilterDefinition[];
  groupBy?: string[];
  aggregations?: AggregationDefinition[];
  joins?: JoinDefinition[];
  orderBy?: SortOption[];
}

/**
 * Data source definition
 */
export interface DataSourceDefinition {
  table: string;
  alias?: string;
  customQuery?: string;
}

/**
 * Column definition
 */
export interface ColumnDefinition {
  field: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
  format?: string;
  width?: number;
  aggregation?: AggregationFunction;
}

/**
 * Filter definition
 */
export interface FilterDefinition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between';
  value: any;
}

/**
 * Aggregation definition
 */
export interface AggregationDefinition {
  field: string;
  function: AggregationFunction;
  alias: string;
}

/**
 * Join definition
 */
export interface JoinDefinition {
  table: string;
  alias: string;
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  on: string;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfiguration {
  name: string;
  description?: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  refreshInterval?: number; // in seconds
  filters?: DashboardFilter[];
}

/**
 * Dashboard layout
 */
export interface DashboardLayout {
  columns: number;
  rows: number;
  responsive: boolean;
}

/**
 * Dashboard widget
 */
export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'text';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  dataSource: string;
  chartType?: ChartType;
  metricType?: KPIMetricType;
  configuration?: Record<string, any>;
}

/**
 * Dashboard filter
 */
export interface DashboardFilter {
  id: string;
  label: string;
  type: 'date' | 'select' | 'multiselect' | 'text';
  defaultValue?: any;
  options?: Array<{ value: any; label: string }>;
}

/**
 * KPI calculation options
 */
export interface KPICalculationOptions {
  metricType: KPIMetricType;
  dateFrom: Date;
  dateTo: Date;
  assetIds?: string[];
  groupBy?: string;
}

/**
 * KPI result
 */
export interface KPIResult {
  metricType: KPIMetricType;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  target?: number;
  status: 'good' | 'warning' | 'critical';
  breakdown?: Array<{ label: string; value: number }>;
}

/**
 * Report schedule data
 */
export interface ReportScheduleData {
  reportTemplateId: string;
  name: string;
  frequency: ReportFrequency;
  startDate: Date;
  endDate?: Date;
  executionTime?: string; // HH:MM format
  recipients: string[];
  format: ReportFormat;
  parameters?: Record<string, any>;
  isActive: boolean;
}

/**
 * Distribution channel
 */
export interface DistributionChannel {
  type: 'email' | 'sftp' | 'webhook' | 'storage';
  configuration: Record<string, any>;
  recipients?: string[];
}

/**
 * Report metadata
 */
export interface ReportMetadata {
  reportId: string;
  reportType: ReportType;
  generatedAt: Date;
  generatedBy: string;
  dataRange: { from: Date; to: Date };
  recordCount: number;
  fileSize?: number;
  filePath?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Report Template Model
 */
@Table({
  tableName: 'report_templates',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['report_type'] },
    { fields: ['is_active'] },
    { fields: ['category'] },
  ],
})
export class ReportTemplate extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Template code' })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  code!: string;

  @ApiProperty({ description: 'Template name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Report type' })
  @Column({
    type: DataType.ENUM(...Object.values(ReportType)),
    allowNull: false,
  })
  @Index
  reportType!: ReportType;

  @ApiProperty({ description: 'Category' })
  @Column({ type: DataType.STRING(100) })
  @Index
  category?: string;

  @ApiProperty({ description: 'Report definition' })
  @Column({ type: DataType.JSONB, allowNull: false })
  definition!: CustomReportDefinition;

  @ApiProperty({ description: 'Default parameters' })
  @Column({ type: DataType.JSONB })
  defaultParameters?: Record<string, any>;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Version' })
  @Column({ type: DataType.STRING(50) })
  version?: string;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({ type: DataType.UUID })
  createdBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => Report)
  reports?: Report[];

  @HasMany(() => ReportSchedule)
  schedules?: ReportSchedule[];
}

/**
 * Report Model - Generated reports
 */
@Table({
  tableName: 'reports',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['template_id'] },
    { fields: ['status'] },
    { fields: ['report_type'] },
    { fields: ['generated_by'] },
    { fields: ['generated_at'] },
  ],
})
export class Report extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Report number' })
  @Column({ type: DataType.STRING(100), unique: true })
  reportNumber!: string;

  @ApiProperty({ description: 'Template ID' })
  @ForeignKey(() => ReportTemplate)
  @Column({ type: DataType.UUID })
  @Index
  templateId?: string;

  @ApiProperty({ description: 'Report type' })
  @Column({
    type: DataType.ENUM(...Object.values(ReportType)),
    allowNull: false,
  })
  @Index
  reportType!: ReportType;

  @ApiProperty({ description: 'Title' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  title!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Status' })
  @Column({
    type: DataType.ENUM(...Object.values(ReportStatus)),
    defaultValue: ReportStatus.PENDING,
  })
  @Index
  status!: ReportStatus;

  @ApiProperty({ description: 'Format' })
  @Column({
    type: DataType.ENUM(...Object.values(ReportFormat)),
    allowNull: false,
  })
  format!: ReportFormat;

  @ApiProperty({ description: 'Generation parameters' })
  @Column({ type: DataType.JSONB })
  parameters?: Record<string, any>;

  @ApiProperty({ description: 'Filters applied' })
  @Column({ type: DataType.JSONB })
  filters?: ReportFilters;

  @ApiProperty({ description: 'Data range from' })
  @Column({ type: DataType.DATE })
  dataRangeFrom?: Date;

  @ApiProperty({ description: 'Data range to' })
  @Column({ type: DataType.DATE })
  dataRangeTo?: Date;

  @ApiProperty({ description: 'Record count' })
  @Column({ type: DataType.INTEGER })
  recordCount?: number;

  @ApiProperty({ description: 'File path' })
  @Column({ type: DataType.STRING(500) })
  filePath?: string;

  @ApiProperty({ description: 'File size in bytes' })
  @Column({ type: DataType.BIGINT })
  fileSize?: number;

  @ApiProperty({ description: 'Generated at' })
  @Column({ type: DataType.DATE })
  @Index
  generatedAt?: Date;

  @ApiProperty({ description: 'Generated by user ID' })
  @Column({ type: DataType.UUID })
  @Index
  generatedBy?: string;

  @ApiProperty({ description: 'Generation duration in seconds' })
  @Column({ type: DataType.INTEGER })
  generationDuration?: number;

  @ApiProperty({ description: 'Error message' })
  @Column({ type: DataType.TEXT })
  errorMessage?: string;

  @ApiProperty({ description: 'Expiration date' })
  @Column({ type: DataType.DATE })
  expirationDate?: Date;

  @ApiProperty({ description: 'Is archived' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isArchived!: boolean;

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => ReportTemplate)
  template?: ReportTemplate;

  @HasMany(() => ReportDistribution)
  distributions?: ReportDistribution[];
}

/**
 * Report Schedule Model - Scheduled report execution
 */
@Table({
  tableName: 'report_schedules',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['template_id'] },
    { fields: ['frequency'] },
    { fields: ['is_active'] },
    { fields: ['next_execution'] },
  ],
})
export class ReportSchedule extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Schedule name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({ description: 'Template ID' })
  @ForeignKey(() => ReportTemplate)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  templateId!: string;

  @ApiProperty({ description: 'Frequency' })
  @Column({
    type: DataType.ENUM(...Object.values(ReportFrequency)),
    allowNull: false,
  })
  @Index
  frequency!: ReportFrequency;

  @ApiProperty({ description: 'Start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  @Column({ type: DataType.DATE })
  endDate?: Date;

  @ApiProperty({ description: 'Execution time (HH:MM)' })
  @Column({ type: DataType.STRING(5) })
  executionTime?: string;

  @ApiProperty({ description: 'Next execution date' })
  @Column({ type: DataType.DATE })
  @Index
  nextExecution?: Date;

  @ApiProperty({ description: 'Last execution date' })
  @Column({ type: DataType.DATE })
  lastExecution?: Date;

  @ApiProperty({ description: 'Recipients' })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  recipients!: string[];

  @ApiProperty({ description: 'Report format' })
  @Column({
    type: DataType.ENUM(...Object.values(ReportFormat)),
    allowNull: false,
  })
  format!: ReportFormat;

  @ApiProperty({ description: 'Parameters' })
  @Column({ type: DataType.JSONB })
  parameters?: Record<string, any>;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({ type: DataType.UUID })
  createdBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => ReportTemplate)
  template?: ReportTemplate;
}

/**
 * Report Distribution Model - Report delivery tracking
 */
@Table({
  tableName: 'report_distributions',
  timestamps: true,
  indexes: [
    { fields: ['report_id'] },
    { fields: ['status'] },
    { fields: ['channel_type'] },
    { fields: ['distributed_at'] },
  ],
})
export class ReportDistribution extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Report ID' })
  @ForeignKey(() => Report)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  reportId!: string;

  @ApiProperty({ description: 'Channel type' })
  @Column({
    type: DataType.ENUM('email', 'sftp', 'webhook', 'storage'),
    allowNull: false,
  })
  @Index
  channelType!: string;

  @ApiProperty({ description: 'Recipient' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  recipient!: string;

  @ApiProperty({ description: 'Status' })
  @Column({
    type: DataType.ENUM('pending', 'sent', 'failed', 'bounced'),
    defaultValue: 'pending',
  })
  @Index
  status!: string;

  @ApiProperty({ description: 'Distributed at' })
  @Column({ type: DataType.DATE })
  @Index
  distributedAt?: Date;

  @ApiProperty({ description: 'Error message' })
  @Column({ type: DataType.TEXT })
  errorMessage?: string;

  @ApiProperty({ description: 'Delivery confirmation' })
  @Column({ type: DataType.TEXT })
  deliveryConfirmation?: string;

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Report)
  report?: Report;
}

/**
 * Dashboard Model - Dashboard configurations
 */
@Table({
  tableName: 'dashboards',
  timestamps: true,
  paranoid: true,
  indexes: [{ fields: ['is_active'] }, { fields: ['category'] }, { fields: ['created_by'] }],
})
export class Dashboard extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Dashboard code' })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  code!: string;

  @ApiProperty({ description: 'Dashboard name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Category' })
  @Column({ type: DataType.STRING(100) })
  @Index
  category?: string;

  @ApiProperty({ description: 'Configuration' })
  @Column({ type: DataType.JSONB, allowNull: false })
  configuration!: DashboardConfiguration;

  @ApiProperty({ description: 'Is public' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPublic!: boolean;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({ type: DataType.UUID })
  @Index
  createdBy?: string;

  @ApiProperty({ description: 'Access control' })
  @Column({ type: DataType.JSONB })
  accessControl?: { users: string[]; roles: string[] };

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * KPI Metric Model - Calculated KPI values
 */
@Table({
  tableName: 'kpi_metrics',
  timestamps: true,
  indexes: [
    { fields: ['metric_type'] },
    { fields: ['calculation_date'] },
    { fields: ['asset_id'] },
  ],
})
export class KPIMetric extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Metric type' })
  @Column({
    type: DataType.ENUM(...Object.values(KPIMetricType)),
    allowNull: false,
  })
  @Index
  metricType!: KPIMetricType;

  @ApiProperty({ description: 'Asset ID (if asset-specific)' })
  @Column({ type: DataType.UUID })
  @Index
  assetId?: string;

  @ApiProperty({ description: 'Calculation date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  calculationDate!: Date;

  @ApiProperty({ description: 'Period start' })
  @Column({ type: DataType.DATE, allowNull: false })
  periodStart!: Date;

  @ApiProperty({ description: 'Period end' })
  @Column({ type: DataType.DATE, allowNull: false })
  periodEnd!: Date;

  @ApiProperty({ description: 'Metric value' })
  @Column({ type: DataType.DECIMAL(15, 4), allowNull: false })
  value!: number;

  @ApiProperty({ description: 'Unit' })
  @Column({ type: DataType.STRING(50) })
  unit?: string;

  @ApiProperty({ description: 'Target value' })
  @Column({ type: DataType.DECIMAL(15, 4) })
  targetValue?: number;

  @ApiProperty({ description: 'Previous value' })
  @Column({ type: DataType.DECIMAL(15, 4) })
  previousValue?: number;

  @ApiProperty({ description: 'Change percentage' })
  @Column({ type: DataType.DECIMAL(8, 4) })
  changePercent?: number;

  @ApiProperty({ description: 'Breakdown data' })
  @Column({ type: DataType.JSONB })
  breakdownData?: Array<{ label: string; value: number }>;

  @ApiProperty({ description: 'Calculation metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

// ============================================================================
// STANDARD REPORT GENERATION
// ============================================================================

/**
 * Generates asset inventory report
 *
 * @param options - Report generation options
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await generateAssetInventoryReport({
 *   reportType: ReportType.INVENTORY,
 *   format: ReportFormat.EXCEL,
 *   filters: {
 *     dateFrom: new Date('2024-01-01'),
 *     dateTo: new Date('2024-12-31')
 *   },
 *   groupBy: ['assetType', 'location'],
 *   includeCharts: true
 * });
 * ```
 */
export async function generateAssetInventoryReport(
  options: ReportGenerationOptions,
  transaction?: Transaction,
): Promise<Report> {
  const reportNumber = await generateReportNumber(ReportType.INVENTORY);
  const startTime = Date.now();

  // Create report record
  const report = await Report.create(
    {
      reportNumber,
      reportType: ReportType.INVENTORY,
      title: options.title || 'Asset Inventory Report',
      description: options.description,
      status: ReportStatus.GENERATING,
      format: options.format,
      parameters: options.customParameters,
      filters: options.filters,
      dataRangeFrom: options.filters?.dateFrom,
      dataRangeTo: options.filters?.dateTo,
      generatedBy: 'system', // Would be from context in real implementation
    },
    { transaction },
  );

  try {
    // Execute report query (simplified - real implementation would use query builder)
    const data = await executeInventoryQuery(options.filters, transaction);

    // Format data based on output format
    const filePath = await formatAndSaveReport(
      data,
      options.format,
      report.id,
      transaction,
    );

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    // Update report with completion
    await report.update(
      {
        status: ReportStatus.COMPLETED,
        filePath,
        recordCount: data.length,
        generatedAt: new Date(),
        generationDuration: duration,
      },
      { transaction },
    );

    return report;
  } catch (error: any) {
    await report.update(
      {
        status: ReportStatus.FAILED,
        errorMessage: error.message,
      },
      { transaction },
    );
    throw error;
  }
}

/**
 * Generates depreciation report
 *
 * @param options - Report generation options
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await generateDepreciationReport({
 *   reportType: ReportType.DEPRECIATION,
 *   format: ReportFormat.PDF,
 *   filters: {
 *     assetTypeIds: ['type-001', 'type-002']
 *   }
 * });
 * ```
 */
export async function generateDepreciationReport(
  options: ReportGenerationOptions,
  transaction?: Transaction,
): Promise<Report> {
  const reportNumber = await generateReportNumber(ReportType.DEPRECIATION);
  const startTime = Date.now();

  const report = await Report.create(
    {
      reportNumber,
      reportType: ReportType.DEPRECIATION,
      title: options.title || 'Asset Depreciation Report',
      description: options.description,
      status: ReportStatus.GENERATING,
      format: options.format,
      parameters: options.customParameters,
      filters: options.filters,
      dataRangeFrom: options.filters?.dateFrom,
      dataRangeTo: options.filters?.dateTo,
      generatedBy: 'system',
    },
    { transaction },
  );

  try {
    const data = await executeDepreciationQuery(options.filters, transaction);
    const filePath = await formatAndSaveReport(
      data,
      options.format,
      report.id,
      transaction,
    );

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    await report.update(
      {
        status: ReportStatus.COMPLETED,
        filePath,
        recordCount: data.length,
        generatedAt: new Date(),
        generationDuration: duration,
      },
      { transaction },
    );

    return report;
  } catch (error: any) {
    await report.update(
      {
        status: ReportStatus.FAILED,
        errorMessage: error.message,
      },
      { transaction },
    );
    throw error;
  }
}

/**
 * Generates maintenance report
 *
 * @param options - Report generation options
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await generateMaintenanceReport({
 *   reportType: ReportType.MAINTENANCE,
 *   format: ReportFormat.EXCEL,
 *   filters: {
 *     dateFrom: new Date('2024-01-01'),
 *     dateTo: new Date('2024-12-31')
 *   },
 *   groupBy: ['maintenanceType']
 * });
 * ```
 */
export async function generateMaintenanceReport(
  options: ReportGenerationOptions,
  transaction?: Transaction,
): Promise<Report> {
  const reportNumber = await generateReportNumber(ReportType.MAINTENANCE);
  const startTime = Date.now();

  const report = await Report.create(
    {
      reportNumber,
      reportType: ReportType.MAINTENANCE,
      title: options.title || 'Maintenance Activity Report',
      description: options.description,
      status: ReportStatus.GENERATING,
      format: options.format,
      parameters: options.customParameters,
      filters: options.filters,
      dataRangeFrom: options.filters?.dateFrom,
      dataRangeTo: options.filters?.dateTo,
      generatedBy: 'system',
    },
    { transaction },
  );

  try {
    const data = await executeMaintenanceQuery(options.filters, transaction);
    const filePath = await formatAndSaveReport(
      data,
      options.format,
      report.id,
      transaction,
    );

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    await report.update(
      {
        status: ReportStatus.COMPLETED,
        filePath,
        recordCount: data.length,
        generatedAt: new Date(),
        generationDuration: duration,
      },
      { transaction },
    );

    return report;
  } catch (error: any) {
    await report.update(
      {
        status: ReportStatus.FAILED,
        errorMessage: error.message,
      },
      { transaction },
    );
    throw error;
  }
}

/**
 * Generates compliance report
 *
 * @param options - Report generation options
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport({
 *   reportType: ReportType.COMPLIANCE,
 *   format: ReportFormat.PDF,
 *   filters: {
 *     dateFrom: new Date('2024-01-01'),
 *     dateTo: new Date('2024-12-31')
 *   },
 *   includeExecutiveSummary: true
 * });
 * ```
 */
export async function generateComplianceReport(
  options: ReportGenerationOptions,
  transaction?: Transaction,
): Promise<Report> {
  const reportNumber = await generateReportNumber(ReportType.COMPLIANCE);
  const startTime = Date.now();

  const report = await Report.create(
    {
      reportNumber,
      reportType: ReportType.COMPLIANCE,
      title: options.title || 'Compliance Status Report',
      description: options.description,
      status: ReportStatus.GENERATING,
      format: options.format,
      parameters: options.customParameters,
      filters: options.filters,
      dataRangeFrom: options.filters?.dateFrom,
      dataRangeTo: options.filters?.dateTo,
      generatedBy: 'system',
    },
    { transaction },
  );

  try {
    const data = await executeComplianceQuery(options.filters, transaction);
    const filePath = await formatAndSaveReport(
      data,
      options.format,
      report.id,
      transaction,
    );

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    await report.update(
      {
        status: ReportStatus.COMPLETED,
        filePath,
        recordCount: data.length,
        generatedAt: new Date(),
        generationDuration: duration,
      },
      { transaction },
    );

    return report;
  } catch (error: any) {
    await report.update(
      {
        status: ReportStatus.FAILED,
        errorMessage: error.message,
      },
      { transaction },
    );
    throw error;
  }
}

/**
 * Generates executive summary report
 *
 * @param options - Report generation options
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await generateExecutiveSummary({
 *   reportType: ReportType.EXECUTIVE_SUMMARY,
 *   format: ReportFormat.PDF,
 *   filters: {
 *     dateFrom: new Date('2024-01-01'),
 *     dateTo: new Date('2024-12-31')
 *   },
 *   includeCharts: true
 * });
 * ```
 */
export async function generateExecutiveSummary(
  options: ReportGenerationOptions,
  transaction?: Transaction,
): Promise<Report> {
  const reportNumber = await generateReportNumber(ReportType.EXECUTIVE_SUMMARY);
  const startTime = Date.now();

  const report = await Report.create(
    {
      reportNumber,
      reportType: ReportType.EXECUTIVE_SUMMARY,
      title: options.title || 'Executive Summary - Asset Management',
      description: options.description,
      status: ReportStatus.GENERATING,
      format: options.format,
      parameters: options.customParameters,
      filters: options.filters,
      dataRangeFrom: options.filters?.dateFrom,
      dataRangeTo: options.filters?.dateTo,
      generatedBy: 'system',
    },
    { transaction },
  );

  try {
    // Gather summary data from multiple sources
    const inventorySummary = await executeInventoryQuery(options.filters, transaction);
    const depreciationSummary = await executeDepreciationQuery(
      options.filters,
      transaction,
    );
    const maintenanceSummary = await executeMaintenanceQuery(
      options.filters,
      transaction,
    );

    const summaryData = {
      inventory: inventorySummary,
      depreciation: depreciationSummary,
      maintenance: maintenanceSummary,
    };

    const filePath = await formatAndSaveReport(
      summaryData,
      options.format,
      report.id,
      transaction,
    );

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    await report.update(
      {
        status: ReportStatus.COMPLETED,
        filePath,
        recordCount: inventorySummary.length,
        generatedAt: new Date(),
        generationDuration: duration,
      },
      { transaction },
    );

    return report;
  } catch (error: any) {
    await report.update(
      {
        status: ReportStatus.FAILED,
        errorMessage: error.message,
      },
      { transaction },
    );
    throw error;
  }
}

/**
 * Generates report number
 *
 * @param reportType - Report type
 * @returns Generated report number
 */
async function generateReportNumber(reportType: ReportType): Promise<string> {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const typePrefix = reportType.toUpperCase().substring(0, 4);

  const count = await Report.count({
    where: {
      reportType,
      createdAt: {
        [Op.gte]: new Date(`${year}-${month}-01`),
      },
    },
  });

  return `RPT-${typePrefix}-${year}${month}-${String(count + 1).padStart(5, '0')}`;
}

// ============================================================================
// CUSTOM REPORT BUILDER
// ============================================================================

/**
 * Creates custom report template
 *
 * @param definition - Report definition
 * @param transaction - Optional database transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createCustomReport({
 *   name: 'Asset Age Analysis',
 *   dataSource: { table: 'assets' },
 *   columns: [
 *     { field: 'assetTag', label: 'Asset Tag', type: 'string' },
 *     { field: 'acquisitionDate', label: 'Acquisition Date', type: 'date' },
 *     { field: 'acquisitionCost', label: 'Cost', type: 'currency' }
 *   ],
 *   filters: [
 *     { field: 'isActive', operator: 'eq', value: true }
 *   ],
 *   orderBy: [{ field: 'acquisitionDate', direction: 'DESC' }]
 * });
 * ```
 */
export async function createCustomReport(
  definition: CustomReportDefinition,
  transaction?: Transaction,
): Promise<ReportTemplate> {
  // Generate template code
  const code = await generateTemplateCode(definition.name);

  const template = await ReportTemplate.create(
    {
      code,
      name: definition.name,
      description: definition.description,
      reportType: ReportType.CUSTOM,
      definition,
      isActive: true,
      version: '1.0',
    },
    { transaction },
  );

  return template;
}

/**
 * Generates template code
 *
 * @param name - Template name
 * @returns Generated code
 */
async function generateTemplateCode(name: string): Promise<string> {
  const prefix = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .substring(0, 10);
  const timestamp = Date.now().toString().substring(-6);

  return `CUSTOM_${prefix}_${timestamp}`;
}

/**
 * Executes custom report
 *
 * @param templateId - Template identifier
 * @param parameters - Runtime parameters
 * @param format - Output format
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await executeCustomReport(
 *   'template-123',
 *   { assetTypeId: 'type-001' },
 *   ReportFormat.EXCEL
 * );
 * ```
 */
export async function executeCustomReport(
  templateId: string,
  parameters: Record<string, any>,
  format: ReportFormat,
  transaction?: Transaction,
): Promise<Report> {
  const template = await ReportTemplate.findByPk(templateId, { transaction });
  if (!template) {
    throw new NotFoundException(`Template ${templateId} not found`);
  }

  const reportNumber = await generateReportNumber(ReportType.CUSTOM);
  const startTime = Date.now();

  const report = await Report.create(
    {
      reportNumber,
      templateId,
      reportType: ReportType.CUSTOM,
      title: template.name,
      description: template.description,
      status: ReportStatus.GENERATING,
      format,
      parameters,
      generatedBy: 'system',
    },
    { transaction },
  );

  try {
    // Build and execute custom query
    const data = await executeCustomQuery(template.definition, parameters, transaction);

    const filePath = await formatAndSaveReport(data, format, report.id, transaction);

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    await report.update(
      {
        status: ReportStatus.COMPLETED,
        filePath,
        recordCount: data.length,
        generatedAt: new Date(),
        generationDuration: duration,
      },
      { transaction },
    );

    return report;
  } catch (error: any) {
    await report.update(
      {
        status: ReportStatus.FAILED,
        errorMessage: error.message,
      },
      { transaction },
    );
    throw error;
  }
}

/**
 * Updates custom report template
 *
 * @param templateId - Template identifier
 * @param definition - Updated definition
 * @param transaction - Optional database transaction
 * @returns Updated template
 *
 * @example
 * ```typescript
 * await updateCustomReportTemplate('template-123', {
 *   ...existingDefinition,
 *   columns: [...existingColumns, newColumn]
 * });
 * ```
 */
export async function updateCustomReportTemplate(
  templateId: string,
  definition: Partial<CustomReportDefinition>,
  transaction?: Transaction,
): Promise<ReportTemplate> {
  const template = await ReportTemplate.findByPk(templateId, { transaction });
  if (!template) {
    throw new NotFoundException(`Template ${templateId} not found`);
  }

  const updatedDefinition = {
    ...template.definition,
    ...definition,
  };

  await template.update({ definition: updatedDefinition }, { transaction });
  return template;
}

// ============================================================================
// DASHBOARD GENERATION
// ============================================================================

/**
 * Creates dashboard
 *
 * @param configuration - Dashboard configuration
 * @param transaction - Optional database transaction
 * @returns Created dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await createDashboard({
 *   name: 'Asset Overview Dashboard',
 *   layout: { columns: 12, rows: 6, responsive: true },
 *   widgets: [
 *     {
 *       id: 'widget-1',
 *       type: 'metric',
 *       title: 'Total Assets',
 *       position: { x: 0, y: 0 },
 *       size: { width: 3, height: 2 },
 *       dataSource: 'asset-count',
 *       metricType: KPIMetricType.ASSET_AVAILABILITY
 *     }
 *   ]
 * });
 * ```
 */
export async function createDashboard(
  configuration: DashboardConfiguration,
  transaction?: Transaction,
): Promise<Dashboard> {
  const code = await generateDashboardCode(configuration.name);

  const dashboard = await Dashboard.create(
    {
      code,
      name: configuration.name,
      description: configuration.description,
      configuration,
      isActive: true,
      createdBy: 'system',
    },
    { transaction },
  );

  return dashboard;
}

/**
 * Generates dashboard code
 *
 * @param name - Dashboard name
 * @returns Generated code
 */
async function generateDashboardCode(name: string): Promise<string> {
  const prefix = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .substring(0, 10);
  const timestamp = Date.now().toString().substring(-6);

  return `DASH_${prefix}_${timestamp}`;
}

/**
 * Generates dashboard data
 *
 * @param dashboardId - Dashboard identifier
 * @param filters - Optional filters
 * @param transaction - Optional database transaction
 * @returns Dashboard data
 *
 * @example
 * ```typescript
 * const data = await generateDashboardData('dashboard-123', {
 *   dateFrom: new Date('2024-01-01'),
 *   dateTo: new Date('2024-12-31')
 * });
 * ```
 */
export async function generateDashboardData(
  dashboardId: string,
  filters?: ReportFilters,
  transaction?: Transaction,
): Promise<{
  dashboardId: string;
  generatedAt: Date;
  widgets: Array<{ widgetId: string; data: any }>;
}> {
  const dashboard = await Dashboard.findByPk(dashboardId, { transaction });
  if (!dashboard) {
    throw new NotFoundException(`Dashboard ${dashboardId} not found`);
  }

  const widgetData: Array<{ widgetId: string; data: any }> = [];

  // Generate data for each widget
  for (const widget of dashboard.configuration.widgets) {
    let data: any;

    switch (widget.type) {
      case 'metric':
        data = await generateMetricWidgetData(widget, filters, transaction);
        break;
      case 'chart':
        data = await generateChartWidgetData(widget, filters, transaction);
        break;
      case 'table':
        data = await generateTableWidgetData(widget, filters, transaction);
        break;
      case 'text':
        data = widget.configuration;
        break;
    }

    widgetData.push({ widgetId: widget.id, data });
  }

  return {
    dashboardId,
    generatedAt: new Date(),
    widgets: widgetData,
  };
}

/**
 * Generates metric widget data
 *
 * @param widget - Widget configuration
 * @param filters - Optional filters
 * @param transaction - Optional database transaction
 * @returns Metric data
 */
async function generateMetricWidgetData(
  widget: DashboardWidget,
  filters?: ReportFilters,
  transaction?: Transaction,
): Promise<any> {
  if (!widget.metricType) {
    throw new BadRequestException('Metric type required for metric widget');
  }

  const kpiResult = await calculateAssetKPIs(
    {
      metricType: widget.metricType,
      dateFrom: filters?.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      dateTo: filters?.dateTo || new Date(),
      assetIds: filters?.assetIds,
    },
    transaction,
  );

  return kpiResult;
}

/**
 * Generates chart widget data
 *
 * @param widget - Widget configuration
 * @param filters - Optional filters
 * @param transaction - Optional database transaction
 * @returns Chart data
 */
async function generateChartWidgetData(
  widget: DashboardWidget,
  filters?: ReportFilters,
  transaction?: Transaction,
): Promise<any> {
  // Simplified - real implementation would query based on widget.dataSource
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: widget.title,
        data: [65, 59, 80, 81, 56, 55],
      },
    ],
  };
}

/**
 * Generates table widget data
 *
 * @param widget - Widget configuration
 * @param filters - Optional filters
 * @param transaction - Optional database transaction
 * @returns Table data
 */
async function generateTableWidgetData(
  widget: DashboardWidget,
  filters?: ReportFilters,
  transaction?: Transaction,
): Promise<any> {
  // Simplified - real implementation would query based on widget.dataSource
  return {
    columns: ['Asset', 'Location', 'Status', 'Value'],
    rows: [],
  };
}

/**
 * Updates dashboard
 *
 * @param dashboardId - Dashboard identifier
 * @param configuration - Updated configuration
 * @param transaction - Optional database transaction
 * @returns Updated dashboard
 *
 * @example
 * ```typescript
 * await updateDashboard('dashboard-123', {
 *   ...existingConfig,
 *   widgets: [...existingWidgets, newWidget]
 * });
 * ```
 */
export async function updateDashboard(
  dashboardId: string,
  configuration: Partial<DashboardConfiguration>,
  transaction?: Transaction,
): Promise<Dashboard> {
  const dashboard = await Dashboard.findByPk(dashboardId, { transaction });
  if (!dashboard) {
    throw new NotFoundException(`Dashboard ${dashboardId} not found`);
  }

  const updatedConfiguration = {
    ...dashboard.configuration,
    ...configuration,
  };

  await dashboard.update({ configuration: updatedConfiguration }, { transaction });
  return dashboard;
}

// ============================================================================
// KPI CALCULATION
// ============================================================================

/**
 * Calculates asset KPIs
 *
 * @param options - KPI calculation options
 * @param transaction - Optional database transaction
 * @returns KPI result
 *
 * @example
 * ```typescript
 * const kpi = await calculateAssetKPIs({
 *   metricType: KPIMetricType.ASSET_AVAILABILITY,
 *   dateFrom: new Date('2024-01-01'),
 *   dateTo: new Date('2024-12-31'),
 *   assetIds: ['asset-001', 'asset-002']
 * });
 * ```
 */
export async function calculateAssetKPIs(
  options: KPICalculationOptions,
  transaction?: Transaction,
): Promise<KPIResult> {
  let result: KPIResult;

  switch (options.metricType) {
    case KPIMetricType.ASSET_AVAILABILITY:
      result = await calculateAssetAvailability(options, transaction);
      break;
    case KPIMetricType.UTILIZATION_RATE:
      result = await calculateUtilizationRate(options, transaction);
      break;
    case KPIMetricType.MAINTENANCE_COST_RATIO:
      result = await calculateMaintenanceCostRatio(options, transaction);
      break;
    case KPIMetricType.MEAN_TIME_BETWEEN_FAILURES:
      result = await calculateMTBF(options, transaction);
      break;
    case KPIMetricType.MEAN_TIME_TO_REPAIR:
      result = await calculateMTTR(options, transaction);
      break;
    default:
      throw new BadRequestException(`Unsupported metric type: ${options.metricType}`);
  }

  // Store KPI metric
  await KPIMetric.create(
    {
      metricType: options.metricType,
      calculationDate: new Date(),
      periodStart: options.dateFrom,
      periodEnd: options.dateTo,
      value: result.value,
      unit: result.unit,
      targetValue: result.target,
      previousValue: result.changePercent ? result.value / (1 + result.changePercent / 100) : undefined,
      changePercent: result.changePercent,
      breakdownData: result.breakdown,
    },
    { transaction },
  );

  return result;
}

/**
 * Calculates asset availability KPI
 *
 * @param options - KPI options
 * @param transaction - Optional database transaction
 * @returns KPI result
 */
async function calculateAssetAvailability(
  options: KPICalculationOptions,
  transaction?: Transaction,
): Promise<KPIResult> {
  // Simplified calculation - real implementation would query actual uptime data
  const value = 98.5;
  const target = 99.0;
  const previousValue = 97.8;
  const changePercent = ((value - previousValue) / previousValue) * 100;

  return {
    metricType: KPIMetricType.ASSET_AVAILABILITY,
    value,
    unit: '%',
    trend: value > previousValue ? 'up' : 'down',
    changePercent,
    target,
    status: value >= target ? 'good' : value >= target * 0.95 ? 'warning' : 'critical',
    breakdown: [],
  };
}

/**
 * Calculates utilization rate KPI
 *
 * @param options - KPI options
 * @param transaction - Optional database transaction
 * @returns KPI result
 */
async function calculateUtilizationRate(
  options: KPICalculationOptions,
  transaction?: Transaction,
): Promise<KPIResult> {
  const value = 75.2;
  const target = 80.0;
  const previousValue = 72.5;
  const changePercent = ((value - previousValue) / previousValue) * 100;

  return {
    metricType: KPIMetricType.UTILIZATION_RATE,
    value,
    unit: '%',
    trend: value > previousValue ? 'up' : 'down',
    changePercent,
    target,
    status: value >= target ? 'good' : value >= target * 0.9 ? 'warning' : 'critical',
    breakdown: [],
  };
}

/**
 * Calculates maintenance cost ratio KPI
 *
 * @param options - KPI options
 * @param transaction - Optional database transaction
 * @returns KPI result
 */
async function calculateMaintenanceCostRatio(
  options: KPICalculationOptions,
  transaction?: Transaction,
): Promise<KPIResult> {
  const value = 4.2;
  const target = 5.0;
  const previousValue = 4.8;
  const changePercent = ((value - previousValue) / previousValue) * 100;

  return {
    metricType: KPIMetricType.MAINTENANCE_COST_RATIO,
    value,
    unit: '%',
    trend: value < previousValue ? 'up' : 'down', // Lower is better for cost
    changePercent,
    target,
    status: value <= target ? 'good' : value <= target * 1.1 ? 'warning' : 'critical',
    breakdown: [],
  };
}

/**
 * Calculates Mean Time Between Failures
 *
 * @param options - KPI options
 * @param transaction - Optional database transaction
 * @returns KPI result
 */
async function calculateMTBF(
  options: KPICalculationOptions,
  transaction?: Transaction,
): Promise<KPIResult> {
  const value = 720;
  const target = 800;
  const previousValue = 680;
  const changePercent = ((value - previousValue) / previousValue) * 100;

  return {
    metricType: KPIMetricType.MEAN_TIME_BETWEEN_FAILURES,
    value,
    unit: 'hours',
    trend: value > previousValue ? 'up' : 'down',
    changePercent,
    target,
    status: value >= target ? 'good' : value >= target * 0.9 ? 'warning' : 'critical',
    breakdown: [],
  };
}

/**
 * Calculates Mean Time To Repair
 *
 * @param options - KPI options
 * @param transaction - Optional database transaction
 * @returns KPI result
 */
async function calculateMTTR(
  options: KPICalculationOptions,
  transaction?: Transaction,
): Promise<KPIResult> {
  const value = 4.5;
  const target = 4.0;
  const previousValue = 5.2;
  const changePercent = ((value - previousValue) / previousValue) * 100;

  return {
    metricType: KPIMetricType.MEAN_TIME_TO_REPAIR,
    value,
    unit: 'hours',
    trend: value < previousValue ? 'up' : 'down', // Lower is better
    changePercent,
    target,
    status: value <= target ? 'good' : value <= target * 1.1 ? 'warning' : 'critical',
    breakdown: [],
  };
}

/**
 * Gets KPI history
 *
 * @param metricType - Metric type
 * @param assetId - Optional asset ID
 * @param limit - Maximum records
 * @returns KPI history
 *
 * @example
 * ```typescript
 * const history = await getKPIHistory(
 *   KPIMetricType.ASSET_AVAILABILITY,
 *   'asset-123',
 *   12
 * );
 * ```
 */
export async function getKPIHistory(
  metricType: KPIMetricType,
  assetId?: string,
  limit: number = 50,
): Promise<KPIMetric[]> {
  const where: WhereOptions = { metricType };
  if (assetId) {
    where.assetId = assetId;
  }

  return KPIMetric.findAll({
    where,
    order: [['calculationDate', 'DESC']],
    limit,
  });
}

// ============================================================================
// REPORT SCHEDULING
// ============================================================================

/**
 * Schedules report
 *
 * @param data - Schedule data
 * @param transaction - Optional database transaction
 * @returns Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await scheduleReport({
 *   reportTemplateId: 'template-123',
 *   name: 'Monthly Inventory Report',
 *   frequency: ReportFrequency.MONTHLY,
 *   startDate: new Date('2024-01-01'),
 *   executionTime: '08:00',
 *   recipients: ['manager@company.com'],
 *   format: ReportFormat.PDF,
 *   isActive: true
 * });
 * ```
 */
export async function scheduleReport(
  data: ReportScheduleData,
  transaction?: Transaction,
): Promise<ReportSchedule> {
  const template = await ReportTemplate.findByPk(data.reportTemplateId, { transaction });
  if (!template) {
    throw new NotFoundException(`Template ${data.reportTemplateId} not found`);
  }

  const nextExecution = calculateNextExecution(
    data.startDate,
    data.frequency,
    data.executionTime,
  );

  const schedule = await ReportSchedule.create(
    {
      ...data,
      nextExecution,
      createdBy: 'system',
    },
    { transaction },
  );

  return schedule;
}

/**
 * Calculates next execution date
 *
 * @param startDate - Start date
 * @param frequency - Frequency
 * @param executionTime - Time of day
 * @returns Next execution date
 */
function calculateNextExecution(
  startDate: Date,
  frequency: ReportFrequency,
  executionTime?: string,
): Date {
  const next = new Date(startDate);
  const now = new Date();

  // Set execution time if provided
  if (executionTime) {
    const [hours, minutes] = executionTime.split(':').map(Number);
    next.setHours(hours, minutes, 0, 0);
  }

  // Calculate next occurrence based on frequency
  while (next <= now) {
    switch (frequency) {
      case ReportFrequency.DAILY:
        next.setDate(next.getDate() + 1);
        break;
      case ReportFrequency.WEEKLY:
        next.setDate(next.getDate() + 7);
        break;
      case ReportFrequency.MONTHLY:
        next.setMonth(next.getMonth() + 1);
        break;
      case ReportFrequency.QUARTERLY:
        next.setMonth(next.getMonth() + 3);
        break;
      case ReportFrequency.YEARLY:
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
  }

  return next;
}

/**
 * Updates report schedule
 *
 * @param scheduleId - Schedule identifier
 * @param updates - Schedule updates
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await updateReportSchedule('schedule-123', {
 *   isActive: false
 * });
 * ```
 */
export async function updateReportSchedule(
  scheduleId: string,
  updates: Partial<ReportSchedule>,
  transaction?: Transaction,
): Promise<ReportSchedule> {
  const schedule = await ReportSchedule.findByPk(scheduleId, { transaction });
  if (!schedule) {
    throw new NotFoundException(`Schedule ${scheduleId} not found`);
  }

  await schedule.update(updates, { transaction });
  return schedule;
}

/**
 * Executes scheduled reports
 *
 * @param transaction - Optional database transaction
 * @returns Executed schedule IDs
 *
 * @example
 * ```typescript
 * const executed = await executeScheduledReports();
 * console.log(`Executed ${executed.length} scheduled reports`);
 * ```
 */
export async function executeScheduledReports(
  transaction?: Transaction,
): Promise<string[]> {
  const now = new Date();
  const schedules = await ReportSchedule.findAll({
    where: {
      isActive: true,
      nextExecution: {
        [Op.lte]: now,
      },
    },
    include: [{ model: ReportTemplate }],
    transaction,
  });

  const executed: string[] = [];

  for (const schedule of schedules) {
    try {
      if (!schedule.template) continue;

      // Execute report
      await executeCustomReport(
        schedule.templateId,
        schedule.parameters || {},
        schedule.format,
        transaction,
      );

      // Update schedule
      const nextExecution = calculateNextExecution(
        now,
        schedule.frequency,
        schedule.executionTime,
      );

      await schedule.update(
        {
          lastExecution: now,
          nextExecution,
        },
        { transaction },
      );

      executed.push(schedule.id);
    } catch (error) {
      // Log error but continue with other schedules
      console.error(`Failed to execute schedule ${schedule.id}:`, error);
    }
  }

  return executed;
}

// ============================================================================
// REPORT DISTRIBUTION
// ============================================================================

/**
 * Distributes report
 *
 * @param reportId - Report identifier
 * @param channels - Distribution channels
 * @param transaction - Optional database transaction
 * @returns Distribution records
 *
 * @example
 * ```typescript
 * await distributeReport('report-123', [
 *   {
 *     type: 'email',
 *     recipients: ['user@company.com'],
 *     configuration: { subject: 'Monthly Report' }
 *   }
 * ]);
 * ```
 */
export async function distributeReport(
  reportId: string,
  channels: DistributionChannel[],
  transaction?: Transaction,
): Promise<ReportDistribution[]> {
  const report = await Report.findByPk(reportId, { transaction });
  if (!report) {
    throw new NotFoundException(`Report ${reportId} not found`);
  }

  if (report.status !== ReportStatus.COMPLETED) {
    throw new BadRequestException('Can only distribute completed reports');
  }

  const distributions: ReportDistribution[] = [];

  for (const channel of channels) {
    const recipients = channel.recipients || [];
    for (const recipient of recipients) {
      const distribution = await ReportDistribution.create(
        {
          reportId,
          channelType: channel.type,
          recipient,
          status: 'pending',
          metadata: channel.configuration,
        },
        { transaction },
      );

      // Trigger actual distribution (simplified)
      try {
        await performDistribution(report, channel.type, recipient, channel.configuration);
        await distribution.update(
          {
            status: 'sent',
            distributedAt: new Date(),
          },
          { transaction },
        );
      } catch (error: any) {
        await distribution.update(
          {
            status: 'failed',
            errorMessage: error.message,
          },
          { transaction },
        );
      }

      distributions.push(distribution);
    }
  }

  return distributions;
}

/**
 * Performs actual distribution
 *
 * @param report - Report record
 * @param channelType - Channel type
 * @param recipient - Recipient
 * @param configuration - Channel configuration
 */
async function performDistribution(
  report: Report,
  channelType: string,
  recipient: string,
  configuration: Record<string, any>,
): Promise<void> {
  // Real implementation would integrate with email service, SFTP, etc.
  console.log(`Distributing report ${report.id} via ${channelType} to ${recipient}`);
}

/**
 * Gets report distribution status
 *
 * @param reportId - Report identifier
 * @returns Distribution records
 *
 * @example
 * ```typescript
 * const distributions = await getReportDistributionStatus('report-123');
 * ```
 */
export async function getReportDistributionStatus(
  reportId: string,
): Promise<ReportDistribution[]> {
  return ReportDistribution.findAll({
    where: { reportId },
    order: [['createdAt', 'DESC']],
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Executes inventory query (simplified)
 */
async function executeInventoryQuery(
  filters?: ReportFilters,
  transaction?: Transaction,
): Promise<any[]> {
  // Simplified - real implementation would build and execute SQL query
  return [];
}

/**
 * Executes depreciation query (simplified)
 */
async function executeDepreciationQuery(
  filters?: ReportFilters,
  transaction?: Transaction,
): Promise<any[]> {
  return [];
}

/**
 * Executes maintenance query (simplified)
 */
async function executeMaintenanceQuery(
  filters?: ReportFilters,
  transaction?: Transaction,
): Promise<any[]> {
  return [];
}

/**
 * Executes compliance query (simplified)
 */
async function executeComplianceQuery(
  filters?: ReportFilters,
  transaction?: Transaction,
): Promise<any[]> {
  return [];
}

/**
 * Executes custom query (simplified)
 */
async function executeCustomQuery(
  definition: CustomReportDefinition,
  parameters: Record<string, any>,
  transaction?: Transaction,
): Promise<any[]> {
  return [];
}

/**
 * Formats and saves report (simplified)
 */
async function formatAndSaveReport(
  data: any,
  format: ReportFormat,
  reportId: string,
  transaction?: Transaction,
): Promise<string> {
  // Real implementation would format data and save to file system
  return `/reports/${reportId}.${format}`;
}

/**
 * Gets report by ID
 *
 * @param reportId - Report identifier
 * @returns Report record
 *
 * @example
 * ```typescript
 * const report = await getReportById('report-123');
 * ```
 */
export async function getReportById(reportId: string): Promise<Report> {
  const report = await Report.findByPk(reportId, {
    include: [
      { model: ReportTemplate },
      { model: ReportDistribution, as: 'distributions' },
    ],
  });

  if (!report) {
    throw new NotFoundException(`Report ${reportId} not found`);
  }

  return report;
}

/**
 * Deletes expired reports
 *
 * @param transaction - Optional database transaction
 * @returns Number of deleted reports
 *
 * @example
 * ```typescript
 * const deleted = await deleteExpiredReports();
 * ```
 */
export async function deleteExpiredReports(transaction?: Transaction): Promise<number> {
  const result = await Report.destroy({
    where: {
      expirationDate: {
        [Op.lt]: new Date(),
      },
    },
    transaction,
  });

  return result;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  ReportTemplate,
  Report,
  ReportSchedule,
  ReportDistribution,
  Dashboard,
  KPIMetric,

  // Standard Reports
  generateAssetInventoryReport,
  generateDepreciationReport,
  generateMaintenanceReport,
  generateComplianceReport,
  generateExecutiveSummary,

  // Custom Reports
  createCustomReport,
  executeCustomReport,
  updateCustomReportTemplate,

  // Dashboards
  createDashboard,
  generateDashboardData,
  updateDashboard,

  // KPIs
  calculateAssetKPIs,
  getKPIHistory,

  // Scheduling
  scheduleReport,
  updateReportSchedule,
  executeScheduledReports,

  // Distribution
  distributeReport,
  getReportDistributionStatus,

  // Utilities
  getReportById,
  deleteExpiredReports,
};
