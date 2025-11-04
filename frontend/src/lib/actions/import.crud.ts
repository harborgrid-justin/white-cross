/**
 * @fileoverview Import CRUD Operations
 * @module lib/actions/import.crud
 *
 * Create, Read, Update, and Delete operations for import jobs and templates.
 * Includes audit logging and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, serverPut, NextApiClientError } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types/api';
import type {
  ActionResult,
  ImportJob,
  CreateImportJobData,
  UpdateImportJobData,
  ImportTemplate,
  CreateImportTemplateData,
} from './import.types';

// Cache
import { IMPORT_CACHE_TAGS } from './import.cache';

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
    revalidateTag(IMPORT_CACHE_TAGS.JOBS, 'default');
    revalidateTag('import-job-list', 'default');
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
    revalidateTag(IMPORT_CACHE_TAGS.JOBS, 'default');
    revalidateTag(`import-job-${jobId}`, 'default');
    revalidateTag('import-job-list', 'default');
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
    revalidateTag(IMPORT_CACHE_TAGS.JOBS, 'default');
    revalidateTag(`import-job-${jobId}`, 'default');
    revalidateTag('import-job-list', 'default');
    revalidateTag('import-stats', 'default');
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
    revalidateTag(IMPORT_CACHE_TAGS.JOBS, 'default');
    revalidateTag(`import-job-${jobId}`, 'default');
    revalidateTag('import-job-list', 'default');
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
    revalidateTag(IMPORT_CACHE_TAGS.TEMPLATES, 'default');
    revalidateTag('import-template-list', 'default');
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
