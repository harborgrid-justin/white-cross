/**
 * @fileoverview Budget Category Operations
 * @module lib/actions/budget.categories
 *
 * CRUD operations for budget categories with audit logging and cache management.
 * Includes validation, error handling, and HIPAA-compliant audit trails.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, serverPut, NextApiClientError } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types';
import type {
  ActionResult,
  BudgetCategory,
  CreateBudgetCategoryData,
  UpdateBudgetCategoryData,
} from './budget.types';

// Import cache tags
import { BUDGET_CACHE_TAGS } from './budget.types';

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
