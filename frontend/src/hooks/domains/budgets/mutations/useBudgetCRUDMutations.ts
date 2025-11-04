/**
 * Budget CRUD Mutation Hooks
 *
 * Provides TanStack Query mutation hooks for creating, updating, and deleting budgets.
 * Implements cache invalidation, error handling, and user notifications.
 *
 * @module hooks/domains/budgets/mutations/useBudgetCRUDMutations
 *
 * @remarks
 * **Operations:**
 * - Create: Create new budget with categories
 * - Update: Update budget properties (partial updates supported)
 * - Delete: Remove budget permanently
 *
 * **Cache Strategy:**
 * - Create: Invalidates budgetKeys.all
 * - Update: Invalidates specific budget + lists
 * - Delete: Removes from cache + invalidates lists
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetCategoryMutations} for category operations
 * @see {@link useBudgetWorkflowMutations} for approval operations
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { budgetKeys } from '../budgetQueryKeys';
import type { Budget } from '../budgetTypes';

/**
 * Creates a new budget with categories and allocations.
 *
 * Mutation hook for creating a budget. Automatically invalidates budget list queries
 * and displays success/error notifications.
 *
 * @returns {UseMutationResult} TanStack Query mutation result
 *
 * @example
 * ```typescript
 * const createBudget = useCreateBudget();
 * createBudget.mutate({
 *   name: 'Annual Budget 2024',
 *   totalAmount: 100000,
 *   fiscalYear: '2024',
 *   status: 'DRAFT'
 * });
 * ```
 *
 * @remarks
 * - POST /api/budgets
 * - Invalidates budgetKeys.all
 * - Success: Shows toast notification
 *
 * @since 1.0.0
 */
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> => {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      });
      if (!response.ok) throw new Error('Failed to create budget');
      return response.json();
    },
    onSuccess: (newBudget) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Budget "${newBudget.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create budget: ${error.message}`);
    },
  });
};

/**
 * Updates an existing budget's properties.
 *
 * Mutation hook for updating budget metadata, amounts, status, or other properties.
 * Supports partial updates. Invalidates budget detail and list queries.
 *
 * @returns {UseMutationResult} TanStack Query mutation result
 *
 * @example
 * ```typescript
 * const updateBudget = useUpdateBudget();
 * updateBudget.mutate({
 *   budgetId: 'budget-123',
 *   updates: { name: 'Updated Budget Name' }
 * });
 * ```
 *
 * @remarks
 * - PUT /api/budgets/:budgetId
 * - Partial updates supported
 * - Invalidates budget detail and list
 *
 * @since 1.0.0
 */
export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ budgetId, updates }: {
      budgetId: string;
      updates: Partial<Budget>;
    }): Promise<Budget> => {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update budget');
      return response.json();
    },
    onSuccess: (updatedBudget, { budgetId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Budget "${updatedBudget.name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update budget: ${error.message}`);
    },
  });
};

/**
 * Deletes a budget permanently.
 *
 * Mutation hook for deleting a budget. Removes budget from cache and invalidates
 * related queries. Use with caution as this is a destructive operation.
 *
 * @returns {UseMutationResult} TanStack Query mutation result
 *
 * @example
 * ```typescript
 * const deleteBudget = useDeleteBudget();
 * deleteBudget.mutate('budget-123');
 * ```
 *
 * @remarks
 * - DELETE /api/budgets/:budgetId
 * - Removes from cache
 * - May cascade delete categories/transactions
 *
 * @see {@link useBulkDeleteBudgets} for bulk deletion
 * @since 1.0.0
 */
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetId: string): Promise<void> => {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete budget');
    },
    onSuccess: (_, budgetId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success('Budget deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete budget: ${error.message}`);
    },
  });
};
