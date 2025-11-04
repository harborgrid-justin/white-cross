/**
 * @fileoverview Budget Form Handlers
 * @module lib/actions/budget.forms
 *
 * FormData handling functions for budget categories and transactions.
 * Provides form-friendly wrappers for server actions.
 */

'use server';

import { revalidatePath } from 'next/cache';

// Import actions
import { createBudgetCategoryAction } from './budget.categories';
import { createBudgetTransactionAction } from './budget.transactions';

// Types
import type {
  ActionResult,
  BudgetCategory,
  BudgetTransaction,
  CreateBudgetCategoryData,
  CreateBudgetTransactionData,
} from './budget.types';

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
