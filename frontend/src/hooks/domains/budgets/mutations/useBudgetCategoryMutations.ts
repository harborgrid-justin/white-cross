/**
 * Budget Category Mutation Hooks
 *
 * Provides TanStack Query mutation hooks for managing budget categories.
 * Handles category creation, updates, and deletion with automatic cache invalidation.
 *
 * @module hooks/domains/budgets/mutations/useBudgetCategoryMutations
 *
 * @remarks
 * **Operations:**
 * - Create: Add new category to budget
 * - Update: Modify category properties (name, allocation, etc.)
 * - Delete: Remove category (may cascade to child categories)
 *
 * **Cache Strategy:**
 * - Create: Invalidates categories() and all budgets
 * - Update: Invalidates specific category + categories list
 * - Delete: Removes category + invalidates categories list
 *
 * **Hierarchical Categories:**
 * - Categories can have parent-child relationships
 * - Deleting parent may cascade to children (server-side)
 * - Cache invalidation handles hierarchy automatically
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetCRUDMutations} for budget operations
 * @see {@link useBudgetTransactionMutations} for transaction operations
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { budgetKeys } from '../budgetQueryKeys';
import type { BudgetCategory } from '../budgetTypes';

/**
 * Creates a new budget category within a budget.
 *
 * @returns {UseMutationResult} Mutation result with mutate function
 *
 * @example
 * ```typescript
 * const createCategory = useCreateBudgetCategory();
 * createCategory.mutate({
 *   name: 'Medical Supplies',
 *   allocatedAmount: 25000,
 *   spentAmount: 0,
 *   remainingAmount: 25000
 * });
 * ```
 *
 * @remarks
 * **Cache Invalidation:** Invalidates categories queries and budget details
 *
 * @see {@link useUpdateBudgetCategory}
 * @since 1.0.0
 */
export const useCreateBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: Omit<BudgetCategory, 'id' | 'children' | 'transactions'>): Promise<BudgetCategory> => {
      const response = await fetch('/api/budget-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) throw new Error('Failed to create budget category');
      return response.json();
    },
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.categories() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Category "${newCategory.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });
};

/**
 * Updates an existing budget category.
 *
 * @returns {UseMutationResult} Mutation result accepting {categoryId, updates}
 *
 * @example
 * ```typescript
 * const updateCategory = useUpdateBudgetCategory();
 * updateCategory.mutate({
 *   categoryId: 'cat-123',
 *   updates: { allocatedAmount: 30000 }
 * });
 * ```
 *
 * @remarks
 * **Cache Invalidation:** Invalidates category detail, categories list, and parent budget
 *
 * @since 1.0.0
 */
export const useUpdateBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId, updates }: {
      categoryId: string;
      updates: Partial<BudgetCategory>;
    }): Promise<BudgetCategory> => {
      const response = await fetch(`/api/budget-categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update budget category');
      return response.json();
    },
    onSuccess: (updatedCategory, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.category(categoryId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.categories() });
      toast.success(`Category "${updatedCategory.name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update category: ${error.message}`);
    },
  });
};

/**
 * Deletes a budget category.
 *
 * @returns {UseMutationResult} Mutation result accepting categoryId
 *
 * @example
 * ```typescript
 * const deleteCategory = useDeleteBudgetCategory();
 * deleteCategory.mutate('cat-123');
 * ```
 *
 * @remarks
 * **Warning:** May cascade delete child categories and transactions
 * **Cache:** Removes category from cache and invalidates related queries
 *
 * @since 1.0.0
 */
export const useDeleteBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string): Promise<void> => {
      const response = await fetch(`/api/budget-categories/${categoryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete budget category');
    },
    onSuccess: (_, categoryId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.category(categoryId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.categories() });
      toast.success('Category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });
};
