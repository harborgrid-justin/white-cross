/**
 * Budget Analytics Query Hooks
 *
 * Provides TanStack Query hooks for fetching budget analytics data including
 * comprehensive analytics, comparison data, and performance metrics.
 *
 * @module hooks/domains/budgets/queries/useBudgetAnalyticsQueries
 *
 * @remarks
 * **Architecture:**
 * - Uses TanStack Query v5 for data fetching and caching
 * - Query keys managed through budgetKeys factory for consistency
 * - Automatic background refetching on window focus
 * - Retry logic with exponential backoff (3 attempts)
 *
 * **Cache Strategy:**
 * - Analytics: 5-10 minute stale time
 * - Automatic background refetching keeps dashboards current
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetMutations} for data modification hooks
 *
 * @since 1.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';

/**
 * Fetches comprehensive budget analytics with category breakdowns and trends.
 *
 * @param budgetId - Budget ID to fetch analytics for
 * @param period - Analysis period (monthly, quarterly, yearly)
 * @returns Analytics data with totals, category breakdown, and trends
 *
 * @example
 * const { data: analytics } = useBudgetAnalytics(budgetId, 'monthly');
 *
 * @remarks
 * - Query Key: budgetKeys.analytics(budgetId, period)
 * - Stale Time: 5 minutes
 * - Includes totalBudgeted, totalSpent, categoryBreakdown, monthlyTrends
 */
export const useBudgetAnalytics = (budgetId: string, period?: 'monthly' | 'quarterly' | 'yearly') => {
  return useQuery({
    queryKey: budgetKeys.analytics(budgetId, period),
    queryFn: async (): Promise<{
      totalBudgeted: number;
      totalSpent: number;
      totalRemaining: number;
      variance: number;
      categoryBreakdown: Array<{
        categoryId: string;
        categoryName: string;
        budgeted: number;
        spent: number;
        remaining: number;
        variance: number;
      }>;
      monthlyTrends: Array<{
        month: string;
        budgeted: number;
        spent: number;
        variance: number;
      }>;
    }> => {
      const params = period ? `?period=${period}` : '';
      const response = await fetch(`/api/budgets/${budgetId}/analytics${params}`);
      if (!response.ok) throw new Error('Failed to fetch budget analytics');
      return response.json();
    },
    enabled: !!budgetId,
  });
};

/**
 * Fetches comparative analytics across multiple budgets.
 *
 * @param budgetIds - Array of budget IDs to compare (2+ budgets)
 * @param period - Comparison period (monthly, quarterly, yearly)
 * @returns Comparison data with per-budget metrics and trends
 *
 * @example
 * const { data } = useBudgetComparisonData(budgetIds, 'quarterly');
 *
 * @remarks
 * - Query Key: budgetKeys.comparison(budgetIds, period)
 * - Stale Time: 10 minutes
 * - Maximum 10 budgets recommended
 */
export const useBudgetComparisonData = (budgetIds: string[], period?: 'monthly' | 'quarterly' | 'yearly') => {
  return useQuery({
    queryKey: budgetKeys.comparison(budgetIds, period),
    queryFn: async (): Promise<{
      budgets: Array<{
        budgetId: string;
        name: string;
        totalBudgeted: number;
        totalSpent: number;
        variance: number;
        performance: number;
      }>;
      trends: Array<{
        period: string;
        budgets: Array<{
          budgetId: string;
          spent: number;
          budgeted: number;
        }>;
      }>;
    }> => {
      const params = new URLSearchParams();
      budgetIds.forEach(id => params.append('budgetIds', id));
      if (period) params.append('period', period);

      const response = await fetch(`/api/budgets/comparison?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget comparison');
      return response.json();
    },
    enabled: budgetIds.length > 0,
  });
};
