/**
 * @fileoverview Next.js App Router Server Actions for Inventory Alerts and Reports
 * @module app/alerts/actions
 *
 * Enhanced with HIPAA-compliant audit logging and proper cache management.
 * Handles low-stock alerts, expiration monitoring, and inventory reporting.
 *
 * This file serves as the main entry point and re-exports all alert-related
 * functionality from specialized modules.
 */

// ==========================================
// TYPE EXPORTS
// ==========================================
export type {
  ActionResult,
  LowStockAlert,
  ExpirationAlert,
  BulkReorderRecommendations,
  StockTransferRecommendation,
  StockLevelReport,
  InventoryDashboardStats,
  StockUsageAnalytics,
  UsageAnalyticsFilter,
  TotalStockValuation,
  ReportType,
} from './alerts.types';

// ==========================================
// ALERT CRUD OPERATIONS
// ==========================================
export {
  getLowStockAlerts,
  getExpirationAlerts,
  getInventoryDashboardStats,
} from './alerts.crud';

// ==========================================
// ACKNOWLEDGMENT OPERATIONS
// ==========================================
export {
  acknowledgeAlert,
  dismissAlert,
} from './alerts.acknowledgment';

// ==========================================
// RECOMMENDATION OPERATIONS
// ==========================================
export {
  getReorderRecommendations,
  getTransferRecommendations,
} from './alerts.recommendations';

// ==========================================
// ANALYTICS OPERATIONS
// ==========================================
export {
  getStockUsageAnalytics,
  getInventoryValuation,
} from './alerts.analytics';

// ==========================================
// REPORT OPERATIONS
// ==========================================
export {
  generateStockLevelReport,
  exportReportToCSV,
} from './alerts.reports';

// ==========================================
// CACHE MANAGEMENT
// ==========================================
export {
  revalidateAlertCaches,
  revalidateLowStockCaches,
  revalidateExpirationCaches,
  revalidateDashboardCaches,
  revalidateAnalyticsCaches,
  revalidateReportCaches,
} from './alerts.cache';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
export {
  filterToParams,
  isValidLocationId,
  isValidAlertId,
  formatDaysAhead,
  getExpirationSeverity,
  getStockLevelSeverity,
  formatStockPercentage,
  calculateReorderQuantity,
} from './alerts.utils';
