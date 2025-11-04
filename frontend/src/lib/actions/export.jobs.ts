/**
 * @fileoverview Export Job Operations
 * @module app/export/jobs
 *
 * HIPAA-compliant server actions for export job management.
 * Includes audit logging, cache invalidation, and error handling.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, serverPut, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import type { ApiResponse } from '@/types';
import type {
  ExportJob,
  CreateExportJobData,
  UpdateExportJobData,
  ActionResult
} from './export.types';
import { EXPORT_CACHE_TAGS } from './export.types';

// ==========================================
// CREATE EXPORT JOB
// ==========================================

/**
 * Create a new export job
 * Includes audit logging and cache invalidation
 */
export async function createExportJobAction(data: CreateExportJobData): Promise<ActionResult<ExportJob>> {
  try {
    // Validate required fields
    if (!data.name || !data.type || !data.format) {
      return {
        success: false,
        error: 'Missing required fields: name, type, format'
      };
    }

    const response = await serverPost<ApiResponse<ExportJob>>(
      `${API_ENDPOINTS.ADMIN.CONFIGURATIONS}/export/jobs`,
      data,
      {
        cache: 'no-store',
        next: { tags: [EXPORT_CACHE_TAGS.JOBS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create export job');
    }

    // AUDIT LOG - Export job creation
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'ExportJob',
      resourceId: response.data.id,
      details: `Created ${data.type} export job: ${data.name} for ${data.format}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(EXPORT_CACHE_TAGS.JOBS, 'default');
    revalidateTag('export-job-list', 'default');
    revalidatePath('/export', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Export job created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create export job';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'ExportJob',
      details: `Failed to create export job: ${errorMessage}`,
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
// UPDATE EXPORT JOB
// ==========================================

/**
 * Update export job
 * Includes audit logging and cache invalidation
 */
export async function updateExportJobAction(
  jobId: string,
  data: UpdateExportJobData
): Promise<ActionResult<ExportJob>> {
  try {
    if (!jobId) {
      return {
        success: false,
        error: 'Export job ID is required'
      };
    }

    const response = await serverPut<ApiResponse<ExportJob>>(
      `${API_ENDPOINTS.ADMIN.CONFIGURATIONS}/export/jobs/${jobId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [EXPORT_CACHE_TAGS.JOBS, `export-job-${jobId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update export job');
    }

    // AUDIT LOG - Export job update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ExportJob',
      resourceId: jobId,
      details: 'Updated export job information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(EXPORT_CACHE_TAGS.JOBS, 'default');
    revalidateTag(`export-job-${jobId}`, 'default');
    revalidateTag('export-job-list', 'default');
    revalidatePath('/export', 'page');
    revalidatePath(`/export/jobs/${jobId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Export job updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update export job';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ExportJob',
      resourceId: jobId,
      details: `Failed to update export job: ${errorMessage}`,
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
// START EXPORT JOB
// ==========================================

/**
 * Start export job processing
 * Includes audit logging and cache invalidation
 */
export async function startExportJobAction(jobId: string): Promise<ActionResult<ExportJob>> {
  try {
    if (!jobId) {
      return {
        success: false,
        error: 'Export job ID is required'
      };
    }

    const response = await serverPost<ApiResponse<ExportJob>>(
      `${API_ENDPOINTS.ADMIN.CONFIGURATIONS}/export/jobs/${jobId}/start`,
      {},
      {
        cache: 'no-store',
        next: { tags: [EXPORT_CACHE_TAGS.JOBS, `export-job-${jobId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to start export job');
    }

    // AUDIT LOG - Export job start
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'ExportJob',
      resourceId: jobId,
      details: 'Started export job processing',
      success: true
    });

    // Cache invalidation
    revalidateTag(EXPORT_CACHE_TAGS.JOBS, 'default');
    revalidateTag(`export-job-${jobId}`, 'default');
    revalidateTag('export-job-list', 'default');
    revalidateTag('export-stats', 'default');
    revalidatePath('/export', 'page');
    revalidatePath(`/export/jobs/${jobId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Export job started successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to start export job';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'ExportJob',
      resourceId: jobId,
      details: `Failed to start export job: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
