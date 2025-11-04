/**
 * Budget Report Mutation Hooks
 *
 * Provides TanStack Query mutation hooks for budget report operations.
 * Handles on-demand report generation and deletion with automatic cache management.
 *
 * @module hooks/domains/budgets/mutations/useBudgetReportMutations
 *
 * @remarks
 * **Report Types:**
 * - SUMMARY: High-level budget overview with key metrics
 * - DETAILED: Comprehensive breakdown by category and transaction
 * - VARIANCE: Budget vs. actual spending analysis
 * - FORECAST: Projected spending based on trends
 *
 * **Generation:**
 * - Reports generated on-demand via API
 * - Server-side processing for complex calculations
 * - Results cached for 15 minutes (server-side)
 * - Client cache invalidation on creation/deletion
 *
 * **Cache Strategy:**
 * - Generate: Invalidates reports() list to show new report
 * - Delete: Removes specific report + invalidates reports list
 *
 * **Use Cases:**
 * - Monthly/quarterly financial reviews
 * - Budget variance analysis
 * - Forecasting and planning
 * - Audit trail documentation
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetQueries} for fetching reports
 * @see {@link useBudgetCRUDMutations} for budget operations
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { budgetKeys } from '../budgetQueryKeys';
import type { BudgetReport } from '../budgetTypes';

/**
 * Generates a new budget report (summary, detailed, variance, or forecast).
 *
 * @returns {UseMutationResult} Mutation result accepting report configuration
 *
 * @example
 * ```typescript
 * const generateReport = useGenerateBudgetReport();
 * generateReport.mutate({
 *   budgetId: 'budget-123',
 *   type: 'VARIANCE',
 *   title: 'Q1 2024 Variance Report',
 *   period: '2024-Q1',
 *   includeTransactions: true,
 *   includeComparisons: true
 * });
 * ```
 *
 * @remarks
 * **Report Types:** SUMMARY, DETAILED, VARIANCE, FORECAST
 * **Generation:** Reports generated on-demand, cached for 15 minutes
 * **Cache:** Invalidates reports list queries
 *
 * @see {@link useBudgetReports}
 * @since 1.0.0
 */
export const useGenerateBudgetReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportConfig: {
      budgetId: string;
      type: 'SUMMARY' | 'DETAILED' | 'VARIANCE' | 'FORECAST';
      title: string;
      period: string;
      includeTransactions?: boolean;
      includeComparisons?: boolean;
    }): Promise<BudgetReport> => {
      const response = await fetch('/api/budget-reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportConfig),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      return response.json();
    },
    onSuccess: (newReport) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.reports() });
      toast.success(`Report "${newReport.title}" generated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });
};

/**
 * Deletes a generated budget report.
 *
 * @returns {UseMutationResult} Mutation result accepting reportId
 *
 * @example
 * ```typescript
 * const deleteReport = useDeleteBudgetReport();
 * deleteReport.mutate('report-123');
 * ```
 *
 * @since 1.0.0
 */
export const useDeleteBudgetReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string): Promise<void> => {
      const response = await fetch(`/api/budget-reports/${reportId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete report');
    },
    onSuccess: (_, reportId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.report(reportId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.reports() });
      toast.success('Report deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete report: ${error.message}`);
    },
  });
};
