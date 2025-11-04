/**
 * Purchase Order Receiving Mutation Hooks
 *
 * Provides React Query mutation hooks for receiving operations:
 * - Create receipts when items are received
 * - Update receipts for corrections or adjustments
 *
 * Receiving Process Flow:
 * ```
 * SENT/ACKNOWLEDGED → (receive items) → PARTIALLY_RECEIVED
 *                                              ↓
 *                                    (receive remaining) → RECEIVED
 *                                              ↓
 *                                          (close) → CLOSED
 * ```
 *
 * Receipt Types:
 * - Partial Receipt: Some items received, others pending
 * - Full Receipt: All items received and accepted
 * - Damaged Receipt: Items received but damaged
 * - Rejected Receipt: Items received but rejected (wrong items, defects)
 *
 * @module hooks/domains/purchase-orders/mutations/usePOReceivingMutations
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { purchaseOrderKeys, invalidatePOQueries, POReceipt } from '../config';
import { mockPurchaseOrderMutationAPI } from './api';
import { CreateReceiptInput, UpdateReceiptInput } from './types';

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
 * - Cannot receive more than ordered quantity (without approval)
 * - Must specify condition for each line item
 * - Lot/serial numbers required for tracked items
 * - Expiration dates required for perishables
 * - Inspection required for high-value items
 *
 * Receipt Components:
 * - Quantity Received: Total items delivered
 * - Quantity Accepted: Items in good condition
 * - Quantity Rejected: Items refused (wrong item, defective)
 * - Quantity Damaged: Items received but damaged
 * - Condition: Overall condition assessment
 * - Lot/Serial Numbers: Traceability data
 * - Expiration Dates: For time-sensitive items
 * - Notes: Additional observations
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
 *   }, {
 *     onSuccess: () => {
 *       toast.success('Items received and inventory updated');
 *       navigate(`/purchase-orders/${formData.purchaseOrderId}`);
 *     }
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

/**
 * Mutation hook for updating an existing receipt.
 *
 * Updates receipt information for corrections or adjustments.
 * Common update scenarios:
 * - Quantity corrections after detailed inspection
 * - Condition changes after quality review
 * - Additional notes or documentation
 * - Lot/serial number corrections
 * - Issue escalation or resolution
 *
 * Update Rules:
 * - Cannot modify receipt after inventory has been allocated
 * - Changes may require supervisor approval
 * - Updates are logged in audit trail
 * - Inventory adjustments triggered if quantities change
 *
 * Typical Updates:
 * - Add inspection results and photos
 * - Update condition assessment
 * - Add or correct lot/serial numbers
 * - Document issues or discrepancies
 * - Update receiving notes
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for updating receipts
 *
 * @example
 * ```tsx
 * const { mutate: updateReceipt, isLoading } = useUpdateReceipt();
 *
 * const handleUpdate = (receiptId: string, updates) => {
 *   updateReceipt({
 *     id: receiptId,
 *     poId: 'po-123',
 *     updates: {
 *       notes: 'Additional inspection revealed 3 more damaged units',
 *       issuesReported: 'Packaging was inadequate - reported to vendor'
 *     }
 *   }, {
 *     onSuccess: () => {
 *       toast.success('Receipt updated');
 *     }
 *   });
 * };
 * ```
 */
export const useUpdateReceipt = (
  options?: UseMutationOptions<POReceipt, Error, UpdateReceiptInput>
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
