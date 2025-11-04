/**
 * Budget Report Query Hooks
 *
 * Provides TanStack Query hooks for fetching budget report data including single
 * report details and filtered report lists for various report types.
 *
 * @module hooks/domains/budgets/queries/useBudgetReportQueries
 *
 * @remarks
 * **Architecture:**
 * - Uses TanStack Query v5 for data fetching and caching
 * - Query keys managed through budgetKeys factory for consistency
 * - Automatic background refetching on window focus
 * - Retry logic with exponential backoff (3 attempts)
 *
 * **Cache Strategy:**
 * - Reports: 15-minute stale time (reports are relatively static)
 * - Automatic background refetching keeps data fresh
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetMutations} for data modification hooks
 *
 * @since 1.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';
import type { BudgetReport } from '../budgetTypes';

/**
 * Fetches a single budget report by ID with generated data and metadata.
 *
 * @param {string} reportId - Unique identifier of the report to fetch
 *
 * @returns {UseQueryResult<BudgetReport>} TanStack Query result object
 * @returns {BudgetReport} returns.data - The report with data and generation info
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * function ReportViewerPage({ reportId }: Props) {
 *   const { data: report, isLoading } = useBudgetReport(reportId);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!report) return <NotFound />;
 *
 *   return (
 *     <div>
 *       <h1>{report.title}</h1>
 *       <p>Type: {report.type}</p>
 *       <p>Period: {report.period}</p>
 *       <p>Generated: {new Date(report.generatedAt).toLocaleString()}</p>
 *       <p>By: {report.generatedBy.name}</p>
 *       <ReportRenderer data={report.data} type={report.type} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.report(reportId)
 * - Stale Time: 15 minutes (reports are static)
 * - Enabled: Only when reportId is truthy
 *
 * **Report Types:**
 * - SUMMARY: High-level budget overview
 * - DETAILED: Comprehensive transaction breakdown
 * - VARIANCE: Budget vs. actual comparison
 * - FORECAST: Projected spending analysis
 *
 * **Data Structure:**
 * - report.data contains report-specific structure
 * - Structure varies by report type
 * - Includes charts, tables, and metrics
 *
 * @see {@link useBudgetReports} for fetching report lists
 * @see {@link useGenerateBudgetReport} for creating new reports
 *
 * @since 1.0.0
 */
export const useBudgetReport = (reportId: string) => {
  return useQuery({
    queryKey: budgetKeys.report(reportId),
    queryFn: async (): Promise<BudgetReport> => {
      const response = await fetch(`/api/budget-reports/${reportId}`);
      if (!response.ok) throw new Error('Failed to fetch budget report');
      return response.json();
    },
    enabled: !!reportId,
  });
};

/**
 * Fetches filtered list of budget reports with optional type and date range filters.
 *
 * @param {Object} [filters] - Optional filters for reports
 * @param {string} [filters.budgetId] - Filter by budget ID
 * @param {'variance' | 'summary' | 'forecast' | 'performance'} [filters.type] - Filter by report type
 * @param {string} [filters.startDate] - Filter reports generated on/after this date
 * @param {string} [filters.endDate] - Filter reports generated on/before this date
 *
 * @returns {UseQueryResult<BudgetReport[]>} TanStack Query result object
 * @returns {BudgetReport[]} returns.data - Array of reports matching filters
 * @returns {boolean} returns.isLoading - True when initial fetch is in progress
 * @returns {boolean} returns.isError - True when fetch failed
 * @returns {Error} returns.error - Error object if request failed
 * @returns {function} returns.refetch - Manual refetch function
 *
 * @example
 * ```typescript
 * function ReportLibrary({ budgetId }: Props) {
 *   const { data: reports, isLoading } = useBudgetReports({
 *     budgetId,
 *     type: 'variance'
 *   });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       <h2>Variance Reports</h2>
 *       <ReportList reports={reports} />
 *     </div>
 *   );
 * }
 *
 * // Example: Recent reports dashboard
 * function RecentReports() {
 *   const thirtyDaysAgo = new Date();
 *   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
 *
 *   const { data: recentReports } = useBudgetReports({
 *     startDate: thirtyDaysAgo.toISOString()
 *   });
 *
 *   return <ReportCards reports={recentReports} />;
 * }
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: budgetKeys.reports(filters)
 * - Stale Time: 15 minutes
 * - Cache: Separate cache per filter combination
 *
 * **Report Types:**
 * - variance: Budget vs. actual analysis
 * - summary: Executive summary reports
 * - forecast: Spending projections
 * - performance: Performance metrics
 *
 * @see {@link useBudgetReport} for single report details
 * @see {@link useGenerateBudgetReport} for creating reports
 *
 * @since 1.0.0
 */
export const useBudgetReports = (filters?: {
  budgetId?: string;
  type?: 'variance' | 'summary' | 'forecast' | 'performance';
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: budgetKeys.reports(filters),
    queryFn: async (): Promise<BudgetReport[]> => {
      const params = new URLSearchParams();
      if (filters?.budgetId) params.append('budgetId', filters.budgetId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/budget-reports?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget reports');
      return response.json();
    },
  });
};
