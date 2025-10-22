/**
 * Reports Mutation Hooks
 * 
 * Hooks for generating, deleting, and managing reports.
 * 
 * @module hooks/domains/reports/mutations/useReportsMutations
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '@/services';
import { useApiError } from '../../../shared/useApiError';
import { 
  reportsQueryKeys, 
  REPORTS_OPERATIONS,
  REPORTS_CACHE_CONFIG,
  type ReportGenerationRequest
} from '../config';
import toast from 'react-hot-toast';

/**
 * Reports mutation options interface
 */
export interface ReportsMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Main reports mutations hook
 */
export function useReportsMutations(options: ReportsMutationOptions = {}) {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  // Generate report mutation
  const generateMutation = useMutation({
    mutationKey: [REPORTS_OPERATIONS.GENERATE],
    mutationFn: async (request: ReportGenerationRequest) => {
      try {
        const result = await reportsApi.generate(request);
        return result;
      } catch (error: any) {
        throw handleError(error, REPORTS_OPERATIONS.GENERATE);
      }
    },
    onSuccess: (result) => {
      // Invalidate reports list
      queryClient.invalidateQueries({ queryKey: reportsQueryKeys.lists.all() });
      toast.success('Report generation started');
      options.onSuccess?.(result);
    },
    onError: (error: Error) => {
      toast.error('Failed to generate report');
      options.onError?.(error);
    },
    gcTime: REPORTS_CACHE_CONFIG.mutations.gcTime,
  });

  // Delete report mutation
  const deleteMutation = useMutation({
    mutationKey: [REPORTS_OPERATIONS.DELETE],
    mutationFn: async (reportId: string) => {
      try {
        const result = await reportsApi.delete(reportId);
        return result;
      } catch (error: any) {
        throw handleError(error, REPORTS_OPERATIONS.DELETE);
      }
    },
    onSuccess: (result, reportId) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: reportsQueryKeys.details.byId(reportId) });
      queryClient.invalidateQueries({ queryKey: reportsQueryKeys.lists.all() });
      toast.success('Report deleted successfully');
      options.onSuccess?.(result);
    },
    onError: (error: Error) => {
      toast.error('Failed to delete report');
      options.onError?.(error);
    },
    gcTime: REPORTS_CACHE_CONFIG.mutations.gcTime,
  });

  return {
    generate: {
      mutate: generateMutation.mutate,
      mutateAsync: generateMutation.mutateAsync,
      isLoading: generateMutation.isPending,
      error: generateMutation.error,
      isError: generateMutation.isError,
      isSuccess: generateMutation.isSuccess,
    },
    delete: {
      mutate: deleteMutation.mutate,
      mutateAsync: deleteMutation.mutateAsync,
      isLoading: deleteMutation.isPending,
      error: deleteMutation.error,
      isError: deleteMutation.isError,
      isSuccess: deleteMutation.isSuccess,
    },
  };
}

/**
 * Individual mutation hooks for convenience
 */
export function useGenerateReport(options: ReportsMutationOptions = {}) {
  const { generate } = useReportsMutations(options);
  return generate;
}

export function useDeleteReport(options: ReportsMutationOptions = {}) {
  const { delete: deleteReport } = useReportsMutations(options);
  return deleteReport;
}
