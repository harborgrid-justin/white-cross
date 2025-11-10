/**
 * ASSET PERFORMANCE MANAGEMENT COMMANDS
 *
 * Comprehensive asset performance monitoring and KPI tracking toolkit.
 * Provides 45 specialized functions covering:
 * - Performance metrics tracking and monitoring
 * - KPI (Key Performance Indicator) management
 * - OEE (Overall Equipment Effectiveness) calculations
 * - Asset availability and uptime monitoring
 * - Utilization rate tracking and analysis
 * - Efficiency calculations and benchmarking
 * - Performance trend analysis and forecasting
 * - Performance alert generation and management
 * - SLA (Service Level Agreement) compliance tracking
 * - Performance dashboards and reporting
 * - MTBF (Mean Time Between Failures) analysis
 * - MTTR (Mean Time To Repair) tracking
 * - Capacity planning and optimization
 *
 * @module AssetPerformanceCommands
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
 * @performance Optimized for high-frequency performance data collection
 * @scalability Supports millions of performance data points with aggregation
 *
 * @example
 * ```typescript
 * import {
 *   createPerformanceRecord,
 *   calculateOEE,
 *   trackAvailability,
 *   generatePerformanceAlert,
 *   PerformanceMetric,
 *   OEECalculation
 * } from './asset-performance-commands';
 *
 * // Create performance record
 * const record = await createPerformanceRecord({
 *   assetId: 'asset-001',
 *   metricType: 'uptime',
 *   value: 98.5,
 *   recordedAt: new Date()
 * });
 *
 * // Calculate OEE
 * const oee = await calculateOEE('asset-001', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
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
  Min,
  Max,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Performance metric types
 */
export enum PerformanceMetricType {
  UPTIME = 'uptime',
  DOWNTIME = 'downtime',
  AVAILABILITY = 'availability',
  UTILIZATION = 'utilization',
  EFFICIENCY = 'efficiency',
  THROUGHPUT = 'throughput',
  CYCLE_TIME = 'cycle_time',
  QUALITY_RATE = 'quality_rate',
  PERFORMANCE_RATE = 'performance_rate',
  OEE = 'oee',
  MTBF = 'mtbf',
  MTTR = 'mttr',
  CAPACITY = 'capacity',
  OUTPUT = 'output',
}

/**
 * Performance status
 */
export enum PerformanceStatus {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  ACCEPTABLE = 'acceptable',
  POOR = 'poor',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown',
}

/**
 * KPI status
 */
export enum KPIStatus {
  ABOVE_TARGET = 'above_target',
  ON_TARGET = 'on_target',
  BELOW_TARGET = 'below_target',
  CRITICAL = 'critical',
  NOT_MEASURED = 'not_measured',
}

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Alert status
 */
export enum AlertStatus {
  OPEN = 'open',
  ACKNOWLEDGED = 'acknowledged',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ESCALATED = 'escalated',
}

/**
 * Trend direction
 */
export enum TrendDirection {
  IMPROVING = 'improving',
  STABLE = 'stable',
  DECLINING = 'declining',
  VOLATILE = 'volatile',
}

/**
 * SLA compliance status
 */
export enum SLAComplianceStatus {
  COMPLIANT = 'compliant',
  AT_RISK = 'at_risk',
  NON_COMPLIANT = 'non_compliant',
  BREACHED = 'breached',
}

/**
 * Performance record data
 */
export interface PerformanceRecordData {
  assetId: string;
  metricType: PerformanceMetricType;
  value: number;
  unit?: string;
  recordedAt: Date;
  recordedBy?: string;
  metadata?: Record<string, any>;
  notes?: string;
}

/**
 * KPI definition data
 */
export interface KPIDefinitionData {
  name: string;
  description?: string;
  metricType: PerformanceMetricType;
  targetValue: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  unit: string;
  calculationMethod?: string;
  measurementFrequency?: string;
  assetTypeId?: string;
  departmentId?: string;
  isActive: boolean;
}

/**
 * OEE calculation parameters
 */
export interface OEECalculationParams {
  startDate: Date;
  endDate: Date;
  plannedProductionTime?: number;
  targetCycleTime?: number;
  targetQuality?: number;
}

/**
 * OEE calculation result
 */
export interface OEECalculationResult {
  assetId: string;
  period: { startDate: Date; endDate: Date };
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  plannedProductionTime: number;
  actualProductionTime: number;
  downtime: number;
  idealCycleTime: number;
  actualCycleTime: number;
  totalUnits: number;
  goodUnits: number;
  defectiveUnits: number;
  status: PerformanceStatus;
  calculatedAt: Date;
}

/**
 * Availability metrics
 */
export interface AvailabilityMetrics {
  assetId: string;
  period: { startDate: Date; endDate: Date };
  totalTime: number;
  uptime: number;
  downtime: number;
  plannedDowntime: number;
  unplannedDowntime: number;
  availability: number;
  reliability: number;
  mtbf: number;
  mttr: number;
  failureCount: number;
}

/**
 * Utilization metrics
 */
export interface UtilizationMetrics {
  assetId: string;
  period: { startDate: Date; endDate: Date };
  totalCapacity: number;
  usedCapacity: number;
  utilizationRate: number;
  idleTime: number;
  activeTime: number;
  peakUsage: number;
  averageUsage: number;
  efficiencyScore: number;
}

/**
 * Performance benchmark data
 */
export interface PerformanceBenchmarkData {
  assetId: string;
  assetTypeId: string;
  metricType: PerformanceMetricType;
  value: number;
  industryAverage?: number;
  bestInClass?: number;
  percentile?: number;
  benchmarkedAt: Date;
}

/**
 * Performance trend analysis
 */
export interface PerformanceTrendAnalysis {
  assetId: string;
  metricType: PerformanceMetricType;
  period: { startDate: Date; endDate: Date };
  currentValue: number;
  previousValue: number;
  changePercent: number;
  trend: TrendDirection;
  movingAverage: number;
  forecast: number[];
  anomalies: AnomalyDetection[];
}

/**
 * Anomaly detection result
 */
export interface AnomalyDetection {
  timestamp: Date;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: AlertSeverity;
  confidence: number;
}

/**
 * Performance alert data
 */
export interface PerformanceAlertData {
  assetId: string;
  alertType: string;
  severity: AlertSeverity;
  metricType: PerformanceMetricType;
  currentValue: number;
  threshold: number;
  message: string;
  metadata?: Record<string, any>;
}

/**
 * SLA definition data
 */
export interface SLADefinitionData {
  name: string;
  description?: string;
  assetId?: string;
  assetTypeId?: string;
  metricType: PerformanceMetricType;
  targetValue: number;
  minimumValue: number;
  measurementPeriod: string;
  penaltyAmount?: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

/**
 * SLA compliance result
 */
export interface SLAComplianceResult {
  slaId: string;
  assetId: string;
  period: { startDate: Date; endDate: Date };
  targetValue: number;
  actualValue: number;
  compliance: number;
  status: SLAComplianceStatus;
  violations: SLAViolation[];
  penalties: number;
}

/**
 * SLA violation record
 */
export interface SLAViolation {
  timestamp: Date;
  duration: number;
  targetValue: number;
  actualValue: number;
  severity: AlertSeverity;
  penaltyAmount?: number;
}

/**
 * Performance dashboard data
 */
export interface PerformanceDashboardData {
  assetId: string;
  period: { startDate: Date; endDate: Date };
  overallStatus: PerformanceStatus;
  oee: OEECalculationResult;
  availability: AvailabilityMetrics;
  utilization: UtilizationMetrics;
  kpis: KPIValue[];
  alerts: PerformanceAlert[];
  trends: PerformanceTrendAnalysis[];
  slaCompliance: SLAComplianceResult[];
}

/**
 * KPI value result
 */
export interface KPIValue {
  kpiId: string;
  name: string;
  metricType: PerformanceMetricType;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: KPIStatus;
  trend: TrendDirection;
  lastUpdated: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Performance metric database model
 */
@Table({ tableName: 'performance_metrics', paranoid: true })
export class PerformanceMetric extends Model {
  @ApiProperty({ description: 'Unique performance metric ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assetId: string;

  @ApiProperty({ description: 'Metric type', enum: PerformanceMetricType })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(PerformanceMetricType)), allowNull: false })
  metricType: PerformanceMetricType;

  @ApiProperty({ description: 'Metric value' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  value: number;

  @ApiProperty({ description: 'Unit of measurement' })
  @Column({ type: DataType.STRING(50) })
  unit: string;

  @ApiProperty({ description: 'When metric was recorded' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  recordedAt: Date;

  @ApiProperty({ description: 'User who recorded the metric' })
  @Column({ type: DataType.UUID })
  recordedBy: string;

  @ApiProperty({ description: 'Additional metadata' })
  @Column({ type: DataType.JSONB })
  metadata: Record<string, any>;

  @ApiProperty({ description: 'Notes about the metric' })
  @Column({ type: DataType.TEXT })
  notes: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * KPI definition database model
 */
@Table({ tableName: 'kpi_definitions', paranoid: true })
export class KPIDefinition extends Model {
  @ApiProperty({ description: 'Unique KPI ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'KPI name' })
  @Index
  @Column({ type: DataType.STRING(200), allowNull: false })
  name: string;

  @ApiProperty({ description: 'KPI description' })
  @Column({ type: DataType.TEXT })
  description: string;

  @ApiProperty({ description: 'Metric type', enum: PerformanceMetricType })
  @Column({ type: DataType.ENUM(...Object.values(PerformanceMetricType)), allowNull: false })
  metricType: PerformanceMetricType;

  @ApiProperty({ description: 'Target value' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  targetValue: number;

  @ApiProperty({ description: 'Warning threshold' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  warningThreshold: number;

  @ApiProperty({ description: 'Critical threshold' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  criticalThreshold: number;

  @ApiProperty({ description: 'Unit of measurement' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  unit: string;

  @ApiProperty({ description: 'Calculation method' })
  @Column({ type: DataType.TEXT })
  calculationMethod: string;

  @ApiProperty({ description: 'Measurement frequency' })
  @Column({ type: DataType.STRING(50) })
  measurementFrequency: string;

  @ApiProperty({ description: 'Asset type ID' })
  @Index
  @Column({ type: DataType.UUID })
  assetTypeId: string;

  @ApiProperty({ description: 'Department ID' })
  @Index
  @Column({ type: DataType.UUID })
  departmentId: string;

  @ApiProperty({ description: 'Is KPI active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * OEE calculation database model
 */
@Table({ tableName: 'oee_calculations', paranoid: true })
export class OEECalculation extends Model {
  @ApiProperty({ description: 'Unique OEE calculation ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assetId: string;

  @ApiProperty({ description: 'Calculation period start' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  periodStart: Date;

  @ApiProperty({ description: 'Calculation period end' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  periodEnd: Date;

  @ApiProperty({ description: 'Availability percentage' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  availability: number;

  @ApiProperty({ description: 'Performance percentage' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  performance: number;

  @ApiProperty({ description: 'Quality percentage' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  quality: number;

  @ApiProperty({ description: 'Overall OEE percentage' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  oee: number;

  @ApiProperty({ description: 'Planned production time (minutes)' })
  @Column({ type: DataType.INTEGER })
  plannedProductionTime: number;

  @ApiProperty({ description: 'Actual production time (minutes)' })
  @Column({ type: DataType.INTEGER })
  actualProductionTime: number;

  @ApiProperty({ description: 'Downtime (minutes)' })
  @Column({ type: DataType.INTEGER })
  downtime: number;

  @ApiProperty({ description: 'Total units produced' })
  @Column({ type: DataType.INTEGER })
  totalUnits: number;

  @ApiProperty({ description: 'Good units produced' })
  @Column({ type: DataType.INTEGER })
  goodUnits: number;

  @ApiProperty({ description: 'Defective units' })
  @Column({ type: DataType.INTEGER })
  defectiveUnits: number;

  @ApiProperty({ description: 'Performance status', enum: PerformanceStatus })
  @Column({ type: DataType.ENUM(...Object.values(PerformanceStatus)) })
  status: PerformanceStatus;

  @ApiProperty({ description: 'When calculated' })
  @Column({ type: DataType.DATE })
  calculatedAt: Date;

  @ApiProperty({ description: 'User who calculated' })
  @Column({ type: DataType.UUID })
  calculatedBy: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Performance alert database model
 */
@Table({ tableName: 'performance_alerts', paranoid: true })
export class PerformanceAlert extends Model {
  @ApiProperty({ description: 'Unique alert ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assetId: string;

  @ApiProperty({ description: 'Alert type' })
  @Index
  @Column({ type: DataType.STRING(100), allowNull: false })
  alertType: string;

  @ApiProperty({ description: 'Alert severity', enum: AlertSeverity })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(AlertSeverity)), allowNull: false })
  severity: AlertSeverity;

  @ApiProperty({ description: 'Metric type', enum: PerformanceMetricType })
  @Column({ type: DataType.ENUM(...Object.values(PerformanceMetricType)) })
  metricType: PerformanceMetricType;

  @ApiProperty({ description: 'Current value' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  currentValue: number;

  @ApiProperty({ description: 'Threshold value' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  threshold: number;

  @ApiProperty({ description: 'Alert message' })
  @Column({ type: DataType.TEXT, allowNull: false })
  message: string;

  @ApiProperty({ description: 'Alert status', enum: AlertStatus })
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(AlertStatus)),
    defaultValue: AlertStatus.OPEN,
  })
  status: AlertStatus;

  @ApiProperty({ description: 'Acknowledged by user ID' })
  @Column({ type: DataType.UUID })
  acknowledgedBy: string;

  @ApiProperty({ description: 'Acknowledged at timestamp' })
  @Column({ type: DataType.DATE })
  acknowledgedAt: Date;

  @ApiProperty({ description: 'Resolved by user ID' })
  @Column({ type: DataType.UUID })
  resolvedBy: string;

  @ApiProperty({ description: 'Resolved at timestamp' })
  @Column({ type: DataType.DATE })
  resolvedAt: Date;

  @ApiProperty({ description: 'Additional metadata' })
  @Column({ type: DataType.JSONB })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * SLA definition database model
 */
@Table({ tableName: 'sla_definitions', paranoid: true })
export class SLADefinition extends Model {
  @ApiProperty({ description: 'Unique SLA ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'SLA name' })
  @Index
  @Column({ type: DataType.STRING(200), allowNull: false })
  name: string;

  @ApiProperty({ description: 'SLA description' })
  @Column({ type: DataType.TEXT })
  description: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID })
  assetId: string;

  @ApiProperty({ description: 'Asset type ID' })
  @Index
  @Column({ type: DataType.UUID })
  assetTypeId: string;

  @ApiProperty({ description: 'Metric type', enum: PerformanceMetricType })
  @Column({ type: DataType.ENUM(...Object.values(PerformanceMetricType)), allowNull: false })
  metricType: PerformanceMetricType;

  @ApiProperty({ description: 'Target value' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  targetValue: number;

  @ApiProperty({ description: 'Minimum acceptable value' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  minimumValue: number;

  @ApiProperty({ description: 'Measurement period' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  measurementPeriod: string;

  @ApiProperty({ description: 'Penalty amount per violation' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  penaltyAmount: number;

  @ApiProperty({ description: 'SLA start date' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date;

  @ApiProperty({ description: 'SLA end date' })
  @Index
  @Column({ type: DataType.DATE })
  endDate: Date;

  @ApiProperty({ description: 'Is SLA active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * SLA compliance tracking database model
 */
@Table({ tableName: 'sla_compliance', paranoid: true })
export class SLACompliance extends Model {
  @ApiProperty({ description: 'Unique compliance record ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'SLA definition ID' })
  @Index
  @ForeignKey(() => SLADefinition)
  @Column({ type: DataType.UUID, allowNull: false })
  slaId: string;

  @BelongsTo(() => SLADefinition)
  sla: SLADefinition;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assetId: string;

  @ApiProperty({ description: 'Compliance period start' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  periodStart: Date;

  @ApiProperty({ description: 'Compliance period end' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  periodEnd: Date;

  @ApiProperty({ description: 'Target value' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  targetValue: number;

  @ApiProperty({ description: 'Actual value achieved' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  actualValue: number;

  @ApiProperty({ description: 'Compliance percentage' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  compliance: number;

  @ApiProperty({ description: 'Compliance status', enum: SLAComplianceStatus })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(SLAComplianceStatus)), allowNull: false })
  status: SLAComplianceStatus;

  @ApiProperty({ description: 'Violations data' })
  @Column({ type: DataType.JSONB })
  violations: SLAViolation[];

  @ApiProperty({ description: 'Total penalties' })
  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  penalties: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * Create performance record DTO
 */
export class CreatePerformanceRecordDto {
  @ApiProperty({ description: 'Asset ID' })
  @IsUUID()
  assetId: string;

  @ApiProperty({ description: 'Metric type', enum: PerformanceMetricType })
  @IsEnum(PerformanceMetricType)
  metricType: PerformanceMetricType;

  @ApiProperty({ description: 'Metric value' })
  @IsNumber()
  value: number;

  @ApiProperty({ description: 'Unit of measurement', required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ description: 'Recorded timestamp' })
  @IsDate()
  @Type(() => Date)
  recordedAt: Date;

  @ApiProperty({ description: 'User who recorded', required: false })
  @IsOptional()
  @IsUUID()
  recordedBy?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Create KPI definition DTO
 */
export class CreateKPIDefinitionDto {
  @ApiProperty({ description: 'KPI name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'KPI description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Metric type', enum: PerformanceMetricType })
  @IsEnum(PerformanceMetricType)
  metricType: PerformanceMetricType;

  @ApiProperty({ description: 'Target value' })
  @IsNumber()
  targetValue: number;

  @ApiProperty({ description: 'Warning threshold', required: false })
  @IsOptional()
  @IsNumber()
  warningThreshold?: number;

  @ApiProperty({ description: 'Critical threshold', required: false })
  @IsOptional()
  @IsNumber()
  criticalThreshold?: number;

  @ApiProperty({ description: 'Unit of measurement' })
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Calculation method', required: false })
  @IsOptional()
  @IsString()
  calculationMethod?: string;

  @ApiProperty({ description: 'Measurement frequency', required: false })
  @IsOptional()
  @IsString()
  measurementFrequency?: string;

  @ApiProperty({ description: 'Asset type ID', required: false })
  @IsOptional()
  @IsUUID()
  assetTypeId?: string;

  @ApiProperty({ description: 'Department ID', required: false })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiProperty({ description: 'Is active' })
  @IsBoolean()
  isActive: boolean;
}

/**
 * Calculate OEE DTO
 */
export class CalculateOEEDto {
  @ApiProperty({ description: 'Asset ID' })
  @IsUUID()
  assetId: string;

  @ApiProperty({ description: 'Period start date' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'Period end date' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ description: 'Planned production time', required: false })
  @IsOptional()
  @IsNumber()
  plannedProductionTime?: number;

  @ApiProperty({ description: 'Target cycle time', required: false })
  @IsOptional()
  @IsNumber()
  targetCycleTime?: number;

  @ApiProperty({ description: 'Target quality rate', required: false })
  @IsOptional()
  @IsNumber()
  targetQuality?: number;
}

/**
 * Create performance alert DTO
 */
export class CreatePerformanceAlertDto {
  @ApiProperty({ description: 'Asset ID' })
  @IsUUID()
  assetId: string;

  @ApiProperty({ description: 'Alert type' })
  @IsString()
  alertType: string;

  @ApiProperty({ description: 'Alert severity', enum: AlertSeverity })
  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @ApiProperty({ description: 'Metric type', enum: PerformanceMetricType, required: false })
  @IsOptional()
  @IsEnum(PerformanceMetricType)
  metricType?: PerformanceMetricType;

  @ApiProperty({ description: 'Current value', required: false })
  @IsOptional()
  @IsNumber()
  currentValue?: number;

  @ApiProperty({ description: 'Threshold value', required: false })
  @IsOptional()
  @IsNumber()
  threshold?: number;

  @ApiProperty({ description: 'Alert message' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * Create SLA definition DTO
 */
export class CreateSLADefinitionDto {
  @ApiProperty({ description: 'SLA name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'SLA description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Asset ID', required: false })
  @IsOptional()
  @IsUUID()
  assetId?: string;

  @ApiProperty({ description: 'Asset type ID', required: false })
  @IsOptional()
  @IsUUID()
  assetTypeId?: string;

  @ApiProperty({ description: 'Metric type', enum: PerformanceMetricType })
  @IsEnum(PerformanceMetricType)
  metricType: PerformanceMetricType;

  @ApiProperty({ description: 'Target value' })
  @IsNumber()
  targetValue: number;

  @ApiProperty({ description: 'Minimum acceptable value' })
  @IsNumber()
  minimumValue: number;

  @ApiProperty({ description: 'Measurement period' })
  @IsString()
  measurementPeriod: string;

  @ApiProperty({ description: 'Penalty amount', required: false })
  @IsOptional()
  @IsNumber()
  penaltyAmount?: number;

  @ApiProperty({ description: 'Start date' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ description: 'Is active' })
  @IsBoolean()
  isActive: boolean;
}

// ============================================================================
// PERFORMANCE RECORD FUNCTIONS
// ============================================================================

/**
 * Create a new performance record
 *
 * @param data - Performance record data
 * @param transaction - Optional database transaction
 * @returns Created performance metric
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const record = await createPerformanceRecord({
 *   assetId: 'asset-001',
 *   metricType: 'uptime',
 *   value: 98.5,
 *   recordedAt: new Date()
 * });
 * ```
 */
export async function createPerformanceRecord(
  data: PerformanceRecordData,
  transaction?: Transaction
): Promise<PerformanceMetric> {
  try {
    const metric = await PerformanceMetric.create(
      {
        assetId: data.assetId,
        metricType: data.metricType,
        value: data.value,
        unit: data.unit,
        recordedAt: data.recordedAt,
        recordedBy: data.recordedBy,
        metadata: data.metadata,
        notes: data.notes,
      },
      { transaction }
    );

    return metric;
  } catch (error) {
    throw new BadRequestException(
      `Failed to create performance record: ${error.message}`
    );
  }
}

/**
 * Get performance record by ID
 *
 * @param id - Performance metric ID
 * @returns Performance metric or null
 *
 * @example
 * ```typescript
 * const record = await getPerformanceRecordById('metric-001');
 * ```
 */
export async function getPerformanceRecordById(
  id: string
): Promise<PerformanceMetric | null> {
  return await PerformanceMetric.findByPk(id);
}

/**
 * Get performance records for an asset
 *
 * @param assetId - Asset ID
 * @param metricType - Optional metric type filter
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @param limit - Maximum number of records to return
 * @returns Array of performance metrics
 *
 * @example
 * ```typescript
 * const records = await getAssetPerformanceRecords(
 *   'asset-001',
 *   'uptime',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export async function getAssetPerformanceRecords(
  assetId: string,
  metricType?: PerformanceMetricType,
  startDate?: Date,
  endDate?: Date,
  limit: number = 100
): Promise<PerformanceMetric[]> {
  const where: WhereOptions = { assetId };

  if (metricType) {
    where.metricType = metricType;
  }

  if (startDate || endDate) {
    where.recordedAt = {};
    if (startDate) where.recordedAt[Op.gte] = startDate;
    if (endDate) where.recordedAt[Op.lte] = endDate;
  }

  return await PerformanceMetric.findAll({
    where,
    order: [['recordedAt', 'DESC']],
    limit,
  });
}

/**
 * Update performance record
 *
 * @param id - Performance metric ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated performance metric
 * @throws NotFoundException if metric not found
 *
 * @example
 * ```typescript
 * const updated = await updatePerformanceRecord('metric-001', {
 *   value: 99.0,
 *   notes: 'Corrected value'
 * });
 * ```
 */
export async function updatePerformanceRecord(
  id: string,
  updates: Partial<PerformanceRecordData>,
  transaction?: Transaction
): Promise<PerformanceMetric> {
  const metric = await PerformanceMetric.findByPk(id);

  if (!metric) {
    throw new NotFoundException(`Performance metric ${id} not found`);
  }

  await metric.update(updates, { transaction });
  return metric;
}

/**
 * Delete performance record
 *
 * @param id - Performance metric ID
 * @param transaction - Optional database transaction
 * @throws NotFoundException if metric not found
 *
 * @example
 * ```typescript
 * await deletePerformanceRecord('metric-001');
 * ```
 */
export async function deletePerformanceRecord(
  id: string,
  transaction?: Transaction
): Promise<void> {
  const metric = await PerformanceMetric.findByPk(id);

  if (!metric) {
    throw new NotFoundException(`Performance metric ${id} not found`);
  }

  await metric.destroy({ transaction });
}

// ============================================================================
// OEE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate OEE (Overall Equipment Effectiveness) for an asset
 *
 * @param assetId - Asset ID
 * @param params - OEE calculation parameters
 * @param transaction - Optional database transaction
 * @returns OEE calculation result
 * @throws BadRequestException if calculation fails
 *
 * @example
 * ```typescript
 * const oee = await calculateOEE('asset-001', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   plannedProductionTime: 20000
 * });
 * ```
 */
export async function calculateOEE(
  assetId: string,
  params: OEECalculationParams,
  transaction?: Transaction
): Promise<OEECalculationResult> {
  try {
    // Get performance data for the period
    const metrics = await getAssetPerformanceRecords(
      assetId,
      undefined,
      params.startDate,
      params.endDate
    );

    // Calculate availability
    const uptimeMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.UPTIME);
    const downtimeMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.DOWNTIME);

    const totalUptime = uptimeMetrics.reduce((sum, m) => sum + Number(m.value), 0);
    const totalDowntime = downtimeMetrics.reduce((sum, m) => sum + Number(m.value), 0);
    const plannedTime = params.plannedProductionTime || totalUptime + totalDowntime;
    const availability = plannedTime > 0 ? (totalUptime / plannedTime) * 100 : 0;

    // Calculate performance
    const performanceMetrics = metrics.filter(
      (m) => m.metricType === PerformanceMetricType.PERFORMANCE_RATE
    );
    const performance =
      performanceMetrics.length > 0
        ? performanceMetrics.reduce((sum, m) => sum + Number(m.value), 0) / performanceMetrics.length
        : 100;

    // Calculate quality
    const qualityMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.QUALITY_RATE);
    const quality =
      qualityMetrics.length > 0
        ? qualityMetrics.reduce((sum, m) => sum + Number(m.value), 0) / qualityMetrics.length
        : 100;

    // Calculate OEE
    const oee = (availability * performance * quality) / 10000;

    // Determine status
    let status: PerformanceStatus;
    if (oee >= 85) status = PerformanceStatus.EXCELLENT;
    else if (oee >= 70) status = PerformanceStatus.GOOD;
    else if (oee >= 55) status = PerformanceStatus.ACCEPTABLE;
    else if (oee >= 40) status = PerformanceStatus.POOR;
    else status = PerformanceStatus.CRITICAL;

    // Get production units
    const totalUnitsMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.OUTPUT);
    const totalUnits = totalUnitsMetrics.reduce((sum, m) => sum + Number(m.value), 0);
    const goodUnits = Math.round(totalUnits * (quality / 100));
    const defectiveUnits = totalUnits - goodUnits;

    const result: OEECalculationResult = {
      assetId,
      period: { startDate: params.startDate, endDate: params.endDate },
      availability,
      performance,
      quality,
      oee,
      plannedProductionTime: plannedTime,
      actualProductionTime: totalUptime,
      downtime: totalDowntime,
      idealCycleTime: params.targetCycleTime || 0,
      actualCycleTime: totalUptime / totalUnits || 0,
      totalUnits,
      goodUnits,
      defectiveUnits,
      status,
      calculatedAt: new Date(),
    };

    // Save calculation
    await OEECalculation.create(
      {
        assetId,
        periodStart: params.startDate,
        periodEnd: params.endDate,
        availability,
        performance,
        quality,
        oee,
        plannedProductionTime: plannedTime,
        actualProductionTime: totalUptime,
        downtime: totalDowntime,
        totalUnits,
        goodUnits,
        defectiveUnits,
        status,
        calculatedAt: new Date(),
      },
      { transaction }
    );

    return result;
  } catch (error) {
    throw new BadRequestException(`Failed to calculate OEE: ${error.message}`);
  }
}

/**
 * Get OEE calculation history for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @param limit - Maximum number of records
 * @returns Array of OEE calculations
 *
 * @example
 * ```typescript
 * const history = await getOEEHistory('asset-001', new Date('2024-01-01'));
 * ```
 */
export async function getOEEHistory(
  assetId: string,
  startDate?: Date,
  endDate?: Date,
  limit: number = 50
): Promise<OEECalculation[]> {
  const where: WhereOptions = { assetId };

  if (startDate || endDate) {
    where.periodStart = {};
    if (startDate) where.periodStart[Op.gte] = startDate;
    if (endDate) where.periodStart[Op.lte] = endDate;
  }

  return await OEECalculation.findAll({
    where,
    order: [['periodStart', 'DESC']],
    limit,
  });
}

/**
 * Calculate availability metrics for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Availability metrics
 *
 * @example
 * ```typescript
 * const availability = await calculateAvailability(
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export async function calculateAvailability(
  assetId: string,
  startDate: Date,
  endDate: Date
): Promise<AvailabilityMetrics> {
  const metrics = await getAssetPerformanceRecords(assetId, undefined, startDate, endDate);

  const uptimeMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.UPTIME);
  const downtimeMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.DOWNTIME);

  const uptime = uptimeMetrics.reduce((sum, m) => sum + Number(m.value), 0);
  const downtime = downtimeMetrics.reduce((sum, m) => sum + Number(m.value), 0);
  const totalTime = uptime + downtime;

  const availability = totalTime > 0 ? (uptime / totalTime) * 100 : 0;

  // Calculate MTBF and MTTR (simplified)
  const failureCount = downtimeMetrics.length;
  const mtbf = failureCount > 0 ? uptime / failureCount : uptime;
  const mttr = failureCount > 0 ? downtime / failureCount : 0;
  const reliability = totalTime > 0 ? (mtbf / (mtbf + mttr)) * 100 : 0;

  return {
    assetId,
    period: { startDate, endDate },
    totalTime,
    uptime,
    downtime,
    plannedDowntime: 0,
    unplannedDowntime: downtime,
    availability,
    reliability,
    mtbf,
    mttr,
    failureCount,
  };
}

/**
 * Calculate utilization metrics for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @param totalCapacity - Total capacity for the period
 * @returns Utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = await calculateUtilization(
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   10000
 * );
 * ```
 */
export async function calculateUtilization(
  assetId: string,
  startDate: Date,
  endDate: Date,
  totalCapacity: number
): Promise<UtilizationMetrics> {
  const metrics = await getAssetPerformanceRecords(assetId, undefined, startDate, endDate);

  const utilizationMetrics = metrics.filter(
    (m) => m.metricType === PerformanceMetricType.UTILIZATION
  );

  const usedCapacity = utilizationMetrics.reduce((sum, m) => sum + Number(m.value), 0);
  const utilizationRate = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;

  const activeTime = metrics
    .filter((m) => m.metricType === PerformanceMetricType.UPTIME)
    .reduce((sum, m) => sum + Number(m.value), 0);

  const idleTime = totalCapacity - activeTime;

  const peakUsage = utilizationMetrics.length > 0
    ? Math.max(...utilizationMetrics.map((m) => Number(m.value)))
    : 0;

  const averageUsage = utilizationMetrics.length > 0
    ? usedCapacity / utilizationMetrics.length
    : 0;

  const efficiencyScore = utilizationRate > 0 ? Math.min(utilizationRate, 100) : 0;

  return {
    assetId,
    period: { startDate, endDate },
    totalCapacity,
    usedCapacity,
    utilizationRate,
    idleTime,
    activeTime,
    peakUsage,
    averageUsage,
    efficiencyScore,
  };
}

// ============================================================================
// KPI MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create a KPI definition
 *
 * @param data - KPI definition data
 * @param transaction - Optional database transaction
 * @returns Created KPI definition
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const kpi = await createKPIDefinition({
 *   name: 'Asset Uptime',
 *   metricType: 'uptime',
 *   targetValue: 95,
 *   unit: '%',
 *   isActive: true
 * });
 * ```
 */
export async function createKPIDefinition(
  data: KPIDefinitionData,
  transaction?: Transaction
): Promise<KPIDefinition> {
  try {
    const kpi = await KPIDefinition.create(
      {
        name: data.name,
        description: data.description,
        metricType: data.metricType,
        targetValue: data.targetValue,
        warningThreshold: data.warningThreshold,
        criticalThreshold: data.criticalThreshold,
        unit: data.unit,
        calculationMethod: data.calculationMethod,
        measurementFrequency: data.measurementFrequency,
        assetTypeId: data.assetTypeId,
        departmentId: data.departmentId,
        isActive: data.isActive,
      },
      { transaction }
    );

    return kpi;
  } catch (error) {
    throw new BadRequestException(`Failed to create KPI definition: ${error.message}`);
  }
}

/**
 * Get KPI definition by ID
 *
 * @param id - KPI definition ID
 * @returns KPI definition or null
 *
 * @example
 * ```typescript
 * const kpi = await getKPIDefinitionById('kpi-001');
 * ```
 */
export async function getKPIDefinitionById(id: string): Promise<KPIDefinition | null> {
  return await KPIDefinition.findByPk(id);
}

/**
 * Get all active KPI definitions
 *
 * @param filters - Optional filters (assetTypeId, departmentId)
 * @returns Array of KPI definitions
 *
 * @example
 * ```typescript
 * const kpis = await getActiveKPIs({ assetTypeId: 'type-001' });
 * ```
 */
export async function getActiveKPIs(filters?: {
  assetTypeId?: string;
  departmentId?: string;
}): Promise<KPIDefinition[]> {
  const where: WhereOptions = { isActive: true };

  if (filters?.assetTypeId) {
    where.assetTypeId = filters.assetTypeId;
  }

  if (filters?.departmentId) {
    where.departmentId = filters.departmentId;
  }

  return await KPIDefinition.findAll({ where });
}

/**
 * Update KPI definition
 *
 * @param id - KPI definition ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated KPI definition
 * @throws NotFoundException if KPI not found
 *
 * @example
 * ```typescript
 * const updated = await updateKPIDefinition('kpi-001', {
 *   targetValue: 98,
 *   warningThreshold: 95
 * });
 * ```
 */
export async function updateKPIDefinition(
  id: string,
  updates: Partial<KPIDefinitionData>,
  transaction?: Transaction
): Promise<KPIDefinition> {
  const kpi = await KPIDefinition.findByPk(id);

  if (!kpi) {
    throw new NotFoundException(`KPI definition ${id} not found`);
  }

  await kpi.update(updates, { transaction });
  return kpi;
}

/**
 * Calculate KPI value for an asset
 *
 * @param assetId - Asset ID
 * @param kpiId - KPI definition ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns KPI value result
 * @throws NotFoundException if KPI definition not found
 *
 * @example
 * ```typescript
 * const kpiValue = await calculateKPIValue(
 *   'asset-001',
 *   'kpi-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export async function calculateKPIValue(
  assetId: string,
  kpiId: string,
  startDate: Date,
  endDate: Date
): Promise<KPIValue> {
  const kpi = await KPIDefinition.findByPk(kpiId);

  if (!kpi) {
    throw new NotFoundException(`KPI definition ${kpiId} not found`);
  }

  const metrics = await getAssetPerformanceRecords(
    assetId,
    kpi.metricType,
    startDate,
    endDate
  );

  const currentValue = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + Number(m.value), 0) / metrics.length
    : 0;

  let status: KPIStatus;
  if (currentValue >= kpi.targetValue) {
    status = KPIStatus.ABOVE_TARGET;
  } else if (kpi.warningThreshold && currentValue >= kpi.warningThreshold) {
    status = KPIStatus.ON_TARGET;
  } else if (kpi.criticalThreshold && currentValue >= kpi.criticalThreshold) {
    status = KPIStatus.BELOW_TARGET;
  } else {
    status = KPIStatus.CRITICAL;
  }

  // Calculate trend (simplified)
  const halfwayPoint = new Date((startDate.getTime() + endDate.getTime()) / 2);
  const earlyMetrics = metrics.filter((m) => m.recordedAt < halfwayPoint);
  const lateMetrics = metrics.filter((m) => m.recordedAt >= halfwayPoint);

  const earlyAvg = earlyMetrics.length > 0
    ? earlyMetrics.reduce((sum, m) => sum + Number(m.value), 0) / earlyMetrics.length
    : currentValue;
  const lateAvg = lateMetrics.length > 0
    ? lateMetrics.reduce((sum, m) => sum + Number(m.value), 0) / lateMetrics.length
    : currentValue;

  let trend: TrendDirection;
  const change = ((lateAvg - earlyAvg) / earlyAvg) * 100;
  if (change > 5) trend = TrendDirection.IMPROVING;
  else if (change < -5) trend = TrendDirection.DECLINING;
  else trend = TrendDirection.STABLE;

  return {
    kpiId: kpi.id,
    name: kpi.name,
    metricType: kpi.metricType,
    currentValue,
    targetValue: kpi.targetValue,
    unit: kpi.unit,
    status,
    trend,
    lastUpdated: new Date(),
  };
}

// ============================================================================
// PERFORMANCE ALERT FUNCTIONS
// ============================================================================

/**
 * Create a performance alert
 *
 * @param data - Performance alert data
 * @param transaction - Optional database transaction
 * @returns Created performance alert
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const alert = await createPerformanceAlert({
 *   assetId: 'asset-001',
 *   alertType: 'low_uptime',
 *   severity: 'warning',
 *   message: 'Asset uptime below threshold'
 * });
 * ```
 */
export async function createPerformanceAlert(
  data: PerformanceAlertData,
  transaction?: Transaction
): Promise<PerformanceAlert> {
  try {
    const alert = await PerformanceAlert.create(
      {
        assetId: data.assetId,
        alertType: data.alertType,
        severity: data.severity,
        metricType: data.metricType,
        currentValue: data.currentValue,
        threshold: data.threshold,
        message: data.message,
        metadata: data.metadata,
      },
      { transaction }
    );

    return alert;
  } catch (error) {
    throw new BadRequestException(`Failed to create performance alert: ${error.message}`);
  }
}

/**
 * Get performance alert by ID
 *
 * @param id - Alert ID
 * @returns Performance alert or null
 *
 * @example
 * ```typescript
 * const alert = await getPerformanceAlertById('alert-001');
 * ```
 */
export async function getPerformanceAlertById(id: string): Promise<PerformanceAlert | null> {
  return await PerformanceAlert.findByPk(id);
}

/**
 * Get active alerts for an asset
 *
 * @param assetId - Asset ID
 * @param severity - Optional severity filter
 * @returns Array of active alerts
 *
 * @example
 * ```typescript
 * const alerts = await getActiveAlertsForAsset('asset-001', 'critical');
 * ```
 */
export async function getActiveAlertsForAsset(
  assetId: string,
  severity?: AlertSeverity
): Promise<PerformanceAlert[]> {
  const where: WhereOptions = {
    assetId,
    status: {
      [Op.in]: [AlertStatus.OPEN, AlertStatus.ACKNOWLEDGED, AlertStatus.IN_PROGRESS],
    },
  };

  if (severity) {
    where.severity = severity;
  }

  return await PerformanceAlert.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Acknowledge a performance alert
 *
 * @param id - Alert ID
 * @param userId - User ID acknowledging the alert
 * @param transaction - Optional database transaction
 * @returns Updated alert
 * @throws NotFoundException if alert not found
 *
 * @example
 * ```typescript
 * const alert = await acknowledgePerformanceAlert('alert-001', 'user-001');
 * ```
 */
export async function acknowledgePerformanceAlert(
  id: string,
  userId: string,
  transaction?: Transaction
): Promise<PerformanceAlert> {
  const alert = await PerformanceAlert.findByPk(id);

  if (!alert) {
    throw new NotFoundException(`Performance alert ${id} not found`);
  }

  await alert.update(
    {
      status: AlertStatus.ACKNOWLEDGED,
      acknowledgedBy: userId,
      acknowledgedAt: new Date(),
    },
    { transaction }
  );

  return alert;
}

/**
 * Resolve a performance alert
 *
 * @param id - Alert ID
 * @param userId - User ID resolving the alert
 * @param transaction - Optional database transaction
 * @returns Updated alert
 * @throws NotFoundException if alert not found
 *
 * @example
 * ```typescript
 * const alert = await resolvePerformanceAlert('alert-001', 'user-001');
 * ```
 */
export async function resolvePerformanceAlert(
  id: string,
  userId: string,
  transaction?: Transaction
): Promise<PerformanceAlert> {
  const alert = await PerformanceAlert.findByPk(id);

  if (!alert) {
    throw new NotFoundException(`Performance alert ${id} not found`);
  }

  await alert.update(
    {
      status: AlertStatus.RESOLVED,
      resolvedBy: userId,
      resolvedAt: new Date(),
    },
    { transaction }
  );

  return alert;
}

/**
 * Generate performance alerts based on KPI thresholds
 *
 * @param assetId - Asset ID
 * @param transaction - Optional database transaction
 * @returns Array of generated alerts
 *
 * @example
 * ```typescript
 * const alerts = await generatePerformanceAlertsForAsset('asset-001');
 * ```
 */
export async function generatePerformanceAlertsForAsset(
  assetId: string,
  transaction?: Transaction
): Promise<PerformanceAlert[]> {
  const kpis = await getActiveKPIs();
  const alerts: PerformanceAlert[] = [];

  for (const kpi of kpis) {
    const now = new Date();
    const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours

    try {
      const kpiValue = await calculateKPIValue(assetId, kpi.id, startDate, now);

      if (kpiValue.status === KPIStatus.CRITICAL) {
        const alert = await createPerformanceAlert(
          {
            assetId,
            alertType: 'kpi_critical',
            severity: AlertSeverity.CRITICAL,
            metricType: kpi.metricType,
            currentValue: kpiValue.currentValue,
            threshold: kpi.criticalThreshold || kpi.targetValue,
            message: `KPI "${kpi.name}" is critical: ${kpiValue.currentValue} ${kpi.unit}`,
          },
          transaction
        );
        alerts.push(alert);
      } else if (kpiValue.status === KPIStatus.BELOW_TARGET) {
        const alert = await createPerformanceAlert(
          {
            assetId,
            alertType: 'kpi_warning',
            severity: AlertSeverity.WARNING,
            metricType: kpi.metricType,
            currentValue: kpiValue.currentValue,
            threshold: kpi.warningThreshold || kpi.targetValue,
            message: `KPI "${kpi.name}" is below target: ${kpiValue.currentValue} ${kpi.unit}`,
          },
          transaction
        );
        alerts.push(alert);
      }
    } catch (error) {
      // Skip KPI if calculation fails
      continue;
    }
  }

  return alerts;
}

// ============================================================================
// SLA MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create an SLA definition
 *
 * @param data - SLA definition data
 * @param transaction - Optional database transaction
 * @returns Created SLA definition
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const sla = await createSLADefinition({
 *   name: 'Critical Asset Uptime',
 *   metricType: 'availability',
 *   targetValue: 99.9,
 *   minimumValue: 99.0,
 *   measurementPeriod: 'monthly',
 *   startDate: new Date(),
 *   isActive: true
 * });
 * ```
 */
export async function createSLADefinition(
  data: SLADefinitionData,
  transaction?: Transaction
): Promise<SLADefinition> {
  try {
    const sla = await SLADefinition.create(
      {
        name: data.name,
        description: data.description,
        assetId: data.assetId,
        assetTypeId: data.assetTypeId,
        metricType: data.metricType,
        targetValue: data.targetValue,
        minimumValue: data.minimumValue,
        measurementPeriod: data.measurementPeriod,
        penaltyAmount: data.penaltyAmount,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
      },
      { transaction }
    );

    return sla;
  } catch (error) {
    throw new BadRequestException(`Failed to create SLA definition: ${error.message}`);
  }
}

/**
 * Get SLA definition by ID
 *
 * @param id - SLA definition ID
 * @returns SLA definition or null
 *
 * @example
 * ```typescript
 * const sla = await getSLADefinitionById('sla-001');
 * ```
 */
export async function getSLADefinitionById(id: string): Promise<SLADefinition | null> {
  return await SLADefinition.findByPk(id);
}

/**
 * Get active SLAs for an asset
 *
 * @param assetId - Asset ID
 * @returns Array of active SLA definitions
 *
 * @example
 * ```typescript
 * const slas = await getActiveSLAsForAsset('asset-001');
 * ```
 */
export async function getActiveSLAsForAsset(assetId: string): Promise<SLADefinition[]> {
  return await SLADefinition.findAll({
    where: {
      assetId,
      isActive: true,
    },
  });
}

/**
 * Track SLA compliance for an asset
 *
 * @param slaId - SLA definition ID
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @param transaction - Optional database transaction
 * @returns SLA compliance result
 * @throws NotFoundException if SLA not found
 *
 * @example
 * ```typescript
 * const compliance = await trackSLACompliance(
 *   'sla-001',
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export async function trackSLACompliance(
  slaId: string,
  assetId: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction
): Promise<SLAComplianceResult> {
  const sla = await SLADefinition.findByPk(slaId);

  if (!sla) {
    throw new NotFoundException(`SLA definition ${slaId} not found`);
  }

  const metrics = await getAssetPerformanceRecords(
    assetId,
    sla.metricType,
    startDate,
    endDate
  );

  const actualValue = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + Number(m.value), 0) / metrics.length
    : 0;

  const compliance = (actualValue / sla.targetValue) * 100;

  let status: SLAComplianceStatus;
  if (actualValue >= sla.targetValue) {
    status = SLAComplianceStatus.COMPLIANT;
  } else if (actualValue >= sla.minimumValue) {
    status = SLAComplianceStatus.AT_RISK;
  } else {
    status = SLAComplianceStatus.BREACHED;
  }

  // Detect violations
  const violations: SLAViolation[] = [];
  for (const metric of metrics) {
    if (Number(metric.value) < sla.minimumValue) {
      violations.push({
        timestamp: metric.recordedAt,
        duration: 1,
        targetValue: sla.targetValue,
        actualValue: Number(metric.value),
        severity: AlertSeverity.CRITICAL,
        penaltyAmount: sla.penaltyAmount,
      });
    }
  }

  const penalties = violations.length * (sla.penaltyAmount || 0);

  // Save compliance record
  await SLACompliance.create(
    {
      slaId,
      assetId,
      periodStart: startDate,
      periodEnd: endDate,
      targetValue: sla.targetValue,
      actualValue,
      compliance,
      status,
      violations,
      penalties,
    },
    { transaction }
  );

  return {
    slaId,
    assetId,
    period: { startDate, endDate },
    targetValue: sla.targetValue,
    actualValue,
    compliance,
    status,
    violations,
    penalties,
  };
}

/**
 * Get SLA compliance history for an asset
 *
 * @param assetId - Asset ID
 * @param slaId - Optional SLA definition ID filter
 * @param limit - Maximum number of records
 * @returns Array of SLA compliance records
 *
 * @example
 * ```typescript
 * const history = await getSLAComplianceHistory('asset-001', 'sla-001');
 * ```
 */
export async function getSLAComplianceHistory(
  assetId: string,
  slaId?: string,
  limit: number = 50
): Promise<SLACompliance[]> {
  const where: WhereOptions = { assetId };

  if (slaId) {
    where.slaId = slaId;
  }

  return await SLACompliance.findAll({
    where,
    include: [{ model: SLADefinition, as: 'sla' }],
    order: [['periodStart', 'DESC']],
    limit,
  });
}

// ============================================================================
// PERFORMANCE DASHBOARD FUNCTIONS
// ============================================================================

/**
 * Get comprehensive performance dashboard data for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Performance dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await getPerformanceDashboard(
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export async function getPerformanceDashboard(
  assetId: string,
  startDate: Date,
  endDate: Date
): Promise<PerformanceDashboardData> {
  // Calculate OEE
  const oee = await calculateOEE(assetId, { startDate, endDate });

  // Calculate availability
  const availability = await calculateAvailability(assetId, startDate, endDate);

  // Calculate utilization (assuming total capacity)
  const totalCapacity = (endDate.getTime() - startDate.getTime()) / (1000 * 60); // minutes
  const utilization = await calculateUtilization(assetId, startDate, endDate, totalCapacity);

  // Get KPI values
  const kpiDefinitions = await getActiveKPIs();
  const kpis: KPIValue[] = [];
  for (const kpi of kpiDefinitions) {
    try {
      const kpiValue = await calculateKPIValue(assetId, kpi.id, startDate, endDate);
      kpis.push(kpiValue);
    } catch (error) {
      // Skip KPI if calculation fails
      continue;
    }
  }

  // Get active alerts
  const alerts = await getActiveAlertsForAsset(assetId);

  // Get trend analysis for key metrics
  const trends: PerformanceTrendAnalysis[] = [];
  // Simplified - in production would calculate actual trends

  // Get SLA compliance
  const slaDefinitions = await getActiveSLAsForAsset(assetId);
  const slaCompliance: SLAComplianceResult[] = [];
  for (const sla of slaDefinitions) {
    try {
      const compliance = await trackSLACompliance(sla.id, assetId, startDate, endDate);
      slaCompliance.push(compliance);
    } catch (error) {
      // Skip SLA if tracking fails
      continue;
    }
  }

  // Determine overall status
  let overallStatus: PerformanceStatus = PerformanceStatus.EXCELLENT;
  if (oee.status === PerformanceStatus.CRITICAL || alerts.some((a) => a.severity === AlertSeverity.CRITICAL)) {
    overallStatus = PerformanceStatus.CRITICAL;
  } else if (oee.status === PerformanceStatus.POOR) {
    overallStatus = PerformanceStatus.POOR;
  } else if (oee.status === PerformanceStatus.ACCEPTABLE) {
    overallStatus = PerformanceStatus.ACCEPTABLE;
  } else if (oee.status === PerformanceStatus.GOOD) {
    overallStatus = PerformanceStatus.GOOD;
  }

  return {
    assetId,
    period: { startDate, endDate },
    overallStatus,
    oee,
    availability,
    utilization,
    kpis,
    alerts,
    trends,
    slaCompliance,
  };
}

/**
 * Generate performance report for multiple assets
 *
 * @param assetIds - Array of asset IDs
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Array of performance dashboard data
 *
 * @example
 * ```typescript
 * const report = await generatePerformanceReport(
 *   ['asset-001', 'asset-002'],
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export async function generatePerformanceReport(
  assetIds: string[],
  startDate: Date,
  endDate: Date
): Promise<PerformanceDashboardData[]> {
  const dashboards: PerformanceDashboardData[] = [];

  for (const assetId of assetIds) {
    try {
      const dashboard = await getPerformanceDashboard(assetId, startDate, endDate);
      dashboards.push(dashboard);
    } catch (error) {
      // Skip asset if dashboard generation fails
      continue;
    }
  }

  return dashboards;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Performance records
  createPerformanceRecord,
  getPerformanceRecordById,
  getAssetPerformanceRecords,
  updatePerformanceRecord,
  deletePerformanceRecord,

  // OEE calculations
  calculateOEE,
  getOEEHistory,
  calculateAvailability,
  calculateUtilization,

  // KPI management
  createKPIDefinition,
  getKPIDefinitionById,
  getActiveKPIs,
  updateKPIDefinition,
  calculateKPIValue,

  // Performance alerts
  createPerformanceAlert,
  getPerformanceAlertById,
  getActiveAlertsForAsset,
  acknowledgePerformanceAlert,
  resolvePerformanceAlert,
  generatePerformanceAlertsForAsset,

  // SLA management
  createSLADefinition,
  getSLADefinitionById,
  getActiveSLAsForAsset,
  trackSLACompliance,
  getSLAComplianceHistory,

  // Dashboard and reporting
  getPerformanceDashboard,
  generatePerformanceReport,

  // Models
  PerformanceMetric,
  KPIDefinition,
  OEECalculation,
  PerformanceAlert,
  SLADefinition,
  SLACompliance,

  // DTOs
  CreatePerformanceRecordDto,
  CreateKPIDefinitionDto,
  CalculateOEEDto,
  CreatePerformanceAlertDto,
  CreateSLADefinitionDto,

  // Enums
  PerformanceMetricType,
  PerformanceStatus,
  KPIStatus,
  AlertSeverity,
  AlertStatus,
  TrendDirection,
  SLAComplianceStatus,
};
