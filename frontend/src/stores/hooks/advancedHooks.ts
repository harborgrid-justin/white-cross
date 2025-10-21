/**
 * Advanced Hooks and Selectors
 *
 * Specialized React hooks and memoized selectors for enterprise features:
 * - Analytics and reporting hooks
 * - Bulk operations management
 * - Workflow orchestration hooks
 * - Audit trail and compliance hooks
 * - Performance monitoring hooks
 * - Real-time data synchronization
 *
 * @module advancedHooks
 */

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from '../reduxStore';

// Use core hooks locally to avoid circular dependency
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Import advanced actions and selectors
import {
  calculateHealthMetrics,
  generateTrendAnalysis,
  assessStudentRisks,
  generateComplianceReport,
} from '../analytics/analyticsEngine';

import {
  executeBulkOperation,
  rollbackBulkOperation,
  createAuditEntry,
  syncEntityData,
  executeWorkflow,
} from '../enterprise/enterpriseFeatures';

import {
  executeStudentEnrollmentWorkflow,
  executeMedicationManagementWorkflow,
} from '../orchestration/crossDomainOrchestration';

// Import API hooks
import {
  useGenerateHealthMetricsQuery,
  useExecuteBulkOperationMutation,
  useGetBulkOperationStatusQuery,
  useExecuteWorkflowMutation,
  useGetWorkflowStatusQuery,
  useQueryAuditTrailQuery,
  useGetSyncStatusQuery,
  useGetPerformanceMetricsQuery,
  useGetSystemHealthQuery,
  handlePhase3ApiError,
} from '../api/advancedApiIntegration';

// ============================================================
// ANALYTICS HOOKS
// ============================================================

/**
 * Hook for real-time health metrics with automatic refresh
 */
export const useHealthMetrics = (filters?: Record<string, any>, refreshInterval?: number) => {
  const dispatch = useAppDispatch();
  
  // Get metrics from local state
  const localMetrics = useAppSelector(calculateHealthMetrics);
  
  // Get metrics from API with optional polling
  const {
    data: apiMetrics,
    error,
    isLoading,
    refetch
  } = useGenerateHealthMetricsQuery(
    { filters },
    {
      pollingInterval: refreshInterval || 30000, // Default 30 seconds
      skipPollingIfUnfocused: true,
    }
  );

  const metrics = useMemo(() => {
    // Combine local and API metrics, preferring API data when available
    return apiMetrics?.data || localMetrics;
  }, [apiMetrics, localMetrics]);

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    metrics,
    isLoading,
    error: error ? handlePhase3ApiError(error) : null,
    refresh
  };
};

/**
 * Hook for trend analysis with caching and error handling
 */
export const useTrendAnalysis = (
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY',
  lookback: number = 30
) => {
  const dispatch = useAppDispatch();

  const generateTrends = useCallback(async () => {
    try {
      const result = await dispatch(generateTrendAnalysis({ period, lookback })).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [dispatch, period, lookback]);

  return {
    generateTrends,
    isGenerating: false, // TODO: Add loading state tracking
  };
};

/**
 * Hook for student risk assessment with real-time updates
 */
export const useStudentRiskAssessment = (studentIds?: string[]) => {
  const dispatch = useAppDispatch();

  const assessRisks = useCallback(async () => {
    try {
      const result = await dispatch(assessStudentRisks({ studentIds })).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [dispatch, studentIds]);

  // Memoized selector for high-risk students
  const highRiskStudents = useAppSelector(
    useMemo(
      () => createSelector(
        (state: RootState) => state.students,
        (studentsState) => {
          // TODO: Fix type casting when store types are resolved
          const students = Object.values((studentsState as any).entities).filter(Boolean);
          return students.filter((student: any) => {
            // Simple risk calculation based on medications and allergies
            const activeMeds = student.medications?.filter((m: any) => m.isActive).length || 0;
            const severeAllergies = student.allergies?.filter((a: any) => 
              a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING'
            ).length || 0;
            return activeMeds >= 3 || severeAllergies > 0;
          });
        }
      ),
      [studentIds]
    )
  );

  return {
    assessRisks,
    highRiskStudents,
    isAssessing: false, // TODO: Add loading state tracking
  };
};

/**
 * Hook for compliance reporting with automatic generation
 */
export const useComplianceReporting = () => {
  const dispatch = useAppDispatch();

  const generateReport = useCallback(async (startDate: string, endDate: string) => {
    try {
      const result = await dispatch(generateComplianceReport({ startDate, endDate })).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [dispatch]);

  return {
    generateReport,
    isGenerating: false, // TODO: Add loading state tracking
  };
};

// ============================================================
// BULK OPERATIONS HOOKS
// ============================================================

/**
 * Hook for managing bulk operations with progress tracking
 */
export const useBulkOperations = () => {
  const dispatch = useAppDispatch();
  const [executeBulk, { isLoading: isExecuting }] = useExecuteBulkOperationMutation();

  // Get active bulk operations from state
  const bulkOperations = useAppSelector((state: RootState) => state.enterprise.bulkOperations);
  const activeOperations = useMemo(
    () => Object.values(bulkOperations).filter(op => op.status === 'IN_PROGRESS'),
    [bulkOperations]
  );

  const executeBulkOperation = useCallback(async (
    type: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT',
    entity: string,
    data: any[],
    options?: {
      validateFirst?: boolean;
      rollbackOnError?: boolean;
      batchSize?: number;
    }
  ) => {
    try {
      const result = await executeBulk({
        type,
        entity,
        data,
        options: {
          validateFirst: options?.validateFirst ?? true,
          rollbackOnError: options?.rollbackOnError ?? true,
          batchSize: options?.batchSize ?? 100,
          timeout: 300000, // 5 minutes
        }
      }).unwrap();
      
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [executeBulk]);

  const rollbackOperation = useCallback(async (operationId: string) => {
    try {
      const result = await dispatch(rollbackBulkOperation({ operationId })).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [dispatch]);

  return {
    executeBulkOperation,
    rollbackOperation,
    bulkOperations,
    activeOperations,
    isExecuting
  };
};

/**
 * Hook for tracking bulk operation progress
 */
export const useBulkOperationProgress = (operationId: string | null) => {
  const {
    data: operationStatus,
    error,
    isLoading
  } = useGetBulkOperationStatusQuery(
    { operationId: operationId! },
    {
      skip: !operationId,
      pollingInterval: operationId ? 2000 : undefined, // Poll every 2 seconds if active
      skipPollingIfUnfocused: true,
    }
  );

  const progress = useMemo(() => {
    if (!operationStatus) return null;
    
    return {
      percentage: operationStatus.progress.percentage,
      processed: operationStatus.progress.processed,
      total: operationStatus.progress.total,
      failed: operationStatus.progress.failed,
      status: operationStatus.status,
      isComplete: ['COMPLETED', 'FAILED', 'ROLLED_BACK'].includes(operationStatus.status),
      canRollback: operationStatus.rollbackId ? true : false
    };
  }, [operationStatus]);

  return {
    progress,
    error: error ? handlePhase3ApiError(error) : null,
    isLoading
  };
};

// ============================================================
// WORKFLOW ORCHESTRATION HOOKS
// ============================================================

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

// ============================================================
// AUDIT TRAIL HOOKS
// ============================================================

/**
 * Hook for querying and managing audit trails
 */
export const useAuditTrail = () => {
  const dispatch = useAppDispatch();

  const createAuditRecord = useCallback(async (
    action: string,
    entity: string,
    entityId: string,
    changes: any[],
    metadata?: Record<string, any>
  ) => {
    try {
      const result = await dispatch(createAuditEntry({
        action,
        entity,
        entityId,
        changes,
        metadata
      })).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [dispatch]);

  // Get recent audit entries from local state
  const recentEntries = useAppSelector((state: RootState) => 
    state.enterprise.auditTrail.slice(0, 50) // Last 50 entries
  );

  return {
    createAuditRecord,
    recentEntries
  };
};

/**
 * Hook for querying audit trail with filters
 */
export const useAuditQuery = (filters: {
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  dateRange?: { start: string; end: string };
  riskLevel?: string;
  page?: number;
  limit?: number;
}) => {
  const {
    data: auditResults,
    error,
    isLoading,
    refetch
  } = useQueryAuditTrailQuery({
    ...filters,
    pagination: {
      page: filters.page || 1,
      limit: filters.limit || 50
    }
  });

  return {
    results: auditResults,
    error: error ? handlePhase3ApiError(error) : null,
    isLoading,
    refetch
  };
};

// ============================================================
// DATA SYNCHRONIZATION HOOKS
// ============================================================

/**
 * Hook for managing data synchronization across entities
 */
export const useDataSync = () => {
  const dispatch = useAppDispatch();
  const {
    data: syncStatus,
    error,
    isLoading,
    refetch
  } = useGetSyncStatusQuery();

  const syncEntity = useCallback(async (entity: string, forceSync = false) => {
    try {
      const result = await dispatch(syncEntityData({ entity, forceSync })).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [dispatch]);

  const syncStatuses = useMemo(() => {
    return syncStatus || {};
  }, [syncStatus]);

  const conflictCount = useMemo(() => {
    return Object.values(syncStatuses).reduce((total, status) => total + status.conflictCount, 0);
  }, [syncStatuses]);

  const entitiesWithErrors = useMemo(() => {
    return Object.values(syncStatuses).filter(status => status.status === 'ERROR');
  }, [syncStatuses]);

  return {
    syncEntity,
    syncStatuses,
    conflictCount,
    entitiesWithErrors,
    isLoading,
    error: error ? handlePhase3ApiError(error) : null,
    refresh: refetch
  };
};

// ============================================================
// PERFORMANCE MONITORING HOOKS
// ============================================================

/**
 * Hook for monitoring system performance and health
 */
export const useSystemMonitoring = () => {
  const {
    data: performanceMetrics,
    error: metricsError,
    isLoading: isLoadingMetrics
  } = useGetPerformanceMetricsQuery({
    timeframe: 'HOUR'
  });

  const {
    data: systemHealth,
    error: healthError,
    isLoading: isLoadingHealth
  } = useGetSystemHealthQuery();

  const healthStatus = useMemo(() => {
    if (!systemHealth) return null;

    const criticalAlerts = systemHealth.alerts.filter(alert => alert.severity === 'CRITICAL');
    const highAlerts = systemHealth.alerts.filter(alert => alert.severity === 'HIGH');
    
    return {
      status: systemHealth.status,
      services: systemHealth.services,
      totalAlerts: systemHealth.alerts.length,
      criticalAlerts: criticalAlerts.length,
      highAlerts: highAlerts.length,
      isHealthy: systemHealth.status === 'HEALTHY' && criticalAlerts.length === 0
    };
  }, [systemHealth]);

  const performance = useMemo(() => {
    if (!performanceMetrics) return null;

    const metrics = Object.values(performanceMetrics);
    const avgResponseTime = metrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / metrics.length;
    const avgErrorRate = metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length;
    const avgCacheHitRate = metrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / metrics.length;

    return {
      averageResponseTime: avgResponseTime,
      averageErrorRate: avgErrorRate,
      averageCacheHitRate: avgCacheHitRate,
      totalRequests: metrics.reduce((sum, m) => sum + m.totalRequests, 0),
      byEntity: performanceMetrics
    };
  }, [performanceMetrics]);

  return {
    healthStatus,
    performance,
    isLoading: isLoadingMetrics || isLoadingHealth,
    error: metricsError || healthError ? handlePhase3ApiError(metricsError || healthError) : null
  };
};

// ============================================================
// ADVANCED SELECTORS
// ============================================================

/**
 * Memoized selector for enterprise dashboard data
 */
export const useEnterpriseDashboard = () => {
  return useAppSelector(
    useMemo(
      () => createSelector(
        [(state: RootState) => state.enterprise, (state: RootState) => state.orchestration],
        (enterprise, orchestration) => {
          const activeBulkOps = Object.values(enterprise.bulkOperations).filter(
            op => op.status === 'IN_PROGRESS'
          );
          
          const activeWorkflows = Object.values(orchestration.executions).filter(
            exec => exec.status === 'RUNNING'
          );

          const recentAuditEntries = enterprise.auditTrail.slice(0, 10);
          
          const criticalRiskEntries = recentAuditEntries.filter(
            entry => entry.riskLevel === 'CRITICAL'
          );

          return {
            activeBulkOperations: activeBulkOps.length,
            activeWorkflows: activeWorkflows.length,
            recentAuditEntries: recentAuditEntries.length,
            criticalRiskEntries: criticalRiskEntries.length,
            totalOperations: Object.keys(enterprise.bulkOperations).length,
            totalExecutions: Object.keys(orchestration.executions).length
          };
        }
      ),
      []
    )
  );
};

/**
 * Performance metrics selector with trends
 */
export const usePerformanceTrends = () => {
  return useAppSelector(
    useMemo(
      () => createSelector(
        [(state: RootState) => state.enterprise.performanceMetrics],
        (performanceMetrics) => {
          const metrics = Object.values(performanceMetrics);
          
          // Calculate trends (simplified)
          const responseTimeTrend = metrics.map(m => ({
            entity: m.entity,
            responseTime: m.averageResponseTime,
            trend: m.averageResponseTime > 1000 ? 'SLOW' : m.averageResponseTime > 500 ? 'MODERATE' : 'FAST'
          }));

          const errorRateTrend = metrics.map(m => ({
            entity: m.entity,
            errorRate: m.errorRate,
            trend: m.errorRate > 5 ? 'HIGH' : m.errorRate > 1 ? 'MODERATE' : 'LOW'
          }));

          const cacheEfficiency = metrics.map(m => ({
            entity: m.entity,
            hitRate: m.cacheHitRate,
            efficiency: m.cacheHitRate > 80 ? 'EXCELLENT' : m.cacheHitRate > 60 ? 'GOOD' : 'POOR'
          }));

          return {
            responseTimeTrend,
            errorRateTrend,
            cacheEfficiency,
            overallHealth: metrics.every(m => m.errorRate < 5 && m.averageResponseTime < 1000) ? 'HEALTHY' : 'NEEDS_ATTENTION'
          };
        }
      ),
      []
    )
  );
};

export default {
  // Analytics hooks
  useHealthMetrics,
  useTrendAnalysis,
  useStudentRiskAssessment,
  useComplianceReporting,
  
  // Bulk operations hooks
  useBulkOperations,
  useBulkOperationProgress,
  
  // Workflow hooks
  useWorkflowOrchestration,
  useWorkflowProgress,
  
  // Audit trail hooks
  useAuditTrail,
  useAuditQuery,
  
  // Data sync hooks
  useDataSync,
  
  // Performance monitoring hooks
  useSystemMonitoring,
  
  // Advanced selectors
  useEnterpriseDashboard,
  usePerformanceTrends,
};