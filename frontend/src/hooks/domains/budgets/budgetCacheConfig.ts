/**
 * Budget Cache Configuration
 *
 * Defines cache configuration constants and utilities for budget domain queries.
 * Includes stale time configuration optimized for data volatility patterns and
 * utility functions for cache invalidation workflows.
 *
 * @module hooks/domains/budgets/budgetCacheConfig
 *
 * @remarks
 * **Cache Strategy:**
 * - Budgets: 10-minute stale time (relatively stable)
 * - Transactions: 2-minute stale time (more volatile)
 * - Reports: 15-minute stale time (static after generation)
 * - Default: 5-minute stale time for general data
 *
 * @see {@link useBudgetQueries} for cache configuration usage
 *
 * @since 1.0.0
 */

import { QueryClient } from '@tanstack/react-query';
import { BUDGETS_QUERY_KEYS } from './budgetQueryKeys';

/**
 * Cache configuration constants for budget domain queries.
 *
 * Defines stale times optimized for different data types based on their volatility
 * and update patterns. Stale time determines how long cached data is considered
 * fresh before background refetching occurs.
 *
 * @constant
 *
 * @property {number} DEFAULT_STALE_TIME - Default stale time for general queries (5 minutes)
 * @property {number} BUDGETS_STALE_TIME - Stale time for budget data (10 minutes)
 * @property {number} TRANSACTIONS_STALE_TIME - Stale time for transaction data (2 minutes)
 * @property {number} REPORTS_STALE_TIME - Stale time for report data (15 minutes)
 *
 * @example
 * ```typescript
 * import { BUDGETS_CACHE_CONFIG } from './budgetCacheConfig';
 *
 * // Use in query configuration
 * useQuery({
 *   queryKey: budgetKeys.detail(budgetId),
 *   queryFn: fetchBudget,
 *   staleTime: BUDGETS_CACHE_CONFIG.BUDGETS_STALE_TIME
 * });
 *
 * // Override for real-time data
 * useQuery({
 *   queryKey: budgetKeys.status(budgetId),
 *   queryFn: fetchStatus,
 *   staleTime: 0 // Always refetch
 * });
 * ```
 *
 * @remarks
 * **Stale Time Rationale:**
 * - **Budgets (10 min)**: Budget metadata changes infrequently; longer cache acceptable
 * - **Transactions (2 min)**: Transaction approvals and updates are frequent; shorter cache
 * - **Reports (15 min)**: Generated reports are static; longest cache time
 * - **Default (5 min)**: Balanced for general category and user data
 *
 * **Background Refetching:**
 * - TanStack Query automatically refetches stale data on:
 *   - Component mount (if stale)
 *   - Window focus (if stale)
 *   - Network reconnection
 *
 * **Performance Impact:**
 * - Longer stale times reduce API calls but may show outdated data
 * - Shorter stale times increase freshness but higher server load
 * - Combine with polling (refetchInterval) for real-time needs
 *
 * @see {@link useBudgetStatus} for example of real-time polling
 * @see {@link useBudgetQueries} for stale time usage
 *
 * @since 1.0.0
 */
export const BUDGETS_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  BUDGETS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  TRANSACTIONS_STALE_TIME: 2 * 60 * 1000, // 2 minutes
  REPORTS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
} as const;

/**
 * Invalidates all budget-related queries in the cache.
 *
 * Triggers refetch of all budget data including budgets, categories, transactions,
 * reports, and analytics. Use after bulk operations affecting multiple budgets.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * import { useQueryClient } from '@tanstack/react-query';
 * import { invalidateBudgetsQueries } from './budgetCacheConfig';
 *
 * function BudgetImportComplete() {
 *   const queryClient = useQueryClient();
 *
 *   const handleImportComplete = () => {
 *     // Invalidate all budget data after bulk import
 *     invalidateBudgetsQueries(queryClient);
 *   };
 * }
 * ```
 *
 * @remarks
 * **Scope:**
 * - Invalidates all queries with key starting with ['budgets']
 * - Affects budgets, categories, transactions, reports, analytics
 * - Triggers background refetch for all mounted queries
 *
 * **Performance:**
 * - May cause multiple simultaneous API calls
 * - Use sparingly for bulk operations only
 * - Prefer granular invalidation for single-entity updates
 *
 * @see {@link invalidateBudgetQueries} for budget-specific invalidation
 * @see {@link budgetKeys} for query key structure
 *
 * @since 1.0.0
 */
export const invalidateBudgetsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['budgets'] });
};

/**
 * Invalidates budget-specific queries using BUDGETS_QUERY_KEYS pattern.
 *
 * Invalidates queries for budgets list and details. Use after creating, updating,
 * or deleting budgets.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * import { useMutation, useQueryClient } from '@tanstack/react-query';
 * import { invalidateBudgetQueries } from './budgetCacheConfig';
 *
 * function useUpdateBudgetStatus() {
 *   const queryClient = useQueryClient();
 *
 *   return useMutation({
 *     mutationFn: updateStatus,
 *     onSuccess: () => {
 *       invalidateBudgetQueries(queryClient);
 *     }
 *   });
 * }
 * ```
 *
 * @remarks
 * **Invalidates:**
 * - Budget list queries
 * - Budget detail queries
 * - Does NOT invalidate categories, transactions, or reports
 *
 * **Use Cases:**
 * - After budget creation
 * - After budget metadata update
 * - After budget status change
 *
 * @see {@link invalidateBudgetsQueries} for full cache invalidation
 * @see {@link BUDGETS_QUERY_KEYS} for affected query keys
 *
 * @since 1.0.0
 */
export const invalidateBudgetQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.budgets });
};

/**
 * Invalidates budget category queries.
 *
 * Invalidates queries for category lists and details. Use after creating,
 * updating, or deleting budget categories.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * import { useMutation, useQueryClient } from '@tanstack/react-query';
 * import { invalidateBudgetCategoryQueries } from './budgetCacheConfig';
 *
 * function useCreateCategory() {
 *   const queryClient = useQueryClient();
 *
 *   return useMutation({
 *     mutationFn: createCategory,
 *     onSuccess: () => {
 *       invalidateBudgetCategoryQueries(queryClient);
 *       // Also invalidate parent budget to refresh nested categories
 *       queryClient.invalidateQueries({
 *         queryKey: budgetKeys.detail(budgetId)
 *       });
 *     }
 *   });
 * }
 * ```
 *
 * @remarks
 * **Invalidates:**
 * - Category list queries (all budgets)
 * - Category detail queries
 * - Budget-specific category queries
 *
 * **Cascading Invalidation:**
 * - Consider invalidating parent budget queries
 * - May need to invalidate transaction queries if amounts changed
 *
 * @see {@link invalidateBudgetQueries} for budget invalidation
 * @see {@link BUDGETS_QUERY_KEYS.categories} for affected query keys
 *
 * @since 1.0.0
 */
export const invalidateBudgetCategoryQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.categories });
};

/**
 * Invalidates budget transaction queries.
 *
 * Invalidates queries for transaction lists and details. Use after creating,
 * updating, approving, or deleting budget transactions.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * import { useMutation, useQueryClient } from '@tanstack/react-query';
 * import { invalidateTransactionQueries } from './budgetCacheConfig';
 *
 * function useApproveTransaction() {
 *   const queryClient = useQueryClient();
 *
 *   return useMutation({
 *     mutationFn: approveTransaction,
 *     onSuccess: (transaction) => {
 *       invalidateTransactionQueries(queryClient);
 *
 *       // Also invalidate affected budget and category
 *       queryClient.invalidateQueries({
 *         queryKey: budgetKeys.detail(transaction.budgetId)
 *       });
 *       queryClient.invalidateQueries({
 *         queryKey: budgetKeys.category(transaction.categoryId)
 *       });
 *     }
 *   });
 * }
 * ```
 *
 * @remarks
 * **Invalidates:**
 * - Transaction list queries (all filters)
 * - Transaction detail queries
 * - Paginated transaction queries
 *
 * **Cascading Invalidation:**
 * - ALWAYS invalidate parent budget and category queries
 * - Transactions affect budget and category amounts
 * - May need to invalidate analytics and reports
 *
 * **Performance:**
 * - Transaction queries have 2-minute stale time
 * - Frequent invalidation expected for approval workflows
 *
 * @see {@link invalidateBudgetQueries} for budget invalidation
 * @see {@link invalidateBudgetCategoryQueries} for category invalidation
 * @see {@link BUDGETS_QUERY_KEYS.transactions} for affected query keys
 *
 * @since 1.0.0
 */
export const invalidateTransactionQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.transactions });
};
