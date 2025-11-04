/**
 * Purchase Order Approval Workflow Mutation Hooks
 *
 * Provides React Query mutation hooks for approval workflow operations:
 * - Submit purchase orders for approval
 * - Approve purchase orders (at various levels)
 * - Reject purchase orders with reasons
 * - Cancel purchase orders
 *
 * Purchase Order Approval Workflow:
 * ```
 * DRAFT → (submit) → PENDING_APPROVAL
 *   ↓                      ↓              ↓
 * (cancel)           (approve)      (reject)
 *   ↓                      ↓              ↓
 * CANCELLED              APPROVED      REJECTED
 * ```
 *
 * Approval Levels:
 * - Level 1: Manager approval (typically up to $10,000)
 * - Level 2: Director approval (typically up to $50,000)
 * - Level 3: VP/Executive approval (over $50,000)
 *
 * @module hooks/domains/purchase-orders/mutations/usePOApprovalMutations
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { purchaseOrderKeys, invalidatePOQueries, PurchaseOrder, POApprovalWorkflow } from '../config';
import { mockPurchaseOrderMutationAPI } from './api';
import {
  ApprovePurchaseOrderInput,
  RejectPurchaseOrderInput,
  CancelPurchaseOrderInput,
} from './types';

/**
 * Mutation hook for submitting a purchase order for approval.
 *
 * Transitions purchase order from DRAFT → PENDING_APPROVAL status.
 * Triggers approval workflow based on PO amount and organizational rules.
 *
 * Submission Requirements:
 * - PO must be in DRAFT status
 * - All required fields completed
 * - At least one line item
 * - Valid vendor information
 * - Addresses and terms specified
 *
 * After submission:
 * - PO becomes read-only
 * - Approvers are notified
 * - Approval workflow is initiated
 * - Cannot be edited (only cancelled and re-created)
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for submitting purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: submitForApproval, isLoading } = useSubmitForApproval();
 *
 * const handleSubmit = (poId: string) => {
 *   submitForApproval(poId, {
 *     onSuccess: () => {
 *       toast.success('Submitted - approvers have been notified');
 *       navigate('/purchase-orders');
 *     }
 *   });
 * };
 * ```
 */
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
 * Multi-Level Approval:
 * - Level 1: Manager reviews and approves
 * - Level 2: Director approves if amount exceeds threshold
 * - Level 3: VP approves for high-value purchases
 * - All levels must approve before PO reaches APPROVED status
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

/**
 * Mutation hook for rejecting a purchase order.
 *
 * Transitions purchase order from PENDING_APPROVAL → REJECTED status.
 * Rejection stops the approval workflow and requires requester action.
 *
 * Rejection Process:
 * - Approver provides rejection reason (required)
 * - Optional notes for additional context
 * - Requester is notified immediately
 * - PO returns to DRAFT (or remains REJECTED)
 * - Requester can address issues and resubmit
 *
 * Common Rejection Reasons:
 * - Budget constraints or lack of budget approval
 * - Vendor issues (non-preferred, pricing concerns)
 * - Insufficient justification or documentation
 * - Alternative solutions recommended
 * - Out of policy or scope
 *
 * After Rejection:
 * - Requester can edit and resubmit
 * - Or requester can cancel the PO
 * - Rejection is logged in audit trail
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for rejecting purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: reject, isLoading } = useRejectPurchaseOrder();
 *
 * const handleReject = (formData) => {
 *   reject({
 *     purchaseOrderId: 'po-123',
 *     approverLevel: 2,
 *     approverId: currentUserId,
 *     rejectionReason: 'Exceeds department budget - requires VP approval'
 *   }, {
 *     onSuccess: () => {
 *       navigate('/purchase-orders/pending-approval');
 *     }
 *   });
 * };
 * ```
 */
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

/**
 * Mutation hook for cancelling a purchase order.
 *
 * Transitions purchase order to CANCELLED status from any state.
 * Cancellation is typically permanent and stops all workflows.
 *
 * Can Cancel From:
 * - DRAFT: No longer needed
 * - PENDING_APPROVAL: Withdraw from approval process
 * - APPROVED: Before sending to vendor
 * - SENT: Cancel order with vendor (may have penalties)
 * - ACKNOWLEDGED: Cancel confirmed order (vendor coordination required)
 *
 * Cannot Cancel:
 * - PARTIALLY_RECEIVED: Items already received
 * - RECEIVED: Order fulfilled
 * - CLOSED: Order completed
 *
 * Cancellation Process:
 * - Provide cancellation reason (optional)
 * - System validates cancellation is allowed
 * - Notifications sent to stakeholders
 * - Budget released (if allocated)
 * - Vendor notified (if already sent)
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for cancelling purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: cancel, isLoading } = useCancelPurchaseOrder();
 *
 * const handleCancel = (poId: string) => {
 *   if (confirm('Cancel this purchase order?')) {
 *     cancel({
 *       poId,
 *       reason: 'Requirements changed - no longer needed'
 *     }, {
 *       onSuccess: () => {
 *         navigate('/purchase-orders');
 *       }
 *     });
 *   }
 * };
 * ```
 */
export const useCancelPurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, CancelPurchaseOrderInput>
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
