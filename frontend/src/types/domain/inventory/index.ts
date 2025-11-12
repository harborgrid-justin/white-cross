/**
 * WF-COMP-328 | index.ts - Inventory types barrel export
 * Purpose: Central export point for all inventory type definitions
 * Upstream: All inventory type modules | Dependencies: Individual modules
 * Downstream: All consuming code | Called by: Components, services, hooks
 * Related: All inventory modules
 * Exports: All inventory types | Key Features: Backward compatibility
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type imports → Module resolution → Type checking
 * LLM Context: Barrel export maintaining backward compatibility after refactoring
 */

// =====================
// ENUMS & TYPE ALIASES
// =====================
export {
  InventoryTransactionType,
  MaintenanceType,
  PurchaseOrderStatus,
} from './enums';

export type {
  InventoryAlertType,
  InventoryAlertSeverity,
  AlertPriority,
  InventoryStatus,
  StockStatus,
} from './enums';

// =====================
// CORE ENTITIES
// =====================
export type {
  InventoryItem,
  InventoryTransaction,
  MaintenanceLog,
} from './core-entities';

// =====================
// PURCHASING
// =====================
export type {
  Vendor,
  PurchaseOrder,
  PurchaseOrderItem,
  GeneratedPurchaseOrder,
} from './purchasing';

// =====================
// ALERTS
// =====================
export type {
  InventoryAlert,
  LowStockAlert,
  ExpirationAlert,
} from './alerts';

// =====================
// STOCK MANAGEMENT
// =====================
export type {
  StockLevel,
  StockLevelWithDetails,
  Batch,
  BatchFilter,
} from './stock';

// =====================
// REQUESTS
// =====================
export type {
  InventoryFilters,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  CreateInventoryTransactionRequest,
  StockAdjustmentRequest,
  StockAdjustmentResponse,
  CreateMaintenanceLogRequest,
  CreateVendorRequest,
  CreatePurchaseOrderRequest,
  GeneratePurchaseOrderRequest,
  MaintenanceScheduleParams,
  UsageAnalyticsParams,
} from './requests';

// =====================
// RESPONSES
// =====================
export type {
  InventoryItemsResponse,
  InventoryItemWithStockResponse,
  StockHistoryResponse,
  InventoryValuationResponse,
  UsageAnalyticsResponse,
  SupplierPerformanceResponse,
} from './responses';

// =====================
// STATISTICS
// =====================
export type {
  InventoryStatsOverview,
  CategoryBreakdownStats,
  CategoryBreakdown,
  InventoryDashboardStats,
  StockStatusBreakdown,
  CategoryCount,
  InventoryStats,
  RecentActivityItem,
  TopUsedItem,
  InventoryStatsResponse,
} from './statistics';

// =====================
// FORMS
// =====================
export type {
  InventoryItemFormData,
  InventoryTransactionFormData,
  MaintenanceLogFormData,
  VendorFormData,
  PurchaseOrderFormData,
} from './forms';

// =====================
// TYPE GUARDS & UTILITIES
// =====================
export {
  isLowStock,
  isOutOfStock,
  isMaintenanceDue,
  isExpiringSoon,
  isExpired,
} from './guards';
