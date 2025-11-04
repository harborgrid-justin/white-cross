/**
 * Purchase Order Query Hooks
 *
 * Provides comprehensive React Query hooks for fetching purchase order data including:
 * - Purchase orders with filtering and pagination
 * - Line items and order details
 * - Approval workflows and pending approvals
 * - Receipts and receiving history
 * - Vendor quotes and comparisons
 * - Analytics and performance metrics
 * - Dashboard aggregations and reports
 *
 * All queries leverage React Query's caching and automatic revalidation.
 * Cache configuration is defined in PURCHASE_ORDERS_CACHE_CONFIG.
 *
 * @module hooks/domains/purchase-orders/queries
 */

// Re-export all hooks from modular files
export {
  usePurchaseOrders,
  usePurchaseOrderDetails,
  usePurchaseOrdersByStatus,
  usePurchaseOrdersByDepartment,
  useLineItems,
  useLineItemDetails,
  useApprovalWorkflows,
  useApprovalWorkflowDetails,
  usePendingApprovals,
  useVendorQuotes,
  useVendorQuoteDetails,
  type POVendorQuote,
} from './usePurchaseOrderCoreQueries';

export {
  useReceipts,
  useReceiptDetails,
} from './usePurchaseOrderReceiptQueries';

export {
  usePOAnalytics,
  usePOSpendingAnalysis,
  usePOVendorPerformance,
  usePODashboard,
  usePOStatistics,
  usePOReports,
} from './usePurchaseOrderAnalyticsQueries';
