/**
 * LOC: DOC-ANA-001
 * File: /reuse/document/document-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize (v6.x)
 *   - @nestjs/schedule
 *   - chartjs-node-canvas
 *
 * DOWNSTREAM (imported by):
 *   - Analytics services
 *   - Reporting controllers
 *   - Dashboard modules
 *   - Metrics collection services
 */
/**
 * File: /reuse/document/document-analytics-kit.ts
 * Locator: WC-UTL-DOCANA-001
 * Purpose: Document Analytics & Reporting Kit - Comprehensive analytics utilities for NestJS
 *
 * Upstream: @nestjs/common, @nestjs/config, sequelize, @nestjs/schedule, chartjs-node-canvas
 * Downstream: Analytics services, reporting controllers, dashboard modules, metrics services
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, @nestjs/schedule 4.x, Chart.js 4.x
 * Exports: 40 utility functions for usage tracking, view analytics, document statistics, reports, user activity, heat maps
 *
 * LLM Context: Production-grade document analytics and reporting utilities for White Cross healthcare platform.
 * Provides usage tracking, view analytics, document statistics, comprehensive reporting, user activity monitoring,
 * heat map generation, export analytics, dashboard data, trend analysis, and HIPAA-compliant analytics tracking.
 * Essential for monitoring document usage, generating compliance reports, tracking patient record access,
 * and analyzing healthcare documentation patterns for regulatory requirements and business intelligence.
 */
import { Sequelize } from 'sequelize';
/**
 * Document analytics configuration from environment
 */
export interface AnalyticsConfigEnv {
    ENABLE_ANALYTICS: string;
    ANALYTICS_RETENTION_DAYS: string;
    TRACK_PAGE_VIEWS: string;
    TRACK_DOWNLOADS: string;
    TRACK_PRINTS: string;
    TRACK_SHARES: string;
    ENABLE_HEAT_MAPS: string;
    HEAT_MAP_RESOLUTION: string;
    ANALYTICS_BATCH_SIZE: string;
    ANALYTICS_FLUSH_INTERVAL: string;
    ENABLE_REAL_TIME_ANALYTICS: string;
    ANONYMIZE_USER_DATA: string;
    EXPORT_ANALYTICS_ENABLED: string;
    MAX_REPORT_RANGE_DAYS: string;
}
/**
 * Loads analytics configuration from environment variables.
 *
 * @returns {AnalyticsConfig} Analytics configuration object
 *
 * @example
 * ```typescript
 * const config = loadAnalyticsConfig();
 * console.log('Analytics enabled:', config.enableAnalytics);
 * ```
 */
export declare const loadAnalyticsConfig: () => AnalyticsConfig;
/**
 * Validates analytics configuration.
 *
 * @param {AnalyticsConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = validateAnalyticsConfig(config);
 * if (errors.length > 0) {
 *   throw new Error(`Invalid config: ${errors.join(', ')}`);
 * }
 * ```
 */
export declare const validateAnalyticsConfig: (config: AnalyticsConfig) => string[];
/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
    enableAnalytics: boolean;
    retentionDays: number;
    trackPageViews: boolean;
    trackDownloads: boolean;
    trackPrints: boolean;
    trackShares: boolean;
    enableHeatMaps: boolean;
    heatMapResolution: number;
    batchSize: number;
    flushInterval: number;
    enableRealTime: boolean;
    anonymizeUserData: boolean;
    exportEnabled: boolean;
    maxReportRangeDays: number;
}
/**
 * Analytics event types
 */
export type AnalyticsEventType = 'view' | 'download' | 'print' | 'share' | 'edit' | 'delete' | 'export' | 'search' | 'bookmark' | 'annotate';
/**
 * Analytics event
 */
export interface AnalyticsEvent {
    id?: string;
    documentId: string;
    userId?: string;
    sessionId?: string;
    eventType: AnalyticsEventType;
    timestamp: Date;
    pageNumber?: number;
    duration?: number;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
}
/**
 * Document view statistics
 */
export interface DocumentViewStats {
    documentId: string;
    totalViews: number;
    uniqueViewers: number;
    averageDuration: number;
    lastViewedAt: Date;
    viewsByDay: Map<string, number>;
    viewsByPage: Map<number, number>;
    popularPages: number[];
}
/**
 * User activity summary
 */
export interface UserActivitySummary {
    userId: string;
    totalEvents: number;
    documentCount: number;
    viewCount: number;
    downloadCount: number;
    printCount: number;
    shareCount: number;
    lastActivityAt: Date;
    mostViewedDocuments: Array<{
        documentId: string;
        viewCount: number;
    }>;
    activityByType: Map<AnalyticsEventType, number>;
}
/**
 * Document statistics
 */
export interface DocumentStatistics {
    documentId: string;
    totalPages: number;
    fileSize: number;
    createdAt: Date;
    modifiedAt: Date;
    totalViews: number;
    uniqueViewers: number;
    totalDownloads: number;
    totalPrints: number;
    totalShares: number;
    averageViewDuration: number;
    engagementScore: number;
}
/**
 * Time period for analytics
 */
export type TimePeriod = 'hour' | 'day' | 'week' | 'month' | 'year' | 'custom';
/**
 * Analytics date range
 */
export interface AnalyticsDateRange {
    startDate: Date;
    endDate: Date;
    period?: TimePeriod;
}
/**
 * Trend data point
 */
export interface TrendDataPoint {
    timestamp: Date;
    value: number;
    label?: string;
}
/**
 * Heat map data
 */
export interface HeatMapData {
    documentId: string;
    pageNumber: number;
    resolution: number;
    width: number;
    height: number;
    data: number[][];
    maxValue: number;
    timestamp: Date;
}
/**
 * Heat map click event
 */
export interface HeatMapClick {
    x: number;
    y: number;
    pageNumber: number;
    timestamp: Date;
}
/**
 * Analytics report configuration
 */
export interface ReportConfig {
    title: string;
    dateRange: AnalyticsDateRange;
    includeCharts?: boolean;
    includeHeatMaps?: boolean;
    includeTrends?: boolean;
    groupBy?: 'day' | 'week' | 'month';
    metrics?: string[];
    filters?: ReportFilters;
}
/**
 * Report filters
 */
export interface ReportFilters {
    documentIds?: string[];
    userIds?: string[];
    eventTypes?: AnalyticsEventType[];
    pageNumbers?: number[];
    minDuration?: number;
    maxDuration?: number;
}
/**
 * Analytics report
 */
export interface AnalyticsReport {
    id: string;
    title: string;
    generatedAt: Date;
    dateRange: AnalyticsDateRange;
    summary: ReportSummary;
    trends: TrendDataPoint[];
    topDocuments: Array<{
        documentId: string;
        score: number;
    }>;
    topUsers: Array<{
        userId: string;
        activityCount: number;
    }>;
    charts?: ChartData[];
    heatMaps?: HeatMapData[];
}
/**
 * Report summary
 */
export interface ReportSummary {
    totalEvents: number;
    uniqueUsers: number;
    uniqueDocuments: number;
    averageDuration: number;
    totalViews: number;
    totalDownloads: number;
    totalPrints: number;
    totalShares: number;
    engagementRate: number;
}
/**
 * Chart data
 */
export interface ChartData {
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    title: string;
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string;
    }>;
}
/**
 * Dashboard metrics
 */
export interface DashboardMetrics {
    timestamp: Date;
    activeUsers: number;
    activeDocuments: number;
    eventsPerSecond: number;
    topEvents: Array<{
        type: AnalyticsEventType;
        count: number;
    }>;
    recentActivity: AnalyticsEvent[];
    systemHealth: {
        status: 'healthy' | 'degraded' | 'critical';
        queueSize: number;
        processingRate: number;
    };
}
/**
 * Export format for analytics
 */
export type AnalyticsExportFormat = 'json' | 'csv' | 'xlsx' | 'pdf';
/**
 * Analytics event model attributes
 */
export interface AnalyticsEventAttributes {
    id: string;
    documentId: string;
    userId?: string;
    sessionId?: string;
    eventType: string;
    timestamp: Date;
    pageNumber?: number;
    duration?: number;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    createdAt: Date;
}
/**
 * Creates AnalyticsEvent model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AnalyticsEventAttributes>>} AnalyticsEvent model
 *
 * @example
 * ```typescript
 * const EventModel = createAnalyticsEventModel(sequelize);
 * const event = await EventModel.create({
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   eventType: 'view',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const createAnalyticsEventModel: (sequelize: Sequelize) => any;
/**
 * Heat map data model attributes
 */
export interface HeatMapDataAttributes {
    id: string;
    documentId: string;
    pageNumber: number;
    resolution: number;
    width: number;
    height: number;
    data: number[][];
    maxValue: number;
    clickCount: number;
    generatedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates HeatMapData model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<HeatMapDataAttributes>>} HeatMapData model
 *
 * @example
 * ```typescript
 * const HeatMapModel = createHeatMapDataModel(sequelize);
 * const heatMap = await HeatMapModel.create({
 *   documentId: 'doc-123',
 *   pageNumber: 1,
 *   resolution: 10,
 *   width: 800,
 *   height: 1000,
 *   data: [[0, 1], [2, 3]]
 * });
 * ```
 */
export declare const createHeatMapDataModel: (sequelize: Sequelize) => any;
/**
 * 1. Tracks document view event.
 *
 * @param {string} documentId - Document ID
 * @param {string} [userId] - User ID
 * @param {Partial<AnalyticsEvent>} [options] - Additional event data
 * @returns {Promise<AnalyticsEvent>} Tracked event
 *
 * @example
 * ```typescript
 * const event = await trackDocumentView('doc-123', 'user-456', {
 *   pageNumber: 1,
 *   duration: 30
 * });
 * ```
 */
export declare const trackDocumentView: (documentId: string, userId?: string, options?: Partial<AnalyticsEvent>) => Promise<AnalyticsEvent>;
/**
 * 2. Tracks document download event.
 *
 * @param {string} documentId - Document ID
 * @param {string} [userId] - User ID
 * @param {Record<string, any>} [metadata] - Download metadata
 * @returns {Promise<AnalyticsEvent>} Tracked event
 *
 * @example
 * ```typescript
 * const event = await trackDocumentDownload('doc-123', 'user-456', {
 *   format: 'pdf',
 *   fileSize: 1024000
 * });
 * ```
 */
export declare const trackDocumentDownload: (documentId: string, userId?: string, metadata?: Record<string, any>) => Promise<AnalyticsEvent>;
/**
 * 3. Tracks document print event.
 *
 * @param {string} documentId - Document ID
 * @param {string} [userId] - User ID
 * @param {number[]} [pageRange] - Printed page range
 * @returns {Promise<AnalyticsEvent>} Tracked event
 *
 * @example
 * ```typescript
 * const event = await trackDocumentPrint('doc-123', 'user-456', [1, 10]);
 * ```
 */
export declare const trackDocumentPrint: (documentId: string, userId?: string, pageRange?: number[]) => Promise<AnalyticsEvent>;
/**
 * 4. Tracks document share event.
 *
 * @param {string} documentId - Document ID
 * @param {string} [userId] - User ID
 * @param {string} shareMethod - Share method (email, link, etc.)
 * @returns {Promise<AnalyticsEvent>} Tracked event
 *
 * @example
 * ```typescript
 * const event = await trackDocumentShare('doc-123', 'user-456', 'email');
 * ```
 */
export declare const trackDocumentShare: (documentId: string, userId?: string, shareMethod?: string) => Promise<AnalyticsEvent>;
/**
 * 5. Tracks page view within document.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {string} [userId] - User ID
 * @param {number} [duration] - View duration in seconds
 * @returns {Promise<AnalyticsEvent>} Tracked event
 *
 * @example
 * ```typescript
 * const event = await trackPageView('doc-123', 5, 'user-456', 15);
 * ```
 */
export declare const trackPageView: (documentId: string, pageNumber: number, userId?: string, duration?: number) => Promise<AnalyticsEvent>;
/**
 * 6. Batches multiple analytics events.
 *
 * @param {AnalyticsEvent[]} events - Events to batch
 * @returns {Promise<number>} Number of events processed
 *
 * @example
 * ```typescript
 * const count = await batchTrackEvents([event1, event2, event3]);
 * console.log('Tracked', count, 'events');
 * ```
 */
export declare const batchTrackEvents: (events: AnalyticsEvent[]) => Promise<number>;
/**
 * 7. Gets document view statistics.
 *
 * @param {string} documentId - Document ID
 * @param {AnalyticsDateRange} [dateRange] - Date range for stats
 * @returns {Promise<DocumentViewStats>} View statistics
 *
 * @example
 * ```typescript
 * const stats = await getDocumentViewStats('doc-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * console.log('Total views:', stats.totalViews);
 * ```
 */
export declare const getDocumentViewStats: (documentId: string, dateRange?: AnalyticsDateRange) => Promise<DocumentViewStats>;
/**
 * 8. Gets unique viewers count.
 *
 * @param {string} documentId - Document ID
 * @param {AnalyticsDateRange} [dateRange] - Date range
 * @returns {Promise<number>} Number of unique viewers
 *
 * @example
 * ```typescript
 * const uniqueViewers = await getUniqueViewers('doc-123');
 * ```
 */
export declare const getUniqueViewers: (documentId: string, dateRange?: AnalyticsDateRange) => Promise<number>;
/**
 * 9. Gets average view duration.
 *
 * @param {string} documentId - Document ID
 * @param {AnalyticsDateRange} [dateRange] - Date range
 * @returns {Promise<number>} Average duration in seconds
 *
 * @example
 * ```typescript
 * const avgDuration = await getAverageViewDuration('doc-123');
 * console.log('Average:', avgDuration, 'seconds');
 * ```
 */
export declare const getAverageViewDuration: (documentId: string, dateRange?: AnalyticsDateRange) => Promise<number>;
/**
 * 10. Gets most viewed pages.
 *
 * @param {string} documentId - Document ID
 * @param {number} [limit] - Number of pages to return
 * @param {AnalyticsDateRange} [dateRange] - Date range
 * @returns {Promise<Array<{ pageNumber: number; viewCount: number }>>} Top pages
 *
 * @example
 * ```typescript
 * const topPages = await getMostViewedPages('doc-123', 10);
 * topPages.forEach(p => console.log(`Page ${p.pageNumber}: ${p.viewCount} views`));
 * ```
 */
export declare const getMostViewedPages: (documentId: string, limit?: number, dateRange?: AnalyticsDateRange) => Promise<Array<{
    pageNumber: number;
    viewCount: number;
}>>;
/**
 * 11. Gets views by time period.
 *
 * @param {string} documentId - Document ID
 * @param {TimePeriod} period - Time period
 * @param {AnalyticsDateRange} dateRange - Date range
 * @returns {Promise<Map<string, number>>} Views per period
 *
 * @example
 * ```typescript
 * const viewsByDay = await getViewsByPeriod('doc-123', 'day', dateRange);
 * ```
 */
export declare const getViewsByPeriod: (documentId: string, period: TimePeriod, dateRange: AnalyticsDateRange) => Promise<Map<string, number>>;
/**
 * 12. Gets comprehensive document statistics.
 *
 * @param {string} documentId - Document ID
 * @param {AnalyticsDateRange} [dateRange] - Date range
 * @returns {Promise<DocumentStatistics>} Document statistics
 *
 * @example
 * ```typescript
 * const stats = await getDocumentStatistics('doc-123');
 * console.log('Engagement score:', stats.engagementScore);
 * ```
 */
export declare const getDocumentStatistics: (documentId: string, dateRange?: AnalyticsDateRange) => Promise<DocumentStatistics>;
/**
 * 13. Calculates document engagement score.
 *
 * @param {string} documentId - Document ID
 * @returns {Promise<number>} Engagement score (0-100)
 *
 * @example
 * ```typescript
 * const score = await calculateEngagementScore('doc-123');
 * console.log('Engagement:', score, '/100');
 * ```
 */
export declare const calculateEngagementScore: (documentId: string) => Promise<number>;
/**
 * 14. Gets total event count by type.
 *
 * @param {string} documentId - Document ID
 * @param {AnalyticsEventType} eventType - Event type
 * @param {AnalyticsDateRange} [dateRange] - Date range
 * @returns {Promise<number>} Event count
 *
 * @example
 * ```typescript
 * const downloads = await getEventCount('doc-123', 'download');
 * ```
 */
export declare const getEventCount: (documentId: string, eventType: AnalyticsEventType, dateRange?: AnalyticsDateRange) => Promise<number>;
/**
 * 15. Gets events grouped by type.
 *
 * @param {string} documentId - Document ID
 * @param {AnalyticsDateRange} [dateRange] - Date range
 * @returns {Promise<Map<AnalyticsEventType, number>>} Events by type
 *
 * @example
 * ```typescript
 * const eventsByType = await getEventsByType('doc-123');
 * eventsByType.forEach((count, type) => console.log(`${type}: ${count}`));
 * ```
 */
export declare const getEventsByType: (documentId: string, dateRange?: AnalyticsDateRange) => Promise<Map<AnalyticsEventType, number>>;
/**
 * 16. Gets user activity summary.
 *
 * @param {string} userId - User ID
 * @param {AnalyticsDateRange} [dateRange] - Date range
 * @returns {Promise<UserActivitySummary>} Activity summary
 *
 * @example
 * ```typescript
 * const activity = await getUserActivitySummary('user-456');
 * console.log('Total events:', activity.totalEvents);
 * ```
 */
export declare const getUserActivitySummary: (userId: string, dateRange?: AnalyticsDateRange) => Promise<UserActivitySummary>;
/**
 * 17. Gets user's most viewed documents.
 *
 * @param {string} userId - User ID
 * @param {number} [limit] - Number of documents to return
 * @returns {Promise<Array<{ documentId: string; viewCount: number }>>} Top documents
 *
 * @example
 * ```typescript
 * const topDocs = await getUserMostViewedDocuments('user-456', 5);
 * ```
 */
export declare const getUserMostViewedDocuments: (userId: string, limit?: number) => Promise<Array<{
    documentId: string;
    viewCount: number;
}>>;
/**
 * 18. Gets user activity timeline.
 *
 * @param {string} userId - User ID
 * @param {AnalyticsDateRange} dateRange - Date range
 * @returns {Promise<AnalyticsEvent[]>} Activity timeline
 *
 * @example
 * ```typescript
 * const timeline = await getUserActivityTimeline('user-456', dateRange);
 * ```
 */
export declare const getUserActivityTimeline: (userId: string, dateRange: AnalyticsDateRange) => Promise<AnalyticsEvent[]>;
/**
 * 19. Gets active users count.
 *
 * @param {AnalyticsDateRange} dateRange - Date range
 * @returns {Promise<number>} Number of active users
 *
 * @example
 * ```typescript
 * const activeUsers = await getActiveUsersCount(dateRange);
 * console.log('Active users:', activeUsers);
 * ```
 */
export declare const getActiveUsersCount: (dateRange: AnalyticsDateRange) => Promise<number>;
/**
 * 20. Gets user session statistics.
 *
 * @param {string} userId - User ID
 * @param {AnalyticsDateRange} [dateRange] - Date range
 * @returns {Promise<{ sessionCount: number; averageDuration: number }>} Session stats
 *
 * @example
 * ```typescript
 * const sessions = await getUserSessionStats('user-456');
 * console.log('Sessions:', sessions.sessionCount);
 * ```
 */
export declare const getUserSessionStats: (userId: string, dateRange?: AnalyticsDateRange) => Promise<{
    sessionCount: number;
    averageDuration: number;
}>;
/**
 * 21. Generates heat map for document page.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {number} resolution - Grid resolution
 * @returns {Promise<HeatMapData>} Heat map data
 *
 * @example
 * ```typescript
 * const heatMap = await generatePageHeatMap('doc-123', 1, 10);
 * console.log('Max clicks:', heatMap.maxValue);
 * ```
 */
export declare const generatePageHeatMap: (documentId: string, pageNumber: number, resolution?: number) => Promise<HeatMapData>;
/**
 * 22. Records heat map click event.
 *
 * @param {string} documentId - Document ID
 * @param {HeatMapClick} click - Click event data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordHeatMapClick('doc-123', {
 *   x: 250,
 *   y: 350,
 *   pageNumber: 1,
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const recordHeatMapClick: (documentId: string, click: HeatMapClick) => Promise<void>;
/**
 * 23. Gets heat map data for page.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @returns {Promise<HeatMapData | null>} Heat map data or null
 *
 * @example
 * ```typescript
 * const heatMap = await getPageHeatMap('doc-123', 1);
 * if (heatMap) console.log('Clicks:', heatMap.clickCount);
 * ```
 */
export declare const getPageHeatMap: (documentId: string, pageNumber: number) => Promise<HeatMapData | null>;
/**
 * 24. Exports heat map as image.
 *
 * @param {HeatMapData} heatMap - Heat map data
 * @param {Object} [options] - Export options
 * @returns {Promise<Buffer>} Heat map image buffer
 *
 * @example
 * ```typescript
 * const image = await exportHeatMapAsImage(heatMap, {
 *   colorScheme: 'hot',
 *   opacity: 0.7
 * });
 * fs.writeFileSync('heatmap.png', image);
 * ```
 */
export declare const exportHeatMapAsImage: (heatMap: HeatMapData, options?: {
    colorScheme?: string;
    opacity?: number;
}) => Promise<Buffer>;
/**
 * 25. Aggregates heat maps for date range.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {AnalyticsDateRange} dateRange - Date range
 * @returns {Promise<HeatMapData>} Aggregated heat map
 *
 * @example
 * ```typescript
 * const aggregated = await aggregateHeatMaps('doc-123', 1, dateRange);
 * ```
 */
export declare const aggregateHeatMaps: (documentId: string, pageNumber: number, dateRange: AnalyticsDateRange) => Promise<HeatMapData>;
/**
 * 26. Generates analytics report.
 *
 * @param {ReportConfig} config - Report configuration
 * @returns {Promise<AnalyticsReport>} Generated report
 *
 * @example
 * ```typescript
 * const report = await generateAnalyticsReport({
 *   title: 'Monthly Report',
 *   dateRange: { startDate: startDate, endDate: endDate },
 *   includeCharts: true
 * });
 * ```
 */
export declare const generateAnalyticsReport: (config: ReportConfig) => Promise<AnalyticsReport>;
/**
 * 27. Creates report summary.
 *
 * @param {AnalyticsEvent[]} events - Events to summarize
 * @returns {ReportSummary} Report summary
 *
 * @example
 * ```typescript
 * const summary = createReportSummary(events);
 * console.log('Total events:', summary.totalEvents);
 * ```
 */
export declare const createReportSummary: (events: AnalyticsEvent[]) => ReportSummary;
/**
 * 28. Exports report to format.
 *
 * @param {AnalyticsReport} report - Report to export
 * @param {AnalyticsExportFormat} format - Export format
 * @returns {Promise<Buffer | string>} Exported report
 *
 * @example
 * ```typescript
 * const csv = await exportReport(report, 'csv');
 * fs.writeFileSync('report.csv', csv);
 * ```
 */
export declare const exportReport: (report: AnalyticsReport, format: AnalyticsExportFormat) => Promise<Buffer | string>;
/**
 * 29. Schedules automated report generation.
 *
 * @param {ReportConfig} config - Report configuration
 * @param {string} schedule - Cron schedule expression
 * @returns {string} Scheduled job ID
 *
 * @example
 * ```typescript
 * const jobId = scheduleReport(reportConfig, '0 0 * * 1'); // Weekly on Monday
 * console.log('Scheduled job:', jobId);
 * ```
 */
export declare const scheduleReport: (config: ReportConfig, schedule: string) => string;
/**
 * 30. Gets saved reports.
 *
 * @param {Object} [filters] - Report filters
 * @returns {Promise<AnalyticsReport[]>} Saved reports
 *
 * @example
 * ```typescript
 * const reports = await getSavedReports({ limit: 10 });
 * ```
 */
export declare const getSavedReports: (filters?: {
    limit?: number;
    startDate?: Date;
    endDate?: Date;
}) => Promise<AnalyticsReport[]>;
/**
 * 31. Calculates trend data for metric.
 *
 * @param {string} metric - Metric name
 * @param {AnalyticsDateRange} dateRange - Date range
 * @param {TimePeriod} granularity - Data granularity
 * @returns {Promise<TrendDataPoint[]>} Trend data
 *
 * @example
 * ```typescript
 * const trend = await calculateTrend('views', dateRange, 'day');
 * ```
 */
export declare const calculateTrend: (metric: string, dateRange: AnalyticsDateRange, granularity: TimePeriod) => Promise<TrendDataPoint[]>;
/**
 * 32. Detects anomalies in analytics data.
 *
 * @param {TrendDataPoint[]} data - Trend data
 * @param {number} [threshold] - Anomaly threshold (standard deviations)
 * @returns {TrendDataPoint[]} Anomalous data points
 *
 * @example
 * ```typescript
 * const anomalies = detectAnomalies(trendData, 2.5);
 * console.log('Anomalies detected:', anomalies.length);
 * ```
 */
export declare const detectAnomalies: (data: TrendDataPoint[], threshold?: number) => TrendDataPoint[];
/**
 * 33. Predicts future trend values.
 *
 * @param {TrendDataPoint[]} historicalData - Historical trend data
 * @param {number} periodsAhead - Number of periods to predict
 * @returns {TrendDataPoint[]} Predicted values
 *
 * @example
 * ```typescript
 * const predictions = predictTrend(historicalData, 7); // 7 days ahead
 * ```
 */
export declare const predictTrend: (historicalData: TrendDataPoint[], periodsAhead: number) => TrendDataPoint[];
/**
 * 34. Compares metrics across time periods.
 *
 * @param {string} metric - Metric name
 * @param {AnalyticsDateRange} period1 - First period
 * @param {AnalyticsDateRange} period2 - Second period
 * @returns {Promise<{ period1: number; period2: number; change: number; changePercent: number }>} Comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareMetrics('views', lastMonth, thisMonth);
 * console.log('Change:', comparison.changePercent, '%');
 * ```
 */
export declare const compareMetrics: (metric: string, period1: AnalyticsDateRange, period2: AnalyticsDateRange) => Promise<{
    period1: number;
    period2: number;
    change: number;
    changePercent: number;
}>;
/**
 * 35. Gets top performing documents.
 *
 * @param {number} [limit] - Number of documents to return
 * @param {AnalyticsDateRange} [dateRange] - Date range
 * @param {string} [metric] - Metric to rank by (views, engagement, etc.)
 * @returns {Promise<Array<{ documentId: string; score: number }>>} Top documents
 *
 * @example
 * ```typescript
 * const topDocs = await getTopDocuments(10, dateRange, 'views');
 * ```
 */
export declare const getTopDocuments: (limit?: number, dateRange?: AnalyticsDateRange, metric?: string) => Promise<Array<{
    documentId: string;
    score: number;
}>>;
/**
 * 36. Gets real-time dashboard metrics.
 *
 * @returns {Promise<DashboardMetrics>} Current dashboard metrics
 *
 * @example
 * ```typescript
 * const metrics = await getDashboardMetrics();
 * console.log('Active users:', metrics.activeUsers);
 * ```
 */
export declare const getDashboardMetrics: () => Promise<DashboardMetrics>;
/**
 * 37. Gets recent activity feed.
 *
 * @param {number} [limit] - Number of events to return
 * @param {AnalyticsEventType[]} [eventTypes] - Filter by event types
 * @returns {Promise<AnalyticsEvent[]>} Recent events
 *
 * @example
 * ```typescript
 * const recent = await getRecentActivity(20, ['view', 'download']);
 * ```
 */
export declare const getRecentActivity: (limit?: number, eventTypes?: AnalyticsEventType[]) => Promise<AnalyticsEvent[]>;
/**
 * 38. Creates chart data for visualization.
 *
 * @param {string} chartType - Chart type
 * @param {TrendDataPoint[]} data - Chart data
 * @param {string} title - Chart title
 * @returns {ChartData} Chart configuration
 *
 * @example
 * ```typescript
 * const chart = createChartData('line', trendData, 'Views Over Time');
 * ```
 */
export declare const createChartData: (chartType: ChartData["type"], data: TrendDataPoint[], title: string) => ChartData;
/**
 * 39. Generates chart image.
 *
 * @param {ChartData} chartData - Chart configuration
 * @param {Object} [options] - Chart options
 * @returns {Promise<Buffer>} Chart image buffer
 *
 * @example
 * ```typescript
 * const image = await generateChartImage(chartData, {
 *   width: 800,
 *   height: 400
 * });
 * fs.writeFileSync('chart.png', image);
 * ```
 */
export declare const generateChartImage: (chartData: ChartData, options?: {
    width?: number;
    height?: number;
}) => Promise<Buffer>;
/**
 * 40. Cleans up old analytics data.
 *
 * @param {number} retentionDays - Number of days to retain
 * @returns {Promise<number>} Number of records deleted
 *
 * @example
 * ```typescript
 * const deleted = await cleanupOldAnalytics(90);
 * console.log('Deleted', deleted, 'old records');
 * ```
 */
export declare const cleanupOldAnalytics: (retentionDays: number) => Promise<number>;
declare const _default: {
    loadAnalyticsConfig: () => AnalyticsConfig;
    validateAnalyticsConfig: (config: AnalyticsConfig) => string[];
    createAnalyticsEventModel: (sequelize: Sequelize) => any;
    createHeatMapDataModel: (sequelize: Sequelize) => any;
    trackDocumentView: (documentId: string, userId?: string, options?: Partial<AnalyticsEvent>) => Promise<AnalyticsEvent>;
    trackDocumentDownload: (documentId: string, userId?: string, metadata?: Record<string, any>) => Promise<AnalyticsEvent>;
    trackDocumentPrint: (documentId: string, userId?: string, pageRange?: number[]) => Promise<AnalyticsEvent>;
    trackDocumentShare: (documentId: string, userId?: string, shareMethod?: string) => Promise<AnalyticsEvent>;
    trackPageView: (documentId: string, pageNumber: number, userId?: string, duration?: number) => Promise<AnalyticsEvent>;
    batchTrackEvents: (events: AnalyticsEvent[]) => Promise<number>;
    getDocumentViewStats: (documentId: string, dateRange?: AnalyticsDateRange) => Promise<DocumentViewStats>;
    getUniqueViewers: (documentId: string, dateRange?: AnalyticsDateRange) => Promise<number>;
    getAverageViewDuration: (documentId: string, dateRange?: AnalyticsDateRange) => Promise<number>;
    getMostViewedPages: (documentId: string, limit?: number, dateRange?: AnalyticsDateRange) => Promise<Array<{
        pageNumber: number;
        viewCount: number;
    }>>;
    getViewsByPeriod: (documentId: string, period: TimePeriod, dateRange: AnalyticsDateRange) => Promise<Map<string, number>>;
    getDocumentStatistics: (documentId: string, dateRange?: AnalyticsDateRange) => Promise<DocumentStatistics>;
    calculateEngagementScore: (documentId: string) => Promise<number>;
    getEventCount: (documentId: string, eventType: AnalyticsEventType, dateRange?: AnalyticsDateRange) => Promise<number>;
    getEventsByType: (documentId: string, dateRange?: AnalyticsDateRange) => Promise<Map<AnalyticsEventType, number>>;
    getUserActivitySummary: (userId: string, dateRange?: AnalyticsDateRange) => Promise<UserActivitySummary>;
    getUserMostViewedDocuments: (userId: string, limit?: number) => Promise<Array<{
        documentId: string;
        viewCount: number;
    }>>;
    getUserActivityTimeline: (userId: string, dateRange: AnalyticsDateRange) => Promise<AnalyticsEvent[]>;
    getActiveUsersCount: (dateRange: AnalyticsDateRange) => Promise<number>;
    getUserSessionStats: (userId: string, dateRange?: AnalyticsDateRange) => Promise<{
        sessionCount: number;
        averageDuration: number;
    }>;
    generatePageHeatMap: (documentId: string, pageNumber: number, resolution?: number) => Promise<HeatMapData>;
    recordHeatMapClick: (documentId: string, click: HeatMapClick) => Promise<void>;
    getPageHeatMap: (documentId: string, pageNumber: number) => Promise<HeatMapData | null>;
    exportHeatMapAsImage: (heatMap: HeatMapData, options?: {
        colorScheme?: string;
        opacity?: number;
    }) => Promise<Buffer>;
    aggregateHeatMaps: (documentId: string, pageNumber: number, dateRange: AnalyticsDateRange) => Promise<HeatMapData>;
    generateAnalyticsReport: (config: ReportConfig) => Promise<AnalyticsReport>;
    createReportSummary: (events: AnalyticsEvent[]) => ReportSummary;
    exportReport: (report: AnalyticsReport, format: AnalyticsExportFormat) => Promise<Buffer | string>;
    scheduleReport: (config: ReportConfig, schedule: string) => string;
    getSavedReports: (filters?: {
        limit?: number;
        startDate?: Date;
        endDate?: Date;
    }) => Promise<AnalyticsReport[]>;
    calculateTrend: (metric: string, dateRange: AnalyticsDateRange, granularity: TimePeriod) => Promise<TrendDataPoint[]>;
    detectAnomalies: (data: TrendDataPoint[], threshold?: number) => TrendDataPoint[];
    predictTrend: (historicalData: TrendDataPoint[], periodsAhead: number) => TrendDataPoint[];
    compareMetrics: (metric: string, period1: AnalyticsDateRange, period2: AnalyticsDateRange) => Promise<{
        period1: number;
        period2: number;
        change: number;
        changePercent: number;
    }>;
    getTopDocuments: (limit?: number, dateRange?: AnalyticsDateRange, metric?: string) => Promise<Array<{
        documentId: string;
        score: number;
    }>>;
    getDashboardMetrics: () => Promise<DashboardMetrics>;
    getRecentActivity: (limit?: number, eventTypes?: AnalyticsEventType[]) => Promise<AnalyticsEvent[]>;
    createChartData: (chartType: ChartData["type"], data: TrendDataPoint[], title: string) => ChartData;
    generateChartImage: (chartData: ChartData, options?: {
        width?: number;
        height?: number;
    }) => Promise<Buffer>;
    cleanupOldAnalytics: (retentionDays: number) => Promise<number>;
};
export default _default;
//# sourceMappingURL=document-analytics-kit.d.ts.map