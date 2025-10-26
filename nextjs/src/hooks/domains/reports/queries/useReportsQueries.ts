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
 * Hook for fetching reports list with optional filtering.
 *
 * Retrieves all generated reports matching the provided filter criteria.
 * Results are cached for 5 minutes (staleTime) and kept for 10 minutes (gcTime).
 *
 * @param filters - Optional filter criteria for reports
 * @param options - Additional TanStack Query options
 * @returns Query result containing reports data and query state
 *
 * @remarks
 * - Cached for 5 minutes before being considered stale
 * - Supports filtering by type, date range, status, and creator
 * - Automatically refetches when filters change
 * - Includes error handling with useApiError hook
 *
 * @example
 * ```typescript
 * // Fetch all reports
 * const { data: reports, isLoading } = useReportsList();
 *
 * // Fetch filtered reports
 * const { data: incidentReports } = useReportsList({
 *   type: 'incident',
 *   dateRange: {
 *     startDate: '2025-01-01',
 *     endDate: '2025-01-31'
 *   },
 *   status: 'generated'
 * });
 *
 * // With custom query options
 * const { data, refetch } = useReportsList(
 *   { type: 'student' },
 *   { enabled: isAuthenticated, refetchInterval: 30000 }
 * );
 * ```
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
 * Hook for fetching individual report details by ID.
 *
 * Retrieves complete details for a specific report including metadata,
 * parameters, and generation information. Cached for 10 minutes.
 *
 * @param reportId - Unique identifier of the report
 * @param options - Additional TanStack Query options
 * @returns Query result containing report details and query state
 *
 * @remarks
 * - Cached for 10 minutes before being considered stale
 * - Automatically disabled if reportId is empty/undefined
 * - Includes full report metadata and generation parameters
 * - Error handling via useApiError hook
 *
 * @example
 * ```typescript
 * // Fetch report details
 * const { data: report, isLoading, error } = useReportDetails('report-123');
 *
 * // Conditionally enabled
 * const { data } = useReportDetails(
 *   selectedReportId,
 *   { enabled: !!selectedReportId }
 * );
 *
 * // Access report data
 * if (report) {
 *   console.log(report.templateId, report.format, report.createdAt);
 * }
 * ```
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
 * Hook for fetching available report templates.
 *
 * Retrieves report templates, optionally filtered by category.
 * Templates are cached for 30 minutes as they change infrequently.
 *
 * @param category - Optional category filter for templates
 * @param options - Additional TanStack Query options
 * @returns Query result containing templates array and query state
 *
 * @remarks
 * - Cached for 30 minutes (templates rarely change)
 * - Each template includes metadata, parameters schema, and supported formats
 * - Can be filtered by category (student, health, incident, etc.)
 * - Error handling via useApiError hook
 *
 * @example
 * ```typescript
 * // Fetch all templates
 * const { data: templates, isLoading } = useReportTemplates();
 *
 * // Fetch templates by category
 * const { data: healthTemplates } = useReportTemplates('health');
 *
 * // Use templates in a select dropdown
 * templates?.map(template => (
 *   <option key={template.id} value={template.id}>
 *     {template.name}
 *   </option>
 * ));
 * ```
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
 * Hook for monitoring report generation status with automatic polling.
 *
 * Tracks the status of an asynchronous report generation job. Automatically
 * polls every 2 seconds while the report is still generating, then stops
 * once generation completes or fails.
 *
 * @param jobId - Unique identifier of the generation job
 * @param options - Additional TanStack Query options
 * @returns Query result containing generation status and query state
 *
 * @remarks
 * - Always fetches fresh data (staleTime: 0)
 * - Polls every 2 seconds while status is 'generating'
 * - Stops polling when status changes to 'completed' or 'failed'
 * - Automatically disabled if jobId is empty/undefined
 * - Use in conjunction with useGenerateReport hook
 *
 * @example
 * ```typescript
 * // Start generation
 * const { mutate: generateReport } = useGenerateReport({
 *   onSuccess: (result) => {
 *     setJobId(result.jobId); // Track the job ID
 *   }
 * });
 *
 * // Monitor generation progress
 * const { data: status, isLoading } = useReportGeneration(jobId);
 *
 * // React to status changes
 * useEffect(() => {
 *   if (status?.status === 'completed') {
 *     // Download or display the report
 *     window.open(status.downloadUrl);
 *   } else if (status?.status === 'failed') {
 *     console.error('Generation failed:', status.error);
 *   }
 * }, [status]);
 *
 * // Display progress
 * {isLoading && <p>Generating report...</p>}
 * {status?.status === 'generating' && (
 *   <ProgressBar value={status.progress} />
 * )}
 * ```
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
