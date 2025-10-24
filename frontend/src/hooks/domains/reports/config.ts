/**
 * Reports Domain Configuration
 * 
 * Query keys, cache settings, and constants for reports-related hooks.
 * 
 * @module hooks/domains/reports/config
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * Reports query keys for TanStack Query.
 *
 * Provides a structured, type-safe approach to cache key management for all
 * reports-related queries. Keys are hierarchical to enable efficient cache
 * invalidation and granular control over data freshness.
 *
 * @remarks
 * - Uses const assertions for type safety
 * - Supports hierarchical cache invalidation
 * - Keys include filters as part of cache identity
 * - Enables precise query matching and invalidation
 *
 * @example
 * ```typescript
 * // Invalidate all report lists
 * queryClient.invalidateQueries({
 *   queryKey: reportsQueryKeys.lists.all()
 * });
 *
 * // Invalidate specific filtered list
 * queryClient.invalidateQueries({
 *   queryKey: reportsQueryKeys.lists.filtered({ type: 'student' })
 * });
 * ```
 */
export const reportsQueryKeys = {
  // Base keys
  domain: ['reports'] as const,
  
  // Lists
  lists: {
    all: () => [...reportsQueryKeys.domain, 'lists'] as const,
    filtered: (filters?: ReportsFilters) => 
      [...reportsQueryKeys.lists.all(), 'filtered', filters] as const,
    byType: (type: string) => 
      [...reportsQueryKeys.lists.all(), 'type', type] as const,
  },
  
  // Details
  details: {
    all: () => [...reportsQueryKeys.domain, 'details'] as const,
    byId: (id: string) => 
      [...reportsQueryKeys.details.all(), 'id', id] as const,
  },
  
  // Templates
  templates: {
    all: () => [...reportsQueryKeys.domain, 'templates'] as const,
    byCategory: (category: string) => 
      [...reportsQueryKeys.templates.all(), 'category', category] as const,
  },
  
  // Generation
  generation: {
    all: () => [...reportsQueryKeys.domain, 'generation'] as const,
    status: (jobId: string) => 
      [...reportsQueryKeys.generation.all(), 'status', jobId] as const,
  },
} as const;

/**
 * Reports cache configuration for TanStack Query.
 *
 * Defines staleTime and gcTime (garbage collection time) for different
 * types of reports data to optimize performance and data freshness.
 *
 * @remarks
 * - staleTime: How long data is considered fresh before refetching
 * - gcTime: How long unused data stays in cache before cleanup
 * - Lists are refreshed more frequently than templates
 * - Generation status always fetches fresh data
 * - Longer cache times for rarely-changing data (templates)
 *
 * @example
 * ```typescript
 * // Used in query hooks
 * useQuery({
 *   queryKey: reportsQueryKeys.lists.all(),
 *   queryFn: fetchReports,
 *   staleTime: REPORTS_CACHE_CONFIG.lists.staleTime, // 5 minutes
 *   gcTime: REPORTS_CACHE_CONFIG.lists.gcTime, // 10 minutes
 * });
 * ```
 */
export const REPORTS_CACHE_CONFIG = {
  lists: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
  details: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },
  templates: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },
  generation: {
    staleTime: 0, // Always fresh
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
  mutations: {
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
} as const;

/**
 * Reports operation identifiers for mutation tracking.
 *
 * Used as mutation keys and operation identifiers for error handling
 * and analytics tracking.
 *
 * @example
 * ```typescript
 * useMutation({
 *   mutationKey: [REPORTS_OPERATIONS.GENERATE],
 *   mutationFn: generateReport,
 * });
 * ```
 */
export const REPORTS_OPERATIONS = {
  GENERATE: 'generate_report',
  DELETE: 'delete_report',
  EXPORT: 'export_report',
  SCHEDULE: 'schedule_report',
} as const;

/**
 * Filter criteria for querying reports lists.
 *
 * Supports filtering by report type, date range, generation status,
 * and creator. All filters are optional and can be combined.
 *
 * @property type - Report category (student, health, medication, etc.)
 * @property dateRange - Filter by report creation date range
 * @property dateRange.startDate - ISO 8601 date string for range start
 * @property dateRange.endDate - ISO 8601 date string for range end
 * @property status - Report generation status filter
 * @property createdBy - Filter by user ID who created the report
 *
 * @example
 * ```typescript
 * const filters: ReportsFilters = {
 *   type: 'incident',
 *   dateRange: {
 *     startDate: '2025-01-01',
 *     endDate: '2025-01-31'
 *   },
 *   status: 'generated'
 * };
 * ```
 */
export interface ReportsFilters {
  type?: 'student' | 'health' | 'medication' | 'inventory' | 'incident' | 'appointment';
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
  status?: 'generated' | 'pending' | 'failed';
  createdBy?: string;
}

/**
 * Request payload for generating a new report.
 *
 * Defines all parameters needed to generate a report from a template,
 * including output format and delivery options.
 *
 * @property templateId - Unique identifier of the report template to use
 * @property parameters - Template-specific parameters (filters, date ranges, etc.)
 * @property format - Output format for the generated report
 * @property deliveryMethod - How to deliver the report (download or email)
 * @property emailRecipients - Email addresses if deliveryMethod is 'email'
 *
 * @example
 * ```typescript
 * const request: ReportGenerationRequest = {
 *   templateId: 'incident-summary-monthly',
 *   parameters: {
 *     month: '2025-01',
 *     severity: ['high', 'critical'],
 *     includeResolutions: true
 *   },
 *   format: 'pdf',
 *   deliveryMethod: 'email',
 *   emailRecipients: ['admin@school.edu', 'principal@school.edu']
 * };
 * ```
 */
export interface ReportGenerationRequest {
  templateId: string;
  parameters: Record<string, any>;
  format: 'pdf' | 'excel' | 'csv';
  deliveryMethod?: 'download' | 'email';
  emailRecipients?: string[];
}
