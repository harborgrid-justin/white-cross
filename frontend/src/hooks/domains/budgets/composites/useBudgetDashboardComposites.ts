/**
 * Budget Dashboard Composite Hooks
 *
 * Provides composite hooks for budget dashboard data aggregation.
 * Aggregates performance metrics and alerts for comprehensive dashboard views.
 *
 * @module hooks/domains/budgets/composites/useBudgetDashboardComposites
 *
 * @remarks
 * **Architecture:**
 * - Aggregates multiple data sources
 * - Implements real-time alert polling
 * - Provides performance metrics
 *
 * **Dashboard Pattern:**
 * - Performance metrics aggregation
 * - Real-time alerts with polling
 * - Comprehensive budget insights
 *
 * @see {@link useBudgetQueries} for query hooks
 *
 * @since 1.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';
import { useBudgets } from '../queries';

/**
 * Budget performance dashboard data aggregation hook.
 *
 * Aggregates budgets, performance metrics, and alerts for comprehensive dashboard views.
 * Provides real-time alerts with 30-second refresh interval.
 *
 * @param {Object} [filters] - Optional filters for dashboard scope
 * @param {string} [filters.departmentId] - Filter by department
 * @param {number} [filters.fiscalYear] - Filter by fiscal year
 *
 * @returns {Object} Dashboard data interface
 * @returns {Budget[]} returns.budgets - Filtered budgets
 * @returns {Object} returns.metrics - Aggregated performance metrics
 * @returns {Object} returns.alerts - Critical, warning, and info alerts
 * @returns {number} returns.utilizationRate - Average utilization percentage
 * @returns {number} returns.budgetsCount - Total budget count
 * @returns {number} returns.criticalAlertsCount - Number of critical alerts
 *
 * @example
 * ```typescript
 * function BudgetDashboard({ departmentId }: Props) {
 *   const {
 *     budgets,
 *     metrics,
 *     alerts,
 *     utilizationRate,
 *     criticalAlertsCount,
 *     isLoadingMetrics,
 *     isLoadingAlerts
 *   } = useBudgetDashboard({ departmentId, fiscalYear: 2024 });
 *
 *   return (
 *     <div>
 *       <MetricsSummary
 *         totalBudgeted={metrics?.totalAllocated}
 *         totalSpent={metrics?.totalSpent}
 *         utilizationRate={utilizationRate}
 *       />
 *       <AlertsPanel
 *         critical={alerts?.critical}
 *         warnings={alerts?.warnings}
 *       />
 *       <BudgetsList budgets={budgets} />
 *       <TopCategoriesChart data={metrics?.topCategories} />
 *       <TrendsChart data={metrics?.monthlyTrends} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Metrics Included:**
 * - Total budgets, allocated, spent, remaining
 * - Average utilization across all budgets
 * - Budgets over budget / at risk counts
 * - Top spending categories
 * - Monthly spending trends
 *
 * **Alerts:**
 * - Critical: >95% utilization or over budget
 * - Warnings: 80-95% utilization
 * - Info: Status changes, approvals
 * - Auto-refreshes every 30 seconds
 *
 * **Performance:**
 * - Metrics query dependent on budgets
 * - Alerts polled for real-time updates
 *
 * @since 1.0.0
 */
export const useBudgetDashboard = (filters?: {
  departmentId?: string;
  fiscalYear?: number;
}) => {
  const budgets = useBudgets(filters);

  const performanceMetrics = useQuery({
    queryKey: [...budgetKeys.all, 'dashboard-metrics', filters],
    queryFn: async (): Promise<{
      totalBudgets: number;
      totalAllocated: number;
      totalSpent: number;
      totalRemaining: number;
      averageUtilization: number;
      budgetsOverBudget: number;
      budgetsAtRisk: number;
      topCategories: Array<{
        name: string;
        allocated: number;
        spent: number;
        utilization: number;
      }>;
      monthlyTrends: Array<{
        month: string;
        budgeted: number;
        spent: number;
        variance: number;
      }>;
    }> => {
      const params = new URLSearchParams();
      if (filters?.departmentId) params.append('departmentId', filters.departmentId);
      if (filters?.fiscalYear) params.append('fiscalYear', filters.fiscalYear.toString());

      const response = await fetch(`/api/budgets/dashboard-metrics?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard metrics');
      return response.json();
    },
    enabled: !!budgets.data,
  });

  const alertsSummary = useQuery({
    queryKey: [...budgetKeys.all, 'alerts-summary', filters],
    queryFn: async (): Promise<{
      critical: Array<{
        budgetId: string;
        budgetName: string;
        alertType: 'OVER_BUDGET' | 'NEAR_LIMIT' | 'UNUSUAL_SPENDING';
        message: string;
        severity: 'HIGH' | 'MEDIUM' | 'LOW';
      }>;
      warnings: Array<{
        budgetId: string;
        budgetName: string;
        message: string;
      }>;
      info: Array<{
        budgetId: string;
        budgetName: string;
        message: string;
      }>;
    }> => {
      const params = new URLSearchParams();
      if (filters?.departmentId) params.append('departmentId', filters.departmentId);
      if (filters?.fiscalYear) params.append('fiscalYear', filters.fiscalYear.toString());

      const response = await fetch(`/api/budgets/alerts-summary?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch alerts summary');
      return response.json();
    },
    enabled: !!budgets.data,
    refetchInterval: 30000, // Refresh alerts every 30 seconds
  });

  return {
    // Data
    budgets: budgets.data,
    metrics: performanceMetrics.data,
    alerts: alertsSummary.data,

    // Loading states
    isLoadingBudgets: budgets.isLoading,
    isLoadingMetrics: performanceMetrics.isLoading,
    isLoadingAlerts: alertsSummary.isLoading,

    // Error states
    budgetsError: budgets.error,
    metricsError: performanceMetrics.error,
    alertsError: alertsSummary.error,

    // Refetch functions
    refetchBudgets: budgets.refetch,
    refetchMetrics: performanceMetrics.refetch,
    refetchAlerts: alertsSummary.refetch,

    // Computed values
    utilizationRate: performanceMetrics.data?.averageUtilization || 0,
    budgetsCount: performanceMetrics.data?.totalBudgets || 0,
    criticalAlertsCount: alertsSummary.data?.critical.length || 0,
  };
};
