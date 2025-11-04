/**
 * Purchase Order Composite Hooks (Re-export Module)
 *
 * This file has been refactored into smaller modules for better maintainability.
 * It now re-exports all composite hooks from their individual modules.
 *
 * Composite Workflows:
 * - **usePurchaseOrderWorkflow**: Complete PO data + workflow state logic
 * - **useCreatePurchaseOrderWorkflow**: Create PO + auto-submit for approval
 * - **useApprovalWorkflow**: Approve/reject with automatic status progression
 * - **useReceivingWorkflow**: Create receipt + auto-close PO when complete
 * - **usePurchaseOrderDashboard**: Aggregated dashboard data
 * - **usePurchaseOrderSearch**: Advanced search with facets
 * - **usePurchaseOrderAnalytics**: Comprehensive analytics and insights
 *
 * @module hooks/domains/purchase-orders/composites
 * @deprecated Import from specific modules or from './index' instead
 */

// Re-export all types
export type {
  PurchaseOrderWorkflowData,
  CreatePOWorkflowInput,
  ApprovalWorkflowInput,
  ReceivingWorkflowInput,
} from './types';

// Re-export all hooks
export { usePurchaseOrderWorkflow } from './usePurchaseOrderWorkflow';
export { useCreatePurchaseOrderWorkflow } from './useCreatePurchaseOrderWorkflow';
export { useApprovalWorkflow } from './useApprovalWorkflow';
export { useReceivingWorkflow } from './useReceivingWorkflow';
export { usePurchaseOrderDashboard } from './usePurchaseOrderDashboard';
export { usePurchaseOrderSearch } from './usePurchaseOrderSearch';
export { usePurchaseOrderAnalytics } from './usePurchaseOrderAnalytics';

// Combined export for backward compatibility
import { usePurchaseOrderWorkflow } from './usePurchaseOrderWorkflow';
import { useCreatePurchaseOrderWorkflow } from './useCreatePurchaseOrderWorkflow';
import { useApprovalWorkflow } from './useApprovalWorkflow';
import { useReceivingWorkflow } from './useReceivingWorkflow';
import { usePurchaseOrderDashboard } from './usePurchaseOrderDashboard';
import { usePurchaseOrderSearch } from './usePurchaseOrderSearch';
import { usePurchaseOrderAnalytics } from './usePurchaseOrderAnalytics';

export const purchaseOrderComposites = {
  usePurchaseOrderWorkflow,
  useCreatePurchaseOrderWorkflow,
  useApprovalWorkflow,
  useReceivingWorkflow,
  usePurchaseOrderDashboard,
  usePurchaseOrderSearch,
  usePurchaseOrderAnalytics,
};
