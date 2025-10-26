/**
 * Analytics Server Actions
 */

'use server';

import { revalidatePath } from 'next/cache';
import apiClient from '@/lib/api-client';
import {
  type ReportRequest,
  type CustomReportConfig,
  type ExportRequest,
  type ScheduledReport,
  type DashboardConfig,
  reportRequestSchema,
  customReportConfigSchema,
  exportRequestSchema,
  scheduledReportSchema,
  dashboardConfigSchema,
} from '@/lib/validations/report.schemas';

/**
 * Generate analytics report
 */
export async function generateReport(data: ReportRequest) {
  try {
    const validated = reportRequestSchema.parse(data);

    const response = await apiClient.post('/v1/analytics/reports/generate', validated);

    revalidatePath('/analytics');

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Generate report error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to generate report',
    };
  }
}

/**
 * Get health metrics
 */
export async function getHealthMetrics(filters: {
  dateRange: { start: Date; end: Date };
  studentIds?: string[];
  metricTypes?: string[];
}) {
  try {
    const response = await apiClient.get('/v1/analytics/health-metrics', {
      params: filters,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Get health metrics error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch health metrics',
    };
  }
}

/**
 * Get medication compliance data
 */
export async function getMedicationCompliance(filters: {
  dateRange: { start: Date; end: Date };
  medicationIds?: string[];
  studentIds?: string[];
}) {
  try {
    const response = await apiClient.get('/v1/analytics/medication-compliance', {
      params: filters,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Get medication compliance error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch medication compliance',
    };
  }
}

/**
 * Get appointment analytics
 */
export async function getAppointmentAnalytics(filters: {
  dateRange: { start: Date; end: Date };
  appointmentTypes?: string[];
  statuses?: string[];
}) {
  try {
    const response = await apiClient.get('/v1/analytics/appointments', {
      params: filters,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Get appointment analytics error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch appointment analytics',
    };
  }
}

/**
 * Get incident trends
 */
export async function getIncidentTrends(filters: {
  dateRange: { start: Date; end: Date };
  incidentTypes?: string[];
  severities?: string[];
}) {
  try {
    const response = await apiClient.get('/v1/analytics/incident-trends', {
      params: filters,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Get incident trends error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to fetch incident trends',
    };
  }
}

/**
 * Get inventory analytics
 */
export async function getInventoryAnalytics(filters?: {
  categories?: string[];
  lowStockOnly?: boolean;
  expiringOnly?: boolean;
  daysUntilExpiration?: number;
}) {
  try {
    const response = await apiClient.get('/v1/analytics/inventory', {
      params: filters,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Get inventory analytics error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to fetch inventory analytics',
    };
  }
}

/**
 * Create custom report
 */
export async function createCustomReport(data: CustomReportConfig) {
  try {
    const validated = customReportConfigSchema.parse(data);

    const response = await apiClient.post('/v1/analytics/custom-reports', validated);

    revalidatePath('/analytics/custom-reports');

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Create custom report error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to create custom report',
    };
  }
}

/**
 * Update custom report
 */
export async function updateCustomReport(id: string, data: Partial<CustomReportConfig>) {
  try {
    const response = await apiClient.put(`/v1/analytics/custom-reports/${id}`, data);

    revalidatePath('/analytics/custom-reports');
    revalidatePath(`/analytics/custom-reports/${id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Update custom report error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to update custom report',
    };
  }
}

/**
 * Delete custom report
 */
export async function deleteCustomReport(id: string) {
  try {
    await apiClient.delete(`/v1/analytics/custom-reports/${id}`);

    revalidatePath('/analytics/custom-reports');

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Delete custom report error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to delete custom report',
    };
  }
}

/**
 * Get custom reports
 */
export async function getCustomReports() {
  try {
    const response = await apiClient.get('/v1/analytics/custom-reports');

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Get custom reports error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to fetch custom reports',
    };
  }
}

/**
 * Get custom report by ID
 */
export async function getCustomReportById(id: string) {
  try {
    const response = await apiClient.get(`/v1/analytics/custom-reports/${id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Get custom report error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch custom report',
    };
  }
}

/**
 * Export report
 */
export async function exportReport(data: ExportRequest) {
  try {
    const validated = exportRequestSchema.parse(data);

    const response = await apiClient.post('/v1/analytics/export', validated, {
      responseType: 'blob',
    });

    return {
      success: true,
      data: response.data,
      filename:
        response.headers['content-disposition']?.split('filename=')[1] ||
        `report.${validated.format}`,
    };
  } catch (error: any) {
    console.error('Export report error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to export report',
    };
  }
}

/**
 * Create scheduled report
 */
export async function createScheduledReport(data: ScheduledReport) {
  try {
    const validated = scheduledReportSchema.parse(data);

    const response = await apiClient.post('/v1/analytics/scheduled-reports', validated);

    revalidatePath('/analytics');

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Create scheduled report error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to create scheduled report',
    };
  }
}

/**
 * Update scheduled report
 */
export async function updateScheduledReport(id: string, data: Partial<ScheduledReport>) {
  try {
    const response = await apiClient.put(`/v1/analytics/scheduled-reports/${id}`, data);

    revalidatePath('/analytics');

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Update scheduled report error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to update scheduled report',
    };
  }
}

/**
 * Delete scheduled report
 */
export async function deleteScheduledReport(id: string) {
  try {
    await apiClient.delete(`/v1/analytics/scheduled-reports/${id}`);

    revalidatePath('/analytics');

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Delete scheduled report error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to delete scheduled report',
    };
  }
}

/**
 * Save dashboard configuration
 */
export async function saveDashboardConfig(data: DashboardConfig) {
  try {
    const validated = dashboardConfigSchema.parse(data);

    const response = await apiClient.post('/v1/analytics/dashboards', validated);

    revalidatePath('/analytics');

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Save dashboard config error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to save dashboard config',
    };
  }
}

/**
 * Get dashboard configurations
 */
export async function getDashboardConfigs() {
  try {
    const response = await apiClient.get('/v1/analytics/dashboards');

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Get dashboard configs error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to fetch dashboard configs',
    };
  }
}

/**
 * Get dashboard metrics summary
 */
export async function getDashboardMetrics() {
  try {
    const response = await apiClient.get('/v1/analytics/dashboard/metrics');

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Get dashboard metrics error:', error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || 'Failed to fetch dashboard metrics',
    };
  }
}
