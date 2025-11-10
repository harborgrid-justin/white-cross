/**
 * LOC: USACE-CONSTR-CTRL-001
 * File: /reuse/frontend/composites/usace/downstream/construction-project-controllers.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTracking } from '../../analytics-tracking-kit';
import {
  useConstructionProjectInit,
  useConstructionPhaseManagement,
  useConstructionProgressTracking,
  useConstructionBudgetTracking,
  type ConstructionProject,
  type ConstructionPhase,
} from '../usace-construction-projects-composites';

export function useConstructionProjectController(projectId: string) {
  const {
    projectData,
    initProject,
    updateProjectPhase,
  } = useConstructionProjectInit();
  
  const {
    currentPhase,
    phaseHistory,
    transitionPhase,
    validatePhaseTransition,
  } = useConstructionPhaseManagement(projectId);
  
  const {
    progressData,
    updateProgress,
    calculateSPI,
  } = useConstructionProgressTracking(projectId);
  
  const {
    budget,
    updateBudget,
    calculateRemainingBudget,
  } = useConstructionBudgetTracking(projectId);
  
  const { track } = useTracking();

  const [controllerState, setControllerState] = useState({
    activeModule: 'overview' as 'overview' | 'schedule' | 'budget' | 'quality',
    notifications: [] as any[],
  });

  const projectHealth = useMemo(() => {
    const spi = calculateSPI();
    const budgetHealth = calculateRemainingBudget() > 0 ? 'green' : 'red';
    const scheduleHealth = spi >= 0.95 ? 'green' : spi >= 0.85 ? 'yellow' : 'red';
    
    return {
      overall: budgetHealth === 'red' || scheduleHealth === 'red' ? 'red' : 
               scheduleHealth === 'yellow' ? 'yellow' : 'green',
      budget: budgetHealth,
      schedule: scheduleHealth,
      spi,
    };
  }, [calculateSPI, calculateRemainingBudget]);

  const advancePhase = useCallback((newPhase: ConstructionPhase) => {
    track('construction_phase_advance', { project_id: projectId, to: newPhase });
    
    if (!validatePhaseTransition(currentPhase, newPhase)) {
      return { success: false, error: 'Invalid phase transition' };
    }
    
    transitionPhase(newPhase, 'current_user');
    updateProjectPhase(newPhase);
    
    return { success: true };
  }, [projectId, currentPhase, validatePhaseTransition, transitionPhase, updateProjectPhase, track]);

  const updateProjectProgress = useCallback((progressUpdate: any) => {
    track('project_progress_update', { project_id: projectId });
    
    updateProgress(
      progressUpdate.actualPercent,
      progressUpdate.scheduledPercent,
      progressUpdate.actualCost,
      progressUpdate.budgetedCost
    );
    
    updateBudget({
      invoicedToDate: progressUpdate.actualCost,
    });
  }, [projectId, updateProgress, updateBudget, track]);

  return {
    projectData,
    currentPhase,
    phaseHistory,
    progressData,
    budget,
    projectHealth,
    controllerState,
    setControllerState,
    advancePhase,
    updateProjectProgress,
  };
}

export function useProjectDashboardController(projectId: string) {
  const { dashboardData, updateDashboard, calculateProjectHealth } = 
    require('../usace-construction-projects-composites').useConstructionProjectDashboard(projectId);
  
  const { track } = useTracking();

  const refreshDashboard = useCallback(() => {
    track('project_dashboard_refresh', { project_id: projectId });
    calculateProjectHealth();
  }, [projectId, calculateProjectHealth, track]);

  const exportDashboard = useCallback((format: 'pdf' | 'excel') => {
    track('project_dashboard_export', { project_id: projectId, format });
    return `dashboard_${projectId}.${format}`;
  }, [projectId, track]);

  return {
    dashboardData,
    updateDashboard,
    refreshDashboard,
    exportDashboard,
  };
}

export default {
  useConstructionProjectController,
  useProjectDashboardController,
};
