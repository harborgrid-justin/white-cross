/**
 * Analytics Schemas - Barrel Export
 *
 * Comprehensive re-export of all analytics-related validation schemas and utilities.
 * Provides a single entry point for importing analytics schemas throughout the application.
 *
 * @module schemas/analytics
 *
 * @example
 * ```typescript
 * // Import specific schemas
 * import { metricQuerySchema, dateRangeSchema } from '@/schemas/analytics';
 *
 * // Import types
 * import type { MetricQuery, FilterConfig } from '@/schemas/analytics';
 *
 * // Import utilities
 * import { validateDateRange, sanitizeFieldName } from '@/schemas/analytics';
 * ```
 */

// ============================================================================
// Base Types and Enums
// ============================================================================
// Core building blocks for analytics queries including date ranges, filters,
// aggregations, and sort configurations.

export {
  // Date range validation
  dateRangeSchema,
  type DateRange,

  // Filter configurations
  filterOperatorSchema,
  type FilterOperator,
  filterConfigSchema,
  type FilterConfig,

  // Aggregation configurations
  aggregationFunctionSchema,
  type AggregationFunction,
  aggregationSchema,
  type Aggregation,

  // Sort configurations
  sortOrderSchema,
  type SortOrder,

  // Data source and period enums
  dataSourceSchema,
  type DataSource,
  aggregationPeriodSchema,
  type AggregationPeriod,
} from './analytics.base.schemas';

// ============================================================================
// Query Schemas
// ============================================================================
// Core query configuration schemas for building analytics queries with filters,
// aggregations, grouping, and pagination.

export {
  // Standard metric queries
  metricQuerySchema,
  type MetricQuery,

  // Custom query builder schemas
  customQuerySchema,
  type CustomQuery,
} from './analytics.query.schemas';

// ============================================================================
// Domain-Specific Metrics
// ============================================================================
// Specialized query schemas for specific domain areas such as health metrics,
// medication compliance, appointments, incidents, and inventory analytics.

export {
  // Health metrics
  healthMetricsQuerySchema,
  type HealthMetricsQuery,

  // Medication compliance
  medicationComplianceQuerySchema,
  type MedicationComplianceQuery,

  // Appointment statistics
  appointmentStatisticsQuerySchema,
  type AppointmentStatisticsQuery,

  // Incident trends
  incidentTrendsQuerySchema,
  type IncidentTrendsQuery,

  // Inventory analytics
  inventoryAnalyticsQuerySchema,
  type InventoryAnalyticsQuery,
} from './analytics.metrics.schemas';

// ============================================================================
// Dashboard Schemas
// ============================================================================
// Dashboard configuration schemas including widget layouts, chart types,
// and dashboard metadata for building analytics dashboards.

export {
  // Widget types
  widgetTypeSchema,
  type WidgetType,

  // Chart types
  chartTypeSchema,
  type ChartType,

  // Widget positioning
  widgetPositionSchema,
  type WidgetPosition,

  // Widget configuration
  dashboardWidgetSchema,
  type DashboardWidget,

  // Dashboard layout
  dashboardLayoutSchema,
  type DashboardLayout,

  // Complete dashboard configuration
  dashboardConfigSchema,
  type DashboardConfig,
} from './analytics.dashboard.schemas';

// ============================================================================
// Export and Analysis Schemas
// ============================================================================
// Schemas for data export configurations, trend analysis, and prediction settings.

export {
  // Export formats
  exportFormatSchema,
  type ExportFormat,

  // Page configurations for PDF exports
  pageSizeSchema,
  type PageSize,
  pageOrientationSchema,
  type PageOrientation,

  // Export configuration
  exportConfigSchema,
  type ExportConfig,

  // Trend analysis types
  trendTypeSchema,
  type TrendType,

  // Trend data structures
  trendDataPointSchema,
  type TrendDataPoint,

  // Trend analysis configuration
  trendAnalysisSchema,
  type TrendAnalysis,
} from './analytics.export.schemas';

// ============================================================================
// Validation Utilities
// ============================================================================
// Helper functions for validating analytics data, filters, aggregations,
// and field configurations.

export {
  // Date range validation
  validateDateRange,

  // Filter validation
  validateFilterValue,

  // Field name sanitization
  sanitizeFieldName,

  // Aggregation validation
  validateAggregationField,
} from './analytics.utils';
