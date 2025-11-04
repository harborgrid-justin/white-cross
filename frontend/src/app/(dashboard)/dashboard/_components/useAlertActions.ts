/**
 * useAlertActions Hook
 *
 * Custom hook for managing health alert actions including:
 * - Alert acknowledgment
 * - Dashboard data refresh
 * - Error handling and loading states
 *
 * @returns Alert action handlers and state
 */

'use client';

import { useState } from 'react';
import {
  acknowledgeHealthAlert,
  refreshDashboardData,
} from '@/lib/actions/dashboard.actions';

interface UseAlertActionsReturn {
  isAcknowledging: boolean;
  isRefreshing: boolean;
  error: string | null;
  handleAcknowledgeAlert: (alertId: string) => Promise<void>;
  handleRefresh: () => Promise<void>;
  clearError: () => void;
}

export function useAlertActions(): UseAlertActionsReturn {
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAcknowledgeAlert = async (alertId: string) => {
    setIsAcknowledging(true);
    setError(null);

    try {
      // In a real app, get user ID from auth context
      const success = await acknowledgeHealthAlert(alertId, 'current-user-id');

      if (success) {
        console.log(`Alert ${alertId} acknowledged successfully`);
        // In a real app, this would trigger server-side revalidation
      } else {
        setError('Failed to acknowledge alert');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to acknowledge alert';
      setError(errorMessage);
      console.error('Failed to acknowledge alert:', err);
    } finally {
      setIsAcknowledging(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      await refreshDashboardData();
      console.log('Dashboard data refreshed successfully');
      // Page will revalidate automatically with fresh data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh dashboard';
      setError(errorMessage);
      console.error('Failed to refresh dashboard:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isAcknowledging,
    isRefreshing,
    error,
    handleAcknowledgeAlert,
    handleRefresh,
    clearError,
  };
}
