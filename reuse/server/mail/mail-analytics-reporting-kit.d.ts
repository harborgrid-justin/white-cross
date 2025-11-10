/**
 * LOC: MAILANALRPT123
 * File: /reuse/server/mail/mail-analytics-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS mail services
 *   - Analytics controllers
 *   - Reporting services
 *   - Dashboard services
 *   - Compliance services
 *   - Sequelize models
 */
interface SecurityIncidentReport {
    id: string;
    incidentType: 'phishing' | 'malware' | 'spoofing' | 'unauthorized-access' | 'data-exfiltration' | 'suspicious-activity';
    severity: 'low' | 'medium' | 'high' | 'critical';
    detectionDate: Date;
    affectedUsers: string[];
    affectedMessages: string[];
    sourceIp?: string;
    sourceEmail?: string;
    destinationEmail?: string;
    indicators: Record<string, any>;
    mitigationStatus: 'detected' | 'investigating' | 'mitigated' | 'resolved';
    mitigationActions: string[];
    assignedTo?: string;
    notes?: string;
    resolvedAt?: Date;
    createdAt: Date;
}
interface CustomReportDefinition {
    id: string;
    reportName: string;
    description?: string;
    createdBy: string;
    organizationId?: string;
    reportType: 'traffic' | 'delivery' | 'user-activity' | 'security' | 'compliance' | 'custom';
    dataSource: string[];
    metrics: Array<{
        metricName: string;
        aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count';
        field: string;
    }>;
    filters: Record<string, any>;
    groupBy: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    schedule?: ReportSchedule;
    outputFormat: 'json' | 'csv' | 'pdf' | 'excel';
    recipients?: string[];
    isActive: boolean;
    lastRun?: Date;
    nextRun?: Date;
    createdAt: Date;
    updatedAt: Date;
}
interface ReportSchedule {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    interval?: number;
    dayOfWeek?: number;
    dayOfMonth?: number;
    hour?: number;
    minute?: number;
    timezone?: string;
    enabled: boolean;
}
interface DashboardConfiguration {
    id: string;
    dashboardName: string;
    description?: string;
    createdBy: string;
    organizationId?: string;
    isPublic: boolean;
    widgets: Array<{
        widgetId: string;
        widgetType: 'chart' | 'table' | 'metric' | 'gauge' | 'timeline';
        title: string;
        dataSource: string;
        refreshInterval?: number;
        position: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        configuration: Record<string, any>;
    }>;
    refreshInterval: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
interface DatePeriod {
    startDate: Date;
    endDate: Date;
    periodType?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}
interface ReportExportOptions {
    format: 'json' | 'csv' | 'pdf' | 'excel' | 'html';
    includeCharts?: boolean;
    includeRawData?: boolean;
    compression?: boolean;
    encryption?: {
        enabled: boolean;
        algorithm?: string;
        publicKey?: string;
    };
    watermark?: string;
}
interface SwaggerAnalyticsSchema {
    name: string;
    type: string;
    description: string;
    example: any;
    required?: boolean;
    properties?: Record<string, any>;
}
/**
 * Sequelize MailAnalyticsMetric model attributes for mail_analytics_metrics table.
 *
 * @example
 * ```typescript
 * class MailAnalyticsMetric extends Model {}
 * MailAnalyticsMetric.init(getMailAnalyticsMetricModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_analytics_metrics',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['metricType', 'timestamp'] },
 *     { fields: ['userId', 'timestamp'] },
 *     { fields: ['organizationId', 'timestamp'] },
 *     { fields: ['aggregationPeriod', 'timestamp'] }
 *   ]
 * });
 * ```
 */
export declare const getMailAnalyticsMetricModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    metricType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    metricName: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    metricValue: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    metricUnit: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    timestamp: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    organizationId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    mailboxId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    aggregationPeriod: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    dimensions: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
        comment: string;
    };
    metadata: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
        comment: string;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
};
/**
 * Sequelize ScheduledReport model attributes for mail_scheduled_reports table.
 *
 * @example
 * ```typescript
 * class ScheduledReport extends Model {}
 * ScheduledReport.init(getScheduledReportModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_scheduled_reports',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['createdBy', 'isActive'] },
 *     { fields: ['nextRun', 'isActive'] },
 *     { fields: ['organizationId', 'isActive'] }
 *   ]
 * });
 * ```
 */
export declare const getScheduledReportModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    reportName: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    createdBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    organizationId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    reportType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    dataSource: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    metrics: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    filters: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
        comment: string;
    };
    groupBy: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    sortBy: {
        type: string;
        allowNull: boolean;
    };
    sortOrder: {
        type: string;
        values: string[];
        allowNull: boolean;
        defaultValue: string;
    };
    limit: {
        type: string;
        allowNull: boolean;
    };
    schedule: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    outputFormat: {
        type: string;
        values: string[];
        allowNull: boolean;
        defaultValue: string;
    };
    recipients: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    isActive: {
        type: string;
        allowNull: boolean;
        defaultValue: boolean;
    };
    lastRun: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    nextRun: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
};
/**
 * Sequelize DashboardConfiguration model attributes for mail_dashboards table.
 *
 * @example
 * ```typescript
 * class DashboardConfiguration extends Model {}
 * DashboardConfiguration.init(getDashboardConfigurationModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_dashboards',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['createdBy', 'isActive'] },
 *     { fields: ['organizationId', 'isPublic'] }
 *   ]
 * });
 * ```
 */
export declare const getDashboardConfigurationModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    dashboardName: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    createdBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    organizationId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    isPublic: {
        type: string;
        allowNull: boolean;
        defaultValue: boolean;
        comment: string;
    };
    widgets: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    refreshInterval: {
        type: string;
        allowNull: boolean;
        defaultValue: number;
        comment: string;
    };
    isActive: {
        type: string;
        allowNull: boolean;
        defaultValue: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
};
/**
 * Sequelize SecurityIncident model attributes for mail_security_incidents table.
 *
 * @example
 * ```typescript
 * class SecurityIncident extends Model {}
 * SecurityIncident.init(getSecurityIncidentModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_security_incidents',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['incidentType', 'detectionDate'] },
 *     { fields: ['severity', 'mitigationStatus'] },
 *     { fields: ['assignedTo', 'mitigationStatus'] }
 *   ]
 * });
 * ```
 */
export declare const getSecurityIncidentModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    incidentType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    severity: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    detectionDate: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    affectedUsers: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    affectedMessages: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    sourceIp: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    sourceEmail: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    destinationEmail: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    indicators: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
        comment: string;
    };
    mitigationStatus: {
        type: string;
        values: string[];
        allowNull: boolean;
        defaultValue: string;
    };
    mitigationActions: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    assignedTo: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        comment: string;
    };
    notes: {
        type: string;
        allowNull: boolean;
    };
    resolvedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
    };
};
/**
 * Collects comprehensive email traffic metrics for a specified period.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} [organizationId] - Optional organization filter
 * @returns {EmailTrafficMetrics} Comprehensive traffic metrics
 *
 * @example
 * ```typescript
 * const metrics = getEmailTrafficMetrics({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   periodType: 'month'
 * }, 'org-123');
 * console.log('Total sent:', metrics.totalSent);
 * console.log('Peak hour:', metrics.peakHourTraffic);
 * ```
 */
export declare const getEmailTrafficMetrics: (period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Tracks real-time email traffic with minute-level granularity.
 *
 * @param {number} [minutes=60] - Number of minutes to track
 * @param {string} [organizationId] - Optional organization filter
 * @returns {object} Real-time traffic data
 *
 * @example
 * ```typescript
 * const realtime = getRealtimeTrafficMetrics(30, 'org-123');
 * console.log('Messages in last 30 minutes:', realtime.totalMessages);
 * ```
 */
export declare const getRealtimeTrafficMetrics: (minutes?: number, organizationId?: string) => Record<string, any>;
/**
 * Analyzes traffic patterns by hour of day.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} [organizationId] - Optional organization filter
 * @returns {object} Hourly traffic patterns
 *
 * @example
 * ```typescript
 * const patterns = analyzeTrafficPatternsByHour({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * console.log('Peak hour:', patterns.peakHour);
 * ```
 */
export declare const analyzeTrafficPatternsByHour: (period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Tracks email traffic by domain with sender/recipient analysis.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {number} [topN=10] - Number of top domains to return
 * @returns {object} Domain traffic statistics
 *
 * @example
 * ```typescript
 * const domainStats = getTrafficByDomain({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * }, 20);
 * ```
 */
export declare const getTrafficByDomain: (period: DatePeriod, topN?: number) => Record<string, any>;
/**
 * Collects comprehensive user activity metrics for mail usage.
 *
 * @param {string} userId - User ID to track
 * @param {DatePeriod} period - Time period for analysis
 * @returns {UserActivityMetrics} User activity metrics
 *
 * @example
 * ```typescript
 * const activity = getUserActivityMetrics('user-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * console.log('Messages sent:', activity.totalMessagesSent);
 * ```
 */
export declare const getUserActivityMetrics: (userId: string, period: DatePeriod) => Record<string, any>;
/**
 * Tracks most active users by various metrics.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} metricName - Metric to rank by (messages_sent, messages_received, etc.)
 * @param {number} [topN=10] - Number of top users to return
 * @param {string} [organizationId] - Optional organization filter
 * @returns {object} Top users by activity
 *
 * @example
 * ```typescript
 * const topSenders = getMostActiveUsers({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * }, 'messages_sent', 20);
 * ```
 */
export declare const getMostActiveUsers: (period: DatePeriod, metricName: string, topN?: number, organizationId?: string) => Record<string, any>;
/**
 * Analyzes user activity patterns by time of day and day of week.
 *
 * @param {string} userId - User ID to analyze
 * @param {DatePeriod} period - Time period for analysis
 * @returns {object} User activity patterns
 *
 * @example
 * ```typescript
 * const patterns = analyzeUserActivityPatterns('user-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const analyzeUserActivityPatterns: (userId: string, period: DatePeriod) => Record<string, any>;
/**
 * Tracks user engagement metrics including session duration and action frequency.
 *
 * @param {string} userId - User ID to track
 * @param {DatePeriod} period - Time period for analysis
 * @returns {object} Engagement metrics
 *
 * @example
 * ```typescript
 * const engagement = trackUserEngagement('user-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const trackUserEngagement: (userId: string, period: DatePeriod) => Record<string, any>;
/**
 * Retrieves comprehensive statistics for a specific mailbox.
 *
 * @param {string} mailboxId - Mailbox ID
 * @param {string} userId - User ID for authorization
 * @returns {MailboxStatistics} Mailbox statistics
 *
 * @example
 * ```typescript
 * const stats = getMailboxStatistics('mailbox-123', 'user-123');
 * console.log('Total messages:', stats.totalMessages);
 * console.log('Storage used:', stats.storageUsed);
 * ```
 */
export declare const getMailboxStatistics: (mailboxId: string, userId: string) => Record<string, any>;
/**
 * Generates mailbox statistics for all users in an organization.
 *
 * @param {string} organizationId - Organization ID
 * @param {object} [options] - Query options
 * @returns {object} Organization-wide mailbox statistics
 *
 * @example
 * ```typescript
 * const orgStats = getOrganizationMailboxStatistics('org-123', {
 *   includeInactive: false,
 *   limit: 100
 * });
 * ```
 */
export declare const getOrganizationMailboxStatistics: (organizationId: string, options?: {
    includeInactive?: boolean;
    limit?: number;
}) => Record<string, any>;
/**
 * Calculates mailbox growth rate and trends.
 *
 * @param {string} mailboxId - Mailbox ID
 * @param {DatePeriod} period - Time period for analysis
 * @returns {object} Mailbox growth metrics
 *
 * @example
 * ```typescript
 * const growth = calculateMailboxGrowth('mailbox-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const calculateMailboxGrowth: (mailboxId: string, period: DatePeriod) => Record<string, any>;
/**
 * Generates comprehensive message volume report for a period.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} [organizationId] - Optional organization filter
 * @returns {MessageVolumeReport} Message volume report
 *
 * @example
 * ```typescript
 * const report = generateMessageVolumeReport({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   periodType: 'month'
 * }, 'org-123');
 * ```
 */
export declare const generateMessageVolumeReport: (period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Analyzes message volume trends with predictive analytics.
 *
 * @param {string} metricName - Metric to analyze
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} [organizationId] - Optional organization filter
 * @returns {TrendAnalysis} Trend analysis with predictions
 *
 * @example
 * ```typescript
 * const trends = analyzeMessageVolumeTrends('sent', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const analyzeMessageVolumeTrends: (metricName: string, period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Compares message volume between two time periods.
 *
 * @param {DatePeriod} currentPeriod - Current time period
 * @param {DatePeriod} comparisonPeriod - Comparison time period
 * @param {string} [organizationId] - Optional organization filter
 * @returns {ComparativeAnalysis} Comparative analysis
 *
 * @example
 * ```typescript
 * const comparison = compareMessageVolumePeriods(
 *   { startDate: new Date('2024-02-01'), endDate: new Date('2024-02-29') },
 *   { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31') }
 * );
 * ```
 */
export declare const compareMessageVolumePeriods: (currentPeriod: DatePeriod, comparisonPeriod: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Collects comprehensive delivery performance metrics.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} [organizationId] - Optional organization filter
 * @returns {DeliveryPerformanceMetrics} Delivery performance metrics
 *
 * @example
 * ```typescript
 * const performance = getDeliveryPerformanceMetrics({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * console.log('Delivery rate:', performance.deliveryRate);
 * ```
 */
export declare const getDeliveryPerformanceMetrics: (period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Analyzes delivery failure reasons and patterns.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} [organizationId] - Optional organization filter
 * @returns {object} Delivery failure analysis
 *
 * @example
 * ```typescript
 * const failures = analyzeDeliveryFailures({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const analyzeDeliveryFailures: (period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Tracks delivery time percentiles for performance monitoring.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} [organizationId] - Optional organization filter
 * @returns {object} Delivery time percentile data
 *
 * @example
 * ```typescript
 * const percentiles = getDeliveryTimePercentiles({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const getDeliveryTimePercentiles: (period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Monitors bounce rates by domain and recipient type.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {number} [topN=20] - Number of top domains to return
 * @returns {object} Bounce rate analysis by domain
 *
 * @example
 * ```typescript
 * const bounces = monitorBounceRatesByDomain({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * }, 30);
 * ```
 */
export declare const monitorBounceRatesByDomain: (period: DatePeriod, topN?: number) => Record<string, any>;
/**
 * Collects spam detection and filtering metrics.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} [organizationId] - Optional organization filter
 * @returns {SpamDetectionMetrics} Spam detection metrics
 *
 * @example
 * ```typescript
 * const spamMetrics = getSpamDetectionMetrics({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const getSpamDetectionMetrics: (period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Analyzes spam detection effectiveness by rule and score threshold.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} [organizationId] - Optional organization filter
 * @returns {object} Spam rule effectiveness analysis
 *
 * @example
 * ```typescript
 * const ruleEffectiveness = analyzeSpamRuleEffectiveness({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const analyzeSpamRuleEffectiveness: (period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Identifies top spam senders for blocking consideration.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {number} [topN=50] - Number of top spam senders to return
 * @param {string} [organizationId] - Optional organization filter
 * @returns {object} Top spam senders list
 *
 * @example
 * ```typescript
 * const topSpammers = getTopSpamSenders({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * }, 100);
 * ```
 */
export declare const getTopSpamSenders: (period: DatePeriod, topN?: number, organizationId?: string) => Record<string, any>;
/**
 * Collects comprehensive storage usage metrics.
 *
 * @param {string} [organizationId] - Optional organization filter
 * @returns {StorageUsageMetrics} Storage usage metrics
 *
 * @example
 * ```typescript
 * const storage = getStorageUsageMetrics('org-123');
 * console.log('Total storage:', storage.totalStorageUsed);
 * console.log('Utilization:', storage.storageUtilization);
 * ```
 */
export declare const getStorageUsageMetrics: (organizationId?: string) => Record<string, any>;
/**
 * Analyzes storage usage by mailbox with quota monitoring.
 *
 * @param {string} [organizationId] - Optional organization filter
 * @param {number} [threshold=80] - Usage threshold percentage for alerts
 * @returns {object} Mailbox storage analysis
 *
 * @example
 * ```typescript
 * const mailboxStorage = analyzeStorageByMailbox('org-123', 90);
 * ```
 */
export declare const analyzeStorageByMailbox: (organizationId?: string, threshold?: number) => Record<string, any>;
/**
 * Projects storage requirements and capacity planning.
 *
 * @param {DatePeriod} period - Historical period for trend analysis
 * @param {number} [projectionDays=90] - Days to project into future
 * @param {string} [organizationId] - Optional organization filter
 * @returns {object} Storage capacity projection
 *
 * @example
 * ```typescript
 * const projection = projectStorageRequirements({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * }, 180);
 * ```
 */
export declare const projectStorageRequirements: (period: DatePeriod, projectionDays?: number, organizationId?: string) => Record<string, any>;
/**
 * Analyzes storage usage by folder and message type.
 *
 * @param {string} userId - User ID
 * @param {string} [mailboxId] - Optional mailbox filter
 * @returns {object} Folder storage breakdown
 *
 * @example
 * ```typescript
 * const folderStorage = analyzeStorageByFolder('user-123', 'mailbox-123');
 * ```
 */
export declare const analyzeStorageByFolder: (userId: string, mailboxId?: string) => Record<string, any>;
/**
 * Creates a new security incident report.
 *
 * @param {Omit<SecurityIncidentReport, 'id' | 'createdAt'>} incident - Incident details
 * @returns {object} Create query object
 *
 * @example
 * ```typescript
 * const incident = createSecurityIncident({
 *   incidentType: 'phishing',
 *   severity: 'high',
 *   detectionDate: new Date(),
 *   affectedUsers: ['user-123'],
 *   affectedMessages: ['msg-456'],
 *   mitigationStatus: 'detected',
 *   mitigationActions: ['Quarantined messages']
 * });
 * ```
 */
export declare const createSecurityIncident: (incident: Omit<SecurityIncidentReport, "id" | "createdAt">) => Record<string, any>;
/**
 * Retrieves security incidents with filtering and pagination.
 *
 * @param {object} filters - Filter criteria
 * @returns {object} Query object for incidents
 *
 * @example
 * ```typescript
 * const incidents = getSecurityIncidents({
 *   incidentType: 'phishing',
 *   severity: 'high',
 *   mitigationStatus: 'detected',
 *   limit: 50
 * });
 * ```
 */
export declare const getSecurityIncidents: (filters: {
    incidentType?: string;
    severity?: string;
    mitigationStatus?: string;
    startDate?: Date;
    endDate?: Date;
    assignedTo?: string;
    limit?: number;
    offset?: number;
}) => Record<string, any>;
/**
 * Generates security incident summary statistics.
 *
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} [organizationId] - Optional organization filter
 * @returns {object} Security incident statistics
 *
 * @example
 * ```typescript
 * const stats = getSecurityIncidentStatistics({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const getSecurityIncidentStatistics: (period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Updates security incident status and mitigation actions.
 *
 * @param {string} incidentId - Incident ID
 * @param {object} updates - Updates to apply
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const updated = updateSecurityIncident('incident-123', {
 *   mitigationStatus: 'mitigated',
 *   mitigationActions: ['Blocked sender', 'Notified users'],
 *   assignedTo: 'analyst-456'
 * });
 * ```
 */
export declare const updateSecurityIncident: (incidentId: string, updates: {
    mitigationStatus?: string;
    mitigationActions?: string[];
    assignedTo?: string;
    notes?: string;
    resolvedAt?: Date;
}) => Record<string, any>;
/**
 * Generates HIPAA compliance report for mail operations.
 *
 * @param {DatePeriod} period - Reporting period
 * @param {string} [organizationId] - Optional organization filter
 * @returns {ComplianceReport} HIPAA compliance report
 *
 * @example
 * ```typescript
 * const hipaaReport = generateHIPAAComplianceReport({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   periodType: 'month'
 * });
 * ```
 */
export declare const generateHIPAAComplianceReport: (period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Generates retention policy compliance report.
 *
 * @param {DatePeriod} period - Reporting period
 * @param {string} [organizationId] - Optional organization filter
 * @returns {ComplianceReport} Retention compliance report
 *
 * @example
 * ```typescript
 * const retentionReport = generateRetentionComplianceReport({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const generateRetentionComplianceReport: (period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Tracks compliance metrics over time.
 *
 * @param {string} complianceType - Type of compliance to track
 * @param {DatePeriod} period - Time period for analysis
 * @param {string} [organizationId] - Optional organization filter
 * @returns {object} Compliance metrics trend
 *
 * @example
 * ```typescript
 * const trend = trackComplianceMetrics('hipaa', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const trackComplianceMetrics: (complianceType: string, period: DatePeriod, organizationId?: string) => Record<string, any>;
/**
 * Creates a custom report definition.
 *
 * @param {Omit<CustomReportDefinition, 'id' | 'createdAt' | 'updatedAt'>} reportDef - Report definition
 * @returns {object} Create query object
 *
 * @example
 * ```typescript
 * const report = createCustomReport({
 *   reportName: 'Weekly Traffic Summary',
 *   createdBy: 'user-123',
 *   reportType: 'traffic',
 *   dataSource: ['mail_analytics_metrics'],
 *   metrics: [
 *     { metricName: 'total_sent', aggregation: 'sum', field: 'metricValue' },
 *     { metricName: 'total_received', aggregation: 'sum', field: 'metricValue' }
 *   ],
 *   filters: { metricType: 'traffic' },
 *   groupBy: ['DATE(timestamp)'],
 *   outputFormat: 'pdf',
 *   isActive: true
 * });
 * ```
 */
export declare const createCustomReport: (reportDef: Omit<CustomReportDefinition, "id" | "createdAt" | "updatedAt">) => Record<string, any>;
/**
 * Executes a custom report definition.
 *
 * @param {string} reportId - Report definition ID
 * @param {DatePeriod} period - Time period for the report
 * @returns {object} Report execution query
 *
 * @example
 * ```typescript
 * const results = executeCustomReport('report-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const executeCustomReport: (reportId: string, period: DatePeriod) => Record<string, any>;
/**
 * Lists all custom report definitions with filtering.
 *
 * @param {object} filters - Filter options
 * @returns {object} Query for report definitions
 *
 * @example
 * ```typescript
 * const reports = listCustomReports({
 *   createdBy: 'user-123',
 *   reportType: 'traffic',
 *   isActive: true
 * });
 * ```
 */
export declare const listCustomReports: (filters: {
    createdBy?: string;
    organizationId?: string;
    reportType?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
}) => Record<string, any>;
/**
 * Updates a custom report definition.
 *
 * @param {string} reportId - Report ID
 * @param {Partial<CustomReportDefinition>} updates - Updates to apply
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const updated = updateCustomReport('report-123', {
 *   reportName: 'Updated Weekly Traffic',
 *   schedule: {
 *     frequency: 'weekly',
 *     dayOfWeek: 1,
 *     hour: 8,
 *     enabled: true
 *   }
 * });
 * ```
 */
export declare const updateCustomReport: (reportId: string, updates: Partial<CustomReportDefinition>) => Record<string, any>;
/**
 * Deletes a custom report definition.
 *
 * @param {string} reportId - Report ID
 * @returns {object} Delete query object
 *
 * @example
 * ```typescript
 * const deleted = deleteCustomReport('report-123');
 * ```
 */
export declare const deleteCustomReport: (reportId: string) => Record<string, any>;
/**
 * Creates a new dashboard configuration.
 *
 * @param {Omit<DashboardConfiguration, 'id' | 'createdAt' | 'updatedAt'>} dashboard - Dashboard config
 * @returns {object} Create query object
 *
 * @example
 * ```typescript
 * const dashboard = createDashboard({
 *   dashboardName: 'Email Operations Dashboard',
 *   createdBy: 'user-123',
 *   isPublic: true,
 *   widgets: [
 *     {
 *       widgetId: 'widget-1',
 *       widgetType: 'chart',
 *       title: 'Daily Message Volume',
 *       dataSource: 'traffic-metrics',
 *       position: { x: 0, y: 0, width: 6, height: 4 },
 *       configuration: { chartType: 'line' }
 *     }
 *   ],
 *   refreshInterval: 300,
 *   isActive: true
 * });
 * ```
 */
export declare const createDashboard: (dashboard: Omit<DashboardConfiguration, "id" | "createdAt" | "updatedAt">) => Record<string, any>;
/**
 * Retrieves dashboard configuration by ID.
 *
 * @param {string} dashboardId - Dashboard ID
 * @param {string} userId - User ID for authorization
 * @returns {object} Query object
 *
 * @example
 * ```typescript
 * const dashboard = getDashboard('dashboard-123', 'user-123');
 * ```
 */
export declare const getDashboard: (dashboardId: string, userId: string) => Record<string, any>;
/**
 * Lists dashboards with filtering and pagination.
 *
 * @param {object} filters - Filter options
 * @returns {object} Query for dashboards
 *
 * @example
 * ```typescript
 * const dashboards = listDashboards({
 *   createdBy: 'user-123',
 *   isPublic: true,
 *   isActive: true
 * });
 * ```
 */
export declare const listDashboards: (filters: {
    createdBy?: string;
    organizationId?: string;
    isPublic?: boolean;
    isActive?: boolean;
    limit?: number;
    offset?: number;
}) => Record<string, any>;
/**
 * Updates dashboard configuration.
 *
 * @param {string} dashboardId - Dashboard ID
 * @param {Partial<DashboardConfiguration>} updates - Updates to apply
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const updated = updateDashboard('dashboard-123', {
 *   dashboardName: 'Updated Dashboard',
 *   widgets: [...newWidgets],
 *   refreshInterval: 600
 * });
 * ```
 */
export declare const updateDashboard: (dashboardId: string, updates: Partial<DashboardConfiguration>) => Record<string, any>;
/**
 * Schedules a report for automatic generation.
 *
 * @param {string} reportId - Report ID
 * @param {ReportSchedule} schedule - Schedule configuration
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const scheduled = scheduleReport('report-123', {
 *   frequency: 'daily',
 *   hour: 8,
 *   minute: 0,
 *   timezone: 'America/New_York',
 *   enabled: true
 * });
 * ```
 */
export declare const scheduleReport: (reportId: string, schedule: ReportSchedule) => Record<string, any>;
/**
 * Calculates the next run time for a scheduled report.
 *
 * @param {ReportSchedule} schedule - Schedule configuration
 * @returns {Date} Next run timestamp
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRunTime({
 *   frequency: 'weekly',
 *   dayOfWeek: 1,
 *   hour: 9,
 *   minute: 0,
 *   enabled: true
 * });
 * ```
 */
export declare const calculateNextRunTime: (schedule: ReportSchedule) => Date;
/**
 * Exports report data in specified format.
 *
 * @param {any} reportData - Report data to export
 * @param {ReportExportOptions} options - Export options
 * @returns {object} Export configuration
 *
 * @example
 * ```typescript
 * const exported = exportReport(reportData, {
 *   format: 'pdf',
 *   includeCharts: true,
 *   includeRawData: false,
 *   compression: true
 * });
 * ```
 */
export declare const exportReport: (reportData: any, options: ReportExportOptions) => Record<string, any>;
/**
 * Retrieves due scheduled reports for execution.
 *
 * @returns {object} Query for due reports
 *
 * @example
 * ```typescript
 * const dueReports = getDueScheduledReports();
 * ```
 */
export declare const getDueScheduledReports: () => Record<string, any>;
/**
 * Marks a scheduled report as executed.
 *
 * @param {string} reportId - Report ID
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const executed = markReportExecuted('report-123');
 * ```
 */
export declare const markReportExecuted: (reportId: string) => Record<string, any>;
/**
 * Returns Swagger schema for MailAnalyticsMetric.
 *
 * @returns {SwaggerAnalyticsSchema} Swagger schema definition
 *
 * @example
 * ```typescript
 * @ApiResponse({
 *   status: 200,
 *   description: 'Analytics metric retrieved',
 *   schema: getMailAnalyticsMetricSwaggerSchema()
 * })
 * ```
 */
export declare const getMailAnalyticsMetricSwaggerSchema: () => SwaggerAnalyticsSchema;
/**
 * Returns Swagger schema for CustomReportDefinition.
 *
 * @returns {SwaggerAnalyticsSchema} Swagger schema definition
 *
 * @example
 * ```typescript
 * @ApiBody({
 *   schema: getCustomReportSwaggerSchema()
 * })
 * ```
 */
export declare const getCustomReportSwaggerSchema: () => SwaggerAnalyticsSchema;
/**
 * Returns Swagger schema for DashboardConfiguration.
 *
 * @returns {SwaggerAnalyticsSchema} Swagger schema definition
 *
 * @example
 * ```typescript
 * @ApiResponse({
 *   schema: getDashboardSwaggerSchema()
 * })
 * ```
 */
export declare const getDashboardSwaggerSchema: () => SwaggerAnalyticsSchema;
/**
 * Returns Swagger schema for SecurityIncidentReport.
 *
 * @returns {SwaggerAnalyticsSchema} Swagger schema definition
 *
 * @example
 * ```typescript
 * @ApiResponse({
 *   schema: getSecurityIncidentSwaggerSchema()
 * })
 * ```
 */
export declare const getSecurityIncidentSwaggerSchema: () => SwaggerAnalyticsSchema;
declare const _default: {
    getMailAnalyticsMetricModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        metricType: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        metricName: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        metricValue: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        metricUnit: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        timestamp: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        organizationId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        mailboxId: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        aggregationPeriod: {
            type: string;
            values: string[];
            allowNull: boolean;
            comment: string;
        };
        dimensions: {
            type: string;
            allowNull: boolean;
            defaultValue: {};
            comment: string;
        };
        metadata: {
            type: string;
            allowNull: boolean;
            defaultValue: {};
            comment: string;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
    };
    getScheduledReportModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        reportName: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        createdBy: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        organizationId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        reportType: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        dataSource: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
            comment: string;
        };
        metrics: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
            comment: string;
        };
        filters: {
            type: string;
            allowNull: boolean;
            defaultValue: {};
            comment: string;
        };
        groupBy: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
            comment: string;
        };
        sortBy: {
            type: string;
            allowNull: boolean;
        };
        sortOrder: {
            type: string;
            values: string[];
            allowNull: boolean;
            defaultValue: string;
        };
        limit: {
            type: string;
            allowNull: boolean;
        };
        schedule: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        outputFormat: {
            type: string;
            values: string[];
            allowNull: boolean;
            defaultValue: string;
        };
        recipients: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
            comment: string;
        };
        isActive: {
            type: string;
            allowNull: boolean;
            defaultValue: boolean;
        };
        lastRun: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        nextRun: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
    };
    getDashboardConfigurationModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        dashboardName: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        createdBy: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        organizationId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        isPublic: {
            type: string;
            allowNull: boolean;
            defaultValue: boolean;
            comment: string;
        };
        widgets: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
            comment: string;
        };
        refreshInterval: {
            type: string;
            allowNull: boolean;
            defaultValue: number;
            comment: string;
        };
        isActive: {
            type: string;
            allowNull: boolean;
            defaultValue: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
    };
    getSecurityIncidentModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        incidentType: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        severity: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        detectionDate: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        affectedUsers: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
            comment: string;
        };
        affectedMessages: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
            comment: string;
        };
        sourceIp: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        sourceEmail: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        destinationEmail: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        indicators: {
            type: string;
            allowNull: boolean;
            defaultValue: {};
            comment: string;
        };
        mitigationStatus: {
            type: string;
            values: string[];
            allowNull: boolean;
            defaultValue: string;
        };
        mitigationActions: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
            comment: string;
        };
        assignedTo: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            comment: string;
        };
        notes: {
            type: string;
            allowNull: boolean;
        };
        resolvedAt: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
            defaultValue: string;
        };
    };
    getEmailTrafficMetrics: (period: DatePeriod, organizationId?: string) => Record<string, any>;
    getRealtimeTrafficMetrics: (minutes?: number, organizationId?: string) => Record<string, any>;
    analyzeTrafficPatternsByHour: (period: DatePeriod, organizationId?: string) => Record<string, any>;
    getTrafficByDomain: (period: DatePeriod, topN?: number) => Record<string, any>;
    getUserActivityMetrics: (userId: string, period: DatePeriod) => Record<string, any>;
    getMostActiveUsers: (period: DatePeriod, metricName: string, topN?: number, organizationId?: string) => Record<string, any>;
    analyzeUserActivityPatterns: (userId: string, period: DatePeriod) => Record<string, any>;
    trackUserEngagement: (userId: string, period: DatePeriod) => Record<string, any>;
    getMailboxStatistics: (mailboxId: string, userId: string) => Record<string, any>;
    getOrganizationMailboxStatistics: (organizationId: string, options?: {
        includeInactive?: boolean;
        limit?: number;
    }) => Record<string, any>;
    calculateMailboxGrowth: (mailboxId: string, period: DatePeriod) => Record<string, any>;
    generateMessageVolumeReport: (period: DatePeriod, organizationId?: string) => Record<string, any>;
    analyzeMessageVolumeTrends: (metricName: string, period: DatePeriod, organizationId?: string) => Record<string, any>;
    compareMessageVolumePeriods: (currentPeriod: DatePeriod, comparisonPeriod: DatePeriod, organizationId?: string) => Record<string, any>;
    getDeliveryPerformanceMetrics: (period: DatePeriod, organizationId?: string) => Record<string, any>;
    analyzeDeliveryFailures: (period: DatePeriod, organizationId?: string) => Record<string, any>;
    getDeliveryTimePercentiles: (period: DatePeriod, organizationId?: string) => Record<string, any>;
    monitorBounceRatesByDomain: (period: DatePeriod, topN?: number) => Record<string, any>;
    getSpamDetectionMetrics: (period: DatePeriod, organizationId?: string) => Record<string, any>;
    analyzeSpamRuleEffectiveness: (period: DatePeriod, organizationId?: string) => Record<string, any>;
    getTopSpamSenders: (period: DatePeriod, topN?: number, organizationId?: string) => Record<string, any>;
    getStorageUsageMetrics: (organizationId?: string) => Record<string, any>;
    analyzeStorageByMailbox: (organizationId?: string, threshold?: number) => Record<string, any>;
    projectStorageRequirements: (period: DatePeriod, projectionDays?: number, organizationId?: string) => Record<string, any>;
    analyzeStorageByFolder: (userId: string, mailboxId?: string) => Record<string, any>;
    createSecurityIncident: (incident: Omit<SecurityIncidentReport, "id" | "createdAt">) => Record<string, any>;
    getSecurityIncidents: (filters: {
        incidentType?: string;
        severity?: string;
        mitigationStatus?: string;
        startDate?: Date;
        endDate?: Date;
        assignedTo?: string;
        limit?: number;
        offset?: number;
    }) => Record<string, any>;
    getSecurityIncidentStatistics: (period: DatePeriod, organizationId?: string) => Record<string, any>;
    updateSecurityIncident: (incidentId: string, updates: {
        mitigationStatus?: string;
        mitigationActions?: string[];
        assignedTo?: string;
        notes?: string;
        resolvedAt?: Date;
    }) => Record<string, any>;
    generateHIPAAComplianceReport: (period: DatePeriod, organizationId?: string) => Record<string, any>;
    generateRetentionComplianceReport: (period: DatePeriod, organizationId?: string) => Record<string, any>;
    trackComplianceMetrics: (complianceType: string, period: DatePeriod, organizationId?: string) => Record<string, any>;
    createCustomReport: (reportDef: Omit<CustomReportDefinition, "id" | "createdAt" | "updatedAt">) => Record<string, any>;
    executeCustomReport: (reportId: string, period: DatePeriod) => Record<string, any>;
    listCustomReports: (filters: {
        createdBy?: string;
        organizationId?: string;
        reportType?: string;
        isActive?: boolean;
        limit?: number;
        offset?: number;
    }) => Record<string, any>;
    updateCustomReport: (reportId: string, updates: Partial<CustomReportDefinition>) => Record<string, any>;
    deleteCustomReport: (reportId: string) => Record<string, any>;
    createDashboard: (dashboard: Omit<DashboardConfiguration, "id" | "createdAt" | "updatedAt">) => Record<string, any>;
    getDashboard: (dashboardId: string, userId: string) => Record<string, any>;
    listDashboards: (filters: {
        createdBy?: string;
        organizationId?: string;
        isPublic?: boolean;
        isActive?: boolean;
        limit?: number;
        offset?: number;
    }) => Record<string, any>;
    updateDashboard: (dashboardId: string, updates: Partial<DashboardConfiguration>) => Record<string, any>;
    scheduleReport: (reportId: string, schedule: ReportSchedule) => Record<string, any>;
    calculateNextRunTime: (schedule: ReportSchedule) => Date;
    exportReport: (reportData: any, options: ReportExportOptions) => Record<string, any>;
    getDueScheduledReports: () => Record<string, any>;
    markReportExecuted: (reportId: string) => Record<string, any>;
    getMailAnalyticsMetricSwaggerSchema: () => SwaggerAnalyticsSchema;
    getCustomReportSwaggerSchema: () => SwaggerAnalyticsSchema;
    getDashboardSwaggerSchema: () => SwaggerAnalyticsSchema;
    getSecurityIncidentSwaggerSchema: () => SwaggerAnalyticsSchema;
};
export default _default;
//# sourceMappingURL=mail-analytics-reporting-kit.d.ts.map