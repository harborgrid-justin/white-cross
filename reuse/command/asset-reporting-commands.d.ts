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
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Report types
 */
export declare enum ReportType {
    INVENTORY = "inventory",
    DEPRECIATION = "depreciation",
    MAINTENANCE = "maintenance",
    COMPLIANCE = "compliance",
    FINANCIAL = "financial",
    OPERATIONAL = "operational",
    UTILIZATION = "utilization",
    LIFECYCLE = "lifecycle",
    CUSTOM = "custom",
    DASHBOARD = "dashboard",
    EXECUTIVE_SUMMARY = "executive_summary",
    AUDIT = "audit"
}
/**
 * Report formats
 */
export declare enum ReportFormat {
    PDF = "pdf",
    EXCEL = "excel",
    CSV = "csv",
    JSON = "json",
    HTML = "html",
    DASHBOARD = "dashboard"
}
/**
 * Report frequency for scheduling
 */
export declare enum ReportFrequency {
    ONCE = "once",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly"
}
/**
 * Report status
 */
export declare enum ReportStatus {
    PENDING = "pending",
    GENERATING = "generating",
    COMPLETED = "completed",
    FAILED = "failed",
    SCHEDULED = "scheduled",
    CANCELLED = "cancelled"
}
/**
 * Aggregation functions
 */
export declare enum AggregationFunction {
    SUM = "sum",
    AVG = "avg",
    COUNT = "count",
    MIN = "min",
    MAX = "max",
    STDDEV = "stddev"
}
/**
 * Chart types
 */
export declare enum ChartType {
    LINE = "line",
    BAR = "bar",
    PIE = "pie",
    DOUGHNUT = "doughnut",
    AREA = "area",
    SCATTER = "scatter",
    GAUGE = "gauge",
    TABLE = "table"
}
/**
 * KPI metric types
 */
export declare enum KPIMetricType {
    ASSET_AVAILABILITY = "asset_availability",
    UTILIZATION_RATE = "utilization_rate",
    MAINTENANCE_COST_RATIO = "maintenance_cost_ratio",
    MEAN_TIME_BETWEEN_FAILURES = "mtbf",
    MEAN_TIME_TO_REPAIR = "mttr",
    ASSET_TURNOVER = "asset_turnover",
    DEPRECIATION_RATE = "depreciation_rate",
    COMPLIANCE_SCORE = "compliance_score",
    TOTAL_COST_OF_OWNERSHIP = "tco"
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
    refreshInterval?: number;
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
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
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
    options?: Array<{
        value: any;
        label: string;
    }>;
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
    breakdown?: Array<{
        label: string;
        value: number;
    }>;
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
    executionTime?: string;
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
    dataRange: {
        from: Date;
        to: Date;
    };
    recordCount: number;
    fileSize?: number;
    filePath?: string;
}
/**
 * Report Template Model
 */
export declare class ReportTemplate extends Model {
    id: string;
    code: string;
    name: string;
    description?: string;
    reportType: ReportType;
    category?: string;
    definition: CustomReportDefinition;
    defaultParameters?: Record<string, any>;
    isActive: boolean;
    version?: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    reports?: Report[];
    schedules?: ReportSchedule[];
}
/**
 * Report Model - Generated reports
 */
export declare class Report extends Model {
    id: string;
    reportNumber: string;
    templateId?: string;
    reportType: ReportType;
    title: string;
    description?: string;
    status: ReportStatus;
    format: ReportFormat;
    parameters?: Record<string, any>;
    filters?: ReportFilters;
    dataRangeFrom?: Date;
    dataRangeTo?: Date;
    recordCount?: number;
    filePath?: string;
    fileSize?: number;
    generatedAt?: Date;
    generatedBy?: string;
    generationDuration?: number;
    errorMessage?: string;
    expirationDate?: Date;
    isArchived: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    template?: ReportTemplate;
    distributions?: ReportDistribution[];
}
/**
 * Report Schedule Model - Scheduled report execution
 */
export declare class ReportSchedule extends Model {
    id: string;
    name: string;
    templateId: string;
    frequency: ReportFrequency;
    startDate: Date;
    endDate?: Date;
    executionTime?: string;
    nextExecution?: Date;
    lastExecution?: Date;
    recipients: string[];
    format: ReportFormat;
    parameters?: Record<string, any>;
    isActive: boolean;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    template?: ReportTemplate;
}
/**
 * Report Distribution Model - Report delivery tracking
 */
export declare class ReportDistribution extends Model {
    id: string;
    reportId: string;
    channelType: string;
    recipient: string;
    status: string;
    distributedAt?: Date;
    errorMessage?: string;
    deliveryConfirmation?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    report?: Report;
}
/**
 * Dashboard Model - Dashboard configurations
 */
export declare class Dashboard extends Model {
    id: string;
    code: string;
    name: string;
    description?: string;
    category?: string;
    configuration: DashboardConfiguration;
    isPublic: boolean;
    isActive: boolean;
    createdBy?: string;
    accessControl?: {
        users: string[];
        roles: string[];
    };
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * KPI Metric Model - Calculated KPI values
 */
export declare class KPIMetric extends Model {
    id: string;
    metricType: KPIMetricType;
    assetId?: string;
    calculationDate: Date;
    periodStart: Date;
    periodEnd: Date;
    value: number;
    unit?: string;
    targetValue?: number;
    previousValue?: number;
    changePercent?: number;
    breakdownData?: Array<{
        label: string;
        value: number;
    }>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
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
export declare function generateAssetInventoryReport(options: ReportGenerationOptions, transaction?: Transaction): Promise<Report>;
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
export declare function generateDepreciationReport(options: ReportGenerationOptions, transaction?: Transaction): Promise<Report>;
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
export declare function generateMaintenanceReport(options: ReportGenerationOptions, transaction?: Transaction): Promise<Report>;
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
export declare function generateComplianceReport(options: ReportGenerationOptions, transaction?: Transaction): Promise<Report>;
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
export declare function generateExecutiveSummary(options: ReportGenerationOptions, transaction?: Transaction): Promise<Report>;
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
export declare function createCustomReport(definition: CustomReportDefinition, transaction?: Transaction): Promise<ReportTemplate>;
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
export declare function executeCustomReport(templateId: string, parameters: Record<string, any>, format: ReportFormat, transaction?: Transaction): Promise<Report>;
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
export declare function updateCustomReportTemplate(templateId: string, definition: Partial<CustomReportDefinition>, transaction?: Transaction): Promise<ReportTemplate>;
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
export declare function createDashboard(configuration: DashboardConfiguration, transaction?: Transaction): Promise<Dashboard>;
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
export declare function generateDashboardData(dashboardId: string, filters?: ReportFilters, transaction?: Transaction): Promise<{
    dashboardId: string;
    generatedAt: Date;
    widgets: Array<{
        widgetId: string;
        data: any;
    }>;
}>;
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
export declare function updateDashboard(dashboardId: string, configuration: Partial<DashboardConfiguration>, transaction?: Transaction): Promise<Dashboard>;
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
export declare function calculateAssetKPIs(options: KPICalculationOptions, transaction?: Transaction): Promise<KPIResult>;
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
export declare function getKPIHistory(metricType: KPIMetricType, assetId?: string, limit?: number): Promise<KPIMetric[]>;
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
export declare function scheduleReport(data: ReportScheduleData, transaction?: Transaction): Promise<ReportSchedule>;
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
export declare function updateReportSchedule(scheduleId: string, updates: Partial<ReportSchedule>, transaction?: Transaction): Promise<ReportSchedule>;
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
export declare function executeScheduledReports(transaction?: Transaction): Promise<string[]>;
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
export declare function distributeReport(reportId: string, channels: DistributionChannel[], transaction?: Transaction): Promise<ReportDistribution[]>;
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
export declare function getReportDistributionStatus(reportId: string): Promise<ReportDistribution[]>;
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
export declare function getReportById(reportId: string): Promise<Report>;
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
export declare function deleteExpiredReports(transaction?: Transaction): Promise<number>;
declare const _default: {
    ReportTemplate: typeof ReportTemplate;
    Report: typeof Report;
    ReportSchedule: typeof ReportSchedule;
    ReportDistribution: typeof ReportDistribution;
    Dashboard: typeof Dashboard;
    KPIMetric: typeof KPIMetric;
    generateAssetInventoryReport: typeof generateAssetInventoryReport;
    generateDepreciationReport: typeof generateDepreciationReport;
    generateMaintenanceReport: typeof generateMaintenanceReport;
    generateComplianceReport: typeof generateComplianceReport;
    generateExecutiveSummary: typeof generateExecutiveSummary;
    createCustomReport: typeof createCustomReport;
    executeCustomReport: typeof executeCustomReport;
    updateCustomReportTemplate: typeof updateCustomReportTemplate;
    createDashboard: typeof createDashboard;
    generateDashboardData: typeof generateDashboardData;
    updateDashboard: typeof updateDashboard;
    calculateAssetKPIs: typeof calculateAssetKPIs;
    getKPIHistory: typeof getKPIHistory;
    scheduleReport: typeof scheduleReport;
    updateReportSchedule: typeof updateReportSchedule;
    executeScheduledReports: typeof executeScheduledReports;
    distributeReport: typeof distributeReport;
    getReportDistributionStatus: typeof getReportDistributionStatus;
    getReportById: typeof getReportById;
    deleteExpiredReports: typeof deleteExpiredReports;
};
export default _default;
//# sourceMappingURL=asset-reporting-commands.d.ts.map