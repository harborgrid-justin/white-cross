/**
 * @fileoverview Analytics Server Actions - Next.js v14+ Compatible
 * @module app/analytics/actions
 *
 * HIPAA-compliant server actions for analytics and reporting with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all analytics operations
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

// Custom cache tags for analytics
export const ANALYTICS_CACHE_TAGS = {
  DASHBOARDS: 'analytics-dashboards',
  REPORTS: 'analytics-reports',
  METRICS: 'analytics-metrics',
  CHARTS: 'analytics-charts',
  EXPORTS: 'analytics-exports',
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

export interface AnalyticsMetric {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  lastUpdated: string;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'list';
  title: string;
  config: Record<string, unknown>;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  type: 'student' | 'medication' | 'incident' | 'compliance' | 'financial';
  filters: Record<string, unknown>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
  createdAt: string;
  lastRun?: string;
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  title: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  metadata: {
    xAxis?: string;
    yAxis?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

export interface ReportFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  studentIds?: string[];
  schoolIds?: string[];
  categories?: string[];
  status?: string[];
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get analytics metrics with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getAnalyticsMetrics = cache(async (filters?: Record<string, unknown>): Promise<AnalyticsMetric[]> => {
  try {
    const response = await serverGet<ApiResponse<AnalyticsMetric[]>>(
      API_ENDPOINTS.ANALYTICS.METRICS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: [ANALYTICS_CACHE_TAGS.METRICS, 'metrics-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get analytics metrics:', error);
    return [];
  }
});

/**
 * Get dashboard widgets with caching
 */
export const getDashboardWidgets = cache(async (dashboardId: string): Promise<DashboardWidget[]> => {
  try {
    const response = await serverGet<ApiResponse<DashboardWidget[]>>(
      API_ENDPOINTS.ANALYTICS.DASHBOARD_WIDGETS(dashboardId),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: [`dashboard-${dashboardId}`, ANALYTICS_CACHE_TAGS.DASHBOARDS] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get dashboard widgets:', error);
    return [];
  }
});

/**
 * Get analytics reports with caching
 */
export const getAnalyticsReports = cache(async (filters?: Record<string, unknown>): Promise<AnalyticsReport[]> => {
  try {
    const response = await serverGet<ApiResponse<AnalyticsReport[]>>(
      API_ENDPOINTS.ANALYTICS.REPORTS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: [ANALYTICS_CACHE_TAGS.REPORTS, 'reports-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get analytics reports:', error);
    return [];
  }
});

/**
 * Get chart data with caching
 */
export const getChartData = cache(async (chartId: string, filters?: Record<string, unknown>): Promise<ChartData | null> => {
  try {
    const response = await serverGet<ApiResponse<ChartData>>(
      API_ENDPOINTS.ANALYTICS.CHART_DATA(chartId),
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: [`chart-${chartId}`, ANALYTICS_CACHE_TAGS.CHARTS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get chart data:', error);
    return null;
  }
});

// ==========================================
// ANALYTICS OPERATIONS
// ==========================================

/**
 * Generate analytics report
 * Includes HIPAA audit logging and cache invalidation
 */
export async function generateReportAction(
  reportType: string,
  filters: ReportFilters
): Promise<ActionResult<{ reportId: string; downloadUrl: string }>> {
  try {
    if (!reportType) {
      return {
        success: false,
        error: 'Report type is required'
      };
    }

    const reportData = {
      type: reportType,
      filters,
      generatedAt: new Date().toISOString()
    };

    const response = await serverPost<ApiResponse<{ reportId: string; downloadUrl: string }>>(
      API_ENDPOINTS.ANALYTICS.CUSTOM_REPORT,
      reportData,
      {
        cache: 'no-store',
        next: { tags: [ANALYTICS_CACHE_TAGS.REPORTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to generate report');
    }

    // HIPAA AUDIT LOG - Report generation
    await auditLog({
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'AnalyticsReport',
      resourceId: response.data.reportId,
      details: `Generated ${reportType} report`,
      success: true
    });

    // Cache invalidation
    revalidateTag(ANALYTICS_CACHE_TAGS.REPORTS, 'default');
    revalidateTag('reports-list', 'default');
    revalidatePath('/analytics/reports', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Report generated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to generate report';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'AnalyticsReport',
      details: `Failed to generate ${reportType} report: ${errorMessage}`,
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
 * Save dashboard widget configuration
 * Includes audit logging and cache invalidation
 */
export async function saveDashboardWidgetAction(
  dashboardId: string,
  widget: Omit<DashboardWidget, 'id'>
): Promise<ActionResult<DashboardWidget>> {
  try {
    if (!dashboardId) {
      return {
        success: false,
        error: 'Dashboard ID is required'
      };
    }

    const widgetData = {
      ...widget,
      id: generateId()
    };

    const response = await serverPost<ApiResponse<DashboardWidget>>(
      API_ENDPOINTS.ANALYTICS.DASHBOARD,
      { ...widgetData, dashboardId },
      {
        cache: 'no-store',
        next: { tags: [ANALYTICS_CACHE_TAGS.DASHBOARDS, `dashboard-${dashboardId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to save dashboard widget');
    }

    // AUDIT LOG - Dashboard customization
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_CONFIGURATION,
      resource: 'Dashboard',
      resourceId: dashboardId,
      details: `Added widget: ${widget.title}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(ANALYTICS_CACHE_TAGS.DASHBOARDS, 'default');
    revalidateTag(`dashboard-${dashboardId}`, 'default');
    revalidatePath('/analytics/dashboard', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Dashboard widget saved successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to save dashboard widget';

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_CONFIGURATION,
      resource: 'Dashboard',
      resourceId: dashboardId,
      details: `Failed to save widget: ${errorMessage}`,
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
 * Create scheduled report
 * Includes audit logging and cache invalidation
 */
export async function createScheduledReportAction(
  reportData: Omit<AnalyticsReport, 'id' | 'createdAt'>
): Promise<ActionResult<AnalyticsReport>> {
  try {
    if (!reportData.name || !reportData.type) {
      return {
        success: false,
        error: 'Report name and type are required'
      };
    }

    const response = await serverPost<ApiResponse<AnalyticsReport>>(
      API_ENDPOINTS.ANALYTICS.CUSTOM_REPORT,
      { ...reportData, scheduled: true },
      {
        cache: 'no-store',
        next: { tags: [ANALYTICS_CACHE_TAGS.REPORTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create scheduled report');
    }

    // AUDIT LOG - Scheduled report creation
    await auditLog({
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'ScheduledReport',
      resourceId: response.data.id,
      details: `Created scheduled report: ${reportData.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(ANALYTICS_CACHE_TAGS.REPORTS, 'default');
    revalidateTag('reports-list', 'default');
    revalidatePath('/analytics/reports', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Scheduled report created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create scheduled report';

    await auditLog({
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'ScheduledReport',
      details: `Failed to create scheduled report: ${errorMessage}`,
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
 * Export analytics data
 * Includes audit logging and cache invalidation
 */
export async function exportAnalyticsDataAction(
  exportType: 'csv' | 'excel' | 'pdf',
  dataType: string,
  filters?: Record<string, unknown>
): Promise<ActionResult<{ exportId: string; downloadUrl: string }>> {
  try {
    if (!exportType || !dataType) {
      return {
        success: false,
        error: 'Export type and data type are required'
      };
    }

    const exportData = {
      type: exportType,
      dataType,
      filters,
      exportedAt: new Date().toISOString()
    };

    const response = await serverPost<ApiResponse<{ exportId: string; downloadUrl: string }>>(
      API_ENDPOINTS.ANALYTICS.CUSTOM_REPORT,
      { ...exportData, export: true },
      {
        cache: 'no-store',
        next: { tags: [ANALYTICS_CACHE_TAGS.EXPORTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to export analytics data');
    }

    // HIPAA AUDIT LOG - Data export
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'AnalyticsData',
      resourceId: response.data.exportId,
      details: `Exported ${dataType} data as ${exportType}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(ANALYTICS_CACHE_TAGS.EXPORTS, 'default');
    revalidatePath('/analytics', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Analytics data exported successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to export analytics data';

    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'AnalyticsData',
      details: `Failed to export ${dataType} data: ${errorMessage}`,
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
 * Generate report from form data
 * Form-friendly wrapper for generateReportAction
 */
export async function generateReportFromForm(formData: FormData): Promise<ActionResult<{ reportId: string; downloadUrl: string }>> {
  const reportType = formData.get('reportType') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const studentIds = formData.getAll('studentIds') as string[];
  const schoolIds = formData.getAll('schoolIds') as string[];

  const filters: ReportFilters = {
    dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
    studentIds: studentIds.length > 0 ? studentIds : undefined,
    schoolIds: schoolIds.length > 0 ? schoolIds : undefined,
  };

  const result = await generateReportAction(reportType, filters);
  
  if (result.success && result.data) {
    revalidatePath('/analytics/reports', 'page');
  }
  
  return result;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary(): Promise<{
  totalStudents: number;
  totalMedications: number;
  totalIncidents: number;
  complianceRate: number;
}> {
  try {
    const metrics = await getAnalyticsMetrics();
    
    return {
      totalStudents: metrics.find(m => m.name === 'total_students')?.value || 0,
      totalMedications: metrics.find(m => m.name === 'total_medications')?.value || 0,
      totalIncidents: metrics.find(m => m.name === 'total_incidents')?.value || 0,
      complianceRate: metrics.find(m => m.name === 'compliance_rate')?.value || 0,
    };
  } catch {
    return {
      totalStudents: 0,
      totalMedications: 0,
      totalIncidents: 0,
      complianceRate: 0,
    };
  }
}

/**
 * Clear analytics cache
 */
export async function clearAnalyticsCache(): Promise<void> {
  Object.values(ANALYTICS_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });
  
  revalidateTag('metrics-list', 'default');
  revalidateTag('reports-list', 'default');
  revalidatePath('/analytics', 'page');
}
