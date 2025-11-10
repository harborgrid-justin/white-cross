/**
 * LOC: REPAN1234567
 * File: /reuse/reporting-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Analytics services
 *   - Dashboard controllers
 *   - Reporting services
 *   - Backend analytics modules
 */
/**
 * File: /reuse/reporting-analytics-kit.ts
 * Locator: WC-UTL-REPAN-001
 * Purpose: Comprehensive Reporting & Analytics Utilities - metrics, KPIs, dashboards, time-series, statistics, visualization
 *
 * Upstream: Independent utility module for reporting and analytics
 * Downstream: ../backend/*, Analytics services, Dashboard services, Report generators
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for aggregation, metrics, statistics, visualization, reporting, real-time analytics
 *
 * LLM Context: Comprehensive reporting and analytics utilities for building production-ready analytics systems.
 * Provides aggregation builders, time-series analysis, pivot tables, dashboard metrics, KPI tracking, statistical
 * calculations, trend analysis, chart data formatting, funnel analysis, and real-time updates. Essential for
 * data-driven applications with complex reporting requirements.
 */
import { Model, Sequelize } from 'sequelize';
interface AggregationConfig {
    model: typeof Model;
    groupBy: string[];
    metrics: MetricDefinition[];
    filters?: WhereClause;
    dateRange?: DateRange;
    timezone?: string;
}
interface MetricDefinition {
    name: string;
    field: string;
    aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'distinct' | 'percentile';
    percentile?: number;
    alias?: string;
}
interface WhereClause {
    [key: string]: any;
}
interface DateRange {
    start: Date;
    end: Date;
}
interface TimeSeriesConfig {
    model: typeof Model;
    dateField: string;
    valueField: string;
    interval: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
    dateRange: DateRange;
    timezone?: string;
    fillGaps?: boolean;
    groupBy?: string[];
}
interface TimeSeriesDataPoint {
    timestamp: Date;
    value: number;
    label: string;
    metadata?: Record<string, any>;
}
interface PivotTableConfig {
    model: typeof Model;
    rows: string[];
    columns: string[];
    values: MetricDefinition[];
    filters?: WhereClause;
    totals?: boolean;
}
interface PivotTableResult {
    data: Record<string, any>[];
    rowTotals?: Record<string, any>;
    columnTotals?: Record<string, any>;
    grandTotal?: Record<string, number>;
}
interface DashboardMetric {
    id: string;
    name: string;
    value: number | string;
    previousValue?: number | string;
    change?: number;
    changePercent?: number;
    trend?: 'up' | 'down' | 'stable';
    format?: 'number' | 'currency' | 'percentage' | 'duration';
    threshold?: ThresholdConfig;
}
interface ThresholdConfig {
    warning: number;
    critical: number;
    comparison: 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
}
interface KPIDefinition {
    id: string;
    name: string;
    description: string;
    query: string | (() => Promise<number>);
    target?: number;
    unit?: string;
    format?: string;
    refreshInterval?: number;
    tags?: string[];
}
interface KPIResult {
    id: string;
    value: number;
    target?: number;
    achievement?: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    trend?: TrendData;
    lastUpdated: Date;
}
interface TrendData {
    direction: 'up' | 'down' | 'stable';
    change: number;
    changePercent: number;
    velocity?: number;
    confidence?: number;
}
interface ReportDefinition {
    id: string;
    name: string;
    description: string;
    type: 'tabular' | 'chart' | 'pivot' | 'custom';
    dataSource: string;
    query: any;
    parameters?: ReportParameter[];
    schedule?: ScheduleConfig;
    format?: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
    recipients?: string[];
}
interface ReportParameter {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'list';
    required?: boolean;
    defaultValue?: any;
    options?: any[];
}
interface ScheduleConfig {
    frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    timezone?: string;
    enabled: boolean;
}
interface ChartDataConfig {
    type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'heatmap' | 'funnel';
    data: any[];
    xField?: string;
    yField?: string;
    seriesField?: string;
    colorScheme?: string[];
    annotations?: ChartAnnotation[];
}
interface ChartAnnotation {
    type: 'line' | 'region' | 'point' | 'text';
    value: any;
    label?: string;
    color?: string;
}
interface StatisticalSummary {
    count: number;
    sum: number;
    mean: number;
    median: number;
    mode: number[];
    min: number;
    max: number;
    range: number;
    variance: number;
    standardDeviation: number;
    quartiles: {
        q1: number;
        q2: number;
        q3: number;
    };
    percentiles: Record<number, number>;
    skewness?: number;
    kurtosis?: number;
}
interface FunnelStage {
    name: string;
    count: number;
    percentage?: number;
    dropoff?: number;
    dropoffPercent?: number;
    conversionRate?: number;
    averageTime?: number;
}
interface FunnelAnalysis {
    stages: FunnelStage[];
    totalEntries: number;
    totalConversions: number;
    overallConversionRate: number;
    averageTimeToConvert?: number;
    bottleneck?: string;
}
interface CacheStrategy {
    key: string;
    ttl: number;
    refreshInterval?: number;
    invalidationTriggers?: string[];
    compression?: boolean;
}
interface RealtimeUpdate {
    metric: string;
    value: any;
    timestamp: Date;
    delta?: number;
    metadata?: Record<string, any>;
}
/**
 * Sequelize model for Report Templates with metadata and scheduling.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ReportTemplate model
 *
 * @example
 * ```typescript
 * const ReportTemplate = createReportTemplateModel(sequelize);
 * const report = await ReportTemplate.create({
 *   name: 'Monthly Revenue Report',
 *   type: 'tabular',
 *   query: { model: 'Order', aggregation: 'sum' },
 *   schedule: { frequency: 'monthly', dayOfMonth: 1 }
 * });
 * ```
 */
export declare const createReportTemplateModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        name: string;
        description: string;
        type: string;
        category: string;
        dataSource: string;
        query: Record<string, any>;
        parameters: Record<string, any>[];
        schedule: Record<string, any> | null;
        format: string;
        recipients: string[];
        enabled: boolean;
        lastRun: Date | null;
        nextRun: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Dashboard Configurations with widgets and layout.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Dashboard model
 *
 * @example
 * ```typescript
 * const Dashboard = createDashboardModel(sequelize);
 * const dashboard = await Dashboard.create({
 *   name: 'Executive Dashboard',
 *   widgets: [
 *     { type: 'metric', metric: 'revenue', position: { x: 0, y: 0 } },
 *     { type: 'chart', chartType: 'line', position: { x: 1, y: 0 } }
 *   ]
 * });
 * ```
 */
export declare const createDashboardModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        name: string;
        description: string;
        category: string;
        widgets: Record<string, any>[];
        layout: Record<string, any>;
        filters: Record<string, any>;
        refreshInterval: number;
        isPublic: boolean;
        sharedWith: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Metrics with historical tracking and thresholds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Metric model
 *
 * @example
 * ```typescript
 * const Metric = createMetricModel(sequelize);
 * const metric = await Metric.create({
 *   name: 'daily_revenue',
 *   category: 'financial',
 *   value: 15000,
 *   target: 20000,
 *   unit: 'USD'
 * });
 * ```
 */
export declare const createMetricModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        name: string;
        displayName: string;
        description: string;
        category: string;
        value: number;
        previousValue: number | null;
        target: number | null;
        unit: string;
        format: string;
        threshold: Record<string, any> | null;
        tags: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Analytics Events for tracking and funnel analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AnalyticsEvent model
 *
 * @example
 * ```typescript
 * const AnalyticsEvent = createAnalyticsEventModel(sequelize);
 * const event = await AnalyticsEvent.create({
 *   eventType: 'page_view',
 *   userId: 123,
 *   sessionId: 'abc-123',
 *   properties: { page: '/products', duration: 45 }
 * });
 * ```
 */
export declare const createAnalyticsEventModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        eventType: string;
        eventName: string;
        userId: number | null;
        sessionId: string;
        timestamp: Date;
        properties: Record<string, any>;
        context: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Builds aggregation query with grouping and multiple metrics.
 *
 * @param {AggregationConfig} config - Aggregation configuration
 * @returns {Promise<any[]>} Aggregated results
 *
 * @example
 * ```typescript
 * const results = await buildAggregationQuery({
 *   model: Order,
 *   groupBy: ['status', 'category'],
 *   metrics: [
 *     { name: 'total_revenue', field: 'amount', aggregation: 'sum' },
 *     { name: 'order_count', field: 'id', aggregation: 'count' }
 *   ],
 *   filters: { createdAt: { [Op.gte]: startDate } }
 * });
 * ```
 */
export declare const buildAggregationQuery: (config: AggregationConfig) => Promise<any[]>;
/**
 * Creates dynamic aggregation builder with fluent interface.
 *
 * @param {typeof Model} model - Sequelize model
 * @returns {object} Builder with fluent methods
 *
 * @example
 * ```typescript
 * const results = await createAggregationBuilder(Order)
 *   .groupBy('category')
 *   .sum('amount', 'total')
 *   .avg('amount', 'average')
 *   .count('id', 'orders')
 *   .where({ status: 'completed' })
 *   .execute();
 * ```
 */
export declare const createAggregationBuilder: (model: typeof Model) => {
    groupBy(...fields: string[]): /*elided*/ any;
    sum(field: string, alias: string): /*elided*/ any;
    avg(field: string, alias: string): /*elided*/ any;
    count(field: string, alias: string): /*elided*/ any;
    countDistinct(field: string, alias: string): /*elided*/ any;
    min(field: string, alias: string): /*elided*/ any;
    max(field: string, alias: string): /*elided*/ any;
    where(conditions: WhereClause): /*elided*/ any;
    having(conditions: any): /*elided*/ any;
    orderBy(field: string, direction?: "ASC" | "DESC"): /*elided*/ any;
    execute(): Promise<any[]>;
};
/**
 * Performs multi-dimensional aggregation (rollup/cube).
 *
 * @param {typeof Model} model - Sequelize model
 * @param {string[]} dimensions - Dimension fields
 * @param {MetricDefinition[]} metrics - Metrics to aggregate
 * @param {WhereClause} [filters] - Optional filters
 * @returns {Promise<any[]>} Multi-dimensional aggregation results
 *
 * @example
 * ```typescript
 * const results = await buildMultiDimensionalAggregation(
 *   Order,
 *   ['year', 'quarter', 'month'],
 *   [{ name: 'revenue', field: 'amount', aggregation: 'sum' }],
 *   { status: 'completed' }
 * );
 * ```
 */
export declare const buildMultiDimensionalAggregation: (model: typeof Model, dimensions: string[], metrics: MetricDefinition[], filters?: WhereClause) => Promise<any[]>;
/**
 * Builds window function aggregation for running totals and rankings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {object} config - Window function configuration
 * @returns {Promise<any[]>} Results with window calculations
 *
 * @example
 * ```typescript
 * const results = await buildWindowAggregation(sequelize, 'orders', {
 *   partitionBy: ['category'],
 *   orderBy: [['created_at', 'ASC']],
 *   windowFunctions: [
 *     { function: 'ROW_NUMBER', alias: 'row_num' },
 *     { function: 'SUM', field: 'amount', alias: 'running_total' }
 *   ]
 * });
 * ```
 */
export declare const buildWindowAggregation: (sequelize: Sequelize, tableName: string, config: {
    partitionBy?: string[];
    orderBy: [string, string][];
    windowFunctions: Array<{
        function: string;
        field?: string;
        alias: string;
    }>;
    filters?: WhereClause;
}) => Promise<any[]>;
/**
 * Creates cohort analysis aggregation for retention tracking.
 *
 * @param {typeof Model} model - Sequelize model
 * @param {object} config - Cohort configuration
 * @returns {Promise<any[]>} Cohort analysis results
 *
 * @example
 * ```typescript
 * const cohorts = await buildCohortAggregation(User, {
 *   cohortField: 'createdAt',
 *   activityField: 'lastLoginAt',
 *   cohortInterval: 'month',
 *   periods: 12
 * });
 * ```
 */
export declare const buildCohortAggregation: (model: typeof Model, config: {
    cohortField: string;
    activityField: string;
    cohortInterval: "day" | "week" | "month";
    periods: number;
    filters?: WhereClause;
}) => Promise<any[]>;
/**
 * Aggregates time-series data with automatic interval bucketing.
 *
 * @param {TimeSeriesConfig} config - Time-series configuration
 * @returns {Promise<TimeSeriesDataPoint[]>} Time-series data points
 *
 * @example
 * ```typescript
 * const timeSeries = await aggregateTimeSeries({
 *   model: Order,
 *   dateField: 'createdAt',
 *   valueField: 'amount',
 *   interval: 'day',
 *   aggregation: 'sum',
 *   dateRange: { start: startDate, end: endDate },
 *   fillGaps: true
 * });
 * ```
 */
export declare const aggregateTimeSeries: (config: TimeSeriesConfig) => Promise<TimeSeriesDataPoint[]>;
/**
 * Calculates moving average for time-series data.
 *
 * @param {TimeSeriesDataPoint[]} data - Time-series data
 * @param {number} window - Window size for moving average
 * @returns {TimeSeriesDataPoint[]} Data with moving average
 *
 * @example
 * ```typescript
 * const smoothedData = calculateMovingAverage(timeSeries, 7); // 7-day MA
 * ```
 */
export declare const calculateMovingAverage: (data: TimeSeriesDataPoint[], window: number) => TimeSeriesDataPoint[];
/**
 * Detects trends and anomalies in time-series data.
 *
 * @param {TimeSeriesDataPoint[]} data - Time-series data
 * @param {object} config - Anomaly detection configuration
 * @returns {object} Trend and anomaly analysis
 *
 * @example
 * ```typescript
 * const analysis = detectTimeSeriesAnomalies(timeSeries, {
 *   stdDevThreshold: 2.5,
 *   minDataPoints: 30
 * });
 * ```
 */
export declare const detectTimeSeriesAnomalies: (data: TimeSeriesDataPoint[], config?: {
    stdDevThreshold?: number;
    minDataPoints?: number;
}) => {
    trend: "increasing" | "decreasing" | "stable";
    anomalies: Array<{
        index: number;
        point: TimeSeriesDataPoint;
        zScore: number;
    }>;
    statistics: {
        mean: number;
        stdDev: number;
    };
};
/**
 * Forecasts future time-series values using simple exponential smoothing.
 *
 * @param {TimeSeriesDataPoint[]} data - Historical time-series data
 * @param {number} periods - Number of periods to forecast
 * @param {number} [alpha=0.3] - Smoothing factor (0-1)
 * @returns {TimeSeriesDataPoint[]} Forecasted data points
 *
 * @example
 * ```typescript
 * const forecast = forecastTimeSeries(historicalData, 30, 0.3);
 * ```
 */
export declare const forecastTimeSeries: (data: TimeSeriesDataPoint[], periods: number, alpha?: number) => TimeSeriesDataPoint[];
/**
 * Generates pivot table from query results.
 *
 * @param {PivotTableConfig} config - Pivot table configuration
 * @returns {Promise<PivotTableResult>} Pivot table data
 *
 * @example
 * ```typescript
 * const pivot = await generatePivotTable({
 *   model: Sales,
 *   rows: ['region', 'product'],
 *   columns: ['quarter'],
 *   values: [{ name: 'revenue', field: 'amount', aggregation: 'sum' }],
 *   totals: true
 * });
 * ```
 */
export declare const generatePivotTable: (config: PivotTableConfig) => Promise<PivotTableResult>;
/**
 * Exports pivot table to various formats.
 *
 * @param {PivotTableResult} pivotData - Pivot table data
 * @param {string} format - Export format ('csv' | 'json' | 'html')
 * @returns {string} Formatted output
 *
 * @example
 * ```typescript
 * const csv = exportPivotTable(pivotData, 'csv');
 * ```
 */
export declare const exportPivotTable: (pivotData: PivotTableResult, format: "csv" | "json" | "html") => string;
/**
 * Calculates dashboard metric with trend comparison.
 *
 * @param {object} config - Metric calculation configuration
 * @returns {Promise<DashboardMetric>} Dashboard metric with trend
 *
 * @example
 * ```typescript
 * const metric = await calculateDashboardMetric({
 *   id: 'revenue',
 *   name: 'Total Revenue',
 *   query: async () => Order.sum('amount', { where: { status: 'completed' } }),
 *   previousQuery: async () => Order.sum('amount', { where: { status: 'completed', createdAt: { [Op.lt]: lastWeek } } }),
 *   format: 'currency'
 * });
 * ```
 */
export declare const calculateDashboardMetric: (config: {
    id: string;
    name: string;
    query: () => Promise<number>;
    previousQuery?: () => Promise<number>;
    format?: "number" | "currency" | "percentage" | "duration";
    threshold?: ThresholdConfig;
}) => Promise<DashboardMetric>;
/**
 * Calculates multiple dashboard metrics in parallel.
 *
 * @param {Array} metricConfigs - Array of metric configurations
 * @returns {Promise<DashboardMetric[]>} Array of calculated metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateDashboardMetrics([
 *   { id: 'users', name: 'Total Users', query: async () => User.count() },
 *   { id: 'revenue', name: 'Revenue', query: async () => Order.sum('amount') }
 * ]);
 * ```
 */
export declare const calculateDashboardMetrics: (metricConfigs: Array<{
    id: string;
    name: string;
    query: () => Promise<number>;
    previousQuery?: () => Promise<number>;
    format?: "number" | "currency" | "percentage" | "duration";
    threshold?: ThresholdConfig;
}>) => Promise<DashboardMetric[]>;
/**
 * Evaluates metric against thresholds.
 *
 * @param {number} value - Metric value
 * @param {ThresholdConfig} threshold - Threshold configuration
 * @returns {object} Threshold evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateMetricThreshold(95, {
 *   warning: 80,
 *   critical: 90,
 *   comparison: 'gte'
 * });
 * // { status: 'critical', breached: true }
 * ```
 */
export declare const evaluateMetricThreshold: (value: number, threshold: ThresholdConfig) => {
    status: "ok" | "warning" | "critical";
    breached: boolean;
    message?: string;
};
/**
 * Formats metric value based on format type.
 *
 * @param {number | string} value - Metric value
 * @param {string} format - Format type
 * @param {object} [options] - Formatting options
 * @returns {string} Formatted value
 *
 * @example
 * ```typescript
 * formatMetricValue(1234567, 'currency', { currency: 'USD' }); // '$1,234,567.00'
 * formatMetricValue(0.75, 'percentage'); // '75%'
 * formatMetricValue(3600, 'duration'); // '1h 0m'
 * ```
 */
export declare const formatMetricValue: (value: number | string, format: "number" | "currency" | "percentage" | "duration", options?: {
    currency?: string;
    decimals?: number;
    locale?: string;
}) => string;
/**
 * Tracks and calculates KPI with target achievement.
 *
 * @param {KPIDefinition} definition - KPI definition
 * @returns {Promise<KPIResult>} KPI result with achievement
 *
 * @example
 * ```typescript
 * const kpi = await trackKPI({
 *   id: 'customer_satisfaction',
 *   name: 'Customer Satisfaction Score',
 *   query: async () => Survey.avg('rating'),
 *   target: 4.5,
 *   unit: 'rating'
 * });
 * ```
 */
export declare const trackKPI: (definition: KPIDefinition) => Promise<KPIResult>;
/**
 * Tracks multiple KPIs and generates scorecard.
 *
 * @param {KPIDefinition[]} definitions - Array of KPI definitions
 * @returns {Promise<object>} Scorecard with all KPI results
 *
 * @example
 * ```typescript
 * const scorecard = await generateKPIScorecard([
 *   { id: 'revenue', name: 'Monthly Revenue', query: getRevenue, target: 100000 },
 *   { id: 'nps', name: 'Net Promoter Score', query: getNPS, target: 50 }
 * ]);
 * ```
 */
export declare const generateKPIScorecard: (definitions: KPIDefinition[]) => Promise<{
    kpis: KPIResult[];
    overallScore: number;
    summary: {
        excellent: number;
        good: number;
        warning: number;
        critical: number;
    };
}>;
/**
 * Calculates KPI trend over time periods.
 *
 * @param {KPIDefinition} definition - KPI definition
 * @param {Date[]} periods - Array of period timestamps
 * @returns {Promise<object>} KPI trend analysis
 *
 * @example
 * ```typescript
 * const trend = await calculateKPITrend(kpiDefinition, [
 *   new Date('2024-01-01'),
 *   new Date('2024-02-01'),
 *   new Date('2024-03-01')
 * ]);
 * ```
 */
export declare const calculateKPITrend: (definition: KPIDefinition, periods: Date[]) => Promise<{
    periods: Array<{
        date: Date;
        value: number;
        achievement: number;
    }>;
    trend: TrendData;
}>;
/**
 * Calculates comprehensive statistical summary.
 *
 * @param {number[]} values - Array of numeric values
 * @param {number[]} [percentiles=[25,50,75,90,95,99]] - Percentiles to calculate
 * @returns {StatisticalSummary} Statistical summary
 *
 * @example
 * ```typescript
 * const stats = calculateStatisticalSummary([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
 * // Returns: { mean: 5.5, median: 5.5, mode: [], min: 1, max: 10, ... }
 * ```
 */
export declare const calculateStatisticalSummary: (values: number[], percentiles?: number[]) => StatisticalSummary;
/**
 * Calculates specific percentile from dataset.
 *
 * @param {number[]} sortedValues - Sorted array of values
 * @param {number} percentile - Percentile to calculate (0-100)
 * @returns {number} Percentile value
 *
 * @example
 * ```typescript
 * const p95 = calculatePercentile([1,2,3,4,5], 95);
 * ```
 */
export declare const calculatePercentile: (sortedValues: number[], percentile: number) => number;
/**
 * Calculates correlation coefficient between two datasets.
 *
 * @param {number[]} x - First dataset
 * @param {number[]} y - Second dataset
 * @returns {number} Pearson correlation coefficient (-1 to 1)
 *
 * @example
 * ```typescript
 * const correlation = calculateCorrelation([1,2,3,4,5], [2,4,6,8,10]);
 * // Returns: 1 (perfect positive correlation)
 * ```
 */
export declare const calculateCorrelation: (x: number[], y: number[]) => number;
/**
 * Performs linear regression analysis.
 *
 * @param {number[]} x - Independent variable
 * @param {number[]} y - Dependent variable
 * @returns {object} Regression analysis results
 *
 * @example
 * ```typescript
 * const regression = performLinearRegression([1,2,3,4,5], [2,4,5,4,5]);
 * // Returns: { slope, intercept, r2, predict: (x) => y }
 * ```
 */
export declare const performLinearRegression: (x: number[], y: number[]) => {
    slope: number;
    intercept: number;
    r2: number;
    predict: (xValue: number) => number;
};
/**
 * Calculates distribution histogram with bins.
 *
 * @param {number[]} values - Array of values
 * @param {number} [bins=10] - Number of bins
 * @returns {Array<{min: number, max: number, count: number, percentage: number}>} Histogram data
 *
 * @example
 * ```typescript
 * const histogram = calculateHistogram([1,2,3,4,5,6,7,8,9,10], 5);
 * ```
 */
export declare const calculateHistogram: (values: number[], bins?: number) => Array<{
    min: number;
    max: number;
    count: number;
    percentage: number;
}>;
/**
 * Formats data for chart visualization.
 *
 * @param {ChartDataConfig} config - Chart configuration
 * @returns {object} Formatted chart data
 *
 * @example
 * ```typescript
 * const chartData = formatChartData({
 *   type: 'line',
 *   data: salesData,
 *   xField: 'date',
 *   yField: 'revenue',
 *   seriesField: 'category'
 * });
 * ```
 */
export declare const formatChartData: (config: ChartDataConfig) => object;
/**
 * Converts time-series data to chart format.
 *
 * @param {TimeSeriesDataPoint[]} data - Time-series data
 * @param {object} [options] - Formatting options
 * @returns {Array} Chart-ready data
 *
 * @example
 * ```typescript
 * const chartData = formatTimeSeriesForChart(timeSeries, {
 *   dateFormat: 'YYYY-MM-DD',
 *   valueName: 'revenue'
 * });
 * ```
 */
export declare const formatTimeSeriesForChart: (data: TimeSeriesDataPoint[], options?: {
    dateFormat?: string;
    valueName?: string;
}) => Array<{
    date: string;
    value: number;
    [key: string]: any;
}>;
/**
 * Generates heatmap data from matrix.
 *
 * @param {number[][]} matrix - 2D array of values
 * @param {string[]} rowLabels - Row labels
 * @param {string[]} columnLabels - Column labels
 * @returns {Array} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = generateHeatmapData(
 *   [[1,2,3], [4,5,6]],
 *   ['Row1', 'Row2'],
 *   ['Col1', 'Col2', 'Col3']
 * );
 * ```
 */
export declare const generateHeatmapData: (matrix: number[][], rowLabels: string[], columnLabels: string[]) => Array<{
    x: string;
    y: string;
    value: number;
}>;
/**
 * Formats funnel chart data with conversion rates.
 *
 * @param {FunnelAnalysis} funnelData - Funnel analysis data
 * @returns {Array} Funnel chart data
 *
 * @example
 * ```typescript
 * const chartData = formatFunnelChartData(funnelAnalysis);
 * ```
 */
export declare const formatFunnelChartData: (funnelData: FunnelAnalysis) => Array<{
    stage: string;
    value: number;
    conversionRate: number;
}>;
/**
 * Analyzes conversion funnel with dropoff rates.
 *
 * @param {typeof Model} model - Analytics event model
 * @param {string[]} stages - Funnel stage event names
 * @param {object} config - Funnel configuration
 * @returns {Promise<FunnelAnalysis>} Funnel analysis results
 *
 * @example
 * ```typescript
 * const funnel = await analyzeFunnel(AnalyticsEvent, [
 *   'page_view',
 *   'add_to_cart',
 *   'checkout',
 *   'purchase'
 * ], { dateRange: { start, end } });
 * ```
 */
export declare const analyzeFunnel: (model: typeof Model, stages: string[], config: {
    dateRange?: DateRange;
    filters?: WhereClause;
    sessionField?: string;
}) => Promise<FunnelAnalysis>;
/**
 * Compares multiple funnels side by side.
 *
 * @param {Array} funnelConfigs - Array of funnel configurations
 * @returns {Promise<Array>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareFunnels([
 *   { name: 'Mobile', model: AnalyticsEvent, stages: [...], filters: { device: 'mobile' } },
 *   { name: 'Desktop', model: AnalyticsEvent, stages: [...], filters: { device: 'desktop' } }
 * ]);
 * ```
 */
export declare const compareFunnels: (funnelConfigs: Array<{
    name: string;
    model: typeof Model;
    stages: string[];
    config: {
        dateRange?: DateRange;
        filters?: WhereClause;
        sessionField?: string;
    };
}>) => Promise<Array<{
    name: string;
    funnel: FunnelAnalysis;
}>>;
/**
 * Executes report template with parameters.
 *
 * @param {ReportDefinition} definition - Report definition
 * @param {Record<string, any>} parameters - Report parameters
 * @returns {Promise<any>} Report execution result
 *
 * @example
 * ```typescript
 * const report = await executeReport(reportDef, {
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 *   category: 'sales'
 * });
 * ```
 */
export declare const executeReport: (definition: ReportDefinition, parameters: Record<string, any>) => Promise<any>;
/**
 * Schedules report for automatic execution.
 *
 * @param {ReportDefinition} definition - Report definition
 * @param {ScheduleConfig} schedule - Schedule configuration
 * @returns {object} Scheduled report configuration
 *
 * @example
 * ```typescript
 * const scheduled = scheduleReport(reportDef, {
 *   frequency: 'daily',
 *   time: '09:00',
 *   timezone: 'America/New_York',
 *   enabled: true
 * });
 * ```
 */
export declare const scheduleReport: (definition: ReportDefinition, schedule: ScheduleConfig) => {
    reportId: string;
    schedule: ScheduleConfig;
    nextRun: Date;
};
/**
 * Calculates next report execution time.
 *
 * @param {ScheduleConfig} schedule - Schedule configuration
 * @returns {Date} Next execution timestamp
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRun({
 *   frequency: 'weekly',
 *   dayOfWeek: 1,
 *   time: '10:00'
 * });
 * ```
 */
export declare const calculateNextRun: (schedule: ScheduleConfig) => Date;
/**
 * Validates report parameters against definition.
 *
 * @param {ReportParameter[]} paramDefs - Parameter definitions
 * @param {Record<string, any>} values - Parameter values
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReportParameters(
 *   [{ name: 'startDate', type: 'date', required: true }],
 *   { startDate: '2024-01-01' }
 * );
 * ```
 */
export declare const validateReportParameters: (paramDefs: ReportParameter[], values: Record<string, any>) => {
    valid: boolean;
    errors: string[];
};
/**
 * Generates cache key for report results.
 *
 * @param {string} reportId - Report identifier
 * @param {Record<string, any>} parameters - Report parameters
 * @returns {string} Cache key
 *
 * @example
 * ```typescript
 * const key = generateReportCacheKey('monthly-sales', { month: '2024-01' });
 * ```
 */
export declare const generateReportCacheKey: (reportId: string, parameters: Record<string, any>) => string;
/**
 * Determines cache strategy for report.
 *
 * @param {ReportDefinition} definition - Report definition
 * @returns {CacheStrategy} Cache strategy configuration
 *
 * @example
 * ```typescript
 * const strategy = getCacheStrategy(reportDef);
 * // Returns: { key: 'report:...', ttl: 3600, ... }
 * ```
 */
export declare const getCacheStrategy: (definition: ReportDefinition) => CacheStrategy;
/**
 * Invalidates cached report results.
 *
 * @param {string} reportId - Report identifier
 * @param {Record<string, any>} [parameters] - Optional specific parameters
 * @returns {string[]} Invalidated cache keys
 *
 * @example
 * ```typescript
 * const invalidated = invalidateReportCache('monthly-sales');
 * // Returns array of invalidated cache keys
 * ```
 */
export declare const invalidateReportCache: (reportId: string, parameters?: Record<string, any>) => string[];
/**
 * Tracks real-time metric update.
 *
 * @param {string} metric - Metric name
 * @param {any} value - Metric value
 * @param {Record<string, any>} [metadata] - Optional metadata
 * @returns {RealtimeUpdate} Real-time update object
 *
 * @example
 * ```typescript
 * const update = trackRealtimeMetric('active_users', 1523, {
 *   region: 'us-east',
 *   source: 'web'
 * });
 * ```
 */
export declare const trackRealtimeMetric: (metric: string, value: any, metadata?: Record<string, any>) => RealtimeUpdate;
/**
 * Aggregates real-time events into time windows.
 *
 * @param {Array} events - Array of real-time events
 * @param {number} windowSeconds - Window size in seconds
 * @returns {Array} Aggregated windows
 *
 * @example
 * ```typescript
 * const windows = aggregateRealtimeEvents(events, 60); // 1-minute windows
 * ```
 */
export declare const aggregateRealtimeEvents: (events: Array<{
    timestamp: Date;
    value: number;
    [key: string]: any;
}>, windowSeconds: number) => Array<{
    windowStart: Date;
    windowEnd: Date;
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
}>;
/**
 * Detects real-time metric spikes and anomalies.
 *
 * @param {Array} recentValues - Recent metric values
 * @param {number} currentValue - Current value
 * @param {object} config - Detection configuration
 * @returns {object} Anomaly detection result
 *
 * @example
 * ```typescript
 * const result = detectRealtimeAnomaly(
 *   [100, 105, 98, 103],
 *   250,
 *   { threshold: 2.0 }
 * );
 * // Returns: { isAnomaly: true, severity: 'high', ... }
 * ```
 */
export declare const detectRealtimeAnomaly: (recentValues: number[], currentValue: number, config?: {
    threshold?: number;
    minSamples?: number;
}) => {
    isAnomaly: boolean;
    severity: "low" | "medium" | "high" | null;
    zScore: number;
    threshold: number;
};
/**
 * Analyzes trend direction and velocity.
 *
 * @param {TimeSeriesDataPoint[]} data - Time-series data
 * @param {object} [options] - Analysis options
 * @returns {TrendData} Trend analysis result
 *
 * @example
 * ```typescript
 * const trend = analyzeTrend(timeSeries, { smoothing: true });
 * // Returns: { direction: 'up', change: 150, changePercent: 15, velocity: 5 }
 * ```
 */
export declare const analyzeTrend: (data: TimeSeriesDataPoint[], options?: {
    smoothing?: boolean;
    confidenceLevel?: number;
}) => TrendData;
/**
 * Identifies seasonal patterns in time-series data.
 *
 * @param {TimeSeriesDataPoint[]} data - Time-series data
 * @param {number} seasonLength - Length of one season in data points
 * @returns {object} Seasonal analysis result
 *
 * @example
 * ```typescript
 * const seasonal = identifySeasonalPatterns(monthlyData, 12); // Annual seasonality
 * ```
 */
export declare const identifySeasonalPatterns: (data: TimeSeriesDataPoint[], seasonLength: number) => {
    hasSeasonality: boolean;
    strength: number;
    pattern: number[];
    peaks: number[];
    troughs: number[];
};
export {};
//# sourceMappingURL=reporting-analytics-kit.d.ts.map