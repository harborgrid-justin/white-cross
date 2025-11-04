/**
 * Purchase Order Status Mutation Hooks
 *
 * Provides React Query mutation hooks for status transition operations:
 * - Send purchase order to vendor
 * - Acknowledge receipt by vendor
 * - Close purchase order
 *
 * Status Transition Flow:
 * ```
 * APPROVED → (send) → SENT → (acknowledge) → ACKNOWLEDGED
 *                                                  ↓
 *                                            (receive items)
 *                                                  ↓
 *                                    PARTIALLY_RECEIVED / RECEIVED
 *                                                  ↓
 *                                             (close)
 *                                                  ↓
 *                                               CLOSED
 * ```
 *
 * Status Descriptions:
 * - SENT: PO transmitted to vendor (email, EDI, portal)
 * - ACKNOWLEDGED: Vendor confirmed receipt and acceptance
 * - CLOSED: PO completed and archived (no further action)
 *
 * @module hooks/domains/purchase-orders/mutations/usePOStatusMutations
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { purchaseOrderKeys, invalidatePOQueries, PurchaseOrder } from '../config';
import { mockPurchaseOrderMutationAPI } from './api';
import { AcknowledgePurchaseOrderInput } from './types';

/**
 * Mutation hook for sending a purchase order to the vendor.
 *
 * Transitions purchase order from APPROVED → SENT status.
 * Triggers transmission of PO to vendor via:
 * - Email with PDF attachment
 * - EDI transaction (if vendor supports)
 * - Vendor portal integration
 * - Fax (for legacy vendors)
 *
 * Send Process:
 * 1. Validates PO is approved and complete
 * 2. Generates PO document (PDF)
 * 3. Transmits to vendor via configured method
 * 4. Records send timestamp and method
 * 5. Updates status to SENT
 * 6. Notifications sent to stakeholders
 *
 * Prerequisites:
 * - PO must be in APPROVED status
 * - All required approvals obtained
 * - Vendor contact information complete
 * - Payment terms and addresses verified
 *
 * After Sending:
 * - Await vendor acknowledgment
 * - Track expected delivery date
 * - Monitor for vendor questions or issues
 * - Cannot edit PO (only cancel if needed)
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for sending purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: sendPO, isLoading } = useSendPurchaseOrder();
 *
 * const handleSend = (poId: string) => {
 *   sendPO(poId, {
 *     onSuccess: () => {
 *       toast.success('PO sent to vendor - awaiting acknowledgment');
 *       navigate('/purchase-orders');
 *     }
 *   });
 * };
 * ```
 */
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

/**
 * Mutation hook for acknowledging a purchase order from the vendor.
 *
 * Transitions purchase order from SENT → ACKNOWLEDGED status.
 * Records that vendor has received, reviewed, and accepted the PO.
 *
 * Acknowledgment Process:
 * - Vendor receives purchase order
 * - Vendor confirms order acceptance
 * - Vendor provides confirmation number
 * - System records acknowledgment date/time
 * - Expected delivery date may be updated
 * - Status transitions to ACKNOWLEDGED
 *
 * Acknowledgment Types:
 * - Full Acceptance: All items accepted as ordered
 * - Partial Acceptance: Some items accepted, others substituted/backordered
 * - Conditional: Accepted with pricing or term modifications
 * - Rejected: Vendor cannot fulfill (rare - requires cancellation)
 *
 * Information Captured:
 * - Acknowledgment date/time
 * - Vendor confirmation number
 * - Revised delivery dates (if applicable)
 * - Vendor notes or special instructions
 * - Contact person at vendor
 *
 * After Acknowledgment:
 * - PO is confirmed and active
 * - Track delivery progress
 * - Prepare for receiving operations
 * - Monitor for shipment notifications
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for acknowledging purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: acknowledgePO, isLoading } = useAcknowledgePurchaseOrder();
 *
 * const handleAcknowledge = (formData) => {
 *   acknowledgePO({
 *     poId: 'po-123',
 *     acknowledgedDate: new Date().toISOString()
 *   }, {
 *     onSuccess: () => {
 *       toast.success('PO acknowledged - preparing for delivery');
 *     }
 *   });
 * };
 * ```
 */
export const useAcknowledgePurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, AcknowledgePurchaseOrderInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ poId, acknowledgedDate }) =>
      mockPurchaseOrderMutationAPI.acknowledgePurchaseOrder(poId, acknowledgedDate),
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

/**
 * Mutation hook for closing a purchase order.
 *
 * Transitions purchase order to CLOSED status - the final state.
 * Closing a PO indicates the order is complete with no further action needed.
 *
 * Close Criteria:
 * - All items received (or remaining items cancelled)
 * - All invoices paid
 * - No open issues or discrepancies
 * - Quality inspection complete (if required)
 * - All documentation finalized
 *
 * Close Scenarios:
 * - Full Fulfillment: All items received and accepted
 * - Partial with Cancel: Remaining items cancelled by agreement
 * - Administrative: Closed for record-keeping purposes
 *
 * Prerequisites:
 * - PO must be in RECEIVED or PARTIALLY_RECEIVED status
 * - Outstanding issues resolved
 * - Financial reconciliation complete
 * - Approvals obtained (if required for partial close)
 *
 * After Closing:
 * - PO is archived and read-only
 * - No further transactions allowed
 * - Historical record maintained
 * - Budget released (if any remaining)
 * - Performance metrics updated
 *
 * Close Process:
 * 1. Validate close criteria met
 * 2. Final financial reconciliation
 * 3. Archive supporting documents
 * 4. Update status to CLOSED
 * 5. Notifications sent
 * 6. Budget and accounting updates
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for closing purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: closePO, isLoading } = useClosePurchaseOrder();
 *
 * const handleClose = (poId: string) => {
 *   if (confirm('Close this purchase order? This cannot be undone.')) {
 *     closePO(poId, {
 *       onSuccess: () => {
 *         toast.success('PO closed successfully');
 *         navigate('/purchase-orders/completed');
 *       }
 *     });
 *   }
 * };
 * ```
 */
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
