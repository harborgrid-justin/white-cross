/**
 * Analytics Export and Scheduling
 *
 * Server actions for exporting reports and managing scheduled reports
 */

'use server';

import { revalidatePath } from 'next/cache';
import { serverPost, serverPut, serverDelete } from '@/lib/api/nextjs-client';
import {
  type ExportRequest,
  type ScheduledReport,
  exportRequestSchema,
  scheduledReportSchema,
} from '@/lib/validations/report.schemas';
import { type ActionResponse, type ExportResponse } from './analytics.types';
import { handleAnalyticsError } from './analytics.utils';

/**
 * Export report
 */
export async function exportReport(data: ExportRequest): Promise<ExportResponse> {
  try {
    const validated = exportRequestSchema.parse(data);

    // Note: Blob responses need special handling in server actions
    const response = await serverPost('/v1/analytics/export', validated, {
      // For file downloads, you may need to handle this differently
      // This is a placeholder - actual implementation may vary
    });

    return {
      success: true,
      data: response,
      filename: `report.${validated.format}`,
    };
  } catch (error: any) {
    return handleAnalyticsError('Export report', error);
  }
}

/**
 * Create scheduled report
 */
export async function createScheduledReport(data: ScheduledReport): Promise<ActionResponse> {
  try {
    const validated = scheduledReportSchema.parse(data);
    const response = await serverPost('/v1/analytics/scheduled-reports', validated);

    revalidatePath('/analytics');

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Create scheduled report', error);
  }
}

/**
 * Update scheduled report
 */
export async function updateScheduledReport(
  id: string,
  data: Partial<ScheduledReport>
): Promise<ActionResponse> {
  try {
    const response = await serverPut(`/v1/analytics/scheduled-reports/${id}`, data);

    revalidatePath('/analytics');

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Update scheduled report', error);
  }
}

/**
 * Delete scheduled report
 */
export async function deleteScheduledReport(id: string): Promise<ActionResponse> {
  try {
    await serverDelete(`/v1/analytics/scheduled-reports/${id}`);

    revalidatePath('/analytics');

    return {
      success: true,
    };
  } catch (error: any) {
    return handleAnalyticsError('Delete scheduled report', error);
  }
}
