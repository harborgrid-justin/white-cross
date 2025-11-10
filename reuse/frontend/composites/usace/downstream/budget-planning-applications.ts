/**
 * LOC: USACE-BP-APP-001
 * File: /reuse/frontend/composites/usace/downstream/budget-planning-applications.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTracking } from '../../analytics-tracking-kit';
import {
  useFiscalYearBudget,
  useBudgetAllocationRequest,
  useMultiYearBudgetPlanning,
} from '../usace-budget-planning-composites';

export function useBudgetPlanningWorkflow(fiscalYear: number) {
  const {
    fiscalYearData,
    appropriations,
    loadFiscalYear,
  } = useFiscalYearBudget(fiscalYear);
  
  const {
    createRequest,
    submitRequest,
    requests,
  } = useBudgetAllocationRequest();
  
  const [workflowStep, setWorkflowStep] = useState<'planning' | 'allocation' | 'review' | 'approval'>('planning');
  const { track } = useTracking();
  
  const moveToNextStep = useCallback(() => {
    const steps: typeof workflowStep[] = ['planning', 'allocation', 'review', 'approval'];
    const currentIndex = steps.indexOf(workflowStep);
    if (currentIndex < steps.length - 1) {
      track('budget_workflow_next', { from: workflowStep, to: steps[currentIndex + 1] });
      setWorkflowStep(steps[currentIndex + 1]);
    }
  }, [workflowStep, track]);

  return {
    fiscalYearData,
    appropriations,
    requests,
    workflowStep,
    moveToNextStep,
    createRequest,
    submitRequest,
    loadFiscalYear,
  };
}

export function useBudgetScenarioPlanning() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const { track } = useTracking();
  
  const createScenario = useCallback((scenarioData: any) => {
    track('budget_scenario_create');
    const scenario = {
      id: `scenario_${Date.now()}`,
      ...scenarioData,
      createdDate: new Date(),
    };
    setScenarios(prev => [...prev, scenario]);
    return scenario;
  }, [track]);

  const compareScenarios = useCallback((scenario1Id: string, scenario2Id: string) => {
    track('budget_scenarios_compare', { scenario1: scenario1Id, scenario2: scenario2Id });
    return {};
  }, [track]);

  return { scenarios, createScenario, compareScenarios };
}

export default {
  useBudgetPlanningWorkflow,
  useBudgetScenarioPlanning,
};
