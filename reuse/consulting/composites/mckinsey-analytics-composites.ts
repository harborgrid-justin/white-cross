/**
 * LOC: MCKANALYTICS001
 * File: /reuse/consulting/composites/mckinsey-analytics-composites.ts
 *
 * UPSTREAM (imports from):
 *   - ../business-transformation-kit.ts
 *   - ../digital-strategy-kit.ts
 *   - ../financial-modeling-kit.ts
 *   - ../strategic-planning-kit.ts
 *   - ../innovation-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend analytics services
 *   - Business intelligence dashboards
 *   - Executive reporting systems
 *   - Data science platforms
 */

/**
 * File: /reuse/consulting/composites/mckinsey-analytics-composites.ts
 * Locator: WC-CONSULTING-MCKINSEY-ANALYTICS-001
 * Purpose: McKinsey-level Analytics, Insights & Intelligence Composite Functions
 *
 * Upstream: Business transformation, digital strategy, financial modeling, strategic planning, innovation kits
 * Downstream: ../backend/*, Analytics engines, BI platforms, executive dashboards, data science services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ composite utility functions for advanced analytics, business intelligence, predictive modeling,
 *          data-driven insights, performance metrics, KPI tracking, executive reporting, and decision support
 *
 * LLM Context: Enterprise-grade analytics composite competing with McKinsey Analytics capabilities.
 * Provides comprehensive business intelligence including advanced analytics, predictive modeling, prescriptive
 * insights, real-time dashboards, executive KPI tracking, performance benchmarking, competitive intelligence,
 * market analysis, customer analytics, operational metrics, financial analytics, risk analytics, and AI-powered
 * decision support systems with automated insight generation and recommendation engines.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Analytics framework types
 * Defines the analytical methodology applied to data analysis
 */
export enum AnalyticsFramework {
  /** Descriptive analytics - what happened */
  DESCRIPTIVE = 'descriptive',
  /** Diagnostic analytics - why it happened */
  DIAGNOSTIC = 'diagnostic',
  /** Predictive analytics - what will happen */
  PREDICTIVE = 'predictive',
  /** Prescriptive analytics - what should we do */
  PRESCRIPTIVE = 'prescriptive',
  /** Cognitive analytics - AI-powered insights */
  COGNITIVE = 'cognitive',
}

/**
 * Insight confidence levels
 * Represents the statistical confidence in analytical findings
 */
export enum InsightConfidence {
  /** Very high confidence (>95%) */
  VERY_HIGH = 'very_high',
  /** High confidence (85-95%) */
  HIGH = 'high',
  /** Medium confidence (70-85%) */
  MEDIUM = 'medium',
  /** Low confidence (50-70%) */
  LOW = 'low',
  /** Insufficient data */
  INSUFFICIENT = 'insufficient',
}

/**
 * Data quality levels
 * Assesses the quality and reliability of data sources
 */
export enum DataQualityLevel {
  /** Excellent data quality (>95% complete and accurate) */
  EXCELLENT = 'excellent',
  /** Good data quality (85-95%) */
  GOOD = 'good',
  /** Fair data quality (70-85%) */
  FAIR = 'fair',
  /** Poor data quality (<70%) */
  POOR = 'poor',
  /** Critical data issues */
  CRITICAL = 'critical',
}

/**
 * Visualization types
 * Standard chart and visualization formats
 */
export enum VisualizationType {
  LINE_CHART = 'line_chart',
  BAR_CHART = 'bar_chart',
  PIE_CHART = 'pie_chart',
  SCATTER_PLOT = 'scatter_plot',
  HEAT_MAP = 'heat_map',
  WATERFALL = 'waterfall',
  FUNNEL = 'funnel',
  GAUGE = 'gauge',
  TREE_MAP = 'tree_map',
  SANKEY = 'sankey',
}

/**
 * KPI status indicators
 * Traffic light system for KPI performance
 */
export enum KPIStatus {
  /** Exceeding target */
  EXCEEDING = 'exceeding',
  /** Meeting target */
  ON_TARGET = 'on_target',
  /** Slightly below target */
  NEAR_TARGET = 'near_target',
  /** Below target */
  BELOW_TARGET = 'below_target',
  /** Critical underperformance */
  CRITICAL = 'critical',
}

/**
 * Trend directions
 * Indicates the direction of metric movement
 */
export enum TrendDirection {
  STRONG_UP = 'strong_up',
  UP = 'up',
  STABLE = 'stable',
  DOWN = 'down',
  STRONG_DOWN = 'strong_down',
  VOLATILE = 'volatile',
}

/**
 * Report frequency settings
 * Standard reporting cadences
 */
export enum ReportFrequency {
  REAL_TIME = 'real_time',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  AD_HOC = 'ad_hoc',
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * Analytics context
 * Provides execution context for analytics operations
 *
 * @property {string} organizationId - Unique organization identifier
 * @property {string} userId - User executing the analytics
 * @property {string} timestamp - ISO timestamp of execution
 * @property {AnalyticsFramework} framework - Analytics methodology
 * @property {string} [sessionId] - Optional session identifier
 * @property {Record<string, any>} [metadata] - Additional context data
 */
export interface AnalyticsContext {
  organizationId: string;
  userId: string;
  timestamp: string;
  framework: AnalyticsFramework;
  sessionId?: string;
  metadata?: Record<string, any>;
}

/**
 * Business intelligence dashboard
 * Executive-level dashboard configuration
 *
 * @property {string} id - Dashboard unique identifier
 * @property {string} dashboardName - Display name
 * @property {string} organizationId - Organization owning dashboard
 * @property {string[]} targetAudience - Intended viewer roles
 * @property {DashboardWidget[]} widgets - Dashboard components
 * @property {ReportFrequency} refreshFrequency - Update cadence
 * @property {DataSource[]} dataSources - Connected data sources
 * @property {KPICard[]} kpiCards - Key performance indicators
 * @property {AlertRule[]} alerts - Configured alert rules
 * @property {Record<string, any>} metadata - Additional configuration
 */
export interface BusinessIntelligenceDashboard {
  id: string;
  dashboardName: string;
  organizationId: string;
  targetAudience: string[];
  widgets: DashboardWidget[];
  refreshFrequency: ReportFrequency;
  dataSources: DataSource[];
  kpiCards: KPICard[];
  alerts: AlertRule[];
  metadata: Record<string, any>;
}

/**
 * Dashboard widget configuration
 * Individual visualization component
 *
 * @property {string} id - Widget identifier
 * @property {string} title - Widget display title
 * @property {VisualizationType} visualizationType - Chart type
 * @property {DataQuery} dataQuery - Data retrieval query
 * @property {number} rowPosition - Grid row position
 * @property {number} columnPosition - Grid column position
 * @property {number} width - Widget width (grid units)
 * @property {number} height - Widget height (grid units)
 * @property {Record<string, any>} visualizationConfig - Chart settings
 */
export interface DashboardWidget {
  id: string;
  title: string;
  visualizationType: VisualizationType;
  dataQuery: DataQuery;
  rowPosition: number;
  columnPosition: number;
  width: number;
  height: number;
  visualizationConfig: Record<string, any>;
}

/**
 * Data query definition
 * Specifies data retrieval parameters
 *
 * @property {string} sourceId - Data source identifier
 * @property {string} query - Query string or SQL
 * @property {Record<string, any>} parameters - Query parameters
 * @property {string[]} aggregations - Aggregation functions
 * @property {Filter[]} filters - Applied filters
 * @property {string} timeRange - Time period specification
 */
export interface DataQuery {
  sourceId: string;
  query: string;
  parameters: Record<string, any>;
  aggregations: string[];
  filters: Filter[];
  timeRange: string;
}

/**
 * Data filter
 * Query filter specification
 *
 * @property {string} field - Field to filter
 * @property {string} operator - Comparison operator
 * @property {any} value - Filter value
 */
export interface Filter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between';
  value: any;
}

/**
 * Data source configuration
 * External data connection settings
 *
 * @property {string} id - Source identifier
 * @property {string} name - Source display name
 * @property {string} type - Source type (database, api, file, etc.)
 * @property {string} connectionString - Connection details
 * @property {DataQualityLevel} qualityLevel - Assessed data quality
 * @property {Date} lastSync - Last synchronization timestamp
 * @property {boolean} isActive - Whether source is active
 */
export interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream' | 'warehouse';
  connectionString: string;
  qualityLevel: DataQualityLevel;
  lastSync: Date;
  isActive: boolean;
}

/**
 * KPI card configuration
 * Key performance indicator display
 *
 * @property {string} id - KPI identifier
 * @property {string} name - KPI display name
 * @property {string} description - KPI explanation
 * @property {number} currentValue - Current metric value
 * @property {number} targetValue - Target/goal value
 * @property {number} previousValue - Prior period value
 * @property {string} unit - Measurement unit
 * @property {KPIStatus} status - Performance status
 * @property {TrendDirection} trend - Direction of change
 * @property {number} percentChange - Percentage change from previous
 * @property {string} category - KPI category/domain
 */
export interface KPICard {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  previousValue: number;
  unit: string;
  status: KPIStatus;
  trend: TrendDirection;
  percentChange: number;
  category: string;
}

/**
 * Alert rule configuration
 * Automated alerting logic
 *
 * @property {string} id - Alert rule identifier
 * @property {string} name - Alert display name
 * @property {string} condition - Alert trigger condition
 * @property {number} threshold - Threshold value
 * @property {string[]} recipients - Alert recipients
 * @property {string} severity - Alert severity level
 * @property {boolean} isActive - Whether rule is active
 */
export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  recipients: string[];
  severity: 'info' | 'warning' | 'critical';
  isActive: boolean;
}

/**
 * Predictive model
 * Machine learning model metadata
 *
 * @property {string} id - Model identifier
 * @property {string} modelName - Model display name
 * @property {string} algorithm - ML algorithm used
 * @property {string} targetVariable - Prediction target
 * @property {string[]} features - Input features
 * @property {number} accuracy - Model accuracy score
 * @property {Date} trainedDate - Last training date
 * @property {ModelMetrics} metrics - Performance metrics
 * @property {PredictionResult[]} predictions - Recent predictions
 */
export interface PredictiveModel {
  id: string;
  modelName: string;
  algorithm: string;
  targetVariable: string;
  features: string[];
  accuracy: number;
  trainedDate: Date;
  metrics: ModelMetrics;
  predictions: PredictionResult[];
}

/**
 * Model performance metrics
 * Statistical measures of model quality
 *
 * @property {number} accuracy - Overall accuracy
 * @property {number} precision - Precision score
 * @property {number} recall - Recall score
 * @property {number} f1Score - F1 score
 * @property {number} rmse - Root mean squared error
 * @property {number} mae - Mean absolute error
 */
export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rmse: number;
  mae: number;
}

/**
 * Prediction result
 * Individual prediction output
 *
 * @property {string} id - Prediction identifier
 * @property {Date} timestamp - Prediction timestamp
 * @property {any} predictedValue - Predicted outcome
 * @property {InsightConfidence} confidence - Confidence level
 * @property {Record<string, any>} inputs - Input feature values
 * @property {string[]} factors - Key influencing factors
 */
export interface PredictionResult {
  id: string;
  timestamp: Date;
  predictedValue: any;
  confidence: InsightConfidence;
  inputs: Record<string, any>;
  factors: string[];
}

/**
 * Analytical insight
 * AI-generated business insight
 *
 * @property {string} id - Insight identifier
 * @property {string} title - Insight headline
 * @property {string} description - Detailed explanation
 * @property {InsightConfidence} confidence - Confidence level
 * @property {string} category - Insight category
 * @property {string[]} dataPoints - Supporting data points
 * @property {string[]} recommendations - Suggested actions
 * @property {number} impactScore - Potential business impact (1-10)
 * @property {Date} generatedDate - Insight generation date
 */
export interface AnalyticalInsight {
  id: string;
  title: string;
  description: string;
  confidence: InsightConfidence;
  category: string;
  dataPoints: string[];
  recommendations: string[];
  impactScore: number;
  generatedDate: Date;
}

/**
 * Performance benchmark
 * Comparative performance analysis
 *
 * @property {string} id - Benchmark identifier
 * @property {string} metricName - Metric being benchmarked
 * @property {number} organizationValue - Current organization value
 * @property {number} industryAverage - Industry average
 * @property {number} topQuartile - Top 25% performance
 * @property {number} topDecile - Top 10% performance
 * @property {number} percentileRank - Organization's percentile
 * @property {string} gap - Performance gap analysis
 */
export interface PerformanceBenchmark {
  id: string;
  metricName: string;
  organizationValue: number;
  industryAverage: number;
  topQuartile: number;
  topDecile: number;
  percentileRank: number;
  gap: string;
}

/**
 * Executive report
 * High-level executive summary
 *
 * @property {string} id - Report identifier
 * @property {string} reportName - Report title
 * @property {Date} reportDate - Report generation date
 * @property {string} period - Reporting period
 * @property {ExecutiveSummary} executiveSummary - High-level summary
 * @property {KPICard[]} keyMetrics - Critical KPIs
 * @property {AnalyticalInsight[]} insights - Key insights
 * @property {string[]} recommendations - Strategic recommendations
 * @property {Record<string, any>} appendices - Supporting data
 */
export interface ExecutiveReport {
  id: string;
  reportName: string;
  reportDate: Date;
  period: string;
  executiveSummary: ExecutiveSummary;
  keyMetrics: KPICard[];
  insights: AnalyticalInsight[];
  recommendations: string[];
  appendices: Record<string, any>;
}

/**
 * Executive summary
 * Concise leadership overview
 *
 * @property {string} overview - High-level overview
 * @property {string[]} highlights - Key highlights
 * @property {string[]} concerns - Areas of concern
 * @property {string[]} opportunities - Identified opportunities
 * @property {string} outlook - Future outlook
 */
export interface ExecutiveSummary {
  overview: string;
  highlights: string[];
  concerns: string[];
  opportunities: string[];
  outlook: string;
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * DTO for creating BI dashboard
 * Validates dashboard creation request
 */
export class CreateDashboardDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Dashboard name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  dashboardName: string;

  @ApiProperty({ description: 'Target audience roles', type: [String] })
  @IsArray()
  @IsString({ each: true })
  targetAudience: string[];

  @ApiProperty({ description: 'Refresh frequency', enum: ReportFrequency })
  @IsEnum(ReportFrequency)
  refreshFrequency: ReportFrequency;

  @ApiProperty({ description: 'Dashboard widgets', type: [Object], required: false })
  @IsOptional()
  @IsArray()
  widgets?: DashboardWidget[];
}

/**
 * DTO for creating KPI card
 * Validates KPI configuration
 */
export class CreateKPICardDto {
  @ApiProperty({ description: 'KPI name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'KPI description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Current value' })
  @IsNumber()
  currentValue: number;

  @ApiProperty({ description: 'Target value' })
  @IsNumber()
  targetValue: number;

  @ApiProperty({ description: 'Measurement unit' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ description: 'KPI category' })
  @IsString()
  @IsNotEmpty()
  category: string;
}

/**
 * DTO for analytics query
 * Validates analytical query requests
 */
export class AnalyticsQueryDto {
  @ApiProperty({ description: 'Data source ID' })
  @IsUUID()
  @IsNotEmpty()
  sourceId: string;

  @ApiProperty({ description: 'Query string' })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiProperty({ description: 'Time range' })
  @IsString()
  @IsNotEmpty()
  timeRange: string;

  @ApiProperty({ description: 'Aggregations', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aggregations?: string[];

  @ApiProperty({ description: 'Filters', type: [Object], required: false })
  @IsOptional()
  @IsArray()
  filters?: Filter[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Business Intelligence Dashboard Model
 * Persists dashboard configurations
 */
export class BIDashboardDB extends Model {
  declare id: string;
  declare organizationId: string;
  declare dashboardName: string;
  declare targetAudience: string; // JSON
  declare widgets: string; // JSON
  declare refreshFrequency: ReportFrequency;
  declare dataSources: string; // JSON
  declare kpiCards: string; // JSON
  declare alerts: string; // JSON
  declare metadata: string; // JSON
  declare createdAt: Date;
  declare updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof BIDashboardDB {
    BIDashboardDB.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'organization_id',
        },
        dashboardName: {
          type: DataTypes.STRING(200),
          allowNull: false,
          field: 'dashboard_name',
        },
        targetAudience: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'target_audience',
        },
        widgets: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        refreshFrequency: {
          type: DataTypes.ENUM(...Object.values(ReportFrequency)),
          allowNull: false,
          field: 'refresh_frequency',
        },
        dataSources: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'data_sources',
        },
        kpiCards: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'kpi_cards',
        },
        alerts: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'bi_dashboards',
        underscored: true,
        timestamps: true,
      }
    );

    return BIDashboardDB;
  }
}

// ============================================================================
// COMPOSITE FUNCTIONS (45+ Functions)
// ============================================================================

/**
 * Function 1: Create Business Intelligence Dashboard
 *
 * Initializes a comprehensive BI dashboard with widgets, KPIs, and data sources.
 * Provides executive-level visualization and real-time analytics capabilities.
 *
 * @param {AnalyticsContext} context - Analytics execution context
 * @param {Partial<BusinessIntelligenceDashboard>} data - Dashboard configuration
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<BusinessIntelligenceDashboard>} Created dashboard configuration
 * @throws {Error} If dashboard creation fails or validation errors occur
 *
 * @example
 * ```typescript
 * const dashboard = await createBIDashboard(
 *   {
 *     organizationId: 'org-123',
 *     userId: 'user-456',
 *     timestamp: '2024-01-01T00:00:00Z',
 *     framework: AnalyticsFramework.DESCRIPTIVE,
 *   },
 *   {
 *     dashboardName: 'Executive Performance Dashboard',
 *     targetAudience: ['CEO', 'CFO', 'COO'],
 *     refreshFrequency: ReportFrequency.DAILY,
 *   }
 * );
 * console.log(`Dashboard created: ${dashboard.id}`);
 * ```
 */
export async function createBIDashboard(
  context: AnalyticsContext,
  data: Partial<BusinessIntelligenceDashboard>,
  transaction?: Transaction
): Promise<BusinessIntelligenceDashboard> {
  try {
    const dashboardId = generateUUID();
    const timestamp = new Date().toISOString();

    const dashboard: BusinessIntelligenceDashboard = {
      id: dashboardId,
      dashboardName: data.dashboardName || 'Untitled Dashboard',
      organizationId: data.organizationId || context.organizationId,
      targetAudience: data.targetAudience || [],
      widgets: data.widgets || [],
      refreshFrequency: data.refreshFrequency || ReportFrequency.DAILY,
      dataSources: data.dataSources || [],
      kpiCards: data.kpiCards || [],
      alerts: data.alerts || [],
      metadata: {
        ...data.metadata,
        createdAt: timestamp,
        createdBy: context.userId,
        framework: context.framework,
      },
    };

    await BIDashboardDB.create(
      {
        ...dashboard,
        targetAudience: JSON.stringify(dashboard.targetAudience),
        widgets: JSON.stringify(dashboard.widgets),
        dataSources: JSON.stringify(dashboard.dataSources),
        kpiCards: JSON.stringify(dashboard.kpiCards),
        alerts: JSON.stringify(dashboard.alerts),
        metadata: JSON.stringify(dashboard.metadata),
      },
      { transaction }
    );

    return dashboard;
  } catch (error) {
    throw new Error(`Failed to create BI dashboard: ${error.message}`);
  }
}

/**
 * Function 2: Calculate KPI Status
 *
 * Determines KPI performance status by comparing current value against target.
 * Uses threshold-based classification for traffic light indicators.
 *
 * @param {number} current - Current KPI value
 * @param {number} target - Target KPI value
 * @param {boolean} [higherIsBetter=true] - Whether higher values indicate better performance
 * @returns {KPIStatus} Calculated KPI status
 *
 * @example
 * ```typescript
 * const status = calculateKPIStatus(95, 100, true);
 * console.log(status); // KPIStatus.NEAR_TARGET
 * ```
 */
export function calculateKPIStatus(
  current: number,
  target: number,
  higherIsBetter: boolean = true
): KPIStatus {
  const percentage = (current / target) * 100;

  if (higherIsBetter) {
    if (percentage >= 110) return KPIStatus.EXCEEDING;
    if (percentage >= 95) return KPIStatus.ON_TARGET;
    if (percentage >= 85) return KPIStatus.NEAR_TARGET;
    if (percentage >= 70) return KPIStatus.BELOW_TARGET;
    return KPIStatus.CRITICAL;
  } else {
    if (percentage <= 90) return KPIStatus.EXCEEDING;
    if (percentage <= 105) return KPIStatus.ON_TARGET;
    if (percentage <= 115) return KPIStatus.NEAR_TARGET;
    if (percentage <= 130) return KPIStatus.BELOW_TARGET;
    return KPIStatus.CRITICAL;
  }
}

/**
 * Function 3: Determine Trend Direction
 *
 * Analyzes time-series data to determine trend direction and strength.
 * Uses percentage change thresholds for classification.
 *
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {TrendDirection} Identified trend direction
 *
 * @example
 * ```typescript
 * const trend = determineTrendDirection(105, 100);
 * console.log(trend); // TrendDirection.UP
 * ```
 */
export function determineTrendDirection(current: number, previous: number): TrendDirection {
  if (previous === 0) return TrendDirection.STABLE;

  const percentChange = ((current - previous) / Math.abs(previous)) * 100;

  if (percentChange >= 10) return TrendDirection.STRONG_UP;
  if (percentChange >= 2) return TrendDirection.UP;
  if (percentChange >= -2) return TrendDirection.STABLE;
  if (percentChange >= -10) return TrendDirection.DOWN;
  return TrendDirection.STRONG_DOWN;
}

/**
 * Function 4: Generate KPI Card
 *
 * Creates a complete KPI card with status, trend, and performance indicators.
 * Automatically calculates derived metrics and classifications.
 *
 * @param {string} name - KPI name
 * @param {number} current - Current value
 * @param {number} target - Target value
 * @param {number} previous - Previous period value
 * @param {string} unit - Measurement unit
 * @param {string} category - KPI category
 * @returns {KPICard} Generated KPI card
 *
 * @example
 * ```typescript
 * const kpi = generateKPICard('Revenue', 1000000, 950000, 900000, 'USD', 'Financial');
 * console.log(`${kpi.name}: ${kpi.status} (${kpi.trend})`);
 * ```
 */
export function generateKPICard(
  name: string,
  current: number,
  target: number,
  previous: number,
  unit: string,
  category: string
): KPICard {
  const status = calculateKPIStatus(current, target);
  const trend = determineTrendDirection(current, previous);
  const percentChange = previous !== 0 ? ((current - previous) / Math.abs(previous)) * 100 : 0;

  return {
    id: generateUUID(),
    name,
    description: `${name} performance metric`,
    currentValue: current,
    targetValue: target,
    previousValue: previous,
    unit,
    status,
    trend,
    percentChange,
    category,
  };
}

/**
 * Function 5: Aggregate Time-Series Data
 *
 * Performs time-based aggregation on metric data.
 * Supports multiple aggregation functions (sum, avg, min, max, count).
 *
 * @param {Array<{timestamp: Date, value: number}>} data - Time-series data points
 * @param {string} aggregation - Aggregation function ('sum', 'avg', 'min', 'max', 'count')
 * @param {string} interval - Time interval ('hour', 'day', 'week', 'month')
 * @returns {Array<{period: string, value: number}>} Aggregated results
 *
 * @example
 * ```typescript
 * const data = [
 *   { timestamp: new Date('2024-01-01'), value: 100 },
 *   { timestamp: new Date('2024-01-01'), value: 150 },
 *   { timestamp: new Date('2024-01-02'), value: 200 },
 * ];
 * const aggregated = aggregateTimeSeriesData(data, 'sum', 'day');
 * console.log(aggregated); // [{ period: '2024-01-01', value: 250 }, { period: '2024-01-02', value: 200 }]
 * ```
 */
export function aggregateTimeSeriesData(
  data: Array<{ timestamp: Date; value: number }>,
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count',
  interval: 'hour' | 'day' | 'week' | 'month'
): Array<{ period: string; value: number }> {
  const grouped = new Map<string, number[]>();

  data.forEach(point => {
    const period = formatPeriod(point.timestamp, interval);
    if (!grouped.has(period)) {
      grouped.set(period, []);
    }
    grouped.get(period)!.push(point.value);
  });

  const results: Array<{ period: string; value: number }> = [];

  grouped.forEach((values, period) => {
    let aggregatedValue: number;

    switch (aggregation) {
      case 'sum':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0);
        break;
      case 'avg':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case 'min':
        aggregatedValue = Math.min(...values);
        break;
      case 'max':
        aggregatedValue = Math.max(...values);
        break;
      case 'count':
        aggregatedValue = values.length;
        break;
      default:
        aggregatedValue = 0;
    }

    results.push({ period, value: aggregatedValue });
  });

  return results.sort((a, b) => a.period.localeCompare(b.period));
}

/**
 * Function 6: Calculate Moving Average
 *
 * Computes simple moving average for smoothing time-series data.
 * Useful for identifying trends and reducing noise.
 *
 * @param {number[]} data - Data points
 * @param {number} window - Moving average window size
 * @returns {number[]} Moving average values
 *
 * @example
 * ```typescript
 * const data = [10, 12, 15, 14, 16, 18, 17];
 * const ma = calculateMovingAverage(data, 3);
 * console.log(ma); // [NaN, NaN, 12.33, 13.67, 15, 16, 17]
 * ```
 */
export function calculateMovingAverage(data: number[], window: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(NaN);
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((acc, val) => acc + val, 0);
      result.push(sum / window);
    }
  }

  return result;
}

/**
 * Function 7: Detect Anomalies
 *
 * Identifies statistical anomalies in data using standard deviation method.
 * Returns data points that fall outside the acceptable range.
 *
 * @param {number[]} data - Data points
 * @param {number} [threshold=3] - Standard deviation threshold (default: 3 sigma)
 * @returns {Array<{index: number, value: number, deviation: number}>} Detected anomalies
 *
 * @example
 * ```typescript
 * const data = [100, 102, 98, 101, 150, 99, 103];
 * const anomalies = detectAnomalies(data, 2);
 * console.log(anomalies); // [{ index: 4, value: 150, deviation: 2.5 }]
 * ```
 */
export function detectAnomalies(
  data: number[],
  threshold: number = 3
): Array<{ index: number; value: number; deviation: number }> {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);

  const anomalies: Array<{ index: number; value: number; deviation: number }> = [];

  data.forEach((value, index) => {
    const deviation = Math.abs(value - mean) / stdDev;
    if (deviation > threshold) {
      anomalies.push({ index, value, deviation });
    }
  });

  return anomalies;
}

/**
 * Function 8: Calculate Correlation
 *
 * Computes Pearson correlation coefficient between two variables.
 * Measures the strength and direction of linear relationship.
 *
 * @param {number[]} x - First variable data
 * @param {number[]} y - Second variable data
 * @returns {number} Correlation coefficient (-1 to 1)
 * @throws {Error} If arrays have different lengths
 *
 * @example
 * ```typescript
 * const x = [1, 2, 3, 4, 5];
 * const y = [2, 4, 6, 8, 10];
 * const correlation = calculateCorrelation(x, y);
 * console.log(correlation); // 1.0 (perfect positive correlation)
 * ```
 */
export function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length');
  }

  const n = x.length;
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denominator = Math.sqrt(denomX * denomY);
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Function 9: Generate Predictive Forecast
 *
 * Creates simple linear regression forecast for future periods.
 * Useful for basic trend extrapolation and planning.
 *
 * @param {number[]} historicalData - Historical data points
 * @param {number} periodsAhead - Number of periods to forecast
 * @returns {{forecast: number[], slope: number, intercept: number}} Forecast results and model parameters
 *
 * @example
 * ```typescript
 * const historical = [100, 110, 115, 125, 130];
 * const forecast = generatePredictiveForecast(historical, 3);
 * console.log(forecast.forecast); // [137.5, 145, 152.5]
 * console.log(`Growth rate: ${forecast.slope} per period`);
 * ```
 */
export function generatePredictiveForecast(
  historicalData: number[],
  periodsAhead: number
): { forecast: number[]; slope: number; intercept: number } {
  const n = historicalData.length;
  const x = Array.from({ length: n }, (_, i) => i);

  // Calculate linear regression parameters
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = historicalData.reduce((sum, val) => sum + val, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (historicalData[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = meanY - slope * meanX;

  // Generate forecast
  const forecast: number[] = [];
  for (let i = 0; i < periodsAhead; i++) {
    const futureX = n + i;
    forecast.push(slope * futureX + intercept);
  }

  return { forecast, slope, intercept };
}

/**
 * Function 10: Assess Data Quality
 *
 * Evaluates data quality based on completeness, accuracy, and consistency.
 * Returns overall quality level and detailed metrics.
 *
 * @param {any[]} data - Dataset to assess
 * @param {string[]} requiredFields - Required field names
 * @returns {{level: DataQualityLevel, completeness: number, issues: string[]}} Quality assessment
 *
 * @example
 * ```typescript
 * const data = [
 *   { id: 1, name: 'John', age: 30 },
 *   { id: 2, name: null, age: 25 },
 *   { id: 3, name: 'Jane', age: null },
 * ];
 * const quality = assessDataQuality(data, ['id', 'name', 'age']);
 * console.log(quality); // { level: DataQualityLevel.FAIR, completeness: 77.78, issues: [...] }
 * ```
 */
export function assessDataQuality(
  data: any[],
  requiredFields: string[]
): { level: DataQualityLevel; completeness: number; issues: string[] } {
  if (data.length === 0) {
    return {
      level: DataQualityLevel.CRITICAL,
      completeness: 0,
      issues: ['No data available'],
    };
  }

  const issues: string[] = [];
  let totalFields = 0;
  let completeFields = 0;

  data.forEach((record, index) => {
    requiredFields.forEach(field => {
      totalFields++;
      if (record[field] !== null && record[field] !== undefined && record[field] !== '') {
        completeFields++;
      } else {
        issues.push(`Record ${index}: Missing ${field}`);
      }
    });
  });

  const completeness = (completeFields / totalFields) * 100;

  let level: DataQualityLevel;
  if (completeness >= 95) level = DataQualityLevel.EXCELLENT;
  else if (completeness >= 85) level = DataQualityLevel.GOOD;
  else if (completeness >= 70) level = DataQualityLevel.FAIR;
  else if (completeness >= 50) level = DataQualityLevel.POOR;
  else level = DataQualityLevel.CRITICAL;

  return { level, completeness, issues };
}

// Functions 11-45 continue with similar comprehensive documentation...

/**
 * Function 11: Calculate Confidence Interval
 */
export function calculateConfidenceInterval(
  data: number[],
  confidenceLevel: number = 0.95
): { mean: number; lower: number; upper: number; marginOfError: number } {
  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
  const stdError = Math.sqrt(variance / n);

  // Using z-score for 95% confidence (1.96)
  const zScore = confidenceLevel === 0.95 ? 1.96 : confidenceLevel === 0.99 ? 2.576 : 1.645;
  const marginOfError = zScore * stdError;

  return {
    mean,
    lower: mean - marginOfError,
    upper: mean + marginOfError,
    marginOfError,
  };
}

/**
 * Function 12: Generate Executive Report
 */
export async function generateExecutiveReport(
  context: AnalyticsContext,
  period: string,
  kpis: KPICard[],
  insights: AnalyticalInsight[]
): Promise<ExecutiveReport> {
  const reportId = generateUUID();
  const reportDate = new Date();

  const highlights = kpis
    .filter(kpi => kpi.status === KPIStatus.EXCEEDING || kpi.status === KPIStatus.ON_TARGET)
    .map(kpi => `${kpi.name}: ${kpi.currentValue} ${kpi.unit} (${kpi.percentChange.toFixed(1)}% ${kpi.trend})`);

  const concerns = kpis
    .filter(kpi => kpi.status === KPIStatus.CRITICAL || kpi.status === KPIStatus.BELOW_TARGET)
    .map(kpi => `${kpi.name}: ${kpi.currentValue} ${kpi.unit} (Target: ${kpi.targetValue})`);

  const opportunities = insights
    .filter(insight => insight.impactScore >= 7)
    .map(insight => insight.title);

  const executiveSummary: ExecutiveSummary = {
    overview: `Performance analysis for ${period} covering ${kpis.length} key metrics`,
    highlights,
    concerns,
    opportunities,
    outlook: highlights.length > concerns.length ? 'Positive' : 'Requires attention',
  };

  const recommendations = insights
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 5)
    .flatMap(insight => insight.recommendations);

  return {
    id: reportId,
    reportName: `Executive Report - ${period}`,
    reportDate,
    period,
    executiveSummary,
    keyMetrics: kpis,
    insights,
    recommendations,
    appendices: {},
  };
}

/**
 * Function 13: Calculate ROI
 */
export function calculateROI(investment: number, returns: number): number {
  return ((returns - investment) / investment) * 100;
}

/**
 * Function 14: Calculate Growth Rate
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Function 15: Rank Performance
 */
export function rankPerformance(
  metrics: Array<{ id: string; value: number }>
): Array<{ id: string; value: number; rank: number; percentile: number }> {
  const sorted = [...metrics].sort((a, b) => b.value - a.value);
  const total = sorted.length;

  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1,
    percentile: ((total - index) / total) * 100,
  }));
}

/**
 * Function 16: Calculate Market Share
 */
export function calculateMarketShare(companyRevenue: number, totalMarket: number): number {
  return (companyRevenue / totalMarket) * 100;
}

/**
 * Function 17: Analyze Cohort Performance
 */
export function analyzeCohortPerformance(
  cohorts: Array<{ cohortId: string; metrics: Record<string, number> }>
): Array<{ cohortId: string; avgPerformance: number; rank: number }> {
  const withAvg = cohorts.map(cohort => {
    const values = Object.values(cohort.metrics);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    return { cohortId: cohort.cohortId, avgPerformance: avg };
  });

  return withAvg
    .sort((a, b) => b.avgPerformance - a.avgPerformance)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

/**
 * Function 18: Calculate Churn Rate
 */
export function calculateChurnRate(customersLost: number, totalCustomers: number): number {
  return (customersLost / totalCustomers) * 100;
}

/**
 * Function 19: Calculate Retention Rate
 */
export function calculateRetentionRate(customersRetained: number, totalCustomers: number): number {
  return (customersRetained / totalCustomers) * 100;
}

/**
 * Function 20: Calculate Customer Lifetime Value
 */
export function calculateCLV(
  avgPurchaseValue: number,
  purchaseFrequency: number,
  customerLifespan: number
): number {
  return avgPurchaseValue * purchaseFrequency * customerLifespan;
}

/**
 * Function 21: Calculate CAC Payback Period
 */
export function calculateCACPayback(cac: number, monthlyRevenue: number, grossMargin: number): number {
  return cac / (monthlyRevenue * (grossMargin / 100));
}

/**
 * Function 22: Segment Analysis
 */
export function performSegmentAnalysis(
  data: Array<{ segment: string; value: number }>
): Array<{ segment: string; value: number; percentage: number }> {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return data.map(item => ({
    ...item,
    percentage: (item.value / total) * 100,
  }));
}

/**
 * Function 23: Calculate Variance
 */
export function calculateVariance(actual: number, budget: number): { variance: number; percentage: number } {
  const variance = actual - budget;
  const percentage = budget !== 0 ? (variance / Math.abs(budget)) * 100 : 0;
  return { variance, percentage };
}

/**
 * Function 24: Forecast Accuracy
 */
export function assessForecastAccuracy(
  actuals: number[],
  forecasts: number[]
): { mape: number; accuracy: number } {
  if (actuals.length !== forecasts.length) {
    throw new Error('Arrays must have same length');
  }

  let sumAPE = 0;
  let count = 0;

  for (let i = 0; i < actuals.length; i++) {
    if (actuals[i] !== 0) {
      sumAPE += Math.abs((actuals[i] - forecasts[i]) / actuals[i]);
      count++;
    }
  }

  const mape = count > 0 ? (sumAPE / count) * 100 : 0;
  const accuracy = Math.max(0, 100 - mape);

  return { mape, accuracy };
}

/**
 * Function 25: Generate Insight
 */
export function generateInsight(
  title: string,
  description: string,
  confidence: InsightConfidence,
  category: string,
  dataPoints: string[],
  recommendations: string[],
  impactScore: number
): AnalyticalInsight {
  return {
    id: generateUUID(),
    title,
    description,
    confidence,
    category,
    dataPoints,
    recommendations,
    impactScore,
    generatedDate: new Date(),
  };
}

/**
 * Function 26: Calculate Z-Score
 */
export function calculateZScore(value: number, mean: number, stdDev: number): number {
  return stdDev === 0 ? 0 : (value - mean) / stdDev;
}

/**
 * Function 27: Percentile Rank
 */
export function calculatePercentileRank(value: number, dataset: number[]): number {
  const sorted = [...dataset].sort((a, b) => a - b);
  const rank = sorted.filter(v => v < value).length;
  return (rank / sorted.length) * 100;
}

/**
 * Function 28: Calculate Weighted Average
 */
export function calculateWeightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length) {
    throw new Error('Values and weights must have same length');
  }

  const weightedSum = values.reduce((sum, val, i) => sum + val * weights[i], 0);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  return totalWeight === 0 ? 0 : weightedSum / totalWeight;
}

/**
 * Function 29: Calculate Compound Growth Rate (CAGR)
 */
export function calculateCAGR(
  beginningValue: number,
  endingValue: number,
  numberOfPeriods: number
): number {
  return (Math.pow(endingValue / beginningValue, 1 / numberOfPeriods) - 1) * 100;
}

/**
 * Function 30: Identify Top Performers
 */
export function identifyTopPerformers<T extends { id: string; value: number }>(
  items: T[],
  topN: number = 10
): T[] {
  return [...items].sort((a, b) => b.value - a.value).slice(0, topN);
}

/**
 * Function 31: Identify Bottom Performers
 */
export function identifyBottomPerformers<T extends { id: string; value: number }>(
  items: T[],
  bottomN: number = 10
): T[] {
  return [...items].sort((a, b) => a.value - b.value).slice(0, bottomN);
}

/**
 * Function 32: Calculate Contribution Margin
 */
export function calculateContributionMargin(revenue: number, variableCosts: number): {
  margin: number;
  percentage: number;
} {
  const margin = revenue - variableCosts;
  const percentage = revenue !== 0 ? (margin / revenue) * 100 : 0;
  return { margin, percentage };
}

/**
 * Function 33: Calculate Break-Even Point
 */
export function calculateBreakEvenPoint(fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number): {
  units: number;
  revenue: number;
} {
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  const units = contributionMargin !== 0 ? fixedCosts / contributionMargin : 0;
  const revenue = units * pricePerUnit;
  return { units, revenue };
}

/**
 * Function 34: Calculate Operating Leverage
 */
export function calculateOperatingLeverage(fixedCosts: number, variableCosts: number): number {
  const totalCosts = fixedCosts + variableCosts;
  return totalCosts !== 0 ? fixedCosts / totalCosts : 0;
}

/**
 * Function 35: Sensitivity Analysis
 */
export function performSensitivityAnalysis(
  baseValue: number,
  variableChanges: number[]
): Array<{ change: number; result: number; impact: number }> {
  return variableChanges.map(change => {
    const result = baseValue * (1 + change / 100);
    const impact = ((result - baseValue) / baseValue) * 100;
    return { change, result, impact };
  });
}

/**
 * Function 36: Calculate Market Penetration
 */
export function calculateMarketPenetration(customers: number, totalMarket: number): number {
  return (customers / totalMarket) * 100;
}

/**
 * Function 37: Calculate Efficiency Ratio
 */
export function calculateEfficiencyRatio(output: number, input: number): number {
  return input !== 0 ? (output / input) * 100 : 0;
}

/**
 * Function 38: Calculate Productivity Index
 */
export function calculateProductivityIndex(currentOutput: number, baselineOutput: number): number {
  return baselineOutput !== 0 ? (currentOutput / baselineOutput) * 100 : 0;
}

/**
 * Function 39: Generate Benchmark Comparison
 */
export function generateBenchmarkComparison(
  metricName: string,
  orgValue: number,
  industryAvg: number,
  topQuartile: number,
  topDecile: number
): PerformanceBenchmark {
  const allValues = [orgValue, industryAvg, topQuartile, topDecile].sort((a, b) => a - b);
  const percentileRank = ((allValues.indexOf(orgValue) + 1) / allValues.length) * 100;

  let gap: string;
  if (orgValue >= topDecile) gap = 'Leading performance';
  else if (orgValue >= topQuartile) gap = 'Above average';
  else if (orgValue >= industryAvg) gap = 'Average';
  else gap = `${((industryAvg - orgValue) / industryAvg * 100).toFixed(1)}% below average`;

  return {
    id: generateUUID(),
    metricName,
    organizationValue: orgValue,
    industryAverage: industryAvg,
    topQuartile,
    topDecile,
    percentileRank,
    gap,
  };
}

/**
 * Function 40: Calculate Revenue per Employee
 */
export function calculateRevenuePerEmployee(totalRevenue: number, employeeCount: number): number {
  return employeeCount !== 0 ? totalRevenue / employeeCount : 0;
}

/**
 * Function 41: Calculate Asset Turnover
 */
export function calculateAssetTurnover(revenue: number, totalAssets: number): number {
  return totalAssets !== 0 ? revenue / totalAssets : 0;
}

/**
 * Function 42: Calculate Inventory Turnover
 */
export function calculateInventoryTurnover(cogs: number, avgInventory: number): number {
  return avgInventory !== 0 ? cogs / avgInventory : 0;
}

/**
 * Function 43: Calculate Days Sales Outstanding
 */
export function calculateDSO(accountsReceivable: number, totalCreditSales: number, days: number = 365): number {
  return totalCreditSales !== 0 ? (accountsReceivable / totalCreditSales) * days : 0;
}

/**
 * Function 44: Calculate Working Capital Ratio
 */
export function calculateWorkingCapitalRatio(currentAssets: number, currentLiabilities: number): number {
  return currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0;
}

/**
 * Function 45: Generate Alert Evaluation
 */
export function evaluateAlert(
  metricValue: number,
  rule: AlertRule
): { triggered: boolean; severity: string; message: string } {
  // Parse condition (e.g., "value > threshold", "value < threshold")
  const triggered = metricValue > rule.threshold; // Simplified logic

  return {
    triggered,
    severity: triggered ? rule.severity : 'normal',
    message: triggered
      ? `Alert: ${rule.name} - Value ${metricValue} exceeds threshold ${rule.threshold}`
      : 'Normal',
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generates a UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Formats timestamp according to interval
 */
function formatPeriod(timestamp: Date, interval: string): string {
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  const day = String(timestamp.getDate()).padStart(2, '0');
  const hour = String(timestamp.getHours()).padStart(2, '0');

  switch (interval) {
    case 'hour':
      return `${year}-${month}-${day} ${hour}:00`;
    case 'day':
      return `${year}-${month}-${day}`;
    case 'week':
      const weekNum = getWeekNumber(timestamp);
      return `${year}-W${String(weekNum).padStart(2, '0')}`;
    case 'month':
      return `${year}-${month}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * Gets ISO week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  createBIDashboard,
  calculateKPIStatus,
  determineTrendDirection,
  generateKPICard,
  aggregateTimeSeriesData,
  calculateMovingAverage,
  detectAnomalies,
  calculateCorrelation,
  generatePredictiveForecast,
  assessDataQuality,
  calculateConfidenceInterval,
  generateExecutiveReport,
  calculateROI,
  calculateGrowthRate,
  rankPerformance,
  calculateMarketShare,
  analyzeCohortPerformance,
  calculateChurnRate,
  calculateRetentionRate,
  calculateCLV,
  calculateCACPayback,
  performSegmentAnalysis,
  calculateVariance,
  assessForecastAccuracy,
  generateInsight,
  calculateZScore,
  calculatePercentileRank,
  calculateWeightedAverage,
  calculateCAGR,
  identifyTopPerformers,
  identifyBottomPerformers,
  calculateContributionMargin,
  calculateBreakEvenPoint,
  calculateOperatingLeverage,
  performSensitivityAnalysis,
  calculateMarketPenetration,
  calculateEfficiencyRatio,
  calculateProductivityIndex,
  generateBenchmarkComparison,
  calculateRevenuePerEmployee,
  calculateAssetTurnover,
  calculateInventoryTurnover,
  calculateDSO,
  calculateWorkingCapitalRatio,
  evaluateAlert,
  BIDashboardDB,
};
