/**
 * Budget Query Hooks - Central Export
 *
 * Re-exports all budget query hooks from their respective modules for backward compatibility.
 * This index file allows existing code to continue importing from the main queries directory
 * while the implementation is split across multiple focused files.
 *
 * @module hooks/domains/budgets/queries
 *
 * @remarks
 * **File Organization:**
 * - useBudgetCoreQueries.ts - Budget list, detail, and pagination queries
 * - useBudgetCategoryQueries.ts - Category queries and hierarchies
 * - useBudgetTransactionQueries.ts - Transaction queries and pagination
 * - useBudgetReportQueries.ts - Report queries and listings
 * - useBudgetAnalyticsQueries.ts - Analytics and comparison queries
 * - useBudgetStatusQueries.ts - Real-time status and monitoring queries
 *
 * **Migration Guide:**
 * You can import from this index file (backward compatible):
 * ```typescript
 * import { useBudget, useBudgets } from '@/hooks/domains/budgets/queries';
 * ```
 *
 * Or import from specific modules (recommended for better tree-shaking):
 * ```typescript
 * import { useBudget, useBudgets } from '@/hooks/domains/budgets/queries/useBudgetCoreQueries';
 * import { useBudgetCategory } from '@/hooks/domains/budgets/queries/useBudgetCategoryQueries';
 * ```
 *
 * @see {@link budgetKeys} for query key factory
 * @see {@link useBudgetMutations} for data modification hooks
 * @see {@link useBudgetComposites} for composite workflow hooks
 *
 * @since 1.0.0
 */

// Core Budget Queries
export {
  useBudget,
  useBudgets,
  useBudgetsPaginated,
} from './useBudgetCoreQueries';

// Category Queries
export {
  useBudgetCategory,
  useBudgetCategories,
} from './useBudgetCategoryQueries';

// Transaction Queries
export {
  useBudgetTransaction,
  useBudgetTransactions,
  useBudgetTransactionsPaginated,
} from './useBudgetTransactionQueries';

// Report Queries
export {
  useBudgetReport,
  useBudgetReports,
} from './useBudgetReportQueries';

// Analytics Queries
export {
  useBudgetAnalytics,
  useBudgetComparisonData,
} from './useBudgetAnalyticsQueries';

// Status Queries
export {
  useBudgetStatus,
} from './useBudgetStatusQueries';
