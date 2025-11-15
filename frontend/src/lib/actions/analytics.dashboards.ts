/**
 * Analytics Dashboards Management
 *
 * Server actions for managing dashboard configurations and metrics
 */

'use server';

import { revalidatePath } from 'next/cache';
import { serverPost, serverGet } from '@/lib/api/nextjs-client';
import {
  type DashboardConfig,
  dashboardConfigSchema,
} from '@/lib/validations/report.schemas';
import { type ActionResponse } from './analytics.types';
import { handleAnalyticsError } from './analytics.utils';

/**
 * Save dashboard configuration
 */
export async function saveDashboardConfig(data: DashboardConfig): Promise<ActionResponse> {
  try {
    const validated = dashboardConfigSchema.parse(data);
    const response = await serverPost('/v1/analytics/dashboards', validated);

    revalidatePath('/analytics');

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Save dashboard config', error);
  }
}

/**
 * Get dashboard configurations
 */
export async function getDashboardConfigs(): Promise<ActionResponse> {
  try {
    const response = await serverGet('/v1/analytics/dashboards');

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Get dashboard configs', error);
  }
}

/**
 * Get dashboard metrics summary
 */
export async function getDashboardMetrics(): Promise<ActionResponse> {
  try {
    const response = await serverGet('/v1/analytics/dashboard/metrics');

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return handleAnalyticsError('Get dashboard metrics', error);
  }
}
