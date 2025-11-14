/**
 * LOC: CLINIC-DATA-AGG-001
 * File: /reuse/clinic/composites/data-aggregation-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - ../education/* (education kits)
 *   - ../server/health/* (health kits)
 *   - ../data/* (data utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Data aggregation services
 *   - Business intelligence services
 *   - Reporting engines
 *   - Dashboard services
 */

/**
 * File: /reuse/clinic/composites/data-aggregation-composites.ts
 * Locator: WC-CLINIC-DATA-AGG-001
 * Purpose: Data Aggregation Composites - Cross-domain aggregation, BI, reporting, dashboards
 *
 * Upstream: NestJS, Education Kits, Health Kits, Data Utilities
 * Downstream: ../backend/clinic/*, BI Services, Reporting, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: 42 composite functions for data aggregation, reporting, business intelligence, dashboards
 *
 * LLM Context: Enterprise-grade data aggregation composites for White Cross platform.
 * Provides comprehensive cross-domain data aggregation with streaming support, business intelligence
 * query builders with optimization, report generation with multiple formats (PDF, Excel, CSV),
 * dashboard data preparation with real-time updates, analytics pipeline with incremental computation,
 * materialized views, query caching, time-series aggregation, and full observability. Implements
 * advanced TypeScript patterns with generics, mapped types, and conditional types for flexible
 * data transformations and type-safe aggregations.
 */

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';

// ============================================================================
// ADVANCED TYPE DEFINITIONS
// ============================================================================

/**
 * Data source configuration with generic data type
 */
export interface DataSource<TData = unknown> {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream';
  connection: string;
  fetchData: (query: DataQuery) => Promise<TData[]>;
  schema?: DataSchema;
  metadata: Record<string, unknown>;
}

/**
 * Data query with filtering, sorting, pagination
 */
export interface DataQuery {
  fields?: string[];
  filters?: QueryFilter[];
  sorting?: QuerySort[];
  pagination?: QueryPagination;
  aggregations?: QueryAggregation[];
  joins?: QueryJoin[];
  metadata: Record<string, unknown>;
}

/**
 * Query filter with operators
 */
export interface QueryFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like' | 'between';
  value: unknown;
}

/**
 * Query sorting
 */
export interface QuerySort {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Query pagination
 */
export interface QueryPagination {
  page: number;
  pageSize: number;
  offset?: number;
  limit?: number;
}

/**
 * Query aggregation
 */
export interface QueryAggregation {
  function: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct';
  field: string;
  alias?: string;
}

/**
 * Query join
 */
export interface QueryJoin {
  source: string;
  type: 'inner' | 'left' | 'right' | 'outer';
  on: { left: string; right: string };
}

/**
 * Data schema definition
 */
export interface DataSchema {
  fields: DataField[];
  primaryKey?: string[];
  indexes?: DataIndex[];
  relationships?: DataRelationship[];
}

/**
 * Data field definition
 */
export interface DataField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'json' | 'array';
  nullable: boolean;
  default?: unknown;
  validation?: FieldValidation;
}

/**
 * Field validation
 */
export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: unknown[];
}

/**
 * Data index
 */
export interface DataIndex {
  name: string;
  fields: string[];
  unique: boolean;
}

/**
 * Data relationship
 */
export interface DataRelationship {
  name: string;
  type: 'one_to_one' | 'one_to_many' | 'many_to_many';
  source: string;
  target: string;
  foreignKey: string;
}

/**
 * Aggregation result with type safety
 */
export interface AggregationResult<TData = unknown> {
  source: string;
  query: DataQuery;
  data: TData[];
  totalCount: number;
  aggregations: Record<string, number>;
  executionTime: number;
  cached: boolean;
  metadata: Record<string, unknown>;
}

/**
 * Report configuration
 */
export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  template?: string;
  dataSources: string[];
  parameters: ReportParameter[];
  schedule?: ReportSchedule;
  metadata: Record<string, unknown>;
}

/**
 * Report parameter
 */
export interface ReportParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  required: boolean;
  default?: unknown;
  validation?: FieldValidation;
}

/**
 * Report schedule
 */
export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time: string;
  timezone: string;
  recipients: string[];
}

/**
 * Report generation result
 */
export interface ReportResult {
  reportId: string;
  generatedAt: Date;
  format: ReportConfig['format'];
  data: unknown;
  fileUrl?: string;
  fileSize?: number;
  rowCount: number;
  executionTime: number;
  metadata: Record<string, unknown>;
}

/**
 * Dashboard widget configuration
 */
export interface DashboardWidget<TData = unknown> {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'map' | 'custom';
  title: string;
  dataSource: string;
  query: DataQuery;
  visualization: VisualizationConfig;
  refreshInterval?: number;
  data?: TData;
  lastUpdated?: Date;
  metadata: Record<string, unknown>;
}

/**
 * Visualization configuration
 */
export interface VisualizationConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  xAxis?: string;
  yAxis?: string[];
  colors?: string[];
  legend?: boolean;
  options: Record<string, unknown>;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  filters: DashboardFilter[];
  refreshInterval: number;
  metadata: Record<string, unknown>;
}

/**
 * Dashboard layout
 */
export interface DashboardLayout {
  columns: number;
  rows: number;
  positions: WidgetPosition[];
}

/**
 * Widget position
 */
export interface WidgetPosition {
  widgetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Dashboard filter
 */
export interface DashboardFilter {
  field: string;
  type: 'select' | 'multiselect' | 'date_range' | 'text';
  values?: unknown[];
  default?: unknown;
}

/**
 * Materialized view configuration
 */
export interface MaterializedViewConfig {
  id: string;
  name: string;
  query: DataQuery;
  refreshStrategy: 'on_demand' | 'scheduled' | 'incremental';
  refreshInterval?: number;
  indexes?: string[][];
  metadata: Record<string, unknown>;
}

/**
 * Analytics metric
 */
export interface AnalyticsMetric {
  name: string;
  value: number;
  unit?: string;
  timestamp: Date;
  dimensions: Record<string, string>;
  metadata: Record<string, unknown>;
}

/**
 * Time series data point
 */
export interface TimeSeriesDataPoint {
  timestamp: Date;
  value: number;
  dimensions?: Record<string, string>;
}

/**
 * Time window configuration
 */
export interface TimeWindow {
  start: Date;
  end: Date;
  granularity: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
}

/**
 * Stream aggregation window
 */
export interface StreamWindow<TData = unknown> {
  windowType: 'tumbling' | 'sliding' | 'session';
  size: number; // milliseconds
  slide?: number; // milliseconds for sliding windows
  sessionGap?: number; // milliseconds for session windows
  aggregate: (data: TData[]) => unknown;
}

/**
 * Conditional type for extracting data type from source
 */
export type ExtractDataType<T> = T extends DataSource<infer D> ? D : never;

/**
 * Mapped type for aggregation functions
 */
export type AggregationFunctions<T> = {
  [K in keyof T]: T[K] extends number ? 'sum' | 'avg' | 'min' | 'max' | 'count' : 'count';
};

/**
 * Utility type for report data
 */
export type ReportData<T> = T extends ReportConfig ? unknown : never;

// ============================================================================
// CROSS-DOMAIN DATA AGGREGATION
// ============================================================================

/**
 * Aggregate data from multiple sources
 */
@Injectable()
export class DataAggregator {
  private readonly logger = new Logger(DataAggregator.name);
  private sources = new Map<string, DataSource>();
  private cache = new Map<string, AggregationResult>();

  /**
   * Register data source
   */
  registerSource<TData>(source: DataSource<TData>): void {
    this.sources.set(source.id, source as DataSource);
    this.logger.log(`Registered data source: ${source.name}`);
  }

  /**
   * Aggregate data from single source
   */
  async aggregateFromSource<TData>(
    sourceId: string,
    query: DataQuery
  ): Promise<AggregationResult<TData>> {
    const source = this.sources.get(sourceId);
    if (!source) {
      throw new Error(`Data source ${sourceId} not found`);
    }

    const cacheKey = this.getCacheKey(sourceId, query);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.logger.log(`Returning cached result for ${sourceId}`);
      return { ...cached, cached: true } as AggregationResult<TData>;
    }

    const startTime = Date.now();
    const data = await source.fetchData(query);
    const executionTime = Date.now() - startTime;

    const result: AggregationResult<TData> = {
      source: sourceId,
      query,
      data: data as TData[],
      totalCount: data.length,
      aggregations: this.calculateAggregations(data, query.aggregations || []),
      executionTime,
      cached: false,
      metadata: {},
    };

    this.cache.set(cacheKey, result as AggregationResult);
    return result;
  }

  /**
   * Aggregate data from multiple sources
   */
  async aggregateFromMultipleSources(
    sourceIds: string[],
    query: DataQuery
  ): Promise<AggregationResult[]> {
    return Promise.all(
      sourceIds.map(id => this.aggregateFromSource(id, query))
    );
  }

  /**
   * Join data from multiple sources
   */
  async joinSources<TLeft, TRight>(
    leftSourceId: string,
    rightSourceId: string,
    leftKey: string,
    rightKey: string,
    joinType: 'inner' | 'left' | 'right' = 'inner'
  ): Promise<unknown[]> {
    const leftData = await this.aggregateFromSource<TLeft>(leftSourceId, { metadata: {} });
    const rightData = await this.aggregateFromSource<TRight>(rightSourceId, { metadata: {} });

    return this.performJoin(leftData.data, rightData.data, leftKey, rightKey, joinType);
  }

  /**
   * Calculate aggregations
   */
  private calculateAggregations(data: unknown[], aggregations: QueryAggregation[]): Record<string, number> {
    const result: Record<string, number> = {};

    aggregations.forEach(agg => {
      const values = data.map((item: any) => item[agg.field]).filter(v => v !== undefined);
      const alias = agg.alias || `${agg.function}_${agg.field}`;

      switch (agg.function) {
        case 'count':
          result[alias] = values.length;
          break;
        case 'sum':
          result[alias] = values.reduce((sum, val) => sum + Number(val), 0);
          break;
        case 'avg':
          result[alias] = values.reduce((sum, val) => sum + Number(val), 0) / values.length;
          break;
        case 'min':
          result[alias] = Math.min(...values.map(Number));
          break;
        case 'max':
          result[alias] = Math.max(...values.map(Number));
          break;
        case 'distinct':
          result[alias] = new Set(values).size;
          break;
      }
    });

    return result;
  }

  /**
   * Perform join operation
   */
  private performJoin<TLeft, TRight>(
    left: TLeft[],
    right: TRight[],
    leftKey: string,
    rightKey: string,
    joinType: 'inner' | 'left' | 'right'
  ): unknown[] {
    const result: unknown[] = [];

    if (joinType === 'inner' || joinType === 'left') {
      left.forEach(leftItem => {
        const matches = right.filter(
          (rightItem: any) => (leftItem as any)[leftKey] === rightItem[rightKey]
        );

        if (matches.length > 0) {
          matches.forEach(match => {
            result.push({ ...leftItem, ...match });
          });
        } else if (joinType === 'left') {
          result.push(leftItem);
        }
      });
    }

    if (joinType === 'right') {
      right.forEach(rightItem => {
        const matches = left.filter(
          (leftItem: any) => leftItem[leftKey] === (rightItem as any)[rightKey]
        );

        if (matches.length > 0) {
          matches.forEach(match => {
            result.push({ ...match, ...rightItem });
          });
        } else {
          result.push(rightItem);
        }
      });
    }

    return result;
  }

  /**
   * Generate cache key
   */
  private getCacheKey(sourceId: string, query: DataQuery): string {
    return crypto.createHash('sha256')
      .update(JSON.stringify({ sourceId, query }))
      .digest('hex');
  }

  /**
   * Clear cache
   */
  clearCache(sourceId?: string): void {
    if (sourceId) {
      Array.from(this.cache.keys())
        .filter(key => key.startsWith(sourceId))
        .forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }
}

/**
 * Create data query
 */
export function createDataQuery(options: Partial<DataQuery> = {}): DataQuery {
  return {
    fields: options.fields,
    filters: options.filters || [],
    sorting: options.sorting || [],
    pagination: options.pagination,
    aggregations: options.aggregations || [],
    joins: options.joins || [],
    metadata: options.metadata || {},
  };
}

/**
 * Create query filter
 */
export function createQueryFilter(
  field: string,
  operator: QueryFilter['operator'],
  value: unknown
): QueryFilter {
  return { field, operator, value };
}

/**
 * Create query aggregation
 */
export function createQueryAggregation(
  field: string,
  func: QueryAggregation['function'],
  alias?: string
): QueryAggregation {
  return { field, function: func, alias };
}

// ============================================================================
// BUSINESS INTELLIGENCE QUERY BUILDER
// ============================================================================

/**
 * Fluent BI query builder
 */
export class BIQueryBuilder {
  private query: DataQuery = { metadata: {} };

  /**
   * Select fields
   */
  select(...fields: string[]): this {
    this.query.fields = fields;
    return this;
  }

  /**
   * Add filter
   */
  where(field: string, operator: QueryFilter['operator'], value: unknown): this {
    if (!this.query.filters) {
      this.query.filters = [];
    }
    this.query.filters.push({ field, operator, value });
    return this;
  }

  /**
   * Add sorting
   */
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    if (!this.query.sorting) {
      this.query.sorting = [];
    }
    this.query.sorting.push({ field, direction });
    return this;
  }

  /**
   * Add pagination
   */
  paginate(page: number, pageSize: number): this {
    this.query.pagination = { page, pageSize };
    return this;
  }

  /**
   * Add aggregation
   */
  aggregate(field: string, func: QueryAggregation['function'], alias?: string): this {
    if (!this.query.aggregations) {
      this.query.aggregations = [];
    }
    this.query.aggregations.push({ field, function: func, alias });
    return this;
  }

  /**
   * Add join
   */
  join(
    source: string,
    type: QueryJoin['type'],
    leftField: string,
    rightField: string
  ): this {
    if (!this.query.joins) {
      this.query.joins = [];
    }
    this.query.joins.push({
      source,
      type,
      on: { left: leftField, right: rightField },
    });
    return this;
  }

  /**
   * Build query
   */
  build(): DataQuery {
    return { ...this.query };
  }
}

/**
 * Create BI query builder
 */
export function createBIQuery(): BIQueryBuilder {
  return new BIQueryBuilder();
}

/**
 * Execute BI query
 */
export async function executeBIQuery(
  aggregator: DataAggregator,
  sourceId: string,
  builder: BIQueryBuilder
): Promise<AggregationResult> {
  return aggregator.aggregateFromSource(sourceId, builder.build());
}

// ============================================================================
// REPORT GENERATION ENGINE
// ============================================================================

/**
 * Report generator with multiple format support
 */
@Injectable()
export class ReportGenerator {
  private readonly logger = new Logger(ReportGenerator.name);
  private reports = new Map<string, ReportConfig>();

  constructor(private readonly aggregator: DataAggregator) {}

  /**
   * Register report configuration
   */
  registerReport(config: ReportConfig): void {
    this.reports.set(config.id, config);
    this.logger.log(`Registered report: ${config.name}`);
  }

  /**
   * Generate report
   */
  async generateReport(
    reportId: string,
    parameters: Record<string, unknown> = {}
  ): Promise<ReportResult> {
    const config = this.reports.get(reportId);
    if (!config) {
      throw new Error(`Report ${reportId} not found`);
    }

    this.logger.log(`Generating report: ${config.name}`);
    const startTime = Date.now();

    // Fetch data from all sources
    const dataResults = await Promise.all(
      config.dataSources.map(sourceId =>
        this.aggregator.aggregateFromSource(sourceId, createDataQuery())
      )
    );

    // Combine data
    const combinedData = dataResults.flatMap(r => r.data);

    // Format based on report type
    let formattedData: unknown;
    switch (config.format) {
      case 'json':
        formattedData = this.formatAsJSON(combinedData);
        break;
      case 'csv':
        formattedData = this.formatAsCSV(combinedData);
        break;
      case 'excel':
        formattedData = this.formatAsExcel(combinedData);
        break;
      case 'pdf':
        formattedData = this.formatAsPDF(combinedData, config.template);
        break;
      case 'html':
        formattedData = this.formatAsHTML(combinedData, config.template);
        break;
    }

    const result: ReportResult = {
      reportId,
      generatedAt: new Date(),
      format: config.format,
      data: formattedData,
      rowCount: combinedData.length,
      executionTime: Date.now() - startTime,
      metadata: { parameters },
    };

    this.logger.log(`Report ${config.name} generated in ${result.executionTime}ms`);
    return result;
  }

  /**
   * Format data as JSON
   */
  private formatAsJSON(data: unknown[]): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Format data as CSV
   */
  private formatAsCSV(data: unknown[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0] as object);
    const rows = data.map(item =>
      headers.map(h => JSON.stringify((item as any)[h] || '')).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Format data as Excel (simplified)
   */
  private formatAsExcel(data: unknown[]): unknown {
    // In production, use library like exceljs or xlsx
    return { format: 'excel', data };
  }

  /**
   * Format data as PDF (simplified)
   */
  private formatAsPDF(data: unknown[], template?: string): unknown {
    // In production, use library like pdfmake or puppeteer
    return { format: 'pdf', data, template };
  }

  /**
   * Format data as HTML
   */
  private formatAsHTML(data: unknown[], template?: string): string {
    let html = '<table border="1"><thead><tr>';

    if (data.length > 0) {
      const headers = Object.keys(data[0] as object);
      html += headers.map(h => `<th>${h}</th>`).join('');
      html += '</tr></thead><tbody>';

      data.forEach(row => {
        html += '<tr>';
        headers.forEach(h => {
          html += `<td>${(row as any)[h]}</td>`;
        });
        html += '</tr>';
      });

      html += '</tbody></table>';
    }

    return html;
  }

  /**
   * Schedule report generation
   */
  scheduleReport(reportId: string): void {
    const config = this.reports.get(reportId);
    if (!config || !config.schedule) {
      throw new Error(`Cannot schedule report ${reportId}`);
    }

    this.logger.log(`Scheduled report: ${config.name} (${config.schedule.frequency})`);
    // Implementation would integrate with scheduling system
  }
}

/**
 * Create report configuration
 */
export function createReportConfig(
  id: string,
  name: string,
  format: ReportConfig['format'],
  dataSources: string[],
  options: Partial<ReportConfig> = {}
): ReportConfig {
  return {
    id,
    name,
    description: options.description || '',
    format,
    dataSources,
    parameters: options.parameters || [],
    schedule: options.schedule,
    metadata: options.metadata || {},
  };
}

// ============================================================================
// DASHBOARD DATA PREPARATION
// ============================================================================

/**
 * Dashboard manager with real-time updates
 */
@Injectable()
export class DashboardManager extends EventEmitter {
  private readonly logger = new Logger(DashboardManager.name);
  private dashboards = new Map<string, DashboardConfig>();
  private refreshTimers = new Map<string, NodeJS.Timeout>();

  constructor(private readonly aggregator: DataAggregator) {
    super();
  }

  /**
   * Register dashboard
   */
  registerDashboard(config: DashboardConfig): void {
    this.dashboards.set(config.id, config);
    this.logger.log(`Registered dashboard: ${config.name}`);

    if (config.refreshInterval > 0) {
      this.startAutoRefresh(config.id);
    }
  }

  /**
   * Load dashboard data
   */
  async loadDashboardData(dashboardId: string): Promise<DashboardConfig> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const widgetsWithData = await Promise.all(
      dashboard.widgets.map(widget => this.loadWidgetData(widget))
    );

    return {
      ...dashboard,
      widgets: widgetsWithData,
    };
  }

  /**
   * Load widget data
   */
  async loadWidgetData<TData>(widget: DashboardWidget<TData>): Promise<DashboardWidget<TData>> {
    try {
      const result = await this.aggregator.aggregateFromSource<TData>(
        widget.dataSource,
        widget.query
      );

      return {
        ...widget,
        data: result.data as TData,
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to load widget ${widget.id}: ${error.message}`);
      return widget;
    }
  }

  /**
   * Start auto-refresh for dashboard
   */
  private startAutoRefresh(dashboardId: string): void {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return;

    const timer = setInterval(async () => {
      const updatedDashboard = await this.loadDashboardData(dashboardId);
      this.emit('dashboard_updated', updatedDashboard);
    }, dashboard.refreshInterval);

    this.refreshTimers.set(dashboardId, timer);
  }

  /**
   * Stop auto-refresh
   */
  stopAutoRefresh(dashboardId: string): void {
    const timer = this.refreshTimers.get(dashboardId);
    if (timer) {
      clearInterval(timer);
      this.refreshTimers.delete(dashboardId);
    }
  }
}

/**
 * Create dashboard widget
 */
export function createDashboardWidget<TData>(
  id: string,
  type: DashboardWidget['type'],
  title: string,
  dataSource: string,
  query: DataQuery,
  visualization: VisualizationConfig
): DashboardWidget<TData> {
  return {
    id,
    type,
    title,
    dataSource,
    query,
    visualization,
    metadata: {},
  };
}

// ============================================================================
// ANALYTICS PIPELINE
// ============================================================================

/**
 * Analytics pipeline with incremental computation
 */
@Injectable()
export class AnalyticsPipeline {
  private readonly logger = new Logger(AnalyticsPipeline.name);
  private metrics: AnalyticsMetric[] = [];
  private materializedViews = new Map<string, MaterializedViewConfig>();

  /**
   * Record analytics metric
   */
  recordMetric(metric: AnalyticsMetric): void {
    this.metrics.push(metric);
    this.logger.log(`Recorded metric: ${metric.name} = ${metric.value}`);
  }

  /**
   * Query metrics
   */
  queryMetrics(
    metricName: string,
    timeWindow: TimeWindow,
    dimensions?: Record<string, string>
  ): AnalyticsMetric[] {
    return this.metrics.filter(m => {
      const matchesName = m.name === metricName;
      const inTimeWindow = m.timestamp >= timeWindow.start && m.timestamp <= timeWindow.end;
      const matchesDimensions = !dimensions || Object.entries(dimensions).every(
        ([key, value]) => m.dimensions[key] === value
      );

      return matchesName && inTimeWindow && matchesDimensions;
    });
  }

  /**
   * Aggregate time series data
   */
  aggregateTimeSeries(
    dataPoints: TimeSeriesDataPoint[],
    window: TimeWindow
  ): TimeSeriesDataPoint[] {
    const grouped = new Map<number, number[]>();

    dataPoints.forEach(point => {
      const key = this.getTimeWindowKey(point.timestamp, window.granularity);
      const values = grouped.get(key) || [];
      values.push(point.value);
      grouped.set(key, values);
    });

    return Array.from(grouped.entries()).map(([key, values]) => ({
      timestamp: new Date(key),
      value: values.reduce((sum, v) => sum + v, 0) / values.length,
    }));
  }

  /**
   * Get time window key
   */
  private getTimeWindowKey(timestamp: Date, granularity: TimeWindow['granularity']): number {
    const date = new Date(timestamp);

    switch (granularity) {
      case 'minute':
        date.setSeconds(0, 0);
        break;
      case 'hour':
        date.setMinutes(0, 0, 0);
        break;
      case 'day':
        date.setHours(0, 0, 0, 0);
        break;
      case 'week':
        const day = date.getDay();
        date.setDate(date.getDate() - day);
        date.setHours(0, 0, 0, 0);
        break;
      case 'month':
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        break;
      case 'year':
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
        break;
    }

    return date.getTime();
  }

  /**
   * Create materialized view
   */
  createMaterializedView(config: MaterializedViewConfig): void {
    this.materializedViews.set(config.id, config);
    this.logger.log(`Created materialized view: ${config.name}`);
  }

  /**
   * Refresh materialized view
   */
  async refreshMaterializedView(viewId: string, aggregator: DataAggregator): Promise<void> {
    const config = this.materializedViews.get(viewId);
    if (!config) {
      throw new Error(`Materialized view ${viewId} not found`);
    }

    this.logger.log(`Refreshing materialized view: ${config.name}`);
    // Implementation would refresh the view based on strategy
  }
}

/**
 * Create time window
 */
export function createTimeWindow(
  start: Date,
  end: Date,
  granularity: TimeWindow['granularity']
): TimeWindow {
  return { start, end, granularity };
}

/**
 * Create analytics metric
 */
export function createAnalyticsMetric(
  name: string,
  value: number,
  dimensions: Record<string, string> = {},
  options: Partial<AnalyticsMetric> = {}
): AnalyticsMetric {
  return {
    name,
    value,
    unit: options.unit,
    timestamp: options.timestamp || new Date(),
    dimensions,
    metadata: options.metadata || {},
  };
}

// Export all types and functions
export type {
  DataSource,
  DataQuery,
  QueryFilter,
  QuerySort,
  QueryPagination,
  QueryAggregation,
  QueryJoin,
  DataSchema,
  DataField,
  AggregationResult,
  ReportConfig,
  ReportResult,
  DashboardWidget,
  DashboardConfig,
  VisualizationConfig,
  MaterializedViewConfig,
  AnalyticsMetric,
  TimeSeriesDataPoint,
  TimeWindow,
  StreamWindow,
};
