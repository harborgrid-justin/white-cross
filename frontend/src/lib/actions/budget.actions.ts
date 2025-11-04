/**
 * @fileoverview Budget Management Server Actions - Next.js v14+ Compatible
 * @module app/budget/actions
 *
 * HIPAA-compliant server actions for budget and financial planning with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all budget operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * Architecture:
 * This file serves as the main export point for budget management functionality.
 * Implementation is organized into focused modules:
 * - budget.types.ts: Type definitions and interfaces
 * - budget.cache.ts: Cached data fetching functions
 * - budget.categories.ts: Category CRUD operations
 * - budget.transactions.ts: Transaction CRUD operations
 * - budget.forms.ts: FormData handling
 * - budget.utils.ts: Utility functions
 */

'use server';

// ==========================================
// RE-EXPORTS - TYPE DEFINITIONS
// ==========================================

export type {
  ActionResult,
  BudgetCategory,
  CreateBudgetCategoryData,
  UpdateBudgetCategoryData,
  BudgetTransaction,
  CreateBudgetTransactionData,
  UpdateBudgetTransactionData,
  BudgetSummary,
  BudgetFilters,
  TransactionFilters,
} from './budget.types';

export { BUDGET_CACHE_TAGS } from './budget.types';

// ==========================================
// RE-EXPORTS - CACHE OPERATIONS
// ==========================================

export {
  getBudgetCategory,
  getBudgetCategories,
  getBudgetTransaction,
  getBudgetTransactions,
  getBudgetSummary,
} from './budget.cache';

// ==========================================
// RE-EXPORTS - CATEGORY OPERATIONS
// ==========================================

export {
  createBudgetCategoryAction,
  updateBudgetCategoryAction,
} from './budget.categories';

// ==========================================
// RE-EXPORTS - TRANSACTION OPERATIONS
// ==========================================

export {
  createBudgetTransactionAction,
  updateBudgetTransactionAction,
} from './budget.transactions';

// ==========================================
// RE-EXPORTS - FORM HANDLERS
// ==========================================

export {
  createBudgetCategoryFromForm,
  createBudgetTransactionFromForm,
} from './budget.forms';

// ==========================================
// RE-EXPORTS - UTILITY FUNCTIONS
// ==========================================

export {
  budgetCategoryExists,
  budgetTransactionExists,
  getBudgetCategoryCount,
  getBudgetTransactionCount,
  getBudgetOverview,
  clearBudgetCache,
} from './budget.utils';
