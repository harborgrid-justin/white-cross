/**
 * @fileoverview Report Generation Operations
 * @module lib/actions/reports/generation
 *
 * Report generation and download functionality with audit logging.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, NextApiClientError } from '@/lib/api/server';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ActionResult, Report } from './reports.types';
import { REPORT_CACHE_TAGS } from './reports.types';

// ==========================================
// GENERATION OPERATIONS
// ==========================================

/**
 * Generate report
 * Includes audit logging and cache invalidation
 */
export async function generateReportAction(reportId: string): Promise<ActionResult<Report>> {
  try {
    if (!reportId) {
      return {
        success: false,
        error: 'Report ID is required'
      };
    }

    const response = await serverPost<{ success: boolean; data: Report; message?: string }>(
      `/api/reports/${reportId}/generate`,
      {},
      {
        cache: 'no-store',
        next: { tags: [REPORT_CACHE_TAGS.REPORTS, `report-${reportId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to generate report');
    }

    // AUDIT LOG - Report generation
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Report',
      resourceId: reportId,
      details: `Generated report: ${response.data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(REPORT_CACHE_TAGS.REPORTS, 'default');
    revalidateTag(`report-${reportId}`, 'default');
    revalidateTag('report-list', 'default');
    revalidatePath('/reports', 'page');
    revalidatePath(`/reports/${reportId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Report generation started successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to generate report';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Report',
      resourceId: reportId,
      details: `Failed to generate report: ${errorMessage}`,
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
 * Download report
 * Includes audit logging and cache invalidation
 */
export async function downloadReportAction(reportId: string): Promise<ActionResult<{ downloadUrl: string }>> {
  try {
    if (!reportId) {
      return {
        success: false,
        error: 'Report ID is required'
      };
    }

    const response = await serverPost<{ success: boolean; data: { downloadUrl: string }; message?: string }>(
      `/api/reports/${reportId}/download`,
      {},
      {
        cache: 'no-store',
        next: { tags: [REPORT_CACHE_TAGS.REPORTS, `report-${reportId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to download report');
    }

    // AUDIT LOG - Report download
    await auditLog({
      action: AUDIT_ACTIONS.VIEW_DOCUMENT,
      resource: 'Report',
      resourceId: reportId,
      details: 'Downloaded report file',
      success: true
    });

    return {
      success: true,
      data: response.data,
      message: 'Report download initiated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to download report';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.VIEW_DOCUMENT,
      resource: 'Report',
      resourceId: reportId,
      details: `Failed to download report: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
