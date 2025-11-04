/**
 * Budget Transaction Composite Hooks
 *
 * Provides composite hooks for transaction management and approval workflows.
 * Orchestrates transaction fetching, filtering, approval, rejection, and batch processing.
 * Ideal for transaction approval queues and transaction management pages.
 *
 * @module hooks/domains/budgets/composites/useBudgetTransactionComposites
 *
 * @remarks
 * **Architecture:**
 * - Combines transaction queries and mutations
 * - Implements approval workflow logic
 * - Provides batch processing capabilities
 *
 * **Transaction Management Pattern:**
 * - Transaction filtering by status
 * - Single and bulk approval actions
 * - Batch approval and rejection processing
 *
 * @see {@link useBudgetQueries} for query hooks
 * @see {@link useBudgetMutations} for mutation hooks
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';
import { useBudgetTransactions } from '../queries/useBudgetQueries';
import {
  useApproveTransaction,
  useBulkApproveTransactions
} from '../mutations/useBudgetMutations';
import type { BudgetTransaction } from '../budgetTypes';

/**
 * Transaction management and approval workflow hook.
 *
 * Orchestrates transaction fetching, filtering, approval, rejection, and batch
 * processing. Ideal for transaction approval queues and transaction management pages.
 *
 * @param {string} [budgetId] - Optional budget ID to filter transactions
 *
 * @returns {Object} Transaction management interface
 * @returns {BudgetTransaction[]} returns.pendingTransactions - Pending approval transactions
 * @returns {BudgetTransaction[]} returns.allTransactions - All transactions
 * @returns {function} returns.approveTransaction - Approve single transaction
 * @returns {function} returns.bulkApprove - Approve multiple transactions
 * @returns {function} returns.batchProcess - Process approvals and rejections together
 * @returns {Object} returns.batchResults - Results of batch processing
 *
 * @example
 * ```typescript
 * function TransactionApprovalQueue({ budgetId }: Props) {
 *   const {
 *     pendingTransactions,
 *     approveTransaction,
 *     bulkApprove,
 *     batchProcess,
 *     isApproving,
 *     isBatchProcessing
 *   } = useTransactionManagement(budgetId);
 *
 *   const [selected, setSelected] = useState<string[]>([]);
 *
 *   const handleBulkApprove = () => {
 *     bulkApprove(selected, {
 *       onSuccess: () => {
 *         toast.success(`Approved ${selected.length} transactions`);
 *         setSelected([]);
 *       }
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <TransactionList
 *         transactions={pendingTransactions}
 *         selectedIds={selected}
 *         onSelectionChange={setSelected}
 *       />
 *       <button onClick={handleBulkApprove} disabled={selected.length === 0}>
 *         Approve Selected ({selected.length})
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Batch Processing:**
 * - batchProcess allows simultaneous approve/reject
 * - Atomic operation - all succeed or all fail
 * - Efficient cache invalidation
 *
 * **Filtering:**
 * - pendingTransactions: Pre-filtered PENDING status
 * - allTransactions: All statuses for reference
 *
 * @see {@link useBudgetWorkflow}
 * @since 1.0.0
 */
export const useTransactionManagement = (budgetId?: string) => {
  const queryClient = useQueryClient();

  const transactions = useBudgetTransactions({
    budgetId
  });

  const approveTransaction = useApproveTransaction();
  const bulkApprove = useBulkApproveTransactions();

  const batchProcess = useMutation({
    mutationFn: async ({
      approveIds,
      rejectIds,
      rejectReasons
    }: {
      approveIds: string[];
      rejectIds: string[];
      rejectReasons: Record<string, string>;
    }): Promise<{
      approved: BudgetTransaction[];
      rejected: BudgetTransaction[];
    }> => {
      const response = await fetch('/api/budget-transactions/batch-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approveIds, rejectIds, rejectReasons }),
      });
      if (!response.ok) throw new Error('Failed to batch process transactions');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      if (budgetId) {
        queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      }
    },
  });

  return {
    // Data
    pendingTransactions: transactions.data?.filter(t => t.status === 'PENDING'),
    allTransactions: transactions.data,

    // Loading states
    isLoading: transactions.isLoading,

    // Error states
    error: transactions.error,

    // Actions
    approveTransaction: approveTransaction.mutate,
    bulkApprove: bulkApprove.mutate,
    batchProcess: batchProcess.mutate,

    // Action states
    isApproving: approveTransaction.isPending,
    isBulkApproving: bulkApprove.isPending,
    isBatchProcessing: batchProcess.isPending,

    // Results
    batchResults: batchProcess.data,

    // Refetch
    refetch: transactions.refetch,
  };
};
