/**
 * @fileoverview Compliance Audit Actions - Next.js v16 App Router
 *
 * Server actions for audit log management including creation,
 * retrieval, export, and integrity verification.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import type {
  AuditLog,
  AuditLogFilter,
  AuditLogExport,
} from '@/schemas/compliance/compliance.schemas';
import { createAuditLogEntry, exportAuditLogs, verifyAuditChain } from '@/lib/compliance/audit';

import type {
  ActionResult,
  AuditLogContext,
  CreateAuditLogInput,
  PaginatedResult
} from './compliance.types';
import {
  BACKEND_URL,
  getAuthToken,
  getLatestAuditLog,
  logHIPAAAuditEntry,
  logToSecondaryStore,
  detectAndLogViolations,
  getCurrentUserId,
} from './compliance.cache';

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

    const result = await response.json();

            // Verify audit chain integrity
    const chainResult = verifyAuditChain(result.data);
    const chainStatus = typeof chainResult === 'object' ? chainResult : { valid: chainResult, firstInvalidIndex: undefined };

    // Log PHI access if accessing audit logs containing PHI
    const containsPHI = result.data.some((log: AuditLog) => log.phiAccessed);
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