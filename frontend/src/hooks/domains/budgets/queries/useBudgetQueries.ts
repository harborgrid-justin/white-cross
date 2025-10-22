import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { budgetKeys } from '../config';
import type { Budget, BudgetCategory, BudgetTransaction, BudgetReport } from '../config';

// Budget Queries
export const useBudget = (budgetId: string) => {
  return useQuery({
    queryKey: budgetKeys.detail(budgetId),
    queryFn: async (): Promise<Budget> => {
      const response = await fetch(`/api/budgets/${budgetId}`);
      if (!response.ok) throw new Error('Failed to fetch budget');
      return response.json();
    },
    enabled: !!budgetId,
  });
};

export const useBudgets = (filters?: {
  departmentId?: string;
  status?: 'draft' | 'approved' | 'active' | 'archived';
  fiscalYear?: number;
}) => {
  return useQuery({
    queryKey: budgetKeys.list(filters),
    queryFn: async (): Promise<Budget[]> => {
      const params = new URLSearchParams();
      if (filters?.departmentId) params.append('departmentId', filters.departmentId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.fiscalYear) params.append('fiscalYear', filters.fiscalYear.toString());

      const response = await fetch(`/api/budgets?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budgets');
      return response.json();
    },
  });
};

export const useBudgetsPaginated = (filters?: {
  departmentId?: string;
  status?: 'draft' | 'approved' | 'active' | 'archived';
  fiscalYear?: number;
  search?: string;
}) => {
  return useInfiniteQuery({
    queryKey: budgetKeys.paginated(filters),
    queryFn: async ({ pageParam = 0 }): Promise<{
      budgets: Budget[];
      nextPage?: number;
      hasMore: boolean;
      total: number;
    }> => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (filters?.departmentId) params.append('departmentId', filters.departmentId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.fiscalYear) params.append('fiscalYear', filters.fiscalYear.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/budgets/paginated?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budgets');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};

// Budget Category Queries
export const useBudgetCategory = (categoryId: string) => {
  return useQuery({
    queryKey: budgetKeys.category(categoryId),
    queryFn: async (): Promise<BudgetCategory> => {
      const response = await fetch(`/api/budget-categories/${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch budget category');
      return response.json();
    },
    enabled: !!categoryId,
  });
};

export const useBudgetCategories = (budgetId?: string) => {
  return useQuery({
    queryKey: budgetKeys.categories(budgetId),
    queryFn: async (): Promise<BudgetCategory[]> => {
      const params = budgetId ? `?budgetId=${budgetId}` : '';
      const response = await fetch(`/api/budget-categories${params}`);
      if (!response.ok) throw new Error('Failed to fetch budget categories');
      return response.json();
    },
  });
};

// Budget Transaction Queries
export const useBudgetTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: budgetKeys.transaction(transactionId),
    queryFn: async (): Promise<BudgetTransaction> => {
      const response = await fetch(`/api/budget-transactions/${transactionId}`);
      if (!response.ok) throw new Error('Failed to fetch budget transaction');
      return response.json();
    },
    enabled: !!transactionId,
  });
};

export const useBudgetTransactions = (filters?: {
  budgetId?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'transfer';
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: budgetKeys.transactions(filters),
    queryFn: async (): Promise<BudgetTransaction[]> => {
      const params = new URLSearchParams();
      if (filters?.budgetId) params.append('budgetId', filters.budgetId);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/budget-transactions?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget transactions');
      return response.json();
    },
  });
};

export const useBudgetTransactionsPaginated = (filters?: {
  budgetId?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'transfer';
  startDate?: string;
  endDate?: string;
  search?: string;
}) => {
  return useInfiniteQuery({
    queryKey: budgetKeys.transactionsPaginated(filters),
    queryFn: async ({ pageParam = 0 }): Promise<{
      transactions: BudgetTransaction[];
      nextPage?: number;
      hasMore: boolean;
      total: number;
    }> => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (filters?.budgetId) params.append('budgetId', filters.budgetId);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/budget-transactions/paginated?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget transactions');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};

// Budget Report Queries
export const useBudgetReport = (reportId: string) => {
  return useQuery({
    queryKey: budgetKeys.report(reportId),
    queryFn: async (): Promise<BudgetReport> => {
      const response = await fetch(`/api/budget-reports/${reportId}`);
      if (!response.ok) throw new Error('Failed to fetch budget report');
      return response.json();
    },
    enabled: !!reportId,
  });
};

export const useBudgetReports = (filters?: {
  budgetId?: string;
  type?: 'variance' | 'summary' | 'forecast' | 'performance';
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: budgetKeys.reports(filters),
    queryFn: async (): Promise<BudgetReport[]> => {
      const params = new URLSearchParams();
      if (filters?.budgetId) params.append('budgetId', filters.budgetId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/budget-reports?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget reports');
      return response.json();
    },
  });
};

// Budget Analytics Queries
export const useBudgetAnalytics = (budgetId: string, period?: 'monthly' | 'quarterly' | 'yearly') => {
  return useQuery({
    queryKey: budgetKeys.analytics(budgetId, period),
    queryFn: async (): Promise<{
      totalBudgeted: number;
      totalSpent: number;
      totalRemaining: number;
      variance: number;
      categoryBreakdown: Array<{
        categoryId: string;
        categoryName: string;
        budgeted: number;
        spent: number;
        remaining: number;
        variance: number;
      }>;
      monthlyTrends: Array<{
        month: string;
        budgeted: number;
        spent: number;
        variance: number;
      }>;
    }> => {
      const params = period ? `?period=${period}` : '';
      const response = await fetch(`/api/budgets/${budgetId}/analytics${params}`);
      if (!response.ok) throw new Error('Failed to fetch budget analytics');
      return response.json();
    },
    enabled: !!budgetId,
  });
};

export const useBudgetComparisonData = (budgetIds: string[], period?: 'monthly' | 'quarterly' | 'yearly') => {
  return useQuery({
    queryKey: budgetKeys.comparison(budgetIds, period),
    queryFn: async (): Promise<{
      budgets: Array<{
        budgetId: string;
        name: string;
        totalBudgeted: number;
        totalSpent: number;
        variance: number;
        performance: number;
      }>;
      trends: Array<{
        period: string;
        budgets: Array<{
          budgetId: string;
          spent: number;
          budgeted: number;
        }>;
      }>;
    }> => {
      const params = new URLSearchParams();
      budgetIds.forEach(id => params.append('budgetIds', id));
      if (period) params.append('period', period);

      const response = await fetch(`/api/budgets/comparison?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget comparison');
      return response.json();
    },
    enabled: budgetIds.length > 0,
  });
};

// Real-time Budget Status
export const useBudgetStatus = (budgetId: string, options?: { pollingInterval?: number }) => {
  return useQuery({
    queryKey: budgetKeys.status(budgetId),
    queryFn: async (): Promise<{
      budgetId: string;
      status: 'draft' | 'approved' | 'active' | 'archived';
      utilizationPercentage: number;
      alertLevel: 'low' | 'medium' | 'high' | 'critical';
      lastUpdated: string;
      notifications: Array<{
        type: 'warning' | 'alert' | 'info';
        message: string;
        timestamp: string;
      }>;
    }> => {
      const response = await fetch(`/api/budgets/${budgetId}/status`);
      if (!response.ok) throw new Error('Failed to fetch budget status');
      return response.json();
    },
    enabled: !!budgetId,
    refetchInterval: options?.pollingInterval || 60000, // Default 1 minute polling
  });
};
