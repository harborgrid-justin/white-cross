/**
 * Analytics Hooks
 *
 * Specialized React hooks for analytics and reporting features:
 * - Real-time health metrics
 * - Trend analysis
 * - Student risk assessment
 * - Compliance reporting
 *
 * @module analyticsHooks
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

// Import API hooks
import {
  useGenerateHealthMetricsQuery,
  handlePhase3ApiError,
} from '../api/advancedApiIntegration';

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
