/**
 * Dashboard Mutation Hooks
 * 
 * Hooks for dashboard actions like exporting data, updating layouts, and refreshing.
 * 
 * @module hooks/domains/dashboard/mutations/useDashboardMutations
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useApiError } from '../../../shared/useApiError';
import { 
  dashboardQueryKeys, 
  DASHBOARD_OPERATIONS,
  DASHBOARD_ERROR_CODES,
  DASHBOARD_CACHE_CONFIG,
  type DashboardLayoutConfig,
  type DashboardExportOptions
} from '../config';
import toast from 'react-hot-toast';

/**
 * Dashboard mutation options interface
 */
export interface DashboardMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Main dashboard mutations hook
 */
export function useDashboardMutations(options: DashboardMutationOptions = {}) {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  // Export dashboard data mutation
  const exportDataMutation = useMutation({
    mutationKey: [DASHBOARD_OPERATIONS.EXPORT_DATA],
    mutationFn: async (exportOptions: DashboardExportOptions) => {
      try {
        // Mock implementation - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export time
        
        return {
          success: true,
          downloadUrl: '/downloads/dashboard-export.pdf',
          filename: `dashboard-export-${Date.now()}.${exportOptions.format}`,
        };
      } catch (error: any) {
        throw handleError(error, DASHBOARD_OPERATIONS.EXPORT_DATA);
      }
    },
    onSuccess: (result) => {
      toast.success('Dashboard data exported successfully');
      options.onSuccess?.(result);
    },
    onError: (error: Error) => {
      toast.error('Failed to export dashboard data');
      options.onError?.(error);
    },
    gcTime: DASHBOARD_CACHE_CONFIG.mutations.gcTime,
  });

  // Update dashboard layout mutation
  const updateLayoutMutation = useMutation({
    mutationKey: [DASHBOARD_OPERATIONS.UPDATE_LAYOUT],
    mutationFn: async (layoutConfig: DashboardLayoutConfig) => {
      try {
        // Mock implementation - replace with actual API call
        return {
          success: true,
          layout: layoutConfig,
          updatedAt: new Date().toISOString(),
        };
      } catch (error: any) {
        throw handleError(error, DASHBOARD_OPERATIONS.UPDATE_LAYOUT);
      }
    },
    onSuccess: (result) => {
      // Invalidate layout-related queries
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.overview.all() });
      toast.success('Dashboard layout updated');
      options.onSuccess?.(result);
    },
    onError: (error: Error) => {
      toast.error('Failed to update dashboard layout');
      options.onError?.(error);
    },
    gcTime: DASHBOARD_CACHE_CONFIG.mutations.gcTime,
  });

  // Refresh all dashboard data mutation
  const refreshAllMutation = useMutation({
    mutationKey: [DASHBOARD_OPERATIONS.REFRESH_ALL],
    mutationFn: async () => {
      try {
        // Invalidate all dashboard queries
        await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.domain });
        
        return {
          success: true,
          refreshedAt: new Date().toISOString(),
        };
      } catch (error: any) {
        throw handleError(error, DASHBOARD_OPERATIONS.REFRESH_ALL);
      }
    },
    onSuccess: () => {
      toast.success('Dashboard data refreshed');
      options.onSuccess?.({ refreshed: true });
    },
    onError: (error: Error) => {
      toast.error('Failed to refresh dashboard');
      options.onError?.(error);
    },
    gcTime: DASHBOARD_CACHE_CONFIG.mutations.gcTime,
  });

  // Clear dashboard cache mutation
  const clearCacheMutation = useMutation({
    mutationKey: [DASHBOARD_OPERATIONS.CLEAR_CACHE],
    mutationFn: async () => {
      try {
        // Clear all dashboard-related cache
        await queryClient.removeQueries({ queryKey: dashboardQueryKeys.domain });
        
        return {
          success: true,
          clearedAt: new Date().toISOString(),
        };
      } catch (error: any) {
        throw handleError(error, DASHBOARD_OPERATIONS.CLEAR_CACHE);
      }
    },
    onSuccess: () => {
      toast.success('Dashboard cache cleared');
      options.onSuccess?.({ cleared: true });
    },
    onError: (error: Error) => {
      toast.error('Failed to clear dashboard cache');
      options.onError?.(error);
    },
    gcTime: DASHBOARD_CACHE_CONFIG.mutations.gcTime,
  });

  return {
    exportData: {
      mutate: exportDataMutation.mutate,
      mutateAsync: exportDataMutation.mutateAsync,
      isLoading: exportDataMutation.isPending,
      error: exportDataMutation.error,
      isError: exportDataMutation.isError,
      isSuccess: exportDataMutation.isSuccess,
    },
    updateLayout: {
      mutate: updateLayoutMutation.mutate,
      mutateAsync: updateLayoutMutation.mutateAsync,
      isLoading: updateLayoutMutation.isPending,
      error: updateLayoutMutation.error,
      isError: updateLayoutMutation.isError,
      isSuccess: updateLayoutMutation.isSuccess,
    },
    refreshAll: {
      mutate: refreshAllMutation.mutate,
      mutateAsync: refreshAllMutation.mutateAsync,
      isLoading: refreshAllMutation.isPending,
      error: refreshAllMutation.error,
      isError: refreshAllMutation.isError,
      isSuccess: refreshAllMutation.isSuccess,
    },
    clearCache: {
      mutate: clearCacheMutation.mutate,
      mutateAsync: clearCacheMutation.mutateAsync,
      isLoading: clearCacheMutation.isPending,
      error: clearCacheMutation.error,
      isError: clearCacheMutation.isError,
      isSuccess: clearCacheMutation.isSuccess,
    },
  };
}

/**
 * Individual mutation hooks for convenience
 */

export function useUpdateDashboardLayout(options: DashboardMutationOptions = {}) {
  const { updateLayout } = useDashboardMutations(options);
  return updateLayout;
}

export function useExportDashboardData(options: DashboardMutationOptions = {}) {
  const { exportData } = useDashboardMutations(options);
  return exportData;
}

export function useRefreshDashboard(options: DashboardMutationOptions = {}) {
  const { refreshAll } = useDashboardMutations(options);
  return refreshAll;
}
