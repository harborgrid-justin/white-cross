/**
 * Purchase Orders Domain Exports
 * 
 * Central export point for all purchase order-related hooks and utilities.
 * Provides comprehensive purchase order management, approval workflows, 
 * receiving processes, and analytics functionality.
 * 
 * @module hooks/domains/purchase-orders
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// Configuration and Types
export * from './config';

// Query Hooks - Individual purchase order data fetching
export {
  // Purchase Order Queries
  usePurchaseOrders,
  usePurchaseOrderDetails,
  usePurchaseOrdersByStatus,
  usePurchaseOrdersByDepartment,
  
  // Line Item Queries
  useLineItems,
  useLineItemDetails,
  
  // Approval Workflow Queries
  useApprovalWorkflows,
  useApprovalWorkflowDetails,
  usePendingApprovals,
  
  // Receipt Queries
  useReceipts,
  useReceiptDetails,
  
  // Vendor Quote Queries
  useVendorQuotes,
  useVendorQuoteDetails,
  
  // Analytics Queries
  usePOAnalytics,
  usePOSpendingAnalysis,
  usePOVendorPerformance,
  
  // Dashboard & Statistics
  usePODashboard,
  usePOStatistics,
  usePOReports,
} from './queries/usePurchaseOrderQueries';

// Mutation Hooks - Purchase order data modifications
export {
  // Purchase Order CRUD
  useCreatePurchaseOrder,
  useUpdatePurchaseOrder,
  useDeletePurchaseOrder,
  useDuplicatePurchaseOrder,
  
  // Line Item Management
  useAddLineItem,
  useUpdateLineItem,
  useRemoveLineItem,
  
  // Approval Workflow
  useApprovePurchaseOrder,
  useRejectPurchaseOrder,
  useSubmitForApproval,
  useCancelPurchaseOrder,
  
  // Receipt Management
  useCreateReceipt,
  useUpdateReceipt,
  
  // Status Updates
  useSendPurchaseOrder,
  useAcknowledgePurchaseOrder,
  useClosePurchaseOrder,
  
  // Bulk Operations
  useBulkUpdateStatus,
  useBulkDeletePurchaseOrders,
  
  // Export Operations
  useExportPurchaseOrders,
  
  // Combined mutations object
  purchaseOrderMutations,
} from './mutations/usePurchaseOrderMutations';

// Composite Hooks - Complex workflow management
export {
  // Workflow Composites
  usePurchaseOrderWorkflow,
  useCreatePurchaseOrderWorkflow,
  useApprovalWorkflow,
  useReceivingWorkflow,
  
  // Dashboard & Analytics Composites
  usePurchaseOrderDashboard,
  usePurchaseOrderSearch,
  usePurchaseOrderAnalytics,
  
  // Combined composites object
  purchaseOrderComposites,
} from './composites/usePurchaseOrderComposites';

// Re-export key utilities for external use
export { 
  purchaseOrderKeys,
  PURCHASE_ORDERS_CACHE_CONFIG,
  invalidatePOQueries,
  calculatePOTotals,
  getPOStatusColor,
  canEditPO,
  canCancelPO,
  getNextPOStatus,
} from './config';

// Type exports for external use
export type {
  PurchaseOrder,
  POLineItem,
  POApprovalWorkflow,
  POApprovalLevel,
  POReceipt,
  POReceiptLineItem,
  PODocument,
  POAnalytics,
  POContact,
  POAddress,
} from './config';
