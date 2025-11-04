/**
 * @fileoverview TypeScript types and interfaces for Inventory Alerts
 * @module app/alerts/types
 */

import type {
  LowStockAlert,
  ExpirationAlert,
  BulkReorderRecommendations,
  StockTransferRecommendation,
  StockLevelReport,
  InventoryDashboardStats,
  StockUsageAnalytics,
  UsageAnalyticsFilter,
  TotalStockValuation,
} from '@/schemas/stock.schemas';

/**
 * Common action result interface for all alert operations
 */
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Re-export stock schema types for convenience
 */
export type {
  LowStockAlert,
  ExpirationAlert,
  BulkReorderRecommendations,
  StockTransferRecommendation,
  StockLevelReport,
  InventoryDashboardStats,
  StockUsageAnalytics,
  UsageAnalyticsFilter,
  TotalStockValuation,
};

/**
 * Report types available for export
 */
export type ReportType = 'stock-level' | 'transaction-summary' | 'expiration' | 'variance';
