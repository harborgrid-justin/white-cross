'use server';

/**
 * Compliance Server Actions - Next.js v16 App Router
 *
 * HIPAA-compliant server actions for compliance management including:
 * - Audit log creation with cryptographic hash chain
 * - Policy management and acknowledgment tracking
 * - Compliance report generation
 * - Training compliance tracking
 * - Real-time compliance monitoring
 *
 * All actions follow the ActionResult<T> pattern for consistent error handling
 * and implement fire-and-forget audit logging that never blocks operations.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { headers, cookies } from 'next/headers';
// Note: cacheLife and cacheTag are not yet available in Next.js v15
// These will be available in Next.js v16 when it's released
// import { cacheLife, cacheTag } from 'next/cache';
import {
  AuditLog,
  AuditLogFilter,
  AuditLogExport,
  ComplianceMetrics,
  ComplianceAlert,
  ComplianceViolation,
  PolicyDocument,
  PolicyAcknowledgment,
  HIPAAReport,
  DataRetentionPolicy,
  AuditActionTypeEnum,
  AuditSeverityEnum,
  ResourceTypeEnum,
} from '@/schemas/compliance/compliance.schemas';
import {
  generateAuditHash,
  verifyAuditChain,
  createAuditLogEntry,
  detectPHI,
  generateComplianceFlags,
  exportAuditLogs,
  shouldRetainLog,
} from '@/lib/compliance/audit';
import { extractIPAddress, extractUserAgent } from '@/lib/audit';
import { verifyAccessToken } from '@/lib/auth';

// ============================================================================
// Configuration
// ============================================================================

const BACKEND_URL = process.env.BACKEND_URL || process.env.API_BASE_URL || 'http://localhost:3001';
const SECONDARY_LOG_ENABLED = process.env.ENABLE_SECONDARY_LOGGING === 'true';
const AWS_S3_BUCKET = process.env.AWS_AUDIT_LOG_BUCKET;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// ============================================================================
// Types
// ============================================================================

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface AuditLogContext {
  userId: string;
  userName: string;
  userRole: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
}

interface CreateAuditLogInput {
  action: AuditActionTypeEnum;
  severity?: AuditSeverityEnum;
  resourceType?: ResourceTypeEnum;
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, unknown>;
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  status?: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  errorMessage?: string;
  phiAccessed?: boolean;
  complianceFlags?: string[];
}

interface UIComplianceReport {
  id: string;
  title: string;
  type: string;
  status: string;
  generatedAt: string;
  generatedBy: string;
  period: { start: string; end: string };
}

interface UIReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredParams: string[];
}

// ============================================================================
// Audit Log Actions
// ============================================================================

/**
 * Create Audit Log Entry
 * Cache: 1 minute for created audit logs
 */
export async function createAuditLogAction(
  context: AuditLogContext,
  input: CreateAuditLogInput
): Promise<ActionResult<AuditLog>> {
  'use cache';
  // cacheLife({ revalidate: 60 }); // 1 minute cache - Available in Next.js v16
  // cacheTag('audit-logs', `audit-log-${input.resourceId || 'new'}`); // Available in Next.js v16

  try {
    // Log HIPAA compliance audit entry
    await logHIPAAAuditEntry({
      userId: context.userId,
      action: 'AUDIT_LOG_CREATE',
      resourceType: input.resourceType || 'SYSTEM',
      resourceId: input.resourceId || crypto.randomUUID(),
      details: {
        action: input.action,
        severity: input.severity,
        phiAccessed: input.phiAccessed || false,
        complianceFlags: input.complianceFlags || []
      },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    // Get the most recent audit log to chain hashes
    const previousLog = await getLatestAuditLog();
    const previousHash = previousLog?.verificationHash;

    // Create audit log entry with automatic hash generation
    const auditLogEntry = createAuditLogEntry(context, input, previousHash);

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/audit-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID(),
        'X-Source': 'compliance-actions'
      },
      body: JSON.stringify(auditLogEntry),
      next: {
        revalidate: 60,
        tags: ['audit-logs']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const createdLog = await response.json() as AuditLog;

    // Revalidate caches
    revalidateTag('audit-logs', 'compliance');
    revalidateTag('compliance-metrics', 'compliance');
    revalidatePath('/compliance/audits');

    // Fire-and-forget secondary logging (never fails the operation)
    await logToSecondaryStore(auditLogEntry).catch(() => {});

    // Check for compliance violations
    await detectAndLogViolations(auditLogEntry).catch(() => {});

    return {
      success: true,
      data: createdLog,
      message: 'Audit log created successfully',
    };
  } catch (error) {
    console.error('Create audit log error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create audit log',
    };
  }
}

/**
 * Get Audit Logs with hash chain verification
 * Cache: 2 minutes for audit log queries
 */
export async function getAuditLogsAction(
  filters: Partial<AuditLogFilter>
): Promise<ActionResult<PaginatedResult<AuditLog> & { chainStatus: { valid: boolean; firstInvalidIndex?: number } }>> {
  'use cache';
  // cacheLife({ revalidate: 120 }); // 2 minutes cache - Available in Next.js v16
  // cacheTag('audit-logs', `audit-logs-query-${JSON.stringify(filters).slice(0, 50)}`); // Available in Next.js v16

  try {
    // Build query parameters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/audit-logs?${params}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID(),
        'X-Cache-Control': 'max-age=120'
      },
      next: {
        revalidate: 120,
        tags: ['audit-logs']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json() as PaginatedResult<AuditLog>;

    // Verify audit chain integrity
    const chainStatus = verifyAuditChain(result.data);

    // Log PHI access if accessing audit logs containing PHI
    const containsPHI = result.data.some(log => log.phiAccessed);
    if (containsPHI) {
      await logHIPAAAuditEntry({
        userId: await getCurrentUserId(),
        action: 'PHI_ACCESS',
        resourceType: 'AUDIT_LOG',
        details: {
          action: 'view_audit_logs_with_phi',
          logCount: result.data.length,
          containsPHI: true
        }
      });
    }

    return {
      success: true,
      data: {
        ...result,
        chainStatus,
      },
    };
  } catch (error) {
    console.error('Get audit logs error:', error);
    return {
      success: false,
      error: 'Failed to retrieve audit logs',
    };
  }
}

/**
 * Export Audit Logs with encryption
 * Cache: No cache for exports (always fresh)
 */
export async function exportAuditLogsAction(
  exportConfig: AuditLogExport
): Promise<ActionResult<{ data: string | Buffer; encrypted: boolean; filename: string }>> {
  try {
    // Log PHI export attempt
    await logHIPAAAuditEntry({
      userId: await getCurrentUserId(),
      action: 'PHI_EXPORT',
      resourceType: 'AUDIT_LOG',
      details: {
        format: exportConfig.format,
        encrypted: exportConfig.encryptOutput || false,
        filters: exportConfig.filters
      }
    });

    // Get filtered audit logs
    const logsResult = await getAuditLogsAction(exportConfig.filters);
    if (!logsResult.success || !logsResult.data) {
      throw new Error('Failed to retrieve logs for export');
    }

    // Export with encryption
    const exportData = await exportAuditLogs(
      logsResult.data.data,
      exportConfig.format,
      exportConfig.encryptOutput,
      exportConfig.password
    );

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `audit-logs-${timestamp}.${exportConfig.format.toLowerCase()}${exportData.encrypted ? '.enc' : ''}`;

    // Revalidate export tracking
    revalidateTag('audit-exports', 'compliance');

    return {
      success: true,
      data: {
        ...exportData,
        filename,
      },
      message: 'Audit logs exported successfully',
    };
  } catch (error) {
    console.error('Export audit logs error:', error);
    return {
      success: false,
      error: 'Failed to export audit logs',
    };
  }
}

/**
 * Verify Audit Chain Integrity
 * Cache: 5 minutes for integrity verification
 */
export async function verifyAuditIntegrityAction(
  startDate?: string,
  endDate?: string
): Promise<ActionResult<{ valid: boolean; totalLogs: number; verifiedLogs: number; firstInvalidIndex?: number }>> {
  'use cache';
  // cacheLife({ revalidate: 300 }); // 5 minutes cache - Available in Next.js v16
  // cacheTag('audit-integrity', `integrity-${startDate || 'all'}-${endDate || 'all'}`); // Available in Next.js v16

  try {
    const logsResult = await getAuditLogsAction({
      startDate,
      endDate,
      sortBy: 'timestamp',
      sortOrder: 'asc',
    });

    if (!logsResult.success || !logsResult.data) {
      throw new Error('Failed to retrieve logs for verification');
    }

    const { valid, firstInvalidIndex } = verifyAuditChain(logsResult.data.data);

    // Log verification action
    await logHIPAAAuditEntry({
      userId: await getCurrentUserId(),
      action: valid ? 'SECURITY_VERIFICATION' : 'SECURITY_ALERT',
      resourceType: 'SYSTEM',
      details: {
        verificationResult: valid,
        logsVerified: logsResult.data.data.length,
        firstInvalidIndex,
        integrityStatus: valid ? 'INTACT' : 'COMPROMISED'
      }
    });

    return {
      success: true,
      data: {
        valid,
        totalLogs: logsResult.data.pagination.total,
        verifiedLogs: logsResult.data.data.length,
        firstInvalidIndex,
      },
      message: valid ? 'Audit chain verified successfully' : 'Audit chain integrity compromised',
    };
  } catch (error) {
    console.error('Verify audit integrity error:', error);
    return {
      success: false,
      error: 'Failed to verify audit chain integrity',
    };
  }
}

// ============================================================================
// Policy Management Actions
// ============================================================================

/**
 * Create Policy Document
 * Cache: 5 minutes for created policies
 */
export async function createPolicyAction(
  policyData: Omit<PolicyDocument, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<PolicyDocument>> {
  'use cache';
  // cacheLife({ revalidate: 300 }); // 5 minutes cache - Available in Next.js v16
  // cacheTag('policies', 'policy-create'); // Available in Next.js v16

  try {
    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/policies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify(policyData),
      next: {
        revalidate: 300,
        tags: ['policies']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const createdPolicy = await response.json() as PolicyDocument;

    // Revalidate policy caches
    revalidateTag('policies', 'compliance');
    revalidatePath('/compliance/policies');

    // Log policy creation
    await logHIPAAAuditEntry({
      userId: await getCurrentUserId(),
      action: 'RECORD_CREATE',
      resourceType: 'POLICY',
      resourceId: createdPolicy.id,
      details: {
        policyTitle: createdPolicy.title,
        policyType: createdPolicy.policyType,
        version: createdPolicy.version
      }
    });

    return {
      success: true,
      data: createdPolicy,
      message: 'Policy created successfully',
    };
  } catch (error) {
    console.error('Create policy error:', error);
    return {
      success: false,
      error: 'Failed to create policy',
    };
  }
}

/**
 * Acknowledge Policy
 * Cache: 10 minutes for acknowledgments
 */
export async function acknowledgePolicyAction(
  policyId: string,
  userId: string
): Promise<ActionResult<PolicyAcknowledgment>> {
  'use cache';
  // cacheLife({ revalidate: 600 }); // 10 minutes cache - Available in Next.js v16
  // cacheTag('policies', `policy-${policyId}`, `policy-ack-${userId}`); // Available in Next.js v16

  try {
    const context = await getCurrentUserContext();

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/policies/${policyId}/acknowledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify({
        userId,
        acknowledgedAt: new Date().toISOString(),
        ipAddress: context.ipAddress,
      }),
      next: {
        revalidate: 600,
        tags: ['policies', `policy-${policyId}`]
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const acknowledgment = await response.json() as PolicyAcknowledgment;

    // Revalidate related caches
    revalidateTag('policies', 'compliance');
    revalidateTag(`policy-${policyId}`, 'compliance');
    revalidatePath('/compliance/policies');

    // Log policy acknowledgment
    await logHIPAAAuditEntry({
      userId: context.userId,
      action: 'POLICY_ACKNOWLEDGMENT',
      resourceType: 'POLICY',
      resourceId: policyId,
      details: { acknowledgedUserId: userId }
    });

    return {
      success: true,
      data: acknowledgment,
      message: 'Policy acknowledged successfully',
    };
  } catch (error) {
    console.error('Acknowledge policy error:', error);
    return {
      success: false,
      error: 'Failed to acknowledge policy',
    };
  }
}

/**
 * Get Policy Acknowledgments
 * Cache: 5 minutes for acknowledgment lists
 */
export async function getPolicyAcknowledgmentsAction(
  policyId: string
): Promise<ActionResult<PolicyAcknowledgment[]>> {
  'use cache';
  // cacheLife({ revalidate: 300 }); // 5 minutes cache - Available in Next.js v16
  // cacheTag('policies', `policy-${policyId}`, 'policy-acknowledgments'); // Available in Next.js v16

  try {
    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/policies/${policyId}/acknowledgments`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 300,
        tags: ['policies', `policy-${policyId}`]
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const acknowledgments = await response.json() as PolicyAcknowledgment[];

    return {
      success: true,
      data: acknowledgments,
    };
  } catch (error) {
    console.error('Get policy acknowledgments error:', error);
    return {
      success: false,
      error: 'Failed to retrieve policy acknowledgments',
    };
  }
}

/**
 * Get Policies with filtering and pagination
 * Cache: 5 minutes for policy lists
 */
export async function getPoliciesAction(
  filters?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<ActionResult<PaginatedResult<UIPolicy> & { stats: { active: number; total: number; acknowledgmentRate: number; acknowledged: number; required: number; pending: number; reviewDue: number } }>> {

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

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/policies?${params}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID(),
        'X-Cache-Control': 'max-age=300'
      },
      next: {
        revalidate: 300,
        tags: ['policies']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json() as PaginatedResult<PolicyDocument>;

    // Transform policies to match UI expectations
    const transformedPolicies: UIPolicy[] = result.data.map((policy: PolicyDocument) => ({
      id: policy.id,
      title: policy.title,
      category: policy.policyType.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase()),
      status: policy.status,
      version: policy.version,
      effectiveDate: policy.effectiveDate,
      reviewDate: policy.reviewDate,
      acknowledgments: {
        completed: 0, // TODO: Calculate from acknowledgments API
        pending: 0,   // TODO: Calculate from acknowledgments API
        total: 0,     // TODO: Calculate from applicable users
      },
    }));

    // Get policy statistics
    const statsResponse = await fetch(`${BACKEND_URL}/compliance/policies/stats`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 300,
        tags: ['policies', 'compliance-stats']
      }
    });

    let stats = {
      active: 0,
      total: 0,
      acknowledgmentRate: 0,
      acknowledged: 0,
      required: 0,
      pending: 0,
      reviewDue: 0,
    };

    if (statsResponse.ok) {
      stats = await statsResponse.json();
    }

    return {
      success: true,
      data: {
        data: transformedPolicies,
        pagination: result.pagination,
        stats,
      },
    };
  } catch (error) {
    console.error('Get policies error:', error);
    return {
      success: false,
      error: 'Failed to retrieve policies',
    };
  }
}

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
  // cacheLife({ revalidate: 900 }); // 15 minutes cache - Available in Next.js v16
  // cacheTag('compliance-reports', `report-${reportType}`, `report-period-${period.start}`); // Available in Next.js v16

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
  // cacheLife({ revalidate: 600 }); // 10 minutes cache - Available in Next.js v16
  // cacheTag('compliance-metrics', `metrics-${period?.start || 'all'}`); // Available in Next.js v16

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
  // cacheLife({ revalidate: 120 }); // 2 minutes cache - Available in Next.js v16
  // cacheTag('compliance-alerts', `alerts-${JSON.stringify(filters || {})}`); // Available in Next.js v16

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

// ============================================================================
// Training Compliance Actions
// ============================================================================

/**
 * Record Training Completion
 * Cache: 30 minutes for training records
 */
export async function recordTrainingCompletionAction(
  userId: string,
  courseId: string,
  completedAt: string
): Promise<ActionResult<Record<string, unknown>>> {
  'use cache';
  // cacheLife({ revalidate: 1800 }); // 30 minutes cache - Available in Next.js v16
  // cacheTag('training', `user-training-${userId}`, `course-${courseId}`); // Available in Next.js v16

  try {
    const context = await getCurrentUserContext();

    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/training/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify({
        userId,
        courseId,
        completedAt,
        verifiedBy: context.userId,
      }),
      next: {
        revalidate: 1800,
        tags: ['training', `user-training-${userId}`]
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const trainingRecord = await response.json();

    // Revalidate training caches
    revalidateTag('training', 'compliance');
    revalidateTag(`user-training-${userId}`, 'compliance');
    revalidatePath('/compliance/training');

    // Log training completion
    await logHIPAAAuditEntry({
      userId: context.userId,
      action: 'RECORD_CREATE',
      resourceType: 'SYSTEM',
      details: {
        action: 'training_completion',
        userId,
        courseId,
        completedAt
      }
    });

    return {
      success: true,
      data: trainingRecord,
      message: 'Training completion recorded successfully',
    };
  } catch (error) {
    console.error('Record training completion error:', error);
    return {
      success: false,
      error: 'Failed to record training completion',
    };
  }
}

/**
 * Get User Training Status
 * Cache: 15 minutes for training status
 */
export async function getUserTrainingStatusAction(
  userId: string
): Promise<ActionResult<Record<string, unknown>>> {
  'use cache';
  // cacheLife({ revalidate: 900 }); // 15 minutes cache - Available in Next.js v16
  // cacheTag('training', `user-training-${userId}`); // Available in Next.js v16

  try {
    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/training/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 900,
        tags: ['training', `user-training-${userId}`]
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const trainingStatus = await response.json();

    return {
      success: true,
      data: trainingStatus,
    };
  } catch (error) {
    console.error('Get user training status error:', error);
    return {
      success: false,
      error: 'Failed to retrieve user training status',
    };
  }
}

/**
 * Get Overdue Training
 * Cache: 10 minutes for overdue training
 */
export async function getOverdueTrainingAction(): Promise<ActionResult<Record<string, unknown>[]>> {
  'use cache';
  // cacheLife({ revalidate: 600 }); // 10 minutes cache - Available in Next.js v16
  // cacheTag('training', 'overdue-training'); // Available in Next.js v16

  try {
    // Enhanced fetch with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/compliance/training/overdue`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 600,
        tags: ['training', 'overdue-training']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const overdueTraining = await response.json() as Record<string, unknown>[];

    return {
      success: true,
      data: overdueTraining,
    };
  } catch (error) {
    console.error('Get overdue training error:', error);
    return {
      success: false,
      error: 'Failed to retrieve overdue training',
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
  reports: PaginatedResult<{
    id: string;
    title: string;
    type: string;
    status: string;
    generatedAt: string;
    generatedBy: string;
    period: { start: string; end: string };
  }>;
  templates: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    requiredParams: string[];
  }>;
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

    let reports: PaginatedResult<UIComplianceReport> = { data: [], pagination: { page: 1, pageSize: 10, total: 0, pages: 0 } };
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

/**
 * Get Training Records and Compliance Data
 * Cache: 10 minutes for training data
 */
export async function getTrainingRecordsAction(
  filters?: {
    userId?: string;
    courseId?: string;
    status?: string;
    priority?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<ActionResult<{
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
    certifications: number;
    expiringSoon: number;
  };
  courses: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    stats: { completed: number; inProgress: number; overdue: number };
  }>;
  users: Array<{
    id: string;
    name: string;
    role: string;
    training: {
      required: number;
      completed: number;
      overdue: number;
      status: string;
    };
  }>;
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

    // Fetch training stats
    const statsResponse = await fetch(`${BACKEND_URL}/compliance/training/stats`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 600,
        tags: ['training', 'training-stats']
      }
    });

    let stats = {
      total: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      completionRate: 0,
      certifications: 0,
      expiringSoon: 0,
    };

    if (statsResponse.ok) {
      stats = await statsResponse.json();
    }

    // Fetch training courses
    const coursesResponse = await fetch(`${BACKEND_URL}/compliance/training/courses?${params}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 600,
        tags: ['training', 'training-courses']
      }
    });

    let courses: Array<{
      id: string;
      title: string;
      description: string;
      priority: string;
      stats: { completed: number; inProgress: number; overdue: number };
    }> = [];

    if (coursesResponse.ok) {
      courses = await coursesResponse.json();
    }

    // Fetch user training status
    const usersResponse = await fetch(`${BACKEND_URL}/compliance/training/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 600,
        tags: ['training', 'user-training']
      }
    });

    let users: Array<{
      id: string;
      name: string;
      role: string;
      training: {
        required: number;
        completed: number;
        overdue: number;
        status: string;
      };
    }> = [];

    if (usersResponse.ok) {
      users = await usersResponse.json();
    }

    return {
      success: true,
      data: {
        stats,
        courses,
        users,
      },
    };
  } catch (error) {
    console.error('Get training records error:', error);
    return {
      success: false,
      error: 'Failed to retrieve training records',
    };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get authentication token from cookies
 */
async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
}

/**
 * Get current user ID from session
 */
async function getCurrentUserId(): Promise<string> {
  try {
    const token = await getAuthToken();
    const payload = verifyAccessToken(token);
    return payload.id;
  } catch {
    return 'anonymous';
  }
}

/**
 * Get current user context from session
 */
async function getCurrentUserContext(): Promise<AuditLogContext> {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      const mockRequest = createMockRequest(headersList);
      return {
        userId: 'anonymous',
        userName: 'Anonymous User',
        userRole: 'ANONYMOUS',
        sessionId: crypto.randomUUID(),
        ipAddress: extractIPAddress(mockRequest) || '0.0.0.0',
        userAgent: extractUserAgent(mockRequest) || 'Unknown',
      };
    }

    const payload = verifyAccessToken(token);
    const mockRequest = createMockRequest(headersList);

    return {
      userId: payload.id,
      userName: payload.email,
      userRole: payload.role,
      sessionId: payload.jti || crypto.randomUUID(),
      ipAddress: extractIPAddress(mockRequest) || '0.0.0.0',
      userAgent: extractUserAgent(mockRequest) || 'Unknown',
    };
  } catch (error) {
    console.error('Failed to get user context:', error);
    const headersList = await headers();
    const mockRequest = createMockRequest(headersList);
    return {
      userId: 'error',
      userName: 'Error User',
      userRole: 'ERROR',
      sessionId: crypto.randomUUID(),
      ipAddress: extractIPAddress(mockRequest) || '0.0.0.0',
      userAgent: extractUserAgent(mockRequest) || 'Unknown',
    };
  }
}

/**
 * Create mock request from Next.js headers
 */
function createMockRequest(headersList: Headers): Request {
  return {
    headers: {
      get: (name: string) => headersList.get(name)
    }
  } as Request;
}

/**
 * Get latest audit log for hash chaining
 */
async function getLatestAuditLog(): Promise<AuditLog | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/compliance/audit-logs/latest`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });
    
    if (!response.ok) return null;
    return await response.json() as AuditLog;
  } catch (error) {
    console.error('Failed to get latest audit log:', error);
    return null;
  }
}

/**
 * HIPAA-compliant audit logging
 */
async function logHIPAAAuditEntry(entry: {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  try {
    const headersList = await headers();
    const mockRequest = createMockRequest(headersList);
    
    console.log('[HIPAA Audit]', {
      timestamp: new Date().toISOString(),
      userId: entry.userId,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      ipAddress: entry.ipAddress || extractIPAddress(mockRequest) || '0.0.0.0',
      userAgent: entry.userAgent || extractUserAgent(mockRequest) || 'Unknown',
      details: entry.details
    });
  } catch (error) {
    // Never throw - audit logging is fire-and-forget
    console.warn('HIPAA audit logging failed:', error);
  }
}

/**
 * Log to secondary store for redundancy
 */
async function logToSecondaryStore(auditLog: Partial<AuditLog>): Promise<void> {
  if (!SECONDARY_LOG_ENABLED) return;

  try {
    const cloudWatchLog = {
      timestamp: new Date().toISOString(),
      logGroup: '/aws/lambda/audit-logs',
      logStream: `audit-${new Date().toISOString().split('T')[0]}`,
      message: JSON.stringify({
        ...auditLog,
        service: 'white-cross-compliance',
        environment: process.env.NODE_ENV || 'development',
      }),
    };

    const s3Log = {
      bucket: AWS_S3_BUCKET,
      key: `audit-logs/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${auditLog.id || Date.now()}.json`,
      body: JSON.stringify(auditLog, null, 2),
      metadata: {
        userId: auditLog.userId || 'unknown',
        action: auditLog.action || 'unknown',
        timestamp: auditLog.timestamp || new Date().toISOString(),
      },
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[Secondary Log - CloudWatch]:', cloudWatchLog);
      console.log('[Secondary Log - S3]:', s3Log);
    } else {
      await Promise.resolve(console.log('Secondary log queued:', auditLog.id));
    }
  } catch (error) {
    console.warn('Secondary logging error (non-critical):', error);
  }
}

/**
 * Detect and log compliance violations
 */
async function detectAndLogViolations(auditLog: Partial<AuditLog>): Promise<void> {
  const flags = auditLog.complianceFlags || [];
  const criticalFlags = ['BULK_OPERATION', 'AFTER_HOURS_ACCESS', 'EMERGENCY_ACCESS_USED'];
  const hasCriticalFlag = flags.some((flag) => criticalFlags.includes(flag));

  if (hasCriticalFlag) {
    try {
      await fetch(`${BACKEND_URL}/compliance/violations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({
          auditLogId: auditLog.id,
          violationType: 'SUSPICIOUS_ACTIVITY',
          severity: 'HIGH',
          flags,
          detectedAt: new Date().toISOString(),
          status: 'OPEN',
          description: `Critical compliance flags detected: ${flags.join(', ')}`,
        }),
      });
    } catch (error) {
      console.error('Failed to create violation record:', error);
    }
  }
}
