/**
 * LOC: DOCANAREP001
 * File: /reuse/document/composites/document-analytics-reporting-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-analytics-kit
 *   - ../document-advanced-reporting-kit
 *   - ../document-audit-trail-advanced-kit
 *   - ../document-intelligence-kit
 *   - ../document-workflow-kit
 *
 * DOWNSTREAM (imported by):
 *   - Analytics controllers
 *   - Reporting services
 *   - Dashboard modules
 *   - Intelligence engines
 *   - Healthcare analytics platforms
 */
/**
 * File: /reuse/document/composites/document-analytics-reporting-composite.ts
 * Locator: WC-DOCANALYTICSREPORTING-COMPOSITE-001
 * Purpose: Comprehensive Analytics & Reporting Toolkit - Production-ready usage analytics, completion tracking, insights, dashboards
 *
 * Upstream: Composed from document-analytics-kit, document-advanced-reporting-kit, document-audit-trail-advanced-kit, document-intelligence-kit, document-workflow-kit
 * Downstream: ../backend/*, Analytics controllers, Reporting services, Dashboard modules, Intelligence engines
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 46 utility functions for analytics, reporting, completion tracking, insights, dashboards, intelligence
 *
 * LLM Context: Enterprise-grade analytics and reporting toolkit for White Cross healthcare platform.
 * Provides comprehensive document analytics including usage tracking, user behavior analysis, document lifecycle
 * metrics, completion rates, engagement scoring, advanced reporting with customizable dashboards, real-time
 * analytics, trend analysis, predictive insights, audit trail reporting, compliance metrics, and HIPAA-compliant
 * healthcare analytics. Composes functions from multiple analytics and intelligence kits to provide unified
 * reporting operations for monitoring document usage, tracking workflows, analyzing user patterns, and generating
 * actionable insights for healthcare document management optimization.
 */
import { Model } from 'sequelize-typescript';
/**
 * Analytics event type enumeration
 */
export declare enum AnalyticsEventType {
    VIEW = "VIEW",
    DOWNLOAD = "DOWNLOAD",
    PRINT = "PRINT",
    SHARE = "SHARE",
    SIGN = "SIGN",
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    COMMENT = "COMMENT",
    ANNOTATE = "ANNOTATE",
    SEARCH = "SEARCH"
}
/**
 * Report format enumeration
 */
export declare enum ReportFormat {
    PDF = "PDF",
    EXCEL = "EXCEL",
    CSV = "CSV",
    JSON = "JSON",
    HTML = "HTML"
}
/**
 * Dashboard widget type
 */
export declare enum WidgetType {
    LINE_CHART = "LINE_CHART",
    BAR_CHART = "BAR_CHART",
    PIE_CHART = "PIE_CHART",
    TABLE = "TABLE",
    METRIC = "METRIC",
    HEATMAP = "HEATMAP",
    FUNNEL = "FUNNEL",
    GAUGE = "GAUGE"
}
/**
 * Time aggregation period
 */
export declare enum TimePeriod {
    HOUR = "HOUR",
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    QUARTER = "QUARTER",
    YEAR = "YEAR"
}
/**
 * Metric aggregation type
 */
export declare enum AggregationType {
    SUM = "SUM",
    AVG = "AVG",
    MIN = "MIN",
    MAX = "MAX",
    COUNT = "COUNT",
    DISTINCT = "DISTINCT"
}
/**
 * Analytics event record
 */
export interface AnalyticsEvent {
    id: string;
    eventType: AnalyticsEventType;
    documentId: string;
    userId: string;
    timestamp: Date;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    duration?: number;
    metadata?: Record<string, any>;
}
/**
 * Document usage statistics
 */
export interface DocumentUsageStats {
    documentId: string;
    totalViews: number;
    uniqueViewers: number;
    totalDownloads: number;
    totalShares: number;
    totalSignatures: number;
    averageViewDuration: number;
    completionRate: number;
    engagementScore: number;
    lastAccessedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * User behavior analytics
 */
export interface UserBehaviorAnalytics {
    userId: string;
    totalDocuments: number;
    documentsViewed: number;
    documentsDownloaded: number;
    documentsShared: number;
    documentsSigned: number;
    averageSessionDuration: number;
    mostActiveTime: string;
    preferredDocumentTypes: string[];
    engagementLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    metadata?: Record<string, any>;
}
/**
 * Report configuration
 */
export interface ReportConfig {
    id: string;
    name: string;
    description: string;
    format: ReportFormat;
    schedule?: {
        frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
        time: string;
        recipients: string[];
    };
    filters: Record<string, any>;
    metrics: string[];
    groupBy?: string[];
    sortBy?: string;
    limit?: number;
    metadata?: Record<string, any>;
}
/**
 * Dashboard configuration
 */
export interface DashboardConfig {
    id: string;
    name: string;
    description: string;
    widgets: DashboardWidget[];
    layout: {
        columns: number;
        rows: number;
    };
    refreshInterval?: number;
    filters?: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Dashboard widget configuration
 */
export interface DashboardWidget {
    id: string;
    type: WidgetType;
    title: string;
    dataSource: string;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    config: {
        metric?: string;
        aggregation?: AggregationType;
        groupBy?: string;
        timePeriod?: TimePeriod;
        filters?: Record<string, any>;
    };
    metadata?: Record<string, any>;
}
/**
 * Trend analysis result
 */
export interface TrendAnalysis {
    metric: string;
    period: TimePeriod;
    dataPoints: Array<{
        timestamp: Date;
        value: number;
    }>;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
    changePercentage: number;
    forecast?: Array<{
        timestamp: Date;
        value: number;
        confidence: number;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Completion tracking data
 */
export interface CompletionTracking {
    documentId: string;
    totalSteps: number;
    completedSteps: number;
    completionPercentage: number;
    estimatedTimeRemaining?: number;
    blockedSteps?: string[];
    completedBy?: string[];
    metadata?: Record<string, any>;
}
/**
 * Insight recommendation
 */
export interface InsightRecommendation {
    id: string;
    type: 'OPTIMIZATION' | 'RISK' | 'OPPORTUNITY' | 'ANOMALY';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    title: string;
    description: string;
    affectedEntities: string[];
    recommendations: string[];
    estimatedImpact: {
        metric: string;
        improvement: number;
    };
    confidence: number;
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Analytics Event Model
 * Stores all document interaction events
 */
export declare class AnalyticsEventModel extends Model {
    id: string;
    eventType: AnalyticsEventType;
    documentId: string;
    userId: string;
    timestamp: Date;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    duration?: number;
    metadata?: Record<string, any>;
}
/**
 * Document Usage Statistics Model
 * Aggregated document usage metrics
 */
export declare class DocumentUsageStatsModel extends Model {
    id: string;
    documentId: string;
    totalViews: number;
    uniqueViewers: number;
    totalDownloads: number;
    totalShares: number;
    totalSignatures: number;
    averageViewDuration: number;
    completionRate: number;
    engagementScore: number;
    lastAccessedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Report Configuration Model
 * Stores report templates and schedules
 */
export declare class ReportConfigModel extends Model {
    id: string;
    name: string;
    description: string;
    format: ReportFormat;
    schedule?: {
        frequency: string;
        time: string;
        recipients: string[];
    };
    filters: Record<string, any>;
    metrics: string[];
    groupBy?: string[];
    sortBy?: string;
    limit?: number;
    metadata?: Record<string, any>;
}
/**
 * Dashboard Configuration Model
 * Stores dashboard layouts and widgets
 */
export declare class DashboardConfigModel extends Model {
    id: string;
    name: string;
    description: string;
    widgets: DashboardWidget[];
    layout: {
        columns: number;
        rows: number;
    };
    refreshInterval?: number;
    filters?: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Insight Recommendation Model
 * Stores AI-generated insights and recommendations
 */
export declare class InsightRecommendationModel extends Model {
    id: string;
    type: 'OPTIMIZATION' | 'RISK' | 'OPPORTUNITY' | 'ANOMALY';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    title: string;
    description: string;
    affectedEntities: string[];
    recommendations: string[];
    estimatedImpact: {
        metric: string;
        improvement: number;
    };
    confidence: number;
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Tracks analytics event.
 * Records document interaction event.
 *
 * @param {AnalyticsEvent} event - Analytics event
 * @returns {Promise<string>} Event ID
 *
 * @example
 * ```typescript
 * const eventId = await trackAnalyticsEvent({
 *   eventType: AnalyticsEventType.VIEW,
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   timestamp: new Date(),
 *   sessionId: 'session-789',
 *   duration: 120
 * });
 * ```
 */
export declare const trackAnalyticsEvent: (event: Omit<AnalyticsEvent, "id">) => Promise<string>;
/**
 * Updates document usage statistics.
 * Recalculates aggregated metrics.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateDocumentUsageStats('doc-123');
 * ```
 */
export declare const updateDocumentUsageStats: (documentId: string) => Promise<void>;
/**
 * Calculates document engagement score.
 * Computes composite engagement metric.
 *
 * @param {Record<string, number>} metrics - Usage metrics
 * @returns {number} Engagement score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateEngagementScore({ totalViews: 100, totalDownloads: 20, totalShares: 5 });
 * ```
 */
export declare const calculateEngagementScore: (metrics: Record<string, number>) => number;
/**
 * Gets document usage statistics.
 * Returns aggregated usage metrics.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<DocumentUsageStats>}
 *
 * @example
 * ```typescript
 * const stats = await getDocumentUsageStats('doc-123');
 * ```
 */
export declare const getDocumentUsageStats: (documentId: string) => Promise<DocumentUsageStats>;
/**
 * Analyzes user behavior patterns.
 * Returns user activity analytics.
 *
 * @param {string} userId - User identifier
 * @returns {Promise<UserBehaviorAnalytics>}
 *
 * @example
 * ```typescript
 * const behavior = await analyzeUserBehavior('user-123');
 * ```
 */
export declare const analyzeUserBehavior: (userId: string) => Promise<UserBehaviorAnalytics>;
/**
 * Generates trend analysis.
 * Analyzes metric trends over time.
 *
 * @param {string} metric - Metric name
 * @param {TimePeriod} period - Time period
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<TrendAnalysis>}
 *
 * @example
 * ```typescript
 * const trend = await generateTrendAnalysis('views', TimePeriod.DAY, startDate, endDate);
 * ```
 */
export declare const generateTrendAnalysis: (metric: string, period: TimePeriod, startDate: Date, endDate: Date) => Promise<TrendAnalysis>;
/**
 * Creates report configuration.
 * Defines custom report template.
 *
 * @param {Omit<ReportConfig, 'id'>} config - Report configuration
 * @returns {Promise<string>} Report config ID
 *
 * @example
 * ```typescript
 * const reportId = await createReportConfig({
 *   name: 'Monthly Usage Report',
 *   description: 'Monthly document usage statistics',
 *   format: ReportFormat.PDF,
 *   filters: { dateRange: 'last_month' },
 *   metrics: ['views', 'downloads', 'shares']
 * });
 * ```
 */
export declare const createReportConfig: (config: Omit<ReportConfig, "id">) => Promise<string>;
/**
 * Generates report from configuration.
 * Executes report and returns data.
 *
 * @param {string} reportConfigId - Report configuration ID
 * @param {Record<string, any>} parameters - Report parameters
 * @returns {Promise<Buffer>} Report data
 *
 * @example
 * ```typescript
 * const report = await generateReport('report-123', { month: '2024-01' });
 * ```
 */
export declare const generateReport: (reportConfigId: string, parameters: Record<string, any>) => Promise<Buffer>;
/**
 * Schedules automated report.
 * Sets up recurring report generation.
 *
 * @param {string} reportConfigId - Report configuration ID
 * @param {Record<string, any>} schedule - Schedule configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await scheduleReport('report-123', {
 *   frequency: 'MONTHLY',
 *   time: '09:00',
 *   recipients: ['admin@example.com']
 * });
 * ```
 */
export declare const scheduleReport: (reportConfigId: string, schedule: Record<string, any>) => Promise<void>;
/**
 * Creates dashboard configuration.
 * Defines custom dashboard layout.
 *
 * @param {Omit<DashboardConfig, 'id'>} config - Dashboard configuration
 * @returns {Promise<string>} Dashboard ID
 *
 * @example
 * ```typescript
 * const dashboardId = await createDashboard({
 *   name: 'Executive Dashboard',
 *   description: 'High-level metrics',
 *   widgets: [...],
 *   layout: { columns: 3, rows: 2 },
 *   refreshInterval: 300
 * });
 * ```
 */
export declare const createDashboard: (config: Omit<DashboardConfig, "id">) => Promise<string>;
/**
 * Adds widget to dashboard.
 * Inserts new widget into dashboard.
 *
 * @param {string} dashboardId - Dashboard ID
 * @param {DashboardWidget} widget - Widget configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addDashboardWidget('dashboard-123', {
 *   id: 'widget-1',
 *   type: WidgetType.LINE_CHART,
 *   title: 'Daily Views',
 *   dataSource: 'analytics_events',
 *   position: { x: 0, y: 0, width: 2, height: 1 },
 *   config: { metric: 'views', timePeriod: TimePeriod.DAY }
 * });
 * ```
 */
export declare const addDashboardWidget: (dashboardId: string, widget: DashboardWidget) => Promise<void>;
/**
 * Gets dashboard data.
 * Fetches current dashboard widget data.
 *
 * @param {string} dashboardId - Dashboard ID
 * @returns {Promise<Record<string, any>>} Dashboard data
 *
 * @example
 * ```typescript
 * const data = await getDashboardData('dashboard-123');
 * ```
 */
export declare const getDashboardData: (dashboardId: string) => Promise<Record<string, any>>;
/**
 * Tracks document completion progress.
 * Monitors workflow completion status.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<CompletionTracking>}
 *
 * @example
 * ```typescript
 * const completion = await trackDocumentCompletion('doc-123');
 * ```
 */
export declare const trackDocumentCompletion: (documentId: string) => Promise<CompletionTracking>;
/**
 * Calculates completion rate.
 * Computes document completion percentage.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<number>} Completion rate (0-100)
 *
 * @example
 * ```typescript
 * const rate = await calculateCompletionRate('doc-123');
 * ```
 */
export declare const calculateCompletionRate: (documentId: string) => Promise<number>;
/**
 * Generates AI insights.
 * Creates intelligent recommendations from data.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<InsightRecommendation[]>}
 *
 * @example
 * ```typescript
 * const insights = await generateInsights(startDate, endDate);
 * ```
 */
export declare const generateInsights: (startDate: Date, endDate: Date) => Promise<InsightRecommendation[]>;
/**
 * Stores insight recommendation.
 * Saves generated insight to database.
 *
 * @param {Omit<InsightRecommendation, 'id' | 'createdAt'>} insight - Insight data
 * @returns {Promise<string>} Insight ID
 *
 * @example
 * ```typescript
 * const insightId = await storeInsight({
 *   type: 'OPTIMIZATION',
 *   priority: 'HIGH',
 *   title: 'Optimize workflow',
 *   description: 'Workflow can be optimized',
 *   affectedEntities: ['wf-123'],
 *   recommendations: ['Enable parallel approvals'],
 *   estimatedImpact: { metric: 'duration', improvement: 30 },
 *   confidence: 90
 * });
 * ```
 */
export declare const storeInsight: (insight: Omit<InsightRecommendation, "id" | "createdAt">) => Promise<string>;
/**
 * Gets active insights.
 * Returns current recommendations.
 *
 * @param {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} minPriority - Minimum priority
 * @returns {Promise<InsightRecommendation[]>}
 *
 * @example
 * ```typescript
 * const insights = await getActiveInsights('HIGH');
 * ```
 */
export declare const getActiveInsights: (minPriority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL") => Promise<InsightRecommendation[]>;
/**
 * Exports analytics data.
 * Generates data export in specified format.
 *
 * @param {ReportFormat} format - Export format
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const csv = await exportAnalyticsData(ReportFormat.CSV, startDate, endDate);
 * ```
 */
export declare const exportAnalyticsData: (format: ReportFormat, startDate: Date, endDate: Date) => Promise<Buffer>;
/**
 * Aggregates metrics by period.
 * Groups metrics by time period.
 *
 * @param {string} metric - Metric name
 * @param {TimePeriod} period - Time period
 * @param {AggregationType} aggregation - Aggregation type
 * @returns {Promise<Array<{ period: string; value: number }>>}
 *
 * @example
 * ```typescript
 * const daily = await aggregateMetricsByPeriod('views', TimePeriod.DAY, AggregationType.SUM);
 * ```
 */
export declare const aggregateMetricsByPeriod: (metric: string, period: TimePeriod, aggregation: AggregationType) => Promise<Array<{
    period: string;
    value: number;
}>>;
/**
 * Compares time periods.
 * Analyzes metric changes between periods.
 *
 * @param {string} metric - Metric name
 * @param {Date} period1Start - First period start
 * @param {Date} period1End - First period end
 * @param {Date} period2Start - Second period start
 * @param {Date} period2End - Second period end
 * @returns {Promise<{ period1: number; period2: number; change: number; changePercentage: number }>}
 *
 * @example
 * ```typescript
 * const comparison = await compareTimePeriods('views', lastMonthStart, lastMonthEnd, thisMonthStart, thisMonthEnd);
 * ```
 */
export declare const compareTimePeriods: (metric: string, period1Start: Date, period1End: Date, period2Start: Date, period2End: Date) => Promise<{
    period1: number;
    period2: number;
    change: number;
    changePercentage: number;
}>;
/**
 * Gets top documents by metric.
 * Returns highest performing documents.
 *
 * @param {string} metric - Metric name
 * @param {number} limit - Result limit
 * @returns {Promise<Array<{ documentId: string; value: number }>>}
 *
 * @example
 * ```typescript
 * const top10 = await getTopDocuments('views', 10);
 * ```
 */
export declare const getTopDocuments: (metric: string, limit?: number) => Promise<Array<{
    documentId: string;
    value: number;
}>>;
/**
 * Gets top users by activity.
 * Returns most active users.
 *
 * @param {number} limit - Result limit
 * @returns {Promise<Array<{ userId: string; activityCount: number }>>}
 *
 * @example
 * ```typescript
 * const topUsers = await getTopUsers(20);
 * ```
 */
export declare const getTopUsers: (limit?: number) => Promise<Array<{
    userId: string;
    activityCount: number;
}>>;
/**
 * Calculates retention metrics.
 * Analyzes user retention over time.
 *
 * @param {Date} startDate - Start date
 * @returns {Promise<{ day1: number; day7: number; day30: number }>}
 *
 * @example
 * ```typescript
 * const retention = await calculateRetentionMetrics(startDate);
 * ```
 */
export declare const calculateRetentionMetrics: (startDate: Date) => Promise<{
    day1: number;
    day7: number;
    day30: number;
}>;
/**
 * Generates heatmap data.
 * Creates usage heatmap for visualization.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<Array<{ hour: number; day: number; value: number }>>}
 *
 * @example
 * ```typescript
 * const heatmap = await generateHeatmapData('doc-123');
 * ```
 */
export declare const generateHeatmapData: (documentId: string) => Promise<Array<{
    hour: number;
    day: number;
    value: number;
}>>;
/**
 * Predicts future metrics.
 * Forecasts metric values using trends.
 *
 * @param {string} metric - Metric name
 * @param {number} daysAhead - Days to forecast
 * @returns {Promise<Array<{ date: Date; predicted: number; confidence: number }>>}
 *
 * @example
 * ```typescript
 * const forecast = await predictMetrics('views', 30);
 * ```
 */
export declare const predictMetrics: (metric: string, daysAhead: number) => Promise<Array<{
    date: Date;
    predicted: number;
    confidence: number;
}>>;
/**
 * Detects usage anomalies.
 * Identifies unusual activity patterns.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array<{ timestamp: Date; metric: string; value: number; expected: number; deviation: number }>>}
 *
 * @example
 * ```typescript
 * const anomalies = await detectUsageAnomalies(startDate, endDate);
 * ```
 */
export declare const detectUsageAnomalies: (startDate: Date, endDate: Date) => Promise<Array<{
    timestamp: Date;
    metric: string;
    value: number;
    expected: number;
    deviation: number;
}>>;
/**
 * Generates executive summary.
 * Creates high-level analytics overview.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>>}
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveSummary(startDate, endDate);
 * ```
 */
export declare const generateExecutiveSummary: (startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * Calculates user engagement level.
 * Determines user activity tier.
 *
 * @param {string} userId - User identifier
 * @returns {Promise<'LOW' | 'MEDIUM' | 'HIGH'>}
 *
 * @example
 * ```typescript
 * const level = await calculateUserEngagementLevel('user-123');
 * ```
 */
export declare const calculateUserEngagementLevel: (userId: string) => Promise<"LOW" | "MEDIUM" | "HIGH">;
/**
 * Gets real-time metrics.
 * Fetches current metric values.
 *
 * @returns {Promise<Record<string, number>>}
 *
 * @example
 * ```typescript
 * const realtime = await getRealTimeMetrics();
 * ```
 */
export declare const getRealTimeMetrics: () => Promise<Record<string, number>>;
/**
 * Exports dashboard as PDF.
 * Generates PDF snapshot of dashboard.
 *
 * @param {string} dashboardId - Dashboard identifier
 * @returns {Promise<Buffer>} PDF data
 *
 * @example
 * ```typescript
 * const pdf = await exportDashboardPDF('dashboard-123');
 * ```
 */
export declare const exportDashboardPDF: (dashboardId: string) => Promise<Buffer>;
/**
 * Creates custom metric.
 * Defines calculated metric.
 *
 * @param {string} name - Metric name
 * @param {string} formula - Calculation formula
 * @returns {Promise<string>} Metric ID
 *
 * @example
 * ```typescript
 * const metricId = await createCustomMetric('conversion_rate', '(signatures / views) * 100');
 * ```
 */
export declare const createCustomMetric: (name: string, formula: string) => Promise<string>;
/**
 * Calculates custom metric value.
 * Evaluates custom metric formula.
 *
 * @param {string} metricId - Metric identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<number>}
 *
 * @example
 * ```typescript
 * const value = await calculateCustomMetric('metric-123', startDate, endDate);
 * ```
 */
export declare const calculateCustomMetric: (metricId: string, startDate: Date, endDate: Date) => Promise<number>;
/**
 * Sends analytics alert.
 * Triggers notification on threshold breach.
 *
 * @param {string} metric - Metric name
 * @param {number} threshold - Alert threshold
 * @param {string[]} recipients - Recipient user IDs
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendAnalyticsAlert('error_rate', 5, ['admin-1', 'admin-2']);
 * ```
 */
export declare const sendAnalyticsAlert: (metric: string, threshold: number, recipients: string[]) => Promise<void>;
/**
 * Archives old analytics data.
 * Moves historical data to archive storage.
 *
 * @param {Date} beforeDate - Archive data before this date
 * @returns {Promise<number>} Number of archived records
 *
 * @example
 * ```typescript
 * const archived = await archiveAnalyticsData(new Date('2023-01-01'));
 * ```
 */
export declare const archiveAnalyticsData: (beforeDate: Date) => Promise<number>;
/**
 * Optimizes analytics queries.
 * Improves query performance through indexing and caching.
 *
 * @returns {Promise<{ optimized: number; improvements: string[] }>}
 *
 * @example
 * ```typescript
 * const optimization = await optimizeAnalyticsQueries();
 * ```
 */
export declare const optimizeAnalyticsQueries: () => Promise<{
    optimized: number;
    improvements: string[];
}>;
/**
 * Analytics & Reporting Service
 * Production-ready NestJS service for analytics operations
 */
export declare class AnalyticsReportingService {
    /**
     * Tracks document view event
     */
    trackView(documentId: string, userId: string, duration?: number): Promise<void>;
    /**
     * Gets comprehensive document analytics
     */
    getDocumentAnalytics(documentId: string): Promise<DocumentUsageStats>;
    /**
     * Generates custom report
     */
    generateCustomReport(reportConfigId: string, parameters: Record<string, any>): Promise<Buffer>;
    /**
     * Fetches dashboard for user
     */
    getDashboard(dashboardId: string): Promise<Record<string, any>>;
}
declare const _default: {
    AnalyticsEventModel: typeof AnalyticsEventModel;
    DocumentUsageStatsModel: typeof DocumentUsageStatsModel;
    ReportConfigModel: typeof ReportConfigModel;
    DashboardConfigModel: typeof DashboardConfigModel;
    InsightRecommendationModel: typeof InsightRecommendationModel;
    trackAnalyticsEvent: (event: Omit<AnalyticsEvent, "id">) => Promise<string>;
    updateDocumentUsageStats: (documentId: string) => Promise<void>;
    calculateEngagementScore: (metrics: Record<string, number>) => number;
    getDocumentUsageStats: (documentId: string) => Promise<DocumentUsageStats>;
    analyzeUserBehavior: (userId: string) => Promise<UserBehaviorAnalytics>;
    generateTrendAnalysis: (metric: string, period: TimePeriod, startDate: Date, endDate: Date) => Promise<TrendAnalysis>;
    createReportConfig: (config: Omit<ReportConfig, "id">) => Promise<string>;
    generateReport: (reportConfigId: string, parameters: Record<string, any>) => Promise<Buffer>;
    scheduleReport: (reportConfigId: string, schedule: Record<string, any>) => Promise<void>;
    createDashboard: (config: Omit<DashboardConfig, "id">) => Promise<string>;
    addDashboardWidget: (dashboardId: string, widget: DashboardWidget) => Promise<void>;
    getDashboardData: (dashboardId: string) => Promise<Record<string, any>>;
    trackDocumentCompletion: (documentId: string) => Promise<CompletionTracking>;
    calculateCompletionRate: (documentId: string) => Promise<number>;
    generateInsights: (startDate: Date, endDate: Date) => Promise<InsightRecommendation[]>;
    storeInsight: (insight: Omit<InsightRecommendation, "id" | "createdAt">) => Promise<string>;
    getActiveInsights: (minPriority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL") => Promise<InsightRecommendation[]>;
    exportAnalyticsData: (format: ReportFormat, startDate: Date, endDate: Date) => Promise<Buffer>;
    aggregateMetricsByPeriod: (metric: string, period: TimePeriod, aggregation: AggregationType) => Promise<Array<{
        period: string;
        value: number;
    }>>;
    compareTimePeriods: (metric: string, period1Start: Date, period1End: Date, period2Start: Date, period2End: Date) => Promise<{
        period1: number;
        period2: number;
        change: number;
        changePercentage: number;
    }>;
    getTopDocuments: (metric: string, limit?: number) => Promise<Array<{
        documentId: string;
        value: number;
    }>>;
    getTopUsers: (limit?: number) => Promise<Array<{
        userId: string;
        activityCount: number;
    }>>;
    calculateRetentionMetrics: (startDate: Date) => Promise<{
        day1: number;
        day7: number;
        day30: number;
    }>;
    generateHeatmapData: (documentId: string) => Promise<Array<{
        hour: number;
        day: number;
        value: number;
    }>>;
    predictMetrics: (metric: string, daysAhead: number) => Promise<Array<{
        date: Date;
        predicted: number;
        confidence: number;
    }>>;
    detectUsageAnomalies: (startDate: Date, endDate: Date) => Promise<Array<{
        timestamp: Date;
        metric: string;
        value: number;
        expected: number;
        deviation: number;
    }>>;
    generateExecutiveSummary: (startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    calculateUserEngagementLevel: (userId: string) => Promise<"LOW" | "MEDIUM" | "HIGH">;
    getRealTimeMetrics: () => Promise<Record<string, number>>;
    exportDashboardPDF: (dashboardId: string) => Promise<Buffer>;
    createCustomMetric: (name: string, formula: string) => Promise<string>;
    calculateCustomMetric: (metricId: string, startDate: Date, endDate: Date) => Promise<number>;
    sendAnalyticsAlert: (metric: string, threshold: number, recipients: string[]) => Promise<void>;
    archiveAnalyticsData: (beforeDate: Date) => Promise<number>;
    optimizeAnalyticsQueries: () => Promise<{
        optimized: number;
        improvements: string[];
    }>;
    AnalyticsReportingService: typeof AnalyticsReportingService;
};
export default _default;
//# sourceMappingURL=document-analytics-reporting-composite.d.ts.map