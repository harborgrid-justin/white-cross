/**
 * @fileoverview Budget Utility Functions
 * @module lib/actions/budget.utils
 *
 * Utility functions for budget management including existence checks,
 * counts, overview data, and cache management.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';

// Import cache functions
import {
  getBudgetCategory,
  getBudgetTransaction,
  getBudgetCategories,
  getBudgetTransactions,
  getBudgetSummary,
} from './budget.cache';

// Types
import type { BudgetFilters, TransactionFilters } from './budget.types';

// Import cache tags
import { BUDGET_CACHE_TAGS } from './budget.types';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if budget category exists
 */
export async function budgetCategoryExists(categoryId: string): Promise<boolean> {
  const category = await getBudgetCategory(categoryId);
  return category !== null;
}

/**
 * Check if budget transaction exists
 */
export async function budgetTransactionExists(transactionId: string): Promise<boolean> {
  const transaction = await getBudgetTransaction(transactionId);
  return transaction !== null;
}

/**
 * Get budget category count
 */
export const getBudgetCategoryCount = cache(async (filters?: BudgetFilters): Promise<number> => {
  try {
    const categories = await getBudgetCategories(filters);
    return categories.length;
  } catch {
    return 0;
  }
});

/**
 * Get budget transaction count
 */
export const getBudgetTransactionCount = cache(async (filters?: TransactionFilters): Promise<number> => {
  try {
    const transactions = await getBudgetTransactions(filters);
    return transactions.length;
  } catch {
    return 0;
  }
});

/**
 * Get budget overview
 */
export async function getBudgetOverview(): Promise<{
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentage: number;
  categoriesOverBudget: number;
}> {
  try {
    const summary = await getBudgetSummary();
    const categories = await getBudgetCategories();

    return {
      totalBudget: summary?.totalBudget || 0,
      totalSpent: summary?.totalSpent || 0,
      totalRemaining: summary?.totalRemaining || 0,
      overallPercentage: summary?.overallPercentage || 0,
      categoriesOverBudget: categories.filter(c => c.status === 'over_budget').length,
    };
  } catch {
    return {
      totalBudget: 0,
      totalSpent: 0,
      totalRemaining: 0,
      overallPercentage: 0,
      categoriesOverBudget: 0,
    };
  }
}

/**
 * Clear budget cache
 */
export async function clearBudgetCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }

  // Clear all budget caches
  Object.values(BUDGET_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('budget-category-list', 'default');
  revalidateTag('budget-transaction-list', 'default');
  revalidateTag('budget-stats', 'default');

  // Clear paths
  revalidatePath('/budget', 'page');
  revalidatePath('/budget/categories', 'page');
  revalidatePath('/budget/transactions', 'page');
  revalidatePath('/budget/reports', 'page');
}
