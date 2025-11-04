/**
 * Approval Workflow Hook
 *
 * Orchestrates PO approval/rejection with automatic status progression.
 *
 * @module hooks/domains/purchase-orders/composites/useApprovalWorkflow
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  useApprovePurchaseOrder,
  useRejectPurchaseOrder,
  useSendPurchaseOrder,
} from '../mutations/usePurchaseOrderMutations';
import { purchaseOrderKeys } from '../config';
import { ApprovalWorkflowInput } from './types';

/**
 * Approval Workflow Composite Hook.
 *
 * Handles PO approval or rejection, with auto-send on final approval.
 *
 * @returns {UseMutationResult} Mutation result with approval workflow
 *
 * @example
 * ```tsx
 * const approvalWorkflow = useApprovalWorkflow();
 *
 * const handleApprove = () => {
 *   approvalWorkflow.mutate({
 *     purchaseOrderId: 'po-123',
 *     action: 'approve',
 *     approverLevel: 1,
 *     approverId: 'user-456',
 *     notes: 'Looks good'
 *   });
 * };
 * ```
 */
export const useApprovalWorkflow = () => {
  const queryClient = useQueryClient();
  const approveMutation = useApprovePurchaseOrder();
  const rejectMutation = useRejectPurchaseOrder();
  const sendMutation = useSendPurchaseOrder();

  return useMutation({
    mutationFn: async (input: ApprovalWorkflowInput) => {
      if (input.action === 'approve') {
        const approvalResult = await approveMutation.mutateAsync({
          purchaseOrderId: input.purchaseOrderId,
          approverLevel: input.approverLevel,
          approverId: input.approverId,
          notes: input.notes,
        });

        // Check if this was the final approval and auto-send if configured
        // This would depend on your business logic
        const shouldAutoSend = true; // Replace with actual business logic
        if (shouldAutoSend) {
          await sendMutation.mutateAsync(input.purchaseOrderId);
        }

        return approvalResult;
      } else {
        return await rejectMutation.mutateAsync({
          purchaseOrderId: input.purchaseOrderId,
          approverLevel: input.approverLevel,
          approverId: input.approverId,
          rejectionReason: input.rejectionReason || 'No reason provided',
        });
      }
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails(input.purchaseOrderId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.approvalWorkflowsList() });

      const actionText = input.action === 'approve' ? 'approved' : 'rejected';
      toast.success(`Purchase Order ${actionText} successfully`);
    },
    onError: (error: Error, input) => {
      const actionText = input.action === 'approve' ? 'approve' : 'reject';
      toast.error(`Failed to ${actionText} purchase order: ${error.message}`);
    },
  });
};
