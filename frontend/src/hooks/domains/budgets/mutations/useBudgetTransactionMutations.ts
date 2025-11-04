/**
 * Budget Transaction Mutation Hooks
 *
 * Provides TanStack Query mutation hooks for managing budget transactions.
 * Handles transaction creation, updates, and deletion with cascading cache invalidation.
 *
 * @module hooks/domains/budgets/mutations/useBudgetTransactionMutations
 *
 * @remarks
 * **Operations:**
 * - Create: Add new transaction (income, expense, or transfer)
 * - Update: Modify transaction properties (amount, description, etc.)
 * - Delete: Remove transaction (updates budget/category amounts)
 *
 * **Transaction Types:**
 * - EXPENSE: Reduces budget/category balance
 * - INCOME: Increases budget/category balance
 * - TRANSFER: Moves funds between categories
 *
 * **Cache Strategy:**
 * - Create: Invalidates transactions(), budget detail, category detail
 * - Update: Invalidates transaction, transactions list, budget, category
 * - Delete: Removes transaction + invalidates related entities
 *
 * **Workflow:**
 * - Created transactions start in PENDING status
 * - Must be approved to affect budget amounts
 * - See useBudgetApprovalMutations for approval workflow
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetApprovalMutations} for approval/rejection
 * @see {@link useBudgetCategoryMutations} for category operations
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { budgetKeys } from '../budgetQueryKeys';
import type { BudgetTransaction } from '../budgetTypes';

/**
 * Creates a new budget transaction (income, expense, or transfer).
 *
 * @returns {UseMutationResult} Mutation result with transaction creation
 *
 * @example
 * ```typescript
 * const createTransaction = useCreateBudgetTransaction();
 * createTransaction.mutate({
 *   budgetId: 'budget-123',
 *   categoryId: 'cat-456',
 *   amount: 250,
 *   type: 'EXPENSE',
 *   description: 'First aid supplies',
 *   date: '2024-03-15',
 *   status: 'PENDING'
 * });
 * ```
 *
 * @remarks
 * **Cache Invalidation:** Invalidates transactions, budget detail, and category queries
 * **Workflow:** Created transactions start in PENDING status awaiting approval
 *
 * @see {@link useApproveTransaction}
 * @since 1.0.0
 */
export const useCreateBudgetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: Omit<BudgetTransaction, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'approvedBy' | 'attachments'>): Promise<BudgetTransaction> => {
      const response = await fetch('/api/budget-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });
      if (!response.ok) throw new Error('Failed to create transaction');
      return response.json();
    },
    onSuccess: (newTransaction) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(newTransaction.budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.category(newTransaction.categoryId) });
      toast.success('Transaction created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create transaction: ${error.message}`);
    },
  });
};

/**
 * Updates an existing budget transaction.
 *
 * @returns {UseMutationResult} Mutation result accepting {transactionId, updates}
 *
 * @example
 * ```typescript
 * const updateTransaction = useUpdateBudgetTransaction();
 * updateTransaction.mutate({
 *   transactionId: 'tx-123',
 *   updates: { description: 'Updated description', amount: 300 }
 * });
 * ```
 *
 * @remarks
 * **Cache Invalidation:** Invalidates transaction detail, transactions list, budget, and category
 *
 * @since 1.0.0
 */
export const useUpdateBudgetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, updates }: {
      transactionId: string;
      updates: Partial<BudgetTransaction>;
    }): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update transaction');
      return response.json();
    },
    onSuccess: (updatedTransaction, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(updatedTransaction.budgetId) });
      toast.success('Transaction updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update transaction: ${error.message}`);
    },
  });
};

/**
 * Deletes a budget transaction.
 *
 * @returns {UseMutationResult} Mutation result accepting transactionId, returns {budgetId, categoryId}
 *
 * @example
 * ```typescript
 * const deleteTransaction = useDeleteBudgetTransaction();
 * deleteTransaction.mutate('tx-123');
 * ```
 *
 * @remarks
 * **Cache Invalidation:** Removes transaction and invalidates budget/category to reflect updated amounts
 *
 * @since 1.0.0
 */
export const useDeleteBudgetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string): Promise<{ budgetId: string; categoryId: string }> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
      return response.json();
    },
    onSuccess: ({ budgetId, categoryId }, transactionId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.category(categoryId) });
      toast.success('Transaction deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete transaction: ${error.message}`);
    },
  });
};
