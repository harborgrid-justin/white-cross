/**
 * Budget Domain - Complete Export Module
 *
 * Centralized exports for budget management functionality including configuration,
 * query hooks, mutation hooks, composite workflow hooks, and TypeScript type definitions.
 *
 * @module hooks/domains/budgets
 *
 * @remarks
 * **Module Organization:**
 * - Configuration: Query keys, cache config, utility functions
 * - Query Hooks: Data fetching with TanStack Query
 * - Mutation Hooks: Data modification with cache invalidation
 * - Composite Hooks: High-level workflow orchestration
 * - Types: Complete TypeScript type definitions
 *
 * **Usage Pattern:**
 * Import specific hooks or types as needed:
 * ```typescript
 * import { useBudget, useCreateBudget, useBudgetWorkflow } from '@/hooks/domains/budgets';
 * import type { Budget, BudgetTransaction } from '@/hooks/domains/budgets';
 * ```
 *
 * **Hook Categories:**
 *
 * **Query Hooks (Data Fetching):**
 * - useBudget, useBudgets, useBudgetsPaginated
 * - useBudgetCategory, useBudgetCategories
 * - useBudgetTransaction, useBudgetTransactions, useBudgetTransactionsPaginated
 * - useBudgetReport, useBudgetReports
 * - useBudgetAnalytics, useBudgetComparisonData
 * - useBudgetStatus
 *
 * **Mutation Hooks (Data Modification):**
 * - Budget: useCreateBudget, useUpdateBudget, useDeleteBudget, useApproveBudget
 * - Category: useCreateBudgetCategory, useUpdateBudgetCategory, useDeleteBudgetCategory
 * - Transaction: useCreateBudgetTransaction, useUpdateBudgetTransaction, useDeleteBudgetTransaction
 * - Approval: useApproveTransaction, useRejectTransaction
 * - Reports: useGenerateBudgetReport, useDeleteBudgetReport
 * - Bulk: useBulkDeleteBudgets, useBulkApproveTransactions
 *
 * **Composite Hooks (Workflows):**
 * - useBudgetWorkflow: Complete budget management lifecycle
 * - useBudgetPlanning: Planning and forecasting workflows
 * - useTransactionManagement: Transaction approval workflows
 * - useBudgetDashboard: Performance metrics aggregation
 * - useBudgetComparison: Multi-budget analysis
 *
 * **Configuration & Utilities:**
 * - budgetKeys: Query key factory
 * - BUDGETS_CACHE_CONFIG: Cache configuration constants
 * - invalidate* functions: Cache invalidation utilities
 *
 * @example
 * ```typescript
 * // Simple data fetching
 * import { useBudget } from '@/hooks/domains/budgets';
 * const { data: budget, isLoading } = useBudget(budgetId);
 *
 * // Data modification
 * import { useCreateBudget } from '@/hooks/domains/budgets';
 * const createBudget = useCreateBudget();
 * createBudget.mutate(budgetData);
 *
 * // Complete workflow
 * import { useBudgetWorkflow } from '@/hooks/domains/budgets';
 * const workflow = useBudgetWorkflow(budgetId);
 *
 * // Type definitions
 * import type { Budget, BudgetTransaction } from '@/hooks/domains/budgets';
 * const budget: Budget = { ... };
 * ```
 *
 * @see {@link module:hooks/domains/budgets/config} for configuration
 * @see {@link module:hooks/domains/budgets/queries/useBudgetQueries} for query hooks
 * @see {@link module:hooks/domains/budgets/mutations/useBudgetMutations} for mutation hooks
 * @see {@link module:hooks/domains/budgets/composites/useBudgetComposites} for composite hooks
 *
 * @since 1.0.0
 */

// Configuration Exports
export {
  BUDGETS_QUERY_KEYS,
  budgetKeys,
} from './budgetQueryKeys';

export {
  BUDGETS_CACHE_CONFIG,
  invalidateBudgetsQueries,
  invalidateBudgetQueries,
  invalidateBudgetCategoryQueries,
  invalidateTransactionQueries,
} from './budgetCacheConfig';

// Type Exports
export type {
  Budget,
  BudgetCategory,
  BudgetTransaction,
  BudgetReport,
  BudgetUser,
  TransactionAttachment,
} from './budgetTypes';

// Query Hooks
export * from './queries';

// Mutation Hooks
export * from './mutations';

// Composite Hooks
export * from './composites';
