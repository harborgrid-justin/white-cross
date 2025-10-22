import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { budgetKeys } from '../config';
import type { Budget, BudgetCategory, BudgetTransaction, BudgetReport } from '../config';

// Budget Mutations
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> => {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      });
      if (!response.ok) throw new Error('Failed to create budget');
      return response.json();
    },
    onSuccess: (newBudget) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Budget "${newBudget.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create budget: ${error.message}`);
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ budgetId, updates }: {
      budgetId: string;
      updates: Partial<Budget>;
    }): Promise<Budget> => {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update budget');
      return response.json();
    },
    onSuccess: (updatedBudget, { budgetId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Budget "${updatedBudget.name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update budget: ${error.message}`);
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetId: string): Promise<void> => {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete budget');
    },
    onSuccess: (_, budgetId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success('Budget deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete budget: ${error.message}`);
    },
  });
};

export const useApproveBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ budgetId, approvalNote }: {
      budgetId: string;
      approvalNote?: string;
    }): Promise<Budget> => {
      const response = await fetch(`/api/budgets/${budgetId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalNote }),
      });
      if (!response.ok) throw new Error('Failed to approve budget');
      return response.json();
    },
    onSuccess: (approvedBudget, { budgetId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Budget "${approvedBudget.name}" approved successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve budget: ${error.message}`);
    },
  });
};

// Budget Category Mutations
export const useCreateBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: Omit<BudgetCategory, 'id' | 'children' | 'transactions'>): Promise<BudgetCategory> => {
      const response = await fetch('/api/budget-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) throw new Error('Failed to create budget category');
      return response.json();
    },
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.categories() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`Category "${newCategory.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });
};

export const useUpdateBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId, updates }: {
      categoryId: string;
      updates: Partial<BudgetCategory>;
    }): Promise<BudgetCategory> => {
      const response = await fetch(`/api/budget-categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update budget category');
      return response.json();
    },
    onSuccess: (updatedCategory, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.category(categoryId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.categories() });
      toast.success(`Category "${updatedCategory.name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update category: ${error.message}`);
    },
  });
};

export const useDeleteBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string): Promise<void> => {
      const response = await fetch(`/api/budget-categories/${categoryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete budget category');
    },
    onSuccess: (_, categoryId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.category(categoryId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.categories() });
      toast.success('Category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });
};

// Budget Transaction Mutations
export const useCreateBudgetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: Omit<BudgetTransaction, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'approvedBy' | 'attachments'>): Promise<BudgetTransaction> => {
      const response = await fetch('/api/budget-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });
      if (!response.ok) throw new Error('Failed to create transaction');
      return response.json();
    },
    onSuccess: (newTransaction) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(newTransaction.budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.category(newTransaction.categoryId) });
      toast.success('Transaction created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create transaction: ${error.message}`);
    },
  });
};

export const useUpdateBudgetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, updates }: {
      transactionId: string;
      updates: Partial<BudgetTransaction>;
    }): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update transaction');
      return response.json();
    },
    onSuccess: (updatedTransaction, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(updatedTransaction.budgetId) });
      toast.success('Transaction updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update transaction: ${error.message}`);
    },
  });
};

export const useDeleteBudgetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string): Promise<{ budgetId: string; categoryId: string }> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
      return response.json();
    },
    onSuccess: ({ budgetId, categoryId }, transactionId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.category(categoryId) });
      toast.success('Transaction deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete transaction: ${error.message}`);
    },
  });
};

export const useApproveTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, approvalNote }: {
      transactionId: string;
      approvalNote?: string;
    }): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalNote }),
      });
      if (!response.ok) throw new Error('Failed to approve transaction');
      return response.json();
    },
    onSuccess: (approvedTransaction, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(approvedTransaction.budgetId) });
      toast.success('Transaction approved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve transaction: ${error.message}`);
    },
  });
};

export const useRejectTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, rejectionReason }: {
      transactionId: string;
      rejectionReason: string;
    }): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason }),
      });
      if (!response.ok) throw new Error('Failed to reject transaction');
      return response.json();
    },
    onSuccess: (rejectedTransaction, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(transactionId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(rejectedTransaction.budgetId) });
      toast.success('Transaction rejected');
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject transaction: ${error.message}`);
    },
  });
};

// Budget Report Mutations
export const useGenerateBudgetReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportConfig: {
      budgetId: string;
      type: 'SUMMARY' | 'DETAILED' | 'VARIANCE' | 'FORECAST';
      title: string;
      period: string;
      includeTransactions?: boolean;
      includeComparisons?: boolean;
    }): Promise<BudgetReport> => {
      const response = await fetch('/api/budget-reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportConfig),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      return response.json();
    },
    onSuccess: (newReport) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.reports() });
      toast.success(`Report "${newReport.title}" generated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });
};

export const useDeleteBudgetReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string): Promise<void> => {
      const response = await fetch(`/api/budget-reports/${reportId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete report');
    },
    onSuccess: (_, reportId) => {
      queryClient.removeQueries({ queryKey: budgetKeys.report(reportId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.reports() });
      toast.success('Report deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete report: ${error.message}`);
    },
  });
};

// Bulk Operations
export const useBulkDeleteBudgets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetIds: string[]): Promise<void> => {
      const response = await fetch('/api/budgets/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetIds }),
      });
      if (!response.ok) throw new Error('Failed to delete budgets');
    },
    onSuccess: (_, budgetIds) => {
      budgetIds.forEach(id => {
        queryClient.removeQueries({ queryKey: budgetKeys.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      toast.success(`${budgetIds.length} budgets deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete budgets: ${error.message}`);
    },
  });
};

export const useBulkApproveTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionIds: string[]): Promise<BudgetTransaction[]> => {
      const response = await fetch('/api/budget-transactions/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionIds }),
      });
      if (!response.ok) throw new Error('Failed to approve transactions');
      return response.json();
    },
    onSuccess: (approvedTransactions, transactionIds) => {
      transactionIds.forEach(id => {
        queryClient.invalidateQueries({ queryKey: budgetKeys.transaction(id) });
      });
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      
      // Invalidate related budgets and categories
      const uniqueBudgetIds = [...new Set(approvedTransactions.map(t => t.budgetId))];
      const uniqueCategoryIds = [...new Set(approvedTransactions.map(t => t.categoryId))];
      
      uniqueBudgetIds.forEach(budgetId => {
        queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      });
      
      uniqueCategoryIds.forEach(categoryId => {
        queryClient.invalidateQueries({ queryKey: budgetKeys.category(categoryId) });
      });
      
      toast.success(`${transactionIds.length} transactions approved successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve transactions: ${error.message}`);
    },
  });
};
