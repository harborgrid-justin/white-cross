'use server';

/**
 * Compliance Server Actions
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
  details?: Record<string, any>;
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  status?: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  errorMessage?: string;
  phiAccessed?: boolean;
  complianceFlags?: string[];
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// Audit Log Actions
// ============================================================================

/**
 * Create Audit Log Entry
 *
 * Creates a new audit log entry with cryptographic hash chain for tamper detection.
 * Implements blockchain-style linking where each log entry includes the hash of the
 * previous entry, ensuring immutability and detecting any modifications.
 *
 * @param context - User context (userId, userName, userRole, sessionId, ipAddress, userAgent)
 * @param input - Audit log entry data
 * @returns ActionResult with created audit log
 */
export async function createAuditLogAction(
  context: AuditLogContext,
  input: CreateAuditLogInput
): Promise<ActionResult<AuditLog>> {
  try {
    // Get the most recent audit log to chain hashes
    const previousLog = await getLatestAuditLog();
    const previousHash = previousLog?.verificationHash;

    // Create audit log entry with automatic hash generation
    const auditLogEntry = createAuditLogEntry(context, input, previousHash);

    // Call backend API to create audit log
    const response = await apiCall<AuditLog>('/compliance/audit-logs', {
      method: 'POST',
      body: JSON.stringify(auditLogEntry),
    });

    // Revalidate caches
    revalidateTag('audit-logs');
    revalidatePath('/compliance/audits', 'page');

    // Fire-and-forget secondary logging (never fails the operation)
    await logToSecondaryStore(auditLogEntry).catch(() => {});

    // Check for compliance violations
    await detectAndLogViolations(auditLogEntry).catch(() => {});

    return {
      success: true,
      data: response,
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
 * Get Audit Logs
 *
 * Retrieves audit logs with filtering, pagination, and hash chain verification.
 * Verifies the integrity of the audit chain and flags any tampering attempts.
 *
 * @param filters - Filter criteria (date range, actions, severity, userId, etc.)
 * @returns ActionResult with paginated audit logs and chain verification status
 */
export async function getAuditLogsAction(
  filters: Partial<AuditLogFilter>
): Promise<ActionResult<PaginatedResult<AuditLog> & { chainStatus: { valid: boolean; firstInvalidIndex?: number } }>> {
  try {
    // Call backend API to get audit logs with filters
    const response = await apiCall<PaginatedResult<AuditLog>>('/compliance/audit-logs', {
      params: filters,
    });

    // Verify audit chain integrity
    const chainStatus = verifyAuditChain(response.data);

    return {
      success: true,
      data: {
        ...response,
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
 * Export Audit Logs
 *
 * Exports audit logs in specified format with optional encryption.
 * Supports JSON, CSV, PDF, and XLSX formats with AES-256-GCM encryption.
 *
 * @param exportConfig - Export configuration (format, filters, encryption)
 * @returns ActionResult with export data and encryption status
 */
export async function exportAuditLogsAction(
  exportConfig: AuditLogExport
): Promise<ActionResult<{ data: string | Buffer; encrypted: boolean; filename: string }>> {
  try {
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

    // Log export action
    await createAuditLogAction(
      await getCurrentUserContext(),
      {
        action: 'PHI_EXPORT',
        severity: 'WARNING',
        resourceType: 'SYSTEM',
        details: {
          format: exportConfig.format,
          encrypted: exportData.encrypted,
          recordCount: logsResult.data.data.length,
        },
        phiAccessed: true,
        complianceFlags: ['DATA_EXPORT'],
      }
    ).catch(() => {});

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
 *
 * Verifies the cryptographic hash chain of audit logs to detect tampering.
 * Returns verification status and identifies the first invalid entry if any.
 *
 * @param startDate - Optional start date for verification
 * @param endDate - Optional end date for verification
 * @returns ActionResult with verification status
 */
export async function verifyAuditIntegrityAction(
  startDate?: string,
  endDate?: string
): Promise<ActionResult<{ valid: boolean; totalLogs: number; verifiedLogs: number; firstInvalidIndex?: number }>> {
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
    await createAuditLogAction(
      await getCurrentUserContext(),
      {
        action: 'SECURITY_ALERT',
        severity: valid ? 'INFO' : 'CRITICAL',
        resourceType: 'SYSTEM',
        details: {
          verificationResult: valid,
          logsVerified: logsResult.data.data.length,
          firstInvalidIndex,
        },
        complianceFlags: valid ? [] : ['INTEGRITY_VIOLATION', 'TAMPER_DETECTED'],
      }
    ).catch(() => {});

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
 *
 * Creates a new policy document with versioning and approval workflow.
 *
 * @param policyData - Policy document data
 * @returns ActionResult with created policy
 */
export async function createPolicyAction(
  policyData: Omit<PolicyDocument, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<PolicyDocument>> {
  try {
    // Call backend API to create policy document
    const response = await apiCall<PolicyDocument>('/compliance/policies', {
      method: 'POST',
      body: JSON.stringify(policyData),
    });

    revalidateTag('policies');
    revalidatePath('/compliance/policies', 'page');

    // Audit log
    await createAuditLogAction(
      await getCurrentUserContext(),
      {
        action: 'RECORD_CREATE',
        resourceType: 'POLICY',
        resourceId: response.id,
        resourceName: response.title,
        details: { category: response.category, version: response.version },
      }
    ).catch(() => {});

    return {
      success: true,
      data: response,
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
 *
 * Records a user's acknowledgment of a policy document.
 * Required before granting access to PHI for certain policies.
 *
 * @param policyId - Policy document ID
 * @param userId - User ID acknowledging the policy
 * @returns ActionResult with acknowledgment record
 */
export async function acknowledgePolicyAction(
  policyId: string,
  userId: string
): Promise<ActionResult<PolicyAcknowledgment>> {
  try {
    const context = await getCurrentUserContext();

    // Call backend API to acknowledge policy
    const response = await apiCall<PolicyAcknowledgment>(
      `/compliance/policies/${policyId}/acknowledge`,
      {
        method: 'POST',
        body: JSON.stringify({
          userId,
          acknowledgedAt: new Date().toISOString(),
          ipAddress: context.ipAddress,
        }),
      }
    );

    revalidateTag('policies');
    revalidateTag(`policy-${policyId}`);
    revalidatePath('/compliance/policies', 'page');

    // Audit log
    await createAuditLogAction(context, {
      action: 'POLICY_ACKNOWLEDGMENT',
      resourceType: 'POLICY',
      resourceId: policyId,
      details: { userId },
    }).catch(() => {});

    return {
      success: true,
      data: response,
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
 *
 * Retrieves acknowledgment history for a policy document.
 *
 * @param policyId - Policy document ID
 * @returns ActionResult with acknowledgment records
 */
export async function getPolicyAcknowledgmentsAction(
  policyId: string
): Promise<ActionResult<PolicyAcknowledgment[]>> {
  try {
    // Call backend API to get policy acknowledgments
    const response = await apiCall<PolicyAcknowledgment[]>(
      `/compliance/policies/${policyId}/acknowledgments`
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Get policy acknowledgments error:', error);
    return {
      success: false,
      error: 'Failed to retrieve policy acknowledgments',
    };
  }
}

// ============================================================================
// Compliance Reporting Actions
// ============================================================================

/**
 * Generate Compliance Report
 *
 * Auto-generates a comprehensive compliance report with metrics, findings, and recommendations.
 *
 * @param reportType - Type of report (HIPAA, FERPA, etc.)
 * @param period - Report period (start and end dates)
 * @returns ActionResult with generated report
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

    // Call backend API to generate compliance report
    const response = await apiCall<HIPAAReport>('/compliance/reports/generate', {
      method: 'POST',
      body: JSON.stringify({
        reportType,
        period,
        generatedBy: context.userId,
        metrics: metricsResult.data,
      }),
    });

    revalidateTag('compliance-reports');
    revalidatePath('/compliance/reports', 'page');

    // Audit log
    await createAuditLogAction(context, {
      action: 'RECORD_CREATE',
      resourceType: 'SYSTEM',
      details: {
        reportType,
        period,
      },
    }).catch(() => {});

    return {
      success: true,
      data: response,
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
 *
 * Calculates comprehensive compliance metrics for a given period.
 *
 * @param period - Optional period (start and end dates)
 * @returns ActionResult with compliance metrics
 */
export async function getComplianceMetricsAction(
  period?: { start: string; end: string }
): Promise<ActionResult<ComplianceMetrics>> {
  try {
    // Call backend API to get compliance metrics
    const response = await apiCall<ComplianceMetrics>('/compliance/metrics', {
      params: period,
    });

    return {
      success: true,
      data: response,
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
 *
 * Retrieves active compliance alerts and violations.
 *
 * @param filters - Optional filters (severity, status, etc.)
 * @returns ActionResult with compliance alerts
 */
export async function getComplianceAlertsAction(
  filters?: { severity?: string; status?: string }
): Promise<ActionResult<ComplianceAlert[]>> {
  try {
    // Call backend API to get compliance alerts
    const response = await apiCall<ComplianceAlert[]>('/compliance/alerts', {
      params: filters,
    });

    return {
      success: true,
      data: response,
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
 *
 * Resolves a compliance violation with remediation steps and resolution notes.
 *
 * @param violationId - Violation ID
 * @param resolution - Resolution details
 * @returns ActionResult with updated violation
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

    // Call backend API to resolve compliance violation
    const response = await apiCall<ComplianceViolation>(
      `/compliance/violations/${violationId}/resolve`,
      {
        method: 'POST',
        body: JSON.stringify({
          ...resolution,
          resolvedBy: context.userId,
          resolvedAt: new Date().toISOString(),
        }),
      }
    );

    revalidateTag('compliance-alerts');
    revalidateTag('compliance-violations');
    revalidatePath('/compliance', 'page');

    // Audit log
    await createAuditLogAction(context, {
      action: 'RECORD_UPDATE',
      resourceType: 'SYSTEM',
      resourceId: violationId,
      details: { action: 'resolve_violation' },
    }).catch(() => {});

    return {
      success: true,
      data: response,
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
 *
 * Records completion of a training course for a user.
 *
 * @param userId - User ID
 * @param courseId - Training course ID
 * @param completedAt - Completion timestamp
 * @returns ActionResult with training record
 */
export async function recordTrainingCompletionAction(
  userId: string,
  courseId: string,
  completedAt: string
): Promise<ActionResult<any>> {
  try {
    const context = await getCurrentUserContext();

    // Call backend API to record training completion
    const response = await apiCall('/compliance/training/complete', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        courseId,
        completedAt,
        verifiedBy: context.userId,
      }),
    });

    revalidateTag('training');
    revalidateTag(`user-training-${userId}`);
    revalidatePath('/compliance/training', 'page');

    // Audit log
    await createAuditLogAction(context, {
      action: 'RECORD_CREATE',
      resourceType: 'SYSTEM',
      details: {
        action: 'training_completion',
        userId,
        courseId,
      },
    }).catch(() => {});

    return {
      success: true,
      data: response,
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
 *
 * Retrieves training completion status for a user.
 *
 * @param userId - User ID
 * @returns ActionResult with training status
 */
export async function getUserTrainingStatusAction(
  userId: string
): Promise<ActionResult<any>> {
  try {
    // Call backend API to get user training status
    const response = await apiCall(`/compliance/training/user/${userId}`);

    return {
      success: true,
      data: response,
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
 *
 * Retrieves users with overdue training requirements.
 *
 * @returns ActionResult with overdue training list
 */
export async function getOverdueTrainingAction(): Promise<ActionResult<any[]>> {
  try {
    // Call backend API to get overdue training
    const response = await apiCall<any[]>('/compliance/training/overdue');

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Get overdue training error:', error);
    return {
      success: false,
      error: 'Failed to retrieve overdue training',
    };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create mock request from Next.js headers for audit utilities
 */
function createMockRequest(headersList: Headers): Request {
  return {
    headers: {
      get: (name: string) => headersList.get(name)
    }
  } as Request;
}

/**
 * Get current user context from session
 * Extracts user information from JWT token in cookies
 */
async function getCurrentUserContext(): Promise<AuditLogContext> {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      // Return anonymous context if no token
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

    // Verify and decode JWT token
    const payload = verifyAccessToken(token);
    const mockRequest = createMockRequest(headersList);

    return {
      userId: payload.id,
      userName: payload.email, // Use email as name (can be enhanced with actual name from DB)
      userRole: payload.role,
      sessionId: payload.jti || crypto.randomUUID(),
      ipAddress: extractIPAddress(mockRequest) || '0.0.0.0',
      userAgent: extractUserAgent(mockRequest) || 'Unknown',
    };
  } catch (error) {
    console.error('Failed to get user context:', error);
    // Return anonymous context on error
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
 * API call with retry logic and exponential backoff
 * Implements resilient HTTP client pattern for critical operations
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { params?: Record<string, any> } = {},
  retryCount = 0
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query parameters
  let url = `${BACKEND_URL}${endpoint}`;
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Add authentication token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));

      // Retry on retryable status codes
      if (
        RETRYABLE_STATUS_CODES.includes(response.status) &&
        retryCount < MAX_RETRIES
      ) {
        const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return apiCall<T>(endpoint, options, retryCount + 1);
      }

      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    // Parse response
    const data = await response.json();

    // Handle wrapped API responses
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as T;
    }

    return data as T;
  } catch (error) {
    // Retry on network errors
    if (retryCount < MAX_RETRIES && error instanceof TypeError) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiCall<T>(endpoint, options, retryCount + 1);
    }

    throw error;
  }
}

/**
 * Get latest audit log for hash chaining
 */
async function getLatestAuditLog(): Promise<AuditLog | null> {
  try {
    const response = await apiCall<AuditLog>('/compliance/audit-logs/latest');
    return response;
  } catch (error) {
    console.error('Failed to get latest audit log:', error);
    return null;
  }
}

/**
 * Log to secondary store for redundancy (S3, CloudWatch)
 * Fire-and-forget operation that never blocks main flow
 *
 * Implements HIPAA requirement for redundant audit log storage
 */
async function logToSecondaryStore(auditLog: Partial<AuditLog>): Promise<void> {
  if (!SECONDARY_LOG_ENABLED) {
    return;
  }

  try {
    // Structure for CloudWatch Logs
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

    // Structure for S3 storage
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

    // Send to secondary logging service (non-blocking)
    // In production, this would call AWS SDK or logging service
    if (process.env.NODE_ENV === 'development') {
      console.log('[Secondary Log - CloudWatch]:', cloudWatchLog);
      console.log('[Secondary Log - S3]:', s3Log);
    } else {
      // Production: Send to actual AWS services
      // This is a placeholder for AWS SDK integration
      await Promise.all([
        // AWS CloudWatch Logs SDK call would go here
        // cloudWatchLogs.putLogEvents(cloudWatchLog),

        // AWS S3 SDK call would go here
        // s3.putObject(s3Log),

        // For now, log to console
        Promise.resolve(console.log('Secondary log queued:', auditLog.id)),
      ]).catch((err) => {
        // Never throw - secondary logging failures are non-critical
        console.warn('Secondary logging failed (non-critical):', err);
      });
    }
  } catch (error) {
    // Never throw - secondary logging is fire-and-forget
    console.warn('Secondary logging error (non-critical):', error);
  }
}

/**
 * Detect and log compliance violations
 * Creates violation records for critical compliance flags
 */
async function detectAndLogViolations(auditLog: Partial<AuditLog>): Promise<void> {
  const flags = auditLog.complianceFlags || [];

  // Check for critical compliance flags
  const criticalFlags = ['BULK_OPERATION', 'AFTER_HOURS_ACCESS', 'EMERGENCY_ACCESS_USED'];
  const hasCriticalFlag = flags.some((flag) => criticalFlags.includes(flag));

  if (hasCriticalFlag) {
    try {
      // Create compliance violation record
      await apiCall('/compliance/violations', {
        method: 'POST',
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
      // Log but don't throw - violation creation is non-critical
      console.error('Failed to create violation record:', error);
    }
  }
}
