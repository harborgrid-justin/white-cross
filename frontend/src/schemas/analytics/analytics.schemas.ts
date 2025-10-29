/**
 * Analytics Validation Schemas
 *
 * Comprehensive Zod validation schemas for analytics queries, filters, and aggregations.
 * Ensures type safety and data integrity for all analytics operations.
 *
 * @module analytics.schemas
 */

import { z } from 'zod';

/**
 * Date Range Schema
 * Validates start and end dates with business rules
 */
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
}).refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  {
    message: 'Start date must be before or equal to end date',
    path: ['startDate'],
  }
).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 365; // Maximum 1 year range
  },
  {
    message: 'Date range cannot exceed 365 days',
    path: ['endDate'],
  }
);

/**
 * Filter Operator Enum
 */
export const filterOperatorSchema = z.enum([
  'equals',
  'notEquals',
  'contains',
  'notContains',
  'startsWith',
  'endsWith',
  'greaterThan',
  'lessThan',
  'greaterThanOrEqual',
  'lessThanOrEqual',
  'between',
  'in',
  'notIn',
  'isNull',
  'isNotNull',
]);

export type FilterOperator = z.infer<typeof filterOperatorSchema>;

/**
 * Filter Configuration Schema
 * Dynamic filter for analytics queries
 */
export const filterConfigSchema = z.object({
  field: z.string().min(1, 'Field name is required'),
  operator: filterOperatorSchema,
  value: z.any().optional(),
  values: z.array(z.any()).optional(),
  condition: z.enum(['AND', 'OR']).default('AND'),
}).refine(
  (data) => {
    // Validate value/values based on operator
    if (['between', 'in', 'notIn'].includes(data.operator)) {
      return Array.isArray(data.values) && data.values.length > 0;
    }
    if (['isNull', 'isNotNull'].includes(data.operator)) {
      return true; // No value needed
    }
    return data.value !== undefined && data.value !== null;
  },
  {
    message: 'Value or values required based on operator',
    path: ['value'],
  }
);

export type FilterConfig = z.infer<typeof filterConfigSchema>;

/**
 * Aggregation Function Enum
 */
export const aggregationFunctionSchema = z.enum([
  'count',
  'sum',
  'avg',
  'min',
  'max',
  'median',
  'mode',
  'stddev',
  'variance',
]);

export type AggregationFunction = z.infer<typeof aggregationFunctionSchema>;

/**
 * Aggregation Schema
 * Defines aggregation operations for analytics
 */
export const aggregationSchema = z.object({
  field: z.string().min(1, 'Field name is required'),
  function: aggregationFunctionSchema,
  alias: z.string().optional(),
  groupBy: z.array(z.string()).optional(),
});

export type Aggregation = z.infer<typeof aggregationSchema>;

/**
 * Sort Order Schema
 */
export const sortOrderSchema = z.object({
  field: z.string().min(1, 'Field name is required'),
  direction: z.enum(['ASC', 'DESC']).default('ASC'),
});

export type SortOrder = z.infer<typeof sortOrderSchema>;

/**
 * Metric Query Schema
 * Comprehensive analytics query configuration
 */
export const metricQuerySchema = z.object({
  // Data source
  dataSource: z.enum([
    'students',
    'health-records',
    'medications',
    'appointments',
    'incidents',
    'inventory',
  ]),

  // Date range (required)
  dateRange: dateRangeSchema,

  // Filters (optional)
  filters: z.array(filterConfigSchema).optional(),

  // Aggregations (optional)
  aggregations: z.array(aggregationSchema).optional(),

  // Group by fields
  groupBy: z.array(z.string()).optional(),

  // Sort order
  orderBy: z.array(sortOrderSchema).optional(),

  // Pagination
  limit: z.number().int().min(1).max(10000).optional().default(100),
  offset: z.number().int().min(0).optional().default(0),

  // Include metadata
  includeMetadata: z.boolean().optional().default(false),
});

export type MetricQuery = z.infer<typeof metricQuerySchema>;

/**
 * Health Metrics Query Schema
 * Specific schema for health metrics analytics
 */
export const healthMetricsQuerySchema = z.object({
  dateRange: dateRangeSchema,
  metricTypes: z.array(z.enum([
    'bmi',
    'bloodPressure',
    'temperature',
    'heartRate',
    'height',
    'weight',
    'vision',
    'hearing',
  ])).optional(),
  ageGroups: z.array(z.string()).optional(),
  gradelevels: z.array(z.string()).optional(),
  aggregation: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('monthly'),
});

export type HealthMetricsQuery = z.infer<typeof healthMetricsQuerySchema>;

/**
 * Medication Compliance Query Schema
 */
export const medicationComplianceQuerySchema = z.object({
  dateRange: dateRangeSchema,
  medicationIds: z.array(z.string()).optional(),
  studentIds: z.array(z.string()).optional(),
  complianceThreshold: z.number().min(0).max(100).optional().default(80),
  aggregation: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
  includeBreakdown: z.boolean().optional().default(true),
});

export type MedicationComplianceQuery = z.infer<typeof medicationComplianceQuerySchema>;

/**
 * Appointment Statistics Query Schema
 */
export const appointmentStatisticsQuerySchema = z.object({
  dateRange: dateRangeSchema,
  appointmentTypes: z.array(z.enum([
    'checkup',
    'medication',
    'injury',
    'illness',
    'counseling',
    'other',
  ])).optional(),
  includeNoShows: z.boolean().optional().default(true),
  includeCancellations: z.boolean().optional().default(true),
  aggregation: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
});

export type AppointmentStatisticsQuery = z.infer<typeof appointmentStatisticsQuerySchema>;

/**
 * Incident Trends Query Schema
 */
export const incidentTrendsQuerySchema = z.object({
  dateRange: dateRangeSchema,
  incidentTypes: z.array(z.enum([
    'injury',
    'illness',
    'behavioral',
    'safety',
    'emergency',
    'other',
  ])).optional(),
  severityLevels: z.array(z.enum(['low', 'medium', 'high', 'critical'])).optional(),
  locations: z.array(z.string()).optional(),
  aggregation: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
  includeTrendAnalysis: z.boolean().optional().default(true),
});

export type IncidentTrendsQuery = z.infer<typeof incidentTrendsQuerySchema>;

/**
 * Inventory Analytics Query Schema
 */
export const inventoryAnalyticsQuerySchema = z.object({
  dateRange: dateRangeSchema,
  categories: z.array(z.string()).optional(),
  includeExpiring: z.boolean().optional().default(true),
  expiryThresholdDays: z.number().int().min(1).max(365).optional().default(30),
  includeLowStock: z.boolean().optional().default(true),
  lowStockThreshold: z.number().int().min(0).optional().default(10),
  aggregation: z.enum(['daily', 'weekly', 'monthly']).default('monthly'),
});

export type InventoryAnalyticsQuery = z.infer<typeof inventoryAnalyticsQuerySchema>;

/**
 * Trend Analysis Configuration Schema
 */
export const trendAnalysisSchema = z.object({
  // Data for trend analysis
  data: z.array(z.object({
    date: z.string(),
    value: z.number(),
  })),

  // Trend type
  trendType: z.enum([
    'linear',
    'exponential',
    'polynomial',
    'movingAverage',
  ]).default('linear'),

  // Prediction settings
  predictFuture: z.boolean().optional().default(false),
  predictionPeriods: z.number().int().min(1).max(90).optional().default(7),

  // Moving average settings (if applicable)
  movingAveragePeriod: z.number().int().min(2).max(30).optional().default(7),

  // Anomaly detection
  detectAnomalies: z.boolean().optional().default(false),
  anomalyThreshold: z.number().min(1).max(5).optional().default(2), // Standard deviations
});

export type TrendAnalysis = z.infer<typeof trendAnalysisSchema>;

/**
 * Export Configuration Schema
 */
export const exportConfigSchema = z.object({
  format: z.enum(['CSV', 'EXCEL', 'PDF']),
  filename: z.string().optional(),
  includeCharts: z.boolean().optional().default(false),
  includeMetadata: z.boolean().optional().default(true),
  pageSize: z.enum(['A4', 'LETTER', 'LEGAL']).optional().default('A4'),
  orientation: z.enum(['portrait', 'landscape']).optional().default('portrait'),
});

export type ExportConfig = z.infer<typeof exportConfigSchema>;

/**
 * Analytics Dashboard Configuration Schema
 */
export const dashboardConfigSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Dashboard name is required').max(100),
  description: z.string().max(500).optional(),
  widgets: z.array(z.object({
    id: z.string(),
    type: z.enum([
      'metric',
      'chart',
      'table',
      'gauge',
      'progress',
      'list',
    ]),
    title: z.string(),
    query: metricQuerySchema,
    chartType: z.enum([
      'line',
      'bar',
      'pie',
      'doughnut',
      'area',
      'scatter',
    ]).optional(),
    position: z.object({
      x: z.number().int().min(0),
      y: z.number().int().min(0),
      width: z.number().int().min(1).max(12),
      height: z.number().int().min(1).max(12),
    }),
    refreshInterval: z.number().int().min(0).optional(), // seconds, 0 = no auto-refresh
  })),
  layout: z.enum(['grid', 'flex']).default('grid'),
  isPublic: z.boolean().default(false),
  createdBy: z.string().optional(),
});

export type DashboardConfig = z.infer<typeof dashboardConfigSchema>;

/**
 * Custom Query Schema
 * For advanced custom query builder
 */
export const customQuerySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Query name is required').max(100),
  description: z.string().max(500).optional(),
  dataSource: z.enum([
    'students',
    'health-records',
    'medications',
    'appointments',
    'incidents',
    'inventory',
  ]),
  fields: z.array(z.object({
    name: z.string(),
    alias: z.string().optional(),
    aggregation: aggregationFunctionSchema.optional(),
  })).min(1, 'At least one field is required'),
  filters: z.array(filterConfigSchema).optional(),
  groupBy: z.array(z.string()).optional(),
  orderBy: z.array(sortOrderSchema).optional(),
  limit: z.number().int().min(1).max(10000).optional().default(1000),
  savedBy: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export type CustomQuery = z.infer<typeof customQuerySchema>;

/**
 * Validation helper functions
 */

/**
 * Validate date range does not exceed maximum
 */
export function validateDateRange(startDate: string, endDate: string, maxDays: number = 365): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= maxDays;
}

/**
 * Validate filter value based on operator
 */
export function validateFilterValue(operator: FilterOperator, value: any, values?: any[]): boolean {
  switch (operator) {
    case 'between':
    case 'in':
    case 'notIn':
      return Array.isArray(values) && values.length > 0;
    case 'isNull':
    case 'isNotNull':
      return true;
    default:
      return value !== undefined && value !== null;
  }
}

/**
 * Sanitize field names to prevent SQL injection
 */
export function sanitizeFieldName(field: string): string {
  return field.replace(/[^a-zA-Z0-9_]/g, '');
}

/**
 * Validate aggregation field compatibility
 */
export function validateAggregationField(func: AggregationFunction, field: string): boolean {
  // Count can work on any field
  if (func === 'count') return true;

  // Numeric functions require numeric fields
  const numericFunctions: AggregationFunction[] = ['sum', 'avg', 'min', 'max', 'median', 'stddev', 'variance'];
  if (numericFunctions.includes(func)) {
    // In a real implementation, check field type from schema
    return true; // Placeholder - should validate against data source schema
  }

  return true;
}
