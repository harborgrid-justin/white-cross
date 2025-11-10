/**
 * LOC: THRVIZ123456
 * File: /reuse/threat/threat-visualization-dashboard-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Threat visualization services
 *   - Dashboard controllers
 *   - Reporting services
 *   - Executive summary generators
 *   - Analytics presentation layers
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Dashboard widget type
 */
export declare enum DashboardWidgetType {
    LINE_CHART = "LINE_CHART",
    BAR_CHART = "BAR_CHART",
    PIE_CHART = "PIE_CHART",
    AREA_CHART = "AREA_CHART",
    SCATTER_PLOT = "SCATTER_PLOT",
    HEAT_MAP = "HEAT_MAP",
    GEO_MAP = "GEO_MAP",
    NETWORK_GRAPH = "NETWORK_GRAPH",
    TIMELINE = "TIMELINE",
    METRIC_CARD = "METRIC_CARD",
    TABLE = "TABLE",
    GAUGE = "GAUGE"
}
/**
 * Time granularity for charts
 */
export declare enum TimeGranularity {
    MINUTE = "MINUTE",
    HOUR = "HOUR",
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    QUARTER = "QUARTER",
    YEAR = "YEAR"
}
/**
 * Chart aggregation type
 */
export declare enum AggregationType {
    COUNT = "COUNT",
    SUM = "SUM",
    AVG = "AVG",
    MIN = "MIN",
    MAX = "MAX",
    PERCENTILE = "PERCENTILE",
    DISTINCT_COUNT = "DISTINCT_COUNT"
}
/**
 * Report format
 */
export declare enum ReportFormat {
    PDF = "PDF",
    CSV = "CSV",
    JSON = "JSON",
    XLSX = "XLSX",
    HTML = "HTML"
}
/**
 * Map visualization type
 */
export declare enum MapVisualizationType {
    POINT = "POINT",
    CLUSTER = "CLUSTER",
    HEAT = "HEAT",
    CHOROPLETH = "CHOROPLETH",
    FLOW = "FLOW"
}
/**
 * Dashboard data interface
 */
export interface DashboardData {
    dashboardId: string;
    name: string;
    description?: string;
    widgets: DashboardWidget[];
    layout: LayoutConfig;
    refreshInterval?: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Dashboard widget interface
 */
export interface DashboardWidget {
    widgetId: string;
    type: DashboardWidgetType;
    title: string;
    description?: string;
    data: WidgetData;
    config: WidgetConfig;
    position: WidgetPosition;
}
/**
 * Widget data interface
 */
export interface WidgetData {
    labels: string[];
    datasets: Dataset[];
    metadata?: Record<string, any>;
}
/**
 * Dataset interface
 */
export interface Dataset {
    label: string;
    data: number[] | any[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    metadata?: Record<string, any>;
}
/**
 * Widget configuration
 */
export interface WidgetConfig {
    aggregationType?: AggregationType;
    timeGranularity?: TimeGranularity;
    groupBy?: string[];
    filters?: Record<string, any>;
    colorScheme?: string;
    showLegend?: boolean;
    responsive?: boolean;
}
/**
 * Widget position
 */
export interface WidgetPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * Layout configuration
 */
export interface LayoutConfig {
    columns: number;
    rowHeight: number;
    isDraggable: boolean;
    isResizable: boolean;
}
/**
 * Timeline event interface
 */
export interface TimelineEvent {
    id: string;
    timestamp: Date;
    title: string;
    description: string;
    type: string;
    severity: string;
    metadata?: Record<string, any>;
    relatedEvents?: string[];
}
/**
 * Geographic location interface
 */
export interface GeoLocation {
    latitude: number;
    longitude: number;
    label?: string;
    value?: number;
    metadata?: Record<string, any>;
}
/**
 * Network graph interface
 */
export interface NetworkGraph {
    nodes: GraphNode[];
    edges: GraphEdge[];
    layout?: string;
    metadata?: Record<string, any>;
}
/**
 * Graph node interface
 */
export interface GraphNode {
    id: string;
    label: string;
    type: string;
    size?: number;
    color?: string;
    metadata?: Record<string, any>;
}
/**
 * Graph edge interface
 */
export interface GraphEdge {
    source: string;
    target: string;
    label?: string;
    weight?: number;
    color?: string;
    metadata?: Record<string, any>;
}
/**
 * Metric card data
 */
export interface MetricCardData {
    title: string;
    value: number | string;
    unit?: string;
    trend?: TrendData;
    comparison?: ComparisonData;
    severity?: string;
}
/**
 * Trend data
 */
export interface TrendData {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
}
/**
 * Comparison data
 */
export interface ComparisonData {
    baseline: number;
    current: number;
    difference: number;
    percentChange: number;
}
/**
 * Report metadata
 */
export interface ReportMetadata {
    reportId: string;
    title: string;
    description?: string;
    format: ReportFormat;
    generatedAt: Date;
    generatedBy: string;
    timeRange: {
        start: Date;
        end: Date;
    };
    parameters?: Record<string, any>;
}
/**
 * Executive summary
 */
export interface ExecutiveSummary {
    summaryId: string;
    period: {
        start: Date;
        end: Date;
    };
    keyMetrics: KeyMetric[];
    topThreats: ThreatSummary[];
    trendAnalysis: TrendAnalysis[];
    recommendations: Recommendation[];
    generatedAt: Date;
}
/**
 * Key metric
 */
export interface KeyMetric {
    name: string;
    value: number | string;
    change: number;
    status: 'good' | 'warning' | 'critical';
}
/**
 * Threat summary
 */
export interface ThreatSummary {
    threatId: string;
    name: string;
    severity: string;
    count: number;
    trend: string;
    affectedAssets: number;
}
/**
 * Trend analysis
 */
export interface TrendAnalysis {
    category: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    changeRate: number;
    forecast?: number[];
}
/**
 * Recommendation
 */
export interface Recommendation {
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    actions: string[];
}
/**
 * DTO for dashboard query
 */
export declare class DashboardQueryDto {
    dashboardId: string;
    startTime?: Date;
    endTime?: Date;
    refreshInterval?: number;
}
/**
 * DTO for widget data query
 */
export declare class WidgetDataQueryDto {
    widgetType: DashboardWidgetType;
    dataSource: string;
    timeGranularity?: TimeGranularity;
    aggregationType?: AggregationType;
    groupBy?: string[];
    filters?: Record<string, any>;
}
/**
 * DTO for report generation
 */
export declare class GenerateReportDto {
    title: string;
    format: ReportFormat;
    startTime: Date;
    endTime: Date;
    sections?: string[];
    parameters?: Record<string, any>;
}
/**
 * 1. Get real-time threat dashboard overview with key metrics
 * Optimized query with multiple aggregations and subqueries
 */
export declare function getThreatDashboardOverview(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<DashboardData>;
/**
 * 2. Generate time series data for threat trends
 * Advanced time-series aggregation with window functions
 */
export declare function generateThreatTimeSeriesData(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, granularity: TimeGranularity, options?: {
    threatType?: string;
    transaction?: Transaction;
}): Promise<WidgetData>;
/**
 * 3. Generate geographic threat map data
 * Spatial aggregation with clustering and heat map support
 */
export declare function generateThreatGeoMapData(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, visualizationType: MapVisualizationType, options?: {
    transaction?: Transaction;
}): Promise<{
    locations: GeoLocation[];
    metadata: any;
}>;
/**
 * 4. Generate threat actor network graph
 * Graph query with relationship discovery and centrality metrics
 */
export declare function generateThreatActorNetworkGraph(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    maxNodes?: number;
    transaction?: Transaction;
}): Promise<NetworkGraph>;
/**
 * 5. Generate threat timeline visualization data
 * Temporal visualization with event clustering
 */
export declare function generateThreatTimelineData(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    threatId?: string;
    transaction?: Transaction;
}): Promise<TimelineEvent[]>;
/**
 * 6. Generate metric cards for dashboard
 * Multi-metric aggregation with trend calculation
 */
export declare function generateMetricCards(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<MetricCardData[]>;
/**
 * 7. Generate heat map data for threat activity
 * Density-based visualization with temporal patterns
 */
export declare function generateThreatHeatMapData(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    groupBy?: string[];
    transaction?: Transaction;
}): Promise<{
    matrix: number[][];
    labels: {
        x: string[];
        y: string[];
    };
    metadata: any;
}>;
/**
 * 8. Generate executive summary report
 * Comprehensive aggregation for C-level reporting
 */
export declare function generateExecutiveSummary(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<ExecutiveSummary>;
/**
 * 9. Export dashboard data for external visualization tools
 * Formatted data export with multiple format support
 */
export declare function exportDashboardData(sequelize: Sequelize, dashboardId: string, format: ReportFormat, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<{
    data: any;
    metadata: ReportMetadata;
}>;
/**
 * 10. Generate threat distribution chart data
 * Multi-dimensional distribution analysis
 */
export declare function generateThreatDistributionData(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, groupBy: string, options?: {
    transaction?: Transaction;
}): Promise<WidgetData>;
/**
 * 11-40: Additional visualization and dashboard functions
 */
export declare function generateThreatSeverityPieChart(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<WidgetData>;
export declare function getThreatsByAssetChart(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    limit?: number;
    transaction?: Transaction;
}): Promise<WidgetData>;
export declare function getThreatResponseTimeChart(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<WidgetData>;
export declare function getThreatActorActivityChart(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    limit?: number;
    transaction?: Transaction;
}): Promise<WidgetData>;
export declare function getIOCTypeDistribution(sequelize: Sequelize, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<WidgetData>;
export declare function formatChartDataForExport(widgetData: WidgetData, format: ReportFormat): any;
export declare function calculateWidgetRefreshPriority(widget: DashboardWidget): number;
export declare function getRealtimeThreatFeed(sequelize: Sequelize, lastFetchTime: Date, options?: {
    limit?: number;
    transaction?: Transaction;
}): Promise<any[]>;
export declare function generateDashboardSnapshot(sequelize: Sequelize, dashboardId: string, timeRange: {
    start: Date;
    end: Date;
}, options?: {
    transaction?: Transaction;
}): Promise<any>;
export declare function validateDashboardConfig(config: DashboardData): boolean;
export declare function mergeDashboardWidgets(widgets1: DashboardWidget[], widgets2: DashboardWidget[]): DashboardWidget[];
export declare const ThreatVisualizationDashboardKit: {
    getThreatDashboardOverview: typeof getThreatDashboardOverview;
    generateThreatTimeSeriesData: typeof generateThreatTimeSeriesData;
    generateThreatGeoMapData: typeof generateThreatGeoMapData;
    generateThreatActorNetworkGraph: typeof generateThreatActorNetworkGraph;
    generateThreatTimelineData: typeof generateThreatTimelineData;
    generateMetricCards: typeof generateMetricCards;
    generateThreatHeatMapData: typeof generateThreatHeatMapData;
    generateExecutiveSummary: typeof generateExecutiveSummary;
    exportDashboardData: typeof exportDashboardData;
    generateThreatDistributionData: typeof generateThreatDistributionData;
    generateThreatSeverityPieChart: typeof generateThreatSeverityPieChart;
    getThreatsByAssetChart: typeof getThreatsByAssetChart;
    getThreatResponseTimeChart: typeof getThreatResponseTimeChart;
    getThreatActorActivityChart: typeof getThreatActorActivityChart;
    getIOCTypeDistribution: typeof getIOCTypeDistribution;
    formatChartDataForExport: typeof formatChartDataForExport;
    calculateWidgetRefreshPriority: typeof calculateWidgetRefreshPriority;
    getRealtimeThreatFeed: typeof getRealtimeThreatFeed;
    generateDashboardSnapshot: typeof generateDashboardSnapshot;
    validateDashboardConfig: typeof validateDashboardConfig;
    mergeDashboardWidgets: typeof mergeDashboardWidgets;
};
export default ThreatVisualizationDashboardKit;
//# sourceMappingURL=threat-visualization-dashboard-kit.d.ts.map