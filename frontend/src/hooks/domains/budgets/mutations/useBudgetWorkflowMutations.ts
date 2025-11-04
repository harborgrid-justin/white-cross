/**
 * Budget Workflow Mutation Hooks
 *
 * Provides TanStack Query mutation hooks for budget approval workflow.
 * Handles status transitions and approval/rejection operations.
 *
 * @module hooks/domains/budgets/mutations/useBudgetWorkflowMutations
 *
 * @remarks
 * **Workflow:**
 * - Draft budgets created in DRAFT status
 * - Approval changes status to ACTIVE
 * - Only ACTIVE budgets can have approved transactions
 *
 * **Cache Strategy:**
 * - Invalidates budget detail
 * - Invalidates budget lists (affects status filters)
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetCRUDMutations} for budget CRUD operations
 * @see {@link useBudgetApprovalMutations} for transaction approvals
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { budgetKeys } from '../budgetQueryKeys';
import type { Budget } from '../budgetTypes';

/**
 * Approves a budget, changing its status to ACTIVE.
 *
 * Mutation hook for budget approval workflow. Approves a draft budget, making it
 * active for transactions. Optionally records an approval note.
 *
 * @returns {UseMutationResult} TanStack Query mutation result
 *
 * @example
 * ```typescript
 * const approveBudget = useApproveBudget();
 * approveBudget.mutate({
 *   budgetId: 'budget-123',
 *   approvalNote: 'Approved for FY2024'
 * });
 * ```
 *
 * @remarks
 * - POST /api/budgets/:budgetId/approve
 * - Status: DRAFT → ACTIVE
 * - Records approver and timestamp
 * - Requires approver/admin role
 *
 * @see {@link useUpdateBudget} for general updates
 * @since 1.0.0
 */
export const useApproveBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ budgetId, approvalNote }: {
      budgetId: string;
      approvalNote?: string;
    }): Promise<Budget> => {
      const response = await fetch(`/api/budgets/${budgetId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalNote }),
      });
      if (!response.ok) throw new Error('Failed to approve budget');
      return response.json();
    },
    onSuccess: (approvedBudget, { budgetId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Budget "${approvedBudget.name}" approved successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve budget: ${error.message}`);
    },
  });
};
