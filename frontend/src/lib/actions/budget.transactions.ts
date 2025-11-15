/**
 * @fileoverview Budget Transaction Operations
 * @module lib/actions/budget.transactions
 *
 * CRUD operations for budget transactions with audit logging and cache management.
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
  BudgetTransaction,
  CreateBudgetTransactionData,
  UpdateBudgetTransactionData,
} from './budget.types';

// Import cache tags
import { BUDGET_CACHE_TAGS } from './budget.types';

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
