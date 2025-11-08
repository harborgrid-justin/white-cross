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

/**
 * File: /reuse/server/mail/mail-analytics-reporting-kit.ts
 * Locator: WC-UTL-MAILANALRPT-001
 * Purpose: Comprehensive Mail Analytics and Reporting Kit - Complete mail analytics and reporting toolkit for NestJS + Sequelize
 *
 * Upstream: Independent utility module for mail analytics and reporting operations
 * Downstream: ../backend/*, Mail services, Analytics controllers, Reporting services, Dashboard services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize
 * Exports: 45 utility functions for analytics, reporting, metrics, dashboards, compliance, and performance tracking
 *
 * LLM Context: Enterprise-grade mail analytics and reporting utilities for White Cross healthcare platform.
 * Provides comprehensive analytics and reporting comparable to Microsoft Exchange Server analytics, including email
 * traffic analytics, user activity tracking, mailbox statistics, message volume reporting, delivery performance metrics,
 * spam detection rates, storage usage analytics, security incident reporting, compliance reports, custom report builder,
 * real-time dashboards, report scheduling and export, historical trend analysis, comparative analytics, and HIPAA-compliant
 * audit reporting with Sequelize models for metrics storage, scheduled reports, and dashboard configurations.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface MailAnalyticsMetric {
  id: string;
  metricType: 'traffic' | 'delivery' | 'storage' | 'spam' | 'security' | 'user-activity' | 'compliance';
  metricName: string;
  metricValue: number;
  metricUnit: string;
  timestamp: Date;
  userId?: string;
  organizationId?: string;
  mailboxId?: string;
  aggregationPeriod?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  dimensions?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
}

interface EmailTrafficMetrics {
  totalSent: number;
  totalReceived: number;
  totalInternal: number;
  totalExternal: number;
  totalInbound: number;
  totalOutbound: number;
  peakHourTraffic: number;
  averageMessagesPerHour: number;
  trafficByDomain: Record<string, number>;
  trafficByProtocol: Record<string, number>;
  period: DatePeriod;
}

interface DeliveryPerformanceMetrics {
  totalAttempted: number;
  totalDelivered: number;
  totalFailed: number;
  totalBounced: number;
  totalQueued: number;
  deliveryRate: number;
  bounceRate: number;
  averageDeliveryTime: number;
  failureReasons: Record<string, number>;
  deliveryByStatus: Record<string, number>;
  period: DatePeriod;
}

interface SpamDetectionMetrics {
  totalScanned: number;
  totalSpamDetected: number;
  totalHamDetected: number;
  totalQuarantined: number;
  spamRate: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  detectionByRule: Record<string, number>;
  detectionByScore: Record<string, number>;
  topSpamSenders: Array<{ sender: string; count: number }>;
  period: DatePeriod;
}

interface StorageUsageMetrics {
  totalStorageUsed: number;
  totalStorageQuota: number;
  storageUtilization: number;
  averageMessageSize: number;
  averageAttachmentSize: number;
  storageByMailbox: Array<{ mailboxId: string; userId: string; storageUsed: number }>;
  storageByFolder: Record<string, number>;
  storageGrowthRate: number;
  projectedFullDate?: Date;
  period: DatePeriod;
}

interface UserActivityMetrics {
  userId: string;
  totalMessagesSent: number;
  totalMessagesReceived: number;
  totalMessagesRead: number;
  totalMessagesDeleted: number;
  totalLoginSessions: number;
  averageSessionDuration: number;
  lastLoginDate?: Date;
  mostActiveHours: number[];
  deviceBreakdown: Record<string, number>;
  actionBreakdown: Record<string, number>;
  period: DatePeriod;
}

interface MailboxStatistics {
  mailboxId: string;
  userId: string;
  userEmail: string;
  totalMessages: number;
  unreadMessages: number;
  flaggedMessages: number;
  draftMessages: number;
  deletedMessages: number;
  totalFolders: number;
  totalAttachments: number;
  storageUsed: number;
  storageQuota: number;
  lastActivityDate?: Date;
  createdDate: Date;
}

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

interface ComplianceReport {
  id: string;
  reportType: 'hipaa' | 'gdpr' | 'retention' | 'encryption' | 'access-control' | 'audit-trail';
  generatedDate: Date;
  reportPeriod: DatePeriod;
  complianceScore: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warnings: number;
  violations: Array<{
    checkId: string;
    checkName: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affectedItems: number;
    remediation: string;
  }>;
  recommendations: string[];
  certifiedBy?: string;
  metadata?: Record<string, any>;
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
    position: { x: number; y: number; width: number; height: number };
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

interface AnalyticsQuery {
  metricTypes?: string[];
  userId?: string;
  organizationId?: string;
  mailboxId?: string;
  period: DatePeriod;
  aggregationLevel?: 'raw' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  groupBy?: string[];
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
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

interface TrendAnalysis {
  metricName: string;
  currentValue: number;
  previousValue: number;
  changePercent: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  prediction?: number;
  confidence?: number;
  anomalies: Array<{
    timestamp: Date;
    value: number;
    expectedValue: number;
    deviation: number;
  }>;
}

interface ComparativeAnalysis {
  metric: string;
  currentPeriod: DatePeriod;
  comparisonPeriod: DatePeriod;
  currentValue: number;
  comparisonValue: number;
  difference: number;
  percentageChange: number;
  trend: 'improving' | 'declining' | 'stable';
  breakdown: Record<string, { current: number; comparison: number; change: number }>;
}

interface MessageVolumeReport {
  totalMessages: number;
  sentMessages: number;
  receivedMessages: number;
  internalMessages: number;
  externalMessages: number;
  volumeByHour: Record<string, number>;
  volumeByDay: Record<string, number>;
  volumeByUser: Array<{ userId: string; userEmail: string; count: number }>;
  volumeByDomain: Record<string, number>;
  peakVolume: { timestamp: Date; count: number };
  averageVolume: number;
  period: DatePeriod;
}

interface SwaggerAnalyticsSchema {
  name: string;
  type: string;
  description: string;
  example: any;
  required?: boolean;
  properties?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES
// ============================================================================

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
export const getMailAnalyticsMetricModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  metricType: {
    type: 'ENUM',
    values: ['traffic', 'delivery', 'storage', 'spam', 'security', 'user-activity', 'compliance'],
    allowNull: false,
  },
  metricName: {
    type: 'STRING',
    allowNull: false,
    comment: 'Name of the specific metric being tracked',
  },
  metricValue: {
    type: 'DECIMAL(20, 2)',
    allowNull: false,
    comment: 'Numeric value of the metric',
  },
  metricUnit: {
    type: 'STRING',
    allowNull: false,
    comment: 'Unit of measurement (count, bytes, milliseconds, etc.)',
  },
  timestamp: {
    type: 'DATE',
    allowNull: false,
    comment: 'Timestamp when metric was recorded',
  },
  userId: {
    type: 'UUID',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  organizationId: {
    type: 'UUID',
    allowNull: true,
    references: {
      model: 'organizations',
      key: 'id',
    },
  },
  mailboxId: {
    type: 'UUID',
    allowNull: true,
    comment: 'Associated mailbox identifier',
  },
  aggregationPeriod: {
    type: 'ENUM',
    values: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
    allowNull: true,
    comment: 'Time period for metric aggregation',
  },
  dimensions: {
    type: 'JSONB',
    allowNull: true,
    defaultValue: {},
    comment: 'Additional dimensional data for slicing metrics',
  },
  metadata: {
    type: 'JSONB',
    allowNull: true,
    defaultValue: {},
    comment: 'Additional metadata about the metric',
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
    defaultValue: 'NOW',
  },
});

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
export const getScheduledReportModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  reportName: {
    type: 'STRING',
    allowNull: false,
    comment: 'Name of the scheduled report',
  },
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  createdBy: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  organizationId: {
    type: 'UUID',
    allowNull: true,
    references: {
      model: 'organizations',
      key: 'id',
    },
  },
  reportType: {
    type: 'ENUM',
    values: ['traffic', 'delivery', 'user-activity', 'security', 'compliance', 'custom'],
    allowNull: false,
  },
  dataSource: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: [],
    comment: 'Data sources for the report',
  },
  metrics: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: [],
    comment: 'Metrics to include in the report',
  },
  filters: {
    type: 'JSONB',
    allowNull: true,
    defaultValue: {},
    comment: 'Filters to apply to the report data',
  },
  groupBy: {
    type: 'JSONB',
    allowNull: true,
    defaultValue: [],
    comment: 'Fields to group by',
  },
  sortBy: {
    type: 'STRING',
    allowNull: true,
  },
  sortOrder: {
    type: 'ENUM',
    values: ['asc', 'desc'],
    allowNull: true,
    defaultValue: 'desc',
  },
  limit: {
    type: 'INTEGER',
    allowNull: true,
  },
  schedule: {
    type: 'JSONB',
    allowNull: true,
    comment: 'Schedule configuration for automatic report generation',
  },
  outputFormat: {
    type: 'ENUM',
    values: ['json', 'csv', 'pdf', 'excel'],
    allowNull: false,
    defaultValue: 'pdf',
  },
  recipients: {
    type: 'JSONB',
    allowNull: true,
    defaultValue: [],
    comment: 'Email recipients for the report',
  },
  isActive: {
    type: 'BOOLEAN',
    allowNull: false,
    defaultValue: true,
  },
  lastRun: {
    type: 'DATE',
    allowNull: true,
    comment: 'Last execution timestamp',
  },
  nextRun: {
    type: 'DATE',
    allowNull: true,
    comment: 'Next scheduled execution timestamp',
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
    defaultValue: 'NOW',
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
    defaultValue: 'NOW',
  },
});

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
export const getDashboardConfigurationModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  dashboardName: {
    type: 'STRING',
    allowNull: false,
    comment: 'Name of the dashboard',
  },
  description: {
    type: 'TEXT',
    allowNull: true,
  },
  createdBy: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  organizationId: {
    type: 'UUID',
    allowNull: true,
    references: {
      model: 'organizations',
      key: 'id',
    },
  },
  isPublic: {
    type: 'BOOLEAN',
    allowNull: false,
    defaultValue: false,
    comment: 'Whether dashboard is accessible to all users in organization',
  },
  widgets: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: [],
    comment: 'Widget configurations for the dashboard',
  },
  refreshInterval: {
    type: 'INTEGER',
    allowNull: false,
    defaultValue: 300,
    comment: 'Auto-refresh interval in seconds',
  },
  isActive: {
    type: 'BOOLEAN',
    allowNull: false,
    defaultValue: true,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
    defaultValue: 'NOW',
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
    defaultValue: 'NOW',
  },
});

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
export const getSecurityIncidentModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  incidentType: {
    type: 'ENUM',
    values: ['phishing', 'malware', 'spoofing', 'unauthorized-access', 'data-exfiltration', 'suspicious-activity'],
    allowNull: false,
  },
  severity: {
    type: 'ENUM',
    values: ['low', 'medium', 'high', 'critical'],
    allowNull: false,
  },
  detectionDate: {
    type: 'DATE',
    allowNull: false,
    comment: 'When the incident was detected',
  },
  affectedUsers: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: [],
    comment: 'User IDs affected by the incident',
  },
  affectedMessages: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: [],
    comment: 'Message IDs involved in the incident',
  },
  sourceIp: {
    type: 'INET',
    allowNull: true,
    comment: 'Source IP address if applicable',
  },
  sourceEmail: {
    type: 'STRING',
    allowNull: true,
    comment: 'Source email address if applicable',
  },
  destinationEmail: {
    type: 'STRING',
    allowNull: true,
    comment: 'Destination email address if applicable',
  },
  indicators: {
    type: 'JSONB',
    allowNull: true,
    defaultValue: {},
    comment: 'Indicators of compromise or suspicious patterns',
  },
  mitigationStatus: {
    type: 'ENUM',
    values: ['detected', 'investigating', 'mitigated', 'resolved'],
    allowNull: false,
    defaultValue: 'detected',
  },
  mitigationActions: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: [],
    comment: 'Actions taken to mitigate the incident',
  },
  assignedTo: {
    type: 'UUID',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'Security analyst assigned to the incident',
  },
  notes: {
    type: 'TEXT',
    allowNull: true,
  },
  resolvedAt: {
    type: 'DATE',
    allowNull: true,
    comment: 'When the incident was resolved',
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
    defaultValue: 'NOW',
  },
});

// ============================================================================
// EMAIL TRAFFIC ANALYTICS
// ============================================================================

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
export const getEmailTrafficMetrics = (
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    query: {
      where: {
        timestamp: {
          $gte: period.startDate,
          $lte: period.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'traffic',
      },
    },
    aggregations: [
      { name: 'totalSent', field: 'metricValue', aggregation: 'sum', filter: { metricName: 'sent' } },
      { name: 'totalReceived', field: 'metricValue', aggregation: 'sum', filter: { metricName: 'received' } },
      { name: 'totalInternal', field: 'metricValue', aggregation: 'sum', filter: { metricName: 'internal' } },
      { name: 'totalExternal', field: 'metricValue', aggregation: 'sum', filter: { metricName: 'external' } },
      { name: 'peakHourTraffic', field: 'metricValue', aggregation: 'max' },
      { name: 'averageMessagesPerHour', field: 'metricValue', aggregation: 'avg' },
    ],
    groupBy: ['dimensions.domain', 'dimensions.protocol'],
  };
};

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
export const getRealtimeTrafficMetrics = (
  minutes: number = 60,
  organizationId?: string
): Record<string, any> => {
  const startDate = new Date(Date.now() - minutes * 60 * 1000);

  return {
    where: {
      timestamp: {
        $gte: startDate,
      },
      ...(organizationId && { organizationId }),
      metricType: 'traffic',
      aggregationPeriod: 'hourly',
    },
    order: [['timestamp', 'DESC']],
    limit: minutes,
  };
};

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
export const analyzeTrafficPatternsByHour = (
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    where: {
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      ...(organizationId && { organizationId }),
      metricType: 'traffic',
    },
    attributes: [
      ['EXTRACT(HOUR FROM timestamp)', 'hour'],
      ['SUM(metricValue)', 'totalVolume'],
      ['AVG(metricValue)', 'averageVolume'],
    ],
    group: ['EXTRACT(HOUR FROM timestamp)'],
    order: [['totalVolume', 'DESC']],
  };
};

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
export const getTrafficByDomain = (
  period: DatePeriod,
  topN: number = 10
): Record<string, any> => {
  return {
    where: {
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      metricType: 'traffic',
      'dimensions.domain': {
        $ne: null,
      },
    },
    attributes: [
      ['dimensions->>\'domain\'', 'domain'],
      ['SUM(metricValue)', 'totalMessages'],
      ['SUM(CASE WHEN metricName = \'sent\' THEN metricValue ELSE 0 END)', 'sentMessages'],
      ['SUM(CASE WHEN metricName = \'received\' THEN metricValue ELSE 0 END)', 'receivedMessages'],
    ],
    group: ['dimensions->>\'domain\''],
    order: [['totalMessages', 'DESC']],
    limit: topN,
  };
};

// ============================================================================
// USER ACTIVITY TRACKING
// ============================================================================

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
export const getUserActivityMetrics = (
  userId: string,
  period: DatePeriod
): Record<string, any> => {
  return {
    where: {
      userId,
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      metricType: 'user-activity',
    },
    attributes: [
      ['SUM(CASE WHEN metricName = \'messages_sent\' THEN metricValue ELSE 0 END)', 'totalMessagesSent'],
      ['SUM(CASE WHEN metricName = \'messages_received\' THEN metricValue ELSE 0 END)', 'totalMessagesReceived'],
      ['SUM(CASE WHEN metricName = \'messages_read\' THEN metricValue ELSE 0 END)', 'totalMessagesRead'],
      ['SUM(CASE WHEN metricName = \'messages_deleted\' THEN metricValue ELSE 0 END)', 'totalMessagesDeleted'],
      ['SUM(CASE WHEN metricName = \'login_sessions\' THEN metricValue ELSE 0 END)', 'totalLoginSessions'],
      ['AVG(CASE WHEN metricName = \'session_duration\' THEN metricValue ELSE NULL END)', 'averageSessionDuration'],
    ],
  };
};

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
export const getMostActiveUsers = (
  period: DatePeriod,
  metricName: string,
  topN: number = 10,
  organizationId?: string
): Record<string, any> => {
  return {
    where: {
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      metricType: 'user-activity',
      metricName,
      ...(organizationId && { organizationId }),
    },
    attributes: [
      'userId',
      ['SUM(metricValue)', 'totalActivity'],
    ],
    include: [
      {
        model: 'User',
        as: 'user',
        attributes: ['email', 'firstName', 'lastName'],
      },
    ],
    group: ['userId', 'user.id'],
    order: [['totalActivity', 'DESC']],
    limit: topN,
  };
};

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
export const analyzeUserActivityPatterns = (
  userId: string,
  period: DatePeriod
): Record<string, any> => {
  return {
    where: {
      userId,
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      metricType: 'user-activity',
    },
    attributes: [
      ['EXTRACT(DOW FROM timestamp)', 'dayOfWeek'],
      ['EXTRACT(HOUR FROM timestamp)', 'hourOfDay'],
      ['SUM(metricValue)', 'totalActivity'],
      ['COUNT(*)', 'eventCount'],
    ],
    group: ['EXTRACT(DOW FROM timestamp)', 'EXTRACT(HOUR FROM timestamp)'],
    order: [['totalActivity', 'DESC']],
  };
};

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
export const trackUserEngagement = (
  userId: string,
  period: DatePeriod
): Record<string, any> => {
  return {
    where: {
      userId,
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      metricType: 'user-activity',
    },
    attributes: [
      ['COUNT(DISTINCT DATE(timestamp))', 'activeDays'],
      ['AVG(CASE WHEN metricName = \'session_duration\' THEN metricValue END)', 'avgSessionDuration'],
      ['SUM(metricValue)', 'totalActions'],
      ['MAX(timestamp)', 'lastActivityDate'],
    ],
  };
};

// ============================================================================
// MAILBOX STATISTICS
// ============================================================================

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
export const getMailboxStatistics = (
  mailboxId: string,
  userId: string
): Record<string, any> => {
  return {
    mailboxQuery: {
      where: { id: mailboxId, userId },
    },
    messageStats: {
      where: { mailboxId, userId, isDeleted: false },
      attributes: [
        ['COUNT(*)', 'totalMessages'],
        ['SUM(CASE WHEN isRead = false THEN 1 ELSE 0 END)', 'unreadMessages'],
        ['SUM(CASE WHEN isFlagged = true THEN 1 ELSE 0 END)', 'flaggedMessages'],
        ['SUM(CASE WHEN isDraft = true THEN 1 ELSE 0 END)', 'draftMessages'],
        ['SUM(size)', 'totalSize'],
        ['MAX(receivedDateTime)', 'lastActivityDate'],
      ],
    },
    attachmentStats: {
      where: { mailboxId },
      attributes: [
        ['COUNT(*)', 'totalAttachments'],
        ['SUM(size)', 'attachmentSize'],
      ],
    },
    folderStats: {
      where: { userId },
      attributes: [
        ['COUNT(*)', 'totalFolders'],
      ],
    },
  };
};

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
export const getOrganizationMailboxStatistics = (
  organizationId: string,
  options: { includeInactive?: boolean; limit?: number } = {}
): Record<string, any> => {
  return {
    where: {
      organizationId,
      ...(options.includeInactive === false && { isActive: true }),
    },
    attributes: [
      'userId',
      'mailboxId',
      ['SUM(CASE WHEN metricName = \'total_messages\' THEN metricValue END)', 'totalMessages'],
      ['SUM(CASE WHEN metricName = \'unread_messages\' THEN metricValue END)', 'unreadMessages'],
      ['SUM(CASE WHEN metricName = \'storage_used\' THEN metricValue END)', 'storageUsed'],
    ],
    include: [
      {
        model: 'User',
        as: 'user',
        attributes: ['email', 'firstName', 'lastName'],
      },
    ],
    group: ['userId', 'mailboxId', 'user.id'],
    order: [['storageUsed', 'DESC']],
    limit: options.limit || 100,
  };
};

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
export const calculateMailboxGrowth = (
  mailboxId: string,
  period: DatePeriod
): Record<string, any> => {
  return {
    where: {
      mailboxId,
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      metricName: {
        $in: ['total_messages', 'storage_used'],
      },
    },
    attributes: [
      'metricName',
      ['MIN(metricValue)', 'startValue'],
      ['MAX(metricValue)', 'endValue'],
      ['MAX(metricValue) - MIN(metricValue)', 'growth'],
      ['(MAX(metricValue) - MIN(metricValue)) / NULLIF(MIN(metricValue), 0) * 100', 'growthPercentage'],
    ],
    group: ['metricName'],
  };
};

// ============================================================================
// MESSAGE VOLUME REPORTING
// ============================================================================

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
export const generateMessageVolumeReport = (
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    totalQuery: {
      where: {
        timestamp: {
          $gte: period.startDate,
          $lte: period.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'traffic',
      },
      attributes: [
        ['SUM(CASE WHEN metricName = \'sent\' THEN metricValue ELSE 0 END)', 'sentMessages'],
        ['SUM(CASE WHEN metricName = \'received\' THEN metricValue ELSE 0 END)', 'receivedMessages'],
        ['SUM(CASE WHEN metricName = \'internal\' THEN metricValue ELSE 0 END)', 'internalMessages'],
        ['SUM(CASE WHEN metricName = \'external\' THEN metricValue ELSE 0 END)', 'externalMessages'],
        ['AVG(metricValue)', 'averageVolume'],
      ],
    },
    hourlyBreakdown: {
      where: {
        timestamp: {
          $gte: period.startDate,
          $lte: period.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'traffic',
      },
      attributes: [
        ['EXTRACT(HOUR FROM timestamp)', 'hour'],
        ['SUM(metricValue)', 'volume'],
      ],
      group: ['EXTRACT(HOUR FROM timestamp)'],
    },
    userBreakdown: {
      where: {
        timestamp: {
          $gte: period.startDate,
          $lte: period.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'traffic',
      },
      attributes: [
        'userId',
        ['SUM(metricValue)', 'count'],
      ],
      include: [
        {
          model: 'User',
          as: 'user',
          attributes: ['email'],
        },
      ],
      group: ['userId', 'user.id'],
      order: [['count', 'DESC']],
      limit: 50,
    },
  };
};

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
export const analyzeMessageVolumeTrends = (
  metricName: string,
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  const midpoint = new Date((period.startDate.getTime() + period.endDate.getTime()) / 2);

  return {
    currentPeriod: {
      where: {
        timestamp: {
          $gte: midpoint,
          $lte: period.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'traffic',
        metricName,
      },
      attributes: [
        ['SUM(metricValue)', 'currentValue'],
        ['AVG(metricValue)', 'currentAverage'],
        ['STDDEV(metricValue)', 'currentStdDev'],
      ],
    },
    previousPeriod: {
      where: {
        timestamp: {
          $gte: period.startDate,
          $lt: midpoint,
        },
        ...(organizationId && { organizationId }),
        metricType: 'traffic',
        metricName,
      },
      attributes: [
        ['SUM(metricValue)', 'previousValue'],
        ['AVG(metricValue)', 'previousAverage'],
        ['STDDEV(metricValue)', 'previousStdDev'],
      ],
    },
    anomalies: {
      where: {
        timestamp: {
          $gte: period.startDate,
          $lte: period.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'traffic',
        metricName,
      },
      having: {
        metricValue: {
          $or: [
            { $gt: 'AVG(metricValue) + 2 * STDDEV(metricValue)' },
            { $lt: 'AVG(metricValue) - 2 * STDDEV(metricValue)' },
          ],
        },
      },
    },
  };
};

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
export const compareMessageVolumePeriods = (
  currentPeriod: DatePeriod,
  comparisonPeriod: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    current: {
      where: {
        timestamp: {
          $gte: currentPeriod.startDate,
          $lte: currentPeriod.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'traffic',
      },
      attributes: [
        'metricName',
        ['SUM(metricValue)', 'currentValue'],
      ],
      group: ['metricName'],
    },
    comparison: {
      where: {
        timestamp: {
          $gte: comparisonPeriod.startDate,
          $lte: comparisonPeriod.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'traffic',
      },
      attributes: [
        'metricName',
        ['SUM(metricValue)', 'comparisonValue'],
      ],
      group: ['metricName'],
    },
  };
};

// ============================================================================
// DELIVERY PERFORMANCE METRICS
// ============================================================================

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
export const getDeliveryPerformanceMetrics = (
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    where: {
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      ...(organizationId && { organizationId }),
      metricType: 'delivery',
    },
    attributes: [
      ['SUM(CASE WHEN metricName = \'attempted\' THEN metricValue ELSE 0 END)', 'totalAttempted'],
      ['SUM(CASE WHEN metricName = \'delivered\' THEN metricValue ELSE 0 END)', 'totalDelivered'],
      ['SUM(CASE WHEN metricName = \'failed\' THEN metricValue ELSE 0 END)', 'totalFailed'],
      ['SUM(CASE WHEN metricName = \'bounced\' THEN metricValue ELSE 0 END)', 'totalBounced'],
      ['SUM(CASE WHEN metricName = \'queued\' THEN metricValue ELSE 0 END)', 'totalQueued'],
      ['AVG(CASE WHEN metricName = \'delivery_time\' THEN metricValue END)', 'averageDeliveryTime'],
    ],
  };
};

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
export const analyzeDeliveryFailures = (
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    where: {
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      ...(organizationId && { organizationId }),
      metricType: 'delivery',
      metricName: {
        $in: ['failed', 'bounced'],
      },
    },
    attributes: [
      ['dimensions->>\'reason\'', 'failureReason'],
      ['SUM(metricValue)', 'failureCount'],
      ['dimensions->>\'status_code\'', 'statusCode'],
    ],
    group: ['dimensions->>\'reason\'', 'dimensions->>\'status_code\''],
    order: [['failureCount', 'DESC']],
  };
};

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
export const getDeliveryTimePercentiles = (
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    where: {
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      ...(organizationId && { organizationId }),
      metricType: 'delivery',
      metricName: 'delivery_time',
    },
    attributes: [
      ['PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY metricValue)', 'p50'],
      ['PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY metricValue)', 'p75'],
      ['PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY metricValue)', 'p90'],
      ['PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY metricValue)', 'p95'],
      ['PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY metricValue)', 'p99'],
      ['MIN(metricValue)', 'min'],
      ['MAX(metricValue)', 'max'],
      ['AVG(metricValue)', 'avg'],
    ],
  };
};

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
export const monitorBounceRatesByDomain = (
  period: DatePeriod,
  topN: number = 20
): Record<string, any> => {
  return {
    where: {
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      metricType: 'delivery',
      'dimensions.domain': {
        $ne: null,
      },
    },
    attributes: [
      ['dimensions->>\'domain\'', 'domain'],
      ['SUM(CASE WHEN metricName = \'bounced\' THEN metricValue ELSE 0 END)', 'bounced'],
      ['SUM(CASE WHEN metricName = \'delivered\' THEN metricValue ELSE 0 END)', 'delivered'],
      ['SUM(metricValue)', 'totalAttempted'],
      ['SUM(CASE WHEN metricName = \'bounced\' THEN metricValue ELSE 0 END) * 100.0 / NULLIF(SUM(metricValue), 0)', 'bounceRate'],
    ],
    group: ['dimensions->>\'domain\''],
    having: {
      totalAttempted: {
        $gte: 10,
      },
    },
    order: [['bounceRate', 'DESC']],
    limit: topN,
  };
};

// ============================================================================
// SPAM DETECTION METRICS
// ============================================================================

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
export const getSpamDetectionMetrics = (
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    where: {
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      ...(organizationId && { organizationId }),
      metricType: 'spam',
    },
    attributes: [
      ['SUM(CASE WHEN metricName = \'scanned\' THEN metricValue ELSE 0 END)', 'totalScanned'],
      ['SUM(CASE WHEN metricName = \'spam_detected\' THEN metricValue ELSE 0 END)', 'totalSpamDetected'],
      ['SUM(CASE WHEN metricName = \'ham_detected\' THEN metricValue ELSE 0 END)', 'totalHamDetected'],
      ['SUM(CASE WHEN metricName = \'quarantined\' THEN metricValue ELSE 0 END)', 'totalQuarantined'],
      ['SUM(CASE WHEN metricName = \'false_positive\' THEN metricValue ELSE 0 END)', 'falsePositives'],
      ['SUM(CASE WHEN metricName = \'false_negative\' THEN metricValue ELSE 0 END)', 'falseNegatives'],
    ],
  };
};

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
export const analyzeSpamRuleEffectiveness = (
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    where: {
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      ...(organizationId && { organizationId }),
      metricType: 'spam',
      metricName: 'rule_triggered',
    },
    attributes: [
      ['dimensions->>\'rule_id\'', 'ruleId'],
      ['dimensions->>\'rule_name\'', 'ruleName'],
      ['SUM(metricValue)', 'triggerCount'],
      ['AVG((dimensions->>\'spam_score\')::decimal)', 'avgSpamScore'],
    ],
    group: ['dimensions->>\'rule_id\'', 'dimensions->>\'rule_name\''],
    order: [['triggerCount', 'DESC']],
  };
};

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
export const getTopSpamSenders = (
  period: DatePeriod,
  topN: number = 50,
  organizationId?: string
): Record<string, any> => {
  return {
    where: {
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      ...(organizationId && { organizationId }),
      metricType: 'spam',
      metricName: 'spam_detected',
      'dimensions.sender': {
        $ne: null,
      },
    },
    attributes: [
      ['dimensions->>\'sender\'', 'sender'],
      ['SUM(metricValue)', 'spamCount'],
      ['AVG((dimensions->>\'spam_score\')::decimal)', 'avgSpamScore'],
      ['COUNT(DISTINCT dimensions->>\'recipient\')', 'uniqueRecipients'],
    ],
    group: ['dimensions->>\'sender\''],
    order: [['spamCount', 'DESC']],
    limit: topN,
  };
};

// ============================================================================
// STORAGE USAGE ANALYTICS
// ============================================================================

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
export const getStorageUsageMetrics = (
  organizationId?: string
): Record<string, any> => {
  return {
    where: {
      ...(organizationId && { organizationId }),
      metricType: 'storage',
    },
    attributes: [
      ['SUM(CASE WHEN metricName = \'storage_used\' THEN metricValue ELSE 0 END)', 'totalStorageUsed'],
      ['SUM(CASE WHEN metricName = \'storage_quota\' THEN metricValue ELSE 0 END)', 'totalStorageQuota'],
      ['AVG(CASE WHEN metricName = \'message_size\' THEN metricValue END)', 'averageMessageSize'],
      ['AVG(CASE WHEN metricName = \'attachment_size\' THEN metricValue END)', 'averageAttachmentSize'],
    ],
  };
};

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
export const analyzeStorageByMailbox = (
  organizationId?: string,
  threshold: number = 80
): Record<string, any> => {
  return {
    where: {
      ...(organizationId && { organizationId }),
      metricType: 'storage',
      metricName: 'storage_used',
    },
    attributes: [
      'mailboxId',
      'userId',
      ['metricValue', 'storageUsed'],
      ['dimensions->>\'quota\'', 'quota'],
      ['metricValue * 100.0 / NULLIF((dimensions->>\'quota\')::decimal, 0)', 'utilizationPercent'],
    ],
    having: {
      utilizationPercent: {
        $gte: threshold,
      },
    },
    include: [
      {
        model: 'User',
        as: 'user',
        attributes: ['email', 'firstName', 'lastName'],
      },
    ],
    order: [['utilizationPercent', 'DESC']],
  };
};

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
export const projectStorageRequirements = (
  period: DatePeriod,
  projectionDays: number = 90,
  organizationId?: string
): Record<string, any> => {
  return {
    historicalData: {
      where: {
        timestamp: {
          $gte: period.startDate,
          $lte: period.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'storage',
        metricName: 'storage_used',
      },
      attributes: [
        ['DATE(timestamp)', 'date'],
        ['SUM(metricValue)', 'dailyStorage'],
      ],
      group: ['DATE(timestamp)'],
      order: [['date', 'ASC']],
    },
    currentStorage: {
      where: {
        ...(organizationId && { organizationId }),
        metricType: 'storage',
        metricName: 'storage_used',
      },
      attributes: [
        ['SUM(metricValue)', 'currentTotal'],
      ],
    },
    quota: {
      where: {
        ...(organizationId && { organizationId }),
        metricType: 'storage',
        metricName: 'storage_quota',
      },
      attributes: [
        ['SUM(metricValue)', 'totalQuota'],
      ],
    },
  };
};

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
export const analyzeStorageByFolder = (
  userId: string,
  mailboxId?: string
): Record<string, any> => {
  return {
    where: {
      userId,
      ...(mailboxId && { mailboxId }),
      metricType: 'storage',
      'dimensions.folder': {
        $ne: null,
      },
    },
    attributes: [
      ['dimensions->>\'folder\'', 'folderName'],
      ['SUM(CASE WHEN metricName = \'storage_used\' THEN metricValue ELSE 0 END)', 'storageUsed'],
      ['SUM(CASE WHEN metricName = \'message_count\' THEN metricValue ELSE 0 END)', 'messageCount'],
      ['AVG(CASE WHEN metricName = \'message_size\' THEN metricValue END)', 'avgMessageSize'],
    ],
    group: ['dimensions->>\'folder\''],
    order: [['storageUsed', 'DESC']],
  };
};

// ============================================================================
// SECURITY INCIDENT REPORTING
// ============================================================================

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
export const createSecurityIncident = (
  incident: Omit<SecurityIncidentReport, 'id' | 'createdAt'>
): Record<string, any> => {
  return {
    data: {
      id: crypto.randomUUID(),
      ...incident,
      createdAt: new Date(),
    },
  };
};

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
export const getSecurityIncidents = (filters: {
  incidentType?: string;
  severity?: string;
  mitigationStatus?: string;
  startDate?: Date;
  endDate?: Date;
  assignedTo?: string;
  limit?: number;
  offset?: number;
}): Record<string, any> => {
  const where: Record<string, any> = {};

  if (filters.incidentType) {
    where.incidentType = filters.incidentType;
  }

  if (filters.severity) {
    where.severity = filters.severity;
  }

  if (filters.mitigationStatus) {
    where.mitigationStatus = filters.mitigationStatus;
  }

  if (filters.assignedTo) {
    where.assignedTo = filters.assignedTo;
  }

  if (filters.startDate || filters.endDate) {
    where.detectionDate = {};
    if (filters.startDate) {
      where.detectionDate.$gte = filters.startDate;
    }
    if (filters.endDate) {
      where.detectionDate.$lte = filters.endDate;
    }
  }

  return {
    where,
    order: [['detectionDate', 'DESC']],
    limit: filters.limit || 50,
    offset: filters.offset || 0,
  };
};

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
export const getSecurityIncidentStatistics = (
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    where: {
      detectionDate: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
    },
    attributes: [
      'incidentType',
      'severity',
      ['COUNT(*)', 'count'],
      ['SUM(CASE WHEN mitigationStatus = \'resolved\' THEN 1 ELSE 0 END)', 'resolvedCount'],
      ['AVG(EXTRACT(EPOCH FROM (resolvedAt - detectionDate)) / 3600)', 'avgResolutionTimeHours'],
    ],
    group: ['incidentType', 'severity'],
    order: [['count', 'DESC']],
  };
};

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
export const updateSecurityIncident = (
  incidentId: string,
  updates: {
    mitigationStatus?: string;
    mitigationActions?: string[];
    assignedTo?: string;
    notes?: string;
    resolvedAt?: Date;
  }
): Record<string, any> => {
  return {
    where: { id: incidentId },
    data: updates,
  };
};

// ============================================================================
// COMPLIANCE REPORTING
// ============================================================================

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
export const generateHIPAAComplianceReport = (
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    reportMetadata: {
      id: crypto.randomUUID(),
      reportType: 'hipaa',
      generatedDate: new Date(),
      reportPeriod: period,
    },
    encryptionCheck: {
      where: {
        timestamp: {
          $gte: period.startDate,
          $lte: period.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'security',
        metricName: 'encryption_status',
      },
      attributes: [
        ['SUM(CASE WHEN dimensions->>\'encrypted\' = \'true\' THEN metricValue ELSE 0 END)', 'encryptedCount'],
        ['SUM(metricValue)', 'totalCount'],
        ['SUM(CASE WHEN dimensions->>\'encrypted\' = \'true\' THEN metricValue ELSE 0 END) * 100.0 / NULLIF(SUM(metricValue), 0)', 'encryptionRate'],
      ],
    },
    accessControlCheck: {
      where: {
        timestamp: {
          $gte: period.startDate,
          $lte: period.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'security',
        metricName: 'unauthorized_access_attempts',
      },
      attributes: [
        ['SUM(metricValue)', 'unauthorizedAttempts'],
      ],
    },
    auditTrailCheck: {
      where: {
        timestamp: {
          $gte: period.startDate,
          $lte: period.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'compliance',
        metricName: 'audit_log_entries',
      },
      attributes: [
        ['SUM(metricValue)', 'auditLogEntries'],
      ],
    },
  };
};

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
export const generateRetentionComplianceReport = (
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    reportMetadata: {
      id: crypto.randomUUID(),
      reportType: 'retention',
      generatedDate: new Date(),
      reportPeriod: period,
    },
    retentionPolicyCheck: {
      where: {
        ...(organizationId && { organizationId }),
        metricType: 'compliance',
        metricName: 'retention_policy_violations',
      },
      attributes: [
        ['dimensions->>\'policy_name\'', 'policyName'],
        ['SUM(metricValue)', 'violations'],
        ['dimensions->>\'retention_days\'', 'retentionDays'],
      ],
      group: ['dimensions->>\'policy_name\'', 'dimensions->>\'retention_days\''],
    },
    expiredMessagesCheck: {
      where: {
        timestamp: {
          $gte: period.startDate,
          $lte: period.endDate,
        },
        ...(organizationId && { organizationId }),
        metricType: 'compliance',
        metricName: 'expired_messages',
      },
      attributes: [
        ['SUM(CASE WHEN dimensions->>\'purged\' = \'true\' THEN metricValue ELSE 0 END)', 'purgedCount'],
        ['SUM(CASE WHEN dimensions->>\'purged\' = \'false\' THEN metricValue ELSE 0 END)', 'pendingPurge'],
      ],
    },
  };
};

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
export const trackComplianceMetrics = (
  complianceType: string,
  period: DatePeriod,
  organizationId?: string
): Record<string, any> => {
  return {
    where: {
      timestamp: {
        $gte: period.startDate,
        $lte: period.endDate,
      },
      ...(organizationId && { organizationId }),
      metricType: 'compliance',
      'dimensions.complianceType': complianceType,
    },
    attributes: [
      ['DATE(timestamp)', 'date'],
      'metricName',
      ['SUM(metricValue)', 'value'],
    ],
    group: ['DATE(timestamp)', 'metricName'],
    order: [['date', 'ASC']],
  };
};

// ============================================================================
// CUSTOM REPORT BUILDER
// ============================================================================

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
export const createCustomReport = (
  reportDef: Omit<CustomReportDefinition, 'id' | 'createdAt' | 'updatedAt'>
): Record<string, any> => {
  const now = new Date();
  return {
    data: {
      id: crypto.randomUUID(),
      ...reportDef,
      createdAt: now,
      updatedAt: now,
    },
  };
};

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
export const executeCustomReport = (
  reportId: string,
  period: DatePeriod
): Record<string, any> => {
  return {
    reportQuery: {
      where: { id: reportId },
    },
    executionParams: {
      period,
      executedAt: new Date(),
    },
  };
};

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
export const listCustomReports = (filters: {
  createdBy?: string;
  organizationId?: string;
  reportType?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}): Record<string, any> => {
  const where: Record<string, any> = {};

  if (filters.createdBy) {
    where.createdBy = filters.createdBy;
  }

  if (filters.organizationId) {
    where.organizationId = filters.organizationId;
  }

  if (filters.reportType) {
    where.reportType = filters.reportType;
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return {
    where,
    order: [['createdAt', 'DESC']],
    limit: filters.limit || 50,
    offset: filters.offset || 0,
  };
};

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
export const updateCustomReport = (
  reportId: string,
  updates: Partial<CustomReportDefinition>
): Record<string, any> => {
  return {
    where: { id: reportId },
    data: {
      ...updates,
      updatedAt: new Date(),
    },
  };
};

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
export const deleteCustomReport = (reportId: string): Record<string, any> => {
  return {
    where: { id: reportId },
  };
};

// ============================================================================
// DASHBOARD CONFIGURATION
// ============================================================================

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
export const createDashboard = (
  dashboard: Omit<DashboardConfiguration, 'id' | 'createdAt' | 'updatedAt'>
): Record<string, any> => {
  const now = new Date();
  return {
    data: {
      id: crypto.randomUUID(),
      ...dashboard,
      createdAt: now,
      updatedAt: now,
    },
  };
};

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
export const getDashboard = (
  dashboardId: string,
  userId: string
): Record<string, any> => {
  return {
    where: {
      id: dashboardId,
      $or: [
        { createdBy: userId },
        { isPublic: true },
      ],
    },
  };
};

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
export const listDashboards = (filters: {
  createdBy?: string;
  organizationId?: string;
  isPublic?: boolean;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}): Record<string, any> => {
  const where: Record<string, any> = {};

  if (filters.createdBy) {
    where.createdBy = filters.createdBy;
  }

  if (filters.organizationId) {
    where.organizationId = filters.organizationId;
  }

  if (filters.isPublic !== undefined) {
    where.isPublic = filters.isPublic;
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return {
    where,
    order: [['createdAt', 'DESC']],
    limit: filters.limit || 50,
    offset: filters.offset || 0,
  };
};

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
export const updateDashboard = (
  dashboardId: string,
  updates: Partial<DashboardConfiguration>
): Record<string, any> => {
  return {
    where: { id: dashboardId },
    data: {
      ...updates,
      updatedAt: new Date(),
    },
  };
};

// ============================================================================
// REPORT SCHEDULING AND EXPORT
// ============================================================================

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
export const scheduleReport = (
  reportId: string,
  schedule: ReportSchedule
): Record<string, any> => {
  const nextRun = calculateNextRunTime(schedule);

  return {
    where: { id: reportId },
    data: {
      schedule,
      nextRun,
      updatedAt: new Date(),
    },
  };
};

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
export const calculateNextRunTime = (schedule: ReportSchedule): Date => {
  const now = new Date();
  const next = new Date(now);

  switch (schedule.frequency) {
    case 'hourly':
      next.setHours(next.getHours() + (schedule.interval || 1));
      break;
    case 'daily':
      next.setDate(next.getDate() + (schedule.interval || 1));
      if (schedule.hour !== undefined) {
        next.setHours(schedule.hour);
      }
      if (schedule.minute !== undefined) {
        next.setMinutes(schedule.minute);
      }
      break;
    case 'weekly':
      const daysUntilNext = ((schedule.dayOfWeek || 0) - next.getDay() + 7) % 7 || 7;
      next.setDate(next.getDate() + daysUntilNext);
      if (schedule.hour !== undefined) {
        next.setHours(schedule.hour);
      }
      if (schedule.minute !== undefined) {
        next.setMinutes(schedule.minute);
      }
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + (schedule.interval || 1));
      if (schedule.dayOfMonth !== undefined) {
        next.setDate(schedule.dayOfMonth);
      }
      if (schedule.hour !== undefined) {
        next.setHours(schedule.hour);
      }
      if (schedule.minute !== undefined) {
        next.setMinutes(schedule.minute);
      }
      break;
  }

  return next;
};

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
export const exportReport = (
  reportData: any,
  options: ReportExportOptions
): Record<string, any> => {
  return {
    data: reportData,
    format: options.format,
    includeCharts: options.includeCharts || false,
    includeRawData: options.includeRawData || false,
    compression: options.compression || false,
    encryption: options.encryption,
    watermark: options.watermark,
    generatedAt: new Date(),
  };
};

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
export const getDueScheduledReports = (): Record<string, any> => {
  return {
    where: {
      isActive: true,
      'schedule.enabled': true,
      nextRun: {
        $lte: new Date(),
      },
    },
    order: [['nextRun', 'ASC']],
  };
};

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
export const markReportExecuted = (reportId: string): Record<string, any> => {
  return {
    where: { id: reportId },
    data: {
      lastRun: new Date(),
      nextRun: null, // Will be recalculated based on schedule
      updatedAt: new Date(),
    },
  };
};

// ============================================================================
// SWAGGER DOCUMENTATION
// ============================================================================

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
export const getMailAnalyticsMetricSwaggerSchema = (): SwaggerAnalyticsSchema => {
  return {
    name: 'MailAnalyticsMetric',
    type: 'object',
    description: 'Mail analytics metric entity',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      metricType: 'traffic',
      metricName: 'sent',
      metricValue: 1250,
      metricUnit: 'count',
      timestamp: '2024-01-15T10:00:00Z',
      userId: '123e4567-e89b-12d3-a456-426614174001',
      organizationId: '123e4567-e89b-12d3-a456-426614174002',
      aggregationPeriod: 'hourly',
      dimensions: { domain: 'example.com', protocol: 'smtp' },
    },
    properties: {
      id: { type: 'string', format: 'uuid' },
      metricType: { type: 'string', enum: ['traffic', 'delivery', 'storage', 'spam', 'security', 'user-activity', 'compliance'] },
      metricName: { type: 'string' },
      metricValue: { type: 'number' },
      metricUnit: { type: 'string' },
      timestamp: { type: 'string', format: 'date-time' },
      userId: { type: 'string', format: 'uuid' },
      organizationId: { type: 'string', format: 'uuid' },
      aggregationPeriod: { type: 'string', enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'] },
      dimensions: { type: 'object' },
    },
  };
};

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
export const getCustomReportSwaggerSchema = (): SwaggerAnalyticsSchema => {
  return {
    name: 'CustomReportDefinition',
    type: 'object',
    description: 'Custom report definition configuration',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      reportName: 'Weekly Traffic Summary',
      reportType: 'traffic',
      dataSource: ['mail_analytics_metrics'],
      metrics: [
        { metricName: 'total_sent', aggregation: 'sum', field: 'metricValue' },
      ],
      filters: { metricType: 'traffic' },
      groupBy: ['DATE(timestamp)'],
      outputFormat: 'pdf',
      isActive: true,
    },
    properties: {
      id: { type: 'string', format: 'uuid' },
      reportName: { type: 'string' },
      reportType: { type: 'string', enum: ['traffic', 'delivery', 'user-activity', 'security', 'compliance', 'custom'] },
      dataSource: { type: 'array', items: { type: 'string' } },
      metrics: { type: 'array' },
      filters: { type: 'object' },
      groupBy: { type: 'array', items: { type: 'string' } },
      outputFormat: { type: 'string', enum: ['json', 'csv', 'pdf', 'excel'] },
      isActive: { type: 'boolean' },
    },
  };
};

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
export const getDashboardSwaggerSchema = (): SwaggerAnalyticsSchema => {
  return {
    name: 'DashboardConfiguration',
    type: 'object',
    description: 'Dashboard configuration with widgets',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      dashboardName: 'Email Operations Dashboard',
      isPublic: true,
      widgets: [
        {
          widgetId: 'widget-1',
          widgetType: 'chart',
          title: 'Daily Message Volume',
          dataSource: 'traffic-metrics',
          position: { x: 0, y: 0, width: 6, height: 4 },
        },
      ],
      refreshInterval: 300,
      isActive: true,
    },
    properties: {
      id: { type: 'string', format: 'uuid' },
      dashboardName: { type: 'string' },
      isPublic: { type: 'boolean' },
      widgets: { type: 'array' },
      refreshInterval: { type: 'number' },
      isActive: { type: 'boolean' },
    },
  };
};

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
export const getSecurityIncidentSwaggerSchema = (): SwaggerAnalyticsSchema => {
  return {
    name: 'SecurityIncidentReport',
    type: 'object',
    description: 'Security incident report entity',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      incidentType: 'phishing',
      severity: 'high',
      detectionDate: '2024-01-15T10:30:00Z',
      affectedUsers: ['user-123'],
      affectedMessages: ['msg-456'],
      mitigationStatus: 'mitigated',
      mitigationActions: ['Quarantined messages', 'Blocked sender'],
    },
    properties: {
      id: { type: 'string', format: 'uuid' },
      incidentType: { type: 'string', enum: ['phishing', 'malware', 'spoofing', 'unauthorized-access', 'data-exfiltration', 'suspicious-activity'] },
      severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
      detectionDate: { type: 'string', format: 'date-time' },
      affectedUsers: { type: 'array', items: { type: 'string' } },
      affectedMessages: { type: 'array', items: { type: 'string' } },
      mitigationStatus: { type: 'string', enum: ['detected', 'investigating', 'mitigated', 'resolved'] },
      mitigationActions: { type: 'array', items: { type: 'string' } },
    },
  };
};

export default {
  // Sequelize Models
  getMailAnalyticsMetricModelAttributes,
  getScheduledReportModelAttributes,
  getDashboardConfigurationModelAttributes,
  getSecurityIncidentModelAttributes,

  // Email Traffic Analytics
  getEmailTrafficMetrics,
  getRealtimeTrafficMetrics,
  analyzeTrafficPatternsByHour,
  getTrafficByDomain,

  // User Activity Tracking
  getUserActivityMetrics,
  getMostActiveUsers,
  analyzeUserActivityPatterns,
  trackUserEngagement,

  // Mailbox Statistics
  getMailboxStatistics,
  getOrganizationMailboxStatistics,
  calculateMailboxGrowth,

  // Message Volume Reporting
  generateMessageVolumeReport,
  analyzeMessageVolumeTrends,
  compareMessageVolumePeriods,

  // Delivery Performance Metrics
  getDeliveryPerformanceMetrics,
  analyzeDeliveryFailures,
  getDeliveryTimePercentiles,
  monitorBounceRatesByDomain,

  // Spam Detection Metrics
  getSpamDetectionMetrics,
  analyzeSpamRuleEffectiveness,
  getTopSpamSenders,

  // Storage Usage Analytics
  getStorageUsageMetrics,
  analyzeStorageByMailbox,
  projectStorageRequirements,
  analyzeStorageByFolder,

  // Security Incident Reporting
  createSecurityIncident,
  getSecurityIncidents,
  getSecurityIncidentStatistics,
  updateSecurityIncident,

  // Compliance Reporting
  generateHIPAAComplianceReport,
  generateRetentionComplianceReport,
  trackComplianceMetrics,

  // Custom Report Builder
  createCustomReport,
  executeCustomReport,
  listCustomReports,
  updateCustomReport,
  deleteCustomReport,

  // Dashboard Configuration
  createDashboard,
  getDashboard,
  listDashboards,
  updateDashboard,

  // Report Scheduling and Export
  scheduleReport,
  calculateNextRunTime,
  exportReport,
  getDueScheduledReports,
  markReportExecuted,

  // Swagger Documentation
  getMailAnalyticsMetricSwaggerSchema,
  getCustomReportSwaggerSchema,
  getDashboardSwaggerSchema,
  getSecurityIncidentSwaggerSchema,
};
