/**
 * Budget Domain Report Type Definitions
 *
 * Report generation types for budget analysis and reporting.
 *
 * @module hooks/domains/budgets/budgetTypes.reports
 *
 * @since 1.0.0
 */

import type { BudgetUser } from './budgetTypes.core';

/**
 * Budget report interface for generated financial reports.
 *
 * Represents a generated budget report with typed data structures for various
 * report types including summaries, detailed breakdowns, variance analysis,
 * and forecasting reports.
 *
 * @interface BudgetReport
 *
 * @property {string} id - Unique report identifier
 * @property {'SUMMARY' | 'DETAILED' | 'VARIANCE' | 'FORECAST'} type - Report type
 * @property {string} title - Report title
 * @property {string} period - Reporting period (e.g., "2024 Q1", "FY2024")
 * @property {any} data - Report-specific data structure (varies by type)
 * @property {string} generatedAt - Report generation timestamp (ISO 8601)
 * @property {BudgetUser} generatedBy - User who generated the report
 *
 * @example
 * ```typescript
 * const summaryReport: BudgetReport = {
 *   id: 'report-123',
 *   type: 'SUMMARY',
 *   title: 'Q1 2024 Budget Summary',
 *   period: '2024-Q1',
 *   data: {
 *     totalBudgeted: 100000,
 *     totalSpent: 45000,
 *     utilizationRate: 45,
 *     categoryBreakdown: [...]
 *   },
 *   generatedAt: '2024-04-01T10:00:00Z',
 *   generatedBy: { id: 'user-1', name: 'Jane Doe', email: 'jane@school.edu' }
 * };
 *
 * const varianceReport: BudgetReport = {
 *   id: 'report-124',
 *   type: 'VARIANCE',
 *   title: 'Budget vs Actual Variance Analysis',
 *   period: 'FY2024',
 *   data: {
 *     budgetedTotal: 100000,
 *     actualTotal: 105000,
 *     variance: -5000,
 *     variancePercentage: -5,
 *     categoryVariances: [...]
 *   },
 *   generatedAt: '2024-06-30T15:00:00Z',
 *   generatedBy: { id: 'user-2', name: 'John Smith', email: 'john@school.edu' }
 * };
 * ```
 *
 * @remarks
 * **Report Types:**
 * - SUMMARY: High-level budget overview with key metrics
 * - DETAILED: Comprehensive transaction-level breakdown
 * - VARIANCE: Budget vs. actual spending comparison
 * - FORECAST: Projected spending and trend analysis
 *
 * **Data Structure:**
 * - data property structure varies by report type
 * - Contains charts, tables, metrics specific to report
 * - May include visualizations in JSON format
 *
 * **Generation:**
 * - Reports generated on-demand or scheduled
 * - Cached for 15 minutes after generation
 * - Historical reports remain static
 *
 * @see {@link useGenerateBudgetReport} for report generation
 * @see {@link useBudgetReports} for fetching reports
 *
 * @since 1.0.0
 */
export interface BudgetReport {
  id: string;
  type: 'SUMMARY' | 'DETAILED' | 'VARIANCE' | 'FORECAST';
  title: string;
  period: string;
  data: any;
  generatedAt: string;
  generatedBy: BudgetUser;
}
