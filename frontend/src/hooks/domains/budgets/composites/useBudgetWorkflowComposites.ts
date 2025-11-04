/**
 * Budget Workflow Composite Hooks
 *
 * Provides composite hooks for complete budget management workflows.
 * Orchestrates budget data fetching, category management, transaction creation,
 * analytics, and approval workflows.
 *
 * @module hooks/domains/budgets/composites/useBudgetWorkflowComposites
 *
 * @remarks
 * **Architecture:**
 * - Combines multiple query and mutation hooks
 * - Aggregates loading states and errors
 * - Provides unified action interfaces
 * - Implements workflow-specific business logic
 *
 * **Workflow Pattern:**
 * - Budget Workflow: Complete budget management lifecycle
 * - Real-time status updates with polling
 * - Coordinated data refetching
 *
 * @see {@link useBudgetQueries} for query hooks
 * @see {@link useBudgetMutations} for mutation hooks
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';
import {
  useBudget,
  useBudgetCategories,
  useBudgetTransactions,
  useBudgetAnalytics,
  useBudgetStatus
} from '../queries';
import {
  useCreateBudgetCategory,
  useCreateBudgetTransaction,
  useApproveBudget
} from '../mutations';
import type { Budget } from '../budgetTypes';

/**
 * Complete budget management workflow hook.
 *
 * Orchestrates budget data fetching, category management, transaction creation,
 * analytics, and approval workflows. Provides unified interface for all budget
 * operations with coordinated loading states.
 *
 * @param {string} [budgetId] - Optional budget ID to manage
 *
 * @returns {Object} Workflow interface with data, actions, and states
 * @returns {Budget} returns.budget - Budget data
 * @returns {BudgetCategory[]} returns.categories - Budget categories
 * @returns {BudgetTransaction[]} returns.transactions - Budget transactions
 * @returns {Object} returns.analytics - Budget analytics data
 * @returns {Object} returns.status - Real-time budget status
 * @returns {boolean} returns.isLoading - True when loading core data
 * @returns {function} returns.createCategory - Create category action
 * @returns {function} returns.createTransaction - Create transaction action
 * @returns {function} returns.submitForApproval - Submit budget for approval
 * @returns {function} returns.approveBudget - Approve budget action
 *
 * @example
 * ```typescript
 * function BudgetManagementPage({ budgetId }: Props) {
 *   const {
 *     budget,
 *     categories,
 *     transactions,
 *     analytics,
 *     status,
 *     isLoading,
 *     createCategory,
 *     createTransaction,
 *     submitForApproval,
 *     approveBudget,
 *     isSubmitting,
 *     isApproving
 *   } = useBudgetWorkflow(budgetId);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       <BudgetHeader budget={budget} status={status} />
 *       <BudgetAnalytics data={analytics} />
 *       <CategoriesPanel
 *         categories={categories}
 *         onCreateCategory={createCategory}
 *       />
 *       <TransactionsPanel
 *         transactions={transactions}
 *         onCreateTransaction={createTransaction}
 *       />
 *       <WorkflowActions
 *         budget={budget}
 *         onSubmit={() => submitForApproval({ budgetId, submissionNote: 'Ready for review' })}
 *         onApprove={() => approveBudget({ budgetId })}
 *         isSubmitting={isSubmitting}
 *         isApproving={isApproving}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Data Aggregation:**
 * - Fetches budget, categories, transactions in parallel
 * - Loads analytics and status with separate loading states
 * - Coordinates refetching across all data sources
 *
 * **Workflow Actions:**
 * - submitForApproval: Custom mutation for workflow transition
 * - Other actions: Delegates to mutation hooks
 * - All actions invalidate relevant queries
 *
 * **Loading States:**
 * - isLoading: Core data (budget, categories, transactions)
 * - isLoadingAnalytics: Analytics data
 * - isLoadingStatus: Status data
 * - isCreatingCategory/Transaction: Action states
 *
 * **Real-time Updates:**
 * - Status polling every 30 seconds
 * - Automatic refetch on window focus
 * - Manual refetch functions provided
 *
 * @see {@link useBudgetPlanning} for planning workflow
 * @see {@link useTransactionManagement} for transaction workflow
 *
 * @since 1.0.0
 */
export const useBudgetWorkflow = (budgetId?: string) => {
  const queryClient = useQueryClient();

  const budget = useBudget(budgetId!);
  const categories = useBudgetCategories(budgetId);
  const transactions = useBudgetTransactions({ budgetId });
  const analytics = useBudgetAnalytics(budgetId!, 'monthly');
  const status = useBudgetStatus(budgetId!, { pollingInterval: 30000 });

  const createCategory = useCreateBudgetCategory();
  const createTransaction = useCreateBudgetTransaction();
  const approveBudget = useApproveBudget();

  const submitForApproval = useMutation({
    mutationFn: async ({ budgetId, submissionNote }: {
      budgetId: string;
      submissionNote?: string;
    }): Promise<Budget> => {
      const response = await fetch(`/api/budgets/${budgetId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionNote }),
      });
      if (!response.ok) throw new Error('Failed to submit budget');
      return response.json();
    },
    onSuccess: (updatedBudget) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(updatedBudget.id) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.status(updatedBudget.id) });
    },
  });

  return {
    // Data
    budget: budget.data,
    categories: categories.data,
    transactions: transactions.data,
    analytics: analytics.data,
    status: status.data,

    // Loading states
    isLoading: budget.isLoading || categories.isLoading || transactions.isLoading,
    isLoadingAnalytics: analytics.isLoading,
    isLoadingStatus: status.isLoading,

    // Error states
    error: budget.error || categories.error || transactions.error,

    // Actions
    createCategory: createCategory.mutate,
    createTransaction: createTransaction.mutate,
    submitForApproval: submitForApproval.mutate,
    approveBudget: approveBudget.mutate,

    // Action states
    isCreatingCategory: createCategory.isPending,
    isCreatingTransaction: createTransaction.isPending,
    isSubmitting: submitForApproval.isPending,
    isApproving: approveBudget.isPending,

    // Refetch functions
    refetchBudget: budget.refetch,
    refetchCategories: categories.refetch,
    refetchTransactions: transactions.refetch,
    refetchAnalytics: analytics.refetch,
  };
};
