import { QueryClient } from '@tanstack/react-query';

// Query Keys for Budgets Domain
export const BUDGETS_QUERY_KEYS = {
  // Budgets
  budgets: ['budgets'] as const,
  budgetsList: (filters?: any) => [...BUDGETS_QUERY_KEYS.budgets, 'list', filters] as const,
  budgetDetails: (id: string) => [...BUDGETS_QUERY_KEYS.budgets, 'detail', id] as const,
  
  // Budget Categories
  categories: ['budgets', 'categories'] as const,
  categoriesList: (filters?: any) => [...BUDGETS_QUERY_KEYS.categories, 'list', filters] as const,
  categoryDetails: (id: string) => [...BUDGETS_QUERY_KEYS.categories, 'detail', id] as const,
  
  // Transactions
  transactions: ['budgets', 'transactions'] as const,
  transactionsList: (filters?: any) => [...BUDGETS_QUERY_KEYS.transactions, 'list', filters] as const,
  transactionDetails: (id: string) => [...BUDGETS_QUERY_KEYS.transactions, 'detail', id] as const,
  
  // Reports
  reports: ['budgets', 'reports'] as const,
  reportsList: (type?: string) => [...BUDGETS_QUERY_KEYS.reports, 'list', type] as const,
} as const;

// Query Keys Factory (matching pattern from other domains)
export const budgetKeys = {
  all: ['budgets'] as const,
  list: (filters?: any) => [...budgetKeys.all, 'list', filters] as const,
  paginated: (filters?: any) => [...budgetKeys.all, 'paginated', filters] as const,
  detail: (id: string) => [...budgetKeys.all, 'detail', id] as const,
  analytics: (budgetId: string, period?: string) => [...budgetKeys.all, 'analytics', budgetId, period] as const,
  comparison: (budgetIds: string[], period?: string) => [...budgetKeys.all, 'comparison', budgetIds, period] as const,
  status: (budgetId: string) => [...budgetKeys.all, 'status', budgetId] as const,
  
  // Categories
  categories: (budgetId?: string) => [...budgetKeys.all, 'categories', budgetId] as const,
  category: (categoryId: string) => [...budgetKeys.all, 'category', categoryId] as const,
  
  // Transactions
  transactions: (filters?: any) => [...budgetKeys.all, 'transactions', filters] as const,
  transactionsPaginated: (filters?: any) => [...budgetKeys.all, 'transactions', 'paginated', filters] as const,
  transaction: (transactionId: string) => [...budgetKeys.all, 'transaction', transactionId] as const,
  
  // Reports
  reports: (filters?: any) => [...budgetKeys.all, 'reports', filters] as const,
  report: (reportId: string) => [...budgetKeys.all, 'report', reportId] as const,
} as const;

// Cache Configuration
export const BUDGETS_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  BUDGETS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  TRANSACTIONS_STALE_TIME: 2 * 60 * 1000, // 2 minutes
  REPORTS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
} as const;

// TypeScript Interfaces
export interface Budget {
  id: string;
  name: string;
  description?: string;
  totalAmount: number;
  spentAmount: number;
  remainingAmount: number;
  currency: string;
  fiscalYear: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'ACTIVE' | 'FROZEN' | 'CLOSED';
  categories: BudgetCategory[];
  department?: string;
  owner: BudgetUser;
  approver?: BudgetUser;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  description?: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  parentId?: string;
  children?: BudgetCategory[];
  transactions: BudgetTransaction[];
}

export interface BudgetTransaction {
  id: string;
  budgetId: string;
  categoryId: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  description: string;
  reference?: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  attachments: TransactionAttachment[];
  createdBy: BudgetUser;
  approvedBy?: BudgetUser;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface BudgetUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface BudgetReport {
  id: string;
  type: 'SUMMARY' | 'DETAILED' | 'VARIANCE' | 'FORECAST';
  title: string;
  period: string;
  data: any;
  generatedAt: string;
  generatedBy: BudgetUser;
}

// Utility Functions
export const invalidateBudgetsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['budgets'] });
};

export const invalidateBudgetQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.budgets });
};

export const invalidateBudgetCategoryQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.categories });
};

export const invalidateTransactionQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.transactions });
};
