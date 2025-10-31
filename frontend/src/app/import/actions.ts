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

/**
 * Clear import cache
 */
export async function clearImportCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
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

  // Clear paths
  revalidatePath('/import', 'page');
  revalidatePath('/import/jobs', 'page');
  revalidatePath('/import/templates', 'page');
  revalidatePath('/import/analytics', 'page');
}
