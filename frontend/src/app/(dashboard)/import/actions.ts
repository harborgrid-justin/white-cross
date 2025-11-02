/**
 * @fileoverview Import Management Server Actions - Next.js v14+ Compatible
 * @module app/import/actions
 *
 * HIPAA-compliant server actions for data import management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all import operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for imports
export const IMPORT_CACHE_TAGS = {
  JOBS: 'import-jobs',
  TEMPLATES: 'import-templates',
  VALIDATIONS: 'import-validations',
  MAPPINGS: 'import-mappings',
  HISTORY: 'import-history',
} as const;

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

export interface ImportJob {
  id: string;
  name: string;
  description: string;
  type: 'csv' | 'excel' | 'json' | 'xml' | 'text';
  format: 'students' | 'medications' | 'inventory' | 'staff' | 'immunizations' | 'incidents' | 'custom';
  status: 'pending' | 'validating' | 'processing' | 'completed' | 'failed' | 'cancelled';
  fileName: string;
  fileSize: number;
  fileUrl: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  processedRecords: number;
  importedRecords: number;
  skippedRecords: number;
  errorRecords: number;
  mapping: Record<string, string>;
  validationRules: ImportValidationRule[];
  errors: ImportError[];
  warnings: ImportWarning[];
  createdBy: string;
  createdByName: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  templateId?: string;
  isDryRun: boolean;
  rollbackSupported: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImportJobData {
  name: string;
  description?: string;
  type: ImportJob['type'];
  format: ImportJob['format'];
  fileName: string;
  fileSize: number;
  fileUrl: string;
  mapping?: Record<string, string>;
  validationRules?: ImportValidationRule[];
  templateId?: string;
  isDryRun?: boolean;
}

export interface UpdateImportJobData {
  name?: string;
  description?: string;
  mapping?: Record<string, string>;
  validationRules?: ImportValidationRule[];
  isDryRun?: boolean;
  status?: ImportJob['status'];
}

export interface ImportTemplate {
  id: string;
  name: string;
  description: string;
  type: ImportJob['type'];
  format: ImportJob['format'];
  defaultMapping: Record<string, string>;
  defaultValidationRules: ImportValidationRule[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImportTemplateData {
  name: string;
  description: string;
  type: ImportJob['type'];
  format: ImportJob['format'];
  defaultMapping?: Record<string, string>;
  defaultValidationRules?: ImportValidationRule[];
  isActive?: boolean;
}

export interface UpdateImportTemplateData {
  name?: string;
  description?: string;
  defaultMapping?: Record<string, string>;
  defaultValidationRules?: ImportValidationRule[];
  isActive?: boolean;
}

export interface ImportValidationRule {
  field: string;
  rule: 'required' | 'unique' | 'email' | 'phone' | 'date' | 'number' | 'length' | 'regex' | 'exists';
  value?: string | number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ImportError {
  row: number;
  field: string;
  value: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

export interface ImportWarning {
  row: number;
  field: string;
  value: string;
  message: string;
  code: string;
}

export interface ImportFilters {
  type?: ImportJob['type'];
  format?: ImportJob['format'];
  status?: ImportJob['status'];
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  isDryRun?: boolean;
}

export interface ImportAnalytics {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  totalRecordsImported: number;
  averageProcessingTime: number;
  successRate: number;
  typeBreakdown: {
    type: ImportJob['type'];
    count: number;
    percentage: number;
  }[];
  formatBreakdown: {
    format: ImportJob['format'];
    count: number;
    percentage: number;
  }[];
  recentActivity: {
    date: string;
    completed: number;
    failed: number;
    imported: number;
  }[];
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get import job by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getImportJob = cache(async (id: string): Promise<ImportJob | null> => {
  try {
    const response = await serverGet<ApiResponse<ImportJob>>(
      `/api/import/jobs/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`import-job-${id}`, IMPORT_CACHE_TAGS.JOBS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get import job:', error);
    return null;
  }
});

/**
 * Get all import jobs with caching
 */
export const getImportJobs = cache(async (filters?: ImportFilters): Promise<ImportJob[]> => {
  try {
    const response = await serverGet<ApiResponse<ImportJob[]>>(
      `/api/import/jobs`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [IMPORT_CACHE_TAGS.JOBS, 'import-job-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get import jobs:', error);
    return [];
  }
});

/**
 * Get import template by ID with caching
 */
export const getImportTemplate = cache(async (id: string): Promise<ImportTemplate | null> => {
  try {
    const response = await serverGet<ApiResponse<ImportTemplate>>(
      `/api/import/templates/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [`import-template-${id}`, IMPORT_CACHE_TAGS.TEMPLATES] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get import template:', error);
    return null;
  }
});

/**
 * Get all import templates with caching
 */
export const getImportTemplates = cache(async (format?: string): Promise<ImportTemplate[]> => {
  try {
    const params = format ? { format } : undefined;
    const response = await serverGet<ApiResponse<ImportTemplate[]>>(
      `/api/import/templates`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [IMPORT_CACHE_TAGS.TEMPLATES, 'import-template-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get import templates:', error);
    return [];
  }
});

/**
 * Get import analytics with caching
 */
export const getImportAnalytics = cache(async (filters?: Record<string, unknown>): Promise<ImportAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<ImportAnalytics>>(
      `/api/import/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: ['import-analytics', 'import-stats'] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get import analytics:', error);
    return null;
  }
});

// ==========================================
// IMPORT JOB OPERATIONS
// ==========================================

/**
 * Create a new import job
 * Includes audit logging and cache invalidation
 */
export async function createImportJobAction(data: CreateImportJobData): Promise<ActionResult<ImportJob>> {
  try {
    // Validate required fields
    if (!data.name || !data.type || !data.format || !data.fileName || !data.fileUrl) {
      return {
        success: false,
        error: 'Missing required fields: name, type, format, fileName, fileUrl'
      };
    }

    const response = await serverPost<ApiResponse<ImportJob>>(
      `/api/import/jobs`,
      data,
      {
        cache: 'no-store',
        next: { tags: [IMPORT_CACHE_TAGS.JOBS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create import job');
    }

    // AUDIT LOG - Import job creation
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'ImportJob',
      resourceId: response.data.id,
      details: `Created ${data.type} import job: ${data.name} for ${data.format} data`,
      success: true
    });

    // Cache invalidation
    revalidateTag(IMPORT_CACHE_TAGS.JOBS);
    revalidateTag('import-job-list');
    revalidatePath('/import', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Import job created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create import job';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'ImportJob',
      details: `Failed to create import job: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update import job
 * Includes audit logging and cache invalidation
 */
export async function updateImportJobAction(
  jobId: string,
  data: UpdateImportJobData
): Promise<ActionResult<ImportJob>> {
  try {
    if (!jobId) {
      return {
        success: false,
        error: 'Import job ID is required'
      };
    }

    const response = await serverPut<ApiResponse<ImportJob>>(
      `/api/import/jobs/${jobId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [IMPORT_CACHE_TAGS.JOBS, `import-job-${jobId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update import job');
    }

    // AUDIT LOG - Import job update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ImportJob',
      resourceId: jobId,
      details: 'Updated import job information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(IMPORT_CACHE_TAGS.JOBS);
    revalidateTag(`import-job-${jobId}`);
    revalidateTag('import-job-list');
    revalidatePath('/import', 'page');
    revalidatePath(`/import/jobs/${jobId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Import job updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update import job';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ImportJob',
      resourceId: jobId,
      details: `Failed to update import job: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Start import job processing
 * Includes audit logging and cache invalidation
 */
export async function startImportJobAction(jobId: string): Promise<ActionResult<ImportJob>> {
  try {
    if (!jobId) {
      return {
        success: false,
        error: 'Import job ID is required'
      };
    }

    const response = await serverPost<ApiResponse<ImportJob>>(
      `/api/import/jobs/${jobId}/start`,
      {},
      {
        cache: 'no-store',
        next: { tags: [IMPORT_CACHE_TAGS.JOBS, `import-job-${jobId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to start import job');
    }

    // AUDIT LOG - Import job start
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'ImportJob',
      resourceId: jobId,
      details: 'Started import job processing',
      success: true
    });

    // Cache invalidation
    revalidateTag(IMPORT_CACHE_TAGS.JOBS);
    revalidateTag(`import-job-${jobId}`);
    revalidateTag('import-job-list');
    revalidateTag('import-stats');
    revalidatePath('/import', 'page');
    revalidatePath(`/import/jobs/${jobId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Import job started successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to start import job';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'ImportJob',
      resourceId: jobId,
      details: `Failed to start import job: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Validate import job data
 * Includes audit logging and cache invalidation
 */
export async function validateImportJobAction(jobId: string): Promise<ActionResult<ImportJob>> {
  try {
    if (!jobId) {
      return {
        success: false,
        error: 'Import job ID is required'
      };
    }

    const response = await serverPost<ApiResponse<ImportJob>>(
      `/api/import/jobs/${jobId}/validate`,
      {},
      {
        cache: 'no-store',
        next: { tags: [IMPORT_CACHE_TAGS.JOBS, `import-job-${jobId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to validate import job');
    }

    // AUDIT LOG - Import job validation
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ImportJob',
      resourceId: jobId,
      details: 'Validated import job data',
      success: true
    });

    // Cache invalidation
    revalidateTag(IMPORT_CACHE_TAGS.JOBS);
    revalidateTag(`import-job-${jobId}`);
    revalidateTag('import-job-list');
    revalidatePath('/import', 'page');
    revalidatePath(`/import/jobs/${jobId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Import job validated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to validate import job';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ImportJob',
      resourceId: jobId,
      details: `Failed to validate import job: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// IMPORT TEMPLATE OPERATIONS
// ==========================================

/**
 * Create import template
 * Includes audit logging and cache invalidation
 */
export async function createImportTemplateAction(data: CreateImportTemplateData): Promise<ActionResult<ImportTemplate>> {
  try {
    // Validate required fields
    if (!data.name || !data.type || !data.format) {
      return {
        success: false,
        error: 'Missing required fields: name, type, format'
      };
    }

    const response = await serverPost<ApiResponse<ImportTemplate>>(
      `/api/import/templates`,
      data,
      {
        cache: 'no-store',
        next: { tags: [IMPORT_CACHE_TAGS.TEMPLATES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create import template');
    }

    // AUDIT LOG - Template creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'ImportTemplate',
      resourceId: response.data.id,
      details: `Created ${data.type} import template: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(IMPORT_CACHE_TAGS.TEMPLATES);
    revalidateTag('import-template-list');
    revalidatePath('/import/templates', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Import template created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create import template';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'ImportTemplate',
      details: `Failed to create import template: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create import job from form data
 * Form-friendly wrapper for createImportJobAction
 */
export async function createImportJobFromForm(formData: FormData): Promise<ActionResult<ImportJob>> {
  const mappingRaw = formData.get('mapping') as string;
  const mapping = mappingRaw 
    ? JSON.parse(mappingRaw)
    : undefined;

  const validationRulesRaw = formData.get('validationRules') as string;
  const validationRules = validationRulesRaw 
    ? JSON.parse(validationRulesRaw)
    : undefined;

  const jobData: CreateImportJobData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || undefined,
    type: formData.get('type') as ImportJob['type'],
    format: formData.get('format') as ImportJob['format'],
    fileName: formData.get('fileName') as string,
    fileSize: parseInt(formData.get('fileSize') as string),
    fileUrl: formData.get('fileUrl') as string,
    mapping,
    validationRules,
    templateId: formData.get('templateId') as string || undefined,
    isDryRun: formData.get('isDryRun') === 'true',
  };

  const result = await createImportJobAction(jobData);
  
  if (result.success && result.data) {
    revalidatePath('/import', 'page');
  }
  
  return result;
}

/**
 * Create import template from form data
 * Form-friendly wrapper for createImportTemplateAction
 */
export async function createImportTemplateFromForm(formData: FormData): Promise<ActionResult<ImportTemplate>> {
  const defaultMappingRaw = formData.get('defaultMapping') as string;
  const defaultMapping = defaultMappingRaw 
    ? JSON.parse(defaultMappingRaw)
    : undefined;

  const defaultValidationRulesRaw = formData.get('defaultValidationRules') as string;
  const defaultValidationRules = defaultValidationRulesRaw 
    ? JSON.parse(defaultValidationRulesRaw)
    : undefined;

  const templateData: CreateImportTemplateData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as ImportJob['type'],
    format: formData.get('format') as ImportJob['format'],
    defaultMapping,
    defaultValidationRules,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createImportTemplateAction(templateData);
  
  if (result.success && result.data) {
    revalidatePath('/import/templates', 'page');
  }
  
  return result;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if import job exists
 */
export async function importJobExists(jobId: string): Promise<boolean> {
  const job = await getImportJob(jobId);
  return job !== null;
}

/**
 * Check if import template exists
 */
export async function importTemplateExists(templateId: string): Promise<boolean> {
  const template = await getImportTemplate(templateId);
  return template !== null;
}

/**
 * Get import job count
 */
export const getImportJobCount = cache(async (filters?: ImportFilters): Promise<number> => {
  try {
    const jobs = await getImportJobs(filters);
    return jobs.length;
  } catch {
    return 0;
  }
});

/**
 * Get import template count
 */
export const getImportTemplateCount = cache(async (format?: string): Promise<number> => {
  try {
    const templates = await getImportTemplates(format);
    return templates.length;
  } catch {
    return 0;
  }
});

/**
 * Get import overview
 */
export async function getImportOverview(): Promise<{
  totalJobs: number;
  completedJobs: number;
  processingJobs: number;
  failedJobs: number;
  totalRecordsImported: number;
}> {
  try {
    const jobs = await getImportJobs();
    const analytics = await getImportAnalytics();
    
    return {
      totalJobs: jobs.length,
      completedJobs: jobs.filter(j => j.status === 'completed').length,
      processingJobs: jobs.filter(j => ['validating', 'processing'].includes(j.status)).length,
      failedJobs: jobs.filter(j => j.status === 'failed').length,
      totalRecordsImported: analytics?.totalRecordsImported || 0,
    };
  } catch {
    return {
      totalJobs: 0,
      completedJobs: 0,
      processingJobs: 0,
      failedJobs: 0,
      totalRecordsImported: 0,
    };
  }
}

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================

/**
 * Get comprehensive import statistics for dashboard
 * @returns Promise<ImportStats> Statistics object with import processing metrics
 */
export async function getImportStats(): Promise<{
  totalJobs: number;
  completedJobs: number;
  processingJobs: number;
  failedJobs: number;
  pendingJobs: number;
  totalRecordsProcessed: number;
  totalRecordsImported: number;
  totalRecordsRejected: number;
  averageProcessingTimeMs: number;
  successRate: number;
  importsByFormat: {
    students: number;
    medications: number;
    inventory: number;
    staff: number;
    immunizations: number;
    incidents: number;
    custom: number;
  };
}> {
  try {
    console.log('[Import] Loading import statistics');

    // Get import jobs data
    const jobs = await getImportJobs();

    // Calculate statistics based on actual ImportJob schema properties
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(j => j.status === 'completed').length;
    const processingJobs = jobs.filter(j => ['validating', 'processing'].includes(j.status)).length;
    const failedJobs = jobs.filter(j => j.status === 'failed').length;
    const pendingJobs = jobs.filter(j => j.status === 'pending').length;
    
    // Calculate record statistics using correct properties
    const totalRecordsProcessed = jobs.reduce((sum, j) => sum + (j.processedRecords || 0), 0);
    const totalRecordsImported = jobs.reduce((sum, j) => sum + (j.importedRecords || 0), 0);
    const totalRecordsRejected = jobs.reduce((sum, j) => sum + (j.errorRecords || 0), 0);
    
    // Calculate average processing time from completed jobs
    const completedJobsWithTime = jobs.filter(j => 
      j.status === 'completed' && j.startedAt && j.completedAt
    );
    
    let averageProcessingTimeMs = 0;
    if (completedJobsWithTime.length > 0) {
      const totalTimeMs = completedJobsWithTime.reduce((sum, j) => {
        const startTime = new Date(j.startedAt!).getTime();
        const endTime = new Date(j.completedAt!).getTime();
        return sum + (endTime - startTime);
      }, 0);
      averageProcessingTimeMs = totalTimeMs / completedJobsWithTime.length;
    }

    // Calculate success rate
    const successRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

    // Calculate imports by format (using the correct property)
    const importsByFormat = {
      students: jobs.filter(j => j.format === 'students').length,
      medications: jobs.filter(j => j.format === 'medications').length,
      inventory: jobs.filter(j => j.format === 'inventory').length,
      staff: jobs.filter(j => j.format === 'staff').length,
      immunizations: jobs.filter(j => j.format === 'immunizations').length,
      incidents: jobs.filter(j => j.format === 'incidents').length,
      custom: jobs.filter(j => j.format === 'custom').length,
    };

    const stats = {
      totalJobs,
      completedJobs,
      processingJobs,
      failedJobs,
      pendingJobs,
      totalRecordsProcessed,
      totalRecordsImported,
      totalRecordsRejected,
      averageProcessingTimeMs,
      successRate,
      importsByFormat,
    };

    console.log('[Import] Statistics calculated:', stats);

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'import_dashboard_stats',
      details: 'Retrieved import dashboard statistics'
    });

    return stats;
  } catch (error) {
    console.error('[Import] Error calculating stats:', error);
    return {
      totalJobs: 0,
      completedJobs: 0,
      processingJobs: 0,
      failedJobs: 0,
      pendingJobs: 0,
      totalRecordsProcessed: 0,
      totalRecordsImported: 0,
      totalRecordsRejected: 0,
      averageProcessingTimeMs: 0,
      successRate: 0,
      importsByFormat: {
        students: 0,
        medications: 0,
        inventory: 0,
        staff: 0,
        immunizations: 0,
        incidents: 0,
        custom: 0,
      },
    };
  }
}

/**
 * Get import dashboard data with recent jobs and processing insights
 * @returns Promise<ImportDashboardData> Dashboard data with import job analytics
 */
export async function getImportDashboardData(): Promise<{
  recentJobs: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    totalRecords: number;
    importedRecords: number;
    rejectedRecords: number;
    createdBy: string;
    timestamp: string;
    processingTime?: number;
  }>;
  failedJobs: Array<{
    id: string;
    name: string;
    type: string;
    errorMessage: string;
    failedAt: string;
    totalRecords: number;
    createdBy: string;
  }>;
  processingQueue: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    totalRecords: number;
    progress: number;
    estimatedCompletion?: string;
  }>;
  processingTrends: {
    thisWeek: { completed: number; failed: number; total: number; };
    lastWeek: { completed: number; failed: number; total: number; };
    thisMonth: { completed: number; failed: number; total: number; };
  };
  dataQuality: {
    validRecords: number;
    invalidRecords: number;
    duplicateRecords: number;
    qualityScore: number;
  };
  stats: {
    totalJobs: number;
    completedJobs: number;
    processingJobs: number;
    failedJobs: number;
    pendingJobs: number;
    totalRecordsProcessed: number;
    totalRecordsImported: number;
    totalRecordsRejected: number;
    averageProcessingTimeMs: number;
    successRate: number;
    importsByFormat: {
      students: number;
      medications: number;
      inventory: number;
      staff: number;
      immunizations: number;
      incidents: number;
      custom: number;
    };
  };
}> {
  try {
    // Get stats and import jobs data
    const stats = await getImportStats();
    const jobs = await getImportJobs();

    // Sort jobs by date descending and get recent jobs (last 10)
    const sortedJobs = jobs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const recentJobs = sortedJobs.map(job => ({
      id: job.id,
      name: job.name,
      type: job.type,
      status: job.status,
      totalRecords: job.totalRecords || 0,
      importedRecords: job.importedRecords || 0,
      rejectedRecords: job.errorRecords || 0, // Use correct field
      createdBy: job.createdByName || 'System', // Use correct field
      timestamp: job.createdAt,
      processingTime: job.startedAt && job.completedAt 
        ? new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()
        : undefined,
    }));

    // Get failed jobs
    const failedJobs = jobs
      .filter(j => j.status === 'failed')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(job => ({
        id: job.id,
        name: job.name,
        type: job.type,
        errorMessage: job.errorMessage || 'Unknown error',
        failedAt: job.updatedAt,
        totalRecords: job.totalRecords || 0,
        createdBy: job.createdByName || 'System', // Use correct field
      }));

    // Get processing queue - use correct status values
    const processingQueue = jobs
      .filter(j => ['pending', 'validating', 'processing'].includes(j.status))
      .slice(0, 5)
      .map(job => ({
        id: job.id,
        name: job.name,
        type: job.type,
        status: job.status,
        totalRecords: job.totalRecords || 0,
        progress: job.processedRecords > 0 && job.totalRecords > 0 
          ? Math.round((job.processedRecords / job.totalRecords) * 100)
          : 0,
        estimatedCompletion: job.startedAt 
          ? new Date(new Date(job.startedAt).getTime() + stats.averageProcessingTimeMs).toISOString()
          : undefined,
      }));

    // Calculate processing trends
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const processingTrends = {
      thisWeek: {
        completed: jobs.filter(j => 
          j.status === 'completed' && 
          new Date(j.completedAt || j.updatedAt) >= thisWeekStart
        ).length,
        failed: jobs.filter(j => 
          j.status === 'failed' && 
          new Date(j.updatedAt) >= thisWeekStart
        ).length,
        total: jobs.filter(j => 
          new Date(j.createdAt) >= thisWeekStart
        ).length,
      },
      lastWeek: {
        completed: jobs.filter(j => 
          j.status === 'completed' && 
          new Date(j.completedAt || j.updatedAt) >= lastWeekStart &&
          new Date(j.completedAt || j.updatedAt) < lastWeekEnd
        ).length,
        failed: jobs.filter(j => 
          j.status === 'failed' && 
          new Date(j.updatedAt) >= lastWeekStart &&
          new Date(j.updatedAt) < lastWeekEnd
        ).length,
        total: jobs.filter(j => 
          new Date(j.createdAt) >= lastWeekStart &&
          new Date(j.createdAt) < lastWeekEnd
        ).length,
      },
      thisMonth: {
        completed: jobs.filter(j => 
          j.status === 'completed' && 
          new Date(j.completedAt || j.updatedAt) >= thisMonthStart
        ).length,
        failed: jobs.filter(j => 
          j.status === 'failed' && 
          new Date(j.updatedAt) >= thisMonthStart
        ).length,
        total: jobs.filter(j => 
          new Date(j.createdAt) >= thisMonthStart
        ).length,
      },
    };

    // Calculate data quality metrics
    const validRecords = stats.totalRecordsImported;
    const invalidRecords = stats.totalRecordsRejected;
    const duplicateRecords = jobs.reduce((sum, j) => sum + (j.skippedRecords || 0), 0); // Use skippedRecords as proxy
    const qualityScore = stats.totalRecordsProcessed > 0 
      ? (validRecords / stats.totalRecordsProcessed) * 100 
      : 0;

    const dataQuality = {
      validRecords,
      invalidRecords,
      duplicateRecords,
      qualityScore,
    };

    const dashboardData = {
      recentJobs,
      failedJobs,
      processingQueue,
      processingTrends,
      dataQuality,
      stats,
    };

    console.log('[Import] Dashboard data prepared:', {
      recentCount: recentJobs.length,
      failedCount: failedJobs.length,
      queueCount: processingQueue.length,
    });

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'import_dashboard_data',
      details: 'Retrieved import dashboard data'
    });

    return dashboardData;
  } catch (error) {
    console.error('[Import] Error loading dashboard data:', error);
    
    // Get safe stats for fallback
    const safeStats = await getImportStats();
    
    return {
      recentJobs: [],
      failedJobs: [],
      processingQueue: [],
      processingTrends: {
        thisWeek: { completed: 0, failed: 0, total: 0 },
        lastWeek: { completed: 0, failed: 0, total: 0 },
        thisMonth: { completed: 0, failed: 0, total: 0 },
      },
      dataQuality: {
        validRecords: 0,
        invalidRecords: 0,
        duplicateRecords: 0,
        qualityScore: 0,
      },
      stats: safeStats,
    };
  }
}

/**
 * Clear import cache
 */
export async function clearImportCache(resourceType?: string, resourceId?: string): Promise<void> {
  try {
    if (resourceType && resourceId) {
      // Handle version compatibility for revalidateTag
      revalidateTag(`${resourceType}-${resourceId}`);
    }
    
    // Clear all import caches
    Object.values(IMPORT_CACHE_TAGS).forEach(tag => {
      revalidateTag(tag);
    });

    // Clear list caches
    revalidateTag('import-job-list');
    revalidateTag('import-template-list');
    revalidateTag('import-stats');
    revalidateTag('import-dashboard');
  } catch (error) {
    console.warn('[Import] Cache invalidation warning:', error);
  }

  // Clear paths - these typically work across versions
  revalidatePath('/import', 'page');
  revalidatePath('/import/jobs', 'page');
  revalidatePath('/import/templates', 'page');
  revalidatePath('/import/analytics', 'page');
}
