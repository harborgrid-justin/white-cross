/**
 * Workflow Orchestration Hooks
 *
 * Specialized React hooks for workflow management:
 * - Student enrollment workflows
 * - Medication management workflows
 * - Custom workflow execution
 * - Progress tracking
 *
 * @module workflowHooks
 */

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../reduxStore';

// Use core hooks locally to avoid circular dependency
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Import orchestration actions
import {
  executeStudentEnrollmentWorkflow,
  executeMedicationManagementWorkflow,
} from '../orchestration/crossDomainOrchestration';

// Import API hooks
import {
  useExecuteWorkflowMutation,
  useGetWorkflowStatusQuery,
  handlePhase3ApiError,
} from '../api/advancedApiIntegration';

/**
 * Hook for executing and managing workflows
 */
export const useWorkflowOrchestration = () => {
  const dispatch = useAppDispatch();
  const [executeWorkflowApi, { isLoading: isExecutingWorkflow }] = useExecuteWorkflowMutation();

  // Get workflow executions from state
  const executions = useAppSelector((state: RootState) => state.orchestration.executions);
  const activeExecutions = useAppSelector((state: RootState) => state.orchestration.activeExecutions);

  const executeStudentEnrollment = useCallback(async (enrollmentData: {
    studentData: any;
    healthData?: any;
    emergencyContacts: any[];
    notifications?: {
      parents: boolean;
      staff: boolean;
      administration: boolean;
    };
  }) => {
    try {
      const result = await dispatch(executeStudentEnrollmentWorkflow(enrollmentData)).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [dispatch]);

  const executeMedicationManagement = useCallback(async (medicationData: {
    studentId: string;
    medicationData: any;
    prescriptionData: any;
    schedulePreferences?: any;
  }) => {
    try {
      const result = await dispatch(executeMedicationManagementWorkflow(medicationData)).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [dispatch]);

  const executeCustomWorkflow = useCallback(async (
    workflowType: 'STUDENT_ENROLLMENT' | 'MEDICATION_MANAGEMENT' | 'EMERGENCY_RESPONSE',
    input: Record<string, any>,
    options?: {
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      timeout?: number;
    }
  ) => {
    try {
      const result = await executeWorkflowApi({
        workflowType,
        input,
        options
      }).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [executeWorkflowApi]);

  return {
    executeStudentEnrollment,
    executeMedicationManagement,
    executeCustomWorkflow,
    executions,
    activeExecutions,
    isExecutingWorkflow
  };
};

/**
 * Hook for tracking workflow execution progress
 */
export const useWorkflowProgress = (executionId: string | null) => {
  const {
    data: workflowStatus,
    error,
    isLoading
  } = useGetWorkflowStatusQuery(
    { executionId: executionId! },
    {
      skip: !executionId,
      pollingInterval: executionId ? 3000 : undefined, // Poll every 3 seconds if active
      skipPollingIfUnfocused: true,
    }
  );

  const progress = useMemo(() => {
    if (!workflowStatus) return null;

    return {
      percentage: workflowStatus.progress.percentage,
      currentStage: workflowStatus.progress.currentStage,
      completedStages: workflowStatus.progress.completedStages,
      totalStages: workflowStatus.progress.totalStages,
      status: workflowStatus.status,
      isComplete: ['COMPLETED', 'FAILED'].includes(workflowStatus.status),
      results: workflowStatus.results
    };
  }, [workflowStatus]);

  return {
    progress,
    error: error ? handlePhase3ApiError(error) : null,
    isLoading
  };
};
