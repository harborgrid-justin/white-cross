/**
 * Budget Mutations Index
 *
 * Re-exports all budget mutation hooks for backward compatibility.
 * This preserves the original API where all mutations were imported from a single file.
 *
 * @module hooks/domains/budgets/mutations
 *
 * @remarks
 * **Migration Guide:**
 * Original (still works):
 * ```typescript
 * import { useCreateBudget, useUpdateBudget } from '@/hooks/domains/budgets/mutations';
 * ```
 *
 * New (more explicit, optional):
 * ```typescript
 * import { useCreateBudget, useUpdateBudget } from '@/hooks/domains/budgets/mutations/useBudgetCRUDMutations';
 * import { useCreateBudgetCategory } from '@/hooks/domains/budgets/mutations/useBudgetCategoryMutations';
 * ```
 *
 * **Module Organization:**
 * - useBudgetCRUDMutations: Budget create, update, delete, approve
 * - useBudgetCategoryMutations: Category create, update, delete
 * - useBudgetTransactionMutations: Transaction create, update, delete
 * - useBudgetApprovalMutations: Transaction approve, reject
 * - useBudgetReportMutations: Report generate, delete
 * - useBudgetBulkMutations: Bulk delete budgets, bulk approve transactions
 *
 * @see {@link useBudgetCRUDMutations} for budget operations
 * @see {@link useBudgetCategoryMutations} for category operations
 * @see {@link useBudgetTransactionMutations} for transaction operations
 * @see {@link useBudgetApprovalMutations} for approval workflow
 * @see {@link useBudgetReportMutations} for report operations
 * @see {@link useBudgetBulkMutations} for bulk operations
 *
 * @since 1.0.0
 */

// Budget CRUD operations
export {
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from './useBudgetCRUDMutations';

// Budget workflow operations
export {
  useApproveBudget,
} from './useBudgetWorkflowMutations';

// Budget category operations
export {
  useCreateBudgetCategory,
  useUpdateBudgetCategory,
  useDeleteBudgetCategory,
} from './useBudgetCategoryMutations';

// Budget transaction operations
export {
  useCreateBudgetTransaction,
  useUpdateBudgetTransaction,
  useDeleteBudgetTransaction,
} from './useBudgetTransactionMutations';

// Transaction approval workflow
export {
  useApproveTransaction,
  useRejectTransaction,
} from './useBudgetApprovalMutations';

// Budget report operations
export {
  useGenerateBudgetReport,
  useDeleteBudgetReport,
} from './useBudgetReportMutations';

// Bulk operations
export {
  useBulkDeleteBudgets,
  useBulkApproveTransactions,
} from './useBudgetBulkMutations';
