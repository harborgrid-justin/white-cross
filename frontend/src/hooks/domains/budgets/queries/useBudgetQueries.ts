/**
 * Budget Domain Query Hooks
 *
 * Provides TanStack Query hooks for fetching budget-related data including budgets,
 * categories, transactions, reports, analytics, and real-time status updates.
 *
 * @module hooks/domains/budgets/queries/useBudgetQueries
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
 * - Transactions: 2-minute stale time (more volatile)
 * - Reports: 15-minute stale time (less volatile)
 * - Real-time status: 1-minute polling interval
 *
 * **Performance:**
 * - All queries support conditional execution via enabled option
 * - Pagination support for large datasets (infinite queries)
 * - Query results cached in memory for instant access
 *
 * **File Organization:**
 * This file re-exports all hooks from their respective modules:
 * - useBudgetCoreQueries.ts - Budget list, detail, and pagination
 * - useBudgetCategoryQueries.ts - Category queries and hierarchies
 * - useBudgetTransactionQueries.ts - Transaction queries and pagination
 * - useBudgetReportQueries.ts - Report queries and listings
 * - useBudgetAnalyticsQueries.ts - Analytics and comparison queries
 * - useBudgetStatusQueries.ts - Real-time status and monitoring
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetMutations} for data modification hooks
 * @see {@link useBudgetComposites} for composite workflow hooks
 *
 * @since 1.0.0
 */

// Core Budget Queries - Budget list, detail, and pagination
export {
  useBudget,
  useBudgets,
  useBudgetsPaginated,
} from './useBudgetCoreQueries';

// Category Queries - Category queries and hierarchies
export {
  useBudgetCategory,
  useBudgetCategories,
} from './useBudgetCategoryQueries';

// Transaction Queries - Transaction queries and pagination
export {
  useBudgetTransaction,
  useBudgetTransactions,
  useBudgetTransactionsPaginated,
} from './useBudgetTransactionQueries';

// Report Queries - Report queries and listings
export {
  useBudgetReport,
  useBudgetReports,
} from './useBudgetReportQueries';

// Analytics Queries - Analytics and comparison queries
export {
  useBudgetAnalytics,
  useBudgetComparisonData,
} from './useBudgetAnalyticsQueries';

// Status Queries - Real-time status and monitoring
export {
  useBudgetStatus,
} from './useBudgetStatusQueries';
