/**
 * @fileoverview Compliance Reports Actions - Next.js v16 App Router
 *
 * Server actions for compliance reporting and metrics.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import type {
  HIPAAReport,
  ComplianceMetrics,
  ComplianceAlert,
  ComplianceViolation,
} from '@/schemas/compliance/compliance.schemas';

import type {
  ActionResult,
  PaginatedResult,
  UIComplianceReport,
  UIReportTemplate
} from './compliance.types';
import {
  BACKEND_URL,
  getAuthToken,
  logHIPAAAuditEntry,
  getCurrentUserContext,
} from './compliance.cache';

// ============================================================================
// Compliance Reporting Actions
// ============================================================================

/**
 * Generate Compliance Report
 * Cache: 15 minutes for generated reports
 */
export async function generateComplianceReportAction(
  reportType: string,
  period: { start: string; end: string }
): Promise<ActionResult<HIPAAReport>> {
  'use cache';

  try {
    // Get compliance metrics for the period
    const metricsResult = await getComplianceMetricsAction(period);
    if (!metricsResult.success || !metricsResult.data) {
      throw new Error('Failed to retrieve compliance metrics');
    }

    const context = await getCurrentUserContext();

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify({
        reportType,
        period,
        generatedBy: context.userId,
        metrics: metricsResult.data,
      }),
      next: {
        revalidate: 900,
        tags: ['compliance-reports']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const report = await response.json() as HIPAAReport;

    // Revalidate report caches
    revalidateTag('compliance-reports', 'compliance');
    revalidatePath('/compliance/reports');

    // Log report generation
    await logHIPAAAuditEntry({
      userId: context.userId,
      action: 'RECORD_CREATE',
      resourceType: 'SYSTEM',
      details: {
        reportType,
        period,
        reportId: report.id
      }
    });

    return {
      success: true,
      data: report,
      message: 'Compliance report generated successfully',
    };
  } catch (error) {
    console.error('Generate compliance report error:', error);
    return {
      success: false,
      error: 'Failed to generate compliance report',
    };
  }
}

/**
 * Get Compliance Metrics
 * Cache: 10 minutes for metrics
 */
export async function getComplianceMetricsAction(
  period?: { start: string; end: string }
): Promise<ActionResult<ComplianceMetrics>> {
  'use cache';

  try {
    const params = period ? new URLSearchParams({
      start: period.start,
      end: period.end
    }) : '';

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/metrics${params ? `?${params}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 600,
        tags: ['compliance-metrics']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const metrics = await response.json() as ComplianceMetrics;

    return {
      success: true,
      data: metrics,
    };
  } catch (error) {
    console.error('Get compliance metrics error:', error);
    return {
      success: false,
      error: 'Failed to retrieve compliance metrics',
    };
  }
}

/**
 * Get Compliance Alerts
 * Cache: 2 minutes for alerts (need fresh data)
 */
export async function getComplianceAlertsAction(
  filters?: { severity?: string; status?: string }
): Promise<ActionResult<ComplianceAlert[]>> {
  'use cache';

  try {
    const params = filters ? new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== undefined)
    ) : '';

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/alerts${params ? `?${params}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 120,
        tags: ['compliance-alerts']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const alerts = await response.json() as ComplianceAlert[];

    return {
      success: true,
      data: alerts,
    };
  } catch (error) {
    console.error('Get compliance alerts error:', error);
    return {
      success: false,
      error: 'Failed to retrieve compliance alerts',
    };
  }
}

/**
 * Resolve Compliance Violation
 * No cache for violation resolution (always fresh)
 */
export async function resolveComplianceViolationAction(
  violationId: string,
  resolution: {
    resolutionNotes: string;
    remediationSteps: string[];
  }
): Promise<ActionResult<ComplianceViolation>> {
  try {
    const context = await getCurrentUserContext();

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/violations/${violationId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify({
        ...resolution,
        resolvedBy: context.userId,
        resolvedAt: new Date().toISOString(),
      }),
      next: {
        tags: ['compliance-alerts', 'compliance-violations']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const resolvedViolation = await response.json() as ComplianceViolation;

    // Revalidate related caches
    revalidateTag('compliance-alerts', 'compliance');
    revalidateTag('compliance-violations', 'compliance');
    revalidatePath('/compliance');

    // Log violation resolution
    await logHIPAAAuditEntry({
      userId: context.userId,
      action: 'RECORD_UPDATE',
      resourceType: 'SYSTEM',
      resourceId: violationId,
      details: {
        action: 'resolve_violation',
        resolutionNotes: resolution.resolutionNotes
      }
    });

    return {
      success: true,
      data: resolvedViolation,
      message: 'Compliance violation resolved successfully',
    };
  } catch (error) {
    console.error('Resolve compliance violation error:', error);
    return {
      success: false,
      error: 'Failed to resolve compliance violation',
    };
  }
}

/**
 * Get Compliance Reports and Templates
 * Cache: 10 minutes for reports list
 */
export async function getComplianceReportsAction(
  filters?: {
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<ActionResult<{
  reports: PaginatedResult<UIComplianceReport>;
  templates: UIReportTemplate[];
}>> {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    // Fetch reports
    const reportsResponse = await fetch(`${BACKEND_URL}/compliance/reports?${params}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID(),
        'X-Cache-Control': 'max-age=600'
      },
      next: {
        revalidate: 600,
        tags: ['compliance-reports']
      }
    });

    let reports: PaginatedResult<UIComplianceReport> = { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    if (reportsResponse.ok) {
      reports = await reportsResponse.json();
    }

    // Fetch report templates
    const templatesResponse = await fetch(`${BACKEND_URL}/compliance/reports/templates`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 3600, // 1 hour for templates
        tags: ['compliance-report-templates']
      }
    });

    let templates: UIReportTemplate[] = [];
    if (templatesResponse.ok) {
      templates = await templatesResponse.json();
    } else {
      // Fallback to default templates if API not available
      templates = [
        {
          id: 'hipaa-security',
          name: 'HIPAA Security Assessment',
          description: 'Comprehensive security risk assessment report',
          category: 'HIPAA',
          requiredParams: ['period']
        },
        {
          id: 'audit-trail',
          name: 'Audit Trail Report',
          description: 'Detailed audit log analysis and compliance verification',
          category: 'AUDIT',
          requiredParams: ['period']
        },
        {
          id: 'training-compliance',
          name: 'Training Compliance',
          description: 'Staff training completion and certification status',
          category: 'TRAINING',
          requiredParams: ['period']
        },
        {
          id: 'data-breach',
          name: 'Data Breach Analysis',
          description: 'Breach notification and incident response report',
          category: 'INCIDENT',
          requiredParams: ['period']
        }
      ];
    }

    return {
      success: true,
      data: {
        reports,
        templates,
      },
    };
  } catch (error) {
    console.error('Get compliance reports error:', error);
    return {
      success: false,
      error: 'Failed to retrieve compliance reports',
    };
  }
}