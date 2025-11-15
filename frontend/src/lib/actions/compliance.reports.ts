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
  COMPLIANCE_ENDPOINTS,
} from '@/constants/api/admin';
import {
  serverPost,
  serverGet,
} from '@/lib/api/server';
import {
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
  try {
    // Get compliance metrics for the period
    const metricsResult = await getComplianceMetricsAction(period);
    if (!metricsResult.success || !metricsResult.data) {
      throw new Error('Failed to retrieve compliance metrics');
    }

    const context = await getCurrentUserContext();

    const report = await serverPost<HIPAAReport>(
      `${COMPLIANCE_ENDPOINTS.REPORTS}/generate`,
      {
        reportType,
        period,
        generatedBy: context.userId,
        metrics: metricsResult.data,
      },
      {
        next: {
          revalidate: 900,
          tags: ['compliance-reports']
        }
      }
    );

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
  try {
    const params = period ? { start: period.start, end: period.end } : undefined;

    const metrics = await serverGet<ComplianceMetrics>(
      COMPLIANCE_ENDPOINTS.METRICS,
      params,
      {
        next: {
          revalidate: 600,
          tags: ['compliance-metrics']
        }
      }
    );

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
  try {
    const params = filters ? Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined)
    ) : undefined;

    const alerts = await serverGet<ComplianceAlert[]>(
      COMPLIANCE_ENDPOINTS.ALERTS,
      params,
      {
        next: {
          revalidate: 120,
          tags: ['compliance-alerts']
        }
      }
    );

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

    const resolvedViolation = await serverPost<ComplianceViolation>(
      `${COMPLIANCE_ENDPOINTS.VIOLATIONS}/${violationId}/resolve`,
      {
        ...resolution,
        resolvedBy: context.userId,
        resolvedAt: new Date().toISOString(),
      },
      {
        next: {
          tags: ['compliance-alerts', 'compliance-violations']
        }
      }
    );

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
    const params = filters ? Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined && value !== null)
    ) : undefined;

    // Fetch reports
    const reports = await serverGet<PaginatedResult<UIComplianceReport>>(
      COMPLIANCE_ENDPOINTS.REPORTS,
      params,
      {
        next: {
          revalidate: 600,
          tags: ['compliance-reports']
        }
      }
    );

    // Fetch report templates
    let templates: UIReportTemplate[] = [];
    try {
      templates = await serverGet<UIReportTemplate[]>(
        `${COMPLIANCE_ENDPOINTS.REPORTS}/templates`,
        undefined,
        {
          next: {
            revalidate: 3600, // 1 hour for templates
            tags: ['compliance-report-templates']
          }
        }
      );
    } catch {
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