/**
 * Budget Domain Composite Hooks
 *
 * Provides high-level composite hooks that orchestrate multiple queries and mutations
 * for complete budget workflows. Combines data fetching, mutations, and business logic
 * into unified interfaces for complex budget management operations.
 *
 * @module hooks/domains/budgets/composites/useBudgetComposites
 *
 * @remarks
 * **Architecture:**
 * - Combines multiple query and mutation hooks
 * - Aggregates loading states and errors
 * - Provides unified action interfaces
 * - Implements workflow-specific business logic
 *
 * **Composite Patterns:**
 * - Budget Workflow: Complete budget management lifecycle
 * - Budget Planning: Planning and forecasting workflows
 * - Transaction Management: Transaction approval and processing
 * - Budget Dashboard: Performance metrics aggregation
 * - Budget Comparison: Multi-budget analysis
 *
 * **Benefits:**
 * - Simplified component code
 * - Consistent workflow patterns
 * - Centralized business logic
 * - Reduced boilerplate
 *
 * @see {@link useBudgetQueries} for query hooks
 * @see {@link useBudgetMutations} for mutation hooks
 *
 * @since 1.0.0
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';
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
import type { Budget, BudgetCategory, BudgetTransaction } from '../budgetTypes';

/**
 * Complete budget management workflow hook.
 *
 * Orchestrates budget data fetching, category management, transaction creation,
 * analytics, and approval workflows. Provides unified interface for all budget
 * operations with coordinated loading states.
 *
 * @param {string} [budgetId] - Optional budget ID to manage
 *
 * @returns {Object} Workflow interface with data, actions, and states
 * @returns {Budget} returns.budget - Budget data
 * @returns {BudgetCategory[]} returns.categories - Budget categories
 * @returns {BudgetTransaction[]} returns.transactions - Budget transactions
 * @returns {Object} returns.analytics - Budget analytics data
 * @returns {Object} returns.status - Real-time budget status
 * @returns {boolean} returns.isLoading - True when loading core data
 * @returns {function} returns.createCategory - Create category action
 * @returns {function} returns.createTransaction - Create transaction action
 * @returns {function} returns.submitForApproval - Submit budget for approval
 * @returns {function} returns.approveBudget - Approve budget action
 *
 * @example
 * ```typescript
 * function BudgetManagementPage({ budgetId }: Props) {
 *   const {
 *     budget,
 *     categories,
 *     transactions,
 *     analytics,
 *     status,
 *     isLoading,
 *     createCategory,
 *     createTransaction,
 *     submitForApproval,
 *     approveBudget,
 *     isSubmitting,
 *     isApproving
 *   } = useBudgetWorkflow(budgetId);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       <BudgetHeader budget={budget} status={status} />
 *       <BudgetAnalytics data={analytics} />
 *       <CategoriesPanel
 *         categories={categories}
 *         onCreateCategory={createCategory}
 *       />
 *       <TransactionsPanel
 *         transactions={transactions}
 *         onCreateTransaction={createTransaction}
 *       />
 *       <WorkflowActions
 *         budget={budget}
 *         onSubmit={() => submitForApproval({ budgetId, submissionNote: 'Ready for review' })}
 *         onApprove={() => approveBudget({ budgetId })}
 *         isSubmitting={isSubmitting}
 *         isApproving={isApproving}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Data Aggregation:**
 * - Fetches budget, categories, transactions in parallel
 * - Loads analytics and status with separate loading states
 * - Coordinates refetching across all data sources
 *
 * **Workflow Actions:**
 * - submitForApproval: Custom mutation for workflow transition
 * - Other actions: Delegates to mutation hooks
 * - All actions invalidate relevant queries
 *
 * **Loading States:**
 * - isLoading: Core data (budget, categories, transactions)
 * - isLoadingAnalytics: Analytics data
 * - isLoadingStatus: Status data
 * - isCreatingCategory/Transaction: Action states
 *
 * **Real-time Updates:**
 * - Status polling every 30 seconds
 * - Automatic refetch on window focus
 * - Manual refetch functions provided
 *
 * @see {@link useBudgetPlanning} for planning workflow
 * @see {@link useTransactionManagement} for transaction workflow
 *
 * @since 1.0.0
 */
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

/**
 * Budget planning and forecasting workflow hook.
 *
 * Orchestrates budget creation, cloning, forecasting, and draft budget management.
 * Ideal for annual budget planning cycles and fiscal year rollover workflows.
 *
 * @param {string} [departmentId] - Optional department ID filter
 * @param {number} [fiscalYear] - Optional fiscal year filter
 *
 * @returns {Object} Planning workflow interface
 * @returns {Budget[]} returns.budgets - Draft budgets for planning
 * @returns {function} returns.createBudget - Create new budget
 * @returns {function} returns.updateBudget - Update budget
 * @returns {function} returns.cloneBudget - Clone existing budget for new fiscal year
 * @returns {function} returns.generateForecast - Generate spending forecast
 * @returns {Object} returns.forecastData - Generated forecast data
 *
 * @example
 * ```typescript
 * function BudgetPlanningPage({ departmentId }: Props) {
 *   const {
 *     budgets,
 *     createBudget,
 *     cloneBudget,
 *     generateForecast,
 *     forecastData,
 *     isGeneratingForecast
 *   } = useBudgetPlanning(departmentId, 2024);
 *
 *   const handleCloneLastYear = () => {
 *     const lastYearBudget = budgets.find(b => b.fiscalYear === '2023');
 *     if (lastYearBudget) {
 *       cloneBudget({
 *         sourceBudgetId: lastYearBudget.id,
 *         newName: '2024 Health Services Budget',
 *         fiscalYear: '2024'
 *       });
 *     }
 *   };
 *
 *   return <PlanningInterface budgets={budgets} onClone={handleCloneLastYear} />;
 * }
 * ```
 *
 * @remarks
 * **Workflow Actions:**
 * - cloneBudget: Copies budget structure for new fiscal year
 * - generateForecast: ML-based spending projections
 * - createBudget: Start from scratch
 *
 * **Forecasting:**
 * - Based on historical spending patterns
 * - Confidence intervals for projections
 * - Category-level recommendations
 *
 * @see {@link useBudgetWorkflow}
 * @since 1.0.0
 */
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

/**
 * Transaction management and approval workflow hook.
 *
 * Orchestrates transaction fetching, filtering, approval, rejection, and batch
 * processing. Ideal for transaction approval queues and transaction management pages.
 *
 * @param {string} [budgetId] - Optional budget ID to filter transactions
 *
 * @returns {Object} Transaction management interface
 * @returns {BudgetTransaction[]} returns.pendingTransactions - Pending approval transactions
 * @returns {BudgetTransaction[]} returns.allTransactions - All transactions
 * @returns {function} returns.approveTransaction - Approve single transaction
 * @returns {function} returns.bulkApprove - Approve multiple transactions
 * @returns {function} returns.batchProcess - Process approvals and rejections together
 * @returns {Object} returns.batchResults - Results of batch processing
 *
 * @example
 * ```typescript
 * function TransactionApprovalQueue({ budgetId }: Props) {
 *   const {
 *     pendingTransactions,
 *     approveTransaction,
 *     bulkApprove,
 *     batchProcess,
 *     isApproving,
 *     isBatchProcessing
 *   } = useTransactionManagement(budgetId);
 *
 *   const [selected, setSelected] = useState<string[]>([]);
 *
 *   const handleBulkApprove = () => {
 *     bulkApprove(selected, {
 *       onSuccess: () => {
 *         toast.success(`Approved ${selected.length} transactions`);
 *         setSelected([]);
 *       }
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <TransactionList
 *         transactions={pendingTransactions}
 *         selectedIds={selected}
 *         onSelectionChange={setSelected}
 *       />
 *       <button onClick={handleBulkApprove} disabled={selected.length === 0}>
 *         Approve Selected ({selected.length})
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Batch Processing:**
 * - batchProcess allows simultaneous approve/reject
 * - Atomic operation - all succeed or all fail
 * - Efficient cache invalidation
 *
 * **Filtering:**
 * - pendingTransactions: Pre-filtered PENDING status
 * - allTransactions: All statuses for reference
 *
 * @see {@link useBudgetWorkflow}
 * @since 1.0.0
 */
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

/**
 * Budget performance dashboard data aggregation hook.
 *
 * Aggregates budgets, performance metrics, and alerts for comprehensive dashboard views.
 * Provides real-time alerts with 30-second refresh interval.
 *
 * @param {Object} [filters] - Optional filters for dashboard scope
 * @param {string} [filters.departmentId] - Filter by department
 * @param {number} [filters.fiscalYear] - Filter by fiscal year
 *
 * @returns {Object} Dashboard data interface
 * @returns {Budget[]} returns.budgets - Filtered budgets
 * @returns {Object} returns.metrics - Aggregated performance metrics
 * @returns {Object} returns.alerts - Critical, warning, and info alerts
 * @returns {number} returns.utilizationRate - Average utilization percentage
 * @returns {number} returns.budgetsCount - Total budget count
 * @returns {number} returns.criticalAlertsCount - Number of critical alerts
 *
 * @example
 * ```typescript
 * function BudgetDashboard({ departmentId }: Props) {
 *   const {
 *     budgets,
 *     metrics,
 *     alerts,
 *     utilizationRate,
 *     criticalAlertsCount,
 *     isLoadingMetrics,
 *     isLoadingAlerts
 *   } = useBudgetDashboard({ departmentId, fiscalYear: 2024 });
 *
 *   return (
 *     <div>
 *       <MetricsSummary
 *         totalBudgeted={metrics?.totalAllocated}
 *         totalSpent={metrics?.totalSpent}
 *         utilizationRate={utilizationRate}
 *       />
 *       <AlertsPanel
 *         critical={alerts?.critical}
 *         warnings={alerts?.warnings}
 *       />
 *       <BudgetsList budgets={budgets} />
 *       <TopCategoriesChart data={metrics?.topCategories} />
 *       <TrendsChart data={metrics?.monthlyTrends} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Metrics Included:**
 * - Total budgets, allocated, spent, remaining
 * - Average utilization across all budgets
 * - Budgets over budget / at risk counts
 * - Top spending categories
 * - Monthly spending trends
 *
 * **Alerts:**
 * - Critical: >95% utilization or over budget
 * - Warnings: 80-95% utilization
 * - Info: Status changes, approvals
 * - Auto-refreshes every 30 seconds
 *
 * **Performance:**
 * - Metrics query dependent on budgets
 * - Alerts polled for real-time updates
 *
 * @since 1.0.0
 */
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

/**
 * Multi-budget comparison and analysis hook.
 *
 * Compares performance across multiple budgets with insights and recommendations.
 * Generates comparative reports for budget analysis and optimization.
 *
 * @param {string[]} budgetIds - Array of budget IDs to compare (2-10 budgets)
 *
 * @returns {Object} Comparison interface
 * @returns {Object} returns.comparison - Comparison data with budgets and insights
 * @returns {Object} returns.comparison.budgets - Per-budget comparison metrics
 * @returns {Object} returns.comparison.insights - AI-generated insights and recommendations
 * @returns {function} returns.generateReport - Generate downloadable comparison report
 * @returns {boolean} returns.isGeneratingReport - True when generating report
 *
 * @example
 * ```typescript
 * function BudgetComparisonPage({ budgetIds }: Props) {
 *   const {
 *     comparison,
 *     generateReport,
 *     isLoading,
 *     isGeneratingReport
 *   } = useBudgetComparison(budgetIds);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!comparison) return null;
 *
 *   const handleExport = () => {
 *     generateReport({
 *       reportType: 'EXECUTIVE_SUMMARY',
 *       includeRecommendations: true
 *     }, {
 *       onSuccess: (blob) => {
 *         const url = URL.createObjectURL(blob);
 *         const a = document.createElement('a');
 *         a.href = url;
 *         a.download = 'budget-comparison.pdf';
 *         a.click();
 *       }
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <ComparisonTable budgets={comparison.budgets} />
 *       <InsightsPanel insights={comparison.insights} />
 *       <button onClick={handleExport} disabled={isGeneratingReport}>
 *         Export Report
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Comparison Metrics:**
 * - Total allocated, spent, variance per budget
 * - Utilization percentages
 * - Performance ratings (EXCELLENT, GOOD, AVERAGE, POOR)
 * - Category-level breakdowns
 *
 * **Insights:**
 * - Best/worst performers identification
 * - Most efficient budget analysis
 * - Budgets needing attention
 * - Actionable recommendations
 *
 * **Report Generation:**
 * - Types: COMPARISON, ANALYSIS, EXECUTIVE_SUMMARY
 * - PDF format with charts and tables
 * - Optional recommendations section
 *
 * **Limitations:**
 * - Maximum 10 budgets recommended
 * - Requires budgetIds.length > 1
 *
 * @since 1.0.0
 */
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
