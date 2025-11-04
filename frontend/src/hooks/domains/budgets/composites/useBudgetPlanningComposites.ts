/**
 * Budget Planning Composite Hooks
 *
 * Provides composite hooks for budget planning and forecasting workflows.
 * Orchestrates budget creation, cloning, forecasting, and draft budget management.
 * Ideal for annual budget planning cycles and fiscal year rollover workflows.
 *
 * @module hooks/domains/budgets/composites/useBudgetPlanningComposites
 *
 * @remarks
 * **Architecture:**
 * - Combines budget CRUD operations
 * - Implements planning-specific workflows
 * - Provides forecasting capabilities
 *
 * **Planning Pattern:**
 * - Draft budget management
 * - Fiscal year rollover
 * - Budget cloning and forecasting
 *
 * @see {@link useBudgetQueries} for query hooks
 * @see {@link useBudgetMutations} for mutation hooks
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetKeys } from '../budgetQueryKeys';
import { useBudgets } from '../queries';
import {
  useCreateBudget,
  useUpdateBudget
} from '../mutations';
import type { Budget } from '../budgetTypes';

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
