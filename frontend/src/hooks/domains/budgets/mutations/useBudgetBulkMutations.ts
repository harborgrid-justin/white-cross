/**
 * Budget Bulk Operation Mutation Hooks
 *
 * Provides TanStack Query mutation hooks for bulk operations on budgets and transactions.
 * More efficient than individual operations when processing multiple entities.
 *
 * @module hooks/domains/budgets/mutations/useBudgetBulkMutations
 *
 * @remarks
 * **Bulk Operations:**
 * - Bulk Delete Budgets: Delete multiple budgets in single request
 * - Bulk Approve Transactions: Approve multiple transactions atomically
 *
 * **Performance Benefits:**
 * - Single HTTP request vs. multiple
 * - Atomic server-side transaction (all or nothing)
 * - Efficient cache invalidation
 * - Reduced network overhead
 *
 * **Cache Strategy:**
 * - Bulk delete: Removes each budget + invalidates budgets list
 * - Bulk approve: Invalidates affected transactions, budgets, categories
 * - Granular invalidation for specific entities
 * - Cascading invalidation for related data
 *
 * **Atomicity:**
 * - Operations are atomic (all succeed or all fail)
 * - Partial success not supported
 * - Server rolls back on any failure
 *
 * **Use Cases:**
 * - Admin bulk deletion of old budgets
 * - Batch approval of pending transactions
 * - Cleanup operations
 * - Mass status changes
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetCRUDMutations} for single budget operations
 * @see {@link useBudgetApprovalMutations} for single approvals
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { budgetKeys } from '../budgetQueryKeys';
import type { BudgetTransaction } from '../budgetTypes';

/**
 * Deletes multiple budgets in a single operation.
 *
 * @returns {UseMutationResult} Mutation result accepting budgetIds array
 *
 * @example
 * ```typescript
 * const bulkDelete = useBulkDeleteBudgets();
 * const selectedBudgets = ['budget-1', 'budget-2', 'budget-3'];
 * bulkDelete.mutate(selectedBudgets, {
 *   onSuccess: () => {
 *     console.log(`Deleted ${selectedBudgets.length} budgets`);
 *   }
 * });
 * ```
 *
 * @remarks
 * **Cache:** Removes all deleted budgets and invalidates budget lists
 * **Performance:** More efficient than individual delete operations
 *
 * @see {@link useDeleteBudget}
 * @since 1.0.0
 */
export const useBulkDeleteBudgets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetIds: string[]): Promise<void> => {
      const response = await fetch('/api/budgets/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetIds }),
      });
      if (!response.ok) throw new Error('Failed to delete budgets');
    },
    onSuccess: (_, budgetIds) => {
      budgetIds.forEach(id => {
        queryClient.removeQueries({ queryKey: budgetKeys.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`${budgetIds.length} budgets deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete budgets: ${error.message}`);
    },
  });
};

/**
 * Approves multiple transactions in a single operation.
 *
 * @returns {UseMutationResult} Mutation result accepting transactionIds array, returns approved transactions
 *
 * @example
 * ```typescript
 * const bulkApprove = useBulkApproveTransactions();
 * const pendingIds = ['tx-1', 'tx-2', 'tx-3'];
 * bulkApprove.mutate(pendingIds, {
 *   onSuccess: (approved) => {
 *     toast.success(`Approved ${approved.length} transactions`);
 *   }
 * });
 * ```
 *
 * @remarks
 * **Cascading Invalidation:** Invalidates all affected transactions, budgets, and categories
 * **Performance:** More efficient than individual approvals
 * **Atomic:** All succeed or all fail together
 *
 * @see {@link useApproveTransaction}
 * @since 1.0.0
 */
export const useBulkApproveTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionIds: string[]): Promise<BudgetTransaction[]> => {
      const response = await fetch('/api/budget-transactions/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionIds }),
      });
      if (!response.ok) throw new Error('Failed to approve transactions');
      return response.json();
    },
    onSuccess: (approvedTransactions, transactionIds) => {
      transactionIds.forEach(id => {
        queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(id) });
      });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });

      // Invalidate related budgets and categories
      const uniqueBudgetIds = [...new Set(approvedTransactions.map(t => t.budgetId))];
      const uniqueCategoryIds = [...new Set(approvedTransactions.map(t => t.categoryId))];

      uniqueBudgetIds.forEach(budgetId => {
        queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      });

      uniqueCategoryIds.forEach(categoryId => {
        queryClient.invalidateQueries({ queryKey: budgetKeys.category(categoryId) });
      });

      toast.success(`${transactionIds.length} transactions approved successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve transactions: ${error.message}`);
    },
  });
};
