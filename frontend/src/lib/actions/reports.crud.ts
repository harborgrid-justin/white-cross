/**
 * @fileoverview Report CRUD Operations
 * @module lib/actions/reports/crud
 *
 * Create, Read, Update, Delete operations for reports with HIPAA audit logging
 * and comprehensive cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type {
  ActionResult,
  Report,
  CreateReportData,
  UpdateReportData,
} from './reports.types';
import { REPORT_CACHE_TAGS } from './reports.types';

// ==========================================
// REPORT OPERATIONS
// ==========================================

/**
 * Create a new report
 * Includes audit logging and cache invalidation
 */
export async function createReportAction(data: CreateReportData): Promise<ActionResult<Report>> {
  try {
    // Validate required fields
    if (!data.name || !data.type) {
      return {
        success: false,
        error: 'Missing required fields: name, type'
      };
    }

    const response = await serverPost<{ success: boolean; data: Report; message?: string }>(
      `/api/reports`,
      data,
      {
        cache: 'no-store',
        next: { tags: [REPORT_CACHE_TAGS.REPORTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create report');
    }

    // AUDIT LOG - Report creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Report',
      resourceId: response.data.id,
      details: `Created report: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(REPORT_CACHE_TAGS.REPORTS, 'default');
    revalidateTag('report-list', 'default');
    if (data.isScheduled) {
      revalidateTag(REPORT_CACHE_TAGS.SCHEDULES, 'default');
      revalidateTag('scheduled-reports', 'default');
    }
    revalidatePath('/reports', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Report created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create report';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Report',
      details: `Failed to create report: ${errorMessage}`,
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
 * Update report
 * Includes audit logging and cache invalidation
 */
export async function updateReportAction(
  reportId: string,
  data: UpdateReportData
): Promise<ActionResult<Report>> {
  try {
    if (!reportId) {
      return {
        success: false,
        error: 'Report ID is required'
      };
    }

    const response = await serverPut<{ success: boolean; data: Report; message?: string }>(
      `/api/reports/${reportId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [REPORT_CACHE_TAGS.REPORTS, `report-${reportId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update report');
    }

    // AUDIT LOG - Report update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Report',
      resourceId: reportId,
      details: `Updated report: ${response.data.name}`,
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(REPORT_CACHE_TAGS.REPORTS, 'default');
    revalidateTag(`report-${reportId}`, 'default');
    revalidateTag('report-list', 'default');
    if (data.schedule) {
      revalidateTag(REPORT_CACHE_TAGS.SCHEDULES, 'default');
      revalidateTag('scheduled-reports', 'default');
    }
    revalidatePath('/reports', 'page');
    revalidatePath(`/reports/${reportId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Report updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update report';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Report',
      resourceId: reportId,
      details: `Failed to update report: ${errorMessage}`,
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
 * Delete report
 * Includes audit logging and cache invalidation
 */
export async function deleteReportAction(reportId: string): Promise<ActionResult<void>> {
  try {
    if (!reportId) {
      return {
        success: false,
        error: 'Report ID is required'
      };
    }

    const response = await serverDelete<{ success: boolean; message?: string }>(
      `/api/reports/${reportId}`,
      {
        cache: 'no-store',
        next: { tags: [REPORT_CACHE_TAGS.REPORTS, `report-${reportId}`] }
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete report');
    }

    // AUDIT LOG - Report deletion
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Report',
      resourceId: reportId,
      details: 'Deleted report',
      success: true
    });

    // Cache invalidation
    revalidateTag(REPORT_CACHE_TAGS.REPORTS, 'default');
    revalidateTag(`report-${reportId}`, 'default');
    revalidateTag('report-list', 'default');
    revalidateTag(REPORT_CACHE_TAGS.SCHEDULES, 'default');
    revalidateTag('scheduled-reports', 'default');
    revalidatePath('/reports', 'page');

    return {
      success: true,
      message: 'Report deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete report';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Report',
      resourceId: reportId,
      details: `Failed to delete report: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
