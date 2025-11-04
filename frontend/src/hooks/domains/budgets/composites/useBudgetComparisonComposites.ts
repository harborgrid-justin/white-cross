/**
 * Budget Comparison Composite Hooks
 *
 * Provides composite hooks for multi-budget comparison and analysis.
 * Compares performance across multiple budgets with insights and recommendations.
 * Generates comparative reports for budget analysis and optimization.
 *
 * @module hooks/domains/budgets/composites/useBudgetComparisonComposites
 *
 * @remarks
 * **Architecture:**
 * - Aggregates multiple budget data
 * - Implements comparative analysis
 * - Provides report generation
 *
 * **Comparison Pattern:**
 * - Multi-budget analysis
 * - AI-generated insights
 * - Downloadable reports
 *
 * @see {@link useBudgetQueries} for query hooks
 *
 * @since 1.0.0
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';

/**
 * Multi-budget comparison and analysis hook.
 *
 * Compares performance across multiple budgets with insights and recommendations.
 * Generates comparative reports for budget analysis and optimization.
 *
 * @param {string[]} budgetIds - Array of budget IDs to compare (2-10 budgets)
 *
 * @returns {Object} Comparison interface
 * @returns {Object} returns.comparison - Comparison data with budgets and insights
 * @returns {Object} returns.comparison.budgets - Per-budget comparison metrics
 * @returns {Object} returns.comparison.insights - AI-generated insights and recommendations
 * @returns {function} returns.generateReport - Generate downloadable comparison report
 * @returns {boolean} returns.isGeneratingReport - True when generating report
 *
 * @example
 * ```typescript
 * function BudgetComparisonPage({ budgetIds }: Props) {
 *   const {
 *     comparison,
 *     generateReport,
 *     isLoading,
 *     isGeneratingReport
 *   } = useBudgetComparison(budgetIds);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!comparison) return null;
 *
 *   const handleExport = () => {
 *     generateReport({
 *       reportType: 'EXECUTIVE_SUMMARY',
 *       includeRecommendations: true
 *     }, {
 *       onSuccess: (blob) => {
 *         const url = URL.createObjectURL(blob);
 *         const a = document.createElement('a');
 *         a.href = url;
 *         a.download = 'budget-comparison.pdf';
 *         a.click();
 *       }
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <ComparisonTable budgets={comparison.budgets} />
 *       <InsightsPanel insights={comparison.insights} />
 *       <button onClick={handleExport} disabled={isGeneratingReport}>
 *         Export Report
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Comparison Metrics:**
 * - Total allocated, spent, variance per budget
 * - Utilization percentages
 * - Performance ratings (EXCELLENT, GOOD, AVERAGE, POOR)
 * - Category-level breakdowns
 *
 * **Insights:**
 * - Best/worst performers identification
 * - Most efficient budget analysis
 * - Budgets needing attention
 * - Actionable recommendations
 *
 * **Report Generation:**
 * - Types: COMPARISON, ANALYSIS, EXECUTIVE_SUMMARY
 * - PDF format with charts and tables
 * - Optional recommendations section
 *
 * **Limitations:**
 * - Maximum 10 budgets recommended
 * - Requires budgetIds.length > 1
 *
 * @since 1.0.0
 */
export const useBudgetComparison = (budgetIds: string[]) => {
  const queryClient = useQueryClient();

  const comparison = useQuery({
    queryKey: budgetKeys.comparison(budgetIds),
    queryFn: async (): Promise<{
      budgets: Array<{
        id: string;
        name: string;
        totalAllocated: number;
        totalSpent: number;
        utilization: number;
        variance: number;
        performance: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
        categories: Array<{
          name: string;
          allocated: number;
          spent: number;
          variance: number;
        }>;
      }>;
      insights: Array<{
        type: 'BEST_PERFORMER' | 'WORST_PERFORMER' | 'MOST_EFFICIENT' | 'NEEDS_ATTENTION';
        budgetId: string;
        budgetName: string;
        description: string;
        recommendations: string[];
      }>;
    }> => {
      const params = new URLSearchParams();
      budgetIds.forEach(id => params.append('budgetIds', id));

      const response = await fetch(`/api/budgets/comparison?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget comparison');
      return response.json();
    },
    enabled: budgetIds.length > 1,
  });

  const generateReport = useMutation({
    mutationFn: async ({
      reportType,
      includeRecommendations
    }: {
      reportType: 'COMPARISON' | 'ANALYSIS' | 'EXECUTIVE_SUMMARY';
      includeRecommendations: boolean;
    }) => {
      const response = await fetch('/api/budgets/comparison-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetIds,
          reportType,
          includeRecommendations
        }),
      });
      if (!response.ok) throw new Error('Failed to generate comparison report');
      return response.blob();
    },
  });

  return {
    // Data
    comparison: comparison.data,

    // Loading states
    isLoading: comparison.isLoading,

    // Error states
    error: comparison.error,

    // Actions
    generateReport: generateReport.mutate,

    // Action states
    isGeneratingReport: generateReport.isPending,

    // Refetch
    refetch: comparison.refetch,
  };
};
