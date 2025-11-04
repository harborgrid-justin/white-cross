/**
 * Budget Core Query Hooks
 *
 * Provides TanStack Query hooks for fetching budget data including single budget details,
 * budget lists, and paginated budget queries for large datasets.
 *
 * @module hooks/domains/budgets/queries/useBudgetCoreQueries
 *
 * @remarks
 * **Architecture:**
 * - Uses TanStack Query v5 for data fetching and caching
 * - Query keys managed through budgetKeys factory for consistency
 * - Automatic background refetching on window focus
 * - Retry logic with exponential backoff (3 attempts)
 *
 * **Cache Strategy:**
 * - Budgets: 10-minute stale time
 * - Automatic background refetching keeps data fresh
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetMutations} for data modification hooks
 *
 * @since 1.0.0
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';
import type { Budget } from '../budgetTypes';

/**
 * Fetches a single budget by ID with full details including categories.
 *
 * @param budgetId - Unique identifier of the budget to fetch
 * @returns TanStack Query result with budget data, loading/error states
 *
 * @example
 * const { data: budget, isLoading } = useBudget(budgetId);
 *
 * @remarks
 * - Query Key: budgetKeys.detail(budgetId)
 * - Stale Time: 10 minutes
 * - Enabled only when budgetId is truthy
 */
export const useBudget = (budgetId: string) => {
  return useQuery({
    queryKey: budgetKeys.detail(budgetId),
    queryFn: async (): Promise<Budget> => {
      const response = await fetch(`/api/budgets/${budgetId}`);
      if (!response.ok) throw new Error('Failed to fetch budget');
      return response.json();
    },
    enabled: !!budgetId,
  });
};

/**
 * Fetches a filtered list of budgets with optional filters.
 *
 * @param filters - Optional filters (departmentId, status, fiscalYear)
 * @returns TanStack Query result with array of budgets
 *
 * @example
 * const { data: budgets } = useBudgets({ status: 'active', fiscalYear: 2024 });
 *
 * @remarks
 * - Query Key: budgetKeys.list(filters)
 * - Stale Time: 10 minutes
 * - Separate cache per filter combination
 */
export const useBudgets = (filters?: {
  departmentId?: string;
  status?: 'draft' | 'approved' | 'active' | 'archived';
  fiscalYear?: number;
}) => {
  return useQuery({
    queryKey: budgetKeys.list(filters),
    queryFn: async (): Promise<Budget[]> => {
      const params = new URLSearchParams();
      if (filters?.departmentId) params.append('departmentId', filters.departmentId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.fiscalYear) params.append('fiscalYear', filters.fiscalYear.toString());

      const response = await fetch(`/api/budgets?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budgets');
      return response.json();
    },
  });
};

/**
 * Fetches paginated budgets with infinite scroll support.
 *
 * @param filters - Optional filters (departmentId, status, fiscalYear, search)
 * @returns TanStack Query infinite query result with pages of budgets
 *
 * @example
 * const { data, hasNextPage, fetchNextPage } = useBudgetsPaginated({ status: 'active' });
 * const allBudgets = data?.pages.flatMap(page => page.budgets) ?? [];
 *
 * @remarks
 * - Query Key: budgetKeys.paginated(filters)
 * - Server-side pagination with page number
 * - Use for large budget lists (100+ items)
 */
export const useBudgetsPaginated = (filters?: {
  departmentId?: string;
  status?: 'draft' | 'approved' | 'active' | 'archived';
  fiscalYear?: number;
  search?: string;
}) => {
  return useInfiniteQuery({
    queryKey: budgetKeys.paginated(filters),
    queryFn: async ({ pageParam = 0 }): Promise<{
      budgets: Budget[];
      nextPage?: number;
      hasMore: boolean;
      total: number;
    }> => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (filters?.departmentId) params.append('departmentId', filters.departmentId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.fiscalYear) params.append('fiscalYear', filters.fiscalYear.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/budgets/paginated?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budgets');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
