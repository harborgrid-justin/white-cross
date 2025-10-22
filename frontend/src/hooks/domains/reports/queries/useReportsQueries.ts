/**
 * Reports Query Hooks
 * 
 * Hooks for fetching reports, templates, and generation status.
 * 
 * @module hooks/domains/reports/queries/useReportsQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { reportsApi } from '@/services';
import { useApiError } from '../../../shared/useApiError';
import { 
  reportsQueryKeys, 
  REPORTS_CACHE_CONFIG,
  type ReportsFilters
} from '../config';

/**
 * Get reports list with filtering
 */
export function useReportsList(
  filters?: ReportsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: reportsQueryKeys.lists.filtered(filters),
    queryFn: async () => {
      try {
        const result = await reportsApi.getAll(filters);
        return result;
      } catch (error: any) {
        throw handleError(error, 'fetch_reports_list');
      }
    },
    staleTime: REPORTS_CACHE_CONFIG.lists.staleTime,
    gcTime: REPORTS_CACHE_CONFIG.lists.gcTime,
    ...options,
  });
}

/**
 * Get individual report details
 */
export function useReportDetails(
  reportId: string,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: reportsQueryKeys.details.byId(reportId),
    queryFn: async () => {
      try {
        const result = await reportsApi.getById(reportId);
        return result;
      } catch (error: any) {
        throw handleError(error, 'fetch_report_details');
      }
    },
    staleTime: REPORTS_CACHE_CONFIG.details.staleTime,
    gcTime: REPORTS_CACHE_CONFIG.details.gcTime,
    enabled: !!reportId,
    ...options,
  });
}

/**
 * Get available report templates
 */
export function useReportTemplates(
  category?: string,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: category ? 
      reportsQueryKeys.templates.byCategory(category) : 
      reportsQueryKeys.templates.all(),
    queryFn: async () => {
      try {
        const result = await reportsApi.getTemplates(category);
        return result;
      } catch (error: any) {
        throw handleError(error, 'fetch_report_templates');
      }
    },
    staleTime: REPORTS_CACHE_CONFIG.templates.staleTime,
    gcTime: REPORTS_CACHE_CONFIG.templates.gcTime,
    ...options,
  });
}

/**
 * Monitor report generation status
 */
export function useReportGeneration(
  jobId: string,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: reportsQueryKeys.generation.status(jobId),
    queryFn: async () => {
      try {
        const result = await reportsApi.getGenerationStatus(jobId);
        return result;
      } catch (error: any) {
        throw handleError(error, 'fetch_generation_status');
      }
    },
    staleTime: REPORTS_CACHE_CONFIG.generation.staleTime,
    gcTime: REPORTS_CACHE_CONFIG.generation.gcTime,
    enabled: !!jobId,
    refetchInterval: (data) => {
      // Poll every 2 seconds if still generating
      return data?.status === 'generating' ? 2000 : false;
    },
    ...options,
  });
}
