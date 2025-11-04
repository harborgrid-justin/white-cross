/**
 * Budget Category Query Hooks
 *
 * Provides TanStack Query hooks for fetching budget category data including single
 * category details, category lists with nested children, and hierarchical structures.
 *
 * @module hooks/domains/budgets/queries/useBudgetCategoryQueries
 *
 * @remarks
 * **Architecture:**
 * - Uses TanStack Query v5 for data fetching and caching
 * - Query keys managed through budgetKeys factory for consistency
 * - Automatic background refetching on window focus
 * - Retry logic with exponential backoff (3 attempts)
 *
 * **Cache Strategy:**
 * - Categories: 10-minute stale time
 * - Automatic background refetching keeps data fresh
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetMutations} for data modification hooks
 *
 * @since 1.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';
import type { BudgetCategory } from '../budgetTypes';

/**
 * Fetches a single budget category by ID with nested children and transactions.
 *
 * @param {string} categoryId - Unique identifier of the category to fetch
 *
 * @returns {UseQueryResult<BudgetCategory>} TanStack Query result object
 * @returns {BudgetCategory} returns.data - The category with children and transactions
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * function CategoryDetailPanel({ categoryId }: Props) {
 *   const { data: category, isLoading } = useBudgetCategory(categoryId);
 *
 *   if (isLoading) return <Skeleton />;
 *   if (!category) return null;
 *
 *   return (
 *     <div>
 *       <h3>{category.name}</h3>
 *       <p>Allocated: ${category.allocatedAmount}</p>
 *       <p>Spent: ${category.spentAmount}</p>
 *       <p>Remaining: ${category.remainingAmount}</p>
 *       {category.children && (
 *         <SubcategoriesList subcategories={category.children} />
 *       )}
 *       <TransactionsList transactions={category.transactions} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.category(categoryId)
 * - Stale Time: 10 minutes
 * - Enabled: Only when categoryId is truthy
 *
 * **Data Structure:**
 * - Includes nested children array (subcategories)
 * - Includes all transactions for this category
 * - Amounts are pre-calculated on server
 *
 * **Cache Invalidation:**
 * - Invalidated when creating/updating/deleting category
 * - Invalidated when transactions added to category
 * - Parent budget query also invalidated
 *
 * @see {@link useBudgetCategories} for fetching multiple categories
 * @see {@link useUpdateBudgetCategory} for updating categories
 *
 * @since 1.0.0
 */
export const useBudgetCategory = (categoryId: string) => {
  return useQuery({
    queryKey: budgetKeys.category(categoryId),
    queryFn: async (): Promise<BudgetCategory> => {
      const response = await fetch(`/api/budget-categories/${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch budget category');
      return response.json();
    },
    enabled: !!categoryId,
  });
};

/**
 * Fetches all budget categories, optionally filtered by budget ID.
 *
 * Returns flat list or hierarchical structure of categories depending on server
 * configuration. Useful for category dropdowns, budget breakdowns, and allocation views.
 *
 * @param {string} [budgetId] - Optional budget ID to filter categories
 *
 * @returns {UseQueryResult<BudgetCategory[]>} TanStack Query result object
 * @returns {BudgetCategory[]} returns.data - Array of budget categories
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * function CategorySelectionDropdown({ budgetId }: Props) {
 *   const { data: categories, isLoading } = useBudgetCategories(budgetId);
 *
 *   if (isLoading) return <SelectSkeleton />;
 *
 *   return (
 *     <Select>
 *       <option value="">Select a category...</option>
 *       {categories?.map(cat => (
 *         <option key={cat.id} value={cat.id}>
 *           {cat.name} (${cat.remainingAmount} remaining)
 *         </option>
 *       ))}
 *     </Select>
 *   );
 * }
 *
 * // Example: Category hierarchy for budget breakdown
 * function BudgetBreakdown({ budgetId }: Props) {
 *   const { data: categories } = useBudgetCategories(budgetId);
 *
 *   const topLevelCategories = categories?.filter(c => !c.parentId);
 *
 *   return (
 *     <div>
 *       {topLevelCategories?.map(category => (
 *         <CategoryCard
 *           key={category.id}
 *           category={category}
 *           subcategories={category.children}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.categories(budgetId)
 * - Stale Time: 10 minutes
 * - Cache: Separate cache for each budgetId filter
 *
 * **Filter Behavior:**
 * - If budgetId provided: Returns only categories for that budget
 * - If budgetId omitted: Returns all categories across all budgets
 *
 * **Data Structure:**
 * - May include parent-child relationships via parentId
 * - Children array populated if hierarchical structure enabled
 * - Transactions may or may not be included (check server config)
 *
 * **Performance:**
 * - Use for dropdowns and selection lists
 * - For large category trees, consider lazy loading children
 *
 * @see {@link useBudgetCategory} for fetching single category details
 * @see {@link useBudget} for budget with nested categories
 *
 * @since 1.0.0
 */
export const useBudgetCategories = (budgetId?: string) => {
  return useQuery({
    queryKey: budgetKeys.categories(budgetId),
    queryFn: async (): Promise<BudgetCategory[]> => {
      const params = budgetId ? `?budgetId=${budgetId}` : '';
      const response = await fetch(`/api/budget-categories${params}`);
      if (!response.ok) throw new Error('Failed to fetch budget categories');
      return response.json();
    },
  });
};
