/**
 * Create Purchase Order Workflow Hook
 *
 * Orchestrates PO creation with optional auto-submission for approval.
 *
 * @module hooks/domains/purchase-orders/composites/useCreatePurchaseOrderWorkflow
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  useCreatePurchaseOrder,
  useSubmitForApproval,
} from '../mutations/usePurchaseOrderMutations';
import { purchaseOrderKeys } from '../config';
import { CreatePOWorkflowInput } from './types';

/**
 * Create Purchase Order Workflow Composite Hook.
 *
 * Creates a purchase order and optionally submits it for approval in a single workflow.
 *
 * @returns {UseMutationResult} Mutation result with PO creation workflow
 *
 * @example
 * ```tsx
 * const createWorkflow = useCreatePurchaseOrderWorkflow();
 *
 * const handleCreate = () => {
 *   createWorkflow.mutate({
 *     purchaseOrder: { title: 'New PO', vendorId: '123', ... },
 *     lineItems: [{ description: 'Item 1', quantityOrdered: 10, ... }],
 *     autoSubmit: true
 *   });
 * };
 * ```
 */
export const useCreatePurchaseOrderWorkflow = () => {
  const queryClient = useQueryClient();
  const createPOMutation = useCreatePurchaseOrder();
  const submitForApprovalMutation = useSubmitForApproval();

  return useMutation({
    mutationFn: async (input: CreatePOWorkflowInput) => {
      // Step 1: Create the purchase order
      const purchaseOrder = await createPOMutation.mutateAsync({
        ...input.purchaseOrder,
        lineItems: input.lineItems.map((item, index) => ({
          ...item,
          lineNumber: index + 1,
          discountPercent: 0,
          discountAmount: 0,
          lineTotal: item.quantityOrdered * item.unitPrice,
          status: 'PENDING' as const,
          quantityReceived: 0,
          quantityInvoiced: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      });

      // Step 2: Auto-submit for approval if requested
      if (input.autoSubmit) {
        await submitForApprovalMutation.mutateAsync(purchaseOrder.id);
      }

      return purchaseOrder;
    },
    onSuccess: (purchaseOrder) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      toast.success(`Purchase Order created${purchaseOrder.status === 'PENDING_APPROVAL' ? ' and submitted for approval' : ''}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create purchase order workflow: ${error.message}`);
    },
  });
};
