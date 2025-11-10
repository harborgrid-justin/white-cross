/**
 * LOC: SECDASH1234567
 * File: /reuse/threat/security-dashboard-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Security dashboard services
 *   - Executive reporting modules
 *   - Real-time monitoring services
 *   - Metrics aggregation services
 *   - Threat visualization services
 */
/**
 * File: /reuse/threat/security-dashboard-kit.ts
 * Locator: WC-SECURITY-DASHBOARD-001
 * Purpose: Comprehensive Security Dashboard Toolkit - Production-ready dashboard and visualization operations
 *
 * Upstream: Independent utility module for security dashboard operations
 * Downstream: ../backend/*, Dashboard services, Metrics aggregation, Visualization, Executive reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript
 * Exports: 45 utility functions for dashboards, widgets, metrics, visualization, drill-down analytics
 *
 * LLM Context: Enterprise-grade security dashboard toolkit for White Cross healthcare platform.
 * Provides comprehensive executive security dashboards, real-time threat visualization, security
 * metrics aggregation, customizable widgets, drill-down analytics, dashboard management, and
 * HIPAA-compliant security monitoring for healthcare systems. Includes Sequelize models for
 * dashboards, widgets, layouts, and metrics with advanced TypeScript type safety.
 */
import { Model } from 'sequelize-typescript';
declare const __brand: unique symbol;
type Brand<T, TBrand> = T & {
    [__brand]: TBrand;
};
export type DashboardId = Brand<string, 'DashboardId'>;
export type WidgetId = Brand<string, 'WidgetId'>;
export type MetricId = Brand<string, 'MetricId'>;
export type LayoutId = Brand<string, 'LayoutId'>;
/**
 * Dashboard widget type discriminator
 */
export declare enum WidgetType {
    THREAT_TIMELINE = "THREAT_TIMELINE",
    THREAT_MAP = "THREAT_MAP",
    SEVERITY_DISTRIBUTION = "SEVERITY_DISTRIBUTION",
    TOP_THREATS = "TOP_THREATS",
    METRIC_GAUGE = "METRIC_GAUGE",
    TREND_CHART = "TREND_CHART",
    INCIDENT_LIST = "INCIDENT_LIST",
    COMPLIANCE_SCORE = "COMPLIANCE_SCORE",
    VULNERABILITY_HEATMAP = "VULNERABILITY_HEATMAP",
    ATTACK_VECTOR_BREAKDOWN = "ATTACK_VECTOR_BREAKDOWN",
    RISK_SCORE_CARD = "RISK_SCORE_CARD",
    ALERT_FEED = "ALERT_FEED"
}
/**
 * Dashboard refresh interval
 */
export declare enum RefreshInterval {
    REALTIME = 0,// WebSocket
    FIVE_SECONDS = 5000,
    FIFTEEN_SECONDS = 15000,
    THIRTY_SECONDS = 30000,
    ONE_MINUTE = 60000,
    FIVE_MINUTES = 300000,
    MANUAL = -1
}
/**
 * Metric aggregation type
 */
export declare enum MetricAggregation {
    SUM = "SUM",
    AVG = "AVG",
    MIN = "MIN",
    MAX = "MAX",
    COUNT = "COUNT",
    PERCENTILE_50 = "PERCENTILE_50",
    PERCENTILE_95 = "PERCENTILE_95",
    PERCENTILE_99 = "PERCENTILE_99",
    STDDEV = "STDDEV"
}
/**
 * Time range for dashboard data
 */
export interface TimeRange {
    start: Date;
    end: Date;
    preset?: 'last_hour' | 'last_24h' | 'last_7d' | 'last_30d' | 'last_90d' | 'custom';
}
/**
 * Base widget configuration
 */
interface BaseWidgetConfig {
    type: WidgetType;
    title: string;
    description?: string;
    refreshInterval: RefreshInterval;
    timeRange: TimeRange;
    filters?: Record<string, any>;
}
/**
 * Threat timeline widget configuration
 */
export interface ThreatTimelineConfig extends BaseWidgetConfig {
    type: WidgetType.THREAT_TIMELINE;
    groupBy: 'hour' | 'day' | 'week';
    showTrend: boolean;
    severityFilter?: string[];
}
/**
 * Threat map widget configuration
 */
export interface ThreatMapConfig extends BaseWidgetConfig {
    type: WidgetType.THREAT_MAP;
    mapType: 'world' | 'country' | 'region';
    heatmapEnabled: boolean;
    clusteringEnabled: boolean;
}
/**
 * Metric gauge widget configuration
 */
export interface MetricGaugeConfig extends BaseWidgetConfig {
    type: WidgetType.METRIC_GAUGE;
    metricKey: string;
    aggregation: MetricAggregation;
    thresholds: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    unit?: string;
}
/**
 * Discriminated union of all widget configurations
 */
export type WidgetConfig = ThreatTimelineConfig | ThreatMapConfig | MetricGaugeConfig | (BaseWidgetConfig & {
    type: Exclude<WidgetType, WidgetType.THREAT_TIMELINE | WidgetType.THREAT_MAP | WidgetType.METRIC_GAUGE>;
});
/**
 * Dashboard layout configuration
 */
export interface DashboardLayout {
    id: LayoutId;
    name: string;
    description?: string;
    grid: {
        columns: number;
        rowHeight: number;
        gap: number;
    };
    widgets: Array<{
        widgetId: WidgetId;
        position: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        config: WidgetConfig;
    }>;
}
/**
 * Security metric definition
 */
export interface SecurityMetric {
    id: MetricId;
    key: string;
    name: string;
    description: string;
    category: 'threat' | 'vulnerability' | 'compliance' | 'incident' | 'risk' | 'performance';
    unit?: string;
    aggregation: MetricAggregation;
    threshold?: {
        critical?: number;
        high?: number;
        medium?: number;
        low?: number;
    };
    tags: string[];
}
/**
 * Dashboard access control
 */
export interface DashboardPermissions {
    ownerId: string;
    visibility: 'private' | 'team' | 'organization' | 'public';
    allowedRoles: string[];
    allowedUsers: string[];
    permissions: {
        canView: boolean;
        canEdit: boolean;
        canShare: boolean;
        canDelete: boolean;
    };
}
/**
 * Drill-down context
 */
export interface DrillDownContext {
    sourceWidget: WidgetId;
    sourceDashboard: DashboardId;
    filters: Record<string, any>;
    timeRange: TimeRange;
    breadcrumbs: Array<{
        label: string;
        filters: Record<string, any>;
    }>;
}
/**
 * Dashboard export format
 */
export type DashboardExportFormat = 'json' | 'pdf' | 'png' | 'csv';
/**
 * Real-time update event
 */
export interface DashboardUpdateEvent {
    dashboardId: DashboardId;
    widgetId?: WidgetId;
    eventType: 'metric_update' | 'threat_detected' | 'alert_triggered' | 'config_changed';
    timestamp: Date;
    data: any;
}
export declare class SecurityDashboard extends Model {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    visibility: string;
    layoutId: string;
    permissionsConfig: DashboardPermissions;
    settings: {
        defaultTimeRange: TimeRange;
        autoRefresh: boolean;
        theme: 'light' | 'dark' | 'auto';
        enableDrillDown: boolean;
    };
    tags: string[];
    isFavorite: boolean;
    viewCount: number;
    lastViewedAt?: Date;
    widgets: DashboardWidget[];
    layouts: DashboardLayout[];
}
export declare class DashboardWidget extends Model {
    id: string;
    dashboardId: string;
    widgetType: WidgetType;
    title: string;
    config: WidgetConfig;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    refreshInterval: number;
    enabled: boolean;
    cachedData?: any;
    cacheExpiresAt?: Date;
    dashboard: SecurityDashboard;
}
export declare class DashboardLayoutModel extends Model {
    id: string;
    dashboardId: string;
    name: string;
    config: DashboardLayout;
    isDefault: boolean;
    dashboard: SecurityDashboard;
}
export declare class SecurityMetricModel extends Model {
    id: string;
    metricKey: string;
    category: string;
    value: number;
    unit?: string;
    metadata?: Record<string, any>;
    recordedAt: Date;
    tags: string[];
}
export declare class DashboardDrillDown extends Model {
    id: string;
    userId: string;
    context: DrillDownContext;
    expiresAt: Date;
}
export declare class CreateDashboardDto {
    name: string;
    description?: string;
    visibility: string;
    settings?: any;
    tags?: string[];
}
export declare class CreateWidgetDto {
    widgetType: WidgetType;
    title: string;
    config: WidgetConfig;
    refreshInterval: number;
}
export declare class UpdateDashboardDto {
    name?: string;
    description?: string;
    settings?: any;
    tags?: string[];
}
export declare class MetricQueryDto {
    metricKey: string;
    aggregation: MetricAggregation;
    timeRange: TimeRange;
    filters?: Record<string, any>;
}
/**
 * Creates an executive security dashboard with pre-configured widgets
 * @param ownerId - Dashboard owner user ID
 * @param config - Dashboard configuration
 * @returns Created dashboard with default executive widgets
 */
export declare function createExecutiveDashboard(ownerId: string, config?: Partial<CreateDashboardDto>): Promise<SecurityDashboard>;
/**
 * Gets executive summary metrics for dashboard
 * @param dashboardId - Dashboard ID
 * @param timeRange - Time range for metrics
 * @returns Executive summary with key metrics
 */
export declare function getExecutiveSummary(dashboardId: DashboardId, timeRange: TimeRange): Promise<{
    riskScore: number;
    threatCount: number;
    criticalIncidents: number;
    complianceScore: number;
    trends: Record<string, number>;
}>;
/**
 * Clones an executive dashboard for another user
 * @param sourceDashboardId - Source dashboard to clone
 * @param newOwnerId - New owner user ID
 * @param customizations - Optional customizations
 * @returns Cloned dashboard
 */
export declare function cloneExecutiveDashboard(sourceDashboardId: DashboardId, newOwnerId: string, customizations?: Partial<CreateDashboardDto>): Promise<SecurityDashboard>;
/**
 * Generates executive security briefing from dashboard data
 * @param dashboardId - Dashboard ID
 * @param timeRange - Time range for briefing
 * @returns Executive briefing document
 */
export declare function generateExecutiveBriefing(dashboardId: DashboardId, timeRange: TimeRange): Promise<{
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    metrics: Record<string, any>;
    timestamp: Date;
}>;
/**
 * Shares executive dashboard with specific users or roles
 * @param dashboardId - Dashboard ID
 * @param shareWith - Users or roles to share with
 * @param permissions - Sharing permissions
 */
export declare function shareExecutiveDashboard(dashboardId: DashboardId, shareWith: {
    users?: string[];
    roles?: string[];
}, permissions?: Partial<DashboardPermissions['permissions']>): Promise<void>;
/**
 * Exports executive dashboard to specified format
 * @param dashboardId - Dashboard ID
 * @param format - Export format
 * @param options - Export options
 * @returns Export data or file path
 */
export declare function exportExecutiveDashboard(dashboardId: DashboardId, format: DashboardExportFormat, options?: {
    includeData?: boolean;
    timeRange?: TimeRange;
}): Promise<{
    format: string;
    data: any;
    filename: string;
}>;
/**
 * Archives executive dashboard (soft delete)
 * @param dashboardId - Dashboard ID
 * @param archiveReason - Reason for archival
 */
export declare function archiveExecutiveDashboard(dashboardId: DashboardId, archiveReason?: string): Promise<void>;
/**
 * Subscribes to real-time dashboard updates
 * @param dashboardId - Dashboard ID
 * @param callback - Update callback function
 * @returns Unsubscribe function
 */
export declare function subscribeToRealtimeUpdates(dashboardId: DashboardId, callback: (event: DashboardUpdateEvent) => void): () => void;
/**
 * Renders threat map visualization with geolocation data
 * @param timeRange - Time range for threat data
 * @param filters - Optional filters
 * @returns Threat map data for visualization
 */
export declare function renderThreatMap(timeRange: TimeRange, filters?: Record<string, any>): Promise<{
    markers: Array<{
        lat: number;
        lng: number;
        severity: string;
        count: number;
    }>;
    heatmap: Array<{
        lat: number;
        lng: number;
        weight: number;
    }>;
    bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
}>;
/**
 * Generates threat timeline visualization data
 * @param timeRange - Time range for timeline
 * @param groupBy - Grouping interval
 * @returns Timeline data points
 */
export declare function generateThreatTimeline(timeRange: TimeRange, groupBy?: 'hour' | 'day' | 'week'): Promise<Array<{
    timestamp: Date;
    count: number;
    severity: Record<string, number>;
}>>;
/**
 * Creates severity distribution chart data
 * @param timeRange - Time range for data
 * @returns Severity distribution data
 */
export declare function getSeverityDistribution(timeRange: TimeRange): Promise<Record<string, {
    count: number;
    percentage: number;
}>>;
/**
 * Generates attack vector breakdown visualization
 * @param timeRange - Time range for data
 * @returns Attack vector distribution
 */
export declare function getAttackVectorBreakdown(timeRange: TimeRange): Promise<Array<{
    vector: string;
    count: number;
    percentage: number;
    trend: number;
}>>;
/**
 * Creates vulnerability heatmap data
 * @param timeRange - Time range for data
 * @returns Heatmap data matrix
 */
export declare function generateVulnerabilityHeatmap(timeRange: TimeRange): Promise<{
    data: number[][];
    xLabels: string[];
    yLabels: string[];
    colorScale: {
        min: number;
        max: number;
    };
}>;
/**
 * Generates real-time alert feed for dashboard
 * @param dashboardId - Dashboard ID
 * @param limit - Maximum number of alerts
 * @returns Recent alerts
 */
export declare function getRealtimeAlertFeed(dashboardId: DashboardId, limit?: number): Promise<Array<{
    id: string;
    severity: string;
    title: string;
    description: string;
    timestamp: Date;
    source: string;
    status: 'new' | 'acknowledged' | 'resolved';
}>>;
/**
 * Updates widget with real-time data
 * @param widgetId - Widget ID
 * @param data - Real-time data
 * @param cacheFor - Cache duration in milliseconds
 */
export declare function updateWidgetRealtimeData(widgetId: WidgetId, data: any, cacheFor?: number): Promise<void>;
/**
 * Aggregates security metrics by category
 * @param category - Metric category
 * @param timeRange - Time range for aggregation
 * @param aggregation - Aggregation type
 * @returns Aggregated metric value
 */
export declare function aggregateMetricsByCategory(category: string, timeRange: TimeRange, aggregation: MetricAggregation): Promise<number>;
/**
 * Calculates composite security score
 * @param timeRange - Time range for calculation
 * @param weights - Category weights
 * @returns Composite security score (0-100)
 */
export declare function calculateCompositeSecurityScore(timeRange: TimeRange, weights?: Record<string, number>): Promise<{
    score: number;
    breakdown: Record<string, number>;
    trend: number;
}>;
/**
 * Records a new security metric
 * @param metricData - Metric data to record
 * @returns Created metric
 */
export declare function recordSecurityMetric(metricData: {
    metricKey: string;
    category: string;
    value: number;
    unit?: string;
    metadata?: Record<string, any>;
    tags?: string[];
}): Promise<SecurityMetricModel>;
/**
 * Queries metrics with flexible filters
 * @param query - Query parameters
 * @returns Matching metrics
 */
export declare function querySecurityMetrics(query: {
    metricKeys?: string[];
    categories?: string[];
    timeRange: TimeRange;
    tags?: string[];
    aggregation?: MetricAggregation;
    groupBy?: 'hour' | 'day' | 'week' | 'month';
}): Promise<SecurityMetricModel[] | Array<{
    timestamp: Date;
    value: number;
}>>;
/**
 * Calculates metric percentiles
 * @param metricKey - Metric key
 * @param timeRange - Time range
 * @param percentiles - Percentile values to calculate
 * @returns Percentile values
 */
export declare function calculateMetricPercentiles(metricKey: string, timeRange: TimeRange, percentiles?: number[]): Promise<Record<number, number>>;
/**
 * Gets top N metrics by value
 * @param category - Metric category
 * @param timeRange - Time range
 * @param limit - Number of top metrics
 * @param orderBy - Order direction
 * @returns Top metrics
 */
export declare function getTopMetrics(category: string, timeRange: TimeRange, limit?: number, orderBy?: 'ASC' | 'DESC'): Promise<SecurityMetricModel[]>;
/**
 * Compares metrics across time periods
 * @param metricKey - Metric key
 * @param currentRange - Current time range
 * @param comparisonRange - Comparison time range
 * @returns Comparison results
 */
export declare function compareMetricsAcrossPeriods(metricKey: string, currentRange: TimeRange, comparisonRange: TimeRange): Promise<{
    current: {
        avg: number;
        min: number;
        max: number;
        count: number;
    };
    comparison: {
        avg: number;
        min: number;
        max: number;
        count: number;
    };
    change: {
        absolute: number;
        percentage: number;
    };
}>;
/**
 * Detects metric anomalies using statistical methods
 * @param metricKey - Metric key
 * @param timeRange - Time range to analyze
 * @param sensitivity - Anomaly detection sensitivity (1-10)
 * @returns Detected anomalies
 */
export declare function detectMetricAnomalies(metricKey: string, timeRange: TimeRange, sensitivity?: number): Promise<Array<{
    timestamp: Date;
    value: number;
    expectedValue: number;
    deviation: number;
    severity: 'low' | 'medium' | 'high';
}>>;
/**
 * Creates a custom dashboard widget
 * @param dashboardId - Dashboard ID
 * @param widgetConfig - Widget configuration
 * @returns Created widget
 */
export declare function createCustomWidget(dashboardId: DashboardId, widgetConfig: CreateWidgetDto): Promise<DashboardWidget>;
/**
 * Updates widget configuration
 * @param widgetId - Widget ID
 * @param updates - Configuration updates
 * @returns Updated widget
 */
export declare function updateWidgetConfig(widgetId: WidgetId, updates: Partial<{
    title: string;
    config: WidgetConfig;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    refreshInterval: number;
    enabled: boolean;
}>): Promise<DashboardWidget>;
/**
 * Duplicates a widget within the same dashboard
 * @param widgetId - Widget ID to duplicate
 * @param customizations - Optional customizations
 * @returns Duplicated widget
 */
export declare function duplicateWidget(widgetId: WidgetId, customizations?: Partial<CreateWidgetDto>): Promise<DashboardWidget>;
/**
 * Reorders widgets in dashboard layout
 * @param dashboardId - Dashboard ID
 * @param widgetOrder - Array of widget IDs in desired order
 */
export declare function reorderDashboardWidgets(dashboardId: DashboardId, widgetOrder: Array<{
    widgetId: WidgetId;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}>): Promise<void>;
/**
 * Gets available widget templates
 * @returns Widget template definitions
 */
export declare function getWidgetTemplates(): Array<{
    type: WidgetType;
    name: string;
    description: string;
    defaultConfig: Partial<WidgetConfig>;
    previewImage?: string;
}>;
/**
 * Validates widget configuration
 * @param widgetType - Widget type
 * @param config - Widget configuration
 * @returns Validation result
 */
export declare function validateWidgetConfig(widgetType: WidgetType, config: WidgetConfig): {
    valid: boolean;
    errors: string[];
};
/**
 * Applies widget theme customization
 * @param widgetId - Widget ID
 * @param theme - Theme configuration
 */
export declare function applyWidgetTheme(widgetId: WidgetId, theme: {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
    borders?: Record<string, string>;
}): Promise<void>;
/**
 * Exports widget configuration as template
 * @param widgetId - Widget ID
 * @returns Widget template
 */
export declare function exportWidgetAsTemplate(widgetId: WidgetId): Promise<{
    type: WidgetType;
    config: WidgetConfig;
    metadata: Record<string, any>;
}>;
/**
 * Creates drill-down context from widget interaction
 * @param widgetId - Source widget ID
 * @param filters - Applied filters
 * @param timeRange - Time range
 * @returns Drill-down context
 */
export declare function createDrillDownContext(userId: string, widgetId: WidgetId, filters: Record<string, any>, timeRange: TimeRange): Promise<DrillDownContext>;
/**
 * Gets detailed data for drill-down view
 * @param context - Drill-down context
 * @param page - Page number
 * @param pageSize - Items per page
 * @returns Detailed drill-down data
 */
export declare function getDrillDownDetails(context: DrillDownContext, page?: number, pageSize?: number): Promise<{
    data: any[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}>;
/**
 * Adds filter to drill-down context
 * @param context - Current context
 * @param filterKey - Filter key
 * @param filterValue - Filter value
 * @returns Updated context
 */
export declare function addDrillDownFilter(context: DrillDownContext, filterKey: string, filterValue: any): DrillDownContext;
/**
 * Navigates back in drill-down breadcrumb trail
 * @param context - Current context
 * @param levels - Number of levels to go back
 * @returns Updated context
 */
export declare function navigateDrillDownBack(context: DrillDownContext, levels?: number): DrillDownContext;
/**
 * Exports drill-down data to file
 * @param context - Drill-down context
 * @param format - Export format
 * @returns Export data
 */
export declare function exportDrillDownData(context: DrillDownContext, format: 'csv' | 'json' | 'xlsx'): Promise<{
    data: any;
    filename: string;
}>;
/**
 * Creates saved drill-down view
 * @param userId - User ID
 * @param context - Drill-down context
 * @param name - Saved view name
 * @returns Saved view ID
 */
export declare function saveDrillDownView(userId: string, context: DrillDownContext, name: string): Promise<string>;
/**
 * Loads saved drill-down view
 * @param viewId - Saved view ID
 * @returns Drill-down context
 */
export declare function loadDrillDownView(viewId: string): Promise<DrillDownContext>;
/**
 * Lists all dashboards for a user
 * @param userId - User ID
 * @param filters - Optional filters
 * @returns User's dashboards
 */
export declare function listUserDashboards(userId: string, filters?: {
    visibility?: string[];
    tags?: string[];
    favorites?: boolean;
    sortBy?: 'name' | 'created' | 'updated' | 'views';
    order?: 'ASC' | 'DESC';
}): Promise<SecurityDashboard[]>;
/**
 * Searches dashboards by query
 * @param userId - User ID
 * @param query - Search query
 * @returns Matching dashboards
 */
export declare function searchDashboards(userId: string, query: string): Promise<SecurityDashboard[]>;
/**
 * Sets dashboard as favorite
 * @param dashboardId - Dashboard ID
 * @param userId - User ID
 * @param favorite - Favorite status
 */
export declare function toggleDashboardFavorite(dashboardId: DashboardId, userId: string, favorite: boolean): Promise<void>;
/**
 * Increments dashboard view count
 * @param dashboardId - Dashboard ID
 */
export declare function recordDashboardView(dashboardId: DashboardId): Promise<void>;
/**
 * Gets dashboard usage analytics
 * @param dashboardId - Dashboard ID
 * @param timeRange - Time range for analytics
 * @returns Usage analytics
 */
export declare function getDashboardAnalytics(dashboardId: DashboardId, timeRange: TimeRange): Promise<{
    views: number;
    uniqueUsers: number;
    avgSessionDuration: number;
    widgetInteractions: Record<string, number>;
    popularWidgets: Array<{
        widgetId: string;
        title: string;
        interactions: number;
    }>;
}>;
/**
 * Deletes dashboard and all associated data
 * @param dashboardId - Dashboard ID
 * @param userId - User ID (for authorization)
 */
export declare function deleteDashboard(dashboardId: DashboardId, userId: string): Promise<void>;
declare const _default: {
    createExecutiveDashboard: typeof createExecutiveDashboard;
    getExecutiveSummary: typeof getExecutiveSummary;
    cloneExecutiveDashboard: typeof cloneExecutiveDashboard;
    generateExecutiveBriefing: typeof generateExecutiveBriefing;
    shareExecutiveDashboard: typeof shareExecutiveDashboard;
    exportExecutiveDashboard: typeof exportExecutiveDashboard;
    archiveExecutiveDashboard: typeof archiveExecutiveDashboard;
    subscribeToRealtimeUpdates: typeof subscribeToRealtimeUpdates;
    renderThreatMap: typeof renderThreatMap;
    generateThreatTimeline: typeof generateThreatTimeline;
    getSeverityDistribution: typeof getSeverityDistribution;
    getAttackVectorBreakdown: typeof getAttackVectorBreakdown;
    generateVulnerabilityHeatmap: typeof generateVulnerabilityHeatmap;
    getRealtimeAlertFeed: typeof getRealtimeAlertFeed;
    updateWidgetRealtimeData: typeof updateWidgetRealtimeData;
    aggregateMetricsByCategory: typeof aggregateMetricsByCategory;
    calculateCompositeSecurityScore: typeof calculateCompositeSecurityScore;
    recordSecurityMetric: typeof recordSecurityMetric;
    querySecurityMetrics: typeof querySecurityMetrics;
    calculateMetricPercentiles: typeof calculateMetricPercentiles;
    getTopMetrics: typeof getTopMetrics;
    compareMetricsAcrossPeriods: typeof compareMetricsAcrossPeriods;
    detectMetricAnomalies: typeof detectMetricAnomalies;
    createCustomWidget: typeof createCustomWidget;
    updateWidgetConfig: typeof updateWidgetConfig;
    duplicateWidget: typeof duplicateWidget;
    reorderDashboardWidgets: typeof reorderDashboardWidgets;
    getWidgetTemplates: typeof getWidgetTemplates;
    validateWidgetConfig: typeof validateWidgetConfig;
    applyWidgetTheme: typeof applyWidgetTheme;
    exportWidgetAsTemplate: typeof exportWidgetAsTemplate;
    createDrillDownContext: typeof createDrillDownContext;
    getDrillDownDetails: typeof getDrillDownDetails;
    addDrillDownFilter: typeof addDrillDownFilter;
    navigateDrillDownBack: typeof navigateDrillDownBack;
    exportDrillDownData: typeof exportDrillDownData;
    saveDrillDownView: typeof saveDrillDownView;
    loadDrillDownView: typeof loadDrillDownView;
    listUserDashboards: typeof listUserDashboards;
    searchDashboards: typeof searchDashboards;
    toggleDashboardFavorite: typeof toggleDashboardFavorite;
    recordDashboardView: typeof recordDashboardView;
    getDashboardAnalytics: typeof getDashboardAnalytics;
    deleteDashboard: typeof deleteDashboard;
};
export default _default;
//# sourceMappingURL=security-dashboard-kit.d.ts.map