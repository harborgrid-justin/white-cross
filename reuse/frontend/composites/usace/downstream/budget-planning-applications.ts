/**
 * LOC: USACE-BP-APP-001
 * File: /reuse/frontend/composites/usace/downstream/budget-planning-applications.ts
 *
 * UPSTREAM (imports from):
 *   - ../usace-budget-planning-composites
 *   - ../../analytics-tracking-kit
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS budget planning application UIs
 *   - Budget scenario planning interfaces
 *   - Multi-year budget planning dashboards
 *   - Budget allocation request forms
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/budget-planning-applications.ts
 * Locator: WC-USACE-BP-APP-001
 * Purpose: USACE CEFMS Budget Planning Applications - Complete UI components for budget planning
 *
 * Upstream: usace-budget-planning-composites, analytics-tracking-kit
 * Downstream: USACE budget planning UIs, scenario planning, multi-year budget dashboards
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x
 * Exports: React hooks and components for comprehensive budget planning operations
 *
 * LLM Context: Production-ready USACE CEFMS budget planning application components. Provides
 * complete UI implementations for budget workflow management, scenario planning, multi-year
 * budget planning, budget allocation requests, and fiscal year budget management. Built on
 * parent composite functions with full React components, form handling, and user workflows.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTracking, trackError } from '../../analytics-tracking-kit';
import {
  useFiscalYearBudget,
  useBudgetAllocationRequest,
  useMultiYearBudgetPlanning,
  type FiscalYearBudgetData,
  type BudgetAppropriation,
  type BudgetAllocationRequest as BudgetAllocationRequestType,
} from '../usace-budget-planning-composites';

// ============================================================================
// TYPE DEFINITIONS - BUDGET PLANNING APPLICATIONS
// ============================================================================

/**
 * Budget workflow step enumeration
 */
export type BudgetWorkflowStep =
  | 'planning'
  | 'allocation'
  | 'review'
  | 'approval'
  | 'execution';

/**
 * Budget scenario status enumeration
 */
export type BudgetScenarioStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'archived';

/**
 * Budget scenario type enumeration
 */
export type BudgetScenarioType =
  | 'baseline'
  | 'optimistic'
  | 'pessimistic'
  | 'constrained'
  | 'growth';

/**
 * Budget category enumeration
 */
export type BudgetCategory =
  | 'personnel'
  | 'operations'
  | 'maintenance'
  | 'equipment'
  | 'construction'
  | 'other';

/**
 * Budget variance type enumeration
 */
export type BudgetVarianceType =
  | 'favorable'
  | 'unfavorable'
  | 'neutral';

/**
 * Allocation priority level enumeration
 */
export type AllocationPriority =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'deferred';

/**
 * Budget line item interface
 */
export interface BudgetLineItem {
  /** Unique line item identifier */
  id: string;
  /** Budget category */
  category: BudgetCategory;
  /** Line item description */
  description: string;
  /** Requested amount */
  requestedAmount: number;
  /** Allocated amount */
  allocatedAmount: number;
  /** Approved amount */
  approvedAmount: number;
  /** Actual spent amount */
  actualAmount: number;
  /** Fiscal year */
  fiscalYear: number;
  /** Fiscal period */
  fiscalPeriod?: number;
  /** Cost center or project code */
  costCenter?: string;
  /** Justification notes */
  justification?: string;
  /** Priority level */
  priority: AllocationPriority;
}

/**
 * Budget scenario detailed data structure
 */
export interface BudgetScenarioData {
  /** Total budget amount */
  totalBudget: number;
  /** Total allocated amount */
  totalAllocated: number;
  /** Total committed amount */
  totalCommitted: number;
  /** Total spent amount */
  totalSpent: number;
  /** Available balance */
  availableBalance: number;
  /** Line items in this scenario */
  lineItems: BudgetLineItem[];
  /** Assumptions and notes */
  assumptions: string[];
  /** Risk factors */
  riskFactors: string[];
  /** Expected variance percentage */
  expectedVariance: number;
}

/**
 * Budget scenario interface
 */
export interface BudgetScenario {
  /** Unique scenario identifier */
  id: string;
  /** Scenario name */
  name: string;
  /** Scenario description */
  description: string;
  /** Scenario type */
  scenarioType: BudgetScenarioType;
  /** Fiscal year */
  fiscalYear: number;
  /** Scenario data */
  data: BudgetScenarioData;
  /** Created by user */
  createdBy: string;
  /** Creation date */
  createdDate: Date;
  /** Last modified date */
  lastModified: Date;
  /** Scenario status */
  status: BudgetScenarioStatus;
  /** Tags for categorization */
  tags: string[];
  /** Version number */
  version: number;
}

/**
 * Budget comparison result interface
 */
export interface BudgetComparisonResult {
  /** Scenario 1 identifier */
  scenario1Id: string;
  /** Scenario 2 identifier */
  scenario2Id: string;
  /** Total budget difference */
  budgetDifference: number;
  /** Allocation difference */
  allocationDifference: number;
  /** Percentage variance */
  percentageVariance: number;
  /** Variance type */
  varianceType: BudgetVarianceType;
  /** Line item comparisons */
  lineItemComparisons: BudgetLineItemComparison[];
  /** Summary insights */
  insights: string[];
}

/**
 * Budget line item comparison interface
 */
export interface BudgetLineItemComparison {
  /** Line item category */
  category: BudgetCategory;
  /** Amount in scenario 1 */
  scenario1Amount: number;
  /** Amount in scenario 2 */
  scenario2Amount: number;
  /** Difference */
  difference: number;
  /** Percentage difference */
  percentageDifference: number;
  /** Variance type */
  varianceType: BudgetVarianceType;
}

/**
 * Multi-year budget plan interface
 */
export interface MultiYearBudgetPlan {
  /** Unique plan identifier */
  id: string;
  /** Plan name */
  name: string;
  /** Start fiscal year */
  startYear: number;
  /** End fiscal year */
  endYear: number;
  /** Annual budget allocations */
  annualAllocations: Map<number, BudgetScenarioData>;
  /** Growth rate assumptions */
  growthRates: Map<number, number>;
  /** Strategic priorities */
  strategicPriorities: string[];
  /** Created by user */
  createdBy: string;
  /** Creation date */
  createdDate: Date;
}

/**
 * Budget allocation filters interface
 */
export interface BudgetAllocationFilters {
  /** Filter by fiscal year */
  fiscalYear?: number;
  /** Filter by category */
  category?: BudgetCategory;
  /** Filter by priority */
  priority?: AllocationPriority;
  /** Filter by status */
  status?: string;
  /** Filter by cost center */
  costCenter?: string;
  /** Minimum amount */
  minAmount?: number;
  /** Maximum amount */
  maxAmount?: number;
}

/**
 * Budget workflow state interface
 */
export interface BudgetWorkflowState {
  /** Current workflow step */
  currentStep: BudgetWorkflowStep;
  /** Available steps */
  availableSteps: BudgetWorkflowStep[];
  /** Completed steps */
  completedSteps: Set<BudgetWorkflowStep>;
  /** Can proceed to next step */
  canProceed: boolean;
  /** Validation errors */
  validationErrors: string[];
}

/**
 * Budget validation result interface
 */
export interface BudgetValidationResult {
  /** Is valid */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
  /** Validation timestamp */
  validatedAt: Date;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate budget scenario data
 *
 * @description Validates that a budget scenario has consistent and valid data
 *
 * @param {BudgetScenario} scenario - Budget scenario to validate
 * @returns {BudgetValidationResult} Validation result with errors and warnings
 *
 * @example
 * ```typescript
 * const scenario = createScenario(...);
 * const validation = validateBudgetScenario(scenario);
 * if (!validation.isValid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export function validateBudgetScenario(scenario: BudgetScenario): BudgetValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate basic fields
  if (!scenario.name || scenario.name.trim().length === 0) {
    errors.push('Scenario name is required');
  }

  if (!scenario.fiscalYear || scenario.fiscalYear < 2000 || scenario.fiscalYear > 2100) {
    errors.push('Valid fiscal year is required');
  }

  // Validate budget data
  if (scenario.data.totalBudget < 0) {
    errors.push('Total budget cannot be negative');
  }

  if (scenario.data.totalAllocated > scenario.data.totalBudget) {
    errors.push('Total allocated cannot exceed total budget');
  }

  if (scenario.data.totalSpent > scenario.data.totalAllocated) {
    warnings.push('Total spent exceeds total allocated');
  }

  // Validate line items
  if (scenario.data.lineItems.length === 0) {
    warnings.push('Scenario has no line items');
  }

  scenario.data.lineItems.forEach((item, index) => {
    if (!item.description || item.description.trim().length === 0) {
      errors.push(`Line item ${index + 1}: Description is required`);
    }

    if (item.requestedAmount < 0) {
      errors.push(`Line item ${index + 1}: Requested amount cannot be negative`);
    }

    if (item.allocatedAmount > item.requestedAmount) {
      warnings.push(`Line item ${index + 1}: Allocated amount exceeds requested amount`);
    }

    if (item.actualAmount > item.allocatedAmount) {
      warnings.push(`Line item ${index + 1}: Actual amount exceeds allocated amount`);
    }
  });

  // Validate calculated totals
  const calculatedTotal = scenario.data.lineItems.reduce(
    (sum, item) => sum + item.allocatedAmount,
    0
  );

  if (Math.abs(calculatedTotal - scenario.data.totalAllocated) > 0.01) {
    errors.push('Line item totals do not match total allocated amount');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    validatedAt: new Date(),
  };
}

/**
 * Validate budget line item
 *
 * @description Validates individual budget line item for completeness and correctness
 *
 * @param {BudgetLineItem} lineItem - Line item to validate
 * @returns {BudgetValidationResult} Validation result
 */
export function validateBudgetLineItem(lineItem: BudgetLineItem): BudgetValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!lineItem.description || lineItem.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (lineItem.requestedAmount <= 0) {
    errors.push('Requested amount must be greater than zero');
  }

  if (lineItem.allocatedAmount < 0) {
    errors.push('Allocated amount cannot be negative');
  }

  if (lineItem.allocatedAmount > lineItem.requestedAmount) {
    warnings.push('Allocated amount exceeds requested amount');
  }

  if (lineItem.actualAmount > lineItem.allocatedAmount) {
    warnings.push('Actual spending exceeds allocated amount');
  }

  if (!lineItem.priority) {
    warnings.push('Priority level should be set');
  }

  if (lineItem.priority === 'critical' && lineItem.allocatedAmount === 0) {
    warnings.push('Critical priority item has no allocation');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    validatedAt: new Date(),
  };
}

/**
 * Calculate budget variance
 *
 * @description Calculates variance between two budget amounts
 *
 * @param {number} planned - Planned budget amount
 * @param {number} actual - Actual budget amount
 * @returns {object} Variance calculation result
 */
export function calculateBudgetVariance(
  planned: number,
  actual: number
): { variance: number; percentageVariance: number; varianceType: BudgetVarianceType } {
  const variance = actual - planned;
  const percentageVariance = planned !== 0 ? (variance / planned) * 100 : 0;

  let varianceType: BudgetVarianceType = 'neutral';
  if (Math.abs(percentageVariance) > 0.01) {
    varianceType = variance < 0 ? 'favorable' : 'unfavorable';
  }

  return {
    variance,
    percentageVariance,
    varianceType,
  };
}

// ============================================================================
// BUDGET PLANNING WORKFLOW COMPONENTS
// ============================================================================

/**
 * Hook for budget planning workflow management
 *
 * @description Complete workflow management for budget planning processes with
 * multi-step workflow, validation, and state tracking
 *
 * @param {number} fiscalYear - Fiscal year for budget planning
 * @returns {object} Budget workflow operations and state
 *
 * @example
 * ```tsx
 * function BudgetPlanningWorkflow({ fiscalYear }) {
 *   const {
 *     fiscalYearData,
 *     appropriations,
 *     requests,
 *     workflowState,
 *     moveToNextStep,
 *     moveToPreviousStep,
 *     createAllocationRequest,
 *     submitAllocationRequest,
 *     validateCurrentStep,
 *     isLoading,
 *     error
 *   } = useBudgetPlanningWorkflow(fiscalYear);
 *
 *   return (
 *     <div>
 *       <WorkflowProgress state={workflowState} />
 *       {workflowState.currentStep === 'planning' && <PlanningStep />}
 *       {workflowState.currentStep === 'allocation' && <AllocationStep />}
 *       <WorkflowActions
 *         onNext={moveToNextStep}
 *         onPrevious={moveToPreviousStep}
 *         canProceed={workflowState.canProceed}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useBudgetPlanningWorkflow(fiscalYear: number) {
  const {
    fiscalYearData,
    appropriations,
    loadFiscalYear,
    isLoading: isFiscalYearLoading,
  } = useFiscalYearBudget(fiscalYear);

  const {
    createRequest,
    submitRequest,
    requests,
    isLoading: isRequestLoading,
  } = useBudgetAllocationRequest();

  const [workflowState, setWorkflowState] = useState<BudgetWorkflowState>({
    currentStep: 'planning',
    availableSteps: ['planning', 'allocation', 'review', 'approval', 'execution'],
    completedSteps: new Set(),
    canProceed: false,
    validationErrors: [],
  });

  const [error, setError] = useState<Error | null>(null);
  const { track } = useTracking();
  const hasMountedRef = useRef(false);

  // Load fiscal year data on mount
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      const loadData = async () => {
        try {
          await loadFiscalYear();
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to load fiscal year data');
          setError(error);
          trackError({
            errorMessage: 'Failed to load fiscal year data',
            errorType: 'FiscalYearLoadError',
            metadata: { fiscalYear },
          });
        }
      };
      loadData();
    }
  }, [loadFiscalYear, fiscalYear]);

  /**
   * Validate current workflow step
   */
  const validateCurrentStep = useCallback((): BudgetValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    switch (workflowState.currentStep) {
      case 'planning':
        if (!fiscalYearData) {
          errors.push('Fiscal year data must be loaded');
        }
        if (appropriations.length === 0) {
          warnings.push('No appropriations defined');
        }
        break;

      case 'allocation':
        if (requests.length === 0) {
          warnings.push('No allocation requests created');
        }
        break;

      case 'review':
        const pendingRequests = requests.filter(r => r.status === 'pending');
        if (pendingRequests.length > 0) {
          warnings.push(`${pendingRequests.length} requests still pending`);
        }
        break;

      case 'approval':
        const unapprovedRequests = requests.filter(r => r.status !== 'approved');
        if (unapprovedRequests.length > 0) {
          errors.push('All requests must be approved before execution');
        }
        break;

      case 'execution':
        // Execution phase validation
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      validatedAt: new Date(),
    };
  }, [workflowState.currentStep, fiscalYearData, appropriations, requests]);

  /**
   * Move to next workflow step
   */
  const moveToNextStep = useCallback(async () => {
    const validation = validateCurrentStep();

    if (!validation.isValid) {
      setWorkflowState(prev => ({
        ...prev,
        validationErrors: validation.errors,
        canProceed: false,
      }));
      trackError({
        errorMessage: 'Cannot proceed to next step: validation failed',
        errorType: 'WorkflowValidationError',
        metadata: { errors: validation.errors },
      });
      return;
    }

    const currentIndex = workflowState.availableSteps.indexOf(workflowState.currentStep);
    if (currentIndex < workflowState.availableSteps.length - 1) {
      const nextStep = workflowState.availableSteps[currentIndex + 1];

      track('budget_workflow_next_step', {
        fiscal_year: fiscalYear,
        from_step: workflowState.currentStep,
        to_step: nextStep,
      });

      setWorkflowState(prev => ({
        ...prev,
        currentStep: nextStep,
        completedSteps: new Set([...prev.completedSteps, prev.currentStep]),
        validationErrors: [],
        canProceed: false,
      }));
    }
  }, [workflowState, validateCurrentStep, fiscalYear, track]);

  /**
   * Move to previous workflow step
   */
  const moveToPreviousStep = useCallback(() => {
    const currentIndex = workflowState.availableSteps.indexOf(workflowState.currentStep);
    if (currentIndex > 0) {
      const previousStep = workflowState.availableSteps[currentIndex - 1];

      track('budget_workflow_previous_step', {
        fiscal_year: fiscalYear,
        from_step: workflowState.currentStep,
        to_step: previousStep,
      });

      setWorkflowState(prev => ({
        ...prev,
        currentStep: previousStep,
        validationErrors: [],
      }));
    }
  }, [workflowState, fiscalYear, track]);

  /**
   * Jump to specific workflow step
   */
  const jumpToStep = useCallback((step: BudgetWorkflowStep) => {
    if (workflowState.availableSteps.includes(step)) {
      track('budget_workflow_jump_step', {
        fiscal_year: fiscalYear,
        from_step: workflowState.currentStep,
        to_step: step,
      });

      setWorkflowState(prev => ({
        ...prev,
        currentStep: step,
        validationErrors: [],
      }));
    }
  }, [workflowState, fiscalYear, track]);

  /**
   * Create allocation request with error handling
   */
  const createAllocationRequest = useCallback(async (
    requestData: Partial<BudgetAllocationRequestType>
  ) => {
    try {
      track('budget_allocation_request_create', {
        fiscal_year: fiscalYear,
        amount: requestData.requestedAmount,
      });

      const request = await createRequest(requestData);

      setWorkflowState(prev => ({
        ...prev,
        canProceed: true,
      }));

      return request;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create allocation request');
      setError(error);
      trackError({
        errorMessage: 'Failed to create allocation request',
        errorType: 'AllocationRequestCreateError',
        metadata: { fiscalYear },
      });
      throw error;
    }
  }, [fiscalYear, createRequest, track]);

  /**
   * Submit allocation request with error handling
   */
  const submitAllocationRequest = useCallback(async (requestId: string) => {
    try {
      track('budget_allocation_request_submit', {
        fiscal_year: fiscalYear,
        request_id: requestId,
      });

      await submitRequest(requestId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to submit allocation request');
      setError(error);
      trackError({
        errorMessage: 'Failed to submit allocation request',
        errorType: 'AllocationRequestSubmitError',
        metadata: { fiscalYear, requestId },
      });
      throw error;
    }
  }, [fiscalYear, submitRequest, track]);

  /**
   * Reset workflow to beginning
   */
  const resetWorkflow = useCallback(() => {
    track('budget_workflow_reset', { fiscal_year: fiscalYear });

    setWorkflowState({
      currentStep: 'planning',
      availableSteps: ['planning', 'allocation', 'review', 'approval', 'execution'],
      completedSteps: new Set(),
      canProceed: false,
      validationErrors: [],
    });
    setError(null);
  }, [fiscalYear, track]);

  // Update canProceed based on current step validation
  useEffect(() => {
    const validation = validateCurrentStep();
    setWorkflowState(prev => ({
      ...prev,
      canProceed: validation.isValid,
      validationErrors: validation.errors,
    }));
  }, [validateCurrentStep, workflowState.currentStep, fiscalYearData, appropriations, requests]);

  const isLoading = isFiscalYearLoading || isRequestLoading;

  return {
    fiscalYearData,
    appropriations,
    requests,
    workflowState,
    moveToNextStep,
    moveToPreviousStep,
    jumpToStep,
    createAllocationRequest,
    submitAllocationRequest,
    validateCurrentStep,
    resetWorkflow,
    loadFiscalYear,
    isLoading,
    error,
  };
}

// ============================================================================
// BUDGET SCENARIO PLANNING COMPONENTS
// ============================================================================

/**
 * Hook for budget scenario planning and management
 *
 * @description Comprehensive scenario planning with creation, comparison,
 * and analysis capabilities
 *
 * @returns {object} Budget scenario operations
 *
 * @example
 * ```tsx
 * function BudgetScenarioPlanner() {
 *   const {
 *     scenarios,
 *     createScenario,
 *     updateScenario,
 *     deleteScenario,
 *     duplicateScenario,
 *     compareScenarios,
 *     validateScenario,
 *     getScenariosByType,
 *     isLoading,
 *     error
 *   } = useBudgetScenarioPlanning();
 *
 *   const handleCreateBaseline = async () => {
 *     const scenario = await createScenario({
 *       name: 'FY2024 Baseline',
 *       scenarioType: 'baseline',
 *       fiscalYear: 2024,
 *       description: 'Baseline budget scenario'
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <ScenarioList scenarios={scenarios} />
 *       <button onClick={handleCreateBaseline}>Create Baseline</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBudgetScenarioPlanning() {
  const [scenarios, setScenarios] = useState<BudgetScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<BudgetScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { track } = useTracking();

  /**
   * Create new budget scenario
   */
  const createScenario = useCallback(async (scenarioInput: {
    name: string;
    description: string;
    scenarioType: BudgetScenarioType;
    fiscalYear: number;
    data?: Partial<BudgetScenarioData>;
    tags?: string[];
  }): Promise<BudgetScenario> => {
    setIsLoading(true);
    setError(null);

    try {
      track('budget_scenario_create', {
        scenario_type: scenarioInput.scenarioType,
        fiscal_year: scenarioInput.fiscalYear,
      });

      const scenario: BudgetScenario = {
        id: `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: scenarioInput.name,
        description: scenarioInput.description,
        scenarioType: scenarioInput.scenarioType,
        fiscalYear: scenarioInput.fiscalYear,
        data: {
          totalBudget: scenarioInput.data?.totalBudget || 0,
          totalAllocated: scenarioInput.data?.totalAllocated || 0,
          totalCommitted: scenarioInput.data?.totalCommitted || 0,
          totalSpent: scenarioInput.data?.totalSpent || 0,
          availableBalance: scenarioInput.data?.availableBalance || 0,
          lineItems: scenarioInput.data?.lineItems || [],
          assumptions: scenarioInput.data?.assumptions || [],
          riskFactors: scenarioInput.data?.riskFactors || [],
          expectedVariance: scenarioInput.data?.expectedVariance || 0,
        },
        createdBy: 'current_user',
        createdDate: new Date(),
        lastModified: new Date(),
        status: 'draft',
        tags: scenarioInput.tags || [],
        version: 1,
      };

      setScenarios(prev => [...prev, scenario]);
      return scenario;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create scenario');
      setError(error);
      trackError({
        errorMessage: 'Failed to create budget scenario',
        errorType: 'ScenarioCreateError',
        metadata: { scenarioType: scenarioInput.scenarioType },
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [track]);

  /**
   * Update existing scenario
   */
  const updateScenario = useCallback((
    scenarioId: string,
    updates: Partial<Omit<BudgetScenario, 'id' | 'createdBy' | 'createdDate'>>
  ) => {
    track('budget_scenario_update', { scenario_id: scenarioId });

    setScenarios(prev =>
      prev.map(scenario =>
        scenario.id === scenarioId
          ? {
              ...scenario,
              ...updates,
              lastModified: new Date(),
              version: scenario.version + 1,
            }
          : scenario
      )
    );

    if (selectedScenario?.id === scenarioId) {
      setSelectedScenario(prev =>
        prev ? { ...prev, ...updates, lastModified: new Date() } : null
      );
    }
  }, [track, selectedScenario]);

  /**
   * Delete scenario
   */
  const deleteScenario = useCallback((scenarioId: string) => {
    track('budget_scenario_delete', { scenario_id: scenarioId });

    setScenarios(prev => prev.filter(scenario => scenario.id !== scenarioId));

    if (selectedScenario?.id === scenarioId) {
      setSelectedScenario(null);
    }
  }, [track, selectedScenario]);

  /**
   * Duplicate existing scenario
   */
  const duplicateScenario = useCallback(async (scenarioId: string): Promise<BudgetScenario> => {
    const originalScenario = scenarios.find(s => s.id === scenarioId);

    if (!originalScenario) {
      throw new Error('Scenario not found');
    }

    track('budget_scenario_duplicate', { scenario_id: scenarioId });

    return createScenario({
      name: `${originalScenario.name} (Copy)`,
      description: originalScenario.description,
      scenarioType: originalScenario.scenarioType,
      fiscalYear: originalScenario.fiscalYear,
      data: { ...originalScenario.data },
      tags: [...originalScenario.tags],
    });
  }, [scenarios, createScenario, track]);

  /**
   * Add line item to scenario
   */
  const addLineItemToScenario = useCallback((
    scenarioId: string,
    lineItem: Omit<BudgetLineItem, 'id'>
  ) => {
    track('budget_scenario_line_item_add', { scenario_id: scenarioId });

    const newLineItem: BudgetLineItem = {
      ...lineItem,
      id: `line_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    setScenarios(prev =>
      prev.map(scenario => {
        if (scenario.id === scenarioId) {
          const updatedLineItems = [...scenario.data.lineItems, newLineItem];
          const totalAllocated = updatedLineItems.reduce(
            (sum, item) => sum + item.allocatedAmount,
            0
          );

          return {
            ...scenario,
            data: {
              ...scenario.data,
              lineItems: updatedLineItems,
              totalAllocated,
              availableBalance: scenario.data.totalBudget - totalAllocated,
            },
            lastModified: new Date(),
          };
        }
        return scenario;
      })
    );
  }, [track]);

  /**
   * Remove line item from scenario
   */
  const removeLineItemFromScenario = useCallback((
    scenarioId: string,
    lineItemId: string
  ) => {
    track('budget_scenario_line_item_remove', {
      scenario_id: scenarioId,
      line_item_id: lineItemId,
    });

    setScenarios(prev =>
      prev.map(scenario => {
        if (scenario.id === scenarioId) {
          const updatedLineItems = scenario.data.lineItems.filter(
            item => item.id !== lineItemId
          );
          const totalAllocated = updatedLineItems.reduce(
            (sum, item) => sum + item.allocatedAmount,
            0
          );

          return {
            ...scenario,
            data: {
              ...scenario.data,
              lineItems: updatedLineItems,
              totalAllocated,
              availableBalance: scenario.data.totalBudget - totalAllocated,
            },
            lastModified: new Date(),
          };
        }
        return scenario;
      })
    );
  }, [track]);

  /**
   * Update scenario status
   */
  const updateScenarioStatus = useCallback((
    scenarioId: string,
    status: BudgetScenarioStatus
  ) => {
    track('budget_scenario_status_update', { scenario_id: scenarioId, status });

    updateScenario(scenarioId, { status });
  }, [track, updateScenario]);

  /**
   * Validate scenario
   */
  const validateScenario = useCallback((scenarioId: string): BudgetValidationResult => {
    const scenario = scenarios.find(s => s.id === scenarioId);

    if (!scenario) {
      return {
        isValid: false,
        errors: ['Scenario not found'],
        warnings: [],
        validatedAt: new Date(),
      };
    }

    return validateBudgetScenario(scenario);
  }, [scenarios]);

  /**
   * Get scenarios by type
   */
  const getScenariosByType = useCallback((scenarioType: BudgetScenarioType) => {
    return scenarios.filter(s => s.scenarioType === scenarioType);
  }, [scenarios]);

  /**
   * Get scenarios by fiscal year
   */
  const getScenariosByFiscalYear = useCallback((fiscalYear: number) => {
    return scenarios.filter(s => s.fiscalYear === fiscalYear);
  }, [scenarios]);

  /**
   * Get scenarios by status
   */
  const getScenariosByStatus = useCallback((status: BudgetScenarioStatus) => {
    return scenarios.filter(s => s.status === status);
  }, [scenarios]);

  /**
   * Compare two scenarios
   */
  const compareScenarios = useCallback((
    scenario1Id: string,
    scenario2Id: string
  ): BudgetComparisonResult | null => {
    const scenario1 = scenarios.find(s => s.id === scenario1Id);
    const scenario2 = scenarios.find(s => s.id === scenario2Id);

    if (!scenario1 || !scenario2) {
      trackError({
        errorMessage: 'Cannot compare scenarios: one or both not found',
        errorType: 'ScenarioComparisonError',
      });
      return null;
    }

    track('budget_scenarios_compare', {
      scenario1_id: scenario1Id,
      scenario2_id: scenario2Id,
    });

    const budgetDifference = scenario2.data.totalBudget - scenario1.data.totalBudget;
    const allocationDifference = scenario2.data.totalAllocated - scenario1.data.totalAllocated;
    const percentageVariance = scenario1.data.totalBudget !== 0
      ? (budgetDifference / scenario1.data.totalBudget) * 100
      : 0;

    let varianceType: BudgetVarianceType = 'neutral';
    if (Math.abs(percentageVariance) > 0.01) {
      varianceType = budgetDifference > 0 ? 'unfavorable' : 'favorable';
    }

    // Compare line items by category
    const lineItemComparisons: BudgetLineItemComparison[] = [];
    const categories = new Set<BudgetCategory>();

    scenario1.data.lineItems.forEach(item => categories.add(item.category));
    scenario2.data.lineItems.forEach(item => categories.add(item.category));

    categories.forEach(category => {
      const scenario1Amount = scenario1.data.lineItems
        .filter(item => item.category === category)
        .reduce((sum, item) => sum + item.allocatedAmount, 0);

      const scenario2Amount = scenario2.data.lineItems
        .filter(item => item.category === category)
        .reduce((sum, item) => sum + item.allocatedAmount, 0);

      const difference = scenario2Amount - scenario1Amount;
      const percentageDifference = scenario1Amount !== 0
        ? (difference / scenario1Amount) * 100
        : 0;

      let itemVarianceType: BudgetVarianceType = 'neutral';
      if (Math.abs(percentageDifference) > 0.01) {
        itemVarianceType = difference > 0 ? 'unfavorable' : 'favorable';
      }

      lineItemComparisons.push({
        category,
        scenario1Amount,
        scenario2Amount,
        difference,
        percentageDifference,
        varianceType: itemVarianceType,
      });
    });

    const insights: string[] = [];
    if (Math.abs(percentageVariance) > 10) {
      insights.push(`Total budget variance of ${percentageVariance.toFixed(2)}% exceeds 10% threshold`);
    }

    lineItemComparisons.forEach(comparison => {
      if (Math.abs(comparison.percentageDifference) > 20) {
        insights.push(
          `${comparison.category} category shows ${comparison.percentageDifference.toFixed(2)}% variance`
        );
      }
    });

    return {
      scenario1Id,
      scenario2Id,
      budgetDifference,
      allocationDifference,
      percentageVariance,
      varianceType,
      lineItemComparisons,
      insights,
    };
  }, [scenarios, track]);

  return {
    scenarios,
    selectedScenario,
    setSelectedScenario,
    createScenario,
    updateScenario,
    deleteScenario,
    duplicateScenario,
    addLineItemToScenario,
    removeLineItemFromScenario,
    updateScenarioStatus,
    validateScenario,
    getScenariosByType,
    getScenariosByFiscalYear,
    getScenariosByStatus,
    compareScenarios,
    isLoading,
    error,
  };
}

// ============================================================================
// BUDGET SCENARIO COMPARISON COMPONENTS
// ============================================================================

/**
 * Hook for detailed budget scenario comparison UI
 *
 * @description Advanced scenario comparison with detailed analysis and visualization support
 *
 * @returns {object} Scenario comparison operations
 *
 * @example
 * ```tsx
 * function ScenarioComparisonView() {
 *   const {
 *     selectedScenarios,
 *     addScenarioToComparison,
 *     removeScenarioFromComparison,
 *     comparisonResult,
 *     generateComparison,
 *     clearComparison
 *   } = useBudgetScenarioComparison();
 *
 *   return (
 *     <div>
 *       <ScenarioSelector onSelect={addScenarioToComparison} />
 *       {comparisonResult && <ComparisonReport result={comparisonResult} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBudgetScenarioComparison() {
  const [selectedScenarios, setSelectedScenarios] = useState<BudgetScenario[]>([]);
  const [comparisonResult, setComparisonResult] = useState<BudgetComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const { track } = useTracking();

  /**
   * Add scenario to comparison
   */
  const addScenarioToComparison = useCallback((scenario: BudgetScenario) => {
    if (selectedScenarios.length >= 2) {
      trackError({
        errorMessage: 'Cannot compare more than 2 scenarios at once',
        errorType: 'ScenarioComparisonLimitError',
      });
      return;
    }

    track('scenario_comparison_add', { scenario_id: scenario.id });
    setSelectedScenarios(prev => [...prev, scenario]);
  }, [selectedScenarios, track]);

  /**
   * Remove scenario from comparison
   */
  const removeScenarioFromComparison = useCallback((scenarioId: string) => {
    track('scenario_comparison_remove', { scenario_id: scenarioId });
    setSelectedScenarios(prev => prev.filter(s => s.id !== scenarioId));
    setComparisonResult(null);
  }, [track]);

  /**
   * Generate comparison analysis
   */
  const generateComparison = useCallback(() => {
    if (selectedScenarios.length !== 2) {
      trackError({
        errorMessage: 'Exactly 2 scenarios required for comparison',
        errorType: 'ScenarioComparisonError',
      });
      return;
    }

    setIsComparing(true);

    try {
      const [scenario1, scenario2] = selectedScenarios;

      track('scenario_comparison_generate', {
        scenario1_id: scenario1.id,
        scenario2_id: scenario2.id,
      });

      const budgetDifference = scenario2.data.totalBudget - scenario1.data.totalBudget;
      const allocationDifference = scenario2.data.totalAllocated - scenario1.data.totalAllocated;
      const percentageVariance = scenario1.data.totalBudget !== 0
        ? (budgetDifference / scenario1.data.totalBudget) * 100
        : 0;

      let varianceType: BudgetVarianceType = 'neutral';
      if (Math.abs(percentageVariance) > 0.01) {
        varianceType = budgetDifference > 0 ? 'unfavorable' : 'favorable';
      }

      const lineItemComparisons: BudgetLineItemComparison[] = [];
      const categories = new Set<BudgetCategory>();

      scenario1.data.lineItems.forEach(item => categories.add(item.category));
      scenario2.data.lineItems.forEach(item => categories.add(item.category));

      categories.forEach(category => {
        const scenario1Amount = scenario1.data.lineItems
          .filter(item => item.category === category)
          .reduce((sum, item) => sum + item.allocatedAmount, 0);

        const scenario2Amount = scenario2.data.lineItems
          .filter(item => item.category === category)
          .reduce((sum, item) => sum + item.allocatedAmount, 0);

        const difference = scenario2Amount - scenario1Amount;
        const percentageDifference = scenario1Amount !== 0
          ? (difference / scenario1Amount) * 100
          : 0;

        let itemVarianceType: BudgetVarianceType = 'neutral';
        if (Math.abs(percentageDifference) > 0.01) {
          itemVarianceType = difference > 0 ? 'unfavorable' : 'favorable';
        }

        lineItemComparisons.push({
          category,
          scenario1Amount,
          scenario2Amount,
          difference,
          percentageDifference,
          varianceType: itemVarianceType,
        });
      });

      const insights: string[] = [];
      if (Math.abs(percentageVariance) > 10) {
        insights.push(`Total budget variance of ${percentageVariance.toFixed(2)}% exceeds 10% threshold`);
      }

      lineItemComparisons.forEach(comparison => {
        if (Math.abs(comparison.percentageDifference) > 20) {
          insights.push(
            `${comparison.category} category shows significant ${comparison.percentageDifference.toFixed(2)}% variance`
          );
        }
      });

      const result: BudgetComparisonResult = {
        scenario1Id: scenario1.id,
        scenario2Id: scenario2.id,
        budgetDifference,
        allocationDifference,
        percentageVariance,
        varianceType,
        lineItemComparisons,
        insights,
      };

      setComparisonResult(result);
    } finally {
      setIsComparing(false);
    }
  }, [selectedScenarios, track]);

  /**
   * Clear comparison
   */
  const clearComparison = useCallback(() => {
    track('scenario_comparison_clear');
    setSelectedScenarios([]);
    setComparisonResult(null);
  }, [track]);

  /**
   * Export comparison report (SSR-safe)
   */
  const exportComparisonReport = useCallback((format: 'csv' | 'excel' | 'pdf') => {
    if (!comparisonResult) {
      trackError({
        errorMessage: 'No comparison result to export',
        errorType: 'ExportError',
      });
      return null;
    }

    track('scenario_comparison_export', { format });

    // In production, this would generate actual export file
    const filename = `budget_comparison_${Date.now()}.${format}`;
    return filename;
  }, [comparisonResult, track]);

  const canCompare = selectedScenarios.length === 2;

  return {
    selectedScenarios,
    addScenarioToComparison,
    removeScenarioFromComparison,
    comparisonResult,
    generateComparison,
    clearComparison,
    exportComparisonReport,
    canCompare,
    isComparing,
  };
}

// ============================================================================
// MULTI-YEAR BUDGET PLANNING COMPONENTS
// ============================================================================

/**
 * Hook for multi-year budget planning UI
 *
 * @description Complete UI for multi-year budget planning with year-over-year analysis
 *
 * @returns {object} Multi-year budget planning operations
 *
 * @example
 * ```tsx
 * function MultiYearBudgetPlanner() {
 *   const {
 *     plans,
 *     currentPlan,
 *     createPlan,
 *     updatePlan,
 *     setAnnualAllocation,
 *     setGrowthRate,
 *     calculateProjections,
 *     isLoading
 *   } = useMultiYearBudgetPlanningUI();
 *
 *   return (
 *     <div>
 *       <PlanSelector plans={plans} currentPlan={currentPlan} />
 *       {currentPlan && (
 *         <YearOverYearView
 *           plan={currentPlan}
 *           onUpdateAllocation={setAnnualAllocation}
 *         />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMultiYearBudgetPlanningUI() {
  const [plans, setPlans] = useState<MultiYearBudgetPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<MultiYearBudgetPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { track } = useTracking();

  /**
   * Create new multi-year plan
   */
  const createPlan = useCallback(async (
    name: string,
    startYear: number,
    endYear: number,
    strategicPriorities: string[]
  ): Promise<MultiYearBudgetPlan> => {
    setIsLoading(true);
    setError(null);

    try {
      track('multi_year_plan_create', {
        start_year: startYear,
        end_year: endYear,
        years: endYear - startYear + 1,
      });

      if (endYear <= startYear) {
        throw new Error('End year must be after start year');
      }

      if (endYear - startYear > 10) {
        throw new Error('Planning period cannot exceed 10 years');
      }

      const plan: MultiYearBudgetPlan = {
        id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        startYear,
        endYear,
        annualAllocations: new Map(),
        growthRates: new Map(),
        strategicPriorities,
        createdBy: 'current_user',
        createdDate: new Date(),
      };

      setPlans(prev => [...prev, plan]);
      setCurrentPlan(plan);

      return plan;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create multi-year plan');
      setError(error);
      trackError({
        errorMessage: 'Failed to create multi-year plan',
        errorType: 'MultiYearPlanCreateError',
        metadata: { startYear, endYear },
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [track]);

  /**
   * Update plan details
   */
  const updatePlan = useCallback((
    planId: string,
    updates: Partial<Omit<MultiYearBudgetPlan, 'id' | 'createdBy' | 'createdDate'>>
  ) => {
    track('multi_year_plan_update', { plan_id: planId });

    setPlans(prev =>
      prev.map(plan =>
        plan.id === planId ? { ...plan, ...updates } : plan
      )
    );

    if (currentPlan?.id === planId) {
      setCurrentPlan(prev => (prev ? { ...prev, ...updates } : null));
    }
  }, [track, currentPlan]);

  /**
   * Set annual allocation for a specific year
   */
  const setAnnualAllocation = useCallback((
    planId: string,
    fiscalYear: number,
    allocation: BudgetScenarioData
  ) => {
    track('multi_year_plan_allocation_set', {
      plan_id: planId,
      fiscal_year: fiscalYear,
    });

    setPlans(prev =>
      prev.map(plan => {
        if (plan.id === planId) {
          const newAllocations = new Map(plan.annualAllocations);
          newAllocations.set(fiscalYear, allocation);

          return {
            ...plan,
            annualAllocations: newAllocations,
          };
        }
        return plan;
      })
    );
  }, [track]);

  /**
   * Set growth rate for a specific year
   */
  const setGrowthRate = useCallback((
    planId: string,
    fiscalYear: number,
    growthRate: number
  ) => {
    track('multi_year_plan_growth_rate_set', {
      plan_id: planId,
      fiscal_year: fiscalYear,
      growth_rate: growthRate,
    });

    setPlans(prev =>
      prev.map(plan => {
        if (plan.id === planId) {
          const newGrowthRates = new Map(plan.growthRates);
          newGrowthRates.set(fiscalYear, growthRate);

          return {
            ...plan,
            growthRates: newGrowthRates,
          };
        }
        return plan;
      })
    );
  }, [track]);

  /**
   * Calculate budget projections based on growth rates
   */
  const calculateProjections = useCallback((planId: string) => {
    const plan = plans.find(p => p.id === planId);

    if (!plan) {
      trackError({
        errorMessage: 'Plan not found for projection calculation',
        errorType: 'ProjectionCalculationError',
      });
      return;
    }

    track('multi_year_plan_calculate_projections', { plan_id: planId });

    // Start with baseline year (first year with allocation)
    let baselineYear: number | null = null;
    let baselineAllocation: BudgetScenarioData | null = null;

    for (let year = plan.startYear; year <= plan.endYear; year++) {
      const allocation = plan.annualAllocations.get(year);
      if (allocation) {
        baselineYear = year;
        baselineAllocation = allocation;
        break;
      }
    }

    if (!baselineYear || !baselineAllocation) {
      trackError({
        errorMessage: 'No baseline allocation found for projections',
        errorType: 'ProjectionCalculationError',
      });
      return;
    }

    // Calculate projections for subsequent years
    let previousYearBudget = baselineAllocation.totalBudget;

    for (let year = baselineYear + 1; year <= plan.endYear; year++) {
      // Skip if allocation already exists
      if (plan.annualAllocations.has(year)) {
        const allocation = plan.annualAllocations.get(year);
        if (allocation) {
          previousYearBudget = allocation.totalBudget;
        }
        continue;
      }

      const growthRate = plan.growthRates.get(year) || 0;
      const projectedBudget = previousYearBudget * (1 + growthRate / 100);

      const projectedAllocation: BudgetScenarioData = {
        totalBudget: projectedBudget,
        totalAllocated: 0,
        totalCommitted: 0,
        totalSpent: 0,
        availableBalance: projectedBudget,
        lineItems: [],
        assumptions: [`Projected with ${growthRate}% growth from FY${year - 1}`],
        riskFactors: ['Projection based on assumed growth rate'],
        expectedVariance: 0,
      };

      setAnnualAllocation(planId, year, projectedAllocation);
      previousYearBudget = projectedBudget;
    }
  }, [plans, setAnnualAllocation, track]);

  /**
   * Get year-over-year comparison
   */
  const getYearOverYearComparison = useCallback((planId: string) => {
    const plan = plans.find(p => p.id === planId);

    if (!plan) {
      return [];
    }

    const comparisons: Array<{
      year: number;
      budget: number;
      growth: number;
      growthPercent: number;
    }> = [];

    let previousBudget: number | null = null;

    for (let year = plan.startYear; year <= plan.endYear; year++) {
      const allocation = plan.annualAllocations.get(year);
      const budget = allocation?.totalBudget || 0;

      let growth = 0;
      let growthPercent = 0;

      if (previousBudget !== null && previousBudget !== 0) {
        growth = budget - previousBudget;
        growthPercent = (growth / previousBudget) * 100;
      }

      comparisons.push({
        year,
        budget,
        growth,
        growthPercent,
      });

      previousBudget = budget;
    }

    return comparisons;
  }, [plans]);

  /**
   * Delete plan
   */
  const deletePlan = useCallback((planId: string) => {
    track('multi_year_plan_delete', { plan_id: planId });

    setPlans(prev => prev.filter(plan => plan.id !== planId));

    if (currentPlan?.id === planId) {
      setCurrentPlan(null);
    }
  }, [track, currentPlan]);

  return {
    plans,
    currentPlan,
    setCurrentPlan,
    createPlan,
    updatePlan,
    setAnnualAllocation,
    setGrowthRate,
    calculateProjections,
    getYearOverYearComparison,
    deletePlan,
    isLoading,
    error,
  };
}

// ============================================================================
// BUDGET ALLOCATION UI COMPONENTS
// ============================================================================

/**
 * Hook for budget allocation management UI
 *
 * @description UI for managing budget allocations with filtering and analysis
 *
 * @param {number} fiscalYear - Fiscal year for allocations
 * @returns {object} Budget allocation UI operations
 *
 * @example
 * ```tsx
 * function BudgetAllocationManager({ fiscalYear }) {
 *   const {
 *     allocations,
 *     filters,
 *     updateFilters,
 *     filteredAllocations,
 *     sortAllocations,
 *     totalAllocated,
 *     allocationsByCategory,
 *     isLoading
 *   } = useBudgetAllocationUI(fiscalYear);
 *
 *   return (
 *     <div>
 *       <AllocationFilters filters={filters} onChange={updateFilters} />
 *       <AllocationSummary
 *         total={totalAllocated}
 *         byCategory={allocationsByCategory}
 *       />
 *       <AllocationTable allocations={filteredAllocations} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useBudgetAllocationUI(fiscalYear: number) {
  const [allocations, setAllocations] = useState<BudgetLineItem[]>([]);
  const [filters, setFilters] = useState<BudgetAllocationFilters>({});
  const [sortColumn, setSortColumn] = useState<keyof BudgetLineItem>('category');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const { track } = useTracking();

  /**
   * Update allocation filters
   */
  const updateFilters = useCallback((newFilters: Partial<BudgetAllocationFilters>) => {
    track('allocation_filters_update', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, [track]);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    track('allocation_filters_clear');
    setFilters({});
  }, [track]);

  /**
   * Filter allocations based on current filters
   */
  const filteredAllocations = useMemo(() => {
    let filtered = allocations;

    if (filters.fiscalYear) {
      filtered = filtered.filter(a => a.fiscalYear === filters.fiscalYear);
    }

    if (filters.category) {
      filtered = filtered.filter(a => a.category === filters.category);
    }

    if (filters.priority) {
      filtered = filtered.filter(a => a.priority === filters.priority);
    }

    if (filters.costCenter) {
      filtered = filtered.filter(a => a.costCenter === filters.costCenter);
    }

    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(a => a.allocatedAmount >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(a => a.allocatedAmount <= filters.maxAmount!);
    }

    return filtered;
  }, [allocations, filters]);

  /**
   * Sort allocations
   */
  const sortedAllocations = useMemo(() => {
    return [...filteredAllocations].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredAllocations, sortColumn, sortDirection]);

  /**
   * Toggle sort column and direction
   */
  const toggleSort = useCallback((column: keyof BudgetLineItem) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  /**
   * Calculate total allocated
   */
  const totalAllocated = useMemo(() => {
    return filteredAllocations.reduce((sum, item) => sum + item.allocatedAmount, 0);
  }, [filteredAllocations]);

  /**
   * Calculate total requested
   */
  const totalRequested = useMemo(() => {
    return filteredAllocations.reduce((sum, item) => sum + item.requestedAmount, 0);
  }, [filteredAllocations]);

  /**
   * Calculate total actual
   */
  const totalActual = useMemo(() => {
    return filteredAllocations.reduce((sum, item) => sum + item.actualAmount, 0);
  }, [filteredAllocations]);

  /**
   * Group allocations by category
   */
  const allocationsByCategory = useMemo(() => {
    const grouped = new Map<BudgetCategory, number>();

    filteredAllocations.forEach(item => {
      const current = grouped.get(item.category) || 0;
      grouped.set(item.category, current + item.allocatedAmount);
    });

    return grouped;
  }, [filteredAllocations]);

  /**
   * Group allocations by priority
   */
  const allocationsByPriority = useMemo(() => {
    const grouped = new Map<AllocationPriority, number>();

    filteredAllocations.forEach(item => {
      const current = grouped.get(item.priority) || 0;
      grouped.set(item.priority, current + item.allocatedAmount);
    });

    return grouped;
  }, [filteredAllocations]);

  /**
   * Add allocation
   */
  const addAllocation = useCallback((allocation: Omit<BudgetLineItem, 'id'>) => {
    track('budget_allocation_add', {
      fiscal_year: fiscalYear,
      category: allocation.category,
      amount: allocation.allocatedAmount,
    });

    const newAllocation: BudgetLineItem = {
      ...allocation,
      id: `alloc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    setAllocations(prev => [...prev, newAllocation]);
  }, [fiscalYear, track]);

  /**
   * Update allocation
   */
  const updateAllocation = useCallback((
    allocationId: string,
    updates: Partial<BudgetLineItem>
  ) => {
    track('budget_allocation_update', { allocation_id: allocationId });

    setAllocations(prev =>
      prev.map(item =>
        item.id === allocationId ? { ...item, ...updates } : item
      )
    );
  }, [track]);

  /**
   * Delete allocation
   */
  const deleteAllocation = useCallback((allocationId: string) => {
    track('budget_allocation_delete', { allocation_id: allocationId });

    setAllocations(prev => prev.filter(item => item.id !== allocationId));
  }, [track]);

  return {
    allocations: sortedAllocations,
    filters,
    updateFilters,
    clearFilters,
    filteredAllocations,
    sortColumn,
    sortDirection,
    toggleSort,
    totalAllocated,
    totalRequested,
    totalActual,
    allocationsByCategory,
    allocationsByPriority,
    addAllocation,
    updateAllocation,
    deleteAllocation,
    isLoading,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Workflow Management
  useBudgetPlanningWorkflow,

  // Scenario Planning
  useBudgetScenarioPlanning,
  useBudgetScenarioComparison,

  // Multi-Year Planning
  useMultiYearBudgetPlanningUI,

  // Allocation Management
  useBudgetAllocationUI,

  // Validation Functions
  validateBudgetScenario,
  validateBudgetLineItem,
  calculateBudgetVariance,
};
