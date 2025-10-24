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
 * Options for configuring reports mutation behavior.
 *
 * @property onSuccess - Callback invoked when mutation succeeds
 * @property onError - Callback invoked when mutation fails
 */
export interface ReportsMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing all reports mutation operations (generate, delete).
 *
 * Centralizes report mutation logic with automatic cache invalidation,
 * error handling, and user feedback via toast notifications.
 *
 * @param options - Configuration options for mutation callbacks
 * @returns Object containing mutation methods for report operations
 *
 * @remarks
 * - Automatically invalidates relevant query caches after mutations
 * - Shows toast notifications for user feedback
 * - Uses optimistic error handling via useApiError hook
 * - All mutations include loading, error, and success states
 *
 * @example
 * ```typescript
 * const { generate, delete: deleteReport } = useReportsMutations({
 *   onSuccess: (data) => console.log('Operation succeeded', data),
 *   onError: (error) => console.error('Operation failed', error)
 * });
 *
 * // Generate a report
 * generate.mutate({
 *   templateId: 'monthly-incident-summary',
 *   parameters: { month: '2025-01' },
 *   format: 'pdf'
 * });
 *
 * // Delete a report
 * deleteReport.mutate('report-id-123');
 * ```
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
 * Hook for generating reports from templates.
 *
 * Convenience wrapper around useReportsMutations providing only the
 * generate mutation. Supports multiple output formats (PDF, Excel, CSV)
 * and delivery methods (download or email).
 *
 * @param options - Configuration options for mutation callbacks
 * @returns Generate mutation object with mutate, mutateAsync, and state
 *
 * @remarks
 * - Report generation is asynchronous - use generation status to monitor
 * - Automatically invalidates reports list cache on success
 * - Shows toast notification on success/failure
 * - Supports both download and email delivery
 *
 * @example
 * ```typescript
 * const { mutate, isLoading, error } = useGenerateReport({
 *   onSuccess: (result) => {
 *     // result contains jobId for tracking generation status
 *     console.log('Generation started:', result.jobId);
 *   }
 * });
 *
 * // Generate PDF report for download
 * mutate({
 *   templateId: 'student-health-summary',
 *   parameters: {
 *     studentId: '12345',
 *     dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' }
 *   },
 *   format: 'pdf',
 *   deliveryMethod: 'download'
 * });
 *
 * // Generate Excel report and email it
 * mutate({
 *   templateId: 'medication-log',
 *   parameters: { month: '2025-01' },
 *   format: 'excel',
 *   deliveryMethod: 'email',
 *   emailRecipients: ['nurse@school.edu']
 * });
 * ```
 */
export function useGenerateReport(options: ReportsMutationOptions = {}) {
  const { generate } = useReportsMutations(options);
  return generate;
}

/**
 * Hook for deleting generated reports.
 *
 * Convenience wrapper around useReportsMutations providing only the
 * delete mutation. Removes report from cache and invalidates lists.
 *
 * @param options - Configuration options for mutation callbacks
 * @returns Delete mutation object with mutate, mutateAsync, and state
 *
 * @remarks
 * - Removes report from details cache immediately
 * - Invalidates all report lists to reflect deletion
 * - Shows toast notification on success/failure
 * - Permanent deletion - no undo functionality
 *
 * @example
 * ```typescript
 * const { mutate: deleteReport, isLoading } = useDeleteReport({
 *   onSuccess: () => {
 *     navigate('/reports'); // Navigate away after deletion
 *   }
 * });
 *
 * // Delete a report
 * deleteReport('report-id-123');
 *
 * // With async/await
 * const { mutateAsync: deleteReportAsync } = useDeleteReport();
 * try {
 *   await deleteReportAsync('report-id-456');
 *   console.log('Report deleted successfully');
 * } catch (error) {
 *   console.error('Failed to delete report:', error);
 * }
 * ```
 */
export function useDeleteReport(options: ReportsMutationOptions = {}) {
  const { delete: deleteReport } = useReportsMutations(options);
  return deleteReport;
}
