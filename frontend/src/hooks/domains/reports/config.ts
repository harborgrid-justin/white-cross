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
 * Reports query keys for TanStack Query
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
 * Reports cache configuration
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
 * Reports operation constants
 */
export const REPORTS_OPERATIONS = {
  GENERATE: 'generate_report',
  DELETE: 'delete_report',
  EXPORT: 'export_report',
  SCHEDULE: 'schedule_report',
} as const;

/**
 * Local type definitions
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

export interface ReportGenerationRequest {
  templateId: string;
  parameters: Record<string, any>;
  format: 'pdf' | 'excel' | 'csv';
  deliveryMethod?: 'download' | 'email';
  emailRecipients?: string[];
}
