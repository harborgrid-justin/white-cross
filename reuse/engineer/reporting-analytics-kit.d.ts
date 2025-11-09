/**
 * LOC: RPTANL123
 * File: /reuse/engineer/reporting-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Reporting services and controllers
 *   - Analytics engines and dashboards
 *   - BI integration modules
 */
interface ReportConfig {
    name: string;
    title: string;
    description?: string;
    dataSource: string;
    columns: ReportColumn[];
    filters?: ReportFilter[];
    sorting?: SortConfig[];
    groupBy?: string[];
    aggregations?: AggregationConfig[];
    formatting?: ReportFormatting;
}
interface ReportColumn {
    field: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'currency' | 'percentage';
    width?: number;
    align?: 'left' | 'center' | 'right';
    format?: string;
    hidden?: boolean;
    sortable?: boolean;
}
interface ReportFilter {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';
    value: any;
    condition?: 'and' | 'or';
}
interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}
interface AggregationConfig {
    field: string;
    operation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'distinct';
    label?: string;
}
interface ReportFormatting {
    headerStyle?: StyleConfig;
    dataStyle?: StyleConfig;
    footerStyle?: StyleConfig;
    alternateRowColors?: boolean;
    borders?: boolean;
}
interface StyleConfig {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    color?: string;
    backgroundColor?: string;
}
interface KPIDefinition {
    id: string;
    name: string;
    description?: string;
    metric: string;
    targetValue?: number;
    warningThreshold?: number;
    criticalThreshold?: number;
    unit?: string;
    format?: string;
    calculation: KPICalculation;
}
interface KPICalculation {
    type: 'simple' | 'ratio' | 'percentage' | 'aggregate' | 'custom';
    formula?: string;
    numerator?: string;
    denominator?: string;
    aggregation?: AggregationConfig;
}
interface KPIResult {
    id: string;
    name: string;
    value: number;
    formattedValue: string;
    targetValue?: number;
    variance?: number;
    variancePercentage?: number;
    status: 'normal' | 'warning' | 'critical';
    trend?: 'up' | 'down' | 'stable';
    sparkline?: number[];
    calculatedAt: Date;
}
interface DashboardConfig {
    id: string;
    name: string;
    widgets: DashboardWidget[];
    layout: LayoutConfig;
    refreshInterval?: number;
    filters?: ReportFilter[];
}
interface DashboardWidget {
    id: string;
    type: 'kpi' | 'chart' | 'table' | 'metric' | 'gauge' | 'sparkline';
    title: string;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    dataSource: string;
    config: any;
}
interface LayoutConfig {
    columns: number;
    rowHeight: number;
    margin?: number[];
    containerPadding?: number[];
}
interface TrendAnalysisConfig {
    dataPoints: DataPoint[];
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    algorithm: 'linear' | 'exponential' | 'polynomial' | 'moving-average';
    forecastPeriods?: number;
}
interface DataPoint {
    timestamp: Date;
    value: number;
    label?: string;
}
interface TrendAnalysisResult {
    trend: 'upward' | 'downward' | 'stable' | 'volatile';
    trendLine: DataPoint[];
    forecast?: DataPoint[];
    correlation?: number;
    volatility?: number;
    seasonality?: SeasonalityPattern;
}
interface SeasonalityPattern {
    detected: boolean;
    period?: number;
    strength?: number;
}
interface ComparativeAnalysisConfig {
    datasets: ComparativeDataset[];
    dimensions: string[];
    metrics: string[];
    comparisonType: 'period-over-period' | 'year-over-year' | 'baseline' | 'cohort';
}
interface ComparativeDataset {
    id: string;
    label: string;
    data: Record<string, any>[];
    baseline?: boolean;
}
interface ComparativeAnalysisResult {
    comparisons: ComparisonResult[];
    summary: ComparisonSummary;
    insights: AnalyticsInsight[];
}
interface ComparisonResult {
    dimension: string;
    metric: string;
    values: Record<string, number>;
    differences: Record<string, number>;
    percentageChanges: Record<string, number>;
}
interface ComparisonSummary {
    totalComparisons: number;
    significantChanges: number;
    averageChange: number;
    maxIncrease: {
        dimension: string;
        metric: string;
        value: number;
    };
    maxDecrease: {
        dimension: string;
        metric: string;
        value: number;
    };
}
interface AnalyticsInsight {
    type: 'trend' | 'anomaly' | 'correlation' | 'pattern';
    severity: 'info' | 'warning' | 'critical';
    title: string;
    description: string;
    confidence: number;
    affectedMetrics: string[];
}
interface ExportConfig {
    format: 'pdf' | 'excel' | 'csv' | 'json' | 'xml';
    fileName?: string;
    options?: ExportOptions;
}
interface ExportOptions {
    orientation?: 'portrait' | 'landscape';
    pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
    margins?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    includeHeader?: boolean;
    includeFooter?: boolean;
    compression?: boolean;
    password?: string;
}
interface ReportSchedule {
    id: string;
    reportId: string;
    name: string;
    schedule: ScheduleConfig;
    recipients: RecipientConfig[];
    format: 'pdf' | 'excel' | 'csv';
    enabled: boolean;
    lastRun?: Date;
    nextRun?: Date;
}
interface ScheduleConfig {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    startDate: Date;
    endDate?: Date;
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    monthOfYear?: number;
    timezone?: string;
}
interface RecipientConfig {
    email: string;
    name?: string;
    type: 'to' | 'cc' | 'bcc';
}
interface AggregationResult {
    field: string;
    operation: string;
    value: number;
    count: number;
    formattedValue?: string;
}
/**
 * 1. Creates a dynamic report configuration with custom columns and filters.
 *
 * @swagger
 * components:
 *   schemas:
 *     ReportConfig:
 *       type: object
 *       required:
 *         - name
 *         - title
 *         - dataSource
 *         - columns
 *       properties:
 *         name:
 *           type: string
 *           description: Unique report identifier
 *         title:
 *           type: string
 *           description: Display title for the report
 *         description:
 *           type: string
 *           description: Report description
 *         dataSource:
 *           type: string
 *           description: Data source identifier
 *         columns:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReportColumn'
 *         filters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReportFilter'
 *
 * @param {Partial<ReportConfig>} config - Report configuration options
 * @returns {ReportConfig} Complete report configuration
 *
 * @example
 * ```typescript
 * const report = createReportConfig({
 *   name: 'sales-monthly',
 *   title: 'Monthly Sales Report',
 *   dataSource: 'sales_transactions',
 *   columns: [
 *     { field: 'date', label: 'Date', type: 'date' },
 *     { field: 'amount', label: 'Amount', type: 'currency' }
 *   ]
 * });
 * ```
 */
export declare const createReportConfig: (config: Partial<ReportConfig>) => ReportConfig;
/**
 * 2. Executes a report configuration and generates report data.
 *
 * @param {ReportConfig} config - Report configuration
 * @param {Record<string, any>[]} data - Source data
 * @returns {Record<string, any>} Generated report with data and metadata
 *
 * @example
 * ```typescript
 * const reportData = executeReport(reportConfig, sourceData);
 * // Returns: { data: [...], totals: {...}, metadata: {...} }
 * ```
 */
export declare const executeReport: (config: ReportConfig, data: Record<string, any>[]) => Record<string, any>;
/**
 * 3. Applies filters to report data based on filter configuration.
 *
 * @param {Record<string, any>[]} data - Data to filter
 * @param {ReportFilter[]} filters - Filter configurations
 * @returns {Record<string, any>[]} Filtered data
 *
 * @example
 * ```typescript
 * const filtered = applyReportFilters(data, [
 *   { field: 'status', operator: 'eq', value: 'active' }
 * ]);
 * ```
 */
export declare const applyReportFilters: (data: Record<string, any>[], filters: ReportFilter[]) => Record<string, any>[];
/**
 * 4. Applies sorting to report data.
 *
 * @param {Record<string, any>[]} data - Data to sort
 * @param {SortConfig[]} sorting - Sort configurations
 * @returns {Record<string, any>[]} Sorted data
 *
 * @example
 * ```typescript
 * const sorted = applyReportSorting(data, [
 *   { field: 'date', direction: 'desc' }
 * ]);
 * ```
 */
export declare const applyReportSorting: (data: Record<string, any>[], sorting: SortConfig[]) => Record<string, any>[];
/**
 * 5. Groups report data by specified fields.
 *
 * @param {Record<string, any>[]} data - Data to group
 * @param {string[]} groupBy - Fields to group by
 * @returns {Record<string, any>[]} Grouped data
 *
 * @example
 * ```typescript
 * const grouped = applyReportGrouping(data, ['category', 'status']);
 * ```
 */
export declare const applyReportGrouping: (data: Record<string, any>[], groupBy: string[]) => Record<string, any>[];
/**
 * 6. Creates a report column configuration.
 *
 * @param {Partial<ReportColumn>} column - Column options
 * @returns {ReportColumn} Complete column configuration
 *
 * @example
 * ```typescript
 * const column = createReportColumn({
 *   field: 'revenue',
 *   label: 'Total Revenue',
 *   type: 'currency',
 *   format: '$0,0.00'
 * });
 * ```
 */
export declare const createReportColumn: (column: Partial<ReportColumn>) => ReportColumn;
/**
 * 7. Creates a report filter configuration.
 *
 * @param {Partial<ReportFilter>} filter - Filter options
 * @returns {ReportFilter} Complete filter configuration
 *
 * @example
 * ```typescript
 * const filter = createReportFilter({
 *   field: 'date',
 *   operator: 'gte',
 *   value: '2024-01-01'
 * });
 * ```
 */
export declare const createReportFilter: (filter: Partial<ReportFilter>) => ReportFilter;
/**
 * 8. Builds a custom report template with predefined structure.
 *
 * @param {string} templateType - Template type identifier
 * @param {Record<string, any>} params - Template parameters
 * @returns {ReportConfig} Report configuration from template
 *
 * @example
 * ```typescript
 * const report = buildReportTemplate('financial-summary', {
 *   period: 'monthly',
 *   year: 2024
 * });
 * ```
 */
export declare const buildReportTemplate: (templateType: string, params: Record<string, any>) => ReportConfig;
/**
 * 9. Validates report configuration for completeness and correctness.
 *
 * @param {ReportConfig} config - Report configuration to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReportConfig(reportConfig);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateReportConfig: (config: ReportConfig) => {
    valid: boolean;
    errors: string[];
};
/**
 * 10. Clones a report configuration with optional modifications.
 *
 * @param {ReportConfig} config - Original report configuration
 * @param {Partial<ReportConfig>} modifications - Modifications to apply
 * @returns {ReportConfig} Cloned and modified configuration
 *
 * @example
 * ```typescript
 * const newReport = cloneReportConfig(existingReport, {
 *   name: 'modified-report',
 *   filters: [...additionalFilters]
 * });
 * ```
 */
export declare const cloneReportConfig: (config: ReportConfig, modifications?: Partial<ReportConfig>) => ReportConfig;
/**
 * 11. Calculates aggregations on dataset.
 *
 * @swagger
 * components:
 *   schemas:
 *     AggregationResult:
 *       type: object
 *       properties:
 *         field:
 *           type: string
 *         operation:
 *           type: string
 *           enum: [sum, avg, min, max, count, distinct]
 *         value:
 *           type: number
 *         count:
 *           type: number
 *
 * @param {Record<string, any>[]} data - Data to aggregate
 * @param {AggregationConfig[]} aggregations - Aggregation configurations
 * @returns {AggregationResult[]} Aggregation results
 *
 * @example
 * ```typescript
 * const results = calculateAggregations(data, [
 *   { field: 'revenue', operation: 'sum', label: 'Total Revenue' },
 *   { field: 'revenue', operation: 'avg', label: 'Average Revenue' }
 * ]);
 * ```
 */
export declare const calculateAggregations: (data: Record<string, any>[], aggregations: AggregationConfig[]) => AggregationResult[];
/**
 * 12. Summarizes data by grouping and aggregating.
 *
 * @param {Record<string, any>[]} data - Data to summarize
 * @param {string[]} groupBy - Fields to group by
 * @param {AggregationConfig[]} aggregations - Aggregations to perform
 * @returns {Record<string, any>[]} Summarized data
 *
 * @example
 * ```typescript
 * const summary = summarizeData(sales, ['region'], [
 *   { field: 'amount', operation: 'sum' }
 * ]);
 * ```
 */
export declare const summarizeData: (data: Record<string, any>[], groupBy: string[], aggregations: AggregationConfig[]) => Record<string, any>[];
/**
 * 13. Performs pivot table transformation on data.
 *
 * @param {Record<string, any>[]} data - Source data
 * @param {string} rowField - Row dimension field
 * @param {string} columnField - Column dimension field
 * @param {string} valueField - Value field to aggregate
 * @param {string} aggregation - Aggregation operation
 * @returns {Record<string, any>[]} Pivoted data
 *
 * @example
 * ```typescript
 * const pivoted = pivotData(sales, 'region', 'month', 'revenue', 'sum');
 * ```
 */
export declare const pivotData: (data: Record<string, any>[], rowField: string, columnField: string, valueField: string, aggregation: "sum" | "avg" | "count" | "min" | "max") => Record<string, any>[];
/**
 * 14. Calculates running totals for a dataset.
 *
 * @param {Record<string, any>[]} data - Data array
 * @param {string} valueField - Field to calculate running total
 * @param {string} outputField - Output field name for running total
 * @returns {Record<string, any>[]} Data with running totals
 *
 * @example
 * ```typescript
 * const withRunningTotal = calculateRunningTotal(data, 'sales', 'cumulative_sales');
 * ```
 */
export declare const calculateRunningTotal: (data: Record<string, any>[], valueField: string, outputField: string) => Record<string, any>[];
/**
 * 15. Calculates percentage of total for each row.
 *
 * @param {Record<string, any>[]} data - Data array
 * @param {string} valueField - Field to calculate percentage
 * @param {string} outputField - Output field name
 * @returns {Record<string, any>[]} Data with percentages
 *
 * @example
 * ```typescript
 * const withPercentages = calculatePercentageOfTotal(data, 'revenue', 'revenue_percentage');
 * ```
 */
export declare const calculatePercentageOfTotal: (data: Record<string, any>[], valueField: string, outputField: string) => Record<string, any>[];
/**
 * 16. Creates a KPI definition.
 *
 * @swagger
 * components:
 *   schemas:
 *     KPIDefinition:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - metric
 *         - calculation
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         metric:
 *           type: string
 *         targetValue:
 *           type: number
 *         calculation:
 *           $ref: '#/components/schemas/KPICalculation'
 *
 * @param {Partial<KPIDefinition>} kpi - KPI definition options
 * @returns {KPIDefinition} Complete KPI definition
 *
 * @example
 * ```typescript
 * const kpi = createKPIDefinition({
 *   id: 'revenue-growth',
 *   name: 'Revenue Growth Rate',
 *   metric: 'revenue',
 *   targetValue: 15,
 *   calculation: { type: 'percentage', numerator: 'current', denominator: 'previous' }
 * });
 * ```
 */
export declare const createKPIDefinition: (kpi: Partial<KPIDefinition>) => KPIDefinition;
/**
 * 17. Calculates KPI value from data.
 *
 * @param {KPIDefinition} kpi - KPI definition
 * @param {Record<string, any>} data - Data for calculation
 * @returns {KPIResult} KPI calculation result
 *
 * @example
 * ```typescript
 * const result = calculateKPI(kpiDefinition, {
 *   current: 120000,
 *   previous: 100000
 * });
 * ```
 */
export declare const calculateKPI: (kpi: KPIDefinition, data: Record<string, any>) => KPIResult;
/**
 * 18. Formats KPI value for display.
 *
 * @param {number} value - Value to format
 * @param {string} [format] - Format string
 * @param {string} [unit] - Unit suffix
 * @returns {string} Formatted value
 *
 * @example
 * ```typescript
 * const formatted = formatKPIValue(1234.56, '0,0.00', '$');
 * // Returns: "$1,234.56"
 * ```
 */
export declare const formatKPIValue: (value: number, format?: string, unit?: string) => string;
/**
 * 19. Tracks KPI trend over time.
 *
 * @param {KPIResult[]} historicalKPIs - Historical KPI values
 * @returns {{ trend: string; sparkline: number[] }} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = trackKPITrend(pastKPIResults);
 * // Returns: { trend: 'up', sparkline: [100, 105, 110, 115, 120] }
 * ```
 */
export declare const trackKPITrend: (historicalKPIs: KPIResult[]) => {
    trend: "up" | "down" | "stable";
    sparkline: number[];
};
/**
 * 20. Compares KPI against target and thresholds.
 *
 * @param {KPIResult} kpi - KPI result
 * @param {KPIDefinition} definition - KPI definition
 * @returns {{ status: string; message: string; recommendation: string }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareKPIToTarget(kpiResult, kpiDefinition);
 * ```
 */
export declare const compareKPIToTarget: (kpi: KPIResult, definition: KPIDefinition) => {
    status: string;
    message: string;
    recommendation: string;
};
/**
 * 21. Creates a dashboard configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     DashboardConfig:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - widgets
 *         - layout
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         widgets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DashboardWidget'
 *
 * @param {Partial<DashboardConfig>} config - Dashboard configuration
 * @returns {DashboardConfig} Complete dashboard configuration
 *
 * @example
 * ```typescript
 * const dashboard = createDashboardConfig({
 *   id: 'sales-dashboard',
 *   name: 'Sales Dashboard',
 *   widgets: [...]
 * });
 * ```
 */
export declare const createDashboardConfig: (config: Partial<DashboardConfig>) => DashboardConfig;
/**
 * 22. Prepares data for dashboard widgets.
 *
 * @param {DashboardWidget[]} widgets - Dashboard widgets
 * @param {Record<string, any>} dataContext - Available data sources
 * @returns {Record<string, any>} Widget data map
 *
 * @example
 * ```typescript
 * const widgetData = prepareDashboardData(widgets, {
 *   sales: salesData,
 *   kpis: kpiData
 * });
 * ```
 */
export declare const prepareDashboardData: (widgets: DashboardWidget[], dataContext: Record<string, any>) => Record<string, any>;
/**
 * 23. Prepares data for KPI widget.
 *
 * @param {any} data - Source data
 * @param {any} config - Widget configuration
 * @returns {any} Prepared KPI data
 *
 * @example
 * ```typescript
 * const kpiData = prepareKPIWidgetData(sourceData, { metric: 'revenue' });
 * ```
 */
export declare const prepareKPIWidgetData: (data: any, config: any) => any;
/**
 * 24. Prepares data for chart widget.
 *
 * @param {any} data - Source data
 * @param {any} config - Widget configuration
 * @returns {any} Prepared chart data
 *
 * @example
 * ```typescript
 * const chartData = prepareChartWidgetData(sourceData, {
 *   chartType: 'line',
 *   xField: 'date',
 *   yField: 'value'
 * });
 * ```
 */
export declare const prepareChartWidgetData: (data: any, config: any) => any;
/**
 * 25. Prepares data for table widget.
 *
 * @param {any} data - Source data
 * @param {any} config - Widget configuration
 * @returns {any} Prepared table data
 *
 * @example
 * ```typescript
 * const tableData = prepareTableWidgetData(sourceData, {
 *   columns: ['name', 'value', 'status']
 * });
 * ```
 */
export declare const prepareTableWidgetData: (data: any, config: any) => any;
/**
 * 26. Analyzes trends in time-series data.
 *
 * @swagger
 * components:
 *   schemas:
 *     TrendAnalysisResult:
 *       type: object
 *       properties:
 *         trend:
 *           type: string
 *           enum: [upward, downward, stable, volatile]
 *         trendLine:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DataPoint'
 *         forecast:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DataPoint'
 *
 * @param {TrendAnalysisConfig} config - Trend analysis configuration
 * @returns {TrendAnalysisResult} Trend analysis results
 *
 * @example
 * ```typescript
 * const trend = analyzeTrend({
 *   dataPoints: historicalData,
 *   period: 'monthly',
 *   algorithm: 'linear',
 *   forecastPeriods: 3
 * });
 * ```
 */
export declare const analyzeTrend: (config: TrendAnalysisConfig) => TrendAnalysisResult;
/**
 * 27. Calculates trend line using specified algorithm.
 *
 * @param {DataPoint[]} dataPoints - Data points
 * @param {string} algorithm - Algorithm type
 * @returns {DataPoint[]} Trend line data points
 *
 * @example
 * ```typescript
 * const trendLine = calculateTrendLine(data, 'linear');
 * ```
 */
export declare const calculateTrendLine: (dataPoints: DataPoint[], algorithm: "linear" | "exponential" | "polynomial" | "moving-average") => DataPoint[];
/**
 * 28. Calculates moving average for smoothing.
 *
 * @param {DataPoint[]} dataPoints - Data points
 * @param {number} window - Window size
 * @returns {DataPoint[]} Smoothed data points
 *
 * @example
 * ```typescript
 * const smoothed = calculateMovingAverage(data, 7); // 7-day moving average
 * ```
 */
export declare const calculateMovingAverage: (dataPoints: DataPoint[], window: number) => DataPoint[];
/**
 * 29. Generates forecast based on trend line.
 *
 * @param {DataPoint[]} trendLine - Trend line data
 * @param {number} periods - Number of periods to forecast
 * @returns {DataPoint[]} Forecasted data points
 *
 * @example
 * ```typescript
 * const forecast = generateForecast(trendLine, 6); // 6 periods ahead
 * ```
 */
export declare const generateForecast: (trendLine: DataPoint[], periods: number) => DataPoint[];
/**
 * 30. Calculates volatility of data points.
 *
 * @param {DataPoint[]} dataPoints - Data points
 * @returns {number} Volatility measure (0-1)
 *
 * @example
 * ```typescript
 * const vol = calculateVolatility(data);
 * ```
 */
export declare const calculateVolatility: (dataPoints: DataPoint[]) => number;
/**
 * 31. Performs comparative analysis across datasets.
 *
 * @swagger
 * components:
 *   schemas:
 *     ComparativeAnalysisResult:
 *       type: object
 *       properties:
 *         comparisons:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ComparisonResult'
 *         summary:
 *           $ref: '#/components/schemas/ComparisonSummary'
 *
 * @param {ComparativeAnalysisConfig} config - Comparison configuration
 * @returns {ComparativeAnalysisResult} Comparison results
 *
 * @example
 * ```typescript
 * const analysis = performComparativeAnalysis({
 *   datasets: [q1Data, q2Data],
 *   dimensions: ['region', 'product'],
 *   metrics: ['revenue', 'units'],
 *   comparisonType: 'period-over-period'
 * });
 * ```
 */
export declare const performComparativeAnalysis: (config: ComparativeAnalysisConfig) => ComparativeAnalysisResult;
/**
 * 34. Compares two time periods.
 *
 * @param {Record<string, any>[]} currentPeriod - Current period data
 * @param {Record<string, any>[]} previousPeriod - Previous period data
 * @param {string[]} metrics - Metrics to compare
 * @returns {Record<string, any>} Period comparison
 *
 * @example
 * ```typescript
 * const comparison = comparePeriods(thisMonth, lastMonth, ['revenue', 'units']);
 * ```
 */
export declare const comparePeriods: (currentPeriod: Record<string, any>[], previousPeriod: Record<string, any>[], metrics: string[]) => Record<string, any>;
/**
 * 35. Generates analytics insights from comparisons.
 *
 * @param {ComparisonResult[]} comparisons - Comparison results
 * @returns {AnalyticsInsight[]} Generated insights
 *
 * @example
 * ```typescript
 * const insights = generateAnalyticsInsights(comparisonResults);
 * ```
 */
export declare const generateAnalyticsInsights: (comparisons: ComparisonResult[]) => AnalyticsInsight[];
/**
 * 36. Exports report data to specified format.
 *
 * @swagger
 * /api/reports/export:
 *   post:
 *     summary: Export report to various formats
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *               format:
 *                 type: string
 *                 enum: [pdf, excel, csv, json, xml]
 *     responses:
 *       200:
 *         description: Export successful
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *
 * @param {Record<string, any>} data - Report data
 * @param {ExportConfig} config - Export configuration
 * @returns {Promise<Buffer>} Exported file buffer
 *
 * @example
 * ```typescript
 * const buffer = await exportReport(reportData, {
 *   format: 'excel',
 *   fileName: 'monthly-report.xlsx'
 * });
 * ```
 */
export declare const exportReport: (data: Record<string, any>, config: ExportConfig) => Promise<Buffer>;
/**
 * 37. Exports data to PDF format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - PDF options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await exportToPDF(reportData, {
 *   orientation: 'landscape',
 *   pageSize: 'A4'
 * });
 * ```
 */
export declare const exportToPDF: (data: Record<string, any>, options?: ExportOptions) => Promise<Buffer>;
/**
 * 38. Exports data to Excel format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - Excel options
 * @returns {Promise<Buffer>} Excel buffer
 *
 * @example
 * ```typescript
 * const excel = await exportToExcel(reportData, { compression: true });
 * ```
 */
export declare const exportToExcel: (data: Record<string, any>, options?: ExportOptions) => Promise<Buffer>;
/**
 * 39. Exports data to CSV format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - CSV options
 * @returns {Promise<Buffer>} CSV buffer
 *
 * @example
 * ```typescript
 * const csv = await exportToCSV(reportData);
 * ```
 */
export declare const exportToCSV: (data: Record<string, any>, options?: ExportOptions) => Promise<Buffer>;
/**
 * 40. Exports data to XML format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - XML options
 * @returns {Promise<Buffer>} XML buffer
 *
 * @example
 * ```typescript
 * const xml = await exportToXML(reportData);
 * ```
 */
export declare const exportToXML: (data: Record<string, any>, options?: ExportOptions) => Promise<Buffer>;
/**
 * 41. Creates a report schedule configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     ReportSchedule:
 *       type: object
 *       required:
 *         - id
 *         - reportId
 *         - schedule
 *         - recipients
 *       properties:
 *         id:
 *           type: string
 *         reportId:
 *           type: string
 *         schedule:
 *           $ref: '#/components/schemas/ScheduleConfig'
 *         recipients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecipientConfig'
 *
 * @param {Partial<ReportSchedule>} schedule - Schedule configuration
 * @returns {ReportSchedule} Complete schedule configuration
 *
 * @example
 * ```typescript
 * const schedule = createReportSchedule({
 *   reportId: 'monthly-sales',
 *   schedule: { frequency: 'monthly', dayOfMonth: 1 },
 *   recipients: [{ email: 'user@example.com', type: 'to' }]
 * });
 * ```
 */
export declare const createReportSchedule: (schedule: Partial<ReportSchedule>) => ReportSchedule;
/**
 * 42. Calculates next run time for scheduled report.
 *
 * @param {ScheduleConfig} schedule - Schedule configuration
 * @returns {Date} Next run date
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRun(scheduleConfig);
 * ```
 */
export declare const calculateNextRun: (schedule: ScheduleConfig) => Date;
/**
 * 43. Validates report schedule configuration.
 *
 * @param {ReportSchedule} schedule - Schedule to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReportSchedule(schedule);
 * ```
 */
export declare const validateReportSchedule: (schedule: ReportSchedule) => {
    valid: boolean;
    errors: string[];
};
/**
 * 44. Distributes report to recipients.
 *
 * @param {ReportSchedule} schedule - Report schedule
 * @param {Buffer} reportFile - Report file buffer
 * @returns {Promise<{ sent: number; failed: number }>} Distribution result
 *
 * @example
 * ```typescript
 * const result = await distributeReport(schedule, reportBuffer);
 * ```
 */
export declare const distributeReport: (schedule: ReportSchedule, reportFile: Buffer) => Promise<{
    sent: number;
    failed: number;
}>;
/**
 * 45. Updates schedule with last run information.
 *
 * @param {ReportSchedule} schedule - Schedule to update
 * @returns {ReportSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = updateScheduleRunInfo(schedule);
 * ```
 */
export declare const updateScheduleRunInfo: (schedule: ReportSchedule) => ReportSchedule;
export type { ReportConfig, ReportColumn, ReportFilter, SortConfig, AggregationConfig, KPIDefinition, KPIResult, DashboardConfig, DashboardWidget, TrendAnalysisConfig, TrendAnalysisResult, ComparativeAnalysisConfig, ComparativeAnalysisResult, ExportConfig, ReportSchedule, ScheduleConfig, RecipientConfig, AggregationResult, AnalyticsInsight, };
//# sourceMappingURL=reporting-analytics-kit.d.ts.map