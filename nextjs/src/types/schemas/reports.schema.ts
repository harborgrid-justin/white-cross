/**
 * Report Schemas - Zod validation schemas for reports
 *
 * Provides comprehensive validation for:
 * - Report definitions and configurations
 * - Chart configurations and data series
 * - Report scheduling and delivery
 * - Export formats and options
 * - HIPAA-compliant data handling
 *
 * @module types/schemas/reports.schema
 * @author White Cross Healthcare Platform
 * @version 1.0.0
 */

import { z } from 'zod';

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Report type enumeration
 */
export const ReportTypeSchema = z.enum([
  'health',
  'medications',
  'incidents',
  'attendance',
  'immunizations',
  'compliance',
  'custom',
  'students',
  'appointments',
  'inventory',
  'performance',
  'dashboard'
]);

/**
 * Export format enumeration
 */
export const ExportFormatSchema = z.enum([
  'pdf',
  'excel',
  'csv',
  'json'
]);

/**
 * Chart type enumeration
 */
export const ChartTypeSchema = z.enum([
  'line',
  'bar',
  'pie',
  'area',
  'donut',
  'stacked-bar',
  'horizontal-bar',
  'multi-series-line',
  'heat-map',
  'funnel',
  'gauge',
  'scatter',
  'radar'
]);

/**
 * Aggregation type enumeration
 */
export const AggregationTypeSchema = z.enum([
  'count',
  'sum',
  'avg',
  'min',
  'max',
  'median',
  'percentile'
]);

/**
 * Date grouping enumeration
 */
export const DateGroupingSchema = z.enum([
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'yearly'
]);

/**
 * Report period enumeration
 */
export const ReportPeriodSchema = z.enum([
  'today',
  'yesterday',
  'last-7-days',
  'last-30-days',
  'last-90-days',
  'this-month',
  'last-month',
  'this-quarter',
  'last-quarter',
  'this-year',
  'last-year',
  'custom'
]);

/**
 * Report status enumeration
 */
export const ReportStatusSchema = z.enum([
  'draft',
  'pending',
  'generating',
  'completed',
  'failed',
  'scheduled'
]);

// ============================================================================
// FILTER SCHEMAS
// ============================================================================

/**
 * Date range filter
 */
export const DateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  period: ReportPeriodSchema.optional()
});

/**
 * Report filter configuration
 */
export const ReportFilterSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains', 'startsWith', 'endsWith']),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number()]))]),
  label: z.string().optional()
});

/**
 * Advanced filter group (AND/OR logic)
 */
export const FilterGroupSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    logic: z.enum(['and', 'or']),
    filters: z.array(z.union([ReportFilterSchema, FilterGroupSchema]))
  })
);

// ============================================================================
// CHART SCHEMAS
// ============================================================================

/**
 * Chart axis configuration
 */
export const ChartAxisSchema = z.object({
  label: z.string().optional(),
  field: z.string(),
  format: z.string().optional(),
  scale: z.enum(['linear', 'logarithmic', 'time']).default('linear'),
  min: z.number().optional(),
  max: z.number().optional()
});

/**
 * Data series configuration
 */
export const DataSeriesSchema = z.object({
  name: z.string(),
  field: z.string(),
  color: z.string().optional(),
  type: ChartTypeSchema.optional(),
  aggregation: AggregationTypeSchema.optional(),
  yAxisId: z.string().optional()
});

/**
 * Chart legend configuration
 */
export const ChartLegendSchema = z.object({
  show: z.boolean().default(true),
  position: z.enum(['top', 'bottom', 'left', 'right']).default('bottom'),
  align: z.enum(['start', 'center', 'end']).default('center')
});

/**
 * Chart configuration
 */
export const ChartConfigSchema = z.object({
  type: ChartTypeSchema,
  title: z.string().optional(),
  subtitle: z.string().optional(),
  xAxis: ChartAxisSchema.optional(),
  yAxis: ChartAxisSchema.optional(),
  yAxis2: ChartAxisSchema.optional(),
  series: z.array(DataSeriesSchema),
  legend: ChartLegendSchema.optional(),
  colors: z.array(z.string()).optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  interactive: z.boolean().default(true),
  exportable: z.boolean().default(true),
  refreshInterval: z.number().optional() // milliseconds
});

// ============================================================================
// REPORT DEFINITION SCHEMAS
// ============================================================================

/**
 * Report column definition
 */
export const ReportColumnSchema = z.object({
  field: z.string(),
  label: z.string(),
  type: z.enum(['string', 'number', 'date', 'boolean', 'currency', 'percentage']),
  format: z.string().optional(),
  sortable: z.boolean().default(true),
  filterable: z.boolean().default(true),
  width: z.number().optional(),
  align: z.enum(['left', 'center', 'right']).default('left'),
  aggregation: AggregationTypeSchema.optional()
});

/**
 * Report data source configuration
 */
export const DataSourceSchema = z.object({
  type: z.enum(['api', 'graphql', 'static']),
  endpoint: z.string().optional(),
  query: z.string().optional(),
  method: z.enum(['GET', 'POST']).default('GET'),
  params: z.record(z.any()).optional(),
  cacheTime: z.number().optional() // milliseconds
});

/**
 * Report definition
 */
export const ReportDefinitionSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: ReportTypeSchema,
  category: z.string().optional(),
  dataSource: DataSourceSchema,
  columns: z.array(ReportColumnSchema).optional(),
  charts: z.array(ChartConfigSchema).optional(),
  filters: z.array(ReportFilterSchema).optional(),
  defaultFilters: z.record(z.any()).optional(),
  groupBy: z.array(z.string()).optional(),
  sortBy: z.array(z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc'])
  })).optional(),
  limit: z.number().optional(),
  includesPHI: z.boolean().default(false),
  permissions: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  template: z.boolean().default(false),
  customizable: z.boolean().default(false),
  createdBy: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// ============================================================================
// REPORT INSTANCE SCHEMAS
// ============================================================================

/**
 * Report parameters for generation
 */
export const ReportParametersSchema = z.object({
  dateRange: DateRangeSchema.optional(),
  filters: z.union([z.array(ReportFilterSchema), FilterGroupSchema]).optional(),
  groupBy: DateGroupingSchema.optional(),
  studentIds: z.array(z.string()).optional(),
  schoolIds: z.array(z.string()).optional(),
  districtIds: z.array(z.string()).optional(),
  includeCharts: z.boolean().default(true),
  includeRawData: z.boolean().default(false),
  customParameters: z.record(z.any()).optional()
});

/**
 * Report instance (generated report)
 */
export const ReportInstanceSchema = z.object({
  id: z.string(),
  definitionId: z.string(),
  name: z.string(),
  status: ReportStatusSchema,
  parameters: ReportParametersSchema,
  format: ExportFormatSchema.optional(),
  generatedAt: z.string().datetime().optional(),
  generatedBy: z.string(),
  fileUrl: z.string().url().optional(),
  fileSize: z.number().optional(),
  expiresAt: z.string().datetime().optional(),
  error: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

// ============================================================================
// SCHEDULING SCHEMAS
// ============================================================================

/**
 * Schedule frequency configuration
 */
export const ScheduleFrequencySchema = z.object({
  type: z.enum(['once', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  interval: z.number().min(1).default(1),
  dayOfWeek: z.number().min(0).max(6).optional(), // 0 = Sunday
  dayOfMonth: z.number().min(1).max(31).optional(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional() // HH:mm format
});

/**
 * Delivery configuration
 */
export const DeliveryConfigSchema = z.object({
  method: z.enum(['email', 'download', 'webhook']),
  recipients: z.array(z.string().email()).optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  webhookUrl: z.string().url().optional(),
  attachFormat: ExportFormatSchema.optional()
});

/**
 * Report schedule
 */
export const ReportScheduleSchema = z.object({
  id: z.string(),
  definitionId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  frequency: ScheduleFrequencySchema,
  parameters: ReportParametersSchema,
  delivery: DeliveryConfigSchema,
  enabled: z.boolean().default(true),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  lastRun: z.string().datetime().optional(),
  nextRun: z.string().datetime().optional(),
  createdBy: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// ============================================================================
// EXPORT SCHEMAS
// ============================================================================

/**
 * Export options configuration
 */
export const ExportOptionsSchema = z.object({
  format: ExportFormatSchema,
  includeCharts: z.boolean().default(true),
  includeMetadata: z.boolean().default(false),
  pageSize: z.enum(['letter', 'legal', 'a4']).optional(),
  orientation: z.enum(['portrait', 'landscape']).optional(),
  fileName: z.string().optional(),
  compression: z.boolean().default(false),
  watermark: z.string().optional()
});

/**
 * Export request
 */
export const ExportRequestSchema = z.object({
  reportId: z.string(),
  options: ExportOptionsSchema
});

// ============================================================================
// ANALYTICS SCHEMAS
// ============================================================================

/**
 * Analytics query parameters
 */
export const AnalyticsQuerySchema = z.object({
  type: ReportTypeSchema,
  dateRange: DateRangeSchema,
  groupBy: DateGroupingSchema.optional(),
  filters: z.array(ReportFilterSchema).optional(),
  includeComparison: z.boolean().default(false),
  comparisonPeriod: z.enum(['previous-period', 'previous-year', 'previous-month']).optional(),
  studentIds: z.array(z.string()).optional(),
  schoolIds: z.array(z.string()).optional()
});

/**
 * Analytics data point
 */
export const AnalyticsDataPointSchema = z.object({
  date: z.string(),
  value: z.number(),
  label: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

/**
 * Analytics result
 */
export const AnalyticsResultSchema = z.object({
  period: DateGroupingSchema,
  data: z.array(AnalyticsDataPointSchema),
  comparison: z.array(AnalyticsDataPointSchema).optional(),
  summary: z.object({
    total: z.number(),
    average: z.number(),
    min: z.number(),
    max: z.number(),
    trend: z.enum(['up', 'down', 'stable']).optional(),
    percentageChange: z.number().optional()
  }).optional()
});

// ============================================================================
// TYPE EXPORTS (TypeScript types derived from Zod schemas)
// ============================================================================

export type ReportType = z.infer<typeof ReportTypeSchema>;
export type ExportFormat = z.infer<typeof ExportFormatSchema>;
export type ChartType = z.infer<typeof ChartTypeSchema>;
export type AggregationType = z.infer<typeof AggregationTypeSchema>;
export type DateGrouping = z.infer<typeof DateGroupingSchema>;
export type ReportPeriod = z.infer<typeof ReportPeriodSchema>;
export type ReportStatus = z.infer<typeof ReportStatusSchema>;

export type DateRange = z.infer<typeof DateRangeSchema>;
export type ReportFilter = z.infer<typeof ReportFilterSchema>;
export type FilterGroup = z.infer<typeof FilterGroupSchema>;

export type ChartAxis = z.infer<typeof ChartAxisSchema>;
export type DataSeries = z.infer<typeof DataSeriesSchema>;
export type ChartLegend = z.infer<typeof ChartLegendSchema>;
export type ChartConfig = z.infer<typeof ChartConfigSchema>;

export type ReportColumn = z.infer<typeof ReportColumnSchema>;
export type DataSource = z.infer<typeof DataSourceSchema>;
export type ReportDefinition = z.infer<typeof ReportDefinitionSchema>;

export type ReportParameters = z.infer<typeof ReportParametersSchema>;
export type ReportInstance = z.infer<typeof ReportInstanceSchema>;

export type ScheduleFrequency = z.infer<typeof ScheduleFrequencySchema>;
export type DeliveryConfig = z.infer<typeof DeliveryConfigSchema>;
export type ReportSchedule = z.infer<typeof ReportScheduleSchema>;

export type ExportOptions = z.infer<typeof ExportOptionsSchema>;
export type ExportRequest = z.infer<typeof ExportRequestSchema>;

export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;
export type AnalyticsDataPoint = z.infer<typeof AnalyticsDataPointSchema>;
export type AnalyticsResult = z.infer<typeof AnalyticsResultSchema>;
