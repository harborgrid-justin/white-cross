/**
 * @fileoverview Report Management Server Actions - Next.js v14+ Compatible
 * @module app/reports/actions
 *
 * HIPAA-compliant server actions for report generation and management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all report operations
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

// Custom cache tags for reports
export const REPORT_CACHE_TAGS = {
  REPORTS: 'reports',
  TEMPLATES: 'report-templates',
  SCHEDULES: 'report-schedules',
  EXPORTS: 'report-exports',
  ANALYTICS: 'report-analytics',
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

export interface Report {
  id: string;
  name: string;
  description: string;
  type: 'compliance' | 'health' | 'immunization' | 'incident' | 'medication' | 'student' | 'analytics' | 'custom';
  category: 'regulatory' | 'operational' | 'financial' | 'clinical' | 'administrative';
  status: 'draft' | 'generating' | 'completed' | 'failed' | 'scheduled';
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  parameters: Record<string, unknown>;
  filters: Record<string, unknown>;
  createdBy: string;
  createdByName: string;
  generatedAt?: string;
  completedAt?: string;
  downloadUrl?: string;
  fileSize?: number;
  recordCount?: number;
  isScheduled: boolean;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone: string;
    isActive: boolean;
    nextRun?: string;
  };
  recipients: string[];
  tags: string[];
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: Report['type'];
  category: Report['category'];
  defaultFormat: Report['format'];
  parameters: {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'select';
    label: string;
    required: boolean;
    defaultValue?: unknown;
    options?: { value: string; label: string }[];
  }[];
  filters: {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
    label: string;
    required: boolean;
    defaultValue?: unknown;
    options?: { value: string; label: string }[];
  }[];
  sqlQuery?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportData {
  name: string;
  description?: string;
  templateId?: string;
  type: Report['type'];
  category?: Report['category'];
  format?: Report['format'];
  parameters?: Record<string, unknown>;
  filters?: Record<string, unknown>;
  recipients?: string[];
  tags?: string[];
  isScheduled?: boolean;
  schedule?: Report['schedule'];
  expiresAt?: string;
}

export interface UpdateReportData {
  name?: string;
  description?: string;
  parameters?: Record<string, unknown>;
  filters?: Record<string, unknown>;
  recipients?: string[];
  tags?: string[];
  schedule?: Report['schedule'];
  expiresAt?: string;
}

export interface ReportFilters {
  type?: Report['type'];
  category?: Report['category'];
  status?: Report['status'];
  format?: Report['format'];
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  isScheduled?: boolean;
}

export interface ReportAnalytics {
  totalReports: number;
  completedReports: number;
  failedReports: number;
  scheduledReports: number;
  totalDownloads: number;
  averageGenerationTime: number;
  typeBreakdown: {
    type: Report['type'];
    count: number;
    percentage: number;
  }[];
  categoryBreakdown: {
    category: Report['category'];
    count: number;
    percentage: number;
  }[];
  formatBreakdown: {
    format: Report['format'];
    count: number;
    percentage: number;
  }[];
  monthlyTrends: {
    month: string;
    generated: number;
    completed: number;
    failed: number;
  }[];
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get report by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getReport = cache(async (id: string): Promise<Report | null> => {
  try {
    const response = await serverGet<ApiResponse<Report>>(
      `/api/reports/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`report-${id}`, REPORT_CACHE_TAGS.REPORTS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get report:', error);
    return null;
  }
});

/**
 * Get all reports with caching
 */
export const getReports = cache(async (filters?: ReportFilters): Promise<Report[]> => {
  try {
    const response = await serverGet<ApiResponse<Report[]>>(
      `/api/reports`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [REPORT_CACHE_TAGS.REPORTS, 'report-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get reports:', error);
    return [];
  }
});

/**
 * Get report templates with caching
 */
export const getReportTemplates = cache(async (): Promise<ReportTemplate[]> => {
  try {
    const response = await serverGet<ApiResponse<ReportTemplate[]>>(
      `/api/reports/templates`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [REPORT_CACHE_TAGS.TEMPLATES, 'report-template-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get report templates:', error);
    return [];
  }
});

/**
 * Get report analytics with caching
 */
export const getReportAnalytics = cache(async (filters?: Record<string, unknown>): Promise<ReportAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<ReportAnalytics>>(
      `/api/reports/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: [REPORT_CACHE_TAGS.ANALYTICS, 'report-stats'] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get report analytics:', error);
    return null;
  }
});

/**
 * Get scheduled reports with caching
 */
export const getScheduledReports = cache(async (): Promise<Report[]> => {
  try {
    const response = await serverGet<ApiResponse<Report[]>>(
      `/api/reports/scheduled`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_FREQUENT,
          tags: [REPORT_CACHE_TAGS.SCHEDULES, 'scheduled-reports'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get scheduled reports:', error);
    return [];
  }
});

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

    const response = await serverPost<ApiResponse<Report>>(
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
    revalidateTag(REPORT_CACHE_TAGS.REPORTS);
    revalidateTag('report-list');
    if (data.isScheduled) {
      revalidateTag(REPORT_CACHE_TAGS.SCHEDULES);
      revalidateTag('scheduled-reports');
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

    const response = await serverPut<ApiResponse<Report>>(
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
    revalidateTag(REPORT_CACHE_TAGS.REPORTS);
    revalidateTag(`report-${reportId}`);
    revalidateTag('report-list');
    if (data.schedule) {
      revalidateTag(REPORT_CACHE_TAGS.SCHEDULES);
      revalidateTag('scheduled-reports');
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

    const response = await serverPost<ApiResponse<Report>>(
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
    revalidateTag(REPORT_CACHE_TAGS.REPORTS);
    revalidateTag(`report-${reportId}`);
    revalidateTag('report-list');
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

    const response = await serverPost<ApiResponse<{ downloadUrl: string }>>(
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

    const response = await serverDelete<ApiResponse<void>>(
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
    revalidateTag(REPORT_CACHE_TAGS.REPORTS);
    revalidateTag(`report-${reportId}`);
    revalidateTag('report-list');
    revalidateTag(REPORT_CACHE_TAGS.SCHEDULES);
    revalidateTag('scheduled-reports');
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

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create report from form data
 * Form-friendly wrapper for createReportAction
 */
export async function createReportFromForm(formData: FormData): Promise<ActionResult<Report>> {
  // Parse parameters from form data
  const parametersJson = formData.get('parameters') as string;
  let parameters: Record<string, unknown> = {};
  
  try {
    parameters = JSON.parse(parametersJson || '{}');
  } catch {
    // Ignore parameter parsing errors
  }

  // Parse filters from form data
  const filtersJson = formData.get('filters') as string;
  let filters: Record<string, unknown> = {};
  
  try {
    filters = JSON.parse(filtersJson || '{}');
  } catch {
    // Ignore filter parsing errors
  }

  // Parse recipients from form data
  const recipientsJson = formData.get('recipients') as string;
  let recipients: string[] = [];
  
  try {
    recipients = JSON.parse(recipientsJson || '[]');
  } catch {
    // Ignore recipient parsing errors
  }

  // Parse tags from form data
  const tagsJson = formData.get('tags') as string;
  let tags: string[] = [];
  
  try {
    tags = JSON.parse(tagsJson || '[]');
  } catch {
    // Ignore tag parsing errors
  }

  // Parse schedule from form data
  const scheduleJson = formData.get('schedule') as string;
  let schedule: Report['schedule'] | undefined;
  
  try {
    schedule = JSON.parse(scheduleJson || 'null');
  } catch {
    // Ignore schedule parsing errors
  }

  const reportData: CreateReportData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || undefined,
    templateId: formData.get('templateId') as string || undefined,
    type: formData.get('type') as Report['type'],
    category: (formData.get('category') as Report['category']) || 'operational',
    format: (formData.get('format') as Report['format']) || 'pdf',
    parameters: Object.keys(parameters).length > 0 ? parameters : undefined,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    recipients: recipients.length > 0 ? recipients : undefined,
    tags: tags.length > 0 ? tags : undefined,
    isScheduled: formData.get('isScheduled') === 'true',
    schedule,
    expiresAt: formData.get('expiresAt') as string || undefined,
  };

  const result = await createReportAction(reportData);
  
  if (result.success && result.data) {
    revalidatePath('/reports', 'page');
  }
  
  return result;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if report exists
 */
export async function reportExists(reportId: string): Promise<boolean> {
  const report = await getReport(reportId);
  return report !== null;
}

/**
 * Get report count
 */
export const getReportCount = cache(async (filters?: ReportFilters): Promise<number> => {
  try {
    const reports = await getReports(filters);
    return reports.length;
  } catch {
    return 0;
  }
});

/**
 * Get report overview
 */
export async function getReportOverview(): Promise<{
  totalReports: number;
  completedReports: number;
  scheduledReports: number;
  failedReports: number;
  recentReports: number;
}> {
  try {
    const reports = await getReports();
    
    return {
      totalReports: reports.length,
      completedReports: reports.filter(r => r.status === 'completed').length,
      scheduledReports: reports.filter(r => r.isScheduled).length,
      failedReports: reports.filter(r => r.status === 'failed').length,
      recentReports: reports.filter(r => {
        const createdAt = new Date(r.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt >= weekAgo;
      }).length,
    };
  } catch {
    return {
      totalReports: 0,
      completedReports: 0,
      scheduledReports: 0,
      failedReports: 0,
      recentReports: 0,
    };
  }
}

/**
 * Clear report cache
 */
export async function clearReportCache(reportId?: string): Promise<void> {
  if (reportId) {
    revalidateTag(`report-${reportId}`);
  }
  
  // Clear all report caches
  Object.values(REPORT_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag);
  });

  // Clear list caches
  revalidateTag('report-list');
  revalidateTag('report-template-list');
  revalidateTag('scheduled-reports');
  revalidateTag('report-stats');

  // Clear paths
  revalidatePath('/reports', 'page');
  revalidatePath('/reports/templates', 'page');
  revalidatePath('/reports/scheduled', 'page');
  revalidatePath('/reports/analytics', 'page');
}
