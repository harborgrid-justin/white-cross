/**
 * Analytics Validation Schemas - Barrel Export
 *
 * Comprehensive Zod validation schemas for analytics queries, filters, and aggregations.
 * Ensures type safety and data integrity for all analytics operations.
 *
 * This module maintains backward compatibility by re-exporting all schemas and utilities
 * from the refactored modular structure.
 *
 * @module analytics.schemas
 */

// Base schemas - common types and enums
export {
  dateRangeSchema,
  type DateRange,
  filterOperatorSchema,
  type FilterOperator,
  filterConfigSchema,
  type FilterConfig,
  aggregationFunctionSchema,
  type AggregationFunction,
  aggregationSchema,
  type Aggregation,
  sortOrderSchema,
  type SortOrder,
  dataSourceSchema,
  type DataSource,
  aggregationPeriodSchema,
  type AggregationPeriod,
} from './analytics.base.schemas';

// Query schemas - core query configuration
export {
  metricQuerySchema,
  type MetricQuery,
  customQuerySchema,
  type CustomQuery,
} from './analytics.query.schemas';

// Domain-specific metric schemas
export {
  healthMetricsQuerySchema,
  type HealthMetricsQuery,
  medicationComplianceQuerySchema,
  type MedicationComplianceQuery,
  appointmentStatisticsQuerySchema,
  type AppointmentStatisticsQuery,
  incidentTrendsQuerySchema,
  type IncidentTrendsQuery,
  inventoryAnalyticsQuerySchema,
  type InventoryAnalyticsQuery,
} from './analytics.metrics.schemas';

// Dashboard schemas
export {
  widgetTypeSchema,
  type WidgetType,
  chartTypeSchema,
  type ChartType,
  widgetPositionSchema,
  type WidgetPosition,
  dashboardWidgetSchema,
  type DashboardWidget,
  dashboardLayoutSchema,
  type DashboardLayout,
  dashboardConfigSchema,
  type DashboardConfig,
} from './analytics.dashboard.schemas';

// Export and trend analysis schemas
export {
  exportFormatSchema,
  type ExportFormat,
  pageSizeSchema,
  type PageSize,
  pageOrientationSchema,
  type PageOrientation,
  exportConfigSchema,
  type ExportConfig,
  trendTypeSchema,
  type TrendType,
  trendDataPointSchema,
  type TrendDataPoint,
  trendAnalysisSchema,
  type TrendAnalysis,
} from './analytics.export.schemas';

// Validation utilities
export {
  validateDateRange,
  validateFilterValue,
  sanitizeFieldName,
  validateAggregationField,
} from './analytics.utils';
