/**
 * Purchase Order Mutation Hooks - Main Export
 *
 * This module re-exports all purchase order mutation hooks for backward compatibility
 * and convenient importing. The original large file has been split into smaller,
 * more maintainable modules organized by functionality.
 *
 * Module Organization:
 * - usePOCRUDMutations: Create, Update, Delete, Duplicate operations
 * - usePOItemMutations: Line item management (add, update, remove)
 * - usePOApprovalMutations: Approval workflow (submit, approve, reject, cancel)
 * - usePOReceivingMutations: Receipt operations (create, update receipts)
 * - usePOStatusMutations: Status changes (send, acknowledge, close)
 * - usePOBulkMutations: Bulk operations (bulk update, bulk delete, export)
 * - types: TypeScript type definitions and interfaces
 * - api: Mock API functions
 *
 * Purchase Order State Machine:
 * ```
 * DRAFT → (submit) → PENDING_APPROVAL
 *   ↓                      ↓              ↓
 * (cancel)           (approve)      (reject)
 *   ↓                      ↓              ↓
 * CANCELLED              APPROVED      REJECTED
 *                          ↓
 *                      (send)
 *                          ↓
 *                        SENT
 *                          ↓
 *                    (acknowledge)
 *                          ↓
 *                    ACKNOWLEDGED
 *                          ↓
 *                     (receive)
 *                          ↓
 *              PARTIALLY_RECEIVED / RECEIVED
 *                          ↓
 *                       (close)
 *                          ↓
 *                       CLOSED
 * ```
 *
 * All mutations automatically invalidate relevant React Query caches
 * and show toast notifications on success/error.
 *
 * @module hooks/domains/purchase-orders/mutations
 */

// Export all type definitions
export type {
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
  ApprovePurchaseOrderInput,
  RejectPurchaseOrderInput,
  CreateReceiptInput,
  AddLineItemInput,
  UpdateLineItemInput,
  RemoveLineItemInput,
  UpdateReceiptInput,
  CancelPurchaseOrderInput,
  AcknowledgePurchaseOrderInput,
  BulkUpdateStatusInput,
} from './types';

// Export API functions (for testing or direct use)
export { mockPurchaseOrderMutationAPI } from './api';

// Export CRUD mutations
export {
  useCreatePurchaseOrder,
  useUpdatePurchaseOrder,
  useDeletePurchaseOrder,
  useDuplicatePurchaseOrder,
} from './usePOCRUDMutations';

// Export line item mutations
export {
  useAddLineItem,
  useUpdateLineItem,
  useRemoveLineItem,
} from './usePOItemMutations';

// Export approval workflow mutations
export {
  useSubmitForApproval,
  useApprovePurchaseOrder,
  useRejectPurchaseOrder,
  useCancelPurchaseOrder,
} from './usePOApprovalMutations';

// Export receiving mutations
export {
  useCreateReceipt,
  useUpdateReceipt,
} from './usePOReceivingMutations';

// Export status mutations
export {
  useSendPurchaseOrder,
  useAcknowledgePurchaseOrder,
  useClosePurchaseOrder,
} from './usePOStatusMutations';

// Export bulk operations
export {
  useBulkUpdateStatus,
  useBulkDeletePurchaseOrders,
  useExportPurchaseOrders,
} from './usePOBulkMutations';

/**
 * Combined mutation object for easy import of all hooks at once.
 * Useful for contexts or when you need multiple hooks.
 *
 * @example
 * ```tsx
 * import { purchaseOrderMutations } from '@/hooks/domains/purchase-orders/mutations';
 *
 * // Use individual hooks
 * const { useCreatePurchaseOrder, useUpdatePurchaseOrder } = purchaseOrderMutations;
 * ```
 */
export const purchaseOrderMutations = {
  // CRUD operations
  useCreatePurchaseOrder: () => import('./usePOCRUDMutations').then(m => m.useCreatePurchaseOrder),
  useUpdatePurchaseOrder: () => import('./usePOCRUDMutations').then(m => m.useUpdatePurchaseOrder),
  useDeletePurchaseOrder: () => import('./usePOCRUDMutations').then(m => m.useDeletePurchaseOrder),
  useDuplicatePurchaseOrder: () => import('./usePOCRUDMutations').then(m => m.useDuplicatePurchaseOrder),

  // Line item operations
  useAddLineItem: () => import('./usePOItemMutations').then(m => m.useAddLineItem),
  useUpdateLineItem: () => import('./usePOItemMutations').then(m => m.useUpdateLineItem),
  useRemoveLineItem: () => import('./usePOItemMutations').then(m => m.useRemoveLineItem),

  // Approval workflow
  useSubmitForApproval: () => import('./usePOApprovalMutations').then(m => m.useSubmitForApproval),
  useApprovePurchaseOrder: () => import('./usePOApprovalMutations').then(m => m.useApprovePurchaseOrder),
  useRejectPurchaseOrder: () => import('./usePOApprovalMutations').then(m => m.useRejectPurchaseOrder),
  useCancelPurchaseOrder: () => import('./usePOApprovalMutations').then(m => m.useCancelPurchaseOrder),

  // Receiving operations
  useCreateReceipt: () => import('./usePOReceivingMutations').then(m => m.useCreateReceipt),
  useUpdateReceipt: () => import('./usePOReceivingMutations').then(m => m.useUpdateReceipt),

  // Status operations
  useSendPurchaseOrder: () => import('./usePOStatusMutations').then(m => m.useSendPurchaseOrder),
  useAcknowledgePurchaseOrder: () => import('./usePOStatusMutations').then(m => m.useAcknowledgePurchaseOrder),
  useClosePurchaseOrder: () => import('./usePOStatusMutations').then(m => m.useClosePurchaseOrder),

  // Bulk operations
  useBulkUpdateStatus: () => import('./usePOBulkMutations').then(m => m.useBulkUpdateStatus),
  useBulkDeletePurchaseOrders: () => import('./usePOBulkMutations').then(m => m.useBulkDeletePurchaseOrders),
  useExportPurchaseOrders: () => import('./usePOBulkMutations').then(m => m.useExportPurchaseOrders),
};
