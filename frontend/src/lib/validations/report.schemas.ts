/**
 * Analytics and Report Validation Schemas
 */

import { z } from 'zod';

/**
 * Date range schema
 */
export const dateRangeSchema = z.object({
  start: z.date().or(z.string().transform((val) => new Date(val))),
  end: z.date().or(z.string().transform((val) => new Date(val))),
});

/**
 * Time granularity
 */
export const timeGranularitySchema = z.enum([
  'hour',
  'day',
  'week',
  'month',
  'quarter',
  'year',
]);

/**
 * Report type
 */
export const reportTypeSchema = z.enum([
  'health-metrics',
  'medication-compliance',
  'appointment-analytics',
  'incident-trends',
  'inventory-analytics',
  'custom',
]);

/**
 * Export format
 */
export const exportFormatSchema = z.enum(['csv', 'excel', 'pdf', 'json']);

/**
 * Chart type
 */
export const chartTypeSchema = z.enum([
  'line',
  'bar',
  'area',
  'pie',
  'scatter',
  'radar',
  'composed',
]);

/**
 * Report filter schema
 */
export const reportFilterSchema = z.object({
  dateRange: dateRangeSchema,
  studentIds: z.array(z.string().uuid()).optional(),
  categories: z.array(z.string()).optional(),
  statuses: z.array(z.string()).optional(),
  types: z.array(z.string()).optional(),
  severities: z.array(z.string()).optional(),
  schoolIds: z.array(z.string().uuid()).optional(),
  gradelevels: z.array(z.string()).optional(),
});

/**
 * Custom report configuration
 */
export const customReportConfigSchema = z.object({
  name: z.string().min(1, 'Report name is required').max(100),
  description: z.string().max(500).optional(),
  reportType: reportTypeSchema,
  filters: reportFilterSchema,
  metrics: z.array(
    z.object({
      field: z.string(),
      aggregation: z.enum(['count', 'sum', 'avg', 'min', 'max', 'median']),
      label: z.string(),
    })
  ),
  groupBy: z.array(z.string()).optional(),
  chartType: chartTypeSchema,
  timeGranularity: timeGranularitySchema.optional(),
  isPublic: z.boolean().default(false),
  schedule: z
    .object({
      enabled: z.boolean(),
      frequency: z.enum(['daily', 'weekly', 'monthly']),
      time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      recipients: z.array(z.string().email()),
    })
    .optional(),
});

/**
 * Report request schema
 */
export const reportRequestSchema = z.object({
  reportType: reportTypeSchema,
  filters: reportFilterSchema,
  exportFormat: exportFormatSchema.optional(),
  includeCharts: z.boolean().default(true),
  includeRawData: z.boolean().default(false),
});

/**
 * Health metrics report schema
 */
export const healthMetricsReportSchema = reportRequestSchema.extend({
  reportType: z.literal('health-metrics'),
  metricTypes: z.array(z.string()).optional(),
  compareWithPrevious: z.boolean().default(false),
});

/**
 * Medication compliance report schema
 */
export const medicationComplianceReportSchema = reportRequestSchema.extend({
  reportType: z.literal('medication-compliance'),
  medicationIds: z.array(z.string().uuid()).optional(),
  includeAdministrationLog: z.boolean().default(false),
  groupByStudent: z.boolean().default(false),
});

/**
 * Appointment analytics report schema
 */
export const appointmentAnalyticsReportSchema = reportRequestSchema.extend({
  reportType: z.literal('appointment-analytics'),
  appointmentTypes: z.array(z.string()).optional(),
  includeNoShows: z.boolean().default(true),
  includeCancellations: z.boolean().default(true),
});

/**
 * Incident trends report schema
 */
export const incidentTrendsReportSchema = reportRequestSchema.extend({
  reportType: z.literal('incident-trends'),
  incidentTypes: z.array(z.string()).optional(),
  severityLevels: z.array(z.string()).optional(),
  includeTrends: z.boolean().default(true),
  includeHotspots: z.boolean().default(false),
});

/**
 * Inventory analytics report schema
 */
export const inventoryAnalyticsReportSchema = reportRequestSchema.extend({
  reportType: z.literal('inventory-analytics'),
  categories: z.array(z.string()).optional(),
  includeLowStock: z.boolean().default(true),
  includeExpiring: z.boolean().default(true),
  daysUntilExpiration: z.number().min(1).max(365).default(30),
});

/**
 * Dashboard widget schema
 */
export const dashboardWidgetSchema = z.object({
  id: z.string(),
  type: z.enum([
    'stat',
    'chart',
    'table',
    'list',
    'progress',
    'activity',
    'calendar',
  ]),
  title: z.string(),
  position: z.object({
    x: z.number().min(0),
    y: z.number().min(0),
    w: z.number().min(1).max(12),
    h: z.number().min(1),
  }),
  config: z.record(z.string(), z.any()),
  refreshInterval: z.number().min(0).optional(),
});

/**
 * Dashboard configuration schema
 */
export const dashboardConfigSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  widgets: z.array(dashboardWidgetSchema),
  isDefault: z.boolean().default(false),
  isPublic: z.boolean().default(false),
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
});

/**
 * Analytics query schema
 */
export const analyticsQuerySchema = z.object({
  metric: z.string(),
  dimensions: z.array(z.string()).optional(),
  filters: z.record(z.string(), z.any()).optional(),
  dateRange: dateRangeSchema,
  granularity: timeGranularitySchema.optional(),
  limit: z.number().min(1).max(1000).optional(),
  offset: z.number().min(0).optional(),
});

/**
 * Comparison report schema
 */
export const comparisonReportSchema = z.object({
  primaryDateRange: dateRangeSchema,
  comparisonDateRange: dateRangeSchema,
  metrics: z.array(z.string()),
  groupBy: z.string().optional(),
});

/**
 * Trend analysis schema
 */
export const trendAnalysisSchema = z.object({
  metric: z.string(),
  dateRange: dateRangeSchema,
  granularity: timeGranularitySchema,
  includeMovingAverage: z.boolean().default(false),
  movingAveragePeriod: z.number().min(2).max(30).optional(),
  includeForecast: z.boolean().default(false),
  forecastPeriods: z.number().min(1).max(12).optional(),
});

/**
 * Export request schema
 */
export const exportRequestSchema = z.object({
  reportId: z.string().uuid().optional(),
  reportConfig: customReportConfigSchema.optional(),
  format: exportFormatSchema,
  filename: z.string().optional(),
  includeMetadata: z.boolean().default(true),
  compressionEnabled: z.boolean().default(false),
});

/**
 * Scheduled report schema
 */
export const scheduledReportSchema = z.object({
  name: z.string().min(1).max(100),
  reportConfig: customReportConfigSchema,
  schedule: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
    dayOfWeek: z.number().min(0).max(6).optional(),
    dayOfMonth: z.number().min(1).max(31).optional(),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  }),
  recipients: z.array(
    z.object({
      email: z.string().email(),
      name: z.string().optional(),
    })
  ),
  format: exportFormatSchema,
  enabled: z.boolean().default(true),
  nextRunAt: z.date().or(z.string().transform((val) => new Date(val))).optional(),
});

/**
 * Report template schema
 */
export const reportTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.string(),
  config: customReportConfigSchema,
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
  thumbnailUrl: z.string().url().optional(),
});

/**
 * Type exports
 */
export type DateRange = z.infer<typeof dateRangeSchema>;
export type TimeGranularity = z.infer<typeof timeGranularitySchema>;
export type ReportType = z.infer<typeof reportTypeSchema>;
export type ExportFormat = z.infer<typeof exportFormatSchema>;
export type ChartType = z.infer<typeof chartTypeSchema>;
export type ReportFilter = z.infer<typeof reportFilterSchema>;
export type CustomReportConfig = z.infer<typeof customReportConfigSchema>;
export type ReportRequest = z.infer<typeof reportRequestSchema>;
export type HealthMetricsReport = z.infer<typeof healthMetricsReportSchema>;
export type MedicationComplianceReport = z.infer<typeof medicationComplianceReportSchema>;
export type AppointmentAnalyticsReport = z.infer<typeof appointmentAnalyticsReportSchema>;
export type IncidentTrendsReport = z.infer<typeof incidentTrendsReportSchema>;
export type InventoryAnalyticsReport = z.infer<typeof inventoryAnalyticsReportSchema>;
export type DashboardWidget = z.infer<typeof dashboardWidgetSchema>;
export type DashboardConfig = z.infer<typeof dashboardConfigSchema>;
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;
export type ComparisonReport = z.infer<typeof comparisonReportSchema>;
export type TrendAnalysis = z.infer<typeof trendAnalysisSchema>;
export type ExportRequest = z.infer<typeof exportRequestSchema>;
export type ScheduledReport = z.infer<typeof scheduledReportSchema>;
export type ReportTemplate = z.infer<typeof reportTemplateSchema>;
