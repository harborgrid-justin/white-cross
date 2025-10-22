import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetKeys } from '../config';
import { 
  useBudget, 
  useBudgets, 
  useBudgetCategories, 
  useBudgetTransactions, 
  useBudgetAnalytics,
  useBudgetStatus 
} from '../queries/useBudgetQueries';
import { 
  useCreateBudget, 
  useUpdateBudget, 
  useCreateBudgetCategory, 
  useCreateBudgetTransaction,
  useApproveBudget,
  useApproveTransaction,
  useBulkApproveTransactions
} from '../mutations/useBudgetMutations';
import type { Budget, BudgetCategory, BudgetTransaction } from '../config';

// Budget Management Workflow
export const useBudgetWorkflow = (budgetId?: string) => {
  const queryClient = useQueryClient();
  
  const budget = useBudget(budgetId!);
  const categories = useBudgetCategories(budgetId);
  const transactions = useBudgetTransactions({ budgetId });
  const analytics = useBudgetAnalytics(budgetId!, 'monthly');
  const status = useBudgetStatus(budgetId!, { pollingInterval: 30000 });
  
  const createCategory = useCreateBudgetCategory();
  const createTransaction = useCreateBudgetTransaction();
  const approveBudget = useApproveBudget();
  
  const submitForApproval = useMutation({
    mutationFn: async ({ budgetId, submissionNote }: {
      budgetId: string;
      submissionNote?: string;
    }): Promise<Budget> => {
      const response = await fetch(`/api/budgets/${budgetId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionNote }),
      });
      if (!response.ok) throw new Error('Failed to submit budget');
      return response.json();
    },
    onSuccess: (updatedBudget) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(updatedBudget.id) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.status(updatedBudget.id) });
    },
  });

  return {
    // Data
    budget: budget.data,
    categories: categories.data,
    transactions: transactions.data,
    analytics: analytics.data,
    status: status.data,
    
    // Loading states
    isLoading: budget.isLoading || categories.isLoading || transactions.isLoading,
    isLoadingAnalytics: analytics.isLoading,
    isLoadingStatus: status.isLoading,
    
    // Error states
    error: budget.error || categories.error || transactions.error,
    
    // Actions
    createCategory: createCategory.mutate,
    createTransaction: createTransaction.mutate,
    submitForApproval: submitForApproval.mutate,
    approveBudget: approveBudget.mutate,
    
    // Action states
    isCreatingCategory: createCategory.isPending,
    isCreatingTransaction: createTransaction.isPending,
    isSubmitting: submitForApproval.isPending,
    isApproving: approveBudget.isPending,
    
    // Refetch functions
    refetchBudget: budget.refetch,
    refetchCategories: categories.refetch,
    refetchTransactions: transactions.refetch,
    refetchAnalytics: analytics.refetch,
  };
};

// Budget Planning & Forecasting
export const useBudgetPlanning = (departmentId?: string, fiscalYear?: number) => {
  const queryClient = useQueryClient();
  
  const budgets = useBudgets({ 
    departmentId, 
    fiscalYear, 
    status: 'draft' 
  });
  
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  
  const cloneBudget = useMutation({
    mutationFn: async ({ sourceBudgetId, newName, fiscalYear }: {
      sourceBudgetId: string;
      newName: string;
      fiscalYear: string;
    }): Promise<Budget> => {
      const response = await fetch('/api/budgets/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceBudgetId, newName, fiscalYear }),
      });
      if (!response.ok) throw new Error('Failed to clone budget');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });

  const generateForecast = useMutation({
    mutationFn: async ({ budgetId, forecastPeriods }: {
      budgetId: string;
      forecastPeriods: number;
    }): Promise<{
      projectedSpending: Array<{
        month: string;
        projected: number;
        confidence: number;
      }>;
      recommendations: Array<{
        category: string;
        suggestion: string;
        impact: number;
      }>;
    }> => {
      const response = await fetch(`/api/budgets/${budgetId}/forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forecastPeriods }),
      });
      if (!response.ok) throw new Error('Failed to generate forecast');
      return response.json();
    },
  });

  return {
    // Data
    budgets: budgets.data,
    
    // Loading states
    isLoading: budgets.isLoading,
    
    // Error states
    error: budgets.error,
    
    // Actions
    createBudget: createBudget.mutate,
    updateBudget: updateBudget.mutate,
    cloneBudget: cloneBudget.mutate,
    generateForecast: generateForecast.mutate,
    
    // Action states
    isCreating: createBudget.isPending,
    isUpdating: updateBudget.isPending,
    isCloning: cloneBudget.isPending,
    isGeneratingForecast: generateForecast.isPending,
    
    // Results
    forecastData: generateForecast.data,
    
    // Refetch
    refetch: budgets.refetch,
  };
};

// Transaction Management & Approval
export const useTransactionManagement = (budgetId?: string) => {
  const queryClient = useQueryClient();
  
  const transactions = useBudgetTransactions({ 
    budgetId
  });
  
  const approveTransaction = useApproveTransaction();
  const bulkApprove = useBulkApproveTransactions();
  
  const batchProcess = useMutation({
    mutationFn: async ({ 
      approveIds, 
      rejectIds,
      rejectReasons 
    }: {
      approveIds: string[];
      rejectIds: string[];
      rejectReasons: Record<string, string>;
    }): Promise<{
      approved: BudgetTransaction[];
      rejected: BudgetTransaction[];
    }> => {
      const response = await fetch('/api/budget-transactions/batch-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approveIds, rejectIds, rejectReasons }),
      });
      if (!response.ok) throw new Error('Failed to batch process transactions');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.transactions() });
      if (budgetId) {
        queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      }
    },
  });

  return {
    // Data
    pendingTransactions: transactions.data?.filter(t => t.status === 'PENDING'),
    allTransactions: transactions.data,
    
    // Loading states
    isLoading: transactions.isLoading,
    
    // Error states
    error: transactions.error,
    
    // Actions
    approveTransaction: approveTransaction.mutate,
    bulkApprove: bulkApprove.mutate,
    batchProcess: batchProcess.mutate,
    
    // Action states
    isApproving: approveTransaction.isPending,
    isBulkApproving: bulkApprove.isPending,
    isBatchProcessing: batchProcess.isPending,
    
    // Results
    batchResults: batchProcess.data,
    
    // Refetch
    refetch: transactions.refetch,
  };
};

// Budget Performance Dashboard
export const useBudgetDashboard = (filters?: {
  departmentId?: string;
  fiscalYear?: number;
}) => {
  const budgets = useBudgets(filters);
  
  const performanceMetrics = useQuery({
    queryKey: [...budgetKeys.all, 'dashboard-metrics', filters],
    queryFn: async (): Promise<{
      totalBudgets: number;
      totalAllocated: number;
      totalSpent: number;
      totalRemaining: number;
      averageUtilization: number;
      budgetsOverBudget: number;
      budgetsAtRisk: number;
      topCategories: Array<{
        name: string;
        allocated: number;
        spent: number;
        utilization: number;
      }>;
      monthlyTrends: Array<{
        month: string;
        budgeted: number;
        spent: number;
        variance: number;
      }>;
    }> => {
      const params = new URLSearchParams();
      if (filters?.departmentId) params.append('departmentId', filters.departmentId);
      if (filters?.fiscalYear) params.append('fiscalYear', filters.fiscalYear.toString());
      
      const response = await fetch(`/api/budgets/dashboard-metrics?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard metrics');
      return response.json();
    },
    enabled: !!budgets.data,
  });

  const alertsSummary = useQuery({
    queryKey: [...budgetKeys.all, 'alerts-summary', filters],
    queryFn: async (): Promise<{
      critical: Array<{
        budgetId: string;
        budgetName: string;
        alertType: 'OVER_BUDGET' | 'NEAR_LIMIT' | 'UNUSUAL_SPENDING';
        message: string;
        severity: 'HIGH' | 'MEDIUM' | 'LOW';
      }>;
      warnings: Array<{
        budgetId: string;
        budgetName: string;
        message: string;
      }>;
      info: Array<{
        budgetId: string;
        budgetName: string;
        message: string;
      }>;
    }> => {
      const params = new URLSearchParams();
      if (filters?.departmentId) params.append('departmentId', filters.departmentId);
      if (filters?.fiscalYear) params.append('fiscalYear', filters.fiscalYear.toString());
      
      const response = await fetch(`/api/budgets/alerts-summary?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch alerts summary');
      return response.json();
    },
    enabled: !!budgets.data,
    refetchInterval: 30000, // Refresh alerts every 30 seconds
  });

  return {
    // Data
    budgets: budgets.data,
    metrics: performanceMetrics.data,
    alerts: alertsSummary.data,
    
    // Loading states
    isLoadingBudgets: budgets.isLoading,
    isLoadingMetrics: performanceMetrics.isLoading,
    isLoadingAlerts: alertsSummary.isLoading,
    
    // Error states
    budgetsError: budgets.error,
    metricsError: performanceMetrics.error,
    alertsError: alertsSummary.error,
    
    // Refetch functions
    refetchBudgets: budgets.refetch,
    refetchMetrics: performanceMetrics.refetch,
    refetchAlerts: alertsSummary.refetch,
    
    // Computed values
    utilizationRate: performanceMetrics.data?.averageUtilization || 0,
    budgetsCount: performanceMetrics.data?.totalBudgets || 0,
    criticalAlertsCount: alertsSummary.data?.critical.length || 0,
  };
};

// Budget Comparison & Analysis
export const useBudgetComparison = (budgetIds: string[]) => {
  const queryClient = useQueryClient();
  
  const comparison = useQuery({
    queryKey: budgetKeys.comparison(budgetIds),
    queryFn: async (): Promise<{
      budgets: Array<{
        id: string;
        name: string;
        totalAllocated: number;
        totalSpent: number;
        utilization: number;
        variance: number;
        performance: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
        categories: Array<{
          name: string;
          allocated: number;
          spent: number;
          variance: number;
        }>;
      }>;
      insights: Array<{
        type: 'BEST_PERFORMER' | 'WORST_PERFORMER' | 'MOST_EFFICIENT' | 'NEEDS_ATTENTION';
        budgetId: string;
        budgetName: string;
        description: string;
        recommendations: string[];
      }>;
    }> => {
      const params = new URLSearchParams();
      budgetIds.forEach(id => params.append('budgetIds', id));
      
      const response = await fetch(`/api/budgets/comparison?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch budget comparison');
      return response.json();
    },
    enabled: budgetIds.length > 1,
  });

  const generateReport = useMutation({
    mutationFn: async ({ 
      reportType, 
      includeRecommendations 
    }: {
      reportType: 'COMPARISON' | 'ANALYSIS' | 'EXECUTIVE_SUMMARY';
      includeRecommendations: boolean;
    }) => {
      const response = await fetch('/api/budgets/comparison-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          budgetIds, 
          reportType, 
          includeRecommendations 
        }),
      });
      if (!response.ok) throw new Error('Failed to generate comparison report');
      return response.blob();
    },
  });

  return {
    // Data
    comparison: comparison.data,
    
    // Loading states
    isLoading: comparison.isLoading,
    
    // Error states
    error: comparison.error,
    
    // Actions
    generateReport: generateReport.mutate,
    
    // Action states
    isGeneratingReport: generateReport.isPending,
    
    // Refetch
    refetch: comparison.refetch,
  };
};
