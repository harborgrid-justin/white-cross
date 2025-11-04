/**
 * Purchase Order Composite Hooks - Barrel Export
 *
 * Provides high-level composite hooks that orchestrate multiple queries and mutations
 * into complete workflows. These hooks combine data fetching with business logic to
 * simplify complex purchase order operations.
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
 * These hooks abstract complexity and provide a clean API for components,
 * handling cache invalidation, error handling, and business logic automatically.
 *
 * @module hooks/domains/purchase-orders/composites
 */

export * from './types';
export { usePurchaseOrderWorkflow } from './usePurchaseOrderWorkflow';
export { useCreatePurchaseOrderWorkflow } from './useCreatePurchaseOrderWorkflow';
export { useApprovalWorkflow } from './useApprovalWorkflow';
export { useReceivingWorkflow } from './useReceivingWorkflow';
export { usePurchaseOrderDashboard } from './usePurchaseOrderDashboard';
export { usePurchaseOrderSearch } from './usePurchaseOrderSearch';
export { usePurchaseOrderAnalytics } from './usePurchaseOrderAnalytics';

// Combined export for easy access
export const purchaseOrderComposites = {
  usePurchaseOrderWorkflow: () => import('./usePurchaseOrderWorkflow').then(m => m.usePurchaseOrderWorkflow),
  useCreatePurchaseOrderWorkflow: () => import('./useCreatePurchaseOrderWorkflow').then(m => m.useCreatePurchaseOrderWorkflow),
  useApprovalWorkflow: () => import('./useApprovalWorkflow').then(m => m.useApprovalWorkflow),
  useReceivingWorkflow: () => import('./useReceivingWorkflow').then(m => m.useReceivingWorkflow),
  usePurchaseOrderDashboard: () => import('./usePurchaseOrderDashboard').then(m => m.usePurchaseOrderDashboard),
  usePurchaseOrderSearch: () => import('./usePurchaseOrderSearch').then(m => m.usePurchaseOrderSearch),
  usePurchaseOrderAnalytics: () => import('./usePurchaseOrderAnalytics').then(m => m.usePurchaseOrderAnalytics),
};
