/**
 * Purchase Order Mutation Hooks
 *
 * Provides React Query mutation hooks for all purchase order state changes and actions:
 * - CRUD operations (create, update, delete, duplicate)
 * - Line item management (add, update, remove)
 * - Workflow transitions (submit, approve, reject, cancel)
 * - Receiving operations (create receipts, update receipts)
 * - Status updates (send, acknowledge, close)
 * - Bulk operations (bulk update, bulk delete)
 * - Export functionality
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

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  purchaseOrderKeys,
  invalidatePOQueries,
  PurchaseOrder,
  POLineItem,
  POApprovalWorkflow,
  POReceipt,
} from '../config';

/**
 * Input data for creating a new purchase order.
 *
 * @interface CreatePurchaseOrderInput
 * @property {string} title - Purchase order title/description
 * @property {string} [description] - Detailed description
 * @property {string} vendorId - Vendor/supplier identifier
 * @property {string} requestedDeliveryDate - Desired delivery date (ISO format)
 * @property {object} shippingAddress - Delivery address
 * @property {object} billingAddress - Billing address
 * @property {POLineItem[]} lineItems - Order line items (min: 1 required)
 * @property {string} paymentTerms - Payment terms (e.g., "Net 30", "COD")
 * @property {string} deliveryTerms - Delivery terms (e.g., "FOB", "CIF")
 * @property {string} [notes] - Additional notes or special instructions
 * @property {string} [budgetCode] - Budget code for accounting
 * @property {string} [projectCode] - Project code for tracking
 * @property {string} [departmentId] - Requesting department
 */
interface CreatePurchaseOrderInput {
  title: string;
  description?: string;
  vendorId: string;
  requestedDeliveryDate: string;
  shippingAddress: any;
  billingAddress: any;
  lineItems: Omit<POLineItem, 'id' | 'createdAt' | 'updatedAt'>[];
  paymentTerms: string;
  deliveryTerms: string;
  notes?: string;
  budgetCode?: string;
  projectCode?: string;
  departmentId?: string;
}

interface UpdatePurchaseOrderInput extends Partial<CreatePurchaseOrderInput> {
  id: string;
}

/**
 * Input data for approving a purchase order.
 *
 * @interface ApprovePurchaseOrderInput
 * @property {string} purchaseOrderId - Purchase order to approve
 * @property {number} approverLevel - Approval level (1 = Manager, 2 = Director, 3 = VP)
 * @property {string} approverId - Approver user ID
 * @property {string} [notes] - Optional approval notes
 */
interface ApprovePurchaseOrderInput {
  purchaseOrderId: string;
  approverLevel: number;
  approverId: string;
  notes?: string;
}

/**
 * Input data for rejecting a purchase order.
 *
 * @interface RejectPurchaseOrderInput
 * @property {string} purchaseOrderId - Purchase order to reject
 * @property {number} approverLevel - Rejection level
 * @property {string} approverId - Rejector user ID
 * @property {string} rejectionReason - Required reason for rejection
 */
interface RejectPurchaseOrderInput {
  purchaseOrderId: string;
  approverLevel: number;
  approverId: string;
  rejectionReason: string;
}

/**
 * Input data for creating a receipt when items are received.
 *
 * @interface CreateReceiptInput
 * @property {string} purchaseOrderId - Purchase order being received
 * @property {string} receivedBy - User ID of person receiving items
 * @property {string} receivingLocation - Location where items were received
 * @property {Array} lineItems - Received line items with quantities and condition
 * @property {boolean} [inspectionRequired] - Whether items require inspection
 * @property {string} [notes] - Receiving notes
 * @property {string} [issuesReported] - Any issues or discrepancies
 */
interface CreateReceiptInput {
  purchaseOrderId: string;
  receivedBy: string;
  receivingLocation: string;
  lineItems: Array<{
    poLineItemId: string;
    quantityReceived: number;
    quantityAccepted: number;
    quantityRejected: number;
    quantityDamaged: number;
    condition: 'GOOD' | 'DAMAGED' | 'DEFECTIVE' | 'WRONG_ITEM' | 'EXPIRED';
    notes?: string;
    lotNumbers?: string[];
    serialNumbers?: string[];
    expirationDate?: string;
  }>;
  inspectionRequired?: boolean;
  notes?: string;
  issuesReported?: string;
}

// Mock API functions (replace with actual API calls)
const mockPurchaseOrderMutationAPI = {
  // Purchase Order CRUD
  createPurchaseOrder: async (data: CreatePurchaseOrderInput): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...data, id: 'new-po-id' } as PurchaseOrder;
  },
  
  updatePurchaseOrder: async (data: UpdatePurchaseOrderInput): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return data as PurchaseOrder;
  },
  
  deletePurchaseOrder: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  duplicatePurchaseOrder: async (id: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { id: 'duplicated-po-id' } as PurchaseOrder;
  },
  
  // Line Items
  addLineItem: async (poId: string, lineItem: Omit<POLineItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<POLineItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...lineItem, id: 'new-line-item-id' } as POLineItem;
  },
  
  updateLineItem: async (id: string, updates: Partial<POLineItem>): Promise<POLineItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...updates, id } as POLineItem;
  },
  
  removeLineItem: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  // Approval Workflow
  approvePurchaseOrder: async (data: ApprovePurchaseOrderInput): Promise<POApprovalWorkflow> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {} as POApprovalWorkflow;
  },
  
  rejectPurchaseOrder: async (data: RejectPurchaseOrderInput): Promise<POApprovalWorkflow> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {} as POApprovalWorkflow;
  },
  
  submitForApproval: async (poId: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: poId, status: 'PENDING_APPROVAL' } as PurchaseOrder;
  },
  
  cancelPurchaseOrder: async (poId: string, reason?: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: poId, status: 'CANCELLED' } as PurchaseOrder;
  },
  
  // Receipts
  createReceipt: async (data: CreateReceiptInput): Promise<POReceipt> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...data, id: 'new-receipt-id' } as POReceipt;
  },
  
  updateReceipt: async (id: string, updates: Partial<POReceipt>): Promise<POReceipt> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...updates, id } as POReceipt;
  },
  
  // Status Updates
  sendPurchaseOrder: async (poId: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: poId, status: 'SENT' } as PurchaseOrder;
  },
  
  acknowledgePurchaseOrder: async (poId: string, acknowledgedDate: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: poId, status: 'ACKNOWLEDGED' } as PurchaseOrder;
  },
  
  closePurchaseOrder: async (poId: string): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: poId, status: 'CLOSED' } as PurchaseOrder;
  },
  
  // Bulk Operations
  bulkUpdateStatus: async (poIds: string[], status: string): Promise<PurchaseOrder[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return poIds.map(id => ({ id, status } as PurchaseOrder));
  },
  
  bulkDelete: async (poIds: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },
  
  // Export
  exportPurchaseOrders: async (filters?: any): Promise<{ downloadUrl: string }> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { downloadUrl: 'https://example.com/export/purchase-orders.xlsx' };
  },
};

// Purchase Order Mutations
export const useCreatePurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, CreatePurchaseOrderInput>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.createPurchaseOrder,
    onSuccess: (newPO) => {
      // Invalidate and refetch purchase orders list
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      toast.success(`Purchase Order ${newPO.poNumber || newPO.id} created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create purchase order: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdatePurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, UpdatePurchaseOrderInput>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.updatePurchaseOrder,
    onSuccess: (updatedPO) => {
      // Update the specific PO in cache
      queryClient.setQueryData(
        purchaseOrderKeys.purchaseOrderDetails(updatedPO.id),
        updatedPO
      );
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      toast.success(`Purchase Order updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update purchase order: ${error.message}`);
    },
    ...options,
  });
};

export const useDeletePurchaseOrder = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.deletePurchaseOrder,
    onSuccess: (_, poId) => {
      invalidatePOQueries(queryClient, poId);
      toast.success('Purchase Order deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete purchase order: ${error.message}`);
    },
    ...options,
  });
};

export const useDuplicatePurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, string>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.duplicatePurchaseOrder,
    onSuccess: (duplicatedPO) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      toast.success(`Purchase Order duplicated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to duplicate purchase order: ${error.message}`);
    },
    ...options,
  });
};

// Line Item Mutations
export const useAddLineItem = (
  options?: UseMutationOptions<POLineItem, Error, { poId: string; lineItem: Omit<POLineItem, 'id' | 'createdAt' | 'updatedAt'> }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ poId, lineItem }) => mockPurchaseOrderMutationAPI.addLineItem(poId, lineItem),
    onSuccess: (_, { poId }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lineItems(poId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails(poId) });
      toast.success('Line item added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add line item: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateLineItem = (
  options?: UseMutationOptions<POLineItem, Error, { id: string; updates: Partial<POLineItem>; poId: string }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }) => mockPurchaseOrderMutationAPI.updateLineItem(id, updates),
    onSuccess: (_, { poId }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lineItems(poId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails(poId) });
      toast.success('Line item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update line item: ${error.message}`);
    },
    ...options,
  });
};

export const useRemoveLineItem = (
  options?: UseMutationOptions<void, Error, { id: string; poId: string }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id }) => mockPurchaseOrderMutationAPI.removeLineItem(id),
    onSuccess: (_, { poId }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lineItems(poId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails(poId) });
      toast.success('Line item removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove line item: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Mutation hook for approving a purchase order.
 *
 * Transitions purchase order from PENDING_APPROVAL → APPROVED state.
 * May trigger additional workflow actions based on approval level:
 * - Final approval may auto-send to vendor
 * - Approval may trigger budget allocation
 * - Approval notifications sent to requester
 *
 * Business Rules:
 * - User must have approval authority at specified level
 * - PO must be in PENDING_APPROVAL status
 * - All required approvals must be obtained before sending
 * - Approval is logged in audit trail
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for approving purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: approve, isLoading } = useApprovePurchaseOrder();
 *
 * const handleApprove = () => {
 *   approve({
 *     purchaseOrderId: 'po-123',
 *     approverLevel: 2,
 *     approverId: currentUserId,
 *     notes: 'Approved for budgetary compliance'
 *   }, {
 *     onSuccess: () => {
 *       navigate('/purchase-orders');
 *     }
 *   });
 * };
 * ```
 */
export const useApprovePurchaseOrder = (
  options?: UseMutationOptions<POApprovalWorkflow, Error, ApprovePurchaseOrderInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.approvePurchaseOrder,
    onSuccess: (_, { purchaseOrderId }) => {
      invalidatePOQueries(queryClient, purchaseOrderId);
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.approvalWorkflowsList() });
      toast.success('Purchase Order approved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve purchase order: ${error.message}`);
    },
    ...options,
  });
};

export const useRejectPurchaseOrder = (
  options?: UseMutationOptions<POApprovalWorkflow, Error, RejectPurchaseOrderInput>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.rejectPurchaseOrder,
    onSuccess: (_, { purchaseOrderId }) => {
      invalidatePOQueries(queryClient, purchaseOrderId);
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.approvalWorkflowsList() });
      toast.success('Purchase Order rejected');
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject purchase order: ${error.message}`);
    },
    ...options,
  });
};

export const useSubmitForApproval = (
  options?: UseMutationOptions<PurchaseOrder, Error, string>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.submitForApproval,
    onSuccess: (_, poId) => {
      invalidatePOQueries(queryClient, poId);
      toast.success('Purchase Order submitted for approval');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit for approval: ${error.message}`);
    },
    ...options,
  });
};

export const useCancelPurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, { poId: string; reason?: string }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ poId, reason }) => mockPurchaseOrderMutationAPI.cancelPurchaseOrder(poId, reason),
    onSuccess: (_, { poId }) => {
      invalidatePOQueries(queryClient, poId);
      toast.success('Purchase Order cancelled');
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel purchase order: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Mutation hook for creating a receipt when items are received.
 *
 * Records receiving transaction with quantities, condition, and inspection data.
 * Updates purchase order status based on fulfillment:
 * - Partially received: Some items received, others pending
 * - Fully received: All items received
 * - Auto-closes PO if configured and all items accepted
 *
 * Receiving Process:
 * 1. Physical items delivered
 * 2. Receiver inspects and counts items
 * 3. Receipt created with actual quantities
 * 4. Discrepancies (damaged, wrong items) recorded
 * 5. PO status updated based on fulfillment
 * 6. Inventory updated with received quantities
 *
 * Validation Rules:
 * - Cannot receive more than ordered quantity
 * - Must specify condition for each line item
 * - Lot/serial numbers required for tracked items
 * - Expiration dates required for perishables
 * - Inspection required for high-value items
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for creating receipts
 *
 * @example
 * ```tsx
 * const { mutate: createReceipt, isLoading } = useCreateReceipt();
 *
 * const handleReceive = (formData) => {
 *   createReceipt({
 *     purchaseOrderId: 'po-123',
 *     receivedBy: currentUserId,
 *     receivingLocation: 'warehouse-a',
 *     lineItems: [
 *       {
 *         poLineItemId: 'line-1',
 *         quantityReceived: 100,
 *         quantityAccepted: 98,
 *         quantityRejected: 2,
 *         quantityDamaged: 0,
 *         condition: 'GOOD',
 *         notes: '2 units damaged in shipping',
 *         lotNumbers: ['LOT-2025-001']
 *       }
 *     ],
 *     inspectionRequired: true,
 *     notes: 'Received in good condition overall'
 *   });
 * };
 * ```
 */
export const useCreateReceipt = (
  options?: UseMutationOptions<POReceipt, Error, CreateReceiptInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.createReceipt,
    onSuccess: (_, { purchaseOrderId }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.receipts(purchaseOrderId) });
      invalidatePOQueries(queryClient, purchaseOrderId);
      toast.success('Receipt created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create receipt: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateReceipt = (
  options?: UseMutationOptions<POReceipt, Error, { id: string; updates: Partial<POReceipt>; poId: string }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }) => mockPurchaseOrderMutationAPI.updateReceipt(id, updates),
    onSuccess: (_, { poId }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.receipts(poId) });
      invalidatePOQueries(queryClient, poId);
      toast.success('Receipt updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update receipt: ${error.message}`);
    },
    ...options,
  });
};

// Status Update Mutations
export const useSendPurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, string>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.sendPurchaseOrder,
    onSuccess: (_, poId) => {
      invalidatePOQueries(queryClient, poId);
      toast.success('Purchase Order sent successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send purchase order: ${error.message}`);
    },
    ...options,
  });
};

export const useAcknowledgePurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, { poId: string; acknowledgedDate: string }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ poId, acknowledgedDate }) => mockPurchaseOrderMutationAPI.acknowledgePurchaseOrder(poId, acknowledgedDate),
    onSuccess: (_, { poId }) => {
      invalidatePOQueries(queryClient, poId);
      toast.success('Purchase Order acknowledged');
    },
    onError: (error: Error) => {
      toast.error(`Failed to acknowledge purchase order: ${error.message}`);
    },
    ...options,
  });
};

export const useClosePurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, string>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.closePurchaseOrder,
    onSuccess: (_, poId) => {
      invalidatePOQueries(queryClient, poId);
      toast.success('Purchase Order closed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to close purchase order: ${error.message}`);
    },
    ...options,
  });
};

// Bulk Operations
export const useBulkUpdateStatus = (
  options?: UseMutationOptions<PurchaseOrder[], Error, { poIds: string[]; status: string }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ poIds, status }) => mockPurchaseOrderMutationAPI.bulkUpdateStatus(poIds, status),
    onSuccess: (_, { poIds }) => {
      poIds.forEach(poId => invalidatePOQueries(queryClient, poId));
      toast.success(`${poIds.length} purchase orders updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update purchase orders: ${error.message}`);
    },
    ...options,
  });
};

export const useBulkDeletePurchaseOrders = (
  options?: UseMutationOptions<void, Error, string[]>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.bulkDelete,
    onSuccess: (_, poIds) => {
      poIds.forEach(poId => invalidatePOQueries(queryClient, poId));
      toast.success(`${poIds.length} purchase orders deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete purchase orders: ${error.message}`);
    },
    ...options,
  });
};

// Export Mutation
export const useExportPurchaseOrders = (
  options?: UseMutationOptions<{ downloadUrl: string }, Error, any>
) => {
  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.exportPurchaseOrders,
    onSuccess: (result) => {
      // Trigger download
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = 'purchase-orders-export.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Purchase Orders export completed');
    },
    onError: (error: Error) => {
      toast.error(`Failed to export purchase orders: ${error.message}`);
    },
    ...options,
  });
};

// Combined mutation object for easy import
export const purchaseOrderMutations = {
  useCreatePurchaseOrder,
  useUpdatePurchaseOrder,
  useDeletePurchaseOrder,
  useDuplicatePurchaseOrder,
  useAddLineItem,
  useUpdateLineItem,
  useRemoveLineItem,
  useApprovePurchaseOrder,
  useRejectPurchaseOrder,
  useSubmitForApproval,
  useCancelPurchaseOrder,
  useCreateReceipt,
  useUpdateReceipt,
  useSendPurchaseOrder,
  useAcknowledgePurchaseOrder,
  useClosePurchaseOrder,
  useBulkUpdateStatus,
  useBulkDeletePurchaseOrders,
  useExportPurchaseOrders,
};
