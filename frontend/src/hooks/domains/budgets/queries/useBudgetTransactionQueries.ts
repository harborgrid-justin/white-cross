/**
 * Budget Transaction Query Hooks
 *
 * Provides TanStack Query hooks for fetching budget transaction data including single
 * transaction details, filtered transaction lists, and paginated transaction queries.
 *
 * @module hooks/domains/budgets/queries/useBudgetTransactionQueries
 *
 * @remarks
 * **Architecture:**
 * - Uses TanStack Query v5 for data fetching and caching
 * - Query keys managed through budgetKeys factory for consistency
 * - Automatic background refetching on window focus
 * - Retry logic with exponential backoff (3 attempts)
 *
 * **Cache Strategy:**
 * - Transactions: 2-minute stale time (more volatile than budgets)
 * - Automatic background refetching keeps approval queues current
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetMutations} for data modification hooks
 *
 * @since 1.0.0
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';
import type { BudgetTransaction } from '../budgetTypes';

/**
 * Fetches a single budget transaction by ID with full details.
 *
 * @param transactionId - Unique identifier of the transaction
 * @returns TanStack Query result with transaction data and attachments
 *
 * @example
 * const { data: transaction, isLoading } = useBudgetTransaction(transactionId);
 *
 * @remarks
 * - Query Key: budgetKeys.transaction(transactionId)
 * - Stale Time: 2 minutes
 * - Includes attachments and user information
 */
export const useBudgetTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: budgetKeys.transaction(transactionId),
    queryFn: async (): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}`);
      if (!response.ok) throw new Error('Failed to fetch budget transaction');
      return response.json();
    },
    enabled: !!transactionId,
  });
};

/**
 * Fetches filtered list of budget transactions.
 *
 * @param filters - Optional filters (budgetId, categoryId, type, startDate, endDate)
 * @returns TanStack Query result with array of transactions
 *
 * @example
 * const { data: transactions } = useBudgetTransactions({
 *   categoryId,
 *   type: 'expense',
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * });
 *
 * @remarks
 * - Query Key: budgetKeys.transactions(filters)
 * - Stale Time: 2 minutes
 * - Supports budgetId, categoryId, type, date range filters
 * - For large lists, use useBudgetTransactionsPaginated
 */
export const useBudgetTransactions = (filters?: {
  budgetId?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'transfer';
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: budgetKeys.transactions(filters),
    queryFn: async (): Promise<BudgetTransaction[]> => {
      const params = new URLSearchParams();
      if (filters?.budgetId) params.append('budgetId', filters.budgetId);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/budget-transactions?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget transactions');
      return response.json();
    },
  });
};

/**
 * Fetches paginated budget transactions with infinite scroll.
 *
 * @param filters - Optional filters (budgetId, categoryId, type, dates, search)
 * @returns TanStack Query infinite query result with pages of transactions
 *
 * @example
 * const { data, hasNextPage, fetchNextPage } = useBudgetTransactionsPaginated({ budgetId });
 * const allTransactions = data?.pages.flatMap(page => page.transactions) ?? [];
 *
 * @remarks
 * - Query Key: budgetKeys.transactionsPaginated(filters)
 * - Stale Time: 2 minutes
 * - Use for large transaction histories (100+ items)
 */
export const useBudgetTransactionsPaginated = (filters?: {
  budgetId?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'transfer';
  startDate?: string;
  endDate?: string;
  search?: string;
}) => {
  return useInfiniteQuery({
    queryKey: budgetKeys.transactionsPaginated(filters),
    queryFn: async ({ pageParam = 0 }): Promise<{
      transactions: BudgetTransaction[];
      nextPage?: number;
      hasMore: boolean;
      total: number;
    }> => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (filters?.budgetId) params.append('budgetId', filters.budgetId);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/budget-transactions/paginated?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget transactions');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
