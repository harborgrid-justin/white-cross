/**
 * @fileoverview Budget Management Type Definitions
 * @module lib/actions/budget.types
 *
 * TypeScript type definitions and interfaces for budget management system.
 * Supports categories, transactions, summaries, and filtering.
 *
 * Note: Runtime values (constants) are in budget.constants.ts
 */

// ==========================================
// COMMON TYPES
// ==========================================

/**
 * Standard action result wrapper for all budget operations
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

// ==========================================
// BUDGET CATEGORY TYPES
// ==========================================

/**
 * Budget category with spending tracking
 */
export interface BudgetCategory {
  id: string;
  name: string;
  description: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  status: 'on_track' | 'over_budget' | 'under_budget';
  parentCategoryId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new budget category
 */
export interface CreateBudgetCategoryData {
  name: string;
  description: string;
  budgetAmount: number;
  parentCategoryId?: string;
  isActive?: boolean;
}

/**
 * Data for updating an existing budget category
 */
export interface UpdateBudgetCategoryData {
  name?: string;
  description?: string;
  budgetAmount?: number;
  parentCategoryId?: string;
  isActive?: boolean;
}

// ==========================================
// BUDGET TRANSACTION TYPES
// ==========================================

/**
 * Budget transaction record (income or expense)
 */
export interface BudgetTransaction {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  reference: string;
  date: string;
  vendorId?: string;
  vendorName?: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new budget transaction
 */
export interface CreateBudgetTransactionData {
  categoryId: string;
  amount: number;
  type: BudgetTransaction['type'];
  description: string;
  reference: string;
  date: string;
  vendorId?: string;
  vendorName?: string;
}

/**
 * Data for updating an existing budget transaction
 */
export interface UpdateBudgetTransactionData {
  categoryId?: string;
  amount?: number;
  type?: BudgetTransaction['type'];
  description?: string;
  reference?: string;
  date?: string;
  vendorId?: string;
  vendorName?: string;
  status?: BudgetTransaction['status'];
}

// ==========================================
// SUMMARY AND REPORTING TYPES
// ==========================================

/**
 * Comprehensive budget summary with trends
 */
export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentage: number;
  categorySummaries: {
    categoryId: string;
    categoryName: string;
    budgetAmount: number;
    spentAmount: number;
    remainingAmount: number;
    percentage: number;
    status: BudgetCategory['status'];
  }[];
  monthlyTrends: {
    month: string;
    budgeted: number;
    spent: number;
    variance: number;
  }[];
}

// ==========================================
// FILTER TYPES
// ==========================================

/**
 * Filters for querying budget categories
 */
export interface BudgetFilters {
  categoryId?: string;
  status?: BudgetCategory['status'];
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Filters for querying budget transactions
 */
export interface TransactionFilters {
  categoryId?: string;
  type?: BudgetTransaction['type'];
  status?: BudgetTransaction['status'];
  dateFrom?: string;
  dateTo?: string;
  vendorId?: string;
}
