/**
 * Budget Transaction Approval Mutation Hooks
 *
 * Provides TanStack Query mutation hooks for transaction approval workflow.
 * Handles approval and rejection of pending transactions with proper state transitions.
 *
 * @module hooks/domains/budgets/mutations/useBudgetApprovalMutations
 *
 * @remarks
 * **Approval Workflow:**
 * - Transactions created in PENDING status
 * - Approve: PENDING → APPROVED (affects budget amounts)
 * - Reject: PENDING → REJECTED (does NOT affect amounts)
 *
 * **Status Transitions:**
 * - PENDING: Initial state after creation
 * - APPROVED: Transaction validated and applied to budget
 * - REJECTED: Transaction denied with reason
 *
 * **Cache Strategy:**
 * - Both operations invalidate transaction, transactions list, and budget
 * - Approval also invalidates category (affects amounts)
 * - Cache invalidation ensures UI reflects updated balances
 *
 * **Budget Impact:**
 * - Only APPROVED transactions affect budget/category amounts
 * - PENDING/REJECTED transactions are tracked but don't affect balances
 * - Approval triggers recalculation of spent/remaining amounts
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetTransactionMutations} for transaction CRUD
 * @see {@link useBudgetBulkMutations} for bulk approval
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { budgetKeys } from '../budgetQueryKeys';
import type { BudgetTransaction } from '../budgetTypes';

/**
 * Approves a pending transaction, applying it to budget.
 *
 * @returns {UseMutationResult} Mutation result accepting {transactionId, approvalNote?}
 *
 * @example
 * ```typescript
 * const approveTransaction = useApproveTransaction();
 * approveTransaction.mutate({
 *   transactionId: 'tx-123',
 *   approvalNote: 'Approved - valid expense'
 * });
 * ```
 *
 * @remarks
 * **Status Change:** PENDING → APPROVED
 * **Budget Impact:** Approved transactions affect budget/category amounts
 * **Cache:** Invalidates transaction, budget, and category queries
 *
 * @see {@link useRejectTransaction}
 * @since 1.0.0
 */
export const useApproveTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, approvalNote }: {
      transactionId: string;
      approvalNote?: string;
    }): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalNote }),
      });
      if (!response.ok) throw new Error('Failed to approve transaction');
      return response.json();
    },
    onSuccess: (approvedTransaction, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(approvedTransaction.budgetId) });
      toast.success('Transaction approved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve transaction: ${error.message}`);
    },
  });
};

/**
 * Rejects a pending transaction with a reason.
 *
 * @returns {UseMutationResult} Mutation result accepting {transactionId, rejectionReason}
 *
 * @example
 * ```typescript
 * const rejectTransaction = useRejectTransaction();
 * rejectTransaction.mutate({
 *   transactionId: 'tx-123',
 *   rejectionReason: 'Insufficient documentation'
 * });
 * ```
 *
 * @remarks
 * **Status Change:** PENDING → REJECTED
 * **Budget Impact:** Rejected transactions do NOT affect budget amounts
 *
 * @since 1.0.0
 */
export const useRejectTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, rejectionReason }: {
      transactionId: string;
      rejectionReason: string;
    }): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason }),
      });
      if (!response.ok) throw new Error('Failed to reject transaction');
      return response.json();
    },
    onSuccess: (rejectedTransaction, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(rejectedTransaction.budgetId) });
      toast.success('Transaction rejected');
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject transaction: ${error.message}`);
    },
  });
};
