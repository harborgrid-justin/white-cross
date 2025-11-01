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
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for budget
export const BUDGET_CACHE_TAGS = {
  CATEGORIES: 'budget-categories',
  TRANSACTIONS: 'budget-transactions',
  SUMMARY: 'budget-summary',
  TRENDS: 'budget-trends',
  REPORTS: 'budget-reports',
} as const;

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

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

export interface CreateBudgetCategoryData {
  name: string;
  description: string;
  budgetAmount: number;
  parentCategoryId?: string;
  isActive?: boolean;
}

export interface UpdateBudgetCategoryData {
  name?: string;
  description?: string;
  budgetAmount?: number;
  parentCategoryId?: string;
  isActive?: boolean;
}

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

export interface BudgetFilters {
  categoryId?: string;
  status?: BudgetCategory['status'];
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionFilters {
  categoryId?: string;
  type?: BudgetTransaction['type'];
  status?: BudgetTransaction['status'];
  dateFrom?: string;
  dateTo?: string;
  vendorId?: string;
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get budget category by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getBudgetCategory = cache(async (id: string): Promise<BudgetCategory | null> => {
  try {
    const response = await serverGet<ApiResponse<BudgetCategory>>(
      API_ENDPOINTS.BUDGET.CATEGORY_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`budget-category-${id}`, BUDGET_CACHE_TAGS.CATEGORIES] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get budget category:', error);
    return null;
  }
});

/**
 * Get all budget categories with caching
 */
export const getBudgetCategories = cache(async (filters?: BudgetFilters): Promise<BudgetCategory[]> => {
  try {
    const response = await serverGet<ApiResponse<BudgetCategory[]>>(
      API_ENDPOINTS.BUDGET.CATEGORIES,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [BUDGET_CACHE_TAGS.CATEGORIES, 'budget-category-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get budget categories:', error);
    return [];
  }
});

/**
 * Get budget transaction by ID with caching
 */
export const getBudgetTransaction = cache(async (id: string): Promise<BudgetTransaction | null> => {
  try {
    const response = await serverGet<ApiResponse<BudgetTransaction>>(
      API_ENDPOINTS.BUDGET.TRANSACTION_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`budget-transaction-${id}`, BUDGET_CACHE_TAGS.TRANSACTIONS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get budget transaction:', error);
    return null;
  }
});

/**
 * Get all budget transactions with caching
 */
export const getBudgetTransactions = cache(async (filters?: TransactionFilters): Promise<BudgetTransaction[]> => {
  try {
    const response = await serverGet<ApiResponse<BudgetTransaction[]>>(
      API_ENDPOINTS.BUDGET.TRANSACTIONS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [BUDGET_CACHE_TAGS.TRANSACTIONS, 'budget-transaction-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get budget transactions:', error);
    return [];
  }
});

/**
 * Get budget summary with caching
 */
export const getBudgetSummary = cache(async (filters?: Record<string, unknown>): Promise<BudgetSummary | null> => {
  try {
    const response = await serverGet<ApiResponse<BudgetSummary>>(
      API_ENDPOINTS.BUDGET.SUMMARY,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: [BUDGET_CACHE_TAGS.SUMMARY, 'budget-stats'] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get budget summary:', error);
    return null;
  }
});

// ==========================================
// BUDGET CATEGORY OPERATIONS
// ==========================================

/**
 * Create a new budget category
 * Includes audit logging and cache invalidation
 */
export async function createBudgetCategoryAction(data: CreateBudgetCategoryData): Promise<ActionResult<BudgetCategory>> {
  try {
    // Validate required fields
    if (!data.name || !data.budgetAmount) {
      return {
        success: false,
        error: 'Missing required fields: name, budgetAmount'
      };
    }

    // Validate budget amount
    if (data.budgetAmount <= 0) {
      return {
        success: false,
        error: 'Budget amount must be greater than 0'
      };
    }

    const response = await serverPost<ApiResponse<BudgetCategory>>(
      API_ENDPOINTS.BUDGET.CATEGORIES,
      data,
      {
        cache: 'no-store',
        next: { tags: [BUDGET_CACHE_TAGS.CATEGORIES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create budget category');
    }

    // AUDIT LOG - Budget category creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'BudgetCategory',
      resourceId: response.data.id,
      details: `Created budget category: ${data.name} - $${data.budgetAmount}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(BUDGET_CACHE_TAGS.CATEGORIES, 'default');
    revalidateTag('budget-category-list', 'default');
    revalidatePath('/budget/categories', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Budget category created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create budget category';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'BudgetCategory',
      details: `Failed to create budget category: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update budget category
 * Includes audit logging and cache invalidation
 */
export async function updateBudgetCategoryAction(
  categoryId: string,
  data: UpdateBudgetCategoryData
): Promise<ActionResult<BudgetCategory>> {
  try {
    if (!categoryId) {
      return {
        success: false,
        error: 'Category ID is required'
      };
    }

    // Validate budget amount if provided
    if (data.budgetAmount !== undefined && data.budgetAmount <= 0) {
      return {
        success: false,
        error: 'Budget amount must be greater than 0'
      };
    }

    const response = await serverPut<ApiResponse<BudgetCategory>>(
      API_ENDPOINTS.BUDGET.CATEGORY_BY_ID(categoryId),
      data,
      {
        cache: 'no-store',
        next: { tags: [BUDGET_CACHE_TAGS.CATEGORIES, `budget-category-${categoryId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update budget category');
    }

    // AUDIT LOG - Budget category update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'BudgetCategory',
      resourceId: categoryId,
      details: 'Updated budget category information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(BUDGET_CACHE_TAGS.CATEGORIES, 'default');
    revalidateTag(`budget-category-${categoryId}`, 'default');
    revalidateTag('budget-category-list', 'default');
    revalidatePath('/budget/categories', 'page');
    revalidatePath(`/budget/categories/${categoryId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Budget category updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update budget category';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'BudgetCategory',
      resourceId: categoryId,
      details: `Failed to update budget category: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// BUDGET TRANSACTION OPERATIONS
// ==========================================

/**
 * Create budget transaction
 * Includes audit logging and cache invalidation
 */
export async function createBudgetTransactionAction(data: CreateBudgetTransactionData): Promise<ActionResult<BudgetTransaction>> {
  try {
    // Validate required fields
    if (!data.categoryId || !data.amount || !data.type || !data.description || !data.date) {
      return {
        success: false,
        error: 'Missing required fields: categoryId, amount, type, description, date'
      };
    }

    // Validate amount
    if (data.amount <= 0) {
      return {
        success: false,
        error: 'Transaction amount must be greater than 0'
      };
    }

    const response = await serverPost<ApiResponse<BudgetTransaction>>(
      API_ENDPOINTS.BUDGET.TRANSACTIONS,
      data,
      {
        cache: 'no-store',
        next: { tags: [BUDGET_CACHE_TAGS.TRANSACTIONS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create budget transaction');
    }

    // AUDIT LOG - Transaction creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'BudgetTransaction',
      resourceId: response.data.id,
      details: `Created ${data.type} transaction: ${data.description} - $${data.amount}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(BUDGET_CACHE_TAGS.TRANSACTIONS, 'default');
    revalidateTag(BUDGET_CACHE_TAGS.CATEGORIES, 'default');
    revalidateTag(BUDGET_CACHE_TAGS.SUMMARY, 'default');
    revalidateTag('budget-transaction-list', 'default');
    revalidateTag(`budget-category-${data.categoryId}`, 'default');
    revalidatePath('/budget/transactions', 'page');
    revalidatePath('/budget/categories', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Budget transaction created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create budget transaction';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'BudgetTransaction',
      details: `Failed to create budget transaction: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update budget transaction
 * Includes audit logging and cache invalidation
 */
export async function updateBudgetTransactionAction(
  transactionId: string,
  data: UpdateBudgetTransactionData
): Promise<ActionResult<BudgetTransaction>> {
  try {
    if (!transactionId) {
      return {
        success: false,
        error: 'Transaction ID is required'
      };
    }

    // Validate amount if provided
    if (data.amount !== undefined && data.amount <= 0) {
      return {
        success: false,
        error: 'Transaction amount must be greater than 0'
      };
    }

    const response = await serverPut<ApiResponse<BudgetTransaction>>(
      API_ENDPOINTS.BUDGET.TRANSACTION_BY_ID(transactionId),
      data,
      {
        cache: 'no-store',
        next: { tags: [BUDGET_CACHE_TAGS.TRANSACTIONS, `budget-transaction-${transactionId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update budget transaction');
    }

    // AUDIT LOG - Transaction update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'BudgetTransaction',
      resourceId: transactionId,
      details: 'Updated budget transaction information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(BUDGET_CACHE_TAGS.TRANSACTIONS, 'default');
    revalidateTag(BUDGET_CACHE_TAGS.CATEGORIES, 'default');
    revalidateTag(BUDGET_CACHE_TAGS.SUMMARY, 'default');
    revalidateTag(`budget-transaction-${transactionId}`, 'default');
    revalidateTag('budget-transaction-list', 'default');
    if (data.categoryId) {
      revalidateTag(`budget-category-${data.categoryId}`, 'default');
    }
    revalidatePath('/budget/transactions', 'page');
    revalidatePath(`/budget/transactions/${transactionId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Budget transaction updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update budget transaction';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'BudgetTransaction',
      resourceId: transactionId,
      details: `Failed to update budget transaction: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create budget category from form data
 * Form-friendly wrapper for createBudgetCategoryAction
 */
export async function createBudgetCategoryFromForm(formData: FormData): Promise<ActionResult<BudgetCategory>> {
  const categoryData: CreateBudgetCategoryData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    budgetAmount: parseFloat(formData.get('budgetAmount') as string) || 0,
    parentCategoryId: formData.get('parentCategoryId') as string || undefined,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createBudgetCategoryAction(categoryData);
  
  if (result.success && result.data) {
    revalidatePath('/budget/categories', 'page');
  }
  
  return result;
}

/**
 * Create budget transaction from form data
 * Form-friendly wrapper for createBudgetTransactionAction
 */
export async function createBudgetTransactionFromForm(formData: FormData): Promise<ActionResult<BudgetTransaction>> {
  const transactionData: CreateBudgetTransactionData = {
    categoryId: formData.get('categoryId') as string,
    amount: parseFloat(formData.get('amount') as string) || 0,
    type: formData.get('type') as BudgetTransaction['type'],
    description: formData.get('description') as string,
    reference: formData.get('reference') as string,
    date: formData.get('date') as string,
    vendorId: formData.get('vendorId') as string || undefined,
    vendorName: formData.get('vendorName') as string || undefined,
  };

  const result = await createBudgetTransactionAction(transactionData);
  
  if (result.success && result.data) {
    revalidatePath('/budget/transactions', 'page');
  }
  
  return result;
}

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
