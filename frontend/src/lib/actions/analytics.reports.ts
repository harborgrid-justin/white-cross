/**
 * Analytics Reports Management
 *
 * Server actions for generating and managing analytics reports
 */

'use server';

import { revalidatePath } from 'next/cache';
import { serverPost, serverGet, serverPut, serverDelete } from '@/lib/server/fetch';
import {
  type ReportRequest,
  type CustomReportConfig,
  reportRequestSchema,
  customReportConfigSchema,
} from '@/lib/validations/report.schemas';
import { type ActionResponse } from './analytics.types';
import { handleAnalyticsError } from './analytics.utils';

/**
 * Generate analytics report
 */
export async function generateReport(data: ReportRequest): Promise<ActionResponse> {
  try {
    const validated = reportRequestSchema.parse(data);
    const response = await serverPost('/v1/analytics/reports/generate', validated);

    revalidatePath('/analytics');

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Generate report', error);
  }
}

/**
 * Create custom report
 */
export async function createCustomReport(data: CustomReportConfig): Promise<ActionResponse> {
  try {
    const validated = customReportConfigSchema.parse(data);
    const response = await serverPost('/v1/analytics/custom-reports', validated);

    revalidatePath('/analytics/custom-reports');

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Create custom report', error);
  }
}

/**
 * Update custom report
 */
export async function updateCustomReport(
  id: string,
  data: Partial<CustomReportConfig>
): Promise<ActionResponse> {
  try {
    const response = await serverPut(`/v1/analytics/custom-reports/${id}`, data);

    revalidatePath('/analytics/custom-reports');
    revalidatePath(`/analytics/custom-reports/${id}`);

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Update custom report', error);
  }
}

/**
 * Delete custom report
 */
export async function deleteCustomReport(id: string): Promise<ActionResponse> {
  try {
    await serverDelete(`/v1/analytics/custom-reports/${id}`);

    revalidatePath('/analytics/custom-reports');

    return {
      success: true,
    };
  } catch (error: any) {
    return handleAnalyticsError('Delete custom report', error);
  }
}

/**
 * Get custom reports
 */
export async function getCustomReports(): Promise<ActionResponse> {
  try {
    const response = await serverGet('/v1/analytics/custom-reports');

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Get custom reports', error);
  }
}

/**
 * Get custom report by ID
 */
export async function getCustomReportById(id: string): Promise<ActionResponse> {
  try {
    const response = await serverGet(`/v1/analytics/custom-reports/${id}`);

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Get custom report', error);
  }
}
