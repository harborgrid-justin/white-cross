/**
 * LOC: ORD-ANL-001
 * File: /reuse/order/order-analytics-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Analytics controllers
 *   - Reporting services
 *   - Dashboard services
 */

/**
 * File: /reuse/order/order-analytics-reporting-kit.ts
 * Locator: WC-ORD-ANLRPT-001
 * Purpose: Order Analytics & Reporting - Comprehensive analytics, dashboards, KPIs
 *
 * Upstream: Independent utility module for order analytics and reporting
 * Downstream: ../backend/analytics/*, Reporting modules, Dashboard services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for analytics, reporting, KPIs, dashboards, forecasting
 *
 * LLM Context: Enterprise-grade order analytics and reporting utilities to compete with SAP BusinessObjects and Oracle Analytics.
 * Provides comprehensive order metrics, KPIs, sales analytics, customer analytics, product analytics, fulfillment analytics,
 * revenue reporting, trend analysis, forecasting, dashboard generation, custom reports, data export, and real-time analytics.
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
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
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsEnum, IsArray, IsDate, IsBoolean, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Op, QueryTypes, Sequelize, Transaction } from 'sequelize';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Analytics period types for time-based analysis
 */
export enum AnalyticsPeriod {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

/**
 * Report formats for data export
 */
export enum ReportFormat {
  JSON = 'JSON',
  CSV = 'CSV',
  EXCEL = 'EXCEL',
  PDF = 'PDF',
  HTML = 'HTML',
  XML = 'XML',
}

/**
 * Metric aggregation types
 */
export enum AggregationType {
  SUM = 'SUM',
  AVG = 'AVG',
  MIN = 'MIN',
  MAX = 'MAX',
  COUNT = 'COUNT',
  MEDIAN = 'MEDIAN',
  PERCENTILE = 'PERCENTILE',
  STDDEV = 'STDDEV',
}

/**
 * KPI threshold types
 */
export enum KpiThresholdType {
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  EQUALS = 'EQUALS',
  BETWEEN = 'BETWEEN',
  OUTSIDE_RANGE = 'OUTSIDE_RANGE',
}

/**
 * Dashboard widget types
 */
export enum DashboardWidgetType {
  LINE_CHART = 'LINE_CHART',
  BAR_CHART = 'BAR_CHART',
  PIE_CHART = 'PIE_CHART',
  AREA_CHART = 'AREA_CHART',
  SCATTER_CHART = 'SCATTER_CHART',
  TABLE = 'TABLE',
  KPI_CARD = 'KPI_CARD',
  GAUGE = 'GAUGE',
  HEATMAP = 'HEATMAP',
  FUNNEL = 'FUNNEL',
}

/**
 * Forecast models
 */
export enum ForecastModel {
  LINEAR_REGRESSION = 'LINEAR_REGRESSION',
  MOVING_AVERAGE = 'MOVING_AVERAGE',
  EXPONENTIAL_SMOOTHING = 'EXPONENTIAL_SMOOTHING',
  SEASONAL_DECOMPOSITION = 'SEASONAL_DECOMPOSITION',
  ARIMA = 'ARIMA',
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface MetricValue {
  value: number;
  percentage?: number;
  changeFromPrevious?: number;
  trend?: 'up' | 'down' | 'stable';
}

interface TimeSeriesDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

interface KpiThreshold {
  type: KpiThresholdType;
  value: number;
  secondValue?: number;
  color?: string;
  alert?: boolean;
}

interface DashboardWidget {
  id: string;
  type: DashboardWidgetType;
  title: string;
  data: any;
  config?: Record<string, any>;
  position?: { x: number; y: number; width: number; height: number };
}

// ============================================================================
// DTOs
// ============================================================================

export class AnalyticsQueryDto {
  @ApiProperty({ description: 'Start date for analytics period' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'End date for analytics period' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiPropertyOptional({ description: 'Period granularity', enum: AnalyticsPeriod })
  @IsOptional()
  @IsEnum(AnalyticsPeriod)
  period?: AnalyticsPeriod = AnalyticsPeriod.DAILY;

  @ApiPropertyOptional({ description: 'Comparison period start date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  comparisonStartDate?: Date;

  @ApiPropertyOptional({ description: 'Comparison period end date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  comparisonEndDate?: Date;

  @ApiPropertyOptional({ description: 'Filter by customer IDs' })
  @IsOptional()
  @IsArray()
  customerIds?: string[];

  @ApiPropertyOptional({ description: 'Filter by product IDs' })
  @IsOptional()
  @IsArray()
  productIds?: string[];

  @ApiPropertyOptional({ description: 'Filter by order status' })
  @IsOptional()
  @IsArray()
  orderStatus?: string[];

  @ApiPropertyOptional({ description: 'Filter by order source' })
  @IsOptional()
  @IsArray()
  orderSource?: string[];

  @ApiPropertyOptional({ description: 'Filter by geographic region' })
  @IsOptional()
  @IsArray()
  regions?: string[];

  @ApiPropertyOptional({ description: 'Group by fields' })
  @IsOptional()
  @IsArray()
  groupBy?: string[];
}

export class KpiConfigDto {
  @ApiProperty({ description: 'KPI identifier' })
  @IsNotEmpty()
  @IsString()
  kpiId: string;

  @ApiProperty({ description: 'KPI name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'KPI description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Target value' })
  @IsOptional()
  @IsNumber()
  target?: number;

  @ApiPropertyOptional({ description: 'Warning threshold' })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  warningThreshold?: KpiThreshold;

  @ApiPropertyOptional({ description: 'Critical threshold' })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  criticalThreshold?: KpiThreshold;

  @ApiPropertyOptional({ description: 'Enable alerts' })
  @IsOptional()
  @IsBoolean()
  enableAlerts?: boolean = false;
}

export class CustomReportDto {
  @ApiProperty({ description: 'Report name' })
  @IsNotEmpty()
  @IsString()
  reportName: string;

  @ApiProperty({ description: 'Report description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Report metrics to include' })
  @IsNotEmpty()
  @IsArray()
  metrics: string[];

  @ApiProperty({ description: 'Report dimensions for grouping' })
  @IsOptional()
  @IsArray()
  dimensions?: string[];

  @ApiProperty({ description: 'Report filters' })
  @IsOptional()
  @ValidateNested()
  @Type(() => AnalyticsQueryDto)
  filters?: AnalyticsQueryDto;

  @ApiProperty({ description: 'Report format', enum: ReportFormat })
  @IsNotEmpty()
  @IsEnum(ReportFormat)
  format: ReportFormat;

  @ApiPropertyOptional({ description: 'Include visualizations' })
  @IsOptional()
  @IsBoolean()
  includeVisualizations?: boolean = false;

  @ApiPropertyOptional({ description: 'Schedule report generation' })
  @IsOptional()
  @IsString()
  schedule?: string;
}

export class DashboardConfigDto {
  @ApiProperty({ description: 'Dashboard ID' })
  @IsNotEmpty()
  @IsString()
  dashboardId: string;

  @ApiProperty({ description: 'Dashboard name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Dashboard description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Dashboard widgets' })
  @IsNotEmpty()
  @IsArray()
  widgets: DashboardWidget[];

  @ApiPropertyOptional({ description: 'Auto-refresh interval in seconds' })
  @IsOptional()
  @IsNumber()
  @Min(30)
  refreshInterval?: number;

  @ApiPropertyOptional({ description: 'Dashboard layout configuration' })
  @IsOptional()
  layout?: Record<string, any>;
}

export class ForecastConfigDto {
  @ApiProperty({ description: 'Metric to forecast' })
  @IsNotEmpty()
  @IsString()
  metric: string;

  @ApiProperty({ description: 'Forecast model', enum: ForecastModel })
  @IsNotEmpty()
  @IsEnum(ForecastModel)
  model: ForecastModel;

  @ApiProperty({ description: 'Historical data period in days' })
  @IsNotEmpty()
  @IsNumber()
  @Min(30)
  @Max(730)
  historicalPeriodDays: number;

  @ApiProperty({ description: 'Forecast period in days' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(365)
  forecastPeriodDays: number;

  @ApiPropertyOptional({ description: 'Confidence interval (0.0-1.0)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidenceInterval?: number = 0.95;

  @ApiPropertyOptional({ description: 'Model parameters' })
  @IsOptional()
  modelParams?: Record<string, any>;
}

// ============================================================================
// ANALYTICS FUNCTIONS - ORDER METRICS & KPIs
// ============================================================================

/**
 * Calculate comprehensive order volume metrics
 * Provides total orders, average orders per day, growth rates, and period comparisons
 */
export async function calculateOrderVolumeMetrics(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
): Promise<{
  totalOrders: number;
  averageOrdersPerDay: number;
  growthRate: number;
  periodComparison: MetricValue;
  breakdown: TimeSeriesDataPoint[];
}> {
  const logger = new Logger('OrderVolumeMetrics');

  try {
    // Get total orders in period
    const [totalResult] = await sequelize.query<any>(
      `
      SELECT COUNT(DISTINCT o.id) as total_orders
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND (:orderStatus::text[] IS NULL OR o.status = ANY(:orderStatus))
        AND (:orderSource::text[] IS NULL OR o.source = ANY(:orderSource))
        AND o.deleted_at IS NULL
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
          orderStatus: query.orderStatus || null,
          orderSource: query.orderSource || null,
        },
        type: QueryTypes.SELECT,
      },
    );

    const totalOrders = parseInt(totalResult.total_orders || 0);
    const daysDiff = Math.ceil((query.endDate.getTime() - query.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const averageOrdersPerDay = totalOrders / daysDiff;

    // Get comparison period data if provided
    let growthRate = 0;
    let periodComparison: MetricValue = { value: totalOrders };

    if (query.comparisonStartDate && query.comparisonEndDate) {
      const [comparisonResult] = await sequelize.query<any>(
        `
        SELECT COUNT(DISTINCT o.id) as total_orders
        FROM orders o
        WHERE o.created_at BETWEEN :comparisonStartDate AND :comparisonEndDate
          AND (:orderStatus::text[] IS NULL OR o.status = ANY(:orderStatus))
          AND (:orderSource::text[] IS NULL OR o.source = ANY(:orderSource))
          AND o.deleted_at IS NULL
        `,
        {
          replacements: {
            comparisonStartDate: query.comparisonStartDate,
            comparisonEndDate: query.comparisonEndDate,
            orderStatus: query.orderStatus || null,
            orderSource: query.orderSource || null,
          },
          type: QueryTypes.SELECT,
        },
      );

      const comparisonTotal = parseInt(comparisonResult.total_orders || 0);
      growthRate = comparisonTotal > 0 ? ((totalOrders - comparisonTotal) / comparisonTotal) * 100 : 0;
      periodComparison = {
        value: totalOrders,
        percentage: growthRate,
        changeFromPrevious: totalOrders - comparisonTotal,
        trend: growthRate > 5 ? 'up' : growthRate < -5 ? 'down' : 'stable',
      };
    }

    // Get time series breakdown
    const periodGrouping = getPeriodGrouping(query.period);
    const breakdown = await sequelize.query<any>(
      `
      SELECT
        ${periodGrouping} as period,
        COUNT(DISTINCT o.id) as value
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND (:orderStatus::text[] IS NULL OR o.status = ANY(:orderStatus))
        AND (:orderSource::text[] IS NULL OR o.source = ANY(:orderSource))
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
          orderStatus: query.orderStatus || null,
          orderSource: query.orderSource || null,
        },
        type: QueryTypes.SELECT,
      },
    );

    const timeSeriesData: TimeSeriesDataPoint[] = breakdown.map((row: any) => ({
      timestamp: new Date(row.period),
      value: parseInt(row.value),
    }));

    logger.log(`Calculated order volume metrics: ${totalOrders} total orders, ${averageOrdersPerDay.toFixed(2)} avg/day`);

    return {
      totalOrders,
      averageOrdersPerDay,
      growthRate,
      periodComparison,
      breakdown: timeSeriesData,
    };
  } catch (error) {
    logger.error(`Failed to calculate order volume metrics: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to calculate order volume metrics');
  }
}

/**
 * Calculate average order value (AOV) and related metrics
 */
export async function calculateAverageOrderValue(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
): Promise<{
  averageOrderValue: number;
  medianOrderValue: number;
  minOrderValue: number;
  maxOrderValue: number;
  breakdown: TimeSeriesDataPoint[];
  distribution: { range: string; count: number; percentage: number }[];
}> {
  const logger = new Logger('AverageOrderValue');

  try {
    const [metrics] = await sequelize.query<any>(
      `
      SELECT
        AVG(o.total_amount) as avg_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY o.total_amount) as median_value,
        MIN(o.total_amount) as min_value,
        MAX(o.total_amount) as max_value
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status NOT IN ('CANCELLED', 'DRAFT')
        AND o.deleted_at IS NULL
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    // Get time series breakdown
    const periodGrouping = getPeriodGrouping(query.period);
    const breakdown = await sequelize.query<any>(
      `
      SELECT
        ${periodGrouping} as period,
        AVG(o.total_amount) as value
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status NOT IN ('CANCELLED', 'DRAFT')
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    // Get distribution
    const distribution = await sequelize.query<any>(
      `
      WITH ranges AS (
        SELECT
          CASE
            WHEN total_amount < 50 THEN '$0-$50'
            WHEN total_amount < 100 THEN '$50-$100'
            WHEN total_amount < 250 THEN '$100-$250'
            WHEN total_amount < 500 THEN '$250-$500'
            WHEN total_amount < 1000 THEN '$500-$1000'
            ELSE '$1000+'
          END as range,
          COUNT(*) as count
        FROM orders
        WHERE created_at BETWEEN :startDate AND :endDate
          AND status NOT IN ('CANCELLED', 'DRAFT')
          AND deleted_at IS NULL
        GROUP BY range
      )
      SELECT
        range,
        count,
        ROUND(count * 100.0 / SUM(count) OVER (), 2) as percentage
      FROM ranges
      ORDER BY
        CASE range
          WHEN '$0-$50' THEN 1
          WHEN '$50-$100' THEN 2
          WHEN '$100-$250' THEN 3
          WHEN '$250-$500' THEN 4
          WHEN '$500-$1000' THEN 5
          ELSE 6
        END
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    return {
      averageOrderValue: parseFloat(metrics.avg_value || 0),
      medianOrderValue: parseFloat(metrics.median_value || 0),
      minOrderValue: parseFloat(metrics.min_value || 0),
      maxOrderValue: parseFloat(metrics.max_value || 0),
      breakdown: breakdown.map((row: any) => ({
        timestamp: new Date(row.period),
        value: parseFloat(row.value),
      })),
      distribution: distribution.map((row: any) => ({
        range: row.range,
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage),
      })),
    };
  } catch (error) {
    logger.error(`Failed to calculate average order value: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to calculate average order value');
  }
}

/**
 * Calculate order fulfillment rate and time metrics
 */
export async function calculateFulfillmentMetrics(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
): Promise<{
  fulfillmentRate: number;
  averageFulfillmentTime: number;
  onTimeDeliveryRate: number;
  breakdown: TimeSeriesDataPoint[];
  statusDistribution: { status: string; count: number; percentage: number }[];
}> {
  const logger = new Logger('FulfillmentMetrics');

  try {
    const [metrics] = await sequelize.query<any>(
      `
      WITH fulfillment_stats AS (
        SELECT
          o.id,
          o.status,
          o.created_at,
          o.shipped_at,
          o.delivered_at,
          o.expected_delivery_date,
          EXTRACT(EPOCH FROM (COALESCE(o.delivered_at, NOW()) - o.created_at)) / 3600 as fulfillment_hours,
          CASE
            WHEN o.delivered_at IS NOT NULL AND o.delivered_at <= o.expected_delivery_date THEN true
            ELSE false
          END as on_time
        FROM orders o
        WHERE o.created_at BETWEEN :startDate AND :endDate
          AND o.status NOT IN ('CANCELLED', 'DRAFT')
          AND o.deleted_at IS NULL
      )
      SELECT
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_orders,
        AVG(fulfillment_hours) FILTER (WHERE status = 'COMPLETED') as avg_fulfillment_hours,
        COUNT(*) FILTER (WHERE on_time = true) as on_time_deliveries,
        COUNT(*) FILTER (WHERE delivered_at IS NOT NULL) as delivered_orders
      FROM fulfillment_stats
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    const totalOrders = parseInt(metrics.total_orders || 0);
    const completedOrders = parseInt(metrics.completed_orders || 0);
    const deliveredOrders = parseInt(metrics.delivered_orders || 0);
    const onTimeDeliveries = parseInt(metrics.on_time_deliveries || 0);

    const fulfillmentRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    const onTimeDeliveryRate = deliveredOrders > 0 ? (onTimeDeliveries / deliveredOrders) * 100 : 0;
    const averageFulfillmentTime = parseFloat(metrics.avg_fulfillment_hours || 0);

    // Get status distribution
    const statusDistribution = await sequelize.query<any>(
      `
      SELECT
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM orders
      WHERE created_at BETWEEN :startDate AND :endDate
        AND deleted_at IS NULL
      GROUP BY status
      ORDER BY count DESC
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    // Get time series breakdown
    const periodGrouping = getPeriodGrouping(query.period);
    const breakdown = await sequelize.query<any>(
      `
      SELECT
        ${periodGrouping} as period,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') * 100.0 / NULLIF(COUNT(*), 0) as value
      FROM orders
      WHERE created_at BETWEEN :startDate AND :endDate
        AND status NOT IN ('DRAFT')
        AND deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    return {
      fulfillmentRate,
      averageFulfillmentTime,
      onTimeDeliveryRate,
      breakdown: breakdown.map((row: any) => ({
        timestamp: new Date(row.period),
        value: parseFloat(row.value || 0),
      })),
      statusDistribution: statusDistribution.map((row: any) => ({
        status: row.status,
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage),
      })),
    };
  } catch (error) {
    logger.error(`Failed to calculate fulfillment metrics: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to calculate fulfillment metrics');
  }
}

// ============================================================================
// SALES ANALYTICS
// ============================================================================

/**
 * Calculate comprehensive revenue metrics
 */
export async function calculateRevenueMetrics(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
): Promise<{
  totalRevenue: number;
  netRevenue: number;
  grossProfit: number;
  grossMargin: number;
  revenueGrowth: number;
  breakdown: TimeSeriesDataPoint[];
  byChannel: { channel: string; revenue: number; percentage: number }[];
}> {
  const logger = new Logger('RevenueMetrics');

  try {
    const [metrics] = await sequelize.query<any>(
      `
      SELECT
        SUM(o.total_amount) as total_revenue,
        SUM(o.total_amount - COALESCE(o.discount_amount, 0) - COALESCE(o.tax_amount, 0)) as net_revenue,
        SUM(o.total_amount - COALESCE(o.cost_amount, 0)) as gross_profit
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    const totalRevenue = parseFloat(metrics.total_revenue || 0);
    const netRevenue = parseFloat(metrics.net_revenue || 0);
    const grossProfit = parseFloat(metrics.gross_profit || 0);
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // Get growth rate
    let revenueGrowth = 0;
    if (query.comparisonStartDate && query.comparisonEndDate) {
      const [comparisonMetrics] = await sequelize.query<any>(
        `
        SELECT SUM(o.total_amount) as total_revenue
        FROM orders o
        WHERE o.created_at BETWEEN :comparisonStartDate AND :comparisonEndDate
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        `,
        {
          replacements: {
            comparisonStartDate: query.comparisonStartDate,
            comparisonEndDate: query.comparisonEndDate,
          },
          type: QueryTypes.SELECT,
        },
      );
      const comparisonRevenue = parseFloat(comparisonMetrics.total_revenue || 0);
      revenueGrowth = comparisonRevenue > 0 ? ((totalRevenue - comparisonRevenue) / comparisonRevenue) * 100 : 0;
    }

    // Get revenue by channel
    const byChannel = await sequelize.query<any>(
      `
      SELECT
        o.source as channel,
        SUM(o.total_amount) as revenue,
        ROUND(SUM(o.total_amount) * 100.0 / SUM(SUM(o.total_amount)) OVER (), 2) as percentage
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY o.source
      ORDER BY revenue DESC
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    // Get time series breakdown
    const periodGrouping = getPeriodGrouping(query.period);
    const breakdown = await sequelize.query<any>(
      `
      SELECT
        ${periodGrouping} as period,
        SUM(o.total_amount) as value
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    return {
      totalRevenue,
      netRevenue,
      grossProfit,
      grossMargin,
      revenueGrowth,
      breakdown: breakdown.map((row: any) => ({
        timestamp: new Date(row.period),
        value: parseFloat(row.value || 0),
      })),
      byChannel: byChannel.map((row: any) => ({
        channel: row.channel,
        revenue: parseFloat(row.revenue),
        percentage: parseFloat(row.percentage),
      })),
    };
  } catch (error) {
    logger.error(`Failed to calculate revenue metrics: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to calculate revenue metrics');
  }
}

/**
 * Analyze sales conversion funnel
 */
export async function analyzeSalesConversionFunnel(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
): Promise<{
  stages: { stage: string; count: number; conversionRate: number; dropOffRate: number }[];
  overallConversionRate: number;
  averageTimeToConvert: number;
}> {
  const logger = new Logger('SalesConversionFunnel');

  try {
    const stages = await sequelize.query<any>(
      `
      WITH funnel_stages AS (
        SELECT
          'Browsing' as stage, 1 as stage_order, COUNT(DISTINCT session_id) as count
        FROM user_sessions
        WHERE created_at BETWEEN :startDate AND :endDate

        UNION ALL

        SELECT
          'Cart Created' as stage, 2 as stage_order, COUNT(DISTINCT cart_id) as count
        FROM shopping_carts
        WHERE created_at BETWEEN :startDate AND :endDate

        UNION ALL

        SELECT
          'Checkout Started' as stage, 3 as stage_order, COUNT(DISTINCT id) as count
        FROM orders
        WHERE created_at BETWEEN :startDate AND :endDate
          AND status != 'DRAFT'

        UNION ALL

        SELECT
          'Payment Completed' as stage, 4 as stage_order, COUNT(DISTINCT id) as count
        FROM orders
        WHERE created_at BETWEEN :startDate AND :endDate
          AND status NOT IN ('DRAFT', 'CANCELLED')

        UNION ALL

        SELECT
          'Order Completed' as stage, 5 as stage_order, COUNT(DISTINCT id) as count
        FROM orders
        WHERE created_at BETWEEN :startDate AND :endDate
          AND status = 'COMPLETED'
      )
      SELECT
        stage,
        count,
        ROUND(count * 100.0 / FIRST_VALUE(count) OVER (ORDER BY stage_order), 2) as conversion_rate,
        ROUND((LAG(count) OVER (ORDER BY stage_order) - count) * 100.0 /
              NULLIF(LAG(count) OVER (ORDER BY stage_order), 0), 2) as drop_off_rate
      FROM funnel_stages
      ORDER BY stage_order
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    const firstStageCount = stages[0]?.count || 1;
    const lastStageCount = stages[stages.length - 1]?.count || 0;
    const overallConversionRate = (lastStageCount / firstStageCount) * 100;

    // Calculate average time to convert
    const [timeMetrics] = await sequelize.query<any>(
      `
      SELECT AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 3600) as avg_hours
      FROM orders
      WHERE created_at BETWEEN :startDate AND :endDate
        AND status = 'COMPLETED'
        AND completed_at IS NOT NULL
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    return {
      stages: stages.map((row: any) => ({
        stage: row.stage,
        count: parseInt(row.count),
        conversionRate: parseFloat(row.conversion_rate || 0),
        dropOffRate: parseFloat(row.drop_off_rate || 0),
      })),
      overallConversionRate,
      averageTimeToConvert: parseFloat(timeMetrics.avg_hours || 0),
    };
  } catch (error) {
    logger.error(`Failed to analyze sales conversion funnel: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to analyze sales conversion funnel');
  }
}

/**
 * Calculate sales by product category
 */
export async function calculateSalesByCategory(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
): Promise<{
  categories: { categoryId: string; categoryName: string; revenue: number; orders: number; units: number; percentage: number }[];
  topPerforming: any[];
  underPerforming: any[];
}> {
  const logger = new Logger('SalesByCategory');

  try {
    const categories = await sequelize.query<any>(
      `
      SELECT
        p.category_id as category_id,
        pc.name as category_name,
        SUM(oi.subtotal) as revenue,
        COUNT(DISTINCT oi.order_id) as orders,
        SUM(oi.quantity) as units,
        ROUND(SUM(oi.subtotal) * 100.0 / SUM(SUM(oi.subtotal)) OVER (), 2) as percentage
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      JOIN product_categories pc ON pc.id = p.category_id
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY p.category_id, pc.name
      ORDER BY revenue DESC
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    const sortedByRevenue = [...categories].sort((a: any, b: any) => b.revenue - a.revenue);
    const topPerforming = sortedByRevenue.slice(0, 5);
    const underPerforming = sortedByRevenue.slice(-5).reverse();

    return {
      categories: categories.map((row: any) => ({
        categoryId: row.category_id,
        categoryName: row.category_name,
        revenue: parseFloat(row.revenue),
        orders: parseInt(row.orders),
        units: parseInt(row.units),
        percentage: parseFloat(row.percentage),
      })),
      topPerforming,
      underPerforming,
    };
  } catch (error) {
    logger.error(`Failed to calculate sales by category: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to calculate sales by category');
  }
}

// ============================================================================
// CUSTOMER ANALYTICS
// ============================================================================

/**
 * Calculate customer lifetime value (CLV) metrics
 */
export async function calculateCustomerLifetimeValue(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
): Promise<{
  averageCLV: number;
  medianCLV: number;
  topCustomers: { customerId: string; customerName: string; clv: number; orderCount: number }[];
  clvDistribution: { range: string; count: number; percentage: number }[];
}> {
  const logger = new Logger('CustomerLifetimeValue');

  try {
    const [metrics] = await sequelize.query<any>(
      `
      WITH customer_clv AS (
        SELECT
          o.customer_id,
          SUM(o.total_amount) as lifetime_value,
          COUNT(*) as order_count
        FROM orders o
        WHERE o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY o.customer_id
      )
      SELECT
        AVG(lifetime_value) as avg_clv,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY lifetime_value) as median_clv
      FROM customer_clv
      `,
      {
        type: QueryTypes.SELECT,
      },
    );

    // Get top customers
    const topCustomers = await sequelize.query<any>(
      `
      WITH customer_clv AS (
        SELECT
          o.customer_id,
          c.name as customer_name,
          SUM(o.total_amount) as lifetime_value,
          COUNT(*) as order_count
        FROM orders o
        JOIN customers c ON c.id = o.customer_id
        WHERE o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY o.customer_id, c.name
      )
      SELECT *
      FROM customer_clv
      ORDER BY lifetime_value DESC
      LIMIT 20
      `,
      {
        type: QueryTypes.SELECT,
      },
    );

    // Get CLV distribution
    const clvDistribution = await sequelize.query<any>(
      `
      WITH customer_clv AS (
        SELECT
          o.customer_id,
          SUM(o.total_amount) as lifetime_value
        FROM orders o
        WHERE o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY o.customer_id
      ),
      ranges AS (
        SELECT
          CASE
            WHEN lifetime_value < 100 THEN '$0-$100'
            WHEN lifetime_value < 500 THEN '$100-$500'
            WHEN lifetime_value < 1000 THEN '$500-$1000'
            WHEN lifetime_value < 5000 THEN '$1000-$5000'
            WHEN lifetime_value < 10000 THEN '$5000-$10000'
            ELSE '$10000+'
          END as range,
          COUNT(*) as count
        FROM customer_clv
        GROUP BY range
      )
      SELECT
        range,
        count,
        ROUND(count * 100.0 / SUM(count) OVER (), 2) as percentage
      FROM ranges
      ORDER BY
        CASE range
          WHEN '$0-$100' THEN 1
          WHEN '$100-$500' THEN 2
          WHEN '$500-$1000' THEN 3
          WHEN '$1000-$5000' THEN 4
          WHEN '$5000-$10000' THEN 5
          ELSE 6
        END
      `,
      {
        type: QueryTypes.SELECT,
      },
    );

    return {
      averageCLV: parseFloat(metrics.avg_clv || 0),
      medianCLV: parseFloat(metrics.median_clv || 0),
      topCustomers: topCustomers.map((row: any) => ({
        customerId: row.customer_id,
        customerName: row.customer_name,
        clv: parseFloat(row.lifetime_value),
        orderCount: parseInt(row.order_count),
      })),
      clvDistribution: clvDistribution.map((row: any) => ({
        range: row.range,
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage),
      })),
    };
  } catch (error) {
    logger.error(`Failed to calculate customer lifetime value: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to calculate customer lifetime value');
  }
}

/**
 * Analyze customer retention and churn
 */
export async function analyzeCustomerRetention(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
): Promise<{
  retentionRate: number;
  churnRate: number;
  repeatCustomerRate: number;
  cohortAnalysis: { cohort: string; customers: number; retained: number; retentionRate: number }[];
}> {
  const logger = new Logger('CustomerRetention');

  try {
    // Calculate retention metrics
    const [metrics] = await sequelize.query<any>(
      `
      WITH customer_stats AS (
        SELECT
          customer_id,
          MIN(created_at) as first_order_date,
          MAX(created_at) as last_order_date,
          COUNT(*) as order_count
        FROM orders
        WHERE status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND deleted_at IS NULL
        GROUP BY customer_id
      )
      SELECT
        COUNT(DISTINCT CASE WHEN order_count > 1 THEN customer_id END) * 100.0 /
          NULLIF(COUNT(DISTINCT customer_id), 0) as repeat_customer_rate,
        COUNT(DISTINCT CASE
          WHEN last_order_date >= :startDate - INTERVAL '90 days' THEN customer_id
        END) * 100.0 / NULLIF(COUNT(DISTINCT customer_id), 0) as retention_rate,
        COUNT(DISTINCT CASE
          WHEN last_order_date < :startDate - INTERVAL '90 days' THEN customer_id
        END) * 100.0 / NULLIF(COUNT(DISTINCT customer_id), 0) as churn_rate
      FROM customer_stats
      WHERE first_order_date < :startDate
      `,
      {
        replacements: {
          startDate: query.startDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    // Cohort analysis
    const cohortAnalysis = await sequelize.query<any>(
      `
      WITH first_orders AS (
        SELECT
          customer_id,
          DATE_TRUNC('month', MIN(created_at)) as cohort_month
        FROM orders
        WHERE status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND deleted_at IS NULL
        GROUP BY customer_id
      ),
      cohort_customers AS (
        SELECT
          fo.cohort_month,
          COUNT(DISTINCT fo.customer_id) as total_customers,
          COUNT(DISTINCT CASE
            WHEN o.created_at >= :startDate THEN o.customer_id
          END) as retained_customers
        FROM first_orders fo
        LEFT JOIN orders o ON o.customer_id = fo.customer_id
          AND o.created_at >= :startDate
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        WHERE fo.cohort_month >= :startDate - INTERVAL '12 months'
          AND fo.cohort_month < :startDate
        GROUP BY fo.cohort_month
      )
      SELECT
        TO_CHAR(cohort_month, 'YYYY-MM') as cohort,
        total_customers as customers,
        retained_customers as retained,
        ROUND(retained_customers * 100.0 / NULLIF(total_customers, 0), 2) as retention_rate
      FROM cohort_customers
      ORDER BY cohort_month DESC
      `,
      {
        replacements: {
          startDate: query.startDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    return {
      retentionRate: parseFloat(metrics.retention_rate || 0),
      churnRate: parseFloat(metrics.churn_rate || 0),
      repeatCustomerRate: parseFloat(metrics.repeat_customer_rate || 0),
      cohortAnalysis: cohortAnalysis.map((row: any) => ({
        cohort: row.cohort,
        customers: parseInt(row.customers),
        retained: parseInt(row.retained),
        retentionRate: parseFloat(row.retention_rate),
      })),
    };
  } catch (error) {
    logger.error(`Failed to analyze customer retention: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to analyze customer retention');
  }
}

/**
 * Segment customers by RFM (Recency, Frequency, Monetary) analysis
 */
export async function segmentCustomersByRFM(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
): Promise<{
  segments: { segment: string; customers: number; percentage: number; avgRevenue: number }[];
  customerSegments: { customerId: string; recencyScore: number; frequencyScore: number; monetaryScore: number; segment: string }[];
}> {
  const logger = new Logger('CustomerRFMSegmentation');

  try {
    const rfmSegments = await sequelize.query<any>(
      `
      WITH customer_rfm AS (
        SELECT
          o.customer_id,
          EXTRACT(DAYS FROM (NOW() - MAX(o.created_at))) as recency_days,
          COUNT(DISTINCT o.id) as frequency,
          SUM(o.total_amount) as monetary
        FROM orders o
        WHERE o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY o.customer_id
      ),
      rfm_scores AS (
        SELECT
          customer_id,
          recency_days,
          frequency,
          monetary,
          NTILE(5) OVER (ORDER BY recency_days DESC) as recency_score,
          NTILE(5) OVER (ORDER BY frequency ASC) as frequency_score,
          NTILE(5) OVER (ORDER BY monetary ASC) as monetary_score
        FROM customer_rfm
      ),
      segmented AS (
        SELECT
          customer_id,
          recency_score,
          frequency_score,
          monetary_score,
          monetary,
          CASE
            WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'Champions'
            WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'Loyal Customers'
            WHEN recency_score >= 4 AND frequency_score <= 2 THEN 'Potential Loyalists'
            WHEN recency_score >= 3 AND monetary_score >= 4 THEN 'Big Spenders'
            WHEN recency_score <= 2 AND frequency_score >= 3 THEN 'At Risk'
            WHEN recency_score <= 1 AND frequency_score >= 4 THEN 'Cant Lose Them'
            WHEN recency_score >= 4 AND frequency_score <= 1 THEN 'New Customers'
            WHEN recency_score <= 2 AND frequency_score <= 2 THEN 'Hibernating'
            ELSE 'Need Attention'
          END as segment
        FROM rfm_scores
      )
      SELECT
        segment,
        COUNT(*) as customers,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage,
        AVG(monetary) as avg_revenue
      FROM segmented
      GROUP BY segment
      ORDER BY customers DESC
      `,
      {
        type: QueryTypes.SELECT,
      },
    );

    // Get individual customer segments
    const customerSegments = await sequelize.query<any>(
      `
      WITH customer_rfm AS (
        SELECT
          o.customer_id,
          EXTRACT(DAYS FROM (NOW() - MAX(o.created_at))) as recency_days,
          COUNT(DISTINCT o.id) as frequency,
          SUM(o.total_amount) as monetary
        FROM orders o
        WHERE o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY o.customer_id
      ),
      rfm_scores AS (
        SELECT
          customer_id,
          NTILE(5) OVER (ORDER BY recency_days DESC) as recency_score,
          NTILE(5) OVER (ORDER BY frequency ASC) as frequency_score,
          NTILE(5) OVER (ORDER BY monetary ASC) as monetary_score
        FROM customer_rfm
      )
      SELECT
        customer_id,
        recency_score,
        frequency_score,
        monetary_score,
        CASE
          WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'Champions'
          WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'Loyal Customers'
          WHEN recency_score >= 4 AND frequency_score <= 2 THEN 'Potential Loyalists'
          WHEN recency_score >= 3 AND monetary_score >= 4 THEN 'Big Spenders'
          WHEN recency_score <= 2 AND frequency_score >= 3 THEN 'At Risk'
          WHEN recency_score <= 1 AND frequency_score >= 4 THEN 'Cant Lose Them'
          WHEN recency_score >= 4 AND frequency_score <= 1 THEN 'New Customers'
          WHEN recency_score <= 2 AND frequency_score <= 2 THEN 'Hibernating'
          ELSE 'Need Attention'
        END as segment
      FROM rfm_scores
      LIMIT 1000
      `,
      {
        type: QueryTypes.SELECT,
      },
    );

    return {
      segments: rfmSegments.map((row: any) => ({
        segment: row.segment,
        customers: parseInt(row.customers),
        percentage: parseFloat(row.percentage),
        avgRevenue: parseFloat(row.avg_revenue),
      })),
      customerSegments: customerSegments.map((row: any) => ({
        customerId: row.customer_id,
        recencyScore: parseInt(row.recency_score),
        frequencyScore: parseInt(row.frequency_score),
        monetaryScore: parseInt(row.monetary_score),
        segment: row.segment,
      })),
    };
  } catch (error) {
    logger.error(`Failed to segment customers by RFM: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to segment customers by RFM');
  }
}

// ============================================================================
// PRODUCT ANALYTICS
// ============================================================================

/**
 * Analyze top-performing products
 */
export async function analyzeTopPerformingProducts(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
  limit: number = 50,
): Promise<{
  topByRevenue: { productId: string; productName: string; revenue: number; units: number; orders: number }[];
  topByUnits: { productId: string; productName: string; units: number; revenue: number; orders: number }[];
  topByOrders: { productId: string; productName: string; orders: number; revenue: number; units: number }[];
}> {
  const logger = new Logger('TopPerformingProducts');

  try {
    // Top by revenue
    const topByRevenue = await sequelize.query<any>(
      `
      SELECT
        p.id as product_id,
        p.name as product_name,
        SUM(oi.subtotal) as revenue,
        SUM(oi.quantity) as units,
        COUNT(DISTINCT oi.order_id) as orders
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT :limit
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
          limit,
        },
        type: QueryTypes.SELECT,
      },
    );

    // Top by units
    const topByUnits = await sequelize.query<any>(
      `
      SELECT
        p.id as product_id,
        p.name as product_name,
        SUM(oi.quantity) as units,
        SUM(oi.subtotal) as revenue,
        COUNT(DISTINCT oi.order_id) as orders
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY p.id, p.name
      ORDER BY units DESC
      LIMIT :limit
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
          limit,
        },
        type: QueryTypes.SELECT,
      },
    );

    // Top by orders
    const topByOrders = await sequelize.query<any>(
      `
      SELECT
        p.id as product_id,
        p.name as product_name,
        COUNT(DISTINCT oi.order_id) as orders,
        SUM(oi.subtotal) as revenue,
        SUM(oi.quantity) as units
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY p.id, p.name
      ORDER BY orders DESC
      LIMIT :limit
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
          limit,
        },
        type: QueryTypes.SELECT,
      },
    );

    const mapProduct = (row: any) => ({
      productId: row.product_id,
      productName: row.product_name,
      revenue: parseFloat(row.revenue || 0),
      units: parseInt(row.units || 0),
      orders: parseInt(row.orders || 0),
    });

    return {
      topByRevenue: topByRevenue.map(mapProduct),
      topByUnits: topByUnits.map(mapProduct),
      topByOrders: topByOrders.map(mapProduct),
    };
  } catch (error) {
    logger.error(`Failed to analyze top performing products: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to analyze top performing products');
  }
}

/**
 * Analyze product performance trends
 */
export async function analyzeProductPerformanceTrends(
  sequelize: Sequelize,
  productId: string,
  query: AnalyticsQueryDto,
): Promise<{
  productInfo: { productId: string; productName: string; category: string };
  salesTrend: TimeSeriesDataPoint[];
  seasonalityIndex: { month: number; indexValue: number }[];
  growthRate: number;
  performance: 'growing' | 'declining' | 'stable';
}> {
  const logger = new Logger('ProductPerformanceTrends');

  try {
    // Get product info
    const [productInfo] = await sequelize.query<any>(
      `
      SELECT
        p.id as product_id,
        p.name as product_name,
        pc.name as category
      FROM products p
      JOIN product_categories pc ON pc.id = p.category_id
      WHERE p.id = :productId
      `,
      {
        replacements: { productId },
        type: QueryTypes.SELECT,
      },
    );

    if (!productInfo) {
      throw new NotFoundException('Product not found');
    }

    // Get sales trend
    const periodGrouping = getPeriodGrouping(query.period);
    const salesTrend = await sequelize.query<any>(
      `
      SELECT
        ${periodGrouping} as period,
        SUM(oi.subtotal) as value
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE oi.product_id = :productId
        AND o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `,
      {
        replacements: {
          productId,
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    // Calculate seasonality index
    const seasonality = await sequelize.query<any>(
      `
      WITH monthly_sales AS (
        SELECT
          EXTRACT(MONTH FROM o.created_at) as month,
          SUM(oi.subtotal) as revenue
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE oi.product_id = :productId
          AND o.created_at >= NOW() - INTERVAL '2 years'
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY month
      ),
      avg_monthly AS (
        SELECT AVG(revenue) as avg_revenue
        FROM monthly_sales
      )
      SELECT
        ms.month,
        ROUND((ms.revenue / am.avg_revenue) * 100, 2) as index_value
      FROM monthly_sales ms
      CROSS JOIN avg_monthly am
      ORDER BY ms.month
      `,
      {
        replacements: { productId },
        type: QueryTypes.SELECT,
      },
    );

    // Calculate growth rate
    let growthRate = 0;
    let performance: 'growing' | 'declining' | 'stable' = 'stable';

    if (salesTrend.length >= 2) {
      const firstPeriodRevenue = parseFloat(salesTrend[0].value || 0);
      const lastPeriodRevenue = parseFloat(salesTrend[salesTrend.length - 1].value || 0);

      if (firstPeriodRevenue > 0) {
        growthRate = ((lastPeriodRevenue - firstPeriodRevenue) / firstPeriodRevenue) * 100;
        performance = growthRate > 10 ? 'growing' : growthRate < -10 ? 'declining' : 'stable';
      }
    }

    return {
      productInfo: {
        productId: productInfo.product_id,
        productName: productInfo.product_name,
        category: productInfo.category,
      },
      salesTrend: salesTrend.map((row: any) => ({
        timestamp: new Date(row.period),
        value: parseFloat(row.value || 0),
      })),
      seasonalityIndex: seasonality.map((row: any) => ({
        month: parseInt(row.month),
        indexValue: parseFloat(row.index_value),
      })),
      growthRate,
      performance,
    };
  } catch (error) {
    logger.error(`Failed to analyze product performance trends: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to analyze product performance trends');
  }
}

/**
 * Analyze product cross-sell and upsell opportunities
 */
export async function analyzeProductAffinity(
  sequelize: Sequelize,
  productId: string,
  minSupport: number = 0.01,
  minConfidence: number = 0.3,
): Promise<{
  frequentlyBoughtTogether: { productId: string; productName: string; frequency: number; confidence: number }[];
  recommendedUpsells: { productId: string; productName: string; priceDifference: number; conversionRate: number }[];
}> {
  const logger = new Logger('ProductAffinity');

  try {
    // Find frequently bought together products
    const frequentlyBoughtTogether = await sequelize.query<any>(
      `
      WITH product_pairs AS (
        SELECT
          oi1.order_id,
          oi2.product_id as companion_product_id
        FROM order_items oi1
        JOIN order_items oi2 ON oi2.order_id = oi1.order_id AND oi2.product_id != oi1.product_id
        JOIN orders o ON o.id = oi1.order_id
        WHERE oi1.product_id = :productId
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
      ),
      pair_counts AS (
        SELECT
          companion_product_id,
          COUNT(*) as pair_count
        FROM product_pairs
        GROUP BY companion_product_id
      ),
      base_count AS (
        SELECT COUNT(DISTINCT oi.order_id) as total_orders
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE oi.product_id = :productId
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
      )
      SELECT
        p.id as product_id,
        p.name as product_name,
        pc.pair_count as frequency,
        ROUND(pc.pair_count * 100.0 / bc.total_orders, 2) as confidence
      FROM pair_counts pc
      JOIN products p ON p.id = pc.companion_product_id
      CROSS JOIN base_count bc
      WHERE pc.pair_count * 1.0 / bc.total_orders >= :minConfidence
      ORDER BY frequency DESC
      LIMIT 20
      `,
      {
        replacements: {
          productId,
          minConfidence,
        },
        type: QueryTypes.SELECT,
      },
    );

    // Find upsell opportunities
    const recommendedUpsells = await sequelize.query<any>(
      `
      WITH base_product AS (
        SELECT price, category_id
        FROM products
        WHERE id = :productId
      ),
      upsell_candidates AS (
        SELECT
          p.id as product_id,
          p.name as product_name,
          p.price,
          COUNT(DISTINCT o.customer_id) as customer_count
        FROM products p
        JOIN order_items oi ON oi.product_id = p.id
        JOIN orders o ON o.id = oi.order_id
        CROSS JOIN base_product bp
        WHERE p.category_id = bp.category_id
          AND p.price > bp.price
          AND p.price <= bp.price * 1.5
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY p.id, p.name, p.price
      ),
      base_customers AS (
        SELECT COUNT(DISTINCT o.customer_id) as total_customers
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE oi.product_id = :productId
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
      )
      SELECT
        uc.product_id,
        uc.product_name,
        ROUND(uc.price - bp.price, 2) as price_difference,
        ROUND(uc.customer_count * 100.0 / bc.total_customers, 2) as conversion_rate
      FROM upsell_candidates uc
      CROSS JOIN base_product bp
      CROSS JOIN base_customers bc
      WHERE uc.customer_count * 1.0 / bc.total_customers >= 0.05
      ORDER BY conversion_rate DESC
      LIMIT 10
      `,
      {
        replacements: { productId },
        type: QueryTypes.SELECT,
      },
    );

    return {
      frequentlyBoughtTogether: frequentlyBoughtTogether.map((row: any) => ({
        productId: row.product_id,
        productName: row.product_name,
        frequency: parseInt(row.frequency),
        confidence: parseFloat(row.confidence),
      })),
      recommendedUpsells: recommendedUpsells.map((row: any) => ({
        productId: row.product_id,
        productName: row.product_name,
        priceDifference: parseFloat(row.price_difference),
        conversionRate: parseFloat(row.conversion_rate),
      })),
    };
  } catch (error) {
    logger.error(`Failed to analyze product affinity: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to analyze product affinity');
  }
}

// ============================================================================
// FORECASTING & TREND ANALYSIS
// ============================================================================

/**
 * Generate sales forecast using linear regression
 */
export async function generateSalesForecast(
  sequelize: Sequelize,
  config: ForecastConfigDto,
): Promise<{
  historicalData: TimeSeriesDataPoint[];
  forecastData: TimeSeriesDataPoint[];
  confidence: { upper: TimeSeriesDataPoint[]; lower: TimeSeriesDataPoint[] };
  accuracy: { mae: number; rmse: number; mape: number };
}> {
  const logger = new Logger('SalesForecast');

  try {
    const historicalStartDate = new Date();
    historicalStartDate.setDate(historicalStartDate.getDate() - config.historicalPeriodDays);

    // Get historical data
    const historicalData = await sequelize.query<any>(
      `
      SELECT
        DATE_TRUNC('day', o.created_at) as period,
        SUM(o.total_amount) as value
      FROM orders o
      WHERE o.created_at >= :startDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `,
      {
        replacements: { startDate: historicalStartDate },
        type: QueryTypes.SELECT,
      },
    );

    const timeSeries: TimeSeriesDataPoint[] = historicalData.map((row: any) => ({
      timestamp: new Date(row.period),
      value: parseFloat(row.value || 0),
    }));

    // Simple linear regression
    const n = timeSeries.length;
    const xValues = timeSeries.map((_, i) => i);
    const yValues = timeSeries.map(point => point.value);

    const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
    const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;

    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
      numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
      denominator += Math.pow(xValues[i] - xMean, 2);
    }

    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;

    // Generate forecast
    const forecastData: TimeSeriesDataPoint[] = [];
    const lastDate = timeSeries[timeSeries.length - 1].timestamp;

    for (let i = 1; i <= config.forecastPeriodDays; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setDate(forecastDate.getDate() + i);
      const forecastValue = slope * (n + i - 1) + intercept;

      forecastData.push({
        timestamp: forecastDate,
        value: Math.max(0, forecastValue),
      });
    }

    // Calculate standard error for confidence intervals
    let sumSquaredErrors = 0;
    for (let i = 0; i < n; i++) {
      const predicted = slope * i + intercept;
      sumSquaredErrors += Math.pow(yValues[i] - predicted, 2);
    }
    const standardError = Math.sqrt(sumSquaredErrors / (n - 2));

    // Z-score for 95% confidence interval
    const zScore = 1.96;
    const confidenceMargin = zScore * standardError;

    const upperConfidence = forecastData.map(point => ({
      timestamp: point.timestamp,
      value: point.value + confidenceMargin,
    }));

    const lowerConfidence = forecastData.map(point => ({
      timestamp: point.timestamp,
      value: Math.max(0, point.value - confidenceMargin),
    }));

    // Calculate accuracy metrics on historical data
    let mae = 0;
    let mse = 0;
    let mape = 0;

    for (let i = 0; i < n; i++) {
      const predicted = slope * i + intercept;
      const actual = yValues[i];
      const error = actual - predicted;

      mae += Math.abs(error);
      mse += error * error;
      if (actual !== 0) {
        mape += Math.abs(error / actual);
      }
    }

    mae /= n;
    const rmse = Math.sqrt(mse / n);
    mape = (mape / n) * 100;

    logger.log(`Generated sales forecast for ${config.forecastPeriodDays} days`);

    return {
      historicalData: timeSeries,
      forecastData,
      confidence: {
        upper: upperConfidence,
        lower: lowerConfidence,
      },
      accuracy: {
        mae,
        rmse,
        mape,
      },
    };
  } catch (error) {
    logger.error(`Failed to generate sales forecast: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to generate sales forecast');
  }
}

/**
 * Detect trends and anomalies in order data
 */
export async function detectOrderTrendsAndAnomalies(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
): Promise<{
  trend: 'upward' | 'downward' | 'stable';
  trendStrength: number;
  anomalies: { timestamp: Date; value: number; expectedValue: number; deviation: number; severity: 'low' | 'medium' | 'high' }[];
  seasonalPattern: boolean;
}> {
  const logger = new Logger('TrendAnomalyDetection');

  try {
    const periodGrouping = getPeriodGrouping(query.period);
    const timeSeries = await sequelize.query<any>(
      `
      SELECT
        ${periodGrouping} as period,
        COUNT(DISTINCT o.id) as value
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    const values = timeSeries.map((row: any) => parseFloat(row.value || 0));
    const n = values.length;

    if (n < 3) {
      throw new BadRequestException('Insufficient data for trend analysis');
    }

    // Calculate trend using linear regression
    const xValues = values.map((_, i) => i);
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
    const yMean = values.reduce((sum, y) => sum + y, 0) / n;

    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (values[i] - yMean);
      denominator += Math.pow(i - xMean, 2);
    }

    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;

    // Determine trend direction and strength
    const trendStrength = Math.abs(slope / yMean) * 100;
    const trend: 'upward' | 'downward' | 'stable' =
      slope > yMean * 0.05 ? 'upward' :
      slope < -yMean * 0.05 ? 'downward' :
      'stable';

    // Detect anomalies using standard deviation
    const mean = yMean;
    const variance = values.reduce((sum, y) => sum + Math.pow(y - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    const anomalies: any[] = [];

    for (let i = 0; i < n; i++) {
      const expectedValue = slope * i + intercept;
      const actualValue = values[i];
      const deviation = Math.abs(actualValue - expectedValue);
      const zScore = deviation / stdDev;

      if (zScore > 2) {
        anomalies.push({
          timestamp: new Date(timeSeries[i].period),
          value: actualValue,
          expectedValue,
          deviation,
          severity: zScore > 3 ? 'high' : zScore > 2.5 ? 'medium' : 'low',
        });
      }
    }

    // Detect seasonal pattern (simple check for cyclical behavior)
    let seasonalPattern = false;
    if (n >= 12) {
      const periods = [7, 30, 90]; // Weekly, monthly, quarterly
      for (const period of periods) {
        if (n >= period * 2) {
          let correlation = 0;
          for (let i = 0; i < n - period; i++) {
            correlation += values[i] * values[i + period];
          }
          correlation /= (n - period);

          if (correlation > mean * mean * 0.7) {
            seasonalPattern = true;
            break;
          }
        }
      }
    }

    logger.log(`Detected ${trend} trend with ${anomalies.length} anomalies`);

    return {
      trend,
      trendStrength,
      anomalies,
      seasonalPattern,
    };
  } catch (error) {
    logger.error(`Failed to detect trends and anomalies: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to detect trends and anomalies');
  }
}

// ============================================================================
// DASHBOARD & REPORTING
// ============================================================================

/**
 * Generate executive dashboard with key metrics
 */
export async function generateExecutiveDashboard(
  sequelize: Sequelize,
  query: AnalyticsQueryDto,
): Promise<{
  kpis: {
    totalRevenue: MetricValue;
    totalOrders: MetricValue;
    averageOrderValue: MetricValue;
    customerCount: MetricValue;
    fulfillmentRate: MetricValue;
  };
  charts: DashboardWidget[];
  alerts: { severity: 'info' | 'warning' | 'critical'; message: string; metric: string }[];
}> {
  const logger = new Logger('ExecutiveDashboard');

  try {
    // Calculate KPIs with period comparison
    const [currentMetrics] = await sequelize.query<any>(
      `
      SELECT
        SUM(o.total_amount) as total_revenue,
        COUNT(DISTINCT o.id) as total_orders,
        AVG(o.total_amount) as avg_order_value,
        COUNT(DISTINCT o.customer_id) as customer_count,
        COUNT(*) FILTER (WHERE o.status = 'COMPLETED') * 100.0 / NULLIF(COUNT(*), 0) as fulfillment_rate
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status NOT IN ('DRAFT', 'CANCELLED')
        AND o.deleted_at IS NULL
      `,
      {
        replacements: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        type: QueryTypes.SELECT,
      },
    );

    // Get comparison metrics if available
    let comparisonMetrics: any = null;
    if (query.comparisonStartDate && query.comparisonEndDate) {
      [comparisonMetrics] = await sequelize.query<any>(
        `
        SELECT
          SUM(o.total_amount) as total_revenue,
          COUNT(DISTINCT o.id) as total_orders,
          AVG(o.total_amount) as avg_order_value,
          COUNT(DISTINCT o.customer_id) as customer_count,
          COUNT(*) FILTER (WHERE o.status = 'COMPLETED') * 100.0 / NULLIF(COUNT(*), 0) as fulfillment_rate
        FROM orders o
        WHERE o.created_at BETWEEN :comparisonStartDate AND :comparisonEndDate
          AND o.status NOT IN ('DRAFT', 'CANCELLED')
          AND o.deleted_at IS NULL
        `,
        {
          replacements: {
            comparisonStartDate: query.comparisonStartDate,
            comparisonEndDate: query.comparisonEndDate,
          },
          type: QueryTypes.SELECT,
        },
      );
    }

    const createMetricValue = (current: number, comparison: number | null): MetricValue => {
      if (comparison === null) {
        return { value: current };
      }

      const change = current - comparison;
      const percentage = comparison !== 0 ? (change / comparison) * 100 : 0;

      return {
        value: current,
        percentage,
        changeFromPrevious: change,
        trend: percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable',
      };
    };

    const kpis = {
      totalRevenue: createMetricValue(
        parseFloat(currentMetrics.total_revenue || 0),
        comparisonMetrics ? parseFloat(comparisonMetrics.total_revenue || 0) : null,
      ),
      totalOrders: createMetricValue(
        parseInt(currentMetrics.total_orders || 0),
        comparisonMetrics ? parseInt(comparisonMetrics.total_orders || 0) : null,
      ),
      averageOrderValue: createMetricValue(
        parseFloat(currentMetrics.avg_order_value || 0),
        comparisonMetrics ? parseFloat(comparisonMetrics.avg_order_value || 0) : null,
      ),
      customerCount: createMetricValue(
        parseInt(currentMetrics.customer_count || 0),
        comparisonMetrics ? parseInt(comparisonMetrics.customer_count || 0) : null,
      ),
      fulfillmentRate: createMetricValue(
        parseFloat(currentMetrics.fulfillment_rate || 0),
        comparisonMetrics ? parseFloat(comparisonMetrics.fulfillment_rate || 0) : null,
      ),
    };

    // Generate charts
    const charts: DashboardWidget[] = [
      {
        id: 'revenue-trend',
        type: DashboardWidgetType.LINE_CHART,
        title: 'Revenue Trend',
        data: await getRevenueTrendData(sequelize, query),
        position: { x: 0, y: 0, width: 6, height: 3 },
      },
      {
        id: 'orders-by-status',
        type: DashboardWidgetType.PIE_CHART,
        title: 'Orders by Status',
        data: await getOrdersByStatusData(sequelize, query),
        position: { x: 6, y: 0, width: 3, height: 3 },
      },
      {
        id: 'sales-by-channel',
        type: DashboardWidgetType.BAR_CHART,
        title: 'Sales by Channel',
        data: await getSalesByChannelData(sequelize, query),
        position: { x: 9, y: 0, width: 3, height: 3 },
      },
    ];

    // Generate alerts based on thresholds
    const alerts: any[] = [];

    if (kpis.fulfillmentRate.value < 85) {
      alerts.push({
        severity: 'critical',
        message: `Fulfillment rate is ${kpis.fulfillmentRate.value.toFixed(1)}%, below target of 85%`,
        metric: 'fulfillmentRate',
      });
    }

    if (kpis.totalRevenue.trend === 'down' && Math.abs(kpis.totalRevenue.percentage || 0) > 10) {
      alerts.push({
        severity: 'warning',
        message: `Revenue decreased by ${Math.abs(kpis.totalRevenue.percentage || 0).toFixed(1)}% compared to previous period`,
        metric: 'totalRevenue',
      });
    }

    if (kpis.totalOrders.trend === 'down' && Math.abs(kpis.totalOrders.percentage || 0) > 15) {
      alerts.push({
        severity: 'critical',
        message: `Order volume dropped by ${Math.abs(kpis.totalOrders.percentage || 0).toFixed(1)}%`,
        metric: 'totalOrders',
      });
    }

    logger.log('Generated executive dashboard with KPIs and alerts');

    return {
      kpis,
      charts,
      alerts,
    };
  } catch (error) {
    logger.error(`Failed to generate executive dashboard: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to generate executive dashboard');
  }
}

/**
 * Generate custom report based on configuration
 */
export async function generateCustomReport(
  sequelize: Sequelize,
  config: CustomReportDto,
): Promise<{
  reportMetadata: { name: string; generatedAt: Date; filters: any };
  data: any[];
  summary: Record<string, any>;
  visualizations?: any[];
}> {
  const logger = new Logger('CustomReport');

  try {
    // Build dynamic SQL based on requested metrics and dimensions
    const metrics = config.metrics.map(m => {
      switch (m) {
        case 'revenue':
          return 'SUM(o.total_amount) as revenue';
        case 'orders':
          return 'COUNT(DISTINCT o.id) as orders';
        case 'units':
          return 'SUM(oi.quantity) as units';
        case 'avgOrderValue':
          return 'AVG(o.total_amount) as avg_order_value';
        default:
          return null;
      }
    }).filter(Boolean).join(', ');

    const dimensions = config.dimensions?.map(d => {
      switch (d) {
        case 'date':
          return "DATE_TRUNC('day', o.created_at) as date";
        case 'customer':
          return 'o.customer_id, c.name as customer_name';
        case 'product':
          return 'oi.product_id, p.name as product_name';
        case 'category':
          return 'p.category_id, pc.name as category_name';
        case 'source':
          return 'o.source';
        case 'status':
          return 'o.status';
        default:
          return null;
      }
    }).filter(Boolean).join(', ') || '1';

    const groupBy = config.dimensions?.map(d => {
      switch (d) {
        case 'date':
          return 'date';
        case 'customer':
          return 'o.customer_id, c.name';
        case 'product':
          return 'oi.product_id, p.name';
        case 'category':
          return 'p.category_id, pc.name';
        case 'source':
          return 'o.source';
        case 'status':
          return 'o.status';
        default:
          return null;
      }
    }).filter(Boolean).join(', ') || '1';

    // Determine required joins
    const needsOrderItems = config.metrics.includes('units') || config.dimensions?.includes('product');
    const needsProducts = config.dimensions?.includes('product') || config.dimensions?.includes('category');
    const needsCategories = config.dimensions?.includes('category');
    const needsCustomers = config.dimensions?.includes('customer');

    let joins = '';
    if (needsOrderItems) joins += '\nLEFT JOIN order_items oi ON oi.order_id = o.id';
    if (needsProducts) joins += '\nLEFT JOIN products p ON p.id = oi.product_id';
    if (needsCategories) joins += '\nLEFT JOIN product_categories pc ON pc.id = p.category_id';
    if (needsCustomers) joins += '\nLEFT JOIN customers c ON c.id = o.customer_id';

    // Build WHERE clause from filters
    const whereClauses = ['o.deleted_at IS NULL'];
    const replacements: any = {};

    if (config.filters?.startDate && config.filters?.endDate) {
      whereClauses.push('o.created_at BETWEEN :startDate AND :endDate');
      replacements.startDate = config.filters.startDate;
      replacements.endDate = config.filters.endDate;
    }

    if (config.filters?.orderStatus && config.filters.orderStatus.length > 0) {
      whereClauses.push('o.status = ANY(:orderStatus)');
      replacements.orderStatus = config.filters.orderStatus;
    }

    const whereClause = whereClauses.join(' AND ');

    // Execute query
    const query = `
      SELECT ${dimensions}, ${metrics}
      FROM orders o
      ${joins}
      WHERE ${whereClause}
      GROUP BY ${groupBy}
      ORDER BY ${config.metrics[0]} DESC
      LIMIT 10000
    `;

    const data = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });

    // Calculate summary statistics
    const summary: Record<string, any> = {};
    config.metrics.forEach(metric => {
      const values = data.map((row: any) => parseFloat(row[metric] || 0));
      summary[metric] = {
        total: values.reduce((sum, v) => sum + v, 0),
        average: values.reduce((sum, v) => sum + v, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });

    logger.log(`Generated custom report: ${config.reportName} with ${data.length} rows`);

    return {
      reportMetadata: {
        name: config.reportName,
        generatedAt: new Date(),
        filters: config.filters,
      },
      data,
      summary,
    };
  } catch (error) {
    logger.error(`Failed to generate custom report: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to generate custom report');
  }
}

/**
 * Export report data to specified format
 */
export async function exportReportData(
  data: any[],
  format: ReportFormat,
  reportName: string,
): Promise<{ fileName: string; content: Buffer | string; mimeType: string }> {
  const logger = new Logger('ExportReportData');

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${reportName}_${timestamp}`;

    switch (format) {
      case ReportFormat.JSON:
        return {
          fileName: `${fileName}.json`,
          content: JSON.stringify(data, null, 2),
          mimeType: 'application/json',
        };

      case ReportFormat.CSV:
        const csvContent = convertToCSV(data);
        return {
          fileName: `${fileName}.csv`,
          content: csvContent,
          mimeType: 'text/csv',
        };

      case ReportFormat.HTML:
        const htmlContent = convertToHTML(data, reportName);
        return {
          fileName: `${fileName}.html`,
          content: htmlContent,
          mimeType: 'text/html',
        };

      default:
        throw new BadRequestException(`Export format ${format} not implemented`);
    }
  } catch (error) {
    logger.error(`Failed to export report data: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to export report data');
  }
}

/**
 * Calculate real-time analytics metrics (last 24 hours)
 */
export async function calculateRealTimeMetrics(
  sequelize: Sequelize,
): Promise<{
  ordersLastHour: number;
  ordersLast24Hours: number;
  revenueLastHour: number;
  revenueLast24Hours: number;
  averageOrderValueLast24Hours: number;
  topProductsLast24Hours: { productId: string; productName: string; units: number }[];
  recentOrders: { orderId: string; customerId: string; amount: number; status: string; createdAt: Date }[];
}> {
  const logger = new Logger('RealTimeMetrics');

  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get hourly and daily metrics
    const [metrics] = await sequelize.query<any>(
      `
      SELECT
        COUNT(*) FILTER (WHERE created_at >= :oneHourAgo) as orders_last_hour,
        COUNT(*) FILTER (WHERE created_at >= :twentyFourHoursAgo) as orders_last_24_hours,
        SUM(total_amount) FILTER (WHERE created_at >= :oneHourAgo) as revenue_last_hour,
        SUM(total_amount) FILTER (WHERE created_at >= :twentyFourHoursAgo) as revenue_last_24_hours,
        AVG(total_amount) FILTER (WHERE created_at >= :twentyFourHoursAgo) as avg_order_value_24h
      FROM orders
      WHERE created_at >= :twentyFourHoursAgo
        AND status NOT IN ('DRAFT', 'CANCELLED')
        AND deleted_at IS NULL
      `,
      {
        replacements: {
          oneHourAgo,
          twentyFourHoursAgo,
        },
        type: QueryTypes.SELECT,
      },
    );

    // Get top products last 24 hours
    const topProducts = await sequelize.query<any>(
      `
      SELECT
        p.id as product_id,
        p.name as product_name,
        SUM(oi.quantity) as units
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at >= :twentyFourHoursAgo
        AND o.status NOT IN ('DRAFT', 'CANCELLED')
        AND o.deleted_at IS NULL
      GROUP BY p.id, p.name
      ORDER BY units DESC
      LIMIT 10
      `,
      {
        replacements: { twentyFourHoursAgo },
        type: QueryTypes.SELECT,
      },
    );

    // Get recent orders
    const recentOrders = await sequelize.query<any>(
      `
      SELECT
        id as order_id,
        customer_id,
        total_amount as amount,
        status,
        created_at
      FROM orders
      WHERE created_at >= :twentyFourHoursAgo
        AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 20
      `,
      {
        replacements: { twentyFourHoursAgo },
        type: QueryTypes.SELECT,
      },
    );

    return {
      ordersLastHour: parseInt(metrics.orders_last_hour || 0),
      ordersLast24Hours: parseInt(metrics.orders_last_24_hours || 0),
      revenueLastHour: parseFloat(metrics.revenue_last_hour || 0),
      revenueLast24Hours: parseFloat(metrics.revenue_last_24_hours || 0),
      averageOrderValueLast24Hours: parseFloat(metrics.avg_order_value_24h || 0),
      topProductsLast24Hours: topProducts.map((row: any) => ({
        productId: row.product_id,
        productName: row.product_name,
        units: parseInt(row.units),
      })),
      recentOrders: recentOrders.map((row: any) => ({
        orderId: row.order_id,
        customerId: row.customer_id,
        amount: parseFloat(row.amount),
        status: row.status,
        createdAt: new Date(row.created_at),
      })),
    };
  } catch (error) {
    logger.error(`Failed to calculate real-time metrics: ${error.message}`, error.stack);
    throw new UnprocessableEntityException('Failed to calculate real-time metrics');
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get SQL period grouping based on analytics period
 */
function getPeriodGrouping(period: AnalyticsPeriod): string {
  switch (period) {
    case AnalyticsPeriod.HOURLY:
      return "DATE_TRUNC('hour', o.created_at)";
    case AnalyticsPeriod.DAILY:
      return "DATE_TRUNC('day', o.created_at)";
    case AnalyticsPeriod.WEEKLY:
      return "DATE_TRUNC('week', o.created_at)";
    case AnalyticsPeriod.MONTHLY:
      return "DATE_TRUNC('month', o.created_at)";
    case AnalyticsPeriod.QUARTERLY:
      return "DATE_TRUNC('quarter', o.created_at)";
    case AnalyticsPeriod.YEARLY:
      return "DATE_TRUNC('year', o.created_at)";
    default:
      return "DATE_TRUNC('day', o.created_at)";
  }
}

/**
 * Get revenue trend data for dashboard
 */
async function getRevenueTrendData(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<TimeSeriesDataPoint[]> {
  const periodGrouping = getPeriodGrouping(query.period);
  const data = await sequelize.query<any>(
    `
    SELECT
      ${periodGrouping} as period,
      SUM(o.total_amount) as value
    FROM orders o
    WHERE o.created_at BETWEEN :startDate AND :endDate
      AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
      AND o.deleted_at IS NULL
    GROUP BY period
    ORDER BY period
    `,
    {
      replacements: {
        startDate: query.startDate,
        endDate: query.endDate,
      },
      type: QueryTypes.SELECT,
    },
  );

  return data.map((row: any) => ({
    timestamp: new Date(row.period),
    value: parseFloat(row.value || 0),
  }));
}

/**
 * Get orders by status distribution for dashboard
 */
async function getOrdersByStatusData(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<any[]> {
  const data = await sequelize.query<any>(
    `
    SELECT
      status,
      COUNT(*) as count
    FROM orders
    WHERE created_at BETWEEN :startDate AND :endDate
      AND deleted_at IS NULL
    GROUP BY status
    ORDER BY count DESC
    `,
    {
      replacements: {
        startDate: query.startDate,
        endDate: query.endDate,
      },
      type: QueryTypes.SELECT,
    },
  );

  return data.map((row: any) => ({
    label: row.status,
    value: parseInt(row.count),
  }));
}

/**
 * Get sales by channel for dashboard
 */
async function getSalesByChannelData(sequelize: Sequelize, query: AnalyticsQueryDto): Promise<any[]> {
  const data = await sequelize.query<any>(
    `
    SELECT
      source as channel,
      SUM(total_amount) as revenue
    FROM orders
    WHERE created_at BETWEEN :startDate AND :endDate
      AND status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
      AND deleted_at IS NULL
    GROUP BY source
    ORDER BY revenue DESC
    `,
    {
      replacements: {
        startDate: query.startDate,
        endDate: query.endDate,
      },
      type: QueryTypes.SELECT,
    },
  );

  return data.map((row: any) => ({
    label: row.channel,
    value: parseFloat(row.revenue || 0),
  }));
}

/**
 * Convert data array to CSV format
 */
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Convert data array to HTML table format
 */
function convertToHTML(data: any[], title: string): string {
  if (data.length === 0) return '<html><body><h1>No Data</h1></body></html>';

  const headers = Object.keys(data[0]);
  const headerRow = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
  const dataRows = data.map(row =>
    `<tr>${headers.map(h => `<td>${row[h] ?? ''}</td>`).join('')}</tr>`
  ).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
    tr:nth-child(even) { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  <table>
    <thead>${headerRow}</thead>
    <tbody>${dataRows}</tbody>
  </table>
</body>
</html>
  `;
}
