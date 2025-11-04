/**
 * Stock Management Schemas - Barrel Export
 *
 * Re-exports all stock-related Zod schemas from focused modules.
 * This file maintains backward compatibility while organizing schemas into logical groupings.
 *
 * Module Organization:
 * - stock.base.schemas.ts: Base enums and shared types
 * - stock.alerts.schemas.ts: Alert-related schemas (low stock, expiration, overstock)
 * - stock.thresholds.schemas.ts: Stock level threshold configurations
 * - stock.valuation.schemas.ts: Inventory valuation schemas
 * - stock.analytics.schemas.ts: Usage analytics and dashboard statistics
 * - stock.recommendations.schemas.ts: Reorder and transfer recommendations
 * - stock.reports.schemas.ts: Inventory reporting schemas
 */

// ============================================================================
// Re-export Base Schemas and Enums
// ============================================================================

export {
  // Enums
  AlertPriorityEnum,
  AlertStatusEnum,
  StockValuationMethodEnum,
  UsagePeriodEnum,

  // Types
  type AlertPriority,
  type AlertStatus,
  type StockValuationMethod,
  type UsagePeriod,
} from './stock.base.schemas';

// ============================================================================
// Re-export Alert Schemas
// ============================================================================

export {
  // Schemas
  LowStockAlertSchema,
  ExpirationAlertSchema,
  OverstockAlertSchema,

  // Types
  type LowStockAlert,
  type ExpirationAlert,
  type OverstockAlert,
} from './stock.alerts.schemas';

// ============================================================================
// Re-export Threshold Schemas
// ============================================================================

export {
  // Schemas
  StockLevelThresholdsSchema,
  UpdateStockLevelThresholdsSchema,

  // Types
  type StockLevelThresholds,
  type UpdateStockLevelThresholds,
} from './stock.thresholds.schemas';

// ============================================================================
// Re-export Valuation Schemas
// ============================================================================

export {
  // Schemas
  StockValuationSchema,
  LocationStockValuationSchema,
  TotalStockValuationSchema,

  // Types
  type StockValuation,
  type LocationStockValuation,
  type TotalStockValuation,
} from './stock.valuation.schemas';

// ============================================================================
// Re-export Analytics Schemas
// ============================================================================

export {
  // Schemas
  StockUsageAnalyticsSchema,
  UsageAnalyticsFilterSchema,
  InventoryDashboardStatsSchema,

  // Types
  type StockUsageAnalytics,
  type UsageAnalyticsFilter,
  type InventoryDashboardStats,
} from './stock.analytics.schemas';

// ============================================================================
// Re-export Recommendation Schemas
// ============================================================================

export {
  // Schemas
  ReorderRecommendationSchema,
  BulkReorderRecommendationsSchema,
  StockTransferRecommendationSchema,

  // Types
  type ReorderRecommendation,
  type BulkReorderRecommendations,
  type StockTransferRecommendation,
} from './stock.recommendations.schemas';

// ============================================================================
// Re-export Report Schemas
// ============================================================================

export {
  // Schemas
  StockLevelReportSchema,
  TransactionSummaryReportSchema,
  ExpirationReportSchema,
  VarianceReportSchema,

  // Types
  type StockLevelReport,
  type TransactionSummaryReport,
  type ExpirationReport,
  type VarianceReport,
} from './stock.reports.schemas';
